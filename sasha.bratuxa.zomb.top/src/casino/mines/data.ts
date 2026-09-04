/* МИНЫ — данные полигона. Формула и вывод СВЯТЫ (PRODUCT.md). */

export const SIZE = 5;
export const CELLS = SIZE * SIZE;
export const HOUSE = 0.97;
export const MIN_STAKE = 10;
export const MINE_CHOICES = [1, 3, 5];
export const DEFAULT_MINES = 3;
export const DEFAULT_BET = '50';

/** Расстановка мин — честный Фишер–Йетс. rnd инжектится ради тестов. */
export function placeMines(count: number, rnd: () => number = Math.random): boolean[] {
  const idx = Array.from({ length: CELLS }, (_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  const field = Array(CELLS).fill(false);
  idx.slice(0, count).forEach(i => { field[i] = true; });
  return field;
}

/** Шаг лесенки: святой множитель следующей чистой клетки. */
export function stepMult(mult: number, opened: number, mines: number): number {
  const closed = CELLS - opened;
  const safeClosed = CELLS - mines - opened;
  return mult * (closed / safeClosed) * HOUSE;
}

/** Шанс подорваться на следующей клетке — честно, для шкалы риска. */
export function boomChance(opened: number, mines: number): number {
  const closed = CELLS - opened;
  return closed > 0 ? (mines / closed) * 100 : 0;
}

/** Вывод — святой floor. */
export function cashout(stake: number, mult: number): number {
  return Math.floor(stake * mult);
}

/** Манхэттен-дистанция для взрывной волны (визуал, не механика). */
export function blastDist(a: number, b: number): number {
  const ax = a % SIZE, ay = Math.floor(a / SIZE);
  const bx = b % SIZE, by = Math.floor(b / SIZE);
  return Math.abs(ax - bx) + Math.abs(ay - by);
}

/** Инварианты: формула, вывод, выборы мин. */
export function validateMines(): string[] {
  const bad: string[] = [];
  const expect = (25 / 22) * HOUSE;
  if (Math.abs(stepMult(1, 0, 3) - expect) > 1e-9) bad.push('шаг лесенки не святой');
  if (cashout(100, 1.5) !== 150) bad.push('вывод не floor');
  if (MINE_CHOICES.join(',') !== '1,3,5') bad.push('выборы мин не 1/3/5');
  const f = placeMines(3, () => 0.5);
  if (f.filter(Boolean).length !== 3) bad.push('расстановка кладёт не 3 мины');
  return bad;
}
