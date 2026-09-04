// Древо прокачки: 12 апгрейдов в 4 ветках. Цена = base × growth^уровень.
import type { UpgradeDef, ZapoiState } from './types';
import { shopDiscount, upgradeCost } from './formulas';
import { artCount } from './artifacts';

export const TREE: UpgradeDef[] = [
  { br: '🍺 Ветка Глотки — только бухло', id: 'throat', name: '🍻 Глотка лужёная', desc: 'Урон+', max: 8, base: 10, g: 4, fx(z) { z.click += 1; } },
  { br: '🍺 Ветка Глотки — только бухло', id: 'zakus', name: '🥨 Закуска', desc: 'Урон+', max: 5, base: 150, g: 6, fx(z) { z.click = Math.round(z.click * 1.25 + 0.5); } },
  { br: '🍺 Ветка Глотки — только бухло', id: 'samogon', name: '🧪 Самогонный аппарат', desc: 'Урон++', max: 5, base: 800, g: 7, fx(z) { z.click += 5; } },
  { br: '🧬 Ветка Печени — бухло/сек + тело', id: 'liver', name: '🥩 Печень качка', desc: 'Бухло/сек+', max: 8, base: 25, g: 5, fx(z) { z.auto += 1; } },
  { br: '🧬 Ветка Печени — бухло/сек + тело', id: 'body', name: '🦾 Тело богатыря', desc: 'Здоровье+', max: 6, base: 60, g: 4, fx(z) { z.maxhp += 15; z.hp = Math.min(z.maxhp, z.hp + 15); } },
  { br: '🧬 Ветка Печени — бухло/сек + тело', id: 'metabo', name: '⚗️ Метаболизм', desc: 'Урон от пойла−', max: 5, base: 200, g: 6, fx(z) { z.toxic *= 0.92; } },
  { br: '🩹 Ветка Трезвости — лечат HP, жрут бухло', id: 'rassol', name: '🥒 Пикульная наука', desc: 'Пикули лечат лучше', max: 5, base: 100, g: 5, fx() {} },
  { br: '🩹 Ветка Трезвости — лечат HP, жрут бухло', id: 'regen', name: '💧 Регенерация', desc: 'Здоровье/сек+', max: 8, base: 120, g: 5, fx(z) { z.regen += 0.3; } },
  { br: '🩹 Ветка Трезвости — лечат HP, жрут бухло', id: 'kapel', name: '💉 Медсестра 42', desc: 'Шприц и очищение лучше и дешевле', max: 5, base: 250, g: 6, fx() {} },
  { br: '🎉 Ветка Кутежа — мульты', id: 'party', name: '🪩 Компания', desc: 'Бухла вдвое больше', max: 4, base: 100, g: 8, fx(z) { z.mult *= 2; } },
  { br: '🎉 Ветка Кутежа — мульты', id: 'anthem', name: '🎺 Гимн 42', desc: 'Бухло+ за артефакты', max: 3, base: 600, g: 7, fx(z) { z.mult *= 1 + 0.1 * artCount(z); } },
  { br: '🎉 Ветка Кутежа — мульты и удача', id: 'stream', name: '🍀 Удача 42', desc: 'Удача+: ставка, джекпоты, меньше пустышек', max: 5, base: 300, g: 6, fx(z) { z.luck = (z.luck || 0) + 2; } },
];

export function buyUpgrade(z: ZapoiState, id: string): boolean {
  const b = TREE.find((x) => x.id === id);
  if (!b) return false;
  const l = z.up[id] || 0;
  const c = upgradeCost(b, l, shopDiscount(z));
  if (l >= b.max || z.m < c) return false;
  z.m -= c;
  z.up[id] = l + 1;
  b.fx(z);
  return true;
}
