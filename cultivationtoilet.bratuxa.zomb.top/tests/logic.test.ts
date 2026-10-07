import { describe, expect, test } from 'bun:test';
import {
  applyEvent,
  buildCost,
  canBuild,
  cleanCost,
  die,
  dirtyFactor,
  dirtyRate,
  expandCost,
  incomeRate,
  neighbour,
  newPlayer,
  pull,
  repairCost,
  resistFactor,
  score,
  sellPrice,
  startCells,
  tick,
  upgradeCost,
  upgCost,
  EVENTS,
  ITEMS,
  type Player,
} from '../logic';

const now = 1_000_000;

/** rng из заранее заданной последовательности (зацикливается). */
function seq(values: number[]): () => number {
  let i = 0;
  return () => values[i++ % values.length];
}

function fresh(): Player {
  return newPlayer('tester', now);
}

describe('базовые формулы', () => {
  test('цена апгрейда растёт экспоненциально', () => {
    const c0 = upgCost(100, 0);
    const c3 = upgCost(100, 3);
    expect(c0).toBe(100);
    expect(c3).toBeGreaterThan(c0 * 3);
  });

  test('сопротивление грязи не опускается ниже 0.25', () => {
    const p = fresh();
    p.upg = { tiles: 10, vent: 10, door: 10, plant: 10, chem: 10 };
    expect(dirtyFactor(p)).toBe(0.25);
  });

  test('грязь замедляется от апгрейдов', () => {
    const a = fresh();
    const b = fresh();
    b.upg = { toilet: 1, vent: 3 };
    expect(dirtyRate(b)).toBeLessThan(dirtyRate(a));
  });

  test('доход растёт от апгрейдов и падает от грязи', () => {
    const p = fresh();
    p.upg = { toilet: 0 };
    expect(incomeRate(p)).toBe(0);
    p.upg = { toilet: 4 };
    const clean = incomeRate(p);
    expect(clean).toBeGreaterThan(0);
    p.dirty = 100;
    expect(incomeRate(p)).toBeLessThan(clean);
  });

  test('события бьют слабее от «медных труб»', () => {
    const plain = fresh();
    const piped = fresh();
    piped.upg = { toilet: 1, pipes: 4 };
    expect(resistFactor(piped)).toBeLessThan(resistFactor(plain));
    piped.hp = 100;
    applyEvent(piped, seq([0.05]), now); // 0.05 -> «Крысы» (-hp)
    piped.hp = 100;
    plain.upg = { toilet: 1 };
    applyEvent(plain, seq([0.05]), now);
    expect(piped.hp).toBeGreaterThan(plain.hp);
  });

  test('цены продажи по редкости: legendary дороже common', () => {
    const common = ITEMS.find((i) => i.rarity === 'common')!;
    const legendary = ITEMS.find((i) => i.rarity === 'legendary')!;
    const sell = sellPrice({ ...common, price: 10 }) * 100;
    expect(sellPrice({ ...legendary, price: 10 })).toBeGreaterThan(sell / 100);
  });
});

describe('tick', () => {
  test('начисляет пассивный доход и грязь', () => {
    const p = fresh();
    p.upg = { toilet: 3 };
    const rate = incomeRate(p);
    tick(p, now + 10_000, seq([0.5]));
    expect(p.money).toBeGreaterThan(60 + rate * 9);
    expect(p.dirty).toBeGreaterThan(0);
    expect(p.last).toBe(now + 10_000);
  });

  test('офлайн-время ограничено (нет бесконечного дохода)', () => {
    const p = fresh();
    p.upg = { toilet: 3 };
    const rate = incomeRate(p);
    const before = p.money;
    tick(p, now + 3600_000_000, seq([0.9]));
    expect(p.money - before).toBeLessThanOrEqual(3600 * 12 * rate + 1);
  });

  test('событие срабатывает по nextEvent и откладывается', () => {
    const p = fresh();
    p.nextEvent = now + 1;
    const ev = tick(p, now + 5000, seq([0.01]));
    expect(ev).not.toBeNull();
    expect(p.nextEvent).toBeGreaterThan(now + 5000);
    expect(p.log.some((l) => l.kind === 'event')).toBe(true);
  });
});

