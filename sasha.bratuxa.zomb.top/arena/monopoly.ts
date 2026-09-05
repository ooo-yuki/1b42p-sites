/* Монополия 42 — чистый движок без IO: 40 клеток, 2–5 братух, фантики.
   Сервер дёргает applyMove/timeoutAction/removePlayer, клиент рисует MonoPublic.
   Честные упрощения (записаны в бриф): без аукциона (отказ — клетка ждёт),
   стройка в любой высоте сразу и только до броска, без залога (дома сами
   распродаются за полцены перед банкротством), без чётности домов в группе. */

export type CellKind = 'go' | 'street' | 'rr' | 'util' | 'tax' | 'chance' | 'chest' | 'jail' | 'parking' | 'gotojail';
export type Cell = {
  kind: CellKind; name: string; price?: number; rent?: number[]; house?: number; group?: string;
};

const R = (r0: number, r1: number, r2: number, r3: number, r4: number, r5: number): number[] =>
  [r0, r1, r2, r3, r4, r5];

export const BOARD: Cell[] = [
  { kind: 'go', name: 'Старт' },
  { kind: 'street', name: 'Гараж Сетдена', price: 60, rent: R(2, 10, 30, 90, 160, 250), house: 50, group: 'brown' },
  { kind: 'chest', name: 'Казна' },
  { kind: 'street', name: 'Сарай Смолграда', price: 60, rent: R(4, 20, 60, 180, 320, 450), house: 50, group: 'brown' },
  { kind: 'tax', name: 'Налоговая', price: 200 },
  { kind: 'rr', name: 'Вокзал Чаев', price: 200 },
  { kind: 'street', name: 'Эввград-1', price: 100, rent: R(6, 30, 90, 270, 400, 550), house: 50, group: 'lblue' },
  { kind: 'chance', name: 'Шанс' },
  { kind: 'street', name: 'Эввград-2', price: 100, rent: R(6, 30, 90, 270, 400, 550), house: 50, group: 'lblue' },
  { kind: 'street', name: 'Эввград-3', price: 120, rent: R(8, 40, 100, 300, 450, 600), house: 50, group: 'lblue' },
  { kind: 'jail', name: 'Тюрьма' },
  { kind: 'street', name: 'Танки-1', price: 140, rent: R(10, 50, 150, 450, 625, 750), house: 100, group: 'pink' },
  { kind: 'util', name: 'Электростанция 42', price: 150 },
  { kind: 'street', name: 'Танки-2', price: 140, rent: R(10, 50, 150, 450, 625, 750), house: 100, group: 'pink' },
  { kind: 'street', name: 'Танки-3', price: 160, rent: R(12, 60, 180, 500, 700, 900), house: 100, group: 'pink' },
  { kind: 'rr', name: 'Вокзал Хаб', price: 200 },
  { kind: 'street', name: 'Дум-1', price: 180, rent: R(14, 70, 200, 550, 750, 950), house: 100, group: 'orange' },
  { kind: 'chest', name: 'Казна' },
  { kind: 'street', name: 'Дум-2', price: 180, rent: R(14, 70, 200, 550, 750, 950), house: 100, group: 'orange' },
  { kind: 'street', name: 'Дум-3', price: 200, rent: R(16, 80, 220, 600, 800, 1000), house: 100, group: 'orange' },
  { kind: 'parking', name: 'Стоянка' },
  { kind: 'street', name: 'GTA-1', price: 220, rent: R(18, 90, 250, 700, 875, 1050), house: 150, group: 'red' },
  { kind: 'chance', name: 'Шанс' },
  { kind: 'street', name: 'GTA-2', price: 220, rent: R(18, 90, 250, 700, 875, 1050), house: 150, group: 'red' },
  { kind: 'street', name: 'GTA-3', price: 240, rent: R(20, 100, 300, 750, 925, 1100), house: 150, group: 'red' },
  { kind: 'rr', name: 'Вокзал Дум', price: 200 },
  { kind: 'street', name: 'Хаб-1', price: 260, rent: R(22, 110, 330, 800, 975, 1150), house: 150, group: 'yellow' },
  { kind: 'street', name: 'Хаб-2', price: 260, rent: R(22, 110, 330, 800, 975, 1150), house: 150, group: 'yellow' },
  { kind: 'util', name: 'Водокачка 42', price: 150 },
  { kind: 'street', name: 'Хаб-3', price: 280, rent: R(24, 120, 360, 850, 1025, 1200), house: 150, group: 'yellow' },
  { kind: 'gotojail', name: 'В тюрьму' },
  { kind: 'street', name: 'Казино-1', price: 300, rent: R(26, 130, 390, 900, 1100, 1275), house: 200, group: 'green' },
  { kind: 'street', name: 'Казино-2', price: 300, rent: R(26, 130, 390, 900, 1100, 1275), house: 200, group: 'green' },
  { kind: 'chest', name: 'Казна' },
  { kind: 'street', name: 'Казино-3', price: 320, rent: R(28, 150, 450, 1000, 1200, 1400), house: 200, group: 'green' },
  { kind: 'rr', name: 'Вокзал Смолград', price: 200 },
  { kind: 'chance', name: 'Шанс' },
  { kind: 'street', name: 'Арена', price: 350, rent: R(35, 175, 500, 1100, 1300, 1500), house: 200, group: 'blue' },
  { kind: 'tax', name: 'Суперналог', price: 100 },
  { kind: 'street', name: 'Саша-территория', price: 400, rent: R(50, 200, 600, 1400, 1700, 2000), house: 200, group: 'blue' },
];

