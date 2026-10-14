// Genera public/sitemap.xml a partir de los datos (se ejecuta en `npm run build`).
import { writeFileSync } from 'node:fs';
import { software } from '../src/data/software.ts';
import { projects } from '../src/data/projects.ts';

const BASE = 'https://tjgo-jdd.github.io';
const routes = ['/', '/sobre-mi', '/ingenieria', '/software', '/proyectos', '/investigacion', '/lab', '/contacto',
  ...software.map((s) => `/software/${s.slug}`), ...projects.map((p) => `/proyectos/${p.slug}`)];
const today = new Date().toISOString().slice(0, 10);
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((r) => `  <url><loc>${BASE}${r}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`;
writeFileSync('public/sitemap.xml', xml);
console.log(`[sitemap] ${routes.length} rutas`);
