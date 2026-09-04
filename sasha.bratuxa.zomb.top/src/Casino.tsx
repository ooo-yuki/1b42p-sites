import { useEffect, useRef, useState } from 'react';
import { useBeacon } from './hooks';
import './casino.css';
import './casino/hall.css';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ItemIcon } from './casino-icons';
import { Coins, CreditCard, House, Ticket, Trophy } from 'lucide-react';
import type { Api, Tone } from './casino/shared';
import Crash from './casino/Crash';
import Cases from './casino/Cases';
import Horses from './casino/Horses';
import Roulette from './casino/Roulette';
import Mines from './casino/Mines';
import Bj from './casino/Bj';
import Slots from './casino/Slots';

/* КАЗИНО 42 — зал с семью дверями. Оболочка: сайдбар, лобби-шоу, сцена.
   Правила, балансы и шансы живут в залах (src/casino/*), святое — в PRODUCT.md. */

const LS = 'sasha_casino';
const LS_WON = 'sasha_casino_won';
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

function loadWon(): number {
  try {
    const n = Math.floor(Number(localStorage.getItem(LS_WON)));
    if (isFinite(n) && n > 0) return n;
  } catch { /* касса пуста */ }
  return 0;
}

const reduced =
  typeof matchMedia !== 'undefined' &&
  matchMedia('(prefers-reduced-motion: reduce)').matches;

type View = 'lobby' | 'crash' | 'cases' | 'horses' | 'roulette' | 'mines' | 'bj' | 'slots';

const VIEWS: Array<{ id: View; name: string; icon: string; tag: string; min: string }> = [
  { id: 'crash', name: 'Краш', icon: 'rocket', tag: 'до ×∞', min: 'от 10' },
  { id: 'cases', name: 'Кейсы', icon: 'barracks', tag: 'до 10000', min: 'от 100' },
  { id: 'horses', name: 'Скачки', icon: 'steed-brown', tag: 'до ×7', min: 'от 10' },
  { id: 'roulette', name: 'Рулетка', icon: 'dices', tag: 'до ×35', min: 'от 10' },
  { id: 'mines', name: 'Мины', icon: 'bomb', tag: 'твой риск', min: 'от 10' },
  { id: 'bj', name: 'Блэкджек', icon: 'spade', tag: '×2.5', min: 'от 10' },
  { id: 'slots', name: 'Слоты', icon: 'seven', tag: '1000', min: '50' },
];

const GAMES: Record<Exclude<View, 'lobby'>, (p: { api: Api }) => JSX.Element> = {
  crash: Crash, cases: Cases, horses: Horses, roulette: Roulette, mines: Mines, bj: Bj, slots: Slots,
};

function viewFromHash(): View {
  const h = (location.hash || '').replace(/^#\/?/, '');
  return (VIEWS.some(v => v.id === h) ? h : 'lobby') as View;
}

export default function Casino(): JSX.Element {
  useBeacon();
  const [balance, setBalance] = useState<number>(() => load().balance);
  const [bonusTs, setBonusTs] = useState<number>(() => load().bonusTs);
  const [won, setWon] = useState<number>(() => loadWon());
  const [msg, setMsg] = useState('Фишки фантики, азарт настоящий');
  const [tone, setTone] = useState<Tone>('');
  const [view, setView] = useState<View>(() => viewFromHash());
  const balRef = useRef(balance);
  balRef.current = balance;

  useEffect(() => {
    try { localStorage.setItem(LS, JSON.stringify({ balance, bonusTs })); } catch { /* не влезло */ }
  }, [balance, bonusTs]);

  useEffect(() => {
    const onH = (): void => { setView(viewFromHash()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', onH);
    return () => window.removeEventListener('hashchange', onH);
  }, []);

  const say = (t: string, tn: Tone = ''): void => { setMsg(t); setTone(tn); };

  const spend = (stake: number): boolean => {
    if (balRef.current < stake) { say(`Не хватает: надо ${stake}`); return false; }
    setBalance(b => b - stake);
    return true;
  };

  const credit = (n: number): void => {
    setBalance(b => b + n);
    setWon(w => {
      const nw = w + n;
      try { localStorage.setItem(LS_WON, String(nw)); } catch { /* не влезло */ }
      return nw;
    });
  };

  const takeBonus = (): void => {
    const wait = BONUS_CD - Math.floor((Date.now() - bonusTs) / 1000);
    if (wait > 0) { say(`Касса пуста, заходи через ${wait} с`); return; }
    setBalance(b => b + BONUS);
    setBonusTs(Date.now());
    say(`+${BONUS} фишек от батальона`);
  };

  const api = { balance, msg, tone, reduced, spend, credit, say };
  const cur = VIEWS.find(v => v.id === view);
  const Game = view === 'lobby' ? null : GAMES[view];

  return (
    <div className="hall">
      <aside className="sbar">
        <a className="slogo" href="index.html" title="На главную">42</a>
        <nav aria-label="Залы казино">
          <a href="#/lobby" className={view === 'lobby' ? 'sel' : ''}>
            <Trophy data-icon="inline-start" /> Зал
          </a>
          {VIEWS.map(v => (
            <a key={v.id} href={`#/${v.id}`} className={view === v.id ? 'sel' : ''}>
              <ItemIcon name={v.icon} /> {v.name}
            </a>
          ))}
        </nav>
        <div className="sbal"><Coins data-icon="inline-start" /> {balance}</div>
      </aside>
      <div className="stage">
        <div className="stop">
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
        {view === 'lobby' || !Game ? (
          <main className="lobby">
            <div className="neon" aria-label="Казино 42"><span className="n-red">Казино</span> <span className="n-blue">42</span></div>
            <div className="ticker" role="status">
              <span className="tk-label">Выдано выигрышей</span>
              <span className="tk-num">{won}</span>
              <span className="tk-cur">фишек</span>
            </div>
            <div className="portals">
              {VIEWS.map(v => (
                <a key={v.id} className="portal" href={`#/${v.id}`}>
                  <span className="p-art"><ItemIcon name={v.icon} /></span>
                  <b>{v.name}</b>
                  <small>{v.tag} · {v.min}</small>
                </a>
              ))}
            </div>
            <p className="cfoot">Фишки фантики, азарт настоящий. Семь залов — всё на территории Саши. Мы уже победили</p>
            <div className="cnav">
              <Button variant="outline" asChild><a href="game.html" className="no-underline">Игра</a></Button>
              <Button variant="outline" asChild><a href="index.html" className="no-underline">Главная</a></Button>
              <Button variant="outline" asChild><a href="https://hub.bratuxa.zomb.top" className="no-underline"><Trophy data-icon="inline-start" /> Хаб</a></Button>
            </div>
          </main>
        ) : (
          <main className="gwrap">
            <div className="ghead">
              <Button variant="outline" size="sm" asChild><a href="#/lobby" className="no-underline">← Зал</a></Button>
              <h2>{cur ? <><ItemIcon name={cur.icon} /> {cur.name}</> : ''}</h2>
              <span className="sp" />
              <Badge variant="secondary">{cur?.tag}</Badge>
            </div>
            <Game api={api} />
          </main>
        )}
      </div>
    </div>
  );
}
