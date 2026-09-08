import { describe, expect, test } from 'bun:test';
import { fameMult, unlocked } from './formulas';
import { migrateSave } from './formulas';

describe('rebirth', () => {
  test('слава +1 за сезон', () => {
    expect(fameMult(0)).toBe(1);
    expect(fameMult(3)).toBe(4);
  });
  test('площадка с minSeason закрыта до сезона', () => {
    const s = migrateSave({});
    expect(unlocked(s, { id: 'x', cost: 0, need: '', minSeason: 1 }).ok).toBe(false);
  });
  test('старый сейв мигрирует в seasons 0', () => {
    expect(migrateSave({ h: 5 }).seasons).toBe(0);
  });
});
