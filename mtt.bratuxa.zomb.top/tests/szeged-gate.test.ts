// tests/szeged-gate.test.ts
import { expect, test } from 'bun:test';
import { SZEGED_LOGIN, canSee, canCreate, canJoin, visibleInList } from '../shared/szeged-gate';
test('только МТТ', () => {
  expect(SZEGED_LOGIN).toBe('МТТ');
  for (const f of [canSee, canCreate, canJoin, visibleInList]) {
    expect(f('МТТ')).toBe(true);
    expect(f('мтт')).toBe(false);
    expect(f('МТТ ')).toBe(false);
    expect(f('MTT')).toBe(false);
    expect(f('')).toBe(false);
    expect(f(null)).toBe(false);
    expect(f(undefined)).toBe(false);
  }
});
