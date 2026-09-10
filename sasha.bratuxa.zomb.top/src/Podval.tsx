import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import Ads from './lib/Ads';
import { useBeacon, useRain } from './hooks';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Brain, Bug, Coins, Cpu, Database, House, Lock, MousePointerClick, Server, Thermometer, Trophy, Zap,
} from 'lucide-react';
import {
  AUTOBUYER_COST, ANOMALIES, BRED, FARM_MAX, HARDWARE, HYBRIDS, MODEL_LEVELS, MARKET_PULSE, NODES,
  PRESTIGE_GATES, PRESTIGE_HARDWARE, PUG_FARM_RATE, RAIDS, REFLASH_COST, REFLASH_EVENT_CD_MUL,
  REFLASH_INCOME_MUL, OVERCLOCK_HALL_PLUS, OVERCLOCK_RATE_MUL, VULN_PAYOUT, anomalyOf, clickGain,
  coreMult, eventPick, farmCost, hardwareCost, hardwareRate, hallucination, hybridCost, incomePerSec,
  isVictory, marketStep, nodeIncome, prestigeCost, prestigeRate, raidShare, trainCost, type GameEvent,
} from './podval/formulas';
import { divisionOf, fetchLeague, leaguePts, seasonId, submitScore } from './podval/league';
import './lib/gametop.css';
import { loadToken } from './lib/auth';
import AccountBar from './lib/AccountBar';
import AdReward from './lib/AdReward';
import { SAVE_KEY, freshSave, loadSave, type Save } from './podval/save';

/* Нейросеть в подвале: айдл-стратегия Саши ⁴².
   Размечай датасеты, качай железо, учи LLM с v0.1 до v4.2. */

function readStored(): Save {
  try {
    return loadSave(JSON.parse(localStorage.getItem(SAVE_KEY) ?? 'null'));
  } catch {
    return freshSave();
  }
}

const fmt = (n: number) => Math.floor(n).toLocaleString('ru-RU');

const HYBRID_IDS = ['chatter', 'apprentice', 'diver', 'guard', 'heir'];

function effHybrid(p: Save, rnd: () => number = Math.random): string {
  if (p.hybrid === 'jester' && p.hybrids.includes('jester')) {
    return HYBRID_IDS[Math.floor(rnd() * HYBRID_IDS.length)];
  }
  return p.hybrid;
}

/** Вся числовая сборка одного места: доход монет/с, датасеты/с систем, эффективные галлюцинации. */
function tickNumbers(p: Save, evm: number, anomaly: string, rnd: () => number = Math.random): { inc: number; hall: number; dsRate: number } {
  const m = Math.min(p.model, MODEL_LEVELS.length - 1);
  const oc = p.oc && p.cycles >= PRESTIGE_GATES.overclock;
  const rf = p.rf && p.cycles >= PRESTIGE_GATES.reflash;
  const hy = effHybrid(p, rnd);
  const coolingEff = anomaly === 'heat' ? Math.floor(p.cooling / 2) : p.cooling;
  const hall = Math.max(2, hallucination(m, coolingEff) + (oc ? OVERCLOCK_HALL_PLUS : 0) - (hy === 'guard' ? 10 : 0));
  const vulnBase = (VULN_PAYOUT[Math.min(p.vuln, 3)] ?? 0) / 10;
  const vuln = vulnBase * (hy === 'diver' ? 2 : 1) * (anomaly === 'audit' ? 3 : 1);
  let inc = (MODEL_LEVELS[m].codeRate * (hy === 'apprentice' ? 1.25 : 1) + vuln)
    * (1 - (hall / 100) * 0.75) * coreMult(p.cycles)
    * (oc ? OVERCLOCK_RATE_MUL : 1) * (rf ? REFLASH_INCOME_MUL : 1) * evm
    * (hy === 'heir' ? 1.3 : 1);
  let dsRate = (anomaly === 'quiet' ? 0 : hardwareRate(p.hardware))
    + (p.cycles >= PRESTIGE_GATES.quantum && anomaly !== 'quiet' ? prestigeRate(p.phw) : 0)
    + (p.cycles >= PRESTIGE_GATES.farm ? p.farm * PUG_FARM_RATE * (anomaly === 'pugriot' ? 3 : 1) : 0)
    + p.nodes.reduce((sum, id) => sum + nodeIncome(id, p.nodes) * (anomaly === 'cables' ? 2 : 1), 0)
    + (m >= 1 ? clickGain(p.cursor) : 0) + (hy === 'chatter' ? 1 : 0);
  if (anomaly === 'heat') inc *= 1.3;
  if (anomaly === 'pugriot') { inc *= 0.9; dsRate *= 0.9; }
  if (anomaly === 'day42') { inc *= 1.42; dsRate *= 1.42; }
  return { inc, hall, dsRate };
}

const leagueFetch = (u: string, i?: Record<string, unknown>) =>
  fetch(u, i as RequestInit) as unknown as Promise<{ ok: boolean; json: () => Promise<unknown> }>;

