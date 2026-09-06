import { PATH, WAVES, ENEMIES } from './content';
import type { Cell, WaveDef, EnemyDef } from './content';

export { PATH, WAVES, ENEMIES };
export type { Cell, WaveDef, EnemyDef };

// Минимальные интерфейсы (решение контроллера): полные типы — в Task 2.
export interface Unit { hp: number; maxHp: number; pathIndex: number; speed: number }
export interface Turret { x: number; y: number; cooldown: number }

export interface GameState { wave: number; lives: number; coins: number; units: Unit[]; turrets: Turret[]; buffs: string[]; over: boolean; stars: number; dmgMul?: number; rateMul?: number; pierce?: boolean; pugs?: number; saleMul?: number }

export function createGame(): GameState {
  return { wave: 0, lives: 10, coins: 120, units: [], turrets: [], buffs: [], over: false, stars: 0 };
}
