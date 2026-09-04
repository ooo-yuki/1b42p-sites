/* РУЛЕТКА — данные салона. Правила СВЯТЫ: европейская, зеро ×14,
   цвет ×2, точное число ×35, минималка 10. */

export const N = 37;
export const MIN_STAKE = 10;
export const TICKS = 17;
export const TICK_MS = 90;
export const TICK_MS_REDUCED = 30;
export const DEFAULT_BET = '50';
export const DEFAULT_CHOICE = 'red';

export const EU_REDS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

export type Pocket = 'zero' | 'red' | 'black';

export function pocketOf(n: number): Pocket {
  if (n === 0) return 'zero';
  return EU_REDS.includes(n) ? 'red' : 'black';
}

/** Цвет кармана: зеро — кобальт, красные — алые, чёрные — ночь. */
export function pocketColor(n: number): string {
  if (n === 0) return '#0060AA';
  return EU_REDS.includes(n) ? '#E31E25' : '#16161a';
}

/** Расчёт выигрыша — святая формула. Возвращает выплату (0 — мимо). */
export function settle(choice: string, n: number, stake: number): number {
  const isRed = EU_REDS.includes(n);
  if (choice === 'green' && n === 0) return stake * 14;
  if (choice === 'red' && isRed) return stake * 2;
  if (choice === 'black' && n !== 0 && !isRed) return stake * 2;
  if (/^\d+$/.test(choice) && Number(choice) === n) return stake * 35;
  return 0;
}

export function choiceLabel(choice: string): string {
  if (choice === 'red') return 'Красное';
  if (choice === 'black') return 'Чёрное';
  if (choice === 'green') return 'Зеро';
  if (/^\d+$/.test(choice)) return `Число ${choice}`;
  return choice;
}

/** Потенциал ставки — для честного превью («если зайдёт»). */
export function potential(choice: string, stake: number): number {
  if (choice === 'red' || choice === 'black') return stake * 2;
  if (choice === 'green') return stake * 14;
  if (/^\d+$/.test(choice)) return stake * 35;
  return 0;
}

/** Инварианты: 37 карманов, красные по-европейски, кэфы формулой. */
export function validateRoulette(): string[] {
  const bad: string[] = [];
  const canon = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
  if (N !== 37) bad.push(`карманов ${N}, святых 37`);
  if (EU_REDS.join(',') !== canon.join(',')) bad.push('красные карманы не по-европейски');
  if (settle('red', 1, 10) !== 20) bad.push('красное не ×2');
  if (settle('green', 0, 10) !== 140) bad.push('зеро не ×14');
  if (settle('7', 7, 10) !== 350) bad.push('число не ×35');
  return bad;
}
