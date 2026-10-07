/* CULTIVATION TOILET — вход, меню, HUD, панели и игровой цикл (three.js). */
import * as THREE from 'three';
import {
  api,
  errText,
  fmt,
  getSid,
  rarityName,
  setSid,
  type Catalog,
  type GameState,
  type PullResult,
} from './api';
import { CELL, createWorld, type World } from './world';
import { Player } from './player';

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;

let st: GameState | null = null;
let cat: Catalog | null = null;
let world: World | null = null;
let player: Player | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let busy = false;
let flushUntil = 0;
let gameOn = false;
let panelOpen = false;

// ---------------------------------------------------------------- экраны
function show(id: 'gate' | 'menu' | 'game'): void {
  $('gate').classList.toggle('hidden', id !== 'gate');
  $('menu').classList.toggle('hidden', id !== 'menu');
  $('game').classList.toggle('hidden', id !== 'game');
  $('side').classList.toggle('hidden', id === 'gate'); // панели видны и в меню, и в игре
}

function toast(text: string, kind?: string): void {
  const el = document.createElement('div');
  el.className = 'toast ' + (kind || '');
  el.textContent = text;
  $('toasts').appendChild(el);
  setTimeout(() => el.remove(), 2600);
}

// ---------------------------------------------------------------- вход
async function gate(mode: 'login' | 'register'): Promise<void> {
  const nick = ($('nick') as HTMLInputElement).value.trim();
  const pass = ($('pass') as HTMLInputElement).value;
  $('gateErr').textContent = '';
  try {
    const d = await api<{ sid: string; state: GameState; catalog: Catalog }>('/api/' + mode, { nick, pass });
    setSid(d.sid);
    st = d.state;
    cat = d.catalog;
    renderHud();
    renderPanels();
    show('menu');
    renderMenu();
  } catch (e) {
    $('gateErr').textContent = errText(e as Error);
  }
}

async function restore(): Promise<void> {
  if (!getSid()) return;
  try {
    const d = await api<{ state: GameState; catalog: Catalog }>('/api/state?sid=' + encodeURIComponent(getSid()));
    st = d.state;
    cat = d.catalog;
    renderHud();
    renderPanels();
    show('menu');
    renderMenu();
  } catch {
    logout();
  }
}

function logout(): void {
  if (getSid()) api('/api/logout', { sid: getSid() }).catch(() => {});
  setSid('');
  st = null;
  gameOn = false;
  player?.unlock();
  show('gate');
}

// ---------------------------------------------------------------- обновление состояния
async function refresh(): Promise<void> {
  if (!getSid() || !st) return;
  try {
    const d = await api<{ state: GameState; catalog: Catalog; online: number }>('/api/state?sid=' + encodeURIComponent(getSid()));
    st = d.state;
    if (!cat && d.catalog) cat = d.catalog;
    renderHud();
    renderPanels();
    $('online').textContent = String(d.online);
  } catch (e) {
    if ((e as { code?: number }).code === 401) logout();
  }
}

async function action(path: string, body: Record<string, unknown>, okText?: string): Promise<void> {
  if (busy || !st) return;
  busy = true;
  try {
    const d = await api<{ state?: GameState; result?: PullResult; ok?: boolean }>(path, { sid: getSid(), ...body });
    if (d.state) {
      st = d.state;
      renderHud();
      renderPanels();
      if (path === '/api/build' && world && st) {
        world.rebuild(st.cells);
        toast('Клетка построена', 'event');
      }
    }
    if (d.result) {
      toast(d.result.text, d.result.kind === 'hurt' || d.result.kind === 'dirty' ? 'hit' : d.result.kind === 'event' ? 'event' : 'loot');
      if (world?.toilet) world.toilet.anim = 1;
    } else if (okText) {
      toast(okText, 'event');
    }
    if (path === '/api/market/sell' || path === '/api/market/buy') loadMarket();
  } catch (e) {
    toast(errText(e as Error), 'hit');
  } finally {
    busy = false;
  }
}

// ---------------------------------------------------------------- смыв
async function pull(): Promise<void> {
  if (Date.now() < flushUntil) return;
  flushUntil = Date.now() + 1250;
  await action('/api/pull', {});
}

