// Слой 2 (верх): склейка. Вид сверху, день, нить, работа, кара.
// Берёт grid, maps, levels, doors, strong, actors, vision, clock,
// work, things, quests, talk, search, paint, audio, endings.
// Бок (main, logic) сюда не входит.
// Склейка game.js режет import/export и клеит разделы подряд.
// Имена WORLD_* даёт раздел levels (без export — иначе грубая
// склейка проб levels.test.js ломается), шесть карт — разделы maps.
import { CFG } from './config.js';
import { loadGrid, wallAt, TILE, ROOM, roomColor } from './grid.js';
// @ts-ignore: WORLD_* даёт склейка из levels.ts без export.
import { WORLD_IDS, WORLD_NAMES, WORLD_MAPS, worldMap } from './levels.js';
import { DOORS, pass } from './doors.js';
import { pump, need } from './strong.js';
import { newSeal, stepSeal, newGuard, stepGuard, newCook, stepCook, newBoss, stepBoss, newWarden, stepWarden } from './actors.js';
import { sees, heatUp, toSolitary, catchSeal } from './vision.js';
import { newDay, tick, hourCase, applyMuster, applyWork, isNight } from './clock.js';
import { workAt, isBench } from './work.js';
import { pick, craft, has, deal, BRIBE } from './things.js';
import { QUESTS, done } from './quests.js';
import { talkFor, say, FACE } from './talk.js';
import { search, leaveSolitary } from './search.js';
import { blip } from './audio.js';
import { tryRoof, tryGate } from './endings.js';
// Фактура клеток 32х32: пол, стена, мебель картинками 32 в клетку TILE —
// drawImage сам ужмёт, деталей станет больше. Цвета комнат держим
// подкрасом поверх с прозрачностью.

// Мир из 6 корпусов: сетки держим все сразу, вживую — одна (G).
// Корпус грузится сменой G через goMap (двери зовут её сами).
const GRIDS = WORLD_MAPS.map((m: string[]) => loadGrid(m));
let mapId: string = 'cells';
let G: any = gridFor(mapId);
function gridFor(id: string): any {
  const i = WORLD_IDS.indexOf(id);
  return GRIDS[i < 0 ? 0 : i];
}
function rowsFor(id: string): string[] {
  return worldMap(id);
}
// Начало корпуса: клетка P серединой.
function spawnOf(id: string): { x: number; y: number } {
  const rows = rowsFor(id);
  for (let y = 0; y < rows.length; y++) {
    const x = rows[y].indexOf('P');
    if (x >= 0) return { x: x + 0.5, y: y + 0.5 };
  }
  return { x: 1.5, y: 1.5 };
}
// Пол корпуса списком: ходоки берут места отсюда, вдали от начала.
function floorSpots(id: string, n: number, farX: number, farY: number, minD: number): { x: number; y: number }[] {
  const gd = gridFor(id);
  const all: { x: number; y: number }[] = [];
  for (let y = 0; y < gd.h; y++) {
    for (let x = 0; x < gd.w; x++) {
      if (gd.cells[y][x] !== ' ') continue;
      const d = Math.abs(x + 0.5 - farX) + Math.abs(y + 0.5 - farY);
      if (d >= minD) all.push({ x: x + 0.5, y: y + 0.5 });
    }
  }
  const out: { x: number; y: number }[] = [];
  for (let i = 0; i < all.length && out.length < n; i++) {
    const k = Math.min(all.length - 1, Math.floor((i + 1) * all.length / (n + 1)));
    const p = all[k];
    if (out.indexOf(p) < 0) out.push(p);
  }
  return out;
}
// Грузить корпус: сетка, точки, люди. Путник встаёт на начало.
function goMap(id: string): void {
  mapId = id;
  G = gridFor(id);
  S.map = id;
  const sp = spawnOf(id);
  S.seal.x = seal.x = sp.x;
  S.seal.y = seal.y = sp.y;
  S.cell = { x: sp.x, y: sp.y };
  S.x = sp.x;
  S.y = sp.y;
  S.fade = 1;
  S.fadeT = 0.45;
  SOL = solOf(id);
  MUSTER = musterOf(id);
  TRADER = traderOf(id);
  seen = crews[id] || [];
  for (const gd of seen) (gd as any).map = rowsFor(id);
}
// Русское имя корпуса для окна.
function corpsName(): string {
  const i = WORLD_IDS.indexOf(S.map);
  return i >= 0 ? WORLD_NAMES[i] : S.map;
}
// Круг 9, рамка: карта всегда закрывает окно целиком — если поле зрения
// шире карты, растим SCALE пока бока не закроются картой, черноты ноль.
// Камера держит тюленьку.
// Люди рисуются вдвое крупнее клетки (картинки 32): центром по клетке,
// ноги на клетке. Клетки и мебель как были — drawImage ужмёт 32 в клетку.
let SCALE = 2;
let camX = 0;
let camY = 0;
function updCam(W: number, H: number): void {
  const need = Math.max(W / (G.w * TILE), H / (G.h * TILE));
  SCALE = Math.max(2, need);
  let coverW = G.w * TILE * SCALE;
  let coverH = G.h * TILE * SCALE;
  while (coverW < W || coverH < H) {
    SCALE += 0.25;
    coverW = G.w * TILE * SCALE;
    coverH = G.h * TILE * SCALE;
  }
  const mapW = G.w * TILE * SCALE;
  const mapH = G.h * TILE * SCALE;
  const cx = S.seal.x * TILE * SCALE - W / 2;
  const cy = S.seal.y * TILE * SCALE - H / 2;
  camX = Math.round(Math.max(0, Math.min(Math.max(0, mapW - W), cx)));
  camY = Math.round(Math.max(0, Math.min(Math.max(0, mapH - H), cy)));
}
function sx(x: number): number {
  return Math.round(x * TILE * SCALE - camX);
}
function sy(y: number): number {
  return Math.round(y * TILE * SCALE - camY);
}
// Огоньки-светильники на стенах: горят ночью тёплым мерцанием. Рисуем кодом.
const LAMPS = [
  { x: 8.5, y: 5.5 }, { x: 15.5, y: 5.5 },
  { x: 8.5, y: 8.5 }, { x: 15.5, y: 8.5 },
  { x: 5.5, y: 0.5 }, { x: 24.5, y: 0.5 },
  { x: 5.5, y: 15.5 }, { x: 24.5, y: 15.5 },
];

