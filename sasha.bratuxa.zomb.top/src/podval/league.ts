// Клиент лиги подвала: очки, дивизионы, сезон, отправка и таблица.
// fetch инжектится — тесты подменяют, прод отдаёт window.fetch.

export function leaguePts(s: { coins: number; cycles: number; hybrids: number }): number {
  return Math.floor(s.coins) + s.cycles * 5000 + s.hybrids * 100;
}

export function divisionOf(pts: number): string {
  if (pts >= 1000000) return '42';
  if (pts >= 250000) return 'Золото';
  if (pts >= 50000) return 'Серебро';
  return 'Бронза';
}

/** Сезон недели: YYYY-Www (понедельник — первый день). */
export function seasonId(date: Date = new Date()): string {
  const d = new Date(date.getTime());
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - day);
  const year = d.getFullYear();
  const jan4 = new Date(year, 0, 4);
  const week = 1 + Math.round((d.getTime() - jan4.getTime()) / (7 * 86400_000));
  return `${year}-W${String(week).padStart(2, '0')}`;
}

type Fetch = (url: string, init?: { method?: string; headers?: Record<string, string>; body?: string }) => Promise<{ ok: boolean; json: () => Promise<unknown> }>;

export async function submitScore(fetchImpl: Fetch, token: string, pts: number): Promise<boolean> {
  try {
    const r = await fetchImpl('/api/podval/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ pts, season: seasonId() }),
    });
    const d = (await r.json()) as { ok?: boolean };
    return r.ok && d.ok === true;
  } catch {
    return false;
  }
}

export async function fetchLeague(fetchImpl: Fetch): Promise<{ nick: string; pts: number }[]> {
  try {
    const r = await fetchImpl(`/api/podval/league?season=${encodeURIComponent(seasonId())}`);
    const d = (await r.json()) as { ok?: boolean; league?: { nick: string; pts: number }[] };
    if (!r.ok || d.ok !== true || !Array.isArray(d.league)) return [];
    return d.league;
  } catch {
    return [];
  }
}
