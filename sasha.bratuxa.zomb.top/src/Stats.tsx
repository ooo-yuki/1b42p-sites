import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { startBeacon } from './lib/beacon';
import './stats.css';
import { Activity, ChartLine, Medal, Radio, Trophy, Users } from 'lucide-react';

const API = 'https://hub.bratuxa.zomb.top/api/stats';
const reduced =
  typeof matchMedia !== 'undefined' &&
  matchMedia('(prefers-reduced-motion: reduce)').matches;

const NAMES: Record<string, string> = {
  hub: 'Хаб', chaev: 'Чаев', doom: 'Дум', evaelph: 'Эввград',
  smolgrad: 'Смолград', miqqil: 'Танки', setden: 'Сетден',
  svyatoslav: 'Святослав', denis: 'Денис', sasha: 'Саша', gtaevv: 'GTAEVV',
};
const COLORS: Record<string, string> = {
  hub: '#ffd23f', chaev: '#7CFC00', doom: '#ff6b35', evaelph: '#ff7bac',
  smolgrad: '#c9b458', miqqil: '#4fc3f7', setden: '#ba68c8',
  svyatoslav: '#ffee58', denis: '#80deea', sasha: '#ff4d4d', gtaevv: '#00e5ff',
};
const ORDER = ['hub', 'chaev', 'doom', 'evaelph', 'smolgrad', 'miqqil', 'setden', 'svyatoslav', 'denis', 'sasha', 'gtaevv'];
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
  const pad = 36;
  ctx.clearRect(0, 0, W, H);
  if (!h.length) {
    ctx.fillStyle = '#8a93c9';
    ctx.font = '14px sans-serif';
    ctx.fillText('Пока нет истории — заходи позже!', 20, 40);
    return;
  }
  let max = 1;
  h.forEach((p) => {
    if (p.total > max) max = p.total;
  });
  const X = (i: number): number => pad + (i * (W - 2 * pad)) / Math.max(1, h.length - 1);
  const Y = (v: number): number => H - pad - (v * (H - 2 * pad)) / max;
  ctx.strokeStyle = 'rgba(232,237,255,.06)';
  ctx.lineWidth = 1;
  ctx.fillStyle = '#5a6396';
  ctx.font = '12px sans-serif';
  for (let g = 0; g <= 4; g++) {
    const v = Math.round((max * g) / 4);
    ctx.beginPath();
    ctx.moveTo(pad, Y(v));
    ctx.lineTo(W - pad, Y(v));
    ctx.stroke();
    ctx.fillText(String(v), 6, Y(v) + 4);
  }
  const sites: Record<string, boolean> = {};
  h.forEach((p) => {
    Object.keys(p.per_site || {}).forEach((s) => {
      sites[s] = true;
    });
  });
  // заливка под общей линией
  const grad = ctx.createLinearGradient(0, pad, 0, H - pad);
  grad.addColorStop(0, 'rgba(255,210,63,.35)');
  grad.addColorStop(1, 'rgba(255,210,63,0)');
  ctx.beginPath();
  h.forEach((p, i) => {
    if (i === 0) ctx.moveTo(X(i), Y(p.total));
    else ctx.lineTo(X(i), Y(p.total));
  });
  ctx.lineTo(X(h.length - 1), H - pad);
  ctx.lineTo(X(0), H - pad);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();
  const lines: Array<{ key: string; get: (p: HistPoint) => number; color: string; w: number }> = [
    { key: 'total', get: (p) => p.total, color: '#ffd23f', w: 3 },
    ...Object.keys(sites).map((s) => ({
      key: s,
      get: (p: HistPoint) => (p.per_site || {})[s] || 0,
      color: COLORS[s] || '#fff',
      w: 1.5,
    })),
  ];
  lines.forEach((ln) => {
    ctx.strokeStyle = ln.color;
    ctx.lineWidth = ln.w;
    ctx.beginPath();
    h.forEach((p, i) => {
      if (i === 0) ctx.moveTo(X(i), Y(ln.get(p)));
      else ctx.lineTo(X(i), Y(ln.get(p)));
    });
    ctx.stroke();
  });
  ctx.lineWidth = 1;
  let lx = X(0);
  ctx.font = '12px sans-serif';
  Object.keys(sites).forEach((s) => {
    const label = NAMES[s] || s;
    ctx.fillStyle = COLORS[s] || '#fff';
    ctx.fillRect(lx, H - 14, 10, 10);
    ctx.fillStyle = '#e8edff';
    ctx.fillText(label, lx + 13, H - 5);
    lx += ctx.measureText(label).width + 28;
  });
  const fmt = (d: Date): string =>
    d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const t0 = new Date(h[0].ts);
  const t1 = new Date(h[h.length - 1].ts);
  ctx.fillStyle = '#8a93c9';
  ctx.fillText(fmt(t0), pad, H - 16);
  const e = fmt(t1);
  ctx.fillText(e, W - pad - ctx.measureText(e).width, H - 16);
}

