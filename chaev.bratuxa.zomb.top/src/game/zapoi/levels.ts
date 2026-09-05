// Уровни запоя: один забег делится на 5 последовательных стадий.
// Переход только кнопкой (бесплатно), доход на уровне со временем угасает до 0,
// на каждом уровне из скрытого пула предлагается 1 артефакт (взять/пропустить).
// Бутылка открывается только на последнем уровне.
import type { ZapoiState } from './types';

export interface ZapoiLevel {
  id: number;
  name: string;
  emoji: string;
  desc: string;
  /** Сколько суммарно нагнано бухла нужно, чтобы открыть СЛЕДУЮЩИЙ уровень. */
  need: number;
  /** Угасание дохода в минуту (доля). Выхлоп = 1 − минуты × decay, минимум 0. */
  decayPerMin: number;
}

export const LEVELS: ZapoiLevel[] = [
  { id: 0, name: 'Похмелье', emoji: '🍺', desc: 'Утро после вчерашнего. Организм ещё держится.', need: 5000, decayPerMin: 0.05 },
  { id: 1, name: 'Разгон', emoji: '🥃', desc: 'Пошла жара. Печень ворчит, но терпит.', need: 25000, decayPerMin: 0.10 },
  { id: 2, name: 'Кутеж', emoji: '🪩', desc: 'Полный угар. Тело привыкает, выхлоп падает.', need: 100000, decayPerMin: 0.15 },
  { id: 3, name: 'Угар', emoji: '🔥', desc: 'Горим! Каждая минута на месте — потерянный градус.', need: 400000, decayPerMin: 0.20 },
  { id: 4, name: 'Делирий', emoji: '👁️', desc: 'Финальная стадия. Здесь бьётся бутылка.', need: Infinity, decayPerMin: 0.25 },
];

export const LAST_LVL = LEVELS.length - 1;

export interface HiddenArt {
  id: string;
  name: string;
  desc: string;
  minLvl: number;
  fx: (z: ZapoiState) => void;
}

// Скрытый пул: в обычном магазине не продаются, только «с рук» — по одному за уровень.
export const HIDDEN_ARTS: HiddenArt[] = [
  { id: 'stash', name: '🥃 Чекушка НЗ', desc: '+2 к силе глотка. Припрятано на чёрный день.', minLvl: 0, fx(z) { z.click += 2; } },
  { id: 'coal', name: '⚫ Уголь Актив', desc: 'toxic×0.9 — чистит организм.', minLvl: 0, fx(z) { z.toxic *= 0.9; } },
  { id: 'energy', name: '⚡ Энергетик 42', desc: '+2 бухла/сек. Сердце стучит, бабки капают.', minLvl: 1, fx(z) { z.auto += 2; } },
  { id: 'ice', name: '🧊 Лёд из Морозилки', desc: '+0.5 HP/сек. Холодный компресс на печень.', minLvl: 1, fx(z) { z.regen += 0.5; } },
  { id: 'corkscrew', name: '🌀 Золотой Штопор', desc: '×1.5 ко всему бухлу. Открывает любые пробки.', minLvl: 2, fx(z) { z.mult *= 1.5; } },
  { id: 'shoulder', name: '🤝 Плечо Брата', desc: 'toxic×0.9 и +0.5 HP/сек. Батальон своих не бросает.', minLvl: 2, fx(z) { z.toxic *= 0.9; z.regen += 0.5; } },
  { id: 'neonshot', name: '🌃 Неоновая Рюмка', desc: '×2 ко всему бухлу. Светится — значит, работает.', minLvl: 3, fx(z) { z.mult *= 2; } },
  { id: 'oakliver', name: '🪵 Печень Дуба', desc: '+150 к макс. здоровью. Дубовая, проверено.', minLvl: 3, fx(z) { z.maxhp += 150; z.hp += 150; } },
  { id: 'immoliver', name: '💚 Печень Бессмертия', desc: '+2 HP/сек, toxic×0.8. Легенда Делирия.', minLvl: 4, fx(z) { z.regen += 2; z.toxic *= 0.8; } },
  { id: 'hangcrown', name: '👑 Корона Похмелья', desc: '×2.5 ко всему бухлу. Тяжела шапка Мономаха.', minLvl: 4, fx(z) { z.mult *= 2.5; } },
];

export function hiddenById(id: string): HiddenArt | undefined {
  return HIDDEN_ARTS.find((a) => a.id === id);
}

/** Текущий выхлоп уровня: 1 → 0 по мере сидения. Кнопку жать можно всегда. */
export function lvlMult(z: Pick<ZapoiState, 'lvl' | 'lvlSec'>): number {
  const lv = LEVELS[Math.max(0, Math.min(LAST_LVL, z.lvl ?? 0))];
  return Math.max(0, 1 - ((z.lvlSec ?? 0) / 60) * lv.decayPerMin);
}

/** Можно ли перейти дальше (прогресс есть, кнопка показывается). */
export function canAdvance(z: Pick<ZapoiState, 'lvl' | 'earned'>): boolean {
  const lvl = z.lvl ?? 0;
  if (lvl >= LAST_LVL) return false;
  return (z.earned ?? 0) >= LEVELS[lvl].need;
}

/** Случайный скрытый артефакт уровня: ещё не взятый и доступный по глубине. */
export function rollOffer(z: Pick<ZapoiState, 'lvl' | 'arts'>): string | null {
  const lvl = z.lvl ?? 0;
  const pool = HIDDEN_ARTS.filter((a) => a.minLvl <= lvl && !z.arts[a.id]);
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)].id;
}

/** Переход на следующий уровень: сброс угасания + предложение «с рук». */
export function advanceLevel(z: ZapoiState): string | null {
  if (!canAdvance(z)) return null;
  z.lvl = Math.min(LAST_LVL, (z.lvl ?? 0) + 1);
  z.lvlSec = 0;
  z.offer = null;
  // Один оффер за уровень: если ещё не предлагали — предлагаем.
  if (!z.offerDone[z.lvl]) {
    z.offerDone[z.lvl] = 1;
    z.offer = rollOffer(z);
  }
  return z.offer;
}

/** Взять предложенное «с рук» (бесплатно, раз за забег). */
export function takeOffer(z: ZapoiState): HiddenArt | null {
  if (!z.offer) return null;
  const a = hiddenById(z.offer);
  z.offer = null;
  if (!a || z.arts[a.id]) return null;
  z.arts[a.id] = 1;
  a.fx(z);
  return a;
}

/** Пропустить предложение — уйдёт навсегда, уровень останется. */
export function skipOffer(z: ZapoiState): void {
  z.offer = null;
}
