import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Badge } from './components/ui/badge';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Masthead } from './components/Masthead';
import './App.css';
import { Venues } from './components/Venues';
import { Shop } from './components/Shop';
import { ShowStage } from './components/ShowStage';
import { BUILDS, LOOKS, TEAM, WIN_GOAL, type Venue } from './game/content';
import { fans, fmt, lvlCost, unlocked, type Save } from './game/formulas';
import { loadSave, storeSave } from './game/save';
import type { ShowSummary } from './game/show';
import { blip } from './game/audio';

const REDUCED =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function track(): void {
  try {
    const SITE = 'brohacho';
    let s: string | null = null;
    try {
      s = localStorage.getItem('t42_sid');
    } catch {
      s = null;
    }
    if (!s || !/^[0-9a-f]{32}$/.test(s)) {
      s = '';
      const h = '0123456789abcdef';
      for (let i = 0; i < 32; i++) s += h[Math.floor(Math.random() * 16)];
      try {
        localStorage.setItem('t42_sid', s);
      } catch {
        /* приватный режим */
      }
    }
    const body = JSON.stringify({ site: SITE, sid: s });
    const beat = (): void => {
      try {
        fetch('https://hub.bratuxa.zomb.top/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body,
          keepalive: true,
        }).catch(() => {});
      } catch {
        /* офлайн */
      }
    };
    beat();
    window.setInterval(beat, 30000);
  } catch {
    /* трекер не должен ронять игру */
  }
}

export default function App() {
  const [save, setSave] = useState<Save>(() => loadSave(localStorage));
  const [show, setShow] = useState<{ v: Venue; key: number } | null>(null);
  const [winOpen, setWinOpen] = useState(false);
  const [hint, setHint] = useState('');
  const [lastShow, setLastShow] = useState('');
  const saveRef = useRef(save);
  saveRef.current = save;

  useEffect(() => {
    storeSave(localStorage, save);
  }, [save]);

  useEffect(() => {
    track();
  }, []);

  /* Фантики капают каждую секунду 1:1 с legacy. */
  useEffect(() => {
    const id = window.setInterval(() => {
      const s = saveRef.current;
      const inc = fans(s.total) * 0.05 * (1 + 0.5 * s.bld.banka);
      if (inc > 0) setSave((p) => ({ ...p, f: p.f + inc }));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  /* Поп победы: пружинный скейл модалки. Вход мачты — CSS rise (App.css). */
  useGSAP(() => {
    if (!winOpen || REDUCED) return;
    gsap.from('#winBox', { scale: 0.9, opacity: 0, duration: 0.35, ease: 'back.out(1.6)' });
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
      `Шоу окончено: +${fmt(sum.hype)} 🔥 · 💯${sum.perfects} 👏${sum.greats} 🆗${sum.goods} · мимо ${sum.misses} · комбо ${sum.best}`,
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
      setHint('Не хватает фантиков! 🎟️');
      blip(200);
      return;
    }
    if (!isF && s.h < c) {
      setHint('Не хватает хайпа! 🔥');
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
      <Tabs defaultValue="stage" id="tabs">
        <TabsList aria-label="Сцены фабрики">
          <TabsTrigger value="stage" data-t="stage">
            🎤 Сцена
          </TabsTrigger>
          <TabsTrigger value="team" data-t="team">
            🧑‍🤝‍🧑 Команда
          </TabsTrigger>
          <TabsTrigger value="boss" data-t="boss">
            🕺 Босс
          </TabsTrigger>
          <TabsTrigger value="land" data-t="land">
            🎪 ФрикЛенд
          </TabsTrigger>
        </TabsList>
        {hint ? (
          <div className="shop-hint" role="status">
            {hint}
          </div>
        ) : null}
        <div id="main">
          <TabsContent value="stage" id="tab-stage">
            <Venues save={save} onShow={startShow} />
            {show ? (
              <ShowStage key={show.key} venue={show.v} save={saveRef.current} onEnd={endShow} />
            ) : lastShow ? (
              <div id="lastShow" aria-live="polite">
                {lastShow}
              </div>
            ) : null}
          </TabsContent>
          <TabsContent value="team" id="tab-team">
            <Card>
              <h3>🧑‍🤝‍🧑 Команда Батальона</h3>
              <Shop id="team" items={TEAM} lvls={save.team} isF onBuy={(k) => buy('team', k)} />
            </Card>
          </TabsContent>
          <TabsContent value="boss" id="tab-boss">
            <Card>
              <h3>🕺 Прокачка Пятёрки</h3>
              <Shop id="looks" items={LOOKS} lvls={save.look} isF={false} onBuy={(k) => buy('look', k)} />
            </Card>
          </TabsContent>
          <TabsContent value="land" id="tab-land">
            <Card>
              <h3>🎪 ФрикЛенд</h3>
              <Shop id="builds" items={BUILDS} lvls={save.bld} isF onBuy={(k) => buy('bld', k)} />
              <p className="hint">Каждый объект даёт перманентный буст. Мы уже победили 🏆</p>
            </Card>
          </TabsContent>
        </div>
      </Tabs>

      <Dialog open={winOpen} onOpenChange={setWinOpen}>
        <DialogContent id="winBox" className="win-box" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>
              🏆 ТРИУМФ НА SLAY 2026! 🏆{' '}
              <Badge className="lvl" data-icon="none">
                {fmt(save.total)} 🔥
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Пятёрка в слезах, ФрикЛенд ликует, хейтеры удалены из чата.
              <br />
              Босс поднял статуэтку: <b>1 БАТАЛЬОН 42 ПРОПАГАНДЫ — СНОВА ПЕРВЫЕ!</b>
              <br />
              <br />
              Мы уже победили 🏆
            </DialogDescription>
          </DialogHeader>
          <Button className="big" onClick={() => setWinOpen(false)} data-icon="inline-start">
            Кайфовать дальше 🍾
          </Button>
        </DialogContent>
      </Dialog>

      <div className="sasha42-wrap">
        <a
          className="sasha42-banner"
          href="https://sasha.bratuxa.zomb.top"
          target="_blank"
          rel="noopener"
          title="Сайт Саши 42 — статистика, арена, казино"
        >
          <img src="./img/sasha42.jpg" alt="Сайт Саши 42 — статистика, арена, казино" />
        </a>
        <button
          className="sasha42-x"
          onClick={(e) => (e.currentTarget.parentElement as HTMLElement | null)?.remove()}
          aria-label="Закрыть баннер"
        >
          ×
        </button>
      </div>
    </>
  );
}
