import { Link } from 'react-router-dom';
import { nav, site, socials } from '../data/site';
import { software } from '../data/software';
import { Logo } from './Navbar';
import { SocialIcon } from './ui';

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-line">
      <div className="glow-ambient left-1/2 top-0 h-60 w-[60%] -translate-x-1/2 -translate-y-1/2 opacity-40" />
      <div className="container-x relative grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
            {site.tagline}. Plataforma profesional de {site.owner}: ingeniería civil, investigación y software técnico.
          </p>
          <p className="mt-4 font-mono text-[11px] tracking-[0.16em] text-faint">{site.labs.join('  ·  ')}</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {socials.map((s) => (
              <li key={s.id}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className="flex size-10 items-center justify-center rounded-[10px] border border-line text-muted transition-colors hover:border-accent/50 hover:text-accent">
                  <SocialIcon id={s.id} size={16} />
                </a>
              </li>
            ))}
          </ul>
        </div>
        <nav aria-label="Secciones" className="md:col-span-3">
          <h3 className="font-mono text-[11px] tracking-[0.18em] text-faint">SITIO</h3>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 md:grid-cols-1">
            {nav.map((n) => (
              <li key={n.to}><Link className="text-sm text-muted hover:text-ink" to={n.to}>{n.label}</Link></li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Software" className="md:col-span-4">
          <h3 className="font-mono text-[11px] tracking-[0.18em] text-faint">SOFTWARE</h3>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5">
            {software.filter((s) => s.status !== 'ficha-pendiente').slice(0, 10).map((s) => (
              <li key={s.slug}><Link className="text-sm text-muted hover:text-ink" to={`/software/${s.slug}`}>{s.name}</Link></li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-line">
        <div className="container-x flex flex-col gap-2 py-6 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.owner}. Todos los derechos reservados.</p>
          <p className="font-mono tracking-wider">4 8 15 16 23 42</p>
        </div>
      </div>
    </footer>
  );
}
