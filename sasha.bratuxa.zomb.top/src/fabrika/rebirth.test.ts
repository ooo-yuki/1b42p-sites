import { describe, expect, test } from 'bun:test';
import { fameMult, unlocked } from './formulas';
import { migrateSave } from './formulas';
import { BUILDS, LOOKS, RAID_NAMES, TEAM, VENUES } from './content';
import { ShowEngine, type Layer, type ShowEvents, type ShowSummary } from './show';
import { defaultSave } from './formulas';

const fakeLayer = (): Layer => ({
  spawnNote: () => ({ setX() {}, pop() {}, remove() {} }),
  spawnHater: () => ({ remove() {} }),
});
const fakeEvents = (onEnd?: (s: ShowSummary) => void): ShowEvents => ({
  say() {}, blip() {}, raid() {}, ended(s) { onEnd?.(s); },
});

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
  test('пиарщик смягчает сброс комбо', () => {
    const s = { ...defaultSave(), team: { ...defaultSave().team, piar: 1 } };
    const e = new ShowEngine(VENUES[0], s, fakeLayer(), fakeEvents(), () => 0.5);
    e.combo = 8;
    e.zavoz();
    expect(e.combo).toBe(4);
    const s0 = defaultSave();
    const e0 = new ShowEngine(VENUES[0], s0, fakeLayer(), fakeEvents(), () => 0.5);
    e0.combo = 8;
    e0.zavoz();
    expect(e0.combo).toBe(0);
  });
  test('цепи капают фантики за PERFECT', () => {
    const s = { ...defaultSave(), look: { ...defaultSave().look, chains: 1 } };
    let sum: ShowSummary | null = null;
    const e = new ShowEngine(VENUES[0], s, fakeLayer(), fakeEvents((x) => { sum = x; }), () => 0.5);
    const zc = (e as unknown as { zc: number }).zc;
    e.notes.push({ x: zc, hit: false, raid: false, view: { setX() {}, pop() {}, remove() {} } });
    e.zavoz();
    expect(e.tickets).toBe(1);
    (e as unknown as { t: number }).t = 0.01;
    e.step(0.1);
    expect(sum).not.toBeNull();
    expect(sum!.tickets).toBe(1);
  });
});
