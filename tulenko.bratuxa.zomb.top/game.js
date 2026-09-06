// --- config.js ---
const CFG = {
    hearts: 3, saveKey: 'tulenko_best_v1', step: 0.016,
    walk: 3.2, jump: 7.5, gravity: 22.0,
    guardSpeed: 1.6, sight: 4.5, stunSec: 4.0,
};

// --- levels.js ---
const GLYPHS = '#=-KFE GP';
function checkMap(map) {
    const bad = [];
    if (map.length === 0)
        return ['пустая карта'];
    const w = map[0].length;
    const flat = map.join('');
    if (!map.every((r) => r.length === w))
        bad.push('строки разной длины');
    for (const must of ['P', 'E', 'K', 'F']) {
        if (!flat.includes(must))
            bad.push('нет знака ' + must);
    }
    for (const ch of flat) {
        if (!('#=-KFE GP'.includes(ch)))
            bad.push('чужой знак ' + ch);
    }
    return [...new Set(bad)];
}
const LEVELS = [
    [
        '################',
        '#P     K      E#',
        '#   ######     #',
        '#              #',
        '#      G       #',
        '#   F  G       #',
        '#              #',
        '################',
    ],
    [
        '################',
        '#P            E#',
        '#   F    K     #',
        '#   -----      #',
        '#        G     #',
        '#  -----    ---#',
        '################',
    ],
    [
        '################',
        '#P    ==    K E#',
        '#     ==       #',
        '#  G   ==  F   #',
        '#      ==   G  #',
        '#              #',
        '################',
    ],
];

