// Хук состояния запоя: загрузка/сейв в localStorage, тик 1 сек, mutate, бутылка, выбор персонажа.
import { useEffect, useState } from 'react';
import {
  BOTTLE_COST, buyBottle, checkSyns, cloneZapoi, createZapoiState,
  hangoverRate, isUnlocked, newRun, tickZapoi,
} from '../game/zapoi/index';
import type { CharId, ZapoiState } from '../game/zapoi/index';
import { blip } from '../components/ui/sound';

export const SAVE_KEY = 'chaev42_zapoi';

export type MutateFn = (fn: (n: ZapoiState) => string | void, lvl?: number) => void;

function loadZapoi(): ZapoiState {
  const z = createZapoiState();
  try {
    const s = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null') as Partial<ZapoiState> | null;
    if (s) {
      Object.assign(z, s);
      z.up = { ...(s.up || {}) };
      z.arts = { ...(s.arts || {}) };
      z.syn = { ...(s.syn || {}) };
      z.completed = { ...(s.completed || {}) };
      if (z.sips == null) z.sips = 0;
      if (z.soul == null) z.soul = 100;
      if (z.demonForm == null) z.demonForm = 0;
      // Старые сейвы без персонажа: был прогресс — продолжаем Владимиром.
      if (!z.char && (z.m > 0 || Object.keys(z.up).length > 0)) z.char = 'vladimir';
    }
  } catch {
    /* тихо */
  }
  if (z.hp == null || z.hp > z.maxhp) z.hp = z.maxhp || 100;
  checkSyns(z);
  return z;
}

export function useZapoiState() {
  const [z, setZ] = useState<ZapoiState>(loadZapoi);
  const [log, setLog] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(z));
    } catch {
      /* тихо */
    }
  }, [z]);

  useEffect(() => {
    const id = setInterval(() => {
      setZ((prev) => {
        if (!prev.char) return prev;
        const next = cloneZapoi(prev);
        const ev = tickZapoi(next);
        if (ev === 'hangover') {
          const rate = hangoverRate(next);
          const lost = next._hangoverLost ?? Math.floor(prev.m * rate);
          setLog(`🤢 Похмелье! −${lost} бухла (${Math.round(rate * 100)}%), здоровье 30%. Рассолу накати!`);
        } else if (ev === 'shattered') {
          setLog('💥 Бутылка разбилась! Забег окончен.');
          blip(200);
          return newRun(next.completed, null);
        } else if (ev === 'demonform') {
          setLog('😈 ДЕМОНИЧЕСКАЯ ФОРМА ×5 на 10 сек! ЖГИ!');
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const mutate: MutateFn = (fn, lvl = 500) => {
    setZ((prev) => {
      const next = cloneZapoi(prev);
      const msg = fn(next);
      if (typeof msg === 'string' && msg) setLog(msg);
      return next;
    });
    blip(lvl);
  };

  // Разбить бутылку: закрыть персонажа и вернуться к выбору.
  const shatterBottle = (): void => {
    setZ((prev) => {
      const next = cloneZapoi(prev);
      if (!buyBottle(next)) {
        setLog(`Бутылка ещё не готова: скупи всё и накопи ${BOTTLE_COST.toLocaleString('ru-RU')} 🍾`);
        return prev;
      }
      const completed = { ...next.completed, [next.char as string]: 1 };
      setLog('💥 Бутылка разбита! Персонаж закрыт. Так держать!');
      blip(200);
      return newRun(completed, null);
    });
  };

  const pickChar = (id: CharId): void => {
    setZ((prev) => {
      if (!isUnlocked({ completed: prev.completed }, id)) return prev;
      blip(700);
      return newRun(prev.completed, id);
    });
  };

  const resetToSelect = (): void => {
    setZ((prev) => newRun(prev.completed, null));
  };

  return { z, setZ, log, setLog, mutate, shatterBottle, pickChar, resetToSelect };
}
