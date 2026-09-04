import { ItemIcon } from '../../casino-icons';
import { Num } from '../shared';
import './hhist.css';

/* Протоколы ипподрома: заезды, итоги, форма лошадей — всё из твоих ставок. */

export type HorseEntry = {
  id: number; horseId: string; horseName: string; icon: string;
  stake: number; ret: number; profit: number; t: number;
};

export const HHIST_KEY = 'sasha_horses_hist';
export const HHIST_CAP = 30;

export function loadHorseHist(): HorseEntry[] {
  try {
    const raw = localStorage.getItem(HHIST_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as HorseEntry[];
    return Array.isArray(arr) ? arr.filter(e => typeof e?.stake === 'number').slice(0, HHIST_CAP) : [];
  } catch { return []; }
}

export function saveHorseHist(es: HorseEntry[]): void {
  try { localStorage.setItem(HHIST_KEY, JSON.stringify(es.slice(0, HHIST_CAP))); } catch { /* приватный режим */ }
}

/** Форма лошади: последние 5 исходов (true — твоя ставка зашла). */
export function formOf(entries: HorseEntry[]): Record<string, boolean[]> {
  const out: Record<string, boolean[]> = {};
  for (const e of [...entries].reverse()) {
    (out[e.horseId] ??= []).push(e.ret > 0);
    out[e.horseId] = out[e.horseId].slice(-5);
  }
  return out;
}

export default function HorseHistory({ entries, onClear }: { entries: HorseEntry[]; onClear: () => void }): JSX.Element {
  if (entries.length === 0) {
    return <p className="hist-empty">Протоколы пусты — первый заезд ждёт.</p>;
  }
  const staked = entries.reduce((s, e) => s + e.stake, 0);
  const back = entries.reduce((s, e) => s + e.ret, 0);
  const profit = back - staked;
  const best = entries.reduce((a, b) => (b.ret > a.ret ? b : a), entries[0]);
  return (
    <section className="horse-book" aria-label="Протоколы заездов">
      <div className="book-total">
        <div><dt>Заездов</dt><dd><Num>{entries.length}</Num></dd></div>
        <div><dt>Поставлено</dt><dd><Num>{staked}</Num></dd></div>
        <div><dt>Возврат</dt><dd><Num>{back}</Num></dd></div>
        <div className={profit >= 0 ? 'plus' : 'minus'}>
          <dt>Итог</dt><dd>{profit >= 0 ? '+' : ''}<Num>{profit}</Num></dd>
        </div>
        <div><dt>Лучший</dt><dd className="best"><ItemIcon name={best.icon} /> <Num>{best.ret}</Num></dd></div>
        <button className="book-clear" onClick={onClear} title="Стереть протоколы">Стереть</button>
      </div>
      <ul>
        {entries.map(e => (
          <li key={e.id} className={e.profit >= 0 ? 'plus' : 'minus'}>
            <ItemIcon name={e.icon} />
            <span className="h-label">{e.horseName}<small>ставка <Num>{e.stake}</Num></small></span>
            <span className="h-amount">+<Num>{e.ret}</Num></span>
            <span className="h-profit">{e.profit >= 0 ? `+${e.profit}` : `${e.profit}`}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
