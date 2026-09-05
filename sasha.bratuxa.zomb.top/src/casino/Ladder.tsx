import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, HandCoins } from 'lucide-react';
import { Log, Num, parseStake, type Api } from './shared';
import Steps from './ladder/Steps';
import LHistory, { loadLHist, saveLHist, type LEntry } from './ladder/History';
import {
  MIN_STAKE, MULTS, STEPS, climb, expectedFirstCash, honestOdds,
  settleHeight, validateLadder,
} from './ladder/data';
import { cashChime, fallDown, stepUp } from './ladder/jingle';
import './ladder.css';
import './ladder/lhist.css';

/* ЗАЛ «ЛЕСЕНКА» — сигнал «42». Оркестрация: ставка → подножие → вверх/забрать.
   Правила святы: 8 ступеней, шанс ступени 1/2, упал — ставка сгорела,
   вершина ×195 забирается сама. */

type Phase = 'idle' | 'climb' | 'done';

export default function Ladder({ api }: { api: Api }): JSX.Element {
  const [raw, setRaw] = useState('50');
  const [stake, setStake] = useState(0);
  const [height, setHeight] = useState(-1);
  const [phase, setPhase] = useState<Phase>('idle');
  const [fallen, setFallen] = useState(false);
  const [hist, setHist] = useState<LEntry[]>(() => loadLHist());
  const [seq, setSeq] = useState(() => Date.now());

  useMemo(() => {
    const bad = validateLadder();
    if (bad.length > 0) console.error('[ladder] святыня нарушена:', bad.join('; '));
  }, []);

  const pushHist = (h: number, mult: number, ret: number, st: number): void => {
    setHist(prev => {
      const next = [{
        id: seq, stake: st, height: h, mult, ret, profit: ret - st, t: Date.now(),
      }, ...prev].slice(0, 30);
      saveLHist(next);
      return next;
    });
    setSeq(s => s + 1);
  };

  const start = (): void => {
    if (phase === 'climb') return;
    const st = parseStake(raw, MIN_STAKE, api);
    if (st === null) return;
    setStake(st);
    setHeight(-1);
    setFallen(false);
    setPhase('climb');
    api.say('У подножия. Вверх — риск, забрать пока нечего');
  };

  const up = (): void => {
    if (phase !== 'climb') return;
    if (climb()) {
      const h = height + 1;
      setHeight(h);
      if (!api.reduced) stepUp(h);
      if (h >= STEPS - 1) {
        const mult = settleHeight(h);
        const ret = Math.floor(stake * mult);
        api.credit(ret);
        setPhase('done');
        if (!api.reduced) cashChime(h);
        api.say(`ВЕРШИНА! ×${mult} = +${ret}. Сигнал принят`, 'win');
        pushHist(h, mult, ret, stake);
      } else {
        api.say(`Ступень ${h + 1}: ×${settleHeight(h)}. Выше — риск, или забирай`);
      }
    } else {
      setFallen(true);
      setPhase('done');
      if (!api.reduced) fallDown();
      api.say(height < 0
        ? 'Сорвался на первой. Ставка сгорела'
        : `Сорвался со ступени ${height + 1}. Ставка сгорела`);
      pushHist(Math.max(0, height), 0, 0, stake);
    }
  };

  const cash = (): void => {
    if (phase !== 'climb' || height < 0) return;
    const mult = settleHeight(height);
    const ret = Math.floor(stake * mult);
    api.credit(ret);
    setPhase('done');
    if (!api.reduced) cashChime(height);
    api.say(`Забрал со ступени ${height + 1}: ×${mult} = +${ret}`, 'win');
    pushHist(height, mult, ret, stake);
  };

  const cashSum = height >= 0 ? Math.floor(stake * settleHeight(height)) : 0;
  const odds = honestOdds();

  return (
    <section className="ladder-hall">
      <Log msg={api.msg} tone={api.tone} />
      {phase !== 'climb' && (
        <div className="ld-desk">
          <label className="ld-stake">
            <span>Ставка</span>
            <Input value={raw} inputMode="numeric" aria-label="Ставка в фишках"
              onChange={e => setRaw(e.target.value)} />
          </label>
          <Button size="lg" onClick={start} className="ld-start">
            <ArrowUp data-icon="inline-start" /> Начать подъём
          </Button>
        </div>
      )}
      {phase !== 'idle' && (
        <>
          <Steps height={Math.max(0, height)} fallen={fallen} cashed={phase === 'done' && !fallen} />
          {phase === 'climb' && (
            <div className="ld-actions">
              <Button size="lg" onClick={up} className="ld-up">
                <ArrowUp data-icon="inline-start" /> Вверх! Риск
              </Button>
              <Button size="lg" variant={height < 0 ? 'outline' : 'secondary'}
                onClick={cash} disabled={height < 0} className="ld-cash">
                <HandCoins data-icon="inline-start" />
                {height < 0 ? 'Забрать нечего' : `Забрать ${cashSum}`}
              </Button>
            </div>
          )}
          {phase === 'done' && (
            <div className="ld-actions">
              <Button size="lg" variant="outline" onClick={start}>Ещё сигнал</Button>
            </div>
          )}
        </>
      )}
      <div className="ld-odds" aria-label="Честные шансы">
        {odds.map(o => (
          <Badge key={o.label} variant="secondary" className="tabular-nums">
            {o.label} — {o.chance}
          </Badge>
        ))}
        <Badge variant="secondary" className="tabular-nums">
          Ступень 1 из 2 · возврат первого забора <Num>{(expectedFirstCash() * 100).toFixed(0)}%</Num>
        </Badge>
      </div>
      <LHistory entries={hist} onClear={() => { setHist([]); saveLHist([]); }} />
    </section>
  );
}
