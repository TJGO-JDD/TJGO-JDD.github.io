import { useState } from 'react';
import { ProjectFeature } from '../components/cards';
import { PageHeader } from '../components/PageHeader';
import { Reveal } from '../components/ui';
import { kindLabel, projects } from '../data/projects';
import type { WorkKind } from '../data/types';
import { useSeo } from '../lib/seo';

export default function Projects() {
  useSeo('Proyectos', 'Selected engineering work: fotogrametría con dron, análisis de cuencas, estudios de tráfico, puentes y cimentaciones.');
  const [kind, setKind] = useState<WorkKind | 'todos'>('todos');
  const list = projects.filter((p) => kind === 'todos' || p.kind === kind);
  const opts: (WorkKind | 'todos')[] = ['todos', 'profesional', 'desarrollo-propio', 'academico'];

  return (
    <>
      <PageHeader eyebrow="Selected Engineering Work" crumbs={[{ to: '/proyectos', label: 'Proyectos' }]}
        title={<>Proyectos <span className="text-muted">de ingeniería.</span></>}
        intro="Cada proyecto indica si es un trabajo profesional ejecutado, un desarrollo propio o un trabajo académico.">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por tipo">
          {opts.map((k) => (
            <button key={k} onClick={() => setKind(k)} aria-pressed={kind === k}
              className={`rounded-[9px] border px-3.5 py-2 text-[13px] transition-colors ${kind === k ? 'border-accent/60 bg-accent/10 text-accent' : 'border-line text-muted hover:text-ink'}`}>
              {k === 'todos' ? 'Todos' : kindLabel[k]}
              <span className="ml-2 font-mono text-[10px] text-faint">{k === 'todos' ? projects.length : projects.filter((p) => p.kind === k).length}</span>
            </button>
          ))}
        </div>
      </PageHeader>
      <section className="container-x space-y-6">
        {list.map((p, i) => <Reveal key={p.slug}><ProjectFeature p={p} index={i} /></Reveal>)}
      </section>
    </>
  );
}
