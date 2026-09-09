import { describe, expect, test } from 'bun:test';
import { closePgBank, openPgBank } from './bank-pg';

/* БАНК В ОБЛАКЕ — те же инварианты, что у sqlite-банка, но на Neon Postgres.
   Ходит в ТЕСТОВУЮ ветку (.bank-url-test, в git не едет): fresh выносит всех,
   прод ни один тест не трогает. */

async function fresh() {
  const url = (await Bun.file(new URL('../.bank-url-test', import.meta.url).pathname).text()).trim();
  const b = openPgBank(url);
  await b.sql`DELETE FROM sessions`;
  await b.sql`DELETE FROM users`;
  return b;
}

describe('pgbank auth', () => {
  test('регистрация выдаёт токен и стартовую тысячу', async () => {
    const b = await fresh();
    const r = await b.register('Тест-Неон', 'секрет42');
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.token.length).toBeGreaterThan(20);
    expect(r.balance).toBe(1000);
    await closePgBank(b);
  });

  test('второй такой ник — отказ', async () => {
    const b = await fresh();
    expect((await b.register('Тест-Дубль', 'а')).ok).toBe(true);
    expect((await b.register('Тест-Дубль', 'б')).ok).toBe(false);
    await closePgBank(b);
  });

  test('вход верный — токен, неверный — отказ', async () => {
    const b = await fresh();
    await b.register('Тест-Свой', 'правда');
    expect((await b.login('Тест-Свой', 'правда')).ok).toBe(true);
    expect((await b.login('Тест-Свой', 'ложь')).ok).toBe(false);
    await closePgBank(b);
  });

  test('токен опознаёт бойца', async () => {
    const b = await fresh();
    const r = await b.register('Тест-Опознан', 'п');
    if (!r.ok) return;
    expect((await b.verify(r.token))?.nick).toBe('Тест-Опознан');
    expect(await b.verify('мусор')).toBeNull();
    await closePgBank(b);
  });

  test('verify отдаёт человека без баланса', async () => {
    const b = await fresh();
    const r = await b.register('ТестБоец', 'pw');
    if (!r.ok) throw new Error('register failed');
    const me = await b.verify(r.token);
    if (!me || me.nick !== 'ТестБоец') throw new Error('verify failed');
    if ('balance' in (me as object)) throw new Error('verify must not carry balance');
    await closePgBank(b);
  });
});

describe('pgbank money', () => {
  test('дельты двигают баланс, в минус — отказ', async () => {
    const b = await fresh();
    const r = await b.register('Тест-Транжира', 'п');
    if (!r.ok) return;
    expect((await b.applyDelta(r.uid, -200))?.balance).toBe(800);
    expect(await b.applyDelta(r.uid, -900)).toBeNull();
    expect((await b.applyDelta(r.uid, 500))?.balance).toBe(1300);
    await closePgBank(b);
  });

  test('лидерборд — по убыванию баланса', async () => {
    const b = await fresh();
    const a = await b.register('Тест-Бедный', 'п');
    const c = await b.register('Тест-Богатый', 'п');
    if (!a.ok || !c.ok) return;
    await b.applyDelta(c.uid, 5000);
    await b.applyDelta(a.uid, -500);
    const top = await b.leaders(10);
    expect(top[0].nick).toBe('Тест-Богатый');
    expect(top[0].balance).toBe(6000);
    await closePgBank(b);
  });
});

describe('wallets', () => {
  test('два кошелька не смешиваются', async () => {
    const b = await fresh();
    const r = await b.register('Тест-Кошель', 'п');
    if (!r.ok) throw new Error('register failed');
    const uid = r.uid;
    await (b as unknown as { walletDelta: (uid: number, game: string, d: number) => Promise<unknown> }).walletDelta(uid, 'casino', 100);
    await (b as unknown as { walletDelta: (uid: number, game: string, d: number) => Promise<unknown> }).walletDelta(uid, 'podval', 5);
    const c = await (b as unknown as { wallet: (uid: number, game: string) => Promise<number> }).wallet(uid, 'casino');
    const p = await (b as unknown as { wallet: (uid: number, game: string) => Promise<number> }).wallet(uid, 'podval');
    if (c !== 1100 || p !== 5) throw new Error(`wallets leak: casino=${c} podval=${p}`);
    await closePgBank(b);
  });
});

describe('podval league', () => {
  test('таблица сезона — по убыванию очков, лимит режет, лучший результат хранится', async () => {
    const b = await fresh();
    const season = '2026-W37';
    try { await b.sql`DELETE FROM podval_league WHERE season = ${season}`; } catch { /* таблицы ещё нет — создаст podvalSubmit */ }
    await b.podvalSubmit('Лига-Бедный', 1000, season);
    await b.podvalSubmit('Лига-Богатый', 9000, season);
    await b.podvalSubmit('Лига-Средний', 5000, season);
    const top = await b.podvalTop(season, 10);
    expect(top.map((r) => r.nick)).toEqual(['Лига-Богатый', 'Лига-Средний', 'Лига-Бедный']);
    expect(top[0].pts).toBe(9000);
    expect((await b.podvalTop(season, 2))).toHaveLength(2);
    await b.podvalSubmit('Лига-Бедный', 500, season);
    expect((await b.podvalTop(season, 10)).find((r) => r.nick === 'Лига-Бедный')?.pts).toBe(1000);
    await b.podvalSubmit('Лига-Бедный', 12000, season);
    expect((await b.podvalTop(season, 10))[0].nick).toBe('Лига-Бедный');
    await closePgBank(b);
  });
});