// ---------------------------------------------------------------- HUD
function renderHud(): void {
  if (!st) return;
  $('whoami').textContent = st.login;
  $('whoScore').textContent = `счёт ${fmt(st.score)} · смертей ${st.deaths} · смывов ${st.pulls}`;
  $('money').textContent = fmt(st.money);
  $('income').textContent = st.income.toFixed(2);
  $('hp').textContent = st.hp.toFixed(0);
  $('dirty').textContent = st.dirty.toFixed(1);
  $('cells').textContent = String(st.cells.length);
  document.querySelector('.chip.hp')?.classList.toggle('low', st.hp < 40);
  document.querySelector('.chip.dirty')?.classList.toggle('high', st.dirty > 70);
  renderBuild();
}

function renderBuild(): void {
  if (!st || !player) return;
  const info = $('buildInfo');
  const cx = Math.round(player.pos.x / CELL);
  const cz = Math.round(player.pos.z / CELL);
  const deltas: Record<string, [number, number]> = { n: [0, -1], s: [0, 1], e: [1, 0], w: [-1, 0] };
  let free = 0;
  for (const dir of ['n', 's', 'e', 'w'] as const) {
    const [dx, dz] = deltas[dir];
    const busyCell = st.cells.some((c) => c.x === cx + dx && c.z === cz + dz);
    const btn = document.querySelector<HTMLButtonElement>(`.btn.dir[data-dir="${dir}"]`);
    if (btn) btn.disabled = busyCell || st.money < st.buildCost;
    if (!busyCell) free++;
  }
  info.innerHTML = free
    ? `построить клетку <b>${fmt(st.buildCost)}</b> <span class="dim">— выбери сторону от клетки [${cx}, ${cz}]</span>`
    : '<span class="dim">вокруг клетки нет места</span>';
}

function renderMenu(): void {
  if (!st) return;
  $('menuStats').innerHTML =
    `<span>монеты <b>${fmt(st.money)}</b></span>` +
    `<span>клеток <b>${st.cells.length}</b></span>` +
    `<span>счёт <b>${fmt(st.score)}</b></span>` +
    `<span>доход/сек <b>${st.income.toFixed(2)}</b></span>`;
}

// ---------------------------------------------------------------- панели
function renderPanels(): void {
  if (!st) return;
  renderUpg();
  renderInv();
  renderLog();
}

function renderUpg(): void {
  if (!st || !cat) return;
  const box = $('upgList');
  box.innerHTML = '';
  for (const u of cat.upgrades) {
    const lvl = st.upg[u.id] || 0;
    const cost = st.upgCost[u.id];
    const row = document.createElement('div');
    row.className = 'row';
    row.dataset.upg = u.id;
    row.innerHTML =
      `<span class="name">${u.name}<small>${u.desc}</small></span>` +
      `<span class="lvl">ур.${lvl}</span><span class="price">${fmt(cost)}</span>`;
    const b = document.createElement('button');
    b.className = 'btn';
    b.id = 'buy-' + u.id;
    b.textContent = lvl ? 'УЛУЧШИТЬ' : 'КУПИТЬ';
    b.disabled = st.money < cost;
    b.onclick = () => action('/api/upgrade', { id: u.id }, u.name + ' улучшен');
    row.appendChild(b);
    box.appendChild(row);
  }
}

function renderInv(): void {
  if (!st) return;
  const box = $('invList');
  box.innerHTML = '';
  if (!st.inv.length) {
    box.innerHTML = '<div class="row empty">пусто — смывай унитаз</div>';
    return;
  }
  st.inv.forEach((it, idx) => {
    const row = document.createElement('div');
    row.className = 'row ' + it.rarity;
    row.dataset.item = it.id;
    row.innerHTML =
      `<span class="name">${nameOf(it.id)}<small>${rarityName(it.rarity)}</small></span>` +
      `<span class="price">≈${fmt(it.sell)}</span>`;
    const b = document.createElement('button');
    b.className = 'btn';
    b.textContent = 'ВЫСТАВИТЬ';
    b.onclick = () => action('/api/market/sell', { idx, price: it.sell }, 'Выставлен лот: ' + nameOf(it.id));
    row.appendChild(b);
    box.appendChild(row);
  });
}

function nameOf(id: string): string {
  const it = cat?.items.find((i) => i.id === id);
  return it ? it.name : id;
}

function renderLog(): void {
  if (!st) return;
  const box = $('logList');
  box.innerHTML = '';
  for (const l of st.log || []) {
    const line = document.createElement('div');
    line.className = 'logline ' + l.kind;
    const d = new Date(l.ts);
    line.innerHTML = `<b>${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}</b> ${l.text}`;
    box.appendChild(line);
  }
}

