import { ArrowLeftRight } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Tex } from '../components/Tex';

/** Factores a la unidad base SI de cada magnitud. g₀ = 9.80665 m/s² (exacto). */
const G = 9.80665;
const LBF = 4.4482216152605; // N
const FT = 0.3048, IN = 0.0254;

type Unit = { id: string; label: string; f: number };
const groups: Record<string, { label: string; base: string; units: Unit[] }> = {
  fuerza: { label: 'Fuerza', base: 'N', units: [
    { id: 'N', label: 'N', f: 1 }, { id: 'kN', label: 'kN', f: 1e3 }, { id: 'kgf', label: 'kgf', f: G },
    { id: 'tf', label: 'tf', f: 1e3 * G }, { id: 'lbf', label: 'lbf', f: LBF }, { id: 'kip', label: 'kip', f: 1e3 * LBF },
  ] },
  esfuerzo: { label: 'Esfuerzo / presión', base: 'Pa', units: [
    { id: 'Pa', label: 'Pa', f: 1 }, { id: 'kPa', label: 'kPa', f: 1e3 }, { id: 'MPa', label: 'MPa', f: 1e6 },
    { id: 'kgf/cm2', label: 'kgf/cm²', f: G * 1e4 }, { id: 'tf/m2', label: 'tf/m²', f: G * 1e3 },
    { id: 'psi', label: 'psi', f: LBF / (IN * IN) }, { id: 'ksi', label: 'ksi', f: (1e3 * LBF) / (IN * IN) },
  ] },
  momento: { label: 'Momento', base: 'N·m', units: [
    { id: 'Nm', label: 'N·m', f: 1 }, { id: 'kNm', label: 'kN·m', f: 1e3 }, { id: 'kgfcm', label: 'kgf·cm', f: G * 0.01 },
    { id: 'kgfm', label: 'kgf·m', f: G }, { id: 'tfm', label: 'tf·m', f: 1e3 * G }, { id: 'kipft', label: 'kip·ft', f: 1e3 * LBF * FT },
    { id: 'kipin', label: 'kip·in', f: 1e3 * LBF * IN },
  ] },
  lineal: { label: 'Carga distribuida', base: 'N/m', units: [
    { id: 'N/m', label: 'N/m', f: 1 }, { id: 'kN/m', label: 'kN/m', f: 1e3 }, { id: 'kgf/m', label: 'kgf/m', f: G },
    { id: 'tf/m', label: 'tf/m', f: 1e3 * G }, { id: 'kip/ft', label: 'kip/ft', f: (1e3 * LBF) / FT }, { id: 'lbf/ft', label: 'lbf/ft', f: LBF / FT },
  ] },
  longitud: { label: 'Longitud', base: 'm', units: [
    { id: 'mm', label: 'mm', f: 1e-3 }, { id: 'cm', label: 'cm', f: 1e-2 }, { id: 'm', label: 'm', f: 1 }, { id: 'km', label: 'km', f: 1e3 },
    { id: 'in', label: 'in', f: IN }, { id: 'ft', label: 'ft', f: FT }, { id: 'mi', label: 'mi', f: 1609.344 },
  ] },
  area: { label: 'Área', base: 'm²', units: [
    { id: 'cm2', label: 'cm²', f: 1e-4 }, { id: 'm2', label: 'm²', f: 1 }, { id: 'ha', label: 'ha', f: 1e4 }, { id: 'km2', label: 'km²', f: 1e6 },
    { id: 'in2', label: 'in²', f: IN * IN }, { id: 'ft2', label: 'ft²', f: FT * FT },
  ] },
  caudal: { label: 'Caudal', base: 'm³/s', units: [
    { id: 'm3s', label: 'm³/s', f: 1 }, { id: 'Ls', label: 'L/s', f: 1e-3 }, { id: 'm3h', label: 'm³/h', f: 1 / 3600 },
    { id: 'cfs', label: 'ft³/s', f: FT ** 3 }, { id: 'gpm', label: 'gal/min (US)', f: 3.785411784e-3 / 60 },
  ] },
  peso: { label: 'Peso específico', base: 'N/m³', units: [
    { id: 'kN/m3', label: 'kN/m³', f: 1e3 }, { id: 'kgf/m3', label: 'kgf/m³', f: G }, { id: 'tf/m3', label: 'tf/m³', f: 1e3 * G },
    { id: 'pcf', label: 'lbf/ft³', f: LBF / FT ** 3 },
  ] },
};

