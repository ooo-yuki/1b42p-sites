import { describe, expect, test } from 'bun:test';
import { createPlayer, movePlayer } from '../src/sim/player';
describe('player', () => {
  test('бег быстрее ходьбы и жрёт стамину', () => {
    const p = createPlayer();
    movePlayer(p, { fwd: 1, strafe: 0, sprint: true, dt: 1 }, 1);
    expect(p.stamina).toBeLessThan(43);
    expect(Math.hypot(p.vx, p.vz)).toBeGreaterThan(4.5);
  });
});
