/* ЛЕСЕНКА «СИГНАЛ» — 8 ступеней вверх. Правила СВЯТЫ: шанс ступени 50/50,
   множители зафиксированы и строго растут, на каждой ступени выбор —
   «Вверх» (риск) или «Забрать». Упал — ставка сгорает целиком. */

export const STEPS = 8;
export const PASS = 0.5;
export const MIN_STAKE = 10;

/** Множитель забора на высоте h (0–7). */
export const MULTS = [1.9, 3.7, 7.2, 14, 27, 52, 100, 195];

/** Шаг вверх: rnd() < 0.5 — поднялся, иначе — сорвался. */
export function climb(rnd: () => number = Math.random): boolean {
  return rnd() < PASS;
}

/** Множитель текущей высоты. */
export function settleHeight(h: number): number {
  return MULTS[Math.max(0, Math.min(STEPS - 1, h))];
}

/** Возврат при заборе на первой ступени: 0.5 × 1.9 = 0.95. */
export function expectedFirstCash(): number {
  return PASS * MULTS[0];
}

/** Честные шансы для витрины. */
export function honestOdds(): { label: string; chance: string }[] {
  return [
    { label: 'Ступень вверх', chance: '1 из 2' },
    { label: 'Вершина ×195', chance: '1 из 256' },
    { label: 'Забор на первой ×1.9', chance: 'возврат 95%' },
  ];
}

/** Инварианты выплат и механики. */
export function validateLadder(): string[] {
  const bad: string[] = [];
  if (STEPS !== 8) bad.push(`ступеней ${STEPS}, святых 8`);
  if (PASS !== 0.5) bad.push(`шанс ${PASS}, святые 1/2`);
  if (MULTS.length !== STEPS) bad.push(`множителей ${MULTS.length}`);
  MULTS.forEach((m, i) => {
    if (!(m > 0)) bad.push(`ступень ${i}: ×${m}`);
    if (i > 0 && !(m > MULTS[i - 1])) bad.push(`ступень ${i} не выше прошлой`);
  });
  const ev = expectedFirstCash();
  if (!(ev > 0.9 && ev < 1)) bad.push(`первый забор ${ev.toFixed(3)} вне 0.90–1.00`);
  if (settleHeight(0) !== MULTS[0] || settleHeight(7) !== MULTS[7]) bad.push('высота врёт');
  if (MIN_STAKE !== 10) bad.push(`мин ${MIN_STAKE}, святые 10`);
  return bad;
}
