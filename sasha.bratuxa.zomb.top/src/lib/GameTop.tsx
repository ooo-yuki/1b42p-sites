import { useEffect, useState } from 'react';
import { fetchTop } from './league';

/* Маленький топ игры: баланс пока местный, топ — общий. Без валют-витрин. */
export default function GameTop({ game }: { game: string }): JSX.Element {
  const [top, setTop] = useState<{ nick: string; pts: number }[]>([]);
  useEffect(() => {
    let alive = true;
    fetchTop(game, 'all').then(t => { if (alive) setTop(t.slice(0, 3)); }).catch(() => {});
    return () => { alive = false; };
  }, [game]);
  if (top.length === 0) return <section className="pill-ghost">Топ {game}: пока пусто — стань первым</section>;
  return (
    <section className="pill-ghost">
      Топ {game}: {top.map(t => `${t.nick} — ${t.pts}`).join(' • ')}
    </section>
  );
}
