import { ItemIcon } from '../../casino-icons';
import { Num } from '../shared';
import './history.css';

/* Леджер арсенала: что выпадало, итог сессии, чистка. */

export type HistEntry = {
  id: number; caseName: string; label: string; icon: string;
  amount: number; profit: number; t: number;
};

type Props = { entries: HistEntry[]; onClear: () => void };

export const HIST_KEY = 'sasha_cases_hist';
export const HIST_CAP = 30;

export function loadHist(): HistEntry[] {
  try {
    const raw = localStorage.getItem(HIST_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as HistEntry[];
    return Array.isArray(arr) ? arr.filter(e => typeof e?.amount === 'number').slice(0, HIST_CAP) : [];
  } catch { return []; }
}

export function saveHist(es: HistEntry[]): void {
  try { localStorage.setItem(HIST_KEY, JSON.stringify(es.slice(0, HIST_CAP))); } catch { /* приватный режим */ }
}

export default function History({ entries, onClear }: Props): JSX.Element {
  if (entries.length === 0) {
    return <p className="hist-empty">Сейфы ещё не вскрывались — выбери арсенал выше.</p>;
  }
  const spent = entries.reduce((s, e) => s + (e.amount - e.profit), 0);
  const won = entries.reduce((s, e) => s + e.amount, 0);
  const profit = won - spent;
  const best = entries.reduce((a, b) => (b.amount > a.amount ? b : a), entries[0]);
  return (
    <section className="case-book" aria-label="История вскрытий">
      <div className="book-total">
        <div><dt>Вскрыто</dt><dd><Num>{entries.length}</Num></dd></div>
        <div><dt>Потрачено</dt><dd><Num>{spent}</Num></dd></div>
        <div><dt>Выиграно</dt><dd><Num>{won}</Num></dd></div>
        <div className={profit >= 0 ? 'plus' : 'minus'}>
          <dt>Итог</dt><dd>{profit >= 0 ? '+' : ''}<Num>{profit}</Num></dd>
        </div>
        <div><dt>Лучшее</dt><dd className="best"><ItemIcon name={best.icon} /> <Num>{best.amount}</Num></dd></div>
        <button className="book-clear" onClick={onClear} title="Стереть историю вскрытий">Стереть</button>
      </div>
      <ul>
        {entries.map(e => (
          <li key={e.id} className={e.profit >= 0 ? 'plus' : 'minus'}>
            <ItemIcon name={e.icon} />
            <span className="h-label">{e.label}<small>{e.caseName}</small></span>
            <span className="h-amount">+<Num>{e.amount}</Num></span>
            <span className="h-profit">{e.profit >= 0 ? `+${e.profit}` : `${e.profit}`}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
