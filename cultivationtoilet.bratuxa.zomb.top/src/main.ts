/* CULTIVATION TOILET вЂ” РІС…РѕРґ, РјРµРЅСЋ, HUD, РїР°РЅРµР»Рё Рё РёРіСЂРѕРІРѕР№ С†РёРєР» (three.js). */
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

// ---------------------------------------------------------------- СЌРєСЂР°РЅС‹
function show(id: 'gate' | 'menu' | 'game'): void {
  $('gate').classList.toggle('hidden', id !== 'gate');
  $('menu').classList.toggle('hidden', id !== 'menu');
  $('game').classList.toggle('hidden', id !== 'game');
  $('side').classList.toggle('hidden', id === 'gate' || !panelOpen); // РїР°РЅРµР»Рё РІРёРґРЅС‹ Рё РІ РјРµРЅСЋ, Рё РІ РёРіСЂРµ
}

function toast(text: string, kind?: string): void {
  const el = document.createElement('div');
  el.className = 'toast ' + (kind || '');
  el.textContent = text;
  $('toasts').appendChild(el);
  setTimeout(() => el.remove(), 2600);
}

// ---------------------------------------------------------------- РІС…РѕРґ
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
    initThree(); // РЅР°С‡РёРЅР°РµРј Р·Р°СЂР°РЅРµРµ РіСЂСѓР·РёС‚СЊ РєР°СЂС‚Сѓ (28 РњР‘)
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
    initThree(); // РЅР°С‡РёРЅР°РµРј Р·Р°СЂР°РЅРµРµ РіСЂСѓР·РёС‚СЊ РєР°СЂС‚Сѓ (28 РњР‘)
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

// ---------------------------------------------------------------- РѕР±РЅРѕРІР»РµРЅРёРµ СЃРѕСЃС‚РѕСЏРЅРёСЏ
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
        toast('РљР»РµС‚РєР° РїРѕСЃС‚СЂРѕРµРЅР°', 'event');
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

// ---------------------------------------------------------------- СЃРјС‹РІ
async function pull(): Promise<void> {
  if (Date.now() < flushUntil) return;
  flushUntil = Date.now() + 1250;
  await action('/api/pull', {});
}

// ---------------------------------------------------------------- HUD
function renderHud(): void {
  if (!st) return;
  $('whoami').textContent = st.login;
  $('whoScore').textContent = `СЃС‡С‘С‚ ${fmt(st.score)} В· СЃРјРµСЂС‚РµР№ ${st.deaths} В· СЃРјС‹РІРѕРІ ${st.pulls}`;
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
    chip('вещи', String(st.inv.length)) +
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
    ? `РїРѕСЃС‚СЂРѕРёС‚СЊ РєР»РµС‚РєСѓ <b>${fmt(st.buildCost)}</b> <span class="dim">вЂ” РІС‹Р±РµСЂРё СЃС‚РѕСЂРѕРЅСѓ РѕС‚ РєР»РµС‚РєРё [${cx}, ${cz}]</span>`
    : '<span class="dim">РІРѕРєСЂСѓРі РєР»РµС‚РєРё РЅРµС‚ РјРµСЃС‚Р°</span>';
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
    m('вещей', String(st.inv.length)) +
    m('состояние', st.hp.toFixed(0)) +
    m('грязь', st.dirty.toFixed(1));
}

// ---------------------------------------------------------------- РїР°РЅРµР»Рё
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
      `<span class="lvl">СѓСЂ.${lvl}</span><span class="price">${fmt(cost)}</span>`;
    const b = document.createElement('button');
    b.className = 'btn';
    b.id = 'buy-' + u.id;
    b.textContent = lvl ? 'РЈР›РЈР§РЁРРўР¬' : 'РљРЈРџРРўР¬';
    b.disabled = st.money < cost;
    b.onclick = () => action('/api/upgrade', { id: u.id }, u.name + ' СѓР»СѓС‡С€РµРЅ');
    row.appendChild(b);
    box.appendChild(row);
  }
}

