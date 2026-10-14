import { useMemo, useState } from 'react';
import { Tex } from '../components/Tex';
import { analyzeBeam, fmt, type Support } from '../lib/mechanics';
import { Chart } from './Chart';
import { NumField, Segmented, Stat, ToolShell } from './controls';

function BeamSketch({ support, L, a, P, w }: { support: Support; L: number; a: number; P: number; w: number }) {
  const x0 = 40, x1 = 680, y = 92;
  const sx = (x: number) => x0 + (x / L) * (x1 - x0);
  return (
    <svg viewBox="0 0 720 150" className="w-full" role="img" aria-label="Esquema de la viga con cargas y apoyos">
      {w > 0 && (
        <g stroke="#3FFFC1" strokeOpacity=".7" fill="none">
          <line x1={x0} x2={x1} y1={42} y2={42} />
          {Array.from({ length: 17 }, (_, i) => x0 + (i * (x1 - x0)) / 16).map((x) => (
            <path key={x} d={`M${x} 42 V${y - 8} m-3.5 -7 l3.5 7 l3.5 -7`} />
          ))}
          <text x={x1 - 2} y={34} textAnchor="end" className="fill-accent font-mono" fontSize="11" stroke="none">w = {w} kN/m</text>
        </g>
      )}
      {P > 0 && (
        <g stroke="#F5F7F6" fill="#F5F7F6">
          <line x1={sx(a)} x2={sx(a)} y1={12} y2={y - 10} strokeWidth="2" />
          <path d={`M${sx(a)} ${y - 4} l-6 -11 h12 z`} stroke="none" />
          <text x={sx(a) + 8} y={22} className="font-mono" fontSize="11" stroke="none">P = {P} kN</text>
        </g>
      )}
      <rect x={x0} y={y - 4} width={x1 - x0} height="8" rx="2" fill="#104B39" stroke="#00E6A0" />
      {support === 'simple' ? (
        <g fill="none" stroke="#00E6A0" strokeWidth="1.5">
          <path d={`M${x0} ${y + 4} l-11 18 h22 z`} />
          <path d={`M${x1} ${y + 4} l-11 16 h22 z`} />
          <line x1={x1 - 13} x2={x1 + 13} y1={y + 25} y2={y + 25} />
          <line x1={x0 - 16} x2={x0 + 16} y1={y + 22} y2={y + 22} />
        </g>
      ) : (
        <g stroke="#00E6A0" strokeWidth="1.5">
          <line x1={x0} x2={x0} y1={y - 30} y2={y + 30} strokeWidth="3" />
          {[-24, -12, 0, 12, 24].map((d) => <line key={d} x1={x0} x2={x0 - 10} y1={y + d} y2={y + d + 8} />)}
        </g>
      )}
      <g className="fill-faint font-mono" fontSize="11">
        <line x1={x0} x2={x1} y1={138} y2={138} stroke="rgba(150,255,210,.25)" />
        <text x={(x0 + x1) / 2} y={134} textAnchor="middle">L = {L} m</text>
        {P > 0 && <text x={(x0 + sx(a)) / 2} y={122} textAnchor="middle">a = {a} m</text>}
      </g>
    </svg>
  );
}

