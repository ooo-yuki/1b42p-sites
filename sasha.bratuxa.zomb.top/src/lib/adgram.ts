/* Adsgram-награда: сайт → shrinkme-ссылка, тг-аппа → SDK + клейм в кассу. */
import { loadToken } from './auth';

export const ADSGRAM_BLOCK_ID = 'REPLACE_WITH_BLOCK_ID';
export const SHRINKME_URL = 'https://shrinkme.click/sasha42';

declare global {
  interface Window {
    Adsgram?: {
      init: (p: { blockId: string }) => { show: () => Promise<{ done?: boolean }> };
    };
  }
}

let sdkLoading: Promise<boolean> | null = null;

function loadSdk(): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  if (window.Adsgram) return Promise.resolve(true);
  if (sdkLoading) return sdkLoading;
  sdkLoading = new Promise<boolean>((resolve) => {
    const el = document.createElement('script');
    el.src = 'https://sad.adsgram.ai/js/sad.min.js';
    el.async = true;
    el.onload = () => resolve(!!window.Adsgram);
    el.onerror = () => resolve(false);
    document.head.appendChild(el);
    window.setTimeout(() => resolve(!!window.Adsgram), 8000);
  });
  return sdkLoading;
}

/** Показать rewarded/interstitial. true — досмотрел (награда положена). */
export async function showRewardAd(): Promise<boolean> {
  try {
    if (!(await loadSdk()) || !window.Adsgram) return false;
    const c = window.Adsgram.init({ blockId: ADSGRAM_BLOCK_ID });
    const r = await c.show();
    return !!r?.done;
  } catch {
    return false;
  }
}

/** Забрать +100 в кошелёк игры. Токен сессии вместо секрета — секрет не светим. */
export async function claimAdReward(game: string): Promise<{ ok: true; balance: number } | { ok: false; error: string }> {
  const t = loadToken();
  if (!t) return { ok: false, error: 'Войди в счёт — без ника награда не капнет' };
  try {
    const res = await fetch('/api/adsgram/claim', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${t}` },
      body: JSON.stringify({ game }),
    });
    const r = await res.json() as { ok: boolean; balance?: number; error?: string };
    if (r.ok && typeof r.balance === 'number') return { ok: true, balance: r.balance };
    return { ok: false, error: typeof r.error === 'string' ? r.error : 'Касса не отвечает' };
  } catch {
    return { ok: false, error: 'Касса не отвечает — проверь связь' };
  }
}
