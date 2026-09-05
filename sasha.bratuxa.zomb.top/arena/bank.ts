import { Database } from 'bun:sqlite';

/* БАНК КАЗИНО — счета батальона: ники, хэши паролей, балансы, сессии.
   Файл рядом с сервером (bank42.db), в тестах — свой путь. */

export const START_MONEY = 1000;
export const TOKEN_DAYS = 30;

export type Bank = {
  db: Database;
  register: (nick: string, pass: string) => { ok: true; uid: number; token: string; balance: number } | { ok: false; error: string };
  login: (nick: string, pass: string) => { ok: true; uid: number; token: string; balance: number } | { ok: false; error: string };
  verify: (token: string) => { uid: number; nick: string; balance: number } | null;
  applyDelta: (uid: number, delta: number) => { balance: number } | null;
  leaders: (limit: number) => { nick: string; balance: number }[];
};

const NICK_RE = /^[A-Za-zА-Яа-яЁё0-9_-]{2,16}$/;

function mintToken(): string {
  return `${Date.now().toString(36)}-${crypto.randomUUID()}`;
}

export function openBank(path: string): Bank {
  const db = new Database(path, { create: true });
  db.exec(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nick TEXT UNIQUE NOT NULL, pass_hash TEXT NOT NULL,
    balance INTEGER NOT NULL DEFAULT ${START_MONEY}, created INTEGER NOT NULL);
  CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY, uid INTEGER NOT NULL, exp INTEGER NOT NULL);`);

  const register: Bank['register'] = (nickRaw, pass) => {
    const nick = nickRaw.trim();
    if (!NICK_RE.test(nick)) return { ok: false, error: 'Ник: 2–16 букв, цифр, дефис' };
    if (!pass || pass.length < 1 || pass.length > 72) return { ok: false, error: 'Пароль: 1–72 символа' };
    const hash = Bun.password.hashSync(pass);
    const t = Date.now();
    try {
      const q = db.query('INSERT INTO users (nick, pass_hash, balance, created) VALUES (?, ?, ?, ?) RETURNING id');
      const row = q.get(nick, hash, START_MONEY, t) as { id: number };
      const token = mintToken();
      db.query('INSERT INTO sessions (token, uid, exp) VALUES (?, ?, ?)')
        .run(token, row.id, t + TOKEN_DAYS * 86400_000);
      return { ok: true, uid: row.id, token, balance: START_MONEY };
    } catch { return { ok: false, error: 'Такой ник уже занят' }; }
  };

  const login: Bank['login'] = (nickRaw, pass) => {
    const nick = nickRaw.trim();
    const row = db.query('SELECT id, pass_hash, balance FROM users WHERE nick = ?')
      .get(nick) as { id: number; pass_hash: string; balance: number } | null;
    if (!row || !Bun.password.verifySync(pass, row.pass_hash)) {
      return { ok: false, error: 'Ник или пароль не сошлись' };
    }
    const token = mintToken();
    db.query('INSERT INTO sessions (token, uid, exp) VALUES (?, ?, ?)')
      .run(token, row.id, Date.now() + TOKEN_DAYS * 86400_000);
    return { ok: true, uid: row.id, token, balance: row.balance };
  };

  const verify: Bank['verify'] = (token) => {
    if (!token || token.length < 10) return null;
    const row = db.query(`SELECT u.id AS uid, u.nick, u.balance FROM sessions s
      JOIN users u ON u.id = s.uid WHERE s.token = ? AND s.exp > ?`)
      .get(token, Date.now()) as { uid: number; nick: string; balance: number } | null;
    return row ?? null;
  };

  const applyDelta: Bank['applyDelta'] = (uid, delta) => {
    if (!Number.isInteger(delta)) return null;
    const row = db.query('SELECT balance FROM users WHERE id = ?').get(uid) as { balance: number } | null;
    if (!row) return null;
    const next = row.balance + delta;
    if (next < 0) return null;
    db.query('UPDATE users SET balance = ? WHERE id = ?').run(next, uid);
    return { balance: next };
  };

  const leaders: Bank['leaders'] = (limit) => {
    const n = Math.max(1, Math.min(50, Math.floor(limit) || 10));
    return db.query('SELECT nick, balance FROM users ORDER BY balance DESC, created ASC LIMIT ?')
      .all(n) as { nick: string; balance: number }[];
  };

  return { db, register, login, verify, applyDelta, leaders };
}

export function closeBank(b: Bank): void {
  try { b.db.close(); } catch { /* уже закрыт */ }
}
