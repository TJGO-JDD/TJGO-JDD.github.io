import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export function PageHeader({ eyebrow, title, intro, crumbs = [], children }: {
  eyebrow: string; title: ReactNode; intro?: ReactNode; crumbs?: { to: string; label: string }[]; children?: ReactNode;
}) {
  const reduce = useReducedMotion();
  const anim = (d: number) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: d, ease: [0.22, 1, 0.36, 1] as const },
  });
  return (
    <section className="relative isolate overflow-hidden pt-[68px]">
      <div className="tech-grid mask-fade absolute inset-0 -z-10" />
      <div className="glow-ambient -z-10 right-[-5%] top-[-10%] h-[460px] w-[640px] opacity-70" />
      <div className="container-x pb-12 pt-14 md:pb-16 md:pt-20">
        {crumbs.length > 0 && (
          <motion.nav {...anim(0)} aria-label="Ruta" className="mb-8">
            <ol className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-faint">
              <li><Link to="/" className="hover:text-ink">INICIO</Link></li>
              {crumbs.map((c) => (
                <li key={c.to} className="flex items-center gap-1.5"><ChevronRight size={12} /><Link to={c.to} className="hover:text-ink">{c.label.toUpperCase()}</Link></li>
              ))}
            </ol>
          </motion.nav>
        )}
        <motion.p {...anim(0.05)} className="eyebrow flex items-center gap-3"><span className="h-px w-8 bg-accent/60" />{eyebrow}</motion.p>
        <motion.h1 {...anim(0.1)} className="h-display mt-6 max-w-5xl text-[2.6rem] sm:text-6xl lg:text-7xl">{title}</motion.h1>
        {intro && <motion.p {...anim(0.18)} className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{intro}</motion.p>}
        {children && <motion.div {...anim(0.26)} className="mt-8">{children}</motion.div>}
      </div>
    </section>
  );
}
