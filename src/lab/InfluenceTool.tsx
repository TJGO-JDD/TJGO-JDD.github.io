import { useMemo, useState } from 'react';
import { Tex } from '../components/Tex';
import { fmt, HL93, IL, maxTruckEffect, positiveArea } from '../lib/mechanics';
import { Chart } from './Chart';
import { NumField, Segmented, Stat, ToolShell } from './controls';

type Effect = 'M' | 'V' | 'RA';

export default function InfluenceTool() {
  const [L, setL] = useState(25);
  const [s, setS] = useState(10);
  const [effect, setEffect] = useState<Effect>('M');
  const [xp, setXp] = useState(8);
  const sec = Math.min(s, L);

  const il = useMemo(() => {
    if (effect === 'M') return (x: number) => IL.M(x, sec, L);
    if (effect === 'V') return (x: number) => IL.V(x, sec, L);
    return (x: number) => IL.RA(x, L);
  }, [effect, sec, L]);

  const data = useMemo(() => {
    const x: number[] = [], y: number[] = [];
    const N = 400;
    for (let i = 0; i <= N; i++) {
      const xi = (i / N) * L;
      if (effect === 'V' && i > 0 && x[x.length - 1] < sec && xi >= sec) {
        x.push(sec, sec); y.push(IL.V(sec - 1e-9, sec, L), IL.V(sec, sec, L));
      }
      x.push(xi); y.push(il(xi));
    }
    return { x, y };
  }, [il, L, sec, effect]);

  const truck = useMemo(() => maxTruckEffect(il, L, 0.02), [il, L]);
  const lane = useMemo(() => HL93.lane * positiveArea(il, L), [il, L]);
  const unit = effect === 'M' ? 'kN·m' : 'kN';
  const ord = il(Math.min(xp, L));
  const axlesX = HL93.spacing.map((d) => truck.x0 + truck.dir * d);

  return (
    <ToolShell
      title="Líneas de influencia"
      subtitle="Viga simplemente apoyada: reacción, cortante y momento en una sección, con camión HL-93 y carga de carril."
      controls={
        <>
          <Segmented label="Efecto" value={effect} onChange={setEffect}
            options={[{ value: 'M', label: 'M_s' }, { value: 'V', label: 'V_s' }, { value: 'RA', label: 'R_A' }]} />
          <NumField label="Luz L" unit="m" value={L} onChange={(v) => { setL(v); if (s > v) setS(v / 2); }} min={5} max={60} step={0.5} />
          <NumField label="Sección s" unit="m" value={sec} onChange={setS} min={0} max={L} step={0.1} />
          <NumField label="Carga unitaria en x" unit="m" value={Math.min(xp, L)} onChange={setXp} min={0} max={L} step={0.1} />
          <p className="text-[11px] leading-relaxed text-faint">
            Camión de diseño HL-93 (AASHTO LRFD 3.6.1.2): ejes de 35, 145 y 145 kN a 4.30 m, evaluado en ambos sentidos.
            Carril: 9.3 kN/m sobre el área positiva. IM = 33 % solo al camión.
          </p>
        </>
      }
      equations={
        <>
          <Tex block>{'R_A(x)=1-\\frac{x}{L}'}</Tex>
          <Tex block>{'V_s(x)=\\begin{cases}-x/L & x<s\\\\ 1-x/L & x>s\\end{cases}'}</Tex>
          <Tex block>{'M_s(x)=\\begin{cases}x(L-s)/L & x\\le s\\\\ s(L-x)/L & x\\ge s\\end{cases}'}</Tex>
          <Tex block>{'E_{LL+IM}=1.33\\sum P_i\\,\\eta(x_i)+w_{carril}\\,A^{+}'}</Tex>
        </>
      }
    >
      <div className="panel p-4 sm:p-5">
        <p className="mb-2 text-sm text-muted">Línea de influencia <span className="font-mono text-xs text-faint">η(x) · sección s = {fmt(sec, 2)} m</span></p>
        <Chart series={[{ x: data.x, y: data.y, fill: true, label: 'η' }]} xLabel="Posición de la carga unitaria x [m]" yLabel={effect === 'M' ? 'η [m]' : 'η [—]'}
          vLines={[{ x: sec, label: 's' }, ...axlesX.filter((x) => x >= 0 && x <= L).map((x) => ({ x }))]}
          markers={[{ x: Math.min(xp, L), y: ord, label: fmt(ord, 3) }]} ariaLabel="Línea de influencia" height={250} digits={4} />
        <p className="mt-2 text-xs text-faint">Las líneas discontinuas verticales indican la posición crítica de los ejes del camión.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="η en x (carga unitaria)" value={fmt(ord, 4)} unit={effect === 'M' ? 'm' : ''} />
        <Stat label="Camión HL-93" value={fmt(truck.value, 1)} unit={unit} />
        <Stat label="Carril 9.3 kN/m" value={fmt(lane, 1)} unit={unit} />
        <Stat label="LL + IM (por carril)" value={fmt(truck.value * (1 + HL93.IM) + lane, 1)} unit={unit} accent />
      </div>
    </ToolShell>
  );
}