const START_MONEY = 1500;
const SALARY = 200;
const JAIL_FINE = 50;

export type Player = {
  id: string; pos: number; money: number;
  inJail: boolean; jailTurns: number; jailCard: boolean; bankrupt: boolean;
};

export type Reason = 'last' | 'resign' | 'timeout' | 'leave';

export type MoveInput =
  | { kind: 'roll'; d1?: number; d2?: number }
  | { kind: 'buy' }
  | { kind: 'pass' }
  | { kind: 'build'; cell: number; n?: number }
  | { kind: 'payJail' }
  | { kind: 'useCard' }
  | { kind: 'resign' };

export type MonoState = {
  players: Player[];
  turn: string;
  doubles: number;
  rolled: boolean;
  awaiting: null | 'decide';
  offerCell: number | null;
  owner: Record<number, string>;
  houses: Record<number, number>;
  chanceIdx: number;
  chestIdx: number;
  phase: 'play' | 'over';
  winner: string | null;
  reason: Reason | null;
  history: string[];
  rng: () => number;
};

const alive = (st: MonoState): Player[] => st.players.filter(p => !p.bankrupt);
const me = (st: MonoState, pid: string): Player | undefined =>
  st.players.find(p => p.id === pid && !p.bankrupt);

function nextTurn(st: MonoState, pid: string): void {
  const a = alive(st);
  st.turn = a[(a.findIndex(p => p.id === pid) + 1) % a.length].id;
  st.doubles = 0;
  st.rolled = false;
  st.awaiting = null;
  st.offerCell = null;
}

function checkWin(st: MonoState): void {
  const a = alive(st);
  if (a.length === 1 && st.players.length > 1) {
    st.phase = 'over';
    st.winner = a[0].id;
    st.reason = 'last';
  }
}

/** Списать amount: сначала принудительно распродаём дома за полцены. */
function charge(st: MonoState, p: Player, amount: number, creditor: string | null): void {
  while (p.money < amount) {
    const owned = Object.entries(st.houses).find(([c]) => st.owner[Number(c)] === p.id && st.houses[Number(c)] > 0);
    if (!owned) break;
    const cell = Number(owned[0]);
    const price = BOARD[cell].house ?? 0;
    st.houses[cell]--;
    if (st.houses[cell] <= 0) delete st.houses[cell];
    p.money += Math.floor(price / 2);
    st.history.push(`${p.id}: дом на «${BOARD[cell].name}» за полцены`);
  }
  if (p.money < amount) return bankrupt(st, p, creditor);
  p.money -= amount;
  if (creditor) {
    const c = st.players.find(x => x.id === creditor);
    if (c) c.money += amount;
  }
}

