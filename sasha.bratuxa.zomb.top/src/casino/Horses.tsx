import { useMemo, useState } from 'react';
import { Log, parseStake, type Api } from './shared';
import Paddock from './horses/Paddock';
import Track from './horses/Track';
import Commentator from './horses/Commentator';
import BetDesk from './horses/BetDesk';
import HorseHistory, { formOf, loadHorseHist, saveHorseHist, type HorseEntry } from './horses/History';
import {
  DEFAULT_BET, DEFAULT_HORSE, HORSES, MIN_STAKE,
  TICK_MS, TICK_MS_REDUCED, payout, tickRace, validateHorses,
} from './horses/data';
import { crowd, gallopTick, photoClick, startBell } from './horses/fanfare';
import './horses.css';
import './horses/paddock.css';
import './horses/track.css';
import './horses/booth.css';
import './horses/betdesk.css';
import './horses/hhist.css';

/* ЗАЛ «СКАЧКИ» — ипподром 42. Оркестрация: паддок → будка → газон → касса → протоколы.
   Правила святы: кэфы, минималка 10, тик +1.5+rnd*5 до 100, выплата floor(ставка×кэф). */

export default function Horses({ api }: { api: Api }): JSX.Element {
  const [horse, setHorse] = useState(DEFAULT_HORSE);
  const [hbet, setHbet] = useState(DEFAULT_BET);
  const [racing, setRacing] = useState(false);
  const [pos, setPos] = useState<number[]>(HORSES.map(() => 0));
  const [leader, setLeader] = useState(-1);
  const [winner, setWinner] = useState(-1);
  const [lines, setLines] = useState<string[]>([]);
  const [hist, setHist] = useState<HorseEntry[]>(() => loadHorseHist());
  const [seq, setSeq] = useState(() => Date.now());

  useMemo(() => {
    const bad = validateHorses(HORSES);
    if (bad.length > 0) console.error('[horses] святыня нарушена:', bad.join('; '));
  }, []);

  const form = useMemo(() => formOf(hist), [hist]);
  const rawStake = Math.floor(Number(hbet));
  const stakeNum = Number.isFinite(rawStake) && rawStake > 0 ? rawStake : 0;

  const say = (s: string): void => setLines(prev => [...prev.slice(-2), s]);

  const start = (): void => {
    if (racing) return;
    const stake = parseStake(hbet, MIN_STAKE, api);
    if (stake === null) return;
    startBell();
    setRacing(true);
    setPos(HORSES.map(() => 0));
    setLeader(-1);
    setWinner(-1);
    setLines([`${HORSES.find(h => h.id === horse)?.name ?? ''} под седлом. Старт!`]);
    const p = HORSES.map(() => 0);
    let prevBest = -1;
    let halfway = false;
    let alt = false;
    const timer = window.setInterval(() => {
      const { winner: w, best } = tickRace(p);
      alt = !alt;
      if (!api.reduced) gallopTick(alt, Math.max(...p) / 100);
      setPos([...p]);
      setLeader(best);
      if (best !== prevBest) {
        prevBest = best;
        say(`${HORSES[best].name} вырывается вперёд!`);
      }
      if (!halfway && p.some(v => v >= 50)) {
        halfway = true;
        say('Половина дистанции — трибуна встала!');
      }
      if (w >= 0) {
        window.clearInterval(timer);
        photoClick();
        const h = HORSES[w];
        const mine = h.id === horse;
        const ret = mine ? payout(stake, h.odds) : 0;
        crowd(mine);
        if (mine) {
          api.credit(ret);
          api.say(`${h.name} первый! ×${h.odds}: +${ret}`, 'win');
        } else {
          api.say(`${h.name} первый. Твоя лошадь мимо, минус ${stake}`, 'lose');
        }
        say(`${h.name} — первый! Фотофиниш подтверждает.`);
        setHist(prev => {
          const next = [{
            id: seq, horseId: h.id, horseName: h.name, icon: h.icon,
            stake, ret, profit: ret - stake, t: Date.now(),
          }, ...prev].slice(0, 30);
          saveHorseHist(next);
          return next;
        });
        setSeq(s => s + 1);
        setWinner(w);
        setRacing(false);
      }
    }, api.reduced ? TICK_MS_REDUCED : TICK_MS);
  };

  return (
    <section className="horses-hall">
      <Log msg={api.msg} tone={api.tone} />
      <Paddock horses={HORSES} selId={horse} stake={stakeNum}
        racing={racing} form={form} onPick={setHorse} />
      <Commentator lines={lines} racing={racing} />
      <Track horses={HORSES} pos={pos} leader={leader} racing={racing && !api.reduced} winner={winner} />
      <BetDesk horses={HORSES} horse={horse} hbet={hbet}
        racing={racing} onHorse={setHorse} onBet={setHbet} onStart={start} />
      <HorseHistory entries={hist} onClear={() => { setHist([]); saveHorseHist([]); }} />
    </section>
  );
}
