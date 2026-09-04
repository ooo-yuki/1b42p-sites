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
const check = await fetch('http://127.0.0.1:8094/api/online').then((r) => r.json());
console.log('online:', JSON.stringify(check));
if (check.online < 3) throw new Error('онлайн врёт!');
for (const p of players) p.ws.close();
console.log('ARENA E2E v2 PASS 🏆');
process.exit(0);
