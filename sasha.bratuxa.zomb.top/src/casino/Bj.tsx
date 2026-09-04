import { useMemo, useState } from 'react';
import { Log, parseStake, type Api } from './shared';
import Table from './bj/Table';
import BjHistory, { loadBjHist, saveBjHist, type BJEntry } from './bj/History';
import {
  MIN_STAKE, NATURAL_MULT, dealerPlay, drawCard, handValue, rank,
  validateBj, type Card, type Phase,
} from './bj/data';
import { cardSnap, chipPlace, dealerWin, playerWin, pushKnock, shuffleRiffle } from './bj/jingle';
import './bj.css';
import './bj/shoe.css';
import './bj/hand.css';
import './bj/table.css';
import './bj/bhist.css';

/* ЗАЛ «БЛЭКДЖЕК» — карточный салон. Оркестрация: сукно → счета.
   Правила святы: дилер тянет до 17, блэкджек с раздачи ×2.5,
   победа ×2, ничья — возврат, те же ленты и фразы. */

export default function Bj({ api }: { api: Api }): JSX.Element {
  const [bjbet, setBjbet] = useState('50');
  const [bjp, setBjp] = useState<Card[]>([]);
  const [bjd, setBjd] = useState<Card[]>([]);
  const [phase, setPhase] = useState<Phase>('idle');
  const [stake, setStake] = useState(0);
  const [ribbon, setRibbon] = useState('');
  const [ribbonKind, setRibbonKind] = useState<'' | 'win' | 'lose' | 'push'>('');
  const [roundId, setRoundId] = useState(0);
  const [hist, setHist] = useState<BJEntry[]>(() => loadBjHist());
  const [seq, setSeq] = useState(() => Date.now());

  useMemo(() => {
    const bad = validateBj();
    if (bad.length > 0) console.error('[bj] святыня нарушена:', bad.join('; '));
  }, []);

  const pushHist = (e: Omit<BJEntry, 'id' | 't'>): void => {
    setHist(prev => {
      const next = [{ ...e, id: seq, t: Date.now() }, ...prev].slice(0, 30);
      saveBjHist(next);
      return next;
    });
    setSeq(s => s + 1);
  };

  const show = (text: string, kind: '' | 'win' | 'lose' | 'push'): void => {
    setRibbon(text);
    setRibbonKind(kind);
  };

  const deal = (): void => {
    if (phase === 'player') return;
    const s = parseStake(bjbet, MIN_STAKE, api);
    if (s === null) return;
    chipPlace();
    if (!api.reduced) shuffleRiffle();
    setStake(s);
    const p = [drawCard(), drawCard()];
    const d = [drawCard(), drawCard()];
    setBjp(p); setBjd(d); setPhase('player');
    setRoundId(r => r + 1);
    show('', '');
    if (handValue(p) === 21) {
      const win = Math.floor(s * NATURAL_MULT);
      api.credit(win);
      setPhase('done');
      show('Блэкджек с раздачи!', 'win');
      if (!api.reduced) playerWin(true);
      api.say(`БЛЭКДЖЕК! +${win}`, 'win');
      pushHist({ stake: s, pv: 21, dv: handValue(d), outcome: 'natural', ret: win, profit: win - s });
    } else {
      if (!api.reduced) { cardSnap(); }
      api.say(`Твои ${handValue(p)}, у дилера ${rank(d[0].r)}${d[0].s} + ?. Ещё или хватит?`);
    }
  };

  const stand = (): void => {
    if (phase !== 'player') return;
    const d = dealerPlay(bjd);
    setBjd(d);
    setPhase('done');
    const pv = handValue(bjp), dv = handValue(d);
    if (dv > 21 || pv > dv) {
      api.credit(stake * 2);
      show('Стол твой!', 'win');
      if (!api.reduced) playerWin(false);
      api.say(`Твои ${pv} против ${dv} — победа! +${stake * 2}`, 'win');
      pushHist({ stake, pv, dv, outcome: 'win', ret: stake * 2, profit: stake });
    } else if (pv === dv) {
      api.credit(stake);
      show('Ничья — фишки вернулись.', 'push');
      if (!api.reduced) pushKnock();
      api.say(`Ничья ${pv}:${dv} — ставка вернулась`);
      pushHist({ stake, pv, dv, outcome: 'push', ret: stake, profit: 0 });
    } else {
      show('Дилер забрал банк.', 'lose');
      if (!api.reduced) dealerWin();
      api.say(`Твои ${pv} против ${dv} — дилер забрал ${stake}`, 'lose');
      pushHist({ stake, pv, dv, outcome: 'lose', ret: 0, profit: -stake });
    }
  };

  const hit = (): void => {
    if (phase !== 'player') return;
    const p = [...bjp, drawCard()];
    setBjp(p);
    if (!api.reduced) cardSnap();
    const v = handValue(p);
    if (v > 21) {
      setPhase('done');
      show('Перебор.', 'lose');
      if (!api.reduced) dealerWin();
      api.say(`Перебор: ${v}. Минус ${stake}`, 'lose');
      pushHist({ stake, pv: v, dv: handValue(bjd), outcome: 'bust', ret: 0, profit: -stake });
    } else if (v === 21) {
      stand();
    } else {
      api.say(`Твои ${v}. Ещё или хватит?`);
    }
  };

  return (
    <section className="bj-hall">
      <Log msg={api.msg} tone={api.tone} />
      <Table bjp={bjp} bjd={bjd} phase={phase} ribbon={ribbon} ribbonKind={ribbonKind}
        bjbet={bjbet} dealToken={roundId} stake={stake}
        onBet={setBjbet} onDeal={deal} onHit={hit} onStand={stand} />
      <BjHistory entries={hist} onClear={() => { setHist([]); saveBjHist([]); }} />
    </section>
  );
}
