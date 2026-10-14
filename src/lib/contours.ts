/**
 * Marching squares: devuelve segmentos de curvas de nivel para una malla regular.
 * h[j * nx + i] es la cota del nodo (i, j). Coordenadas en índices de malla.
 */
export type Segment = [number, number, number, number];

export function contourSegments(h: Float32Array | number[], nx: number, ny: number, level: number): Segment[] {
  const out: Segment[] = [];
  const v = (i: number, j: number) => h[j * nx + i];
  const lerp = (a: number, b: number) => {
    const d = b - a;
    return d === 0 ? 0.5 : (level - a) / d;
  };
  for (let j = 0; j < ny - 1; j++) {
    for (let i = 0; i < nx - 1; i++) {
      const a = v(i, j), b = v(i + 1, j), c = v(i + 1, j + 1), d = v(i, j + 1);
      let idx = 0;
      if (a >= level) idx |= 1;
      if (b >= level) idx |= 2;
      if (c >= level) idx |= 4;
      if (d >= level) idx |= 8;
      if (idx === 0 || idx === 15) continue;
      // Puntos en las aristas: bottom (a-b), right (b-c), top (d-c), left (a-d)
      const B: [number, number] = [i + lerp(a, b), j];
      const R: [number, number] = [i + 1, j + lerp(b, c)];
      const T: [number, number] = [i + lerp(d, c), j + 1];
      const L: [number, number] = [i, j + lerp(a, d)];
      const seg = (p: [number, number], q: [number, number]) => out.push([p[0], p[1], q[0], q[1]]);
      const center = (a + b + c + d) / 4;
      switch (idx) {
        case 1: case 14: seg(L, B); break;
        case 2: case 13: seg(B, R); break;
        case 3: case 12: seg(L, R); break;
        case 4: case 11: seg(R, T); break;
        case 6: case 9: seg(B, T); break;
        case 7: case 8: seg(L, T); break;
        case 5: // silla: a y c altos
          if (center >= level) { seg(L, T); seg(B, R); } else { seg(L, B); seg(R, T); }
          break;
        case 10: // silla: b y d altos
          if (center >= level) { seg(L, B); seg(R, T); } else { seg(L, T); seg(B, R); }
          break;
      }
    }
  }
  return out;
}

/* Ruido de valor determinista para terrenos de demostración */
function hash(x: number, y: number, seed: number) {
  const s = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453;
  return s - Math.floor(s);
}
function smooth(t: number) { return t * t * (3 - 2 * t); }
export function valueNoise(x: number, y: number, seed = 1) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const a = hash(xi, yi, seed), b = hash(xi + 1, yi, seed), c = hash(xi, yi + 1, seed), d = hash(xi + 1, yi + 1, seed);
  const u = smooth(xf), v = smooth(yf);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
export function fbm(x: number, y: number, seed = 1, octaves = 5) {
  let amp = 0.5, f = 1, sum = 0, norm = 0;
  for (let o = 0; o < octaves; o++) {
    sum += amp * valueNoise(x * f, y * f, seed + o * 13);
    norm += amp; amp *= 0.5; f *= 2.02;
  }
  return sum / norm;
}
