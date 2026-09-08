import { describe, expect, test } from 'bun:test'
import { SAVE_KEY, freshSave, loadSave } from './save'

describe('сейвы подвала', () => {
  test('ключ podval42_v1', () => {
    expect(SAVE_KEY).toBe('podval42_v1')
  })
  test('старый сейв мёржится на свежие дефолты', () => {
    const merged = loadSave({ datasets: 42 } as never)
    expect(merged.datasets).toBe(42)
    expect(merged.coins).toBe(freshSave().coins)
    expect(merged.hardware).toEqual([0, 0, 0, 0])
  })
  test('битый сейв даёт свежий', () => {
    expect(loadSave(null)).toEqual(freshSave())
    expect(loadSave('мусор' as never)).toEqual(freshSave())
  })
  test('старый сейв без cycles мигрирует в 0', () => {
    expect(loadSave({ coins: 5 }).cycles).toBe(0)
    expect(freshSave().cycles).toBe(0)
  })
})