function bankrupt(st: MonoState, p: Player, creditor: string | null): void {
  p.bankrupt = true;
  p.money = 0;
  for (const [c, o] of Object.entries(st.owner)) {
    if (o !== p.id) continue;
    const cell = Number(c);
    delete st.houses[cell];
    if (creditor && !st.players.find(x => x.id === creditor)?.bankrupt) {
      st.owner[cell] = creditor;
    } else {
      delete st.owner[cell];
    }
  }
  if (p.jailCard && creditor) {
    const c = st.players.find(x => x.id === creditor);
    if (c && !c.bankrupt) c.jailCard = true;
  }
  p.jailCard = false;
  p.inJail = false;
  st.history.push(`${p.id} — банкрот!`);
  checkWin(st);
}

function groupCells(group: string): number[] {
  const out: number[] = [];
  BOARD.forEach((c, i) => { if (c.group === group) out.push(i); });
  return out;
}

function rentFor(st: MonoState, cell: number, diceSum: number): number {
  const c = BOARD[cell];
  if (c.kind === 'street') {
    const lvl = Math.min(5, st.houses[cell] ?? 0);
    const group = groupCells(c.group!);
    const monopoly = group.every(i => st.owner[i] === st.owner[cell]);
    if (lvl === 0 && monopoly) return (c.rent![0]) * 2;
    return c.rent![lvl];
  }
  if (c.kind === 'rr') {
    const n = BOARD.filter((x, i) => x.kind === 'rr' && st.owner[i] === st.owner[cell]).length;
    return [0, 25, 50, 100, 200][Math.min(4, n)];
  }
  // util: по числу предприятий у хозяина
  const n = BOARD.filter((x, i) => x.kind === 'util' && st.owner[i] === st.owner[cell]).length;
  return diceSum * (n >= 2 ? 10 : 4);
}

export function createMonopoly(ids: string[], rng: () => number): MonoState {
  const st: MonoState = {
    players: ids.map(id => ({
      id, pos: 0, money: START_MONEY,
      inJail: false, jailTurns: 0, jailCard: false, bankrupt: false,
    })),
    turn: ids[0], doubles: 0, rolled: false,
    awaiting: null, offerCell: null,
    owner: {}, houses: {}, chanceIdx: 0, chestIdx: 0,
    phase: 'play', winner: null, reason: null, history: [], rng,
  };
  return st;
}

type Card = { text: string; run: (st: MonoState, p: Player) => void };

function chanceDeck(): Card[] {
  return [
    { text: 'Банк ошибся: +100', run: (st, p) => { p.money += 100; } },
    { text: 'Штраф за сальтуху: −50', run: (st, p) => charge(st, p, 50, null) },
    { text: 'Вперёд на старт', run: (st, p) => { p.pos = 0; p.money += SALARY; } },
    { text: 'В тюрьму!', run: (st, p) => { p.pos = 10; p.inJail = true; p.jailTurns = 0; } },
    { text: 'Выход из тюрьмы', run: (st, p) => { p.jailCard = true; } },
    {
      text: 'Ремонт: −25 с дома', run: (st, p) => {
        const n = Object.entries(st.houses).filter(([c]) => st.owner[Number(c)] === p.id)
          .reduce((a, [, h]) => a + h, 0);
        charge(st, p, 25 * n, null);
      },
    },
    { text: 'Братухи скинулись: +42', run: (st, p) => { p.money += 42; } },
    {
      text: 'Назад на 3', run: (st, p) => {
        p.pos = (p.pos + 40 - 3) % 40;
        // клетка применяется как обычная остановка
      },
    },
  ];
}

