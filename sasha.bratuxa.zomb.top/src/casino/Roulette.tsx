import { useState } from 'react';
import { Api, Log, Num, parseStake } from './shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import './roulette.css';

/* ЗАЛ «РУЛЕТКА» — салон. Колесо на 37 карманов, сукно, точные числа.
   Правила святы: европейская, зеро ×14, цвет ×2, число ×35. */

const EU_REDS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];
const N = 37;

function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function wedge(i: number): string {
  const a0 = (i * 360) / N;
  const a1 = ((i + 1) * 360) / N;
  const [x0, y0] = polar(100, 100, 96, a0);
  const [x1, y1] = polar(100, 100, 96, a1);
  const [x2, y2] = polar(100, 100, 62, a1);
  const [x3, y3] = polar(100, 100, 62, a0);
  return `M100,100 L${x0.toFixed(1)},${y0.toFixed(1)} A96,96 0 0 1 ${x1.toFixed(1)},${y1.toFixed(1)} L${x2.toFixed(1)},${y2.toFixed(1)} A62,62 0 0 0 ${x3.toFixed(1)},${y3.toFixed(1)} Z`;
}

function pocketColor(n: number): string {
  if (n === 0) return '#2f9e44';
  return EU_REDS.includes(n) ? '#b3273b' : '#1b1e26';
}

export default function Roulette({ api }: { api: Api }): JSX.Element {
  const [rbet, setRbet] = useState('50');
  const [rchoice, setRchoice] = useState('red');
  const [rnum, setRnum] = useState<number | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [angle, setAngle] = useState(0);

  const spin = (): void => {
    if (spinning) return;
    const stake = parseStake(rbet, 10, api);
    if (stake === null) return;
    setSpinning(true);
    setAngle(a => a + 360 * 4 + Math.random() * 360);
    let ticks = 0;
    const timer = window.setInterval(() => {
      ticks++;
      setRnum(Math.floor(Math.random() * 37));
      if (ticks > 16) {
        window.clearInterval(timer);
        const n = Math.floor(Math.random() * 37);
        setRnum(n);
        setSpinning(false);
        const isRed = EU_REDS.includes(n);
        let win = 0;
        if (rchoice === 'green' && n === 0) win = stake * 14;
        else if (rchoice === 'red' && isRed) win = stake * 2;
        else if (rchoice === 'black' && n !== 0 && !isRed) win = stake * 2;
        else if (/^\d+$/.test(rchoice) && Number(rchoice) === n) win = stake * 35;
        if (win > 0) {
          api.credit(win);
          api.say(`Выпало ${n}! Забрал +${win}`, 'win');
        } else {
          api.say(`Выпало ${n}. Мимо, минус ${stake}`, 'lose');
        }
      }
    }, api.reduced ? 30 : 90);
  };

  return (
    <section className="roulette-hall">
      <Log msg={api.msg} tone={api.tone} />
      <div className="rl-grid">
        <div className="wheel-box">
          <svg className={`wheel${spinning ? ' spin' : ''}`} viewBox="0 0 200 200"
            style={{ ['--spin' as string]: `${angle}deg` }} role="img" aria-label="Колесо рулетки">
            <circle cx="100" cy="100" r="98" fill="#0a0d18" />
            {Array.from({ length: N }, (_, n) => (
              <path key={n} d={wedge(n)} fill={pocketColor(n)} stroke="#c9a227" strokeWidth="0.7" />
            ))}
            {Array.from({ length: N }, (_, n) => {
              const [tx, ty] = polar(100, 100, 79, (n * 360) / N + 360 / N / 2);
              return (
                <text key={n} x={tx} y={ty} textAnchor="middle" dominantBaseline="central"
                  fontSize="8.5" fill="#e8edff" transform={`rotate(${(n * 360) / N + 360 / N / 2},${tx},${ty})`}>
                  {n}
                </text>
              );
            })}
            <circle cx="100" cy="100" r="34" fill="#141a30" stroke="#c9a227" strokeWidth="2" />
            <text x="100" y="100" textAnchor="middle" dominantBaseline="central" fontSize="26"
              fontWeight="900" fill={rnum === null ? '#5a6396' : '#ffd23f'}>
              {rnum === null ? '?' : rnum}
            </text>
          </svg>
          <span className="pointer" />
        </div>
        <div className="cloth">
          <ToggleGroup type="single" value={/^\d+$/.test(rchoice) ? '' : rchoice}
            onValueChange={v => { if (v && !spinning) setRchoice(v); }}
            disabled={spinning} className="flex-wrap justify-start">
            <ToggleGroupItem value="red"><span className="rdot red" /> Красное ×2</ToggleGroupItem>
            <ToggleGroupItem value="black"><span className="rdot black" /> Чёрное ×2</ToggleGroupItem>
            <ToggleGroupItem value="green"><span className="rdot green" /> Зеро ×14</ToggleGroupItem>
          </ToggleGroup>
          <div className="numbers" role="group" aria-label="Точное число">
            {Array.from({ length: N }, (_, n) => (
              <button key={n} disabled={spinning}
                className={`num${String(n) === rchoice ? ' sel' : ''} ${n === 0 ? 'zero' : EU_REDS.includes(n) ? 'red' : 'black'}`}
                onClick={() => setRchoice(String(n))}>
                {n}
              </button>
            ))}
          </div>
          <div className="crow" style={{ marginTop: 12 }}>
            <Input value={rbet} onChange={e => setRbet(e.target.value)} inputMode="numeric" aria-label="Ставка на рулетку" />
            <Button disabled={spinning} onClick={spin}>{spinning ? 'Крутится…' : 'Крутить'}</Button>
          </div>
          <p className="fine">Шарик честный: каждое из 37 чисел равновероятно.</p>
        </div>
      </div>
    </section>
  );
}
