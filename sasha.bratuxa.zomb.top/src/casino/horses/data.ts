/* СКАЧКИ — данные ипподрома. Кэфы, минималка и механика СВЯТЫ (PRODUCT.md). */

export type Horse = { id: string; icon: string; name: string; odds: number; silks: string };

export const HORSES: Horse[] = [
  { id: 'tornado', icon: 'steed-gray', name: 'Торнадо', odds: 1.8, silks: '#808080' },
  { id: 'bratuxa', icon: 'steed-blue', name: 'Братуха', odds: 2.5, silks: '#0060AA' },
  { id: 'vihr', icon: 'steed-brown', name: 'Вихрь', odds: 4, silks: '#E31E25' },
  { id: 'pyat', icon: 'steed-gold', name: 'Пятёрка', odds: 7, silks: '#ffffff' },
];

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

/** Один тик заезда: каждый бежит +STEP_MIN+rnd*STEP_VAR. Возвращает индекс победителя (-1). */
export function tickRace(p: number[], rnd: () => number = Math.random): { winner: number; best: number } {
  let winner = -1;
  let best = 0;
  for (let i = 0; i < p.length; i++) {
    p[i] += STEP_MIN + rnd() * STEP_VAR;
    if (p[i] > p[best]) best = i;
    if (p[i] >= FINISH && winner < 0) winner = i;
  }
  return { winner, best };
}

/** Инварианты: кэфы и состав четвёрки. */
export function validateHorses(list: Horse[]): string[] {
  const bad: string[] = [];
  const odds: Record<string, number> = { tornado: 1.8, bratuxa: 2.5, vihr: 4, pyat: 7 };
  if (list.length !== 4) bad.push(`лошадей ${list.length}, святых 4`);
  for (const h of list) {
    if (odds[h.id] !== undefined && h.odds !== odds[h.id])
      bad.push(`${h.id}: кэф ${h.odds}, святой ${odds[h.id]}`);
  }
  return bad;
}