const SPAWN = spawnOf('cells');
// Карцер — дальний угол своего корпуса.
function solOf(id: string): { x: number; y: number } {
  const gd = gridFor(id);
  return { x: gd.w - 2.5, y: gd.h - 1.5 };
}
let SOL = solOf('cells');
// Поверка — середина верха своего корпуса.
function musterOf(id: string): { x0: number; y0: number; x1: number; y1: number } {
  const gd = gridFor(id);
  const cx = gd.w / 2;
  return { x0: Math.max(0, cx - 4), y0: 1, x1: Math.min(gd.w, cx + 4), y1: 3 };
}
let MUSTER = musterOf('cells');
// Торговец ночью: стоит рядом с началом своего корпуса,
// меняет монеты на вещи (ложка 2, верёвка 3, мыло 2).
function traderOf(id: string): { x: number; y: number } {
  const s = spawnOf(id);
  return { x: s.x + 2, y: s.y };
}
let TRADER = traderOf('cells');
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

interface PropSpot {
  x: number;
  y: number;
  kind: string;
}

// Вещи поверх пола и мебели: ящики у станков, подносы на столах
// столовой, плакаты в камерах. Проход не закрывают, правил не дают.
const PROPS: PropSpot[] = [
  { x: 17.5, y: 1.5, kind: 'crate' },
  { x: 17.5, y: 3.5, kind: 'crate' },
  { x: 11.5, y: 11.5, kind: 'crate' },
  { x: 16.5, y: 10.5, kind: 'crate' },
  { x: 12.5, y: 1.5, kind: 'food' },
  { x: 14.5, y: 1.5, kind: 'food' },
  { x: 13.5, y: 3.5, kind: 'food' },
  { x: 2.5, y: 10.5, kind: 'food' },
  { x: 2.5, y: 12.5, kind: 'food' },
  { x: 1.5, y: 1.5, kind: 'poster' },
  { x: 2.5, y: 3.5, kind: 'poster' },
  { x: 8.5, y: 6.5, kind: 'poster' },
  { x: 15.5, y: 7.5, kind: 'poster' },
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
S.opened = [];
// Мир: какой корпус вживую, затемнение перехода, сила, тетрадка.
S.map = 'cells';
S.x = SPAWN.x;
S.y = SPAWN.y;
S.fade = 0;
S.fadeT = 0;
S.lastMap = '';
S.power = 0;
S.pumpedDay = 0;
S.book = false;
S.dug = 0;
S.lastDugDay = 0;
S.deal = false;
S.bench = false;
S.pot = false;

const seal = newSeal(SPAWN.x, SPAWN.y);
// Стража по корпусам: двое на корпус, вдали от начала.
// Конус взгляда — только у стражи.
const crews: Record<string, any[]> = {};
for (const id of WORLD_IDS) {
  const sp = spawnOf(id);
  const spots = floorSpots(id, 2, sp.x, sp.y, 5);
  const arr: any[] = [];
  for (let i = 0; i < 2; i++) {
    const p = spots[i] || { x: sp.x + 5 + i * 3, y: sp.y };
    const g = newGuard(p.x, p.y, i === 0 ? 1 : -1);
    (g as any).map = rowsFor(id);
    arr.push(g);
  }
  crews[id] = arr;
}
let seen: any[] = crews['cells'];
// Сокамерники: 4 тихих ходока по камерам туда-сюда.
// Правил нет: конуса нет, тень есть, взгляд стражи их не ловит, шума нет.
const mates = (() => {
  const spots = floorSpots('cells', 4, SPAWN.x, SPAWN.y, 3);
  const out: any[] = [];
  for (let i = 0; i < 4; i++) {
    const p = spots[i] || { x: SPAWN.x + 2 + i, y: SPAWN.y };
    out.push(newGuard(p.x, p.y, i % 2 === 0 ? 1 : -1));
  }
  return out;
})();

interface Folk {
  a: any;
  map: string;
  who: string;
  name: string;
}
// Люди корпусов: повар на кухне, начальник у ворот, смотритель на работе.
// Ходят патрулём по полу, взгляда-конуса нет.
const folk: Folk[] = [
  { a: newCook(0, 0), map: 'kitchen', who: 'cook', name: 'Повар' },
  { a: newBoss(0, 0), map: 'gate', who: 'boss', name: 'Начальник' },
  { a: newWarden(0, 0), map: 'work', who: 'warden', name: 'Смотритель' },
];
for (const f of folk) {
  const fsp = spawnOf(f.map);
  const fspots = floorSpots(f.map, 3, fsp.x, fsp.y, 2);
  const fp = fspots[1] || { x: fsp.x + 1, y: fsp.y };
  f.a.x = fp.x;
  f.a.y = fp.y;
  if (typeof f.a.dir === 'undefined') f.a.dir = 1;
}

let mode = 'play';
let winEnd = '';
let face: string = 'right';
let tired = 0;
// Шаг ходьбы: тикает только пока тюленька идёт (шаги времени),
// стоит — кадр 0. Стража и сокамерники тикают кадром времени в окне.
let walkT = 0;
let sealMoving = false;
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
  sealMoving = !!(input && (input.dx !== 0 || input.dy !== 0)) && !S.solitary;
  if (sealMoving) walkT += dt;
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
    for (const md of mates) stepGuard(md, G);
  }
  // Люди корпусов ходят патрулём по полу своего корпуса.
  for (const f of folk) {
    const fg = gridFor(f.map);
    if (f.who === 'cook') stepCook(f.a, fg);
    else if (f.who === 'boss') stepBoss(f.a, fg);
    else stepWarden(f.a, fg);
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
    const sp = spawnOf(S.map);
    S.cell = { x: sp.x, y: sp.y };
    S.seal.x = seal.x = sp.x;
    S.seal.y = seal.y = sp.y;
    syncHeat();
    S.heat = 0;
    S.wanted = 0;
  }

  if (has(S, 'спуск')) flags.descent = true;
  if (has(S, 'кляп')) flags.gag = true;

  const under = cellAt(S.seal.x, S.seal.y);
  const night = isNight(S);
  S.night = night;
  // Верстак и котёл под ногами: ствол собирается у верстака (J, A),
  // отрава — у котла (O). Состав уходит в дело через doCraft.
  S.bench = under === 'J' || under === 'A';
  S.pot = under === 'O';
  // Качалка H во дворе качает силу: раз в день плюс один, потолок 5.
  if (under === 'H' && !S.solitary) pump(S);
  // Копки ложкой в камере ночью: каждая ночь с ложкой — плюс одна.
  if (night && S.map === 'cells' && has(S, 'ложка')) {
    if (S.lastDugDay !== S.day) {
      S.lastDugDay = S.day;
      S.dug = (S.dug || 0) + 1;
    }
  }
  // Договор с кухней: помощь повара открывает шаг poison для тетрадки.
  if (S.opened && S.opened.indexOf('poison') >= 0) S.deal = true;
  // Двери с затемнением: стоишь на D — проход pass() уводит
  // в соседний корпус (S.fade 0→1), затемнение гаснет само.
  // Куда из двух: мимо корпуса, откуда пришёл, — вперёд.
  if (under === 'D' && S.fade === 0 && !S.solitary) {
    const cands: number[] = [];
    for (let i = 0; i < DOORS.length; i++) {
      if (DOORS[i].from === S.map) cands.push(i);
    }
    if (cands.length > 0) {
      let door = cands[0];
      for (const ci of cands) {
        if (DOORS[ci].to !== S.lastMap) {
          door = ci;
          break;
        }
      }
      const from = S.map;
      if (pass(S, door)) {
        S.lastMap = from;
        goMap(S.map);
        snd('step');
      }
    }
  }
  if (S.fade === 1) {
    S.fadeT -= dt;
    if (S.fadeT <= 0) S.fade = 0;
  }
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
  // Пути слоя 3: ствол у верстака, отрава у котла.
  if (craft(S, 'ствол')) out.push('ствол');
  if (craft(S, 'отрава')) out.push('отрава');
  if (out.length > 0) snd('pickup');
  return out;
}

