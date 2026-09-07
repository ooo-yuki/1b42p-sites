// Двери большой тюрьмы. Соединяют соседние корпуса туда-обратно:
// cells<->kitchen<->yard<->wash<->work<->gate. Проход pass(S, id)
// выставляет затемнение S.fade 0→1→0, переход по готовности.

export interface Door {
  from: string;
  x: number;
  y: number;
  to: string;
  tx: number;
  ty: number;
}

export interface Walker {
  map: string;
  x: number;
  y: number;
  fade: number;
}

export const DOORS: Door[] = [
  { from: 'cells', x: 7, y: 0, to: 'kitchen', tx: 7, ty: 6 },
  { from: 'kitchen', x: 7, y: 6, to: 'cells', tx: 7, ty: 0 },
  { from: 'kitchen', x: 15, y: 3, to: 'yard', tx: 0, ty: 3 },
  { from: 'yard', x: 0, y: 3, to: 'kitchen', tx: 15, ty: 3 },
  { from: 'yard', x: 7, y: 6, to: 'wash', tx: 7, ty: 0 },
  { from: 'wash', x: 7, y: 0, to: 'yard', tx: 7, ty: 6 },
  { from: 'wash', x: 15, y: 3, to: 'work', tx: 0, ty: 3 },
  { from: 'work', x: 0, y: 3, to: 'wash', tx: 15, ty: 3 },
  { from: 'work', x: 7, y: 6, to: 'gate', tx: 7, ty: 0 },
  { from: 'gate', x: 7, y: 0, to: 'work', tx: 7, ty: 6 },
];

// Проход в дверь: fade 0→1 — затемнение полное, переход готов,
// путник уже в соседнем корпусе; fade 1→0 — затемнение гаснет.
// Чужая дверь — false без смены карты.
export function pass(S: Walker, id: number): boolean {
  const d: Door = DOORS[id];
  if (!S || !d) return false;
  if (typeof S.fade !== 'number' || isNaN(S.fade)) S.fade = 0;
  if (S.fade < 1) {
    S.fade = 1;
    S.map = d.to;
    S.x = d.tx;
    S.y = d.ty;
    return true;
  }
  S.fade = 0;
  return false;
}
