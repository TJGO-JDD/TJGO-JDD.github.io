import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaGlyph } from '../components/cards';
import { Thumb } from '../components/Gallery';
import { PageHeader } from '../components/PageHeader';
import { CornerFrame, Reveal } from '../components/ui';
import { areas } from '../data/areas';
import { kindLabel, projects } from '../data/projects';
import { software } from '../data/software';
import { useSeo } from '../lib/seo';

export default function Engineering() {
  useSeo('Ingeniería', 'Áreas de ingeniería TJGO: estructuras y puentes, topografía y fotogrametría, hidrología, ingeniería vial, geotecnia y software.');
  return (
    <>
      <PageHeader eyebrow="Áreas de ingeniería" crumbs={[{ to: '/ingenieria', label: 'Ingeniería' }]}
        title={<>Seis áreas técnicas <span className="text-muted">conectadas por el software.</span></>}
        intro="Cada disciplina se apoya en herramientas propias de cálculo, automatización y documentación técnica.">
        <nav aria-label="Áreas" className="flex flex-wrap gap-2">
          {areas.map((a) => (
            <a key={a.id} href={`#${a.id}`} className="chip hover:text-ink">{a.code} · {a.title}</a>
          ))}
        </nav>
      </PageHeader>

      <div className="container-x space-y-24 md:space-y-32">
        {areas.map((a, i) => {
          const sws = software.filter((s) => s.areas.includes(a.id) && s.status !== 'ficha-pendiente');
          const prs = projects.filter((p) => p.areas.includes(a.id));
          const flip = i % 2 === 1;
          return (
            <section key={a.id} id={a.id} className="scroll-mt-28" aria-labelledby={`${a.id}-t`}>
              <div className="grid items-center gap-10 lg:grid-cols-12">
                <Reveal className={`lg:col-span-5 ${flip ? 'lg:order-2' : ''}`}>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-faint">{a.code}-{String(i + 1).padStart(2, '0')}</span>
                    <AreaGlyph id={a.id} className="h-6 w-10 text-accent" />
                  </div>
                  <h2 id={`${a.id}-t`} className="h-display mt-4 text-4xl sm:text-5xl">{a.title}</h2>
                  <p className="mt-5 leading-relaxed text-muted">{a.description}</p>
                  <ul className="mt-6 flex flex-wrap gap-2">{a.capabilities.map((c) => <li key={c} className="chip chip-accent">{c}</li>)}</ul>
                </Reveal>
                <Reveal className={`lg:col-span-7 ${flip ? 'lg:order-1' : ''}`} delay={0.08}>
                  <div className="panel relative overflow-hidden p-2">
                    <CornerFrame className="m-2" />
                    <Thumb src={a.image} alt={a.title} className="aspect-[16/10] w-full rounded-[12px] object-cover object-top" />
                  </div>
                </Reveal>
              </div>
              {(sws.length > 0 || prs.length > 0) && (
                <div className="mt-8 grid gap-3 md:grid-cols-2">
                  {sws.length > 0 && (
                    <div className="panel p-5">
                      <p className="font-mono text-[11px] tracking-[0.16em] text-faint">SOFTWARE</p>
                      <ul className="mt-3 divide-y divide-line">
                        {sws.map((s) => (
                          <li key={s.slug}>
                            <Link to={`/software/${s.slug}`} className="group flex items-center justify-between py-2.5 text-sm">
                              <span className="text-ink">{s.name}</span>
                              <ArrowUpRight size={15} className="text-faint group-hover:text-accent" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {prs.length > 0 && (
                    <div className="panel p-5">
                      <p className="font-mono text-[11px] tracking-[0.16em] text-faint">PROYECTOS</p>
                      <ul className="mt-3 divide-y divide-line">
                        {prs.map((p) => (
                          <li key={p.slug}>
                            <Link to={`/proyectos/${p.slug}`} className="group flex items-center justify-between gap-3 py-2.5 text-sm">
                              <span className="text-ink">{p.title}</span>
                              <span className="shrink-0 font-mono text-[10px] text-faint group-hover:text-accent">{kindLabel[p.kind].toUpperCase()}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </>
  );
}
