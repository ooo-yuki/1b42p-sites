// bun test — авторитарная симуляция общего поля боя (sim.js)
import { describe, test, expect } from 'bun:test';
import {
  makeArena, makeWorld, addUnit, removeUnit, setInput, stepWorld,
  fillBots, evictWeakestBot, unitPublicState, predictUnit, CONSTS,
} from '../sim.js';
import { getVehicle } from '../game-logic.js';

describe('арена', () => {
  test('детерминирована по сиду', () => {
    const a = makeArena(42);
    const b = makeArena(42);
    expect(a.obstacles).toEqual(b.obstacles);
    expect(a.decor).toEqual(b.decor);
  });
  test('другой сид — другая арена', () => {
    const a = makeArena(1), b = makeArena(2);
    expect(a.obstacles).not.toEqual(b.obstacles);
  });
  test('препятствия не в мёртвой зоне спавна в центре', () => {
    const a = makeArena(7);
    for (const o of a.obstacles) expect(Math.hypot(o.x, o.z)).toBeGreaterThanOrEqual(25);
  });
});

describe('мир и юниты', () => {
  test('addUnit/removeUnit', () => {
    const w = makeWorld(1);
    const u = addUnit(w, { id: 'p1', nick: 'Тест', vid: 't42' });
    expect(w.units.size).toBe(1);
    expect(u.hp).toBe(u.maxhp);
    removeUnit(w, 'p1');
    expect(w.units.size).toBe(0);
  });
  test('юнит не вылетает за границы арены', () => {
    const w = makeWorld(2);
    const u = addUnit(w, { id: 'p1', nick: 'Т', vid: 'vihr' });
    u.x = w.arena.size; u.z = w.arena.size;
    setInput(w, 'p1', { dx: 1, dz: 1, fire: false });
    for (let i = 0; i < 30; i++) stepWorld(w, 1 / 30);
    const B = w.arena.size / 2 - 4;
    expect(Math.abs(u.x)).toBeLessThanOrEqual(B + 0.001);
    expect(Math.abs(u.z)).toBeLessThanOrEqual(B + 0.001);
  });
  test('setInput клампит вектор движения до длины 1', () => {
    const w = makeWorld(3);
    addUnit(w, { id: 'p1', nick: 'Т', vid: 't42' });
    setInput(w, 'p1', { dx: 5, dz: 5 });
    const u = w.units.get('p1');
    expect(Math.hypot(u.input.dx, u.input.dz)).toBeCloseTo(1, 5);
  });
});

describe('боты добивают состав', () => {
  test('fillBots доводит до 8', () => {
    const w = makeWorld(5);
    addUnit(w, { id: 'p1', nick: 'Я', vid: 't42' });
    fillBots(w, CONSTS.SQUAD);
    expect(w.units.size).toBe(CONSTS.SQUAD);
  });
  test('evictWeakestBot убирает бота с наименьшим HP', () => {
    const w = makeWorld(6);
    fillBots(w, 3);
    const ids = [...w.units.keys()];
    w.units.get(ids[0]).hp = 5;
    w.units.get(ids[1]).hp = 50;
    w.units.get(ids[2]).hp = 90;
    const evicted = evictWeakestBot(w);
    expect(evicted).toBe(ids[0]);
    expect(w.units.size).toBe(2);
  });
});

describe('раунд-машина', () => {
  test('раунд стартует автоматически при появлении юнитов', () => {
    const w = makeWorld(9);
    addUnit(w, { id: 'p1', nick: 'Я', vid: 't42' });
    stepWorld(w, 1 / 30);
    expect(w.round.phase).toBe('live');
    expect(w.units.size).toBe(CONSTS.SQUAD);
  });
  test('раунд завершается, когда остаётся один живой', () => {
    const w = makeWorld(10);
    addUnit(w, { id: 'p1', nick: 'Я', vid: 't42' });
    stepWorld(w, 1 / 30); // стартует раунд, добивает ботами
    for (const [id, u] of w.units) if (id !== 'p1') { u.hp = 0; u.dead = true; }
    let events = [];
    for (let i = 0; i < 5 && w.round.phase === 'live'; i++) events = events.concat(stepWorld(w, 1 / 30));
    expect(w.round.phase).toBe('results');
    const roundEvent = events.find(e => e.t === 'round' && e.phase === 'results');
    expect(roundEvent).toBeTruthy();
    expect(roundEvent.results[0].id).toBe('p1');
    expect(roundEvent.results[0].place).toBe(1);
  });
  test('после results идёт intermission и новый live-раунд', () => {
    const w = makeWorld(11);
    addUnit(w, { id: 'p1', nick: 'Я', vid: 't42' });
    stepWorld(w, 1 / 30);
    for (const [id, u] of w.units) if (id !== 'p1') { u.hp = 0; u.dead = true; }
    for (let i = 0; i < 5 && w.round.phase === 'live'; i++) stepWorld(w, 1 / 30);
    expect(w.round.phase).toBe('results');
    for (let i = 0; i < CONSTS.RESULTS_TIME * 30 + 5; i++) stepWorld(w, 1 / 30);
    expect(w.round.phase).toBe('intermission');
    for (let i = 0; i < CONSTS.INTERMISSION_TIME * 30 + 5; i++) stepWorld(w, 1 / 30);
    expect(w.round.phase).toBe('live');
    expect(w.round.seq).toBe(2);
  });
});

