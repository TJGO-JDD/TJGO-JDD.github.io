import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { SoftwareCard, SoftwareCover } from '../components/cards';
import { Gallery } from '../components/Gallery';
import { PageHeader } from '../components/PageHeader';
import { ExtLinkButton, Reveal, StatusChip } from '../components/ui';
import { areas } from '../data/areas';
import { projects } from '../data/projects';
import { findSoftware, software } from '../data/software';
import { useSeo } from '../lib/seo';
import NotFound from './NotFound';

export default function SoftwareDetail() {
  const { slug = '' } = useParams();
  const sw = findSoftware(slug);
  useSeo(sw?.name, sw?.summary);
  if (!sw) return <NotFound />;

  const i = software.indexOf(sw);
  const prev = software[(i - 1 + software.length) % software.length];
  const next = software[(i + 1) % software.length];
  const related = software.filter((s) => s.slug !== sw.slug && s.category === sw.category && s.status !== 'ficha-pendiente').slice(0, 3);
  const relProjects = projects.filter((p) => p.relatedSoftware === sw.slug);

  return (
    <>
      <PageHeader eyebrow={sw.category} crumbs={[{ to: '/software', label: 'Software' }, { to: `/software/${sw.slug}`, label: sw.name }]}
        title={<>{sw.name} {sw.version && <span className="font-mono text-2xl text-faint sm:text-3xl">{sw.version}</span>}</>}
        intro={sw.summary}>
        <div className="flex flex-wrap items-center gap-2">
          <StatusChip status={sw.status} />
          {sw.areas.map((a) => <span key={a} className="chip">{areas.find((x) => x.id === a)?.title}</span>)}
        </div>
        {sw.links.length > 0 && (
          <div className="mt-7 flex flex-wrap gap-3">
            {sw.links.map((l, k) => <ExtLinkButton key={l.href + k} link={l} primary={k === 0} />)}
          </div>
        )}
      </PageHeader>

      <section className="container-x">
        <Reveal>
          <div className="panel panel-lit overflow-hidden">
            <SoftwareCover sw={sw} eager className="aspect-[16/9] sm:aspect-[16/8]" />
          </div>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow">Descripción</p>
            <div className="prose-tjgo mt-5 text-[1.02rem]">
              {sw.description.map((p) => <p key={p}>{p}</p>)}
            </div>
            {sw.features && (
              <>
                <p className="eyebrow mt-10">Características</p>
                <ul className="prose-tjgo mt-5">{sw.features.map((f) => <li key={f}>{f}</li>)}</ul>
              </>
            )}
          </Reveal>
          <Reveal className="lg:col-span-5" delay={0.08}>
            <dl className="panel divide-y divide-line">
              <div className="p-5">
                <dt className="font-mono text-[11px] tracking-[0.16em] text-faint">TECNOLOGÍAS</dt>
                <dd className="mt-3 flex flex-wrap gap-2">
                  {sw.tech.length ? sw.tech.map((t) => <span key={t} className="chip chip-accent normal-case tracking-normal">{t}</span>) : <span className="text-sm text-muted">Por documentar</span>}
                </dd>
              </div>
              <div className="p-5">
                <dt className="font-mono text-[11px] tracking-[0.16em] text-faint">CATEGORÍA</dt>
                <dd className="mt-2 text-ink">{sw.category}</dd>
              </div>
              <div className="p-5">
                <dt className="font-mono text-[11px] tracking-[0.16em] text-faint">CAPTURAS</dt>
                <dd className="mt-2 text-ink">{sw.images.length || '—'}</dd>
              </div>
              <div className="p-5">
                <dt className="font-mono text-[11px] tracking-[0.16em] text-faint">AUTOR</dt>
                <dd className="mt-2 text-ink">Ñol Iván Juan de Dios Rojas (TJGO)</dd>
              </div>
            </dl>
          </Reveal>
        </div>

        {sw.youtubeId && (
          <Reveal className="mt-16">
            <p className="eyebrow mb-5">Demostración</p>
            <div className="panel aspect-video overflow-hidden">
              <iframe className="h-full w-full" src={`https://www.youtube-nocookie.com/embed/${sw.youtubeId}`} title={`Video de ${sw.name}`} loading="lazy"
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            </div>
          </Reveal>
        )}

        {sw.images.length > 1 && (
          <Reveal className="mt-16">
            <div className="mb-5 flex items-end justify-between">
              <p className="eyebrow">Galería</p>
              <p className="font-mono text-[11px] text-faint">{sw.images.length} capturas · clic para ampliar</p>
            </div>
            <Gallery images={sw.images} title={sw.name} />
          </Reveal>
        )}

        {relProjects.length > 0 && (
          <Reveal className="mt-16">
            <p className="eyebrow mb-5">Usado en</p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {relProjects.map((p) => (
                <li key={p.slug}>
                  <Link to={`/proyectos/${p.slug}`} className="panel card-hover flex items-center justify-between p-5">
                    <span><span className="block text-ink">{p.title}</span><span className="text-sm text-muted">{p.discipline}</span></span>
                    <ArrowRight size={16} className="text-accent" />
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {related.length > 0 && (
          <div className="mt-20">
            <p className="eyebrow mb-6">Más en {sw.category}</p>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((s) => <li key={s.slug}><SoftwareCard sw={s} /></li>)}
            </ul>
          </div>
        )}

        <nav aria-label="Navegación entre programas" className="mt-20 grid gap-3 border-t border-line pt-8 sm:grid-cols-2">
          <Link to={`/software/${prev.slug}`} className="panel card-hover flex items-center gap-3 p-5">
            <ArrowLeft size={16} className="text-faint" />
            <span><span className="block font-mono text-[10px] text-faint">ANTERIOR</span>{prev.name}</span>
          </Link>
          <Link to={`/software/${next.slug}`} className="panel card-hover flex items-center justify-end gap-3 p-5 text-right">
            <span><span className="block font-mono text-[10px] text-faint">SIGUIENTE</span>{next.name}</span>
            <ArrowRight size={16} className="text-faint" />
          </Link>
        </nav>
      </section>
    </>
  );
}
