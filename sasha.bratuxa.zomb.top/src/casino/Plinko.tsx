import { useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Badge } from '@/components/ui/badge';
import { Coins } from 'lucide-react';
import { Log, Num, parseStake, type Api } from './shared';
import Board from './plinko/Board';
import PHistory, { loadPHist, savePHist, type PEntry } from './plinko/History';
import {
  MIN_STAKE, RISK_RU, ROWS, dropPath, expectedValue, honestOdds,
  settle, validatePlinko, type Risk, type Step,
} from './plinko/data';
import { binChime, dropSplash, pinTick } from './plinko/jingle';
import './plinko.css';
import './plinko/phist.css';

/* ЗАЛ «ПЛИНКО» — доска «Водопад 42». Оркестрация: ставка → риск → падение.
   Правила святы: 12 рядов, шарик 50/50 на колышке, множители висят на лунках,
   EV рисков 0.95–1.00, мин ставка 10. */

const TICK_MS = 80;

export default function Plinko({ api }: { api: Api }): JSX.Element {
  const [raw, setRaw] = useState('50');
  const [risk, setRisk] = useState<Risk>('low');
  const [path, setPath] = useState<Step[] | null>(null);
  const [step, setStep] = useState(-1);
  const [hitBin, setHitBin] = useState<number | null>(null);
  const [flying, setFlying] = useState(false);
  const [hist, setHist] = useState<PEntry[]>(() => loadPHist());
  const [seq, setSeq] = useState(() => Date.now());
  const timer = useRef(0);

  useMemo(() => {
    const bad = validatePlinko();
    if (bad.length > 0) console.error('[plinko] святыня нарушена:', bad.join('; '));
  }, []);

  const drop = (): void => {
    if (flying) return;
    const stake = parseStake(raw, MIN_STAKE, api);
    if (stake === null) return;
    if (timer.current) window.clearInterval(timer.current);
    const p = dropPath();
    setPath(p);
    setHitBin(null);
    setFlying(true);
    if (!api.reduced) dropSplash();
    if (api.reduced) {
      finish(stake, p);
      return;
    }
    let t = 0;
    setStep(0);
    if (!api.reduced) pinTick(0);
    timer.current = window.setInterval(() => {
      t++;
      if (t >= ROWS) {
        window.clearInterval(timer.current);
        timer.current = 0;
        finish(stake, p);
        return;
      }
      setStep(t);
      if (!api.reduced) pinTick(t);
    }, TICK_MS);
  };

  const finish = (stake: number, p: Step[]): void => {
    setStep(ROWS - 1);
    const { bin, mult } = settle(p, risk);
    const ret = Math.floor(stake * mult);
    setHitBin(bin);
    setFlying(false);
    if (ret > 0) api.credit(ret);
    if (mult >= 10) api.say(`ВОДОПАД! Лунка ${bin}: ×${mult} = +${ret}!`, 'win');
    else if (mult >= 1) api.say(`Лунка ${bin}: ×${mult} = +${ret}`, 'win');
    else api.say(`Лунка ${bin}: ×${mult}. Шарик уплыл в заводь`);
    if (!api.reduced) binChime(mult);
    setHist(prev => {
      const next = [{
        id: seq, stake, risk, bin, mult, ret, profit: ret - stake, t: Date.now(),
      }, ...prev].slice(0, 30);
      savePHist(next);
      return next;
    });
    setSeq(s => s + 1);
  };

  const odds = honestOdds();

  return (
    <section className="plinko-hall">
      <Log msg={api.msg} tone={api.tone} />
      <div className="pl-desk">
        <label className="pl-stake">
          <span>Ставка</span>
          <Input value={raw} inputMode="numeric" aria-label="Ставка в фишках"
            onChange={e => setRaw(e.target.value)} disabled={flying} />
        </label>
        <ToggleGroup type="single" value={risk} aria-label="Риск водопада"
          onValueChange={v => { if (v) setRisk(v as Risk); }} className="pl-risk">
          {(Object.keys(RISK_RU) as Risk[]).map(r => (
            <ToggleGroupItem key={r} value={r} aria-label={RISK_RU[r]} disabled={flying}>
              {RISK_RU[r]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <Button size="lg" onClick={drop} disabled={flying} className="pl-drop">
          <Coins data-icon="inline-start" /> {flying ? 'Шарик летит…' : 'Кинуть шарик'}
        </Button>
      </div>
      <Board path={path} step={step} hitBin={hitBin} risk={risk} />
      <div className="pl-odds" aria-label="Честные шансы">
        {odds.map(o => (
          <Badge key={o.label} variant="secondary" className="tabular-nums">
            {o.label} — {o.chance}
          </Badge>
        ))}
        <Badge variant="secondary" className="tabular-nums">
          Возврат: заводь <Num>{(expectedValue('low') * 100).toFixed(1)}%</Num> ·
          река <Num>{(expectedValue('mid') * 100).toFixed(1)}%</Num> ·
          водопад <Num>{(expectedValue('high') * 100).toFixed(1)}%</Num>
        </Badge>
      </div>
      <PHistory entries={hist} onClear={() => { setHist([]); savePHist([]); }} />
    </section>
  );
}
