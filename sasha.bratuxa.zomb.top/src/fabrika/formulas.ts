/* Движок Фабрики Хайпа — чистые формулы, ноль DOM.
   Порт 1:1 из legacy.html: те же числа, те же окна, те же множители. */

export type Judge = 'perfect' | 'great' | 'good' | 'miss';

export function lvlCost(base: number, lv: number): number {
  return Math.floor(base * Math.pow(3, lv));
}

export function judgeDist(d: number, zw: number): Judge {
  if (d <= zw / 4) return 'perfect';
  if (d <= zw / 2) return 'great';
  if (d <= zw) return 'good';
  return 'miss';
}

export function fmt(n: number): string {
  n = Math.floor(n);
  if (n >= 999950) return (n / 1e6).toFixed(2) + 'M';
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
  return String(n);
}

/* Сейв 1:1 с legacy (ключ brohacho42_v1): те же поля, те же нули. */
export type Save = {
  h: number; f: number; total: number; un: string[];
  team: Record<string, number>; look: Record<string, number>; bld: Record<string, number>;
  win: boolean;
};

export function defaultSave(): Save {
  return {
    h: 0, f: 0, total: 0, un: ['garage'],
    team: { denis: 0, freak: 0, oper: 0, guard: 0 },
    look: { jacket: 0, mantle: 0, sneakers: 0, hair: 0 },
    bld: { arena: 0, banka: 0, garden: 0 },
    win: false,
  };
}

/** Мёрж старого сейва поверх дефолта — схема переживает код. */
export function migrateSave(raw: unknown): Save {
  const d = defaultSave();
  if (!raw || typeof raw !== 'object') return d;
  const s = raw as Record<string, unknown>;
  const out: Save = {
    h: typeof s.h === 'number' ? s.h : 0,
    f: typeof s.f === 'number' ? s.f : 0,
    total: typeof s.total === 'number' ? s.total : 0,
    un: Array.isArray(s.un) && s.un.length > 0 ? (s.un as string[]) : ['garage'],
    team: { ...d.team }, look: { ...d.look }, bld: { ...d.bld },
    win: s.win === true,
  };
  for (const k of (['team', 'look', 'bld'] as const)) {
    const part = s[k];
    if (part && typeof part === 'object') {
      for (const j of Object.keys(out[k])) {
        const v = (part as Record<string, unknown>)[j];
        if (typeof v === 'number') out[k][j] = v;
      }
    }
  }
  return out;
}

export function fans(total: number): number {
  return Math.floor(Math.sqrt(total) / 5);
}

export function stZone(v: { zone: number }, s: Save): number {
  return v.zone + 3 * s.look.jacket;
}

export function stComboCap(s: Save): number {
  return [10, 15, 22, 30][s.look.sneakers] ?? 10;
}

export function stDouble(s: Save): number {
  return [0, 0.1, 0.2, 0.35][s.look.mantle] ?? 0;
}

/** Чистый подсчёт удара 1:1 с legacy hitNote. */
export function scoreHit(
  base: number, j: Judge, combo: number, critM: number,
  comboStep: number, doubleP: number, rng: () => number = Math.random,
): { val: number; doubled: boolean } {
  const mult = j === 'perfect' ? 3 : j === 'great' ? 2 : 0.5;
  let val = base * mult * critM * (1 + combo * comboStep);
  const doubled = rng() < doubleP;
  if (doubled) val *= 2;
  return { val, doubled };
}

export type Unlock = { ok: boolean; buy?: boolean; why?: string };

export function unlocked(s: Save, v: { id: string; cost: number; need: string }): Unlock {
  if (s.un.indexOf(v.id) >= 0) return { ok: true };
  if (s.h < v.cost) return { ok: false, why: 'Нужно ' + fmt(v.cost) + ' хайпа' };
  if (v.need === 'jacket' && s.look.jacket < 1) return { ok: false, why: 'Нужен зеркальный пиджак' };
  if (v.need === 'mantle+sneakers' && (s.look.mantle < 1 || s.look.sneakers < 1)) {
    return { ok: false, why: 'Нужны мантия и кроссовки' };
  }
  return { ok: true, buy: true };
}
