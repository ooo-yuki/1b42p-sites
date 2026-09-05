import { describe, expect, test } from 'bun:test';
import { makeWave } from '../src/sim/waves';
describe('waves', () => {
  test('7-я волна содержит босса', () => { expect(makeWave(7).some(s => s.type === 'boss')).toBe(true); });
  test('1-я волна дешёвая', () => { expect(makeWave(1).length).toBeLessThan(12); });
});
