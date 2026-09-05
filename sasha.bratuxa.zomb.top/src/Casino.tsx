import { useEffect, useRef, useState } from 'react';
import { useBeacon } from './hooks';
import './casino.css';
import './casino/hall.css';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ItemIcon } from './casino-icons';
import { Separator } from '@/components/ui/separator';
import { Coins, CreditCard, House, RotateCcw, Trophy } from 'lucide-react';
import type { Api, Tone } from './casino/shared';
import AuthGate from './casino/AuthGate';
import Leaders from './casino/Leaders';
import { loadToken, me, saveToken, syncDelta, type BankUser } from './casino/bank';
import './casino/bank.css';
import Crash from './casino/Crash';
import Cases from './casino/Cases';
import Horses from './casino/Horses';
import Roulette from './casino/Roulette';
import Mines from './casino/Mines';
import Bj from './casino/Bj';
import Slots from './casino/Slots';
import Plinko from './casino/Plinko';
import Ladder from './casino/Ladder';
import Fortune from './casino/Fortune';

/* КАЗИНО 42 — зал с десятью дверями. Оболочка: сайдбар, лобби-шоу, сцена.
   Правила, балансы и шансы живут в залах (src/casino/*), святое — в PRODUCT.md. */

/* Сброс батальона 05.09.2026: счета всех бойцов обнулены приказом Саши.
   Старый кошелёк sasha_casino больше не читается — у каждого свежий старт. */
const LS = 'sasha_casino2';
const LS_WON = 'sasha_casino_won';
const START_BALANCE = 1000;

type Save = { balance: number };

