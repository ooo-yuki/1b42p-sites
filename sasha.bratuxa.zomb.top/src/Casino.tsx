import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useBeacon } from './hooks';
import './casino.css';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ItemIcon } from './casino-icons';
import {
  Bomb, Coins, CreditCard, Dices, Flag, Gem, Hand, House, Spade, Ticket,
  TrendingUp, Trophy,
} from 'lucide-react';

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
type Drop = { icon: string; label: string; amount: number; w: number };
type CaseDef = { id: string; icon: string; name: string; price: number; desc: string; drops: Drop[] };

const CASES: CaseDef[] = [
  { id: 'barracks', icon: 'barracks', name: 'Казарма', price: 100, desc: 'Скромно, но со вкусом',
    drops: [
      { icon: 'hardhat', label: 'Каска', amount: 50, w: 35 },
      { icon: 'boots', label: 'Берцы', amount: 80, w: 30 },
      { icon: 'medal', label: 'Медалька', amount: 120, w: 20 },
      { icon: 'flame', label: 'Запал', amount: 200, w: 11 },
      { icon: 'coins', label: 'Касса части', amount: 500, w: 4 },
    ] },
  { id: 'arsenal', icon: 'arsenal', name: 'Арсенал', price: 300, desc: 'Для тех, кто в теме',
    drops: [
      { icon: 'glock', label: 'Глок', amount: 150, w: 32 },
      { icon: 'vest', label: 'Броник', amount: 250, w: 28 },
      { icon: 'truck', label: 'Урал', amount: 400, w: 22 },
      { icon: 'rocket', label: 'Ракета', amount: 700, w: 13 },
      { icon: 'crown', label: 'Звезда генерала', amount: 1500, w: 5 },
    ] },
  { id: 'hq42', icon: 'hq42', name: 'Штаб 42', price: 1000, desc: 'Олл-ин по-батальонному',
    drops: [
      { icon: 'radio', label: 'Рация', amount: 500, w: 30 },
      { icon: 'map', label: 'Карта', amount: 800, w: 27 },
      { icon: 'anchor', label: 'Якорь Авроры', amount: 1200, w: 23 },
      { icon: 'eagle', label: 'Орёл', amount: 2500, w: 14 },
      { icon: 'jackpot', label: 'Джекпот 42', amount: 10000, w: 6 },
    ] },
];

function pickDrop(drops: Drop[]): Drop {
  const total = drops.reduce((s, d) => s + d.w, 0);
  let x = Math.random() * total;
  for (const d of drops) { x -= d.w; if (x < 0) return d; }
  return drops[drops.length - 1];
}

/* ---------- лошади ---------- */
type Horse = { id: string; icon: string; name: string; odds: number };
const HORSES: Horse[] = [
  { id: 'tornado', icon: 'steed-gray', name: 'Торнадо', odds: 1.8 },
  { id: 'bratuxa', icon: 'steed-blue', name: 'Братуха', odds: 2.5 },
  { id: 'vihr', icon: 'steed-brown', name: 'Вихрь', odds: 4 },
  { id: 'pyat', icon: 'steed-gold', name: 'Пятёрка', odds: 7 },
];

