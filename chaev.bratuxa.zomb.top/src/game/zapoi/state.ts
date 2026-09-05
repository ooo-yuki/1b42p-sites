// Состояние забега: создание, тик, глоток, похмелье, новый забег.
import type { CharId, ZapoiEvent, ZapoiState } from './types';
import {
  AUTO_SELF_DMG, BIBLE_SOUL_REGEN, DEMON_SIP_MULT,
  GHOST_SIP_MULT, GHOST_SOUL_REGEN, GHOST_SOUL_SIP,
  HANGOVER_HP_RATE, HANGOVER_RATE, HANGOVER_RATE_GOD,
  JACKPOT_MAX, JACKPOT_MULT, LUCK_JACKPOT_STEP,
  VLADIMIR_CLICK_STEP, VLADIMIR_PASSIVE,
  WINLINE_BIG_P, WINLINE_JACKPOT_P,
  dmgPerSip, effMult, owned, refreshForm,
} from './formulas';
import { hangoverRate } from '../synergies';
import { lvlMult } from './levels';

export const ZDEF: ZapoiState = {
  m: 0, hp: 100, maxhp: 100, click: 1, auto: 0,
  mult: 1, regen: 0, toxic: 1, heals: 0, up: {}, arts: {}, syn: {},
  char: null, sips: 0, soul: 100, demonForm: 0, completed: {}, deals: 0, luck: 0,
  lvl: 0, earned: 0, lvlSec: 0, offer: null, offerDone: {},
};

export function createZapoiState(): ZapoiState {
  return JSON.parse(JSON.stringify(ZDEF)) as ZapoiState;
}

export function cloneZapoi(prev: ZapoiState): ZapoiState {
  return {
    ...prev,
    up: { ...prev.up },
    arts: { ...prev.arts },
    syn: { ...prev.syn },
    completed: { ...(prev.completed || {}) },
    offerDone: { ...(prev.offerDone || {}) },
  };
}

// Похмелье: −20% бухла (10% с богом), здоровье 30%. Возвращает потерянное бухло,
// дубль кладёт в z._hangoverLost чтобы UI не пересчитывал его второй формулой (±1 в логе).
export function applyHangover(z: ZapoiState): { lost: number; rate: number } {
  const rate = hangoverRate(z);
  const lost = Math.floor(z.m * rate);
  z.m -= lost;
  z.hp = Math.round(z.maxhp * HANGOVER_HP_RATE);
  z._hangoverLost = lost;
  return { lost, rate };
}

export { HANGOVER_RATE, HANGOVER_RATE_GOD };

// Глоток ягера. Возвращает событие: null | 'hangover' | 'shattered' | 'demonform'.
export function jagerClick(z: ZapoiState): ZapoiEvent {
  if (z.char === 'ghost') {
    if (z.soul <= 0) return 'shattered';
    const gg = z.click * effMult(z) * GHOST_SIP_MULT * lvlMult(z);
    z.m += gg;
    z.earned = (z.earned || 0) + gg;
    z.soul -= GHOST_SOUL_SIP;
    if (z.soul <= 0) { z.soul = 0; return 'shattered'; }
    return null;
  }
  if (z.hp <= 0) {
    if (z.char === 'demon') { z.demonForm = refreshForm(z); return 'demonform'; }
    applyHangover(z);
    return 'hangover';
  }
  let gain = z.click * effMult(z);
  if (z.char === 'vladimir') {
    z.sips = (z.sips || 0) + 1;
    z.click += VLADIMIR_CLICK_STEP;
  }
  // Винлайн-казино: 5% джекпот ×5, 25% крупный ×1.5…×2.5,
  // остальное мелочь ×0.6…×1.2. Удача растит шанс джекпота.
  if (z.char === 'winline') {
    const luck = z.luck || 0;
    const jp = Math.min(JACKPOT_MAX, WINLINE_JACKPOT_P + luck * LUCK_JACKPOT_STEP);
    const roll = Math.random();
    if (roll < jp) gain *= JACKPOT_MULT;
    else if (roll < jp + WINLINE_BIG_P) gain *= 1.5 + Math.random();
    else gain *= 0.6 + Math.random() * 0.6;
  }
  if (z.char === 'demon') gain *= DEMON_SIP_MULT;
  gain *= lvlMult(z);
  z.m += gain;
  z.earned = (z.earned || 0) + gain;
  let dmg = dmgPerSip(z);
  if (z.char === 'demon') dmg *= DEMON_SIP_MULT;
  z.hp -= dmg;
  if (z.hp <= 0) {
    z.hp = 0;
    if (z.char === 'demon') { z.demonForm = refreshForm(z); return 'demonform'; }
    applyHangover(z);
    return 'hangover';
  }
  return null;
}

// Тик 1 сек. Возвращает null | 'hangover' | 'shattered' | 'demonform' | 'demonend'.
export function tickZapoi(z: ZapoiState): ZapoiEvent {
  z.lvlSec = (z.lvlSec || 0) + 1;
  const lm = lvlMult(z);
  if (z.auto > 0) {
    const ag = z.auto * effMult(z) * lm;
    z.m += ag;
    z.earned = (z.earned || 0) + ag;
    if (z.char !== 'ghost') z.hp -= z.auto * AUTO_SELF_DMG * z.toxic;
  }
  if (z.char === 'vladimir') {
    const pg = VLADIMIR_PASSIVE * z.mult * lm;
    z.m += pg;
    z.earned = (z.earned || 0) + pg;
  }
  if (z.regen > 0) z.hp += z.regen;
  if (z.char === 'ghost') {
    if (z.soul <= 0) return 'shattered';
    // Библия батальона: душа регенит вдвое быстрее.
    const regen = GHOST_SOUL_REGEN + (owned(z, 'bible') ? BIBLE_SOUL_REGEN : 0);
    z.soul = Math.min(100, (z.soul ?? 100) + regen);
  }
  if (z.char === 'demon' && z.demonForm > 0) {
    z.demonForm -= 1;
    if (z.demonForm <= 0) { z.demonForm = 0; return 'shattered'; }
  }
  z.hp = Math.max(0, Math.min(z.maxhp, z.hp));
  if (z.hp <= 0) {
    if (z.char === 'demon' && z.demonForm <= 0) { z.demonForm = refreshForm(z); return 'demonform'; }
    if (z.char === 'ghost') return 'shattered';
    applyHangover(z);
    return 'hangover';
  }
  return null;
}

// Новый забег: чистый лист, completed и выбор персонажа сохраняются.
export function newRun(completed: Record<string, number> | undefined, char: CharId | null): ZapoiState {
  const z = JSON.parse(JSON.stringify(ZDEF)) as ZapoiState;
  z.completed = { ...(completed || {}) };
  z.char = char;
  z.hp = z.maxhp;
  z.soul = 100;
  return z;
}
