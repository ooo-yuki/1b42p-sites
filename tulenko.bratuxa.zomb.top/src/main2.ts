// Слой 2 (верх): склейка. Вид сверху, день, нить, работа, кара.
// Берёт grid, actors, vision, clock, work, things, talk, search, paint, audio, endings.
// Бок (main, logic) сюда не входит.
import { CFG } from './config.js';
import { loadGrid, wallAt, TILE, ROOM, roomColor } from './grid.js';
import { newSeal, stepSeal, newGuard, stepGuard } from './actors.js';
import { sees, heatUp, toSolitary, catchSeal } from './vision.js';
import { newDay, tick, hourCase, applyMuster, applyWork, isNight } from './clock.js';
import { workAt, isBench } from './work.js';
import { pick, craft, has, deal } from './things.js';
import { talkFor, say, FACE } from './talk.js';
import { search, leaveSolitary } from './search.js';
import { blip } from './audio.js';
import { tryRoof, tryGate } from './endings.js';
// Фактура клеток 16х16: пол, стена, мебель поверх пола. Цвета комнат держим
// подкрасом поверх с прозрачностью.

// Корпус значками из замысла: D дверь, J станок, B кровать,
// T стол, S душ, R крыша. P наши, E ворота. Остальное пол.
const MAP: string[] = [
  '##############################',
  '#BBB...D....TTT....JJJ...SSS#',
  '#BBB........TTT....JJJ...SSS#',
  '#BBB...D....TTT....JJJ...SSS#',
  '#..........................#',
  '#.....######D######....D...#',
  '#.....#BBB..B..BBB#....#RRR#',
  '#.....#BBB..B..BBB#....#RRR#',
  '#.....######D######....#RRR#',
  '#..........................#',
  '#.TTT....D....JJJ....D...SSS#',
  '#.TTT........JJJ........SSS#',
  '#.TTT........JJJ........SSS#',
  '#..........................#',
  '#P........................E#',
  '##############################',
];

const G = loadGrid(MAP);
// Круг красоты 3: масштаб держит окно целиком — поле закрывает экран,
// края режутся картой, а не чернотой. Люди крупнеют сами через SCALE.
let SCALE = 2;
let camX = 0;
let camY = 0;
function updCam(W: number, H: number): void {
  const need = Math.max(W / (G.w * TILE), H / (G.h * TILE));
  SCALE = Math.max(2, Math.ceil(need));
  const mapW = G.w * TILE * SCALE;
  const mapH = G.h * TILE * SCALE;
  const cx = S.seal.x * TILE * SCALE - W / 2;
  const cy = S.seal.y * TILE * SCALE - H / 2;
  camX = Math.max(0, Math.min(Math.max(0, mapW - W), cx));
  camY = Math.max(0, Math.min(Math.max(0, mapH - H), cy));
}
function sx(x: number): number {
  return x * TILE * SCALE - camX;
}
function sy(y: number): number {
  return y * TILE * SCALE - camY;
}
// Огоньки-светильники на стенах: горят ночью тёплым мерцанием. Рисуем кодом.
const LAMPS = [
  { x: 8.5, y: 5.5 }, { x: 15.5, y: 5.5 },
  { x: 8.5, y: 8.5 }, { x: 15.5, y: 8.5 },
  { x: 5.5, y: 0.5 }, { x: 24.5, y: 0.5 },
  { x: 5.5, y: 15.5 }, { x: 24.5, y: 15.5 },
];

const SPAWN = { x: 1.5, y: 14.5 };
const SOL = { x: 27.5, y: 14.5 };
const MUSTER = { x0: 8, y0: 1, x1: 16, y1: 3 };
// Торговец ночью: стоит рядом с нашими, меняет монеты на вещи (ложка 2, верёвка 3, мыло 2).
const TRADER = { x: 3.5, y: 14.5 };
const TRADE_ORDER: string[] = ['ложка', 'верёвка', 'мыло'];

interface LootSpot {
  x: number;
  y: number;
  id: string;
}

const SPOTS: LootSpot[] = [
  { x: 2.5, y: 2.5, id: 'тряпка' },
  { x: 12.5, y: 2.5, id: 'ложка' },
  { x: 19.5, y: 2.5, id: 'верёвка' },
  { x: 25.5, y: 2.5, id: 'мыло' },
];

