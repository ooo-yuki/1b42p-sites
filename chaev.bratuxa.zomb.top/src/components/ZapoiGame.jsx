import { useEffect, useMemo, useState } from 'react';
import {
  createZapoiState, TREE, ARTS, QUALITY_NAMES, SYNS, upgradeCost,
  dmgPerSip, heal1val, heal1cost, heal2val, heal2cost,
  buyUpgrade, buyArt, jagerClick, tickZapoi,
  checkSyns, hangoverRate, fmtZ,
  CHARACTERS, isUnlocked, isAllBought, BOTTLE_COST, buyBottle, newRun, bet,
  artCost, charDiscount, effMult, cleanseDemon,
  pickleSmall, demonPickle, holyPickle, syringe,
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
      z.completed = { ...(s.completed || {}) };
      if (z.sips == null) z.sips = 0;
      if (z.soul == null) z.soul = 100;
      if (z.demonForm == null) z.demonForm = 0;
      // Старые сейвы без персонажа: был прогресс — продолжаем Владимиром.
      if (!z.char && (z.m > 0 || Object.keys(z.up).length > 0)) z.char = 'vladimir';
    }
  } catch (e) { /* тихо */ }
  if (z.hp == null || z.hp > z.maxhp) z.hp = z.maxhp || 100;
  checkSyns(z);
  return z;
}

function cloneZ(prev) {
  return { ...prev, up: { ...prev.up }, arts: { ...prev.arts }, syn: { ...prev.syn }, completed: { ...(prev.completed || {}) } };
}

