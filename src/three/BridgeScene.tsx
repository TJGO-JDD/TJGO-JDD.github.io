import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { contourSegments, fbm } from '../lib/contours';
import { continuousMoment } from './momentFn';

/**
 * Puente continuo de 3 tramos (cercha Warren) sobre un modelo digital de terreno.
 * Escala: 1 u = 8 m → tramos de 5 u = 40 m.
 * El diagrama de momentos corresponde a una viga continua de 3 tramos iguales
 * con carga uniforme w:  M_B = M_C = −wL²/10,  M⁺(tramo 1) = 0.08 wL²,  M⁺(tramo 2) = 0.025 wL².
 */
const SPAN = 5;
const X0 = -1.5 * SPAN; // estribo izquierdo
const DECK_Y = 0.6;
const M_BASE = DECK_Y - 0.62; // línea base del diagrama
const MK = 3.5; // escala visual del diagrama de momentos
const TRUSS_H = 1.0;
const HALF_W = 0.85;
const PANELS_PER_SPAN = 4;
const ACCENT = new THREE.Color('#00E6A0');
const ACCENT_HI = new THREE.Color('#3FFFC1');

function terrainHeight(x: number, z: number) {
  const ax = Math.abs(x);
  const bank = THREE.MathUtils.smoothstep(ax, 3.2, 8.2);
  const river = Math.exp(-((x - 0.6 + 0.35 * Math.sin(z * 0.5)) ** 2) / 1.6);
  const n = fbm(x * 0.16 + 3, z * 0.16 + 7, 4) - 0.5;
  return -2.4 + 2.75 * bank - 0.35 * river + n * 1.1 + 0.18 * Math.sin(z * 0.35);
}

function useTerrain() {
  return useMemo(() => {
    const nx = 96, nz = 60, W = 40, D = 26;
    const h = new Float32Array(nx * nz);
    const toX = (i: number) => -W / 2 + (i / (nx - 1)) * W;
    const toZ = (j: number) => -D / 2 + (j / (nz - 1)) * D;
    for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) h[j * nx + i] = terrainHeight(toX(i), toZ(j));

    // Curvas de nivel cada 0.25 u (≈ 2 m), maestras cada 1 u
    const minor: number[] = [], major: number[] = [];
    for (let lv = -3; lv <= 1.5; lv += 0.25) {
      const isMajor = Math.abs(lv - Math.round(lv)) < 1e-6;
      for (const [x1, z1, x2, z2] of contourSegments(h, nx, nz, lv)) {
        const target = isMajor ? major : minor;
        target.push(toX(x1), lv + 0.005, toZ(z1), toX(x2), lv + 0.005, toZ(z2));
      }
    }
    // Malla (wireframe) del MDT, cada 3 nodos
    const grid: number[] = [];
    for (let j = 0; j < nz; j += 3) for (let i = 0; i < nx - 1; i++)
      grid.push(toX(i), h[j * nx + i], toZ(j), toX(i + 1), h[j * nx + i + 1], toZ(j));
    for (let i = 0; i < nx; i += 3) for (let j = 0; j < nz - 1; j++)
      grid.push(toX(i), h[j * nx + i], toZ(j), toX(i), h[(j + 1) * nx + i], toZ(j + 1));

    // Superficie sólida oscura (oculta las líneas traseras)
    const surf = new THREE.PlaneGeometry(W, D, nx - 1, nz - 1);
    surf.rotateX(-Math.PI / 2);
    const pos = surf.attributes.position as THREE.BufferAttribute;
    for (let k = 0; k < pos.count; k++) {
      const i = k % nx, j = Math.floor(k / nx);
      pos.setY(k, h[j * nx + i] - 0.02);
    }
    surf.computeVertexNormals();

    const toGeo = (arr: number[]) => {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3));
      return g;
    };
    return { minor: toGeo(minor), major: toGeo(major), grid: toGeo(grid), surf };
  }, []);
}

