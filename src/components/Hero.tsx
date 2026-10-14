import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { lazy, Suspense, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { software } from '../data/software';
import { canUseWebGL, useMediaQuery } from '../lib/useMedia';
import { BridgeSVG } from '../three/BridgeSVG';

const BridgeScene = lazy(() => import('../three/BridgeScene'));

export function Hero() {
  const reduce = useReducedMotion();
  const desktop = useMediaQuery('(min-width: 1024px)');
  const [webgl, setWebgl] = useState(false);
  useEffect(() => setWebgl(canUseWebGL()), []);
  const show3D = desktop && webgl;

  const nSoftware = software.filter((s) => s.status !== 'ficha-pendiente').length;
  const ease = [0.22, 1, 0.36, 1] as const;
  const item = (d: number) => ({
    initial: reduce ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay: 0.15 + d, ease },
  });

  return (
    <section className="relative isolate overflow-hidden pt-[68px] lg:min-h-[100svh]" aria-labelledby="hero-title">
      {/* fondo: retícula técnica + iluminación */}
      <div className="tech-grid mask-fade absolute inset-0 -z-10" />
      <div className="glow-ambient -z-10 right-[-10%] top-[12%] h-[620px] w-[820px] opacity-80" />
      <div className="glow-ambient -z-10 left-[-20%] bottom-[-30%] h-[520px] w-[620px] opacity-40" />
      <div className="noise absolute inset-0 -z-10" />

      {/* visual 3D (escritorio) */}
      {show3D && (
        <motion.div
          className="absolute inset-y-0 right-0 hidden w-[64%] lg:block"
          style={{ maskImage: 'linear-gradient(to right, transparent, #000 22%), linear-gradient(to top, transparent, #000 25%)', maskComposite: 'intersect', WebkitMaskImage: 'linear-gradient(to right, transparent, #000 22%), linear-gradient(to top, transparent, #000 25%)', WebkitMaskComposite: 'source-in' }}
          initial={reduce ? false : { opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, delay: 0.3, ease }}
        >
          <Suspense fallback={<BridgeSVG className="absolute right-10 top-1/2 w-[85%] -translate-y-1/2 opacity-60" />}>
            <BridgeScene />
          </Suspense>
        </motion.div>
      )}

      <div className="container-x relative flex flex-col lg:min-h-[calc(100svh-68px)]">
        <div className="relative z-10 flex flex-1 flex-col justify-center py-14 lg:max-w-[50%] lg:py-16">
          <motion.p {...item(0)} className="eyebrow flex items-center gap-3">
            <span className="h-px w-8 bg-accent/60" /> TJGO — Civil Engineering, Research & Technology
          </motion.p>
          <motion.h1 {...item(0.08)} id="hero-title" className="h-display mt-7 text-[2.6rem] uppercase leading-[0.95] sm:text-6xl lg:text-[3.9rem] xl:text-[4.7rem]">
            Ingeniería civil
            <br />
            <span className="text-gradient">&amp; tecnología</span>
          </motion.h1>
          <motion.p {...item(0.18)} className="mt-7 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Desarrollo de soluciones computacionales, automatización y herramientas tecnológicas aplicadas a la ingeniería civil.
          </motion.p>
          <motion.div {...item(0.26)} className="mt-9 flex flex-wrap gap-3">
            <Link to="/proyectos" className="btn btn-primary">
              Explorar proyectos <ArrowRight size={16} />
            </Link>
            <Link to="/software" className="btn btn-ghost">Conocer software TJGO</Link>
          </motion.div>

          <motion.dl {...item(0.36)} className="mt-14 grid max-w-lg grid-cols-3 border-t border-line pt-6">
            {[
              [String(nSoftware), 'programas y herramientas propias'],
              ['3', 'años en fotogrametría con dron'],
              ['6', 'áreas de ingeniería'],
            ].map(([n, l]) => (
              <div key={l} className="pr-4">
                <dt className="sr-only">{l}</dt>
                <dd className="text-3xl font-medium tracking-tight text-ink">{n}</dd>
                <dd className="mt-1 text-xs leading-snug text-muted">{l}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* visual simplificado (móvil / tablet / sin WebGL) */}
        {!show3D && (
          <div className="relative -mx-4 mb-10 sm:mx-0">
            <div className="glow-ambient left-1/2 top-1/2 h-64 w-[90%] -translate-x-1/2 -translate-y-1/2 opacity-70" />
            <BridgeSVG className="relative w-full" />
          </div>
        )}

        <div className="hidden items-center justify-between border-t border-line py-4 font-mono text-[10.5px] tracking-[0.16em] text-faint lg:flex">
          <span>TJGO INFRATEC · JUAN DE DIOS GEOLAB</span>
          <span>LÁM. H-01 · PUENTE CONTINUO 3 × 40 m · CERCHA WARREN · DIAGRAMA M(x)</span>
          <span>PERÚ</span>
        </div>
      </div>
    </section>
  );
}
