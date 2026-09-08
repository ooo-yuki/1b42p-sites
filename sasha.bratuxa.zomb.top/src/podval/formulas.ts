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
