import { describe, expect, test } from 'bun:test';
import { deadzone, heldTurnRate, nearestFlags, TURN_MAX } from '../src/sim/touch';

describe('тач-хелперы', () => {
  test('мёртвая зона: внутри 0, край перенормирован', () => {
    expect(deadzone(0)).toBe(0);
    expect(deadzone(0.1)).toBe(0);
    expect(deadzone(-0.1)).toBe(0);
    expect(deadzone(1)).toBeCloseTo(1, 6);
    expect(deadzone(-1)).toBeCloseTo(-1, 6);
    expect(deadzone(0.575)).toBeCloseTo(0.5, 6);
  });
  test('held → рад/с: полное отклонение = TURN_MAX', () => {
    expect(heldTurnRate(1)).toBeCloseTo(TURN_MAX, 6);
    expect(heldTurnRate(-1)).toBeCloseTo(-TURN_MAX, 6);
    expect(heldTurnRate(0)).toBe(0);
    expect(heldTurnRate(0.1)).toBe(0);
  });
  test('бюджет света: n ближайших', () => {
    expect(nearestFlags([5, 1, 3], 2)).toEqual([false, true, true]);
    expect(nearestFlags([5, 1, 3], 0)).toEqual([false, false, false]);
    expect(nearestFlags([5, 1, 3], 9)).toEqual([true, true, true]);
    expect(nearestFlags([], 3)).toEqual([]);
  });
});
