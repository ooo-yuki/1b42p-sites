// Общие типы запоя 42. Механика не менялась — только типы.
export type CharId = 'vladimir' | 'ghost' | 'winline' | 'demon';

export interface ZapoiState {
  m: number;
  hp: number;
  maxhp: number;
  click: number;
  auto: number;
  mult: number;
  regen: number;
  toxic: number;
  heals: number;
  up: Record<string, number>;
  arts: Record<string, number>;
  syn: Record<string, number>;
  char: CharId | null;
  sips: number;
  soul: number;
  demonForm: number;
  completed: Record<string, number>;
  deals: number;
  /** Потеря бухла при последнем похмелье (чтобы UI не пересчитывал формулой). */
  _hangoverLost?: number;
  /** Винлайн: последний артефакт оказался пустышкой. */
  _lastArtBlank?: boolean;
}

export interface Character {
  id: CharId;
  name: string;
  emoji: string;
  img: string;
  drink: string;
  drinkForm?: string;
  desc: string;
  stats: string[];
  hint: string;
}

export interface UpgradeDef {
  br: string;
  id: string;
  name: string;
  desc: string;
  max: number;
  base: number;
  g: number;
  fx: (z: ZapoiState) => void;
}

export interface ArtDef {
  id: string;
  name: string;
  desc: string;
  cost: number;
  q: 1 | 2 | 3 | 4;
  /** Закрытый персонаж, открывающий артефакт в магазине (именные, качество 4). */
  req?: CharId;
  fx: (z: ZapoiState) => void;
}

export interface SynDef {
  id: string;
  name: string;
  need: string[];
  desc: string;
  fx: (z: ZapoiState) => void;
}

export interface HealDef {
  name: string;
  img: string;
  chars: CharId[];
}

export type ZapoiEvent = 'hangover' | 'shattered' | 'demonform' | 'demonend' | null;

export interface BetResult {
  win: boolean;
  stake: number;
}

export interface HealResult {
  v: number;
  c: number;
  extended?: boolean;
  deal?: boolean;
  cleansed?: boolean;
}