// Сколько даст глоток (для кнопки; у винлайна — среднее).
function sipPreview(z) {
  if (z.char === 'ghost') return Math.round(z.click * effMult(z) * 3);
  if (z.char === 'demon') return Math.round(z.click * effMult(z) * 2);
  if (z.char === 'winline') return Math.round(z.click * effMult(z) * 1.5);
  return Math.round(z.click * effMult(z));
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
        if (!prev.char) return prev;
        const next = cloneZ(prev);
        const ev = tickZapoi(next);
        if (ev === 'hangover') {
          const rate = hangoverRate(next);
          const lost = (next._hangoverLost ?? Math.floor(prev.m * rate));
          setLog(`🤢 Похмелье! −${lost} бухла (${Math.round(rate * 100)}%), здоровье 30%. Рассолу накати!`);
        } else if (ev === 'shattered') {
          setLog('💥 Бутылка разбилась! Забег окончен.');
          blip(200);
          return newRun(next.completed, null);
        } else if (ev === 'demonform') {
          setLog('😈 ДЕМОНИЧЕСКАЯ ФОРМА ×5 на 10 сек! ЖГИ!');
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const mutate = (fn, lvl = 500) => {
    setZ((prev) => {
      const next = cloneZ(prev);
      const msg = fn(next);
      if (typeof msg === 'string' && msg) setLog(msg);
      return next;
    });
    blip(lvl);
  };

  // Разбить бутылку: закрыть персонажа и вернуться к выбору.
  const shatterBottle = () => {
    setZ((prev) => {
      const next = cloneZ(prev);
      if (!buyBottle(next)) {
        setLog(`Бутылка ещё не готова: скупи всё и накопи ${BOTTLE_COST.toLocaleString('ru-RU')} 🍾`);
        return prev;
      }
      const completed = { ...next.completed, [next.char]: 1 };
      setLog(`💥 Бутылка разбита! Персонаж закрыт. Так держать!`);
      blip(200);
      return newRun(completed, null);
    });
  };

  const pickChar = (id) => {
    setZ((prev) => {
      if (!isUnlocked({ completed: prev.completed }, id)) return prev;
      blip(700);
      return newRun(prev.completed, id);
    });
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
  const charDef = CHARACTERS.find((c) => c.id === z.char);
  // Пойло демона меняется в демонической форме (тёмная рука).
  // charDef пуст на экране выбора — тогда и пойла нет (иначе краш).
  const drinkImg = !charDef ? null : (z.char === 'demon' && z.demonForm > 0 && charDef.drinkForm) ? charDef.drinkForm : charDef.drink;
  const readyForBottle = z.char && isAllBought(z);

  // ЭКРАН ВЫБОРА ПЕРСОНАЖА
  if (!z.char) {
    const doneCount = CHARACTERS.filter((c) => z.completed && z.completed[c.id]).length;
    return (
      <div className="card">
        <h2>🎭 ВЫБОР ПЕРСОНАЖА 🎭</h2>
        <p className="hint">Закрыто персонажей: {doneCount}/{CHARACTERS.length}. Разбей бутылку за Владимира — откроются остальные!</p>
        {CHARACTERS.map((c) => {
          const open = isUnlocked(z, c.id);
          const done = z.completed && z.completed[c.id];
          return (
            <div key={c.id} style={{ border: '2px solid ' + (done ? '#7f7' : 'gold'), borderRadius: 12, padding: 12, margin: '8px 0', overflow: 'hidden', background: '#1a1a1a' }}>
              <img src={c.img} alt={c.name} style={{ width: 120, borderRadius: 12, border: '2px solid gold', marginRight: 12, float: 'left' }} />
              <b style={{ fontSize: 19, color: '#fff' }}>{c.emoji} {c.name}</b>{' '}
              {done ? <span style={{ color: '#7f7', fontWeight: 'bold' }}>✅ ЗАКРЫТ</span> : open ? '' : <span style={{ color: '#aaa' }}>🔒 откроется за бутылку Владимира</span>}
              <div style={{ color: 'gold', fontSize: 15, marginTop: 6 }}>{c.desc}</div>
              <div style={{ marginTop: 8 }}>
                {(c.stats || []).map((st) => (
                  <div key={st} style={{ color: '#fff', fontSize: 15, marginTop: 4 }}>• {st}</div>
                ))}
              </div>
              <div style={{ color: '#aaa', fontSize: 13, fontStyle: 'italic', marginTop: 6 }}>{c.hint}</div>
              {open && !done && <button onClick={() => pickChar(c.id)} style={{ marginTop: 8 }}>ИГРАТЬ ЗА НЕГО ▶</button>}
              {open && done && <button onClick={() => pickChar(c.id)} style={{ marginTop: 8 }}>ЕЩЁ РАЗ ▶</button>}
              <div style={{ clear: 'both' }} />
            </div>
          );
        })}
        <p className="hint">Прогресс закрытий сохраняется. Мы уже победили 🏆</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>🦌 ЗАПОЙ 2.0: ПЕЧЕНЬ ПРОТИВ БУХЛА 🦌</h2>
      <p><img src={charDef.img} alt={charDef.name} style={{ width: 64, borderRadius: 12, border: '2px solid gold', verticalAlign: 'middle', marginRight: 10 }} /><b style={{ fontSize: 18 }}>{charDef.emoji} {charDef.name}</b>{' '}
        <button onClick={() => setZ((prev) => newRun(prev.completed, null))} style={{ fontSize: 12 }}>сменить</button>
      </p>
      <p className="hint">
        {CHARACTERS.map((c) => (
          <span key={c.id} style={{ marginRight: 8 }}>{c.emoji} {(z.completed && z.completed[c.id]) ? '✅' : (c.id === z.char ? '▶' : (isUnlocked(z, c.id) ? '○' : '🔒'))}</span>
        ))}
      </p>
      <p className="hint">Основа: Чаев гонит <b>Бухло</b> 🍾, но каждый глоток бьёт по <b>Здоровью</b> 🫀. Упал в 0 — похмелье: −20% бухла, здоровье 30%. Лечилки лечат, но жрут бухло. Качай древо, бери артефакты. Формулы цен прямо в описаниях, ня~</p>
      <p>Бухло: <b style={{ color: 'gold', fontSize: 26 }}>{Math.floor(z.m).toLocaleString('ru-RU')} 🍾</b> <span className="hint">(+{Math.round(z.auto * effMult(z) + (z.char === 'vladimir' ? 0.2 * z.mult : 0))}/с • это {fmtZ(z.m)} запоя)</span></p>
      <p>Здоровье: <b style={{ color: '#7f7', fontSize: 20 }}>{Math.ceil(z.hp)}/{z.maxhp}</b></p>
      <div className="hpbar-wrap"><div className="hpbar" style={{ width: pct + '%' }}></div></div>
      {z.char === 'ghost' && (
        <p>👻 Остатки души: <b style={{ color: '#c9f', fontSize: 20 }}>{Math.ceil(z.soul)}/100</b> <span className="hint">(реген +2/сек, глоток −5; в 0 — бутылка бьётся!)</span></p>
      )}
      {z.char === 'demon' && z.demonForm > 0 && (
        <p style={{ color: 'red', fontWeight: 'bold', fontSize: 20 }}>😈 ДЕМОНИЧЕСКАЯ ФОРМА ×5: {z.demonForm} сек!</p>
      )}
      {z.char === 'vladimir' && charDiscount(z) > 0 && (
        <p className="hint">🧔 Солидность: клик +{(z.sips * 0.02).toFixed(1)}, скидки −{(charDiscount(z) * 100).toFixed(0)}%</p>
      )}
      {z.char === 'ghost' && charDiscount(z) > 0 && (
        <p className="hint">✨ Святость: скидки −{(charDiscount(z) * 100).toFixed(1)}%</p>
      )}
      <p className="hint">урон/глоток {dmgPerSip(z).toFixed(1)} HP • реген {z.regen.toFixed(1)}/с • toxic×{z.toxic.toFixed(2)} • mult×{z.mult.toFixed(2)}</p>
      <div style={{ margin: '10px 0' }}>
        <img src={drinkImg} alt="Пойло персонажа" style={{ width: 120, borderRadius: 12, border: '2px solid gold', verticalAlign: 'middle' }} />
      </div>
      <button onClick={() => mutate((n) => {
        const ev = jagerClick(n);
        if (ev === 'hangover') {
          const rate = hangoverRate(n);
          const lost = (n._hangoverLost ?? Math.floor(n.m * rate / (1 - rate)));
          return `🤢 Похмелье! −${lost} бухла (${Math.round(rate * 100)}%), здоровье 30%. Рассолу накати!`;
        }
        if (ev === 'shattered') {
          setTimeout(() => setZ((prev) => newRun(prev.completed, null)), 50);
          return '💥 Бутылка разбилась! Возвращаю к выбору персонажа…';
        }
        if (ev === 'demonform') return '😈 ДЕМОНИЧЕСКАЯ ФОРМА ×5 на 10 сек! ЖГИ!';
        return '';
      }, 400)} style={{ background: 'linear-gradient(180deg,#ff7a00,#c50)', color: '#fff', fontSize: 22, padding: '14px 30px' }}>
        <img src={drinkImg} alt="" style={{ height: 34, verticalAlign: 'middle', borderRadius: 8, marginRight: 8 }} />
        ЯГЕРМЕЙСТЕР (+{z.char === 'winline' ? '~' : ''}{sipPreview(z)})
      </button><br /><br />
      {z.char === 'winline' && (
        <button disabled={z.m < Math.max(50, Math.floor(z.m * 0.1))} onClick={() => mutate((n) => {
          const r = bet(n);
          if (!r) return '';
          return r.win ? `🎰 Ставка зашла! +${r.stake} бухла чистыми!` : `🎰 Ставка сгорела… −${r.stake} бухла. Рискуй ещё!`;
        }, 650)} style={{ fontSize: 15 }}>
          <img src="heals/lever.jpg" alt="" style={{ height: 30, verticalAlign: 'middle', borderRadius: 8, marginRight: 8 }} />
          РУЧКА: 10% бухла, 45% — возврат ×2</button>
      )}{' '}
      {(z.char === 'vladimir' || z.char === 'winline') && (
        <button disabled={z.m < heal1cost(z)} onClick={() => mutate((n) => {
          const r = pickleSmall(n);
          return r ? `🥒 Пикули: +${r.v} HP за ${r.c} бухла` : '';
        }, 500)} style={{ fontSize: 15 }}>
          <img src="heals/pickle.jpg" alt="" style={{ height: 30, verticalAlign: 'middle', borderRadius: 8, marginRight: 8 }} />
          ПИКУЛИ: +{heal1val(z)} HP за {heal1cost(z)} бухла</button>
      )}{' '}
      {z.char === 'demon' && (
        <button disabled={z.m < heal1cost(z)} onClick={() => mutate((n) => {
          const r = demonPickle(n);
          if (!r) return '';
          return `🔥 Демонические пикули: +${r.v} HP за ${r.c} бухла${r.extended ? ', форма +10 сек!' : ''}`;
        }, 500)} style={{ fontSize: 15 }}>
          <img src="heals/dpickle.jpg" alt="" style={{ height: 30, verticalAlign: 'middle', borderRadius: 8, marginRight: 8 }} />
          ДЕМОНИЧЕСКИЕ ПИКУЛИ: +{heal1val(z)} HP за {heal1cost(z)} бухла</button>
      )}{' '}
      {z.char === 'ghost' && (
        <button disabled={z.m < heal1cost(z)} onClick={() => mutate((n) => {
          const r = holyPickle(n);
          if (!r) return '';
          return `✨ Святые пикули: +${r.v} души за ${r.c} бухла${r.deal ? ', скидка −0.2% навсегда!' : ''}`;
        }, 500)} style={{ fontSize: 15 }}>
          <img src="heals/hpickle.jpg" alt="" style={{ height: 30, verticalAlign: 'middle', borderRadius: 8, marginRight: 8 }} />
          СВЯТЫЕ ПИКУЛИ: +{heal1val(z)} души за {heal1cost(z)} бухла</button>
      )}{' '}
      {(z.char === 'vladimir' || z.char === 'winline') && (
        <button disabled={z.m < heal2cost(z)} onClick={() => mutate((n) => {
          const r = syringe(n);
          return r ? `💉 Шприц: полное HP за ${r.c} бухла` : '';
        }, 700)} style={{ fontSize: 15 }}>
          <img src="heals/syringe.jpg" alt="" style={{ height: 30, verticalAlign: 'middle', borderRadius: 8, marginRight: 8 }} />
          ШПРИЦ: полное HP за {heal2cost(z)} бухла</button>
      )}{' '}
      {z.char === 'demon' && (
        <button disabled={z.m < heal2cost(z)} onClick={() => mutate((n) => {
          const r = cleanseDemon(n);
          if (!r) return '';
          return r.cleansed ? `😇 Очищение! Форма снята за ${r.c} бухла, HP 30%. Живи!` : `💉 Капельница: +${r.v} HP за ${r.c} бухла`;
        }, 700)} style={{ fontSize: 15 }}>
          <img src="heals/cleanse.jpg" alt="" style={{ height: 30, verticalAlign: 'middle', borderRadius: 8, marginRight: 8 }} />
          ОЧИЩЕНИЕ: снять форму за {heal2cost(z)} бухла</button>
      )}
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
                {open ? '▼' : '▶'} <img src={`quals/q${q}.png`} alt={'Качество ' + q} style={{ width: 30, height: 30, verticalAlign: 'middle', borderRadius: 8, marginRight: 6 }} />{QUALITY_NAMES[q]} <span className="hint">({owned}/{list.length})</span>
              </div>
              {open && list.map((a) => {
              const owned = !!z.arts[a.id];
              const price = artCost(z, a);
              return (
                <div className="art" key={a.id}>
                  <img src={`arts/${a.id}.png`} alt={a.name} style={{ width: 44, height: 44, borderRadius: 10, border: '2px solid gold', verticalAlign: 'middle', marginRight: 8 }} />
                  <b>{a.name}</b> — {a.desc}{' '}
                  <button disabled={owned || z.m < price} onClick={() => mutate((n) => {
                    const syns = buyArt(n, a.id);
                    if (syns === false) return '';
                    if (n._lastArtBlank) return `🎰 Пустышка! Деньги возвращены (${price} 🍾), крути снова!`;
                    if (syns.length > 0) {
                      const names = syns.map((id) => SYNS.find((s) => s.id === id).name).join(', ');
                      return `${names} — синергия!`;
                    }
                    return `🏺 Артефакт: ${a.name} — имба активирована!`;
                  }, 900)}>{owned ? 'ВЗЯТ ✅' : `Взять за ${price}`}</button>
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
                const c = upgradeCost(b, l, charDiscount(z));
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
      <h3 style={{ color: 'gold' }}>💥 ФИНАЛ ЗАБЕГА: РАЗБИТАЯ БУТЫЛКА</h3>
      {readyForBottle ? (
        <div style={{ border: '3px solid red', borderRadius: 12, padding: 12, margin: '8px 0' }}>
          <p>Всё скуплено, все синергии собраны! Самый дорогой предмет ждёт…</p>
          <button onClick={shatterBottle} disabled={z.m < BOTTLE_COST} style={{ fontSize: 20, background: 'linear-gradient(180deg,#c00,#700)', color: '#fff', padding: '12px 30px' }}>
            🍾💥 РАЗБИТЬ БУТЫЛКУ за {BOTTLE_COST.toLocaleString('ru-RU')}
          </button>
          <p className="hint">Бутылка разобьётся, забег завершится, {charDef.name} будет закрыт ✅</p>
        </div>
      ) : (
        <p className="hint">🔒 Бутылка появится, когда скупишь всё (древо MAX + {ARTS.length} артефактов + {SYNS.length} синергий) и накопишь {BOTTLE_COST.toLocaleString('ru-RU')} бухла.</p>
      )}
      <p className="hint">Цена = база × рост^ур. Прогресс сохраняется. Мы уже победили 🏆</p>
    </div>
  );
}
