export interface TopRow {
  name: string;
  score: number;
}

export const TOP_KEY = 'chaev_praise_top_v1';

const MAX_ROWS = 20;

function storage(): Storage | null {
  try {
    if (typeof localStorage !== 'undefined') return localStorage;
  } catch {
    /* нет localStorage */
  }
  return null;
}

export function loadTop(): TopRow[] {
  try {
    const raw = storage()?.getItem(TOP_KEY);
    if (raw == null) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return (parsed as TopRow[]).filter(
      (r) => typeof r?.name === 'string' && typeof r?.score === 'number',
    );
  } catch {
    return [];
  }
}

function saveTop(rows: TopRow[]): void {
  try {
    storage()?.setItem(TOP_KEY, JSON.stringify(rows));
  } catch {
    /* тихо */
  }
}

/** Добавить очки имени: мёрдж по name, сортировка по убыванию, топ-20. */
export function addToTop(name: string, score: number): TopRow[] {
  const rows = loadTop();
  const found = rows.find((r) => r.name === name);
  if (found) {
    found.score += score;
  } else {
    rows.push({ name, score });
  }
  rows.sort((a, b) => b.score - a.score);
  const top = rows.slice(0, MAX_ROWS);
  saveTop(top);
  return top;
}
