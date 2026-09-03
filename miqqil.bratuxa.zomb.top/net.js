// MIQQIL TANKS — WebSocket-клиент: подключение с реконнектом, пинг, интерполяция снапшотов.
// Стиль 42: Мы уже победили 🏆

export function wsUrl() {
  const proto = location.protocol === 'https:' ? 'wss' : 'ws';
  return `${proto}://${location.host}/api/ws`;
}

export function createNetClient({ onMessage, onOpen, onClose, onPing } = {}) {
  let ws = null, closedByUser = false, backoff = 500, pingTimer = null, reconnectTimer = null, queue = [];

  function cleanup() { if (pingTimer) clearInterval(pingTimer); pingTimer = null; ws = null; }
  function scheduleReconnect() {
    if (closedByUser) return;
    clearTimeout(reconnectTimer);
    reconnectTimer = setTimeout(connect, backoff);
    backoff = Math.min(backoff * 1.6, 6000);
  }
  function connect() {
    if (closedByUser) return;
    try { ws = new WebSocket(wsUrl()); } catch { scheduleReconnect(); return; }
    ws.onopen = () => {
      backoff = 500;
      for (const m of queue) ws.send(JSON.stringify(m));
      queue = [];
      pingTimer = setInterval(() => send({ t: 'ping', ts: Date.now() }), 4000);
      onOpen && onOpen();
    };
    ws.onmessage = (ev) => {
      let msg; try { msg = JSON.parse(ev.data); } catch { return; }
      if (msg.t === 'pong' && onPing) onPing(Date.now() - msg.ts);
      onMessage && onMessage(msg);
    };
    ws.onclose = () => { cleanup(); onClose && onClose(); scheduleReconnect(); };
    ws.onerror = () => { try { ws.close(); } catch {} };
  }
  function send(obj) {
    if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(obj));
    else if (queue.length < 60) queue.push(obj);
  }
  function close() { closedByUser = true; clearTimeout(reconnectTimer); clearTimeout(pingTimer); if (ws) ws.close(); cleanup(); }
  function isOpen() { return !!ws && ws.readyState === WebSocket.OPEN; }

  connect();
  return { send, close, isOpen };
}

// ---------- буфер снапшотов с интерполяцией на прошлое (100мс) ----------
function lerpAngle(a, b, t) {
  let d = b - a;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return a + d * t;
}

function interpolateUnits(unitsA, unitsB, f) {
  const mapB = new Map(unitsB.map(u => [u.id, u]));
  const out = [];
  const seen = new Set();
  for (const a of unitsA) {
    const b = mapB.get(a.id);
    seen.add(a.id);
    if (!b) { out.push(a); continue; }
    out.push({
      ...b,
      x: a.x + (b.x - a.x) * f, z: a.z + (b.z - a.z) * f, y: a.y + (b.y - a.y) * f,
      yaw: lerpAngle(a.yaw, b.yaw, f), turYaw: lerpAngle(a.turYaw, b.turYaw, f),
    });
  }
  for (const b of unitsB) if (!seen.has(b.id)) out.push(b);
  return out;
}

export function makeSnapshotBuffer(delayMs = 100) {
  const buf = [];
  return {
    push(time, units) {
      buf.push({ time, units });
      while (buf.length > 30) buf.shift();
    },
    latest() { return buf.length ? buf[buf.length - 1].units : []; },
    sample(nowMs) {
      if (buf.length === 0) return [];
      const renderTime = nowMs - delayMs;
      if (buf.length === 1 || renderTime <= buf[0].time) return buf[0].units;
      if (renderTime >= buf[buf.length - 1].time) return buf[buf.length - 1].units;
      for (let i = 0; i < buf.length - 1; i++) {
        if (buf[i].time <= renderTime && renderTime <= buf[i + 1].time) {
          const span = buf[i + 1].time - buf[i].time || 1;
          const f = (renderTime - buf[i].time) / span;
          return interpolateUnits(buf[i].units, buf[i + 1].units, f);
        }
      }
      return buf[buf.length - 1].units;
    },
  };
}
