// Часы и распорядок верхнего слоя. Ничего не берёт, отдаёт tick и hourCase.
// Распорядок: подъём, поверка, еда, работа, душ, поверка, отбой.

export interface Day {
  t: number;
  day: number;
  heat: number;
  coins: number;
  lights: boolean;
}

export const HOUR: number = 3600;
export const DAY_LEN: number = 86400;

const NIGHT_END: number = 6 * HOUR;
const MUSTER1: number = 7 * HOUR;
const MEAL: number = 8 * HOUR;
const WORK: number = 9 * HOUR;
const SHOWER: number = 17 * HOUR;
const MUSTER2: number = 18 * HOUR;
const MUSTER2_END: number = 19 * HOUR;
export const LIGHTSOUT: number = 22 * HOUR;

export const MAX_HEAT: number = 3;

export function newDay(): Day {
  return { t: 0, day: 1, heat: 0, coins: 0, lights: false };
}

export function tick(S: Day, dt: number): void {
  if (dt < 0) dt = 0;
  S.t += dt;
  while (S.t >= DAY_LEN) {
    S.t -= DAY_LEN;
    S.day += 1;
  }
  S.lights = S.t >= NIGHT_END && S.t < LIGHTSOUT;
}

export function hourCase(S: Day): string {
  const t: number = S.t;
  if (t < NIGHT_END) return 'ночь';
  if (t < MUSTER1) return 'подъём';
  if (t < MEAL) return 'поверка';
  if (t < WORK) return 'еда';
  if (t < SHOWER) return 'работа';
  if (t < MUSTER2) return 'душ';
  if (t < MUSTER2_END) return 'поверка';
  if (t < LIGHTSOUT) return 'вечер';
  return 'отбой';
}

// Нет на поверке — розыск вверх, потолок три.
export function applyMuster(S: Day, present: boolean): void {
  if (!present && S.heat < MAX_HEAT) S.heat += 1;
}

// Был на работе — монета, нет — без монет.
export function applyWork(S: Day, present: boolean): void {
  if (present) S.coins += 1;
}

export function isNight(S: Day): boolean {
  return !S.lights;
}
