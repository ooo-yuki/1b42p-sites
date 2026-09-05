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
