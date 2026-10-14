import { Activity, Calculator, LineChart, Mountain, Ruler } from 'lucide-react';
import { lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { useSeo } from '../lib/seo';

const tools = {
  vigas: { label: 'Vigas · V y M', icon: Ruler, C: lazy(() => import('../lab/BeamTool')) },
  influencia: { label: 'Líneas de influencia', icon: LineChart, C: lazy(() => import('../lab/InfluenceTool')) },
  sdof: { label: 'Oscilador 1 GDL', icon: Activity, C: lazy(() => import('../lab/SdofTool')) },
  terreno: { label: 'Terreno 3D', icon: Mountain, C: lazy(() => import('../lab/TerrainTool')) },
  unidades: { label: 'Conversor', icon: Calculator, C: lazy(() => import('../lab/UnitTool')) },
} as const;
type ToolId = keyof typeof tools;

export default function Lab() {
  useSeo('Engineering Lab', 'TJGO Engineering Lab: análisis de vigas, líneas de influencia HL-93, oscilador SDOF, terreno 3D y conversor de unidades.');
  const [params, setParams] = useSearchParams();
  const id = (params.get('tool') as ToolId) in tools ? (params.get('tool') as ToolId) : 'vigas';
  const Tool = tools[id].C;

  return (
    <>
      <PageHeader eyebrow="TJGO Engineering Lab" crumbs={[{ to: '/lab', label: 'Lab' }]}
        title={<>Laboratorio <span className="text-muted">interactivo.</span></>}
        intro="Herramientas de demostración con cálculos correctos, ecuaciones y unidades explícitas. Los resultados se verifican contra soluciones cerradas (npm test)." />
      <section className="container-x">
        <div role="tablist" aria-label="Herramientas" className="scrollbar-none -mx-4 mb-6 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {(Object.keys(tools) as ToolId[]).map((k) => {
            const T = tools[k];
            const active = k === id;
            return (
              <button key={k} role="tab" aria-selected={active} aria-controls="lab-panel" onClick={() => setParams({ tool: k }, { replace: true })}
                className={`flex shrink-0 items-center gap-2 rounded-[11px] border px-4 py-2.5 text-sm transition-colors ${active ? 'border-accent/60 bg-accent/10 text-accent shadow-[0_0_30px_-10px_rgba(0,230,160,.6)]' : 'border-line text-muted hover:text-ink'}`}>
                <T.icon size={15} aria-hidden /> {T.label}
              </button>
            );
          })}
        </div>
        <div id="lab-panel" role="tabpanel">
          <Suspense fallback={<div className="panel flex h-96 items-center justify-center font-mono text-xs tracking-[0.2em] text-faint">CARGANDO HERRAMIENTA…</div>}>
            <Tool />
          </Suspense>
        </div>
      </section>
    </>
  );
}
