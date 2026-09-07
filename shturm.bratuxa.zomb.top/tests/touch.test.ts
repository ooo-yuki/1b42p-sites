import { describe, expect, test } from 'bun:test';
import { deadzone, heldTurnRate, nearestFlags, updateBeamBudget, TURN_MAX } from '../src/sim/touch';

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
  test('updateBeamBudget: горят 3 ближайших, мёртвые и без фонаря — мимо', () => {
    const mk = (x: number, dying = false, beam = true) => ({ beam: beam ? { visible: true } : null, x, z: 0, dying });
    const es = [mk(10), mk(1), mk(5), mk(2), mk(30, true), mk(0.5, false, false)];
    updateBeamBudget(es, 0, 0);
    expect(es.map((e) => (e.beam ? e.beam.visible : 'none'))).toEqual([false, true, true, true, true, 'none']);
  });
});
