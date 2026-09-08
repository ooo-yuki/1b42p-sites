import type { JSX } from 'react';

/* Пиксель-арт обороны штаба 42: свои текстуры, без чужого АП.
   Формат как в casino-icons.tsx: сетка символов, буква = цвет, '.' — прозрачно.
   Палитра — DESIGN.md (кобальт/алый/ночь) + кожа/ткань для юнитов. */

export type Pix = { grid: string[]; colors: Record<string, string> };

const K = '#3d3d3d'; // общий контур
const SKIN = '#e8b98a';
const DARK = '#1a1a2e';

function PixSvg({ art, className }: { art: Pix; className?: string }): JSX.Element {
  const h = art.grid.length;
  const w = Math.max(...art.grid.map((r) => r.length));
  const rects: JSX.Element[] = [];
  art.grid.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === '.' || ch === ' ') continue;
      const fill = art.colors[ch];
      if (!fill) continue;
      rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={fill} />);
    }
  });
  return (
    <svg className={className ?? 'dtx'} viewBox={`-0.5 -0.5 ${w + 1} ${h + 1}`}
      shapeRendering="crispEdges" aria-hidden focusable="false">
      {rects}
    </svg>
  );
}

/** Компонент для меню/витрины: <DefenseTex art="cobalt" /> */
export function DefenseTex({ art, className }: { art: keyof typeof TEX; className?: string }): JSX.Element {
  return <PixSvg art={TEX[art]} className={className} />;
}

/** SVG-строка для canvas: new Image + src=pixToDataUri(TEX.cobalt). */
export function pixToDataUri(art: Pix): string {
  const h = art.grid.length;
  const w = Math.max(...art.grid.map((r) => r.length));
  let s = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 -0.5 ${w + 1} ${h + 1}" shape-rendering="crispEdges">`;
  art.grid.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === '.' || ch === ' ') continue;
      const fill = art.colors[ch];
      if (!fill) continue;
      s += `<rect x="${x}" y="${y}" width="1.02" height="1.02" fill="${fill}"/>`;
    }
  });
  return `data:image/svg+xml;utf8,${encodeURIComponent(`${s}</svg>`)}`;
}

/* ---------- Турели ---------- */

const flood: Pix = {
  grid: [
    '....kkkk....',
    '...kWWWWk...',
    '...kWYYWk...',
    '...kWWWWk...',
    '....kkkk....',
    '.....kk.....',
    '.....kk.....',
    '.....kk.....',
    '.....kk.....',
    '...kkkkkk...',
    '...kDDDDk...',
    '...kkkkkk...',
  ],
  colors: { k: K, W: '#f0f0f0', Y: '#ffe9a3', D: '#004578' },
};

const cobalt: Pix = {
  grid: [
    '........kk..',
    '.......kBBk.',
    '......kBBk..',
    '.....kBBk...',
    '....kBBBk...',
    '...kBBBBBk..',
    '....kBBBk...',
    '.....kkk....',
    '...kkkkkk...',
    '..kBBBBBBk..',
    '..kBDDDDDk..',
    '..kkkkkkkk..',
  ],
  colors: { k: K, B: '#0060AA', D: '#004578' },
};

const scarlet: Pix = {
  grid: [
    '.....kk.....',
    '....kRRk....',
    '....kRWRk...',
    '....kRWRk...',
    '....kRRRk...',
    '....kRRRk...',
    '....kRRRk...',
    '.....kRk....',
    '.....kRk....',
    '...kkRRkk...',
    '...kDDDDk...',
    '...kkkkkk...',
  ],
  colors: { k: K, R: '#E31E25', W: '#f0f0f0', D: '#8F1218' },
};

/* Тесла-прожектор: корпус кобальта другим оттенком + дуга-разряд. */
const tesla: Pix = {
  grid: [
    '........kk..',
    '.......kBBk.',
    '......kWBk..',
    '.....kBBWk..',
    '....kBBBk...',
    '...kBBBBBk..',
    '....kBBBk...',
    '.....kkk....',
    '...kkkkkk...',
    '..kBBBBBBk..',
    '..kBDDDDDk..',
    '..kkkkkkkk..',
  ],
  colors: { k: K, B: '#2e8fff', D: '#0060AA', W: '#ffe9a3' },
};

/* ---------- Враги: скучные взрослые ---------- */

const zevaka: Pix = {
  grid: [
    '....kkkk....',
    '...kFFFFk...',
    '...kFEFEk...',
    '...kFFFFk...',
    '....kFFk....',
    '...kkkkkk...',
    '..kWBBWWk...',
    '..kWBWBWk...',
    '..kWWWWk....',
    '..kDDDDk....',
    '..kDk.kDk...',
    '..kk...kk...',
  ],
  colors: { k: K, F: SKIN, E: DARK, W: '#f0f0f0', B: '#0060AA', D: '#2e2e4a' },
};

