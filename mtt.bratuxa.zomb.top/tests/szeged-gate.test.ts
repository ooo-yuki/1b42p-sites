// tests/szeged-gate.test.ts
import { expect, test } from 'bun:test';
import { SZEGED_LOGIN, canSee, canCreate, canJoin, visibleInList } from '../shared/szeged-gate';
test('МТТ или DEV-владелец', () => {
  expect(SZEGED_LOGIN).toBe('МТТ');
  for (const f of [canSee, canCreate, canJoin, visibleInList]) {
    // ключ 1: МТТ без dev-флага — можно
    expect(f('МТТ')).toBe(true);
    expect(f('МТТ', false)).toBe(true);
    // ключ 2: чужой логин + isDev — можно
    expect(f('чужой', true)).toBe(true);
    expect(f('МТТ', true)).toBe(true);
    // без ключей — нельзя
    expect(f('чужой', false)).toBe(false);
    expect(f('мтт')).toBe(false);
    expect(f('МТТ ')).toBe(false);
    expect(f('MTT')).toBe(false);
    expect(f('')).toBe(false);
    expect(f(null)).toBe(false);
    expect(f(undefined)).toBe(false);
    expect(f(null, true)).toBe(true); // dev-флаг решает сам по себе
    expect(f(undefined, true)).toBe(true);
    expect(f('', false)).toBe(false);
  }
});