async function loadMarket(): Promise<void> {
  if (!getSid() || !st) return;
  try {
    const d = await api<{ lots: { id: number; seller: string; item: { id: string; rarity: string; sell: number }; price: number }[]; inv: { id: string; rarity: string; sell: number }[] }>(
      '/api/market?sid=' + encodeURIComponent(getSid()),
    );
    const mine = $('myItems');
    mine.innerHTML = d.inv.length ? '' : '<div class="row empty">нет вещей</div>';
    d.inv.forEach((it, idx) => {
      const row = document.createElement('div');
      row.className = 'row ' + it.rarity;
      row.innerHTML = `<span class="name">${nameOf(it.id)}<small>${rarityName(it.rarity)}</small></span><span class="price">${fmt(it.sell)}</span>`;
      const b = document.createElement('button');
      b.className = 'btn';
      b.textContent = 'ПРОДАТЬ';
      b.onclick = () => action('/api/market/sell', { idx, price: it.sell }, 'Лот выставлен');
      row.appendChild(b);
      mine.appendChild(row);
    });
    const box = $('marketList');
    box.innerHTML = d.lots.length ? '' : '<div class="row empty">лотов нет</div>';
    for (const lot of d.lots) {
      const row = document.createElement('div');
      row.className = 'row ' + lot.item.rarity;
      row.dataset.lot = String(lot.id);
      row.innerHTML =
        `<span class="name">${nameOf(lot.item.id)}<small>${rarityName(lot.item.rarity)} · ${lot.seller}</small></span>` +
        `<span class="price">${fmt(lot.price)}</span>`;
      const b = document.createElement('button');
      b.className = 'btn';
      b.textContent = 'КУПИТЬ';
      b.disabled = st.money < lot.price || lot.seller === st.login;
      b.onclick = () => action('/api/market/buy', { lot: lot.id }, 'Куплено: ' + nameOf(lot.item.id));
      row.appendChild(b);
      box.appendChild(row);
    }
  } catch (e) {
    toast(errText(e as Error), 'hit');
  }
}

async function loadRating(): Promise<void> {
  try {
    const d = await api<{ top: { login: string; score: number; roomLevel: number; levels: number; deaths: number }[]; online: number }>('/api/rating');
    const box = $('ratingList');
    box.innerHTML = '';
    $('online').textContent = String(d.online);
    d.top.forEach((e, i) => {
      const row = document.createElement('div');
      row.className = 'row rank' + (st && e.login === st.login ? ' me' : '');
      row.dataset.nick = e.login;
      row.innerHTML =
        `<span class="pos">${i + 1}</span><span class="name">${e.login}${st && e.login === st.login ? '<small>ты</small>' : ''}</span>` +
        `<span class="lvl">ур.${e.levels}</span><span class="price">${fmt(e.score)}</span>`;
      box.appendChild(row);
    });
    if (!d.top.length) box.innerHTML = '<div class="row empty">пока пусто</div>';
  } catch (e) {
    toast(errText(e as Error), 'hit');
  }
}

// ---------------------------------------------------------------- three.js
function initThree(): void {
  if (renderer) return;
  const canvas = $('gl') as HTMLCanvasElement;
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
  camera = new THREE.PerspectiveCamera(72, 1, 0.05, 60);
  world = createWorld();
  player = new Player(world, canvas);

  const resize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer!.setSize(w, h, false);
    camera!.aspect = w / h;
    camera!.updateProjectionMatrix();
  };
  window.addEventListener('resize', resize);
  resize();

  canvas.addEventListener('click', () => {
    if (panelOpen) {
      togglePanel();
      return;
    }
    if (gameOn && !player!.locked) player!.lock();
  });
}

const ray = new THREE.Raycaster();
const CENTER = new THREE.Vector2(0, 0);
const prompt = () => $('prompt');

function updatePrompt(): void {
  if (!world?.toilet || !camera || !gameOn) {
    prompt().classList.add('hidden');
    return;
  }
  ray.setFromCamera(CENTER, camera);
  ray.far = 2.6;
  const hit = ray.intersectObject(world.toilet.group, true);
  prompt().classList.toggle('hidden', hit.length === 0);
}

async function startGame(): Promise<void> {
  if (!st) return;
  initThree();
  world!.rebuild(st.cells);
  player!.reset(world!.spawn);
  gameOn = true;
  show('game');
  renderHud();
  await player!.lock();
}

