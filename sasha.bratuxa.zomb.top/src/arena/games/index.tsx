import DiceTable from './dice';
import DurakTable from './durak';
import ChessBoard from './chess';
import type { DCard, RoomView } from '../proto';

/* Реестр вьюх игр. Новая игра = новая вьюха + одна строка в GAME_VIEWS.
   Неизвестная игра — честная заглушка, а не пустой экран. */

export type GameMove = { kind: string; card?: DCard; target?: DCard; from?: number; to?: number; promote?: string };

export type GameViewProps = {
  me: string;
  room: RoomView;
  hand: DCard[];
  amHost: boolean;
  myRolled: boolean;
  secsLeft: number | null;
  maxPlayers: number;
  onRoll: () => void;
  onMove: (m: GameMove) => void;
  onStart: () => void;
  onRematch: () => void;
};

export const GAME_VIEWS = {
  dice: DiceTable,
  durak: DurakTable,
  chess: ChessBoard,
} as const;

export function gameView(game: string): ((p: GameViewProps) => JSX.Element) | null {
  return (GAME_VIEWS as Record<string, (p: GameViewProps) => JSX.Element>)[game] ?? null;
}
