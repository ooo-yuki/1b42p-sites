import { describe, it, expect } from 'vitest';
import {
  createZapoiState, TREE, ARTS, upgradeCost, artCount,
  dmgPerSip, heal1val, heal1cost, heal2val, heal2cost,
  buyUpgrade, buyArt, jagerClick, healSmall, healBig,
  tickZapoi, applyHangover, checkSyns,
  CHARACTERS, isUnlocked, isAllBought, BOTTLE_COST, buyBottle, newRun, bet,
  artCost, charDiscount, effMult, cleanseDemon,
  pickleSmall, demonPickle, holyPickle, syringe, HEALS,
  shopDiscount, formDuration,
} from '../src/game/zapoi/index';
import { SYNS, hangoverRate } from '../src/game/synergies';

describe('цены апгрейдов: base × growth^уровень', () => {
  it('12 апгрейдов в древе', () => {
    expect(TREE).toHaveLength(12);
  });
  it('глотка: 10×4^ур', () => {
    const b = TREE.find((x) => x.id === 'throat')!;
    expect(upgradeCost(b, 0)).toBe(10);
    expect(upgradeCost(b, 1)).toBe(40);
    expect(upgradeCost(b, 2)).toBe(160);
  });
  it('компания: 100×8^ур', () => {
    const b = TREE.find((x) => x.id === 'party')!;
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
    expect(r!.v).toBe(15);
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
    expect(r!.v).toBe(60);
    expect(r!.c).toBe(150);
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
  it('14 артефактов (10 обычных + 4 именных), у каждого качество', () => {
    expect(ARTS).toHaveLength(14);
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
    expect(z.soul).toBe(95);
    expect(z.hp).toBe(100);
    z.soul = 1;
    expect(jagerClick(z)).toBe('shattered');
  });
  it('призрак: душа регенит +2/сек, спам глотками убивает', () => {
    const z = createZapoiState();
    z.char = 'ghost';
    z.soul = 50;
    tickZapoi(z);
    expect(z.soul).toBe(52);
    z.soul = 99;
    tickZapoi(z);
    expect(z.soul).toBe(100);
    z.soul = 10;
    expect(jagerClick(z)).toBeNull();
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
  it('винлайн: глоток-казино — мелочь ×0.6…×1.2, крупный ×1.5…×2.5, джекпот ×5', () => {
    const z = createZapoiState();
    z.char = 'winline';
    z.maxhp = 1e9; z.hp = 1e9;
    let seenBig = false;
    for (let i = 0; i < 300; i++) {
      const before = z.m;
      jagerClick(z);
      const g = z.m - before;
      expect(g).toBeGreaterThanOrEqual(0.6 - 1e-9);
      expect(g).toBeLessThanOrEqual(5 + 1e-9);
      if (g > 2.5) seenBig = true;
    }
    // джекпот ×5 за 300 глотков почти гарантирован (p≈1−0.95^300)
    expect(seenBig).toBe(true);
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

describe('очищение демона', () => {
  it('снимает форму за цену капельницы, HP 30%', () => {
    const z = createZapoiState();
    z.char = 'demon';
    z.m = 10000;
    z.demonForm = 7;
    const cost = heal2cost(z);
    const r = cleanseDemon(z);
    expect(r && r.cleansed).toBe(true);
    expect(r!.c).toBe(cost);
    expect(z.demonForm).toBe(0);
    expect(z.hp).toBe(Math.round(z.maxhp * 0.3));
    expect(z.m).toBe(10000 - cost);
  });
  it('вне формы работает как капельница', () => {
    const z = createZapoiState();
    z.char = 'demon';
    z.m = 10000;
    z.hp = 10;
    const r = cleanseDemon(z);
    expect(r && !r.cleansed).toBe(true);
    expect(z.hp).toBe(10 + r!.v);
  });
  it('без денег — отказ', () => {
    const z = createZapoiState();
    z.char = 'demon';
    z.demonForm = 5;
    expect(cleanseDemon(z)).toBeNull();
    expect(z.demonForm).toBe(5);
  });
});

describe('хилки-пикули 42', () => {
  it('HEALS: 5 предметов с картинками и хозяевами', () => {
    expect(Object.keys(HEALS)).toHaveLength(5);
    expect(HEALS.pickle.chars).toEqual(['vladimir', 'winline']);
    expect(HEALS.syringe.chars).toEqual(['vladimir', 'winline']);
    expect(HEALS.lever.chars).toEqual(['winline']);
    expect(HEALS.hpickle.chars).toEqual(['ghost']);
    expect(HEALS.dpickle.chars).toEqual(['demon']);
  });
  it('обычные пикули: только Владимир и Винлайн', () => {
    const v = createZapoiState(); v.char = 'vladimir'; v.m = 1000; v.hp = 50;
    const r = pickleSmall(v);
    expect(r).not.toBeNull(); expect(v.hp).toBeGreaterThan(50);
    const g = createZapoiState(); g.char = 'ghost'; g.m = 1000;
    expect(pickleSmall(g)).toBeNull();
    const d = createZapoiState(); d.char = 'demon'; d.m = 1000; d.hp = 50;
    expect(pickleSmall(d)).toBeNull();
  });
  it('демонические пикули: хил + продление формы на 10 сек', () => {
    const z = createZapoiState(); z.char = 'demon'; z.m = 5000; z.hp = 50; z.demonForm = 8;
    const r = demonPickle(z);
    expect(r).not.toBeNull(); expect(r!.extended).toBe(true);
    expect(z.demonForm).toBe(18); expect(z.hp).toBeGreaterThan(50);
  });
  it('демонические пикули вне формы: хил без продления', () => {
    const z = createZapoiState(); z.char = 'demon'; z.m = 5000; z.hp = 50; z.demonForm = 0;
    const r = demonPickle(z);
    expect(r).not.toBeNull(); expect(r!.extended).toBe(false);
  });
  it('святые пикули: лечат душу с капом 100, чужим недоступны', () => {
    const z = createZapoiState(); z.char = 'ghost'; z.m = 5000; z.soul = 60;
    const before = z.soul;
    const r = holyPickle(z);
    expect(r).not.toBeNull(); expect(z.soul).toBeGreaterThan(before);
    expect(z.soul).toBeLessThanOrEqual(100);
    const v = createZapoiState(); v.char = 'vladimir'; v.m = 5000;
    expect(holyPickle(v)).toBeNull();
  });
  it('святые пикули при полной душе не тратят бухло', () => {
    const z = createZapoiState(); z.char = 'ghost'; z.m = 5000; z.soul = 100;
    expect(holyPickle(z)).toBeNull(); expect(z.m).toBe(5000);
  });
  it('скидка призрака: deals × 0.2%, кап 20%', () => {
    const z = createZapoiState(); z.char = 'ghost'; z.deals = 10;
    expect(charDiscount(z)).toBeCloseTo(0.02);
    z.deals = 5000; expect(charDiscount(z)).toBe(0.2);
  });
  it('шприц: полное HP, только Владимир и Винлайн', () => {
    const z = createZapoiState(); z.char = 'vladimir'; z.m = 50000; z.hp = 10; z.maxhp = 100;
    const r = syringe(z);
    expect(r).not.toBeNull(); expect(z.hp).toBe(100); expect(r!.v).toBe(90);
    const g = createZapoiState(); g.char = 'ghost'; g.m = 50000;
    expect(syringe(g)).toBeNull();
    const d = createZapoiState(); d.char = 'demon'; d.m = 50000; d.hp = 10;
    expect(syringe(d)).toBeNull();
  });
});

describe('пойло демона 42', () => {
  it('у демона два вида пойла: обычное и для формы', () => {
    const d = CHARACTERS.find((c) => c.id === 'demon');
    expect(d!.drink).toBe('jager/demon.jpg');
    expect(d!.drinkForm).toBe('jager/demon-form.jpg');
  });
});

describe('именные артефакты закрытых персонажей', () => {
  it('4 именных в качестве 4 с req-замком', () => {
    for (const [id, req] of [['mug', 'vladimir'], ['bible', 'ghost'], ['ban2w', 'demon'], ['leverball', 'winline']] as const) {
      const a = ARTS.find((x) => x.id === id)!;
      expect(a.q).toBe(4); expect(a.req).toBe(req);
    }
    expect(ARTS.length).toBe(14);
  });
  it('без закрытия купить нельзя', () => {
    const z = createZapoiState(); z.m = 1e9;
    expect(buyArt(z, 'mug')).toBe(false);
    expect(buyArt(z, 'bible')).toBe(false);
    expect(buyArt(z, 'ban2w')).toBe(false);
    expect(buyArt(z, 'leverball')).toBe(false);
  });
  it('кружка: −50% на апгрейды, артефакты и хилки', () => {
    const z = createZapoiState(); z.m = 1e9; z.completed = { vladimir: 1 };
    expect(buyArt(z, 'mug')).not.toBe(false);
    expect(shopDiscount(z)).toBeCloseTo(0.5);
    const b = TREE.find((x) => x.id === 'throat')!;
    expect(upgradeCost(b, 0, shopDiscount(z))).toBe(5);
    expect(heal1cost(z)).toBe(Math.floor(20 * 0.5));
  });
  it('кружка не действует на бутылку (50000)', () => {
    expect(BOTTLE_COST).toBe(50000);
  });
  it('библия: реген души +2 и двойной хил пикулей', () => {
    const z = createZapoiState(); z.char = 'ghost'; z.m = 1e9; z.soul = 50;
    z.completed = { vladimir: 1, ghost: 1 };
    expect(buyArt(z, 'bible')).not.toBe(false);
    tickZapoi(z);
    expect(z.soul).toBe(54);
    z.soul = 50;
    const r = holyPickle(z)!;
    expect(r.v).toBe(heal1val({ ...z, arts: {} }) * 2);
  });
  it('бан: форма 15 сек и мульт ×6', () => {
    const z = createZapoiState(); z.char = 'demon'; z.m = 1e9;
    z.completed = { vladimir: 1, demon: 1 };
    expect(buyArt(z, 'ban2w')).not.toBe(false);
    expect(formDuration(z)).toBe(15);
    z.hp = 0; z.maxhp = 100;
    jagerClick(z);
    expect(z.demonForm).toBe(15);
    expect(effMult(z)).toBe(z.mult * 3 * 6);
  });
  it('ручка: ставка доступна любому персонажу', () => {
    const z = createZapoiState(); z.char = 'vladimir'; z.m = 1e9;
    expect(bet(z)).toBeNull();
    z.completed = { vladimir: 1, winline: 1 };
    expect(buyArt(z, 'leverball')).not.toBe(false);
    z.m = 1000;
    expect(bet(z)).not.toBeNull();
  });
});

describe('именные: польза всем персонажам', () => {
  it('библия: любому персонажу +1 HP/сек и −15% урона', () => {
    const z = createZapoiState(); z.char = 'vladimir'; z.m = 1e9;
    z.completed = { vladimir: 1, ghost: 1 };
    expect(buyArt(z, 'bible')).not.toBe(false);
    expect(z.regen).toBeCloseTo(1);
    expect(z.toxic).toBeCloseTo(0.85);
  });
  it('бан: любому персонажу +25% ко всему бухлу', () => {
    const z = createZapoiState(); z.char = 'winline'; z.m = 1e9;
    z.completed = { vladimir: 1, demon: 1 };
    expect(buyArt(z, 'ban2w')).not.toBe(false);
    expect(z.mult).toBeCloseTo(1.25);
  });
});

describe('винлайн 2.0: честное казино + удача', () => {
  it('ставка: 10% (мин 50), выигрыш ×2.1', () => {
    const z = createZapoiState(); z.char = 'winline'; z.m = 1000;
    const stake = 100;
    let sawWin = false;
    for (let i = 0; i < 200 && !sawWin; i++) {
      z.m = 1000;
      const r = bet(z)!;
      expect(r.stake).toBe(stake);
      if (r.win) { sawWin = true; expect(z.m).toBe(1000 - stake + Math.round(stake * 2.1)); }
    }
    expect(sawWin).toBe(true);
  });
  it('удача 42: +2% за уровень, растит шанс ставки', () => {
    const z = createZapoiState(); z.m = 1e9;
    expect(buyUpgrade(z, 'stream')).toBe(true);
    expect(z.luck).toBe(2);
    expect(buyUpgrade(z, 'stream')).toBe(true);
    expect(z.luck).toBe(4);
  });
  it('удача режет пустышки, но не ниже 2%', () => {
    const z = createZapoiState(); z.char = 'winline'; z.m = 1e9; z.luck = 100;
    let blanks = 0;
    for (let i = 0; i < 30; i++) {
      delete z.arts['cap'];
      z.m = 1e9;
      buyArt(z, 'cap');
      if (z._lastArtBlank) blanks++;
    }
    // шанс 2%: за 30 попыток пустышек мало (допуск < 6)
    expect(blanks).toBeLessThan(6);
  });
});
