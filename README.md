# TJGO — Civil Engineering, Research & Technology

Plataforma profesional de **Ñol Iván Juan de Dios Rojas (TJGO)** publicada en
<https://tjgo-jdd.github.io>.

Sitio construido con **React + TypeScript + Vite**, Tailwind CSS v4, React Router,
Motion, Lucide, React Three Fiber (Three.js) y KaTeX. Se despliega automáticamente
en GitHub Pages mediante GitHub Actions.

---

## 1. Requisitos

- Node.js **22.6 o superior** (https://nodejs.org)
- Git

## 2. Uso local

```bash
npm install        # solo la primera vez
npm run dev        # servidor local en http://localhost:5173
npm test           # verifica los cálculos del Engineering Lab
npm run build      # genera la versión final en /dist
npm run preview    # previsualiza /dist en http://localhost:4173
```

`npm run dev` y `npm run build` generan automáticamente las miniaturas WebP
(`public/thumbs`) a partir de `assets/img`, y el `sitemap.xml`.

## 3. Despliegue en GitHub Pages (una sola vez)

1. Sube los cambios a la rama `main`.
2. En GitHub: **Settings → Pages → Build and deployment → Source: _GitHub Actions_**.
3. Cada `git push` a `main` ejecuta `.github/workflows/deploy.yml`:
   instala dependencias → `npm test` → `npm run build` → publica `dist/`.

> Importante: mientras la fuente de Pages siga en *Deploy from a branch* (Jekyll),
> el sitio nuevo **no** se mostrará correctamente. Cambia la fuente a *GitHub Actions*.

Los archivos del tema Jekyll anterior (`_config.yml`, `_layouts`, `_sass`, `index.md`, …)
ya no se usan; puedes borrarlos cuando quieras.

## 4. Estructura

```
assets/img/            Imágenes originales (capturas, fotos, logos)  ← se copian al build
PDF/                   Documentos PDF enlazados                       ← se copian al build
public/                robots.txt (+ thumbs y sitemap generados)
scripts/               thumbs.mjs · sitemap.ts · test-calcs.ts
src/
  data/                ← CONTENIDO EDITABLE
    site.ts            nombre, bio, redes, menú, stack
    software.ts        catálogo de programas
    projects.ts        proyectos (profesional / desarrollo propio / académico)
    areas.ts           seis áreas de ingeniería
    research.ts        métodos numéricos y recursos académicos
  components/          Navbar, Footer, Hero, tarjetas, galería, UI
  pages/               una página por ruta
  lab/                 herramientas del Engineering Lab
  three/               escena 3D del puente (hero) y versión SVG
  lib/                 cálculos (mechanics.ts), curvas de nivel, SEO, utilidades
  styles/index.css     tokens de diseño (paleta, tipografía, paneles, botones)
```

## 5. Añadir un programa nuevo

1. Copia las capturas en `assets/img/` (p. ej. `PREC1.png`, `PREC2.png`).
2. Abre `src/data/software.ts` y agrega (o completa) un bloque:

```ts
{
  slug: 'prec-tjgo',                 // URL: /software/prec-tjgo
  name: 'PREC TJGO',
  version: 'v1',
  category: 'Hidrología',            // ver tipos en src/data/types.ts
  areas: ['hidrologia', 'software'],
  status: 'estable',                 // 'estable' | 'en-desarrollo' | 'ficha-pendiente'
  featured: false,                   // true = aparece en la portada
  summary: 'Frase corta para la tarjeta.',
  description: ['Párrafo 1', 'Párrafo 2'],
  features: ['Característica 1', 'Característica 2'],
  tech: ['Python', 'PyQt'],          // solo tecnologías verificadas
  images: ['/assets/img/PREC1.png', '/assets/img/PREC2.png'],
  links: [
    { kind: 'github', label: 'Repositorio', href: 'https://github.com/TJGO-JDD/...' },
    { kind: 'download', label: 'Descargar', href: 'https://...' },
  ],
  youtubeId: 'XXXXXXXXXXX',          // opcional: ID del video de YouTube
},
```

El catálogo, los filtros, la búsqueda, la página de detalle, el pie de página y el
sitemap se actualizan solos. Tipos de enlace: `github`, `pdf`, `drive`, `youtube`,
`demo`, `download`, `whatsapp`, `web`.

Programas con ficha pendiente de información real: **PREC TJGO**, **TJGO PANEL EXCEL**,
**TJGO PANEL WORD** (y capturas de **TJGO STATS**). Complétalos en `software.ts`.

## 6. Añadir un proyecto

Edita `src/data/projects.ts`. El campo `kind` diferencia:
`profesional` (trabajo ejecutado), `desarrollo-propio` y `academico`.
`relatedSoftware` enlaza el proyecto con la ficha de un programa.

## 7. Engineering Lab

Cálculos en `src/lib/mechanics.ts`, verificados por `npm test` contra soluciones cerradas:

| Herramienta | Método |
|---|---|
| Vigas (S.A. / voladizo) | Equilibrio estático, V(x), M(x); elástica por doble integración de EI·y″ = M |
| Líneas de influencia | Viga S.A.; camión HL-93 (35-145-145 kN @ 4.30 m) + carril 9.3 kN/m, IM 33 % |
| Oscilador 1 GDL | Newmark aceleración promedio (γ = ½, β = ¼); vibración libre y forzada armónica |
| Terreno 3D | MDT sintético (ruido fractal), curvas por *marching squares*, pendiente por diferencias centrales |
| Conversor | Factores exactos (g₀ = 9.80665 m/s², 1 lbf = 4.4482216152605 N, 1 ft = 0.3048 m) |

## 8. Diseño

Paleta definida en `src/styles/index.css` (`@theme`):
fondo `#050807`, superficie `#0D1915`, secundaria `#11221B`, verde profundo `#104B39`,
acento `#00E6A0`, acento hover `#3FFFC1`, texto `#F5F7F6`, texto secundario `#9DAAA4`,
bordes `rgba(150,255,210,.12)`.

- La escena 3D del hero solo se carga en escritorio con WebGL; en móvil/tablet se usa
  el alzado SVG equivalente.
- Todas las animaciones respetan `prefers-reduced-motion`.
- Google Analytics 4 (`G-ZZYG0XLBM7`) está en `index.html`.