function useBridge() {
  return useMemo(() => {
    const truss: number[] = [];
    const nodes: number[] = [];
    const bracing: number[] = [];
    const nPanels = PANELS_PER_SPAN * 3;
    const dx = (3 * SPAN) / nPanels;
    for (const z of [-HALF_W, HALF_W]) {
      for (let p = 0; p < nPanels; p++) {
        const xa = X0 + p * dx, xb = xa + dx, xm = xa + dx / 2;
        const yb = DECK_Y, yt = DECK_Y + TRUSS_H;
        truss.push(xa, yb, z, xb, yb, z); // cordón inferior
        truss.push(xa, yb, z, xm, yt, z, xm, yt, z, xb, yb, z); // diagonales Warren
        if (p < nPanels - 1) truss.push(xm, yt, z, xm + dx, yt, z); // cordón superior
        nodes.push(xa, yb, z, xm, yt, z);
        if (p === nPanels - 1) nodes.push(xb, yb, z);
      }
    }
    for (let p = 0; p < nPanels; p++) {
      const xm = X0 + p * dx + dx / 2, yt = DECK_Y + TRUSS_H;
      bracing.push(xm, yt, -HALF_W, xm, yt, HALF_W);
      if (p < nPanels - 1) bracing.push(xm, yt, -HALF_W, xm + dx, yt, HALF_W);
    }
    // Diagrama de momentos (bajo el tablero, positivo hacia abajo)
    const moment: number[] = [];
    const fill: number[] = [X0, M_BASE, 0, X0 + 3 * SPAN, M_BASE, 0];
    const N = 180;
    for (let k = 0; k < N; k++) {
      const x1 = (k / N) * 3, x2 = ((k + 1) / N) * 3;
      const m1 = continuousMoment(x1), m2 = continuousMoment(x2);
      const X1 = X0 + x1 * SPAN, X2 = X0 + x2 * SPAN;
      const y1 = M_BASE - m1 * MK, y2 = M_BASE - m2 * MK;
      moment.push(X1, y1, 0, X2, y2, 0);
      if (k % 3 === 0) fill.push(X1, M_BASE, 0, X1, y1, 0);
    }
    const toGeo = (arr: number[]) => {
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3));
      return g;
    };
    return { truss: toGeo(truss), bracing: toGeo(bracing), nodes: toGeo(nodes), moment: toGeo(moment), fill: toGeo(fill) };
  }, []);
}

const PIERS = [X0 + SPAN, X0 + 2 * SPAN];
const SUPPORTS = [X0, X0 + SPAN, X0 + 2 * SPAN, X0 + 3 * SPAN];

function Supports() {
  return (
    <group>
      {SUPPORTS.map((x, i) =>
        [-HALF_W, HALF_W].map((z) => (
          <mesh key={`${i}${z}`} position={[x, DECK_Y - 0.17, z]}>
            <coneGeometry args={[0.16, 0.26, 3]} />
            <meshBasicMaterial color={i === 0 ? ACCENT_HI : ACCENT} transparent opacity={0.9} />
          </mesh>
        )),
      )}
      {PIERS.map((x) => {
        const ground = terrainHeight(x, 0);
        const h = DECK_Y - 0.3 - ground;
        const geo = new THREE.BoxGeometry(0.5, h, 1.5);
        return (
          <group key={x} position={[x, ground + h / 2, 0]}>
            <mesh geometry={geo}>
              <meshStandardMaterial color="#0d1915" emissive="#104b39" emissiveIntensity={0.35} roughness={0.8} transparent opacity={0.85} />
            </mesh>
            <lineSegments geometry={new THREE.EdgesGeometry(geo)}>
              <lineBasicMaterial color={ACCENT} transparent opacity={0.55} />
            </lineSegments>
          </group>
        );
      })}
      {[X0 - 0.45, X0 + 3 * SPAN + 0.45].map((x) => {
        const ground = terrainHeight(x, 0);
        const h = DECK_Y - 0.25 - ground + 0.3;
        const geo = new THREE.BoxGeometry(0.9, h, 2.1);
        return (
          <group key={x} position={[x, ground + h / 2 - 0.3, 0]}>
            <mesh geometry={geo}>
              <meshStandardMaterial color="#0d1915" emissive="#104b39" emissiveIntensity={0.25} roughness={0.9} />
            </mesh>
            <lineSegments geometry={new THREE.EdgesGeometry(geo)}>
              <lineBasicMaterial color={ACCENT} transparent opacity={0.35} />
            </lineSegments>
          </group>
        );
      })}
    </group>
  );
}

