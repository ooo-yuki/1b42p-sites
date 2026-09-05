/* АРЕНА 42 — сервер клуба. Bun, ноль зависимостей.
   WS на /api/ws, онлайн на GET /api/online.
   Поток: выбор игры → поиск (пул) → голос за заход → бой → реванш.
   Число игроков диктуют правила игры, не кнопки. Фишек нет: победа — в летопись. */

const PORT = 8094;
const ROUND_SECS = 12;
const IDLE_SECS = 90;
const CODE_ALPHA = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
const WAIT_MS = 10 * 60 * 1000; // поиск дольше — голосование «ждать ещё»
const WAIT_VOTE_SECS = 60;

type Phase = 'lobby' | 'play' | 'over';

type GameDef = { label: string; min: number; max: number; turnSecs: number; icon: 'dice' | 'cards' | 'chess' | 'checkers' };
const GAMES: Record<string, GameDef> = {
  dice: { label: 'Кости на выбывание', min: 2, max: 5, turnSecs: 12, icon: 'dice' },
  durak: { label: 'Дурак подкидной', min: 2, max: 5, turnSecs: 30, icon: 'cards' },
  chess: { label: 'Шахматы', min: 2, max: 2, turnSecs: 60, icon: 'chess' },
  checkers: { label: 'Шашки русские', min: 2, max: 2, turnSecs: 45, icon: 'checkers' },
};
const GAME_IDS = Object.keys(GAMES);

type Client = {
  id: string;
  name: string;
  ws: WebSocket;
  roomId: string | null;
  gameVote: string; // gameId | 'any'
  lastSeen: number;
  lastChat: number;
};

type Room = {
  code: string;
  players: string[];
  host: string;
  private: boolean;
  game: string;
  phase: Phase;
  alive: string[];
  contenders: string[];
  rolls: Record<string, number>;
  round: number;
  timer: ReturnType<typeof setTimeout> | null;
  createdAt: number;
  winner: string | null;
  gdata: Record<string, unknown>; // витрина игры для клиента; кости держат всё в rolls/alive
  dstate: DState | null; // дурак живёт здесь целиком, в gdata — только публичный срез
  cstate: ChessState | null; // шахматы — вся правда здесь; позиция открыта, в gdata — полный срез
  kstate: KState | null; // шашки — вся правда здесь; позиция открыта, в gdata — полный срез
};

type Pool = {
  members: string[];
  since: number;
  enter: Record<string, boolean>;
  waitOpen: boolean;
  waitVotes: Record<string, boolean>;
  waitEnds: number;
  waitRound: number;
};

const rnd = (n: number): number => 1 + Math.floor(Math.random() * n);
const now = (): number => Date.now();

import {
  applyMove as durakApply, createDurak, removePlayer as durakRemove,
  timeoutMove as durakTimeout, type Card as EngineCard, type DState,
} from './durak';
import {
  applyMove as chessApply, createChess, removePlayer as chessRemove,
  type ChessState,
} from './chess';
import {
  applyMove as checkersApply, createCheckers, removePlayer as checkersRemove,
  type CheckersState as KState,
} from './checkers';

const clients = new Map<string, Client>();
const rooms = new Map<string, Room>();
let pool: Pool = freshPool();
let seq = 1;

function freshPool(): Pool {
  return { members: [], since: now(), enter: {}, waitOpen: false, waitVotes: {}, waitEnds: 0, waitRound: 0 };
}

function makeCode(): string {
  let c = '';
  do {
    c = Array.from({ length: 4 }, () => CODE_ALPHA[Math.floor(Math.random() * CODE_ALPHA.length)]).join('');
  } while (rooms.has(c));
  return c;
}

