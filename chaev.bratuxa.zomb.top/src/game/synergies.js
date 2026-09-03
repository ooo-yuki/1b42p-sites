// Синергии артефактов 42. Дешёвые пары — сверху, легенды — снизу.
export const SYNS = [
  { id: 'firstaid', name: '🩺 Аптечка Двора', need: ['cap', 'plaster'],
    desc: 'Крышка+Пластырь (дешёвая): +30 maxHP и +30 HP',
    fx(Z) { Z.maxhp += 30; Z.hp += 30; } },
  { id: 'economy', name: '💰 Эконом 42', need: ['cap', 'check'],
    desc: 'Крышка+Чек (дешёвая): mult×1.15',
    fx(Z) { Z.mult *= 1.15; } },
  { id: 'change', name: '💸 Сдача с чека', need: ['check', 'flask'],
    desc: 'Чек+Фляга (дешёвая): +500 бухла сразу',
    fx(Z) { Z.m += 500; } },
  { id: 'stash', name: '🧳 Заначка Бесконечности', need: ['flask', 'barrel'],
    desc: 'Фляга+Бочка: +5 бухла/сек',
    fx(Z) { Z.auto += 5; } },
  { id: 'flow', name: '🌊 Золотой Поток', need: ['goldshot', 'barrel'],
    desc: 'Рюмка+Бочка: mult×1.5 и +5 бухла/сек',
    fx(Z) { Z.mult *= 1.5; Z.auto += 5; } },
  { id: 'heart', name: '💚 Второе Сердце', need: ['amulet', 'titan'],
    desc: 'Амулет+Титан: +100 maxHP, +1 HP/сек, toxic×0.8',
    fx(Z) { Z.maxhp += 100; Z.hp += 100; Z.regen += 1; Z.toxic *= 0.8; } },
  { id: 'balance', name: '⚖️ Баланс 42', need: ['goldshot', 'amulet'],
    desc: 'Рюмка+Амулет: лечилки +30% сильнее и −20% цены',
    fx() {} },
  { id: 'press', name: '🏭 Пресс-Хаус', need: ['titan', 'barrel'],
    desc: 'Титан+Бочка: +10 к клику, +5/сек, но toxic×1.1',
    fx(Z) { Z.click += 10; Z.auto += 5; Z.toxic *= 1.1; } },
  { id: 'god', name: '🏆 РЕЖИМ БОГА 42', need: ['goldshot', 'amulet', 'titan', 'barrel'],
    desc: 'Все 4 классики: mult×2, +200 maxHP, похмелье −10% вместо −20%',
    fx(Z) { Z.mult *= 2; Z.maxhp += 200; Z.hp += 200; } },
  { id: 'royal', name: '💎 Коронация', need: ['crown', 'heart42'],
    desc: 'Корона+Сердце (легендарная): mult×1.5, +2 HP/сек, toxic×0.9',
    fx(Z) { Z.mult *= 1.5; Z.regen += 2; Z.toxic *= 0.9; } },
  { id: 'legend', name: '🌟 Легенда 42', need: ['crown', 'goldshot', 'heart42'],
    desc: 'Корона+Рюмка+Сердце (легендарная): mult×2',
    fx(Z) { Z.mult *= 2; } },
];

export function hasArt(Z, id) {
  return !!Z.arts[id];
}

export function synReady(Z, s) {
  return s.need.every((id) => hasArt(Z, id));
}

// Проверяет и активирует готовые синергии. Возвращает список активированных id.
export function checkSyns(Z) {
  if (!Z.syn) Z.syn = {};
  const activated = [];
  for (const s of SYNS) {
    if (!Z.syn[s.id] && synReady(Z, s)) {
      Z.syn[s.id] = 1;
      s.fx(Z);
      activated.push(s.id);
    }
  }
  return activated;
}

// Доля потери бухла при похмелье: 20%, с РЕЖИМОМ БОГА — 10%.
export function hangoverRate(Z) {
  return Z.syn && Z.syn.god ? 0.1 : 0.2;
}
