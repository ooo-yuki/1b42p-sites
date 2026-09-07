import { describe, expect, test } from 'bun:test';
import { createPlayer, movePlayer } from '../src/sim/player';
describe('player', () => {
  test('бег быстрее ходьбы и жрёт стамину', () => {
    const p = createPlayer();
    movePlayer(p, { fwd: 1, strafe: 0, sprint: true, dt: 1 }, 1);
    expect(p.stamina).toBeLessThan(43);
    expect(Math.hypot(p.vx, p.vz)).toBeGreaterThan(4.5);
  });
  test('прыжок поднимает и гравитация возвращает на землю', () => {
    const p = createPlayer();
    const dt = 1 / 60;
    movePlayer(p, { fwd: 0, strafe: 0, sprint: false, dt, jump: true }, dt);
    expect(p.y).toBeGreaterThan(0);
    for (let i = 0; i < 120; i++) movePlayer(p, { fwd: 0, strafe: 0, sprint: false, dt }, dt);
    expect(p.y).toBe(0);
  });
  test('присед режет скорость до 2.3 и гасит спринт', () => {
    const p = createPlayer();
    const dt = 1 / 60;
    movePlayer(p, { fwd: 1, strafe: 0, sprint: true, crouch: true, dt }, dt);
    expect(p.crouch).toBe(true);
    expect(Math.hypot(p.vx, p.vz)).toBeCloseTo(2.3, 5);
  });
  test('дабл-джамп запрещён: повторный jump в воздухе не растит vy', () => {
    const p = createPlayer();
    const dt = 1 / 60;
    movePlayer(p, { fwd: 0, strafe: 0, sprint: false, dt, jump: true }, dt);
    const vyAfterFirst = p.vy;
    movePlayer(p, { fwd: 0, strafe: 0, sprint: false, dt, jump: true }, dt);
    expect(p.vy).toBeLessThan(vyAfterFirst);
  });
});
