// MAFIA 42 — заглушка онлайн-сервера (прототип играет локально, хот-сит).
// Будущее: комнаты, фазы ночи/дня, кастеты-голоса через ws.
const PORT = Number(process.env.MAFIA42_PORT || 8101);
let WS = null;
try { WS = require('ws'); } catch (e) { console.log('[mafia42] ws не стоит — только прототип. Поставь: npm i ws'); }
if (WS) {
  const wss = new WS.Server({ port: PORT });
  console.log('[mafia42] онлайн-черновик на :' + PORT);
  wss.on('connection', (s) => {
    s.on('message', (m) => { try { s.send(JSON.stringify({ echo: JSON.parse(m.toString()) })); } catch (e) {} });
  });
} else {
  console.log('[mafia42] статика + localStorage, сервер не нужен. Мы уже победили 🏆');
}
