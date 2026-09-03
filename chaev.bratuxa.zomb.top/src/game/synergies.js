// Синергии артефактов 42 — 1-в-1 из legacy.html. Отдельный модуль: эффекты пар/наборов.
export const SYNS = [
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
    desc: 'Все 4: mult×2, +200 maxHP, похмелье −10% вместо −20%',
    fx(Z) { Z.mult *= 2; Z.maxhp += 200; Z.hp += 200; } },
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
