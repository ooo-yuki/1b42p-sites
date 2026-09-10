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
  verify: (token: string) => Promise<{ uid: number; nick: string } | null>;
  tgLogin: (tgId: number, nick: string) => Promise<{ ok: true; uid: number; token: string } | { ok: false; error: string }>;
  adReward: (tgId: number) => Promise<{ ok: true; nick: string; balance: number; n: number } | { ok: false; error: string }>;
  applyDelta: (uid: number, delta: number) => Promise<{ balance: number } | null>;
  leaders: (limit: number) => Promise<{ nick: string; balance: number }[]>;
  wallet: (uid: number, game: string) => Promise<number>;
  walletDelta: (uid: number, game: string, delta: number) => Promise<number | null>;
  submitScore: (uid: number, game: string, pts: number, season: string) => Promise<void>;
  top: (game: string, season: string, limit: number) => Promise<{ nick: string; pts: number }[]>;
  recordWin: (uid: number, game: string) => Promise<void>;
  arenaTop: (game: string, limit: number) => Promise<{ nick: string; wins: number }[]>;
  podvalSubmit: (nick: string, pts: number, season: string) => Promise<void>;
  podvalTop: (season: string, limit: number) => Promise<{ nick: string; pts: number }[]>;
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
    const rows = await sql`SELECT u.id AS uid, u.nick FROM sessions s
      JOIN users u ON u.id = s.uid WHERE s.token = ${token} AND s.exp > ${Date.now()}`;
    const row = rows[0] as { uid: number; nick: string } | undefined;
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

  const GAME_START: Record<string, number> = { casino: 1000, podval: 0, defense: 0, fabrika: 0, terminal: 0 };

  const ensureWallets = async (): Promise<void> => {
    await sql`CREATE TABLE IF NOT EXISTS wallets (
      uid INTEGER NOT NULL, game TEXT NOT NULL, balance INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (uid, game)
    )`;
  };

  const wallet: PgBank['wallet'] = async (uid, game) => {
    await ensureWallets();
    const g = String(game).slice(0, 24);
    const rows = await sql`SELECT balance FROM wallets WHERE uid = ${uid} AND game = ${g}`;
    const row = rows[0] as { balance: number } | undefined;
    if (row) return row.balance;
    // переезд старых фантиков один раз для casino
    let start = GAME_START[g] ?? 0;
    if (g === 'casino') {
      try {
        const urow = await sql`SELECT balance FROM users WHERE id = ${uid}`;
        const legacy = (urow[0] as { balance: number } | undefined)?.balance ?? 0;
        if (legacy > 0) start = legacy;
        await sql`UPDATE users SET balance = 0 WHERE id = ${uid} AND balance <> 0`;
      } catch { /* старый кошелёк пуст */ }
    }
    await sql`INSERT INTO wallets (uid, game, balance) VALUES (${uid}, ${g}, ${start}) ON CONFLICT (uid, game) DO NOTHING`;
    const again = await sql`SELECT balance FROM wallets WHERE uid = ${uid} AND game = ${g}`;
    return ((again[0] as { balance: number } | undefined)?.balance ?? start);
  };

  const walletDelta: PgBank['walletDelta'] = async (uid, game, delta) => {
    if (!Number.isInteger(delta)) return null;
    await ensureWallets();
    await wallet(uid, game);
    const g = String(game).slice(0, 24);
    const updated = await sql`UPDATE wallets SET balance = balance + ${delta}
      WHERE uid = ${uid} AND game = ${g} AND balance + ${delta} >= 0 RETURNING balance`;
    const row = updated[0] as { balance: number } | undefined;
    return row ? row.balance : null;
  };

  const submitScore: PgBank['submitScore'] = async (uid, game, pts, season) => {
    await sql`CREATE TABLE IF NOT EXISTS scores (
      uid INTEGER NOT NULL, game TEXT NOT NULL, pts INTEGER NOT NULL,
      season TEXT NOT NULL DEFAULT 'all', ts BIGINT NOT NULL,
      PRIMARY KEY (uid, game, season)
    )`;
    const g = String(game).slice(0, 24);
    const s = /^\d{4}-W\d{2}$/.test(season) ? season : 'all';
    const p = Math.max(0, Math.min(99999999, Math.trunc(pts)));
    await sql`INSERT INTO scores (uid, game, pts, season, ts)
      VALUES (${uid}, ${g}, ${p}, ${s}, ${Date.now()})
      ON CONFLICT (uid, game, season) DO UPDATE SET
        pts = GREATEST(scores.pts, EXCLUDED.pts), ts = EXCLUDED.ts`;
  };

  const top: PgBank['top'] = async (game, season, limit) => {
    await sql`CREATE TABLE IF NOT EXISTS scores (
      uid INTEGER NOT NULL, game TEXT NOT NULL, pts INTEGER NOT NULL,
      season TEXT NOT NULL DEFAULT 'all', ts BIGINT NOT NULL,
      PRIMARY KEY (uid, game, season)
    )`;
    const n = Math.max(1, Math.min(50, Math.floor(limit) || 10));
    const rows = await sql`SELECT u.nick AS nick, s.pts AS pts FROM scores s
      JOIN users u ON u.id = s.uid
      WHERE s.game = ${game} AND s.season = ${season}
      ORDER BY s.pts DESC, s.ts ASC LIMIT ${n}`;
    return rows as { nick: string; pts: number }[];
  };

  const recordWin: PgBank['recordWin'] = async (uid, game) => {
    await sql`CREATE TABLE IF NOT EXISTS arena_wins (
      uid INTEGER NOT NULL, game TEXT NOT NULL, wins INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (uid, game)
    )`;
    const g = String(game).slice(0, 24);
    await sql`INSERT INTO arena_wins (uid, game, wins) VALUES (${uid}, ${g}, 1)
      ON CONFLICT (uid, game) DO UPDATE SET wins = arena_wins.wins + 1`;
  };

  const arenaTop: PgBank['arenaTop'] = async (game, limit) => {
    await sql`CREATE TABLE IF NOT EXISTS arena_wins (
      uid INTEGER NOT NULL, game TEXT NOT NULL, wins INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (uid, game)
    )`;
    const n = Math.max(1, Math.min(50, Math.floor(limit) || 10));
    if (game === 'all') {
      const rows = await sql`SELECT u.nick AS nick, SUM(w.wins)::INT AS wins
        FROM arena_wins w JOIN users u ON u.id = w.uid
        GROUP BY u.nick HAVING SUM(w.wins) > 0 ORDER BY SUM(w.wins) DESC LIMIT ${n}`;
      return rows as { nick: string; wins: number }[];
    }
    const rows = await sql`SELECT u.nick AS nick, w.wins AS wins FROM arena_wins w
      JOIN users u ON u.id = w.uid WHERE w.game = ${game} AND w.wins > 0
      ORDER BY w.wins DESC LIMIT ${n}`;
    return rows as { nick: string; wins: number }[];
  };

  const podvalSubmit: PgBank['podvalSubmit'] = async (nick, pts, season) => {
    await sql`CREATE TABLE IF NOT EXISTS podval_league (
      nick TEXT NOT NULL, pts INTEGER NOT NULL, season TEXT NOT NULL, ts BIGINT NOT NULL,
      PRIMARY KEY (nick, season)
    )`;
    await sql`INSERT INTO podval_league (nick, pts, season, ts)
      VALUES (${nick}, ${pts}, ${season}, ${Date.now()})
      ON CONFLICT (nick, season) DO UPDATE SET
        pts = GREATEST(podval_league.pts, EXCLUDED.pts), ts = EXCLUDED.ts`;
  };

  const podvalTop: PgBank['podvalTop'] = async (season, limit) => {
    const n = Math.max(1, Math.min(50, Math.floor(limit) || 10));
    const rows = await sql`SELECT nick, pts FROM podval_league
      WHERE season = ${season} ORDER BY pts DESC, ts ASC LIMIT ${n}`;
    return rows as { nick: string; pts: number }[];
  };

  /* ТГ-АППА: счёт привязан к Telegram-ID. Создавать не надо — касса
     выдаст или найдёт сама. Пароль случайный: вход только через телегу. */
  const tgLogin: PgBank['tgLogin'] = async (tgId, nickRaw) => {
    if (!Number.isInteger(tgId) || tgId <= 0) return { ok: false, error: 'Телеграм не опознан' };
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS tg_id BIGINT`;
    await sql`CREATE UNIQUE INDEX IF NOT EXISTS users_tg_id ON users (tg_id)`;
    const t = Date.now();
    const found = await sql`SELECT id FROM users WHERE tg_id = ${tgId}`;
    if (found[0]) {
      const uid = (found[0] as { id: number }).id;
      const token = mintToken();
      await sql`INSERT INTO sessions (token, uid, exp) VALUES (${token}, ${uid}, ${t + TOKEN_DAYS * 86400_000})`;
      return { ok: true, uid, token };
    }
    let base = String(nickRaw ?? '').replace(/[^A-Za-zА-Яа-яЁё0-9_-]/g, '').slice(0, 12);
    if (base.length < 2) base = `Боец-${String(Math.abs(tgId) % 9000 + 1000)}`;
    const hash = Bun.password.hashSync(crypto.randomUUID() + crypto.randomUUID());
    for (let i = 0; i < 20; i++) {
      const nick = i === 0 ? base : `${base.slice(0, 13)}-${i}`;
      try {
        const rows = await sql`INSERT INTO users (nick, pass_hash, balance, created, tg_id)
          VALUES (${nick}, ${hash}, ${START_MONEY}, ${t}, ${tgId}) RETURNING id`;
        const uid = rows[0].id as number;
        const token = mintToken();
        await sql`INSERT INTO sessions (token, uid, exp) VALUES (${token}, ${uid}, ${t + TOKEN_DAYS * 86400_000})`;
        return { ok: true, uid, token };
      } catch { /* ник занят — пробуем с суффиксом */ }
    }
    return { ok: false, error: 'Тесный строй — попробуй позже' };
  };

  /* ADGRAM-НАГРАДА: находит счёт по telegram_id, капает 100 фантиков.
     Счёта нет — не заводим. Лимита нет: смотри сколько хочешь. */
  const AD_REWARD = 100;
  const adReward: PgBank['adReward'] = async (tgId) => {
    if (!Number.isInteger(tgId) || tgId <= 0) return { ok: false, error: 'no user' };
    const urow = await sql`SELECT id, nick FROM users WHERE tg_id = ${tgId}`;
    const u = urow[0] as { id: number; nick: string } | undefined;
    if (!u) return { ok: false, error: 'no user' };
    const balance = await walletDelta(u.id, 'casino', AD_REWARD);
    if (balance === null) return { ok: false, error: 'empty' };
    return { ok: true, nick: u.nick, balance, n: 1 };
  };

  return { sql, register, login, verify, tgLogin, adReward, applyDelta, leaders, wallet, walletDelta, submitScore, top, recordWin, arenaTop, podvalSubmit, podvalTop };
}

export async function closePgBank(b: PgBank): Promise<void> {
  try { await b.sql.close(); } catch { /* уже закрыт */ }
}
