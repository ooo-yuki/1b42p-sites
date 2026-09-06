import { describe, expect, test } from 'bun:test';
import { createPlayer, movePlayer, MAX_HP, WALK_SPEED, SPRINT_SPEED } from '../src/sim/player';
import { ATTACK_RANGE } from '../src/sim/enemies';
describe('баланс: герой', () => {
  test('HP 160, минимум 4 удара танка (40)', () => {
    expect(MAX_HP).toBe(160);
    expect(createPlayer().hp).toBe(160);
    expect(Math.floor(MAX_HP / 40)).toBeGreaterThanOrEqual(4);
  });
  test('шаг 4.6 / спринт 7.8', () => {
    expect(WALK_SPEED).toBeCloseTo(4.6, 6);
    expect(SPRINT_SPEED).toBeCloseTo(7.8, 6);
    const p = createPlayer();
    movePlayer(p, { fwd: 1, strafe: 0, sprint: false, dt: 1 }, 1);
    expect(Math.hypot(p.vx, p.vz)).toBeCloseTo(4.6, 6);
  });
});
describe('баланс: дальности', () => {
  test('шутер и мили урезаны', () => {
    expect(ATTACK_RANGE.shooter).toBe(18);
    expect(ATTACK_RANGE.melee).toBe(1.3);
    expect(ATTACK_RANGE.tank).toBe(2.5);
    expect(ATTACK_RANGE.boss).toBe(3.0);
  });
});
