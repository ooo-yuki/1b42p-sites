/* ОБЩИЕ ТОПЫ — один клиент на все игры. */
import { loadToken } from './auth';

export async function submitScore(game: string, pts: number, season: string): Promise<void> {
  const t = loadToken();
  await fetch('/api/score/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(t ? { Authorization: `Bearer ${t}` } : {}) },
    body: JSON.stringify({ game, pts, season }),
  });
}

export async function fetchTop(game: string, season: string): Promise<{ nick: string; pts: number }[]> {
  const r = await fetch(`/api/score/top?game=${encodeURIComponent(game)}&season=${encodeURIComponent(season)}`);
  const j = (await r.json()) as { ok: boolean; top: { nick: string; pts: number }[] };
  return j.ok ? j.top : [];
}
