import { BINS, RISKS, ROWS, type Risk, type Step } from './data';

/* Доска «Водопада»: колышки, лунки с множителями, шарик.
   Ряд r — r+2 колышка; шарик после шагов бьёт в колышек (r, p),
   где p — число шагов вправо. Финал — лунка p. Чистый SVG, без canvas. */

export const CX = 200;
export const DX = 28;
export const Y0 = 44;
export const DY = 30;
const BIN_Y = Y0 + (ROWS - 1) * DY + 34;

export function pegXY(r: number, j: number): { x: number; y: number } {
  return { x: CX + (j - (r + 1) / 2) * DX, y: Y0 + r * DY };
}

/** Где шарик после step шагов (step 0-based): бьёт в колышек ряда step. */
export function ballXY(path: Step[], step: number): { x: number; y: number } {
  const rights = path.slice(0, step + 1).filter(s => s === 'R').length;
  return { x: CX + (rights - (step + 1) / 2) * DX, y: Y0 + step * DY };
}

export function binXY(b: number): { x: number; y: number } {
  return { x: CX + (b - (BINS - 1) / 2) * DX, y: BIN_Y };
}

/** Цвет лунки по жадности: края — алые, середина — серая. */
export function binColor(mult: number): string {
  if (mult >= 10) return '#E31E25';
  if (mult >= 3) return '#0060AA';
  if (mult >= 1) return '#2c5f4a';
  return '#4a4a52';
}

export default function Board({ path, step, hitBin, risk }: {
  path: Step[] | null; step: number; hitBin: number | null; risk: Risk;
}): JSX.Element {
  const mults = RISKS[risk];
  const ball = path && step >= 0 && step < path.length ? ballXY(path, step) : null;
  return (
    <svg className="pl-board" viewBox="0 0 400 452" role="img"
      aria-label={hitBin === null ? 'Доска плинко' : `Шарик в лунке ${hitBin}`}>
      {Array.from({ length: ROWS }, (_, r) =>
        Array.from({ length: r + 2 }, (_, j) => {
          const { x, y } = pegXY(r, j);
          const smacked = ball !== null && path !== null && step === r &&
            path.slice(0, r + 1).filter(s => s === 'R').length === j;
          return <circle key={`${r}-${j}`} cx={x} cy={y} r={smacked ? 5 : 3.6}
            className={smacked ? 'peg smack' : 'peg'} />;
        }),
      )}
      {Array.from({ length: BINS }, (_, b) => {
        const { x, y } = binXY(b);
        const m = mults[b];
        return (
          <g key={b} className={hitBin === b ? 'bin hit' : 'bin'}>
            <rect x={x - DX / 2 + 2} y={y - 13} width={DX - 4} height={30} rx={5}
              style={{ fill: binColor(m) }} />
            <text x={x} y={y + 4} textAnchor="middle" className="bin-t">
              {m >= 10 ? `×${m}` : `×${m}`}
            </text>
          </g>
        );
      })}
      {path === null && (
        <text x={CX} y={Y0 - 24} textAnchor="middle" className="pl-idle">
          Кидай шарик — он сам найдёт лунку
        </text>
      )}
      {ball && <circle cx={ball.x} cy={ball.y} r={7} className="pl-ball" />}
    </svg>
  );
}
