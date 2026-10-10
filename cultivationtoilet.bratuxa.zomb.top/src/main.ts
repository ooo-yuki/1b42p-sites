/* CULTIVATION TOILET — вход, меню, HUD, панели и игровой цикл (three.js). */
import * as THREE from 'three';
import {
  api,
  dropChance,
  errText,
  fmt,
  getSid,
  rarityName,
  setSid,
  type Catalog,
  type GameState,
  type InvItem,
  type PullResult,
} from './api';
import { CELL, createWorld, type World } from './world';
import { Player } from './player';
import { DRAW_FAR, RES_SCALE, gfxPanelClose, gfxPanelOpen, gfxPanelToggle, gfxState, initSettingsUI, onGfx, onGfxPanelState } from './settings';

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
let cursorFree = false;

// ---------------------------------------------------------------- экраны
function show(id: 'gate' | 'menu' | 'game'): void {
  $('gate').classList.toggle('hidden', id !== 'gate');
  $('menu').classList.toggle('hidden', id !== 'menu');
  $('game').classList.toggle('hidden', id !== 'game');
  $('side').classList.toggle('hidden', id === 'gate' || !panelOpen); // панели видны и в меню, и в игре
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
    initThree(); // начинаем заранее грузить карту (28 МБ)
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
    initThree(); // начинаем заранее грузить карту (28 МБ)
  } catch {
    logout();
  }
}

function logout(): void {
  if (getSid()) api('/api/logout', { sid: getSid() }).catch(() => {});
  setSid('');
  st = null;
  gameOn = false;
  panelOpen = false;
  cursorFree = false;
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
  renderSideTop();
  renderBuild();
}

