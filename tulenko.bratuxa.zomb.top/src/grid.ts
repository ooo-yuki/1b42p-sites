// Слой 2 (верх): поле клетками. Значки карты — клетки, стены держат.
export const WALL = '#';
export const TILE = 16;
export const FLOOR = '#9aa0a6';

export interface Grid {
  w: number;
  h: number;
  cells: string[][];
}

export interface RoomMap {
  [k: string]: string;
}

export const ROOM: RoomMap = {
  B: '#c96a2b',
  T: '#d9b23a',
  J: '#8a8f98',
  S: '#3a7bd5',
  R: '#6b7280',
};

export function loadGrid(map: string[]) {
  const h = map.length;
  let w = 0;
  for (const row of map) w = Math.max(w, row.length);
  const cells: string[][] = [];
  for (let y = 0; y < h; y++) {
    const row: string[] = [];
    for (let x = 0; x < w; x++) row.push(map[y][x] || WALL);
    cells.push(row);
  }
  return { w, h, cells };
}

export function wallAt(g: Grid, x: number, y: number): boolean {
  if (x < 0 || y < 0 || x >= g.w || y >= g.h) return true;
  return g.cells[y][x] === WALL;
}

export function roomColor(ch: string): string {
  return ROOM[ch] || FLOOR;
}
