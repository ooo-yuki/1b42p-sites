import { SQL } from 'bun';

/* БАНК В ОБЛАКЕ — те же счета батальона, но на Neon Postgres.
   Интерфейс 1:1 с arena/bank.ts (sqlite), только async: замена —
   одной строкой в server.ts. URL — из секретного .bank-url, в git не едет. */

export const START_MONEY = 1000;
export const TOKEN_DAYS = 30;

export type PgBank = {
  sql: SQL;
  register: (nick: string, pass: string) => Promise<{ ok: true; uid: number; token: string; balance: number } | { ok: false; error: string }>;
  login: (nick: string, pass: string) => Promise<{ ok: true; uid: number; token: string; balance: number } | { ok: false; error: string }>;
  verify: (token: string) => Promise<{ uid: number; nick: string; balance: number } | null>;
  applyDelta: (uid: number, delta: number) => Promise<{ balance: number } | null>;
  leaders: (limit: number) => Promise<{ nick: string; balance: number }[]>;
};

const NICK_RE = /^[A-Za-zА-Яа-яЁё0-9_-]{2,16}$/;

function mintToken(): string {
  return `${Date.now().toString(36)}-${crypto.randomUUID()}`;
}

export function openPgBank(url: string): PgBank {
  const sql = new SQL(url);

  const register: PgBank['register'] = async (nickRaw, pass) => {
    const nick = nickRaw.trim();
    if (!NICK_RE.test(nick)) return { ok: false, error: 'Ник: 2–16 букв, цифр, дефис' };
    if (!pass || pass.length < 1 || pass.length > 72) return { ok: false, error: 'Пароль: 1–72 символа' };
    const hash = Bun.password.hashSync(pass);
    const t = Date.now();
    try {
      const rows = await sql`INSERT INTO users (nick, pass_hash, balance, created)
        VALUES (${nick}, ${hash}, ${START_MONEY}, ${t}) RETURNING id`;
      const uid = rows[0].id as number;
      const token = mintToken();
      await sql`INSERT INTO sessions (token, uid, exp) VALUES (${token}, ${uid}, ${t + TOKEN_DAYS * 86400_000})`;
      return { ok: true, uid, token, balance: START_MONEY };
    } catch { return { ok: false, error: 'Такой ник уже занят' }; }
  };

  const login: PgBank['login'] = async (nickRaw, pass) => {
    const nick = nickRaw.trim();
    const rows = await sql`SELECT id, pass_hash, balance FROM users WHERE nick = ${nick}`;
    const row = rows[0] as { id: number; pass_hash: string; balance: number } | undefined;
    if (!row || !Bun.password.verifySync(pass, row.pass_hash)) {
      return { ok: false, error: 'Ник или пароль не сошлись' };
    }
    const token = mintToken();
    await sql`INSERT INTO sessions (token, uid, exp) VALUES (${token}, ${row.id}, ${Date.now() + TOKEN_DAYS * 86400_000})`;
    return { ok: true, uid: row.id, token, balance: row.balance };
  };

  const verify: PgBank['verify'] = async (token) => {
    if (!token || token.length < 10) return null;
    const rows = await sql`SELECT u.id AS uid, u.nick, u.balance FROM sessions s
      JOIN users u ON u.id = s.uid WHERE s.token = ${token} AND s.exp > ${Date.now()}`;
    const row = rows[0] as { uid: number; nick: string; balance: number } | undefined;
    return row ?? null;
  };

  const applyDelta: PgBank['applyDelta'] = async (uid, delta) => {
    if (!Number.isInteger(delta)) return null;
    const updated = await sql`UPDATE users SET balance = balance + ${delta}
      WHERE id = ${uid} AND balance + ${delta} >= 0 RETURNING balance`;
    const row = updated[0] as { balance: number } | undefined;
    return row ? { balance: row.balance } : null;
  };

  const leaders: PgBank['leaders'] = async (limit) => {
    const n = Math.max(1, Math.min(50, Math.floor(limit) || 10));
    const rows = await sql`SELECT nick, balance FROM users
      ORDER BY balance DESC, created ASC LIMIT ${n}`;
    return rows as { nick: string; balance: number }[];
  };

  return { sql, register, login, verify, applyDelta, leaders };
}

export async function closePgBank(b: PgBank): Promise<void> {
  try { await b.sql.close(); } catch { /* уже закрыт */ }
}
