import { describe, expect, test } from 'bun:test';
import { N, settle, validateRoulette } from './data';

/* БАЛАНС РУЛЕТКИ: каждая ставка возвращает 0.90–1.00.
   Зеро — обычный straight-up ×35, а не ловушка. */

function evOfBet(choice: string, stake: number): number {
  let total = 0;
  for (let n = 0; n < N; n++) total += settle(choice, n, stake);
  return total / N / stake;
}

describe('roulette balance', () => {
  test('святыня цела', () => {
    expect(validateRoulette()).toEqual([]);
  });

  test('красное/черное: RTP 0.90–1.00', () => {
    expect(evOfBet('red', 100)).toBeGreaterThan(0.9);
    expect(evOfBet('red', 100)).toBeLessThan(1);
    expect(evOfBet('black', 100)).toBeGreaterThan(0.9);
    expect(evOfBet('black', 100)).toBeLessThan(1);
  });

  test('зеро: RTP 0.90–1.00 (не ловушка)', () => {
    const ev = evOfBet('green', 100);
    expect(ev).toBeGreaterThan(0.9);
    expect(ev).toBeLessThan(1);
  });

  test('точное число: RTP 0.90–1.00', () => {
    const ev = evOfBet('7', 100);
    expect(ev).toBeGreaterThan(0.9);
    expect(ev).toBeLessThan(1);
  });
});
