/* E2E арены v2: ТРИ живых клиента — поиск, голос за игру, голос за заход,
   полный бой до победы. Никаких моков. */
export {};
const WSURL = 'ws://127.0.0.1:8094/api/ws';

function client(name: string) {
  const ws = new WebSocket(WSURL);
  const seen: any[] = [];
  const used = new Set<any>();
  const waiters: ((m: any) => boolean)[] = [];
  ws.onmessage = (ev: MessageEvent) => {
    const m = JSON.parse(String(ev.data));
    seen.push(m);
    for (let i = waiters.length - 1; i >= 0; i--) {
      if (waiters[i](m)) waiters.splice(i, 1);
    }
  };
  const ready = new Promise<void>((res, rej) => {
    ws.onopen = () => { ws.send(JSON.stringify({ t: 'hello', name })); res(); };
    ws.onerror = rej;
  });
  const waitFor = (pred: (m: any) => boolean, ms = 20000) =>
    new Promise<any>((res, rej) => {
      const fresh = (m: any): boolean => !used.has(m) && pred(m);
      const hit = seen.find(fresh);
      if (hit) { used.add(hit); return res(hit); }
      const to = setTimeout(() => rej(new Error(`timeout waiting ${name}`)), ms);
      waiters.push((m) => {
        if (fresh(m)) { used.add(m); clearTimeout(to); res(m); return true; }
        return false;
      });
    });
  const send = (o: any) => ws.send(JSON.stringify(o));
  return { ws, ready, waitFor, send, seen };
}

const A = client('Тест-А');
const B = client('Тест-Б');
const V = client('Тест-В');
await Promise.all([A.ready, B.ready, V.ready]);
const wA = await A.waitFor((m) => m.t === 'welcome');
const wB = await B.waitFor((m) => m.t === 'welcome');
await V.waitFor((m) => m.t === 'welcome');
const idOf = new Map([[A, wA.id], [B, wB.id]]);
// голос за игру: двое за кости, третий на «любой»
A.send({ t: 'voteGame', game: 'dice' });
B.send({ t: 'voteGame', game: 'dice' });

// в поиск — все трое
A.send({ t: 'search' });
B.send({ t: 'search' });
V.send({ t: 'search' });
const poolMsg = await A.waitFor((m) => m.t === 'pool' && m.members.length === 3);
console.log('pool:', poolMsg.members.map((p: any) => `${p.name}:${p.vote}`).join(', '));

// голос за заход: двое «за» из троих — большинство, в бой идут согласные.
// третий остаётся в пуле (проверяем и это).
A.send({ t: 'voteEnter', yes: true });
B.send({ t: 'voteEnter', yes: true });
const [ra, rb] = await Promise.all([
  A.waitFor((m) => m.t === 'room'),
  B.waitFor((m) => m.t === 'room'),
]);
if (ra.code !== rb.code) throw new Error('разные комнаты!');
console.log('room:', ra.code, 'game:', ra.gameLabel, 'players:', ra.players.length);
if (ra.game !== 'dice') throw new Error('не та игра!');
if (ra.players.length !== 2) throw new Error('в бой пошли не те!');
const vPool = await V.waitFor((m) => m.t === 'pool' && m.members.length === 1);
console.log('V остался в пуле:', vPool.members.map((p: any) => p.name).join(','));

// полный бой вдвоём: кидают все, у кого нет броска
const players = [A, B];
let over: any = null;
const t0 = Date.now();
while (!over && Date.now() - t0 < 120000) {
  const roundP = await Promise.race([
    A.waitFor((m) => m.t === 'round'),
    A.waitFor((m) => m.t === 'over', 120000),
  ]);
  if (roundP.t === 'over') { over = roundP; break; }
  const need: string[] = roundP.need;
  for (const p of players) {
    if (need.includes(idOf.get(p))) p.send({ t: 'roll' });
  }
  const maybeOver = await Promise.race([
    A.waitFor((m) => m.t === 'over', 25000).catch(() => null),
    A.waitFor((m) => m.t === 'round').then(() => null),
  ]);
  if (maybeOver) { over = maybeOver; break; }
}
if (!over) throw new Error('бой не кончился!');
console.log('winner:', over.name);

// приватный трек: создание с битой игрой → dice, битый pickGame → dice,
// вход по коду, старт хостом, бой через generic move (путь плагина).
const D = client('Тест-Д');
const E = client('Тест-Е');
await Promise.all([D.ready, E.ready]);
const wD = await D.waitFor((m) => m.t === 'welcome');
const wE = await E.waitFor((m) => m.t === 'welcome');
idOf.set(D, wD.id);
idOf.set(E, wE.id);
D.send({ t: 'create', game: 'zzz' });
const rc = await D.waitFor((m) => m.t === 'room' && m.private);
if (rc.game !== 'dice') throw new Error('битая игра не погасилась в dice!');
console.log('private room:', rc.code, 'game:', rc.game);
D.send({ t: 'pickGame', game: 'zzz' });
const rc2 = await D.waitFor((m) => m.t === 'room' && m.private && m.game === 'dice');
if (rc2.code !== rc.code) throw new Error('pickGame сменил комнату!');
E.send({ t: 'join', code: rc.code });
await E.waitFor((m) => m.t === 'room' && m.code === rc.code);
await D.waitFor((m) => m.t === 'join' && m.id === wE.id);
D.send({ t: 'start' });
let overP: any = null;
const t1 = Date.now();
const duo = [D, E];
while (!overP && Date.now() - t1 < 120000) {
  const roundP = await Promise.race([
    D.waitFor((m) => m.t === 'round'),
    D.waitFor((m) => m.t === 'over', 120000),
  ]);
  if (roundP.t === 'over') { overP = roundP; break; }
  const need2: string[] = roundP.need;
  for (const p of duo) {
    if (need2.includes(idOf.get(p))) p.send({ t: 'move', move: { kind: 'roll' } });
  }
  const maybeOver = await Promise.race([
    D.waitFor((m) => m.t === 'over', 25000).catch(() => null),
    D.waitFor((m) => m.t === 'round').then(() => null),
  ]);
  if (maybeOver) { overP = maybeOver; break; }
}
if (!overP) throw new Error('приватный бой не кончился!');
console.log('private winner:', overP.name);

