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

type GameDef = { label: string; min: number; max: number };
const GAMES: Record<string, GameDef> = {
  dice: { label: 'Кости на выбывание', min: 2, max: 5 },
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

function roomState(r: Room): Record<string, unknown> {
  return {
    t: 'room', code: r.code, phase: r.phase, game: r.game,
    gameLabel: GAMES[r.game]?.label ?? r.game,
    players: memberViews(r), host: r.host,
    private: r.private,
    round: r.round, alive: [...r.alive], contenders: [...r.contenders],
    rolls: { ...r.rolls }, winner: r.winner,
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
  return Object.fromEntries(Object.entries(GAMES).map(([k, g]) => [k, { label: g.label, min: g.min, max: g.max }]));
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
      : { open: false, round: pool.waitRound },
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

function formRoom(ids: string[]): void {
  const fitted = ids.slice(0, 5);
  if (fitted.length < 2) return;
  const code = makeCode();
  const game = decideGame(fitted);
  const r: Room = {
    code, players: [], host: fitted[0], private: false, game,
    phase: 'lobby', alive: [], contenders: [], rolls: {}, round: 0,
    timer: null, createdAt: now(), winner: null,
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
    formRoom(members.slice(0, 5));
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

function onCreate(c: Client): void {
  if (c.roomId) detach(c);
  const code = makeCode();
  const r: Room = {
    code, players: [c.id], host: c.id, private: true, game: 'dice',
    phase: 'lobby', alive: [], contenders: [], rolls: {}, round: 0,
    timer: null, createdAt: now(), winner: null,
  };
  rooms.set(code, r);
  c.roomId = code;
  send(c.ws, roomState(r));
  pushOnline();
}

function onJoin(c: Client, code: unknown): void {
  const cc = String(code ?? '').toUpperCase().trim();
  const r = rooms.get(cc);
  if (!r) return send(c.ws, { t: 'err', msg: 'комнаты с таким кодом нет' });
  if (r.players.length >= 5) return send(c.ws, { t: 'err', msg: 'комната полна (5/5)' });
  if (r.phase === 'play') return send(c.ws, { t: 'err', msg: 'бой уже идёт — дождись конца' });
  if (c.roomId) detach(c);
  c.roomId = r.code;
  r.players.push(c.id);
  send(c.ws, roomState(r));
  broadcast(r, { t: 'join', id: c.id, name: c.name }, c.id);
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

/* ---------- кости на выбывание ---------- */

function startGame(r: Room): void {
  if (r.players.length < 2) return;
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
      pushOnline();
      return;
    case 'search': return onSearch(c);
    case 'stop': return onStop(c);
    case 'voteGame': return onVoteGame(c, m.game);
    case 'voteEnter': return onVoteEnter(c, m.yes);
    case 'voteWait': return onVoteWait(c, m.yes);
    case 'create': return onCreate(c);
    case 'join': return onJoin(c, m.code);
    case 'leave': return leaveRoom(c);
    case 'start': return onStart(c);
    case 'rematch': return onRematch(c);
    case 'roll': return onRoll(c);
    case 'chat': return onChat(c, m.text);
  }
}

function sweep(): void {
  const t = now();
  for (const [id, c] of clients) {
    if (t - c.lastSeen > IDLE_SECS * 1000) {
      try { c.ws.close(); } catch { /* уже мёртв */ }
      detach(c);
      clients.delete(id);
    }
  }
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
