import { useState } from 'react';
import { Api, Log, Num, parseStake } from './shared';
import { ItemIcon } from '../casino-icons';
import { Bomb, Gem } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import './mines.css';

/* ЗАЛ «МИНЫ» — сапёрный полигон. Поле 5×5, лесенка множителей.
   Правила святы: формула множителя и вывод в любой момент не менялись. */

export default function Mines({ api }: { api: Api }): JSX.Element {
  const [mbet, setMbet] = useState('50');
  const [mmines, setMmines] = useState(3);
  const [mfield, setMfield] = useState<boolean[] | null>(null);
  const [mopen, setMopen] = useState<boolean[]>(Array(25).fill(false));
  const [mmult, setMmult] = useState(1);
  const [mdead, setMdead] = useState(false);
  const [stake, setStake] = useState(0);

  const start = (): void => {
    if (mfield && !mdead) return;
    const s = parseStake(mbet, 10, api);
    if (s === null) return;
    setStake(s);
    const idx = Array.from({ length: 25 }, (_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [idx[i], idx[j]] = [idx[j], idx[i]];
    }
    const field = Array(25).fill(false);
    idx.slice(0, mmines).forEach(i => { field[i] = true; });
    setMfield(field);
    setMopen(Array(25).fill(false));
    setMmult(1);
    setMdead(false);
    api.say(`Поле 5×5, мин: ${mmines}. Открывай клетки, «Забрать» — в любой момент`);
  };

  const openCell = (i: number): void => {
    if (!mfield || mdead || mopen[i]) return;
    if (mfield[i]) {
      setMopen(mfield.map(() => true));
      setMdead(true);
      api.say(`Мина! Ставка сгорела.`, 'lose');
      return;
    }
    const opened = mopen.filter(Boolean).length;
    const closed = 25 - opened;
    const safeClosed = 25 - mmines - opened;
    const nm = mmult * (closed / safeClosed) * 0.97;
    const no = [...mopen];
    no[i] = true;
    setMopen(no);
    setMmult(nm);
    api.say(`Чисто! Множитель ×${nm.toFixed(2)} — забирай или рискуй.`);
  };

  const cash = (): void => {
    if (!mfield || mdead) return;
    const opened = mopen.filter(Boolean).length;
    if (opened === 0) { api.say('Открой хоть одну клетку'); return; }
    const win = Math.floor(stake * mmult);
    api.credit(win);
    setMfield(null);
    api.say(`Мины: ×${mmult.toFixed(2)}, +${win}!`, 'win');
  };

  const opened = mopen.filter(Boolean).length;
  const closed = 25 - opened;
  const safeClosed = 25 - mmines - opened;
  const next = mfield && !mdead && safeClosed > 0
    ? mmult * (closed / safeClosed) * 0.97
    : null;

  return (
    <section className="mines-hall">
      <header className="ch-head">
        <div>
          <h2>Мины</h2>
          <p>Открывай клетки. Кристалл растит множитель, мина сжигает ставку.</p>
        </div>
      </header>
      <Log msg={api.msg} tone={api.tone} />
      <div className="mn-grid">
        <div className="bunker">
          <div className="crow">
            <Input value={mbet} onChange={e => setMbet(e.target.value)} inputMode="numeric" aria-label="Ставка на мины" />
            <ToggleGroup type="single" value={String(mmines)}
              onValueChange={v => { if (v && (!mfield || mdead)) setMmines(Number(v)); }}
              disabled={!!mfield && !mdead}>
              {[1, 3, 5].map(n => (
                <ToggleGroupItem key={n} value={String(n)}>{n} {n === 1 ? 'мина' : 'мины'}</ToggleGroupItem>
              ))}
            </ToggleGroup>
            {!mfield || mdead
              ? <Button onClick={start}>Начать</Button>
              : <Button variant="secondary" onClick={cash}>Забрать ×{mmult.toFixed(2)}</Button>}
          </div>
          <div className="ladder">
            <div className="rung now"><span>Сейчас</span><b>×<Num>{mmult.toFixed(2)}</Num></b></div>
            <div className="rung next"><span>Следующая клетка</span><b>{next ? <>×<Num>{next.toFixed(2)}</Num></> : '—'}</b></div>
            <div className="rung"><span>Открыто</span><b><Num>{opened} / {25 - mmines}</Num></b></div>
          </div>
        </div>
        <div className={`field${mdead ? ' dead' : ''}`}>
          {mopen.map((op, i) => (
            <button key={i}
              className={op ? (mfield && mfield[i] ? 'tile boom' : 'tile gem') : 'tile'}
              onClick={() => openCell(i)} disabled={!mfield || op}
              aria-label={op ? (mfield && mfield[i] ? 'Мина' : 'Кристалл') : `Закрытая клетка ${i + 1}`}>
              {op ? (mfield && mfield[i] ? <Bomb aria-hidden /> : <Gem aria-hidden />) : <span className="rivet" />}
            </button>
          ))}
        </div>
      </div>
      {mfield && !mdead && (
        <div className="kitline"><ItemIcon name="jackpot" /> Сапёр идёт: {opened} чисто, мины ждут.</div>
      )}
    </section>
  );
}
