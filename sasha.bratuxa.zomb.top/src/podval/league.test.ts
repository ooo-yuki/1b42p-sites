import { divisionOf, leaguePts } from './league';
test('очки и дивизионы лиги', () => {
  expect(leaguePts({ coins: 100000, cycles: 2, hybrids: 3 })).toBe(100000 + 2 * 5000 + 3 * 100);
  expect(divisionOf(0)).toBe('Бронза');
  expect(divisionOf(60000)).toBe('Серебро');
  expect(divisionOf(300000)).toBe('Золото');
  expect(divisionOf(1500000)).toBe('42');
});
