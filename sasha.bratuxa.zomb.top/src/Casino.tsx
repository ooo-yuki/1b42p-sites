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
  const lastStake = useRef(0);

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

  /* ----- рулетка ----- */
  const [rbet, setRbet] = useState('50');
  const [rchoice, setRchoice] = useState('red');
  const [rnum, setRnum] = useState<number | null>(null);
  const [rspinning, setRspinning] = useState(false);
  const EU_REDS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

  const spinRoulette = (): void => {
    if (rspinning) return;
    const stake = Math.floor(Number(rbet));
    if (!isFinite(stake) || stake < 10) { setMsg('Ставка от 10 фишек 🎡'); return; }
    if (balRef.current < stake) { setMsg(`Не хватает: надо ${stake} 💸`); return; }
    setBalance(b => b - stake);
    setRspinning(true);
    let ticks = 0;
    const timer = window.setInterval(() => {
      ticks++;
      setRnum(Math.floor(Math.random() * 37));
      if (ticks > 16) {
        window.clearInterval(timer);
        const n = Math.floor(Math.random() * 37);
        setRnum(n);
        setRspinning(false);
        const isRed = EU_REDS.includes(n);
        let win = 0;
        if (rchoice === 'green' && n === 0) win = stake * 14;
        else if (rchoice === 'red' && isRed) win = stake * 2;
        else if (rchoice === 'black' && n !== 0 && !isRed) win = stake * 2;
        else if (/^\d+$/.test(rchoice) && Number(rchoice) === n) win = stake * 35;
        if (win > 0) {
          setBalance(b => b + win);
          setMsg(`🎡 Выпало ${n}! Забрал +${win} 🏆`);
        } else {
          setMsg(`🎡 Выпало ${n}. Мимо, минус ${stake} 💩`);
        }
      }
    }, reduced ? 30 : 90);
  };

  /* ----- мины ----- */
  const [mbet, setMbet] = useState('50');
  const [mmines, setMmines] = useState(3);
  const [mfield, setMfield] = useState<boolean[] | null>(null);
  const [mopen, setMopen] = useState<boolean[]>(Array(25).fill(false));
  const [mmult, setMmult] = useState(1);
  const [mdead, setMdead] = useState(false);

  const startMines = (): void => {
    if (mfield && !mdead) return;
    const stake = Math.floor(Number(mbet));
    if (!isFinite(stake) || stake < 10) { setMsg('Ставка от 10 фишек 💣'); return; }
    if (balRef.current < stake) { setMsg(`Не хватает: надо ${stake} 💸`); return; }
    setBalance(b => b - stake);
    lastStake.current = stake;
    const idx = Array.from({ length: 25 }, (_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    const field = Array(25).fill(false);
    idx.slice(0, mmines).forEach(i => { field[i] = true; });
    setMfield(field);
    setMopen(Array(25).fill(false));
    setMmult(1);
    setMdead(false);
    setMsg(`Поле 5×5, мин: ${mmines}. Открывай клетки, «Забрать» — в любой момент 💎`);
  };

  const openCell = (i: number): void => {
    if (!mfield || mdead || mopen[i]) return;
    if (mfield[i]) {
      setMopen(mfield.map(() => true));
      setMdead(true);
      setMsg(`💥 Мина! Ставка сгорела.`);
      return;
    }
    const opened = mopen.filter(Boolean).length;
    const closed = 25 - opened;
    const safeClosed = 25 - mmines - opened;
    const nm = mmult * (closed / safeClosed) * 0.97;
    const no = [...mopen];
    no[i] = true;
    setMopen(no);
    setMmult(nm);
    setMsg(`💎 Чисто! Множитель ×${nm.toFixed(2)} — забирай или рискуй.`);
  };

  const cashMines = (): void => {
    if (!mfield || mdead) return;
    const opened = mopen.filter(Boolean).length;
    if (opened === 0) { setMsg('Открой хоть одну клетку 💎'); return; }
    const stake = lastStake.current;
    const win = Math.floor(stake * mmult);
    setBalance(b => b + win);
    setMfield(null);
    setMsg(`✅ Мины: ×${mmult.toFixed(2)}, +${win}!`);
  };

  /* ----- блэкджек ----- */
  type Card = { r: number; s: string };
  const SUITS = ['♠', '♥', '♦', '♣'];
  const drawCard = (): Card => ({ r: 1 + Math.floor(Math.random() * 13), s: SUITS[Math.floor(Math.random() * 4)] });
  const handValue = (h: Card[]): number => {
    let t = 0, aces = 0;
    for (const c of h) {
      if (c.r === 1) { aces++; t += 11; }
      else t += Math.min(10, c.r);
    }
    while (t > 21 && aces > 0) { t -= 10; aces--; }
    return t;
  };
  const cardLabel = (c: Card): string => `${c.r === 1 ? 'A' : c.r === 11 ? 'J' : c.r === 12 ? 'Q' : c.r === 13 ? 'K' : c.r}${c.s}`;

  const [bjbet, setBjbet] = useState('50');
  const [bjp, setBjp] = useState<Card[]>([]);
  const [bjd, setBjd] = useState<Card[]>([]);
  const [bjphase, setBjphase] = useState<'idle' | 'player' | 'done'>('idle');

  const dealBj = (): void => {
    if (bjphase === 'player') return;
    const stake = Math.floor(Number(bjbet));
    if (!isFinite(stake) || stake < 10) { setMsg('Ставка от 10 фишек 🃏'); return; }
    if (balRef.current < stake) { setMsg(`Не хватает: надо ${stake} 💸`); return; }
    setBalance(b => b - stake);
    lastStake.current = stake;
    const p = [drawCard(), drawCard()];
    const d = [drawCard(), drawCard()];
    setBjp(p); setBjd(d); setBjphase('player');
    if (handValue(p) === 21) {
      const win = Math.floor(stake * 2.5);
      setBalance(b => b + win);
      setBjphase('done');
      setMsg(`🃏 БЛЭКДЖЕК! +${win} 👑`);
    } else {
      setMsg(`Твои ${handValue(p)}, у дилера ${cardLabel(d[0])} + ?. Ещё или хватит?`);
    }
  };

  const hitBj = (): void => {
    if (bjphase !== 'player') return;
    const p = [...bjp, drawCard()];
    setBjp(p);
    const v = handValue(p);
    if (v > 21) {
      setBjphase('done');
      setMsg(`Перебор: ${v}. Минус ${lastStake.current} 💩`);
    } else if (v === 21) {
      standBj();
    } else {
      setMsg(`Твои ${v}. Ещё или хватит?`);
    }
  };

  const standBj = (): void => {
    if (bjphase !== 'player') return;
    const d = [...bjd];
    while (handValue(d) < 17) d.push(drawCard());
    setBjd(d);
    setBjphase('done');
    const pv = handValue(bjp), dv = handValue(d);
    const stake = lastStake.current;
    if (dv > 21 || pv > dv) {
      setBalance(b => b + stake * 2);
      setMsg(`Твои ${pv} против ${dv} — победа! +${stake * 2} 🏆`);
    } else if (pv === dv) {
      setBalance(b => b + stake);
      setMsg(`Ничья ${pv}:${dv} — ставка вернулась 🤝`);
    } else {
      setMsg(`Твои ${pv} против ${dv} — дилер забрал ${stake} 💩`);
    }
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
        <a className="cbtn ghost" href="index.html" style={{ textDecoration: 'none' }} title="На главную">🏠</a>
        <span>🪙</span><span className="bal">{balance}</span>
        <span className="sp" />
        <button className="cbtn ghost" onClick={takeBonus}>+500 фишек</button>
        <a
          className="cbtn"
          href="https://finance.ozon.ru/apps/sbp/ozonbankpay/019fa8eb-037e-75f9-a3d9-fe258db9e911"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >💳 Пополнить</a>
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
          <h2>🎡 Рулетка</h2>
          <p className="hint">Европейская: красное/чёрное ×2, зеро ×14, точное число ×35.</p>
          <div className="rnum">{rnum === null ? '?' : rnum}</div>
          <div className="hpick">
            <button className={rchoice === 'red' ? 'sel' : ''} onClick={() => setRchoice('red')}>🔴 Красное ×2</button>
            <button className={rchoice === 'black' ? 'sel' : ''} onClick={() => setRchoice('black')}>⚫ Чёрное ×2</button>
            <button className={rchoice === 'green' ? 'sel' : ''} onClick={() => setRchoice('green')}>🟢 Зеро ×14</button>
          </div>
          <div className="crow">
            <input className="cin" value={rbet} onChange={e => setRbet(e.target.value)} inputMode="numeric" aria-label="Ставка на рулетку" />
            <button className="cbtn" disabled={rspinning} onClick={spinRoulette}>{rspinning ? 'Крутится…' : 'Крутить 🎡'}</button>
          </div>
        </section>

        <section className="csec">
          <h2>💣 Мины</h2>
          <p className="hint">Открывай клетки. Кристалл растит множитель, мина сжигает ставку.</p>
          <div className="crow">
            <input className="cin" value={mbet} onChange={e => setMbet(e.target.value)} inputMode="numeric" aria-label="Ставка на мины" />
            <div className="hpick" style={{ margin: 0 }}>
              {[1, 3, 5].map(n => (
                <button key={n} className={mmines === n ? 'sel' : ''} onClick={() => { if (!mfield || mdead) setMmines(n); }}>{n} {n === 1 ? 'мина' : 'мины'}</button>
              ))}
            </div>
            {!mfield || mdead
              ? <button className="cbtn" onClick={startMines}>Начать 💣</button>
              : <button className="cbtn" onClick={cashMines}>Забрать ×{mmult.toFixed(2)} ✅</button>}
          </div>
          <div id="minefield">
            {mopen.map((op, i) => (
              <button key={i} className={op ? (mfield && mfield[i] ? 'cell boom' : 'cell gem') : 'cell'}
                onClick={() => openCell(i)} disabled={!mfield || op}>
                {op ? (mfield && mfield[i] ? '💥' : '💎') : ''}
              </button>
            ))}
          </div>
        </section>

        <section className="csec">
          <h2>🃏 Блэкджек</h2>
          <p className="hint">Набери 21, но не больше. Дилер тянет до 17. Блэкджек с раздачи платит ×2.5.</p>
          <div className="bjrow"><span>Дилер {bjd.length > 0 && bjphase === 'player' ? '' : bjd.length > 0 ? handValue(bjd) : ''}</span></div>
          <div className="bjcards">
            {bjd.map((c, i) => <span className="bjcard" key={i}>{i === 1 && bjphase === 'player' ? '🂠' : cardLabel(c)}</span>)}
          </div>
          <div className="bjrow"><span>Ты: {bjp.length > 0 ? handValue(bjp) : ''}</span></div>
          <div className="bjcards">
            {bjp.map((c, i) => <span className="bjcard me" key={i}>{cardLabel(c)}</span>)}
          </div>
          <div className="crow" style={{ marginTop: 12 }}>
            <input className="cin" value={bjbet} onChange={e => setBjbet(e.target.value)} inputMode="numeric" aria-label="Ставка на блэкджек" />
            {bjphase === 'player'
              ? <><button className="cbtn" onClick={hitBj}>Ещё 🃏</button><button className="cbtn ghost" onClick={standBj}>Хватит ✋</button></>
              : <button className="cbtn" onClick={dealBj}>Раздать 🃏</button>}
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
