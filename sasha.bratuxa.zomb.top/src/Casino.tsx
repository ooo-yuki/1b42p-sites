import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useBeacon } from './hooks';
import './casino.css';

const LS = 'sasha_casino';
const START_BALANCE = 1000;
const BONUS = 500;
const BONUS_CD = 60;

type Save = { balance: number; bonusTs: number };

function load(): Save {
  try {
    const raw = localStorage.getItem(LS);
    if (raw) {
      const o = JSON.parse(raw) as Partial<Save>;
      if (typeof o.balance === 'number') return { balance: Math.max(0, Math.floor(o.balance)), bonusTs: o.bonusTs || 0 };
    }
  } catch { /* свежий кошелёк */ }
  return { balance: START_BALANCE, bonusTs: 0 };
}

const reduced =
  typeof matchMedia !== 'undefined' &&
  matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- кейсы ---------- */
type Drop = { em: string; label: string; amount: number; w: number };
type CaseDef = { id: string; em: string; name: string; price: number; desc: string; drops: Drop[] };

const CASES: CaseDef[] = [
  { id: 'barracks', em: '📦', name: 'Казарма', price: 100, desc: 'Скромно, но со вкусом',
    drops: [
      { em: '🪖', label: 'Каска', amount: 50, w: 35 },
      { em: '🥾', label: 'Берцы', amount: 80, w: 30 },
      { em: '🎖️', label: 'Медалька', amount: 120, w: 20 },
      { em: '🔥', label: 'Запал', amount: 200, w: 11 },
      { em: '💰', label: 'Касса части', amount: 500, w: 4 },
    ] },
  { id: 'arsenal', em: '🧰', name: 'Арсенал', price: 300, desc: 'Для тех, кто в теме',
    drops: [
      { em: '🔫', label: 'Глок', amount: 150, w: 32 },
      { em: '🛡️', label: 'Броник', amount: 250, w: 28 },
      { em: '🚛', label: 'Урал', amount: 400, w: 22 },
      { em: '🚀', label: 'Ракета', amount: 700, w: 13 },
      { em: '👑', label: 'Звезда генерала', amount: 1500, w: 5 },
    ] },
  { id: 'hq42', em: '💼', name: 'Штаб 42', price: 1000, desc: 'Олл-ин по-батальонному',
    drops: [
      { em: '📻', label: 'Рация', amount: 500, w: 30 },
      { em: '🗺️', label: 'Карта', amount: 800, w: 27 },
      { em: '⚓', label: 'Якорь Авроры', amount: 1200, w: 23 },
      { em: '🦅', label: 'Орёл', amount: 2500, w: 14 },
      { em: '4️⃣2️⃣', label: 'Джекпот 42', amount: 10000, w: 6 },
    ] },
];

function pickDrop(drops: Drop[]): Drop {
  const total = drops.reduce((s, d) => s + d.w, 0);
  let x = Math.random() * total;
  for (const d of drops) { x -= d.w; if (x < 0) return d; }
  return drops[drops.length - 1];
}

/* ---------- лошади ---------- */
type Horse = { id: string; em: string; name: string; odds: number };
const HORSES: Horse[] = [
  { id: 'tornado', em: '🌪️', name: 'Торнадо', odds: 1.8 },
  { id: 'bratuxa', em: '🛞', name: 'Братуха', odds: 2.5 },
  { id: 'vihr', em: '🐎', name: 'Вихрь', odds: 4 },
  { id: 'pyat', em: '🦄', name: 'Пятёрка', odds: 7 },
];

const SLOT_EMOJI = ['🍒', '🍋', '⭐', '💰', '🎰', '7️⃣'];

