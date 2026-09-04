import { cn } from '@/lib/utils';
import { ItemIcon } from '../../casino-icons';
import { Num } from '../shared';
import { MIN_STAKE, payout, type Horse } from './data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import './betdesk.css';

/* Касса ипподрома: выбор лошади, пре-сеты ставки, честный превью выплаты. */

type Props = {
  horses: Horse[];
  horse: string;
  hbet: string;
  racing: boolean;
  onHorse: (id: string) => void;
  onBet: (v: string) => void;
  onStart: () => void;
};

const PRESETS = [10, 50, 100, 500];

export default function BetDesk({ horses, horse, hbet, racing, onHorse, onBet, onStart }: Props): JSX.Element {
  const raw = Math.floor(Number(hbet));
  const stake = Number.isFinite(raw) && raw > 0 ? raw : 0;
  const picked = horses.find(h => h.id === horse) ?? horses[0];
  const ok = stake >= MIN_STAKE;

  return (
    <div className="betdesk">
      <ToggleGroup type="single" value={horse}
        onValueChange={v => { if (v && !racing) onHorse(v); }}
        disabled={racing} className="flex flex-wrap justify-start gap-2">
        {horses.map(h => (
          <ToggleGroupItem key={h.id} value={h.id} aria-label={`${h.name}, кэф ${h.odds}`}>
            <ItemIcon name={h.icon} data-icon="inline-start" /> {h.name} ×{h.odds}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <div className="presets" role="group" aria-label="Быстрая ставка">
        {PRESETS.map(p => (
          <button key={p} type="button" disabled={racing}
            className={cn('preset', stake === p && 'sel')}
            onClick={() => onBet(String(p))}>
            <Num>{p}</Num>
          </button>
        ))}
      </div>
      <div className="crow">
        <Input value={hbet} onChange={e => onBet(e.target.value)}
          inputMode="numeric" aria-label="Ставка на скачки" disabled={racing} />
        <Button disabled={racing} onClick={onStart}
          onMouseDown={e => e.currentTarget.classList.add('press')}
          onMouseUp={e => e.currentTarget.classList.remove('press')}>
          {racing ? 'Скачут…' : 'Старт'}
        </Button>
        <span className={cn('preview', ok && 'good')} role="status">
          {ok
            ? <>{picked.name} → +<Num>{payout(stake, picked.odds)}</Num></>
            : `ставка от ${MIN_STAKE} фишек`}
        </span>
      </div>
      <p className="fine">Кэфы честные: выплата — floor(ставка × кэф). Фаворит — Торнадо ×1.8, дерзость — Пятёрка ×7.</p>
    </div>
  );
}
