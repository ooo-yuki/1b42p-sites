import { useState } from 'react';
import { Api, Log, Num } from './shared';
import { ItemIcon } from '../casino-icons';
import { Button } from '@/components/ui/button';
import './slots.css';

/* ЗАЛ «СЛОТЫ» — автомат «Семёрка». Рычаг, три окна, честная таблица.
   Правила святы: спин 50, 777 = 1000, три одинаковых 250, пара 100. */

const SLOT_ICONS = ['cherry', 'clover', 'star', 'coins', 'dices', 'seven'];
const COST = 50;

export default function Slots({ api }: { api: Api }): JSX.Element {
  const [reels, setReels] = useState(['seven', 'dices', 'cherry']);
  const [spinning, setSpinning] = useState(false);
  const [pulled, setPulled] = useState(false);

  const spin = (): void => {
    if (spinning) return;
    if (api.balance < COST) { api.say('Спин стоит 50. Возьми бонус'); return; }
    if (!api.spend(COST)) return;
    setSpinning(true);
    setPulled(true);
    window.setTimeout(() => setPulled(false), 600);
    const final = [0, 1, 2].map(() => SLOT_ICONS[Math.floor(Math.random() * SLOT_ICONS.length)]);
    let ticks = 0;
    const timer = window.setInterval(() => {
      ticks++;
      setReels([0, 1, 2].map(i => (ticks > (i + 1) * 4 ? final[i] : SLOT_ICONS[Math.floor(Math.random() * SLOT_ICONS.length)])));
      if (ticks > 14) {
        window.clearInterval(timer);
        setReels(final);
        setSpinning(false);
        const [a, b2, c] = final;
        if (a === 'seven' && b2 === 'seven' && c === 'seven') {
          api.credit(1000); api.say('ДЖЕКПОТ 777: +1000!', 'win');
        } else if (a === b2 && b2 === c) {
          api.credit(250); api.say(`Три одинаковых: +250!`, 'win');
        } else if (a === b2 || b2 === c || a === c) {
          api.credit(100); api.say('Пара: +100');
        } else {
          api.say('Мимо. Ещё по одной?');
        }
      }
    }, api.reduced ? 30 : 90);
  };

  return (
    <section className="slots-hall">
      <Log msg={api.msg} tone={api.tone} />
      <div className="cabinet">
        <div className="marquee" aria-hidden>
          {Array.from({ length: 14 }, (_, i) => <i key={i} style={{ animationDelay: `${(i % 7) * 0.2}s` }} />)}
        </div>
        <div className="cab-title">СЕМЁРКА · 42</div>
        <div className="windows">
          {reels.map((r, i) => (
            <div className={`window${spinning ? ' blur' : ''}`} key={i}>
              <ItemIcon name={r} />
            </div>
          ))}
        </div>
        <div className="deck">
          <Button disabled={spinning} onClick={spin}>{spinning ? 'Крутится…' : 'Крутить за 50'}</Button>
          <button className={`lever${pulled ? ' down' : ''}`} onClick={spin} disabled={spinning}
            aria-label="Дёрнуть рычаг">
            <span className="stick" /><span className="knob" />
          </button>
        </div>
        <dl className="paytable">
          <div><dt><span className="pt-syms"><ItemIcon name="seven" /><ItemIcon name="seven" /><ItemIcon name="seven" /></span></dt><dd>+<Num>1000</Num></dd></div>
          <div><dt>Три одинаковых</dt><dd>+<Num>250</Num></dd></div>
          <div><dt>Любая пара</dt><dd>+<Num>100</Num></dd></div>
        </dl>
      </div>
    </section>
  );
}
