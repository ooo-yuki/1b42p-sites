/** Чистые хелперы тач-ввода и бюджета света (без DOM — тестируются в bun). */

/** Мёртвая зона стика: внутри радиуса — 0, снаружи — перенормировка 0..1. */
export function deadzone(v: number, r = 0.15): number {
  if (Math.abs(v) < r) return 0;
  const s = Math.sign(v);
  return s * Math.min(1, (Math.abs(v) - r) / (1 - r));
}

/**
 * Удержание правого стика → угловая скорость камеры (рад/с).
 * Полное отклонение = TURN_MAX, знак: вправо/вверх — как мышь.
 */
export const TURN_MAX = 2.6;

export function heldTurnRate(held: number): number {
  return deadzone(held) * TURN_MAX;
}

/**
 * Бюджет света: какие из N дистанций оставить включёнными (n ближайших).
 * Возвращает флаги той же длины. Стабилен к равным дистанциям.
 */
export function nearestFlags(dists: number[], n: number): boolean[] {
  const order = dists.map((d, i) => i).sort((a, b) => dists[a] - dists[b]);
  const on = new Set(order.slice(0, Math.max(0, n)));
  return dists.map((_, i) => on.has(i));
}

/** Минимальная форма врага для бюджета фонарей (структурно совпадает с Enemy из main). */
export interface BeamEnemy {
  beam: { visible: boolean } | null;
  x: number;
  z: number;
  dying: boolean;
}

/** Гасим фонари всех стрелков кроме n ближайших (линзы emissive горят всегда). */
export function updateBeamBudget(es: BeamEnemy[], px: number, pz: number, n = 3): void {
  const shooters = es.filter((e) => e.beam && !e.dying);
  if (shooters.length === 0) return;
  const flags = nearestFlags(shooters.map((e) => Math.hypot(e.x - px, e.z - pz)), n);
  shooters.forEach((e, i) => { if (e.beam) e.beam.visible = flags[i]; });
}
