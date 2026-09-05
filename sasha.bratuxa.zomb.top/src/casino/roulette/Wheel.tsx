import { EU_REDS, N, pocketCenter, pocketColor } from './data';
import { cn } from '@/lib/utils';
import './wheel.css';

/* Колесо: 37 карманов SVG, шарик в выигрышном кармане, ступица с последним шаром.
   Крутится одной CSS-транзицией под уже решённый исход — без JS-кадров. */

function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function wedge(i: number): string {
  const a0 = (i * 360) / N;
  const a1 = ((i + 1) * 360) / N;
  const [x0, y0] = polar(100, 100, 96, a0);
  const [x1, y1] = polar(100, 100, 96, a1);
  const [x2, y2] = polar(100, 100, 62, a1);
  const [x3, y3] = polar(100, 100, 62, a0);
  return `M100,100 L${x0.toFixed(1)},${y0.toFixed(1)} A96,96 0 0 1 ${x1.toFixed(1)},${y1.toFixed(1)} L${x2.toFixed(1)},${y2.toFixed(1)} A62,62 0 0 0 ${x3.toFixed(1)},${y3.toFixed(1)} Z`;
}

type Props = {
  spinning: boolean;
  angle: number;
  ballPocket: number | null;
  rnum: number | null;
  won: boolean | null;
};

export default function Wheel({ spinning, angle, ballPocket, rnum, won }: Props): JSX.Element {
  const [bx, by] = ballPocket === null ? [0, 0] : polar(100, 100, 88, pocketCenter(ballPocket));
  return (
    <div className="wheel-box">
      <div className={cn('rim-glow', spinning && 'on')} aria-hidden="true" />
      <svg className="wheel" viewBox="0 0 200 200"
        style={{ transform: `rotate(${angle}deg)` }} role="img" aria-label="Колесо рулетки">
        <circle cx="100" cy="100" r="98" fill="#20242e" />
        <circle cx="100" cy="100" r="98" fill="none" stroke="#f0f0f0" strokeWidth="1.6" opacity="0.7" />
        {Array.from({ length: N }, (_, n) => (
          <path key={n} d={wedge(n)} fill={pocketColor(n)} stroke="#0b0e14" strokeWidth="0.8" />
        ))}
        {Array.from({ length: N }, (_, n) => {
          const [tx, ty] = polar(100, 100, 79, (n * 360) / N + 360 / N / 2);
          return (
            <text key={n} x={tx} y={ty} textAnchor="middle" dominantBaseline="central"
              fontSize="8.5" fill="#ffffff" transform={`rotate(${(n * 360) / N + 360 / N / 2},${tx},${ty})`}>
              {n}
            </text>
          );
        })}
        {ballPocket !== null && (
          <circle cx={bx} cy={by} r="5.5" className="ball" />
        )}
        <circle cx="100" cy="100" r="34" fill="#0d1428" stroke="#ffffff" strokeWidth="2" />
        <circle cx="100" cy="100" r="34" fill="none" stroke="#0060AA" strokeWidth="1" opacity="0.6" />
        <text x="100" y="100" textAnchor="middle" dominantBaseline="central" fontSize="26"
          fontWeight="900" className={cn('hub-num', won === true && 'win', won === false && 'miss')}
          fill="#ffffff">
          {rnum === null ? '?' : rnum}
        </text>
      </svg>
      <span className={cn('pointer', spinning && 'hot')} aria-hidden="true" />
      <p className="wheel-cap">
        {rnum === null ? 'европейская · один зеро' : `последний шар — ${rnum}${EU_REDS.includes(rnum) ? ' красное' : rnum === 0 ? ' зеро' : ' чёрное'}`}
      </p>
    </div>
  );
}
