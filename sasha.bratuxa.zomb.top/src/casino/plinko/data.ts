/* ПЛИНКО — доска «Водопад 42». Правила СВЯТЫ: 12 рядов, 13 лунок,
   шарик на каждом колышке уходит влево/вправо 50/50, лунка = число шагов
   вправо. Множители зафиксированы, EV каждого риска 0.95–1.00. */

export const ROWS = 12;
export const BINS = ROWS + 1;
export const MIN_STAKE = 10;

export type Risk = 'low' | 'mid' | 'high';

export const RISK_RU: Record<Risk, string> = {
  low: 'Тихая заводь',
  mid: 'Бурная река',
  high: 'Водопад',
};

/** Множители лунок 0–12. Симметрия обязательна: m[k] === m[12-k]. */
export const RISKS: Record<Risk, number[]> = {
  low: [10, 3, 1.6, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 1.6, 3, 10],
  mid: [33, 7, 2.5, 1.8, 1.2, 0.65, 0.45, 0.65, 1.2, 1.8, 2.5, 7, 33],
  high: [70, 14, 4.5, 2.2, 1.1, 0.4, 0.25, 0.4, 1.1, 2.2, 4.5, 14, 70],
};

export type Step = 'L' | 'R';

/** Путь шарика: 12 шагов, каждый — монета rnd(). */
export function dropPath(rnd: () => number = Math.random): Step[] {
  return Array.from({ length: ROWS }, () => (rnd() < 0.5 ? 'L' : 'R'));
}

export type Settled = { bin: number; mult: number; rights: number };

/** Лунка по пути + множитель риска. */
export function settle(path: Step[], risk: Risk = 'low'): Settled {
  const rights = path.filter(s => s === 'R').length;
  const bin = Math.max(0, Math.min(BINS - 1, rights));
  return { bin, mult: RISKS[risk][bin], rights };
}

/** Честный шанс лунки: бином C(12,k)/4096. */
export function binChance(bin: number): number {
  if (bin < 0 || bin >= BINS) return 0;
  let c = 1;
  for (let i = 0; i < bin; i++) c = (c * (ROWS - i)) / (i + 1);
  return c / 2 ** ROWS;
}

/** Матожидание возврата с фишки (1.00 — возврат ставок). */
export function expectedValue(risk: Risk): number {
  let ev = 0;
  for (let b = 0; b < BINS; b++) ev += binChance(b) * RISKS[risk][b];
  return ev;
}

/** Честные шансы для витрины. */
export function honestOdds(): { label: string; chance: string }[] {
  return [
    { label: 'Край ×10–×70', chance: '1 из 4096' },
    { label: 'Рядом с краем', chance: '12 из 4096' },
    { label: 'Середина', chance: '924 из 4096' },
  ];
}

/** Инварианты выплат и механики. */
export function validatePlinko(): string[] {
  const bad: string[] = [];
  if (ROWS !== 12) bad.push(`рядов ${ROWS}, святых 12`);
  if (BINS !== 13) bad.push(`лунок ${BINS}, святых 13`);
  (Object.keys(RISKS) as Risk[]).forEach(r => {
    const m = RISKS[r];
    if (m.length !== BINS) bad.push(`${r}: лунок ${m.length}`);
    m.forEach((v, i) => {
      if (m[BINS - 1 - i] !== v) bad.push(`${r}: лунка ${i} не зеркалит ${BINS - 1 - i}`);
      if (!(v > 0)) bad.push(`${r}: лунка ${i} = ${v}`);
    });
    const ev = expectedValue(r);
    if (!(ev > 0.95 && ev < 1)) bad.push(`${r}: EV ${ev.toFixed(4)} вне 0.95–1.00`);
  });
  if (settle(Array(12).fill('R') as Step[]).bin !== 12) bad.push('все вправо не 12');
  if (settle(Array(12).fill('L') as Step[]).bin !== 0) bad.push('все влево не 0');
  if (MIN_STAKE !== 10) bad.push(`мин ${MIN_STAKE}, святые 10`);
  return bad;
}
