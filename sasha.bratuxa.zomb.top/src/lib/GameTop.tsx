import { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';
import { fetchTop } from './league';
import './gametop.css';

/* Маленький топ игры: ночь DESIGN.md, пилюля, русские имена, цифры tabular-nums. */

const NAMES: Record<string, string> = {
  defense: 'Оборона',
  fabrika: 'Фабрика',
  terminal: 'Терминал',
  podval: 'Подвал',
  casino: 'Казино',
};

export default function GameTop({ game }: { game: string }): JSX.Element {
  const [top, setTop] = useState<{ nick: string; pts: number }[]>([]);
  useEffect(() => {
    let alive = true;
    fetchTop(game, 'all').then(t => { if (alive) setTop(t.slice(0, 3)); }).catch(() => {});
    return () => { alive = false; };
  }, [game]);
  const label = NAMES[game] ?? game;
  if (top.length === 0)
    return (
      <section className="gtop" role="status" aria-label={`Топ игры ${label}`}>
        <Trophy data-icon="inline-start" size={14} aria-hidden /> Топ «{label}»: <span className="dim">пока пусто — стань первым</span>
      </section>
    );
  return (
    <section className="gtop" role="status" aria-label={`Топ игры ${label}`}>
      <Trophy data-icon="inline-start" size={14} aria-hidden /> Топ «{label}»: <b>{top.map(t => `${t.nick} — ${t.pts}`).join(' • ')}</b>
    </section>
  );
}
