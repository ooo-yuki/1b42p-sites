// Винстрик: число подряд идущих закрытий персонажей (побед через разбитие
// бутылки) без смертей (без проваленных забегов 'shattered'), суммарно со
// всех персонажей. Персист в localStorage — переживает перезагрузку.
import type { ZapoiEvent } from './types';

export const WINSTREAK_KEY = 'chaev42_winstreak';

/** Событие забега с точки зрения стрика: 'shatter' — закрытие персонажа. */
export type WinstreakEvent = 'shatter' | ZapoiEvent;

/** Чистая логика: +1 на закрытии, сброс в 0 на 'shattered', остальное не трогает. */
export function nextWinstreak(cur: number, ev: WinstreakEvent): number {
  if (ev === 'shatter') return cur + 1;
  if (ev === 'shattered') return 0;
  return cur;
}

function storage(): Storage | null {
  try {
    if (typeof localStorage !== 'undefined') return localStorage;
  } catch {
    /* нет localStorage */
  }
  return null;
}

function normalize(v: unknown): number {
  const n = typeof v === 'string' ? Number(JSON.parse(v)) : Number(v);
  return Number.isFinite(n) && (n as number) >= 0 ? Math.floor(n as number) : 0;
}

export function loadWinstreak(): number {
  try {
    const s = storage()?.getItem(WINSTREAK_KEY);
    if (s == null) return 0;
    return normalize(s);
  } catch {
    return 0;
  }
}

export function saveWinstreak(n: number): void {
  try {
    storage()?.setItem(WINSTREAK_KEY, JSON.stringify(normalize(n)));
  } catch {
    /* тихо */
  }
}

/** +1 к стрику (закрытие персонажа). Возвращает новое значение. */
export function bumpWinstreak(): number {
  const n = loadWinstreak() + 1;
  saveWinstreak(n);
  return n;
}

/** Сброс стрика в 0 (провал забега). Возвращает 0. */
export function resetWinstreak(): number {
  saveWinstreak(0);
  return 0;
}