/* ================= страница ================= */
export default function Casino(): JSX.Element {
  useBeacon();
  const [balance, setBalance] = useState<number>(() => load().balance);
  const [bonusTs, setBonusTs] = useState<number>(() => load().bonusTs);
  const balRef = useRef(balance);
  balRef.current = balance;

  useEffect(() => {
    try { localStorage.setItem(LS, JSON.stringify({ balance, bonusTs })); } catch { /* не влезло */ }
  }, [balance, bonusTs]);

  const takeBonus = (): void => {
    const wait = BONUS_CD - Math.floor((Date.now() - bonusTs) / 1000);
    if (wait > 0) { setMsg(`Касса пуста, заходи через ${wait}с ⏳`); return; }
    setBalance(b => b + BONUS);
    setBonusTs(Date.now());
    setMsg(`+${BONUS} фишек от батальона 🏆`);
  };

  const [msg, setMsg] = useState('Фишки фантики, азарт настоящий 🏆');

  /* ----- кейсы ----- */
  const [caseBusy, setCaseBusy] = useState(false);
  const openCase = (c: CaseDef): void => {
    if (caseBusy) return;
    if (balRef.current < c.price) { setMsg(`На «${c.name}» не хватает: надо ${c.price} 💸`); return; }
    setBalance(b => b - c.price);
    setCaseBusy(true);
    const win = pickDrop(c.drops);
    const cells: Drop[] = Array.from({ length: 30 }, () => pickDrop(c.drops));
    cells[24] = win;
    const strip = document.getElementById('strip');
    const wrap = document.getElementById('stripWrap');
    if (strip && wrap) {
      strip.innerHTML = cells.map(d => `<div class="cell"><span class="e">${d.em}</span>${d.amount}</div>`).join('');
      wrap.classList.add('open');
      const target = 24 * 94 - 60;
      gsap.fromTo(strip, { x: 0 }, {
        x: -target, duration: reduced ? 0.3 : 3.2, ease: 'power3.out',
        onComplete: () => {
          setBalance(b => b + win.amount);
          setMsg(win.amount >= c.price
            ? `${win.em} ${win.label}: +${win.amount}! Кейс окупился 🤑`
            : `${win.em} ${win.label}: +${win.amount}. Бывает 💩`);
          setCaseBusy(false);
        },
      });
    } else {
      setBalance(b => b + win.amount);
      setMsg(`${win.em} ${win.label}: +${win.amount}`);
      setCaseBusy(false);
    }
  };

  /* ----- краш ----- */
  const [bet, setBet] = useState('50');
  const [crashOn, setCrashOn] = useState(false);
  const [dead, setDead] = useState(false);
  const [mult, setMult] = useState(1);
  const crashRef = useRef<{ live: boolean; m: number; stake: number; raf: number }>({ live: false, m: 1, stake: 0, raf: 0 });
  const cvRef = useRef<HTMLCanvasElement | null>(null);

  const drawCrash = (m: number, dead: boolean): void => {
    const cv = cvRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const W = (cv.width = cv.clientWidth * 2);
    const H = (cv.height = 440);
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = dead ? '#ff3b3b' : '#37d67a';
    ctx.lineWidth = 6;
    ctx.beginPath();
    const pts = 60;
    for (let i = 0; i <= pts; i++) {
      const t = i / pts;
      const mm = 1 + (m - 1) * t;
      const x = 20 + t * (W - 40);
      const y = H - 30 - Math.min(1, (mm - 1) / Math.max(0.01, m - 1 || 1)) * (H - 70);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.stroke();
  };

  const startCrash = (): void => {
    if (crashRef.current.live) return;
    const stake = Math.floor(Number(bet));
    if (!isFinite(stake) || stake < 10) { setMsg('Ставка от 10 фишек 🎲'); return; }
    if (balRef.current < stake) { setMsg(`Не хватает: надо ${stake} 💸`); return; }
    setBalance(b => b - stake);
    const r = Math.random();
    const point = r < 0.03 ? 1 : Math.max(1, (0.97 / (1 - r)) * 0.97 + 0.03);
    const st = crashRef.current;
    st.live = true; st.m = 1; st.stake = stake;
    setCrashOn(true); setMult(1); setDead(false);
    setMsg(`Ракета пошла! Жми «Забрать», пока не бахнуло 🚀`);
    const t0 = performance.now();
    const speed = reduced ? 0.9 : 0.32;
    const step = (t: number): void => {
      if (!st.live) return;
      st.m = Math.exp(((t - t0) / 1000) * speed);
      if (st.m >= point) {
        st.live = false;
        setMult(point); setCrashOn(false); setDead(true);
        drawCrash(point, true);
        setMsg(`💥 Крэш на ×${point.toFixed(2)}! Минус ${stake}.`);
        return;
      }
      setMult(st.m);
      drawCrash(st.m, false);
      st.raf = requestAnimationFrame(step);
    };
    st.raf = requestAnimationFrame(step);
  };

  const cashOut = (): void => {
    const st = crashRef.current;
    if (!st.live) return;
    st.live = false;
    cancelAnimationFrame(st.raf);
    const win = Math.floor(st.stake * st.m);
    setBalance(b => b + win);
    setCrashOn(false); setDead(false);
    setMsg(`✅ Забрал ×${st.m.toFixed(2)}: +${win}!`);
  };

  useEffect(() => () => {
    crashRef.current.live = false;
    cancelAnimationFrame(crashRef.current.raf);
  }, []);

  /* ----- лошади ----- */
  const [horse, setHorse] = useState(HORSES[1].id);
  const [hbet, setHbet] = useState('50');
  const [racing, setRacing] = useState(false);
  const [pos, setPos] = useState<number[]>(HORSES.map(() => 0));

  const startRace = (): void => {
    if (racing) return;
    const stake = Math.floor(Number(hbet));
    if (!isFinite(stake) || stake < 10) { setMsg('Ставка от 10 фишек 🐎'); return; }
    if (balRef.current < stake) { setMsg(`Не хватает: надо ${stake} 💸`); return; }
    setBalance(b => b - stake);
    setRacing(true);
    setPos(HORSES.map(() => 0));
    const p = HORSES.map(() => 0);
    const timer = window.setInterval(() => {
      let winner = -1;
      for (let i = 0; i < p.length; i++) {
        p[i] += 1.5 + Math.random() * 5;
        if (p[i] >= 100 && winner < 0) winner = i;
      }
      setPos([...p]);
      if (winner >= 0) {
        window.clearInterval(timer);
        const h = HORSES[winner];
        if (h.id === horse) {
          const win = Math.floor(stake * h.odds);
          setBalance(b => b + win);
          setMsg(`${h.em} ${h.name} первый! ×${h.odds}: +${win} 🏆`);
        } else {
          setMsg(`${h.em} ${h.name} первый. Твоя лошадь мимо, минус ${stake} 💩`);
        }
        setRacing(false);
      }
    }, reduced ? 30 : 120);
  };

  /* ----- слоты ----- */
  const [reels, setReels] = useState(['7️⃣', '🎰', '🍒']);
  const [spinning, setSpinning] = useState(false);

  const spin = (): void => {
    if (spinning) return;
    if (balRef.current < 50) { setMsg('Спин стоит 50. Возьми бонус 💸'); return; }
    setBalance(b => b - 50);
    setSpinning(true);
    const final = [0, 1, 2].map(() => SLOT_EMOJI[Math.floor(Math.random() * SLOT_EMOJI.length)]);
    let ticks = 0;
    const timer = window.setInterval(() => {
      ticks++;
      setReels([0, 1, 2].map(i => (ticks > (i + 1) * 4 ? final[i] : SLOT_EMOJI[Math.floor(Math.random() * SLOT_EMOJI.length)])));
      if (ticks > 14) {
        window.clearInterval(timer);
        setReels(final);
        setSpinning(false);
        const [a, b2, c] = final;
        if (a === '7️⃣' && b2 === '7️⃣' && c === '7️⃣') {
          setBalance(x => x + 1000); setMsg('7️⃣7️⃣7️⃣ ДЖЕКПОТ: +1000! 👑');
        } else if (a === b2 && b2 === c) {
          setBalance(x => x + 250); setMsg(`Три ${a}: +250! 🤑`);
        } else if (a === b2 || b2 === c || a === c) {
          setBalance(x => x + 100); setMsg('Пара: +100 🙂');
        } else {
          setMsg('Мимо. Ещё по одной? 🎰');
        }
      }
    }, reduced ? 30 : 90);
  };

  return (
    <>
      <div className="cbar">
        <span>🪙</span><span className="bal">{balance}</span>
        <span className="sp" />
        <button className="cbtn ghost" onClick={takeBonus}>+500 фишек</button>
      </div>
      <main><div className="cwrap">
        <div className="chead">
          <h1><span className="r">Казино</span> <span className="g">42</span></h1>
          <p>Фишки фантики, азарт настоящий. Кейсы, крэш, лошади и слоты — всё на территории Саши.</p>
        </div>
        <div className="clog">{msg}</div>

        <section className="csec">
          <h2>📈 Краш</h2>
          <p className="hint">Множитель растёт, пока ракета летит. Забирай до крэша — иначе ставка сгорает.</p>
          <div className={dead ? 'crashnum dead' : 'crashnum'}>×{mult.toFixed(2)}</div>
          <canvas id="crashCv" ref={cvRef} />
          <div className="crow" style={{ marginTop: 12 }}>
            <input className="cin" value={bet} onChange={e => setBet(e.target.value)} inputMode="numeric" aria-label="Ставка на краш" />
            {!crashOn
              ? <button className="cbtn" onClick={startCrash}>Погнали 🚀</button>
              : <button className="cbtn" onClick={cashOut}>Забрать ✅</button>}
          </div>
        </section>

        <section className="csec">
          <h2>📦 Кейсы</h2>
          <p className="hint">Платишь за кейс — лента крутится, что выпало, то твоё.</p>
          <div className="cases">
            {CASES.map(c => (
              <div className="case" key={c.id}>
                <div className="em">{c.em}</div><b>{c.name}</b>
                <small>{c.desc}</small>
                <div className="price">{c.price} фишек</div>
                <button className="cbtn" disabled={caseBusy} onClick={() => openCase(c)}>Открыть</button>
              </div>
            ))}
          </div>
          <div id="stripWrap"><div id="strip" /></div>
        </section>

        <section className="csec">
          <h2>🐎 Лошади</h2>
          <p className="hint">Выбери лошадь, поставь фишки. Кто первый до финиша — тот и прав.</p>
          <div className="hpick">
            {HORSES.map(h => (
              <button key={h.id} className={horse === h.id ? 'sel' : ''} onClick={() => setHorse(h.id)}>
                {h.em} {h.name} ×{h.odds}
              </button>
            ))}
          </div>
          {HORSES.map((h, i) => (
            <div className="horse" key={h.id}>
              <div className="nm"><b>{h.em} {h.name}</b> · ×{h.odds}</div>
              <div className="track">
                <span className="run" style={{ left: `calc(${Math.min(96, pos[i])}% )` }}>{h.em}</span>
                <span className="fin">🏁</span>
              </div>
            </div>
          ))}
          <div className="crow" style={{ marginTop: 12 }}>
            <input className="cin" value={hbet} onChange={e => setHbet(e.target.value)} inputMode="numeric" aria-label="Ставка на лошадь" />
            <button className="cbtn" disabled={racing} onClick={startRace}>{racing ? 'Скачут…' : 'Старт 🐎'}</button>
          </div>
        </section>

        <section className="csec">
          <h2>🎰 Слоты</h2>
          <p className="hint">Спин — 50 фишек. Три семёрки — джекпот 1000, три одинаковых — 250, пара — 100.</p>
          <div id="slots">
            {reels.map((r, i) => <div className="reel" key={i}>{r}</div>)}
          </div>
          <div className="crow" style={{ justifyContent: 'center' }}>
            <button className="cbtn" disabled={spinning} onClick={spin}>{spinning ? 'Крутится…' : 'Крутить за 50'}</button>
          </div>
        </section>

        <div className="cnav">
          <a className="cbtn ghost" href="game.html" style={{ textDecoration: 'none' }}>🎮 Игра</a>
          <a className="cbtn ghost" href="index.html" style={{ textDecoration: 'none' }}>🏠 Главная</a>
          <a className="cbtn ghost" href="https://hub.bratuxa.zomb.top" style={{ textDecoration: 'none' }}>🏆 Хаб</a>
        </div>
        <p className="cfoot">Фишки ничего не стоят и ни на что не меняются. Мы уже победили 🏆</p>
      </div></main>
    </>
  );
}
