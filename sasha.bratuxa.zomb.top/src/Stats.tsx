import { useEffect, useRef, useState } from 'react';
import { startBeacon } from './lib/beacon';
import './style.css';

const API = 'https://hub.bratuxa.zomb.top/api/stats';

const NAMES: Record<string, string> = {
  hub: '🏠 Хаб', chaev: '🦖 Чаев', doom: '🔥 Дум', evaelph: '🧝 Эввград',
  smolgrad: '👑 Смолград', miqqil: '🛞 Танки', setden: '🌪️ Сетден',
  svyatoslav: '⚡ Святослав', denis: '🏝️ Денис', sasha: '⭐ Саша',
};
const COLORS: Record<string, string> = {
  hub: '#ffd23f', chaev: '#7CFC00', doom: '#ff6b35', evaelph: '#ff7bac',
  smolgrad: '#c9b458', miqqil: '#4fc3f7', setden: '#ba68c8',
  svyatoslav: '#ffee58', denis: '#80deea', sasha: '#ff4d4d',
};
const ORDER = ['hub', 'chaev', 'doom', 'evaelph', 'smolgrad', 'miqqil', 'setden', 'svyatoslav', 'denis', 'sasha'];

interface HistPoint {
  ts: string;
  per_site: Record<string, number>;
  total: number;
}
interface Stats {
  ok: boolean;
  online: Record<string, number>;
  onlineTotal: number;
  everTotal: number;
  everPerSite: Array<{ site: string; n: number }>;
  maxOnline: number;
  maxAt: string | null;
  history: HistPoint[];
}

function drawGraph(cv: HTMLCanvasElement, h: HistPoint[]): void {
  const ctx = cv.getContext('2d');
  if (!ctx) return;
  const W = cv.width;
  const H = cv.height;
  const pad = 34;
  ctx.clearRect(0, 0, W, H);
  if (!h.length) {
    ctx.fillStyle = '#f5f0dc';
    ctx.fillText('Пока нет истории — заходи позже!', 20, 30);
    return;
  }
  let max = 1;
  h.forEach((p) => {
    if (p.total > max) max = p.total;
  });
  const X = (i: number): number => pad + (i * (W - 2 * pad)) / Math.max(1, h.length - 1);
  const Y = (v: number): number => H - pad - (v * (H - 2 * pad)) / max;
  ctx.strokeStyle = '#556';
  ctx.beginPath();
  ctx.moveTo(pad, pad);
  ctx.lineTo(pad, H - pad);
  ctx.lineTo(W - pad, H - pad);
  ctx.stroke();
  ctx.fillStyle = '#e8edff';
  ctx.font = '12px sans-serif';
  for (let g = 0; g <= 4; g++) {
    const v = Math.round((max * g) / 4);
    ctx.fillText(String(v), 4, Y(v) + 4);
  }
  const sites: Record<string, boolean> = {};
  h.forEach((p) => {
    Object.keys(p.per_site || {}).forEach((s) => {
      sites[s] = true;
    });
  });
  Object.keys(sites).forEach((s) => {
    ctx.strokeStyle = COLORS[s] || '#fff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    h.forEach((p, i) => {
      const v = (p.per_site || {})[s] || 0;
      if (i === 0) ctx.moveTo(X(i), Y(v));
      else ctx.lineTo(X(i), Y(v));
    });
    ctx.stroke();
  });
  ctx.lineWidth = 1;
  let lx = X(0);
  Object.keys(sites).forEach((s) => {
    const label = NAMES[s] || s;
    ctx.fillStyle = COLORS[s] || '#fff';
    ctx.fillRect(lx, H - 14, 10, 10);
    ctx.fillStyle = '#e8edff';
    ctx.fillText(label, lx + 13, H - 5);
    lx += ctx.measureText(label).width + 28;
  });
  const t0 = new Date(h[0].ts);
  const t1 = new Date(h[h.length - 1].ts);
  const fmt = (d: Date): string =>
    d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  ctx.fillStyle = '#e8edff';
  ctx.fillText(fmt(t0), pad, H - 16);
  const e = fmt(t1);
  ctx.fillText(e, W - pad - ctx.measureText(e).width, H - 16);
}

export default function Stats(): JSX.Element {
  const [st, setSt] = useState<Stats | null>(null);
  const [upd, setUpd] = useState('');
  const cvRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    startBeacon('sasha');
    let dead = false;
    const load = async (): Promise<void> => {
      try {
        const r = await (await fetch(API)).json();
        if (dead || !r.ok) return;
        setSt(r as Stats);
        setUpd(new Date().toLocaleTimeString('ru-RU'));
      } catch {
        /* offline — тихо */
      }
    };
    void load();
    const t = setInterval(() => void load(), 30000);
    return () => {
      dead = true;
      clearInterval(t);
    };
  }, []);

  useEffect(() => {
    if (st && cvRef.current) drawGraph(cvRef.current, st.history || []);
  }, [st]);

  const nm = (s: string): string => NAMES[s] || s;
  return (
    <div style={{ minHeight: '100vh', background: '#1c2b1e', color: '#f5f0dc', padding: 16, fontFamily: 'system-ui,sans-serif' }}>
      <h1 style={{ color: '#ffd23f', margin: '0 0 4px' }}>📡 Трекер онлайна 1Б42П</h1>
      <div style={{ opacity: 0.8, fontSize: 14 }}>
        <a style={{ color: '#ffd23f' }} href="/">← На страницу Саши</a> · трекер by <b>Саша ⁴²</b> · {upd && `обновлено ${upd}`}
      </div>
      <h2>🟢 Сейчас онлайн: {st ? st.onlineTotal : '…'}</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, margin: '12px 0' }}>
        {ORDER.map((s) => (
          <div key={s} style={{ background: '#2f5d3a', borderRadius: 14, padding: '12px 16px', minWidth: 130 }}>
            <b style={{ fontSize: 26, color: '#ffd23f' }}>{st ? st.online[s] || 0 : '…'}</b>
            <small style={{ display: 'block', opacity: 0.8 }}>{nm(s)}</small>
          </div>
        ))}
      </div>
      <h2>👣 Всего заходило: {st ? st.everTotal : '…'}</h2>
      <table style={{ borderCollapse: 'collapse', margin: '12px 0', background: '#243b28', borderRadius: 10 }}>
        <tbody>
          <tr>
            <th style={{ padding: '8px 14px', textAlign: 'left' }}>Сайт</th>
            <th style={{ padding: '8px 14px', textAlign: 'left' }}>Гостей</th>
          </tr>
          {(st ? st.everPerSite : []).map((x) => (
            <tr key={x.site}>
              <td style={{ padding: '8px 14px' }}>{nm(x.site)}</td>
              <td style={{ padding: '8px 14px' }}>{x.n}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>
        🏆 Рекорд онлайна: {st ? st.maxOnline : '…'}
        <small style={{ opacity: 0.7, fontSize: 13 }}>
          {' '}
          {st?.maxAt ? `(${new Date(st.maxAt).toLocaleString('ru-RU')})` : ''}
        </small>
      </h2>
      <h2>📈 Онлайн за 24 часа</h2>
      <canvas ref={cvRef} width={900} height={300} style={{ background: '#243b28', borderRadius: 14, maxWidth: '100%' }} />
      <div style={{ opacity: 0.7, fontSize: 13, marginTop: 8 }}>
        Маяк шлёт heartbeat каждые 30 сек · онлайн = был в последние 90 сек · срез истории — раз в минуту
      </div>
    </div>
  );
}
