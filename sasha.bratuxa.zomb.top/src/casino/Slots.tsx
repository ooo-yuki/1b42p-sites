import { useMemo, useState } from 'react';
import { Log, type Api } from './shared';
import Cabinet from './slots/Cabinet';
import Paytable from './slots/Paytable';
import SHistory, { loadSHist, saveSHist, type SEntry } from './slots/History';
import {
  COST, END_TICK, INITIAL_REELS, LOCK_AT, SLOT_ICONS,
  TICK_MS, TICK_MS_REDUCED, lockedAt, settle, spinFinal, validateSlots, type WinKind,
} from './slots/data';
import { jackpotSiren, leverClunk, pairClick, reelBlur, reelLock, tripsChime } from './slots/jingle';
import './slots.css';
import './slots/cabinet.css';
import './slots/pay.css';
import './slots/shist.css';

/* ЗАЛ «СЛОТЫ» — автомат «Семёрка». Оркестрация: корпус → таблица → лента.
   Правила святы: спин 50, 777 = 1000, три одинаковых 250, пара 100,
   барабаны встают на 4/8/12 тиках, финал — 14-й. */

export default function Slots({ api }: { api: Api }): JSX.Element {
  const [reels, setReels] = useState<string[]>([...INITIAL_REELS]);
  const [spinning, setSpinning] = useState(false);
  const [pulled, setPulled] = useState(false);
  const [locked, setLocked] = useState(0);
  const [lastKind, setLastKind] = useState<WinKind | null>(null);
  const [hist, setHist] = useState<SEntry[]>(() => loadSHist());
  const [seq, setSeq] = useState(() => Date.now());

  useMemo(() => {
    const bad = validateSlots();
    if (bad.length > 0) console.error('[slots] святыня нарушена:', bad.join('; '));
  }, []);

  const spin = (): void => {
    if (spinning) return;
    if (api.balance < COST) { api.say('Спин стоит 50. Возьми бонус'); return; }
    if (!api.spend(COST)) return;
    leverClunk();
    setSpinning(true);
    setPulled(true);
    setLastKind(null);
    window.setTimeout(() => setPulled(false), 600);
    const final = spinFinal();
    let ticks = 0;
    let lastLocked = 0;
    const ms = api.reduced ? TICK_MS_REDUCED : TICK_MS;
    const timer = window.setInterval(() => {
      ticks++;
      if (!api.reduced) reelBlur(ticks / END_TICK);
      const lk = lockedAt(ticks);
      if (lk !== lastLocked) {
        lastLocked = lk;
        setLocked(lk);
        if (!api.reduced) reelLock(lk);
      }
      setReels([0, 1, 2].map(i => (ticks > LOCK_AT[i] ? final[i] : SLOT_ICONS[Math.floor(Math.random() * SLOT_ICONS.length)])));
      if (ticks > END_TICK) {
        window.clearInterval(timer);
        setReels(final);
        setSpinning(false);
        setLocked(3);
        const [a, b, c] = final as [string, string, string];
        const { ret, kind } = settle([a, b, c]);
        setLastKind(kind);
        if (kind === 'jackpot') {
          api.credit(ret); api.say('ДЖЕКПОТ 777: +1000!', 'win');
          if (!api.reduced) jackpotSiren();
        } else if (kind === 'trips') {
          api.credit(ret); api.say('Три одинаковых: +250!', 'win');
          if (!api.reduced) tripsChime();
        } else if (kind === 'pair') {
          api.credit(ret); api.say('Пара: +100');
          if (!api.reduced) pairClick();
        } else {
          api.say('Мимо. Ещё по одной?');
        }
        setHist(prev => {
          const next = [{
            id: seq, reels: [a, b, c] as [string, string, string],
            kind, ret, profit: ret - COST, t: Date.now(),
          }, ...prev].slice(0, 30);
          saveSHist(next);
          return next;
        });
        setSeq(s => s + 1);
      }
    }, ms);
  };

  return (
    <section className="slots-hall">
      <Log msg={api.msg} tone={api.tone} />
      <Cabinet reels={reels} spinning={spinning} locked={spinning ? locked : 3}
        pulled={pulled} lastKind={lastKind} onSpin={spin} onLever={spin} />
      <Paytable />
      <SHistory entries={hist} onClear={() => { setHist([]); saveSHist([]); }} />
    </section>
  );
}
