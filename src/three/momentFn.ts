/** Momento flector adimensional M/(wL²) de una viga continua de 3 tramos iguales
 *  con carga uniforme, en x ∈ [0, 3] (L = 1). R_A = 0.4wL, M_B = M_C = −0.1wL². */
export function continuousMoment(xi: number) {
  if (xi <= 1) return 0.4 * xi - 0.5 * xi * xi;
  if (xi <= 2) { const s = xi - 1; return -0.1 + 0.5 * s - 0.5 * s * s; }
  const s = 3 - xi; return 0.4 * s - 0.5 * s * s;
}
