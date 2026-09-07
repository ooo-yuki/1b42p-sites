/* Сейвы Фабрики: тот же ключ, та же форма, мёрж поверх дефолта. */
import { defaultSave, migrateSave, type Save } from './formulas';

export const SAVE_KEY = 'brohacho42_v1';

export function loadSave(storage: Pick<Storage, 'getItem'>): Save {
  try {
    const raw = storage.getItem(SAVE_KEY);
    if (!raw) return defaultSave();
    return migrateSave(JSON.parse(raw));
  } catch {
    return defaultSave();
  }
}

export function storeSave(storage: Pick<Storage, 'setItem'>, s: Save): void {
  try {
    storage.setItem(SAVE_KEY, JSON.stringify(s));
  } catch { /* приватный режим */ }
}
