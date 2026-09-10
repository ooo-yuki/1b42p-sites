import { useEffect, useRef, useState } from 'react';
import { House } from 'lucide-react';
import { useBeacon } from './hooks';
import { NODE_IDS, getNode } from './terminal/content';
import { execCommand, freshState, type TermState } from './terminal/engine';
import GameTop from './lib/GameTop';
import AccountBar from './lib/AccountBar';
import Ads from './lib/Ads';

/* Терминал 42: чёрная консоль связиста. Промпт, история, ↑↓, таб-дополнение. */

const SAVE_KEY = 'sasha_term42_v1';
const COMMANDS = ['help', 'scan', 'connect', 'ls', 'read', 'decrypt', 'inject', 'whoami', 'clear'];

interface Row {
  kind: 'in' | 'out' | 'sys' | 'alarm';
  text: string;
}

const BOOT: Row[] = [
  { kind: 'sys', text: 'БАТАЛЬОН 1Б42П — ТЕРМИНАЛ СВЯЗИСТА v4.2' },
  { kind: 'sys', text: 'канал защищён. БРОТОВОД-Х глушит эфир. help — команды.' },
  { kind: 'out', text: '' },
];

function loadState(): TermState {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return freshState();
    const p = JSON.parse(raw) as Partial<TermState>;
    const s = freshState();
    if (typeof p.node === 'string' && getNode(p.node)) s.node = p.node;
    if (Array.isArray(p.decrypted)) s.decrypted = p.decrypted.filter((x) => typeof x === 'string');
    if (Array.isArray(p.injected)) s.injected = p.injected.filter((x) => typeof x === 'string');
    s.won = p.won === true;
    return s;
  } catch {
    return freshState();
  }
}

function tone(line: string): Row['kind'] {
  const l = line.toUpperCase();
  if (/ЗАКРЫТ|НЕВЕРНЫЙ|ЗАПРЕЩЁН|НЕТ ТАКО|НЕИЗВЕСТНАЯ|ШИФР/.test(l)) return 'alarm';
  if (/ОТКРЫТ|ВСКРЫТ|ПОЛУЧЕН|ПОДКЛЮЧЕНО|ФЛАГ|ПОБЕДИЛИ|ФРАГМЕНТ/.test(l)) return 'sys';
  return 'out';
}

export default function Terminal(): JSX.Element {
  useBeacon();
  const [state, setState] = useState<TermState>(loadState);
  const [rows, setRows] = useState<Row[]>(BOOT);
  const [value, setValue] = useState('');
  const [hist, setHist] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    try {
      const s = stateRef.current;
      localStorage.setItem(SAVE_KEY, JSON.stringify({ node: s.node, decrypted: s.decrypted, injected: s.injected, won: s.won }));
    } catch {
      /* терминал терпит */
    }
  }, [state]);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight });
  }, [rows]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = (raw: string) => {
    const cmd = raw.trim();
    const prompt = `bratuxa@42:${stateRef.current.node}$ ${cmd}`;
    if (cmd === '') {
      setRows((r) => [...r, { kind: 'in', text: prompt }]);
      return;
    }
    const out = execCommand(stateRef.current, cmd);
    setState(out.state);
    setHist((h) => [...h, cmd]);
    setHi(-1);
    const next: Row[] = [{ kind: 'in', text: prompt }];
    if (out.clear) {
      setRows(next);
      return;
    }
    for (const l of out.lines) next.push({ kind: tone(l), text: l === '' ? ' ' : l });
    setRows((r) => [...r, ...next]);
  };

  const complete = () => {
    const parts = value.split(/\s+/);
    if (parts.length <= 1) {
      const hit = COMMANDS.filter((c) => c.startsWith(parts[0].toLowerCase()));
      if (hit.length === 1) setValue(hit[0] + ' ');
      return;
    }
    const last = parts[parts.length - 1];
    const pool = [...NODE_IDS, ...Object.keys(getNode(state.node)?.files ?? {})];
    const hit = pool.filter((p) => p.toLowerCase().startsWith(last.toLowerCase()));
    if (hit.length === 1) {
      parts[parts.length - 1] = hit[0];
      setValue(parts.join(' ') + (parts[0].toLowerCase() === 'connect' ? '' : ' '));
    }
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submit(value);
      setValue('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (hist.length === 0) return;
      const ni = hi < 0 ? hist.length - 1 : Math.max(0, hi - 1);
      setHi(ni);
      setValue(hist[ni]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (hi < 0) return;
      const ni = hi + 1;
      if (ni >= hist.length) {
        setHi(-1);
        setValue('');
      } else {
        setHi(ni);
        setValue(hist[ni]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      complete();
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setRows([]);
    }
  };

  return (
    <main id="term-wrap">
      <AccountBar />
      <GameTop game="terminal" />
      <div id="term" ref={boxRef} onClick={() => inputRef.current?.focus()} role="log" aria-label="Терминал 42">
        {rows.map((r, i) => (
          <div key={i} className={`trow ${r.kind}`}>
            {r.text}
          </div>
        ))}
        <div className="tline">
          <span className="tprompt">bratuxa@42:{state.node}$</span>
          <input
            ref={inputRef}
            id="term-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKey}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label="Команда терминала"
          />
        </div>
      </div>
      <a id="termHome" className="pill ghost" href="minigames.html" style={{ textDecoration: 'none' }}>
        <House data-icon="inline-start" /> В зал автоматов
      </a>
      <Ads />
    </main>
  );
}
