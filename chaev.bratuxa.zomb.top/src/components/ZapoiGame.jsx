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
    const out = [];
    let last = '';
    for (const b of TREE) {
      if (b.br !== last) { last = b.br; out.push({ header: last }); }
      out.push({ def: b });
    }
    return out;
  }, []);

  const pct = Math.max(0, Math.min(100, (z.hp / z.maxhp) * 100));

  return (
    <div className="card">
      <h2>🦌 ЗАПОЙ 2.0: ПЕЧЕНЬ ПРОТИВ БУХЛА 🦌</h2>
      <p className="hint">Основа: Чаев гонит <b>Бухло</b> 🍾, но каждый глоток бьёт по <b>Здоровью</b> 🫀. Упал в 0 — похмелье: −20% бухла, здоровье 30%. Лечилки лечат, но жрут бухло. Качай древо, бери артефакты. Формулы цен прямо в описаниях, ня~</p>
      <p>Бухло: <b style={{ color: 'gold', fontSize: 22 }}>{fmtZ(z.m)}</b> <span className="hint">(+{Math.round(z.auto * z.mult)}/с)</span></p>
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
      <h3 style={{ color: 'gold' }}>🏺 Артефакты по качествам (чем выше — тем дороже и имбовее)</h3>
      <div>
        {[1, 2, 3, 4].map((q) => (
          <div key={q}>
            <div style={{ color: 'gold', fontWeight: 'bold', margin: '8px 0 4px', fontSize: 14 }}>{QUALITY_NAMES[q]}</div>
            {ARTS.filter((a) => (a.q || 3) === q).map((a) => {
              const owned = !!z.arts[a.id];
              return (
                <div className="art" key={a.id}>
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
        ))}
      </div>
      <h3 style={{ color: 'gold' }}>✨ Синергии артефактов</h3>
      <div style={{ fontSize: 14 }}>
        {SYNS.map((s) => {
          const on = !!z.syn[s.id];
          return (
            <div className={on ? 'syn on' : 'syn'} key={s.id}>
              {on ? '✅ ' : '🔒 '}<b>{s.name}</b> — {s.desc}
              {!on && <span className="hint"> [{s.need.join('+')}]</span>}
            </div>
          );
        })}
      </div>
      <h3 style={{ color: 'gold' }}>🌳 Огромное древо прокачки</h3>
      <div>
        {branches.map((row, i) => row.header
          ? <div className="branch" key={'h' + i}>{row.header}</div>
          : (() => {
            const b = row.def;
            const l = z.up[b.id] || 0;
            const maxed = l >= b.max;
            const c = upgradeCost(b, l);
            return (
              <div className="upg" key={b.id}>
                <b>{b.name}</b> ур.{l}/{b.max} — {b.desc}{' '}
                <span className="hint">[{b.base}×{b.g}^ур]</span>{' '}
                <button disabled={maxed || z.m < c} onClick={() => mutate((n) => {
                  buyUpgrade(n, b.id);
                  return '';
                }, 600 + l * 150)}>{maxed ? 'MAX' : `Купить ${c}`}</button>
              </div>
            );
          })())}
      </div>
      <p className="hint">Цена = база × рост^ур. Прогресс сохраняется. Мы уже победили 🏆</p>
    </div>
  );
}
