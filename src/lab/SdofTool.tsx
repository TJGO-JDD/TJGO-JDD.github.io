import { Pause, Play, RotateCcw } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Tex } from '../components/Tex';
import { useReducedMotion } from '../lib/useMedia';
import { fmt, sdofNewmark } from '../lib/mechanics';
import { Chart } from './Chart';
import { NumField, Stat, ToolShell } from './controls';

function Oscillator({ u, umax }: { u: number; umax: number }) {
  // Desplazamiento visual normalizado (±70 px)
  const d = umax > 0 ? (u / umax) * 70 : 0;
  const wallX = 30, rest = 250, mx = rest + d;
  const coils = 10, x0 = wallX + 10, x1 = mx - 40;
  let spring = `M${wallX} 70 H${x0}`;
  for (let i = 0; i < coils; i++) {
    const xa = x0 + ((x1 - x0) * (i + 0.5)) / coils;
    spring += ` L${xa.toFixed(1)} ${i % 2 ? 58 : 82}`;
  }
  spring += ` L${x1} 70 H${mx - 32}`;
  return (
    <svg viewBox="0 0 440 130" className="w-full" role="img" aria-label="Oscilador masa-resorte-amortiguador">
      <rect x="0" y="20" width={wallX} height="96" fill="url(#hatch)" />
      <defs>
        <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="8" stroke="rgba(150,255,210,.3)" strokeWidth="2" />
        </pattern>
      </defs>
      <line x1={wallX} x2={wallX} y1="20" y2="116" stroke="#00E6A0" strokeWidth="2" />
      <line x1="0" x2="440" y1="116" y2="116" stroke="rgba(150,255,210,.3)" />
      <path d={spring} fill="none" stroke="#00E6A0" strokeWidth="1.6" strokeLinejoin="round" />
      {/* amortiguador */}
      <path d={`M${wallX} 100 H${wallX + 60} M${wallX + 60} 92 V108 M${wallX + 52} 90 H${mx - 60} M${wallX + 52} 110 H${mx - 60} M${mx - 60} 90 V110 M${wallX + 66} 100 H${mx - 32}`}
        fill="none" stroke="#9DAAA4" strokeWidth="1.4" />
      <rect x={mx - 32} y="48" width="64" height="62" rx="6" fill="#11221B" stroke="#3FFFC1" strokeWidth="1.5" />
      <text x={mx} y="84" textAnchor="middle" className="fill-ink font-mono" fontSize="13">m</text>
      <line x1={rest} x2={rest} y1="30" y2="44" stroke="#9DAAA4" strokeDasharray="2 2" />
      <path d={`M${rest} 36 H${mx}`} stroke="#3FFFC1" strokeWidth="1.5" />
      <text x={rest} y="24" textAnchor="middle" className="fill-faint font-mono" fontSize="10">u = 0</text>
    </svg>
  );
}