function backToMenu(): void {
  gameOn = false;
  player?.unlock();
  prompt().classList.add('hidden');
  renderMenu();
  show('menu');
}

function togglePanel(name?: string): void {
  const tabs = document.querySelectorAll<HTMLButtonElement>('.tab');
  if (name) {
    tabs.forEach((t) => t.classList.toggle('active', t.dataset.tab === name));
    document.querySelectorAll('.panel').forEach((p) => p.classList.toggle('active', p.id === 'tab-' + name));
    if (name === 'market') loadMarket();
    if (name === 'rating') loadRating();
  }
  panelOpen = !panelOpen || !!name;
  $('side').classList.toggle('hidden', !panelOpen);
  if (gameOn) {
    if (panelOpen) player?.unlock();
    else player?.lock();
  }
}

// ---------------------------------------------------------------- ввод
document.addEventListener('keydown', (e) => {
  if (!st) return;
  if (e.code === 'Tab') {
    e.preventDefault();
    togglePanel();
  } else if (e.code === 'Escape') {
    if (panelOpen) togglePanel();
    else if (gameOn) backToMenu();
  } else if (e.code === 'KeyE' && gameOn && !panelOpen) {
    if (!prompt().classList.contains('hidden')) pull();
  }
});

// Esc при захвате мыши выходит из pointer lock — тогда же возвращаемся в меню
document.addEventListener('pointerlockchange', () => {
  if (gameOn && !panelOpen && document.pointerLockElement === null) backToMenu();
});

document.querySelectorAll<HTMLButtonElement>('.tab').forEach((b) => {
  b.addEventListener('click', () => togglePanel(b.dataset.tab));
});

document.querySelectorAll<HTMLButtonElement>('.btn.dir').forEach((b) => {
  b.addEventListener('click', () => {
    if (!st || !player) return;
    const cx = Math.round(player.pos.x / CELL);
    const cz = Math.round(player.pos.z / CELL);
    void action('/api/build', { dir: b.dataset.dir, fx: cx, fz: cz });
  });
});

$('loginBtn').addEventListener('click', () => void gate('login'));
$('regBtn').addEventListener('click', () => void gate('register'));
$('pass').addEventListener('keydown', (e) => { if (e.key === 'Enter') void gate('login'); });
$('menuLogout').addEventListener('click', logout);
$('startBtn').addEventListener('click', () => void startGame());
$('escBtn').addEventListener('click', backToMenu);

// локальные «капли» пассивного дохода между опросами
setInterval(() => {
  if (!st) return;
  const secs = Math.max(0, Math.round((st.nextEventIn - (Date.now() - st.serverTime)) / 1000));
  $('nextEv').textContent = secs > 0 ? secs + 'с' : 'сейчас';
  st.dirty = Math.min(100, st.dirty + st.dirtyRate / 60);
  st.money += st.income / 60;
  renderHud();
}, 1000);
setInterval(() => void refresh(), 4000);

// ---------------------------------------------------------------- цикл
let last = performance.now();
function loop(): void {
  requestAnimationFrame(loop);
  const now = performance.now();
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (!gameOn || !renderer || !camera || !world || !player) return;
  player.update(dt, panelOpen);
  player.apply(camera);
  if (world.toilet && world.toilet.anim > 0) {
    world.toilet.anim = Math.max(0, world.toilet.anim - dt * 1.4);
    const k = world.toilet.anim;
    world.toilet.group.position.y = Math.sin(k * Math.PI * 7) * 0.03 * k;
  }
  updatePrompt();
  renderBuild();
  renderer.render(world.scene, camera);
}
loop();

// панели скрыты до входа
show('gate');
void restore();

// отладка/e2e
declare global {
  interface Window {
    __ct: {
      state: () => GameState | null;
      sid: () => string;
      world: () => World | null;
      player: () => Player | null;
      start: () => void;
      pull: () => void;
      promptVisible: () => boolean;
      look: (yaw: number, pitch: number) => void;
      money: () => number;
    };
  }
}
window.__ct = {
  state: () => st,
  sid: () => getSid(),
  world: () => world,
  player: () => player,
  start: () => void startGame(),
  pull: () => void pull(),
  promptVisible: () => !prompt().classList.contains('hidden'),
  look: (yaw, pitch) => { if (player) { player.yaw = yaw; player.pitch = pitch; } },
  money: () => (st ? st.money : 0),
};
