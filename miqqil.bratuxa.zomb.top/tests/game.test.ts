// bun test — логика выбора техники, урона и рейтинга
import { describe, test, expect } from 'bun:test';
import { VEHICLES, vehicleList, getVehicle, calcDamage, applyHit, zoneDps, zoneRadius, placementScore, updateRating, pickBots, botVehicleIds, BOT_AIM, botAimError, botReactionTime } from '../game-logic.js';

describe('техника', () => {
  test('минимум 3 танка + корабль + самолёт', () => {
    const list = vehicleList();
    const tanks = list.filter(v => v.type === 'tank');
    expect(tanks.length).toBeGreaterThanOrEqual(3);
    expect(list.some(v => v.type === 'ship')).toBe(true);
    expect(list.some(v => v.type === 'plane')).toBe(true);
  });
  test('у каждой ТТХ положительные', () => {
    for (const v of vehicleList()) {
      expect(v.hp).toBeGreaterThan(0);
      expect(v.speed).toBeGreaterThan(0);
      expect(v.damage).toBeGreaterThan(0);
      expect(v.reload).toBeGreaterThan(0);
      expect(v.range).toBeGreaterThan(0);
    }
  });
  test('getVehicle кидает на неизвестном id', () => {
    expect(() => getVehicle('nope')).toThrow();
    expect(getVehicle('t42').name).toContain('Братуха');
  });
  test('тяж тяжелее лёгкого, лёгкий быстрее тяжа', () => {
    expect(VEHICLES.pyat.hp).toBeGreaterThan(VEHICLES.vihr.hp);
    expect(VEHICLES.vihr.speed).toBeGreaterThan(VEHICLES.pyat.speed);
  });
});

describe('урон', () => {
  test('в упор — полный', () => {
    expect(calcDamage(25, 0, 120)).toBe(25);
  });
  test('падает с дистанцией, на пределе ~40%', () => {
    const d = calcDamage(100, 100, 100);
    expect(d).toBe(40);
    expect(calcDamage(100, 50, 100)).toBe(70);
  });
  test('дальше дальности — 0', () => {
    expect(calcDamage(100, 121, 120)).toBe(0);
  });
  test('applyHit убивает в ноль', () => {
    expect(applyHit(100, 30)).toEqual({ hp: 70, dead: false });
    expect(applyHit(20, 25)).toEqual({ hp: 0, dead: true });
  });
});

describe('зона', () => {
  test('dps растёт по фазам', () => {
    expect(zoneDps(1)).toBeGreaterThan(zoneDps(0));
  });
  test('радиус сужается и не ниже минимума', () => {
    expect(zoneRadius(150, 1)).toBeLessThan(150);
    expect(zoneRadius(150, 99)).toBe(12);
  });
});

describe('рейтинг', () => {
  test('победа растит рейтинг', () => {
    const r = updateRating(1000, 1000, 1, 8, 3);
    expect(r.delta).toBeGreaterThan(0);
    expect(r.newRating).toBe(1000 + r.delta);
  });
  test('последнее место роняет', () => {
    const r = updateRating(1000, 1000, 8, 8, 0);
    expect(r.delta).toBeLessThan(0);
  });
  test('киллы добавляют даже при поражении', () => {
    const a = updateRating(1000, 1000, 8, 8, 0);
    const b = updateRating(1000, 1000, 8, 8, 5);
    expect(b.delta).toBeGreaterThan(a.delta);
  });
  test('рейтинг не падает ниже 100', () => {
    expect(updateRating(100, 100, 8, 8, 0).newRating).toBe(100);
  });
  test('placementScore моно Stern', () => {
    expect(placementScore(1, 8)).toBe(1);
    expect(placementScore(2, 8)).toBeGreaterThanOrEqual(placementScore(6, 8));
  });
});

describe('меткость ботов', () => {
  test('ошибка наведения растёт с дистанцией', () => {
    const near = botAimError(() => 1, 0, 100);   // rng=1 → максимальный плюсовой увод
    const far = botAimError(() => 1, 100, 100);
    expect(near).toBeCloseTo(BOT_AIM.errNear, 6);
    expect(far).toBeCloseTo(BOT_AIM.errFar, 6);
    expect(far).toBeGreaterThan(near);
  });
  test('ошибка знаковая и в заявленных границах', () => {
    expect(botAimError(() => 0, 100, 100)).toBeCloseTo(-BOT_AIM.errFar, 6);
    expect(botAimError(() => 0.5, 50, 100)).toBeCloseTo(0, 6);
    for (let i = 0; i < 200; i++) {
      const e = botAimError(Math.random, Math.random() * 120, 120);
      expect(Math.abs(e)).toBeLessThanOrEqual(BOT_AIM.errFar + 1e-9);
    }
  });
  test('ошибка заметно больше конуса попадания (0.14 рад) на дистанции', () => {
    expect(BOT_AIM.errFar).toBeGreaterThan(0.14);
  });
  test('задержка реакции в границах', () => {
    expect(botReactionTime(() => 0)).toBeCloseTo(BOT_AIM.reactMin, 6);
    expect(botReactionTime(() => 1)).toBeCloseTo(BOT_AIM.reactMax, 6);
  });
});

describe('боты', () => {
  test('ники уникальны', () => {
    const bots = pickBots(7);
    expect(bots.length).toBe(7);
    expect(new Set(bots).size).toBe(7);
  });
  test('ботовская техника валидна', () => {
    for (const id of botVehicleIds(7)) expect(() => getVehicle(id)).not.toThrow();
  });
});
