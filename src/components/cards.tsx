import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Area } from '../data/areas';
import { kindLabel } from '../data/projects';
import type { AreaId, Project, Software } from '../data/types';
import { Thumb } from './Gallery';
import { StatusChip } from './ui';

/* ───────── Glifos técnicos por área ───────── */
export function AreaGlyph({ id, className = '' }: { id: AreaId; className?: string }) {
  const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };
  return (
    <svg viewBox="0 0 64 40" className={className} aria-hidden>
      {id === 'estructuras' && (<g {...s}><path d="M4 30h56M10 18h44M4 30 10 18 16 30 22 18 28 30 34 18 40 30 46 18 52 30 54 18 60 30" /><path d="M4 30l-3 5h6zM60 30l-3 5h6z" fill="currentColor" /></g>)}
      {id === 'topografia' && (<g {...s}><path d="M6 32c8-10 14-4 22-12s16-10 30-8" /><path d="M6 24c8-6 14-2 20-8s14-8 32-6" opacity=".6" /><path d="M10 36c10-8 18-2 26-8s14-6 24-4" opacity=".35" /><circle cx="40" cy="14" r="2" fill="currentColor" /></g>)}
      {id === 'hidrologia' && (<g {...s}><path d="M4 34h56M4 34V6" opacity=".4" /><path d="M6 33c6-1 8-22 14-24s10 14 18 18 14 6 20 6" /><path d="M6 33c6 0 10-10 16-10s10 6 16 8 14 2 20 2" opacity=".5" strokeDasharray="2 3" /></g>)}
      {id === 'vial' && (<g {...s}><path d="M4 32 24 14h16l20 18" /><path d="M24 14 20 32M40 14l4 18" opacity=".5" /><path d="M32 16v3M32 23v3M32 30v2" /></g>)}
      {id === 'geotecnia' && (<g {...s}><path d="M28 4v16M36 4v16M16 20h32v8H16z" /><path d="M10 28h44" opacity=".5" /><path d="M14 33l4-2m10 2 4-2m10 2 4-2" opacity=".5" /><path d="M8 36h48" strokeDasharray="1 3" opacity=".6" /></g>)}
      {id === 'software' && (<g {...s}><path d="M20 12 10 20l10 8M44 12l10 8-10 8M36 8 28 32" /></g>)}
    </svg>
  );
}

export function AreaCard({ area, index }: { area: Area; index: number }) {
  return (
    <Link to={`/ingenieria#${area.id}`}
      className="panel card-hover group flex h-full flex-col overflow-hidden focus-visible:outline-offset-4">
      <div className="relative h-40 overflow-hidden border-b border-line sm:h-44">
        <Thumb src={area.image} alt="" className="h-full w-full object-cover opacity-55 grayscale transition-all duration-700 group-hover:scale-105 group-hover:opacity-75" />
        <div className="absolute inset-0 bg-[#00e6a0] mix-blend-color opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
        <div className="tech-grid-fine absolute inset-0 opacity-50" />
        <span className="absolute left-4 top-4 font-mono text-[10px] tracking-[0.18em] text-ink/70">{area.code}-{String(index + 1).padStart(2, '0')}</span>
        <AreaGlyph id={area.id} className="absolute bottom-3 right-4 h-10 w-16 text-accent drop-shadow-[0_0_8px_rgba(0,230,160,0.6)]" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-medium tracking-tight text-ink">{area.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{area.short}</p>
        <span className="mt-auto flex items-center gap-1.5 pt-5 text-sm text-accent opacity-70 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100">
          Explorar <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}

/* ───────── Software ───────── */
export function SoftwareCover({ sw, eager = false, className = '' }: { sw: Software; eager?: boolean; className?: string }) {
  if (!sw.images.length) {
    return (
      <div className={`relative flex items-center justify-center overflow-hidden bg-surface ${className}`}>
        <div className="tech-grid-fine absolute inset-0 opacity-70" />
        <div className="glow-ambient h-32 w-32 opacity-50" />
        <div className="relative text-center">
          <AreaGlyph id={sw.areas[0]} className="mx-auto h-10 w-16 text-accent/80" />
          <p className="mt-3 font-mono text-[10px] tracking-[0.18em] text-faint">CAPTURA PENDIENTE</p>
        </div>
      </div>
    );
  }
  return (
    <div className={`relative overflow-hidden bg-surface ${className}`}>
      <div className="glow-ambient left-1/2 top-1/2 h-40 w-3/4 -translate-x-1/2 -translate-y-1/2 opacity-60" />
      <Thumb src={sw.images[0]} alt={`${sw.name} — captura`} eager={eager}
        className="absolute inset-x-[7%] top-[12%] w-[86%] rounded-t-lg border border-line-strong object-cover object-top shadow-[0_20px_60px_-20px_rgba(0,0,0,.9)] transition-transform duration-700 group-hover:-translate-y-1.5" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-surface to-transparent" />
    </div>
  );
}

export function SoftwareCard({ sw }: { sw: Software }) {
  return (
    <article className="panel panel-lit card-hover group relative flex h-full flex-col overflow-hidden">
      <SoftwareCover sw={sw} className="aspect-[16/10] border-b border-line" />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip">{sw.category}</span>
          <StatusChip status={sw.status} />
        </div>
        <h3 className="mt-4 text-xl font-medium tracking-tight text-ink">
          <Link to={`/software/${sw.slug}`} className="after:absolute after:inset-0">
            {sw.name} {sw.version && <span className="font-mono text-sm text-faint">{sw.version}</span>}
          </Link>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{sw.summary}</p>
        {sw.tech.length > 0 && (
          <p className="mt-4 font-mono text-[11px] leading-relaxed text-faint">{sw.tech.join(' · ')}</p>
        )}
        <span className="mt-auto flex items-center gap-1.5 pt-5 text-sm text-accent">
          Ver ficha <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </article>
  );
}

/* ───────── Proyecto (tarjeta horizontal grande) ───────── */
export function ProjectFeature({ p, index }: { p: Project; index: number }) {
  const flip = index % 2 === 1;
  return (
    <article className="panel panel-lit card-hover group relative grid overflow-hidden lg:grid-cols-12">
      <div className={`relative aspect-[16/10] overflow-hidden border-line lg:col-span-7 lg:aspect-auto lg:min-h-[400px] ${flip ? 'lg:order-2 lg:border-l' : 'lg:border-r'} border-b lg:border-b-0`}>
        <Thumb src={p.images[0]} alt={`${p.title}`} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] group-hover:scale-[1.03]" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg/60 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 font-mono text-[10px] tracking-[0.18em] text-ink/80">
          {String(index + 1).padStart(2, '0')} / {p.discipline.toUpperCase()}
        </span>
      </div>
      <div className="flex flex-col p-6 sm:p-8 lg:col-span-5 lg:p-10">
        <span className={`chip w-fit ${p.kind === 'profesional' ? 'chip-accent' : ''}`}>{kindLabel[p.kind]}</span>
        <h3 className="mt-5 text-2xl font-medium leading-tight tracking-tight text-ink sm:text-3xl">
          <Link to={`/proyectos/${p.slug}`} className="after:absolute after:inset-0">{p.title}</Link>
        </h3>
        <p className="mt-4 leading-relaxed text-muted">{p.summary}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {p.tags.slice(0, 5).map((t) => <li key={t} className="chip">{t}</li>)}
        </ul>
        <span className="mt-auto flex items-center gap-1.5 pt-8 text-sm text-accent">
          Ver proyecto <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </article>
  );
}
