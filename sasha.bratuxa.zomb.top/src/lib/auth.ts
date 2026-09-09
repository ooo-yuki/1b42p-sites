/* ЕДИНЫЙ ВХОД — один токен на все игры Саши. Переезд без разлогина. */

const TOKEN_KEY = 'sasha_token';
const LEGACY_KEY = 'sasha_casino_token';

export function loadToken(): string | null {
  try {
    const t = localStorage.getItem(TOKEN_KEY);
    if (t) return t;
    const old = localStorage.getItem(LEGACY_KEY);
    if (old) {
      localStorage.setItem(TOKEN_KEY, old);
      return old;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveToken(t: string | null): void {
  try {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(LEGACY_KEY);
    }
  } catch {
    /* приватный режим */
  }
}
