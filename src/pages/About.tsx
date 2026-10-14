import { ArrowRight, GraduationCap, Cpu, FlaskConical, HardHat } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { CornerFrame, DrawLine, Reveal, SocialIcon } from '../components/ui';
import { site, socials, toolStack } from '../data/site';
import { url } from '../lib/media';
import { useSeo } from '../lib/seo';

const pillars = [
  { icon: HardHat, title: 'Ingeniería', text: 'Fotogrametría con dron, topografía, hidrología, ingeniería vial, estructuras y cimentaciones aplicadas a expedientes técnicos.' },
  { icon: FlaskConical, title: 'Investigación', text: 'Métodos numéricos, análisis estadístico hidrológico y líneas de influencia, documentados en LaTeX.' },
  { icon: Cpu, title: 'Tecnología', text: 'Software de escritorio propio, interoperabilidad Python · LaTeX · Word · Excel y programas para HP Prime.' },
];

export default function About() {
  useSeo('Sobre mí', `${site.owner}: ingeniería civil, automatización y desarrollo de software técnico.`);
  return (
    <>
      <PageHeader eyebrow="Sobre mí" crumbs={[{ to: '/sobre-mi', label: 'Sobre mí' }]}
        title={<>{site.owner}</>}
        intro="Ingeniería civil, investigación y software técnico — TJGO INFRATEC · JUAN DE DIOS GEOLAB." />
      <section className="container-x">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="panel relative overflow-hidden p-2">
              <CornerFrame className="m-2" />
              <img src={url(site.photo)} alt={`Retrato de ${site.owner}`} className="aspect-[4/5] w-full rounded-[12px] object-cover object-top" />
            </div>
          </Reveal>
          <Reveal className="lg:col-span-7" delay={0.08}>
            <p className="eyebrow">Perfil profesional</p>
            <p className="mt-6 text-xl leading-relaxed text-ink sm:text-2xl">{site.bio}</p>
            <DrawLine className="mt-10 w-full" />
            <dl className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <dt className="flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] text-faint"><GraduationCap size={14} /> FORMACIÓN</dt>
                <dd className="mt-2 text-muted">Ingeniería Civil — {site.university}</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] tracking-[0.16em] text-faint">MARCAS</dt>
                <dd className="mt-2 text-muted">{site.labs.join(' · ')}</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] tracking-[0.16em] text-faint">FOTOGRAMETRÍA</dt>
                <dd className="mt-2 text-muted">3 años de experiencia · DJI Matrice 4E · licencia RPAS</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] tracking-[0.16em] text-faint">CÓDIGO ABIERTO</dt>
                <dd className="mt-2"><a className="text-accent hover:underline" href="https://github.com/TJGO-JDD" target="_blank" rel="noopener noreferrer">github.com/TJGO-JDD</a></dd>
              </div>
            </dl>
            <div className="mt-10 flex flex-wrap gap-2">
              {socials.map((s) => (
                <a key={s.id} href={s.href} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                  <SocialIcon id={s.id} size={14} /> {s.label}
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        <ul className="mt-24 grid gap-5 md:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 0.07}>
              <div className="panel panel-lit h-full p-7">
                <p.icon size={22} className="text-accent" aria-hidden />
                <h2 className="mt-6 text-2xl font-medium tracking-tight">{p.title}</h2>
                <p className="mt-3 leading-relaxed text-muted">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-24">
          <p className="eyebrow mb-6">Herramientas de trabajo</p>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {toolStack.map((t) => (
              <li key={t.name} className="panel group flex flex-col items-center gap-3 p-4 text-center">
                <span className="flex size-12 items-center justify-center rounded-[10px] bg-white/95 p-1.5">
                  <img src={url(t.img)} alt="" loading="lazy" className="max-h-full max-w-full object-contain" />
                </span>
                <span className="text-xs text-muted">{t.name}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="mt-20 flex flex-wrap gap-3">
          <Link to="/software" className="btn btn-primary">Ver software <ArrowRight size={16} /></Link>
          <Link to="/contacto" className="btn btn-ghost">Contactar</Link>
        </div>
      </section>
    </>
  );
}
