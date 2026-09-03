import { describe, it, expect } from 'vitest';
import {
  createZapoiState, TREE, upgradeCost, artCount,
  dmgPerSip, heal1val, heal1cost, heal2val, heal2cost,
  buyUpgrade, buyArt, jagerClick, healSmall, healBig,
  tickZapoi, applyHangover, checkSyns,
} from '../src/game/zapoiLogic.js';
import { hangoverRate } from '../src/game/synergies.js';

describe('цены апгрейдов: base × growth^уровень', () => {
  it('12 апгрейдов в древе', () => {
    expect(TREE).toHaveLength(12);
  });
  it('глотка: 10×4^ур', () => {
    const b = TREE.find((x) => x.id === 'throat');
    expect(upgradeCost(b, 0)).toBe(10);
    expect(upgradeCost(b, 1)).toBe(40);
    expect(upgradeCost(b, 2)).toBe(160);
  });
  it('компания: 100×8^ур', () => {
    const b = TREE.find((x) => x.id === 'party');
    expect(upgradeCost(b, 0)).toBe(100);
    expect(upgradeCost(b, 1)).toBe(800);
  });
  it('покупка списывает бухло и качает', () => {
    const z = createZapoiState();
    z.m = 1000;
    expect(buyUpgrade(z, 'throat')).toBe(true);
    expect(z.m).toBe(990);
    expect(z.click).toBe(2);
    expect(z.up.throat).toBe(1);
  });
  it('без денег и выше MAX — отказ', () => {
    const z = createZapoiState();
    expect(buyUpgrade(z, 'throat')).toBe(false);
    z.m = 1e12;
    for (let i = 0; i < 8; i++) expect(buyUpgrade(z, 'throat')).toBe(true);
    expect(buyUpgrade(z, 'throat')).toBe(false);
  });
});

describe('запой: глотки, урон, похмелье', () => {
  it('урон глотка (0.6+m/4000)×toxic', () => {
    const z = createZapoiState();
    expect(dmgPerSip(z)).toBeCloseTo(0.6, 5);
    z.m = 4000;
    expect(dmgPerSip(z)).toBeCloseTo(1.6, 5);
  });
  it('глоток даёт бухло и бьёт по HP', () => {
    const z = createZapoiState();
    jagerClick(z);
    expect(z.m).toBe(1);
    expect(z.hp).toBeCloseTo(100 - (0.6 + 1 / 4000), 5);
  });
  it('похмелье: −20% бухла, HP 30%', () => {
    const z = createZapoiState();
    z.m = 1000;
    z.hp = 0.1;
    jagerClick(z);
    expect(z.m).toBeLessThan(1000);
    expect(z.hp).toBe(Math.round(z.maxhp * 0.3));
  });
  it('тик: авто-кап и реген', () => {
    const z = createZapoiState();
    z.auto = 2; z.mult = 1; z.regen = 0.3; z.hp = 50;
    tickZapoi(z);
    expect(z.m).toBe(2);
    expect(z.hp).toBeCloseTo(50 - 2 * 0.05 * 1 + 0.3, 5);
  });
});

describe('лечилки: рассол и капельница', () => {
  it('рассол лечит за бухло, цена растёт с числом лечений', () => {
    const z = createZapoiState();
    z.m = 1000; z.hp = 50;
    const c0 = heal1cost(z);
    const r = healSmall(z);
    expect(r.v).toBe(15);
    expect(heal1cost(z)).toBeGreaterThan(c0);
  });
  it('полное HP — отказ', () => {
    const z = createZapoiState();
    z.m = 1000;
    expect(healSmall(z)).toBeNull();
    expect(healBig(z)).toBeNull();
  });
  it('капельница: 60 HP за 150', () => {
    const z = createZapoiState();
    z.m = 1000; z.hp = 10;
    const r = healBig(z);
    expect(r.v).toBe(60);
    expect(r.c).toBe(150);
    expect(z.hp).toBe(70);
  });
});

describe('артефакты и синергии', () => {
  function rich() {
    const z = createZapoiState();
    z.m = 1e9;
    return z;
  }
  it('рюмка ×2 к мульту', () => {
    const z = rich();
    buyArt(z, 'goldshot');
    expect(z.mult).toBe(2);
    expect(artCount(z)).toBe(1);
  });
  it('рюмка+бочка → Золотой Поток', () => {
    const z = rich();
    buyArt(z, 'goldshot');
    const syns = buyArt(z, 'barrel');
    expect(syns).toContain('flow');
    expect(z.mult).toBeCloseTo(2 * 1.5, 5);
  });
  it('все 4 → РЕЖИМ БОГА: mult×2, +200 maxHP, похмелье 10%', () => {
    const z = rich();
    buyArt(z, 'goldshot');
    buyArt(z, 'amulet');
    buyArt(z, 'titan');
    const syns = buyArt(z, 'barrel');
    expect(syns).toContain('god');
    expect(hangoverRate(z)).toBe(0.1);
    const { rate, lost } = applyHangover({ ...z, m: 1000, hp: 1, maxhp: z.maxhp, syn: z.syn });
    expect(rate).toBe(0.1);
    expect(lost).toBe(100);
  });
  it('без бога похмелье 20%', () => {
    const z = createZapoiState();
    expect(hangoverRate(z)).toBe(0.2);
  });
  it('баланс усиливает лечилки', () => {
    const z = createZapoiState();
    expect(heal1val(z)).toBe(15);
    z.arts = { goldshot: 1, amulet: 1 };
    checkSyns(z);
    expect(z.syn.balance).toBe(1);
    expect(heal1val(z)).toBe(Math.round(15 * 1.3));
  });
});
