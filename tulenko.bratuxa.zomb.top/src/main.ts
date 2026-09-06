import { CFG } from './config.js';
import { LEVELS } from './levels.js';
import { newRun, step, putSeal, giveAll, killAll } from './logic.js';
import { FRAMES, TILES, loadSprites } from './sprites.js';
import { blip } from './audio.js';
import { loadBest, saveBest } from './save.js';

const W = 960;
const H = 540;
const TILE = 60;
const OY = 30;

const canvas = document.getElementById('game') as HTMLCanvasElement;
const g = canvas.getContext('2d') as CanvasRenderingContext2D;

export function fitCanvas(cv: HTMLCanvasElement): number {
  const s = Math.min(window.innerWidth / 960, window.innerHeight / 540);
  cv.style.width = Math.floor(960 * s) + 'px';
  cv.style.height = Math.floor(540 * s) + 'px';
  return s;
}

const input = { left: false, right: false, jump: false, shove: false };
let mode: string = 'start';
let S: any = newRun(0);
let pics: Record<string, any> = {};
let runTime = 0;
let animT = 0;
let facing = 1;
let prevKey = false;
let prevFish = false;
let prevLevel = 0;
let best: number | null = loadBest();
let newRecord = false;
let stepSnd = 0;

function wx(x: number): number {
  return x * TILE;
}

function wy(y: number, mapH: number): number {
  return OY + (mapH - y) * TILE;
}

function fmt(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec - m * 60;
  return m + ':' + (s < 10 ? '0' : '') + s.toFixed(1);
}

// Картинка или цветной квадрат, если битая/ещё грузится.
function drawImg(src: string, x: number, y: number, w: number, h: number, fallback: string, flip: boolean): void {
  const p = pics[src];
  g.save();
  if (flip) {
    g.translate(x + w / 2, 0);
    g.scale(-1, 1);
    g.translate(-(x + w / 2), 0);
  }
  if (p && !p.broken && p.img) {
    try {
      g.drawImage(p.img, x, y, w, h);
    } catch (e) {
      g.fillStyle = fallback;
      g.fillRect(x, y, w, h);
    }
  } else {
    g.fillStyle = fallback;
    g.fillRect(x, y, w, h);
  }
  g.restore();
}

function startGame(): void {
  S = newRun(0);
  runTime = 0;
  prevKey = false;
  prevFish = false;
  prevLevel = 0;
  facing = 1;
  newRecord = false;
  stepSnd = 0;
  input.left = false;
  input.right = false;
  input.jump = false;
  input.shove = false;
  mode = 'play';
  blip('pickup');
}

function doStep(): void {
  step(S, input);
  runTime += CFG.step;
  if (input.right && !input.left) facing = 1;
  else if (input.left && !input.right) facing = -1;
  if ((input.left || input.right) && S.seal.onGround) {
    stepSnd += CFG.step;
    if (stepSnd > 0.28) {
      stepSnd = 0;
      blip('step');
    }
  }
  if ((S.hasKey && !prevKey) || (S.hasFish && !prevFish)) blip('pickup');
  prevKey = S.hasKey;
  prevFish = S.hasFish;
  if (S.caught) blip('hit');
  if (S.level !== prevLevel) {
    prevLevel = S.level;
    blip('pickup');
  }
  if (S.won) {
    mode = 'win';
    newRecord = saveBest(runTime);
    best = loadBest();
    blip('win');
  } else if (S.dead) {
    mode = 'lose';
    blip('lose');
  }
}

function overlay(title: string, lines: string[]): void {
  g.fillStyle = 'rgba(0,0,0,0.65)';
  g.fillRect(0, 0, W, H);
  g.fillStyle = '#fff';
  g.textAlign = 'center';
  g.font = 'bold 44px sans-serif';
  g.fillText(title, W / 2, 200);
  g.font = '22px sans-serif';
  for (let i = 0; i < lines.length; i++) {
    g.fillText(lines[i], W / 2, 260 + i * 34);
  }
}

