import { describe, it, expect } from 'vitest';
import {
  createZapoiState, TREE, ARTS, upgradeCost, artCount,
  dmgPerSip, heal1val, heal1cost, heal2val, heal2cost,
  buyUpgrade, buyArt, jagerClick, healSmall, healBig,
  tickZapoi, applyHangover, checkSyns,
  CHARACTERS, isUnlocked, isAllBought, BOTTLE_COST, buyBottle, newRun, bet,
  artCost, charDiscount, effMult,
} from '../src/game/zapoiLogic.js';
import { SYNS, hangoverRate } from '../src/game/synergies.js';

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

describe('качества артефактов 1-4', () => {
  it('10 артефактов, у каждого качество', () => {
    expect(ARTS).toHaveLength(10);
    for (const a of ARTS) expect([1, 2, 3, 4]).toContain(a.q);
  });
  it('цена растёт с качеством', () => {
    const maxQ1 = Math.max(...ARTS.filter((a) => a.q === 1).map((a) => a.cost));
    const minQ4 = Math.min(...ARTS.filter((a) => a.q === 4).map((a) => a.cost));
    expect(minQ4).toBeGreaterThan(maxQ1);
  });
  it('дешёвая крышка: +1 к клику за 300', () => {
    const z = createZapoiState();
    z.m = 1000;
    expect(buyArt(z, 'cap')).toBeTruthy();
    expect(z.click).toBe(2);
    expect(z.m).toBe(700);
  });
  it('легендарная корона: mult×3', () => {
    const z = createZapoiState();
    z.m = 1e9;
    buyArt(z, 'crown');
    expect(z.mult).toBe(3);
  });
});

describe('новые синергии incl. дешёвые', () => {
  function rich() {
    const z = createZapoiState();
    z.m = 1e9;
    return z;
  }
  it('11 синергий всего', () => {
    expect(SYNS).toHaveLength(11);
  });
  it('крышка+пластырь → Аптечка Двора', () => {
    const z = rich();
    buyArt(z, 'cap');
    const syns = buyArt(z, 'plaster');
    expect(syns).toContain('firstaid');
    expect(z.maxhp).toBe(100 + 20 + 30);
  });
  it('крышка+чек → Эконом 42 (mult×1.15)', () => {
    const z = rich();
    buyArt(z, 'cap');
    buyArt(z, 'check');
    expect(z.syn.economy).toBe(1);
    expect(z.mult).toBeCloseTo(1.15, 5);
  });
  it('чек+фляга → Сдача (+500 бухла)', () => {
    const z = rich();
    buyArt(z, 'check');
    const before = z.m;
    buyArt(z, 'flask');
    expect(z.syn.change).toBe(1);
    expect(z.m).toBe(before - 2500 + 500);
  });
  it('корона+сердце → Коронация', () => {
    const z = rich();
    buyArt(z, 'crown');
    buyArt(z, 'heart42');
    expect(z.syn.royal).toBe(1);
    expect(z.mult).toBeCloseTo(3 * 1.5, 5);
  });
  it('корона+рюмка+сердце → Легенда 42', () => {
    const z = rich();
    buyArt(z, 'crown');
    buyArt(z, 'goldshot');
    const syns = buyArt(z, 'heart42');
    expect(syns).toContain('legend');
  });
});

describe('персонажи и бутылка', () => {
  it('4 персонажа, стартовый только Владимир', () => {
    expect(CHARACTERS).toHaveLength(4);
    const z = createZapoiState();
    expect(isUnlocked(z, 'vladimir')).toBe(true);
    expect(isUnlocked(z, 'ghost')).toBe(false);
    z.completed = { vladimir: 1 };
    expect(isUnlocked(z, 'ghost')).toBe(true);
    expect(isUnlocked(z, 'demon')).toBe(true);
  });
  it('Владимир: скидка растёт, кап 20%', () => {
    const z = createZapoiState();
    z.char = 'vladimir';
    expect(charDiscount(z)).toBe(0);
    z.sips = 50;
    expect(charDiscount(z)).toBeCloseTo(0.1, 5);
    z.sips = 5000;
    expect(charDiscount(z)).toBe(0.2);
  });
  it('Владимир: глоток качает клик', () => {
    const z = createZapoiState();
    z.char = 'vladimir';
    jagerClick(z);
    expect(z.sips).toBe(1);
    expect(z.click).toBeCloseTo(1.02, 5);
  });
  it('призрак: глоток ×3, душа тает, смерть = shattered без похмелья', () => {
    const z = createZapoiState();
    z.char = 'ghost';
    z.m = 0;
    jagerClick(z);
    expect(z.m).toBeCloseTo(1 * 1.25 * 3, 5);
    expect(z.soul).toBe(96);
    expect(z.hp).toBe(100);
    z.soul = 1;
    expect(jagerClick(z)).toBe('shattered');
  });
  it('демон: на пол-ХП мульт ×2, форма на нуле', () => {
    const z = createZapoiState();
    z.char = 'demon';
    z.hp = 50;
    expect(effMult(z)).toBeCloseTo(2, 5);
    z.hp = 0;
    expect(jagerClick(z)).toBe('demonform');
    expect(z.demonForm).toBe(10);
  });
  it('винлайн: глоток в пределах ×0.5…×2.5', () => {
    const z = createZapoiState();
    z.char = 'winline';
    z.maxhp = 1e9; z.hp = 1e9;
    for (let i = 0; i < 20; i++) {
      const before = z.m;
      jagerClick(z);
      const g = z.m - before;
      expect(g).toBeGreaterThanOrEqual(0.5 - 1e-9);
      expect(g).toBeLessThanOrEqual(2.5 + 1e-9);
    }
  });
  it('бутылка: 50000, только когда всё куплено', () => {
    const z = createZapoiState();
    z.char = 'vladimir';
    z.m = 1e9;
    expect(isAllBought(z)).toBe(false);
    expect(buyBottle(z)).toBe(false);
    TREE.forEach((b) => { z.up[b.id] = b.max; });
    ARTS.forEach((a) => { z.arts[a.id] = 1; });
    checkSyns(z);
    expect(isAllBought(z)).toBe(true);
    const before = z.m;
    expect(buyBottle(z)).toBe(true);
    expect(z.m).toBe(before - BOTTLE_COST);
  });
  it('newRun: чистый лист, completed живёт', () => {
    const n = newRun({ vladimir: 1 }, 'ghost');
    expect(n.char).toBe('ghost');
    expect(n.completed).toEqual({ vladimir: 1 });
    expect(n.m).toBe(0);
    expect(n.soul).toBe(100);
  });
});
