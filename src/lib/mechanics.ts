/**
 * Cálculos del TJGO Engineering Lab. Funciones puras y verificadas
 * (ver scripts/test-calcs.ts). Unidades SI coherentes: kN, m, kN·m.
 */

/* ════════════════ 1. VIGA: cortante, momento y deflexión ════════════════ */
export type Support = 'simple' | 'cantilever';
export interface BeamInput {
  support: Support;
  L: number;   // m
  P: number;   // kN (hacia abajo)
  a: number;   // m, posición de P desde el apoyo izquierdo / empotramiento
  w: number;   // kN/m uniforme en toda la luz (hacia abajo)
  E: number;   // GPa
  I: number;   // cm⁴
}
export interface BeamResult {
  x: number[]; V: number[]; M: number[]; y: number[]; // y en mm
  RA: number; RB: number; MA: number;                 // reacciones (kN, kN·m)
  Vmax: number; Mmax: number; Mmin: number; xMmax: number; xMmin: number;
  ymax: number; xymax: number;                        // mm, m
  EI: number;                                         // kN·m²
}

export function analyzeBeam(inp: BeamInput, n = 600): BeamResult {
  const { support, L, P, w } = inp;
  const a = Math.min(Math.max(inp.a, 0), L);
  let RA = 0, RB = 0, MA = 0;
  let Vf: (x: number, left: boolean) => number;
  let Mf: (x: number) => number;

  if (support === 'simple') {
    RA = (P * (L - a)) / L + (w * L) / 2;
    RB = (P * a) / L + (w * L) / 2;
    Vf = (x, left) => RA - w * x - (x > a || (x === a && !left) ? P : 0);
    Mf = (x) => RA * x - (w * x * x) / 2 - (x > a ? P * (x - a) : 0);
  } else {
    // Empotrado en x = 0, libre en x = L
    RA = P + w * L;
    MA = -(P * a + (w * L * L) / 2); // momento de empotramiento (negativo = hogging)
    Vf = (x, left) => w * (L - x) + (x < a || (x === a && left) ? P : 0);
    Mf = (x) => -((x < a ? P * (a - x) : 0) + (w * (L - x) ** 2) / 2);
  }

  // Malla con el punto de carga duplicado (salto de cortante)
  const xs: number[] = [];
  for (let i = 0; i <= n; i++) xs.push((i / n) * L);
  const x: number[] = [], V: number[] = [], M: number[] = [];
  let inserted = false;
  for (const xi of xs) {
    if (!inserted && xi >= a && P !== 0) {
      x.push(a, a); V.push(Vf(a, true), Vf(a, false)); M.push(Mf(a), Mf(a));
      inserted = true;
      if (xi === a) continue;
    }
    x.push(xi); V.push(Vf(xi, xi === 0 ? false : true)); M.push(Mf(xi));
  }
  if (support === 'simple') { V[0] = RA; V[V.length - 1] = -RB; }

  // Deflexión: EI y'' = M  (doble integración trapezoidal)
  const EI = inp.E * 1e6 * inp.I * 1e-8; // kN·m²
  const th: number[] = [0], yy: number[] = [0];
  for (let i = 1; i < x.length; i++) {
    const dx = x[i] - x[i - 1];
    th.push(th[i - 1] + ((M[i] + M[i - 1]) / 2) * dx / EI);
    yy.push(yy[i - 1] + ((th[i] + th[i - 1]) / 2) * dx);
  }
  if (support === 'simple') {
    const c = -yy[yy.length - 1] / L;
    for (let i = 0; i < yy.length; i++) yy[i] += c * x[i];
  }
  const y = yy.map((v) => v * 1000); // mm

  let Mmax = -Infinity, Mmin = Infinity, xMmax = 0, xMmin = 0, Vmax = 0, ymax = 0, xymax = 0;
  for (let i = 0; i < x.length; i++) {
    if (M[i] > Mmax) { Mmax = M[i]; xMmax = x[i]; }
    if (M[i] < Mmin) { Mmin = M[i]; xMmin = x[i]; }
    if (Math.abs(V[i]) > Math.abs(Vmax)) Vmax = V[i];
    if (Math.abs(y[i]) > Math.abs(ymax)) { ymax = y[i]; xymax = x[i]; }
  }
  return { x, V, M, y, RA, RB, MA, Vmax, Mmax, Mmin, xMmax, xMmin, ymax, xymax, EI };
}

/* ════════════════ 2. SDOF: Newmark aceleración promedio ════════════════ */
export interface SdofInput {
  m: number;      // kg
  k: number;      // kN/m
  zeta: number;   // fracción del crítico
  u0: number;     // mm
  v0: number;     // mm/s
  p0: number;     // kN (amplitud de p(t) = p0 sin Ωt)
  Omega: number;  // rad/s
  tEnd: number;   // s
}
export interface SdofResult {
  t: number[]; u: number[]; v: number[]; acc: number[]; // mm, mm/s, mm/s²
  wn: number; fn: number; Tn: number; wd: number; c: number; // rad/s, Hz, s, rad/s, N·s/m
  ust: number; Rd: number; // mm, factor de amplificación dinámica
  dt: number;
}

