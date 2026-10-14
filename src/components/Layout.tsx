import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Suspense, useEffect } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { Footer } from './Footer';
import { Navbar } from './Navbar';

function PageFallback() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-live="polite">
      <span className="font-mono text-xs tracking-[0.2em] text-faint">CARGANDO…</span>
    </div>
  );
}

export function Layout() {
  const location = useLocation();
  const outlet = useOutlet();
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!location.hash) window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    else {
      const el = document.getElementById(location.hash.slice(1));
      if (el) setTimeout(() => el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }), 80);
    }
  }, [location.pathname, location.hash, reduce]);

  return (
    <div className="relative min-h-dvh overflow-x-clip">
      <Navbar />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          id="main"
          key={location.pathname}
          tabIndex={-1}
          className="outline-none"
          initial={reduce ? false : { opacity: 0, y: 10, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -6, filter: 'blur(4px)' }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <Suspense fallback={<PageFallback />}>{outlet}</Suspense>
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
}
