/* Контент Фабрики 1:1 с legacy: те же площадки, цены, описания. */

export type Venue = {
  id: string; n: string; em: string;
  speed: number; zone: number; base: number; gap: number;
  cost: number; need: string; minSeason?: number;
};

export const WIN_GOAL = 420000;

export const VENUES: Venue[] = [
  { id: 'garage', n: 'Гараж в Кемерово', em: '🏚️', speed: 45, zone: 26, base: 10, gap: 1.15, cost: 0, need: '' },
  { id: 'club', n: 'Клуб «Фрик»', em: '🎪', speed: 60, zone: 20, base: 25, gap: 0.9, cost: 500, need: '' },
  { id: 'arena', n: 'Арена фриков', em: '🏟️', speed: 78, zone: 15, base: 60, gap: 0.7, cost: 5000, need: 'jacket' },
  { id: 'slay', n: 'Главная сцена SLAY', em: '🏆', speed: 95, zone: 10, base: 150, gap: 0.55, cost: 50000, need: 'mantle+sneakers' },
  { id: 'stadium', n: 'Стадион 42', em: '🏟️', speed: 110, zone: 8, base: 400, gap: 0.45, cost: 150000, need: '', minSeason: 1 },
  { id: 'kuzbass', n: 'Кузбасс-Арена', em: '👑', speed: 130, zone: 6, base: 1000, gap: 0.35, cost: 1000000, need: '', minSeason: 3 },
];

export type ShopItem = { n: string; em: string; d: string; base: number; needSeasons?: number };

export const TEAM: Record<string, ShopItem> = {
  denis: { n: 'Денис Биткоин', em: '🎤', d: 'Замедляет бегунок: −12% скорости за уровень', base: 50 },
  freak: { n: 'Фрик из ФрикЛенда', em: '🤪', d: 'Множитель Хайпа за точные попадания: +25% за уровень', base: 200 },
  oper: { n: 'Оператор СП', em: '🎧', d: 'Хейтеры приходят реже: +60% к интервалу за уровень', base: 800 },
  guard: { n: 'Охрана Батальона', em: '💪', d: 'Сама снимает мелких хейтеров через пару секунд', base: 2000 },
  piar: { n: 'Пиарщик СП', em: '📣', d: 'Промах режет комбо вдвое, а не в ноль', base: 5000, needSeasons: 2 },
};

export const LOOKS: Record<string, ShopItem> = {
  jacket: { n: 'Зеркальный пиджак', em: '🧥', d: 'Шире золотая зона: +3% за уровень. Открывает Арену фриков', base: 300 },
  mantle: { n: 'Мантия', em: '🧙', d: 'Шанс двойного Хайпа: 10/20/35%', base: 1200 },
  sneakers: { n: 'Кроссовки', em: '👟', d: 'Длиннее комбо: кап 10/15/22/30', base: 1200 },
  hair: { n: 'Причёска', em: '💇', d: 'Бонус к криту: +0/25/50/100%', base: 800 },
  chains: { n: 'Золотые цепи', em: '⛓️', d: '+1 фантик за каждый PERFECT', base: 8000, needSeasons: 4 },
};

export const BUILDS: Record<string, ShopItem> = {
  arena: { n: 'Арена фриков', em: '🏟️', d: 'Базовый Хайп: +25% за уровень', base: 300 },
  banka: { n: 'Банка 3D', em: '🫙', d: 'Фантики капают быстрее: +50% за уровень', base: 500 },
  garden: { n: 'Сад вихрей', em: '🌪️', d: 'Комбо злее: +0.02 к шагу за уровень', base: 500 },
  club: { n: 'Фан-клуб 42', em: '💙', d: '+25% хайпа со всех шоу', base: 20000, needSeasons: 5 },
};

export const RAID_NAMES: Record<string, string> = {
  garage: 'Хейтер-админ', club: 'Кринж-критик', arena: 'Бот-ферма', slay: 'Экс-продюсер',
  stadium: 'Диванный эксперт', kuzbass: 'Легенда ретро-чартов',
};
