import { SECTORS, SECTOR_DEG } from './data';

/* Колесо фортуны: 10 клиньев, стрелка сверху. Крутится под результат
   (угол считает движок), клин-победитель подсвечивается. Чистый SVG. */

const CX = 150;
const CY = 150;
const R = 138;

function polar(deg: number, r: number): { x: number; y: number } {
  const a = ((deg - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
}

function wedge(i: number): string {
  const a0 = i * SECTOR_DEG;
  const a1 = (i + 1) * SECTOR_DEG;
  const p0 = polar(a0, R);
  const p1 = polar(a1, R);
  return `M${CX},${CY} L${p0.x.toFixed(1)},${p0.y.toFixed(1)} A${R},${R} 0 0 1 ${p1.x.toFixed(1)},${p1.y.toFixed(1)} Z`;
}

function wedgeColor(m: number): string {
  if (m >= 4) return '#E31E25';
  if (m >= 2) return '#0060AA';
  if (m >= 1) return '#2c5f4a';
  if (m > 0) return '#4a4a52';
  return '#23232c';
}

export default function WheelSvg({ angle, spinning, hit }: {
  angle: number; spinning: boolean; hit: number | null;
}): JSX.Element {
  return (
    <svg className="fw-wheel" viewBox="0 0 300 320" role="img"
      aria-label={hit === null ? 'Колесо фортуны' : `Выпал сектор ×${SECTORS[hit]}`}>
      <g className={spinning ? 'rotor spin' : 'rotor'} style={{ transform: `rotate(${angle}deg)` }}>
        {SECTORS.map((m, i) => {
          const mid = i * SECTOR_DEG + SECTOR_DEG / 2;
          const tp = polar(mid, 92);
          return (
            <g key={i}>
              <path d={wedge(i)} style={{ fill: wedgeColor(m) }}
                className={hit === i ? 'wedge hit' : 'wedge'} />
              <text x={tp.x} y={tp.y} textAnchor="middle" dominantBaseline="middle"
                className="wedge-t" transform={`rotate(${mid}, ${tp.x}, ${tp.y})`}>
                {m === 0 ? '0' : `×${m}`}
              </text>
            </g>
          );
        })}
        <circle cx={CX} cy={CY} r={26} className="hub" />
        <text x={CX} y={CY + 7} textAnchor="middle" className="hub-t">42</text>
      </g>
      <polygon points="150,2 138,22 162,22" className="pointer" />
    </svg>
  );
}