const zanuda: Pix = {
  grid: [
    '....kkkk....',
    '...kFFFFk...',
    '...kFEFEk...',
    '...kFFFFk...',
    '....kFFk....',
    '..kkkkkkkk..',
    '.kDDDDDDDDk.',
    '.kDDDDDDDDk.',
    '.kDDWDDWDDk.',
    '.kDDDDDDDDk.',
    '.kDDDDDDDDk.',
    '..kkk..kkk..',
  ],
  colors: { k: K, F: SKIN, E: DARK, W: '#f0f0f0', D: '#3a3a5c' },
};

const sprinter: Pix = {
  grid: [
    '...kkkkkk...',
    '...kRRRRk...',
    '...kRRRRRk..',
    '...kFFFFk...',
    '....kFFk....',
    '....kkkk....',
    '...kWWWWk...',
    '...kWWWWk...',
    '...kDkkDk...',
    '...kDk.Dk...',
    '...kk...kk..',
  ],
  colors: { k: K, R: '#E31E25', F: SKIN, W: '#808080', D: DARK },
};

const director: Pix = {
  grid: [
    '....kkkkkk..',
    '...kFFFFFFk.',
    '...kFEFFEFk.',
    '...kFFFFFFk.',
    '...kFAAAFk..',
    '....kFFFFk..',
    '..kkWWWWWWkk',
    '.kWWBWWWBWWk',
    '.kWWBWWWBWWk',
    '.kWWWBWBWWk.',
    '.kDDDDDDDDk.',
    '.kDDDDDDDDk.',
    '.kDDk..kDDk.',
    '..kk....kk..',
  ],
  colors: { k: K, F: SKIN, E: DARK, A: '#8F1218', W: '#f0f0f0', B: '#E31E25', D: '#1a1a2e' },
};

/* Тролль: грузный зануда в болотном; двойник: бледный спринтер. */
const troll: Pix = {
  grid: [
    '...kkkkkk...',
    '..kFFFFFFk..',
    '..kFEFFEFk..',
    '..kFFFFFFk..',
    '...kFFFFk...',
    '.kkkkkkkkkk.',
    '.kGGGGGGGGk.',
    '.kGGWGGWGGk.',
    '.kGGGGGGGGk.',
    '.kGGGGGGGGk.',
    '.kGGGGGGGGk.',
    '..kkk..kkk..',
  ],
  colors: { k: K, F: SKIN, E: DARK, W: '#f0f0f0', G: '#4a5c3a' },
};

const double: Pix = {
  grid: [
    '...kkkkkk...',
    '...kWWWWk...',
    '...kWWWWWk..',
    '...kWFFWk...',
    '....kFFk....',
    '....kkkk....',
    '...kWWWWk...',
    '...kWWWWk...',
    '...kDkkDk...',
    '...kDk.Dk...',
    '...kk...kk..',
  ],
  colors: { k: K, W: '#ffe9a3', F: SKIN, D: DARK },
};

/* ---------- Свои: штаб и мопс ---------- */

const pug: Pix = {
  grid: [
    '..kk....kk..',
    '..kF....Fk..',
    '..kFFFFMFk..',
    '...kFMMFk...',
    '...kFMMFk...',
    '....kFFk....',
    '..kkFFFFkk..',
    '.kFFFFFFFFk.',
    '.kFkFFFFkFk.',
    '.kkk....kkk.',
  ],
  colors: { k: K, F: '#c9a06a', M: '#5e3a17' },
};

const hq: Pix = {
  grid: [
    '......kk......',
    '......kk......',
    '..kkkkkkkkkk..',
    '..kRRRRRRRRk..',
    '.kRRRRRRRRRRk.',
    '.kWWBWWWWBWWk.',
    '.kWWBWWWWBWWk.',
    '.kWWWWWWWWWWk.',
    '.kWWWWDDWWWWk.',
    '.kWWWWDDWWWWk.',
    '.kWWWWDDWWWWk.',
    '..kkkkkkkkkk..',
  ],
  colors: { k: K, R: '#E31E25', W: '#808080', B: '#9fd0ff', D: '#f0f0f0' },
};

const sale: Pix = {
  grid: [
    '....kkkk....',
    '..kkBBBBkk..',
    '.kBBBBBBBBk.',
    '.kBBBWWBBBk.',
    '.kBBBWWBBBk.',
    '.kBBBBBBBBk.',
    '..kkBBBBkk..',
    '....kkkk....',
  ],
  colors: { k: K, B: '#0060AA', W: '#f0f0f0' },
};

export const TEX = { flood, cobalt, scarlet, tesla, zevaka, zanuda, sprinter, director, troll, double, pug, hq, sale } as const;
export type TexName = keyof typeof TEX;