function chestDeck(): Card[] {
  return [
    { text: 'Наследство: +200', run: (st, p) => { p.money += 200; } },
    { text: 'Налог: −100', run: (st, p) => charge(st, p, 100, null) },
    { text: 'Премия: +50', run: (st, p) => { p.money += 50; } },
    { text: 'В тюрьму!', run: (st, p) => { p.pos = 10; p.inJail = true; p.jailTurns = 0; } },
    { text: 'Выход из тюрьмы', run: (st, p) => { p.jailCard = true; } },
    { text: 'Коммуналка: −50', run: (st, p) => charge(st, p, 50, null) },
    { text: 'На старт!', run: (st, p) => { p.pos = 0; p.money += SALARY; } },
    { text: 'Нашёл 42: +42', run: (st, p) => { p.money += 42; } },
  ];
}

function drawCard(st: MonoState, p: Player, kind: 'chance' | 'chest', diceSum: number): void {
  const deck = kind === 'chance' ? chanceDeck() : chestDeck();
  const i = (kind === 'chance' ? st.chanceIdx++ : st.chestIdx++) % deck.length;
  const card = deck[i];
  st.history.push(`${p.id}: ${kind === 'chance' ? 'Шанс' : 'Казна'} — ${card.text}`);
  card.run(st, p);
  if (p.bankrupt || st.phase !== 'play') return;
  // карта могла подвинуть — клетка применяется рекурсивно один уровень
  if (card.text.startsWith('Назад') || card.text.startsWith('Вперёд') || card.text.startsWith('На старт')) {
    resolveCell(st, p, diceSum);
  }
}

/** Остановка на клетке: налоги, ренты, карты, тюрьма. Возвращает конец хода? нет — решает вызывающий. */
function resolveCell(st: MonoState, p: Player, diceSum: number): void {
  const cell = BOARD[p.pos];
  if (cell.kind === 'tax') {
    charge(st, p, cell.price!, null);
    st.history.push(`${p.id}: налог −${cell.price}`);
  } else if (cell.kind === 'chance') {
    drawCard(st, p, 'chance', diceSum);
  } else if (cell.kind === 'chest') {
    drawCard(st, p, 'chest', diceSum);
  } else if (cell.kind === 'gotojail') {
    p.pos = 10;
    p.inJail = true;
    p.jailTurns = 0;
    st.history.push(`${p.id} — в тюрьму!`);
  } else if (cell.kind === 'street' || cell.kind === 'rr' || cell.kind === 'util') {
    const o = st.owner[p.pos];
    if (!o) {
      st.awaiting = 'decide';
      st.offerCell = p.pos;
      st.history.push(`${p.id} на «${cell.name}» (${cell.price}): купить?`);
    } else if (o !== p.id) {
      const rent = rentFor(st, p.pos, diceSum);
      charge(st, p, rent, o);
      st.history.push(`${p.id}: рента ${rent} → ${o}`);
    }
  }
}

export function legalActions(st: MonoState, pid: string): string[] {
  if (st.phase !== 'play' || st.turn !== pid) return [];
  const p = me(st, pid);
  if (!p) return [];
  if (p.inJail) {
    const out = ['roll'];
    if (p.money >= JAIL_FINE) out.push('payJail');
    if (p.jailCard) out.push('useCard');
    return out;
  }
  if (st.awaiting === 'decide') {
    const price = BOARD[st.offerCell!].price ?? 0;
    return p.money >= price ? ['buy', 'pass'] : ['pass'];
  }
  if (st.rolled) return [];
  const out = ['roll'];
  if (canBuildAny(st, p)) out.push('build');
  return out;
}

