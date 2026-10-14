import { useId, useMemo, useRef, useState } from 'react';
import { fmt, niceTicks } from '../lib/mechanics';

export interface Series {
  x: number[];
  y: number[];
  color?: string;
  fill?: boolean;
  label?: string;
  dashed?: boolean;
}

interface Props {
  series: Series[];
  xLabel: string;
  yLabel: string;
  height?: number;
  /** Invierte el eje Y (convención de momento positivo hacia abajo). */
  invertY?: boolean;
  markers?: { x: number; y: number; label: string }[];
  vLines?: { x: number; label?: string }[];
  digits?: number;
  ariaLabel: string;
}

const PAD = { l: 58, r: 16, t: 14, b: 40 };

/** Gráfica técnica en SVG con ejes, retícula y lectura al pasar el cursor. */
export function Chart({ series, xLabel, yLabel, height = 240, invertY = false, markers = [], vLines = [], digits = 2, ariaLabel }: Props) {
  const W = 720, H = height;
  const id = useId();
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  const { xmin, xmax, ymin, ymax, xt, yt } = useMemo(() => {
    let xmin = Infinity, xmax = -Infinity, ymin = Infinity, ymax = -Infinity;
    for (const s of series) for (let i = 0; i < s.x.length; i++) {
      xmin = Math.min(xmin, s.x[i]); xmax = Math.max(xmax, s.x[i]);
      ymin = Math.min(ymin, s.y[i]); ymax = Math.max(ymax, s.y[i]);
    }
    if (ymin > 0) ymin = 0;
    if (ymax < 0) ymax = 0;
    const padY = (ymax - ymin || 1) * 0.12;
    ymin -= ymin < 0 ? padY : 0; ymax += ymax > 0 ? padY : 0;
    if (ymin === ymax) { ymin -= 1; ymax += 1; }
    return { xmin, xmax, ymin, ymax, xt: niceTicks(xmin, xmax, 8), yt: niceTicks(ymin, ymax, 5) };
  }, [series]);

  const sx = (x: number) => PAD.l + ((x - xmin) / (xmax - xmin || 1)) * (W - PAD.l - PAD.r);
  const sy = (y: number) => {
    const t = (y - ymin) / (ymax - ymin);
    return invertY ? PAD.t + t * (H - PAD.t - PAD.b) : H - PAD.b - t * (H - PAD.t - PAD.b);
  };

  const paths = series.map((s) => {
    let d = '';
    for (let i = 0; i < s.x.length; i++) d += `${i ? 'L' : 'M'}${sx(s.x[i]).toFixed(1)} ${sy(s.y[i]).toFixed(1)}`;
    const area = s.fill ? `${d}L${sx(s.x[s.x.length - 1]).toFixed(1)} ${sy(0).toFixed(1)}L${sx(s.x[0]).toFixed(1)} ${sy(0).toFixed(1)}Z` : '';
    return { d, area };
  });

  const onMove = (e: React.PointerEvent) => {
    const svg = svgRef.current; if (!svg) return;
    const r = svg.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    const xv = xmin + ((px - PAD.l) / (W - PAD.l - PAD.r)) * (xmax - xmin);
    if (xv < xmin || xv > xmax) { setHover(null); return; }
    const xs = series[0].x;
    let lo = 0, hi = xs.length - 1;
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (xs[mid] < xv) lo = mid; else hi = mid; }
    setHover(Math.abs(xs[lo] - xv) < Math.abs(xs[hi] - xv) ? lo : hi);
  };

  const hx = hover !== null ? series[0].x[hover] : null;

  return (
    <figure className="relative">
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full touch-pan-y select-none" role="img" aria-label={ariaLabel}
        onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
        <defs>
          <linearGradient id={`${id}-f`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#00E6A0" stopOpacity="0.28" />
            <stop offset="1" stopColor="#00E6A0" stopOpacity="0.02" />
          </linearGradient>
          <clipPath id={`${id}-c`}><rect x={PAD.l} y={PAD.t - 2} width={W - PAD.l - PAD.r} height={H - PAD.t - PAD.b + 4} /></clipPath>
        </defs>
        {/* retícula */}
        {yt.map((v) => (
          <g key={`y${v}`}>
            <line x1={PAD.l} x2={W - PAD.r} y1={sy(v)} y2={sy(v)} stroke={v === 0 ? 'rgba(245,247,246,.35)' : 'rgba(150,255,210,.08)'} />
            <text x={PAD.l - 8} y={sy(v)} dy="0.32em" textAnchor="end" className="fill-faint font-mono" fontSize="11">{+v.toPrecision(6)}</text>
          </g>
        ))}
        {xt.map((v) => (
          <g key={`x${v}`}>
            <line x1={sx(v)} x2={sx(v)} y1={PAD.t} y2={H - PAD.b} stroke="rgba(150,255,210,.06)" />
            <text x={sx(v)} y={H - PAD.b + 16} textAnchor="middle" className="fill-faint font-mono" fontSize="11">{+v.toPrecision(6)}</text>
          </g>
        ))}
        <text x={(PAD.l + W - PAD.r) / 2} y={H - 6} textAnchor="middle" className="fill-muted" fontSize="11.5">{xLabel}</text>
        <text transform={`translate(13 ${(PAD.t + H - PAD.b) / 2}) rotate(-90)`} textAnchor="middle" className="fill-muted" fontSize="11.5">{yLabel}</text>

        <g clipPath={`url(#${id}-c)`}>
          {vLines.map((l, i) => (
            <g key={i}>
              <line x1={sx(l.x)} x2={sx(l.x)} y1={PAD.t} y2={H - PAD.b} stroke="#3FFFC1" strokeOpacity=".45" strokeDasharray="3 4" />
              {l.label && <text x={sx(l.x) + 5} y={PAD.t + 10} className="fill-accent font-mono" fontSize="10.5">{l.label}</text>}
            </g>
          ))}
          {series.map((s, i) => (
            <g key={i}>
              {s.fill && <path d={paths[i].area} fill={`url(#${id}-f)`} />}
              <path d={paths[i].d} fill="none" stroke={s.color ?? '#00E6A0'} strokeWidth="2" strokeLinejoin="round" strokeDasharray={s.dashed ? '5 5' : undefined} vectorEffect="non-scaling-stroke" />
            </g>
          ))}
          {markers.map((m, i) => (
            <g key={i}>
              <circle cx={sx(m.x)} cy={sy(m.y)} r="4" fill="#050807" stroke="#3FFFC1" strokeWidth="2" />
              <text x={sx(m.x)} y={sy(m.y)} dy={(invertY ? m.y < 0 : m.y > 0) ? -10 : 18} textAnchor="middle" className="fill-ink font-mono" fontSize="11">{m.label}</text>
            </g>
          ))}
          {hx !== null && hover !== null && (
            <g>
              <line x1={sx(hx)} x2={sx(hx)} y1={PAD.t} y2={H - PAD.b} stroke="rgba(245,247,246,.4)" />
              {series.map((s, i) => <circle key={i} cx={sx(s.x[hover])} cy={sy(s.y[hover])} r="3.5" fill={s.color ?? '#00E6A0'} />)}
            </g>
          )}
        </g>
      </svg>
      {hx !== null && hover !== null && (
        <figcaption className="pointer-events-none absolute right-3 top-2 rounded-md border border-line-strong bg-bg/85 px-2.5 py-1.5 font-mono text-[11px] text-muted backdrop-blur">
          x = <span className="text-ink">{fmt(hx, 3)}</span>
          {series.map((s, i) => (
            <span key={i} className="ml-3">{s.label ?? 'y'} = <span className="text-accent">{fmt(s.y[hover], digits)}</span></span>
          ))}
        </figcaption>
      )}
    </figure>
  );
}