const bag: string[] = [];
const flags: Record<string, boolean> = {};
const D = newDay();
const S: any = D;
S.wanted = 0;
S.solitary = false;
S.seal = { x: SPAWN.x, y: SPAWN.y };
S.spawn = { x: SPAWN.x, y: SPAWN.y };
S.cell = { x: SPAWN.x, y: SPAWN.y };
S.bag = bag;
S.items = bag;
S.coins = 0;
S.flags = flags;

const seal = newSeal(SPAWN.x, SPAWN.y);
const guards = [
  newGuard(6.5, 4.5, 1),
  newGuard(22.5, 9.5, -1),
];
const seen: any[] = [];
for (const gd of guards) {
  (gd as any).map = MAP;
  seen.push(gd);
}

let mode = 'play';
let winEnd = '';
let face: string = 'right';
let tired = 0;
let lastMuster = '';
let lastWork = '';
let lastLine = '';
let sndOn = true;

function snd(kind: 'step' | 'pickup' | 'hit' | 'win' | 'lose'): void {
  if (!sndOn) return;
  try {
    blip(kind);
  } catch (e) { /* без звука идём дальше */ }
}

function syncHeat(): void {
  const h = Math.max(S.heat || 0, S.wanted || 0);
  S.heat = h;
  S.wanted = h;
}

function cellAt(x: number, y: number): string {
  const cx = Math.floor(x);
  const cy = Math.floor(y);
  if (cy < 0 || cy >= G.h || cx < 0 || cx >= G.w) return '#';
  return G.cells[cy][cx];
}

function inMuster(): boolean {
  const x = S.seal.x;
  const y = S.seal.y;
  return x >= MUSTER.x0 && x <= MUSTER.x1 && y >= MUSTER.y0 && y <= MUSTER.y1;
}

// Один шаг мира. Тем же шагом гонит окно и крючок для проверки.
export function simStep(dt: number, input?: { dx: number; dy: number }): void {
  if (mode !== 'play') return;
  if (!(dt > 0)) dt = CFG.step;
  if (dt > 1) dt = 1;
  tick(S, dt);
  syncHeat();
  const nowHour = Math.floor(S.t / 3600);
  const hc = hourCase(S);

  if (input && (input.dx !== 0 || input.dy !== 0)) {
    if (input.dy < 0) face = 'up';
    else if (input.dy > 0) face = 'down';
    else if (input.dx > 0) face = 'right';
    else face = 'left';
  }
  if (S.solitary) {
    S.seal.x = SOL.x;
    S.seal.y = SOL.y;
  } else if (input) {
    seal.x = S.seal.x;
    seal.y = S.seal.y;
    stepSeal(seal, input, G, isNight(S));
    S.seal.x = seal.x;
    S.seal.y = seal.y;
  }

  const frames = Math.max(1, Math.min(64, Math.round(dt / CFG.step)));
  for (let i = 0; i < frames; i++) {
    for (const gd of seen) stepGuard(gd, G);
  }
  for (const gd of seen) {
    if (sees(gd, S.seal.x, S.seal.y, gd.dir)) {
      catchSeal(S);
      syncHeat();
      S.seal.x = seal.x = S.cell.x;
      S.seal.y = seal.y = S.cell.y;
      snd('hit');
      break;
    }
  }

  if (hc === 'поверка') {
    const id = S.day + (nowHour < 12 ? 'am' : 'pm');
    if (id !== lastMuster) {
      lastMuster = id;
      if (!S.solitary && !inMuster()) {
        applyMuster(S, false);
        syncHeat();
        snd('hit');
      }
    }
  }

  if (hc === 'работа' && !S.solitary) {
    const id = S.day + 'h' + nowHour;
    if (id !== lastWork && isBench(cellAt(S.seal.x, S.seal.y))) {
      lastWork = id;
      const pay = workAt({ atBench: true, hour: nowHour });
      if (pay > 0) {
        S.coins += pay;
        tired += 1;
        applyWork(S, true);
        snd('pickup');
      }
    }
  }

  if (S.solitary && hc === 'подъём') {
    leaveSolitary(S);
    S.cell = { x: SPAWN.x, y: SPAWN.y };
    S.seal.x = seal.x = SPAWN.x;
    S.seal.y = seal.y = SPAWN.y;
    syncHeat();
    S.heat = 0;
    S.wanted = 0;
  }

  if (has(S, 'спуск')) flags.descent = true;
  if (has(S, 'кляп')) flags.gag = true;

  const under = cellAt(S.seal.x, S.seal.y);
  const night = isNight(S);
  S.night = night;
  // Концовки слоя 3 через endings.ts: крыша ночью со спуском, ворота днём с кляпом.
  const roof = tryRoof({ atRoof: under === 'R', night: night, bag: bag });
  if (roof === 'win') {
    mode = 'win';
    winEnd = 'roof';
    snd('win');
  } else {
    if (roof === 'warn' && under === 'R') lastLine = 'Ночью без спуска не уйти — нужен спуск.';
    const gate = tryGate({ atGate: under === 'E', day: !night, bag: bag, heat: S.wanted || 0 });
    if (gate === 'win') {
      mode = 'win';
      winEnd = 'gate';
      snd('win');
    }
  }
}