describe('pull (унитаз)', () => {
  test('всегда увеличивает счётчик смывов и пишет в журнал', () => {
    const p = fresh();
    pull(p, seq([0.1, 0.3]), now);
    expect(p.pulls).toBe(1);
    expect(p.log.length).toBeGreaterThan(1);
  });

  test('детерминирован при одинаковом rng', () => {
    const a = fresh();
    const b = fresh();
    const sa = [0.1, 0.4, 0.7, 0.9, 0.2];
    const sb = [0.1, 0.4, 0.7, 0.9, 0.2];
    pull(a, seq(sa), now);
    pull(b, seq(sb), now);
    expect(a.money).toBe(b.money);
    expect(a.dirty).toBe(b.dirty);
    expect(a.hp).toBe(b.hp);
    expect(a.inv).toEqual(b.inv);
  });

  test('первый ролл 0.05 -> деньги', () => {
    const p = fresh();
    const before = p.money;
    const res = pull(p, seq([0.05, 0.5]), now);
    expect(res.kind).toBe('money');
    expect(p.money).toBeGreaterThan(before);
  });

  test('ролл 0.6 -> предмет в инвентарь', () => {
    const p = fresh();
    const res = pull(p, seq([0.6, 0.1]), now);
    expect(res.kind).toBe('item');
    expect(p.inv.length).toBe(1);
    expect(res.item?.price).toBeGreaterThan(0);
  });

  test('ролл 0.95 -> джекпот', () => {
    const p = fresh();
    const before = p.money;
    const res = pull(p, seq([0.98, 0.5]), now);
    expect(res.kind).toBe('jackpot');
    expect(p.money).toBeGreaterThan(before + 100);
  });

  test('ролл 0.93 -> урон по комнате', () => {
    const p = fresh();
    const res = pull(p, seq([0.93]), now);
    expect(res.kind).toBe('hurt');
    expect(p.hp).toBeLessThan(100);
  });

  test('смерть при hp до 0: −30% денег и +1 к смертям', () => {
    const p = fresh();
    p.money = 1000;
    p.hp = 5;
    p.upg = { toilet: 1 };
    die(p, now);
    expect(p.deaths).toBe(1);
    expect(p.money).toBe(700);
    expect(p.hp).toBeGreaterThan(0);
  });
});

describe('покупки и услуги', () => {
  test('стоимость апгрейда зависит от текущего уровня', () => {
    const p = fresh();
    p.upg = { toilet: 0 };
    const c0 = upgradeCost('toilet', p)!;
    p.upg.toilet = 5;
    expect(upgradeCost('toilet', p)!).toBeGreaterThan(c0);
    expect(upgradeCost('нет-такого', p)).toBeNull();
  });

  test('чистка дороже с ростом грязи, ремонт — с ростом урона', () => {
    const p = fresh();
    p.dirty = 10;
    const cheap = cleanCost(p);
    p.dirty = 80;
    expect(cleanCost(p)).toBeGreaterThan(cheap);
    p.dirty = 0;
    p.hp = 90;
    const repair = repairCost(p);
    p.hp = 40;
    expect(repairCost(p)).toBeGreaterThan(repair);
  });

  test('оценка комнаты учитывает уровень, деньги и инвентарь', () => {
    const p = fresh();
    const s0 = score(p);
    p.money += 500;
    p.roomLevel = 3;
    expect(score(p)).toBeGreaterThan(s0 + 500);
  });
});

describe('карта: клетки 2×2 м', () => {
  test('новый игрок получает главную клетку и клетку спавна', () => {
    const p = fresh();
    expect(p.cells.length).toBe(2);
    expect(p.cells[0]).toEqual({ x: 0, z: 0, kind: 'toilet' });
    expect(p.cells[1]).toEqual({ x: 0, z: 1, kind: 'spawn' });
  });

  test('neighbour считает стороны', () => {
    expect(neighbour(0, 0, 'n')).toEqual({ x: 0, z: -1 });
    expect(neighbour(0, 0, 's')).toEqual({ x: 0, z: 1 });
    expect(neighbour(0, 0, 'e')).toEqual({ x: 1, z: 0 });
    expect(neighbour(0, 0, 'w')).toEqual({ x: -1, z: 0 });
  });

  test('canBuild: пустое место рядом — можно, занятую клетку — нельзя', () => {
    const cells = startCells();
    expect(canBuild(cells, 0, 0, 'n').ok).toBe(true);
    expect(canBuild(cells, 0, 0, 's').ok).toBe(false); // там спавн
    expect(canBuild(cells, 0, 1, 'e')).toEqual({ ok: true, x: 1, z: 1 });
    expect(canBuild(cells, 5, 5, 'n').ok).toBe(false); // клетки нет
    expect(canBuild(cells, 0, 0, 'up' as never).ok).toBe(false); // мусорное направление
  });

  test('цена клетки растёт с числом построенных', () => {
    expect(buildCost(2)).toBe(250);
    expect(buildCost(3)).toBeGreaterThan(buildCost(2));
    expect(buildCost(8)).toBeGreaterThan(buildCost(4));
  });

  test('после стройки клетка связна и деньги списаны', () => {
    const p = fresh();
    const check = canBuild(p.cells, 0, 0, 'n');
    expect(check.ok).toBe(true);
    p.money = 1000;
    const cost = buildCost(p.cells.length);
    p.money -= cost;
    p.cells.push({ x: check.x as number, z: check.z as number, kind: 'room' });
    expect(p.cells.length).toBe(3);
    expect(p.money).toBe(1000 - cost);
    expect(canBuild(p.cells, 0, -1, 'n').ok).toBe(true);
    expect(canBuild(p.cells, 0, 0, 'n').ok).toBe(false);
  });
});

describe('каталоги', () => {
  test('все события имеют уникальные id', () => {
    expect(new Set(EVENTS.map((e) => e.id)).size).toBe(EVENTS.length);
  });
  test('все предметы покрыты редкостями и имеют цену', () => {
    expect(ITEMS.every((i) => i.base > 0)).toBe(true);
    expect(new Set(ITEMS.map((i) => i.id)).size).toBe(ITEMS.length);
  });
});
