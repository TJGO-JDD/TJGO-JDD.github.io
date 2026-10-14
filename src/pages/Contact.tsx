import { ArrowUpRight, MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Reveal, SocialIcon } from '../components/ui';
import { socials } from '../data/site';
import { useSeo } from '../lib/seo';

const WA = '51917726087';
const topics = ['Fotogrametría / topografía con dron', 'Software TJGO', 'Automatización de reportes', 'Plantillas LaTeX', 'Otro'];

export default function Contact() {
  useSeo('Contacto', 'Contacta a TJGO por WhatsApp, LinkedIn o redes sociales.');
  const [name, setName] = useState('');
  const [topic, setTopic] = useState(topics[0]);
  const [msg, setMsg] = useState('');
  const text = `Hola, soy ${name || '…'}. Deseo información sobre: ${topic}.${msg ? `\n\n${msg}` : ''}`;
  const href = `https://wa.me/${WA}?text=${encodeURIComponent(text)}`;

  return (
    <>
      <PageHeader eyebrow="Contacto" crumbs={[{ to: '/contacto', label: 'Contacto' }]}
        title={<>Hablemos de <span className="text-gradient">tu proyecto.</span></>}
        intro="La forma más rápida es WhatsApp. El formulario prepara el mensaje y lo abre directamente en la aplicación." />
      <section className="container-x grid gap-6 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <form className="panel panel-lit space-y-5 p-6 sm:p-8" onSubmit={(e) => { e.preventDefault(); window.open(href, '_blank', 'noopener'); }}>
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-[10px] bg-accent/10 text-accent"><MessageCircle size={18} /></span>
              <div><p className="font-medium">Mensaje por WhatsApp</p><p className="font-mono text-xs text-faint">+51 917 726 087</p></div>
            </div>
            <div>
              <label htmlFor="c-name" className="label">Nombre</label>
              <input id="c-name" className="field mt-1.5 font-sans" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
            </div>
            <div>
              <label htmlFor="c-topic" className="label">Tema</label>
              <select id="c-topic" className="field mt-1.5 font-sans" value={topic} onChange={(e) => setTopic(e.target.value)}>
                {topics.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="c-msg" className="label">Detalle (opcional)</label>
              <textarea id="c-msg" rows={5} className="field mt-1.5 py-2.5 font-sans" value={msg} onChange={(e) => setMsg(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary w-full sm:w-auto">Abrir en WhatsApp <Send size={15} /></button>
          </form>
        </Reveal>
        <Reveal className="lg:col-span-5" delay={0.08}>
          <ul className="panel divide-y divide-line">
            {socials.map((s) => (
              <li key={s.id}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 px-5 py-4">
                  <span className="flex size-9 items-center justify-center rounded-[9px] border border-line text-muted group-hover:border-accent/50 group-hover:text-accent"><SocialIcon id={s.id} /></span>
                  <span className="flex-1 text-ink">{s.label}</span>
                  <ArrowUpRight size={16} className="text-faint group-hover:text-accent" />
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>
    </>
  );
}
