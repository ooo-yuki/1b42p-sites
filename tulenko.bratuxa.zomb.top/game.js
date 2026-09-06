// --- config.js ---
const CFG = {
    hearts: 3, saveKey: 'tulenko_best_v1', step: 0.016,
    walk: 3.2, jump: 7.5, gravity: 22.0,
    guardSpeed: 1.6, sight: 4.5, stunSec: 4.0,
};
// --- grid.js ---
// Слой 2 (верх): поле клетками. Значки карты — клетки, стены держат.
const WALL = '#';
const TILE = 16;
const FLOOR = '#9aa0a6';
const ROOM = {
    B: '#c96a2b',
    T: '#d9b23a',
    J: '#8a8f98',
    S: '#3a7bd5',
    R: '#6b7280',
};
function loadGrid(map) {
    const h = map.length;
    let w = 0;
    for (const row of map)
        w = Math.max(w, row.length);
    const cells = [];
    for (let y = 0; y < h; y++) {
        const row = [];
        for (let x = 0; x < w; x++)
            row.push(map[y][x] || WALL);
        cells.push(row);
    }
    return { w, h, cells };
}
function wallAt(g, x, y) {
    if (x < 0 || y < 0 || x >= g.w || y >= g.h)
        return true;
    return g.cells[y][x] === WALL;
}
function roomColor(ch) {
    return ROOM[ch] || FLOOR;
}
// --- actors.js ---
function newSeal(x, y) {
    return { x: x, y: y, dir: 1, noise: 0 };
}
function stepSeal(s, input, grid, night) {
    const dx = input.dx || 0;
    const dy = input.dy || 0;
    if (dx === 0 && dy === 0) {
        s.noise = 0;
        return;
    }
    if (dx > 0)
        s.dir = 1;
    if (dx < 0)
        s.dir = -1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const dist = CFG.walk * CFG.step;
    const nx = s.x + (dx / len) * dist;
    const ny = s.y + (dy / len) * dist;
    if (grid === undefined || grid === null) {
        s.x = nx;
        s.y = ny;
    }
    else {
        if (!wallAt(grid, Math.floor(nx), Math.floor(s.y)))
            s.x = nx;
        if (!wallAt(grid, Math.floor(s.x), Math.floor(ny)))
            s.y = ny;
    }
    if (night === true)
        s.noise = 2;
    else
        s.noise = 1;
}
function newGuard(x, y, dir) {
    return { x: x, y: y, dir: dir };
}
function stepGuard(g, grid) {
    const nx = g.x + g.dir * CFG.guardSpeed * CFG.step;
    if (wallAt(grid, Math.floor(nx), Math.floor(g.y))) {
        if (g.dir > 0)
            g.dir = -1;
        else
            g.dir = 1;
        return;
    }
    g.x = nx;
}
// --- vision.js ---
const SEE_WALL = '#=-';
function cellWall(map, c, r) {
    if (r < 0 || r >= map.length)
        return true;
    const row = map[r];
    if (c < 0 || c >= row.length)
        return true;
    return SEE_WALL.indexOf(row[c]) >= 0;
}
function losBlocked(map, x0, y0, x1, y1) {
    const dx = x1 - x0;
    const dy = y1 - y0;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const n = Math.max(2, Math.ceil(dist / 0.25));
    for (let i = 1; i < n; i++) {
        const px = x0 + (dx * i) / n;
        const py = y0 + (dy * i) / n;
        if (cellWall(map, Math.floor(px), Math.floor(py)))
            return true;
    }
    return false;
}
// Конус стражи вперёд на дальность из баланса, стены закрывают.
function sees(g, x, y, dir) {
    if (g === null || g === undefined)
        return false;
    if (typeof g.x !== 'number' || typeof x !== 'number')
        return false;
    if (typeof y !== 'number' || typeof dir !== 'number')
        return false;
    const dx = x - g.x;
    const dy = y - g.y;
    if (Math.abs(dx) > CFG.sight)
        return false;
    if (Math.abs(dy) > 0.9)
        return false;
    if (dx !== 0 && Math.sign(dx) !== dir && Math.abs(dx) > 0.5)
        return false;
    if (g.map && losBlocked(g.map, g.x, g.y, x, y))
        return false;
    return true;
}
// Розыск плюс один; три розыска — карцер до утра.
function heatUp(S) {
    if (S === null || S === undefined)
        return;
    if (typeof S.wanted !== 'number')
        S.wanted = 0;
    S.wanted = Math.min(3, S.wanted + 1);
    if (S.wanted >= 3)
        toSolitary(S);
}
// Карцер до утра: розыск три, возврат в камеру, вещи отобраны.
function toSolitary(S) {
    if (S === null || S === undefined)
        return;
    S.wanted = 3;
    S.solitary = true;
    const home = S.cell ? S.cell : S.spawn;
    if (S.seal && home) {
        S.seal.x = home.x;
        S.seal.y = home.y;
    }
    if (S.items)
        S.items.length = 0;
}
// Поимка взглядом: розыск плюс один и возврат в камеру.
function catchSeal(S) {
    if (S === null || S === undefined)
        return;
    heatUp(S);
    if (!S.solitary) {
        const home = S.cell ? S.cell : S.spawn;
        if (S.seal && home) {
            S.seal.x = home.x;
            S.seal.y = home.y;
        }
    }
}
// --- clock.js ---
// Часы и распорядок верхнего слоя. Ничего не берёт, отдаёт tick и hourCase.
// Распорядок: подъём, поверка, еда, работа, душ, поверка, отбой.
const HOUR = 3600;
const DAY_LEN = 86400;
const NIGHT_END = 6 * HOUR;
const MUSTER1 = 7 * HOUR;
const MEAL = 8 * HOUR;
const WORK = 9 * HOUR;
const SHOWER = 17 * HOUR;
const MUSTER2 = 18 * HOUR;
const MUSTER2_END = 19 * HOUR;
const LIGHTSOUT = 22 * HOUR;
const MAX_HEAT = 3;
function newDay() {
    return { t: 0, day: 1, heat: 0, coins: 0, lights: false };
}
function tick(S, dt) {
    if (dt < 0)
        dt = 0;
    S.t += dt;
    while (S.t >= DAY_LEN) {
        S.t -= DAY_LEN;
        S.day += 1;
    }
    S.lights = S.t >= NIGHT_END && S.t < LIGHTSOUT;
}
function hourCase(S) {
    const t = S.t;
    if (t < NIGHT_END)
        return 'ночь';
    if (t < MUSTER1)
        return 'подъём';
    if (t < MEAL)
        return 'поверка';
    if (t < WORK)
        return 'еда';
    if (t < SHOWER)
        return 'работа';
    if (t < MUSTER2)
        return 'душ';
    if (t < MUSTER2_END)
        return 'поверка';
    if (t < LIGHTSOUT)
        return 'вечер';
    return 'отбой';
}
// Нет на поверке — розыск вверх, потолок три.
function applyMuster(S, present) {
    if (!present && S.heat < MAX_HEAT)
        S.heat += 1;
}
// Был на работе — монета, нет — без монет.
function applyWork(S, present) {
    if (present)
        S.coins += 1;
}
function isNight(S) {
    return !S.lights;
}
// --- work.js ---
// Работа и монеты слоя 2. Берёт часы clock.ts (смена 9–17, там WORK..SHOWER),
// даёт workAt(S): монеты за смену, усталость, станки J.
const WORK_START = 9;
const WORK_END = 17;
const COINS_PER_SHIFT = 1;
const BENCH = 'J';
// Час внутри смены clock.ts: 9 <= hour < 17.
function isWorkHour(hour) {
    if (typeof hour !== 'number' || isNaN(hour))
        return false;
    return hour >= WORK_START && hour < WORK_END;
}
// Клетка станка на карте корпусов.
function isBench(cell) {
    return cell === BENCH;
}
// Монет за смену: у станка в часы работы — монета, иначе ноль.
function workAt(S) {
    if (!S || !S.atBench)
        return 0;
    if (!isWorkHour(S.hour))
        return 0;
    return COINS_PER_SHIFT;
}
// Смена целиком: монеты в кошель, усталость плюс один за смену с делом.
function applyShift(W, S) {
    const pay = workAt(S);
    if (pay > 0) {
        W.coins += pay;
        W.tired += 1;
    }
}
// --- things.js ---
// Вещи и сборка слоя 2. Ничего не берёт, даёт pick, craft, has,
// находки (тряпка, ложка, верёвка, мыло), сборку (кляп, спуск) и торговца.
const LOOT = ['тряпка', 'ложка', 'верёвка', 'мыло'];
const RECIPES = {
    'кляп': ['ложка', 'тряпка'],
    'спуск': ['верёвка', 'мыло'],
};
// Запретное для обысков: с ним в суме — карцер.
const FORBIDDEN = ['ложка', 'кляп', 'спуск'];
// Торговец ночью (ночь из clock.ts): монеты в запретное.
// Цены: ложка 2, верёвка 3, мыло 2. Днём торговца нет.
const TRADER_PRICES = { 'ложка': 2, 'верёвка': 3, 'мыло': 2 };
const TRADER_PRICE = 2;
function has(S, id) {
    if (!S || !S.bag)
        return false;
    return S.bag.indexOf(id) >= 0;
}
function take(S, id) {
    if (!S || !S.bag)
        return false;
    const i = S.bag.indexOf(id);
    if (i < 0)
        return false;
    S.bag.splice(i, 1);
    return true;
}
// Подобрать находку в суму.
function pick(S, id) {
    if (!S || !S.bag)
        return;
    if (typeof id !== 'string' || id === '')
        return;
    S.bag.push(id);
}
// Сборка: без нужного в суме не выходит, состав уходит в дело.
function craft(S, id) {
    if (!S || !S.bag)
        return false;
    const parts = RECIPES[id];
    if (!parts)
        return false;
    if (has(S, id))
        return true;
    for (const p of parts) {
        if (!has(S, p))
            return false;
    }
    for (const p of parts) {
        take(S, p);
    }
    S.bag.push(id);
    return true;
}
// Запретное помечено для обысков.
function isForbidden(id) {
    return FORBIDDEN.indexOf(id) >= 0;
}
// В суме есть запретное — обыск ведёт в карцер.
function hasForbidden(S) {
    if (!S || !S.bag)
        return false;
    for (const id of S.bag) {
        if (isForbidden(id))
            return true;
    }
    return false;
}
// Торговец ночью: монеты в обмен на ложку, верёвку, мыло.
// Мало монет или день — торга нет.
function deal(S, id) {
    if (!S || !S.bag)
        return false;
    if (S.night !== true)
        return false;
    const price = TRADER_PRICES[id];
    if (typeof price !== 'number')
        return false;
    if (typeof S.coins !== 'number' || S.coins < price)
        return false;
    S.coins -= price;
    S.bag.push(id);
    return true;
}
// --- talk.js ---
// Разговоры и нить верхнего слоя. Берёт флаги памяти, даёт talkFor и say.
// Три узла на день: утро, обед, вечер. Концы: крыша (нужен спуск),
// ворота (нужен кляп). Лицо духа рядом с речью: img/face_wisp.png.
const FACE = 'img/face_wisp.png';
const NODES = [
    { id: 'm1', who: 'дух', text: 'Утро. Поверка скоро — держись места, не шуми.', face: FACE },
    { id: 'n1', who: 'дух', text: 'Обед. Миска лечит сердце, работа даёт монеты.', face: FACE },
    { id: 'e1', who: 'дух', text: 'Вечер. Ночью торговец, тихо — спуск или кляп.', face: FACE },
    { id: 'roof', who: 'дух', text: 'Спуск готов. Тихий уход через крышу ждёт.', face: FACE },
    { id: 'gate', who: 'дух', text: 'Кляп готов. Громкий уход через ворота ждёт.', face: FACE },
];
function talkFor(S) {
    const out = [];
    for (const n of NODES) {
        if (S.flags[n.id])
            continue;
        if (n.id === 'roof' && !S.flags.descent)
            continue;
        if (n.id === 'gate' && !S.flags.gag)
            continue;
        out.push(n);
    }
    return out;
}
function say(S, id) {
    S.flags[id] = true;
}
// --- search.js ---
// Обыски и карцер верхнего слоя. Берёт суму из things.ts (bag),
// часы из clock.ts (heat), отдаёт search и leaveSolitary.
// Обыск в камере находит запретное, уводит в карцер до утра, вещи отобраны.
// Запретное для обысков: орудия и сборка (ложка, верёвка, кляп, спуск).
// Тряпка и мыло — безвинны, обыск их не берёт.
const SEARCH_FORBIDDEN = ['ложка', 'верёвка', 'кляп', 'спуск'];
function searchForbidden(id) {
    return SEARCH_FORBIDDEN.indexOf(id) >= 0;
}
function sack(S) {
    if (S === null || S === undefined)
        return [];
    if (Array.isArray(S.bag))
        return S.bag;
    if (Array.isArray(S.items))
        return S.items;
    return [];
}
// Обыск: возвращает найденное запретное. Нашёл — карцер до утра:
// розыск три, возврат в камеру, вещи отобраны. Чист — тишина.
function search(S) {
    if (S === null || S === undefined)
        return [];
    const found = [];
    const have = sack(S);
    for (const id of have) {
        if (searchForbidden(id))
            found.push(id);
    }
    if (found.length === 0)
        return found;
    if (typeof S.heat === 'number')
        S.heat = 3;
    if (typeof S.wanted === 'number')
        S.wanted = 3;
    if (S.heat === undefined && S.wanted === undefined)
        S.heat = 3;
    S.solitary = true;
    const home = S.cell ? S.cell : S.spawn;
    if (S.seal && home) {
        S.seal.x = home.x;
        S.seal.y = home.y;
    }
    if (Array.isArray(S.bag))
        S.bag.length = 0;
    if (Array.isArray(S.items))
        S.items.length = 0;
    return found;
}
// Утро: карцер отпускает.
function leaveSolitary(S) {
    if (S === null || S === undefined)
        return;
    S.solitary = false;
}
// --- paint.js ---
// Слой 2 (верх): вид сверху, начало — пол, стены, тьма.
const DARK = '#000000';
const WALL_FACE = '#ffffff';
function paintFloor(ctx, G) {
    ctx.fillStyle = DARK;
    ctx.fillRect(-TILE, -TILE, (G.w + 2) * TILE, (G.h + 2) * TILE);
    for (let y = 0; y < G.h; y++) {
        for (let x = 0; x < G.w; x++) {
            const px = x * TILE;
            const py = y * TILE;
            if (wallAt(G, x, y)) {
                ctx.fillStyle = DARK;
                ctx.fillRect(px, py, TILE, TILE);
                ctx.fillStyle = WALL_FACE;
                ctx.fillRect(px + 1, py + 1, TILE - 2, TILE - 2);
            }
            else {
                ctx.fillStyle = roomColor(G.cells[y][x]);
                ctx.fillRect(px, py, TILE, TILE);
            }
        }
    }
}
// --- audio.js ---
// Звук гудками: гудок качается кодом через WebAudio, без внешних файлов.
//
// Первый вызов blip() должен случаться после кнопки игрока
// (user gesture), иначе браузер держит AudioContext закрытым и молчит.
// Без звука (нет WebAudio / исключение) — молча идём дальше, без throws.
let ctx = null;
function getCtx() {
    try {
        if (ctx) {
            if (ctx.state === "suspended")
                void ctx.resume().catch(() => { });
            return ctx;
        }
        const AC = window.AudioContext ??
            window
                .webkitAudioContext;
        if (!AC)
            return null;
        ctx = new AC();
        if (ctx.state === "suspended")
            void ctx.resume().catch(() => { });
        return ctx;
    }
    catch {
        return null;
    }
}
function beep(ac, freq, dur, type, when = 0, gainValue = 0.15) {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    const t0 = ac.currentTime + when;
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    gain.gain.setValueAtTime(gainValue, t0);
    gain.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
}
// Высота и длина свои на каждый случай.
function blip(kind) {
    try {
        const ac = getCtx();
        if (!ac)
            return;
        switch (kind) {
            case "step": // шаг: короткий низкий квадрат
                beep(ac, 300, 0.06, "square", 0, 0.08);
                break;
            case "pickup": // подбор: высокий звонкий синус
                beep(ac, 880, 0.12, "sine");
                break;
            case "hit": // удар: низкий рычащий пилозуб
                beep(ac, 110, 0.25, "sawtooth", 0, 0.2);
                break;
            case "win": // победа: три восходящих гудка
                beep(ac, 523, 0.12, "sine");
                beep(ac, 659, 0.12, "sine", 0.13);
                beep(ac, 784, 0.25, "sine", 0.26);
                break;
            case "lose": // поражение: три нисходящих гудка
                beep(ac, 392, 0.15, "triangle");
                beep(ac, 311, 0.15, "triangle", 0.16);
                beep(ac, 233, 0.35, "triangle", 0.32);
                break;
        }
    }
    catch {
        // без звука — молча идём дальше
    }
}
// --- endings.js ---
// Концовка крыши слоя 3. Берёт things.ts (спуск), clock.ts (ночь). Даёт tryRoof(S).
// Ночь, клетка крыши, спуск в суме — победа. Нет спуска — предупреждение.
// День — ждать ночи.
function hasEnd(S, id) {
    if (!S || !S.bag)
        return false;
    return S.bag.indexOf(id) >= 0;
}
// Крыша: ночью со спуском — 'win', ночью без спуска — 'warn', днём — 'wait'.
function tryRoof(S) {
    if (!S || S.atRoof !== true)
        return 'wait';
    if (S.night !== true)
        return 'wait';
    if (hasEnd(S, 'спуск'))
        return 'win';
    return 'warn';
}
function hasGate(S, id) {
    if (!S || !S.bag)
        return false;
    return S.bag.indexOf(id) >= 0;
}
// Ворота: день + ворота + кляп + розыск ноль — 'win', иначе — 'deny'.
function tryGate(S) {
    if (!S || S.atGate !== true)
        return 'deny';
    if (S.day !== true)
        return 'deny';
    if (S.heat !== 0)
        return 'deny';
    if (!hasGate(S, 'кляп'))
        return 'deny';
    return 'win';
}
// --- main2.js ---
// Слой 2 (верх): склейка. Вид сверху, день, нить, работа, кара.
// Берёт grid, actors, vision, clock, work, things, talk, search, paint, audio, endings.
// Бок (main, logic) сюда не входит.
// Корпус значками из замысла: D дверь, J станок, B кровать,
// T стол, S душ, R крыша. P наши, E ворота. Остальное пол.
const MAP = [
    '##############################',
    '#BBB...D....TTT....JJJ...SSS#',
    '#BBB........TTT....JJJ...SSS#',
    '#BBB...D....TTT....JJJ...SSS#',
    '#..........................#',
    '#.....######D######....D...#',
    '#.....#BBB..B..BBB#....#RRR#',
    '#.....#BBB..B..BBB#....#RRR#',
    '#.....######D######....#RRR#',
    '#..........................#',
    '#.TTT....D....JJJ....D...SSS#',
    '#.TTT........JJJ........SSS#',
    '#.TTT........JJJ........SSS#',
    '#..........................#',
    '#P........................E#',
    '##############################',
];
const G = loadGrid(MAP);
const SCALE = 2;
const SPAWN = { x: 1.5, y: 14.5 };
const SOL = { x: 27.5, y: 14.5 };
const MUSTER = { x0: 8, y0: 1, x1: 16, y1: 3 };
// Торговец ночью: стоит рядом с нашими, меняет монеты на вещи (ложка 2, верёвка 3, мыло 2).
const TRADER = { x: 3.5, y: 14.5 };
const TRADE_ORDER = ['ложка', 'верёвка', 'мыло'];
const SPOTS = [
    { x: 2.5, y: 2.5, id: 'тряпка' },
    { x: 12.5, y: 2.5, id: 'ложка' },
    { x: 19.5, y: 2.5, id: 'верёвка' },
    { x: 25.5, y: 2.5, id: 'мыло' },
];
const bag = [];
const flags = {};
const D = newDay();
const S = D;
S.wanted = 0;
S.solitary = false;
S.seal = { x: SPAWN.x, y: SPAWN.y };
S.spawn = { x: SPAWN.x, y: SPAWN.y };
S.cell = { x: SPAWN.x, y: SPAWN.y };
S.bag = bag;
S.items = bag;
S.coins = 0;
S.flags = flags;
const seal = newSeal(SPAWN.x, SPAWN.y);
const guards = [
    newGuard(6.5, 4.5, 1),
    newGuard(22.5, 9.5, -1),
];
const seen = [];
for (const gd of guards) {
    gd.map = MAP;
    seen.push(gd);
}
let mode = 'play';
let winEnd = '';
let face = 'right';
let tired = 0;
let lastMuster = '';
let lastWork = '';
let lastLine = '';
let sndOn = true;
function snd(kind) {
    if (!sndOn)
        return;
    try {
        blip(kind);
    }
    catch (e) { /* без звука идём дальше */ }
}
function syncHeat() {
    const h = Math.max(S.heat || 0, S.wanted || 0);
    S.heat = h;
    S.wanted = h;
}
function cellAt(x, y) {
    const cx = Math.floor(x);
    const cy = Math.floor(y);
    if (cy < 0 || cy >= G.h || cx < 0 || cx >= G.w)
        return '#';
    return G.cells[cy][cx];
}
function inMuster() {
    const x = S.seal.x;
    const y = S.seal.y;
    return x >= MUSTER.x0 && x <= MUSTER.x1 && y >= MUSTER.y0 && y <= MUSTER.y1;
}
// Один шаг мира. Тем же шагом гонит окно и крючок для проверки.
function simStep(dt, input) {
    if (mode !== 'play')
        return;
    if (!(dt > 0))
        dt = CFG.step;
    if (dt > 1)
        dt = 1;
    tick(S, dt);
    syncHeat();
    const nowHour = Math.floor(S.t / 3600);
    const hc = hourCase(S);
    if (input && (input.dx !== 0 || input.dy !== 0)) {
        if (input.dy < 0)
            face = 'up';
        else if (input.dy > 0)
            face = 'down';
        else if (input.dx > 0)
            face = 'right';
        else
            face = 'left';
    }
    if (S.solitary) {
        S.seal.x = SOL.x;
        S.seal.y = SOL.y;
    }
    else if (input) {
        seal.x = S.seal.x;
        seal.y = S.seal.y;
        stepSeal(seal, input, G, isNight(S));
        S.seal.x = seal.x;
        S.seal.y = seal.y;
    }
    const frames = Math.max(1, Math.min(64, Math.round(dt / CFG.step)));
    for (let i = 0; i < frames; i++) {
        for (const gd of seen)
            stepGuard(gd, G);
    }
    for (const gd of seen) {
        if (sees(gd, S.seal.x, S.seal.y, gd.dir)) {
            catchSeal(S);
            syncHeat();
            S.seal.x = seal.x = S.cell.x;
            S.seal.y = seal.y = S.cell.y;
            snd('hit');
            break;
        }
    }
    if (hc === 'поверка') {
        const id = S.day + (nowHour < 12 ? 'am' : 'pm');
        if (id !== lastMuster) {
            lastMuster = id;
            if (!S.solitary && !inMuster()) {
                applyMuster(S, false);
                syncHeat();
                snd('hit');
            }
        }
    }
    if (hc === 'работа' && !S.solitary) {
        const id = S.day + 'h' + nowHour;
        if (id !== lastWork && isBench(cellAt(S.seal.x, S.seal.y))) {
            lastWork = id;
            const pay = workAt({ atBench: true, hour: nowHour });
            if (pay > 0) {
                S.coins += pay;
                tired += 1;
                applyWork(S, true);
                snd('pickup');
            }
        }
    }
    if (S.solitary && hc === 'подъём') {
        leaveSolitary(S);
        S.cell = { x: SPAWN.x, y: SPAWN.y };
        S.seal.x = seal.x = SPAWN.x;
        S.seal.y = seal.y = SPAWN.y;
        syncHeat();
        S.heat = 0;
        S.wanted = 0;
    }
    if (has(S, 'спуск'))
        flags.descent = true;
    if (has(S, 'кляп'))
        flags.gag = true;
    const under = cellAt(S.seal.x, S.seal.y);
    const night = isNight(S);
    S.night = night;
    // Концовки слоя 3 через endings.ts: крыша ночью со спуском, ворота днём с кляпом.
    const roof = tryRoof({ atRoof: under === 'R', night: night, bag: bag });
    if (roof === 'win') {
        mode = 'win';
        winEnd = 'roof';
        snd('win');
    }
    else {
        if (roof === 'warn' && under === 'R')
            lastLine = 'Ночью без спуска не уйти — нужен спуск.';
        const gate = tryGate({ atGate: under === 'E', day: !night, bag: bag, heat: S.wanted || 0 });
        if (gate === 'win') {
            mode = 'win';
            winEnd = 'gate';
            snd('win');
        }
    }
}
// E: выслушать нить. R: подобрать рядом. C: собрать кляп и спуск.
// T: торг ночью рядом с торговцем — монеты в вещь.
function doTalk() {
    const lines = talkFor(S);
    if (lines.length === 0)
        return '';
    say(S, lines[0].id);
    lastLine = lines[0].text;
    return lastLine;
}
function doPick() {
    for (let i = 0; i < SPOTS.length; i++) {
        const L = SPOTS[i];
        if (Math.abs(L.x - S.seal.x) < 1 && Math.abs(L.y - S.seal.y) < 1) {
            pick(S, L.id);
            SPOTS.splice(i, 1);
            snd('pickup');
            return L.id;
        }
    }
    return '';
}
function doCraft() {
    const out = [];
    if (craft(S, 'кляп')) {
        flags.gag = true;
        out.push('кляп');
    }
    if (craft(S, 'спуск')) {
        flags.descent = true;
        out.push('спуск');
    }
    if (out.length > 0)
        snd('pickup');
    return out;
}
function doSearch() {
    const found = search(S);
    if (found.length > 0) {
        syncHeat();
        S.cell = { x: SOL.x, y: SOL.y };
        snd('lose');
    }
    return found;
}
// Торг: ночью рядом с торговцем, монеты в вещь из things.ts.
// С именем — ровно её, без имени — первую по карману из ложки, верёвки, мыла.
function doTrade(id) {
    S.night = isNight(S);
    if (Math.abs(TRADER.x - S.seal.x) > 1.5 || Math.abs(TRADER.y - S.seal.y) > 1.5)
        return '';
    const want = (typeof id === 'string' && id !== '') ? [id] : TRADE_ORDER;
    for (const w of want) {
        if (deal(S, w)) {
            snd('pickup');
            return w;
        }
    }
    return '';
}
function fmtTime() {
    const h = Math.floor(S.t / 3600);
    const m = Math.floor((S.t - h * 3600) / 60);
    return (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
}
// --- Окно: холст, ввод, кадры. В проверке узла холста нет — тихо стоим.
const ROOT = typeof window !== 'undefined' ? window : globalThis;
const doc = typeof document !== 'undefined' ? document : null;
const canvas = doc ? doc.getElementById('game') : null;
const g2d = canvas ? canvas.getContext('2d') : null;
// Экран во всю страницу: холст в размер окна, края обрезаются заливкой.
function fitScreen() {
    if (!canvas)
        return;
    try {
        const w = ROOT.innerWidth || canvas.width || 960;
        const h = ROOT.innerHeight || canvas.height || 540;
        if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
            canvas.width = w;
            canvas.height = h;
        }
    }
    catch (e) { /* стоим как были */ }
}
fitScreen();
if (ROOT && ROOT.addEventListener) {
    ROOT.addEventListener('resize', fitScreen);
}
const pics = {};
const TOP_SEAL = {
    up: 'img/top_seal_up.png',
    down: 'img/top_seal_down.png',
    left: 'img/top_seal_left.png',
    right: 'img/top_seal_right.png',
};
const TOP_GUARD = ['img/top_guard_0.png', 'img/top_guard_1.png'];
function loadPics() {
    if (!doc || typeof Image === 'undefined')
        return;
    const all = [TOP_SEAL.up, TOP_SEAL.down, TOP_SEAL.left, TOP_SEAL.right,
        TOP_GUARD[0], TOP_GUARD[1], FACE];
    for (const src of all) {
        try {
            const im = new Image();
            im.src = src;
            pics[src] = { src: src, broken: false, img: im };
        }
        catch (e) { /* битая — квадратом */ }
    }
}
function drawImg(src, x, y, w, h, fallback) {
    if (!g2d)
        return;
    const p = pics[src];
    if (p && !p.broken && p.img) {
        try {
            g2d.drawImage(p.img, x, y, w, h);
            return;
        }
        catch (e) { /* квадратом */ }
    }
    g2d.fillStyle = fallback;
    g2d.fillRect(x, y, w, h);
}
function px(x) {
    return x * TILE * SCALE;
}
function render(now) {
    if (!g2d || !canvas)
        return;
    const W = canvas.width;
    const H = canvas.height;
    g2d.setTransform(1, 0, 0, 1, 0, 0);
    g2d.fillStyle = '#000';
    g2d.fillRect(0, 0, W, H);
    g2d.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    paintFloor(g2d, G);
    g2d.setTransform(1, 0, 0, 1, 0, 0);
    for (const L of SPOTS) {
        g2d.fillStyle = '#ffd23f';
        g2d.fillRect(px(L.x) - 6, px(L.y) - 6, 12, 12);
    }
    // Торговец виден ночью: золотая метка рядом с нашими.
    if (isNight(S)) {
        g2d.fillStyle = '#7CFC00';
        g2d.fillRect(px(TRADER.x) - 6, px(TRADER.y) - 6, 12, 12);
    }
    // Взгляд конусом по полу, честный.
    for (const gd of seen) {
        g2d.fillStyle = 'rgba(255,220,80,0.18)';
        const gx = px(gd.x);
        const gy = px(gd.y);
        const len = CFG.sight * TILE * SCALE;
        if (gd.dir > 0)
            g2d.fillRect(gx, gy - 14, len, 28);
        else
            g2d.fillRect(gx - len, gy - 14, len, 28);
    }
    // Тени-овалы под ногами.
    g2d.fillStyle = 'rgba(0,0,0,0.35)';
    g2d.beginPath();
    g2d.ellipse(px(S.seal.x), px(S.seal.y) + 12, 14, 5, 0, 0, Math.PI * 2);
    g2d.fill();
    for (const gd of seen) {
        g2d.beginPath();
        g2d.ellipse(px(gd.x), px(gd.y) + 12, 14, 5, 0, 0, Math.PI * 2);
        g2d.fill();
    }
    drawImg(TOP_SEAL[face], px(S.seal.x) - 16, px(S.seal.y) - 16, 32, 32, '#dfe3e6');
    const frame = Math.floor(now / 300) % 2;
    for (const gd of seen) {
        drawImg(TOP_GUARD[frame], px(gd.x) - 16, px(gd.y) - 16, 32, 32, '#3a5bd5');
    }
    if (isNight(S)) {
        g2d.fillStyle = 'rgba(0,0,32,0.45)';
        g2d.fillRect(0, 0, W, H);
    }
    if (S.solitary) {
        g2d.fillStyle = 'rgba(0,0,0,0.55)';
        g2d.fillRect(0, 0, W, H);
        g2d.fillStyle = '#fff';
        g2d.font = '28px sans-serif';
        g2d.textAlign = 'center';
        g2d.fillText('карцер до утра', W / 2, H / 2);
    }
    // Вверху слева монеты и розыск. Внизу полоса: время, день, дело часа.
    g2d.fillStyle = '#fff';
    g2d.font = '18px sans-serif';
    g2d.textAlign = 'left';
    let heat = '';
    for (let i = 0; i < 3; i++)
        heat += i < S.wanted ? '★' : '☆';
    g2d.fillText('◉ ' + S.coins + '   ' + heat, 12, 24);
    g2d.textAlign = 'center';
    const hc = hourCase(S);
    g2d.fillText(fmtTime() + '  день ' + S.day + '  ' + hc, W / 2, H - 34);
    const lines = talkFor(S);
    const show = lastLine || (lines.length > 0 ? lines[0].text : '');
    if (show) {
        drawImg(FACE, W / 2 - 220, H - 96, 64, 64, '#cfe8ff');
        g2d.textAlign = 'left';
        g2d.font = '16px sans-serif';
        g2d.fillText(show.slice(0, 48), W / 2 - 148, H - 58);
    }
    if (mode === 'win') {
        g2d.fillStyle = '#fff';
        g2d.font = '30px sans-serif';
        g2d.textAlign = 'center';
        g2d.fillText(winEnd === 'roof' ? 'тихий уход через крышу' : 'громкий уход через ворота', W / 2, H / 2 - 40);
    }
}
const keys = {};
if (doc && doc.addEventListener) {
    doc.addEventListener('keydown', (e) => {
        keys[e.key] = true;
        if (e.key === 'e' || e.key === 'E' || e.key === 'у' || e.key === 'У')
            doTalk();
        if (e.key === 'r' || e.key === 'R' || e.key === 'к' || e.key === 'К')
            doPick();
        if (e.key === 'c' || e.key === 'C' || e.key === 'с' || e.key === 'С')
            doCraft();
        if (e.key === 't' || e.key === 'T' || e.key === 'е' || e.key === 'Е')
            doTrade();
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].indexOf(e.key) >= 0 && e.preventDefault)
            e.preventDefault();
    });
    doc.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });
}
function readInput() {
    let dx = 0;
    let dy = 0;
    if (keys.ArrowLeft || keys.a || keys.A || keys.ф || keys.Ф)
        dx -= 1;
    if (keys.ArrowRight || keys.d || keys.D || keys.в || keys.В)
        dx += 1;
    if (keys.ArrowUp || keys.w || keys.W || keys.ц || keys.Ц)
        dy -= 1;
    if (keys.ArrowDown || keys.s || keys.S || keys.ы || keys.Ы)
        dy += 1;
    return { dx: dx, dy: dy };
}
let prevT = 0;
function frame(now) {
    if (!g2d)
        return;
    if (!prevT)
        prevT = now;
    let dt = (now - prevT) / 1000;
    prevT = now;
    if (dt > 0.1)
        dt = 0.1;
    simStep(dt, readInput());
    render(now);
    if (typeof requestAnimationFrame !== 'undefined')
        requestAnimationFrame(frame);
}
if (canvas && g2d) {
    loadPics();
    if (typeof requestAnimationFrame !== 'undefined')
        requestAnimationFrame(frame);
}
// Крючок для внешней проверки: день целиком прогоном, нить, карцер.
ROOT.__hook = {
    S: S,
    G: G,
    MAP: MAP,
    simStep: simStep,
    doTalk: doTalk,
    doPick: doPick,
    doCraft: doCraft,
    doSearch: doSearch,
    doTrade: doTrade,
    TRADER: TRADER,
    deal: deal,
    tryRoof: tryRoof,
    tryGate: tryGate,
    newDay: newDay,
    tick: tick,
    hourCase: hourCase,
    applyMuster: applyMuster,
    applyWork: applyWork,
    isNight: isNight,
    loadGrid: loadGrid,
    wallAt: wallAt,
    newSeal: newSeal,
    stepSeal: stepSeal,
    sees: sees,
    heatUp: heatUp,
    toSolitary: toSolitary,
    catchSeal: catchSeal,
    workAt: workAt,
    isBench: isBench,
    pick: pick,
    craft: craft,
    has: has,
    talkFor: talkFor,
    say: say,
    search: search,
    leaveSolitary: leaveSolitary,
    FACE: FACE,
    get mode() { return mode; },
    get winEnd() { return winEnd; },
};