// --- logic.js ---
const SOLID = '#=-';
function cellSolid(map, c, r) {
    if (r < 0 || r >= map.length)
        return true;
    if (c < 0 || c >= map[r].length)
        return true;
    return SOLID.includes(map[r][c]);
}
function solidAt(map, x, y) {
    const H = map.length;
    const c = Math.floor(x);
    const r = H - 1 - Math.floor(y);
    return cellSolid(map, c, r);
}
function findMark(map, ch) {
    for (let r = 0; r < map.length; r++) {
        for (let c = 0; c < map[r].length; c++) {
            if (map[r][c] === ch)
                return { c, r };
        }
    }
    return null;
}
function loadLevel(S, idx) {
    S.level = idx;
    const map = LEVELS[idx];
    const H = map.length;
    const cellY = (r) => H - 1 - r;
    const p = findMark(map, 'P');
    S.spawn = { x: p.c + 0.5, y: cellY(p.r) };
    S.seal.x = S.spawn.x;
    S.seal.y = S.spawn.y;
    S.seal.vx = 0;
    S.seal.vy = 0;
    S.seal.onGround = false;
    S.guards = [];
    for (let r = 0; r < H; r++) {
        for (let c = 0; c < map[r].length; c++) {
            if (map[r][c] === 'G')
                S.guards.push({ x: c + 0.5, y: cellY(r), dir: 1, stun: 0 });
        }
    }
    const k = findMark(map, 'K');
    S.key = k ? { x: k.c + 0.5, y: cellY(k.r) + 0.5, taken: false } : null;
    const f = findMark(map, 'F');
    S.fish = f ? { x: f.c + 0.5, y: cellY(f.r) + 0.5, taken: false } : null;
    const e = findMark(map, 'E');
    S.exit = e ? { x: e.c + 0.5, y: cellY(e.r) + 0.5 } : null;
    S.hasKey = false;
    S.hasFish = false;
    S.caught = false;
}
function newRun(level) {
    const S = {
        level: 0,
        seal: { x: 0, y: 0, vx: 0, vy: 0, onGround: false },
        guards: [],
        hearts: CFG.hearts,
        caught: false,
        hasKey: false,
        hasFish: false,
        won: false,
        dead: false,
        spawn: { x: 0, y: 0 },
        key: null,
        fish: null,
        exit: null,
    };
    loadLevel(S, level || 0);
    return S;
}
function step(S, input) {
    if (S.won || S.dead)
        return;
    const inp = input || {};
    const dt = CFG.step;
    const map = LEVELS[S.level];
    S.caught = false;
    const move = (inp.right ? 1 : 0) - (inp.left ? 1 : 0);
    S.seal.vx = move * CFG.walk;
    let nx = S.seal.x + S.seal.vx * dt;
    if (move !== 0) {
        const edge = nx + (move > 0 ? 0.3 : -0.3);
        if (solidAt(map, edge, S.seal.y + 0.05) || solidAt(map, edge, S.seal.y + 0.6)) {
            nx = S.seal.x;
        }
    }
    S.seal.x = nx;
    S.seal.vy -= CFG.gravity * dt;
    if (inp.jump && S.seal.onGround) {
        S.seal.vy = CFG.jump;
        S.seal.onGround = false;
    }
    let ny = S.seal.y + S.seal.vy * dt;
    S.seal.onGround = false;
    if (S.seal.vy <= 0) {
        if (solidAt(map, S.seal.x - 0.25, ny) || solidAt(map, S.seal.x + 0.25, ny) || solidAt(map, S.seal.x, ny)) {
            ny = Math.floor(ny) + 1;
            S.seal.vy = 0;
            S.seal.onGround = true;
        }
    }
    else if (solidAt(map, S.seal.x, ny + 0.9)) {
        ny = Math.floor(ny + 0.9) - 0.9 - 0.001;
        S.seal.vy = 0;
    }
    S.seal.y = ny;
    for (const g of S.guards) {
        if (g.stun > 0) {
            g.stun = Math.max(0, g.stun - dt);
            continue;
        }
        const nxg = g.x + g.dir * CFG.guardSpeed * dt;
        const edge = nxg + (g.dir > 0 ? 0.3 : -0.3);
        if (solidAt(map, edge, g.y + 0.05) || solidAt(map, edge, g.y + 0.6)) {
            g.dir = -g.dir;
        }
        else {
            g.x = nxg;
        }
    }
    if (inp.shove) {
        for (const g of S.guards) {
            if (g.stun > 0)
                continue;
            if (Math.abs(S.seal.x - g.x) <= 1.0 && Math.abs(S.seal.y - g.y) <= 1.0) {
                g.stun = CFG.stunSec;
            }
        }
    }
    for (const g of S.guards) {
        if (g.stun > 0)
            continue;
        const dx = S.seal.x - g.x;
        const dy = S.seal.y - g.y;
        if (Math.abs(dy) > 0.9)
            continue;
        if (Math.abs(dx) > CFG.sight)
            continue;
        if (dx !== 0 && Math.sign(dx) !== g.dir && Math.abs(dx) > 0.5)
            continue;
        let blocked = false;
        const n = Math.max(2, Math.ceil(Math.abs(dx) / 0.25));
        for (let i = 1; i < n; i++) {
            const px = g.x + (dx * i) / n;
            if (solidAt(map, px, g.y + 0.5)) {
                blocked = true;
                break;
            }
        }
        if (blocked)
            continue;
        S.hearts -= 1;
        S.caught = true;
        S.seal.x = S.spawn.x;
        S.seal.y = S.spawn.y;
        S.seal.vx = 0;
        S.seal.vy = 0;
        break;
    }
    if (S.key && !S.key.taken && Math.abs(S.seal.x - S.key.x) <= 1.0 && Math.abs(S.seal.y + 0.5 - S.key.y) <= 1.0) {
        S.key.taken = true;
        S.hasKey = true;
    }
    if (S.fish && !S.fish.taken && Math.abs(S.seal.x - S.fish.x) <= 1.0 && Math.abs(S.seal.y + 0.5 - S.fish.y) <= 1.0) {
        S.fish.taken = true;
        S.hasFish = true;
    }
    if (S.exit && S.hasKey && S.hasFish && Math.abs(S.seal.x - S.exit.x) <= 1.0 && Math.abs(S.seal.y + 0.5 - S.exit.y) <= 1.2) {
        if (S.level >= LEVELS.length - 1) {
            S.won = true;
        }
        else {
            const hearts = S.hearts;
            loadLevel(S, S.level + 1);
            S.hearts = hearts;
        }
    }
    if (S.hearts <= 0)
        S.dead = true;
}
function putSeal(S, x, y) {
    S.seal.x = x;
    S.seal.y = y;
    S.seal.vx = 0;
    S.seal.vy = 0;
}
function giveAll(S) {
    S.hasKey = true;
    S.hasFish = true;
    if (S.key)
        S.key.taken = true;
    if (S.fish)
        S.fish.taken = true;
}
function killAll(S) {
    S.hearts = 0;
    S.dead = true;
}