function render(): void {
  const map = LEVELS[S.level];
  const mapH = map.length;
  g.fillStyle = '#0e2233';
  g.fillRect(0, 0, W, H);
  for (let r = 0; r < mapH; r++) {
    for (let c = 0; c < map[r].length; c++) {
      const ch = map[r][c];
      if (ch === '#') drawImg(TILES.wall, c * TILE, r * TILE + OY, TILE, TILE, '#5b6b7a', false);
      else if (ch === '=' || ch === '-') drawImg(TILES.floor, c * TILE, r * TILE + OY, TILE, TILE, '#7a5c3e', false);
    }
  }
  if (S.exit) {
    const b = wy(S.exit.y - 0.5, mapH);
    drawImg(TILES.exit, wx(S.exit.x) - 25, b - 50, 50, 50, '#3fae5a', false);
  }
  if (S.key && !S.key.taken) {
    const b = wy(S.key.y - 0.5, mapH);
    drawImg(TILES.key, wx(S.key.x) - 20, b - 40, 40, 40, '#ffd34d', false);
  }
  if (S.fish && !S.fish.taken) {
    const b = wy(S.fish.y - 0.5, mapH);
    drawImg(TILES.fish, wx(S.fish.x) - 20, b - 40, 40, 40, '#7fd4ff', false);
  }
  for (const gd of S.guards) {
    const src = FRAMES.guard[Math.floor(animT * 6) % FRAMES.guard.length];
    const b = wy(gd.y, mapH);
    if (gd.stun > 0) g.globalAlpha = 0.5;
    drawImg(src, wx(gd.x) - 21, b - 54, 42, 54, '#c0392b', gd.dir < 0);
    g.globalAlpha = 1;
  }
  const moving = input.left || input.right;
  const frames = moving && S.seal.onGround ? FRAMES.waddle : FRAMES.idle;
  const rate = moving && S.seal.onGround ? 8 : 2;
  const sealSrc = frames[Math.floor(animT * rate) % frames.length];
  const sb = wy(S.seal.y, mapH);
  drawImg(sealSrc, wx(S.seal.x) - 21, sb - 57, 42, 57, '#eeeeee', facing < 0);

  let hs = '';
  for (let i = 0; i < CFG.hearts; i++) hs += i < S.hearts ? '♥' : '♡';
  g.fillStyle = '#ff5b5b';
  g.font = '24px sans-serif';
  g.textAlign = 'left';
  g.fillText(hs, 12, 30);
  g.fillStyle = '#fff';
  g.fillText(fmt(runTime), 12, 58);
  g.textAlign = 'right';
  g.fillText('ур. ' + (S.level + 1) + '/' + LEVELS.length, W - 12, 30);
  if (best !== null) g.fillText('лучшее ' + fmt(best), W - 12, 58);

  if (mode === 'start') {
    const lines = ['Собери ключ и рыбу, дойди до выхода.', 'Стрелки — идти, пробел — прыжок, X — толкнуть.'];
    if (best !== null) lines.push('Лучшее время: ' + fmt(best));
    lines.push('Нажми или коснись, чтобы играть.');
    overlay('Побег тюленьки', lines);
  } else if (mode === 'win') {
    const lines = ['Время: ' + fmt(runTime)];
    lines.push(newRecord ? 'Новый рекорд!' : best !== null ? 'Лучшее: ' + fmt(best) : '');
    lines.push('Нажми или коснись, чтобы играть заново.');
    overlay('Победа!', lines);
  } else if (mode === 'lose') {
    overlay('Поймали!', ['Сердца кончились.', 'Нажми или коснись, чтобы попробовать заново.']);
  }
}

// Цикл по стенным часам фиксированным шагом.
let acc = 0;
let last = performance.now();
let lastFrame = last;

function frame(now: number): void {
  const dt = (now - last) / 1000;
  last = now;
  lastFrame = now;
  animT += dt;
  if (mode === 'play') {
    acc += dt;
    const max = CFG.step * 5;
    if (acc > max) acc = max;
    while (acc >= CFG.step) {
      acc -= CFG.step;
      doStep();
      if (mode !== 'play') {
        acc = 0;
        break;
      }
    }
  } else {
    acc = 0;
  }
  render();
  requestAnimationFrame(frame);
}

// Сторож для вкладок без кадров: тот же шаг.
setInterval(function () {
  const now = performance.now();
  if (now - lastFrame > 250) {
    last = now;
    lastFrame = now;
    if (mode === 'play') doStep();
    render();
  }
}, 100);

function press(code: string, down: boolean): void {
  if (code === 'ArrowLeft' || code === 'KeyA') input.left = down;
  else if (code === 'ArrowRight' || code === 'KeyD') input.right = down;
  else if (code === 'ArrowUp' || code === 'Space' || code === 'KeyW') input.jump = down;
  else if (code === 'KeyX' || code === 'ShiftLeft' || code === 'ShiftRight') input.shove = down;
}

document.addEventListener('keydown', function (e: KeyboardEvent) {
  if (e.code === 'ArrowLeft' || e.code === 'ArrowRight' || e.code === 'ArrowUp' || e.code === 'Space') e.preventDefault();
  if (e.repeat) return;
  if (e.code === 'KeyR' || e.code === 'Enter') {
    startGame();
    return;
  }
  if (e.code === 'Space' && mode !== 'play') {
    startGame();
    return;
  }
  press(e.code, true);
});

document.addEventListener('keyup', function (e: KeyboardEvent) {
  press(e.code, false);
});

function bindBtn(id: string, key: string): void {
  const el = document.getElementById(id) as HTMLButtonElement;
  const on = function (e: Event) {
    e.preventDefault();
    if (mode !== 'play') startGame();
    press(key, true);
  };
  const off = function (e: Event) {
    e.preventDefault();
    press(key, false);
  };
  el.addEventListener('pointerdown', on);
  el.addEventListener('pointerup', off);
  el.addEventListener('pointerleave', off);
  el.addEventListener('pointercancel', off);
}

bindBtn('btn-left', 'ArrowLeft');
bindBtn('btn-right', 'ArrowRight');
bindBtn('btn-jump', 'Space');
bindBtn('btn-shove', 'KeyX');

canvas.addEventListener('pointerdown', function () {
  if (mode !== 'play') startGame();
});
canvas.addEventListener('contextmenu', function (e: Event) {
  e.preventDefault();
});

loadSprites(undefined as any).then(function (m: Record<string, any>) {
  pics = m;
});

requestAnimationFrame(frame);

window.addEventListener('resize', () => fitCanvas(canvas));
fitCanvas(canvas);

// Крючок для внешней проверки: те же правила плюс текущее состояние.
(window as any).__hook = {
  newRun: newRun,
  step: step,
  putSeal: putSeal,
  giveAll: giveAll,
  killAll: killAll,
  get state() { return S; },
  get mode() { return mode; },
  get hearts() { return S.hearts; },
  get won() { return S.won; },
  get dead() { return S.dead; },
};