// дурак-трек: приватная комната с игрой, ИИ-пилоты играют до чемпиона.
const F = client('Тест-Ж');
const G = client('Тест-З');
await Promise.all([F.ready, G.ready]);
const wF = await F.waitFor((m) => m.t === 'welcome');
const wG = await G.waitFor((m) => m.t === 'welcome');
idOf.set(F, wF.id);
idOf.set(G, wG.id);
F.send({ t: 'create', game: 'durak' });
const rd = await F.waitFor((m) => m.t === 'room' && m.private);
if (rd.game !== 'durak') throw new Error('приватка не с дураком!');
G.send({ t: 'join', code: rd.code });
await G.waitFor((m) => m.t === 'room' && m.code === rd.code);
F.send({ t: 'start' });
const beatsE = (a: any, d: any, trump: string): boolean =>
  d.s === a.s ? d.r > a.r : (d.s === trump && a.s !== trump);
const lastHand = new Map<any, any[]>([[F, []], [G, []]]);
const syncHands = (P: any): void => {
  for (let i = P.seen.length - 1; i >= 0; i--) {
    if (P.seen[i].t === 'hand') { lastHand.set(P, P.seen[i].cards); break; }
  }
};
const lowFirst = (cards: any[], trump: string): any[] =>
  [...cards].sort((x, y) => (x.s === trump ? 100 + x.r : x.r) - (y.s === trump ? 100 + y.r : y.r));
function durakStep(P: any, g: any): void {
  syncHands(P);
  const me = idOf.get(P);
  const hand = lastHand.get(P) ?? [];
  if (hand.length === 0) return;
  const table = g.table as any[];
  const uncovered = table.filter((t) => !t.d);
  if (g.defender === me) {
    const avail = [...hand];
    for (const u of uncovered) {
      const b = lowFirst(avail.filter((c) => beatsE(u.a, c, g.trump)), g.trump)[0];
      if (!b) { P.send({ t: 'move', move: { kind: 'take' } }); return; }
      P.send({ t: 'move', move: { kind: 'defend', card: b, target: u.a } });
      avail.splice(avail.indexOf(b), 1);
    }
    return;
  }
  if (table.length === 0) {
    if (g.attacker !== me) return;
    P.send({ t: 'move', move: { kind: 'attack', card: lowFirst(hand, g.trump)[0] } });
    return;
  }
  if (table.length < 6) {
    const ranks = new Set(table.flatMap((t) => [t.a.r, ...(t.d ? [t.d.r] : [])]));
    const c = lowFirst(hand.filter((x) => ranks.has(x.r)), g.trump)[0];
    if (c) { P.send({ t: 'move', move: { kind: 'attack', card: c } }); return; }
  }
  if (g.attacker === me && uncovered.length === 0) P.send({ t: 'move', move: { kind: 'done' } });
}
let overD: any = null;
{
  const t2 = Date.now();
  let cur: any = await F.waitFor((m) => m.t === 'room' && m.phase === 'play');
  await F.waitFor((m) => m.t === 'hand', 40000);
  await G.waitFor((m) => m.t === 'hand', 40000);
  while (!overD && Date.now() - t2 < 150000) {
    durakStep(F, cur.gdata);
    durakStep(G, cur.gdata);
    const nxt = await Promise.race([
      F.waitFor((m) => m.t === 'room' && m.phase === 'play').catch(() => null),
      F.waitFor((m) => m.t === 'hand').catch(() => null),
      G.waitFor((m) => m.t === 'hand').catch(() => null),
      F.waitFor((m) => m.t === 'over', 150000).catch(() => null),
    ]);
    if (!nxt) continue;
    if (nxt.t === 'over') { overD = nxt; break; }
    if (nxt.t === 'room') cur = nxt;
  }
}
if (!overD) throw new Error('дурак не кончился!');
if (!overD.winner) throw new Error('дурак без чемпиона!');
console.log('durak winner:', overD.name);
for (const p of [F, G]) p.ws.close();
const check = await fetch('http://127.0.0.1:8094/api/online').then((r) => r.json());
console.log('online:', JSON.stringify(check));
if (check.online < 3) throw new Error('онлайн врёт!');
for (const p of players) p.ws.close();
for (const p of duo) p.ws.close();
V.ws.close();
console.log('ARENA E2E v2 PASS 🏆');
process.exit(0);
