import { describe, it, expect } from 'vitest';
import {
  createZapoiState, LEVELS, LAST_LVL, HIDDEN_ARTS,
  lvlMult, canAdvance, advanceLevel, takeOffer, skipOffer, rollOffer,
  jagerClick, tickZapoi, buyBottle, BOTTLE_COST,
} from '../src/game/zapoi/index';

function fresh() {
  const z = createZapoiState();
  z.char = 'vladimir';
  return z;
}

describe('уровни запоя: 5 стадий', () => {
  it('Похмелье → Разгон → Кутеж → Угар → Делирий', () => {
    expect(LEVELS.map((l) => l.name)).toEqual(['Похмелье', 'Разгон', 'Кутеж', 'Угар', 'Делирий']);
    expect(LAST_LVL).toBe(4);
  });

  it('старт с Похмелья, дальше закрыто', () => {
    const z = fresh();
    expect(z.lvl).toBe(0);
    expect(canAdvance(z)).toBe(false);
  });

  it('порог 5000 открывает Разгон, переход бесплатный и ручной', () => {
    const z = fresh();
    z.earned = 4999;
    expect(canAdvance(z)).toBe(false);
    const mBefore = z.m;
    z.earned = 5000;
    expect(canAdvance(z)).toBe(true);
    advanceLevel(z);
    expect(z.lvl).toBe(1);
    expect(z.lvlSec).toBe(0);
    expect(z.m).toBe(mBefore); // бесплатно
  });

  it('без прогресса перехода нет', () => {
    const z = fresh();
    advanceLevel(z);
    expect(z.lvl).toBe(0);
  });

  it('на последнем уровне дальше некуда', () => {
    const z = fresh();
    z.lvl = LAST_LVL;
    z.earned = 1e9;
    expect(canAdvance(z)).toBe(false);
    advanceLevel(z);
    expect(z.lvl).toBe(LAST_LVL);
  });
});

describe('угасание дохода: выхлоп → 0', () => {
  it('свежий уровень даёт 100%', () => {
    const z = fresh();
    expect(lvlMult(z)).toBe(1);
  });

  it('на Похмелье (5%/мин) через 20 минут — 0', () => {
    const z = fresh();
    z.lvlSec = 20 * 60;
    expect(lvlMult(z)).toBe(0);
  });

  it('на Делирии (25%/мин) через 4 минуты — 0', () => {
    const z = fresh();
    z.lvl = LAST_LVL;
    z.lvlSec = 4 * 60;
    expect(lvlMult(z)).toBe(0);
  });

  it('глоток в угасшем уровне даёт 0, но жмётся', () => {
    const z = fresh();
    z.click = 10;
    z.lvlSec = 20 * 60;
    const mBefore = z.m;
    const ev = jagerClick(z);
    expect(ev).toBe(null); // без похмелья и ошибок
    expect(z.m - mBefore).toBe(0); // кнопка жмётся, выхлопа нет
  });

  it('тик в угасшем уровне: пассив 0', () => {
    const z = fresh();
    z.auto = 5;
    z.lvlSec = 20 * 60;
    const mBefore = z.m;
    tickZapoi(z);
    expect(z.m - mBefore).toBe(0);
  });

  it('заработок копится в earned', () => {
    const z = fresh();
    z.click = 10;
    jagerClick(z);
    expect(z.earned).toBeGreaterThan(0);
  });
});

describe('скрытый пул «с рук»', () => {
  it('10 артов, по 2 на уровень, в магазине их нет', () => {
    expect(HIDDEN_ARTS).toHaveLength(10);
    for (let l = 0; l <= LAST_LVL; l++) {
      expect(HIDDEN_ARTS.filter((a) => a.minLvl === l).length).toBe(2);
    }
  });

  it('переход предлагает 1 арт своего уровня', () => {
    const z = fresh();
    z.earned = 5000;
    const got = advanceLevel(z);
    expect(got).not.toBe(null);
    expect(z.offer).toBe(got);
  });

  it('взять — применяет эффект раз за забег', () => {
    const z = fresh();
    z.earned = 5000;
    advanceLevel(z);
    const id = z.offer!;
    const before = [z.click, z.auto, z.mult, z.regen, z.toxic, z.maxhp].join('|');
    const taken = takeOffer(z);
    expect(taken?.id).toBe(id);
    expect(z.arts[id]).toBe(1);
    expect(z.offer).toBe(null);
    // эффект применён: хоть один стат изменился
    const after = [z.click, z.auto, z.mult, z.regen, z.toxic, z.maxhp].join('|');
    expect(after).not.toBe(before);
    // повторный дубль не катит
    z.offer = id;
    expect(takeOffer(z)).toBe(null);
  });

  it('пропустить — оффер уходит, уровень остаётся', () => {
    const z = fresh();
    z.earned = 5000;
    advanceLevel(z);
    expect(z.offer).not.toBe(null);
    skipOffer(z);
    expect(z.offer).toBe(null);
    expect(z.lvl).toBe(1);
  });

  it('rollOffer не повторяет взятое', () => {
    const z = fresh();
    z.lvl = 0;
    for (const a of HIDDEN_ARTS.filter((a) => a.minLvl === 0)) z.arts[a.id] = 1;
    expect(rollOffer(z)).toBe(null);
  });
});

describe('бутылка только в Делирии', () => {
  it('на ранних уровнях закрыта даже при деньгах', () => {
    const z = fresh();
    z.lvl = 2;
    z.m = BOTTLE_COST;
    expect(buyBottle(z)).toBe(false);
    expect(z.m).toBe(BOTTLE_COST); // не списалось
  });

  it('в Делирии без полной скупки закрыта', () => {
    const z = fresh();
    z.lvl = LAST_LVL;
    z.m = BOTTLE_COST;
    expect(buyBottle(z)).toBe(false);
  });
});
