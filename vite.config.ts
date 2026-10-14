import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { cpSync, existsSync, copyFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Copia las carpetas originales del repositorio (assets/img y PDF) al build,
 * sin duplicarlas en /public. Además crea 404.html para que GitHub Pages
 * sirva la SPA en rutas profundas (/software/hydrotjgo, etc.).
 */
function copyLegacyAssets(): Plugin {
  return {
    name: 'tjgo-copy-legacy-assets',
    apply: 'build',
    closeBundle() {
      const out = resolve(__dirname, 'dist');
      for (const dir of ['assets/img', 'PDF']) {
        const src = resolve(__dirname, dir);
        if (existsSync(src)) cpSync(src, resolve(out, dir), { recursive: true });
      }
      copyFileSync(resolve(out, 'index.html'), resolve(out, '404.html'));
    },
  };
}

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss(), copyLegacyAssets()],
  build: {
    outDir: 'dist',
    assetsDir: 'static',
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/node_modules/three/')) return 'three';
          if (id.includes('/node_modules/katex/')) return 'katex';
          if (/\/node_modules\/(react|react-dom|react-router|react-router-dom)\//.test(id)) return 'react';
        },
      },
    },
  },
  server: { fs: { strict: false } },
});
