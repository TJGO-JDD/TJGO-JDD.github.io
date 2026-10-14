import { continuousMoment } from './momentFn';

/**
 * Alzado técnico del mismo puente (3 tramos continuos, cercha Warren),
 * usado en móviles, sin WebGL o mientras carga la escena 3D.
 */
export function BridgeSVG({ className = '' }: { className?: string }) {
  const W = 600, x0 = 40, x1 = 560, span = (x1 - x0) / 3;
  const deck = 150, top = 104;
  const panels = 12, dx = (x1 - x0) / panels;

  const truss: string[] = [];
  for (let p = 0; p < panels; p++) {
    const a = x0 + p * dx, m = a + dx / 2, b = a + dx;
    truss.push(`M${a} ${deck} L${m} ${top} L${b} ${deck}`);
    if (p < panels - 1) truss.push(`M${m} ${top} L${m + dx} ${top}`);
  }
  const mBase = 196, mk = 380;
  const pts: string[] = [];
  for (let k = 0; k <= 150; k++) {
    const xi = (k / 150) * 3;
    pts.push(`${(x0 + xi * span).toFixed(1)},${(mBase - continuousMoment(xi) * mk).toFixed(1)}`);
  }
  // terreno (perfil del valle)
  const ground: string[] = [];
  for (let k = 0; k <= 60; k++) {
    const x = (k / 60) * W;
    const t = Math.abs(x - 300) / 300;
    const y = 300 - 120 * Math.min(1, Math.max(0, (t - 0.25) / 0.6)) ** 1.5 + 6 * Math.sin(k * 0.9);
    ground.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }

  return (
    <svg viewBox={`0 0 ${W} 340`} className={className} role="img" aria-label="Alzado de puente continuo de tres tramos con diagrama de momentos flectores">
      <defs>
        <linearGradient id="bsvg-g" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#00E6A0" stopOpacity="0.25" />
          <stop offset="1" stopColor="#00E6A0" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* curvas del terreno */}
      {[0, 14, 28, 42].map((o, i) => (
        <polyline key={o} points={ground.map((p) => { const [x, y] = p.split(','); return `${x},${+y + o}`; }).join(' ')}
          fill="none" stroke="#00E6A0" strokeOpacity={0.4 - i * 0.08} strokeWidth="1" />
      ))}
      <polygon points={`0,340 ${ground.join(' ')} ${W},340`} fill="url(#bsvg-g)" opacity="0.5" />
      {/* pilas */}
      {[x0 + span, x0 + 2 * span].map((x) => (
        <rect key={x} x={x - 9} y={deck + 6} width="18" height={300 - deck - 40} fill="#0D1915" stroke="#00E6A0" strokeOpacity="0.5" />
      ))}
      {/* carga */}
      <line x1={x0 + 8} x2={x1 - 8} y1={66} y2={66} stroke="#3FFFC1" strokeOpacity="0.6" />
      {Array.from({ length: 13 }, (_, i) => x0 + 8 + i * ((x1 - x0 - 16) / 12)).map((x) => (
        <path key={x} d={`M${x} 66 V${top - 10} m-3 -6 l3 6 l3 -6`} fill="none" stroke="#3FFFC1" strokeOpacity="0.7" />
      ))}
      {/* cercha */}
      <rect x={x0 - 4} y={deck} width={x1 - x0 + 8} height="6" fill="#104B39" />
      <path d={truss.join(' ')} fill="none" stroke="#00E6A0" strokeWidth="1.6" strokeLinejoin="round" />
      <line x1={x0} x2={x1} y1={deck} y2={deck} stroke="#00E6A0" strokeWidth="1.6" />
      {/* apoyos */}
      {[0, 1, 2, 3].map((i) => (
        <path key={i} d={`M${x0 + i * span} ${deck + 6} l-7 12 h14 z`} fill={i === 0 ? '#3FFFC1' : '#00E6A0'} />
      ))}
      {/* diagrama de momentos */}
      <line x1={x0} x2={x1} y1={mBase} y2={mBase} stroke="#9DAAA4" strokeOpacity="0.35" strokeDasharray="3 4" />
      <polyline points={pts.join(' ')} fill="none" stroke="#3FFFC1" strokeWidth="1.8" />
      <g fontFamily="JetBrains Mono Variable, monospace" fontSize="10" fill="#9DAAA4">
        <text x={x0 + 0.4 * span - 22} y={mBase + 0.08 * mk + 16}>+0.080wL²</text>
        <text x={x0 + 2 * span - 26} y={mBase - 0.1 * mk - 8}>−0.100wL²</text>
        <text x={x0} y={40} fill="#00E6A0">L = 3 × 40 m</text>
      </g>
    </svg>
  );
}
