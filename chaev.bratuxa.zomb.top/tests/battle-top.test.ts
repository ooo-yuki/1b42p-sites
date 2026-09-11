import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TOP_KEY, addToTop, loadTop } from '../src/battle/top';

function stubStorage() {
  let store: Record<string, string> = {};
  const s = {
    getItem: (k: string) => (k in store ? store[k] : null),
    setItem: (k: string, v: string) => {
      store[k] = String(v);
    },
    removeItem: (k: string) => {
      delete store[k];
    },
    clear: () => {
      store = {};
    },
  };
  vi.stubGlobal('localStorage', s);
  return s;
}

describe('топ похвалы', () => {
  beforeEach(() => {
    stubStorage();
  });

  it('мёрджит по имени, сортирует по убыванию', () => {
    addToTop('Brat1', 30);
    addToTop('Brat2', 50);
    const top = addToTop('Brat1', 10);
    expect(top).toEqual([
      { name: 'Brat2', score: 50 },
      { name: 'Brat1', score: 40 },
    ]);
    expect(loadTop()).toEqual(top);
    expect(JSON.parse(localStorage.getItem(TOP_KEY)!)).toEqual(top);
  });
});
