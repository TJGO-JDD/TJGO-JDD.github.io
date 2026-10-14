import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Tex } from '../components/Tex';
import { contourSegments, fbm } from '../lib/contours';
import { fmt } from '../lib/mechanics';
import { useReducedMotion } from '../lib/useMedia';
import { NumField, Stat, ToolShell } from './controls';

const N = 96;          // nodos por lado
const SIZE = 1000;     // m (lado del modelo)
const CELL = SIZE / (N - 1);

function buildDem(seed: number, relief: number) {
  const h = new Float32Array(N * N);
  for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
    const u = i / (N - 1), v = j / (N - 1);
    const ridge = 1 - Math.abs(fbm(u * 2.2 + seed, v * 2.2 - seed, seed, 4) * 2 - 1);
    const base = fbm(u * 3 + seed * 1.7, v * 3 + seed * 0.3, seed + 5, 5);
    const valley = Math.exp(-((u - 0.5 - 0.15 * Math.sin(v * 5 + seed)) ** 2) / 0.02);
    h[j * N + i] = 2800 + relief * (0.65 * base + 0.35 * ridge - 0.25 * valley);
  }
  let min = Infinity, max = -Infinity, slopeSum = 0;
  for (let k = 0; k < h.length; k++) { min = Math.min(min, h[k]); max = Math.max(max, h[k]); }
  for (let j = 1; j < N - 1; j++) for (let i = 1; i < N - 1; i++) {
    const dzdx = (h[j * N + i + 1] - h[j * N + i - 1]) / (2 * CELL);
    const dzdy = (h[(j + 1) * N + i] - h[(j - 1) * N + i]) / (2 * CELL);
    slopeSum += Math.hypot(dzdx, dzdy);
  }
  return { h, min, max, slope: (slopeSum / ((N - 2) * (N - 2))) * 100 };
}

function TerrainMesh({ dem, interval, exag }: { dem: ReturnType<typeof buildDem>; interval: number; exag: number }) {
  const scale = 10 / SIZE; // 1000 m → 10 u
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(10, 10, N - 1, N - 1);
    g.rotateX(-Math.PI / 2);
    const pos = g.attributes.position as THREE.BufferAttribute;
    const colors = new Float32Array(pos.count * 3);
    const lo = new THREE.Color('#06231a'), mid = new THREE.Color('#104B39'), hi = new THREE.Color('#3FFFC1');
    const c = new THREE.Color();
    for (let k = 0; k < pos.count; k++) {
      const i = k % N, j = Math.floor(k / N);
      const z = dem.h[j * N + i];
      pos.setY(k, (z - dem.min) * scale * exag);
      const t = (z - dem.min) / (dem.max - dem.min || 1);
      if (t < 0.6) c.copy(lo).lerp(mid, t / 0.6); else c.copy(mid).lerp(hi, ((t - 0.6) / 0.4) * 0.55);
      colors.set([c.r, c.g, c.b], k * 3);
    }
    g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return g;
  }, [dem, exag, scale]);

  const lines = useMemo(() => {
    const minor: number[] = [], major: number[] = [];
    const start = Math.ceil(dem.min / interval) * interval;
    const toW = (gi: number) => -5 + (gi / (N - 1)) * 10;
    for (let lv = start; lv <= dem.max; lv += interval) {
      const isMajor = Math.round(lv / interval) % 5 === 0;
      const y = (lv - dem.min) * scale * exag + 0.01;
      for (const [x1, z1, x2, z2] of contourSegments(dem.h, N, N, lv))
        (isMajor ? major : minor).push(toW(x1), y, toW(z1), toW(x2), y, toW(z2));
    }
    const mk = (a: number[]) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(a, 3)); return g; };
    return { minor: mk(minor), major: mk(major) };
  }, [dem, interval, exag, scale]);

  return (
    <group>
      <mesh geometry={geo}>
        <meshStandardMaterial vertexColors roughness={0.9} flatShading />
      </mesh>
      <lineSegments geometry={lines.minor}><lineBasicMaterial color="#00E6A0" transparent opacity={0.45} /></lineSegments>
      <lineSegments geometry={lines.major}><lineBasicMaterial color="#F5F7F6" transparent opacity={0.85} /></lineSegments>
    </group>
  );
}

