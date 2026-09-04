// Формулы запоя 42, 1-в-1 из legacy.html. Все цены и валы — только здесь.
import type { UpgradeDef, ArtDef, ZapoiState } from './types';
// --- Скидки персонажей ---
export const SIP_DISCOUNT_STEP = 0.002; // −0.2% за глоток/сделку
export const SIP_DISCOUNT_MAX = 0.2; // потолок −20%
// --- Мульты персонажей ---
export const GHOST_MULT = 1.25;
export const GHOST_SIP_MULT = 3; // глоток призрака ×3
export const DEMON_SIP_MULT = 2; // глоток демона ×2
export const DEMON_FORM_MULT = 5; // демоническая форма ×5
export const DEMON_FORM_SECS = 10; // длительность формы, сек
export const WINLINE_SIP_AVG = 1.4; // средний глоток винлайна (для превью кнопки)
// --- Пассивки ---
export const VLADIMIR_CLICK_STEP = 0.02; // +к клику за глоток, навсегда
export const VLADIMIR_PASSIVE = 0.2; // бухла/сек
export const GHOST_SOUL_REGEN = 2; // реген души/сек
export const GHOST_SOUL_SIP = 5; // душа за глоток
export const AUTO_SELF_DMG = 0.05; // урон/сек за единицу auto
// --- Именные артефакты закрытых персонажей (качество 4) ---
export const MUG_DISCOUNT = 0.5; // кружка Владимира: −50% ко всему, кроме бутылки
export const BIBLE_SOUL_REGEN = 2; // библия: +2/сек к регену души
export const BIBLE_DEAL_P = 0.15; // библия: шанс скидки 5% → 15%
export const BAN_FORM_SECS = 15; // бан: форма 15 сек вместо 10
export const BAN_FORM_MULT = 6; // бан: мульт формы ×6 вместо ×5
export const FORM_BANK_MAX = 30; // пикули копят время формы максимум до 30 сек
export const DEMON_PICKLE_FORM_SECS = 10; // демонические пикули продлевают форму (единая константа для heals.ts и UI)

/** Есть ли у забега артефакт (без зацикливания на synergies). */
export function owned(z: ZapoiState, id: string): boolean {
  return !!z.arts[id];
}
// --- Винлайн: честное казино (окупается, но не имба) ---
export const BET_STAKE_RATE = 0.1; // 10% бухла
export const BET_MIN_STAKE = 50;
export const BET_WIN_P = 0.5; // шанс возврата ×2.1 (EV +5% — окупается)
export const BET_RETURN_MULT = 2.1;
export const BET_WIN_MAX = 0.65; // потолок шанса с удачей
export const LUCK_BET_STEP = 0.01; // +1% к шансу ставки за единицу удачи
// --- Глоток винлайна: tiers ---
export const WINLINE_JACKPOT_P = 0.05; // 5% — джекпот ×5
export const LUCK_JACKPOT_STEP = 0.005; // удача растит шанс джекпота
export const JACKPOT_MAX = 0.15; // потолок шанса джекпота
export const JACKPOT_MULT = 5; // джекпот ×5
export const WINLINE_BIG_P = 0.25; // 25% — крупный ×1.5…×2.5
export const LUCK_BLANK_STEP = 0.005; // удача режет шанс пустышки
export const WINLINE_BLANK_MIN = 0.02; // минимум пустышки

// Ставка Винлайна: 10% бухла, минимум BET_MIN_STAKE. Единая формула для bet() и UI-disabled.
export function betStake(m: number): number {
  return Math.max(BET_MIN_STAKE, Math.floor(m * BET_STAKE_RATE));
}

// Единый запасной подсчёт потери похмелья для лога (ревью #6):
// applyHangover всегда кладёт точное число в z._hangoverLost синхронно,
// фолбэк считает от бухла ДО списания — как applyHangover (floor(mBefore * rate)).
export function hangoverLogLost(mBefore: number, rate: number, hangoverLost?: number): number {
  return hangoverLost ?? Math.floor(mBefore * rate);
}
// --- Похмелье ---
export const HANGOVER_HP_RATE = 0.3; // здоровье 30%
export const HANGOVER_RATE = 0.2; // −20% бухла
export const HANGOVER_RATE_GOD = 0.1; // −10% с РЕЖИМОМ БОГА
// --- Шансы ---
export const WINLINE_BLANK_P = 0.1; // пустышка артефакта
export const WINLINE_DOUBLE_P = 0.8; // порог двойного эффекта (roll > 0.8)
export const HOLY_DEAL_P = 0.05; // 5% — скидка святым пикулем

