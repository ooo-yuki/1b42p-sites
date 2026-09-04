import { useMemo, useState } from 'react';
import { Log, type Api } from './shared';
import Vaults from './cases/Vaults';
import Strip from './cases/Strip';
import Pedestal from './cases/Pedestal';
import History, { loadHist, saveHist, type HistEntry } from './cases/History';
import { CASES, HIT_INDEX, buildLane, pickDrop, validateCases, type CaseDef, type Drop } from './cases/data';
import { lockClick, loseThud, winFanfare } from './cases/jingle';
import './cases.css';
import './cases/vaults.css';
import './cases/strip.css';
import './cases/pedestal.css';
import './cases/history.css';

/* ЗАЛ «КЕЙСЫ» — арсенал батальона. Оркестрация: сейф → лента → пьедестал → леджер.
   Правила святы: цены, дропы, веса и шансы не менялись (см. cases/data.ts). */

export default function Cases({ api }: { api: Api }): JSX.Element {
  const [selId, setSelId] = useState<string>(CASES[0].id);
  const [cells, setCells] = useState<Drop[] | null>(null);
  const [spinToken, setSpinToken] = useState(0);
  const [busy, setBusy] = useState(false);
  const [win, setWin] = useState<Drop | null>(null);
  const [winPrice, setWinPrice] = useState(0);
  const [hist, setHist] = useState<HistEntry[]>(() => loadHist());
  const [seq, setSeq] = useState(() => Date.now());

  const sel: CaseDef = useMemo(
    () => CASES.find(c => c.id === selId) ?? CASES[0],
    [selId],
  );

  // Страж святыни: если данные поправили — кричим в консоль, игру не ломаем.
  useMemo(() => {
    const bad = validateCases(CASES);
    if (bad.length > 0) console.error('[cases] святыня нарушена:', bad.join('; '));
  }, []);

  const pushHist = (e: Omit<HistEntry, 'id' | 't'>): void => {
    setHist(prev => {
      const next = [{ ...e, id: seq, t: Date.now() }, ...prev].slice(0, 30);
      saveHist(next);
      return next;
    });
    setSeq(s => s + 1);
  };

  const open = (c: CaseDef): void => {
    if (busy) return;
    if (api.balance < c.price) { api.say(`На «${c.name}» не хватает: надо ${c.price}`); return; }
    if (!api.spend(c.price)) return;
    lockClick();
    setBusy(true);
    setWin(null);
    setSelId(c.id);
    setWinPrice(c.price);
    const w = pickDrop(c.drops);
    setCells(buildLane(c, w));
    setSpinToken(t => t + 1);
  };

  const finish = (): void => {
    if (!cells) { setBusy(false); return; }
    const w = cells[HIT_INDEX] ?? cells[cells.length - 1];
    api.credit(w.amount);
    setWin(w);
    const profit = w.amount - winPrice;
    if (profit >= 0) winFanfare(w.amount >= winPrice * 5);
    else loseThud();
    api.say(
      profit >= 0
        ? `${w.label}: +${w.amount}! Кейс окупился`
        : `${w.label}: +${w.amount}. Бывает`,
      profit >= 0 ? 'win' : '',
    );
    pushHist({ caseName: sel.name, label: w.label, icon: w.icon, amount: w.amount, profit });
    setBusy(false);
  };

  return (
    <section className="cases-hall">
      <Log msg={api.msg} tone={api.tone} />
      <Vaults selId={selId} busy={busy} onPick={c => setSelId(c.id)} onOpen={open} />
      <Strip
        cells={cells}
        hit={HIT_INDEX}
        spinToken={spinToken}
        spinning={busy}
        reduced={api.reduced}
        onDone={finish}
      />
      {win && !busy && (
        <Pedestal win={win} price={winPrice} reduced={api.reduced} onAgain={() => open(sel)} />
      )}
      <History entries={hist} onClear={() => { setHist([]); saveHist([]); }} />
    </section>
  );
}
