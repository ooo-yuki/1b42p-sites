import { describe, expect, test } from 'bun:test';
import { closeBank, openBank } from './bank';

/* БАНК КАЗИНО — инварианты до кода: ники уникальны, пароли хэшируются,
   баланс не уходит в минус, лидерборд отсортирован. Отдельная база на тест. */

const DB = '/tmp/bank-test.db';

function fresh() {
  try { require('fs').unlinkSync(DB); } catch { /* первый раз */ }
  return openBank(DB);
}

describe('bank auth', () => {
  test('регистрация выдаёт токен и стартовую тысячу', () => {
    const b = fresh();
    const r = b.register('Тест-Витёк', 'секрет42');
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.token.length).toBeGreaterThan(20);
    expect(r.balance).toBe(1000);
    closeBank(b);
  });

  test('второй такой ник — отказ', () => {
    const b = fresh();
    expect(b.register('Дубль', 'а').ok).toBe(true);
    const r2 = b.register('Дубль', 'б');
    expect(r2.ok).toBe(false);
    closeBank(b);
  });

  test('короткий ник и пустой пароль — отказ', () => {
    const b = fresh();
    expect(b.register('А', 'пароль').ok).toBe(false);
    expect(b.register('Норм', '').ok).toBe(false);
    closeBank(b);
  });

  test('вход верный — токен, неверный — отказ', () => {
    const b = fresh();
    b.register('Свой', 'правда');
    expect(b.login('Свой', 'правда').ok).toBe(true);
    expect(b.login('Свой', 'ложь').ok).toBe(false);
    expect(b.login('Чужой', 'правда').ok).toBe(false);
    closeBank(b);
  });

  test('пароль лежит хэшем, не открытым текстом', () => {
    const b = fresh();
    b.register('Хэш', 'открыто');
    const row = b.db.query('SELECT pass_hash FROM users WHERE nick = ?').get('Хэш') as { pass_hash: string };
    expect(row.pass_hash).not.toContain('открыто');
    expect(row.pass_hash.length).toBeGreaterThan(20);
    closeBank(b);
  });

  test('токен опознаёт бойца, чужой — никого', () => {
    const b = fresh();
    const r = b.register('Опознан', 'п');
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(b.verify(r.token)?.nick).toBe('Опознан');
    expect(b.verify('мусор')).toBeNull();
    closeBank(b);
  });
});

describe('bank money', () => {
  test('дельты двигают баланс, в минус — отказ', () => {
    const b = fresh();
    const r = b.register('Транжира', 'п');
    if (!r.ok) return;
    expect(b.applyDelta(r.uid, -200)?.balance).toBe(800);
    expect(b.applyDelta(r.uid, -900)).toBeNull();
    expect(b.applyDelta(r.uid, -900)?.balance ?? 800).toBe(800);
    expect(b.applyDelta(r.uid, 500)?.balance).toBe(1300);
    closeBank(b);
  });

  test('лидерборд — по убыванию баланса', () => {
    const b = fresh();
    const a = b.register('Бедный', 'п');
    const c = b.register('Богатый', 'п');
    if (!a.ok || !c.ok) return;
    b.applyDelta(c.uid, 5000);
    b.applyDelta(a.uid, -500);
    const top = b.leaders(10);
    expect(top[0].nick).toBe('Богатый');
    expect(top[0].balance).toBe(6000);
    expect(top[top.length - 1].nick).toBe('Бедный');
    closeBank(b);
  });
});