// Тетрадка: место для дел (куда смотрит done из quests.ts).
// Крыша — клетка R, начальник — КПП C, иначе свой корпус.
function questAt(): string {
  const under = cellAt(S.seal.x, S.seal.y);
  if (under === 'R') return 'roof';
  if (under === 'C') return 'boss';
  if (S.map === 'cells') return 'cell';
  return S.map;
}

function questState(): any {
  return {
    bag: bag,
    at: questAt(),
    night: isNight(S),
    power: S.power || 0,
    coins: S.coins || 0,
    heat: S.wanted || 0,
    dug: S.dug || 0,
    deal: S.deal === true,
  };
}

// N: тетрадка с делами — открыть/закрыть.
export function doBook(): boolean {
  S.book = !S.book;
  return S.book;
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
// Заводская чёткость: сглаживание холста выключено целиком, иначе окно
// гладит точки при растягивании и выходит мыло.
function crisp(): void {
  if (!g2d) return;
  try {
    g2d.imageSmoothingEnabled = false;
  } catch (e) { /* стоим как были */ }
}
crisp();

// Экран в размер показанного места: холст мерим по своему месту на
// странице, а не по окну целиком — иначе object-fit: contain даёт бока
// цветом фона элемента. Плюс фон холста чёрный, синевы ноль.
// Каждый кадр сверяем: место могло смениться без события resize.
function fitScreen(): void {
  if (!canvas) return;
  try {
    const box: any = canvas.parentElement;
    let w = canvas.clientWidth || (box && box.clientWidth) || (ROOT as any).innerWidth || canvas.width || 960;
    let h = canvas.clientHeight || (box && box.clientHeight) || (ROOT as any).innerHeight || canvas.height || 540;
    w = Math.floor(w);
    h = Math.floor(h);
    if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
      canvas.width = w;
      canvas.height = h;
      crisp();
    }
    if (canvas.style) canvas.style.background = '#000';
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
const TOP_GUARD = ['img/top_guard_0.png', 'img/top_guard_1.png', 'img/top_guard_2.png', 'img/top_guard_3.png'];
const TOP_FLOOR = 'img/top_floor.png';
const TOP_WALL = 'img/top_wall.png';
// Лицо стены: низкая полоса низа клетки поверх верха. Файла нет —
// стену держит один верх, лицо тихо пропускаем.
const TOP_WALL_FACE = 'img/top_wall_face.png';
// Мебель поверх пола: D дверь, B койка, T стол, S душ, J станок,
// R крыша, H качалка, O котёл, V фургон, A верстак, C КПП,
// Z забор, U лаз, E ворота.
const TOP_FURN: Record<string, string> = {
  D: 'img/top_door.png',
  B: 'img/top_bed.png',
  T: 'img/top_table.png',
  S: 'img/top_shower.png',
  J: 'img/top_bench.png',
  R: 'img/top_roof.png',
  H: 'img/top_h.png',
  O: 'img/top_o.png',
  V: 'img/top_v.png',
  A: 'img/top_a.png',
  C: 'img/top_c.png',
  Z: 'img/top_z.png',
  U: 'img/top_u.png',
  E: 'img/top_door.png',
};
// Люди корпусов: повар, начальник, смотритель — по два кадра шага.
const TOP_COOK = ['img/top_cook_0.png', 'img/top_cook_1.png'];
const TOP_BOSS = ['img/top_boss_0.png', 'img/top_boss_1.png'];
const TOP_WARDEN = ['img/top_warden_0.png', 'img/top_warden_1.png'];
function folkPics(who: string): string[] {
  if (who === 'cook') return TOP_COOK;
  if (who === 'boss') return TOP_BOSS;
  return TOP_WARDEN;
}
// Круг красоты 4: сокамерники в рыжих робах (четыре кадра шага),
// полы по комнатам и вещи поверх (ящики, подносы, плакаты).
// Недостающих кадров нет в деле — тихо держим кадр 0.
const TOP_MATE = ['img/top_mate_0.png', 'img/top_mate_1.png', 'img/top_mate_2.png', 'img/top_mate_3.png'];
const TOP_FLOOR_CELL = 'img/top_floor_cell.png';
const TOP_FLOOR_FOOD = 'img/top_floor_food.png';
const TOP_FLOOR_WASH = 'img/top_floor_wash.png';
const TOP_PROP: Record<string, string> = {
  crate: 'img/top_prop_crate.png',
  food: 'img/top_prop_food.png',
  poster: 'img/top_prop_poster.png',
};
// Круг 9, вещи не клоны: ящики и плакаты рядами по месту.
// Недостающих файлов нет — пропускаем тихо, держим базу.
const TOP_PROP_CRATE: string[] = ['img/top_prop_crate.png', 'img/top_prop_crate_1.png', 'img/top_prop_crate_2.png'];
const TOP_PROP_POSTER: string[] = ['img/top_prop_poster.png', 'img/top_prop_poster_1.png'];
function propSrc(kind: string, x: number, y: number): string {
  if (kind === 'crate' || kind === 'poster') {
    const row = kind === 'crate' ? TOP_PROP_CRATE : TOP_PROP_POSTER;
    const k = row.length;
    const n = (((Math.floor(x) + Math.floor(y) * 7) % k) + k) % k;
    const cand = row[n];
    if (hasPic(cand)) return cand;
    if (hasPic(row[0])) return row[0];
  }
  return TOP_PROP[kind] || TOP_PROP.crate;
}
// Пол по комнате: столовая ест свой, душ свой, камера свой, остальное старый.
function floorFor(ch: string): string {
  if (ch === 'T') return TOP_FLOOR_FOOD;
  if (ch === 'S') return TOP_FLOOR_WASH;
  if (ch === 'B') return TOP_FLOOR_CELL;
  return TOP_FLOOR;
}

// Картинка вживую есть: гружена и не бита. Нет — тихо кадр 0/один верх.
function hasPic(src: string): boolean {
  const p = pics[src];
  return !!(p && !p.broken && p.img);
}

// Тюленька: кадр по шагам времени, стоит — кадр 0.
// Второй кадр стороны top_seal_<dir>_1: файла нет — тихо держим сторону.
function sealSrc(dir: string, idx: number): string {
  const base = TOP_SEAL[dir] || TOP_SEAL.right;
  if (idx % 2 === 1) {
    const alt = 'img/top_seal_' + dir + '_1.png';
    if (hasPic(alt)) return alt;
  }
  return base;
}

// Стража и сокамерники: четыре кадра, недостающий — тихо кадр 0.
function frameSrc(list: string[], idx: number): string {
  const n = list.length;
  const cand = list[((idx % n) + n) % n];
  if (hasPic(cand)) return cand;
  return list[0];
}

function loadPics(): void {
  if (!doc || typeof Image === 'undefined') return;
  const all: string[] = [TOP_SEAL.up, TOP_SEAL.down, TOP_SEAL.left, TOP_SEAL.right,
    'img/top_seal_up_1.png', 'img/top_seal_down_1.png', 'img/top_seal_left_1.png', 'img/top_seal_right_1.png',
    TOP_GUARD[0], TOP_GUARD[1], TOP_GUARD[2], TOP_GUARD[3],
    TOP_MATE[0], TOP_MATE[1], TOP_MATE[2], TOP_MATE[3], FACE,
    TOP_COOK[0], TOP_COOK[1], TOP_BOSS[0], TOP_BOSS[1], TOP_WARDEN[0], TOP_WARDEN[1],
    TOP_FLOOR, TOP_FLOOR_CELL, TOP_FLOOR_FOOD, TOP_FLOOR_WASH, TOP_WALL, TOP_WALL_FACE,
    TOP_FURN.D, TOP_FURN.B, TOP_FURN.T, TOP_FURN.S, TOP_FURN.J, TOP_FURN.R,
    TOP_FURN.H, TOP_FURN.O, TOP_FURN.V, TOP_FURN.A, TOP_FURN.C, TOP_FURN.Z, TOP_FURN.U, TOP_FURN.E,
    TOP_PROP.crate, TOP_PROP.food, TOP_PROP.poster,
    TOP_PROP_CRATE[1], TOP_PROP_CRATE[2], TOP_PROP_POSTER[1]];
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
      crisp();
      g2d.drawImage(p.img, Math.round(x), Math.round(y), Math.round(w), Math.round(h));
      return;
    } catch (e) { /* квадратом */ }
  }
  g2d.fillStyle = fallback;
  g2d.fillRect(x, y, w, h);
}