// --- sprites.js ---
// Task 8: загрузка картинок и таблицы кадров.
// Держим стираемый синтаксис, как в src/levels.ts, чтобы тесты могли
// запускать файл без сборки (снять аннотации и export в CJS).
const FRAMES = {
    idle: ['img/seal_idle_0.png', 'img/seal_idle_1.png'],
    waddle: [
        'img/seal_waddle_0.png',
        'img/seal_waddle_1.png',
        'img/seal_waddle_2.png',
        'img/seal_waddle_3.png',
    ],
    guard: ['img/guard_0.png', 'img/guard_1.png'],
};
const TILES = {
    floor: 'img/tile_floor.png',
    wall: 'img/tile_wall.png',
    bars: 'img/tile_bars.png',
    exit: 'img/tile_exit.png',
    fish: 'img/tile_fish.png',
    key: 'img/tile_key.png',
};
function allSources() {
    const out = [];
    const lists = [FRAMES.idle, FRAMES.waddle, FRAMES.guard];
    for (const l of lists) {
        for (const s of l) {
            if (out.indexOf(s) < 0) {
                out.push(s);
            }
        }
    }
    const keys = Object.keys(TILES);
    for (const k of keys) {
        const s = TILES[k];
        if (out.indexOf(s) < 0) {
            out.push(s);
        }
    }
    return out;
}
// Рисованный квадрат-заглушка: битая картинка не роняет игру.
function placeholder(src) {
    let img = null;
    try {
        if (typeof document !== 'undefined' && document && document.createElement) {
            const canvas = document.createElement('canvas');
            canvas.width = 32;
            canvas.height = 32;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = '#f0f';
                ctx.fillRect(0, 0, 32, 32);
            }
            img = canvas;
        }
    }
    catch (e) {
        img = null;
    }
    return { src: src, broken: true, img: img };
}
function browserLoadOne(src) {
    return new Promise(function (resolve) {
        try {
            if (typeof Image !== 'function') {
                resolve(placeholder(src));
                return;
            }
            const im = new Image();
            im.onload = function () {
                resolve({ src: src, broken: false, img: im });
            };
            im.onerror = function () {
                resolve(placeholder(src));
            };
            im.src = src;
        }
        catch (e) {
            resolve(placeholder(src));
        }
    });
}
// Ждёт все картинки; битая заменяется квадратом, промис не падает.
function loadSprites(loadOne) {
    const load = loadOne || browserLoadOne;
    const sources = allSources();
    const jobs = sources.map(function (s) {
        try {
            return load(s).then(function (p) {
                return p;
            }, function (e) {
                return placeholder(s);
            });
        }
        catch (e) {
            return Promise.resolve(placeholder(s));
        }
    });
    return Promise.all(jobs).then(function (pics) {
        const out = {};
        for (const p of pics) {
            out[p.src] = p;
        }
        return out;
    });
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

// --- save.js ---
// Рекорд: бережное чтение, запись лучшего (меньшее время).
function loadBest() {
    try {
        if (typeof localStorage === 'undefined')
            return null;
        const raw = localStorage.getItem(CFG.saveKey);
        if (raw === null)
            return null;
        const v = parseFloat(raw);
        if (!isFinite(v) || v < 0)
            return null;
        return v;
    }
    catch {
        return null;
    }
}
function saveBest(sec) {
    try {
        if (typeof localStorage === 'undefined')
            return false;
        if (!isFinite(sec) || sec < 0)
            return false;
        const cur = loadBest();
        if (cur !== null && cur <= sec)
            return false;
        localStorage.setItem(CFG.saveKey, String(sec));
        return true;
    }
    catch {
        return false;
    }
}

// --- main.js ---
const W = 960;
const H = 540;
const TILE = 60;
const OY = 30;
const canvas = document.getElementById('game');
const g = canvas.getContext('2d');
const input = { left: false, right: false, jump: false, shove: false };
let mode = 'start';
let S = newRun(0);
let pics = {};
let runTime = 0;
let animT = 0;
let facing = 1;
let prevKey = false;
let prevFish = false;
let prevLevel = 0;
let best = loadBest();
let newRecord = false;
let stepSnd = 0;
function wx(x) {
    return x * TILE;
}
function wy(y, mapH) {
    return OY + (mapH - y) * TILE;
}
function fmt(sec) {
    const m = Math.floor(sec / 60);
    const s = sec - m * 60;
    return m + ':' + (s < 10 ? '0' : '') + s.toFixed(1);
}
// Картинка или цветной квадрат, если битая/ещё грузится.
function drawImg(src, x, y, w, h, fallback, flip) {
    const p = pics[src];
    g.save();
    if (flip) {
        g.translate(x + w / 2, 0);
        g.scale(-1, 1);
        g.translate(-(x + w / 2), 0);
    }
    if (p && !p.broken && p.img) {
        try {
            g.drawImage(p.img, x, y, w, h);
        }
        catch (e) {
            g.fillStyle = fallback;
            g.fillRect(x, y, w, h);
        }
    }
    else {
        g.fillStyle = fallback;
        g.fillRect(x, y, w, h);
    }
    g.restore();
}
function startGame() {
    S = newRun(0);
    runTime = 0;
    prevKey = false;
    prevFish = false;
    prevLevel = 0;
    facing = 1;
    newRecord = false;
    stepSnd = 0;
    input.left = false;
    input.right = false;
    input.jump = false;
    input.shove = false;
    mode = 'play';
    blip('pickup');
}
function doStep() {
    step(S, input);
    runTime += CFG.step;
    if (input.right && !input.left)
        facing = 1;
    else if (input.left && !input.right)
        facing = -1;
    if ((input.left || input.right) && S.seal.onGround) {
        stepSnd += CFG.step;
        if (stepSnd > 0.28) {
            stepSnd = 0;
            blip('step');
        }
    }
    if ((S.hasKey && !prevKey) || (S.hasFish && !prevFish))
        blip('pickup');
    prevKey = S.hasKey;
    prevFish = S.hasFish;
    if (S.caught)
        blip('hit');
    if (S.level !== prevLevel) {
        prevLevel = S.level;
        blip('pickup');
    }
    if (S.won) {
        mode = 'win';
        newRecord = saveBest(runTime);
        best = loadBest();
        blip('win');
    }
    else if (S.dead) {
        mode = 'lose';
        blip('lose');
    }
}
function overlay(title, lines) {
    g.fillStyle = 'rgba(0,0,0,0.65)';
    g.fillRect(0, 0, W, H);
    g.fillStyle = '#fff';
    g.textAlign = 'center';
    g.font = 'bold 44px sans-serif';
    g.fillText(title, W / 2, 200);
    g.font = '22px sans-serif';
    for (let i = 0; i < lines.length; i++) {
        g.fillText(lines[i], W / 2, 260 + i * 34);
    }
}
function render() {
    const map = LEVELS[S.level];
    const mapH = map.length;
    g.fillStyle = '#0e2233';
    g.fillRect(0, 0, W, H);
    for (let r = 0; r < mapH; r++) {
        for (let c = 0; c < map[r].length; c++) {
            const ch = map[r][c];
            if (ch === '#')
                drawImg(TILES.wall, c * TILE, r * TILE + OY, TILE, TILE, '#5b6b7a', false);
            else if (ch === '=' || ch === '-')
                drawImg(TILES.floor, c * TILE, r * TILE + OY, TILE, TILE, '#7a5c3e', false);
        }
    }
    if (S.exit) {
        const b = wy(S.exit.y - 0.5, mapH);
        drawImg(TILES.exit, wx(S.exit.x) - 25, b - 50, 50, 50, '#3fae5a', false);
    }
    if (S.key && !S.key.taken) {
        const b = wy(S.key.y - 0.5, mapH);
        drawImg(TILES.key, wx(S.key.x) - 20, b - 40, 40, 40, '#ffd34d', false);
    }
    if (S.fish && !S.fish.taken) {
        const b = wy(S.fish.y - 0.5, mapH);
        drawImg(TILES.fish, wx(S.fish.x) - 20, b - 40, 40, 40, '#7fd4ff', false);
    }
    for (const gd of S.guards) {
        const src = FRAMES.guard[Math.floor(animT * 6) % FRAMES.guard.length];
        const b = wy(gd.y, mapH);
        if (gd.stun > 0)
            g.globalAlpha = 0.5;
        drawImg(src, wx(gd.x) - 21, b - 54, 42, 54, '#c0392b', gd.dir < 0);
        g.globalAlpha = 1;
    }
    const moving = input.left || input.right;
    const frames = moving && S.seal.onGround ? FRAMES.waddle : FRAMES.idle;
    const rate = moving && S.seal.onGround ? 8 : 2;
    const sealSrc = frames[Math.floor(animT * rate) % frames.length];
    const sb = wy(S.seal.y, mapH);
    drawImg(sealSrc, wx(S.seal.x) - 21, sb - 57, 42, 57, '#eeeeee', facing < 0);
    let hs = '';
    for (let i = 0; i < CFG.hearts; i++)
        hs += i < S.hearts ? '♥' : '♡';
    g.fillStyle = '#ff5b5b';
    g.font = '24px sans-serif';
    g.textAlign = 'left';
    g.fillText(hs, 12, 30);
    g.fillStyle = '#fff';
    g.fillText(fmt(runTime), 12, 58);
    g.textAlign = 'right';
    g.fillText('ур. ' + (S.level + 1) + '/' + LEVELS.length, W - 12, 30);
    if (best !== null)
        g.fillText('лучшее ' + fmt(best), W - 12, 58);
    if (mode === 'start') {
        const lines = ['Собери ключ и рыбу, дойди до выхода.', 'Стрелки — идти, пробел — прыжок, X — толкнуть.'];
        if (best !== null)
            lines.push('Лучшее время: ' + fmt(best));
        lines.push('Нажми или коснись, чтобы играть.');
        overlay('Побег тюленьки', lines);
    }
    else if (mode === 'win') {
        const lines = ['Время: ' + fmt(runTime)];
        lines.push(newRecord ? 'Новый рекорд!' : best !== null ? 'Лучшее: ' + fmt(best) : '');
        lines.push('Нажми или коснись, чтобы играть заново.');
        overlay('Победа!', lines);
    }
    else if (mode === 'lose') {
        overlay('Поймали!', ['Сердца кончились.', 'Нажми или коснись, чтобы попробовать заново.']);
    }
}
// Цикл по стенным часам фиксированным шагом.
let acc = 0;
let last = performance.now();
let lastFrame = last;
function frame(now) {
    const dt = (now - last) / 1000;
    last = now;
    lastFrame = now;
    animT += dt;
    if (mode === 'play') {
        acc += dt;
        const max = CFG.step * 5;
        if (acc > max)
            acc = max;
        while (acc >= CFG.step) {
            acc -= CFG.step;
            doStep();
            if (mode !== 'play') {
                acc = 0;
                break;
            }
        }
    }
    else {
        acc = 0;
    }
    render();
    requestAnimationFrame(frame);
}
// Сторож для вкладок без кадров: тот же шаг.
setInterval(function () {
    const now = performance.now();
    if (now - lastFrame > 250) {
        last = now;
        lastFrame = now;
        if (mode === 'play')
            doStep();
        render();
    }
}, 100);
function press(code, down) {
    if (code === 'ArrowLeft' || code === 'KeyA')
        input.left = down;
    else if (code === 'ArrowRight' || code === 'KeyD')
        input.right = down;
    else if (code === 'ArrowUp' || code === 'Space' || code === 'KeyW')
        input.jump = down;
    else if (code === 'KeyX' || code === 'ShiftLeft' || code === 'ShiftRight')
        input.shove = down;
}
document.addEventListener('keydown', function (e) {
    if (e.code === 'ArrowLeft' || e.code === 'ArrowRight' || e.code === 'ArrowUp' || e.code === 'Space')
        e.preventDefault();
    if (e.repeat)
        return;
    if (e.code === 'KeyR' || e.code === 'Enter') {
        startGame();
        return;
    }
    if (e.code === 'Space' && mode !== 'play') {
        startGame();
        return;
    }
    press(e.code, true);
});
document.addEventListener('keyup', function (e) {
    press(e.code, false);
});
function bindBtn(id, key) {
    const el = document.getElementById(id);
    const on = function (e) {
        e.preventDefault();
        if (mode !== 'play')
            startGame();
        press(key, true);
    };
    const off = function (e) {
        e.preventDefault();
        press(key, false);
    };
    el.addEventListener('pointerdown', on);
    el.addEventListener('pointerup', off);
    el.addEventListener('pointerleave', off);
    el.addEventListener('pointercancel', off);
}
bindBtn('btn-left', 'ArrowLeft');
bindBtn('btn-right', 'ArrowRight');
bindBtn('btn-jump', 'Space');
bindBtn('btn-shove', 'KeyX');
canvas.addEventListener('pointerdown', function () {
    if (mode !== 'play')
        startGame();
});
canvas.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});
loadSprites(undefined).then(function (m) {
    pics = m;
});
requestAnimationFrame(frame);
