/* E2E арены: ТРИ настоящих WS-клиента, живой сервер, полный бой до победы.
   Никаких моков — реальный матчмейкинг и реальные кости. */
const WSURL = 'ws://127.0.0.1:8094/api/ws';

function client(name: string) {
  const ws = new WebSocket(WSURL);
  const seen: any[] = [];
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
      const from = seen.length;
      const hit = seen.slice(from).find(pred);
      if (hit) return res(hit);
      const to = setTimeout(() => rej(new Error(`timeout waiting ${name}`)), ms);
      waiters.push((m) => {
        if (seen.indexOf(m) >= from && pred(m)) { clearTimeout(to); res(m); return true; }
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
await A.waitFor((m) => m.t === 'welcome');
await B.waitFor((m) => m.t === 'welcome');
await V.waitFor((m) => m.t === 'welcome');

A.send({ t: 'queue', size: 3 });
B.send({ t: 'queue', size: 3 });
V.send({ t: 'queue', size: 3 });

// все трое — в одной комнате, бой начался
const [ra, rb, rv] = await Promise.all([
  A.waitFor((m) => m.t === 'room'),
  B.waitFor((m) => m.t === 'room'),
  V.waitFor((m) => m.t === 'room'),
]);
if (!(ra.code === rb.code && rb.code === rv.code)) throw new Error('разные комнаты!');
console.log('room:', ra.code, 'players:', ra.players.length);

// играем до конца: на каждый round кидают все, у кого нет броска
const players = [A, B, V];
let over: any = null;
const t0 = Date.now();
while (!over && Date.now() - t0 < 90000) {
  const roundP = await Promise.race([
    A.waitFor((m) => m.t === 'round'),
    A.waitFor((m) => m.t === 'over', 90000),
  ]);
  if (roundP.t === 'over') { over = roundP; break; }
  const need: string[] = roundP.need;
  // маппим id игроков: узнаём свои id из последнего room
  const lastRoom = [...A.seen].reverse().find((m) => m.t === 'room');
  const ids: string[] = lastRoom.players.map((p: any) => p.id);
  for (let i = 0; i < players.length; i++) {
    if (need.includes(ids[i])) players[i].send({ t: 'roll' });
  }
  const maybeOver = await Promise.race([
    A.waitFor((m) => m.t === 'over', 20000).catch(() => null),
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
console.log('ARENA E2E PASS 🏆');
process.exit(0);
