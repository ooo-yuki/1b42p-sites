/* Движок шоу: таймер, ноты, хейтеры, рейд — слой подменный, ГСЧ снаружи. RED. */
import { describe, expect, test } from 'vitest';
import { defaultSave } from './formulas';
import { ShowEngine, type HaterView, type Layer, type NoteView } from './show';
import { VENUES } from './content';

const stubView = (): NoteView & HaterView & { removed: boolean; popped: boolean; xs: number[] } => ({
  removed: false, popped: false, xs: [],
  setX(x: number) { this.xs.push(x); },
  pop() { this.popped = true; },
  remove() { this.removed = true; },
});

const stubLayer = (): Layer & { notes: ReturnType<typeof stubView>[]; haters: { v: ReturnType<typeof stubView>; cb: () => void }[] } => {
  const L: Layer & { notes: ReturnType<typeof stubView>[]; haters: { v: ReturnType<typeof stubView>; cb: () => void }[] } = {
    notes: [], haters: [],
    spawnNote() { const v = stubView(); L.notes.push(v); return v; },
    spawnHater(cb: () => void) { const v = stubView(); L.haters.push({ v, cb }); return v; },
  };
  return L;
};

const events = () => {
  const e = { said: [] as string[], blips: [] as number[], ended: false, raids: [] as boolean[] };
  return {
    e,
    ev: {
      say: (t: string) => { e.said.push(t); },
      blip: (f: number) => { e.blips.push(f); },
      ended: () => { e.ended = true; },
      raid: (on: boolean) => { e.raids.push(on); },
    },
  };
};

const garage = VENUES[0];

describe('show lifecycle', () => {
  test('старт: 30с, комбо 0, ноты летят за ~секунду', () => {
    const L = stubLayer();
    const { ev } = events();
    const sh = new ShowEngine(garage, defaultSave(), L, ev, () => 0.5);
    expect(sh.t).toBe(30);
    sh.step(0.5);
    sh.step(0.5);
    expect(L.notes.length).toBeGreaterThan(0);
  });
  test('завоз по ноте в зоне: хайп капает, комбо растёт', () => {
    const L = stubLayer();
    const { ev } = events();
    const sh = new ShowEngine(garage, defaultSave(), L, ev, () => 0.5);
    sh.step(1.6);
    const before = sh.hype;
    sh.zavoz();
    expect(sh.hype).toBeGreaterThan(before);
    expect(sh.combo).toBe(1);
  });
  test('завоз в пустоту: мимо, комбо в ноль', () => {
    const L = stubLayer();
    const { ev } = events();
    const sh = new ShowEngine(garage, defaultSave(), L, ev, () => 0.5);
    sh.zavoz();
    expect(sh.combo).toBe(0);
    expect(sh.misses).toBe(1);
  });
  test('таймер вышел: бой кончается', () => {
    const L = stubLayer();
    const { e, ev } = events();
    const sh = new ShowEngine(garage, defaultSave(), L, ev, () => 0.5);
    sh.step(30.1);
    expect(e.ended).toBe(true);
    expect(sh.over).toBe(true);
  });
});

describe('haters', () => {
  test('хейтер приходит, пинок снимает', () => {
    const L = stubLayer();
    const { ev } = events();
    const sh = new ShowEngine(garage, defaultSave(), L, ev, () => 0);
    for (let i = 0; i < 51; i++) sh.step(0.1);
    expect(sh.haters.length).toBeGreaterThan(0);
    const n = sh.haters.length;
    sh.kickHater(0);
    expect(sh.haters.length).toBe(n - 1);
    expect(L.haters[0].v.removed).toBe(true);
  });
  test('протухший хейтер режет хайп и комбо', () => {
    const L = stubLayer();
    const { ev } = events();
    const s = defaultSave();
    const sh = new ShowEngine(garage, s, L, ev, () => 0);
    for (let i = 0; i < 51; i++) sh.step(0.1);
    expect(sh.haters.length).toBeGreaterThan(0);
    sh.hype = 1000;
    sh.combo = 5;
    for (let i = 0; i < 60; i++) sh.step(0.1);
    expect(sh.hype).toBeLessThan(1000);
    expect(sh.combo).toBe(0);
  });
});

describe('raid', () => {
  test('вызов и отбитие ×10', () => {
    const L = stubLayer();
    const { e, ev } = events();
    const sh = new ShowEngine(garage, defaultSave(), L, ev, () => 0.5);
    sh.callRaid();
    expect(sh.raid).not.toBe(null);
    expect(e.raids).toEqual([true]);
    const before = sh.hype;
    // поток рейд-нот: шагаем и бьём, пока 6 не сядут
    for (let i = 0; i < 14 && sh.raid; i++) {
      sh.step(0.5);
      sh.zavoz();
    }
    expect(sh.raid).toBe(null);
    expect(sh.hype).toBeGreaterThan(before);
  });
});
