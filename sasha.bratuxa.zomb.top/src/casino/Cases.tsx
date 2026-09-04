import { useState } from 'react';
import gsap from 'gsap';
import { Api, Log, Num } from './shared';
import { ItemIcon } from '../casino-icons';
import { Button } from '@/components/ui/button';
import './cases.css';

/* ЗАЛ «КЕЙСЫ» — арсенал батальона. Три сейфа, лента-тикет, пьедестал.
   Правила святы: цены, дропы, веса и шансы не менялись. */

type Drop = { icon: string; label: string; amount: number; w: number };
type CaseDef = { id: string; icon: string; name: string; price: number; desc: string; drops: Drop[] };

const CASES: CaseDef[] = [
  { id: 'barracks', icon: 'barracks', name: 'Казарма', price: 100, desc: 'Скромно, но со вкусом',
    drops: [
      { icon: 'hardhat', label: 'Каска', amount: 50, w: 35 },
      { icon: 'boots', label: 'Берцы', amount: 80, w: 30 },
      { icon: 'medal', label: 'Медалька', amount: 120, w: 20 },
      { icon: 'flame', label: 'Запал', amount: 200, w: 11 },
      { icon: 'coins', label: 'Касса части', amount: 500, w: 4 },
    ] },
  { id: 'arsenal', icon: 'arsenal', name: 'Арсенал', price: 300, desc: 'Для тех, кто в теме',
    drops: [
      { icon: 'glock', label: 'Глок', amount: 150, w: 32 },
      { icon: 'vest', label: 'Броник', amount: 250, w: 28 },
      { icon: 'truck', label: 'Урал', amount: 400, w: 22 },
      { icon: 'rocket', label: 'Ракета', amount: 700, w: 13 },
      { icon: 'crown', label: 'Звезда генерала', amount: 1500, w: 5 },
    ] },
  { id: 'hq42', icon: 'hq42', name: 'Штаб 42', price: 1000, desc: 'Олл-ин по-батальонному',
    drops: [
      { icon: 'radio', label: 'Рация', amount: 500, w: 30 },
      { icon: 'map', label: 'Карта', amount: 800, w: 27 },
      { icon: 'anchor', label: 'Якорь Авроры', amount: 1200, w: 23 },
      { icon: 'eagle', label: 'Орёл', amount: 2500, w: 14 },
      { icon: 'jackpot', label: 'Джекпот 42', amount: 10000, w: 6 },
    ] },
];

function pickDrop(drops: Drop[]): Drop {
  const total = drops.reduce((s, d) => s + d.w, 0);
  let x = Math.random() * total;
  for (const d of drops) { x -= d.w; if (x < 0) return d; }
  return drops[drops.length - 1];
}

export default function Cases({ api }: { api: Api }): JSX.Element {
  const [busy, setBusy] = useState(false);
  const [sel, setSel] = useState<CaseDef>(CASES[0]);
  const [cells, setCells] = useState<Drop[] | null>(null);
  const [win, setWin] = useState<Drop | null>(null);

  const open = (c: CaseDef): void => {
    if (busy) return;
    if (api.balance < c.price) { api.say(`На «${c.name}» не хватает: надо ${c.price}`); return; }
    if (!api.spend(c.price)) return;
    setBusy(true); setWin(null);
    const w = pickDrop(c.drops);
    const lane: Drop[] = Array.from({ length: 30 }, () => pickDrop(c.drops));
    lane[24] = w;
    setCells(lane);
    const strip = document.getElementById('strip');
    if (strip) {
      requestAnimationFrame(() => gsap.set(strip, { x: 0 }));
      gsap.fromTo(strip, { x: 0 }, {
        x: -(24 * 94 - 60), duration: api.reduced ? 0.3 : 3.2, ease: 'power3.out',
        onComplete: () => {
          api.credit(w.amount);
          setWin(w);
          api.say(w.amount >= c.price
            ? `${w.label}: +${w.amount}! Кейс окупился`
            : `${w.label}: +${w.amount}. Бывает`,
            w.amount >= c.price ? 'win' : '');
          setBusy(false);
        },
      });
    } else {
      api.credit(w.amount);
      setWin(w);
      api.say(`${w.label}: +${w.amount}`);
      setBusy(false);
    }
  };

  return (
    <section className="cases-hall">
      <header className="ch-head">
        <div>
          <h2>Кейсы</h2>
          <p>Платишь за сейф — лента крутится, что выпало, то твоё. Шансы написаны честно.</p>
        </div>
      </header>
      <Log msg={api.msg} tone={api.tone} />
      <div className="vaults">
        {CASES.map(c => {
          const total = c.drops.reduce((s, d) => s + d.w, 0);
          return (
            <article key={c.id} className={`vault${sel.id === c.id ? ' sel' : ''}`} onClick={() => !busy && setSel(c)}>
              <span className="v-art"><ItemIcon name={c.icon} /></span>
              <b>{c.name}</b>
              <small>{c.desc}</small>
              <ul className="v-drops">
                {c.drops.map(d => (
                  <li key={d.label} title={`${d.label} — шанс ${Math.round((d.w / total) * 100)}%`}>
                    <ItemIcon name={d.icon} /><span><Num>{d.amount}</Num></span>
                  </li>
                ))}
              </ul>
              <div className="v-buy">
                <span className="cprice"><Num>{c.price}</Num> фишек</span>
                <Button size="sm" disabled={busy} onClick={e => { e.stopPropagation(); setSel(c); open(c); }}>
                  {busy && sel.id === c.id ? 'Крутится…' : 'Открыть'}
                </Button>
              </div>
            </article>
          );
        })}
      </div>
      <div id="stripWrap" className={cells ? 'open' : ''}>
        <div className="ticket-edge" />
        <div id="strip">
          {cells?.map((d, i) => (
            <div className={`cell${i === 24 ? ' hit' : ''}`} key={i}>
              <span className="e"><ItemIcon name={d.icon} /></span><Num>{d.amount}</Num>
            </div>
          ))}
        </div>
        <div className="ticket-edge" />
        <span className="needle" />
      </div>
      {win && (
        <div className="pedestal">
          <span className="p-art"><ItemIcon name={win.icon} /></span>
          <div><b>{win.label}</b><span className="p-amount">+<Num>{win.amount}</Num> фишек</span></div>
        </div>
      )}
    </section>
  );
}