function Rig({ children, auto }: { children: React.ReactNode; auto: boolean }) {
  const g = useRef<THREE.Group>(null);
  const drag = useRef<{ x: number; y: number; ry: number; rx: number } | null>(null);
  const rot = useRef({ y: 0.6, x: 0 });
  useFrame((_, dt) => {
    if (!g.current) return;
    if (auto && !drag.current) rot.current.y += dt * 0.08;
    g.current.rotation.y += (rot.current.y - g.current.rotation.y) * 0.15;
    g.current.rotation.x += (rot.current.x - g.current.rotation.x) * 0.15;
  });
  return (
    <group
      ref={g}
      onPointerDown={(e) => { (e.target as Element).setPointerCapture?.(e.pointerId); drag.current = { x: e.clientX, y: e.clientY, ry: rot.current.y, rx: rot.current.x }; }}
      onPointerMove={(e) => { if (!drag.current) return; rot.current.y = drag.current.ry + (e.clientX - drag.current.x) * 0.008; rot.current.x = THREE.MathUtils.clamp(drag.current.rx + (e.clientY - drag.current.y) * 0.004, -0.35, 0.5); }}
      onPointerUp={() => { drag.current = null; }}
      onPointerLeave={() => { drag.current = null; }}
    >
      {children}
    </group>
  );
}

export default function TerrainTool() {
  const [seed, setSeed] = useState(3);
  const [relief, setRelief] = useState(420);
  const [interval, setContourStep] = useState(10);
  const [exag, setExag] = useState(1.5);
  const reduce = useReducedMotion();
  const dem = useMemo(() => buildDem(seed, relief), [seed, relief]);
  const nContours = Math.floor(dem.max / interval) - Math.ceil(dem.min / interval) + 1;

  return (
    <ToolShell
      title="Visualizador de terreno 3D"
      subtitle="Modelo digital de elevación sintético (ruido fractal) con curvas de nivel por marching squares. Arrastra para girar."
      controls={
        <>
          <NumField label="Semilla del modelo" value={seed} onChange={(v) => setSeed(Math.round(v))} min={1} max={50} step={1} />
          <NumField label="Relieve" unit="m" value={relief} onChange={setRelief} min={50} max={1200} step={10} />
          <NumField label="Equidistancia" unit="m" value={interval} onChange={setContourStep} min={2} max={50} step={1} />
          <NumField label="Exageración vertical" unit="×" value={exag} onChange={setExag} min={1} max={4} step={0.1} />
          <p className="text-[11px] leading-relaxed text-faint">Terreno de demostración, no corresponde a un levantamiento real. Curvas maestras cada 5 equidistancias (en blanco).</p>
        </>
      }
      equations={
        <>
          <Tex block>{'S=\\sqrt{\\left(\\frac{\\partial z}{\\partial x}\\right)^2+\\left(\\frac{\\partial z}{\\partial y}\\right)^2}'}</Tex>
          <Tex block>{'\\frac{\\partial z}{\\partial x}\\approx\\frac{z_{i+1,j}-z_{i-1,j}}{2\\,\\Delta x}'}</Tex>
          <Tex block>{'x^{*}=x_i+\\frac{z_c-z_i}{z_{i+1}-z_i}\\,\\Delta x'}</Tex>
        </>
      }
    >
      <div className="panel relative h-[380px] overflow-hidden sm:h-[460px]">
        <div className="tech-grid-fine absolute inset-0 opacity-50" />
        <Canvas className="!touch-none" dpr={[1, 1.75]} camera={{ position: [9, 7.5, 9], fov: 38 }} onCreated={({ camera }) => camera.lookAt(0, 0.6, 0)}>
          <ambientLight intensity={0.55} />
          <directionalLight position={[6, 10, 4]} intensity={1.4} color="#d9fff0" />
          <Rig auto={!reduce}><TerrainMesh dem={dem} interval={interval} exag={exag} /></Rig>
        </Canvas>
        <div className="pointer-events-none absolute bottom-3 left-3 rounded-md border border-line bg-bg/70 px-2.5 py-1.5 font-mono text-[10.5px] text-muted backdrop-blur">
          1000 × 1000 m · malla {N}×{N} · Δ = {fmt(CELL, 2)} m
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Cota mínima" value={fmt(dem.min, 1)} unit="m" />
        <Stat label="Cota máxima" value={fmt(dem.max, 1)} unit="m" />
        <Stat label="Pendiente media" value={fmt(dem.slope, 1)} unit="%" accent />
        <Stat label="N.º de curvas" value={String(nContours)} />
      </div>
    </ToolShell>
  );
}
