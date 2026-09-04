// Древо прокачки: 12 апгрейдов в 4 ветках. Цена = base × growth^уровень.
import type { UpgradeDef, ZapoiState } from './types';
import { shopDiscount, upgradeCost } from './formulas';
import { artCount } from './artifacts';

export const TREE: UpgradeDef[] = [
  { br: '🍺 Ветка Глотки — только бухло', id: 'throat', name: '🍻 Глотка лужёная', desc: '+1 к силе глотка', max: 8, base: 10, g: 4, fx(z) { z.click += 1; } },
  { br: '🍺 Ветка Глотки — только бухло', id: 'zakus', name: '🥨 Закуска', desc: '+25% к силе глотка (мульт)', max: 5, base: 150, g: 6, fx(z) { z.click = Math.round(z.click * 1.25 + 0.5); } },
  { br: '🍺 Ветка Глотки — только бухло', id: 'samogon', name: '🧪 Самогонный аппарат', desc: '+5 к силе глотка', max: 5, base: 800, g: 7, fx(z) { z.click += 5; } },
  { br: '🧬 Ветка Печени — бухло/сек + тело', id: 'liver', name: '🥩 Печень качка', desc: '+1 бухла/сек', max: 8, base: 25, g: 5, fx(z) { z.auto += 1; } },
  { br: '🧬 Ветка Печени — бухло/сек + тело', id: 'body', name: '🦾 Тело богатыря', desc: '+15 к макс. здоровью', max: 6, base: 60, g: 4, fx(z) { z.maxhp += 15; z.hp = Math.min(z.maxhp, z.hp + 15); } },
  { br: '🧬 Ветка Печени — бухло/сек + тело', id: 'metabo', name: '⚗️ Метаболизм', desc: '−8% урона от пойла (toxic×0.92)', max: 5, base: 200, g: 6, fx(z) { z.toxic *= 0.92; } },
  { br: '🩹 Ветка Трезвости — лечат HP, жрут бухло', id: 'rassol', name: '🥒 Пикульная наука', desc: 'Пикули лечат +50% сильнее', max: 5, base: 100, g: 5, fx() {} },
  { br: '🩹 Ветка Трезвости — лечат HP, жрут бухло', id: 'regen', name: '💧 Регенерация', desc: '+0.3 HP/сек', max: 8, base: 120, g: 5, fx(z) { z.regen += 0.3; } },
  { br: '🩹 Ветка Трезвости — лечат HP, жрут бухло', id: 'kapel', name: '💉 Медсестра 42', desc: 'Шприц и очищение +40% и дешевле на 10%', max: 5, base: 250, g: 6, fx() {} },
  { br: '🎉 Ветка Кутежа — мульты', id: 'party', name: '🪩 Компания', desc: '×2 ко всему бухлу', max: 4, base: 100, g: 8, fx(z) { z.mult *= 2; } },
  { br: '🎉 Ветка Кутежа — мульты', id: 'anthem', name: '🎺 Гимн 42', desc: '+10% ко всему за каждый артефакт', max: 3, base: 600, g: 7, fx(z) { z.mult *= 1 + 0.1 * artCount(z); } },
  { br: '🎉 Ветка Кутежа — мульты', id: 'stream', name: '📺 Стрим запоя', desc: '+2 бухла/сек, +0.2 урона/сек (риск!)', max: 5, base: 300, g: 6, fx(z) { z.auto += 2; z.toxic *= 1.04; } },
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
