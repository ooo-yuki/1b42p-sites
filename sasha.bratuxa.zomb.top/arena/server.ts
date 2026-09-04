/* АРЕНА 42 — сервер лобби и костей на выбывание. Bun, ноль зависимостей.
   WS на /api/ws (роутер туннелит wss://sasha.bratuxa.zomb.top/api/ws),
   счётчик онлайна на GET /api/online. Фишек нет: победа — в летопись. */

const PORT = 8094;
const ROUND_SECS = 12;
const IDLE_SECS = 90;
const CODE_ALPHA = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

type Phase = 'lobby' | 'play' | 'over';

type Client = {
  id: string;
  name: string;
  ws: WebSocket;
  roomId: string | null;
  lastSeen: number;
  lastChat: number;
};

type Room = {
  code: string;
  players: string[];
  host: string;
  private: boolean;
  size: number; // 0 = приватная, ждут старта хоста
  phase: Phase;
  alive: string[];
  contenders: string[];
  rolls: Record<string, number>;
  round: number;
  timer: ReturnType<typeof setTimeout> | null;
  createdAt: number;
  winner: string | null;
};

const clients = new Map<string, Client>();
const rooms = new Map<string, Room>();
const queue = new Map<number, string[]>();
let seq = 1;

const rnd = (n: number): number => 1 + Math.floor(Math.random() * n);
const now = (): number => Date.now();

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
    t: 'room', code: r.code, phase: r.phase,
    players: memberViews(r), host: r.host,
    size: r.size, private: r.private,
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

function onlineCount(): number {
  return clients.size;
}

function pushOnline(): void {
  const n = onlineCount();
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
  for (const [size, arr] of queue) {
    const i = arr.indexOf(code);
    if (i >= 0) arr.splice(i, 1);
    if (arr.length === 0) queue.delete(size);
  }
}

function leaveRoom(c: Client): void {
  const code = c.roomId;
  if (!code) return;
  const r = rooms.get(code);
  c.roomId = null;
  if (!r) return;
  // очередь быстрого боя: просто выйти из списка ожидания
  for (const [, arr] of queue) {
    const i = arr.indexOf(c.id);
    if (i >= 0) arr.splice(i, 1);
  }
  r.players = r.players.filter(id => id !== c.id);
  r.alive = r.alive.filter(id => id !== c.id);
  r.contenders = r.contenders.filter(id => id !== c.id);
  delete r.rolls[c.id];
  if (r.players.length === 0) { destroyRoom(code); return; }
  if (r.host === c.id) r.host = r.players[0];
  if (r.phase === 'play') {
    // ушедший с поля боя считается выбитым — честно для оставшихся
    broadcast(r, { t: 'left', id: c.id, name: c.name });
    if (r.alive.length === 1) return finishGame(r);
    if (r.contenders.length > 0 && r.contenders.every(id => r.rolls[id] !== undefined)) {
      return resolveRound(r);
    }
    if (r.alive.every(id => r.rolls[id] !== undefined)) return resolveRound(r);
  }
  broadcast(r, roomState(r));
}

function joinRoom(c: Client, r: Room): void {
  if (c.roomId) leaveRoom(c);
  c.roomId = r.code;
  r.players.push(c.id);
  send(c.ws, roomState(r));
  broadcast(r, { t: 'join', id: c.id, name: c.name }, c.id);
  pushOnline();
}

/* ---------- кости на выбывание ---------- */

function startGame(r: Room): void {
  if (r.players.length < 2) return;
  r.phase = 'play';
  r.alive = [...r.players];
  r.round = 0;
  r.winner = null;
  broadcast(r, { t: 'log', text: `Бой начался! На поле ${r.alive.length} братух.` });
  nextRound(r);
}

function needRolls(r: Room): string[] {
  const who = r.contenders.length > 0 ? r.contenders : r.alive;
  return who.filter(id => r.rolls[id] === undefined);
}

function nextRound(r: Room): void {
  r.round++;
  r.rolls = {};
  if (r.contenders.length === 0) r.contenders = [];
  killTimer(r);
  broadcast(r, roomState(r));
  broadcast(r, { t: 'round', round: r.round, need: needRolls(r), secs: ROUND_SECS });
  r.timer = setTimeout(() => {
    // таймер: за молчунов кидает сервер
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
    // круговая ничья — переброс, никто не падает
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
  // ничья за вылет — переброс только между ними
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

function onQueue(c: Client, size: number): void {
  if (![2, 3, 4, 5].includes(size)) return send(c.ws, { t: 'err', msg: 'патя 2–5 братух' });
  if (c.roomId) leaveRoom(c);
  const arr = queue.get(size) ?? [];
  if (!arr.includes(c.id)) arr.push(c.id);
  queue.set(size, arr);
  send(c.ws, { t: 'queued', size, waiting: arr.length });
  if (arr.length >= size) {
    const ids = arr.splice(0, size);
    if (arr.length === 0) queue.delete(size);
    const code = makeCode();
    const r: Room = {
      code, players: [], host: ids[0], private: false, size,
      phase: 'lobby', alive: [], contenders: [], rolls: {}, round: 0,
      timer: null, createdAt: now(), winner: null,
    };
    rooms.set(code, r);
    for (const id of ids) {
      const m = clients.get(id);
      if (m) { m.roomId = code; r.players.push(id); }
    }
    if (r.players.length < 2) { destroyRoom(code); return; }
    r.host = r.players[0];
    broadcast(r, roomState(r));
    startGame(r);
  }
}

function onCreate(c: Client): void {
  if (c.roomId) leaveRoom(c);
  const code = makeCode();
  const r: Room = {
    code, players: [c.id], host: c.id, private: true, size: 0,
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
  joinRoom(c, r);
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

function onMessage(c: Client, raw: string): void {
  let m: Record<string, unknown>;
  try { m = JSON.parse(raw); } catch { return; }
  c.lastSeen = now();
  switch (m.t) {
    case 'ping': return send(c.ws, { t: 'pong' });
    case 'hello':
      c.name = cleanName(m.name);
      send(c.ws, { t: 'welcome', id: c.id, online: onlineCount() });
      pushOnline();
      return;
    case 'queue': return onQueue(c, Number(m.size));
    case 'create': return onCreate(c);
    case 'join': return onJoin(c, m.code);
    case 'leave': leaveRoom(c); return send(c.ws, { t: 'leftRoom' });
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
      leaveRoom(c);
      clients.delete(id);
    }
  }
  for (const [code, r] of rooms) {
    if (r.players.length === 0 || t - r.createdAt > 2 * 3600 * 1000) destroyRoom(code);
  }
}
setInterval(sweep, 30_000);

const server = Bun.serve({
  port: PORT,
  fetch(req, srv) {
    const u = new URL(req.url);
    if (u.pathname === '/api/ws' && srv.upgrade(req)) return undefined;
    if (u.pathname === '/api/online' && req.method === 'GET') {
      return Response.json({ online: onlineCount(), rooms: rooms.size });
    }
    return new Response('arena42', { status: 404 });
  },
  websocket: {
    open(ws) {
      const c: Client = {
        id: `p${seq++}`, name: `Боец-${seq}`,
        ws: ws as unknown as WebSocket, roomId: null, lastSeen: now(), lastChat: 0,
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
      leaveRoom(c);
      clients.delete(c.id);
      pushOnline();
    },
  },
});

console.log(`АРЕНА на посту :${PORT} 🏆`);
export { server, clients, rooms };
