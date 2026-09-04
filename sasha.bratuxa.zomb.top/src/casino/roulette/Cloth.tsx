import { cn } from '@/lib/utils';
import { Num } from '../shared';
import { EU_REDS, MIN_STAKE, N, potential } from './data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import './cloth.css';

/* Сукно: цвета, сетка 0–36 с жаром по твоим шарам, касса с превью. */

type Props = {
  rchoice: string;
  rbet: string;
  spinning: boolean;
  stake: number;
  hot: Set<number>;
  onChoice: (c: string) => void;
  onBet: (v: string) => void;
  onSpin: () => void;
};

const PRESETS = [10, 50, 100, 500];

function previewText(choice: string, stake: number): string {
  if (stake < MIN_STAKE) return `ставка от ${MIN_STAKE} фишек`;
  const p = potential(choice, stake);
  if (choice === 'red') return `красное ×2 → +${p}`;
  if (choice === 'black') return `чёрное ×2 → +${p}`;
  if (choice === 'green') return `зеро ×14 → +${p}`;
  return `число ${choice} ×35 → +${p}`;
}

export default function Cloth({ rchoice, rbet, spinning, stake, hot, onChoice, onBet, onSpin }: Props): JSX.Element {
  const isNum = /^\d+$/.test(rchoice);
  return (
    <div className="cloth">
      <ToggleGroup type="single" value={isNum ? '' : rchoice}
        onValueChange={v => { if (v && !spinning) onChoice(v); }}
        disabled={spinning} className="flex flex-wrap justify-start gap-2">
        <ToggleGroupItem value="red"><span className="rdot red" /> Красное ×2</ToggleGroupItem>
        <ToggleGroupItem value="black"><span className="rdot black" /> Чёрное ×2</ToggleGroupItem>
        <ToggleGroupItem value="green"><span className="rdot green" /> Зеро ×14</ToggleGroupItem>
      </ToggleGroup>
      <div className="numbers" role="group" aria-label="Точное число, выплата ×35">
        {Array.from({ length: N }, (_, n) => {
          const cls = n === 0 ? 'zero' : EU_REDS.includes(n) ? 'red' : 'black';
          return (
            <button key={n} disabled={spinning}
              className={cn('num', cls, String(n) === rchoice && 'sel')}
              onClick={() => onChoice(String(n))}
              title={n === 0 ? 'Зеро — выплата ×14' : `${n} ${EU_REDS.includes(n) ? 'красное' : 'чёрное'} — выплата ×35`}>
              {n}
              {hot.has(n) && <i className="heat" aria-label="часто падает" />}
            </button>
          );
        })}
      </div>
      <p className="heat-note">Точка на числе — жар по твоим последним шарам, не подсказка.</p>
      <div className="presets" role="group" aria-label="Быстрая ставка">
        {PRESETS.map(p => (
          <button key={p} type="button" disabled={spinning}
            className={cn('preset', stake === p && 'sel')}
            onClick={() => onBet(String(p))}>
            <Num>{p}</Num>
          </button>
        ))}
      </div>
      <div className="crow">
        <Input value={rbet} onChange={e => onBet(e.target.value)}
          inputMode="numeric" aria-label="Ставка на рулетку" disabled={spinning} />
        <Button disabled={spinning} onClick={onSpin}
          onMouseDown={e => e.currentTarget.classList.add('press')}
          onMouseUp={e => e.currentTarget.classList.remove('press')}>
          {spinning ? 'Крутится…' : 'Крутить'}
        </Button>
        <span className={cn('preview', stake >= MIN_STAKE && 'good')} role="status">
          {previewText(rchoice, stake)}
        </span>
      </div>
      <p className="fine">Шарик честный: каждое из 37 чисел равновероятно. Жар — твоя статистика, не физика.</p>
    </div>
  );
}
