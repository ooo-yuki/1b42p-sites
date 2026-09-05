/* Сейвы: ключ тот же, битый JSON и partial-формы переживаются. RED. */
import { describe, expect, test } from 'vitest';
import { SAVE_KEY, loadSave, storeSave } from './save';

const mem = (data: Record<string, string> = {}): Storage => ({
  getItem: (k: string) => (k in data ? data[k] : null),
  setItem: (k: string, v: string) => { data[k] = v; },
} as unknown as Storage);

describe('saves', () => {
  test('ключ как в legacy', () => {
    expect(SAVE_KEY).toBe('brohacho42_v1');
  });
  test('пусто и битый JSON → дефолт', () => {
    expect(loadSave(mem()).un).toEqual(['garage']);
    expect(loadSave(mem({ [SAVE_KEY]: 'не json' })).h).toBe(0);
  });
  test('круг: сохранил → загрузил то же', () => {
    const st = mem();
    const s = loadSave(st);
    s.h = 1234;
    s.look.jacket = 2;
    storeSave(st, s);
    const back = loadSave(st);
    expect(back.h).toBe(1234);
    expect(back.look.jacket).toBe(2);
  });
  test('legacy-форма без win → win false, прогресс цел', () => {
    const legacy = { h: 500, f: 10, total: 500, un: ['garage', 'club'], team: { denis: 1 }, look: {}, bld: {} };
    const back = loadSave(mem({ [SAVE_KEY]: JSON.stringify(legacy) }));
    expect(back.win).toBe(false);
    expect(back.team.denis).toBe(1);
    expect(back.un).toEqual(['garage', 'club']);
  });
});
