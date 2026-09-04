import { Num } from '../shared';
import './mhist.css';

/* Вахта полигона: выходы сапёра, итоги, лучший рывок. */

export type MEntry = {
  id: number; mines: number; stake: number; opened: number;
  ret: number; profit: number; mult: number; t: number;
};

export const MHIST_KEY = 'sasha_mines_hist';
export const MHIST_CAP = 30;

export function loadMHist(): MEntry[] {
  try {
    const raw = localStorage.getItem(MHIST_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as MEntry[];
    return Array.isArray(arr) ? arr.filter(e => typeof e?.stake === 'number').slice(0, MHIST_CAP) : [];
  } catch { return []; }
}

export function saveMHist(es: MEntry[]): void {
  try { localStorage.setItem(MHIST_KEY, JSON.stringify(es.slice(0, MHIST_CAP))); } catch { /* приватный режим */ }
}

export default function MHistory({ entries, onClear }: { entries: MEntry[]; onClear: () => void }): JSX.Element {
  if (entries.length === 0) {
    return <p className="hist-empty">Вахта пуста — сапёр ещё не выходил.</p>;
  }
  const staked = entries.reduce((s, e) => s + e.stake, 0);
  const back = entries.reduce((s, e) => s + e.ret, 0);
  const profit = back - staked;
  const best = entries.reduce((a, b) => (b.mult > a.mult ? b : a), entries[0]);
  return (
    <section className="mn-book" aria-label="Вахта сапёра">
      <div className="book-total">
        <div><dt>Выходов</dt><dd><Num>{entries.length}</Num></dd></div>
        <div><dt>Поставлено</dt><dd><Num>{staked}</Num></dd></div>
        <div><dt>Вынесено</dt><dd><Num>{back}</Num></dd></div>
        <div className={profit >= 0 ? 'plus' : 'minus'}>
          <dt>Итог</dt><dd>{profit >= 0 ? '+' : ''}<Num>{profit}</Num></dd>
        </div>
        <div><dt>Рывок</dt><dd>×<Num>{best.mult.toFixed(2)}</Num></dd></div>
        <button className="book-clear" onClick={onClear} title="Стереть вахту">Стереть</button>
      </div>
      <ul>
        {entries.map(e => (
          <li key={e.id} className={e.profit >= 0 ? 'plus' : 'minus'}>
            <span className="h-label">
              {e.mines === 1 ? '1 мина' : `${e.mines} мины`} · открыто <Num>{e.opened}</Num>
              <small>ставка <Num>{e.stake}</Num> · ×{e.mult.toFixed(2)}</small>
            </span>
            <span className="h-amount">+<Num>{e.ret}</Num></span>
            <span className="h-profit">{e.profit >= 0 ? `+${e.profit}` : `${e.profit}`}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