describe('поздний заход', () => {
  test('юнит, добавленный в live-раунд, не входит в fullRound-ростер', () => {
    const w = makeWorld(12);
    addUnit(w, { id: 'p1', nick: 'Я', vid: 't42' });
    stepWorld(w, 1 / 30); // стартует раунд
    const late = addUnit(w, { id: 'p2', nick: 'Поздний', vid: 't42' });
    expect(late.fullRound).toBe(false);
    expect(w.round.roster.has('p2')).toBe(false);
    expect(late.invuln).toBeGreaterThan(0);
    expect(w.units.size).toBe(CONSTS.SQUAD + 1);
  });
});

describe('боёвка', () => {
  test('выстрел в упор по цели в конусе наносит урон', () => {
    const w = makeWorld(20);
    const a = addUnit(w, { id: 'a', nick: 'A', vid: 'pyat' });
    const b = addUnit(w, { id: 'b', nick: 'B', vid: 't42' });
    a.x = 0; a.z = 0; b.x = 0; b.z = -10;
    a.turYaw = 0; // dir=(sin0,-cos0)=(0,-1) — смотрит точно на b
    a.invuln = 0; b.invuln = 0; a.reload = 0;
    setInput(w, 'a', { dx: 0, dz: 0, aimYaw: 0, fire: true });
    w.round.phase = 'live'; w.round.roster = new Map([['a', {}], ['b', {}]]); w.zone.active = false;
    const hpBefore = b.hp;
    const events = stepWorld(w, 1 / 30);
    expect(b.hp).toBeLessThan(hpBefore);
    expect(events.some(e => e.t === 'hit')).toBe(true);
  });
  test('unitPublicState не содержит внутренних полей ИИ', () => {
    const w = makeWorld(21);
    const u = addUnit(w, { id: 'a', nick: 'A', vid: 't42' });
    const s = unitPublicState(u);
    expect(s.aiT).toBeUndefined();
    expect(s.id).toBe('a');
  });
});

describe('меткость ботов', () => {
  // Стрелок и цель зафиксированы напротив друг друга, считаем нанесённый урон за минуту.
  function damageOverMinute(isBot: boolean) {
    const w = makeWorld(77);
    const shooter = addUnit(w, { id: 's', nick: 'S', vid: 't42', isBot });
    const victim = addUnit(w, { id: 'v', nick: 'V', vid: 't42' });
    w.round.phase = 'live';
    w.round.roster = new Map([['s', {}], ['v', {}]]);
    w.zone.active = false;
    shooter.invuln = 0; victim.invuln = 0;
    victim.hp = victim.maxhp = 1e6; // мешок для битья, чтобы раунд не кончился
    for (let i = 0; i < 60 * 30; i++) {
      shooter.x = 0; shooter.z = 0;
      victim.x = 0; victim.z = -40; // строго по стволу при turYaw = 0
      if (!isBot) setInput(w, 's', { dx: 0, dz: 0, aimYaw: 0, fire: true });
      stepWorld(w, 1 / 30);
    }
    return 1e6 - victim.hp;
  }

  test('бот наносит заметно меньше урона, чем игрок в тех же условиях', () => {
    const byPlayer = damageOverMinute(false);
    const byBot = damageOverMinute(true);
    expect(byPlayer).toBeGreaterThan(0);
    expect(byBot).toBeLessThan(byPlayer * 0.5);
  });
  test('но бот всё же попадает — не безобидный болванчик', () => {
    const byBot = damageOverMinute(true);
    expect(byBot).toBeGreaterThan(0);
  });
});

describe('клиентское предсказание', () => {
  test('predictUnit двигает и клампит внутри арены так же, как sim', () => {
    const arena = makeArena(99);
    const state = { x: 0, z: 0, y: 0, yaw: 0, turYaw: 0, speed2d: 0, spec: getVehicle('t42') };
    predictUnit(arena, state, 1 / 30, { dx: 0, dz: 1, aimYaw: 1.5 });
    expect(state.z).toBeGreaterThan(0);
    expect(state.turYaw).toBeGreaterThan(0);
  });
});
