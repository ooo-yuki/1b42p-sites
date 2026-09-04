import { useState } from 'react';
import { Api, Log, Num, parseStake } from './shared';
import { ItemIcon } from '../casino-icons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import './horses.css';

/* ЗАЛ «СКАЧКИ» — ипподром 42. Четыре лошади, трибуна, фотофиниш.
   Правила святы: кэфы, механика заезда и минималка не менялись. */

type Horse = { id: string; icon: string; name: string; odds: number; silks: string };
const HORSES: Horse[] = [
  { id: 'tornado', icon: 'steed-gray', name: 'Торнадо', odds: 1.8, silks: '#9aa3b5' },
  { id: 'bratuxa', icon: 'steed-blue', name: 'Братуха', odds: 2.5, silks: '#6fb3f7' },
  { id: 'vihr', icon: 'steed-brown', name: 'Вихрь', odds: 4, silks: '#b07a3f' },
  { id: 'pyat', icon: 'steed-gold', name: 'Пятёрка', odds: 7, silks: '#ffd23f' },
];

export default function Horses({ api }: { api: Api }): JSX.Element {
  const [horse, setHorse] = useState(HORSES[1].id);
  const [hbet, setHbet] = useState('50');
  const [racing, setRacing] = useState(false);
  const [pos, setPos] = useState<number[]>(HORSES.map(() => 0));
  const [leader, setLeader] = useState(-1);

  const start = (): void => {
    if (racing) return;
    const stake = parseStake(hbet, 10, api);
    if (stake === null) return;
    setRacing(true);
    setPos(HORSES.map(() => 0));
    setLeader(-1);
    const p = HORSES.map(() => 0);
    const timer = window.setInterval(() => {
      let winner = -1;
      let best = -1;
      for (let i = 0; i < p.length; i++) {
        p[i] += 1.5 + Math.random() * 5;
        if (p[i] > (p[best] ?? -1)) best = i;
        if (p[i] >= 100 && winner < 0) winner = i;
      }
      setPos([...p]);
      setLeader(best);
      if (winner >= 0) {
        window.clearInterval(timer);
        const h = HORSES[winner];
        if (h.id === horse) {
          const win = Math.floor(stake * h.odds);
          api.credit(win);
          api.say(`${h.name} первый! ×${h.odds}: +${win}`, 'win');
        } else {
          api.say(`${h.name} первый. Твоя лошадь мимо, минус ${stake}`, 'lose');
        }
        setRacing(false);
      }
    }, api.reduced ? 30 : 120);
  };

  return (
    <section className="horses-hall">
      <Log msg={api.msg} tone={api.tone} />
      <div className="paddock">
        {HORSES.map(h => (
          <button key={h.id} className={`mount${horse === h.id ? ' sel' : ''}`}
            onClick={() => !racing && setHorse(h.id)} disabled={racing} aria-pressed={horse === h.id}>
            <span className="m-art" style={{ ['--silks' as string]: h.silks }}><ItemIcon name={h.icon} /></span>
            <b>{h.name}</b>
            <Badge variant="secondary">×{h.odds}</Badge>
          </button>
        ))}
      </div>
      <div className="turf">
        <div className="stand">Трибуна 42</div>
        {HORSES.map((h, i) => (
          <div className="lane" key={h.id}>
            <span className="lane-no">{i + 1}</span>
            <div className="lane-track">
              {[25, 50, 75].map(m => <i key={m} className="mark" style={{ left: `${m}%` }} />)}
              <span className={`runner${leader === i && racing ? ' lead' : ''}`}
                style={{ left: `calc(${Math.min(94, pos[i])}% )` }}>
                <ItemIcon name={h.icon} />
              </span>
              <span className="post" />
            </div>
            <span className="lane-name">{h.name}</span>
          </div>
        ))}
      </div>
      <div className="betdesk">
        <ToggleGroup type="single" value={horse}
          onValueChange={v => { if (v && !racing) setHorse(v); }}
          disabled={racing} className="flex-wrap justify-start">
          {HORSES.map(h => (
            <ToggleGroupItem key={h.id} value={h.id}>
              <ItemIcon name={h.icon} /> {h.name} ×{h.odds}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <div className="crow" style={{ marginTop: 12 }}>
          <Input value={hbet} onChange={e => setHbet(e.target.value)} inputMode="numeric" aria-label="Ставка на скачки" />
          <Button disabled={racing} onClick={start}>{racing ? 'Скачут…' : 'Старт'}</Button>
        </div>
        <p className="fine">Кэфы честные: чем выше риск, тем выше выплата.</p>
      </div>
    </section>
  );
}
