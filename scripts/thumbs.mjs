// Genera miniaturas WebP (≤ 960 px) de assets/img en public/thumbs.
// Se ejecuta automáticamente antes de `npm run dev` y `npm run build`.
// Solo procesa imágenes nuevas o modificadas.
import sharp from 'sharp';
import { readdirSync, statSync, mkdirSync, existsSync } from 'node:fs';
import { join, parse } from 'node:path';

const SRC = 'assets/img';
const OUT = 'public/thumbs';
const EXT = /\.(png|jpe?g|jfif|gif|webp)$/i;
mkdirSync(OUT, { recursive: true });

let made = 0;
for (const file of readdirSync(SRC)) {
  if (!EXT.test(file)) continue;
  const src = join(SRC, file);
  const out = join(OUT, `${parse(file).name}.webp`);
  if (existsSync(out) && statSync(out).mtimeMs >= statSync(src).mtimeMs) continue;
  try {
    await sharp(src, { animated: false })
      .resize({ width: 960, withoutEnlargement: true })
      .webp({ quality: 74 })
      .toFile(out);
    made++;
  } catch (e) {
    console.warn(`[thumbs] omitido ${file}: ${e.message}`);
  }
}
console.log(`[thumbs] ${made} miniaturas generadas en ${OUT}`);
