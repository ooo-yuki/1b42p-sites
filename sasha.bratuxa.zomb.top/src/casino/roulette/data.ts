/* РУЛЕТКА — данные салона. Правила СВЯТЫ: европейская, зеро ×35
   (обычный straight-up, не ловушка), цвет ×2, точное число ×35, минималка 10. */

export const N = 37;
export const MIN_STAKE = 10;
export const DEFAULT_BET = '50';
export const DEFAULT_CHOICE = 'red';

export const EU_REDS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

/** Кругов докрутки: колесо едет только вперёд, минимум столько. */
export const TURNS = 4;

/** Длительность спина, мс — синхронно с transition в roulette.css. */
export const SPIN_MS = 1700;

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

/** Исход спина — равномерный кубик 0–36. Решается ПЕРВЫМ, колесо едет под него. */
export function spinPocket(rnd: () => number = Math.random): number {
  return Math.min(N - 1, Math.floor(rnd() * N));
}

/** Центр кармана n в локальных градусах колеса (0 — верх, по часовой). */
export function pocketCenter(n: number): number {
  return ((n + 0.5) * 360) / N;
}

/** Угол, ставящий карман n под иглу сверху. Колесо крутится по часовой. */
export function angleForPocket(n: number): number {
  return (TURNS * 360 - pocketCenter(n)) % 360;
}

/** Какой карман под иглой при повороте колеса a. */
export function pocketAtAngle(a: number): number {
  const local = (((-a % 360) + 360) % 360 + 360) % 360;
  return Math.floor(local / (360 / N)) % N;
}

/** Докрутка от текущего угла к карману n: только вперёд, минимум TURNS-1 кругов. */
export function nextAngle(cur: number, n: number): number {
  const target = angleForPocket(n);
  const delta = (((target - cur) % 360) + 360) % 360;
  return cur + (TURNS - 1) * 360 + delta;
}

/** Расчёт выигрыша — святая формула. Возвращает выплату (0 — мимо). */
export function settle(choice: string, n: number, stake: number): number {
  const isRed = EU_REDS.includes(n);
  if (choice === 'green' && n === 0) return stake * 35;
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
  if (choice === 'green') return stake * 35;
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
  if (settle('green', 0, 10) !== 350) bad.push('зеро не ×35');
  if (settle('7', 7, 10) !== 350) bad.push('число не ×35');
  return bad;
}
