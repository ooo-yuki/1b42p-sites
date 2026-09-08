import { describe, expect, test } from 'bun:test'
import { loadSave } from './save'
import {
  CLICK_BASE,
  EVENTS,
  HARDWARE,
  MODEL_LEVELS,
  PRESTIGE_GATES,
  PRESTIGE_HARDWARE,
  clickGain,
  coreMult,
  hardwareCost,
  hardwareRate,
  hallucination,
  incomePerSec,
  isVictory,
  marketStep,
  MARKET_PULSE,
  HYBRIDS,
  hybridCost,
  NODES,
  nodeIncome,
  RAIDS,
  raidShare,
  ANOMALIES,
  anomalyOf,
  trainCost,
} from './formulas'

describe('клик разметки', () => {
  test('базовый клик даёт CLICK_BASE датасетов', () => {
    expect(clickGain(0)).toBe(CLICK_BASE)
  })
  test('каждый уровень курсора удваивает', () => {
    expect(clickGain(2)).toBe(CLICK_BASE * 4)
  })
})

describe('железо', () => {
  test('первая GTX стоит базу', () => {
    expect(hardwareCost(0, 0)).toBe(HARDWARE[0].base)
  })
  test('цена растёт с каждой купленной', () => {
    expect(hardwareCost(0, 1)).toBeGreaterThan(hardwareCost(0, 0))
  })
  test('доход стойки суммируется', () => {
    expect(hardwareRate([1, 0, 0, 0])).toBe(HARDWARE[0].rate)
    expect(hardwareRate([1, 2, 0, 0])).toBe(HARDWARE[0].rate + HARDWARE[1].rate * 2)
  })
})

describe('модель и галлюцинации', () => {
  test('обучение v0.1 стоит старшего датасета', () => {
    expect(trainCost(0)).toBe(MODEL_LEVELS[0].cost)
  })
  test('галлюцинации падают с версией', () => {
    expect(hallucination(3, 0)).toBeLessThan(hallucination(0, 0))
  })
  test('охлаждение снижает галлюцинации, но не ниже 2%', () => {
    expect(hallucination(0, 99)).toBe(2)
  })
})

describe('доход и победа', () => {
  test('сырая модель без охлаждения почти не зарабатывает', () => {
    expect(incomePerSec(0, 0, hallucination(0, 0))).toBeLessThan(1)
  })
  test('прокачанная модель даёт доход', () => {
    expect(incomePerSec(3, 2, hallucination(3, 2))).toBeGreaterThan(5)
  })
  test('победа: v4.2 + 42000 монет', () => {
    expect(isVictory(MODEL_LEVELS.length - 1, 42000)).toBe(true)
    expect(isVictory(MODEL_LEVELS.length - 1, 41999)).toBe(false)
    expect(isVictory(0, 999999)).toBe(false)
  })
})

describe('rebirth', () => {
  test('ядра дают +50% аддитивно', () => {
    expect(coreMult(0)).toBe(1)
    expect(coreMult(2)).toBe(2)
  })
  test('ядра множат доход', () => {
    expect(incomePerSec(3, 2, hallucination(3, 2), 2)).toBe(incomePerSec(3, 2, hallucination(3, 2)) * 2)
  })
  test('рынок: кламп 1..12 и пульсы из спеки', () => {
    expect(marketStep(4, 0, 0, () => 0.5)).toBeGreaterThanOrEqual(1)
    expect(marketStep(4, 0, 0, () => 0.5)).toBeLessThanOrEqual(12)
    expect(marketStep(100, 0, 0, () => 0.5)).toBe(12)
    expect(marketStep(-5, 0, 0, () => 0.5)).toBe(1)
    expect(MARKET_PULSE.map(p => p.id)).toEqual(['rush', 'crash', 'insider', 'calm'])
  })
  test('миграция mPrice', () => {
    expect(loadSave({ coins: 1 }).mPrice).toBe(4)
  })
  test('гибриды: 6 записей, шут последний', () => {
    expect(Object.keys(HYBRIDS)).toHaveLength(6)
    expect(HYBRIDS.jester.name).toBe('Шут')
    expect(hybridCost(2)).toBe(trainCost(2) * 3)
  })
  test('миграция гибридов', () => {
    const s = loadSave({})
    expect(s.hybrid).toBe('')
    expect(s.hybrids).toEqual([])
  })
  test('сеть: 8 узлов, синергия соседей', () => {
    expect(NODES).toHaveLength(8)
    expect(NODES[0].links.length).toBeGreaterThan(0)
    expect(nodeIncome(NODES[0].id, [])).toBe(NODES[0].rate)
    expect(nodeIncome(NODES[0].id, NODES[0].links)).toBeGreaterThan(NODES[0].rate)
  })
  test('кластер 3+ даёт ×1.5', () => {
    const trio = [NODES[0].id, ...NODES[0].links.slice(0, 2)]
    expect(nodeIncome(NODES[0].id, trio)).toBe(NODES[0].rate * (1 + 0.5 * 2) * 1.5)
  })
  test('рейд: окно и доли', () => {
    expect(RAIDS.windowSecs).toBe(1800)
    expect(RAIDS.minBet).toBe(500)
    expect(raidShare(500, 2000)).toBe(0.25)
    expect(raidShare(0, 2000)).toBe(0)
  })
  test('аномалии: 7 штук, ротация по дню', () => {
    expect(ANOMALIES).toHaveLength(7)
    expect(ANOMALIES.map(a => a.id)).toContain('day42')
    expect(anomalyOf(new Date(2026, 8, 7))).toBe(anomalyOf(new Date(2026, 8, 14)))
    expect(anomalyOf(new Date(2026, 8, 7))).not.toBe(anomalyOf(new Date(2026, 8, 8)))
  })
  test('пост-пул: 2 железа и события с числами из спеки', () => {
    expect(PRESTIGE_HARDWARE.map(h => h.id)).toEqual(['quantum', 'kuzbass'])
    expect(PRESTIGE_HARDWARE[0].rate).toBe(600)
    expect(EVENTS.map(e => e.id)).toEqual(['blackout', 'zavoz', 'pug', 'night'])
    expect(EVENTS[0].incomeMul).toBe(0.5)
  })
  test('лесенка гейтов 1–5', () => {
    expect(PRESTIGE_GATES.quantum).toBe(1)
    expect(PRESTIGE_GATES.events).toBe(1)
    expect(PRESTIGE_GATES.kuzbass).toBe(2)
    expect(PRESTIGE_GATES.overclock).toBe(3)
    expect(PRESTIGE_GATES.farm).toBe(4)
    expect(PRESTIGE_GATES.autobuyer).toBe(4)
    expect(PRESTIGE_GATES.bred).toBe(5)
    expect(PRESTIGE_GATES.reflash).toBe(5)
  })
})
