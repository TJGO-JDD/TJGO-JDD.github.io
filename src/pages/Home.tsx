import { ArrowRight, ArrowUpRight, Activity, Calculator, LineChart, Mountain, Ruler, Waves } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AreaCard, ProjectFeature, SoftwareCover } from '../components/cards';
import { Thumb } from '../components/Gallery';
import { Hero } from '../components/Hero';
import { CornerFrame, DrawLine, Reveal, SectionHeader, StatusChip } from '../components/ui';
import { areas } from '../data/areas';
import { projects } from '../data/projects';
import { site, toolStack } from '../data/site';
import { software } from '../data/software';
import { Chart } from '../lab/Chart';
import { analyzeBeam, fmt } from '../lib/mechanics';
import { useSeo } from '../lib/seo';
import { url } from '../lib/media';

function SoftwareShowcase() {
  const featured = software.filter((s) => s.featured);
  const [main, ...rest] = featured;
  return (
    <section className="container-x py-24 md:py-32" aria-labelledby="sw-title">
      <SectionHeader index="02" eyebrow="Engineered Software"
        title={<span id="sw-title">Software técnico,<br className="hidden sm:block" /> <span className="text-muted">diseñado como producto.</span></span>}
        intro="Aplicaciones de escritorio, reportes automáticos y herramientas de cálculo desarrolladas para resolver problemas reales de expedientes técnicos."
        action={<Link to="/software" className="btn btn-ghost">Catálogo completo <ArrowRight size={16} /></Link>} />

      <div className="grid gap-5 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <article className="panel panel-lit card-hover group relative h-full overflow-hidden">
            <SoftwareCover sw={main} className="aspect-[16/10] border-b border-line" />
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="chip chip-accent">Producto destacado</span>
                <span className="chip">{main.category}</span>
                <StatusChip status={main.status} />
              </div>
              <h3 className="mt-5 text-3xl font-medium tracking-tight">
                <Link to={`/software/${main.slug}`} className="after:absolute after:inset-0">{main.name} <span className="font-mono text-base text-faint">{main.version}</span></Link>
              </h3>
              <p className="mt-3 max-w-xl leading-relaxed text-muted">{main.summary}</p>
              <p className="mt-5 font-mono text-[11px] text-faint">{main.tech.join(' · ')}</p>
            </div>
          </article>
        </Reveal>
        <div className="flex flex-col gap-3 lg:col-span-5">
          {rest.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.06}>
              <Link to={`/software/${s.slug}`} className="panel card-hover group flex items-center gap-4 p-3 pr-5">
                <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-[10px] border border-line bg-surface">
                  {s.images[0] && <Thumb src={s.images[0]} alt="" className="h-full w-full object-cover object-top opacity-80 transition-opacity group-hover:opacity-100" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-[10px] tracking-[0.14em] text-faint">{s.category.toUpperCase()}</p>
                  <p className="mt-1 truncate font-medium tracking-tight text-ink">{s.name} {s.version && <span className="font-mono text-xs text-faint">{s.version}</span>}</p>
                  <p className="mt-0.5 line-clamp-1 text-sm text-muted">{s.summary}</p>
                </div>
                <ArrowUpRight size={18} className="shrink-0 text-faint transition-colors group-hover:text-accent" />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function LabTeaser() {
  const [a, setA] = useState(3.2);
  const r = useMemo(() => analyzeBeam({ support: 'simple', L: 8, P: 80, a, w: 10, E: 25, I: 540000 }, 300), [a]);
  const tools = [
    { icon: Ruler, label: 'Análisis de vigas', note: 'V(x), M(x), deflexión' },
    { icon: LineChart, label: 'Líneas de influencia', note: 'Camión HL-93 + carril' },
    { icon: Activity, label: 'Oscilador 1 GDL', note: 'Newmark β = 1/4' },
    { icon: Mountain, label: 'Terreno 3D', note: 'Curvas de nivel' },
    { icon: Calculator, label: 'Conversor', note: 'SI · técnico · US' },
  ];
  return (
    <section className="container-x py-24 md:py-32" aria-labelledby="lab-title">
      <Reveal>
        <div className="panel panel-lit relative overflow-hidden">
          <div className="tech-grid-fine absolute inset-0 opacity-40" />
          <div className="glow-ambient right-0 top-0 h-80 w-[50%] opacity-60" />
          <div className="relative grid gap-10 p-6 sm:p-10 lg:grid-cols-12 lg:p-14">
            <div className="lg:col-span-5">
              <p className="eyebrow">04 · TJGO Engineering Lab</p>
              <h2 id="lab-title" className="h-display mt-4 text-4xl sm:text-5xl">Cálculo en vivo,<br /><span className="text-muted">ecuaciones a la vista.</span></h2>
              <p className="mt-5 max-w-md leading-relaxed text-muted">Herramientas interactivas con cálculos verificados contra soluciones cerradas, unidades explícitas y formulación en KaTeX.</p>
              <ul className="mt-8 divide-y divide-line border-y border-line">
                {tools.map((t) => (
                  <li key={t.label} className="flex items-center gap-3 py-3">
                    <t.icon size={16} className="text-accent" aria-hidden />
                    <span className="text-sm text-ink">{t.label}</span>
                    <span className="ml-auto font-mono text-[11px] text-faint">{t.note}</span>
                  </li>
                ))}
              </ul>
              <Link to="/lab" className="btn btn-primary mt-8">Abrir laboratorio <ArrowRight size={16} /></Link>
            </div>
            <div className="lg:col-span-7">
              <div className="relative rounded-2xl border border-line bg-bg/60 p-4 sm:p-6">
                <CornerFrame />
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[11px] text-faint">VIGA S.A. · L = 8 m · P = 80 kN · w = 10 kN/m</p>
                  <Waves size={14} className="text-faint" aria-hidden />
                </div>
                <Chart series={[{ x: r.x, y: r.M, fill: true, label: 'M', color: '#3FFFC1' }]} invertY xLabel="x [m]" yLabel="M [kN·m]"
                  markers={[{ x: r.xMmax, y: r.Mmax, label: `${fmt(r.Mmax, 1)} kN·m` }]} ariaLabel="Momento flector de la viga de ejemplo" height={250} />
                <label className="mt-3 block">
                  <span className="label">Posición de la carga P: <span className="font-mono text-ink">{fmt(a, 1)} m</span></span>
                  <input type="range" min={0} max={8} step={0.1} value={a} onChange={(e) => setA(+e.target.value)} className="mt-2 w-full" />
                </label>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default function Home() {
  useSeo(undefined, 'TJGO — Ingeniería civil & tecnología: software técnico, fotogrametría, hidrología, estructuras e ingeniería vial por Ñol Iván Juan de Dios Rojas.');
  const selected = ['fotogrametria-topografia-dron', 'analisis-hidrologico-cuencas', 'lineas-influencia-puentes']
    .map((s) => projects.find((p) => p.slug === s)!);

  return (
    <>
      <Hero />

      {/* 01 · Áreas */}
      <section className="container-x pt-20 md:pt-28" aria-labelledby="areas-title">
        <SectionHeader index="01" eyebrow="Áreas de ingeniería"
          title={<span id="areas-title">Seis disciplinas, <span className="text-muted">un mismo enfoque computacional.</span></span>}
          action={<Link to="/ingenieria" className="btn btn-ghost">Ver áreas <ArrowRight size={16} /></Link>} />
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((a, i) => (
            <Reveal as="li" key={a.id} delay={(i % 3) * 0.07}><AreaCard area={a} index={i} /></Reveal>
          ))}
        </ul>
      </section>

      <SoftwareShowcase />

      {/* 03 · Proyectos */}
      <section className="relative py-24 md:py-32" aria-labelledby="work-title">
        <div className="tech-grid mask-fade-b absolute inset-x-0 top-0 h-full opacity-60" />
        <div className="container-x relative">
          <SectionHeader index="03" eyebrow="Selected Engineering Work"
            title={<span id="work-title">Trabajo seleccionado</span>}
            intro="Proyectos profesionales y desarrollos propios en fotogrametría, hidrología y estructuras."
            action={<Link to="/proyectos" className="btn btn-ghost">Todos los proyectos <ArrowRight size={16} /></Link>} />
          <div className="space-y-6">
            {selected.map((p, i) => <Reveal key={p.slug}><ProjectFeature p={p} index={i} /></Reveal>)}
          </div>
        </div>
      </section>

      <LabTeaser />

      {/* 05 · Perfil */}
      <section className="container-x py-16 md:py-24" aria-labelledby="about-title">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <div className="panel relative overflow-hidden">
              <img src={url(site.fieldPhoto)} alt="Iván Juan de Dios Rojas en campo, bajo un puente" loading="lazy" className="aspect-[16/10] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent" />
              <p className="absolute bottom-4 left-4 font-mono text-[10.5px] tracking-[0.16em] text-ink/80">INSPECCIÓN EN CAMPO</p>
            </div>
          </Reveal>
          <Reveal className="lg:col-span-6" delay={0.1}>
            <p className="eyebrow">05 · Perfil</p>
            <h2 id="about-title" className="h-display mt-4 text-4xl sm:text-5xl">{site.shortOwner}</h2>
            <DrawLine className="mt-6 w-40" />
            <p className="mt-6 leading-relaxed text-muted">{site.bio}</p>
            <Link to="/sobre-mi" className="btn btn-ghost mt-8">Conocer más <ArrowRight size={16} /></Link>
          </Reveal>
        </div>
        <Reveal className="mt-16">
          <p className="mb-5 font-mono text-[11px] tracking-[0.18em] text-faint">STACK TÉCNICO</p>
          <ul className="flex flex-wrap gap-2.5">
            {toolStack.map((t) => (
              <li key={t.name} className="group flex items-center gap-2.5 rounded-[10px] border border-line bg-surface/50 py-1.5 pl-1.5 pr-3.5 transition-colors hover:border-line-strong">
                <span className="flex size-8 items-center justify-center overflow-hidden rounded-[7px] bg-white/95 p-1">
                  <img src={url(t.img)} alt="" loading="lazy" className="max-h-full max-w-full object-contain grayscale transition group-hover:grayscale-0" />
                </span>
                <span className="text-sm text-muted group-hover:text-ink">{t.name}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="container-x pb-8 pt-12">
        <Reveal>
          <div className="panel panel-lit relative overflow-hidden px-6 py-14 text-center sm:px-12 sm:py-20">
            <div className="glow-ambient left-1/2 top-full h-80 w-[70%] -translate-x-1/2 -translate-y-1/2" />
            <p className="eyebrow relative">Colaboración</p>
            <h2 className="h-display relative mx-auto mt-5 max-w-3xl text-4xl sm:text-6xl">¿Tienes un proyecto de infraestructura?</h2>
            <p className="relative mx-auto mt-5 max-w-xl text-muted">Fotogrametría, automatización de expedientes técnicos y desarrollo de herramientas de cálculo.</p>
            <div className="relative mt-9 flex flex-wrap justify-center gap-3">
              <Link to="/contacto" className="btn btn-primary">Contactar <ArrowRight size={16} /></Link>
              <a href="https://github.com/TJGO-JDD" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Ver GitHub <ArrowUpRight size={16} /></a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
