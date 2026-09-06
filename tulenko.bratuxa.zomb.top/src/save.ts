import { CFG } from './config.js';

// Рекорд: бережное чтение, запись лучшего (меньшее время).
export function loadBest(): number | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(CFG.saveKey);
    if (raw === null) return null;
    const v = parseFloat(raw);
    if (!isFinite(v) || v < 0) return null;
    return v;
  } catch {
    return null;
  }
}

export function saveBest(sec: number): boolean {
  try {
    if (typeof localStorage === 'undefined') return false;
    if (!isFinite(sec) || sec < 0) return false;
    const cur = loadBest();
    if (cur !== null && cur <= sec) return false;
    localStorage.setItem(CFG.saveKey, String(sec));
    return true;
  } catch {
    return false;
  }
}
