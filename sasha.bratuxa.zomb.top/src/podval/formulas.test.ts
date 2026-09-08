import { describe, expect, test } from 'bun:test'
import {
  CLICK_BASE,
  HARDWARE,
  MODEL_LEVELS,
  clickGain,
  coreMult,
  hardwareCost,
  hardwareRate,
  hallucination,
  incomePerSec,
  isVictory,
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
})
