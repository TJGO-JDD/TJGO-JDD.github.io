import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lightbox, Thumb } from '../components/Gallery';
import { PageHeader } from '../components/PageHeader';
import { Tex } from '../components/Tex';
import { ExtLinkButton, Reveal, SectionHeader } from '../components/ui';
import { academicResources, research } from '../data/research';
import type { ResearchItem } from '../data/types';
import { useSeo } from '../lib/seo';

function ResearchCard({ r, index }: { r: ResearchItem; index: number }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <article className="panel card-hover flex h-full flex-col p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-[0.16em] text-faint">NM-{String(index + 1).padStart(2, '0')}</span>
        <span className="chip">{r.tool}</span>
      </div>
      <h3 className="mt-4 text-xl font-medium tracking-tight">{r.title}</h3>
      {r.tex && (
        <div tabIndex={0} role="region" aria-label={`Ecuación: ${r.title}`} className="mt-4 overflow-x-auto rounded-xl border border-line bg-bg/50 px-3 py-2 text-[0.8rem] sm:text-[0.85rem]">
          <Tex block>{r.tex}</Tex>
        </div>
      )}
      <p className="mt-4 text-sm leading-relaxed text-muted">{r.summary}</p>
      {r.images.length > 0 && (
        <ul className="mt-5 flex gap-2">
          {r.images.slice(0, 4).map((src, i) => (
            <li key={src}>
              <button onClick={() => setOpen(i)} aria-label={`Ampliar captura ${i + 1} de ${r.title}`}
                className="block h-14 w-20 overflow-hidden rounded-md border border-line hover:border-accent/60">
                <Thumb src={src} alt="" className="h-full w-full object-cover object-top" />
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-auto flex flex-wrap gap-2 pt-6">
        {r.links.map((l) => <ExtLinkButton key={l.href} link={l} small />)}
      </div>
      <Lightbox images={r.images} index={open} onClose={() => setOpen(null)} onIndex={setOpen} title={r.title} />
    </article>
  );
}

export default function Research() {
  useSeo('Investigación', 'Métodos numéricos aplicados a la ingeniería (MATLAB) y recursos académicos LaTeX de TJGO.');
  const groups = Array.from(new Set(research.map((r) => r.group)));
  let n = 0;
  return (
    <>
      <PageHeader eyebrow="Investigación" crumbs={[{ to: '/investigacion', label: 'Investigación' }]}
        title={<>Métodos numéricos <span className="text-muted">y recursos académicos.</span></>}
        intro="Implementaciones en MATLAB de interpolación, raíces de ecuaciones y sistemas no lineales, con documentación en PDF y código abierto en GitHub.">
        <Link to="/lab" className="btn btn-ghost">Probar el Engineering Lab <ArrowRight size={16} /></Link>
      </PageHeader>

      <div className="container-x space-y-20">
        {groups.map((g) => (
          <section key={g} aria-label={g}>
            <Reveal className="mb-6 flex items-end justify-between border-b border-line pb-4">
              <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">{g}</h2>
              <span className="font-mono text-[11px] text-faint">{research.filter((r) => r.group === g).length} MÉTODOS</span>
            </Reveal>
            <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {research.filter((r) => r.group === g).map((r) => (
                <Reveal as="li" key={r.slug}><ResearchCard r={r} index={n++} /></Reveal>
              ))}
            </ul>
          </section>
        ))}

        <section aria-labelledby="acad">
          <SectionHeader eyebrow="Recursos académicos" title={<span id="acad">Plantillas LaTeX & Beamer</span>} />
          {academicResources.map((a) => (
            <Reveal key={a.title}>
              <div className="panel panel-lit grid gap-8 overflow-hidden p-6 sm:p-8 lg:grid-cols-2">
                <div>
                  <h3 className="text-2xl font-medium tracking-tight">{a.title}</h3>
                  <p className="mt-4 leading-relaxed text-muted">{a.summary}</p>
                  <div className="mt-6 flex flex-wrap gap-2">{a.links.map((l, i) => <ExtLinkButton key={l.href} link={l} primary={i === 0} small />)}</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {a.images.map((src) => <Thumb key={src} src={src} alt={a.title} className="aspect-[16/10] w-full rounded-lg border border-line object-cover object-top" />)}
                </div>
              </div>
            </Reveal>
          ))}
        </section>
      </div>
    </>
  );
}
