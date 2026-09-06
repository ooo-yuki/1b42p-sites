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
];

/** Все записи витрины по порядку завоза. */
export function listGames(): MiniGame[] {
  return [...GAMES];
}

/** Запись по id; неизвестных нет — undefined, а не заглушка. */
export function getGame(id: string): MiniGame | undefined {
  return GAMES.find(g => g.id === id);
}