function load(): Save {
  try {
    const raw = localStorage.getItem(LS);
    if (raw) {
      const o = JSON.parse(raw) as Partial<Save & { bonusTs: number }>;
      if (typeof o.balance === 'number') return { balance: Math.max(0, Math.floor(o.balance)) };
    }
  } catch { /* свежий кошелёк */ }
  return { balance: START_BALANCE };
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

type View = 'lobby' | 'crash' | 'cases' | 'horses' | 'roulette' | 'mines' | 'bj' | 'slots' | 'plinko' | 'ladder' | 'wheel';

const VIEWS: Array<{ id: View; name: string; icon: string; tag: string; min: string; desc: string }> = [
  { id: 'crash', name: 'Краш', icon: 'rocket', tag: 'до ×∞', min: 'от 10', desc: 'Множитель растёт, пока ракета летит. Забирай до крэша — иначе ставка сгорает.' },
  { id: 'cases', name: 'Кейсы', icon: 'barracks', tag: 'до 3000', min: 'от 100', desc: 'Платишь за сейф — лента крутится, что выпало, то твоё. Шансы написаны честно.' },
  { id: 'horses', name: 'Скачки', icon: 'steed-brown', tag: 'до ×7.5', min: 'от 10', desc: 'Выбери лошадь, поставь фишки. Кто первый до финиша — тот и прав.' },
  { id: 'roulette', name: 'Рулетка', icon: 'dices', tag: 'до ×35', min: 'от 10', desc: 'Европейская: красное и чёрное ×2, зеро ×35, точное число ×35.' },
  { id: 'mines', name: 'Мины', icon: 'bomb', tag: 'твой риск', min: 'от 10', desc: 'Открывай клетки. Кристалл растит множитель, мина сжигает ставку.' },
  { id: 'bj', name: 'Блэкджек', icon: 'spade', tag: '×2.5', min: 'от 10', desc: 'Набери 21, но не больше. Дилер тянет до 17. Блэкджек с раздачи платит ×2.5.' },
  { id: 'slots', name: 'Слоты', icon: 'seven', tag: '1000', min: '50', desc: 'Автомат «Семёрка». Спин — 50 фишек, таблица выплат выбита на корпусе.' },
  { id: 'plinko', name: 'Плинко', icon: 'plinko', tag: 'до ×70', min: 'от 10', desc: 'Доска «Водопад 42». Шарик скачет по колышкам в лунку — края платят до ×70, шансы написаны честно.' },
  { id: 'ladder', name: 'Лесенка', icon: 'ladder', tag: 'до ×195', min: 'от 10', desc: 'Сигнал «42». Восемь ступеней вверх: на каждой — рискнуть или забрать. Вершина платит ×195.' },
  { id: 'wheel', name: 'Колесо', icon: 'wheel', tag: 'до ×4', min: 'от 10', desc: 'Колесо фортуны: десять клиньев, стрелка сверху. Топ ×4, три зеро сжигают ставку.' },
];

const GAMES: Record<Exclude<View, 'lobby'>, (p: { api: Api }) => JSX.Element> = {
  crash: Crash, cases: Cases, horses: Horses, roulette: Roulette, mines: Mines, bj: Bj, slots: Slots, plinko: Plinko, ladder: Ladder, wheel: Fortune,
};

function viewFromHash(): View {
  const h = (location.hash || '').replace(/^#\/?/, '');
  return (VIEWS.some(v => v.id === h) ? h : 'lobby') as View;
}

export default function Casino(): JSX.Element {
  useBeacon();
  const [balance, setBalance] = useState<number>(() => load().balance);
  const [won, setWon] = useState<number>(() => loadWon());
  const [msg, setMsg] = useState('Фишки фантики, азарт настоящий');
  const [tone, setTone] = useState<Tone>('');
  const [view, setView] = useState<View>(() => viewFromHash());
  const [confirmReset, setConfirmReset] = useState(false);
  const [user, setUser] = useState<BankUser | null>(null);
  const [token, setToken] = useState<string | null>(() => loadToken());
  const [guest, setGuest] = useState(false);
  const balRef = useRef(balance);
  balRef.current = balance;
  const tokenRef = useRef(token);
  tokenRef.current = token;

  useEffect(() => {
    try { localStorage.setItem(LS, JSON.stringify({ balance })); } catch { /* не влезло */ }
  }, [balance]);

  /* Тихий вход по сохранённому токену: касса подтверждает — забираем счёт. */
  useEffect(() => {
    if (!token || user || guest) return;
    me(token).then(r => {
      if (r.ok && r.nick && typeof r.balance === 'number') {
        setUser({ nick: r.nick, balance: r.balance });
        setBalance(r.balance);
        say(`С возвращением, ${r.nick}. Касса помнит`);
      } else {
        saveToken(null);
        setToken(null);
      }
    }).catch(() => { /* касса спит — гостем */ });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const onH = (): void => { setView(viewFromHash()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', onH);
    return () => window.removeEventListener('hashchange', onH);
  }, []);

  const say = (t: string, tn: Tone = ''): void => { setMsg(t); setTone(tn); };

  const bankLost = (): void => {
    saveToken(null);
    setToken(null);
    setUser(null);
    say('Касса забыла. Войди заново');
  };

  const spend = (stake: number): boolean => {
    if (balRef.current < stake) { say(`Не хватает: надо ${stake}`); return false; }
    setBalance(b => b - stake);
    const t = tokenRef.current;
    if (t) {
      void syncDelta(t, -stake)
        .then(r => { if (!r.ok && r.error === 'Войди в кассу') bankLost(); })
        .catch(() => { /* касса спит — счёт локальный */ });
    }
    return true;
  };

  const credit = (n: number): void => {
    setBalance(b => b + n);
    const t = tokenRef.current;
    if (t) {
      void syncDelta(t, n)
        .then(r => { if (!r.ok && r.error === 'Войди в кассу') bankLost(); })
        .catch(() => { /* касса спит */ });
    }
    setWon(w => {
      const nw = w + n;
      try { localStorage.setItem(LS_WON, String(nw)); } catch { /* не влезло */ }
      return nw;
    });
  };

  const resetBalance = (): void => {
    if (!confirmReset) {
      setConfirmReset(true);
      say('Точно сбросить? Баланс станет 1000. Жми ещё раз');
      window.setTimeout(() => setConfirmReset(false), 5000);
      return;
    }
    setConfirmReset(false);
    setBalance(START_BALANCE);
    const t = tokenRef.current;
    if (t && user) {
      const delta = START_BALANCE - balRef.current;
      if (delta !== 0) void syncDelta(t, delta).catch(() => { /* касса спит */ });
    }
    say('Баланс сброшен: снова 1000 фишек. Мы уже победили');
  };

  const enter = (u: BankUser, tok: string): void => {
    saveToken(tok);
    setToken(tok);
    setUser(u);
    setBalance(u.balance);
    setGuest(false);
    say(`Касса открыта, ${u.nick}. Ставки идут в таблицу`);
  };

  const exit = (): void => {
    saveToken(null);
    setToken(null);
    setUser(null);
    setGuest(false);
    setBalance(START_BALANCE);
    say('Вышел из кассы. Фишки фантики, азарт настоящий');
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
          {user && <Badge variant="secondary">{user.nick}</Badge>}
          <span className="sp" />
          {user && <Button variant="outline" size="sm" onClick={exit} title="Выйти из кассы">Выйти</Button>}
          <Button variant="outline" size="sm" onClick={resetBalance}
            title="Сбросить баланс к стартовой тысяче">
            <RotateCcw data-icon="inline-start" /> {confirmReset ? 'Точно сбросить?' : 'Сброс'}</Button>
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
            {(!user && !guest) && (
              <AuthGate onAuth={enter} onGuest={() => { setGuest(true); say('Гость в зале. Счёт местный, в таблицу не идёт'); }} />
            )}
            <Separator className="lobby-sep" />
            <Leaders me={user?.nick ?? null} />
            <p className="cfoot">Фишки фантики, азарт настоящий. Десять залов — всё на территории Саши. Мы уже победили</p>
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
            {cur && <p className="gdesc">{cur.desc}</p>}
            {(!user && !guest)
              ? <AuthGate onAuth={enter} onGuest={() => { setGuest(true); say('Гость в зале. Счёт местный, в таблицу не идёт'); }} />
              : <Game api={api} />}
          </main>
        )}
      </div>
    </div>
  );
}
