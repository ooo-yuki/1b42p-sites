import { CFG } from './config.js';

export interface SealPt {
  x: number;
  y: number;
}

export interface Guard {
  x: number;
  y: number;
  dir: number;
  map: string[];
}

export interface RunState {
  wanted: number;
  solitary: boolean;
  seal: SealPt;
  cell: SealPt;
  spawn: SealPt;
  items: string[];
}

const WALL = '#=-';

function cellWall(map: string[], c: number, r: number): boolean {
  if (r < 0 || r >= map.length) return true;
  const row = map[r];
  if (c < 0 || c >= row.length) return true;
  return WALL.indexOf(row[c]) >= 0;
}

function losBlocked(map: string[], x0: number, y0: number, x1: number, y1: number): boolean {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const n = Math.max(2, Math.ceil(dist / 0.25));
  for (let i = 1; i < n; i++) {
    const px = x0 + (dx * i) / n;
    const py = y0 + (dy * i) / n;
    if (cellWall(map, Math.floor(px), Math.floor(py))) return true;
  }
  return false;
}

// Конус стражи вперёд на дальность из баланса, стены закрывают.
export function sees(g: Guard, x: number, y: number, dir: number): boolean {
  if (g === null || g === undefined) return false;
  if (typeof g.x !== 'number' || typeof x !== 'number') return false;
  if (typeof y !== 'number' || typeof dir !== 'number') return false;
  const dx = x - g.x;
  const dy = y - g.y;
  if (Math.abs(dx) > CFG.sight) return false;
  if (Math.abs(dy) > 0.9) return false;
  if (dx !== 0 && Math.sign(dx) !== dir && Math.abs(dx) > 0.5) return false;
  if (g.map && losBlocked(g.map, g.x, g.y, x, y)) return false;
  return true;
}

// Розыск плюс один; три розыска — карцер до утра.
export function heatUp(S: RunState): void {
  if (S === null || S === undefined) return;
  if (typeof S.wanted !== 'number') S.wanted = 0;
  S.wanted = Math.min(3, S.wanted + 1);
  if (S.wanted >= 3) toSolitary(S);
}

// Карцер до утра: розыск три, возврат в камеру, вещи отобраны.
export function toSolitary(S: RunState): void {
  if (S === null || S === undefined) return;
  S.wanted = 3;
  S.solitary = true;
  const home = S.cell ? S.cell : S.spawn;
  if (S.seal && home) {
    S.seal.x = home.x;
    S.seal.y = home.y;
  }
  if (S.items) S.items.length = 0;
}

// Поимка взглядом: розыск плюс один и возврат в камеру.
export function catchSeal(S: RunState): void {
  if (S === null || S === undefined) return;
  heatUp(S);
  if (!S.solitary) {
    const home = S.cell ? S.cell : S.spawn;
    if (S.seal && home) {
      S.seal.x = home.x;
      S.seal.y = home.y;
    }
  }
}
