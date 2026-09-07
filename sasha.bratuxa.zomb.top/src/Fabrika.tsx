import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Crown, Gamepad2, House, Mic, PartyPopper, Tent, Trophy, Users, type LucideIcon } from 'lucide-react';
import { useBeacon } from './hooks';
import './fabrika.css';
import { Masthead, Shop, Venues } from './fabrika/parts';
import { ShowStage } from './fabrika/ShowStage';
import { BUILDS, LOOKS, TEAM, WIN_GOAL, type Venue } from './fabrika/content';
import { fans, fmt, lvlCost, unlocked, type Save } from './fabrika/formulas';
import { loadSave, storeSave } from './fabrika/save';
import type { ShowSummary } from './fabrika/show';
import { blip } from './fabrika/audio';

const REDUCED =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

type Tab = 'stage' | 'team' | 'boss' | 'land';

const TABS: Array<{ id: Tab; label: string; icon: LucideIcon }> = [
  { id: 'stage', label: 'Сцена', icon: Mic },
  { id: 'team', label: 'Команда', icon: Users },
  { id: 'boss', label: 'Босс', icon: Crown },
  { id: 'land', label: 'ФрикЛенд', icon: Tent },
];

/* Фабрика Хайпа 42 у Саши: продюсируй Пятёрку, качай команду и выйди на SLAY.
   Движок 1:1 с brohacho (тот же баланс, те же сейвы brohacho42_v1). */
