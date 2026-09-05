/* КОЛЕСО ФОРТУНЫ — 10 равных клиньев, стрелка сверху. Правила СВЯТЫ:
   сектор — равномерный кубик (угол честный), зеро сжигает ставку,
   возврат колеса 0.95. Колесо крутится ПОД результат, а не наоборот. */

export const SECTORS = [0, 1, 0.5, 2, 0, 1, 0.5, 4, 0, 0.5];
export const SECTOR_DEG = 360 / SECTORS.length;
export const MIN_STAKE = 10;
export const TURNS = 3;

/** Случайный сектор 0–9, равномерный. */
export function spinSector(rnd: () => number = Math.random): number {
  return Math.min(SECTORS.length - 1, Math.floor(rnd() * SECTORS.length));
}

/** Множитель сектора. */
export function settleSector(s: number): number {
  return SECTORS[Math.max(0, Math.min(SECTORS.length - 1, s))];
}

/** Возврат колеса: средний множитель (сектора равные). */
export function expectedValue(): number {
  return SECTORS.reduce((a, m) => a + m, 0) / SECTORS.length;
}

/** Финальный угол колеса, чтобы стрелка сверху указала на сектор s. */
export function angleFor(s: number): number {
  return TURNS * 360 + (360 - (s * SECTOR_DEG + SECTOR_DEG / 2));
}

/** Честные шансы для витрины. */
export function honestOdds(): { label: string; chance: string }[] {
  return [
    { label: 'Любой сектор', chance: '1 из 10' },
    { label: 'Топ ×4', chance: '1 из 10' },
    { label: 'Зеро (сгорает)', chance: '3 из 10' },
  ];
}

/** Инварианты выплат и механики. */
export function validateWheel(): string[] {
  const bad: string[] = [];
  if (SECTORS.length !== 10) bad.push(`клиньев ${SECTORS.length}, святых 10`);
  if (SECTOR_DEG !== 36) bad.push(`клин ${SECTOR_DEG}°, святых 36`);
  if (Math.max(...SECTORS) !== 4) bad.push('топ не ×4');
  if (SECTORS.filter(m => m === 0).length !== 3) bad.push('зеро не три');
  const ev = expectedValue();
  if (!(ev > 0.9 && ev < 1)) bad.push(`возврат ${ev.toFixed(3)} вне 0.90–1.00`);
  if (spinSector(() => 0) !== 0 || spinSector(() => 0.999) !== 9) bad.push('кубик врёт');
  if (MIN_STAKE !== 10) bad.push(`мин ${MIN_STAKE}, святые 10`);
  return bad;
}
