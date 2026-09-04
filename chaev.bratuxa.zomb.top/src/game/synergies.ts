// Синергии артефактов 42. Дешёвые пары — сверху, легенды — снизу.
import type { SynDef, ZapoiState } from './zapoi/types';
import { HANGOVER_RATE, HANGOVER_RATE_GOD } from './zapoi/formulas';

export const SYNS: SynDef[] = [
  { id: 'firstaid', name: '🩺 Аптечка Двора', need: ['cap', 'plaster'],
    desc: 'Крышка+Пластырь (дешёвая): +30 maxHP и +30 HP',
    fx(z) { z.maxhp += 30; z.hp += 30; } },
  { id: 'economy', name: '💰 Эконом 42', need: ['cap', 'check'],
    desc: 'Крышка+Чек (дешёвая): mult×1.15',
    fx(z) { z.mult *= 1.15; } },
  { id: 'change', name: '💸 Сдача с чека', need: ['check', 'flask'],
    desc: 'Чек+Фляга (дешёвая): +500 бухла сразу',
    fx(z) { z.m += 500; } },
  { id: 'stash', name: '🧳 Заначка Бесконечности', need: ['flask', 'barrel'],
    desc: 'Фляга+Бочка: +5 бухла/сек',
    fx(z) { z.auto += 5; } },
  { id: 'flow', name: '🌊 Золотой Поток', need: ['goldshot', 'barrel'],
    desc: 'Рюмка+Бочка: mult×1.5 и +5 бухла/сек',
    fx(z) { z.mult *= 1.5; z.auto += 5; } },
  { id: 'heart', name: '💚 Второе Сердце', need: ['amulet', 'titan'],
    desc: 'Амулет+Титан: +100 maxHP, +1 HP/сек, toxic×0.8',
    fx(z) { z.maxhp += 100; z.hp += 100; z.regen += 1; z.toxic *= 0.8; } },
  { id: 'balance', name: '⚖️ Баланс 42', need: ['goldshot', 'amulet'],
    desc: 'Рюмка+Амулет: лечилки +30% сильнее и −20% цены',
    fx() {} },
  { id: 'press', name: '🏭 Пресс-Хаус', need: ['titan', 'barrel'],
    desc: 'Титан+Бочка: +10 к клику, +5/сек, но toxic×1.1',
    fx(z) { z.click += 10; z.auto += 5; z.toxic *= 1.1; } },
  { id: 'god', name: '🏆 РЕЖИМ БОГА 42', need: ['goldshot', 'amulet', 'titan', 'barrel'],
    desc: 'Все 4 классики: mult×2, +200 maxHP, похмелье −10% вместо −20%',
    fx(z) { z.mult *= 2; z.maxhp += 200; z.hp += 200; } },
  { id: 'royal', name: '💎 Коронация', need: ['crown', 'heart42'],
    desc: 'Корона+Сердце (легендарная): mult×1.5, +2 HP/сек, toxic×0.9',
    fx(z) { z.mult *= 1.5; z.regen += 2; z.toxic *= 0.9; } },
  { id: 'legend', name: '🌟 Легенда 42', need: ['crown', 'goldshot', 'heart42'],
    desc: 'Корона+Рюмка+Сердце (легендарная): mult×2',
    fx(z) { z.mult *= 2; } },
];

export function hasArt(z: ZapoiState, id: string): boolean {
  return !!z.arts[id];
}

export function synReady(z: ZapoiState, s: SynDef): boolean {
  return s.need.every((id) => hasArt(z, id));
}

// Проверяет и активирует готовые синергии. Возвращает список активированных id.
export function checkSyns(z: ZapoiState): string[] {
  if (!z.syn) z.syn = {};
  const activated: string[] = [];
  for (const s of SYNS) {
    if (!z.syn[s.id] && synReady(z, s)) {
      z.syn[s.id] = 1;
      s.fx(z);
      activated.push(s.id);
    }
  }
  return activated;
}

// Доля потери бухла при похмелье: 20%, с РЕЖИМОМ БОГА — 10%.
export function hangoverRate(z: ZapoiState): number {
  return z.syn && z.syn.god ? HANGOVER_RATE_GOD : HANGOVER_RATE;
}