// Мерка 2, поворот: идёт влево — кадр зеркально, вправо — прямо.
// Вверх/вниз ходят прямо, без зеркала. Нет картинки — тихо квадратом.
function drawImgFlip(src: string, x: number, y: number, w: number, h: number, fallback: string): void {
  if (!g2d) return;
  const p = pics[src];
  if (p && !p.broken && p.img) {
    try {
      crisp();
      g2d.save();
      g2d.translate(Math.round(x + w / 2), 0);
      g2d.scale(-1, 1);
      g2d.drawImage(p.img, Math.round(-w / 2), Math.round(y), Math.round(w), Math.round(h));
      g2d.restore();
      return;
    } catch (e) {
      try { g2d.restore(); } catch (_e) { /* квадратом */ }
    }
  }
  g2d.fillStyle = fallback;
  g2d.fillRect(x, y, w, h);
}

// Круг 10, имена: подпись и полоска над каждым человеком. Имя — мелко,
// чётко, на тёмной подложке; под ним полоска 2 точки с тёмной окантовкой.
// Тюленька «Тюленька» зелёная, стража «Страж» красная (мигает, когда видит),
// сокамерник «Свой» рыжая. Резкость и свет не трогаем — только подписи.
function drawTag(px: number, top: number, name: string, color: string, frac: number, w: number, barOn: boolean): void {
  if (!g2d) return;
  try {
    g2d.save();
    g2d.textAlign = 'center';
    g2d.font = '11px sans-serif';
    let tw = 40;
    try {
      tw = g2d.measureText(name).width;
    } catch (e) { tw = 40; }
    const bw = Math.max(tw + 8, w);
    const bx = Math.round(px - bw / 2);
    const by = Math.round(top - 21);
    g2d.fillStyle = 'rgba(0,0,0,0.65)';
    g2d.fillRect(bx, by, Math.round(bw), 13);
    g2d.fillStyle = '#fff';
    g2d.fillText(name, Math.round(px), Math.round(top - 11));
    if (barOn) {
      const f = Math.max(0, Math.min(1, frac));
      const rx = Math.round(px - w / 2);
      const ry = Math.round(top - 6);
      g2d.fillStyle = 'rgba(0,0,0,0.65)';
      g2d.fillRect(rx - 1, ry - 1, Math.round(w) + 2, 4);
      g2d.fillStyle = color;
      g2d.fillRect(rx, ry, Math.round(w * f), 2);
    }
    g2d.restore();
  } catch (e) { try { g2d.restore(); } catch (_e) { /* без имён идём дальше */ } }
}