export default function BeamTool() {
  const [support, setSupport] = useState<Support>('simple');
  const [L, setL] = useState(8);
  const [P, setP] = useState(60);
  const [a, setA] = useState(3);
  const [w, setW] = useState(15);
  const [E, setE] = useState(25);
  const [I, setI] = useState(540000);

  const r = useMemo(() => analyzeBeam({ support, L, P, a: Math.min(a, L), w, E, I }), [support, L, P, a, w, E, I]);
  const peakM = Math.abs(r.Mmax) >= Math.abs(r.Mmin) ? { x: r.xMmax, y: r.Mmax } : { x: r.xMmin, y: r.Mmin };

  return (
    <ToolShell
      title="Análisis de vigas"
      subtitle="Cortante, momento flector y deflexión elástica por integración de EI·y″ = M(x)."
      controls={
        <>
          <Segmented label="Tipo de apoyo" value={support} onChange={setSupport}
            options={[{ value: 'simple', label: 'Simplemente apoyada' }, { value: 'cantilever', label: 'Voladizo' }]} />
          <NumField label="Luz L" unit="m" value={L} onChange={(v) => { setL(v); if (a > v) setA(v); }} min={1} max={30} step={0.5} />
          <NumField label="Carga puntual P" unit="kN" value={P} onChange={setP} min={0} max={500} step={5} />
          <NumField label="Posición a" unit="m" value={Math.min(a, L)} onChange={setA} min={0} max={L} step={0.1} />
          <NumField label="Carga distribuida w" unit="kN/m" value={w} onChange={setW} min={0} max={100} step={1} />
          <div className="grid grid-cols-2 gap-3">
            <NumField label="E" unit="GPa" value={E} onChange={setE} min={1} max={210} step={1} slider={false} />
            <NumField label="I" unit="cm⁴" value={I} onChange={setI} min={100} max={5e7} step={1000} slider={false} />
          </div>
          <p className="text-[11px] leading-relaxed text-faint">E = 25 GPa e I = 540 000 cm⁴ corresponden aprox. a una viga de concreto de 0.30 × 0.60 m (sección bruta).</p>
        </>
      }
      equations={
        <>
          <Tex block>{'\\frac{dV}{dx}=-w(x),\\qquad \\frac{dM}{dx}=V(x)'}</Tex>
          <Tex block>{'EI\\,\\frac{d^2y}{dx^2}=M(x)'}</Tex>
          {support === 'simple' ? (
            <>
              <Tex block>{'R_A=\\frac{P(L-a)}{L}+\\frac{wL}{2},\\quad R_B=\\frac{Pa}{L}+\\frac{wL}{2}'}</Tex>
              <Tex block>{'M(x)=R_Ax-\\frac{wx^2}{2}-P\\langle x-a\\rangle'}</Tex>
            </>
          ) : (
            <>
              <Tex block>{'R_A=P+wL,\\quad M_A=-\\left(Pa+\\frac{wL^2}{2}\\right)'}</Tex>
              <Tex block>{'M(x)=-P\\langle a-x\\rangle-\\frac{w(L-x)^2}{2}'}</Tex>
            </>
          )}
        </>
      }
    >
      <div className="panel p-4 sm:p-5"><BeamSketch support={support} L={L} a={Math.min(a, L)} P={P} w={w} /></div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        <Stat label="R_A" value={fmt(r.RA)} unit="kN" />
        <Stat label={support === 'simple' ? 'R_B' : 'M_A'} value={fmt(support === 'simple' ? r.RB : r.MA)} unit={support === 'simple' ? 'kN' : 'kN·m'} />
        <Stat label="|V| máx" value={fmt(Math.abs(r.Vmax))} unit="kN" />
        <Stat label={`M ${peakM.y >= 0 ? 'máx' : 'mín'}`} value={fmt(peakM.y)} unit="kN·m" accent />
        <Stat label="x de M extremo" value={fmt(peakM.x)} unit="m" />
        <Stat label="Deflexión máx" value={fmt(r.ymax, 2)} unit="mm" accent />
      </div>
      <div className="panel p-4 sm:p-5">
        <p className="mb-2 text-sm text-muted">Diagrama de fuerza cortante <span className="font-mono text-xs text-faint">V(x) [kN]</span></p>
        <Chart series={[{ x: r.x, y: r.V, fill: true, label: 'V' }]} xLabel="x [m]" yLabel="V [kN]" ariaLabel="Diagrama de fuerza cortante" height={210} />
      </div>
      <div className="panel p-4 sm:p-5">
        <p className="mb-2 text-sm text-muted">Diagrama de momento flector <span className="font-mono text-xs text-faint">M(x) [kN·m] · positivo hacia abajo</span></p>
        <Chart series={[{ x: r.x, y: r.M, fill: true, label: 'M', color: '#3FFFC1' }]} invertY xLabel="x [m]" yLabel="M [kN·m]"
          markers={[{ x: peakM.x, y: peakM.y, label: `${fmt(peakM.y, 1)} kN·m` }]} ariaLabel="Diagrama de momento flector" height={230} />
      </div>
      <div className="panel p-4 sm:p-5">
        <p className="mb-2 text-sm text-muted">Elástica <span className="font-mono text-xs text-faint">y(x) [mm] · EI = {fmt(r.EI, 0)} kN·m²</span></p>
        <Chart series={[{ x: r.x, y: r.y, label: 'y', color: '#9DAAA4' }]} xLabel="x [m]" yLabel="y [mm]"
          markers={[{ x: r.xymax, y: r.ymax, label: `${fmt(r.ymax, 2)} mm` }]} ariaLabel="Curva elástica" height={190} />
      </div>
    </ToolShell>
  );
}
