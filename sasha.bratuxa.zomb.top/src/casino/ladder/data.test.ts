import { describe, expect, test } from 'bun:test';
import {
  STEPS, PASS, MIN_STAKE, MULTS, climb, settleHeight, expectedFirstCash, validateLadder,
} from './data';

/* ЛЕСЕНКА «СИГНАЛ» — инварианты до кода: 8 ступеней, шанс ступени 50/50,
   множители строго растут, забрать на первой — возврат около 0.95. */

describe('ladder board', () => {
  test('8 ступеней и мин ставка 10', () => {
    expect(STEPS).toBe(8);
    expect(MIN_STAKE).toBe(10);
    expect(MULTS).toHaveLength(8);
  });

  test('шанс ступени — честные 50/50', () => {
    expect(PASS).toBe(0.5);
    let ups = 0;
    for (let i = 0; i < 2000; i++) if (climb(() => 0.4)) ups++;
    expect(ups).toBe(2000);
    for (let i = 0; i < 2000; i++) if (climb(() => 0.6)) ups++;
    expect(ups).toBe(2000);
  });

  test('множители строго растут', () => {
    for (let i = 1; i < MULTS.length; i++) {
      expect(MULTS[i]).toBeGreaterThan(MULTS[i - 1]);
    }
  });

  test('забор на первой ступени — возврат 0.9–1.0', () => {
    const ev = expectedFirstCash();
    expect(ev).toBeGreaterThan(0.9);
    expect(ev).toBeLessThan(1);
  });

  test('высота даёт свой множитель', () => {
    expect(settleHeight(0)).toBe(MULTS[0]);
    expect(settleHeight(7)).toBe(MULTS[7]);
  });
});

describe('ladder honesty', () => {
  test('святыня цела: validateLadder молчит', () => {
    expect(validateLadder()).toEqual([]);
  });
});
