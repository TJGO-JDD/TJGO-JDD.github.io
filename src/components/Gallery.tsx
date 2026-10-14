import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { isGif, thumb, url } from '../lib/media';

/** Imagen con miniatura WebP y carga diferida. GIF animados solo se cargan en el visor. */
export function Thumb({ src, alt, className = '', eager = false }: { src: string; alt: string; className?: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  return (
    <img
      src={failed ? url(src) : thumb(src)}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

export function Lightbox({ images, index, onClose, onIndex, title }: {
  images: string[]; index: number | null; onClose: () => void; onIndex: (i: number) => void; title: string;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = index !== null;
  const go = useCallback((d: number) => index !== null && onIndex((index + d + images.length) % images.length), [index, images.length, onIndex]);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; prev?.focus(); };
  }, [open, onClose, go]);

  return createPortal(
    <AnimatePresence>
      {open && index !== null && (
        <motion.div
          role="dialog" aria-modal="true" aria-label={`${title} — imagen ${index + 1} de ${images.length}`}
          className="fixed inset-0 z-[100] flex flex-col bg-bg/95 backdrop-blur-xl"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <div className="flex h-16 items-center justify-between border-b border-line px-4 sm:px-6">
            <p className="truncate text-sm text-muted"><span className="text-ink">{title}</span> <span className="font-mono text-xs text-faint">· {index + 1}/{images.length}</span></p>
            <div className="flex items-center gap-2">
              <a href={url(images[index])} target="_blank" rel="noopener" className="btn btn-ghost btn-sm" aria-label="Abrir original en nueva pestaña"><Maximize2 size={14} /></a>
              <button ref={closeRef} onClick={onClose} className="btn btn-ghost btn-sm" aria-label="Cerrar visor"><X size={16} /></button>
            </div>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center p-3 sm:p-8" onClick={onClose}>
            <motion.img
              key={images[index]}
              src={url(images[index])}
              alt={`${title} — captura ${index + 1}`}
              className="max-h-full max-w-full rounded-lg border border-line object-contain shadow-2xl"
              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
            />
            {images.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Anterior"
                  className="absolute left-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong bg-surface/80 text-ink hover:border-accent sm:left-6"><ChevronLeft size={20} /></button>
                <button onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Siguiente"
                  className="absolute right-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong bg-surface/80 text-ink hover:border-accent sm:right-6"><ChevronRight size={20} /></button>
              </>
            )}
          </div>
          <div className="scrollbar-none flex gap-2 overflow-x-auto border-t border-line p-3">
            {images.map((src, i) => (
              <button key={src} onClick={() => onIndex(i)} aria-label={`Ver imagen ${i + 1}`} aria-current={i === index}
                className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-md border ${i === index ? 'border-accent' : 'border-line opacity-60 hover:opacity-100'}`}>
                <Thumb src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/** Rejilla de galería ampliable. */
export function Gallery({ images, title, columns = 3 }: { images: string[]; title: string; columns?: 2 | 3 | 4 }) {
  const [idx, setIdx] = useState<number | null>(null);
  const cols = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3', 4: 'sm:grid-cols-3 lg:grid-cols-4' }[columns];
  return (
    <>
      <ul className={`grid grid-cols-2 gap-3 ${cols}`}>
        {images.map((src, i) => (
          <li key={src}>
            <button onClick={() => setIdx(i)} className="group relative block aspect-[16/10] w-full overflow-hidden rounded-xl border border-line bg-surface card-hover"
              aria-label={`Ampliar captura ${i + 1} de ${title}`}>
              <Thumb src={src} alt={`${title} — captura ${i + 1}`} className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]" />
              <span className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <span className="absolute bottom-2 left-2 font-mono text-[10px] text-ink/80">{String(i + 1).padStart(2, '0')}{isGif(src) ? ' · GIF' : ''}</span>
            </button>
          </li>
        ))}
      </ul>
      <Lightbox images={images} index={idx} onClose={() => setIdx(null)} onIndex={setIdx} title={title} />
    </>
  );
}
