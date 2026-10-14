// Verificación numérica del Lab contra soluciones cerradas.  `npm test`
import { analyzeBeam, sdofNewmark, sdofFreeExact, IL, maxTruckEffect, positiveArea } from '../src/lib/mechanics.ts';
import { contourSegments } from '../src/lib/contours.ts';

let fails = 0;
const check = (name: string, got: number, exp: number, tol = 1e-3) => {
  const ok = Math.abs(got - exp) <= tol * Math.max(1, Math.abs(exp));
  if (!ok) fails++;
  console.log(`${ok ? '✓' : '✗'} ${name}: ${got.toFixed(6)} (esperado ${exp.toFixed(6)})`);
};

// Viga simplemente apoyada, carga uniforme: Mmax = wL²/8, δ = 5wL⁴/384EI
{
  const L = 8, w = 12, E = 25, I = 450000;
  const r = analyzeBeam({ support: 'simple', L, P: 0, a: 0, w, E, I });
  const EI = E * 1e6 * I * 1e-8;
  check('SS-UDL Mmax', r.Mmax, (w * L * L) / 8);
  check('SS-UDL RA', r.RA, (w * L) / 2);
  check('SS-UDL δmax [mm]', -r.ymax, ((5 * w * L ** 4) / (384 * EI)) * 1000, 2e-3);
}
// Viga simplemente apoyada, carga puntual: Mmax = Pab/L, δ(a=L/2) = PL³/48EI
{
  const L = 6, P = 50, a = 3, E = 200, I = 8000;
  const r = analyzeBeam({ support: 'simple', L, P, a, w: 0, E, I });
  const EI = E * 1e6 * I * 1e-8;
  check('SS-P Mmax', r.Mmax, (P * a * (L - a)) / L);
  check('SS-P δmax [mm]', -r.ymax, ((P * L ** 3) / (48 * EI)) * 1000, 2e-3);
  const r2 = analyzeBeam({ support: 'simple', L, P, a: 2, w: 0, E, I });
  check('SS-P salto de V en a', r2.V[r2.x.indexOf(2)] - r2.V[r2.x.indexOf(2) + 1], P);
}
// Voladizo: carga en el extremo δ = PL³/3EI, UDL δ = wL⁴/8EI, M_A
{
  const L = 3, P = 20, w = 5, E = 200, I = 5000;
  const EI = E * 1e6 * I * 1e-8;
  const r = analyzeBeam({ support: 'cantilever', L, P, a: L, w: 0, E, I });
  check('CANT-P δ [mm]', -r.ymax, ((P * L ** 3) / (3 * EI)) * 1000, 2e-3);
  check('CANT-P MA', r.MA, -P * L);
  const r2 = analyzeBeam({ support: 'cantilever', L, P: 0, a: 0, w, E, I });
  check('CANT-w δ [mm]', -r2.ymax, ((w * L ** 4) / (8 * EI)) * 1000, 2e-3);
  check('CANT-w Mmin', r2.Mmin, (-w * L * L) / 2);
}
// SDOF libre amortiguado vs solución exacta
{
  const inp = { m: 1000, k: 400, zeta: 0.05, u0: 10, v0: 0, p0: 0, Omega: 0, tEnd: 5 };
  const r = sdofNewmark(inp);
  check('SDOF ωn', r.wn, Math.sqrt(400000 / 1000));
  const err = Math.max(...r.t.map((t, i) => Math.abs(r.u[i] - sdofFreeExact(t, r.wn, 0.05, 10, 0))));
  check('SDOF error máx. Newmark vs exacta / u0', err / 10, 0, 1e-2);
}
// SDOF forzado: estado estacionario ≈ ust·Rd
{
  const inp = { m: 1000, k: 400, zeta: 0.1, u0: 0, v0: 0, p0: 2, Omega: 15, tEnd: 30 };
  const r = sdofNewmark(inp);
  const tail = r.u.slice(Math.floor(r.u.length * 0.8));
  const amp = Math.max(...tail.map(Math.abs));
  check('SDOF amplitud estacionaria', amp, r.ust * r.Rd, 1.5e-2);
}
// Líneas de influencia
{
  const L = 20, s = 10;
  check('IL M a L/2 en x=s', IL.M(s, s, L), L / 4);
  check('Área IL M (L/2)', positiveArea((x) => IL.M(x, s, L), L), (L * L) / 8, 1e-4);
  // Camión HL-93 en L = 20 m, M en centro: eje central 145 sobre el centro
  const t = maxTruckEffect((x) => IL.M(x, s, L), L, 0.005);
  const exp = 145 * 5 + 145 * (5 - 4.3 / 2) + 35 * (5 - 4.3 / 2);
  check('HL-93 M centro L=20 (eje central en s)', t.value, exp, 1e-3);
}
// Curvas de nivel: cono h = r → un círculo
{
  const n = 41, h: number[] = [];
  for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) h.push(Math.hypot(i - 20, j - 20));
  const segs = contourSegments(h, n, n, 10);
  const len = segs.reduce((s, [a, b, c, d]) => s + Math.hypot(c - a, d - b), 0);
  check('Contorno r=10 perímetro', len, 2 * Math.PI * 10, 5e-3);
}
console.log(fails ? `\n${fails} pruebas fallaron` : '\nTodas las pruebas pasaron');
process.exit(fails ? 1 : 0);
