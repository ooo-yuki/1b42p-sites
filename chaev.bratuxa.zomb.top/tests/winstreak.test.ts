import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  WINSTREAK_KEY,
  bumpWinstreak,
  loadWinstreak,
  nextWinstreak,
  resetWinstreak,
  saveWinstreak,
} from '../src/game/zapoi/winstreak';

// Node-окружение без DOM: подменяем localStorage памятью.
function stubStorage() {
  let store: Record<string, string> = {};
  const s = {
    getItem: (k: string) => (k in store ? store[k] : null),
    setItem: (k: string, v: string) => { store[k] = String(v); },
    removeItem: (k: string) => { delete store[k]; },
    clear: () => { store = {}; },
  };
  vi.stubGlobal('localStorage', s);
  return s;
}

describe('винстрик', () => {
  beforeEach(() => {
    stubStorage();
  });

  it('растёт на закрытии персонажа (shatter → +1)', () => {
    expect(nextWinstreak(0, 'shatter')).toBe(1);
    expect(nextWinstreak(2, 'shatter')).toBe(3);
    expect(bumpWinstreak()).toBe(1);
    expect(bumpWinstreak()).toBe(2);
    expect(loadWinstreak()).toBe(2);
  });

  it('сбрасывается в 0 на провале забега (shattered)', () => {
    saveWinstreak(5);
    expect(nextWinstreak(5, 'shattered')).toBe(0);
    expect(resetWinstreak()).toBe(0);
    expect(loadWinstreak()).toBe(0);
  });

  it('похмелье и прочие события стрик не трогают', () => {
    expect(nextWinstreak(3, 'hangover')).toBe(3);
    expect(nextWinstreak(3, 'demonform')).toBe(3);
    expect(nextWinstreak(3, null)).toBe(3);
  });

  it('переживает перезагрузку (персист в localStorage)', () => {
    saveWinstreak(4);
    expect(localStorage.getItem(WINSTREAK_KEY)).toBe('4');
    // «перезагрузка»: состояние модуля то же, читаем заново из стораджа
    expect(loadWinstreak()).toBe(4);
  });

  it('битый сейв читается как 0', () => {
    localStorage.setItem(WINSTREAK_KEY, 'не число');
    expect(loadWinstreak()).toBe(0);
    localStorage.setItem(WINSTREAK_KEY, '-7');
    expect(loadWinstreak()).toBe(0);
  });
});
