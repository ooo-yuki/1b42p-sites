// Движок «Нейросети в подвале»: чистые формулы айдл-экономики.
export const CLICK_BASE = 1
export const VICTORY_COINS = 42000

export interface HardwareTier {
  id: string
  name: string
  desc: string
  base: number // цена первого (в датасетах)
  growth: number // множитель цены
  rate: number // датасетов/сек с единицы
}

export const HARDWARE: HardwareTier[] = [
  { id: 'gtx', name: 'GTX 1060 с барахолки', desc: 'Греется, шумит, размечает', base: 25, growth: 1.6, rate: 0.5 },
  { id: 'rtx', name: 'RTX 3060 б/у', desc: 'Майнила крипту, теперь майнит науку', base: 150, growth: 1.7, rate: 3 },
  { id: 'rack', name: 'Стойка из гаража', desc: 'Четыре сервера и вентилятор от ЗАЗа', base: 900, growth: 1.8, rate: 18 },
  { id: 'dc', name: 'Полподвала ЦОД', desc: 'Соседи жалуются на гул. Мы уже победили', base: 6000, growth: 1.9, rate: 120 },
]

export interface ModelLevel {
  ver: string
  cost: number // датасетов за обучение
  baseHall: number // базовые галлюцинации %
  codeRate: number // монет/сек от кодогенерации
  perk: string
}

export const MODEL_LEVELS: ModelLevel[] = [
  { ver: 'v0.1', cost: 100, baseHall: 80, codeRate: 0.2, perk: 'Умеет здороваться. Иногда' },
  { ver: 'v0.7', cost: 600, baseHall: 62, codeRate: 1.1, perk: 'Автокликер: размечает 1/с' },
  { ver: 'v1.4', cost: 2500, baseHall: 45, codeRate: 3.4, perk: 'Пишет код за тебя' },
  { ver: 'v2.1', cost: 9000, baseHall: 30, codeRate: 9, perk: 'Находит уязвимости: +эксплойты' },
  { ver: 'v3.0', cost: 30000, baseHall: 18, codeRate: 24, perk: 'Автобайер серверов' },
  { ver: 'v4.2', cost: 100000, baseHall: 8, codeRate: 70, perk: 'Финальная. Мы уже победили' },
]

export const VULN_PAYOUT = [0, 15, 60, 200]

export function clickGain(cursorLevel: number): number {
  return CLICK_BASE * 2 ** cursorLevel
}

export function hardwareCost(tier: number, owned: number): number {
  const t = HARDWARE[tier]
  return Math.ceil(t.base * t.growth ** owned)
}

export function hardwareRate(owned: number[]): number {
  return owned.reduce((sum, n, i) => sum + (HARDWARE[i] ? HARDWARE[i].rate * n : 0), 0)
}

export function trainCost(level: number): number {
  return MODEL_LEVELS[level].cost
}

export function hallucination(modelLevel: number, cooling: number): number {
  return Math.max(2, MODEL_LEVELS[modelLevel].baseHall - cooling * 3)
}

export function incomePerSec(modelLevel: number, vulnLevel: number, hall: number, cycles = 0): number {
  const vuln = (VULN_PAYOUT[vulnLevel] ?? 0) / 10
  return (MODEL_LEVELS[modelLevel].codeRate + vuln) * (1 - (hall / 100) * 0.75) * coreMult(cycles)
}

export function coreMult(cycles: number): number {
  return 1 + 0.5 * Math.max(0, Math.floor(cycles))
}

export function isVictory(modelLevel: number, coins: number): boolean {
  return modelLevel >= MODEL_LEVELS.length - 1 && coins >= VICTORY_COINS
}

export const MARKET_PULSE = [
  { id: 'rush', name: 'Ажиотаж', desc: 'цена ×2 60с', mul: 2, secs: 60 },
  { id: 'crash', name: 'Обвал', desc: 'цена ×0.5 60с', mul: 0.5, secs: 60 },
  { id: 'insider', name: 'Инсайд', desc: '+50% к 10 продажам', mul: 1.5, secs: 0 },
  { id: 'calm', name: 'Тишина', desc: 'заморозка 30с', mul: 1, secs: 30 },
]
export function marketStep(price: number, trades: number, dump: number, rng: () => number = Math.random): number {
  const next = price + (trades * 0.02 - dump * 0.03) + (rng() - 0.5)
  return Math.min(12, Math.max(1, Math.round(next * 100) / 100))
}

export const HYBRIDS: Record<string, { a: string; b: string; name: string; perk: string }> = {
  chatter: { a: 'v0.1', b: 'v0.7', name: 'Болтун', perk: 'автоклик +1/с' },
  apprentice: { a: 'v0.7', b: 'v1.4', name: 'Подмастерье', perk: 'код +25%' },
  diver: { a: 'v1.4', b: 'v2.1', name: 'Ныряльщик', perk: 'эксплойты ×2' },
  guard: { a: 'v2.1', b: 'v3.0', name: 'Сторож', perk: 'галлюцинации −10 п.п.' },
  heir: { a: 'v3.0', b: 'v4.2', name: 'Наследник', perk: 'доход +30%' },
  jester: { a: 'v0.1', b: 'v4.2', name: 'Шут', perk: 'рандомный перк каждый тик' },
}
export function hybridCost(maxLevel: number): number {
  return trainCost(maxLevel) * 3
}

