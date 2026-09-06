/* Реестр мини-игр Саши ⁴²: витрина без поиска и матчмейкинга.
   Новая игра = одна запись здесь (движок живёт где угодно: offline —
   своя страница, online — арена/сокет). Тестовых, кроме кликера, не завозим. */

export type MiniMode = 'offline' | 'online';

export type MiniGame = {
  id: string;
  title: string;
  desc: string;
  href: string;
  mode: MiniMode;
  /** Тестовая запись: видна с бейджем «тест», в статистику не идёт. */
  test: boolean;
};

const GAMES: MiniGame[] = [
  {
    id: 'clicker',
    title: 'Кликер 42',
    desc: 'Тапай, копи счёт до 1764 — и смотри ракету ZOV с сальтухой.',
    href: 'game.html',
    mode: 'offline',
    test: true,
  },
  {
    id: 'podval',
    title: 'Нейросеть в подвале',
    desc: 'Айдл-стратегия: размечай датасеты, скупай б/у сервера и вырасти LLM с v0.1 до v4.2.',
    href: 'podval.html',
    mode: 'offline',
    test: false,
  },
  {
    id: 'dvd',
    title: 'DVD-заставка 42',
    desc: 'Летит, отскакивает, попадает в угол. Залипай и жди идеального угла.',
    href: 'dvd.html',
    mode: 'offline',
    test: false,
  },
  {
    id: 'terminal',
    title: 'Терминал 42',
    desc: 'Чёрная консоль связиста: scan, inject, decrypt — вскрой узлы и распутай заговор БРОТОВОД-Х.',
    href: 'terminal.html',
    mode: 'offline',
    test: false,
  },
  {
    id: 'defense',
    title: 'Оборона штаба 42',
    desc: 'Тауэр-дефенс: ставь прожекторы, держи 10 волн скуки и бери карты-баффы. Штаб не сдаём.',
    href: 'defense.html',
    mode: 'offline',
    test: false,
  },
];

/** Все записи витрины по порядку завоза. */
export function listGames(): MiniGame[] {
  return [...GAMES];
}

/** Запись по id; неизвестных нет — undefined, а не заглушка. */
export function getGame(id: string): MiniGame | undefined {
  return GAMES.find(g => g.id === id);
}