function LoadArrows() {
  const ref = useRef<THREE.Group>(null);
  const xs = useMemo(() => Array.from({ length: 13 }, (_, i) => X0 + 0.6 + i * ((3 * SPAN - 1.2) / 12)), []);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = Math.sin(clock.elapsedTime * 1.4) * 0.04;
  });
  const top = DECK_Y + TRUSS_H + 0.85;
  const line = useMemo(() => {
    const arr: number[] = [X0 + 0.6, top, 0, X0 + 3 * SPAN - 0.6, top, 0];
    xs.forEach((x) => arr.push(x, top, 0, x, DECK_Y + TRUSS_H + 0.28, 0));
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3));
    return g;
  }, [xs, top]);
  return (
    <group ref={ref}>
      <lineSegments geometry={line}>
        <lineBasicMaterial color={ACCENT_HI} transparent opacity={0.55} />
      </lineSegments>
      {xs.map((x) => (
        <mesh key={x} position={[x, DECK_Y + TRUSS_H + 0.2, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.06, 0.16, 8]} />
          <meshBasicMaterial color={ACCENT_HI} />
        </mesh>
      ))}
    </group>
  );
}

export type Anchor = { id: string; pos: [number, number, number] };
export const ANCHORS: Anchor[] = [
  { id: 'span', pos: [X0 + 1.5 * SPAN, DECK_Y + TRUSS_H + 0.95, 0] },
  { id: 'pier', pos: [X0 + SPAN, DECK_Y - 1.4, 0.8] },
  { id: 'mneg', pos: [X0 + 2 * SPAN, M_BASE + 0.1 * MK, 0] },
  { id: 'mpos', pos: [X0 + 0.4 * SPAN, M_BASE - 0.08 * MK, 0] },
  { id: 'dtm', pos: [4.5, terrainHeight(4.5, 5), 5] },
];

