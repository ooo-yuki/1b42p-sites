const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');

function readTS(rel) {
  return fs.readFileSync(path.join(__dirname, rel), 'utf8');
}

function strip(src) {
  return src
    .replace(/^import .*$/gm, '')
    .replace(/export interface \w+ \{[^}]*\}/gs, '')
    .replace(/: TalkLine\[\]/g, '')
    .replace(/: TalkLine/g, '')
    .replace(/: TalkState/g, '')
    .replace(/:\s*(string|number|boolean|void)(\s*[\)\,=;{])/g, '$2')
    .replace(/export function /g, 'function ')
    .replace(/export const /g, 'const ');
}

let tk = strip(readTS('../src/talk.ts'));

const js = tk + "\nmodule.exports = { talkFor, say, FACE };\n";
const m = new Module('talk', module);
m._compile(js, path.join(__dirname, '..', 'src', 'talk.js'));
const { talkFor, say, FACE } = m.exports;

// Ядро из брифа: нить не пуста, сказанное ставит флаг
const s = { flags: {} };
assert.ok(talkFor(s).length > 0);
say(s, 'm1');
assert.equal(s.flags.m1, true);

// Три узла дня идут порядком: утро, обед, вечер
{
  const t = { flags: {} };
  const ids = talkFor(t).map((l) => l.id);
  assert.ok(ids.indexOf('m1') < ids.indexOf('n1'));
  assert.ok(ids.indexOf('n1') < ids.indexOf('e1'));
}

// Сказанный узел уходит из выдачи
{
  const t = { flags: {} };
  say(t, 'm1');
  assert.ok(!talkFor(t).some((l) => l.id === 'm1'));
}

// Концов две: крыша закрыта без спуска, ворота без кляпа
{
  const t = { flags: {} };
  assert.ok(!talkFor(t).some((l) => l.id === 'roof'));
  assert.ok(!talkFor(t).some((l) => l.id === 'gate'));
  say(t, 'descent');
  assert.ok(talkFor(t).some((l) => l.id === 'roof'));
  say(t, 'gag');
  assert.ok(talkFor(t).some((l) => l.id === 'gate'));
}

// У каждой строки есть лицо духа
{
  const t = { flags: { descent: true, gag: true } };
  for (const l of talkFor(t)) {
    assert.ok(l.face === FACE);
  }
}

console.log('talk ok');
