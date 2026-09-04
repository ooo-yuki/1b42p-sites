import { cn } from '@/lib/utils';
import { Num } from '../shared';
import { CELLS, MINE_CHOICES, MIN_STAKE, boomChance, cashout } from './data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import './bunker.css';

/* Бункер: касса, выбор мин, лесенка, честная шкала риска. */

type Props = {
  mbet: string;
  mmines: number;
  live: boolean;
  dead: boolean;
  mult: number;
  opened: number;
  stake: number;
  onBet: (v: string) => void;
  onMines: (n: number) => void;
  onStart: () => void;
  onCash: () => void;
};

const PRESETS = [10, 50, 100, 500];

export default function Bunker({ mbet, mmines, live, dead, mult, opened, stake,
  onBet, onMines, onStart, onCash }: Props): JSX.Element {
  const raw = Math.floor(Number(mbet));
  const stakeNum = Number.isFinite(raw) && raw > 0 ? raw : 0;
  const risk = live && !dead ? boomChance(opened, mmines) : 0;
  const next = live && !dead && CELLS - mmines - opened > 0
    ? mult * ((CELLS - opened) / (CELLS - mmines - opened)) * 0.97
    : null;

  return (
    <div className={cn('bunker', live && !dead && 'armed')}>
      <span className={cn('door-lamp', live && !dead ? 'red' : 'green')} aria-hidden="true" />
      <div className="crow">
        <Input value={mbet} onChange={e => onBet(e.target.value)}
          inputMode="numeric" aria-label="Ставка на мины" disabled={live && !dead} />
        <ToggleGroup type="single" value={String(mmines)}
          onValueChange={v => { if (v && (!live || dead)) onMines(Number(v)); }}
          disabled={live && !dead} aria-label="Число мин">
          {MINE_CHOICES.map(n => (
            <ToggleGroupItem key={n} value={String(n)}>
              {n} {n === 1 ? 'мина' : 'мины'}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        {!live || dead
          ? <Button onClick={onStart}
              onMouseDown={e => e.currentTarget.classList.add('press')}
              onMouseUp={e => e.currentTarget.classList.remove('press')}>Начать</Button>
          : <Button variant="secondary" onClick={onCash}>Забрать ×{mult.toFixed(2)}</Button>}
      </div>
      <div className="presets" role="group" aria-label="Быстрая ставка">
        {PRESETS.map(p => (
          <button key={p} type="button" disabled={live && !dead}
            className={cn('preset', stakeNum === p && 'sel')}
            onClick={() => onBet(String(p))}>
            <Num>{p}</Num>
          </button>
        ))}
      </div>
      <div className="ladder">
        <div className="rung now"><span>Сейчас</span><b>×<Num>{mult.toFixed(2)}</Num></b></div>
        <div className="rung next"><span>Следующая клетка</span><b>{next ? <>×<Num>{next.toFixed(2)}</Num></> : '—'}</b></div>
        <div className="rung"><span>Открыто</span><b><Num>{opened} / {CELLS - mmines}</Num></b></div>
        <div className="rung cash">
          <span>К выдаче</span>
          <b>{live && !dead && opened > 0 ? <>+<Num>{cashout(stake, mult)}</Num></> : '—'}</b>
        </div>
      </div>
      <div className="risk" aria-label={`Шанс подорваться: ${risk.toFixed(1)} процента`}>
        <div className="risk-top"><span>Шанс подорваться</span><b className="tnum">{live && !dead ? `${risk.toFixed(1)}%` : '—'}</b></div>
        <i className="risk-bar"><i style={{ width: `${Math.min(100, risk)}%` }} /></i>
        <small>{live && !dead ? `мин ${mmines} на ${CELLS - opened} закрытых` : `ставка от ${MIN_STAKE} фишек`}</small>
      </div>
    </div>
  );
}
