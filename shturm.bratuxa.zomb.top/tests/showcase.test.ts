import { describe, expect, test } from 'bun:test';
import { makeShowcaseGun, makeShowcaseMob, stepYaw } from '../src/three/showcase';

describe('витрина: билдеры', () => {
  test('пушки строятся и не пустые', () => {
    for (const s of ['pistol', 'auto', 'shotgun'] as const) {
      const g = makeShowcaseGun(s);
      expect(g.children.length).toBeGreaterThan(3);
    }
  });
  test('мобы строятся и не пустые', () => {
    for (const k of ['runner', 'shooter', 'tank', 'seagull'] as const) {
      const g = makeShowcaseMob(k);
      expect(g.children.length).toBeGreaterThan(2);
    }
  });
  test('stepYaw гасит скорость', () => {
    const r = stepYaw(0, 3, 1);
    expect(r.yaw).toBeCloseTo(3, 6);
    expect(Math.abs(r.vel)).toBeLessThan(3);
  });
});