// шапка полноэкранного меню: все ключевые показатели
function renderSideTop(): void {
  const box = $('sideTop');
  if (!st) {
    box.innerHTML = '';
    return;
  }
  const chip = (label: string, val: string, cls = '') =>
    `<span class="chip ${cls}"><i>${label}</i><b>${val}</b></span>`;
  box.innerHTML =
    chip('игрок', st.login) +
    chip('монеты', fmt(st.money), 'money') +
    chip('доход/сек', st.income.toFixed(2)) +
    chip('счёт', fmt(st.score)) +
    chip('комната', 'ур.' + st.roomLevel) +
    chip('клетки', String(st.cells.length)) +
    chip('состояние', st.hp.toFixed(0), 'hp') +
    chip('грязь', st.dirty.toFixed(1), 'dirty') +
    chip('смывы', String(st.pulls)) +
    chip('смерти', String(st.deaths)) +
    chip('вещи', String(st.inv.reduce((s, i) => s + i.count, 0))) +
    chip('онлайн', $('online').textContent || '—');
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
  const m = (label: string, val: string) => `<span>${label} <b>${val}</b></span>`;
  $('menuStats').innerHTML =
    m('монеты', fmt(st.money)) +
    m('доход/сек', st.income.toFixed(2)) +
    m('клеток', String(st.cells.length)) +
    m('комната', 'ур.' + st.roomLevel) +
    m('счёт', fmt(st.score)) +
    m('смывов', String(st.pulls)) +
    m('смертей', String(st.deaths)) +
    m('вещей', String(st.inv.reduce((s, i) => s + i.count, 0))) +
    m('состояние', st.hp.toFixed(0)) +
    m('грязь', st.dirty.toFixed(1));
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

// ---------------------------------------------------------------- подсказка предмета
const tipEl = $('tip');
function tipShow(html: string, e: MouseEvent): void {
  tipEl.innerHTML = html;
  tipEl.classList.remove('hidden');
  tipMove(e);
}
function tipMove(e: MouseEvent): void {
  const pad = 14;
  const r = tipEl.getBoundingClientRect();
  let x = e.clientX + pad;
  let y = e.clientY + pad;
  if (x + r.width > innerWidth - 8) x = e.clientX - r.width - pad;
  if (y + r.height > innerHeight - 8) y = e.clientY - r.height - pad;
  tipEl.style.left = x + 'px';
  tipEl.style.top = y + 'px';
}
function tipHide(): void {
  tipEl.classList.add('hidden');
}
function itemTipHtml(it: { id: string; rarity: string; sell: number; count?: number }, extra?: string): string {
  const chance = dropChance(cat?.items || [], it.id);
  const pct = (chance * 100).toFixed(chance < 0.01 ? 2 : 1);
  return (
    `<div class="tipName ${it.rarity}">${nameOf(it.id)}</div>` +
    `<div class="tipRow"><span>редкость</span><b>${rarityName(it.rarity)}</b></div>` +
    `<div class="tipRow"><span>шанс за смыв</span><b>${pct}%</b></div>` +
    `<div class="tipRow"><span>цена за шт</span><b>${fmt(it.sell)}</b></div>` +
    (it.count && it.count > 1 ? `<div class="tipRow"><span>в стаке</span><b>×${it.count}</b></div>` : '') +
    (extra || '')
  );
}
function bindTip(row: HTMLElement, html: string): void {
  row.addEventListener('mouseenter', (e) => tipShow(html, e));
  row.addEventListener('mousemove', tipMove);
  row.addEventListener('mouseleave', tipHide);
}

/** Строка инвентаря: стак ×N, кнопка «выставить» открывает редактор цены и количества. */
function invRow(it: InvItem, idx: number, refresh: () => void): HTMLElement {
  const row = document.createElement('div');
  row.className = 'row ' + it.rarity;
  row.dataset.item = it.id;
  const cnt = it.count > 1 ? `<span class="cnt">×${it.count}</span>` : '';
  row.innerHTML =
    `<span class="name">${nameOf(it.id)}<small>${rarityName(it.rarity)}</small>${cnt}</span>` +
    `<span class="price">${fmt(it.sell * it.count)}</span>`;
  const b = document.createElement('button');
  b.className = 'btn';
  b.textContent = 'ВЫСТАВИТЬ';
  b.onclick = () => openSellEditor(row, it, idx, refresh);
  row.appendChild(b);
  bindTip(row, itemTipHtml(it));
  return row;
}

function openSellEditor(row: HTMLElement, it: InvItem, idx: number, refresh: () => void): void {
  row.classList.add('editing');
  row.innerHTML =
    `<span class="name">${nameOf(it.id)}<small>${rarityName(it.rarity)}${it.count > 1 ? ' · ×' + it.count : ''}</small></span>` +
    `<span class="sellFields">` +
    `<label>цена <input type="number" class="sellPrice" min="1" max="1000000" value="${it.sell}"></label>` +
    `<label>кол-во <input type="number" class="sellQty" min="1" max="${it.count}" value="${it.count}"></label>` +
    `<span class="dim">итого <b class="sellTotal">${fmt(it.sell * it.count)}</b></span>` +
    `</span>`;
  const ok = document.createElement('button');
  ok.className = 'btn primary';
  ok.textContent = 'ВЫСТАВИТЬ';
  const cancel = document.createElement('button');
  cancel.className = 'btn ghost';
  cancel.textContent = '✕';
  row.appendChild(ok);
  row.appendChild(cancel);
  const priceIn = row.querySelector('.sellPrice') as HTMLInputElement;
  const qtyIn = row.querySelector('.sellQty') as HTMLInputElement;
  const totalEl = row.querySelector('.sellTotal') as HTMLElement;
  const upd = () => {
    totalEl.textContent = fmt((Math.round(Number(priceIn.value)) || 0) * (Math.round(Number(qtyIn.value)) || 0));
  };
  priceIn.addEventListener('input', upd);
  qtyIn.addEventListener('input', upd);
  cancel.onclick = () => refresh();
  ok.onclick = () => {
    const price = Math.round(Number(priceIn.value)) || 0;
    const qty = Math.round(Number(qtyIn.value)) || 0;
    void action('/api/market/sell', { idx, price, qty }, 'Выставлен лот: ' + nameOf(it.id));
  };
}

function renderInv(): void {
  if (!st) return;
  const box = $('invList');
  box.innerHTML = '';
  const count = st.inv.reduce((s, i) => s + i.count, 0);
  const total = st.inv.reduce((s, i) => s + i.sell * i.count, 0);
  const head = document.createElement('div');
  head.className = 'subhead';
  head.innerHTML = `Вещи: <b>${count}</b> шт. · на сумму <b>${fmt(total)}</b> <span class="dim">— задай цену и количество</span>`;
  box.appendChild(head);
  if (!st.inv.length) {
    box.innerHTML += '<div class="row empty">пусто — смывай унитаз (E), вещи падают с шансом</div>';
    return;
  }
  st.inv.forEach((it, idx) => box.appendChild(invRow(it, idx, renderInv)));
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
    const d = await api<{
      lots: { id: number; seller: string; item: { id: string; rarity: string; sell: number }; price: number; qty: number; total: number }[];
      inv: InvItem[];
    }>('/api/market?sid=' + encodeURIComponent(getSid()));
    const mine = $('myItems');
    mine.innerHTML = d.inv.length ? '' : '<div class="row empty">нет вещей</div>';
    d.inv.forEach((it, idx) => mine.appendChild(invRow(it, idx, loadMarket)));
    const box = $('marketList');
    box.innerHTML = d.lots.length ? '' : '<div class="row empty">лотов нет</div>';
    for (const lot of d.lots) {
      const row = document.createElement('div');
      row.className = 'row ' + lot.item.rarity;
      row.dataset.lot = String(lot.id);
      const cnt = lot.qty > 1 ? `<span class="cnt">×${lot.qty}</span>` : '';
      row.innerHTML =
        `<span class="name">${nameOf(lot.item.id)}<small>${rarityName(lot.item.rarity)} · ${lot.seller}</small>${cnt}</span>` +
        `<span class="price">${fmt(lot.total)}</span>`;
      const b = document.createElement('button');
      b.className = 'btn';
      b.textContent = 'КУПИТЬ';
      b.disabled = st.money < lot.total || lot.seller === st.login;
      b.onclick = () => action('/api/market/buy', { lot: lot.id }, 'Куплено: ' + nameOf(lot.item.id));
      row.appendChild(b);
      bindTip(
        row,
        itemTipHtml({ ...lot.item, count: lot.qty }, `<div class="tipRow"><span>продавец</span><b>${lot.seller}</b></div>`),
      );
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
function applyGfxMain(): void {
  const g = gfxState();
  if (renderer) renderer.setPixelRatio(Math.min(2, window.devicePixelRatio) * RES_SCALE[g.res]);
  if (camera) {
    camera.far = DRAW_FAR[g.draw] + 2; // за туманом геометрия не нужна
    camera.updateProjectionMatrix();
  }
  world?.applyGfx(g);
}

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
  applyGfxMain();
  void world!.load().catch(() => {}); // GLB (~6 МБ) грузятся заранее, пока игрок в меню

  canvas.addEventListener('click', () => {
    if (panelOpen) {
      togglePanel();
      return;
    }
    if (gameOn && !player!.locked) {
      cursorFree = false;
      void player!.lock();
    }
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
  const btn = $('startBtn') as HTMLButtonElement;
  const label = btn.textContent || 'НАЧАТЬ ИГРУ';
  btn.disabled = true;
  btn.textContent = 'ЗАГРУЗКА КАРТЫ… ~6 МБ';
  try {
    await world!.load(); // дожидаемся GLB-карты (обычно уже загружена с экрана входа)
  } catch {
    toast('не удалось загрузить карту', 'hit');
    btn.disabled = false;
    btn.textContent = label;
    return;
  }
  btn.disabled = false;
  btn.textContent = label;
  world!.rebuild(st.cells);
  player!.reset(world!.spawn);
  gameOn = true;
  show('game');
  renderHud();
  await player!.lock();
}

function backToMenu(): void {
  gameOn = false;
  cursorFree = false;
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
    if (panelOpen) player?.unlock(); // открыли меню — мышь сразу свободна
    else void player?.lock();
  }
}

// Tab: просто показать/спрятать курсор, без панелей
function toggleCursor(): void {
  if (!gameOn || !player) return;
  if (player.locked) {
    cursorFree = true;
    player.unlock();
  } else {
    cursorFree = false;
    void player.lock();
  }
}

// ---------------------------------------------------------------- ввод
document.addEventListener('keydown', (e) => {
  if (!st) return;
  if (e.code === 'Tab') {
    e.preventDefault();
    if (panelOpen) togglePanel();
    else toggleCursor(); // просто курсор, без панелей
  } else if (e.code === 'KeyQ') {
    e.preventDefault();
    togglePanel(panelOpen ? undefined : 'inv'); // меню с инвентарём
  } else if (e.code === 'Escape') {
    if (gfxPanelOpen()) gfxPanelClose();
    else if (panelOpen) togglePanel();
    else if (gameOn) backToMenu();
  } else if (e.code === 'KeyG') {
    gfxPanelToggle();
  } else if (e.code === 'KeyE' && gameOn && !panelOpen && !gfxPanelOpen()) {
    if (!prompt().classList.contains('hidden')) pull();
  }
});

// Esc при захвате мыши выходит из pointer lock — тогда же возвращаемся в меню
document.addEventListener('pointerlockchange', () => {
  if (gameOn && !panelOpen && !gfxPanelOpen() && !cursorFree && document.pointerLockElement === null) backToMenu();
});

document.querySelectorAll<HTMLButtonElement>('.tab').forEach((b) => {
  b.addEventListener('click', () => togglePanel(b.dataset.tab));
});

// клик по фону полноэкранного меню — закрыть (в игре)
$('side').addEventListener('click', (e) => {
  if (e.target === $('side') && panelOpen && gameOn) togglePanel();
});

// кнопка «открыть меню» (как Q)
document.querySelectorAll('.panelBtn').forEach((b) => {
  b.addEventListener('click', () => togglePanel(panelOpen ? undefined : 'inv'));
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
let lastDraw = 0;
let frames = 0;
function loop(): void {
  requestAnimationFrame(loop);
  const now = performance.now();
  const cap = gfxState().fps;
  if (cap > 0 && now - lastDraw < 1000 / cap - 2) return; // лимит FPS: кадр пропускаем целиком
  lastDraw = now;
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (!gameOn || !renderer || !camera || !world || !player) return;
  player.update(dt, panelOpen);
  player.apply(camera);
  world.update(dt);
  if (world.toilet && world.toilet.anim > 0) {
    world.toilet.anim = Math.max(0, world.toilet.anim - dt * 1.4);
    const k = world.toilet.anim;
    world.toilet.group.position.y = Math.sin(k * Math.PI * 7) * 0.03 * k;
  }
  updatePrompt();
  renderBuild();
  renderer.render(world.scene, camera);
  frames++;
}
loop();

// gfx settings
initSettingsUI();
onGfx(() => applyGfxMain());
onGfxPanelState((open) => {
  if (!gameOn) return;
  if (open) player?.unlock(); // need cursor for settings clicks
  else if (!panelOpen) void player?.lock();
});

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
      frames: () => number;
      cam: () => { p: number[]; r: number[] } | null;
      render: () => unknown;
      rayScreen: (x: number, y: number) => unknown;
      sample: (pts: number[][]) => unknown;
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
  frames: () => frames,
  cam: () => (camera ? { p: camera.position.toArray().map((v) => +v.toFixed(2)), r: [camera.rotation.x, camera.rotation.y, camera.rotation.z].map((v) => +v.toFixed(2)) } : null),
  render: () => {
    if (!renderer || !camera || !world) return null;
    const r = renderer.info.render;
    const canvas = renderer.domElement;
    const visible: Record<string, number> = {};
    let total = 0;
    world.root.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      total++;
      visible[String(m.visible)] = (visible[String(m.visible)] || 0) + 1;
    });
    return {
      calls: r.calls, triangles: r.triangles, points: r.points, lines: r.lines,
      canvas: [canvas.width, canvas.height, canvas.clientWidth, canvas.clientHeight],
      camPos: camera.position.toArray().map((v) => +v.toFixed(2)),
      camFov: camera.fov, aspect: +camera.aspect.toFixed(3),
      sceneChildren: world.scene.children.length, meshes: total, visible,
    };
  },
  // временная отладка: цвет пикселей сразу после принудительного рендера (обход композитора)
  sample: (pts: number[][]) => {
    if (!renderer || !camera || !world) return null;
    renderer.render(world.scene, camera);
    const gl = renderer.getContext();
    const w = renderer.domElement.width;
    const h = renderer.domElement.height;
    return pts.map(([x, y]) => {
      const px = Math.max(0, Math.min(w - 1, Math.round((x / window.innerWidth) * w)));
      const py = Math.max(0, Math.min(h - 1, Math.round((1 - y / window.innerHeight) * h)));
      const buf = new Uint8Array(4);
      gl.readPixels(px, py, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, buf);
      return [buf[0], buf[1], buf[2]];
    });
  },
  rayScreen: (x: number, y: number) => {
    if (!camera || !world) return null;
    const root = world.root;
    const rc = new THREE.Raycaster();
    rc.setFromCamera(new THREE.Vector2(x, y), camera);
    rc.far = 50;
    return rc.intersectObjects(root.children, true).slice(0, 4).map((h) => ({
      d: +h.distance.toFixed(3),
      p: h.point.toArray().map((v) => +v.toFixed(3)),
      i: root.children.indexOf(h.object.parent && h.object.parent !== root ? h.object.parent : h.object),
      m: Array.isArray((h.object as THREE.Mesh).material)
        ? ((h.object as THREE.Mesh).material as THREE.Material[]).map((mm) => mm.name).join('|')
        : ((h.object as THREE.Mesh).material as THREE.Material)?.name,
      uv: (() => {
        const u = h.uv;
        return u ? [+u.x.toFixed(3), +u.y.toFixed(3)] : null;
      })(),
    }));
  },
};
