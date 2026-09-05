/* СКАЧКИ — данные ипподрома. Кэфы, гандикап и механика СВЯТЫ (PRODUCT.md).
   Баланс 05.09.2026: лошади бегут с гандикапом (фаворит быстрее), кэфы
   откалиброваны симуляцией — каждая возвращает 91–96%. */

export type Horse = { id: string; icon: string; name: string; odds: number; silks: string };

export const HORSES: Horse[] = [
  { id: 'tornado', icon: 'steed-gray', name: 'Торнадо', odds: 2.35, silks: '#808080' },
  { id: 'bratuxa', icon: 'steed-blue', name: 'Братуха', odds: 3.3, silks: '#0060AA' },
  { id: 'vihr', icon: 'steed-brown', name: 'Вихрь', odds: 5, silks: '#E31E25' },
  { id: 'pyat', icon: 'steed-gold', name: 'Пятёрка', odds: 7.5, silks: '#ffffff' },
];

/** Гандикап скорости: фаворит резвее, аутсайдер тяжелее.
    Калибровка: шансы ~40/28/19/12, возврат каждой 91–96%. */
export const SPEEDS = [1.03, 1.01, 0.99, 0.97];

export const MIN_STAKE = 10;
export const FINISH = 100;
export const STEP_MIN = 1.5;
export const STEP_VAR = 5;
export const TICK_MS = 120;
export const TICK_MS_REDUCED = 30;
export const DEFAULT_HORSE = 'bratuxa';
export const DEFAULT_BET = '50';

/** Выплата победителю — святая формула. */
export function payout(stake: number, odds: number): number {
  return Math.floor(stake * odds);
}

/** Подразумеваемая вероятность по кэфу (для честной подписи). */
export function impliedProb(odds: number): number {
  return odds > 0 ? (1 / odds) * 100 : 0;
}

/** Один тик заезда: каждый бежит (+STEP_MIN+rnd*STEP_VAR) × свой гандикап.
    Побеждает дальше убежавший из пересёкших черту (без порядкового bias).
    Возвращает индекс победителя (-1 — скачут дальше). */
export function tickRace(p: number[], rnd: () => number = Math.random): { winner: number; best: number } {
  let best = 0;
  for (let i = 0; i < p.length; i++) {
    p[i] += (STEP_MIN + rnd() * STEP_VAR) * (SPEEDS[i] ?? 1);
    if (p[i] > p[best]) best = i;
  }
  let winner = -1;
  for (let i = 0; i < p.length; i++) {
    if (p[i] >= FINISH && (winner < 0 || p[i] > p[winner])) winner = i;
  }
  return { winner, best };
}

/** Инварианты: кэфы и состав четвёрки. */
export function validateHorses(list: Horse[]): string[] {
  const bad: string[] = [];
  const odds: Record<string, number> = { tornado: 2.35, bratuxa: 3.3, vihr: 5, pyat: 7.5 };
  if (list.length !== 4) bad.push(`лошадей ${list.length}, святых 4`);
  for (const h of list) {
    if (odds[h.id] !== undefined && h.odds !== odds[h.id])
      bad.push(`${h.id}: кэф ${h.odds}, святой ${odds[h.id]}`);
  }
  return bad;
}
