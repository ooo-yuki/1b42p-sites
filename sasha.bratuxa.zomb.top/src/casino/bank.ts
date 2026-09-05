/* КАССА — клиент банка казино: токен в localStorage, Bearer-заголовок. */

const TOKEN_KEY = 'sasha_casino_token';

export type BankUser = { nick: string; balance: number };
export type Leader = { nick: string; balance: number };

export function loadToken(): string | null {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}

export function saveToken(t: string | null): void {
  try {
    if (t) localStorage.setItem(TOKEN_KEY, t);
    else localStorage.removeItem(TOKEN_KEY);
  } catch { /* приватный режим */ }
}

async function call<T>(path: string, token: string | null, body?: unknown): Promise<T> {
  const res = await fetch(path, {
    method: body === undefined ? 'GET' : 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  return res.json() as Promise<T>;
}

export type AuthResp =
  | { ok: true; token: string; nick: string; balance: number }
  | { ok: false; error: string };

export function register(nick: string, pass: string): Promise<AuthResp> {
  return call<AuthResp>('/api/bank/register', null, { nick, pass });
}

export function login(nick: string, pass: string): Promise<AuthResp> {
  return call<AuthResp>('/api/bank/login', null, { nick, pass });
}

export function me(token: string): Promise<{ ok: boolean; nick?: string; balance?: number }> {
  return call('/api/bank/me', token);
}

export function syncDelta(token: string, delta: number): Promise<{ ok: boolean; balance?: number; error?: string }> {
  return call('/api/bank/sync', token, { delta });
}

export function leaders(): Promise<{ ok: boolean; leaders: Leader[] }> {
  return call('/api/bank/leaders', null);
}
