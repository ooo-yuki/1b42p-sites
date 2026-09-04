import DiceTable from './dice';

/* Реестр вьюх игр. Новая игра = новая вьюха + одна строка здесь.
   Неизвестная игра — честная заглушка, а не пустой экран. */

export const GAME_VIEWS = {
  dice: DiceTable,
} as const;

export type GameId = keyof typeof GAME_VIEWS;

export function gameView(game: string): typeof DiceTable | null {
  return (GAME_VIEWS as Record<string, typeof DiceTable>)[game] ?? null;
}
