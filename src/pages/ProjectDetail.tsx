import { ArrowRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { Gallery, Thumb } from '../components/Gallery';
import { PageHeader } from '../components/PageHeader';
import { ExtLinkButton, Reveal } from '../components/ui';
import { findProject, kindLabel, projects } from '../data/projects';
import { findSoftware } from '../data/software';
import { useSeo } from '../lib/seo';
import NotFound from './NotFound';

export default function ProjectDetail() {
  const { slug = '' } = useParams();
  const p = findProject(slug);
  useSeo(p?.title, p?.summary);
  if (!p) return <NotFound />;
  const sw = p.relatedSoftware ? findSoftware(p.relatedSoftware) : undefined;
  const others = projects.filter((x) => x.slug !== p.slug).slice(0, 3);

  return (
    <>
      <PageHeader eyebrow={p.discipline} crumbs={[{ to: '/proyectos', label: 'Proyectos' }, { to: `/proyectos/${p.slug}`, label: p.title }]}
        title={p.title} intro={p.summary}>
        <div className="flex flex-wrap gap-2">
          <span className={`chip ${p.kind === 'profesional' ? 'chip-accent' : ''}`}>{kindLabel[p.kind]}</span>
          {p.tags.map((t) => <span key={t} className="chip">{t}</span>)}
        </div>
        {p.links.length > 0 && (
          <div className="mt-7 flex flex-wrap gap-3">{p.links.map((l, k) => <ExtLinkButton key={l.href} link={l} primary={k === 0} />)}</div>
        )}
      </PageHeader>

      <section className="container-x">
        <Reveal>
          <div className="panel overflow-hidden">
            <Thumb src={p.images[0]} alt={p.title} eager className="aspect-[16/8] w-full object-cover" />
          </div>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <Reveal className="prose-tjgo text-[1.02rem] lg:col-span-7">
            {p.body.map((b) => <p key={b}>{b}</p>)}
          </Reveal>
          {sw && (
            <Reveal className="lg:col-span-5" delay={0.08}>
              <Link to={`/software/${sw.slug}`} className="panel panel-lit card-hover group block p-6">
                <p className="font-mono text-[11px] tracking-[0.16em] text-faint">HERRAMIENTA</p>
                <p className="mt-2 text-xl font-medium tracking-tight">{sw.name}</p>
                <p className="mt-2 text-sm text-muted">{sw.summary}</p>
                <span className="mt-5 flex items-center gap-1.5 text-sm text-accent">Ver ficha <ArrowRight size={14} /></span>
              </Link>
            </Reveal>
          )}
        </div>

        {p.bullets && (
          <ul className="mt-14 grid gap-5 md:grid-cols-2">
            {p.bullets.map((b, i) => (
              <Reveal as="li" key={b.title} delay={(i % 2) * 0.06}>
                <div className="panel h-full p-6">
                  <p className="font-mono text-[11px] tracking-[0.16em] text-accent">{String(i + 1).padStart(2, '0')} · {b.title.toUpperCase()}</p>
                  <ul className="prose-tjgo mt-4">{b.items.map((it) => <li key={it}>{it}</li>)}</ul>
                </div>
              </Reveal>
            ))}
          </ul>
        )}

        {p.images.length > 1 && (
          <Reveal className="mt-16">
            <p className="eyebrow mb-5">Galería</p>
            <Gallery images={p.images} title={p.title} columns={2} />
          </Reveal>
        )}

        <div className="mt-20 border-t border-line pt-10">
          <p className="eyebrow mb-6">Otros proyectos</p>
          <ul className="grid gap-3 md:grid-cols-3">
            {others.map((o) => (
              <li key={o.slug}>
                <Link to={`/proyectos/${o.slug}`} className="panel card-hover group block overflow-hidden">
                  <Thumb src={o.images[0]} alt="" className="aspect-[16/9] w-full object-cover opacity-80 transition-opacity group-hover:opacity-100" />
                  <div className="p-5">
                    <p className="font-mono text-[10px] text-faint">{kindLabel[o.kind].toUpperCase()}</p>
                    <p className="mt-1 text-ink">{o.title}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
