import { AnimatePresence, motion } from 'motion/react';
import { Search, X } from 'lucide-react';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SoftwareCard } from '../components/cards';
import { PageHeader } from '../components/PageHeader';
import { software, softwareCategories } from '../data/software';
import { useSeo } from '../lib/seo';

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export default function SoftwareCatalog() {
  useSeo('Software', 'Catálogo de software técnico TJGO: HYDROTJGO, MAPS TJGO, TRAFIX, TJGO Bridge Tools, BMEX, programas HP Prime y más.');
  const [params, setParams] = useSearchParams();
  const q = params.get('q') ?? '';
  const cat = params.get('cat') ?? 'Todos';
  const tech = params.get('tech') ?? '';

  const set = (k: string, v: string) => {
    const p = new URLSearchParams(params);
    if (v && v !== 'Todos') p.set(k, v); else p.delete(k);
    setParams(p, { replace: true });
  };

  const techs = useMemo(() => {
    const m = new Map<string, number>();
    software.forEach((s) => s.tech.forEach((t) => { const k = t.split(' ')[0]; m.set(k, (m.get(k) ?? 0) + 1); }));
    return [...m.entries()].filter(([, n]) => n > 1).map(([t]) => t);
  }, []);

  const list = useMemo(() => {
    const nq = norm(q);
    return software.filter((s) =>
      (cat === 'Todos' || s.category === cat) &&
      (!tech || s.tech.some((t) => t.startsWith(tech))) &&
      (!nq || norm([s.name, s.summary, s.category, ...s.tech, ...(s.features ?? [])].join(' ')).includes(nq)),
    ).sort((a, b) => Number(a.status === 'ficha-pendiente') - Number(b.status === 'ficha-pendiente'));
  }, [q, cat, tech]);

  return (
    <>
      <PageHeader eyebrow="Engineered Software" crumbs={[{ to: '/software', label: 'Software' }]}
        title={<>Software TJGO <span className="text-muted">para ingeniería civil.</span></>}
        intro="Programas de escritorio, motores de reportes y herramientas de cálculo. Cada ficha incluye capturas auténticas, tecnologías verificadas y enlaces reales." />

      <section className="container-x" aria-label="Catálogo">
        <div className="panel z-20 flex md:sticky md:top-[76px] flex-col gap-3 p-3 md:flex-row md:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Buscar software</span>
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-faint" aria-hidden />
            <input type="search" value={q} onChange={(e) => set('q', e.target.value)} placeholder="Buscar: cuencas, ESAL, LaTeX, HP Prime…"
              className="field pl-9 font-sans" />
          </label>
          <div className="scrollbar-none -mx-1 flex gap-1.5 overflow-x-auto px-1" role="group" aria-label="Filtrar por categoría">
            {['Todos', ...softwareCategories].map((c) => (
              <button key={c} onClick={() => set('cat', c)} aria-pressed={cat === c}
                className={`shrink-0 rounded-[9px] border px-3 py-2 text-[13px] transition-colors ${cat === c ? 'border-accent/60 bg-accent/10 text-accent' : 'border-line text-muted hover:text-ink'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar por tecnología">
          <span className="mr-1 font-mono text-[11px] text-faint">TECNOLOGÍA</span>
          {techs.map((t) => (
            <button key={t} onClick={() => set('tech', tech === t ? '' : t)} aria-pressed={tech === t}
              className={`chip cursor-pointer ${tech === t ? 'chip-accent' : 'hover:text-ink'}`}>{t}</button>
          ))}
          {(q || cat !== 'Todos' || tech) && (
            <button onClick={() => setParams({}, { replace: true })} className="ml-auto flex items-center gap-1 text-xs text-muted hover:text-ink">
              Limpiar filtros <X size={13} />
            </button>
          )}
        </div>

        <p className="mt-8 font-mono text-[11px] text-faint" aria-live="polite">{list.length} RESULTADO{list.length === 1 ? '' : 'S'}</p>
        <motion.ul layout className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((s) => (
              <motion.li key={s.slug} layout initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.3 }}>
                <SoftwareCard sw={s} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
        {list.length === 0 && (
          <div className="panel mt-4 p-10 text-center text-muted">No hay programas que coincidan con la búsqueda.</div>
        )}
      </section>
    </>
  );
}
