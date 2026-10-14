import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import {
  ArrowUpRight, Download, FileText, Github, HardDrive, Instagram, Facebook, Linkedin,
  MessageCircle, Music2, Play, Youtube, Globe, Disc3,
} from 'lucide-react';
import type { ExtLink, LinkKind, SoftwareStatus } from '../data/types';

/* ───────── Reveal al hacer scroll ───────── */
export function Reveal({
  children, delay = 0, y = 18, className = '', as = 'div',
}: { children: ReactNode; delay?: number; y?: number; className?: string; as?: 'div' | 'section' | 'li' | 'article' }) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.75, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
}

/* ───────── Línea técnica que se dibuja ───────── */
export function DrawLine({ className = '' }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      aria-hidden
      className={`block h-px origin-left bg-gradient-to-r from-accent/70 via-accent/20 to-transparent ${className}`}
      initial={reduce ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

/* ───────── Encabezado de sección ───────── */
export function SectionHeader({
  index, eyebrow, title, intro, action, align = 'left',
}: { index?: string; eyebrow: string; title: ReactNode; intro?: ReactNode; action?: ReactNode; align?: 'left' | 'center' }) {
  return (
    <Reveal className={`mb-10 md:mb-14 ${align === 'center' ? 'text-center mx-auto max-w-3xl' : ''}`}>
      <div className={`flex items-center gap-3 ${align === 'center' ? 'justify-center' : ''}`}>
        {index && <span className="font-mono text-[11px] text-faint">{index}</span>}
        <span className="eyebrow">{eyebrow}</span>
      </div>
      <div className={`mt-4 flex flex-col gap-6 ${align === 'left' ? 'md:flex-row md:items-end md:justify-between' : ''}`}>
        <div className={align === 'left' ? 'max-w-3xl' : ''}>
          <h2 className="h-display text-[2.1rem] sm:text-5xl lg:text-[3.6rem] text-ink">{title}</h2>
          {intro && <p className="mt-5 text-base sm:text-lg leading-relaxed text-muted max-w-2xl">{intro}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </Reveal>
  );
}

/* ───────── Enlaces externos ───────── */
const linkIcon: Record<LinkKind, typeof FileText> = {
  github: Github, pdf: FileText, drive: HardDrive, youtube: Youtube, demo: Play,
  download: Download, whatsapp: MessageCircle, web: Globe,
};

export function ExtLinkButton({ link, primary = false, small = false }: { link: ExtLink; primary?: boolean; small?: boolean }) {
  const Icon = linkIcon[link.kind];
  const external = /^https?:/.test(link.href);
  return (
    <a
      href={encodeURI(decodeURI(link.href))}
      target={external || link.kind === 'pdf' ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={`btn ${primary ? 'btn-primary' : 'btn-ghost'} ${small ? 'btn-sm' : ''}`}
    >
      <Icon size={small ? 14 : 16} aria-hidden />
      {link.label}
      {external && <ArrowUpRight size={14} className="opacity-60" aria-hidden />}
    </a>
  );
}

/* ───────── Estado de software ───────── */
const statusMap: Record<SoftwareStatus, { label: string; cls: string }> = {
  estable: { label: 'Disponible', cls: 'chip-accent' },
  'en-desarrollo': { label: 'En desarrollo', cls: 'text-[#e8d38a] border-[#e8d38a]/30' },
  'ficha-pendiente': { label: 'Ficha en preparación', cls: '' },
};
export function StatusChip({ status }: { status: SoftwareStatus }) {
  const s = statusMap[status];
  return (
    <span className={`chip ${s.cls}`}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {s.label}
    </span>
  );
}

/* ───────── Íconos de redes ───────── */
function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.77L17.75 3Zm-1.08 16.2h1.7L7.4 4.7H5.57l11.1 14.5Z" />
    </svg>
  );
}
export function SocialIcon({ id, size = 16 }: { id: string; size?: number }) {
  switch (id) {
    case 'github': return <Github size={size} aria-hidden />;
    case 'youtube': return <Youtube size={size} aria-hidden />;
    case 'linkedin': return <Linkedin size={size} aria-hidden />;
    case 'instagram': return <Instagram size={size} aria-hidden />;
    case 'facebook': return <Facebook size={size} aria-hidden />;
    case 'whatsapp': return <MessageCircle size={size} aria-hidden />;
    case 'tiktok': return <Music2 size={size} aria-hidden />;
    case 'spotify': return <Disc3 size={size} aria-hidden />;
    case 'x': return <XIcon size={size} />;
    default: return <Globe size={size} aria-hidden />;
  }
}

/* ───────── Marco técnico con esquinas ───────── */
export function CornerFrame({ className = '' }: { className?: string }) {
  const c = 'absolute size-3 border-accent/60';
  return (
    <span aria-hidden className={`pointer-events-none absolute inset-0 ${className}`}>
      <span className={`${c} left-0 top-0 border-l border-t`} />
      <span className={`${c} right-0 top-0 border-r border-t`} />
      <span className={`${c} left-0 bottom-0 border-l border-b`} />
      <span className={`${c} right-0 bottom-0 border-r border-b`} />
    </span>
  );
}
