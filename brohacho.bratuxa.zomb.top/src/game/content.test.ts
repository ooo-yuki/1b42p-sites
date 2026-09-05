/* Контент-таблицы Фабрики: площадки, команда, прокачка, стройки. RED. */
import { describe, expect, test } from 'vitest';
import { BUILDS, LOOKS, TEAM, VENUES, WIN_GOAL } from './content';

describe('venues', () => {
  test('4 площадки с полями и растущими ценами', () => {
    expect(VENUES.map(v => v.id)).toEqual(['garage', 'club', 'arena', 'slay']);
    for (const v of VENUES) {
      expect(v.speed).toBeGreaterThan(0);
      expect(v.zone).toBeGreaterThan(0);
      expect(v.base).toBeGreaterThan(0);
      expect(v.gap).toBeGreaterThan(0);
    }
    const costs = VENUES.map(v => v.cost);
    expect([...costs].sort((a, b) => a - b)).toEqual(costs);
  });
  test('гол — 420000 хайпа', () => {
    expect(WIN_GOAL).toBe(420000);
  });
});

describe('shops', () => {
  test('команда из 4, образы из 4, стройки из 3 — у всех имя и цена', () => {
    expect(Object.keys(TEAM)).toHaveLength(4);
    expect(Object.keys(LOOKS)).toHaveLength(4);
    expect(Object.keys(BUILDS)).toHaveLength(3);
    for (const o of [...Object.values(TEAM), ...Object.values(LOOKS), ...Object.values(BUILDS)]) {
      expect(o.n.length).toBeGreaterThan(0);
      expect(o.base).toBeGreaterThan(0);
    }
  });
});
