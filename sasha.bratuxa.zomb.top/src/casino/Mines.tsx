import { useMemo, useState } from 'react';
import { Log, parseStake, type Api } from './shared';
import Bunker from './mines/Bunker';
import Field from './mines/Field';
import MHistory, { loadMHist, saveMHist, type MEntry } from './mines/History';
import {
  CELLS, DEFAULT_BET, DEFAULT_MINES, MIN_STAKE,
  cashout, placeMines, stepMult, validateMines,
} from './mines/data';
import { boomBlast, bunkerDoor, cashPing, gemPing, tileTap } from './mines/jingle';
import { ItemIcon } from '../casino-icons';
import './mines.css';
import './mines/bunker.css';
import './mines/field.css';
import './mines/mhist.css';

/* ЗАЛ «МИНЫ» — сапёрный полигон. Оркестрация: бункер → поле → вахта.
   Правила святы: поле 5×5, шаг mmult×closed/safe×0.97, вывод floor в любой момент. */

export default function Mines({ api }: { api: Api }): JSX.Element {
  const [mbet, setMbet] = useState(DEFAULT_BET);
  const [mmines, setMmines] = useState(DEFAULT_MINES);
  const [mfield, setMfield] = useState<boolean[] | null>(null);
  const [mopen, setMopen] = useState<boolean[]>(Array(CELLS).fill(false));
  const [mmult, setMmult] = useState(1);
  const [mdead, setMdead] = useState(false);
  const [blast, setBlast] = useState(-1);
  const [stake, setStake] = useState(0);
  const [hist, setHist] = useState<MEntry[]>(() => loadMHist());
  const [seq, setSeq] = useState(() => Date.now());

  useMemo(() => {
    const bad = validateMines();
    if (bad.length > 0) console.error('[mines] святыня нарушена:', bad.join('; '));
  }, []);

  const opened = mopen.filter(Boolean).length;
  const live = !!mfield && !mdead;

  const pushHist = (e: Omit<MEntry, 'id' | 't'>): void => {
    setHist(prev => {
      const next = [{ ...e, id: seq, t: Date.now() }, ...prev].slice(0, 30);
      saveMHist(next);
      return next;
    });
    setSeq(s => s + 1);
  };

  const start = (): void => {
    if (mfield && !mdead) return;
    const s = parseStake(mbet, MIN_STAKE, api);
    if (s === null) return;
    bunkerDoor();
    setStake(s);
    setMfield(placeMines(mmines));
    setMopen(Array(CELLS).fill(false));
    setMmult(1);
    setMdead(false);
    setBlast(-1);
    api.say(`Поле 5×5, мин: ${mmines}. Открывай клетки, «Забрать» — в любой момент`);
  };

  const openCell = (i: number): void => {
    if (!mfield || mdead || mopen[i]) return;
    tileTap();
    if (mfield[i]) {
      setMopen(mfield.map(() => true));
      setMdead(true);
      setBlast(i);
      if (!api.reduced) boomBlast();
      api.say('Мина! Ставка сгорела.', 'lose');
      pushHist({ mines: mmines, stake, opened, ret: 0, profit: -stake, mult: mmult });
      return;
    }
    const nm = stepMult(mmult, opened, mmines);
    const no = [...mopen];
    no[i] = true;
    setMopen(no);
    setMmult(nm);
    if (!api.reduced) gemPing(nm);
    api.say(`Чисто! Множитель ×${nm.toFixed(2)} — забирай или рискуй.`);
  };

  const cash = (): void => {
    if (!mfield || mdead) return;
    if (opened === 0) { api.say('Открой хоть одну клетку'); return; }
    const win = cashout(stake, mmult);
    api.credit(win);
    setMfield(null);
    cashPing();
    api.say(`Мины: ×${mmult.toFixed(2)}, +${win}!`, 'win');
    pushHist({ mines: mmines, stake, opened, ret: win, profit: win - stake, mult: mmult });
  };

  return (
    <section className="mines-hall">
      <Log msg={api.msg} tone={api.tone} />
      <div className="mn-grid">
        <Bunker mbet={mbet} mmines={mmines} live={live} dead={mdead}
          mult={mmult} opened={opened} stake={stake}
          onBet={setMbet} onMines={setMmines} onStart={start} onCash={cash} />
        <Field field={mfield} open={mopen} dead={mdead} blast={blast} glow={mmult} onOpen={openCell} />
      </div>
      {live && (
        <div className="kitline"><ItemIcon name="jackpot" /> Сапёр идёт: {opened} чисто, мины ждут.</div>
      )}
      <MHistory entries={hist} onClear={() => { setHist([]); saveMHist([]); }} />
    </section>
  );
}
