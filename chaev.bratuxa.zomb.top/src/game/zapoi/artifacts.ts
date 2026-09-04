// Артефакты 42 по качествам 1-4. Цены и эффекты — 1-в-1.
import type { ArtDef, ZapoiState } from './types';
import { LUCK_BLANK_STEP, WINLINE_BLANK_MIN, WINLINE_BLANK_P, WINLINE_DOUBLE_P, artCost } from './formulas';
import { checkSyns } from '../synergies';

export const ARTS: ArtDef[] = [
  // ⭐ Качество 1 — дешёвые: цена 300–500, эффекты скромные.
  { id: 'cap', name: '🧢 Пивная Крышка 42', desc: '+1 к силе глотка', cost: 300, q: 1, fx(z) { z.click += 1; } },
  { id: 'plaster', name: '🤕 Пластырь Двора', desc: '+20 к макс. здоровью', cost: 350, q: 1, fx(z) { z.maxhp += 20; z.hp += 20; } },
  { id: 'check', name: '🧾 Чек из Пятёрочки', desc: '+0.3 HP/сек', cost: 500, q: 1, fx(z) { z.regen += 0.3; } },
  // ⭐⭐ Качество 2 — средние: цена 2500–6000.
  { id: 'flask', name: '🥛 Фляга Заначка', desc: '+3 бухла/сек', cost: 2500, q: 2, fx(z) { z.auto += 3; } },
  { id: 'amulet', name: '🧿 Амулет Трезвости', desc: '+1 HP/сек, −30% урона (toxic×0.7)', cost: 4000, q: 2, fx(z) { z.regen += 1; z.toxic *= 0.7; } },
  { id: 'titan', name: '🛡️ Титановая Печень', desc: '+100 к макс. здоровью', cost: 6000, q: 2, fx(z) { z.maxhp += 100; z.hp += 100; } },
  // ⭐⭐⭐ Качество 3 — крутые: цена 5000–8000.
  { id: 'goldshot', name: '🥃 Золотая Рюмка 42', desc: '×2 ко всему бухлу. Навсегда.', cost: 5000, q: 3, fx(z) { z.mult *= 2; } },
  { id: 'barrel', name: '🛢️ Бочка Бесконечности', desc: '+10 бухла/сек', cost: 8000, q: 3, fx(z) { z.auto += 10; } },
  // ⭐⭐⭐⭐ Качество 4 — легенды: цена 18000–20000, лютая имба.
  { id: 'heart42', name: '❤️‍🔥 Сердце Батальона', desc: '+300 maxHP, +3 HP/сек, toxic×0.85', cost: 18000, q: 4, fx(z) { z.maxhp += 300; z.hp += 300; z.regen += 3; z.toxic *= 0.85; } },
  { id: 'crown', name: '👑 Корона Запоя 42', desc: '×3 ко всему бухлу. Навсегда.', cost: 20000, q: 4, fx(z) { z.mult *= 3; } },
  // 🏆 Качество 4 — именные: открываются закрытием персонажа, лежат у всех.
  { id: 'mug', name: '🥇 Золотая кружка Чаева', desc: '−50% на всё в магазине (кроме разбитой бутылки). Открывается закрытием Владимира.', cost: 25000, q: 4, req: 'vladimir', fx() {} },
  { id: 'bible', name: '📕 Библия Батальона', desc: 'Всем: +1 HP/сек и −15% урона. Призраку: душа +2/сек, пикули лечат ×2, шанс скидки 15%. Открывается закрытием Призрака.', cost: 25000, q: 4, req: 'ghost', fx(z) { z.regen += 1; z.toxic *= 0.85; } },
  { id: 'ban2w', name: '🔨 Бан на две недельки', desc: 'Всем: +25% ко всему бухлу навсегда. Демону: форма 15 сек вместо 10, мульт ×6 вместо ×5. Открывается закрытием Демона.', cost: 30000, q: 4, req: 'demon', fx(z) { z.mult *= 1.25; } },
  { id: 'leverball', name: '🔴 Сломанная ручка автомата', desc: 'Даёт любому персонажу механику Винлайна: кнопку СТАВКА. Открывается закрытием Винлайна.', cost: 30000, q: 4, req: 'winline', fx() {} },
];

export const QUALITY_NAMES: Record<number, string> = {
  1: 'Качество 1 — дешёвые (300–500)',
  2: 'Качество 2 — средние (2500–6000)',
  3: 'Качество 3 — крутые (5000–8000)',
  4: 'Качество 4 — легенды (18000–30000)',
};

export function artCount(z: ZapoiState): number {
  return ARTS.filter((a) => z.arts[a.id]).length;
}

export function buyArt(z: ZapoiState, id: string): false | string[] {
  const a = ARTS.find((x) => x.id === id);
  if (!a || z.arts[id]) return false;
  // Именной артефакт: нужен закрытый персонаж-хозяин.
  if (a.req && !(z.completed && z.completed[a.req])) return false;
  const c = artCost(z, a);
  if (z.m < c) return false;
  z.m -= c;
  z.arts[id] = 1;
  z._lastArtBlank = false;
  const roll = Math.random();
  if (z.char === 'winline') {
    // Удача режет шанс пустышки (минимум 2%).
    const blankP = Math.max(WINLINE_BLANK_MIN, WINLINE_BLANK_P - (z.luck || 0) * LUCK_BLANK_STEP);
    if (roll < blankP) {
      // Пустышка: деньги назад, слот свободен — можно крутить снова.
      z.m += c;
      delete z.arts[id];
      z._lastArtBlank = true;
      return checkSyns(z);
    }
    a.fx(z);
    if (roll > WINLINE_DOUBLE_P) a.fx(z);
  } else {
    a.fx(z);
  }
  return checkSyns(z);
}
