import { describe, expect, test } from 'bun:test';
import { CASES, evOf } from './data';

/* БАЛАНС КЕЙСОВ: каждый кейс возвращает 90–100% цены.
   Казино не в минусе, игрок не обобран. */

describe('cases balance', () => {
  for (const c of CASES) {
    test(`${c.id}: RTP 0.90–1.00`, () => {
      const rtp = evOf(c) / c.price;
      expect(rtp).toBeGreaterThan(0.9);
      expect(rtp).toBeLessThan(1);
    });
  }
});
