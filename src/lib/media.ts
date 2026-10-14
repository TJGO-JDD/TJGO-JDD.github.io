/** Codifica rutas con espacios/paréntesis (p. ej. "HTJGO (1).png"). */
export const url = (path: string) => encodeURI(path);

/** Miniatura WebP generada por scripts/thumbs.mjs. */
export const thumb = (path: string) => {
  const file = path.split('/').pop() ?? '';
  const name = file.replace(/\.[^.]+$/, '');
  return encodeURI(`/thumbs/${name}.webp`);
};

export const isGif = (path: string) => /\.gif$/i.test(path);