export default function SdofTool() {
  const [m, setM] = useState(10000);
  const [k, setK] = useState(4000);
  const [zeta, setZeta] = useState(0.05);
  const [u0, setU0] = useState(20);
  const [v0, setV0] = useState(0);
  const [p0, setP0] = useState(0);
  const [Om, setOm] = useState(15);
  const [tEnd, setTEnd] = useState(8);
  const reduce = useReducedMotion();

  const r = useMemo(() => sdofNewmark({ m, k, zeta, u0, v0, p0, Omega: Om, tEnd }), [m, k, zeta, u0, v0, p0, Om, tEnd]);
  const umax = useMemo(() => Math.max(...r.u.map(Math.abs)), [r]);

  const [playing, setPlaying] = useState(!reduce);
  const [ti, setTi] = useState(0);
  const raf = useRef(0);
  const start = useRef<number | null>(null);
  useEffect(() => { setTi(0); start.current = null; }, [r]);
  useEffect(() => {
    if (!playing) return;
    const step = (now: number) => {
      if (start.current === null) start.current = now - (r.t[ti] ?? 0) * 1000;
      const t = ((now - start.current) / 1000) % r.t[r.t.length - 1];
      setTi(Math.min(r.t.length - 1, Math.round(t / r.dt)));
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf.current); start.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, r]);

  // Submuestreo para la gráfica (≤ 1500 puntos)
  const ds = useMemo(() => {
    const stride = Math.max(1, Math.floor(r.t.length / 1500));
    const t: number[] = [], u: number[] = [];
    for (let i = 0; i < r.t.length; i += stride) { t.push(r.t[i]); u.push(r.u[i]); }
    return { t, u };
  }, [r]);

  return (
    <ToolShell
      title="Oscilador de 1 GDL"
      subtitle="Respuesta en el tiempo por el método de Newmark (aceleración promedio), incondicionalmente estable."
      controls={
        <>
          <NumField label="Masa m" unit="kg" value={m} onChange={setM} min={100} max={100000} step={100} />
          <NumField label="Rigidez k" unit="kN/m" value={k} onChange={setK} min={10} max={50000} step={10} />
          <NumField label="Amortiguamiento ζ" unit="—" value={zeta} onChange={setZeta} min={0} max={1.5} step={0.01} />
          <div className="grid grid-cols-2 gap-3">
            <NumField label="u₀" unit="mm" value={u0} onChange={setU0} min={-100} max={100} step={1} slider={false} />
            <NumField label="v₀" unit="mm/s" value={v0} onChange={setV0} min={-2000} max={2000} step={10} slider={false} />
          </div>
          <NumField label="Fuerza p₀ · sen(Ωt)" unit="kN" value={p0} onChange={setP0} min={0} max={200} step={1} />
          <NumField label="Frecuencia Ω" unit="rad/s" value={Om} onChange={setOm} min={0.1} max={100} step={0.1} />
          <NumField label="Duración" unit="s" value={tEnd} onChange={setTEnd} min={1} max={60} step={1} />
        </>
      }
      equations={
        <>
          <Tex block>{'m\\ddot u+c\\dot u+ku=p_0\\sin\\Omega t'}</Tex>
          <Tex block>{'\\omega_n=\\sqrt{k/m},\\quad c=2\\zeta\\sqrt{km},\\quad \\omega_D=\\omega_n\\sqrt{1-\\zeta^2}'}</Tex>
          <Tex block>{'R_d=\\frac{1}{\\sqrt{(1-r^2)^2+(2\\zeta r)^2}},\\quad r=\\Omega/\\omega_n'}</Tex>
          <Tex block>{'\\hat k=k+\\frac{\\gamma}{\\beta\\Delta t}c+\\frac{m}{\\beta\\Delta t^2},\\quad \\gamma=\\tfrac12,\\ \\beta=\\tfrac14'}</Tex>
        </>
      }
    >
      <div className="panel p-4 sm:p-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="font-mono text-xs text-faint">t = <span className="text-ink">{fmt(r.t[ti] ?? 0, 2)} s</span> · u = <span className="text-accent">{fmt(r.u[ti] ?? 0, 2)} mm</span></p>
          <div className="flex gap-2">
            <button className="btn btn-ghost btn-sm" onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Pausar' : 'Reproducir'}>
              {playing ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => { setTi(0); start.current = null; }} aria-label="Reiniciar"><RotateCcw size={14} /></button>
          </div>
        </div>
        <Oscillator u={r.u[ti] ?? 0} umax={umax} />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="ωn" value={fmt(r.wn, 3)} unit="rad/s" />
        <Stat label="Tn" value={fmt(r.Tn, 3)} unit="s" accent />
        <Stat label="fn" value={fmt(r.fn, 3)} unit="Hz" />
        <Stat label="ωD" value={zeta < 1 ? fmt(r.wd, 3) : '—'} unit="rad/s" />
        <Stat label="c" value={fmt(r.c / 1000, 2)} unit="kN·s/m" />
        <Stat label="|u| máx" value={fmt(umax, 2)} unit="mm" accent />
        <Stat label="u_st = p₀/k" value={fmt(r.ust, 2)} unit="mm" />
        <Stat label="R_d (estacionario)" value={p0 > 0 ? fmt(r.Rd, 3) : '—'} />
      </div>
      <div className="panel p-4 sm:p-5">
        <p className="mb-2 text-sm text-muted">Historia de desplazamientos <span className="font-mono text-xs text-faint">u(t) [mm] · Δt = {fmt(r.dt * 1000, 2)} ms</span></p>
        <Chart series={[{ x: ds.t, y: ds.u, label: 'u' }]} xLabel="t [s]" yLabel="u [mm]" ariaLabel="Historia de desplazamientos"
          vLines={[{ x: r.t[ti] ?? 0 }]} height={240} />
      </div>
    </ToolShell>
  );
}
