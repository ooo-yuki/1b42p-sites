// Запой 2.0: Печень против Бухла — вся математика, 1-в-1 из legacy.html.
import { SYNS, checkSyns, hangoverRate, synReady, hasArt } from './synergies.js';

export { SYNS, checkSyns, hangoverRate, synReady, hasArt };

export const ZDEF = {
  m: 0, hp: 100, maxhp: 100, click: 1, auto: 0,
  mult: 1, regen: 0, toxic: 1, heals: 0, up: {}, arts: {}, syn: {},
  char: null, sips: 0, soul: 100, demonForm: 0, completed: {}, deals: 0,
};

// ===== ПЕРСОНАЖИ 42 =====
// vladimir — стартовый, всегда открыт. Остальные открываются после первой
// разбитой бутылки за Владимира. completed{} переживает сброс забега.
export const CHARACTERS = [
  { id: 'vladimir', name: 'Владимир Владимирович Чаев', emoji: '🧔', img: 'chars/vladimir.jpg', drink: 'jager/vladimir.jpg',
    desc: 'Стабильный и солидный.',
    stats: ['🍾 Глоток: +0.02 к клику навсегда', '🏷️ Каждый глоток: −0.2% к ценам (макс −20%)', '🥒 Пикули +25% к лечению', '💉 Шприц: полное восстановление HP', '⚡ Пассивно: +0.2 бухла/сек'],
    hint: 'Медленно, надёжно, с постоянным ростом. Стартовый.' },
  { id: 'ghost', name: 'Мёртвый Чаев', emoji: '👻', img: 'chars/ghost.jpg', drink: 'jager/ghost.jpg',
    desc: 'Хрупкий и быстрый.',
    stats: ['👻 Нет похмелья — вместо HP душа', '💜 Душа: реген +2/сек, глоток −5', '💫 Глоток ×3, всё ×1.25', '✨ Святые пикули лечат душу, 5% — скидка как у Владимира', '💥 Душа в 0 — бутылка бьётся, без закрытия'],
    hint: 'Игра на грани.' },
  { id: 'winline', name: 'Винлайн Чаев', emoji: '🎰', img: 'chars/winline.jpg', drink: 'jager/winline.jpg',
    desc: 'Казино внутри кликера.',
    stats: ['🎲 Глоток случайно ×0.5…×2.5', '🏺 Артефакты: 20% двойные, 10% пустышки', '🎰 Ставка: 10% бухла, шанс 45% — возврат ×2 (ручка аппарата)', '🥒 Пикули лечат немного', '💉 Шприц: полное восстановление HP'],
    hint: 'Полный рандом и азарт.' },
  { id: 'demon', name: 'Злой Демон Чаев', emoji: '😈', img: 'chars/demon.jpg', drink: 'jager/demon.jpg', drinkForm: 'jager/demon-form.jpg',
    desc: 'Максимальный риск.',
    stats: ['📈 Мульт ×1…×3 — чем ниже HP, тем сильнее', '🍾 Глоток ×2, но урон ×2', '😈 0 HP — форма ×5 на 10 сек, потом бутылка бьётся', '🔥 Демонические пикули: лечат + продлевают форму на 10 сек', '🍾 Пойло меняется в форме (тёмная рука)', '😇 Очищение спасает: цена капельницы, HP 30%'],
    hint: 'Максимальная награда.' },
];

export function isUnlocked(Z, id) {
  if (id === 'vladimir') return true;
  return !!(Z.completed && Z.completed.vladimir);
}

// Скидка Владимира: −0.2% за глоток, макс −20%. Святые пикули дают
// призраку такую же скидку: 5% шанс −0.2% навсегда (стакается до −20%).
export function charDiscount(Z) {
  if (Z.char === 'vladimir') return Math.min(0.2, (Z.sips || 0) * 0.002);
  if (Z.char === 'ghost') return Math.min(0.2, (Z.deals || 0) * 0.002);
  return 0;
}

// Эффективный мульт с учётом персонажа.
export function effMult(Z) {
  let m = Z.mult;
  if (Z.char === 'ghost') m *= 1.25;
  if (Z.char === 'demon') {
    const missing = 1 - Z.hp / Math.max(1, Z.maxhp);
    m *= 1 + missing * 2;
    if (Z.demonForm > 0) m *= 5;
  }
  return m;
}

