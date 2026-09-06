// Сейвы подвала: ключ свят, мёрж поверх дефолтов.
export const SAVE_KEY = 'podval42_v1'

export interface Save {
  datasets: number
  coins: number
  cursor: number
  cooling: number
  vuln: number
  hardware: number[]
  model: number
  totalClicks: number
}

export function freshSave(): Save {
  return { datasets: 0, coins: 0, cursor: 0, cooling: 0, vuln: 0, hardware: [0, 0, 0, 0], model: 0, totalClicks: 0 }
}

export function loadSave(raw: unknown): Save {
  const fresh = freshSave()
  if (!raw || typeof raw !== 'object') return fresh
  const r = raw as Partial<Save>
  return {
    datasets: typeof r.datasets === 'number' ? r.datasets : fresh.datasets,
    coins: typeof r.coins === 'number' ? r.coins : fresh.coins,
    cursor: typeof r.cursor === 'number' ? r.cursor : fresh.cursor,
    cooling: typeof r.cooling === 'number' ? r.cooling : fresh.cooling,
    vuln: typeof r.vuln === 'number' ? r.vuln : fresh.vuln,
    hardware: Array.isArray(r.hardware) ? [0, 1, 2, 3].map((i) => (typeof r.hardware![i] === 'number' ? r.hardware![i] : 0)) : fresh.hardware,
    model: typeof r.model === 'number' ? r.model : fresh.model,
    totalClicks: typeof r.totalClicks === 'number' ? r.totalClicks : fresh.totalClicks,
  }
}