export function sdofNewmark(inp: SdofInput): SdofResult {
  const m = inp.m;
  const k = inp.k * 1000;          // N/m
  const p0 = inp.p0 * 1000;        // N
  const wn = Math.sqrt(k / m);
  const c = 2 * inp.zeta * Math.sqrt(k * m);
  const Tn = (2 * Math.PI) / wn;
  const wd = inp.zeta < 1 ? wn * Math.sqrt(1 - inp.zeta ** 2) : 0;
  const dt = Math.min(Tn / 100, inp.Omega > 0 ? (2 * Math.PI) / inp.Omega / 100 : Infinity, inp.tEnd / 400);
  const N = Math.min(20000, Math.ceil(inp.tEnd / dt));
  const gamma = 0.5, beta = 0.25;
  const p = (t: number) => p0 * Math.sin(inp.Omega * t);

  let u = inp.u0 / 1000, v = inp.v0 / 1000;
  let acc = (p(0) - c * v - k * u) / m;
  const kh = k + (gamma / (beta * dt)) * c + m / (beta * dt * dt);
  const A = m / (beta * dt) + (gamma / beta) * c;
  const B = m / (2 * beta) + dt * (gamma / (2 * beta) - 1) * c;

  const T = [0], U = [u * 1000], Vv = [v * 1000], Ac = [acc * 1000];
  for (let i = 0; i < N; i++) {
    const t0 = i * dt, t1 = t0 + dt;
    const dph = p(t1) - p(t0) + A * v + B * acc;
    const du = dph / kh;
    const dv = (gamma / (beta * dt)) * du - (gamma / beta) * v + dt * (1 - gamma / (2 * beta)) * acc;
    const da = du / (beta * dt * dt) - v / (beta * dt) - acc / (2 * beta);
    u += du; v += dv; acc += da;
    T.push(t1); U.push(u * 1000); Vv.push(v * 1000); Ac.push(acc * 1000);
  }
  const r = inp.Omega / wn;
  const Rd = 1 / Math.sqrt((1 - r * r) ** 2 + (2 * inp.zeta * r) ** 2);
  return { t: T, u: U, v: Vv, acc: Ac, wn, fn: wn / (2 * Math.PI), Tn, wd, c, ust: (p0 / k) * 1000, Rd, dt };
}

/** Solución cerrada de vibración libre subamortiguada (para verificación). */
export function sdofFreeExact(t: number, wn: number, zeta: number, u0: number, v0: number) {
  const wd = wn * Math.sqrt(1 - zeta * zeta);
  return Math.exp(-zeta * wn * t) * (u0 * Math.cos(wd * t) + ((v0 + zeta * wn * u0) / wd) * Math.sin(wd * t));
}

/* ════════════════ 3. Líneas de influencia (viga simplemente apoyada) ════════════════ */
export const IL = {
  RA: (x: number, L: number) => 1 - x / L,
  V: (x: number, s: number, L: number) => (x < s ? -x / L : 1 - x / L),
  M: (x: number, s: number, L: number) => (x <= s ? (x * (L - s)) / L : (s * (L - x)) / L),
};

/** Camión de diseño HL-93 (AASHTO LRFD 3.6.1.2): 35, 145, 145 kN a 4.30 m. */
export const HL93 = { axles: [35, 145, 145], spacing: [0, 4.3, 8.6], lane: 9.3, IM: 0.33 };

/** Máximo efecto del camión HL-93 (en ambos sentidos) sobre una línea de influencia. */
export function maxTruckEffect(il: (x: number) => number, L: number, step = 0.01) {
  let best = -Infinity, bestPos = 0, bestDir = 1;
  for (const dir of [1, -1]) {
    for (let x0 = -8.6; x0 <= L + 8.6; x0 += step) {
      let e = 0;
      HL93.axles.forEach((P, i) => {
        const xi = x0 + dir * HL93.spacing[i];
        if (xi >= 0 && xi <= L) e += P * il(xi);
      });
      if (e > best) { best = e; bestPos = x0; bestDir = dir; }
    }
  }
  return { value: best, x0: bestPos, dir: bestDir };
}

/** Área positiva de la línea de influencia (para la carga de carril). */
export function positiveArea(il: (x: number) => number, L: number, n = 2000) {
  let A = 0;
  for (let i = 0; i < n; i++) {
    const x1 = (i / n) * L, x2 = ((i + 1) / n) * L;
    const y1 = Math.max(0, il(x1)), y2 = Math.max(0, il(x2));
    A += ((y1 + y2) / 2) * (x2 - x1);
  }
  return A;
}

/* ════════════════ utilidades ════════════════ */
export function niceTicks(min: number, max: number, count = 5) {
  if (!isFinite(min) || !isFinite(max)) return [0];
  if (min === max) { min -= 1; max += 1; }
  const span = max - min;
  const step0 = span / count;
  const mag = 10 ** Math.floor(Math.log10(step0));
  const err = step0 / mag;
  const step = (err >= 7.5 ? 10 : err >= 3.5 ? 5 : err >= 1.5 ? 2 : 1) * mag;
  const ticks: number[] = [];
  for (let v = Math.ceil(min / step) * step; v <= max + step * 1e-6; v += step) ticks.push(Math.abs(v) < step * 1e-9 ? 0 : v);
  return ticks;
}

export const fmt = (v: number, d = 2) =>
  Number.isFinite(v) ? v.toLocaleString('es-PE', { minimumFractionDigits: d, maximumFractionDigits: d }) : '—';