// E: выслушать нить. R: подобрать рядом. C: собрать кляп и спуск.
// T: торг ночью рядом с торговцем — монеты в вещь.
export function doTalk(): string {
  const lines = talkFor(S);
  if (lines.length === 0) return '';
  say(S, lines[0].id);
  lastLine = lines[0].text;
  return lastLine;
}

export function doPick(): string {
  for (let i = 0; i < SPOTS.length; i++) {
    const L = SPOTS[i];
    if (Math.abs(L.x - S.seal.x) < 1 && Math.abs(L.y - S.seal.y) < 1) {
      pick(S, L.id);
      SPOTS.splice(i, 1);
      snd('pickup');
      return L.id;
    }
  }
  return '';
}

export function doCraft(): string[] {
  const out: string[] = [];
  if (craft(S, 'кляп')) {
    flags.gag = true;
    out.push('кляп');
  }
  if (craft(S, 'спуск')) {
    flags.descent = true;
    out.push('спуск');
  }
  if (out.length > 0) snd('pickup');
  return out;
}

export function doSearch(): string[] {
  const found = search(S);
  if (found.length > 0) {
    syncHeat();
    S.cell = { x: SOL.x, y: SOL.y };
    snd('lose');
  }
  return found;
}

// Торг: ночью рядом с торговцем, монеты в вещь из things.ts.
// С именем — ровно её, без имени — первую по карману из ложки, верёвки, мыла.
export function doTrade(id?: string): string {
  S.night = isNight(S);
  if (Math.abs(TRADER.x - S.seal.x) > 1.5 || Math.abs(TRADER.y - S.seal.y) > 1.5) return '';
  const want: string[] = (typeof id === 'string' && id !== '') ? [id] : TRADE_ORDER;
  for (const w of want) {
    if (deal(S, w)) {
      snd('pickup');
      return w;
    }
  }
  return '';
}

function fmtTime(): string {
  const h = Math.floor(S.t / 3600);
  const m = Math.floor((S.t - h * 3600) / 60);
  return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
}

// --- Окно: холст, ввод, кадры. В проверке узла холста нет — тихо стоим.
const ROOT: any = typeof window !== 'undefined' ? window : globalThis;
const doc: any = typeof document !== 'undefined' ? document : null;
const canvas: any = doc ? doc.getElementById('game') : null;
const g2d: any = canvas ? canvas.getContext('2d') : null;

// Экран во всю страницу: холст в размер окна, края обрезаются заливкой.
function fitScreen(): void {
  if (!canvas) return;
  try {
    const w = (ROOT as any).innerWidth || canvas.width || 960;
    const h = (ROOT as any).innerHeight || canvas.height || 540;
    if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
      canvas.width = w;
      canvas.height = h;
    }
  } catch (e) { /* стоим как были */ }
}
fitScreen();
if (ROOT && (ROOT as any).addEventListener) {
  (ROOT as any).addEventListener('resize', fitScreen);
}
const pics: Record<string, any> = {};