function canBuildAny(st: MonoState, p: Player): boolean {
  return BOARD.some((c, i) =>
    c.kind === 'street' && st.owner[i] === p.id
    && groupCells(c.group!).every(g => st.owner[g] === p.id)
    && (st.houses[i] ?? 0) < 5 && p.money >= (c.house ?? 0));
}

function doRoll(st: MonoState, p: Player, d1: number, d2: number): void {
  const sum = d1 + d2;
  const dbl = d1 === d2;
  if (p.inJail) {
    if (dbl) {
      p.inJail = false;
      p.jailTurns = 0;
      st.history.push(`${p.id}: дубль — свобода!`);
      moveAndResolve(st, p, sum);
      if (st.phase !== 'play' || p.bankrupt) return;
      nextTurn(st, p.id);
    } else {
      p.jailTurns++;
      st.history.push(`${p.id}: мимо (${p.jailTurns}/3)`);
      if (p.jailTurns >= 3) {
        charge(st, p, JAIL_FINE, null);
        if (p.bankrupt || st.phase !== 'play') return;
        p.inJail = false;
        p.jailTurns = 0;
        moveAndResolve(st, p, sum);
        if (st.phase !== 'play' || p.bankrupt) return;
      }
      nextTurn(st, p.id);
    }
    return;
  }
  if (dbl) {
    st.doubles++;
    if (st.doubles >= 3) {
      p.pos = 10;
      p.inJail = true;
      p.jailTurns = 0;
      st.history.push(`${p.id}: три дубля — в тюрьму!`);
      nextTurn(st, p.id);
      return;
    }
  }
  moveAndResolve(st, p, sum);
  if (st.phase !== 'play' || p.bankrupt) return;
  if (st.awaiting === 'decide') return; // ждём buy/pass
  if (dbl) {
    st.rolled = false; // ещё бросок того же
    st.history.push(`${p.id}: дубль — кидай ещё!`);
    return;
  }
  nextTurn(st, p.id);
}

function moveAndResolve(st: MonoState, p: Player, sum: number): void {
  const np = p.pos + sum;
  if (np >= 40) {
    p.money += SALARY;
    st.history.push(`${p.id}: круг — зарплата +${SALARY}`);
  }
  p.pos = np % 40;
  st.history.push(`${p.id}: ${sum} → «${BOARD[p.pos].name}»`);
  resolveCell(st, p, sum);
}