const fmtNum = (v: number) => {
  if (!Number.isFinite(v)) return '—';
  const a = Math.abs(v);
  if (a !== 0 && (a < 1e-4 || a >= 1e9)) return v.toExponential(6);
  return v.toLocaleString('es-PE', { maximumSignificantDigits: 10 });
};

export default function UnitTool() {
  const [g, setG] = useState<keyof typeof groups>('fuerza');
  const grp = groups[g];
  const [from, setFrom] = useState(grp.units[1].id);
  const [val, setVal] = useState(1);
  const fromU = grp.units.find((u) => u.id === from) ?? grp.units[0];
  const base = val * fromU.f;
  const rows = useMemo(() => grp.units.map((u) => ({ u, v: base / u.f })), [grp, base]);

  return (
    <div className="grid gap-5 lg:grid-cols-12">
      <aside className="panel p-5 lg:col-span-4 xl:col-span-3">
        <h3 className="text-lg font-medium tracking-tight">Conversor de unidades</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">Unidades usuales en ingeniería civil (SI, técnico y US). Factores exactos con g₀ = 9.80665 m/s².</p>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {(Object.keys(groups) as (keyof typeof groups)[]).map((k) => (
            <button key={k} onClick={() => { setG(k); setFrom(groups[k].units[1].id); }}
              className={`rounded-lg border px-2.5 py-1.5 text-xs transition-colors ${g === k ? 'border-accent/60 bg-accent/10 text-accent' : 'border-line text-muted hover:text-ink'}`}
              aria-pressed={g === k}>{groups[k].label}</button>
          ))}
        </div>
        <div className="mt-5 space-y-3">
          <label className="label" htmlFor="uval">Valor</label>
          <input id="uval" type="number" className="field" value={val} onChange={(e) => setVal(parseFloat(e.target.value) || 0)} />
          <label className="label" htmlFor="ufrom">Desde</label>
          <select id="ufrom" className="field" value={from} onChange={(e) => setFrom(e.target.value)}>
            {grp.units.map((u) => <option key={u.id} value={u.id}>{u.label}</option>)}
          </select>
        </div>
      </aside>
      <div className="space-y-5 lg:col-span-8 xl:col-span-9">
        <div className="panel overflow-hidden">
          <div className="flex items-center gap-2 border-b border-line px-5 py-3 text-sm text-muted">
            <ArrowLeftRight size={15} className="text-accent" /> {fmtNum(val)} {fromU.label} equivale a:
          </div>
          <ul className="divide-y divide-line">
            {rows.map(({ u, v }) => (
              <li key={u.id} className={`flex items-center justify-between px-5 py-3 ${u.id === from ? 'bg-accent/[0.05]' : ''}`}>
                <span className="font-mono text-sm text-muted">{u.label}</span>
                <span className={`font-mono text-[15px] tabular-nums ${u.id === from ? 'text-accent' : 'text-ink'}`}>{fmtNum(v)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="panel p-5">
          <p className="eyebrow mb-3">Relaciones</p>
          <div className="grid gap-x-8 text-sm md:grid-cols-2">
            <Tex block>{'1\\ \\text{kgf}=9.80665\\ \\text{N},\\quad 1\\ \\text{tf}=9.80665\\ \\text{kN}'}</Tex>
            <Tex block>{'1\\ \\text{kgf/cm}^2=98.0665\\ \\text{kPa}'}</Tex>
            <Tex block>{'1\\ \\text{kip}=4.448222\\ \\text{kN},\\quad 1\\ \\text{ksi}=6.894757\\ \\text{MPa}'}</Tex>
            <Tex block>{'1\\ \\text{ft}=0.3048\\ \\text{m},\\quad 1\\ \\text{in}=25.4\\ \\text{mm}'}</Tex>
          </div>
        </div>
      </div>
    </div>
  );
}

