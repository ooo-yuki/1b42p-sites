/* Движок терминала 42: чистая функция команда → строки + состояние. */
import { getNode, NODE_IDS } from './content';

export interface TermState {
  node: string;
  decrypted: string[];
  injected: string[];
  won: boolean;
}

export interface TermOut {
  lines: string[];
  state: TermState;
  clear?: boolean;
}

export function freshState(): TermState {
  return { node: 'gate', decrypted: [], injected: [], won: false };
}

function isOpen(state: TermState, id: string): boolean {
  const n = getNode(id);
  if (!n) return false;
  if (!n.lockedBy) return true;
  return state.decrypted.includes(n.lockedBy);
}

export function execCommand(prev: TermState, raw: string): TermOut {
  const state: TermState = { ...prev, decrypted: [...prev.decrypted], injected: [...prev.injected] };
  const parts = raw.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return { lines: [], state };
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);
  const say = (lines: string[]): TermOut => ({ lines, state });

  if (cmd === 'clear') return { lines: [], state, clear: true };
  if (cmd === 'help') {
    return say([
      'КОМАНДЫ СВЯЗИСТА:',
      '  scan              — показать узлы сети',
      '  connect <узел>    — перейти на узел',
      '  ls                — файлы текущего узла',
      '  read <файл>       — прочитать лог',
      '  decrypt <файл> <ключ> — вскрыть шифр',
      '  inject <узел>     — открыть порт узла',
      '  whoami | clear',
    ]);
  }
  if (cmd === 'whoami') return say(['bratuxa — связист 1Б42П. Допуск: 42.']);
  if (cmd === 'scan') {
    return say([
      'СЕТЬ:',
      ...NODE_IDS.map((id) => {
        const n = getNode(id)!;
        const mark = id === state.node ? '*' : ' ';
        const lock = isOpen(state, id) ? 'open' : 'LOCKED';
        return ` ${mark} ${id} — ${n.name} [${lock}]`;
      }),
    ]);
  }
  if (cmd === 'ls') {
    const n = getNode(state.node)!;
    const names = Object.keys(n.files);
    return say(names.length > 0 ? names : ['(пусто)']);
  }
  if (cmd === 'connect') {
    const id = (args[0] ?? '').toLowerCase();
    const n = getNode(id);
    if (!n) return say([`нет такого узла: ${args[0] ?? ''}. scan покажет сеть.`]);
    if (!isOpen(state, id)) {
      const need = n.lockedBy ?? '';
      return say([`узел ${id} закрыт. Сначала вскрой ${need}.`]);
    }
    state.node = id;
    return say([`подключено: ${n.name}.`, 'ls — осмотреться.']);
  }
  if (cmd === 'read') {
    const name = args[0] ?? '';
    const n = getNode(state.node)!;
    const f = n.files[name];
    if (!f) return say([`нет такого файла: ${name}. ls покажет файлы.`]);
    if (f.kind === 'enc' && !state.decrypted.includes(name)) {
      return say([`${name}: ШИФР. read не берёт — нужен decrypt <файл> <ключ>.`]);
    }
    return say([...f.text]);
  }
  if (cmd === 'decrypt') {
    const name = args[0] ?? '';
    const key = args.slice(1).join(' ').toUpperCase();
    const n = getNode(state.node)!;
    const f = n.files[name];
    if (!f) return say([`нет такого файла: ${name}.`]);
    if (f.kind !== 'enc') return say([`${name} не шифрован — просто read.`]);
    if (state.decrypted.includes(name)) return say([`${name} уже вскрыт. Читай read.`]);
    if (f.needsInject && !state.injected.includes(state.node)) {
      return say([`${name}: порт закрыт. Сначала inject ${state.node}.`]);
    }
    if (key !== f.key.toUpperCase()) {
      return say([`${name}: неверный ключ. Доступ запрещён.`]);
    }
    state.decrypted.push(name);
    const extra: string[] = [];
    if (f.unlocks) extra.push(`УЗЕЛ ОТКРЫТ: ${f.unlocks}.`);
    if (f.gives) extra.push(`ФРАГМЕНТ: ${f.gives}.`);
    const out = [...f.text, ...extra];
    if (name === 'root.enc') {
      state.won = true;
      out.push('', 'ЗАГОВОР РАСПУТАН. Мы уже победили.');
    }
    return say(out);
  }
  if (cmd === 'inject') {
    const id = (args[0] ?? '').toLowerCase();
    if (!getNode(id)) return say([`нет такого узла: ${args[0] ?? ''}.`]);
    if (!state.injected.includes(id)) state.injected.push(id);
    return say([`порт ${id} открыт. Теперь decrypt берёт.`]);
  }
  return say([`неизвестная команда: ${parts[0]}. help покажет команды.`]);
}
