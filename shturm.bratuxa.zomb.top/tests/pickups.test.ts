import { describe, expect, test } from 'bun:test';
import { spawnPickups, updatePickups, MEDKIT_HEAL, MEDKIT_RESPAWN } from '../src/sim/pickups';
describe('банки', () => {
  test('3 банки на карту, вне препятствий (yard)', () => {
    const list = spawnPickups('yard');
    expect(list.length).toBe(3);
    for (const m of list) {
      expect(Math.hypot(m.x, m.z)).toBeLessThan(20);
      expect(Math.hypot(m.x - 0, m.z - 0)).toBeGreaterThan(2.5);
    }
  });
  test('подбор хилит 1 раз + респаун 25с', () => {
    const list = spawnPickups('yard');
    const m = list[0];
    expect(updatePickups(list, m.x, m.z, 0.016)).toBe(MEDKIT_HEAL);
    expect(m.taken).toBe(true);
    expect(updatePickups(list, m.x, m.z, 0.016)).toBe(0);
    expect(updatePickups(list, m.x + 99, m.z, MEDKIT_RESPAWN)).toBe(0);
    expect(m.taken).toBe(false);
    expect(updatePickups(list, m.x, m.z, 0.016)).toBe(MEDKIT_HEAL);
  });
});