const TOP_SEAL: Record<string, string> = {
  up: 'img/top_seal_up.png',
  down: 'img/top_seal_down.png',
  left: 'img/top_seal_left.png',
  right: 'img/top_seal_right.png',
};
const TOP_GUARD = ['img/top_guard_0.png', 'img/top_guard_1.png'];
const TOP_FLOOR = 'img/top_floor.png';
const TOP_WALL = 'img/top_wall.png';
// Мебель поверх пола: D дверь, B койка, T стол, S душ, J станок, R крыша.
const TOP_FURN: Record<string, string> = {
  D: 'img/top_door.png',
  B: 'img/top_bed.png',
  T: 'img/top_table.png',
  S: 'img/top_shower.png',
  J: 'img/top_bench.png',
  R: 'img/top_roof.png',
};

function loadPics(): void {
  if (!doc || typeof Image === 'undefined') return;
  const all: string[] = [TOP_SEAL.up, TOP_SEAL.down, TOP_SEAL.left, TOP_SEAL.right,
    TOP_GUARD[0], TOP_GUARD[1], FACE,
    TOP_FLOOR, TOP_WALL,
    TOP_FURN.D, TOP_FURN.B, TOP_FURN.T, TOP_FURN.S, TOP_FURN.J, TOP_FURN.R];
  for (const src of all) {
    try {
      const im = new Image();
      im.src = src;
      pics[src] = { src: src, broken: false, img: im };
    } catch (e) { /* битая — квадратом */ }
  }
}

function drawImg(src: string, x: number, y: number, w: number, h: number, fallback: string): void {
  if (!g2d) return;
  const p = pics[src];
  if (p && !p.broken && p.img) {
    try {
      g2d.drawImage(p.img, x, y, w, h);
      return;
    } catch (e) { /* квадратом */ }
  }
  g2d.fillStyle = fallback;
  g2d.fillRect(x, y, w, h);
}

// Клетки фактурой: пол/стена картинками вместо заливки, мебель картинкой
// поверх пола, цвет комнаты подкрасом поверх с прозрачностью.
function paintCells(): void {
  if (!g2d) return;
  for (let y = 0; y < G.h; y++) {
    for (let x = 0; x < G.w; x++) {
      const ch = G.cells[y][x];
      const px0 = x * TILE;
      const py0 = y * TILE;
      if (ch === '#') {
        drawImg(TOP_WALL, px0, py0, TILE, TILE, '#ffffff');
        continue;
      }
      drawImg(TOP_FLOOR, px0, py0, TILE, TILE, roomColor(ch));
      const tint = ROOM[ch];
      if (tint) {
        try {
          g2d.globalAlpha = 0.35;
          g2d.fillStyle = tint;
          g2d.fillRect(px0, py0, TILE, TILE);
          g2d.globalAlpha = 1;
        } catch (e) { try { g2d.globalAlpha = 1; } catch (_e) { /* стоим */ } }
      }
      const over = TOP_FURN[ch];
      if (over) drawImg(over, px0, py0, TILE, TILE, tint || '#9aa0a6');
    }
  }
}

