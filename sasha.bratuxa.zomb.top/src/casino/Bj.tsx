import { useState } from 'react';
import { Api, Log, Num, parseStake } from './shared';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import './bj.css';

/* ЗАЛ «БЛЭКДЖЕК» — карточный салон. Сукно, дилер, открытая игра.
   Правила святы: дилер тянет до 17, блэкджек с раздачи ×2.5. */

type Card = { r: number; s: string };
const SUITS = ['♠', '♥', '♦', '♣'];
const RED = new Set(['♥', '♦']);

const drawCard = (): Card => ({
  r: 1 + Math.floor(Math.random() * 13),
  s: SUITS[Math.floor(Math.random() * 4)],
});

function handValue(h: Card[]): number {
  let t = 0, aces = 0;
  for (const c of h) {
    if (c.r === 1) { aces++; t += 11; }
    else t += Math.min(10, c.r);
  }
  while (t > 21 && aces > 0) { t -= 10; aces--; }
  return t;
}

function rank(r: number): string {
  return r === 1 ? 'A' : r === 11 ? 'J' : r === 12 ? 'Q' : r === 13 ? 'K' : String(r);
}

function PCard({ c, back }: { c?: Card; back?: boolean }): JSX.Element {
  if (back || !c) return <span className="pcard back" aria-label="Закрытая карта" />;
  return (
    <span className={`pcard${RED.has(c.s) ? ' red' : ''}`}>
      <b>{rank(c.r)}</b><i>{c.s}</i><em>{c.s}</em>
    </span>
  );
}

export default function Bj({ api }: { api: Api }): JSX.Element {
  const [bjbet, setBjbet] = useState('50');
  const [bjp, setBjp] = useState<Card[]>([]);
  const [bjd, setBjd] = useState<Card[]>([]);
  const [phase, setPhase] = useState<'idle' | 'player' | 'done'>('idle');
  const [stake, setStake] = useState(0);
  const [ribbon, setRibbon] = useState('');

  const deal = (): void => {
    if (phase === 'player') return;
    const s = parseStake(bjbet, 10, api);
    if (s === null) return;
    setStake(s);
    const p = [drawCard(), drawCard()];
    const d = [drawCard(), drawCard()];
    setBjp(p); setBjd(d); setPhase('player'); setRibbon('');
    if (handValue(p) === 21) {
      const win = Math.floor(s * 2.5);
      api.credit(win);
      setPhase('done');
      setRibbon('Блэкджек с раздачи!');
      api.say(`БЛЭКДЖЕК! +${win}`, 'win');
    } else {
      api.say(`Твои ${handValue(p)}, у дилера ${rank(d[0].r)}${d[0].s} + ?. Ещё или хватит?`);
    }
  };

  const stand = (): void => {
    if (phase !== 'player') return;
    const d = [...bjd];
    while (handValue(d) < 17) d.push(drawCard());
    setBjd(d);
    setPhase('done');
    const pv = handValue(bjp), dv = handValue(d);
    if (dv > 21 || pv > dv) {
      api.credit(stake * 2);
      setRibbon('Стол твой!');
      api.say(`Твои ${pv} против ${dv} — победа! +${stake * 2}`, 'win');
    } else if (pv === dv) {
      api.credit(stake);
      setRibbon('Ничья — фишки вернулись.');
      api.say(`Ничья ${pv}:${dv} — ставка вернулась`);
    } else {
      setRibbon('Дилер забрал банк.');
      api.say(`Твои ${pv} против ${dv} — дилер забрал ${stake}`, 'lose');
    }
  };

  const hit = (): void => {
    if (phase !== 'player') return;
    const p = [...bjp, drawCard()];
    setBjp(p);
    const v = handValue(p);
    if (v > 21) {
      setPhase('done');
      setRibbon('Перебор.');
      api.say(`Перебор: ${v}. Минус ${stake}`, 'lose');
    } else if (v === 21) {
      stand();
    } else {
      api.say(`Твои ${v}. Ещё или хватит?`);
    }
  };

  return (
    <section className="bj-hall">
      <Log msg={api.msg} tone={api.tone} />
      <div className="felt">
        <div className="felt-arc" aria-hidden />
        <div className="seat dealer">
          <div className="seat-tag">Дилер {bjd.length > 0 && phase !== 'player' ? <Badge variant="secondary"><Num>{handValue(bjd)}</Num></Badge> : ''}</div>
          <div className="hand">
            {bjd.length === 0 && <span className="ghost">место дилера</span>}
            {bjd.map((c, i) => <PCard key={i} c={c} back={i === 1 && phase === 'player'} />)}
          </div>
        </div>
        {ribbon && <div className="ribbon">{ribbon}</div>}
        <div className="seat player">
          <div className="hand">
            {bjp.length === 0 && <span className="ghost">твоё место — жми «Раздать»</span>}
            {bjp.map((c, i) => <PCard key={i} c={c} />)}
          </div>
          <div className="seat-tag">Ты {bjp.length > 0 ? <Badge variant="secondary"><Num>{handValue(bjp)}</Num></Badge> : ''}</div>
        </div>
        <div className="felt-bar">
          <Input value={bjbet} onChange={e => setBjbet(e.target.value)} inputMode="numeric" aria-label="Ставка на блэкджек" />
          {phase === 'player'
            ? <><Button onClick={hit}>Ещё</Button><Button variant="outline" onClick={stand}>Хватит</Button></>
            : <Button onClick={deal}>Раздать</Button>}
        </div>
      </div>
    </section>
  );
}
