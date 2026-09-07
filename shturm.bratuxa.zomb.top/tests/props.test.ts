import { describe, expect, test } from 'bun:test';
import { resolveCircle } from '../src/sim/maps';

// Task 2 RED: коллизии пропсов. Радиус игрока 0.4 (как в main.tsx).
describe('пропсы', () => {
  test('ящик держит: push-out на 1.7', () => {
    // Ящик yard (12,10) r1.3: старт внутри (12,9), дистанция 1.0 < 1.3+0.4.
    const pos = { x: 12, z: 9 };
    const hit = resolveCircle(pos, 0.4, 'yard');
    expect(hit).toBe(true);
    expect(Math.hypot(pos.x - 12, pos.z - 10)).toBeCloseTo(1.7, 5);
  });
  test('покрышки держат на земле и пропускают в прыжке', () => {
    // Стопка (8,-6) r1.0 h1.1: на земле держит, на y:1.2 выше верха — пропуск.
    const gnd = { x: 8, z: -6, y: 0 };
    expect(resolveCircle(gnd, 0.4, 'yard')).toBe(true);
    const air = { x: 8, z: -6, y: 1.2 };
    expect(resolveCircle(air, 0.4, 'yard')).toBe(false);
  });
  test('пруд держит даже в прыжке (y:5)', () => {
    // Пруд (10,-2) r3.6 h99: перепрыгнуть нельзя.
    const pos = { x: 10, z: -2, y: 5 };
    expect(resolveCircle(pos, 0.4, 'yard')).toBe(true);
  });
  test('пальма держит (island)', () => {
    // Пальма (-20,-14) r0.5 h99.
    const pos = { x: -20, z: -14 };
    expect(resolveCircle(pos, 0.4, 'island')).toBe(true);
  });
});