function render(now: number): void {
  if (!g2d || !canvas) return;
  const W = canvas.width;
  const H = canvas.height;
  updCam(W, H);
  const TS = TILE * SCALE;
  g2d.setTransform(1, 0, 0, 1, 0, 0);
  g2d.fillStyle = '#000';
  g2d.fillRect(0, 0, W, H);
  g2d.setTransform(SCALE, 0, 0, SCALE, -camX, -camY);
  paintCells();
  g2d.setTransform(1, 0, 0, 1, 0, 0);

  for (const L of SPOTS) {
    g2d.fillStyle = '#ffd23f';
    const ms = 6 * SCALE;
    g2d.fillRect(sx(L.x) - ms / 2, sy(L.y) - ms / 2, ms, ms);
  }

  // Торговец виден ночью: золотая метка рядом с нашими.
  if (isNight(S)) {
    g2d.fillStyle = '#7CFC00';
    const ms = 6 * SCALE;
    g2d.fillRect(sx(TRADER.x) - ms / 2, sy(TRADER.y) - ms / 2, ms, ms);
  }

  // Взгляд конусом по полу, честный.
  for (const gd of seen) {
    g2d.fillStyle = 'rgba(255,220,80,0.18)';
    const gx = sx(gd.x);
    const gy = sy(gd.y);
    const len = CFG.sight * TILE * SCALE;
    const hh = 7 * SCALE;
    if (gd.dir > 0) g2d.fillRect(gx, gy - hh, len, hh * 2);
    else g2d.fillRect(gx - len, gy - hh, len, hh * 2);
  }

  // Тени-овалы под ногами.
  g2d.fillStyle = 'rgba(0,0,0,0.35)';
  g2d.beginPath();
  g2d.ellipse(sx(S.seal.x), sy(S.seal.y) + 6 * SCALE, 7 * SCALE, 2.5 * SCALE, 0, 0, Math.PI * 2);
  g2d.fill();
  for (const gd of seen) {
    g2d.beginPath();
    g2d.ellipse(sx(gd.x), sy(gd.y) + 6 * SCALE, 7 * SCALE, 2.5 * SCALE, 0, 0, Math.PI * 2);
    g2d.fill();
  }

  drawImg(TOP_SEAL[face], sx(S.seal.x) - TS / 2, sy(S.seal.y) - TS / 2, TS, TS, '#dfe3e6');
  const frame = Math.floor(now / 300) % 2;
  for (const gd of seen) {
    drawImg(TOP_GUARD[frame], sx(gd.x) - TS / 2, sy(gd.y) - TS / 2, TS, TS, '#3a5bd5');
  }

  if (isNight(S)) {
    g2d.fillStyle = 'rgba(0,0,32,0.45)';
    g2d.fillRect(0, 0, W, H);
  }
  if (S.solitary) {
    g2d.fillStyle = 'rgba(0,0,0,0.55)';
    g2d.fillRect(0, 0, W, H);
    g2d.fillStyle = '#fff';
    g2d.font = '28px sans-serif';
    g2d.textAlign = 'center';
    g2d.fillText('карцер до утра', W / 2, H / 2);
  }

  // Круг красоты 3: день светлее, тёплое пятно вокруг тюленьки сильнее и шире,
  // ночью на стенах горят огоньки-светильники с тёплым мерцанием (рисуем кодом).
  {
    const lightNight = isNight(S);
    const seX = sx(S.seal.x);
    const seY = sy(S.seal.y);
    if (lightNight) {
      for (let i = 0; i < LAMPS.length; i++) {
        const LP = LAMPS[i];
        const lx = sx(LP.x);
        const ly = sy(LP.y);
        const fl = 0.85 + 0.15 * Math.sin(now / 140 + i * 1.9) + 0.05 * Math.sin(now / 47 + i * 3.1);
        const lr2 = 30 * SCALE * fl;
        const lamp = g2d.createRadialGradient(lx, ly, 2, lx, ly, lr2);
        lamp.addColorStop(0, 'rgba(255,196,120,' + (0.34 * fl).toFixed(3) + ')');
        lamp.addColorStop(1, 'rgba(255,180,100,0)');
        g2d.fillStyle = lamp;
        g2d.fillRect(lx - lr2, ly - lr2, lr2 * 2, lr2 * 2);
      }
      for (let i = 0; i < LAMPS.length; i++) {
        const LP = LAMPS[i];
        const lx = sx(LP.x);
        const ly = sy(LP.y);
        const dot = Math.max(3, 2 * SCALE);
        g2d.fillStyle = '#3a2a18';
        g2d.fillRect(lx - dot / 2 - 1, ly - dot / 2 - 1, dot + 2, dot + 2);
        g2d.fillStyle = '#ffca7a';
        g2d.fillRect(lx - dot / 2, ly - dot / 2, dot, dot);
      }
    }
    const lr = 230;
    const glow = g2d.createRadialGradient(seX, seY, 10, seX, seY, lr);
    glow.addColorStop(0, lightNight ? 'rgba(255,214,140,0.34)' : 'rgba(255,224,160,0.22)');
    glow.addColorStop(1, 'rgba(255,210,130,0)');
    g2d.fillStyle = glow;
    g2d.fillRect(seX - lr, seY - lr, lr * 2, lr * 2);
    const vg = g2d.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, lightNight ? 'rgba(0,0,20,0.42)' : 'rgba(0,0,20,0.10)');
    g2d.fillStyle = vg;
    g2d.fillRect(0, 0, W, H);
  }

  // Вверху слева монеты и розыск. Внизу полоса: время, день, дело часа.
  g2d.fillStyle = '#fff';
  g2d.font = '18px sans-serif';
  g2d.textAlign = 'left';
  let heat = '';
  for (let i = 0; i < 3; i++) heat += i < S.wanted ? '★' : '☆';
  g2d.fillText('◉ ' + S.coins + '   ' + heat, 12, 24);
  g2d.textAlign = 'center';
  const hc = hourCase(S);
  g2d.fillText(fmtTime() + '  день ' + S.day + '  ' + hc, W / 2, H - 34);
  const lines = talkFor(S);
  const show = lastLine || (lines.length > 0 ? lines[0].text : '');
  if (show) {
    drawImg(FACE, W / 2 - 220, H - 96, 64, 64, '#cfe8ff');
    g2d.textAlign = 'left';
    g2d.font = '16px sans-serif';
    g2d.fillText(show.slice(0, 48), W / 2 - 148, H - 58);
  }
  if (mode === 'win') {
    g2d.fillStyle = '#fff';
    g2d.font = '30px sans-serif';
    g2d.textAlign = 'center';
    g2d.fillText(winEnd === 'roof' ? 'тихий уход через крышу' : 'громкий уход через ворота', W / 2, H / 2 - 40);
  }
}

