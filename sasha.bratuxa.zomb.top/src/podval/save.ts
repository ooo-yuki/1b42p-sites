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
  cycles: number
  mPrice: number
  hybrid: string
  hybrids: string[]
  phw: number[]
  farm: number
  auto: boolean
  oc: boolean
  rf: boolean
}

export function freshSave(): Save {
  return { datasets: 0, coins: 0, cursor: 0, cooling: 0, vuln: 0, hardware: [0, 0, 0, 0], model: 0, totalClicks: 0, cycles: 0, mPrice: 4, hybrid: '', hybrids: [], phw: [0, 0], farm: 0, auto: false, oc: false, rf: false }
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
    cycles: typeof r.cycles === 'number' ? Math.max(0, Math.floor(r.cycles)) : fresh.cycles,
    mPrice: typeof r.mPrice === 'number' ? Math.min(12, Math.max(1, r.mPrice)) : fresh.mPrice,
    hybrid: typeof r.hybrid === 'string' ? r.hybrid : fresh.hybrid,
    hybrids: Array.isArray(r.hybrids) ? (r.hybrids as unknown[]).filter((x): x is string => typeof x === 'string') : fresh.hybrids,
    phw: Array.isArray(r.phw) ? [0, 1].map((i) => (typeof r.phw![i] === 'number' ? r.phw![i] : 0)) : fresh.phw,
    farm: typeof r.farm === 'number' ? Math.min(3, Math.max(0, Math.floor(r.farm))) : fresh.farm,
    auto: r.auto === true,
    oc: r.oc === true,
    rf: r.rf === true,
  }
}