export default function Fabrika(): JSX.Element {
  const [save, setSave] = useState<Save>(() => loadSave(localStorage));
  const [show, setShow] = useState<{ v: Venue; key: number } | null>(null);
  const [tab, setTab] = useState<Tab>('stage');
  const [winOpen, setWinOpen] = useState(false);
  const [hint, setHint] = useState('');
  const [lastShow, setLastShow] = useState('');
  const saveRef = useRef(save);
  saveRef.current = save;
  const winScope = useRef<HTMLDivElement | null>(null);
  const winBox = useRef<HTMLDivElement | null>(null);

  useBeacon();

  useEffect(() => {
    storeSave(localStorage, save);
  }, [save]);

  /* Фантики капают каждую секунду 1:1 с legacy. */
  useEffect(() => {
    const id = window.setInterval(() => {
      const s = saveRef.current;
      const inc = fans(s.total) * 0.05 * (1 + 0.5 * s.bld.banka);
      if (inc > 0) setSave((p) => ({ ...p, f: p.f + inc }));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  /* Победа: оверлей гаснет, коробка пружинит. Скоп на ноде, revert в cleanup. */
  useEffect(() => {
    if (!winOpen || REDUCED) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { duration: 0.3, ease: 'power2.out' } });
      tl.fromTo(winScope.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 0)
        .from(winBox.current, { scale: 0.9, autoAlpha: 0, ease: 'back.out(1.6)' }, '<0.05');
    }, winScope);
    return () => ctx.revert();
  }, [winOpen]);

  const startShow = (v: Venue): void => {
    const s = saveRef.current;
    const u = unlocked(s, v);
    if (!u.ok) {
      blip(200);
      setHint(u.why ?? '');
      return;
    }
    if (u.buy) {
      setSave((p) => ({ ...p, h: p.h - v.cost, un: [...p.un, v.id] }));
    }
    setShow((p) => ({ v, key: (p?.key ?? 0) + 1 }));
    setHint('');
    blip(700);
  };

  const endShow = (sum: ShowSummary): void => {
    setShow(null);
    setLastShow(
      `Шоу окончено: +${fmt(sum.hype)} хайпа · точно ${sum.perfects} · хорошо ${sum.greats} · норм ${sum.goods} · мимо ${sum.misses} · комбо ${sum.best}`,
    );
    blip(990);
    setSave((p) => {
      const h = p.h + sum.hype;
      const total = p.total + sum.hype;
      const win = p.win || total >= WIN_GOAL;
      if (!p.win && total >= WIN_GOAL) setWinOpen(true);
      return { ...p, h, total, win };
    });
  };

  const buy = (section: 'team' | 'look' | 'bld', key: string): void => {
    const table = section === 'team' ? TEAM : section === 'look' ? LOOKS : BUILDS;
    const isF = section !== 'look';
    const o = table[key];
    if (!o) return;
    const s = saveRef.current;
    const lv = s[section][key] ?? 0;
    if (lv >= 3) return;
    const c = lvlCost(o.base, lv);
    if (isF && s.f < c) {
      setHint('Не хватает фантиков — качай ФрикЛенд и жми ноты');
      blip(200);
      return;
    }
    if (!isF && s.h < c) {
      setHint('Не хватает хайпа — выступи на площадке');
      blip(200);
      return;
    }
    setHint('');
    setSave((p) => ({
      ...p,
      ...(isF ? { f: p.f - c } : { h: p.h - c }),
      [section]: { ...p[section], [key]: (p[section][key] ?? 0) + 1 },
    }));
    blip(760);
  };

  return (
    <>
      <Masthead h={save.h} f={save.f} fans={fans(save.total)} />
      <div id="tabs" role="tablist" aria-label="Сцены фабрики">
        <div data-slot="tabs-list">
          {TABS.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                data-state={tab === t.id ? 'active' : 'inactive'}
                data-slot="tabs-trigger"
                onClick={() => setTab(t.id)}
              >
                <Icon data-icon="inline-start" aria-hidden size={16} />
                {t.label}
              </button>
            );
          })}
        </div>
        {hint ? (
          <div className="shop-hint" role="status">
            {hint}
          </div>
        ) : null}
      </div>
      <div id="main">
        {tab === 'stage' && (
          <div id="tab-stage" role="tabpanel">
            <Venues save={save} onShow={startShow} />
            {show ? (
              <ShowStage key={show.key} venue={show.v} save={saveRef.current} onEnd={endShow} />
            ) : lastShow ? (
              <div id="lastShow" aria-live="polite">
                {lastShow}
              </div>
            ) : null}
          </div>
        )}
        {tab === 'team' && (
          <div id="tab-team" role="tabpanel">
            <div data-slot="card">
              <h3>
                <Users data-icon="inline-start" aria-hidden size={16} /> Команда Батальона
              </h3>
              <Shop id="team" items={TEAM} lvls={save.team} isF onBuy={(k) => buy('team', k)} />
            </div>
          </div>
        )}
        {tab === 'boss' && (
          <div id="tab-boss" role="tabpanel">
            <div data-slot="card">
              <h3>
                <Crown data-icon="inline-start" aria-hidden size={16} /> Прокачка Пятёрки
              </h3>
              <Shop id="looks" items={LOOKS} lvls={save.look} isF={false} onBuy={(k) => buy('look', k)} />
            </div>
          </div>
        )}
        {tab === 'land' && (
          <div id="tab-land" role="tabpanel">
            <div data-slot="card">
              <h3>
                <Tent data-icon="inline-start" aria-hidden size={16} /> ФрикЛенд
              </h3>
              <Shop id="builds" items={BUILDS} lvls={save.bld} isF onBuy={(k) => buy('bld', k)} />
              <p className="hint">Каждый объект даёт перманентный буст. Мы уже победили.</p>
            </div>
          </div>
        )}
        <nav className="fab-home" aria-label="Навигация">
          <a href="minigames.html">
            <Gamepad2 data-icon="inline-start" aria-hidden size={15} /> Зал автоматов
          </a>
          <a href="index.html">
            <House data-icon="inline-start" aria-hidden size={15} /> Саша ⁴² — на главную
          </a>
        </nav>
      </div>

      {winOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Триумф на SLAY 2026"
          ref={winScope}
          onClick={() => setWinOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 50, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            background: 'rgba(4,6,14,.92)', padding: 20,
          }}
        >
          <div
            id="winBox"
            className="win-box"
            ref={winBox}
            onClick={(e) => e.stopPropagation()}
            style={{ padding: 26, maxWidth: 440 }}
          >
            <div data-slot="dialog-title" style={{ fontWeight: 800, fontSize: 20 }}>
              <Trophy data-icon="inline-start" aria-hidden size={20} /> ТРИУМФ НА SLAY 2026{' '}
              <span data-slot="badge" className="lvl">
                {fmt(save.total)} хайпа
              </span>
            </div>
            <p>
              Пятёрка в слезах, ФрикЛенд ликует, хейтеры удалены из чата.
              <br />
              Босс поднял статуэтку: <b>1 БАТАЛЬОН 42 ПРОПАГАНДЫ — СНОВА ПЕРВЫЕ!</b>
              <br />
              <br />
              Мы уже победили.
            </p>
            <button className="big" onClick={() => setWinOpen(false)}>
              <PartyPopper data-icon="inline-start" aria-hidden size={18} /> Кайфовать дальше
            </button>
          </div>
        </div>
      )}
    </>
  );
}
