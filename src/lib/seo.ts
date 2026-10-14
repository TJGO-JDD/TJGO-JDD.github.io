import { useEffect } from 'react';

const BASE = 'TJGO — Civil Engineering, Research & Technology';

/** Título y descripción por ruta (SEO + accesibilidad). */
export function useSeo(title?: string, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} · TJGO` : BASE;
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    }
    const canonical = document.querySelector('link[rel="canonical"]');
    canonical?.setAttribute('href', `https://tjgo-jdd.github.io${window.location.pathname}`);
  }, [title, description]);
}
