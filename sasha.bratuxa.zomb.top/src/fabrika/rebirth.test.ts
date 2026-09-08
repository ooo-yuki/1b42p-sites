import { describe, expect, test } from 'bun:test';
import { fameMult, unlocked } from './formulas';
import { migrateSave } from './formulas';
import { BUILDS, LOOKS, RAID_NAMES, TEAM, VENUES } from './content';

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
  test('пост-пул фабрики по спеке', () => {
    const ids = VENUES.map(v => v.id);
    expect(ids).toContain('stadium');
    expect(ids).toContain('kuzbass');
    expect(TEAM.piar.d).toMatch(/комбо/);
    expect(LOOKS.chains).toBeDefined();
    expect(RAID_NAMES.slay).toBe('Экс-продюсер');
  });
  test('лесенка гейтов 1–5', () => {
    expect(VENUES.find(v => v.id === 'stadium')!.minSeason).toBe(1);
    expect(VENUES.find(v => v.id === 'kuzbass')!.minSeason).toBe(3);
    expect(TEAM.piar.needSeasons).toBe(2);
    expect(LOOKS.chains.needSeasons).toBe(4);
    expect(BUILDS.club.needSeasons).toBe(5);
  });
});
