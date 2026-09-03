// Запой 2.0: Печень против Бухла — вся математика, 1-в-1 из legacy.html.
import { SYNS, checkSyns, hangoverRate, synReady, hasArt } from './synergies.js';

export { SYNS, checkSyns, hangoverRate, synReady, hasArt };

export const ZDEF = {
  m: 0, hp: 100, maxhp: 100, click: 1, auto: 0,
  mult: 1, regen: 0, toxic: 1, heals: 0, up: {}, arts: {}, syn: {},
};

// 12 апгрейдов в 4 ветках. Цена = base × growth^уровень.
export const TREE = [
  { br: '🍺 Ветка Глотки — только бухло', id: 'throat', name: '🍻 Глотка лужёная', desc: '+1 к силе глотка', max: 8, base: 10, g: 4, fx(Z) { Z.click += 1; } },
  { br: '🍺 Ветка Глотки — только бухло', id: 'zakus', name: '🥨 Закуска', desc: '+25% к силе глотка (мульт)', max: 5, base: 150, g: 6, fx(Z) { Z.click = Math.round(Z.click * 1.25 + 0.5); } },
  { br: '🍺 Ветка Глотки — только бухло', id: 'samogon', name: '🧪 Самогонный аппарат', desc: '+5 к силе глотка', max: 5, base: 800, g: 7, fx(Z) { Z.click += 5; } },
  { br: '🧬 Ветка Печени — бухло/сек + тело', id: 'liver', name: '🥩 Печень качка', desc: '+1 бухла/сек', max: 8, base: 25, g: 5, fx(Z) { Z.auto += 1; } },
  { br: '🧬 Ветка Печени — бухло/сек + тело', id: 'body', name: '🦾 Тело богатыря', desc: '+15 к макс. здоровью', max: 6, base: 60, g: 4, fx(Z) { Z.maxhp += 15; Z.hp = Math.min(Z.maxhp, Z.hp + 15); } },
  { br: '🧬 Ветка Печени — бухло/сек + тело', id: 'metabo', name: '⚗️ Метаболизм', desc: '−8% урона от пойла (toxic×0.92)', max: 5, base: 200, g: 6, fx(Z) { Z.toxic *= 0.92; } },
  { br: '🩹 Ветка Трезвости — лечат HP, жрут бухло', id: 'rassol', name: '🫖 Рассольная наука', desc: 'Рассол лечит +50% сильнее', max: 5, base: 100, g: 5, fx() {} },
  { br: '🩹 Ветка Трезвости — лечат HP, жрут бухло', id: 'regen', name: '💧 Регенерация', desc: '+0.3 HP/сек', max: 8, base: 120, g: 5, fx(Z) { Z.regen += 0.3; } },
  { br: '🩹 Ветка Трезвости — лечат HP, жрут бухло', id: 'kapel', name: '🚑 Медсестра 42', desc: 'Капельница лечит +40% и дешевеет на 10%', max: 5, base: 250, g: 6, fx() {} },
  { br: '🎉 Ветка Кутежа — мульты', id: 'party', name: '🪩 Компания', desc: '×2 ко всему бухлу', max: 4, base: 100, g: 8, fx(Z) { Z.mult *= 2; } },
  { br: '🎉 Ветка Кутежа — мульты', id: 'anthem', name: '🎺 Гимн 42', desc: '+10% ко всему за каждый артефакт', max: 3, base: 600, g: 7, fx(Z) { Z.mult *= 1 + 0.1 * artCount(Z); } },
  { br: '🎉 Ветка Кутежа — мульты', id: 'stream', name: '📺 Стрим запоя', desc: '+2 бухла/сек, +0.2 урона/сек (риск!)', max: 5, base: 300, g: 6, fx(Z) { Z.auto += 2; Z.toxic *= 1.04; } },
];

export const ARTS = [
  // ⭐ Качество 1 — дешёвые: цена 300–500, эффекты скромные.
  { id: 'cap', name: '🧢 Пивная Крышка 42', desc: '+1 к силе глотка', cost: 300, q: 1, fx(Z) { Z.click += 1; } },
  { id: 'plaster', name: '🤕 Пластырь Двора', desc: '+20 к макс. здоровью', cost: 350, q: 1, fx(Z) { Z.maxhp += 20; Z.hp += 20; } },
  { id: 'check', name: '🧾 Чек из Пятёрочки', desc: '+0.3 HP/сек', cost: 500, q: 1, fx(Z) { Z.regen += 0.3; } },
  // ⭐⭐ Качество 2 — средние: цена 2500–6000.
  { id: 'flask', name: '🥛 Фляга Заначка', desc: '+3 бухла/сек', cost: 2500, q: 2, fx(Z) { Z.auto += 3; } },
  { id: 'amulet', name: '🧿 Амулет Трезвости', desc: '+1 HP/сек, −30% урона (toxic×0.7)', cost: 4000, q: 2, fx(Z) { Z.regen += 1; Z.toxic *= 0.7; } },
  { id: 'titan', name: '🛡️ Титановая Печень', desc: '+100 к макс. здоровью', cost: 6000, q: 2, fx(Z) { Z.maxhp += 100; Z.hp += 100; } },
  // ⭐⭐⭐ Качество 3 — крутые: цена 5000–8000.
  { id: 'goldshot', name: '🥃 Золотая Рюмка 42', desc: '×2 ко всему бухлу. Навсегда.', cost: 5000, q: 3, fx(Z) { Z.mult *= 2; } },
  { id: 'barrel', name: '🛢️ Бочка Бесконечности', desc: '+10 бухла/сек', cost: 8000, q: 3, fx(Z) { Z.auto += 10; } },
  // ⭐⭐⭐⭐ Качество 4 — легенды: цена 18000–20000, лютая имба.
  { id: 'heart42', name: '❤️‍🔥 Сердце Батальона', desc: '+300 maxHP, +3 HP/сек, toxic×0.85', cost: 18000, q: 4, fx(Z) { Z.maxhp += 300; Z.hp += 300; Z.regen += 3; Z.toxic *= 0.85; } },
  { id: 'crown', name: '👑 Корона Запоя 42', desc: '×3 ко всему бухлу. Навсегда.', cost: 20000, q: 4, fx(Z) { Z.mult *= 3; } },
];