const SLOT_ICONS = ['cherry', 'clover', 'star', 'coins', 'dices', 'seven'];

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
    if (wait > 0) { setMsg(`Касса пуста, заходи через ${wait} с`); return; }
    setBalance(b => b + BONUS);
    setBonusTs(Date.now());
    setMsg(`+${BONUS} фишек от батальона`);
  };

  const [msg, setMsg] = useState('Фишки фантики, азарт настоящий');

  /* ----- кейсы ----- */
  const [caseBusy, setCaseBusy] = useState(false);
  const [stripCells, setStripCells] = useState<Drop[] | null>(null);
  const openCase = (c: CaseDef): void => {
    if (caseBusy) return;
    if (balRef.current < c.price) { setMsg(`На «${c.name}» не хватает: надо ${c.price}`); return; }
    setBalance(b => b - c.price);
    setCaseBusy(true);
    const win = pickDrop(c.drops);
    const cells: Drop[] = Array.from({ length: 30 }, () => pickDrop(c.drops));
    cells[24] = win;
    setStripCells(cells);
    const strip = document.getElementById('strip');
    const wrap = document.getElementById('stripWrap');
    if (strip && wrap) {
      requestAnimationFrame(() => {
        wrap.classList.add('open');
        gsap.set(strip, { x: 0 });
      });
      const target = 24 * 94 - 60;
      gsap.fromTo(strip, { x: 0 }, {
        x: -target, duration: reduced ? 0.3 : 3.2, ease: 'power3.out',
        onComplete: () => {
          setBalance(b => b + win.amount);
          setMsg(win.amount >= c.price
            ? `${win.label}: +${win.amount}! Кейс окупился`
            : `${win.label}: +${win.amount}. Бывает`);
          setCaseBusy(false);
        },
      });
    } else {
      setBalance(b => b + win.amount);
      setMsg(`${win.label}: +${win.amount}`);
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
    if (!isFinite(stake) || stake < 10) { setMsg('Ставка от 10 фишек'); return; }
    if (balRef.current < stake) { setMsg(`Не хватает: надо ${stake}`); return; }
    setBalance(b => b - stake);
    const r = Math.random();
    const point = r < 0.03 ? 1 : Math.max(1, (0.97 / (1 - r)) * 0.97 + 0.03);
    const st = crashRef.current;
    st.live = true; st.m = 1; st.stake = stake;
    setCrashOn(true); setMult(1); setDead(false);
    setMsg(`Ракета пошла! Жми «Забрать», пока не бахнуло`);
    const t0 = performance.now();
    const speed = reduced ? 0.9 : 0.32;
    const step = (t: number): void => {
      if (!st.live) return;
      st.m = Math.exp(((t - t0) / 1000) * speed);
      if (st.m >= point) {
        st.live = false;
        setMult(point); setCrashOn(false); setDead(true);
        drawCrash(point, true);
        setMsg(`Крэш на ×${point.toFixed(2)}! Минус ${stake}.`);
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
    setMsg(`Забрал ×${st.m.toFixed(2)}: +${win}!`);
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
    if (!isFinite(stake) || stake < 10) { setMsg('Ставка от 10 фишек'); return; }
    if (balRef.current < stake) { setMsg(`Не хватает: надо ${stake}`); return; }
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
          setMsg(`${h.name} первый! ×${h.odds}: +${win}`);
        } else {
          setMsg(`${h.name} первый. Твоя лошадь мимо, минус ${stake}`);
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
    if (!isFinite(stake) || stake < 10) { setMsg('Ставка от 10 фишек'); return; }
    if (balRef.current < stake) { setMsg(`Не хватает: надо ${stake}`); return; }
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
          setMsg(`Выпало ${n}! Забрал +${win}`);
        } else {
          setMsg(`Выпало ${n}. Мимо, минус ${stake}`);
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
    if (!isFinite(stake) || stake < 10) { setMsg('Ставка от 10 фишек'); return; }
    if (balRef.current < stake) { setMsg(`Не хватает: надо ${stake}`); return; }
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
    setMsg(`Поле 5×5, мин: ${mmines}. Открывай клетки, «Забрать» — в любой момент`);
  };

  const openCell = (i: number): void => {
    if (!mfield || mdead || mopen[i]) return;
    if (mfield[i]) {
      setMopen(mfield.map(() => true));
      setMdead(true);
      setMsg(`Мина! Ставка сгорела.`);
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
    setMsg(`Чисто! Множитель ×${nm.toFixed(2)} — забирай или рискуй.`);
  };

  const cashMines = (): void => {
    if (!mfield || mdead) return;
    const opened = mopen.filter(Boolean).length;
    if (opened === 0) { setMsg('Открой хоть одну клетку'); return; }
    const stake = lastStake.current;
    const win = Math.floor(stake * mmult);
    setBalance(b => b + win);
    setMfield(null);
    setMsg(`Мины: ×${mmult.toFixed(2)}, +${win}!`);
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
    if (!isFinite(stake) || stake < 10) { setMsg('Ставка от 10 фишек'); return; }
    if (balRef.current < stake) { setMsg(`Не хватает: надо ${stake}`); return; }
    setBalance(b => b - stake);
    lastStake.current = stake;
    const p = [drawCard(), drawCard()];
    const d = [drawCard(), drawCard()];
    setBjp(p); setBjd(d); setBjphase('player');
    if (handValue(p) === 21) {
      const win = Math.floor(stake * 2.5);
      setBalance(b => b + win);
      setBjphase('done');
      setMsg(`БЛЭКДЖЕК! +${win}`);
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
      setMsg(`Перебор: ${v}. Минус ${lastStake.current}`);
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
      setMsg(`Твои ${pv} против ${dv} — победа! +${stake * 2}`);
    } else if (pv === dv) {
      setBalance(b => b + stake);
      setMsg(`Ничья ${pv}:${dv} — ставка вернулась`);
    } else {
      setMsg(`Твои ${pv} против ${dv} — дилер забрал ${stake}`);
    }
  };

  /* ----- слоты ----- */
  const [reels, setReels] = useState(['seven', 'dices', 'cherry']);
  const [spinning, setSpinning] = useState(false);

  const spin = (): void => {
    if (spinning) return;
    if (balRef.current < 50) { setMsg('Спин стоит 50. Возьми бонус'); return; }
    setBalance(b => b - 50);
    setSpinning(true);
    const final = [0, 1, 2].map(() => SLOT_ICONS[Math.floor(Math.random() * SLOT_ICONS.length)]);
    let ticks = 0;
    const timer = window.setInterval(() => {
      ticks++;
      setReels([0, 1, 2].map(i => (ticks > (i + 1) * 4 ? final[i] : SLOT_ICONS[Math.floor(Math.random() * SLOT_ICONS.length)])));
      if (ticks > 14) {
        window.clearInterval(timer);
        setReels(final);
        setSpinning(false);
        const [a, b2, c] = final;
        if (a === 'seven' && b2 === 'seven' && c === 'seven') {
          setBalance(x => x + 1000); setMsg('ДЖЕКПОТ 777: +1000!');
        } else if (a === b2 && b2 === c) {
          setBalance(x => x + 250); setMsg(`Три одинаковых: +250!`);
        } else if (a === b2 || b2 === c || a === c) {
          setBalance(x => x + 100); setMsg('Пара: +100');
        } else {
          setMsg('Мимо. Ещё по одной?');
        }
      }
    }, reduced ? 30 : 90);
  };

  return (
    <>
      <div className="cbar">
        <Button variant="outline" size="sm" asChild><a href="index.html" title="На главную" className="no-underline"><House data-icon="inline-start" /> Главная</a></Button>
        <Badge variant="secondary" className="tabular-nums"><Coins data-icon="inline-start" /> {balance}</Badge>
        <span className="sp" />
        <Button variant="outline" size="sm" onClick={takeBonus}><Ticket data-icon="inline-start" /> +500 фишек</Button>
        <Button size="sm" asChild>
          <a
            href="https://finance.ozon.ru/apps/sbp/ozonbankpay/019fa8eb-037e-75f9-a3d9-fe258db9e911"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline"
          ><CreditCard data-icon="inline-start" /> Пополнить</a>
        </Button>
      </div>
      <main><div className="cwrap">
        <div className="chead">
          <h1><span className="r">Казино</span> <span className="g">42</span></h1>
          <p>Фишки фантики, азарт настоящий. Кейсы, крэш, лошади и слоты — всё на территории Саши.</p>
        </div>
        <div className="clog">{msg}</div>

        <Card>
          <CardHeader>
            <CardTitle><TrendingUp data-icon="inline-start" /> Краш</CardTitle>
            <CardDescription>Множитель растёт, пока ракета летит. Забирай до крэша — иначе ставка сгорает.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={dead ? 'crashnum dead' : 'crashnum'}>×{mult.toFixed(2)}</div>
            <canvas id="crashCv" ref={cvRef} />
            <div className="crow" style={{ marginTop: 12 }}>
              <Input className="cin" value={bet} onChange={e => setBet(e.target.value)} inputMode="numeric" aria-label="Ставка на краш" />
              {!crashOn
                ? <Button onClick={startCrash}>Погнали <ItemIcon name="rocket" /></Button>
                : <Button variant="secondary" onClick={cashOut}>Забрать <Hand data-icon="inline-end" /></Button>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle><ItemIcon name="barracks" /> Кейсы</CardTitle>
            <CardDescription>Платишь за кейс — лента крутится, что выпало, то твоё.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="cases">
              {CASES.map(c => (
                <Card key={c.id} className="case">
                  <CardHeader>
                    <div className="em case-art"><ItemIcon name={c.icon} /></div>
                    <CardTitle>{c.name}</CardTitle>
                    <CardDescription>{c.desc}</CardDescription>
                  </CardHeader>
                  <CardFooter className="casefoot">
                    <Badge variant="secondary">{c.price} фишек</Badge>
                    <Button size="sm" disabled={caseBusy} onClick={() => openCase(c)}>Открыть</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div id="stripWrap"><div id="strip">{stripCells?.map((d, i) => (
              <div className="cell" key={i}><span className="e"><ItemIcon name={d.icon} /></span>{d.amount}</div>
            ))}</div></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle><ItemIcon name="steed-brown" /> Лошади</CardTitle>
            <CardDescription>Выбери лошадь, поставь фишки. Кто первый до финиша — тот и прав.</CardDescription>
          </CardHeader>
          <CardContent>
            <ToggleGroup type="single" value={horse} onValueChange={(v) => { if (v) setHorse(v); }} disabled={racing} className="flex-wrap justify-start">
              {HORSES.map(h => (
                <ToggleGroupItem key={h.id} value={h.id}>
                  <ItemIcon name={h.icon} /> {h.name} ×{h.odds}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            {HORSES.map((h, i) => (
              <div className="horse" key={h.id}>
                <div className="nm"><b><ItemIcon name={h.icon} /> {h.name}</b> <Badge variant="secondary">×{h.odds}</Badge></div>
                <div className="track">
                  <span className="run" style={{ left: `calc(${Math.min(96, pos[i])}% )` }}><ItemIcon name={h.icon} /></span>
                  <span className="fin"><Flag data-icon="inline-end" /></span>
                </div>
              </div>
            ))}
            <div className="crow" style={{ marginTop: 12 }}>
              <Input className="cin" value={hbet} onChange={e => setHbet(e.target.value)} inputMode="numeric" aria-label="Ставка на лошадь" />
              <Button disabled={racing} onClick={startRace}>{racing ? 'Скачут…' : 'Старт'}</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle><Dices data-icon="inline-start" /> Рулетка</CardTitle>
            <CardDescription>Европейская: красное/чёрное ×2, зеро ×14, точное число ×35.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rnum">{rnum === null ? '?' : rnum}</div>
            <ToggleGroup type="single" value={/^\d+$/.test(rchoice) ? '' : rchoice} onValueChange={(v) => { if (v) setRchoice(v); }} disabled={rspinning} className="flex-wrap justify-start">
              <ToggleGroupItem value="red"><span className="rdot red" /> Красное ×2</ToggleGroupItem>
              <ToggleGroupItem value="black"><span className="rdot black" /> Чёрное ×2</ToggleGroupItem>
              <ToggleGroupItem value="green"><span className="rdot green" /> Зеро ×14</ToggleGroupItem>
            </ToggleGroup>
            <div className="crow" style={{ marginTop: 12 }}>
              <Input className="cin" value={rbet} onChange={e => setRbet(e.target.value)} inputMode="numeric" aria-label="Ставка на рулетку" />
              <Input
                className="cin" placeholder="Число 0–36"
                value={/^\d+$/.test(rchoice) ? rchoice : ''}
                onChange={e => {
                  const v = e.target.value.replace(/\D/g, '').slice(0, 2);
                  if (v === '') setRchoice('red');
                  else if (Number(v) <= 36) setRchoice(String(Number(v)));
                }}
                inputMode="numeric" aria-label="Точное число"
              />
              <Button disabled={rspinning} onClick={spinRoulette}>{rspinning ? 'Крутится…' : 'Крутить'}</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle><Bomb data-icon="inline-start" /> Мины</CardTitle>
            <CardDescription>Открывай клетки. Кристалл растит множитель, мина сжигает ставку.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="crow">
              <Input className="cin" value={mbet} onChange={e => setMbet(e.target.value)} inputMode="numeric" aria-label="Ставка на мины" />
              <ToggleGroup type="single" value={String(mmines)} onValueChange={(v) => { if (v && (!mfield || mdead)) setMmines(Number(v)); }} disabled={!!mfield && !mdead}>
                {[1, 3, 5].map(n => (
                  <ToggleGroupItem key={n} value={String(n)}>{n} {n === 1 ? 'мина' : 'мины'}</ToggleGroupItem>
                ))}
              </ToggleGroup>
              {!mfield || mdead
                ? <Button onClick={startMines}>Начать</Button>
                : <Button variant="secondary" onClick={cashMines}>Забрать ×{mmult.toFixed(2)}</Button>}
            </div>
            <div id="minefield">
              {mopen.map((op, i) => (
                <button key={i} className={op ? (mfield && mfield[i] ? 'cell boom' : 'cell gem') : 'cell'}
                  onClick={() => openCell(i)} disabled={!mfield || op} aria-label={op ? (mfield && mfield[i] ? 'Мина' : 'Кристалл') : 'Закрытая клетка'}>
                  {op ? (mfield && mfield[i] ? <Bomb aria-hidden /> : <Gem aria-hidden />) : ''}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle><Spade data-icon="inline-start" /> Блэкджек</CardTitle>
            <CardDescription>Набери 21, но не больше. Дилер тянет до 17. Блэкджек с раздачи платит ×2.5.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bjrow"><span>Дилер {bjd.length > 0 && bjphase === 'player' ? '' : bjd.length > 0 ? handValue(bjd) : ''}</span></div>
            <div className="bjcards">
              {bjd.map((c, i) => <span className="bjcard" key={i}>{i === 1 && bjphase === 'player' ? '?' : cardLabel(c)}</span>)}
            </div>
            <div className="bjrow"><span>Ты: {bjp.length > 0 ? <Badge variant="secondary">{handValue(bjp)}</Badge> : ''}</span></div>
            <div className="bjcards">
              {bjp.map((c, i) => <span className="bjcard me" key={i}>{cardLabel(c)}</span>)}
            </div>
            <div className="crow" style={{ marginTop: 12 }}>
              <Input className="cin" value={bjbet} onChange={e => setBjbet(e.target.value)} inputMode="numeric" aria-label="Ставка на блэкджек" />
              {bjphase === 'player'
                ? <><Button onClick={hitBj}>Ещё</Button><Button variant="outline" onClick={standBj}>Хватит</Button></>
                : <Button onClick={dealBj}>Раздать</Button>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle><Ticket data-icon="inline-start" /> Слоты</CardTitle>
            <CardDescription>Спин — 50 фишек. Три семёрки — джекпот 1000, три одинаковых — 250, пара — 100.</CardDescription>
          </CardHeader>
          <CardContent>
            <div id="slots">
              {reels.map((r, i) => <div className="reel" key={i}><ItemIcon name={r} /></div>)}
            </div>
            <div className="crow" style={{ justifyContent: 'center' }}>
              <Button disabled={spinning} onClick={spin}>{spinning ? 'Крутится…' : 'Крутить за 50'}</Button>
            </div>
          </CardContent>
        </Card>

        <Separator className="csep" />
        <div className="cnav">
          <Button variant="outline" asChild><a href="game.html" className="no-underline">Игра</a></Button>
          <Button variant="outline" asChild><a href="index.html" className="no-underline">Главная</a></Button>
          <Button variant="outline" asChild><a href="https://hub.bratuxa.zomb.top" className="no-underline"><Trophy data-icon="inline-start" /> Хаб</a></Button>
        </div>
        <p className="cfoot">Фишки ничего не стоят и ни на что не меняются. Мы уже победили</p>
      </div></main>
    </>
  );
}
