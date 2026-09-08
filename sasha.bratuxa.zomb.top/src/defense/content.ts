export interface Cell { x: number; y: number }

function snake(): Cell[] {
  const cells: Cell[] = [];
  const rows = [1, 3, 5, 7];
  let dir = 1;
  cells.push({ x: 0, y: 1 });
  for (const y of rows) {
    for (let x = dir > 0 ? 1 : 7; dir > 0 ? x <= 8 : x >= 0; x += dir) cells.push({ x, y });
    if (y < 7) cells.push({ x: dir > 0 ? 8 : 0, y: y + 1 }, { x: dir > 0 ? 8 : 0, y: y + 2 });
    dir = -dir;
  }
  for (let x = 0; x <= 8; x++) cells.push({ x, y: 8 });
  return cells;
}

export const PATH = snake();

export interface WaveDef { count: number; hpMul: number; speed: number; tankEvery: number; runnerEvery: number }

export const WAVES: WaveDef[] = Array.from({ length: 10 }, (_, i) => ({
  count: 10 + Math.round((40 - 10) * (i / 9)),
  hpMul: 1.35 ** i,
  speed: 1 + i * 0.06,
  tankEvery: i < 2 ? 0 : 4,
  runnerEvery: i < 3 ? 0 : 3,
}));

export const WAVE_NAMES: string[] = [
  'Разведка зануд', 'Первые зеваки', 'Спринт-отряд', 'Танки идут',
  'Скука сгущается', 'Двойной зануда', 'Марафон спринта',
  'Броня и нытьё', 'Генеральная скука', 'Директор лично',
];

export interface EnemyDef { hp: number; speed: number; reward: number }

export const ENEMIES: Record<string, EnemyDef> = {
  zevaka: { hp: 20, speed: 1.0, reward: 6 },
  zanuda: { hp: 60, speed: 0.6, reward: 12 },
  sprinter: { hp: 12, speed: 1.7, reward: 8 },
  director: { hp: 400, speed: 0.5, reward: 200 },
};

export interface TurretDef { cost: number; dmg: number; rate: number; range: number }

export const TURRETS: Record<string, TurretDef> = {
  flood: { cost: 30, dmg: 9, rate: 2.5, range: 3.0 },
  cobalt: { cost: 70, dmg: 30, rate: 1.4, range: 3.6 },
  scarlet: { cost: 150, dmg: 60, rate: 0.9, range: 4.0 },
};

export interface CardDef { name: string; desc: string }

/* Пассивка «Арсенал 42»: +15% урона всем турелям при 5 медалях. */
export const ARSENAL_DMG_MUL = 0.15;
export const CARDS: Record<string, CardDef> = {
  rate: { name: 'Двойной прожектор', desc: 'скорострельность +30%' },
  dmg: { name: 'Кобальтовый кулак', desc: 'урон +40%' },
  pierce: { name: 'Алый коридор', desc: 'лазер бьёт насквозь' },
  repair: { name: 'Ремонт штаба', desc: '+3 жизни' },
  pugs: { name: 'Мопс-подкрепление', desc: 'кусает ближайшего, 5 волн' },
  sale: { name: 'Скидка прапора', desc: 'турели −25%' },
};
