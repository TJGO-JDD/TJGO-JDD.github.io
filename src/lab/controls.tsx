import { useId, type ReactNode } from 'react';

export function NumField({ label, unit, value, onChange, min, max, step = 0.1, slider = true }: {
  label: ReactNode; unit?: ReactNode; value: number; onChange: (v: number) => void;
  min: number; max: number; step?: number; slider?: boolean;
}) {
  const id = useId();
  const clamp = (v: number) => Math.min(max, Math.max(min, v));
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="label">{label}</label>
        {unit && <span className="font-mono text-[10.5px] text-faint">{unit}</span>}
      </div>
      <input id={id} type="number" inputMode="decimal" className="field mt-1.5" value={Number.isFinite(value) ? value : ''} min={min} max={max} step={step}
        onChange={(e) => { const v = parseFloat(e.target.value); if (!Number.isNaN(v)) onChange(clamp(v)); }} />
      {slider && (
        <input type="range" aria-label={typeof label === 'string' ? label : undefined} className="mt-2 w-full" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))} />
      )}
    </div>
  );
}

export function Stat({ label, value, unit, accent = false }: { label: ReactNode; value: string; unit?: string; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-line bg-bg/40 px-3.5 py-3">
      <p className="text-[11px] text-faint">{label}</p>
      <p className={`mt-1 font-mono text-[15px] tabular-nums ${accent ? 'text-accent' : 'text-ink'}`}>
        {value} {unit && <span className="text-[11px] text-faint">{unit}</span>}
      </p>
    </div>
  );
}

export function Segmented<T extends string>({ value, onChange, options, label }: {
  value: T; onChange: (v: T) => void; options: { value: T; label: string }[]; label: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className="flex rounded-[10px] border border-line bg-bg/50 p-1">
      {options.map((o) => (
        <button key={o.value} type="button" role="radio" aria-checked={value === o.value} onClick={() => onChange(o.value)}
          className={`flex-1 rounded-[7px] px-3 py-1.5 text-[13px] transition-colors ${value === o.value ? 'bg-surface-2 text-ink shadow-[inset_0_0_0_1px_rgba(150,255,210,.24)]' : 'text-muted hover:text-ink'}`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function ToolShell({ title, subtitle, equations, controls, children }: {
  title: string; subtitle: string; equations?: ReactNode; controls: ReactNode; children: ReactNode;
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-12">
      <aside className="panel p-5 lg:col-span-4 xl:col-span-3">
        <h3 className="text-lg font-medium tracking-tight">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{subtitle}</p>
        <div className="mt-5 space-y-4">{controls}</div>
      </aside>
      <div className="space-y-5 lg:col-span-8 xl:col-span-9">
        {children}
        {equations && (
          <div className="panel p-5">
            <p className="eyebrow mb-3">Formulación</p>
            <div className="grid gap-x-8 gap-y-1 text-sm md:grid-cols-2 [&>*]:min-w-0 [&>*]:overflow-x-auto">{equations}</div>
          </div>
        )}
      </div>
    </div>
  );
}
