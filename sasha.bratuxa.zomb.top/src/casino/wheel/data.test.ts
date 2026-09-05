import { describe, expect, test } from 'bun:test';
import {
  SECTORS, SECTOR_DEG, MIN_STAKE, spinSector, settleSector, expectedValue, validateWheel,
} from './data';

/* КОЛЕСО ФОРТУНЫ — инварианты до кода: 10 равных клиньев, сектор uniform,
   возврат 0.9–1.0, зеро честно сжигает ставку. */

describe('wheel board', () => {
  test('10 клиньев по 36 градусов и мин ставка 10', () => {
    expect(SECTORS).toHaveLength(10);
    expect(SECTOR_DEG).toBe(36);
    expect(MIN_STAKE).toBe(10);
  });

  test('сектор — равномерный кубик 0–9', () => {
    const s = spinSector(() => 0.0);
    expect(s).toBe(0);
    expect(spinSector(() => 0.999)).toBe(9);
    expect(spinSector(() => 0.35)).toBe(3);
  });

  test('зеро сжигает, топ платит ×4', () => {
    expect(settleSector(0)).toBe(SECTORS[0]);
    expect(Math.max(...SECTORS)).toBe(4);
  });

  test('возврат колеса — 0.9–1.0', () => {
    const ev = expectedValue();
    expect(ev).toBeGreaterThan(0.9);
    expect(ev).toBeLessThan(1);
  });
});

describe('wheel honesty', () => {
  test('святыня цела: validateWheel молчит', () => {
    expect(validateWheel()).toEqual([]);
  });
});
