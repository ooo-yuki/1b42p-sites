/* СЛОТЫ — данные автомата «Семёрка». Правила СВЯТЫ: спин 50,
   777 = 1000, три одинаковых 250, пара 100, стопы 4/8/12, финал 14-й тик. */

export const SLOT_ICONS = ['cherry', 'clover', 'star', 'coins', 'dices', 'seven'];
export const COST = 50;
export const PAY_JACKPOT = 1000;
export const PAY_TRIPS = 250;
export const PAY_PAIR = 100;
export const LOCK_AT = [4, 8, 12];
export const END_TICK = 14;
export const TICK_MS = 90;
export const TICK_MS_REDUCED = 30;
export const INITIAL_REELS = ['seven', 'dices', 'cherry'];

export type WinKind = 'jackpot' | 'trips' | 'pair' | 'miss';

export function spinFinal(rnd: () => number = Math.random): string[] {
  return [0, 1, 2].map(() => SLOT_ICONS[Math.floor(rnd() * SLOT_ICONS.length)]);
}

export function settle(final: [string, string, string]): { ret: number; kind: WinKind } {
  const [a, b, c] = final;
  if (a === 'seven' && b === 'seven' && c === 'seven') return { ret: PAY_JACKPOT, kind: 'jackpot' };
  if (a === b && b === c) return { ret: PAY_TRIPS, kind: 'trips' };
  if (a === b || b === c || a === c) return { ret: PAY_PAIR, kind: 'pair' };
  return { ret: 0, kind: 'miss' };
}

/** Сколько барабанов уже встало на тике t. */
export function lockedAt(tick: number): number {
  return LOCK_AT.filter(t => tick > t).length;
}

/** Честные шансы (кубик 6 граней, три барабана = 216 исходов). */
export function honestOdds(): { label: string; chance: string }[] {
  return [
    { label: '777', chance: '1 из 216' },
    { label: 'Три одинаковых', chance: '5 из 216' },
    { label: 'Любая пара', chance: '90 из 216' },
  ];
}

/** Инварианты выплат и механики. */
export function validateSlots(): string[] {
  const bad: string[] = [];
  const s = (f: [string, string, string]): number => settle(f).ret;
  if (s(['seven', 'seven', 'seven']) !== 1000) bad.push('777 не 1000');
  if (s(['star', 'star', 'star']) !== 250) bad.push('три не 250');
  if (s(['star', 'star', 'coins']) !== 100) bad.push('пара не 100');
  if (s(['star', 'coins', 'cherry']) !== 0) bad.push('мимо не 0');
  if (s(['star', 'coins', 'star']) !== 100) bad.push('пара через край не 100');
  if (lockedAt(5) !== 1 || lockedAt(9) !== 2 || lockedAt(13) !== 3) bad.push('стопы не 4/8/12');
  if (COST !== 50) bad.push(`спин ${COST}, святой 50`);
  return bad;
}