/** Плавный счётчик: дотягивает число до цели */
function Count({ to }: { to: number }): JSX.Element {
  const [v, setV] = useState(to);
  const ref = useRef({ n: to });
  useEffect(() => {
    if (reduced) {
      setV(to);
      ref.current.n = to;
      return;
    }
    const o = ref.current;
    const tw = gsap.to(o, {
      n: to, duration: 0.8, ease: 'power2.out',
      onUpdate: () => setV(Math.round(o.n)),
    });
    return () => {
      tw.kill();
    };
  }, [to]);
  return <>{v}</>;
}

export default function Stats(): JSX.Element {
  const [st, setSt] = useState<Stats | null>(null);
  const [upd, setUpd] = useState('');
  const cvRef = useRef<HTMLCanvasElement | null>(null);
  const first = useRef(true);

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
    if (st && first.current && !reduced) {
      first.current = false;
      gsap.from('.stx-hero', { y: 26, autoAlpha: 0, duration: 0.7, ease: 'power3.out' });
      gsap.from('.stx-card', { y: 22, autoAlpha: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out', delay: 0.15 });
      gsap.from('.stx-sec', { y: 24, autoAlpha: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out', delay: 0.3 });
    }
  }, [st]);

  useEffect(() => {
    if (reduced) return;
    const tw = gsap.to('.stx-dot', { scale: 1.35, opacity: 0.7, duration: 0.9, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    return () => {
      tw.kill();
    };
  }, []);

  const nm = (s: string): string => NAMES[s] || s;
  const onlineMax = Math.max(1, ...ORDER.map((s) => (st?.online[s] || 0)));
  const medalClass = ['gold', 'silver', 'bronze'];

  return (
    <div className="stx">
      <div className="stx-inner">
        <div className="stx-top">
          <div>
            <h1 className="stx-title">
              <Radio data-icon="inline-start" /> Трекер онлайна <span className="r">1Б</span><span className="b">42П</span>
            </h1>
            <div className="stx-sub">
              <a href="/">← На страницу Саши</a> · трекер by <b>Саша ⁴²</b>
              {upd && ` · обновлено ${upd}`}
            </div>
          </div>
        </div>

        <div className="stx-hero">
          <div className="stx-dot" />
          <div>
            <div className="stx-big">{st ? <Count to={st.onlineTotal} /> : '…'}</div>
            <div className="stx-big-label">сейчас онлайн по всему батальону</div>
          </div>
        </div>

        <div className="stx-sec">
          <h2 className="stx-sec-t"><Activity data-icon="inline-start" /> По сайтам</h2>
          <div className="stx-grid" style={{ marginTop: 12 }}>
            {ORDER.map((s) => {
              const n = st?.online[s] || 0;
              return (
                <div key={s} className={`stx-card${n > 0 ? ' hot' : ''}`}>
                  <div className="n">{st ? <Count to={n} /> : '…'}</div>
                  <div className="s">{nm(s)}</div>
                  <div className="stx-bar">
                    <i style={{ width: `${Math.round((n / onlineMax) * 100)}%`, background: COLORS[s] }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="stx-sec">
          <h2 className="stx-sec-t"><Users data-icon="inline-start" /> Всего заходило: {st ? <Count to={st.everTotal} /> : '…'}</h2>
          <table className="stx-table" style={{ marginTop: 12 }}>
            <tbody>
              <tr>
                <th>Сайт</th>
                <th>Гостей</th>
              </tr>
              {(st ? st.everPerSite : []).map((x, i) => (
                <tr key={x.site} className={x.site === 'sasha' ? 'me' : ''}>
                  <td>{i < 3 ? <Medal className={`medal ${medalClass[i]}`} aria-label={`Место ${i + 1}`} /> : ''}{nm(x.site)}</td>
                  <td>{x.n}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="stx-sec">
          <div className="stx-rec">
            <span className="cup"><Trophy aria-hidden /></span>
            <div>
              <b>{st ? <Count to={st.maxOnline} /> : '…'}</b>
              <div>
                <small>
                  рекорд онлайна
                  {st?.maxAt ? ` · ${new Date(st.maxAt).toLocaleString('ru-RU')}` : ''}
                </small>
              </div>
            </div>
          </div>
        </div>

        <div className="stx-sec">
          <h2 className="stx-sec-t"><ChartLine data-icon="inline-start" /> Онлайн за 24 часа</h2>
          <div className="stx-graph-wrap" style={{ marginTop: 12 }}>
            <canvas ref={cvRef} width={900} height={300} />
          </div>
          <div className="stx-foot" style={{ marginTop: 8 }}>
            Маяк шлёт heartbeat каждые 30 сек · онлайн = был в последние 90 сек · срез истории — раз в минуту
          </div>
        </div>
      </div>
    </div>
  );
}