// Клетки фактурой: пол/стена картинками вместо заливки, мебель картинкой
// поверх пола, цвет комнаты подкрасом поверх с прозрачностью.
// Стена с лицом: верх клетки top_wall.png, низ клетки полосой
// top_wall_face.png; файла лица нет — стоит один верх.
function paintCells(): void {
  if (!g2d) return;
  for (let y = 0; y < G.h; y++) {
    for (let x = 0; x < G.w; x++) {
      const ch = G.cells[y][x];
      const px0 = x * TILE;
      const py0 = y * TILE;
      if (ch === '#') {
        drawImg(TOP_WALL, px0, py0, TILE, TILE, '#ffffff');
        if (hasPic(TOP_WALL_FACE)) drawImg(TOP_WALL_FACE, px0, py0 + TILE / 2, TILE, TILE / 2, '#ffffff');
        continue;
      }
      drawImg(floorFor(ch), px0, py0, TILE, TILE, roomColor(ch));
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
  crisp();
  fitScreen();
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

  // Находки и вещи лежат в камерах (координаты — под камеры).
  if (S.map === 'cells') {
    for (const L of SPOTS) {
      g2d.fillStyle = '#ffd23f';
      const ms = 6 * SCALE;
      g2d.fillRect(sx(L.x) - ms / 2, sy(L.y) - ms / 2, ms, ms);
    }

    // Вещи: ящики и плакаты рядами по месту, подносы как были — картинками
    // поверх, проход держат полом. Недостающих файлов нет — тихо база.
    for (const P of PROPS) {
      const src = propSrc(P.kind, P.x, P.y);
      drawImg(src, sx(P.x) - TS / 2, sy(P.y) - TS / 2, TS, TS, '#c9a227');
    }
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

  // Тени-овалы под ногами (люди вдвое крупнее клетки — тень у ног на клетке).
  const feetY = TS / 2 - 2 * SCALE;
  g2d.fillStyle = 'rgba(0,0,0,0.35)';
  g2d.beginPath();
  g2d.ellipse(sx(S.seal.x), sy(S.seal.y) + feetY, 9 * SCALE, 3 * SCALE, 0, 0, Math.PI * 2);
  g2d.fill();
  for (const gd of seen) {
    g2d.beginPath();
    g2d.ellipse(sx(gd.x), sy(gd.y) + feetY, 9 * SCALE, 3 * SCALE, 0, 0, Math.PI * 2);
    g2d.fill();
  }
  // Сокамерникам тень положена, конуса нет. Ходят только по камерам.
  if (S.map === 'cells') {
    for (const md of mates) {
      g2d.beginPath();
      g2d.ellipse(sx(md.x), sy(md.y) + feetY, 9 * SCALE, 3 * SCALE, 0, 0, Math.PI * 2);
      g2d.fill();
    }
  }
  // Людям корпусов тень положена в своём корпусе.
  for (const f of folk) {
    if (f.map !== S.map) continue;
    g2d.beginPath();
    g2d.ellipse(sx(f.a.x), sy(f.a.y) + feetY, 9 * SCALE, 3 * SCALE, 0, 0, Math.PI * 2);
    g2d.fill();
  }

  // Люди вдвое крупнее клетки: центром по клетке, ноги на клетке.
  // Низ спрайта — на низ клетки (sy + TS/2), верх уходит на клетку выше.
  // Герой с тонкой тёмной обводкой — звенит даже в темноте.
  const PS = TS * 2;
  const py = (ey: number): number => sy(ey) + TS / 2 - PS;
  // Ходьба в четыре кадра: тюленька шагом времени (стоит — кадр 0),
  // стража и сокамерники кадром времени со сдвигом, стоят — кадр 0.
  // Недостающие файлы тихо держит кадр 0.
  const sealIdx = sealMoving ? Math.floor(walkT / 0.15) % 4 : 0;
  drawImg(sealSrc(face, sealIdx), sx(S.seal.x) - TS, py(S.seal.y), PS, PS, '#dfe3e6');
  try {
    g2d.save();
    g2d.strokeStyle = 'rgba(46,22,6,0.95)';
    g2d.lineWidth = 1.5;
    g2d.shadowColor = 'rgba(255,236,190,0.95)';
    g2d.shadowBlur = 8;
    g2d.strokeRect(sx(S.seal.x) - TS + 1, py(S.seal.y) + 1, PS - 2, PS - 2);
    g2d.restore();
  } catch (e) { try { g2d.restore(); } catch (_e) { /* без обводки идём дальше */ } }
  const step = Math.floor(now / 150);
  // Мерка 2, поворот: стража отзеркалена по стороне (влево зеркально,
  // вправо прямо). Тюленька сторону уже берёт кадром — не трогаем.
  for (let gi = 0; gi < seen.length; gi++) {
    const gd = seen[gi];
    const gsrc = frameSrc(TOP_GUARD, step + gi);
    if (gd.dir < 0) drawImgFlip(gsrc, sx(gd.x) - TS, py(gd.y), PS, PS, '#3a5bd5');
    else drawImg(gsrc, sx(gd.x) - TS, py(gd.y), PS, PS, '#3a5bd5');
  }
  // Сокамерники идут четырьмя кадрами, взгляд их не ловит.
  // Вбок — отзеркалены по стороне, вверх/вниз — прямо.
  // Ходят только по камерам.
  if (S.map === 'cells') {
    for (let mi = 0; mi < mates.length; mi++) {
      const md = mates[mi];
      const msrc = frameSrc(TOP_MATE, step + mi);
      if (md.dir < 0) drawImgFlip(msrc, sx(md.x) - TS, py(md.y), PS, PS, '#b34a12');
      else drawImg(msrc, sx(md.x) - TS, py(md.y), PS, PS, '#b34a12');
    }
  }
  // Люди корпусов идут двумя кадрами в своём корпусе, взгляда их не ловит.
  for (let fi = 0; fi < folk.length; fi++) {
    const f = folk[fi];
    if (f.map !== S.map) continue;
    const fsrc = frameSrc(folkPics(f.who), step + fi);
    if (f.a.dir < 0) drawImgFlip(fsrc, sx(f.a.x) - TS, py(f.a.y), PS, PS, '#c9a227');
    else drawImg(fsrc, sx(f.a.x) - TS, py(f.a.y), PS, PS, '#c9a227');
  }

  if (isNight(S)) {
    g2d.fillStyle = 'rgba(2,4,34,0.66)';
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

  // Мерка 3, мягкий свет: мерцание слабое (амплитуда вполовину),
  // спад широкий и гладкий до прозрачности — видимого края круга нет.
  // День с мягким верхним светом. Тёплое пятно вокруг тюленьки шире и сильнее.
  {
    const lightNight = isNight(S);
    const seX = sx(S.seal.x);
    const seY = sy(S.seal.y);
    // Огоньки стоят в камерах — горят только там.
    if (lightNight && S.map === 'cells') {
      for (let i = 0; i < LAMPS.length; i++) {
        const LP = LAMPS[i];
        const lx = sx(LP.x);
        const ly = sy(LP.y);
        const fl = 0.78 + 0.08 * Math.sin(now / 130 + i * 2.1) + 0.03 * Math.sin(now / 41 + i * 3.7);
        const br = 1 + 0.07 * Math.sin(now / 170 + i * 1.3) + 0.03 * Math.sin(now / 53 + i * 2.3);
        const haloR = 84 * SCALE * fl * br;
        const halo = g2d.createRadialGradient(lx, ly, 3, lx, ly, haloR);
        halo.addColorStop(0, 'rgba(255,200,130,' + (0.30 * fl).toFixed(3) + ')');
        halo.addColorStop(0.4, 'rgba(255,186,110,' + (0.13 * fl).toFixed(3) + ')');
        halo.addColorStop(0.7, 'rgba(255,182,105,' + (0.05 * fl).toFixed(3) + ')');
        halo.addColorStop(1, 'rgba(255,180,100,0)');
        g2d.fillStyle = halo;
        g2d.fillRect(lx - haloR, ly - haloR, haloR * 2, haloR * 2);
        const coreR = Math.max(8, haloR * 0.36);
        const core = g2d.createRadialGradient(lx, ly, 1, lx, ly, coreR);
        core.addColorStop(0, 'rgba(255,242,208,' + (0.60 * fl).toFixed(3) + ')');
        core.addColorStop(0.6, 'rgba(255,224,170,' + (0.32 * fl).toFixed(3) + ')');
        core.addColorStop(1, 'rgba(255,210,140,0)');
        g2d.fillStyle = core;
        g2d.fillRect(lx - coreR, ly - coreR, coreR * 2, coreR * 2);
      }
      for (let i = 0; i < LAMPS.length; i++) {
        const LP = LAMPS[i];
        const lx = sx(LP.x);
        const ly = sy(LP.y);
        const fl2 = 0.8 + 0.1 * Math.sin(now / 120 + i * 2.4);
        const dot = Math.max(4, 2.5 * SCALE * (0.9 + 0.1 * fl2));
        g2d.fillStyle = '#241708';
        g2d.fillRect(lx - dot / 2 - 1, ly - dot / 2 - 1, dot + 2, dot + 2);
        g2d.fillStyle = '#ffe9bb';
        g2d.fillRect(lx - dot / 2, ly - dot / 2, dot, dot);
      }
    }
    const lr = 360;
    const glow = g2d.createRadialGradient(seX, seY, 10, seX, seY, lr);
    glow.addColorStop(0, lightNight ? 'rgba(255,226,160,0.65)' : 'rgba(255,224,160,0.22)');
    glow.addColorStop(0.5, lightNight ? 'rgba(255,220,150,0.28)' : 'rgba(255,224,160,0.10)');
    glow.addColorStop(1, 'rgba(255,210,130,0)');
    g2d.fillStyle = glow;
    g2d.fillRect(seX - lr, seY - lr, lr * 2, lr * 2);
    if (!lightNight) {
      const dl = g2d.createLinearGradient(0, 0, 0, H);
      dl.addColorStop(0, 'rgba(255,233,190,0.07)');
      dl.addColorStop(0.45, 'rgba(255,233,190,0.02)');
      dl.addColorStop(1, 'rgba(255,233,190,0)');
      g2d.fillStyle = dl;
      g2d.fillRect(0, 0, W, H);
    }
    const vg = g2d.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(0.5, lightNight ? 'rgba(0,0,20,0.20)' : 'rgba(0,0,20,0.08)');
    vg.addColorStop(1, lightNight ? 'rgba(0,0,20,0.52)' : 'rgba(0,0,20,0.22)');
    g2d.fillStyle = vg;
    g2d.fillRect(0, 0, W, H);
  }

  // Круг 10, имена и полоски вживую: поверх света, чтобы читались
  // и днём, и ночью. Стража мигает полоской, когда видит тюленьку.
  {
    const tagW = TS * 2;
    drawTag(sx(S.seal.x), py(S.seal.y), 'Тюленька', '#3ddc5f', 1, tagW, true);
    for (const gd of seen) {
      const alert = sees(gd, S.seal.x, S.seal.y, gd.dir);
      const barOn = !alert || (Math.floor(now / 250) % 2 === 0);
      drawTag(sx(gd.x), py(gd.y), 'Страж', '#e0393e', 1, tagW, barOn);
    }
    for (const md of mates) {
      if (S.map !== 'cells') continue;
      drawTag(sx(md.x), py(md.y), 'Свой', '#d97a1f', 1, tagW, true);
    }
    for (const f of folk) {
      if (f.map !== S.map) continue;
      drawTag(sx(f.a.x), py(f.a.y), f.name, '#c9a227', 1, tagW, true);
    }
  }

  // Затемнение перехода между корпусами.
  if (S.fade > 0) {
    g2d.fillStyle = 'rgba(0,0,0,' + (0.9 * S.fade).toFixed(2) + ')';
    g2d.fillRect(0, 0, W, H);
  }

  // Тетрадка с делами: восемь путей, готовые — зелёным.
  if (S.book) {
    const qs = questState();
    g2d.fillStyle = 'rgba(0,0,0,0.78)';
    g2d.fillRect(W / 2 - 260, 60, 520, 44 + QUESTS.length * 24);
    g2d.fillStyle = '#ffd23f';
    g2d.font = '18px sans-serif';
    g2d.textAlign = 'center';
    g2d.fillText('Тетрадка: дела', W / 2, 90);
    g2d.font = '15px sans-serif';
    g2d.textAlign = 'left';
    for (let i = 0; i < QUESTS.length; i++) {
      const q = QUESTS[i];
      const ok = done(qs, q.id);
      g2d.fillStyle = ok ? '#7CFC00' : '#fff';
      g2d.fillText((ok ? '✓ ' : '· ') + q.id + ' — ' + q.steps.join(', '), W / 2 - 240, 118 + i * 24);
    }
  }

  // Вверху слева монеты и розыск. Внизу полоса: время, день, дело часа.
  g2d.fillStyle = '#fff';
  g2d.font = '18px sans-serif';
  g2d.textAlign = 'left';
  let heat = '';
  for (let i = 0; i < 3; i++) heat += i < S.wanted ? '★' : '☆';
  g2d.fillText('◉ ' + S.coins + '   ' + heat, 12, 24);
  g2d.textAlign = 'right';
  const hc = hourCase(S);
  g2d.fillText(fmtTime() + '  день ' + S.day + '  ' + hc + '  ' + corpsName(), W - 12, 24);
  g2d.textAlign = 'center';
  const lines = talkFor(S);
  const show = lastLine || (lines.length > 0 ? lines[0].text : '');
  if (show) {
    drawImg(FACE, W / 2 - 220, H - 210, 64, 64, '#cfe8ff');
    g2d.textAlign = 'left';
    g2d.font = '16px sans-serif';
    g2d.fillText(show.slice(0, 48), W / 2 - 148, H - 172);
    // Сила в лице: рядом с духом — пять кругов силы.
    const pw = S.power || 0;
    let pips = '';
    for (let i = 0; i < 5; i++) pips += i < pw ? '●' : '○';
    g2d.fillText('сила ' + pips, W / 2 - 148, H - 152);
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
    if (e.key === 'n' || e.key === 'N' || e.key === 'т' || e.key === 'Т') doBook();
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

// Крючок для внешней проверки: день целиком прогоном, нить, карцер,
// шесть корпусов, восемь дел.
ROOT.__hook = {
  S: S,
  get G() { return G; },
  get MAP() { return rowsFor(S.map); },
  get TRADER() { return TRADER; },
  mates: mates,
  crews: crews,
  folk: folk,
  simStep: simStep,
  doTalk: doTalk,
  doPick: doPick,
  doCraft: doCraft,
  doSearch: doSearch,
  doTrade: doTrade,
  doBook: doBook,
  goMap: goMap,
  questAt: questAt,
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
  QUESTS: QUESTS,
  done: done,
  DOORS: DOORS,
  pass: pass,
  pump: pump,
  need: need,
  BRIBE: BRIBE,
  WORLD_IDS: WORLD_IDS,
  WORLD_NAMES: WORLD_NAMES,
  WORLD_MAPS: WORLD_MAPS,
  worldMap: worldMap,
  get mode() { return mode; },
  get winEnd() { return winEnd; },
};