export function applyMove(st: MonoState, pid: string, mv: MoveInput): { ok: boolean; err?: string } {
  if (st.phase !== 'play') return { ok: false, err: 'бой окончен' };
  const p = me(st, pid);
  if (!p) return { ok: false, err: 'ты не в этом бою' };
  if (st.turn !== pid) return { ok: false, err: 'не твой ход' };

  if (mv.kind === 'resign') {
    bankrupt(st, p, null);
    st.history.push(`${pid} сдался`);
    return { ok: true };
  }
  if (mv.kind === 'roll') {
    if (st.awaiting === 'decide') return { ok: false, err: 'сначала купи или откажись' };
    if (st.rolled) return { ok: false, err: 'уже кидал' };
    const d1 = mv.d1 ?? (1 + Math.floor(st.rng() * 6));
    const d2 = mv.d2 ?? (1 + Math.floor(st.rng() * 6));
    if (d1 < 1 || d1 > 6 || d2 < 1 || d2 > 6) return { ok: false, err: 'кривые кубики' };
    st.rolled = true;
    doRoll(st, p, d1, d2);
    return { ok: true };
  }
  if (mv.kind === 'buy') {
    if (st.awaiting !== 'decide' || st.offerCell === null) return { ok: false, err: 'покупать нечего' };
    const cell = BOARD[st.offerCell];
    if (p.money < (cell.price ?? 0)) return { ok: false, err: 'не хватает фантиков' };
    p.money -= cell.price!;
    st.owner[st.offerCell] = pid;
    st.history.push(`${pid} купил «${cell.name}» за ${cell.price}`);
    const wasDouble = st.doubles > 0;
    st.awaiting = null;
    st.offerCell = null;
    if (wasDouble) { st.rolled = false; }
    else nextTurn(st, pid);
    return { ok: true };
  }
  if (mv.kind === 'pass') {
    if (st.awaiting !== 'decide') return { ok: false, err: 'отказываться не от чего' };
    st.history.push(`${pid} отказался от «${BOARD[st.offerCell!].name}»`);
    const wasDouble = st.doubles > 0;
    st.awaiting = null;
    st.offerCell = null;
    if (wasDouble) { st.rolled = false; }
    else nextTurn(st, pid);
    return { ok: true };
  }
  if (mv.kind === 'build') {
    if (st.rolled || st.awaiting === 'decide') return { ok: false, err: 'строить — до броска' };
    if (p.inJail) return { ok: false, err: 'из тюрьмы не строят' };
    const cell = BOARD[mv.cell];
    const n = mv.n ?? 1;
    if (!cell || cell.kind !== 'street') return { ok: false, err: 'тут не строят' };
    if (st.owner[mv.cell] !== pid) return { ok: false, err: 'чужая улица' };
    if (!groupCells(cell.group!).every(g => st.owner[g] === pid)) return { ok: false, err: 'нужна вся группа' };
    const cur = st.houses[mv.cell] ?? 0;
    if (cur + n > 5 || n < 1) return { ok: false, err: 'выше отеля не строят' };
    const cost = (cell.house ?? 0) * n;
    if (p.money < cost) return { ok: false, err: 'не хватает фантиков' };
    p.money -= cost;
    st.houses[mv.cell] = cur + n;
    st.history.push(`${pid}: ${n} дом на «${cell.name}» за ${cost}`);
    return { ok: true };
  }
  if (mv.kind === 'payJail') {
    if (!p.inJail) return { ok: false, err: 'ты не в тюрьме' };
    if (p.money < JAIL_FINE) return { ok: false, err: 'не хватает на залог' };
    p.money -= JAIL_FINE;
    p.inJail = false;
    p.jailTurns = 0;
    st.history.push(`${pid}: залог ${JAIL_FINE} — свобода`);
    return { ok: true };
  }
  if (mv.kind === 'useCard') {
    if (!p.inJail || !p.jailCard) return { ok: false, err: 'карты нет' };
    p.jailCard = false;
    p.inJail = false;
    p.jailTurns = 0;
    st.history.push(`${pid}: вышел по карте`);
    return { ok: true };
  }
  return { ok: false, err: 'так нельзя' };
}

/** Уход игрока: банкротство с передачей активов живым. */
export function removePlayer(st: MonoState, pid: string): string[] {
  const p = st.players.find(x => x.id === pid);
  if (!p || p.bankrupt) return alive(st).map(x => x.id);
  const wasTurn = st.turn === pid;
  bankrupt(st, p, null);
  if (st.phase === 'play' && wasTurn) {
    const a = alive(st);
    if (a.length > 0) {
      st.turn = a[0].id;
      st.doubles = 0;
      st.rolled = false;
      st.awaiting = null;
      st.offerCell = null;
    }
  }
  return alive(st).map(x => x.id);
}

/** Что делает клуб за молчуна: решает за него по ситуации. */
export function timeoutAction(st: MonoState): MoveInput {
  const p = st.players.find(x => x.id === st.turn);
  if (!p || p.bankrupt) return { kind: 'roll' };
  if (st.awaiting === 'decide') {
    const price = BOARD[st.offerCell!].price ?? 0;
    return p.money >= price ? { kind: 'buy' } : { kind: 'pass' };
  }
  if (p.inJail && p.money >= JAIL_FINE && p.jailTurns >= 2) return { kind: 'payJail' };
  return { kind: 'roll' };
}

/** Кого жмёт таймер. */
export function timeoutMove(st: MonoState): { by: string; kind: 'flag' } {
  return { by: st.turn, kind: 'flag' };
}