// 12 апгрейдов в 4 ветках. Цена = base × growth^уровень.
export const TREE = [
  { br: '🍺 Ветка Глотки — только бухло', id: 'throat', name: '🍻 Глотка лужёная', desc: '+1 к силе глотка', max: 8, base: 10, g: 4, fx(Z) { Z.click += 1; } },
  { br: '🍺 Ветка Глотки — только бухло', id: 'zakus', name: '🥨 Закуска', desc: '+25% к силе глотка (мульт)', max: 5, base: 150, g: 6, fx(Z) { Z.click = Math.round(Z.click * 1.25 + 0.5); } },
  { br: '🍺 Ветка Глотки — только бухло', id: 'samogon', name: '🧪 Самогонный аппарат', desc: '+5 к силе глотка', max: 5, base: 800, g: 7, fx(Z) { Z.click += 5; } },
  { br: '🧬 Ветка Печени — бухло/сек + тело', id: 'liver', name: '🥩 Печень качка', desc: '+1 бухла/сек', max: 8, base: 25, g: 5, fx(Z) { Z.auto += 1; } },
  { br: '🧬 Ветка Печени — бухло/сек + тело', id: 'body', name: '🦾 Тело богатыря', desc: '+15 к макс. здоровью', max: 6, base: 60, g: 4, fx(Z) { Z.maxhp += 15; Z.hp = Math.min(Z.maxhp, Z.hp + 15); } },
  { br: '🧬 Ветка Печени — бухло/сек + тело', id: 'metabo', name: '⚗️ Метаболизм', desc: '−8% урона от пойла (toxic×0.92)', max: 5, base: 200, g: 6, fx(Z) { Z.toxic *= 0.92; } },
  { br: '🩹 Ветка Трезвости — лечат HP, жрут бухло', id: 'rassol', name: '🥒 Пикульная наука', desc: 'Пикули лечат +50% сильнее', max: 5, base: 100, g: 5, fx() {} },
  { br: '🩹 Ветка Трезвости — лечат HP, жрут бухло', id: 'regen', name: '💧 Регенерация', desc: '+0.3 HP/сек', max: 8, base: 120, g: 5, fx(Z) { Z.regen += 0.3; } },
  { br: '🩹 Ветка Трезвости — лечат HP, жрут бухло', id: 'kapel', name: '💉 Медсестра 42', desc: 'Шприц и очищение +40% и дешевле на 10%', max: 5, base: 250, g: 6, fx() {} },
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

export function upgradeCost(def, level, discount = 0) {
  return Math.floor(def.base * Math.pow(def.g, level) * (1 - discount));
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
  if (Z.char === 'vladimir') v = Math.round(v * 1.25);
  return v;
}

export function heal1cost(Z) {
  let c = Math.floor(20 * Math.pow(1.35, Z.heals));
  if (Z.syn.balance) c = Math.floor(c * 0.8);
  return Math.floor(c * (1 - charDiscount(Z)));
}

export function heal2val(Z) {
  let v = Math.round(60 * (1 + 0.4 * (Z.up.kapel || 0)));
  if (Z.syn.balance) v = Math.round(v * 1.3);
  if (Z.char === 'vladimir') v = Math.round(v * 1.25);
  return v;
}

export function heal2cost(Z) {
  let c = Math.floor(150 * Math.pow(1.4, Z.heals) * Math.pow(0.9, Z.up.kapel || 0));
  if (Z.syn.balance) c = Math.floor(c * 0.8);
  return Math.floor(c * (1 - charDiscount(Z)));
}

// Похмелье: −20% бухла (10% с богом), здоровье 30%. Возвращает потерянное бухло,
// дубль кладёт в Z._hangoverLost чтобы UI не пересчитывал его второй формулой (±1 в логе).
export function applyHangover(Z) {
  const rate = hangoverRate(Z);
  const lost = Math.floor(Z.m * rate);
  Z.m -= lost;
  Z.hp = Math.round(Z.maxhp * 0.3);
  Z._hangoverLost = lost;
  return { lost, rate };
}

export function buyUpgrade(Z, id) {
  const b = TREE.find((x) => x.id === id);
  if (!b) return false;
  const l = Z.up[id] || 0;
  const c = upgradeCost(b, l, charDiscount(Z));
  if (l >= b.max || Z.m < c) return false;
  Z.m -= c;
  Z.up[id] = l + 1;
  b.fx(Z);
  return true;
}

export function artCost(Z, a) {
  return Math.floor(a.cost * (1 - charDiscount(Z)));
}

export function buyArt(Z, id) {
  const a = ARTS.find((x) => x.id === id);
  if (!a || Z.arts[id]) return false;
  const c = artCost(Z, a);
  if (Z.m < c) return false;
  Z.m -= c;
  Z.arts[id] = 1;
  Z._lastArtBlank = false;
  const roll = Math.random();
  if (Z.char === 'winline') {
    if (roll < 0.1) {
      // Пустышка: деньги назад, слот свободен — можно крутить снова.
      Z.m += c;
      delete Z.arts[id];
      Z._lastArtBlank = true;
      const syns = checkSyns(Z);
      return syns;
    }
    a.fx(Z);
    if (roll > 0.8) a.fx(Z);
  } else {
    a.fx(Z);
  }
  return checkSyns(Z);
}

// Глоток ягера. Возвращает событие: null | 'hangover' | 'shattered' | 'demonform'.
export function jagerClick(Z) {
  if (Z.char === 'ghost') {
    if (Z.soul <= 0) return 'shattered';
    Z.m += Z.click * effMult(Z) * 3;
    Z.soul -= 5;
    if (Z.soul <= 0) { Z.soul = 0; return 'shattered'; }
    return null;
  }
  if (Z.hp <= 0) {
    if (Z.char === 'demon') { Z.demonForm = 10; return 'demonform'; }
    applyHangover(Z);
    return 'hangover';
  }
  let gain = Z.click * effMult(Z);
  if (Z.char === 'vladimir') {
    Z.sips = (Z.sips || 0) + 1;
    Z.click += 0.02;
  }
  if (Z.char === 'winline') gain *= 0.5 + Math.random() * 2;
  if (Z.char === 'demon') gain *= 2;
  Z.m += gain;
  let dmg = dmgPerSip(Z);
  if (Z.char === 'demon') dmg *= 2;
  Z.hp -= dmg;
  if (Z.hp <= 0) {
    Z.hp = 0;
    if (Z.char === 'demon') { Z.demonForm = 10; return 'demonform'; }
    applyHangover(Z);
    return 'hangover';
  }
  return null;
}

// Ставка Винлайна: 10% бухла (мин 50). 45% — возврат ×2, иначе потеря.
// Возвращает null если нельзя, иначе {win, stake}.
export function bet(Z) {
  if (Z.char !== 'winline') return null;
  const stake = Math.max(50, Math.floor(Z.m * 0.1));
  if (Z.m < stake) return null;
  Z.m -= stake;
  if (Math.random() < 0.45) {
    Z.m += stake * 2;
    return { win: true, stake };
  }
  return { win: false, stake };
}

// 😇 Очищение демона: та же цена/формулы что у капельницы, но вместо
// лечения снимает Демоническую форму (ставит HP 30%, иначе форма бы
// сразу включилась заново). Вне формы работает как обычная капельница.
export function cleanseDemon(Z) {
  const c = heal2cost(Z);
  if (Z.m < c) return null;
  if (Z.demonForm > 0) {
    Z.m -= c;
    Z.heals++;
    Z.demonForm = 0;
    Z.hp = Math.round(Z.maxhp * 0.3);
    return { v: 0, c, cleansed: true };
  }
  return healBig(Z);
}

// ===== ХИЛКИ-ПИКУЛИ 42 =====
// У каждого персонажа свои лечилки с логотипами вместо эмодзи.
// Цены и формулы — те же что у Рассола (малые) и Капельницы (шприц).
export const HEALS = {
  pickle: { name: 'Обычные пикули', img: 'heals/pickle.jpg', chars: ['vladimir', 'winline'] },
  dpickle: { name: 'Демонические пикули', img: 'heals/dpickle.jpg', chars: ['demon'] },
  hpickle: { name: 'Святые пикули', img: 'heals/hpickle.jpg', chars: ['ghost'] },
  lever: { name: 'Ручка игрового аппарата', img: 'heals/lever.jpg', chars: ['winline'] },
  syringe: { name: 'Шприц 42', img: 'heals/syringe.jpg', chars: ['vladimir', 'winline'] },
};

// Обычные пикули: малый хил (формула Рассола). Владимир и Винлайн.
export function pickleSmall(Z) {
  if (!HEALS.pickle.chars.includes(Z.char)) return null;
  return healSmall(Z);
}

// Демонические пикули: хилят как обычные, а в демонической форме
// продлевают её на +10 секунд.
export function demonPickle(Z) {
  if (!HEALS.dpickle.chars.includes(Z.char)) return null;
  const r = healSmall(Z);
  if (!r) return null;
  let extended = false;
  if (Z.demonForm > 0) { Z.demonForm += 10; extended = true; }
  return { ...r, extended };
}

// Святые пикули: хилят душу призрака (формула Рассола), с шансом 5%
// дают скидку −0.2% к ценам навсегда (как у Владимира, до −20%).
export function holyPickle(Z) {
  if (!HEALS.hpickle.chars.includes(Z.char)) return null;
  const c = heal1cost(Z);
  const v = heal1val(Z);
  if (Z.m < c || (Z.soul ?? 100) >= 100) return null;
  Z.m -= c;
  Z.soul = Math.min(100, (Z.soul ?? 100) + v);
  Z.heals++;
  let deal = false;
  if (Math.random() < 0.05) { Z.deals = (Z.deals || 0) + 1; deal = true; }
  return { v, c, deal };
}

// Шприц: восстанавливает ВСЁ HP. Только Владимир и Винлайн.
// Цена — формула Капельницы.
export function syringe(Z) {
  if (!HEALS.syringe.chars.includes(Z.char)) return null;
  const c = heal2cost(Z);
  if (Z.m < c || Z.hp >= Z.maxhp) return null;
  Z.m -= c;
  const v = Z.maxhp - Z.hp;
  Z.hp = Z.maxhp;
  Z.heals++;
  return { v, c };
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

// Тик 1 сек. Возвращает null | 'hangover' | 'shattered' | 'demonform' | 'demonend'.
export function tickZapoi(Z) {
  if (Z.auto > 0) {
    Z.m += Z.auto * effMult(Z);
    if (Z.char !== 'ghost') Z.hp -= Z.auto * 0.05 * Z.toxic;
  }
  if (Z.char === 'vladimir') Z.m += 0.2 * Z.mult;
  if (Z.regen > 0) Z.hp += Z.regen;
  if (Z.char === 'ghost') {
    if (Z.soul <= 0) return 'shattered';
    Z.soul = Math.min(100, (Z.soul ?? 100) + 2);
  }
  if (Z.char === 'demon' && Z.demonForm > 0) {
    Z.demonForm -= 1;
    if (Z.demonForm <= 0) { Z.demonForm = 0; return 'shattered'; }
  }
  Z.hp = Math.max(0, Math.min(Z.maxhp, Z.hp));
  if (Z.hp <= 0) {
    if (Z.char === 'demon' && Z.demonForm <= 0) { Z.demonForm = 10; return 'demonform'; }
    if (Z.char === 'ghost') return 'shattered';
    applyHangover(Z);
    return 'hangover';
  }
  return null;
}

// Финал забега: всё куплено (древо MAX + все артефакты + все синергии)?
export function isAllBought(Z) {
  const treeDone = TREE.every((b) => (Z.up[b.id] || 0) >= b.max);
  const artsDone = ARTS.every((a) => Z.arts[a.id]);
  const synsDone = SYNS.every((s) => Z.syn && Z.syn[s.id]);
  return treeDone && artsDone && synsDone;
}

export const BOTTLE_COST = 50000;

// Разбитая бутылка: самый дорогой предмет. Только когда всё куплено.
// Возвращает false если нельзя, иначе списывает и возвращает true.
export function buyBottle(Z) {
  if (!isAllBought(Z) || Z.m < BOTTLE_COST) return false;
  Z.m -= BOTTLE_COST;
  return true;
}

// Новый забег: чистый лист, completed и выбор персонажа сохраняются.
export function newRun(completed, char) {
  const z = JSON.parse(JSON.stringify(ZDEF));
  z.completed = { ...(completed || {}) };
  z.char = char;
  z.hp = z.maxhp;
  z.soul = 100;
  return z;
}

export function fmtZ(m) {
  if (m < 60) return Math.floor(m) + ' мин';
  if (m < 3600) return (m / 60).toFixed(1) + ' ч';
  return (m / 3600).toFixed(1) + ' сут';
}
