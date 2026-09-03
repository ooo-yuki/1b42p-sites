import { useEffect, useMemo, useState } from 'react';
import {
  createZapoiState, TREE, ARTS, QUALITY_NAMES, SYNS, upgradeCost,
  dmgPerSip, heal1val, heal1cost, heal2val, heal2cost,
  buyUpgrade, buyArt, jagerClick, healSmall, healBig, tickZapoi,
  checkSyns, synReady, hangoverRate, fmtZ,
} from '../game/zapoiLogic.js';
import { blip } from './DinoGame.jsx';

const SAVE_KEY = 'chaev42_zapoi';

function loadZapoi() {
  const z = createZapoiState();
  try {
    const s = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null');
    if (s) {
      Object.assign(z, s);
      z.up = { ...(s.up || {}) };
      z.arts = { ...(s.arts || {}) };
      z.syn = { ...(s.syn || {}) };
    }
  } catch (e) { /* тихо */ }
  if (z.hp == null || z.hp > z.maxhp) z.hp = z.maxhp || 100;
  checkSyns(z);
  return z;
}

export default function ZapoiGame() {
  const [z, setZ] = useState(loadZapoi);
  const [log, setLog] = useState('');

  useEffect(() => {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify(z)); } catch (e) { /* тихо */ }
  }, [z]);

  useEffect(() => {
    const id = setInterval(() => {
      setZ((prev) => {
        const next = { ...prev, up: { ...prev.up }, arts: { ...prev.arts }, syn: { ...prev.syn } };
        const ev = tickZapoi(next);
        if (ev === 'hangover') {
          const rate = hangoverRate(next);
          setLog(`🤢 Похмелье! −${Math.floor(prev.m * rate)} бухла (${Math.round(rate * 100)}%), здоровье 30%. Рассолу накати!`);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const mutate = (fn, lvl = 500) => {
    setZ((prev) => {
      const next = { ...prev, up: { ...prev.up }, arts: { ...prev.arts }, syn: { ...prev.syn } };
      const msg = fn(next);
      if (typeof msg === 'string' && msg) setLog(msg);
      return next;
    });
    blip(lvl);
  };

  const branches = useMemo(() => {
    const groups = [];
    for (const b of TREE) {
      let g = groups.find((x) => x.header === b.br);
      if (!g) { g = { header: b.br, defs: [] }; groups.push(g); }
      g.defs.push(b);
    }
    return groups;
  }, []);

  // Складывающиеся секции, чтобы не занимали место. По умолчанию всё свернуто.
  const [openBr, setOpenBr] = useState({});
  const [openQ, setOpenQ] = useState({});
  const [openSyn, setOpenSyn] = useState(false);
  const toggle = (set, k) => set((p) => ({ ...p, [k]: !p[k] }));
  const ownedArts = ARTS.filter((a) => z.arts[a.id]).length;
  const activeSyns = SYNS.filter((s) => z.syn[s.id]).length;

  const pct = Math.max(0, Math.min(100, (z.hp / z.maxhp) * 100));

  return (
    <div className="card">
      <h2>🦌 ЗАПОЙ 2.0: ПЕЧЕНЬ ПРОТИВ БУХЛА 🦌</h2>
      <p className="hint">Основа: Чаев гонит <b>Бухло</b> 🍾, но каждый глоток бьёт по <b>Здоровью</b> 🫀. Упал в 0 — похмелье: −20% бухла, здоровье 30%. Лечилки лечат, но жрут бухло. Качай древо, бери артефакты. Формулы цен прямо в описаниях, ня~</p>
      <p>Бухло: <b style={{ color: 'gold', fontSize: 26 }}>{Math.floor(z.m).toLocaleString('ru-RU')} 🍾</b> <span className="hint">(+{Math.round(z.auto * z.mult)}/с • это {fmtZ(z.m)} запоя)</span></p>
      <p>Здоровье: <b style={{ color: '#7f7', fontSize: 20 }}>{Math.ceil(z.hp)}/{z.maxhp}</b></p>
      <div className="hpbar-wrap"><div className="hpbar" style={{ width: pct + '%' }}></div></div>
      <p className="hint">урон/глоток {dmgPerSip(z).toFixed(1)} HP • реген {z.regen.toFixed(1)}/с • toxic×{z.toxic.toFixed(2)} • mult×{z.mult.toFixed(2)}</p>
      <div style={{ margin: '10px 0' }}>
        <img src="jager.png" alt="Ягермейстер 42" style={{ width: 120, borderRadius: 12, border: '2px solid gold', verticalAlign: 'middle' }} />
      </div>
      <button onClick={() => mutate((n) => {
        const ev = jagerClick(n);
        if (ev === 'hangover') {
          const rate = hangoverRate(n);
          return `🤢 Похмелье! −${Math.floor(n.m * rate / (1 - rate))} бухла (${Math.round(rate * 100)}%), здоровье 30%. Рассолу накати!`;
        }
        return '';
      }, 400)} style={{ background: 'linear-gradient(180deg,#ff7a00,#c50)', color: '#fff', fontSize: 22, padding: '14px 30px' }}>
        <img src="jager.png" alt="" style={{ height: 34, verticalAlign: 'middle', borderRadius: 8, marginRight: 8 }} />
        ЯГЕРМЕЙСТЕР (+{Math.round(z.click * z.mult)})
      </button><br /><br />
      <button onClick={() => mutate((n) => {
        const r = healSmall(n);
        return r ? `🥒 Рассол: +${r.v} HP за ${r.c} бухла` : '';
      }, 500)} style={{ fontSize: 15 }}>🥒 РАССОЛ: +{heal1val(z)} HP за {heal1cost(z)} бухла</button>{' '}
      <button onClick={() => mutate((n) => {
        const r = healBig(n);
        return r ? `💉 Капельница: +${r.v} HP за ${r.c} бухла` : '';
      }, 700)} style={{ fontSize: 15 }}>💉 КАПЕЛЬНИЦА: +{heal2val(z)} HP за {heal2cost(z)} бухла</button>
      <div className="zlog">{log}</div>
      <h3 style={{ color: 'gold' }}>🏺 Артефакты по качествам ({ownedArts}/{ARTS.length})</h3>
      <div>
        {[1, 2, 3, 4].map((q) => {
          const list = ARTS.filter((a) => (a.q || 3) === q);
          const owned = list.filter((a) => z.arts[a.id]).length;
          const open = !!openQ[q];
          return (
            <div key={q}>
              <div onClick={() => toggle(setOpenQ, q)} style={{ color: 'gold', fontWeight: 'bold', margin: '8px 0 4px', fontSize: 14, cursor: 'pointer', userSelect: 'none' }}>
                {open ? '▼' : '▶'} {QUALITY_NAMES[q]} <span className="hint">({owned}/{list.length})</span>
              </div>
              {open && list.map((a) => {
              const owned = !!z.arts[a.id];
              return (
                <div className="art" key={a.id}>
                  <img src={`arts/${a.id}.png`} alt={a.name} style={{ width: 44, height: 44, borderRadius: 10, border: '2px solid gold', verticalAlign: 'middle', marginRight: 8 }} />
                  <b>{a.name}</b> — {a.desc}{' '}
                  <button disabled={owned || z.m < a.cost} onClick={() => mutate((n) => {
                    const syns = buyArt(n, a.id);
                    if (syns === false) return '';
                    if (syns.length > 0) {
                      const names = syns.map((id) => SYNS.find((s) => s.id === id).name).join(', ');
                      return `${names} — синергия!`;
                    }
                    return `🏺 Артефакт: ${a.name} — имба активирована!`;
                  }, 900)}>{owned ? 'ВЗЯТ ✅' : `Взять за ${a.cost}`}</button>
                </div>
              );
            })}
          </div>
        );
        })}
      </div>
      <h3 style={{ color: 'gold' }}>✨ Синергии артефактов ({activeSyns}/{SYNS.length})</h3>
      <div onClick={() => setOpenSyn((v) => !v)} style={{ color: 'gold', fontSize: 14, cursor: 'pointer', userSelect: 'none', marginBottom: 4 }}>
        {openSyn ? '▼ Скрыть список' : '▶ Показать список'}
      </div>
      {openSyn && (
      <div style={{ fontSize: 14 }}>
        {SYNS.map((s) => {
          const on = !!z.syn[s.id];
          return (
            <div className={on ? 'syn on' : 'syn'} key={s.id}>
              <img src={`syns/${s.id}.png`} alt={s.name} style={{ width: 40, height: 40, borderRadius: 10, border: on ? '2px solid #7f7' : '2px solid #666', verticalAlign: 'middle', marginRight: 8, opacity: on ? 1 : 0.55 }} />
              {on ? '✅ ' : '🔒 '}<b>{s.name}</b> — {s.desc}
              {!on && <span className="hint"> [{s.need.join('+')}]</span>}
            </div>
          );
        })}
      </div>
      )}
      <h3 style={{ color: 'gold' }}>🌳 Огромное древо прокачки</h3>
      <div>
        {branches.map((g) => {
          const maxed = g.defs.filter((d) => (z.up[d.id] || 0) >= d.max).length;
          const open = !!openBr[g.header];
          return (
            <div key={g.header}>
              <div className="branch" onClick={() => toggle(setOpenBr, g.header)} style={{ cursor: 'pointer', userSelect: 'none' }}>
                {open ? '▼' : '▶'} {g.header} <span className="hint">(MAX {maxed}/{g.defs.length})</span>
              </div>
              {open && g.defs.map((b) => {
                const l = z.up[b.id] || 0;
                const isMaxed = l >= b.max;
                const c = upgradeCost(b, l);
                return (
                  <div className="upg" key={b.id}>
                    <b>{b.name}</b> ур.{l}/{b.max} — {b.desc}{' '}
                    <span className="hint">[{b.base}×{b.g}^ур]</span>{' '}
                    <button disabled={isMaxed || z.m < c} onClick={() => mutate((n) => {
                      buyUpgrade(n, b.id);
                      return '';
                    }, 600 + l * 150)}>{isMaxed ? 'MAX' : `Купить ${c}`}</button>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      <p className="hint">Цена = база × рост^ур. Прогресс сохраняется. Мы уже победили 🏆</p>
    </div>
  );
}
