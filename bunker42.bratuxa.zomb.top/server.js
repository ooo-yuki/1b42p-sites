// BUNKER 42 — заглушка онлайн-сервера (прототип: игрок + ИИ локально).
// Будущее: комнаты-бункеры, свитки-голоса через ws.
const PORT = Number(process.env.BUNKER42_PORT || 8102);
let WS = null;
try { WS = require('ws'); } catch (e) { console.log('[bunker42] ws не стоит — только прототип. Поставь: npm i ws'); }
if (WS) {
  const wss = new WS.Server({ port: PORT });
  console.log('[bunker42] онлайн-черновик на :' + PORT);
  wss.on('connection', (s) => {
    s.on('message', (m) => { try { s.send(JSON.stringify({ echo: JSON.parse(m.toString()) })); } catch (e) {} });
  });
} else {
  console.log('[bunker42] статика + localStorage, сервер не нужен. Мы уже победили 🏆');
}