// Скидка Владимира: −0.2% за глоток, макс −20%. Святые пикули дают
// призраку такую же скидку: 5% шанс −0.2% навсегда (стакается до −20%).
export function charDiscount(z: ZapoiState): number {
  if (z.char === 'vladimir') return Math.min(SIP_DISCOUNT_MAX, (z.sips || 0) * SIP_DISCOUNT_STEP);
  if (z.char === 'ghost') return Math.min(SIP_DISCOUNT_MAX, (z.deals || 0) * SIP_DISCOUNT_STEP);
  return 0;
}

// Магазинная скидка: скидка персонажа + кружка Владимира (−50%,
// кроме финальной бутылки — та считается без кружки).
export function shopDiscount(z: ZapoiState): number {
  return charDiscount(z) + (owned(z, 'mug') ? MUG_DISCOUNT : 0);
}

// Длительность демонической формы: 10 сек, с баном — 15.
export function formDuration(z: ZapoiState): number {
  return owned(z, 'ban2w') ? BAN_FORM_SECS : DEMON_FORM_SECS;
}

// Обновление формы: не срезает набранное пикулями время, а держит
// максимум (текущее или базовое). Механика «жги, пока жив».
export function refreshForm(z: ZapoiState): number {
  return Math.min(FORM_BANK_MAX, Math.max(z.demonForm, formDuration(z)));
}

// Эффективный мульт с учётом персонажа.
export function effMult(z: ZapoiState): number {
  let m = z.mult;
  if (z.char === 'ghost') m *= GHOST_MULT;
  if (z.char === 'demon') {
    const missing = 1 - z.hp / Math.max(1, z.maxhp);
    m *= 1 + missing * 2;
    if (z.demonForm > 0) m *= owned(z, 'ban2w') ? BAN_FORM_MULT : DEMON_FORM_MULT;
  }
  return m;
}

// Цена апгрейда = base × growth^уровень (со скидкой персонажа).
export function upgradeCost(def: UpgradeDef, level: number, discount = 0): number {
  return Math.floor(def.base * Math.pow(def.g, level) * (1 - discount));
}

// Цена артефакта с магазинной скидкой (персонаж + кружка).
export function artCost(z: ZapoiState, a: ArtDef): number {
  return Math.floor(a.cost * (1 - shopDiscount(z)));
}

export function dmgPerSip(z: ZapoiState): number {
  return (0.6 + z.m / 4000) * z.toxic;
}

// --- Хилки: валы и цены (единый подсчёт, синергия balance + Владимир) ---
function withBalance(v: number, z: ZapoiState): number {
  return z.syn.balance ? Math.round(v * 1.3) : v;
}

function withVladimir(v: number, z: ZapoiState): number {
  return z.char === 'vladimir' ? Math.round(v * 1.25) : v;
}

export function heal1val(z: ZapoiState): number {
  const v = Math.round(15 * (1 + 0.5 * (z.up.rassol || 0)));
  return withVladimir(withBalance(v, z), z);
}

export function heal1cost(z: ZapoiState): number {
  let c = Math.floor(20 * Math.pow(1.35, z.heals));
  if (z.syn.balance) c = Math.floor(c * 0.8);
  return Math.floor(c * (1 - shopDiscount(z)));
}

export function heal2val(z: ZapoiState): number {
  const v = Math.round(60 * (1 + 0.4 * (z.up.kapel || 0)));
  return withVladimir(withBalance(v, z), z);
}

export function heal2cost(z: ZapoiState): number {
  let c = Math.floor(150 * Math.pow(1.4, z.heals) * Math.pow(0.9, z.up.kapel || 0));
  if (z.syn.balance) c = Math.floor(c * 0.8);
  // Кружка Владимира (−50%) действует на всё в магазине, кроме бутылки — включая шприц/капельницу.
  return Math.floor(c * (1 - shopDiscount(z)));
}

// Сколько даст глоток (для кнопки; у винлайна — среднее).
export function sipPreview(z: ZapoiState): number {
  if (z.char === 'ghost') return Math.round(z.click * effMult(z) * GHOST_SIP_MULT);
  if (z.char === 'demon') return Math.round(z.click * effMult(z) * DEMON_SIP_MULT);
  if (z.char === 'winline') return Math.round(z.click * effMult(z) * WINLINE_SIP_AVG);
  return Math.round(z.click * effMult(z));
}

export function fmtZ(m: number): string {
  if (m < 60) return Math.floor(m) + ' мин';
  if (m < 3600) return (m / 60).toFixed(1) + ' ч';
  return (m / 3600).toFixed(1) + ' сут';
}
