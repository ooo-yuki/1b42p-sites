/* БЛЭКДЖЕК — данные салона. Правила СВЯТЫ: шуза с заменой, туз 11→1,
   дилер тянет до 17, натуральный ×2.5, победа ×2, ничья — возврат. */

export type Card = { r: number; s: string };
export type Phase = 'idle' | 'player' | 'done';
export type Outcome = 'natural' | 'win' | 'push' | 'lose' | 'bust';

export const SUITS = ['♠', '♥', '♦', '♣'];
export const RED = new Set(['♥', '♦']);
export const MIN_STAKE = 10;
export const DEALER_STAND = 17;
export const NATURAL_MULT = 2.5;
export const DEFAULT_BET = '50';

export function drawCard(rnd: () => number = Math.random): Card {
  return {
    r: 1 + Math.floor(rnd() * 13),
    s: SUITS[Math.floor(rnd() * 4)],
  };
}

/** Стоимость руки: тузы сначала 11, потом спускаются до 1. */
export function handValue(h: Card[]): number {
  let t = 0, aces = 0;
  for (const c of h) {
    if (c.r === 1) { aces++; t += 11; }
    else t += Math.min(10, c.r);
  }
  while (t > 21 && aces > 0) { t -= 10; aces--; }
  return t;
}

/** Мягкая ли рука (есть туз, считающийся за 11) — перебор невозможен. */
export function isSoft(h: Card[]): boolean {
  let t = 0, aces = 0;
  for (const c of h) {
    if (c.r === 1) { aces++; t += 11; }
    else t += Math.min(10, c.r);
  }
  while (t > 21 && aces > 0) { t -= 10; aces--; }
  return aces > 0;
}

export function rank(r: number): string {
  return r === 1 ? 'A' : r === 11 ? 'J' : r === 12 ? 'Q' : r === 13 ? 'K' : String(r);
}

/** Честный шанс перебора при доборе (бесконечная шуза, туз — за 1 в жёсткой). */
export function bustChance(h: Card[]): number {
  const v = handValue(h);
  if (v < 12 || isSoft(h)) return 0;
  const need = 22 - v; // номинал, с которого начинается перебор
  let bust = 0;
  for (let val = 2; val <= 9; val++) if (val >= need) bust += 4;
  if (10 >= need) bust += 16;
  return (bust / 52) * 100;
}

/** Дилер тянет до 17 — святая механика. */
export function dealerPlay(d: Card[], rnd: () => number = Math.random): Card[] {
  const out = [...d];
  while (handValue(out) < DEALER_STAND) out.push(drawCard(rnd));
  return out;
}

/** Инварианты: подсчёт, тузы, выплаты. */
export function validateBj(): string[] {
  const bad: string[] = [];
  const v = (rs: number[]): number => handValue(rs.map(r => ({ r, s: '♠' })));
  if (v([1, 13]) !== 21) bad.push('A+K не 21');
  if (v([1, 9, 5]) !== 15) bad.push('A+9+5 не 15');
  if (v([10, 6, 6]) !== 22) bad.push('10+6+6 не 22');
  if (v([1, 1, 9]) !== 21) bad.push('A+A+9 не 21');
  if (Math.floor(100 * NATURAL_MULT) !== 250) bad.push('натуральный не ×2.5');
  if (!isSoft([{ r: 1, s: '♠' }, { r: 6, s: '♥' }])) bad.push('A+6 не мягкие');
  if (isSoft([{ r: 10, s: '♠' }, { r: 6, s: '♥' }])) bad.push('10+6 мягкие?!');
  return bad;
}
