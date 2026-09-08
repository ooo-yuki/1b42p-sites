// Сейвы обороны: тот же ключ, мёрж поверх дефолтов со святынями ребита.
export const SAVE_KEY = 'sasha_def42_v1';

export interface Best {
  stars: number;
  wave: number;
  medals: number;
  bestEndless: number;
}

export function freshBest(): Best {
  return { stars: 0, wave: 0, medals: 0, bestEndless: 0 };
}

type Store = Pick<Storage, 'getItem' | 'setItem'>;

export function readBest(storage: Pick<Storage, 'getItem'>): Best {
  const fresh = freshBest();
  try {
    const raw = storage.getItem(SAVE_KEY);
    if (!raw) return fresh;
    const p = JSON.parse(raw) as Partial<Best>;
    return {
      stars: typeof p.stars === 'number' ? p.stars : fresh.stars,
      wave: typeof p.wave === 'number' ? p.wave : fresh.wave,
      medals: typeof p.medals === 'number' ? Math.max(0, Math.floor(p.medals)) : fresh.medals,
      bestEndless: typeof p.bestEndless === 'number' ? Math.max(0, Math.floor(p.bestEndless)) : fresh.bestEndless,
    };
  } catch {
    return fresh;
  }
}

export function writeBest(storage: Store, b: Best): void {
  try {
    storage.setItem(SAVE_KEY, JSON.stringify(b));
  } catch { /* сейв не критичен */ }
}
