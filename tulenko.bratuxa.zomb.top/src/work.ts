// Работа и монеты слоя 2. Берёт часы clock.ts (смена 9–17, там WORK..SHOWER),
// даёт workAt(S): монеты за смену, усталость, станки J.

export interface Shift {
  atBench: boolean;
  hour: number;
}

export interface Worker {
  coins: number;
  tired: number;
}

export const WORK_START: number = 9;
export const WORK_END: number = 17;
export const COINS_PER_SHIFT: number = 1;
export const BENCH: string = 'J';

// Час внутри смены clock.ts: 9 <= hour < 17.
export function isWorkHour(hour: number): boolean {
  if (typeof hour !== 'number' || isNaN(hour)) return false;
  return hour >= WORK_START && hour < WORK_END;
}

// Клетка станка на карте корпусов.
export function isBench(cell: string): boolean {
  return cell === BENCH;
}

// Монет за смену: у станка в часы работы — монета, иначе ноль.
export function workAt(S: Shift): number {
  if (!S || !S.atBench) return 0;
  if (!isWorkHour(S.hour)) return 0;
  return COINS_PER_SHIFT;
}

// Смена целиком: монеты в кошель, усталость плюс один за смену с делом.
export function applyShift(W: Worker, S: Shift): void {
  const pay: number = workAt(S);
  if (pay > 0) {
    W.coins += pay;
    W.tired += 1;
  }
}
