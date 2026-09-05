import { describe, expect, test } from 'bun:test';
import { HORSES, SPEEDS, payout, tickRace, validateHorses } from './data';

/* БАЛАНС СКАЧЕК: гандикап выравнивает шансы под кэфы,
   каждая лошадь возвращает 0.85–1.00, святыня цела. */

function lcg(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

describe('horses balance', () => {
  test('святыня цела', () => {
    expect(validateHorses(HORSES)).toEqual([]);
  });

  test('гандикап нейтрален и упорядочен', () => {
    expect(SPEEDS).toHaveLength(4);
    const sum = SPEEDS.reduce((a, b) => a + b, 0);
    expect(sum).toBeCloseTo(4, 1);
    expect(SPEEDS[0]).toBeGreaterThan(SPEEDS[1]);
    expect(SPEEDS[1]).toBeGreaterThan(SPEEDS[2]);
    expect(SPEEDS[2]).toBeGreaterThan(SPEEDS[3]);
  });

  test('фаворит выигрывает чаще, аутсайдер — реже, но все доезжают', () => {
    const rnd = lcg(42);
    const wins = [0, 0, 0, 0];
    const N = 2000;
    for (let i = 0; i < N; i++) {
      const p = [0, 0, 0, 0];
      for (let t = 0; t < 500; t++) {
        const { winner } = tickRace(p, rnd);
        if (winner >= 0) { wins[winner]++; break; }
      }
    }
    expect(wins[0]).toBeGreaterThan(wins[1]);
    expect(wins[1]).toBeGreaterThan(wins[2]);
    expect(wins[2]).toBeGreaterThan(wins[3]);
    for (const w of wins) expect(w).toBeGreaterThan(N * 0.05);
  });

  test('выплата — floor(ставка × кэф)', () => {
    for (const h of HORSES) {
      expect(payout(100, h.odds)).toBe(Math.floor(100 * h.odds));
    }
  });
});