function Scene({ onProject, interactive }: { onProject: (pts: Record<string, [number, number, boolean]>) => void; interactive: boolean }) {
  const terrain = useTerrain();
  const bridge = useBridge();
  const group = useRef<THREE.Group>(null);
  const { camera, size, pointer } = useThree();
  const target = useRef({ x: 0, y: 0 });
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const frame = useRef(0);

  useFrame(({ clock }, dt) => {
    const g = group.current;
    if (!g) return;
    if (interactive) {
      target.current.x = pointer.x * 0.28;
      target.current.y = -pointer.y * 0.06;
    }
    const idle = interactive ? Math.sin(clock.elapsedTime * 0.18) * 0.06 : 0;
    const k = 1 - Math.pow(0.0015, dt);
    g.rotation.y += (target.current.x + idle - 0.46 - g.rotation.y) * k;
    g.rotation.x += (target.current.y - g.rotation.x) * k;

    // Proyección de anotaciones al DOM (cada 2 frames)
    if (frame.current++ % 2) return;
    const out: Record<string, [number, number, boolean]> = {};
    for (const a of ANCHORS) {
      tmp.set(...a.pos).applyMatrix4(g.matrixWorld).project(camera);
      out[a.id] = [((tmp.x + 1) / 2) * size.width, ((1 - tmp.y) / 2) * size.height, tmp.z < 1];
    }
    onProject(out);
  });

  return (
    <group ref={group} rotation={[0, -0.46, 0]} position={[0.5, 0.6, 0]}>
      <mesh geometry={terrain.surf}>
        <meshStandardMaterial color="#07120e" roughness={1} metalness={0} transparent opacity={0.92} />
      </mesh>
      <lineSegments geometry={terrain.grid}>
        <lineBasicMaterial color="#1d7a5c" transparent opacity={0.16} />
      </lineSegments>
      <lineSegments geometry={terrain.minor}>
        <lineBasicMaterial color="#2fbf8f" transparent opacity={0.22} />
      </lineSegments>
      <lineSegments geometry={terrain.major}>
        <lineBasicMaterial color={ACCENT} transparent opacity={0.5} />
      </lineSegments>

      {/* Tablero */}
      <mesh position={[0, DECK_Y - 0.06, 0]}>
        <boxGeometry args={[3 * SPAN + 0.2, 0.12, HALF_W * 2 + 0.2]} />
        <meshStandardMaterial color="#0d1915" emissive="#104b39" emissiveIntensity={0.5} transparent opacity={0.8} />
      </mesh>
      <lineSegments geometry={bridge.truss}>
        <lineBasicMaterial color={ACCENT} transparent opacity={0.95} blending={THREE.AdditiveBlending} />
      </lineSegments>
      <lineSegments geometry={bridge.bracing}>
        <lineBasicMaterial color={ACCENT} transparent opacity={0.3} />
      </lineSegments>
      <points geometry={bridge.nodes}>
        <pointsMaterial color={ACCENT_HI} size={0.09} sizeAttenuation />
      </points>
      {/* Diagrama de momentos flectores */}
      <lineSegments geometry={bridge.moment}>
        <lineBasicMaterial color={ACCENT_HI} transparent opacity={0.95} />
      </lineSegments>
      <lineSegments geometry={bridge.fill}>
        <lineBasicMaterial color={ACCENT} transparent opacity={0.22} />
      </lineSegments>
      <Supports />
      <LoadArrows />
    </group>
  );
}

const LABELS: Record<string, { title: string; value: string }> = {
  span: { title: 'Carga uniforme', value: 'w · 3 × 40 m' },
  pier: { title: 'Pila P1', value: 'Apoyo intermedio' },
  mneg: { title: 'M⁻ apoyo', value: '−0.100 wL²' },
  mpos: { title: 'M⁺ tramo 1', value: '+0.080 wL²' },
  dtm: { title: 'MDT', value: 'Curvas c/ 2 m' },
};

export default function BridgeScene() {
  const wrap = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const labelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.01 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onProject = (pts: Record<string, [number, number, boolean]>) => {
    for (const [id, [x, y, ok]] of Object.entries(pts)) {
      const el = labelRefs.current[id];
      if (!el) continue;
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      el.style.opacity = ok ? '1' : '0';
    }
  };

  return (
    <div ref={wrap} className="relative h-full w-full" aria-hidden>
      <Canvas
        frameloop={visible ? 'always' : 'never'}
        dpr={[1, 1.75]}
        camera={{ position: [2.5, 9.8, 30], fov: 30, near: 0.1, far: 90 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ camera }) => camera.lookAt(0.6, -0.8, 0)}
      >
        <fog attach="fog" args={['#050807', 28, 50]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[4, 8, 6]} intensity={0.6} color="#9dffd8" />
        <pointLight position={[0, 2, 3]} intensity={6} distance={14} color="#00E6A0" />
        <Scene onProject={onProject} interactive={!reduce} />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Object.entries(LABELS).map(([id, l]) => (
          <div key={id} ref={(el) => { labelRefs.current[id] = el; }} className="absolute left-0 top-0 opacity-0 transition-opacity duration-500">
            <div className="flex -translate-y-1/2 items-center gap-2">
              <span className="size-1.5 rounded-full bg-accent shadow-[0_0_10px_#00E6A0]" />
              <span className="h-px w-6 bg-accent/50" />
              <span className="whitespace-nowrap rounded-md border border-line-strong bg-bg/70 px-2 py-1 font-mono text-[10px] leading-tight text-muted backdrop-blur">
                <span className="block text-[9px] tracking-[0.14em] text-faint">{l.title.toUpperCase()}</span>
                <span className="text-ink">{l.value}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
