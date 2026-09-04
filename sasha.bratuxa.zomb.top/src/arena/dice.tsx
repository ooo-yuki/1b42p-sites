/* Кубики арены — ручной пиксель-арт: корпус 12×12, точки-пипсы. */

const PIPS: Record<number, [number, number][]> = {
  1: [[6, 6]],
  2: [[3.5, 3.5], [8.5, 8.5]],
  3: [[3.5, 3.5], [6, 6], [8.5, 8.5]],
  4: [[3.5, 3.5], [8.5, 3.5], [3.5, 8.5], [8.5, 8.5]],
  5: [[3.5, 3.5], [8.5, 3.5], [6, 6], [3.5, 8.5], [8.5, 8.5]],
  6: [[3.5, 3.5], [8.5, 3.5], [3.5, 6], [8.5, 6], [3.5, 8.5], [8.5, 8.5]],
};

export function DiceFace({ v, hot }: { v: number; hot?: boolean }): JSX.Element {
  const pips = PIPS[v] ?? PIPS[1];
  return (
    <svg className={`adice${hot ? ' hot' : ''}`} viewBox="0 0 12 12" shapeRendering="crispEdges" aria-label={`Кубик ${v}`}>
      <rect x="0.5" y="0.5" width="11" height="11" rx="2.5" className="die-body" />
      <rect x="0.5" y="0.5" width="11" height="3" rx="1.5" className="die-shine" />
      {pips.map(([x, y], i) => (
        <rect key={i} x={x - 1} y={y - 1} width="2" height="2" className="die-pip" />
      ))}
    </svg>
  );
}
