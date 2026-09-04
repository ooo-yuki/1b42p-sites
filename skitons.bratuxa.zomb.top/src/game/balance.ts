// Баланс Skitons Cafe: 19 апгрейдов × 5 уровней, цена base×1.9^level.
// Доход = 2 × comfort × staff × kitchen × menu × promo: ни одна ветка
// не тащит в соло, равномерное развитие всегда выгоднее (см. PRODUCT.md).
export type Branch = 'comfort' | 'staff' | 'kitchen' | 'menu' | 'promo';

export type UpgradeId =
  | 'comfort-building' | 'comfort-chairs' | 'comfort-veranda' | 'comfort-umbrellas' | 'comfort-garden'
  | 'staff-waiter' | 'staff-cook' | 'staff-cleaner'
  | 'kitchen-fridge' | 'kitchen-stove' | 'kitchen-pan'
  | 'menu-seasonal' | 'menu-recipes' | 'menu-asian' | 'menu-european' | 'menu-american'
  | 'promo-ads' | 'promo-flyer' | 'promo-music';

export interface UpgradeMeta { branch: Branch; name: string; effect: string; base: number; max: number; mult: number }
export type Levels = Partial<Record<UpgradeId, number>>;

export const BRANCHES: { id: Branch; name: string }[] = [
  { id: 'comfort', name: 'Обустройство' },
  { id: 'staff', name: 'Персонал' },
  { id: 'kitchen', name: 'Кухня' },
  { id: 'menu', name: 'Меню' },
  { id: 'promo', name: 'Продвижение' },
];

const U = (branch: Branch, name: string, effect: string, base: number, mult = 0.12, max = 5): UpgradeMeta =>
  ({ branch, name, effect, base, max, mult });

// Ветки по 5 апгрейдов (comfort, menu) идут с mult 0.12,
// ветки по 3 (staff, kitchen, promo) — с 0.15: late-game множители ближе,
// максить одну ветку невыгодно.
export const UPGRADES: Record<UpgradeId, UpgradeMeta> = {
  'comfort-building': U('comfort', 'Здание', '+уют, больше чек', 60),
  'comfort-chairs': U('comfort', 'Стулья', '+места гостям', 40),
  'comfort-veranda': U('comfort', 'Веранда', '+уют, больше чек', 120),
  'comfort-umbrellas': U('comfort', 'Зонтики', '+уют на веранде', 90),
  'comfort-garden': U('comfort', 'Сад', '+уют, тянет гостей', 150),
  'staff-waiter': U('staff', 'Официант', '+скорость подачи', 80, 0.15),
  'staff-cook': U('staff', 'Повар', '+скорость кухни', 110, 0.15),
  'staff-cleaner': U('staff', 'Уборщик', '+оборот столов', 70, 0.15),
  'kitchen-fridge': U('kitchen', 'Холодильник', '+скорость кухни', 70, 0.15),
  'kitchen-stove': U('kitchen', 'Плита', '+скорость кухни', 130, 0.15),
  'kitchen-pan': U('kitchen', 'Сковорода', '+скорость готовки', 50, 0.15),
  'menu-seasonal': U('menu', 'Сезонное', '+средний чек', 60),
  'menu-recipes': U('menu', 'Рецепты', '+средний чек', 100),
  'menu-asian': U('menu', 'Азиатское', '+чек и поток', 160),
  'menu-european': U('menu', 'Европейское', '+средний чек', 140),
  'menu-american': U('menu', 'Американское', '+чек и поток', 120),
  'promo-ads': U('promo', 'Реклама', '+поток гостей', 50, 0.15),
  'promo-flyer': U('promo', 'Флаеры', '+поток гостей', 80, 0.15),
  'promo-music': U('promo', 'Музыка', '+настроение и рейтинг', 110, 0.15),
};

export const levelOf = (lv: Levels, id: UpgradeId): number => lv[id] ?? 0;

export function costOf(id: UpgradeId, level: number): number {
  return Math.round(UPGRADES[id].base * Math.pow(1.9, level));
}

function branchMult(lv: Levels, b: Branch): number {
  let m = 1;
  (Object.keys(UPGRADES) as UpgradeId[]).forEach((id) => {
    const u = UPGRADES[id];
    if (u.branch === b) m *= 1 + u.mult * levelOf(lv, id);
  });
  return m;
}

export const comfortMult = (lv: Levels): number => branchMult(lv, 'comfort');
export const staffMult = (lv: Levels): number => branchMult(lv, 'staff');
export const kitchenMult = (lv: Levels): number => branchMult(lv, 'kitchen');
export const menuMult = (lv: Levels): number => branchMult(lv, 'menu');
export const promoMult = (lv: Levels): number => branchMult(lv, 'promo');

export function incomePerSec(lv: Levels): number {
  return 2 * comfortMult(lv) * staffMult(lv) * kitchenMult(lv) * menuMult(lv) * promoMult(lv);
}

export function guestsPerSec(lv: Levels): number {
  return (0.5 + 0.08 * totalLevels(lv)) * (0.6 + 0.4 * promoMult(lv));
}

export function rating(lv: Levels): number {
  const t = totalLevels(lv);
  return Math.min(5, 3 + t / 12);
}

export function totalLevels(lv: Levels): number {
  return (Object.keys(UPGRADES) as UpgradeId[]).reduce((s, id) => s + levelOf(lv, id), 0);
}
