interface HudProps { coins: number; gps: number; ips: number; stars: number }

const fmt = (n: number): string => {
  const v = Math.floor(n);
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 10_000) return `${(v / 1000).toFixed(1)}K`;
  return `${v}`;
};

export default function Hud({ coins, gps, ips, stars }: HudProps) {
  return (
    <header className="hud" role="status" aria-live="polite">
      <span className="pill pill-coins" title="Монеты">
        <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.5" fill="#ffd9c0" stroke="#8a6a5a" strokeWidth="1.6" /><circle cx="8" cy="8" r="3.4" fill="none" stroke="#8a6a5a" strokeWidth="1.4" /></svg>
        <b>{fmt(coins)}</b>
      </span>
      <span className="pill" title="Гости в секунду">
        <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="5.4" r="2.8" fill="#bfe3ff" stroke="#8a6a5a" strokeWidth="1.4" /><path d="M2.6 13.4c.6-2.6 2.8-4 5.4-4s4.8 1.4 5.4 4" fill="#cdeac0" stroke="#8a6a5a" strokeWidth="1.4" strokeLinecap="round" /></svg>
        <b>{gps.toFixed(1)}/с</b>
      </span>
      <span className="pill" title="Доход в секунду">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 12.5 6 8l2.6 2.6L14 4.5" fill="none" stroke="#8a6a5a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><path d="M10.5 4.5H14V8" fill="none" stroke="#8a6a5a" strokeWidth="1.8" strokeLinecap="round" /></svg>
        <b>+{fmt(ips)}/с</b>
      </span>
      <span className="pill" title="Рейтинг">
        <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1.8l1.9 3.9 4.3.6-3.1 3 .7 4.3L8 11.6l-3.8 2 .7-4.3-3.1-3 4.3-.6z" fill="#ffd9c0" stroke="#8a6a5a" strokeWidth="1.2" strokeLinejoin="round" /></svg>
        <b>{stars.toFixed(1)}</b>
      </span>
    </header>
  );
}