function renderInv(): void {
  if (!st) return;
  const box = $('invList');
  box.innerHTML = '';
  const total = st.inv.reduce((s, i) => s + i.sell, 0);
  const head = document.createElement('div');
  head.className = 'subhead';
  head.innerHTML = `Вещи: <b>${st.inv.length}</b> · на сумму <b>${fmt(total)}</b> <span class="dim">— выставляй на площадку</span>`;
  box.appendChild(head);
  if (!st.inv.length) {
    box.innerHTML += '<div class="row empty">пусто — смывай унитаз (E), вещи падают с шансом</div>';
    return;
  }
  st.inv.forEach((it, idx) => {
    const row = document.createElement('div');
    row.className = 'row ' + it.rarity;
    row.dataset.item = it.id;
    row.innerHTML =
      `<span class="name">${nameOf(it.id)}<small>${rarityName(it.rarity)}</small></span>` +
      `<span class="price">в‰€${fmt(it.sell)}</span>`;
    const b = document.createElement('button');
    b.className = 'btn';
    b.textContent = 'Р’Р«РЎРўРђР’РРўР¬';
    b.onclick = () => action('/api/market/sell', { idx, price: it.sell }, 'Р’С‹СЃС‚Р°РІР»РµРЅ Р»РѕС‚: ' + nameOf(it.id));
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
    mine.innerHTML = d.inv.length ? '' : '<div class="row empty">РЅРµС‚ РІРµС‰РµР№</div>';
    d.inv.forEach((it, idx) => {
      const row = document.createElement('div');
      row.className = 'row ' + it.rarity;
      row.innerHTML = `<span class="name">${nameOf(it.id)}<small>${rarityName(it.rarity)}</small></span><span class="price">${fmt(it.sell)}</span>`;
      const b = document.createElement('button');
      b.className = 'btn';
      b.textContent = 'РџР РћР”РђРўР¬';
      b.onclick = () => action('/api/market/sell', { idx, price: it.sell }, 'Р›РѕС‚ РІС‹СЃС‚Р°РІР»РµРЅ');
      row.appendChild(b);
      mine.appendChild(row);
    });
    const box = $('marketList');
    box.innerHTML = d.lots.length ? '' : '<div class="row empty">Р»РѕС‚РѕРІ РЅРµС‚</div>';
    for (const lot of d.lots) {
      const row = document.createElement('div');
      row.className = 'row ' + lot.item.rarity;
      row.dataset.lot = String(lot.id);
      row.innerHTML =
        `<span class="name">${nameOf(lot.item.id)}<small>${rarityName(lot.item.rarity)} В· ${lot.seller}</small></span>` +
        `<span class="price">${fmt(lot.price)}</span>`;
      const b = document.createElement('button');
      b.className = 'btn';
      b.textContent = 'РљРЈРџРРўР¬';
      b.disabled = st.money < lot.price || lot.seller === st.login;
      b.onclick = () => action('/api/market/buy', { lot: lot.id }, 'РљСѓРїР»РµРЅРѕ: ' + nameOf(lot.item.id));
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
        `<span class="pos">${i + 1}</span><span class="name">${e.login}${st && e.login === st.login ? '<small>С‚С‹</small>' : ''}</span>` +
        `<span class="lvl">СѓСЂ.${e.levels}</span><span class="price">${fmt(e.score)}</span>`;
      box.appendChild(row);
    });
    if (!d.top.length) box.innerHTML = '<div class="row empty">РїРѕРєР° РїСѓСЃС‚Рѕ</div>';
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
    await world!.load(); // РґРѕР¶РёРґР°РµРјСЃСЏ GLB-РєР°СЂС‚С‹ (РѕР±С‹С‡РЅРѕ СѓР¶Рµ Р·Р°РіСЂСѓР¶РµРЅР° СЃ СЌРєСЂР°РЅР° РІС…РѕРґР°)
  } catch {
    toast('РЅРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РіСЂСѓР·РёС‚СЊ РєР°СЂС‚Сѓ', 'hit');
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

// ---------------------------------------------------------------- РІРІРѕРґ
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

// Esc РїСЂРё Р·Р°С…РІР°С‚Рµ РјС‹С€Рё РІС‹С…РѕРґРёС‚ РёР· pointer lock вЂ” С‚РѕРіРґР° Р¶Рµ РІРѕР·РІСЂР°С‰Р°РµРјСЃСЏ РІ РјРµРЅСЋ
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

// Р»РѕРєР°Р»СЊРЅС‹Рµ В«РєР°РїР»РёВ» РїР°СЃСЃРёРІРЅРѕРіРѕ РґРѕС…РѕРґР° РјРµР¶РґСѓ РѕРїСЂРѕСЃР°РјРё
setInterval(() => {
  if (!st) return;
  const secs = Math.max(0, Math.round((st.nextEventIn - (Date.now() - st.serverTime)) / 1000));
  $('nextEv').textContent = secs > 0 ? secs + 'СЃ' : 'СЃРµР№С‡Р°СЃ';
  st.dirty = Math.min(100, st.dirty + st.dirtyRate / 60);
  st.money += st.income / 60;
  renderHud();
}, 1000);
setInterval(() => void refresh(), 4000);

// ---------------------------------------------------------------- С†РёРєР»
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

// РїР°РЅРµР»Рё СЃРєСЂС‹С‚С‹ РґРѕ РІС…РѕРґР°
show('gate');
void restore();

// РѕС‚Р»Р°РґРєР°/e2e
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
  // РІСЂРµРјРµРЅРЅР°СЏ РѕС‚Р»Р°РґРєР°: С†РІРµС‚ РїРёРєСЃРµР»РµР№ СЃСЂР°Р·Сѓ РїРѕСЃР»Рµ РїСЂРёРЅСѓРґРёС‚РµР»СЊРЅРѕРіРѕ СЂРµРЅРґРµСЂР° (РѕР±С…РѕРґ РєРѕРјРїРѕР·РёС‚РѕСЂР°)
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
