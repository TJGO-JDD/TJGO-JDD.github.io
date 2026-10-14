import { AnimatePresence, motion } from 'motion/react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { nav, socialHref, socials } from '../data/site';
import { SocialIcon } from './ui';

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-2.5" aria-label="TJGO — inicio">
      <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden className="shrink-0">
        <rect x="0.5" y="0.5" width="29" height="29" rx="8" fill="#0D1915" stroke="rgba(150,255,210,0.22)" />
        {/* Cercha Warren estilizada */}
        <path d="M5 20 H25 M7.5 11 H22.5 M5 20 L7.5 11 L11.25 20 L15 11 L18.75 20 L22.5 11 L25 20" fill="none" stroke="#00E6A0" strokeWidth="1.5" strokeLinejoin="round" />
        <circle cx="15" cy="11" r="1.6" fill="#3FFFC1" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="text-[19px] font-semibold tracking-[-0.04em] text-ink">
          TJG<span className="text-accent">O</span>
        </span>
        {!compact && (
          <span className="mt-1 hidden font-mono text-[8.5px] tracking-[0.22em] text-faint sm:block">ENGINEERING · TECH</span>
        )}
      </span>
    </Link>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled || open ? 'border-b border-line bg-bg/75 backdrop-blur-xl' : 'border-b border-transparent'
      }`}
    >
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 btn btn-primary btn-sm">
        Saltar al contenido
      </a>
      <div className="container-x flex h-[68px] items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Principal" className="hidden xl:block">
          <ul className="flex items-center rounded-[11px] border border-line bg-surface/50 p-1 backdrop-blur">
            {nav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `relative block rounded-[8px] px-3.5 py-2 text-[13px] transition-colors ${
                      isActive ? 'text-ink' : 'text-muted hover:text-ink'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          layoutId="nav-active"
                          className="absolute inset-0 rounded-[8px] border border-line-strong bg-surface-2"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                        />
                      )}
                      <span className="relative">{item.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {['github', 'youtube'].map((id) => (
            <a
              key={id}
              href={socialHref(id)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={id === 'github' ? 'GitHub' : 'YouTube'}
              className="hidden size-9 items-center justify-center rounded-[9px] border border-line text-muted transition-colors hover:border-line-strong hover:text-ink sm:flex"
            >
              <SocialIcon id={id} size={16} />
            </a>
          ))}
          <Link to="/contacto" className="btn btn-primary btn-sm hidden sm:inline-flex">
            Contactar
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
            className="flex size-10 items-center justify-center rounded-[10px] border border-line-strong text-ink xl:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="xl:hidden h-[calc(100dvh-68px)] overflow-y-auto border-t border-line bg-bg/95 backdrop-blur-xl"
          >
            <nav aria-label="Menú móvil" className="container-x py-6">
              <ul className="divide-y divide-line border-y border-line">
                {nav.map((item, i) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === '/'}
                      className={({ isActive }) =>
                        `flex items-center justify-between py-4 text-xl tracking-tight ${isActive ? 'text-accent' : 'text-ink'}`
                      }
                    >
                      <span className="flex items-baseline gap-4">
                        <span className="font-mono text-[11px] text-faint">{String(i + 1).padStart(2, '0')}</span>
                        {item.label}
                      </span>
                      <ArrowRight size={16} className="text-faint" />
                    </NavLink>
                  </li>
                ))}
              </ul>
              <Link to="/contacto" className="btn btn-primary mt-6 w-full">Contactar</Link>
              <div className="mt-6 flex flex-wrap gap-2">
                {socials.slice(0, 7).map((s) => (
                  <a key={s.id} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                    className="flex size-11 items-center justify-center rounded-[10px] border border-line text-muted hover:text-ink">
                    <SocialIcon id={s.id} size={17} />
                  </a>
                ))}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