export const NODES = [
  { id: 'kem1', name: 'Кемерово-1', cost: 5000, rate: 50, links: ['kem2', 'garage'] },
  { id: 'kem2', name: 'Кемерово-2', cost: 8000, rate: 80, links: ['kem1', 'attic'] },
  { id: 'garage', name: 'Гаражный', cost: 12000, rate: 130, links: ['kem1', 'shop'] },
  { id: 'attic', name: 'Чердак', cost: 20000, rate: 220, links: ['kem2', 'school'] },
  { id: 'shop', name: 'Магазинный', cost: 30000, rate: 330, links: ['garage', 'plant'] },
  { id: 'school', name: 'Школьный', cost: 45000, rate: 500, links: ['attic', 'kuz'] },
  { id: 'plant', name: 'Заводской', cost: 60000, rate: 680, links: ['shop', 'kuz'] },
  { id: 'kuz', name: 'Кузбасс-Хаб', cost: 80000, rate: 900, links: ['school', 'plant'] },
]
export function nodeIncome(id: string, owned: string[]): number {
  const n = NODES.find((x) => x.id === id)!
  const linkCount = n.links.filter((l) => owned.includes(l)).length
  const cluster = linkCount >= 2 ? 1.5 : 1
  return n.rate * (1 + 0.5 * linkCount) * cluster
}

export interface GameEvent {
  id: string
  name: string
  desc: string
  incomeMul: number
  priceMul: number
  drain: number
  secs: number
}

export const PRESTIGE_HARDWARE: HardwareTier[] = [
  { id: 'quantum', name: 'Квантовый чайник', desc: 'Шумит в суперпозиции', base: 40000, growth: 2.0, rate: 600 },
  { id: 'kuzbass', name: 'Дата-ЦОД «Кузбасс»', desc: 'Гудит на весь регион', base: 250000, growth: 2.1, rate: 3500 },
]
export const EVENTS: GameEvent[] = [
  { id: 'blackout', name: 'Отрубили свет', desc: '−50% дохода 30с', incomeMul: 0.5, priceMul: 1, drain: 0, secs: 30 },
  { id: 'zavoz', name: 'Завоз с барахолки', desc: '−30% цен 60с', incomeMul: 1, priceMul: 0.7, drain: 0, secs: 60 },
  { id: 'pug', name: 'Мопс погрыз кабель', desc: '−10% датасетов сразу', incomeMul: 1, priceMul: 1, drain: 0.1, secs: 0 },
  { id: 'night', name: 'Ночной тариф', desc: '+50% дохода 60с', incomeMul: 1.5, priceMul: 1, drain: 0, secs: 60 },
]
export function eventPick(rng: () => number = Math.random): GameEvent {
  return EVENTS[Math.floor(rng() * EVENTS.length)]
}
/* Лесенка пост-пула: какой цикл открывает функцию (пул на 5 ребитов). */
export const PRESTIGE_GATES: Record<string, number> = {
  quantum: 1, events: 1,
  kuzbass: 2,
  overclock: 3,
  farm: 4, autobuyer: 4,
  bred: 5, reflash: 5,
}
export const PUG_FARM_RATE = 5
export const REFLASH_EVENT_CD_MUL = 0.5
export const REFLASH_INCOME_MUL = 1.25
export const OVERCLOCK_RATE_MUL = 2
export const OVERCLOCK_HALL_PLUS = 15
/* Цены пост-пула в датасетах (решение: в спеке задана только «цена ×4» фермы). */
export const FARM_BASE = 2000
export const FARM_GROWTH = 4
export const FARM_MAX = 3
export const AUTOBUYER_COST = 10000
export const REFLASH_COST = 15000

export function prestigeCost(tier: number, owned: number): number {
  const t = PRESTIGE_HARDWARE[tier]
  return Math.ceil(t.base * t.growth ** owned)
}

export function prestigeRate(owned: number[]): number {
  return owned.reduce((sum, n, i) => sum + (PRESTIGE_HARDWARE[i] ? PRESTIGE_HARDWARE[i].rate * n : 0), 0)
}

export function farmCost(level: number): number {
  return Math.ceil(FARM_BASE * FARM_GROWTH ** level)
}

/* Коллекция бреда: смешная галлюцинация каждой версии, чисто фан. */
export const BRED: Array<{ ver: string; line: string }> = [
  { ver: 'v0.1', line: 'Сказала «привет» холодильнику. Он не ответил' },
  { ver: 'v0.7', line: 'Разметила кота как датасет. Кот против' },
  { ver: 'v1.4', line: 'Написала код, который пишет код, который спит' },
  { ver: 'v2.1', line: 'Нашла уязвимость в розетке. Запатчила скотчем' },
  { ver: 'v3.0', line: 'Купила сервер сама. Соседи в панике' },
  { ver: 'v4.2', line: 'Достигла просветления. Мы уже победили' },
]