export const QUALITY_NAMES = {
  1: '⭐ Качество 1 — дешёвые (300–500)',
  2: '⭐⭐ Качество 2 — средние (2500–6000)',
  3: '⭐⭐⭐ Качество 3 — крутые (5000–8000)',
  4: '🔱 Качество 4 — легенды (18000–20000)',
};

export function createZapoiState() {
  return JSON.parse(JSON.stringify(ZDEF));
}

export function upgradeCost(def, level) {
  return Math.floor(def.base * Math.pow(def.g, level));
}

export function artCount(Z) {
  return ARTS.filter((a) => Z.arts[a.id]).length;
}

export function dmgPerSip(Z) {
  return (0.6 + Z.m / 4000) * Z.toxic;
}

export function heal1val(Z) {
  let v = Math.round(15 * (1 + 0.5 * (Z.up.rassol || 0)));
  if (Z.syn.balance) v = Math.round(v * 1.3);
  return v;
}

export function heal1cost(Z) {
  let c = Math.floor(20 * Math.pow(1.35, Z.heals));
  if (Z.syn.balance) c = Math.floor(c * 0.8);
  return c;
}

export function heal2val(Z) {
  let v = Math.round(60 * (1 + 0.4 * (Z.up.kapel || 0)));
  if (Z.syn.balance) v = Math.round(v * 1.3);
  return v;
}

export function heal2cost(Z) {
  let c = Math.floor(150 * Math.pow(1.4, Z.heals) * Math.pow(0.9, Z.up.kapel || 0));
  if (Z.syn.balance) c = Math.floor(c * 0.8);
  return c;
}

// Похмелье: −20% бухла (10% с богом), здоровье 30%. Возвращает потерянное бухло.
export function applyHangover(Z) {
  const rate = hangoverRate(Z);
  const lost = Math.floor(Z.m * rate);
  Z.m -= lost;
  Z.hp = Math.round(Z.maxhp * 0.3);
  return { lost, rate };
}

export function buyUpgrade(Z, id) {
  const b = TREE.find((x) => x.id === id);
  if (!b) return false;
  const l = Z.up[id] || 0;
  const c = upgradeCost(b, l);
  if (l >= b.max || Z.m < c) return false;
  Z.m -= c;
  Z.up[id] = l + 1;
  b.fx(Z);
  return true;
}

export function buyArt(Z, id) {
  const a = ARTS.find((x) => x.id === id);
  if (!a || Z.arts[id] || Z.m < a.cost) return false;
  Z.m -= a.cost;
  Z.arts[id] = 1;
  a.fx(Z);
  return checkSyns(Z);
}

// Глоток ягера. Возвращает событие: null | 'hangover'.
export function jagerClick(Z) {
  if (Z.hp <= 0) {
    applyHangover(Z);
    return 'hangover';
  }
  Z.m += Z.click * Z.mult;
  Z.hp -= dmgPerSip(Z);
  if (Z.hp <= 0) {
    Z.hp = 0;
    applyHangover(Z);
    return 'hangover';
  }
  return null;
}

// Лечилки. Возвращают {v, c} или null если нельзя.
export function healSmall(Z) {
  const c = heal1cost(Z);
  const v = heal1val(Z);
  if (Z.m < c || Z.hp >= Z.maxhp) return null;
  Z.m -= c;
  Z.hp = Math.min(Z.maxhp, Z.hp + v);
  Z.heals++;
  return { v, c };
}

export function healBig(Z) {
  const c = heal2cost(Z);
  const v = heal2val(Z);
  if (Z.m < c || Z.hp >= Z.maxhp) return null;
  Z.m -= c;
  Z.hp = Math.min(Z.maxhp, Z.hp + v);
  Z.heals++;
  return { v, c };
}

// Тик 1 сек. Возвращает 'hangover' если случилось похмелье.
export function tickZapoi(Z) {
  if (Z.auto > 0) {
    Z.m += Z.auto * Z.mult;
    Z.hp -= Z.auto * 0.05 * Z.toxic;
  }
  if (Z.regen > 0) Z.hp += Z.regen;
  Z.hp = Math.max(0, Math.min(Z.maxhp, Z.hp));
  if (Z.hp <= 0 && Z.m > 0) {
    applyHangover(Z);
    return 'hangover';
  }
  return null;
}

export function fmtZ(m) {
  if (m < 60) return Math.floor(m) + ' мин';
  if (m < 3600) return (m / 60).toFixed(1) + ' ч';
  return (m / 3600).toFixed(1) + ' сут';
}
