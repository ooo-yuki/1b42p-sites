// Финал забега: разбитая бутылка. Самый дорогой предмет, только когда всё куплено
// И только на последнем уровне запоя (Делирий).
import type { ZapoiState } from './types';
import { LAST_LVL } from './levels';
import { TREE } from './tree';
import { ARTS } from './artifacts';
import { SYNS } from '../synergies';

export const BOTTLE_COST = 50000;

// Финал забега: всё куплено (древо MAX + базовые артефакты без именных + все синергии)?
// Именные (с req: кружка/библия/бан/ручка) НЕ нужны — они открываются закрытием персов,
// требовать их для первой бутылки = вечный замок. Мы уже победили 🏆
export const BASE_ARTS = ARTS.filter((a) => !a.req);
export function isAllBought(z: ZapoiState): boolean {
  const treeDone = TREE.every((b) => (z.up[b.id] || 0) >= b.max);
  const artsDone = BASE_ARTS.every((a) => z.arts[a.id]);
  const synsDone = SYNS.every((s) => z.syn && z.syn[s.id]);
  return treeDone && artsDone && synsDone;
}

// Разбитая бутылка: самый дорогой предмет. Только когда всё куплено
// и только на последнем уровне запоя.
// Возвращает false если нельзя, иначе списывает и возвращает true.
export function buyBottle(z: ZapoiState): boolean {
  if ((z.lvl ?? 0) < LAST_LVL) return false;
  if (!isAllBought(z) || z.m < BOTTLE_COST) return false;
  z.m -= BOTTLE_COST;
  return true;
}
