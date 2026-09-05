import { useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Coins } from 'lucide-react';
import { Log, Num, parseStake, type Api } from './shared';
import WheelSvg from './wheel/WheelSvg';
import WHistory, { loadWHist, saveWHist, type WEntry } from './wheel/History';
import {
  MIN_STAKE, angleFor, expectedValue, honestOdds,
  settleSector, spinSector, validateWheel,
} from './wheel/data';
import { pegClack, sectorChime, spinWhirr } from './wheel/jingle';
import './fortune.css';
import './wheel/fhist.css';

/* ЗАЛ «КОЛЕСО ФОРТУНЫ» — оркестрация: ставка → спин → сектор.
   Правила святы: сектор решает равномерный кубик, колесо лишь докручивается
   под него (3 оборота + доводка), зеро сжигает ставку, возврат 0.95. */

const SPIN_MS = 3400;

export default function Fortune({ api }: { api: Api }): JSX.Element {
  const [raw, setRaw] = useState('50');
  const [angle, setAngle] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [hit, setHit] = useState<number | null>(null);
  const [hist, setHist] = useState<WEntry[]>(() => loadWHist());
  const [seq, setSeq] = useState(() => Date.now());
  const timers = useRef<number[]>([]);

  useMemo(() => {
    const bad = validateWheel();
    if (bad.length > 0) console.error('[wheel] святыня нарушена:', bad.join('; '));
  }, []);

  const later = (fn: () => void, ms: number): void => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const spin = (): void => {
    if (spinning) return;
    const stake = parseStake(raw, MIN_STAKE, api);
    if (stake === null) return;
    const s = spinSector();
    const target = angleFor(s) + Math.floor(angle / 360) * 360;
    setHit(null);
    setSpinning(true);
    if (!api.reduced) spinWhirr();
    if (api.reduced) {
      finish(stake, s);
      return;
    }
    setAngle(target);
    for (let i = 0; i < 12; i++) {
      later(() => { if (!api.reduced) pegClack(); }, 200 + i * 240);
    }
    later(() => finish(stake, s), SPIN_MS);
  };

  const finish = (stake: number, s: number): void => {
    timers.current.forEach(t => window.clearTimeout(t));
    timers.current = [];
    const mult = settleSector(s);
    const ret = Math.floor(stake * mult);
    setHit(s);
    setSpinning(false);
    if (ret > 0) api.credit(ret);
    if (mult >= 4) api.say(`ФОРТУНА! Клин ×${mult} = +${ret}!`, 'win');
    else if (mult > 0) api.say(`Клин ×${mult} = +${ret}`, 'win');
    else api.say('Зеро. Ставка сгорела в топке');
    if (!api.reduced) sectorChime(mult);
    setHist(prev => {
      const next = [{
        id: seq, stake, sector: s, mult, ret, profit: ret - stake, t: Date.now(),
      }, ...prev].slice(0, 30);
      saveWHist(next);
      return next;
    });
    setSeq(x => x + 1);
  };

  const odds = honestOdds();

  return (
    <section className="fortune-hall">
      <Log msg={api.msg} tone={api.tone} />
      <div className="fw-desk">
        <label className="fw-stake">
          <span>Ставка</span>
          <Input value={raw} inputMode="numeric" aria-label="Ставка в фишках"
            onChange={e => setRaw(e.target.value)} disabled={spinning} />
        </label>
        <Button size="lg" onClick={spin} disabled={spinning} className="fw-spin">
          <Coins data-icon="inline-start" /> {spinning ? 'Колесо крутится…' : 'Крутить колесо'}
        </Button>
      </div>
      <WheelSvg angle={angle} spinning={spinning} hit={hit} />
      <div className="fw-odds" aria-label="Честные шансы">
        {odds.map(o => (
          <Badge key={o.label} variant="secondary" className="tabular-nums">
            {o.label} — {o.chance}
          </Badge>
        ))}
        <Badge variant="secondary" className="tabular-nums">
          Возврат колеса <Num>{(expectedValue() * 100).toFixed(0)}%</Num>
        </Badge>
      </div>
      <WHistory entries={hist} onClear={() => { setHist([]); saveWHist([]); }} />
    </section>
  );
}