function cleanName(v: unknown): string {
  const s = String(v ?? '').replace(/[<>&"']/g, '').trim().slice(0, 24);
  return s || `Боец-${seq}`;
}

function send(ws: WebSocket, msg: Record<string, unknown>): void {
  try { ws.send(JSON.stringify(msg)); } catch { /* упал — свип добьёт */ }
}

function memberViews(r: Room): { id: string; name: string; alive: boolean }[] {
  return r.players.map(id => ({
    id,
    name: clients.get(id)?.name ?? '???',
    alive: r.phase === 'lobby' ? true : r.alive.includes(id),
  }));
}

/** Полный срез шашек: позиция открыта, тайн нет — клиент рисует как есть. */
function checkersPublic(r: Room): Record<string, unknown> {
  const st = r.kstate;
  if (!st) return {};
  return {
    board: st.board.map(p => (p ? { ...p } : null)),
    turn: st.turn,
    white: st.white, black: st.black,
    last: st.last ? { ...st.last } : null,
    drawOffer: st.drawOffer,
    history: [...st.history],
    phase: st.phase, winner: st.winner, reason: st.reason,
  };
}

/** Полный срез шахмат: позиция открыта, тайн нет — клиент рисует как есть. */
function chessPublic(r: Room): Record<string, unknown> {
  const st = r.cstate;
  if (!st) return {};
  return {
    board: st.board.map(p => (p ? { ...p } : null)),
    turn: st.turn, check: st.check,
    white: st.white, black: st.black,
    last: st.last ? { ...st.last } : null,
    drawOffer: st.drawOffer, full: st.full,
    history: [...st.history],
    phase: st.phase, winner: st.winner, reason: st.reason,
    castling: { ...st.castling }, ep: st.ep,
  };
}

/** Публичный срез дурака: стол, козырь, размеры рук. Сами руки — личным 'hand'. */
function durakPublic(r: Room): Record<string, unknown> {
  const st = r.dstate;
  if (!st) return {};
  const handN: Record<string, number> = {};
  for (const id of r.players) handN[id] = st.hands[id]?.length ?? 0;
  return {
    table: st.table.map(t => ({ a: t.a, d: t.d })),
    deckN: st.deck.length, trump: st.trump,
    attacker: st.attacker, defender: st.defender,
    out: [...st.out], handN,
  };
}

function roomState(r: Room): Record<string, unknown> {
  return {
    t: 'room', code: r.code, phase: r.phase, game: r.game,
    gameLabel: GAMES[r.game]?.label ?? r.game,
    players: memberViews(r), host: r.host,
    private: r.private,
    round: r.round, alive: [...r.alive], contenders: [...r.contenders],
    rolls: { ...r.rolls }, winner: r.winner,
    gdata: r.game === 'durak' ? durakPublic(r) : r.game === 'chess' ? chessPublic(r) : r.game === 'checkers' ? checkersPublic(r) : { ...r.gdata },
  };
}

function broadcast(r: Room, msg: Record<string, unknown>, except?: string): void {
  for (const id of r.players) {
    if (id === except) continue;
    const c = clients.get(id);
    if (c) send(c.ws, msg);
  }
}

function gameCatalog(): Record<string, unknown> {
  return Object.fromEntries(Object.entries(GAMES).map(([k, g]) => [k, { label: g.label, min: g.min, max: g.max, turnSecs: g.turnSecs, icon: g.icon }]));
}

function poolView(): Record<string, unknown> {
  return {
    t: 'pool',
    members: pool.members
      .map(id => clients.get(id))
      .filter((c): c is Client => !!c)
      .map(c => ({ id: c.id, name: c.name, vote: c.gameVote, enter: pool.enter[c.id] ?? false })),
    since: pool.since,
    games: gameCatalog(),
    wait: pool.waitOpen
      ? { open: true, ends: pool.waitEnds, votes: { ...pool.waitVotes }, round: pool.waitRound }
      : { open: false, ends: 0, votes: {}, round: pool.waitRound },
  };
}

function pushPool(): void {
  const v = poolView();
  for (const id of pool.members) {
    const c = clients.get(id);
    if (c) send(c.ws, v);
  }
}

function pushOnline(): void {
  const n = clients.size;
  for (const c of clients.values()) send(c.ws, { t: 'online', n });
}

function killTimer(r: Room): void {
  if (r.timer) { clearTimeout(r.timer); r.timer = null; }
}

function destroyRoom(code: string): void {
  const r = rooms.get(code);
  if (!r) return;
  killTimer(r);
  rooms.delete(code);
}

/** Убрать клиента отовсюду: комната и пул поиска. */
function detach(c: Client): void {
  const pi = pool.members.indexOf(c.id);
  if (pi >= 0) {
    pool.members.splice(pi, 1);
    delete pool.enter[c.id];
    delete pool.waitVotes[c.id];
    pushPool();
  }
  const code = c.roomId;
  if (!code) return;
  const r = rooms.get(code);
  c.roomId = null;
  if (!r) return;
  r.players = r.players.filter(id => id !== c.id);
  r.alive = r.alive.filter(id => id !== c.id);
  r.contenders = r.contenders.filter(id => id !== c.id);
  delete r.rolls[c.id];
  if (r.players.length === 0) { destroyRoom(code); return; }
  if (r.host === c.id) r.host = r.players[0];
  if (r.phase === 'play' && r.game === 'checkers' && r.kstate) {
    broadcast(r, { t: 'left', id: c.id, name: c.name });
    return checkersLeave(r, c.id);
  }
  if (r.phase === 'play' && r.game === 'chess' && r.cstate) {
    broadcast(r, { t: 'left', id: c.id, name: c.name });
    return chessLeave(r, c.id);
  }
  if (r.phase === 'play' && r.game === 'durak' && r.dstate) {
    broadcast(r, { t: 'left', id: c.id, name: c.name });
    return durakLeave(r, c.id);
  }
  if (r.phase === 'play') {
    broadcast(r, { t: 'left', id: c.id, name: c.name });
    if (r.alive.length === 1) return finishGame(r);
    if (r.contenders.length > 0 && r.contenders.every(id => r.rolls[id] !== undefined)) {
      return resolveRound(r);
    }
    if (r.alive.every(id => r.rolls[id] !== undefined)) return resolveRound(r);
  }
  broadcast(r, roomState(r));
}

function leaveRoom(c: Client): void {
  detach(c);
  send(c.ws, { t: 'leftRoom' });
}

/* ---------- голосования пула ---------- */

/** Игра по голосам комнаты: больше голосов — игра; все «любое» — рандом; ничья — рандом среди первых. */
export function decideGame(ids: string[]): string {
  const tally = new Map<string, number>();
  for (const id of ids) {
    const v = clients.get(id)?.gameVote ?? 'any';
    if (v !== 'any' && GAMES[v]) tally.set(v, (tally.get(v) ?? 0) + 1);
  }
  if (tally.size === 0) return GAME_IDS[Math.floor(Math.random() * GAME_IDS.length)];
  let best = 0;
  for (const n of tally.values()) best = Math.max(best, n);
  const top = [...tally.entries()].filter(([, n]) => n === best).map(([g]) => g);
  return top[Math.floor(Math.random() * top.length)];
}

/* ---------- платформа игр: реестр, лимиты, плагины ----------
   Новая игра = запись в GAMES + вьюха в src/arena/games/*. Больше ничего:
   пул, голоса, комнаты, таймеры и реванши — общие. */

export function sanitizeGame(v: unknown): string {
  const s = String(v ?? '');
  return GAMES[s] ? s : 'dice';
}

export function gameCap(game: string): number {
  return GAMES[game]?.max ?? 5;
}

export function fitMembers(ids: string[], game: string): string[] {
  return ids.slice(0, gameCap(game));
}

function formRoom(ids: string[]): void {
  const game = decideGame(ids.filter(id => clients.has(id)));
  const fitted = fitMembers(ids.filter(id => clients.has(id)), game);
  if (fitted.length < 2) return;
  const code = makeCode();
  const r: Room = {
    code, players: [], host: fitted[0], private: false, game,
    phase: 'lobby', alive: [], contenders: [], rolls: {}, round: 0,
    timer: null, createdAt: now(), winner: null, gdata: {}, dstate: null, cstate: null, kstate: null,
  };
  rooms.set(code, r);
  for (const id of fitted) {
    const m = clients.get(id);
    if (!m) continue;
    const pi = pool.members.indexOf(id);
    if (pi >= 0) pool.members.splice(pi, 1);
    delete pool.enter[id];
    delete pool.waitVotes[id];
    m.roomId = code;
    r.players.push(id);
  }
  if (r.players.length < 2) { destroyRoom(code); pushPool(); return; }
  r.host = r.players[0];
  pushPool();
  broadcast(r, roomState(r));
  startGame(r);
}

/** Голос за заход: зашло 2+ и «за» больше половины пула — в бой идут согласные. */
function tryForm(): void {
  const members = pool.members.filter(id => clients.has(id));
  if (members.length < 2) return;
  const yes = members.filter(id => pool.enter[id] === true);
  if (yes.length >= 2 && yes.length > members.length / 2) formRoom(yes);
}

/** Голос «ждать ещё»: большинство «за» — время продолжается, иначе — в бой. */
function resolveWait(): void {
  const members = pool.members.filter(id => clients.has(id));
  const yes = members.filter(id => pool.waitVotes[id] === true).length;
  const no = members.length - yes;
  pool.waitOpen = false;
  pool.waitVotes = {};
  if (yes > no && members.length > 0) {
    pool.since = now();
    pool.waitRound++;
    for (const id of members) {
      const c = clients.get(id);
      if (c) send(c.ws, { t: 'log', text: `Ждём дальше — большинство за. Круг ${pool.waitRound + 1}.` });
    }
  } else if (members.length >= 2) {
    for (const id of members) {
      const c = clients.get(id);
      if (c) send(c.ws, { t: 'log', text: 'Ждать не стали — в бой!' });
    }
    formRoom(members);
    return;
  } else {
    // один в поле — молча продлеваем, голосовать не с кем
    pool.since = now();
  }
  pushPool();
}

function tickPool(): void {
  pool.members = pool.members.filter(id => clients.has(id));
  if (pool.members.length === 0) {
    if (pool.waitOpen || pool.since !== 0) pool = freshPool();
    return;
  }
  if (!pool.waitOpen && now() - pool.since > WAIT_MS) {
    if (pool.members.length < 2) { pool.since = now(); return; }
    pool.waitOpen = true;
    pool.waitVotes = {};
    pool.waitEnds = now() + WAIT_VOTE_SECS * 1000;
    pushPool();
    return;
  }
  if (pool.waitOpen) {
    const voted = Object.keys(pool.waitVotes).length;
    if (voted >= pool.members.length || now() > pool.waitEnds) resolveWait();
  }
}
setInterval(tickPool, 5000);

function onSearch(c: Client): void {
  const wasInRoom = !!c.roomId;
  if (wasInRoom) detach(c);
  if (!pool.members.includes(c.id)) pool.members.push(c.id);
  if (!(c.id in pool.enter)) pool.enter[c.id] = false;
  if (wasInRoom) send(c.ws, { t: 'leftRoom' });
  send(c.ws, { t: 'queued', size: 0, waiting: pool.members.length });
  pushPool();
}

function onStop(c: Client): void {
  const pi = pool.members.indexOf(c.id);
  if (pi >= 0) pool.members.splice(pi, 1);
  delete pool.enter[c.id];
  delete pool.waitVotes[c.id];
  send(c.ws, { t: 'leftRoom' });
  pushPool();
}

function onVoteGame(c: Client, g: unknown): void {
  const v = String(g ?? 'any');
  c.gameVote = (v === 'any' || GAMES[v]) ? v : 'any';
  pushPool();
}

function onVoteEnter(c: Client, yes: unknown): void {
  if (!pool.members.includes(c.id)) return;
  pool.enter[c.id] = yes === true || yes === 'yes' || yes === 1;
  pushPool();
  tryForm();
}

function onVoteWait(c: Client, yes: unknown): void {
  if (!pool.waitOpen || !pool.members.includes(c.id)) return;
  pool.waitVotes[c.id] = yes === true || yes === 'yes' || yes === 1;
  pushPool();
  const members = pool.members.filter(id => clients.has(id));
  if (Object.keys(pool.waitVotes).length >= members.length) resolveWait();
}

/* ---------- приватные комнаты (доп-функция) ---------- */

function onCreate(c: Client, game: unknown): void {
  if (c.roomId) detach(c);
  const code = makeCode();
  const r: Room = {
    code, players: [c.id], host: c.id, private: true, game: sanitizeGame(game),
    phase: 'lobby', alive: [], contenders: [], rolls: {}, round: 0,
    timer: null, createdAt: now(), winner: null, gdata: {}, dstate: null, cstate: null, kstate: null,
  };
  rooms.set(code, r);
  c.roomId = code;
  send(c.ws, roomState(r));
  pushOnline();
}

/** Хост приватной комнаты меняет игру до старта. */
function onPickGame(c: Client, game: unknown): void {
  const r = c.roomId ? rooms.get(c.roomId) : undefined;
  if (!r || !r.private || r.phase !== 'lobby') return;
  if (r.host !== c.id) return send(c.ws, { t: 'err', msg: 'игру выбирает хост' });
  r.game = sanitizeGame(game);
  broadcast(r, roomState(r));
}

function onJoin(c: Client, code: unknown): void {
  const cc = String(code ?? '').toUpperCase().trim();
  const r = rooms.get(cc);
  if (!r) return send(c.ws, { t: 'err', msg: 'комнаты с таким кодом нет' });
  if (r.players.length >= gameCap(r.game)) return send(c.ws, { t: 'err', msg: `комната полна (${r.players.length}/${gameCap(r.game)})` });
  if (r.phase === 'play') return send(c.ws, { t: 'err', msg: 'бой уже идёт — дождись конца' });
  if (c.roomId) detach(c);
  c.roomId = r.code;
  r.players.push(c.id);
  send(c.ws, roomState(r));
  broadcast(r, { t: 'join', id: c.id, name: c.name }, c.id);
  broadcast(r, roomState(r), c.id); // хост и остальные видят новый состав сразу
  pushOnline();
}

function onStart(c: Client): void {
  const r = c.roomId ? rooms.get(c.roomId) : undefined;
  if (!r || !r.private) return;
  if (r.host !== c.id) return send(c.ws, { t: 'err', msg: 'старт даёт только хост' });
  if (r.players.length < 2) return send(c.ws, { t: 'err', msg: 'нужно хотя бы двое' });
  if (r.phase === 'play') return;
  startGame(r);
}

function onRematch(c: Client): void {
  const r = c.roomId ? rooms.get(c.roomId) : undefined;
  if (!r || r.phase !== 'over') return;
  if (r.private && r.host !== c.id) return send(c.ws, { t: 'err', msg: 'реванш запускает хост' });
  startGame(r);
}

function onChat(c: Client, text: unknown): void {
  const r = c.roomId ? rooms.get(c.roomId) : undefined;
  if (!r) return;
  if (now() - c.lastChat < 1500) return;
  const t = String(text ?? '').trim().slice(0, 140).replace(/[<>&]/g, '');
  if (!t) return;
  c.lastChat = now();
  broadcast(r, { t: 'chat', id: c.id, name: c.name, text: t });
}

/* ---------- дурак подкидной: проводка движка ---------- */

type DCard = EngineCard;

function parseDCard(v: unknown): DCard | null {
  const c = (v ?? {}) as Record<string, unknown>;
  if (typeof c.r !== 'number' || !Number.isInteger(c.r) || c.r < 6 || c.r > 14) return null;
  if (c.s !== 'S' && c.s !== 'H' && c.s !== 'D' && c.s !== 'C') return null;
  return { r: c.r, s: c.s as DCard['s'] };
}

function pushHands(r: Room): void {
  if (!r.dstate) return;
  for (const id of r.players) {
    const c = clients.get(id);
    const h = r.dstate.hands[id];
    if (c && h) send(c.ws, { t: 'hand', cards: h.map(x => ({ ...x })) });
  }
}

function finishDurak(r: Room, winner: string | null): void {
  killTimer(r);
  r.phase = 'over';
  r.winner = winner;
  r.alive = winner ? [winner] : [];
  r.rolls = {};
  const wname = (winner && clients.get(winner)?.name) ?? '???';
  broadcast(r, { t: 'over', winner: r.winner, name: wname });
  broadcast(r, roomState(r));
}

function startDurak(r: Room): void {
  r.dstate = createDurak([...r.players], Math.random);
  r.phase = 'play';
  r.alive = [...r.players];
  r.round = 0;
  broadcast(r, { t: 'log', text: `Бой начался! Игра — Дурак подкидной. Первый заходит ${clients.get(r.dstate.attacker)?.name ?? '???'}.` });
  broadcast(r, roomState(r));
  pushHands(r);
  dTick(r);
}

function dTick(r: Room): void {
  if (r.phase !== 'play' || !r.dstate) return;
  const secs = GAMES.durak.turnSecs;
  broadcast(r, roomState(r));
  broadcast(r, { t: 'dturn', attacker: r.dstate.attacker, defender: r.dstate.defender, secs });
  killTimer(r);
  r.timer = setTimeout(() => dTimeout(r), secs * 1000);
}

function dAfter(r: Room): void {
  if (!r.dstate) return;
  if (r.dstate.phase === 'over') return finishDurak(r, r.dstate.winner);
  pushHands(r);
  dTick(r);
}

function onDurakMove(c: Client, mv: Record<string, unknown>): void {
  const r = c.roomId ? rooms.get(c.roomId) : undefined;
  const st = r?.dstate;
  if (!r || !st || r.phase !== 'play') return;
  const kind = String(mv.kind ?? '');
  let echo: { card: DCard | null; target: DCard | null } = { card: null, target: null };
  let res: { ok: boolean; err?: string };
  if (kind === 'attack' || kind === 'throw') {
    const card = parseDCard(mv.card);
    if (!card) return send(c.ws, { t: 'err', msg: 'кривая карта' });
    echo = { card, target: null };
    res = durakApply(st, c.id, { kind: 'attack', card });
  } else if (kind === 'defend') {
    const card = parseDCard(mv.card);
    const target = parseDCard(mv.target);
    if (!card || !target) return send(c.ws, { t: 'err', msg: 'кривые карты' });
    echo = { card, target };
    res = durakApply(st, c.id, { kind: 'defend', card, target });
  } else if (kind === 'take') res = durakApply(st, c.id, { kind: 'take' });
  else if (kind === 'done') res = durakApply(st, c.id, { kind: 'done' });
  else return;
  if (!res.ok) return send(c.ws, { t: 'err', msg: res.err ?? 'так нельзя' });
  broadcast(r, { t: 'dmove', id: c.id, name: c.name, kind, card: echo.card, target: echo.target });
  dAfter(r);
}

function dTimeout(r: Room): void {
  if (r.phase !== 'play' || !r.dstate) return;
  const tm = durakTimeout(r.dstate);
  const who = clients.get(tm.by)?.name ?? '???';
  durakApply(r.dstate, tm.by, tm.kind === 'take' ? { kind: 'take' } : { kind: 'done' });
  broadcast(r, { t: 'log', text: `${who} молчал — клуб решил за него.` });
  broadcast(r, { t: 'dmove', id: tm.by, name: who, kind: tm.kind, card: null, target: null, auto: true });
  dAfter(r);
}

/** Уход посреди дурака: рука сгорает, живые доигрывают; остался один — чемпион. */
function durakLeave(r: Room, id: string): void {
  if (!r.dstate || r.phase !== 'play') return;
  const rest = durakRemove(r.dstate, id);
  if (rest.length <= 1) return finishDurak(r, rest[0] ?? null);
  pushHands(r);
  broadcast(r, roomState(r));
  dTick(r);
}

/* ---------- шахматы: проводка движка ---------- */

const REASON_TEXT: Record<string, string> = {
  mate: 'мат', stalemate: 'пат', resign: 'сдача', timeout: 'флаг',
  leave: 'уход соперника', material: 'мёртвая позиция',
  fifty: 'правило 50 ходов', repeat: 'троекратное повторение', draw: 'мировая',
};

function finishChess(r: Room): void {
  const st = r.cstate;
  if (!st) return;
  killTimer(r);
  r.phase = 'over';
  r.winner = st.winner;
  r.alive = st.winner ? [st.winner] : [];
  r.rolls = {};
  const wname = (st.winner && clients.get(st.winner)?.name) ?? null;
  const why = REASON_TEXT[st.reason ?? ''] ?? st.reason ?? 'конец';
  broadcast(r, {
    t: 'over', winner: r.winner,
    name: st.winner ? wname : `Ничья — ${why}`,
  });
  broadcast(r, roomState(r));
}

function startChess(r: Room): void {
  const whiteFirst = Math.random() < 0.5;
  const white = whiteFirst ? r.players[0] : r.players[1];
  const black = whiteFirst ? r.players[1] : r.players[0];
  r.cstate = createChess(white, black);
  r.phase = 'play';
  r.alive = [...r.players];
  r.round = 1;
  broadcast(r, {
    t: 'log',
    text: `Бой начался! Игра — Шахматы. Белые — ${clients.get(white)?.name ?? '???'}.`,
  });
  broadcast(r, roomState(r));
  chessTick(r);
}

function chessTick(r: Room): void {
  if (r.phase !== 'play' || !r.cstate) return;
  const secs = GAMES.chess.turnSecs;
  const st = r.cstate;
  broadcast(r, roomState(r));
  broadcast(r, {
    t: 'cturn',
    white: st.white, black: st.black,
    color: st.turn, secs,
  });
  killTimer(r);
  r.timer = setTimeout(() => chessTimeout(r), secs * 1000);
}

function chessAfter(r: Room): void {
  if (!r.cstate) return;
  if (r.cstate.phase === 'over') return finishChess(r);
  chessTick(r);
}

function parsePromo(v: unknown): 'q' | 'r' | 'b' | 'n' | undefined {
  return v === 'q' || v === 'r' || v === 'b' || v === 'n' ? v : undefined;
}

function onChessMove(c: Client, mv: Record<string, unknown>): void {
  const r = c.roomId ? rooms.get(c.roomId) : undefined;
  const st = r?.cstate;
  if (!r || !st || r.phase !== 'play') return;
  const kind = String(mv.kind ?? 'chess');
  if (kind === 'resign' || kind === 'draw' || kind === 'accept') {
    const res = chessApply(st, c.id,
      kind === 'resign' ? { kind: 'resign' } : kind === 'draw' ? { kind: 'draw' } : { kind: 'accept' });
    if (!res.ok) return send(c.ws, { t: 'err', msg: res.err ?? 'так нельзя' });
    broadcast(r, {
      t: 'cmove', id: c.id, name: c.name, kind,
      from: null, to: null, promote: null,
    });
    if (kind === 'draw') broadcast(r, { t: 'log', text: `${c.name} предлагает мировую.` });
    return chessAfter(r);
  }
  if (kind !== 'chess') return;
  const from = mv.from;
  const to = mv.to;
  if (typeof from !== 'number' || typeof to !== 'number'
    || !Number.isInteger(from) || !Number.isInteger(to)
    || from < 0 || from > 63 || to < 0 || to > 63) {
    return send(c.ws, { t: 'err', msg: 'кривые клетки' });
  }
  const res = chessApply(st, c.id, { from, to, promote: parsePromo(mv.promote) });
  if (!res.ok) return send(c.ws, { t: 'err', msg: res.err ?? 'так нельзя' });
  broadcast(r, {
    t: 'cmove', id: c.id, name: c.name, kind: 'chess',
    from, to, promote: parsePromo(mv.promote) ?? null,
  });
  chessAfter(r);
}

/** Флаг: сторона на ходу молчала — поражение по времени. */
function chessTimeout(r: Room): void {
  const st = r.cstate;
  if (r.phase !== 'play' || !st) return;
  const loser = st.turn === 'w' ? st.white : st.black;
  const who = clients.get(loser)?.name ?? '???';
  st.phase = 'over';
  st.winner = loser === st.white ? st.black : st.white;
  st.reason = 'timeout';
  st.history.push('флаг');
  broadcast(r, { t: 'log', text: `${who} прошляпил флаг — время вышло.` });
  broadcast(r, { t: 'cmove', id: loser, name: who, kind: 'flag', from: null, to: null, promote: null, auto: true });
  finishChess(r);
}

/** Уход посреди шахмат: оставшийся забирает бой. */
function chessLeave(r: Room, id: string): void {
  if (!r.cstate || r.phase !== 'play') return;
  chessRemove(r.cstate, id);
  finishChess(r);
}

/* ---------- шашки русские: проводка движка ---------- */

const KREASON_TEXT: Record<string, string> = {
  pieces: 'все шашки съедены', moves: 'ходов нет', resign: 'сдача', timeout: 'флаг',
  leave: 'уход соперника', repeat: 'троекратное повторение', draw: 'мировая',
};

function finishCheckers(r: Room): void {
  const st = r.kstate;
  if (!st) return;
  killTimer(r);
  r.phase = 'over';
  r.winner = st.winner;
  r.alive = st.winner ? [st.winner] : [];
  r.rolls = {};
  const wname = (st.winner && clients.get(st.winner)?.name) ?? null;
  const why = KREASON_TEXT[st.reason ?? ''] ?? st.reason ?? 'конец';
  broadcast(r, {
    t: 'over', winner: r.winner,
    name: st.winner ? wname : `Ничья — ${why}`,
  });
  broadcast(r, roomState(r));
}

function startCheckers(r: Room): void {
  const whiteFirst = Math.random() < 0.5;
  const white = whiteFirst ? r.players[0] : r.players[1];
  const black = whiteFirst ? r.players[1] : r.players[0];
  r.kstate = createCheckers(white, black);
  r.phase = 'play';
  r.alive = [...r.players];
  r.round = 1;
  broadcast(r, {
    t: 'log',
    text: `Бой начался! Игра — Шашки русские. Белые — ${clients.get(white)?.name ?? '???'}. Бить обязательно!`,
  });
  broadcast(r, roomState(r));
  checkersTick(r);
}

function checkersTick(r: Room): void {
  if (r.phase !== 'play' || !r.kstate) return;
  const secs = GAMES.checkers.turnSecs;
  const st = r.kstate;
  broadcast(r, roomState(r));
  broadcast(r, {
    t: 'hturn',
    white: st.white, black: st.black,
    color: st.turn, secs,
  });
  killTimer(r);
  r.timer = setTimeout(() => checkersTimeout(r), secs * 1000);
}

function checkersAfter(r: Room): void {
  if (!r.kstate) return;
  if (r.kstate.phase === 'over') return finishCheckers(r);
  checkersTick(r);
}

function onCheckersMove(c: Client, mv: Record<string, unknown>): void {
  const r = c.roomId ? rooms.get(c.roomId) : undefined;
  const st = r?.kstate;
  if (!r || !st || r.phase !== 'play') return;
  const kind = String(mv.kind ?? 'checkers');
  if (kind === 'resign' || kind === 'draw' || kind === 'accept') {
    const res = checkersApply(st, c.id,
      kind === 'resign' ? { kind: 'resign' } : kind === 'draw' ? { kind: 'draw' } : { kind: 'accept' });
    if (!res.ok) return send(c.ws, { t: 'err', msg: res.err ?? 'так нельзя' });
    broadcast(r, { t: 'hmove', id: c.id, name: c.name, kind, path: null });
    if (kind === 'draw') broadcast(r, { t: 'log', text: `${c.name} предлагает мировую.` });
    return checkersAfter(r);
  }
  if (kind !== 'checkers') return;
  const path = mv.path;
  if (!Array.isArray(path) || path.length < 2
    || path.some(x => typeof x !== 'number' || !Number.isInteger(x) || x < 0 || x > 63)) {
    return send(c.ws, { t: 'err', msg: 'кривой путь' });
  }
  const res = checkersApply(st, c.id, { path: path as number[] });
  if (!res.ok) return send(c.ws, { t: 'err', msg: res.err ?? 'так нельзя' });
  broadcast(r, {
    t: 'hmove', id: c.id, name: c.name, kind: 'checkers', path: [...(path as number[])],
  });
  checkersAfter(r);
}

/** Флаг: сторона на ходу молчала — поражение по времени. */
function checkersTimeout(r: Room): void {
  const st = r.kstate;
  if (r.phase !== 'play' || !st) return;
  const loser = st.turn === 'w' ? st.white : st.black;
  const who = clients.get(loser)?.name ?? '???';
  st.phase = 'over';
  st.winner = loser === st.white ? st.black : st.white;
  st.reason = 'timeout';
  st.history.push('флаг');
  broadcast(r, { t: 'log', text: `${who} прошляпил флаг — время вышло.` });
  broadcast(r, { t: 'hmove', id: loser, name: who, kind: 'flag', path: null, auto: true });
  finishCheckers(r);
}

/** Уход посреди шашек: оставшийся забирает бой. */
function checkersLeave(r: Room, id: string): void {
  if (!r.kstate || r.phase !== 'play') return;
  checkersRemove(r.kstate, id);
  finishCheckers(r);
}

/* ---------- кости на выбывание ---------- */

function startGame(r: Room): void {
  if (r.players.length < 2) return;
  if (r.game === 'durak') return startDurak(r);
  if (r.game === 'chess') return startChess(r);
  if (r.game === 'checkers') return startCheckers(r);
  r.phase = 'play';
  r.alive = [...r.players];
  r.contenders = [];
  r.round = 0;
  r.winner = null;
  broadcast(r, { t: 'log', text: `Бой начался! Игра — ${GAMES[r.game]?.label ?? r.game}. На поле ${r.alive.length} братух.` });
  nextRound(r);
}

function needRolls(r: Room): string[] {
  const who = r.contenders.length > 0 ? r.contenders : r.alive;
  return who.filter(id => r.rolls[id] === undefined);
}

function nextRound(r: Room): void {
  r.round++;
  r.rolls = {};
  killTimer(r);
  broadcast(r, roomState(r));
  broadcast(r, { t: 'round', round: r.round, need: needRolls(r), secs: ROUND_SECS });
  r.timer = setTimeout(() => {
    for (const id of needRolls(r)) {
      r.rolls[id] = rnd(6);
      broadcast(r, { t: 'roll', id, name: clients.get(id)?.name ?? '???', v: r.rolls[id], auto: true });
    }
    resolveRound(r);
  }, ROUND_SECS * 1000);
}

function resolveRound(r: Room): void {
  killTimer(r);
  const who = r.contenders.length > 0 ? r.contenders : r.alive;
  const vals = who.map(id => ({ id, v: r.rolls[id] ?? rnd(6) }));
  const min = Math.min(...vals.map(x => x.v));
  const lows = vals.filter(x => x.v === min);
  if (lows.length === vals.length) {
    broadcast(r, { t: 'log', text: `Раунд ${r.round}: все по ${min} — переброс!` });
    r.contenders = [];
    return nextRound(r);
  }
  if (lows.length === 1) {
    const out = lows[0];
    r.alive = r.alive.filter(id => id !== out.id);
    r.contenders = [];
    broadcast(r, {
      t: 'elim', id: out.id, name: clients.get(out.id)?.name ?? '???',
      v: out.v, round: r.round, alive: [...r.alive],
    });
    if (r.alive.length === 1) return finishGame(r);
    return nextRound(r);
  }
  r.contenders = lows.map(x => x.id);
  broadcast(r, {
    t: 'log',
    text: `За вылет спорят ${lows.map(x => clients.get(x.id)?.name ?? '???').join(' и ')} (по ${min}) — переброс!`,
  });
  return nextRound(r);
}

function finishGame(r: Room): void {
  killTimer(r);
  r.phase = 'over';
  r.winner = r.alive[0] ?? null;
  r.contenders = [];
  const wname = (r.winner && clients.get(r.winner)?.name) ?? '???';
  broadcast(r, { t: 'over', winner: r.winner, name: wname });
  broadcast(r, roomState(r));
}

function onRoll(c: Client): void {
  const r = c.roomId ? rooms.get(c.roomId) : undefined;
  if (!r || r.phase !== 'play') return;
  if (!needRolls(r).includes(c.id)) return;
  r.rolls[c.id] = rnd(6);
  broadcast(r, { t: 'roll', id: c.id, name: c.name, v: r.rolls[c.id], auto: false });
  if (needRolls(r).length === 0) resolveRound(r);
  else broadcast(r, roomState(r));
}

/* ---------- плагины ходов: generic move, у костей roll — его частный случай ---------- */

type Plugin = { onMove(c: Client, mv: Record<string, unknown>): void };

const PLUGINS: Record<string, Plugin> = {
  dice: { onMove(c, mv) { if (mv.kind === 'roll') onRoll(c); } },
  durak: { onMove(c, mv) { onDurakMove(c, mv); } },
  chess: { onMove(c, mv) { onChessMove(c, mv); } },
  checkers: { onMove(c, mv) { onCheckersMove(c, mv); } },
};

function onMove(c: Client, mv: unknown): void {
  const r = c.roomId ? rooms.get(c.roomId) : undefined;
  if (!r || r.phase !== 'play') return;
  const m = (mv ?? {}) as Record<string, unknown>;
  (PLUGINS[r.game] ?? PLUGINS.dice).onMove(c, m);
}

function onMessage(c: Client, raw: string): void {
  if (raw.length > 65536) return; // флуд-контроль размера
  let m: Record<string, unknown>;
  try { m = JSON.parse(raw); } catch { return; }
  c.lastSeen = now();
  switch (m.t) {
    case 'ping': return send(c.ws, { t: 'pong' });
    case 'hello':
      c.name = cleanName(m.name);
      send(c.ws, { t: 'welcome', id: c.id, online: clients.size, games: gameCatalog() });
      if (c.roomId) {
        const hr = rooms.get(c.roomId);
        const hh = hr?.game === 'durak' ? hr.dstate?.hands[c.id] : undefined;
        if (hr && hh) {
          send(c.ws, roomState(hr));
          send(c.ws, { t: 'hand', cards: hh.map(x => ({ ...x })) });
        }
      }
      pushOnline();
      return;
    case 'search': return onSearch(c);
    case 'stop': return onStop(c);
    case 'voteGame': return onVoteGame(c, m.game);
    case 'voteEnter': return onVoteEnter(c, m.yes);
    case 'voteWait': return onVoteWait(c, m.yes);
    case 'create': return onCreate(c, m.game);
    case 'pickGame': return onPickGame(c, m.game);
    case 'join': return onJoin(c, m.code);
    case 'leave': return leaveRoom(c);
    case 'start': return onStart(c);
    case 'rematch': return onRematch(c);
    case 'roll': return onRoll(c);
    case 'move': return onMove(c, m.move);
    case 'chat': return onChat(c, m.text);
  }
}

function sweep(): void {
  const t = now();
  let gone = false;
  for (const [id, c] of clients) {
    if (t - c.lastSeen > IDLE_SECS * 1000) {
      try { c.ws.close(); } catch { /* уже мёртв */ }
      detach(c);
      clients.delete(id);
      gone = true;
    }
  }
  if (gone) pushOnline();
  for (const [code, r] of rooms) {
    if (r.players.length === 0 || t - r.createdAt > 2 * 3600 * 1000) destroyRoom(code);
  }
}
setInterval(sweep, 30_000);

const server = import.meta.main ? Bun.serve({
  port: PORT,
  fetch(req, srv) {
    const u = new URL(req.url);
    if (u.pathname === '/api/ws' && srv.upgrade(req)) return undefined;
    if (u.pathname === '/api/online' && req.method === 'GET') {
      return Response.json({ online: clients.size, rooms: rooms.size, pool: pool.members.length });
    }
    return new Response('arena42', { status: 404 });
  },
  websocket: {
    open(ws) {
      const c: Client = {
        id: `p${seq++}`, name: `Боец-${seq}`,
        ws: ws as unknown as WebSocket, roomId: null, gameVote: 'any', lastSeen: now(), lastChat: 0,
      };
      clients.set(c.id, c);
    },
    message(ws, msg) {
      const c = [...clients.values()].find(x => x.ws === (ws as unknown as WebSocket));
      if (c) onMessage(c, String(msg));
    },
    close(ws) {
      const c = [...clients.values()].find(x => x.ws === (ws as unknown as WebSocket));
      if (!c) return;
      detach(c);
      clients.delete(c.id);
      pushOnline();
    },
  },
}) : null;

if (import.meta.main) console.log(`АРЕНА на посту :${PORT} 🏆`);
export { server, clients, rooms };
