import { describe, expect, test } from 'bun:test';
import { WEAPONS, fireShot } from '../src/sim/weapons';
describe('weapons', () => {
  test('дробовик даёт 6 дробин', () => {
    expect(WEAPONS.shotgun.pellets).toBe(6);
    const r = fireShot('shotgun', 10, 0);
    expect(r.pellets.length).toBe(6);
  });
});
