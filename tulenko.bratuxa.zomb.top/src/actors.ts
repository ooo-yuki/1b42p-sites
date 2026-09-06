import { CFG } from './config.js';
import { wallAt } from './grid.js';

export interface Seal {
  x: number;
  y: number;
  dir: 1 | -1;
  noise: number;
}

export interface Guard {
  x: number;
  y: number;
  dir: 1 | -1;
}

export interface StepInput {
  dx: number;
  dy: number;
}

export interface Grid {
  w: number;
  h: number;
  cells: string[][];
}

export function newSeal(x: number, y: number): Seal {
  return { x: x, y: y, dir: 1, noise: 0 };
}

export function stepSeal(s: Seal, input: StepInput, grid?: Grid, night?: boolean): void {
  const dx = input.dx || 0;
  const dy = input.dy || 0;
  if (dx === 0 && dy === 0) {
    s.noise = 0;
    return;
  }
  if (dx > 0) s.dir = 1;
  if (dx < 0) s.dir = -1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const dist = CFG.walk * CFG.step;
  const nx = s.x + (dx / len) * dist;
  const ny = s.y + (dy / len) * dist;
  if (grid === undefined || grid === null) {
    s.x = nx;
    s.y = ny;
  } else {
    if (!wallAt(grid, Math.floor(nx), Math.floor(s.y))) s.x = nx;
    if (!wallAt(grid, Math.floor(s.x), Math.floor(ny))) s.y = ny;
  }
  if (night === true) s.noise = 2;
  else s.noise = 1;
}

export function newGuard(x: number, y: number, dir: 1 | -1): Guard {
  return { x: x, y: y, dir: dir };
}

export function stepGuard(g: Guard, grid: Grid): void {
  const nx = g.x + g.dir * CFG.guardSpeed * CFG.step;
  if (wallAt(grid, Math.floor(nx), Math.floor(g.y))) {
    if (g.dir > 0) g.dir = -1;
    else g.dir = 1;
    return;
  }
  g.x = nx;
}
