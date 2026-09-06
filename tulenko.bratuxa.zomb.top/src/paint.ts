// Слой 2 (верх): вид сверху, начало — пол, стены, тьма.
import { TILE, roomColor, wallAt } from './grid.js';
import type { Grid } from './grid.js';

export interface Ctx {
  fillStyle: string;
  fillRect(x: number, y: number, w: number, h: number): void;
}

export const DARK = '#000000';
export const WALL_FACE = '#ffffff';

export function paintFloor(ctx: Ctx, G: Grid) {
  ctx.fillStyle = DARK;
  ctx.fillRect(-TILE, -TILE, (G.w + 2) * TILE, (G.h + 2) * TILE);
  for (let y = 0; y < G.h; y++) {
    for (let x = 0; x < G.w; x++) {
      const px = x * TILE;
      const py = y * TILE;
      if (wallAt(G, x, y)) {
        ctx.fillStyle = DARK;
        ctx.fillRect(px, py, TILE, TILE);
        ctx.fillStyle = WALL_FACE;
        ctx.fillRect(px + 1, py + 1, TILE - 2, TILE - 2);
      } else {
        ctx.fillStyle = roomColor(G.cells[y][x]);
        ctx.fillRect(px, py, TILE, TILE);
      }
    }
  }
}
