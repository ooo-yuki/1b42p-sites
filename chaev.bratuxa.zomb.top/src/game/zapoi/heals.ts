// Хилки-пикули 42. У каждого персонажа свои лечилки с логотипами.
// Цены и формулы — те же что у Рассола (малые) и Капельницы (шприц).
import type { CharId, HealDef, HealResult, BetResult, ZapoiState } from './types';
import {
  BET_MIN_STAKE, BET_STAKE_RATE, BET_WIN_P, BET_RETURN_MULT,
  HANGOVER_HP_RATE, HOLY_DEAL_P,
  heal1cost, heal1val, heal2cost, heal2val,
} from './formulas';

export const HEALS: Record<string, HealDef> = {
  pickle: { name: 'Обычные пикули', img: 'heals/pickle.jpg', chars: ['vladimir', 'winline'] },
  dpickle: { name: 'Демонические пикули', img: 'heals/dpickle.jpg', chars: ['demon'] },
  hpickle: { name: 'Святые пикули', img: 'heals/hpickle.jpg', chars: ['ghost'] },
  lever: { name: 'Ручка игрового аппарата', img: 'heals/lever.jpg', chars: ['winline'] },
  syringe: { name: 'Шприц 42', img: 'heals/syringe.jpg', chars: ['vladimir', 'winline'] },
};

function canUse(char: CharId | null, key: string): boolean {
  return !!char && HEALS[key].chars.includes(char);
}

// Общий малый хил (формула Рассола): списание + лечение.
function spendHealSmall(z: ZapoiState): HealResult | null {
  const c = heal1cost(z);
  const v = heal1val(z);
  if (z.m < c || z.hp >= z.maxhp) return null;
  z.m -= c;
  z.hp = Math.min(z.maxhp, z.hp + v);
  z.heals++;
  return { v, c };
}

// Обычные пикули: малый хил (формула Рассола). Владимир и Винлайн.
export function pickleSmall(z: ZapoiState): HealResult | null {
  if (!canUse(z.char, 'pickle')) return null;
  return spendHealSmall(z);
}

// Демонические пикули: хилят как обычные, а в демонической форме
// продлевают её на +10 секунд.
export function demonPickle(z: ZapoiState): (HealResult & { extended: boolean }) | null {
  if (!canUse(z.char, 'dpickle')) return null;
  const r = spendHealSmall(z);
  if (!r) return null;
  let extended = false;
  if (z.demonForm > 0) { z.demonForm += 10; extended = true; }
  return { ...r, extended };
}

// Святые пикули: хилят душу призрака (формула Рассола), с шансом 5%
// дают скидку −0.2% к ценам навсегда (как у Владимира, до −20%).
export function holyPickle(z: ZapoiState): HealResult | null {
  if (!canUse(z.char, 'hpickle')) return null;
  const c = heal1cost(z);
  const v = heal1val(z);
  if (z.m < c || (z.soul ?? 100) >= 100) return null;
  z.m -= c;
  z.soul = Math.min(100, (z.soul ?? 100) + v);
  z.heals++;
  let deal = false;
  if (Math.random() < HOLY_DEAL_P) { z.deals = (z.deals || 0) + 1; deal = true; }
  return { v, c, deal };
}

// Шприц: восстанавливает ВСЁ HP. Только Владимир и Винлайн.
// Цена — формула Капельницы.
export function syringe(z: ZapoiState): HealResult | null {
  if (!canUse(z.char, 'syringe')) return null;
  const c = heal2cost(z);
  if (z.m < c || z.hp >= z.maxhp) return null;
  z.m -= c;
  const v = z.maxhp - z.hp;
  z.hp = z.maxhp;
  z.heals++;
  return { v, c };
}

// Лечилки. Возвращают {v, c} или null если нельзя.
export function healSmall(z: ZapoiState): HealResult | null {
  return spendHealSmall(z);
}

export function healBig(z: ZapoiState): HealResult | null {
  const c = heal2cost(z);
  const v = heal2val(z);
  if (z.m < c || z.hp >= z.maxhp) return null;
  z.m -= c;
  z.hp = Math.min(z.maxhp, z.hp + v);
  z.heals++;
  return { v, c };
}

// 😇 Очищение демона: та же цена/формулы что у капельницы, но вместо
// лечения снимает Демоническую форму (ставит HP 30%, иначе форма бы
// сразу включилась заново). Вне формы работает как обычная капельница.
export function cleanseDemon(z: ZapoiState): (HealResult & { cleansed?: boolean }) | null {
  const c = heal2cost(z);
  if (z.m < c) return null;
  if (z.demonForm > 0) {
    z.m -= c;
    z.heals++;
    z.demonForm = 0;
    z.hp = Math.round(z.maxhp * HANGOVER_HP_RATE);
    return { v: 0, c, cleansed: true };
  }
  return healBig(z);
}

// Ставка Винлайна: 10% бухла (мин 50). 45% — возврат ×2, иначе потеря.
// Возвращает null если нельзя, иначе {win, stake}.
export function bet(z: ZapoiState): BetResult | null {
  if (z.char !== 'winline') return null;
  const stake = Math.max(BET_MIN_STAKE, Math.floor(z.m * BET_STAKE_RATE));
  if (z.m < stake) return null;
  z.m -= stake;
  if (Math.random() < BET_WIN_P) {
    z.m += stake * BET_RETURN_MULT;
    return { win: true, stake };
  }
  return { win: false, stake };
}