const keys: Record<string, boolean> = {};
if (doc && doc.addEventListener) {
  doc.addEventListener('keydown', (e: any) => {
    keys[e.key] = true;
    if (e.key === 'e' || e.key === 'E' || e.key === 'у' || e.key === 'У') doTalk();
    if (e.key === 'r' || e.key === 'R' || e.key === 'к' || e.key === 'К') doPick();
    if (e.key === 'c' || e.key === 'C' || e.key === 'с' || e.key === 'С') doCraft();
    if (e.key === 't' || e.key === 'T' || e.key === 'е' || e.key === 'Е') doTrade();
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].indexOf(e.key) >= 0 && e.preventDefault) e.preventDefault();
  });
  doc.addEventListener('keyup', (e: any) => {
    keys[e.key] = false;
  });
}

function readInput(): { dx: number; dy: number } {
  let dx = 0;
  let dy = 0;
  if (keys.ArrowLeft || keys.a || keys.A || keys.ф || keys.Ф) dx -= 1;
  if (keys.ArrowRight || keys.d || keys.D || keys.в || keys.В) dx += 1;
  if (keys.ArrowUp || keys.w || keys.W || keys.ц || keys.Ц) dy -= 1;
  if (keys.ArrowDown || keys.s || keys.S || keys.ы || keys.Ы) dy += 1;
  return { dx: dx, dy: dy };
}

let prevT = 0;
function frame(now: number): void {
  if (!g2d) return;
  if (!prevT) prevT = now;
  let dt = (now - prevT) / 1000;
  prevT = now;
  if (dt > 0.1) dt = 0.1;
  simStep(dt, readInput());
  render(now);
  if (typeof requestAnimationFrame !== 'undefined') requestAnimationFrame(frame as any);
}

if (canvas && g2d) {
  loadPics();
  if (typeof requestAnimationFrame !== 'undefined') requestAnimationFrame(frame as any);
}

// Крючок для внешней проверки: день целиком прогоном, нить, карцер.
ROOT.__hook = {
  S: S,
  G: G,
  MAP: MAP,
  simStep: simStep,
  doTalk: doTalk,
  doPick: doPick,
  doCraft: doCraft,
  doSearch: doSearch,
  doTrade: doTrade,
  TRADER: TRADER,
  deal: deal,
  tryRoof: tryRoof,
  tryGate: tryGate,
  newDay: newDay,
  tick: tick,
  hourCase: hourCase,
  applyMuster: applyMuster,
  applyWork: applyWork,
  isNight: isNight,
  loadGrid: loadGrid,
  wallAt: wallAt,
  newSeal: newSeal,
  stepSeal: stepSeal,
  sees: sees,
  heatUp: heatUp,
  toSolitary: toSolitary,
  catchSeal: catchSeal,
  workAt: workAt,
  isBench: isBench,
  pick: pick,
  craft: craft,
  has: has,
  talkFor: talkFor,
  say: say,
  search: search,
  leaveSolitary: leaveSolitary,
  FACE: FACE,
  get mode() { return mode; },
  get winEnd() { return winEnd; },
};
