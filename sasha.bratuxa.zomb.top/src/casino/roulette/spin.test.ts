import { describe, expect, test } from 'bun:test';
import { N, angleForPocket, nextAngle, pocketAtAngle, spinPocket, validateRoulette } from './data';

/* РУЛЕТКА — колесо показывает то, что выпало: исход решается ПЕРВЫМ,
   угол докручивается ПОД него. Раунд-трип всех 37 карманов. */

describe('roulette spin honesty', () => {
  test('святыня цела', () => {
    expect(validateRoulette()).toEqual([]);
  });

  test('каждый карман встаёт под иглу: round-trip 0–36', () => {
    for (let n = 0; n < N; n++) {
      expect(pocketAtAngle(angleForPocket(n))).toBe(n);
    }
  });

  test('докрутка — только вперёд, минимум 3 круга, приземление на карман', () => {
    for (const cur of [0, 100, 359.9, 1440 + 123.4]) {
      for (const n of [0, 7, 18, 36]) {
        const a = nextAngle(cur, n);
        expect(a - cur).toBeGreaterThanOrEqual(3 * 360);
        expect(pocketAtAngle(a)).toBe(n);
      }
    }
  });

  test('исход — равномерный кубик 0–36', () => {
    expect(spinPocket(() => 0)).toBe(0);
    expect(spinPocket(() => 0.999)).toBe(36);
    expect(spinPocket(() => 0.5)).toBe(Math.floor(0.5 * N));
  });
});
