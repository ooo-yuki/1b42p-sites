/* Telegram Mini App: детект, юзер, тема. Без скрипта ТГ — обычная страница. */

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData?: string;
        initDataUnsafe?: { user?: { id: number; username?: string; first_name?: string } };
        ready?: () => void;
        expand?: () => void;
        setHeaderColor?: (c: string) => void;
        setBackgroundColor?: (c: string) => void;
      };
    };
  }
}

let scriptLoading: Promise<void> | null = null;

function loadTgScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.Telegram?.WebApp) return Promise.resolve();
  if (scriptLoading) return scriptLoading;
  scriptLoading = new Promise<void>((resolve) => {
    const el = document.createElement('script');
    el.src = 'https://telegram.org/js/telegram-web-app.js';
    el.async = true;
    el.onload = () => resolve();
    el.onerror = () => resolve(); // без сети ТГ — просто не аппа
    document.head.appendChild(el);
    window.setTimeout(resolve, 4000); // не висим, если телеграм не отвечает
  });
  return scriptLoading;
}

/** Открыто внутри Telegram Mini App (initData) или с ?tgapp=1 (тест в браузере). */
export function isTgApp(): boolean {
  try {
    if (typeof window === 'undefined') return false;
    if (new URLSearchParams(window.location.search).get('tgapp') === '1') return true;
    const w = window.Telegram?.WebApp;
    return !!w && typeof w.initData === 'string' && w.initData.length > 0;
  } catch {
    return false;
  }
}

/** Юзер телеграма из initData (имя для приветствий, не для авторизации). */
export function tgUser(): { id: number; username?: string; first_name?: string } | null {
  try {
    return window.Telegram?.WebApp?.initDataUnsafe?.user ?? null;
  } catch {
    return null;
  }
}

/** Подготовить аппу: развернуть, покрасить шапку в ночь. Ждёт скрипт, зовёт once. */
export function tgReady(onReady?: (inTg: boolean) => void): void {
  void loadTgScript().then(() => {
    try {
      const w = window.Telegram?.WebApp;
      const inTg = isTgApp();
      if (w && inTg) {
        try { w.ready?.(); } catch { /* старый клиент */ }
        try { w.expand?.(); } catch { /* уже развернуто */ }
        try { w.setHeaderColor?.('#070b18'); } catch { /* не поддерживается */ }
        try { w.setBackgroundColor?.('#070b18'); } catch { /* не поддерживается */ }
      }
      onReady?.(inTg);
    } catch {
      onReady?.(false);
    }
  });
}
