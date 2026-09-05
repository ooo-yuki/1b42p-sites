import { describe, expect, test } from 'bun:test';
import {
  ROWS, BINS, RISKS, dropPath, settle, binChance, expectedValue, validatePlinko,
} from './data';

/* ПЛИНКО — инварианты до кода: путь 12 рядов, лунка 0–12,
   края редкие, EV каждого риска 0.95–1.00 (казино не в минусе, игрок не обобран). */

describe('plinko board', () => {
  test('12 рядов и 13 лунок', () => {
    expect(ROWS).toBe(12);
    expect(BINS).toBe(13);
  });

  test('путь шарика — 12 шагов влево/вправо', () => {
    const p = dropPath(() => 0.7);
    expect(p).toHaveLength(12);
    expect(p.every(s => s === 'L' || s === 'R')).toBe(true);
  });

  test('все вправо — крайняя правая лунка', () => {
    const s = settle(Array(12).fill('R'));
    expect(s.bin).toBe(12);
    expect(s.mult).toBe(RISKS.low[12]);
  });

  test('все влево — крайняя левая лунка', () => {
    expect(settle(Array(12).fill('L')).bin).toBe(0);
  });

  test('шанс края — 1 из 4096', () => {
    expect(binChance(0)).toBeCloseTo(1 / 4096, 8);
    expect(binChance(12)).toBeCloseTo(1 / 4096, 8);
  });

  test('шансы лунок в сумме — единица', () => {
    let sum = 0;
    for (let b = 0; b < 13; b++) sum += binChance(b);
    expect(sum).toBeCloseTo(1, 10);
  });
});

describe('plinko honesty', () => {
  test('низкий риск: края ×10, EV около 0.99', () => {
    expect(RISKS.low[0]).toBe(10);
    expect(RISKS.low[12]).toBe(10);
    const ev = expectedValue('low');
    expect(ev).toBeGreaterThan(0.95);
    expect(ev).toBeLessThan(1);
  });

  test('средний риск: края ×33, EV 0.95–1.00', () => {
    expect(RISKS.mid[0]).toBe(33);
    const ev = expectedValue('mid');
    expect(ev).toBeGreaterThan(0.95);
    expect(ev).toBeLessThan(1);
  });

  test('высокий риск: края ×70, EV 0.95–1.00', () => {
    expect(RISKS.high[0]).toBe(70);
    const ev = expectedValue('high');
    expect(ev).toBeGreaterThan(0.95);
    expect(ev).toBeLessThan(1);
  });

  test('святыня цела: validatePlinko молчит', () => {
    expect(validatePlinko()).toEqual([]);
  });
});
