// Task 8: загрузка картинок и таблицы кадров.
// Держим стираемый синтаксис, как в src/levels.ts, чтобы тесты могли
// запускать файл без сборки (снять аннотации и export в CJS).

declare const document: any;
declare const Image: any;

export interface Pic {
  src: string;
  broken: boolean;
  img: unknown;
}

export const FRAMES = {
  idle: ['img/seal_idle_0.png', 'img/seal_idle_1.png'],
  waddle: [
    'img/seal_waddle_0.png',
    'img/seal_waddle_1.png',
    'img/seal_waddle_2.png',
    'img/seal_waddle_3.png',
  ],
  guard: ['img/guard_0.png', 'img/guard_1.png'],
};

export const TILES = {
  floor: 'img/tile_floor.png',
  wall: 'img/tile_wall.png',
  bars: 'img/tile_bars.png',
  exit: 'img/tile_exit.png',
  fish: 'img/tile_fish.png',
  key: 'img/tile_key.png',
};

export function allSources() {
  const out = [];
  const lists = [FRAMES.idle, FRAMES.waddle, FRAMES.guard];
  for (const l of lists) {
    for (const s of l) {
      if (out.indexOf(s) < 0) {
        out.push(s);
      }
    }
  }
  const keys = Object.keys(TILES);
  for (const k of keys) {
    const s = TILES[k];
    if (out.indexOf(s) < 0) {
      out.push(s);
    }
  }
  return out;
}

// Рисованный квадрат-заглушка: битая картинка не роняет игру.
export function placeholder(src) {
  let img = null;
  try {
    if (typeof document !== 'undefined' && document && document.createElement) {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#f0f';
        ctx.fillRect(0, 0, 32, 32);
      }
      img = canvas;
    }
  } catch (e) {
    img = null;
  }
  return { src: src, broken: true, img: img };
}

function browserLoadOne(src) {
  return new Promise(function (resolve) {
    try {
      if (typeof Image !== 'function') {
        resolve(placeholder(src));
        return;
      }
      const im = new Image();
      im.onload = function () {
        resolve({ src: src, broken: false, img: im });
      };
      im.onerror = function () {
        resolve(placeholder(src));
      };
      im.src = src;
    } catch (e) {
      resolve(placeholder(src));
    }
  });
}

// Ждёт все картинки; битая заменяется квадратом, промис не падает.
export function loadSprites(loadOne) {
  const load = loadOne || browserLoadOne;
  const sources = allSources();
  const jobs = sources.map(function (s) {
    try {
      return load(s).then(
        function (p) {
          return p;
        },
        function (e) {
          return placeholder(s);
        },
      );
    } catch (e) {
      return Promise.resolve(placeholder(s));
    }
  });
  return Promise.all(jobs).then(function (pics) {
    const out = {};
    for (const p of pics) {
      out[p.src] = p;
    }
    return out;
  });
}