export default function Podval(): JSX.Element {
  const cvRef = useRef<HTMLCanvasElement | null>(null);
  useRain(cvRef);
  useBeacon();
  const [s, setS] = useState<Save>(readStored);
  const [tab, setTab] = useState('podval');
  const [won, setWon] = useState(false);
  const winRef = useRef<HTMLDivElement>(null);
  const sRef = useRef(s);
  sRef.current = s;
  type ActiveEvent = { ev: GameEvent; until: number };
  const [active, setActive] = useState<ActiveEvent | null>(null);
  const activeRef = useRef<ActiveEvent | null>(null);
  activeRef.current = active;
  const [now, setNow] = useState(() => Date.now());
  type Pulse = { id: string; mul: number; until: number };
  const [pulse, setPulse] = useState<Pulse | null>(null);
  const pulseRef = useRef<Pulse | null>(null);
  pulseRef.current = pulse;
  const [insiderLeft, setInsiderLeft] = useState(0);
  const insiderRef = useRef(0);
  insiderRef.current = insiderLeft;
  const [spikeUntil, setSpikeUntil] = useState(0);
  const spikeRef = useRef(0);
  spikeRef.current = spikeUntil;
  const tradeRef = useRef({ trades: 0, dump: 0 });
  const raidWindowRef = useRef(-1);
  const [league, setLeague] = useState<{ nick: string; pts: number }[]>([]);
  const [myNick, setMyNick] = useState('');
  const [leagueMsg, setLeagueMsg] = useState('');

  const ml = Math.min(s.model, MODEL_LEVELS.length - 1);
  const ocOn = s.oc && s.cycles >= PRESTIGE_GATES.overclock;
  const rfOn = s.rf && s.cycles >= PRESTIGE_GATES.reflash;
  const evIncomeMul = active && active.until > now ? active.ev.incomeMul : 1;
  const evPriceMul = active && active.until > now ? active.ev.priceMul : 1;
  const anomaly = anomalyOf(new Date(now));
  const anomalyDef = ANOMALIES.find((a) => a.id === anomaly)!;
  const { inc: baseIncome, hall: baseHall, dsRate: baseRate } = tickNumbers(s, evIncomeMul, anomaly);
  const hall = baseHall + (now < spikeUntil ? 20 : 0);
  const income = baseIncome * (1 - (hall / 100) * 0.75) / (1 - (baseHall / 100) * 0.75);
  const rate = baseRate;
  const pulseMul = pulse && pulse.until > now ? pulse.mul : 1;
  const vulnEff = ((VULN_PAYOUT[Math.min(s.vuln, 3)] ?? 0) / 10)
    * (effHybrid(s) === 'diver' ? 2 : 1) * (anomaly === 'audit' ? 3 : 1);

  useEffect(() => {
    const id = setInterval(() => {
      setS((p) => {
        const dt = 0.25;
        const m = Math.min(p.model, MODEL_LEVELS.length - 1);
        const evm = activeRef.current && activeRef.current.until > Date.now() ? activeRef.current.ev.incomeMul : 1;
        const an = anomalyOf(new Date());
        const t = tickNumbers(p, evm, an);
        const spiked = Date.now() < spikeRef.current;
        const h = spiked ? t.hall + 20 : t.hall;
        const inc = t.inc * (1 - (h / 100) * 0.75) / (1 - (t.hall / 100) * 0.75);
        const tr = tradeRef.current;
        const calm = pulseRef.current && pulseRef.current.id === 'calm' && pulseRef.current.until > Date.now();
        const mPrice = calm ? p.mPrice : marketStep(p.mPrice, tr.trades, tr.dump, Math.random);
        tr.trades = 0; tr.dump = 0;
        const winSecs = Math.floor(Date.now() / 1000) % RAIDS.windowSecs;
        const raidOpen = winSecs >= RAIDS.windowSecs - RAIDS.openSecs;
        let { datasets, coins, raidPool } = p;
        datasets += t.dsRate * dt;
        coins += inc * dt;
        if (p.raidAuto && raidOpen && datasets >= RAIDS.minBet) {
          const bet = Math.min(datasets, Math.max(RAIDS.minBet, datasets * 0.05));
          datasets -= bet;
          raidPool += bet;
        }
        const next: Save = { ...p, datasets, coins, raidPool, mPrice };
        if (m >= 4) {
          const idx = HARDWARE.findIndex((_, i) => hardwareCost(i, next.hardware[i]) <= next.datasets);
          if (idx >= 0) {
            next.datasets -= hardwareCost(idx, next.hardware[idx]);
            next.hardware = next.hardware.map((n, i) => (i === idx ? n + 1 : n));
          }
        }
        return next;
      });
    }, 250);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(sRef.current));
      } catch {
        /* подвал терпит */
      }
    }, 2000);
    return () => clearInterval(id);
  }, []);

  /* События подвала: тик 150с ± 60с, только при cycles >= 1. */
  useEffect(() => {
    if (sRef.current.cycles < PRESTIGE_GATES.events) return;
    let dead = false;
    let timer = 0;
    const schedule = () => {
      const s = sRef.current;
      const base = 150000 * (s.rf && s.cycles >= PRESTIGE_GATES.reflash ? REFLASH_EVENT_CD_MUL : 1);
      const delay = base + (Math.random() * 120000 - 60000);
      timer = window.setTimeout(() => {
        if (dead) return;
        const ev = eventPick();
        if (ev.drain > 0) {
          setS((p) => ({ ...p, datasets: p.datasets * (1 - ev.drain) }));
        }
        if (ev.secs > 0) {
          setActive({ ev, until: Date.now() + ev.secs * 1000 });
        }
        schedule();
      }, Math.max(5000, delay));
    };
    schedule();
    return () => { dead = true; window.clearTimeout(timer); };
  }, [s.cycles >= PRESTIGE_GATES.events, rfOn]);

  /* Обратный отсчёт плашки + снятие просрочки + закрытие рейд-окна. */
  useEffect(() => {
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (activeRef.current && activeRef.current.until <= t) setActive(null);
      if (pulseRef.current && pulseRef.current.until <= t) setPulse(null);
      const win = Math.floor(t / 1000 / RAIDS.windowSecs);
      if (raidWindowRef.current !== win) {
        raidWindowRef.current = win;
        setS((p) => {
          if (p.raidPool <= 0) return p;
          const share = raidShare(p.raidPool, p.raidPool);
          return { ...p, coins: p.coins + p.raidPool * RAIDS.mul * share, raidPool: 0 };
        });
      }
    }, 1000);
    return () => clearInterval(id);
  }, []);

  /* Пульс рынка: случайный импульс каждые ~3–5 мин. */
  useEffect(() => {
    let dead = false;
    let timer = 0;
    const schedule = () => {
      const delay = 200000 + (Math.random() * 120000 - 60000);
      timer = window.setTimeout(() => {
        if (dead) return;
        const p = MARKET_PULSE[Math.floor(Math.random() * MARKET_PULSE.length)];
        if (p.id === 'insider') setInsiderLeft(10);
        else setPulse({ id: p.id, mul: p.mul, until: Date.now() + p.secs * 1000 });
        schedule();
      }, Math.max(5000, delay));
    };
    schedule();
    return () => { dead = true; window.clearTimeout(timer); };
  }, []);

  /* Автобайер «Прапор»: каждые 5с покупает доступное железо. */
  useEffect(() => {
    if (!(s.auto && s.cycles >= PRESTIGE_GATES.autobuyer)) return;
    const id = setInterval(() => {
      setS((p) => {
        if (!(p.auto && p.cycles >= PRESTIGE_GATES.autobuyer)) return p;
        const evm = activeRef.current && activeRef.current.until > Date.now() ? activeRef.current.ev.priceMul : 1;
        const cands: Array<{ kind: 'hw' | 'phw'; i: number; cost: number }> = HARDWARE.map((_, i) => ({
          kind: 'hw' as const, i, cost: Math.ceil(hardwareCost(i, p.hardware[i]) * evm),
        }));
        PRESTIGE_HARDWARE.forEach((_, i) => {
          if (p.cycles >= (i === 0 ? PRESTIGE_GATES.quantum : PRESTIGE_GATES.kuzbass)) {
            cands.push({ kind: 'phw', i, cost: Math.ceil(prestigeCost(i, p.phw[i] ?? 0) * evm) });
          }
        });
        cands.sort((a, b) => a.cost - b.cost);
        const pick = cands.find((c) => c.cost <= p.datasets);
        if (!pick) return p;
        if (pick.kind === 'hw') {
          return { ...p, datasets: p.datasets - pick.cost, hardware: p.hardware.map((n, j) => (j === pick.i ? n + 1 : n)) };
        }
        return { ...p, datasets: p.datasets - pick.cost, phw: p.phw.map((n, j) => (j === pick.i ? n + 1 : n)) };
      });
    }, 5000);
    return () => clearInterval(id);
  }, [s.auto && s.cycles >= PRESTIGE_GATES.autobuyer]);

  useEffect(() => {
    if (isVictory(s.model, s.coins) && !won) {
      setWon(true);
      if (winRef.current) gsap.from(winRef.current, { scale: 0.7, autoAlpha: 0, duration: 0.6, ease: 'back.out(2)' });
    }
  }, [s.model, s.coins, won]);

  const buyHw = (i: number) =>
    setS((p) => {
      const cost = Math.ceil(hardwareCost(i, p.hardware[i]) * evPriceMul);
      if (p.datasets < cost) return p;
      return { ...p, datasets: p.datasets - cost, hardware: p.hardware.map((n, j) => (j === i ? n + 1 : n)) };
    });

  const buyPHW = (i: number) =>
    setS((p) => {
      const need = i === 0 ? PRESTIGE_GATES.quantum : PRESTIGE_GATES.kuzbass;
      if (p.cycles < need) return p;
      const cost = Math.ceil(prestigeCost(i, p.phw[i] ?? 0) * evPriceMul);
      if (p.datasets < cost) return p;
      return { ...p, datasets: p.datasets - cost, phw: p.phw.map((n, j) => (j === i ? n + 1 : n)) };
    });

  const buyFarm = () =>
    setS((p) => {
      if (p.cycles < PRESTIGE_GATES.farm || p.farm >= FARM_MAX) return p;
      const cost = farmCost(p.farm);
      if (p.datasets < cost) return p;
      return { ...p, datasets: p.datasets - cost, farm: p.farm + 1 };
    });

  /* Тумблер пост-пула: первая активация платная, дальше бесплатно. */
  const buyToggle = (key: 'auto' | 'oc' | 'rf', cost: number, need: number) =>
    setS((p) => {
      if (p.cycles < need) return p;
      if (p[key]) return { ...p, [key]: false };
      if (p.datasets < cost) return p;
      return { ...p, datasets: p.datasets - cost, [key]: true };
    });

  const rebirth = () => {
    setActive(null);
    setWon(false);
    setS((p) => {
      if (!isVictory(p.model, p.coins)) return p;
      return { ...freshSave(), cycles: p.cycles + 1 };
    });
  };

  /* Рынок: продаём 10% датасетов, покупаем на 10% монет. */
  const sellPrice = s.mPrice * pulseMul
    * (insiderLeft > 0 ? 1.5 : 1) * (anomaly === 'bazaar' ? 1.25 : 1);
  const sellMarket = () => {
    const hadInsider = insiderRef.current > 0;
    setS((p) => {
      const n = Math.max(1, Math.floor(p.datasets * 0.1));
      if (p.datasets < n) return p;
      tradeRef.current.dump += n;
      return { ...p, datasets: p.datasets - n, coins: p.coins + n * sellPrice };
    });
    if (hadInsider) setInsiderLeft((x) => Math.max(0, x - 1));
  };
  const buyMarket = () =>
    setS((p) => {
      const budget = p.coins * 0.1;
      const n = Math.floor(budget / Math.max(0.01, p.mPrice));
      if (n < 1 || p.coins < n * p.mPrice) return p;
      tradeRef.current.trades += n;
      return { ...p, datasets: p.datasets + n, coins: p.coins - n * p.mPrice };
    });

  /* Лаборатория: скрестить две открытые версии. */
  const verIndex = (ver: string) => MODEL_LEVELS.findIndex((m) => m.ver === ver);
  const buyHybrid = (id: string) => {
    const fail = Math.random() < 0.25;
    if (fail) setSpikeUntil(Date.now() + 60000);
    setS((p) => {
      const h = HYBRIDS[id];
      if (!h || p.hybrids.includes(id)) return p;
      const need = Math.max(verIndex(h.a), verIndex(h.b));
      if (need < 0 || p.model < need) return p;
      const cost = hybridCost(need);
      if (p.datasets < cost) return p;
      if (fail) return { ...p, datasets: p.datasets - cost };
      return {
        ...p, datasets: p.datasets - cost,
        hybrids: [...p.hybrids, id], hybrid: id,
      };
    });
  };

  /* Сеть: купить/продать узел (возврат 70%). */
  const buyNode = (id: string) =>
    setS((p) => {
      const n = NODES.find((x) => x.id === id);
      if (!n || p.nodes.includes(id) || p.datasets < n.cost) return p;
      return { ...p, datasets: p.datasets - n.cost, nodes: [...p.nodes, id] };
    });
  const sellNode = (id: string) =>
    setS((p) => {
      const n = NODES.find((x) => x.id === id);
      if (!n || !p.nodes.includes(id)) return p;
      return { ...p, datasets: p.datasets + Math.floor(n.cost * 0.7), nodes: p.nodes.filter((x) => x !== id) };
    });

  /* Рейд: вложиться в котёл текущего окна. */
  const raidOpenNow = (Math.floor(now / 1000) % RAIDS.windowSecs) >= RAIDS.windowSecs - RAIDS.openSecs;
  const raidBet = () =>
    setS((p) => {
      if (p.datasets < RAIDS.minBet) return p;
      return { ...p, datasets: p.datasets - RAIDS.minBet, raidPool: p.raidPool + RAIDS.minBet };
    });

  /* Лига: таблица и отправка очков. */
  const loadLeague = async () => {
    setLeague(await fetchLeague(leagueFetch));
    try {
      const t = loadToken();
      if (t) {
        const me = (await (await fetch('/api/bank/me', {
          headers: { Authorization: `Bearer ${t}` },
        })).json()) as { nick?: string };
        if (me?.nick) setMyNick(me.nick);
      }
    } catch { /* касса закрыта — таблица всё равно видна */ }
  };
  const submitPts = async () => {
    try {
      const t = loadToken();
      if (!t) { setLeagueMsg('Войди в кассу казино — без ника в лигу не берут.'); return; }
      const pts = leaguePts({ coins: sRef.current.coins, cycles: sRef.current.cycles, hybrids: sRef.current.hybrids.length });
      const ok = await submitScore(leagueFetch, t, pts);
      setLeagueMsg(ok ? `Очки ${fmt(pts)} ушли в лигу. Мы уже победили.` : 'Не вышло — попробуй позже.');
      if (ok) await loadLeague();
    } catch {
      setLeagueMsg('Таблица пока недоступна.');
    }
  };

  const train = () =>
    setS((p) => {
      if (p.model >= MODEL_LEVELS.length - 1) return p;
      const cost = trainCost(p.model);
      if (p.datasets < cost) return p;
      return { ...p, datasets: p.datasets - cost, model: p.model + 1 };
    });

  const buyUp = (key: 'cursor' | 'cooling' | 'vuln', cost: number) =>
    setS((p) => {
      if (p.coins < cost) return p;
      return { ...p, coins: p.coins - cost, [key]: p[key] + 1 };
    });

  const cursorCost = Math.ceil(50 * 2.2 ** s.cursor);
  const coolCost = Math.ceil(80 * 2 ** s.cooling);
  const vulnCost = s.vuln >= 3 ? Infinity : [200, 800, 2500][s.vuln];
  const model = useMemo(() => MODEL_LEVELS[ml], [ml]);
  const last = s.model >= MODEL_LEVELS.length - 1;

  return (
    <>
      <div id="sky" />
      <canvas id="cv" ref={cvRef} />
      <div id="veil" />
      <main>
        <div className="gridcol" id="pv-col">
          <div id="pv-hud">
            <div className="pill solid"><Database data-icon="inline-start" /> {fmt(s.datasets)}</div>
            <div className="pill solid"><Coins data-icon="inline-start" /> {fmt(s.coins)}</div>
            <div className="pill ghost">+{income.toFixed(1)}/с</div>
            <div className="pill ghost"><Brain data-icon="inline-start" /> {model.ver}</div>
            <div className={`pill ${hall > 40 ? 'solid risk' : 'ghost'}`}><Zap data-icon="inline-start" /> {hall}%</div>
            {s.cycles > 0 && <div className="pill ghost"><Trophy data-icon="inline-start" /> Ядра: {s.cycles} (×{coreMult(s.cycles).toFixed(1).replace('.', ',')})</div>}
          </div>
          {active && active.until > now && (
            <div className="shop-hint" role="status">
              <Zap data-icon="inline-start" /> {active.ev.name}: {active.ev.desc} · {Math.max(0, Math.ceil((active.until - now) / 1000))}с
            </div>
          )}
          <h1 id="pv-title">Нейросеть в подвале 42</h1>
          <p className="gtop" role="status">Аномалия дня: {anomalyDef.name} — {anomalyDef.desc}</p>
          <p className="sub" id="pv-sub">
            Старая видеокарта гудит, соседи стучат по батарее. Размечай датасеты, качай железо
            и вырасти LLM с {MODEL_LEVELS[0].ver} до {MODEL_LEVELS[MODEL_LEVELS.length - 1].ver}.
          </p>
          <AccountBar />
          <AdReward game="podval" />
          <ToggleGroup type="single" value={tab} onValueChange={(v) => { if (v) setTab(v); }} aria-label="Разделы подвала">
            <ToggleGroupItem value="podval">Подвал</ToggleGroupItem>
            <ToggleGroupItem value="iron">Железо</ToggleGroupItem>
            <ToggleGroupItem value="model">Модель</ToggleGroupItem>
            <ToggleGroupItem value="market">Рынок</ToggleGroupItem>
            <ToggleGroupItem value="league">Лига</ToggleGroupItem>
            <ToggleGroupItem value="rebirth">Ребит{s.cycles > 0 ? ` ${s.cycles}` : ''}</ToggleGroupItem>
          </ToggleGroup>
          {tab === 'podval' && (
            <>
              <div id="pv-rack" aria-label="Стойка серверов">
                {HARDWARE.map((h, i) => (
                  <div className="pv-slot" key={h.id}>
                    <div className="pv-slot-name"><Server data-icon="inline-start" /> {h.name} ×{s.hardware[i]}</div>
                    <div className="pv-leds">
                      {Array.from({ length: Math.min(12, s.hardware[i] * 2 + (rate > 0 ? 1 : 0)) }).map((_, k) => (
                        <i key={k} className={k % 4 === 3 ? 'r' : 'g'} />
                      ))}
                      {s.hardware[i] === 0 && <span className="pv-empty">слот пуст — купи железо</span>}
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" id="pv-click" className="pill solid" onClick={() => setS((p) => ({ ...p, datasets: p.datasets + clickGain(p.cursor), totalClicks: p.totalClicks + 1 }))}>
                <MousePointerClick data-icon="inline-start" /> Разметить датасет +{clickGain(s.cursor)}
              </button>
              <p className="sub">Железо капает {rate.toFixed(1)}/с{s.model >= 1 ? ' • автокликер модели размечает за тебя' : ' • v0.7 даст автокликер'}</p>
            </>
          )}
          {tab === 'iron' && (
            <>
            <div className="pv-grid">
              {HARDWARE.map((h, i) => {
                const cost = Math.ceil(hardwareCost(i, s.hardware[i]) * evPriceMul);
                return (
                  <Card key={h.id}>
                    <CardHeader>
                      <CardTitle><Cpu data-icon="inline-start" /> {h.name}</CardTitle>
                      <CardDescription>{h.desc}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Куплено: <b>{s.hardware[i]}</b> • {h.rate}/с каждая</p>
                      <button type="button" className="pill solid" disabled={s.datasets < cost} onClick={() => buyHw(i)}>
                        Купить за {fmt(cost)} датасетов
                      </button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <Card>
              <CardHeader>
                <CardTitle><Server data-icon="inline-start" /> Сеть дата-центров</CardTitle>
                <CardDescription>Платят связки: сосед +50%, кластер из 3+ даёт ×1.5. Продажа — возврат 70%.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="pv-grid">
                  {NODES.map((n) => {
                    const owned = s.nodes.includes(n.id);
                    return (
                      <div key={n.id} className="pv-slot">
                        <b>{n.name}</b> <small>{n.rate}/с • соседи: {n.links.join(', ')}</small>
                        <p>Доход: {fmt(nodeIncome(n.id, s.nodes))}/с</p>
                        {!owned ? (
                          <button type="button" className="pill solid" disabled={s.datasets < n.cost} onClick={() => buyNode(n.id)}>
                            Купить за {fmt(n.cost)}
                          </button>
                        ) : (
                          <button type="button" className="pill ghost" onClick={() => sellNode(n.id)}>
                            Продать за {fmt(Math.floor(n.cost * 0.7))}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
            </>
          )}
          {tab === 'model' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle><Brain data-icon="inline-start" /> Модель {model.ver} <Badge>{hall}% галлюцинаций</Badge></CardTitle>
                  <CardDescription>{model.perk} • Доход {income.toFixed(1)} монет/с</CardDescription>
                </CardHeader>
                <CardContent>
                  {!last ? (
                    <button type="button" className="pill solid" onClick={train} disabled={s.datasets < trainCost(s.model)}>
                      Обучить до {MODEL_LEVELS[s.model + 1].ver} за {fmt(trainCost(s.model))} датасетов
                    </button>
                  ) : (
                    <p><Trophy data-icon="inline-start" /> Финальная версия. Осталось набить {fmt(42000)} монет.</p>
                  )}
                </CardContent>
              </Card>
              <div className="pv-grid">
                <Card>
                  <CardHeader><CardTitle><MousePointerClick data-icon="inline-start" /> Курсор-разметчик {s.cursor}</CardTitle></CardHeader>
                  <CardContent>
                    <button type="button" className="pill solid" onClick={() => buyUp('cursor', cursorCost)} disabled={s.coins < cursorCost}>
                      Улучшить за {fmt(cursorCost)} монет
                    </button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle><Thermometer data-icon="inline-start" /> Охлаждение {s.cooling}</CardTitle></CardHeader>
                  <CardContent>
                    <p>−3% галлюцинаций за штуку</p>
                    <button type="button" className="pill solid" onClick={() => buyUp('cooling', coolCost)} disabled={s.coins < coolCost}>
                      Купить за {fmt(coolCost)} монет
                    </button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle><Bug data-icon="inline-start" /> Поиск уязвимостей {s.vuln}/3</CardTitle></CardHeader>
                  <CardContent>
                    <p>+{(VULN_PAYOUT[Math.min(s.vuln, 3)] / 10).toFixed(0)}/с к доходу</p>
                    {s.vuln < 3 ? (
                      <button type="button" className="pill solid" onClick={() => buyUp('vuln', vulnCost)} disabled={s.coins < vulnCost}>
                        Качнуть за {fmt(vulnCost)} монет
                      </button>
                    ) : (
                      <Badge>MAX</Badge>
                    )}
                  </CardContent>
                </Card>
              </div>
              <Card>
                <CardHeader>
                  <CardTitle><Brain data-icon="inline-start" /> Лаборатория мутаций</CardTitle>
                  <CardDescription>Скрести две открытые версии — получишь гибрид с перком. Провал 25%: +20 п.п. галлюцинаций на 60с.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="pv-grid">
                    {Object.entries(HYBRIDS).map(([id, h]) => {
                      const need = Math.max(verIndex(h.a), verIndex(h.b));
                      const open = need >= 0 && s.model >= need;
                      const owned = s.hybrids.includes(id);
                      const cost = hybridCost(Math.max(0, need));
                      return (
                        <div key={id} className="pv-slot">
                          <b>{h.name}</b> <small>{h.a}×{h.b} — {h.perk}</small>
                          <p>Активен: {s.hybrid === id ? 'да' : 'нет'}</p>
                          <button type="button" className="pill solid" disabled={!open || owned || s.datasets < cost} onClick={() => buyHybrid(id)}>
                            {owned ? 'Свой' : open ? `Скрестить за ${fmt(cost)}` : `Откроется на ${MODEL_LEVELS[Math.max(0, need)]?.ver ?? '?'}`}
                          </button>
                          {owned && s.hybrid !== id && (
                            <button type="button" className="pill ghost" onClick={() => setS((p) => ({ ...p, hybrid: id }))}>
                              Сделать активным
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
          {tab === 'market' && (
            <Card>
              <CardHeader>
                <CardTitle><Database data-icon="inline-start" /> Рынок датасетов</CardTitle>
                <CardDescription>Цена {s.mPrice.toFixed(2)} монет • тикает каждые 250мс • кламп 1..12. Продаём 10% стека, покупаем на 10% монет.</CardDescription>
              </CardHeader>
              <CardContent className="tnum">
                <p>Датасеты: <b>{fmt(s.datasets)}</b> • Монеты: <b>{fmt(s.coins)}</b></p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                  <button type="button" className="pill solid" onClick={sellMarket} disabled={s.datasets < 1}>
                    Продать 10% по {sellPrice.toFixed(2)}
                  </button>
                  <button type="button" className="pill solid" onClick={buyMarket} disabled={s.coins < s.mPrice}>
                    Купить на 10% монет
                  </button>
                </div>
                <p className="sub">Пульсы: {MARKET_PULSE.map(p => p.name).join(', ')}. Активный: {pulse && pulse.until > now ? `${pulse.id} (${Math.max(0, Math.ceil((pulse.until - now) / 1000))}с)` : '—'}{insiderLeft > 0 ? ` • инсайд: ещё ${insiderLeft} продаж +50%` : ''}</p>
              </CardContent>
            </Card>
          )}
          {tab === 'league' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle><Trophy data-icon="inline-start" /> Синдикат-рейд</CardTitle>
                  <CardDescription>Окно каждые {RAIDS.windowSecs / 60} мин на {RAIDS.openSecs / 60} мин • вклад от {RAIDS.minBet} • множитель ×{RAIDS.mul}. {raidOpenNow ? 'Котёл открыт!' : 'Котёл пока закрыт.'}</CardDescription>
                </CardHeader>
                <CardContent className="tnum">
                  <p>Твой вклад в котле: <b>{fmt(s.raidPool)}</b></p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
                    <button type="button" className="pill solid" onClick={raidBet} disabled={!raidOpenNow || s.datasets < RAIDS.minBet}>
                      Вложиться ({RAIDS.minBet} датасетов)
                    </button>
                    <button type="button" className="pill ghost" onClick={() => setS((p) => ({ ...p, raidAuto: !p.raidAuto }))}>
                      Прапор: {s.raidAuto ? 'кидает 10% сам' : 'выкл'}
                    </button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle><Trophy data-icon="inline-start" /> Лига сезонов</CardTitle>
                  <CardDescription>Очки = монеты + ядра ×5000 + гибриды ×100. Дивизион: {divisionOf(leaguePts({ coins: s.coins, cycles: s.cycles, hybrids: s.hybrids.length }))} • сезон {seasonId()}</CardDescription>
                </CardHeader>
                <CardContent className="tnum">
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button type="button" className="pill solid" onClick={() => void loadLeague()}>Обновить таблицу</button>
                    <button type="button" className="pill solid" onClick={() => void submitPts()}>Отправить очки</button>
                  </div>
                  {leagueMsg && <p role="status">{leagueMsg}</p>}
                  <ol>
                    {league.slice(0, 20).map((r) => (
                      <li key={`${r.nick}-${r.pts}`} style={r.nick === myNick ? { fontWeight: 800 } : undefined}>
                        {r.nick} — {fmt(r.pts)}
                      </li>
                    ))}
                    {league.length === 0 && <li>Пока пусто — стань первым.</li>}
                  </ol>
                </CardContent>
              </Card>
            </>
          )}
          {tab === 'rebirth' && (
            <div className="pv-grid">
              <Card>
                <CardHeader>
                  <CardTitle><Trophy data-icon="inline-start" /> Перезапуск матрицы</CardTitle>
                  <CardDescription>
                    Ядер: {s.cycles} • доход ×{coreMult(s.cycles).toFixed(1).replace('.', ',')} • каждая победа даёт +1 ядро (+50% аддитивно). Мы уже победили.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isVictory(s.model, s.coins) ? (
                    <button type="button" className="pill solid" onClick={rebirth}>
                      Перезапустить матрицу (ядер: {s.cycles} → {s.cycles + 1})
                    </button>
                  ) : (
                    <p>Кнопка появится при победе: {MODEL_LEVELS[MODEL_LEVELS.length - 1].ver} + {fmt(42000)} монет.</p>
                  )}
                </CardContent>
              </Card>
              {PRESTIGE_HARDWARE.map((h, i) => {
                const need = i === 0 ? PRESTIGE_GATES.quantum : PRESTIGE_GATES.kuzbass;
                const locked = s.cycles < need;
                const cost = Math.ceil(prestigeCost(i, s.phw[i] ?? 0) * evPriceMul);
                return (
                  <Card key={h.id}>
                    <CardHeader>
                      <CardTitle><Cpu data-icon="inline-start" /> {h.name}</CardTitle>
                      <CardDescription>{h.desc} • {h.rate}/с каждая</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {locked ? (
                        <span className="lock"><Lock data-icon="inline-start" size={14} /> Откроется после {need}-го ребита</span>
                      ) : (
                        <>
                          <p>Куплено: <b>{s.phw[i] ?? 0}</b></p>
                          <button type="button" className="pill solid" disabled={s.datasets < cost} onClick={() => buyPHW(i)}>
                            Купить за {fmt(cost)} датасетов
                          </button>
                        </>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
              <Card>
                <CardHeader>
                  <CardTitle><Zap data-icon="inline-start" /> События подвала</CardTitle>
                  <CardDescription>Тикают каждые 2–4 мин: свет, завоз, мопс, ночной тариф.</CardDescription>
                </CardHeader>
                <CardContent>
                  {s.cycles < PRESTIGE_GATES.events ? (
                    <span className="lock"><Lock data-icon="inline-start" size={14} /> Откроется после {PRESTIGE_GATES.events}-го ребита</span>
                  ) : (
                    <p>{active && active.until > now ? `${active.ev.name}: ${active.ev.desc}` : 'Эфир чист. Ждём вестей из подвала.'}</p>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle><Zap data-icon="inline-start" /> Разгон</CardTitle>
                  <CardDescription>Доход ×2, галлюцинации +15 п.п.</CardDescription>
                </CardHeader>
                <CardContent>
                  {s.cycles < PRESTIGE_GATES.overclock ? (
                    <span className="lock"><Lock data-icon="inline-start" size={14} /> Откроется после {PRESTIGE_GATES.overclock}-го ребита</span>
                  ) : (
                    <button type="button" className="pill solid" onClick={() => buyToggle('oc', 0, PRESTIGE_GATES.overclock)}>
                      {s.oc ? 'Выключить разгон' : 'Включить разгон'}
                    </button>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle><Database data-icon="inline-start" /> Мопс-ферма {s.farm}/{FARM_MAX}</CardTitle>
                  <CardDescription>+{PUG_FARM_RATE} датасетов/с за уровень.</CardDescription>
                </CardHeader>
                <CardContent>
                  {s.cycles < PRESTIGE_GATES.farm ? (
                    <span className="lock"><Lock data-icon="inline-start" size={14} /> Откроется после {PRESTIGE_GATES.farm}-го ребита</span>
                  ) : s.farm >= FARM_MAX ? (
                    <b>MAX — мопсы на пределе</b>
                  ) : (
                    <button type="button" className="pill solid" disabled={s.datasets < farmCost(s.farm)} onClick={buyFarm}>
                      Расширить за {fmt(farmCost(s.farm))} датасетов
                    </button>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle><Server data-icon="inline-start" /> Автобайер «Прапор»</CardTitle>
                  <CardDescription>Сам покупает доступное железо каждые 5с.</CardDescription>
                </CardHeader>
                <CardContent>
                  {s.cycles < PRESTIGE_GATES.autobuyer ? (
                    <span className="lock"><Lock data-icon="inline-start" size={14} /> Откроется после {PRESTIGE_GATES.autobuyer}-го ребита</span>
                  ) : (
                    <button type="button" className="pill solid" disabled={!s.auto && s.datasets < AUTOBUYER_COST} onClick={() => buyToggle('auto', AUTOBUYER_COST, PRESTIGE_GATES.autobuyer)}>
                      {s.auto ? 'Уволить Прапора' : `Нанять за ${fmt(AUTOBUYER_COST)} датасетов`}
                    </button>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle><Brain data-icon="inline-start" /> Коллекция бреда</CardTitle>
                  <CardDescription>Смешные галлюцинации каждой версии, чисто фан.</CardDescription>
                </CardHeader>
                <CardContent>
                  {s.cycles < PRESTIGE_GATES.bred ? (
                    <span className="lock"><Lock data-icon="inline-start" size={14} /> Откроется после {PRESTIGE_GATES.bred}-го ребита</span>
                  ) : (
                    BRED.map((b) => <p key={b.ver}><b>{b.ver}:</b> {b.line}</p>)
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle><Cpu data-icon="inline-start" /> Перепрошивка</CardTitle>
                  <CardDescription>Кулдаун событий ×0.5, доход +25%.</CardDescription>
                </CardHeader>
                <CardContent>
                  {s.cycles < PRESTIGE_GATES.reflash ? (
                    <span className="lock"><Lock data-icon="inline-start" size={14} /> Откроется после {PRESTIGE_GATES.reflash}-го ребита</span>
                  ) : (
                    <button type="button" className="pill solid" disabled={!s.rf && s.datasets < REFLASH_COST} onClick={() => buyToggle('rf', REFLASH_COST, PRESTIGE_GATES.reflash)}>
                      {s.rf ? 'Откатить прошивку' : `Прошить за ${fmt(REFLASH_COST)} датасетов`}
                    </button>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
          {won && (
            <div id="pv-win" ref={winRef} role="dialog" aria-label="Победа">
              <h2>v4.2 в проде. Мы уже победили</h2>
              <p>Нейросеть из подвала пишет код, ловит баги и размечает сама. Соседи всё ещё стучат — теперь от зависти.</p>
              <button type="button" className="pill solid" onClick={() => setWon(false)}>Продолжить тренировать</button>
              <button type="button" className="pill solid" onClick={rebirth} style={{ marginLeft: 8 }}>
                Перезапустить матрицу (ядер: {s.cycles} → {s.cycles + 1})
              </button>
            </div>
          )}
          <a id="pvHome" className="pill ghost" href="minigames.html" style={{ textDecoration: 'none' }}>
            <House data-icon="inline-start" /> В зал автоматов
          </a>
        </div>
        <Ads />
      </main>
    </>
  );
}
