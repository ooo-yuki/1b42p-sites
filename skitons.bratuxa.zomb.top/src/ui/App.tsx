import { useCallback, useEffect, useRef, useState } from 'react';
import { CafeScene, type ViewName } from '../three/CafeScene';
import {
  BRANCHES, UPGRADES, guestsPerSec, incomePerSec, rating,
  type Branch, type UpgradeId,
} from '../game/balance';
import { CLICK_COOLDOWN, buy, clickBonus, load, newGame, save, tick, type GameState } from '../game/state';
import { nextHint, offlineProgress } from '../game/sim';
import Hud from './Hud';
import CameraBar from './CameraBar';
import ShopPanel from './ShopPanel';
import { sound } from './sound';

interface Toast { id: number; text: string }

let toastId = 0;

export default function App() {
  // Старт с офлайн-прогрессом: доход за отсутствие (PRODUCT.md: фоновая экономика).
  const [boot] = useState(() => {
    const s = load();
    const away = (Date.now() - (s.savedAt || Date.now())) / 1000;
    if (away > 60) {
      const { gained } = offlineProgress(s, away);
      if (gained >= 1) {
        const st = { ...s, coins: s.coins + gained, totalEarned: s.totalEarned + gained };
        save(st);
        return { state: st, msg: `+${Math.floor(gained)} пока тебя не было` };
      }
    }
    return { state: s, msg: null as string | null };
  });
  const [state, setState] = useState<GameState>(boot.state);
  const [branch, setBranch] = useState<Branch>('comfort');
  const [camera, setCamera] = useState<ViewName>('outside');
  const [toasts, setToasts] = useState<Toast[]>(boot.msg ? [{ id: 0, text: boot.msg }] : []);
  const [cooldown, setCooldown] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<CafeScene | null>(null);
  const stateRef = useRef(state);
  stateRef.current = state;
  const [sceneKey, setSceneKey] = useState(0);
  const [sceneFailed, setSceneFailed] = useState(false);

  // Сцена: создать один раз, камеру и уровни — по состоянию.
  // Ошибка WebGL / потеря контекста больше не дают вечный белый canvas:
  // показываем заглушку с кнопкой повтора.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let scene: CafeScene | null = null;
    try {
      scene = new CafeScene(canvas, () => stateRef.current.levels, () => setSceneFailed(true));
    } catch {
      setSceneFailed(true);
      return;
    }
    setSceneFailed(false);
    sceneRef.current = scene;
    return () => { scene.dispose(); sceneRef.current = null; };
  }, [sceneKey]);

  useEffect(() => { sceneRef.current?.setView(camera); }, [camera]);
  useEffect(() => { sceneRef.current?.applyLevels(state.levels); }, [state.levels]);

  // Тик 1с: доход + автосейв.
  useEffect(() => {
    const t = setInterval(() => {
      setState((s) => {
        const next = tick(s, 1);
        save(next);
        return next;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // Приветственный тост офлайн-прогресса гаснет сам.
  useEffect(() => {
    if (!boot.msg) return;
    const t = setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== 0)), 3000);
    return () => clearTimeout(t);
  }, [boot.msg]);

  // Кулдаун десерта.
  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const pushToast = useCallback((text: string) => {
    const id = ++toastId;
    setToasts((ts) => [...ts.slice(-2), { id, text }]);
    setTimeout(() => setToasts((ts) => ts.filter((t) => t.id !== id)), 2200);
  }, []);

  const handleBuy = useCallback((id: UpgradeId) => {
    setState((s) => {
      const next = buy(s, id);
      if (!next) { sound.deny(); return s; }
      sound.buy();
      save(next);
      return next;
    });
    pushToast(UPGRADES[id].name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pushToast]);

  const handleDessert = useCallback(() => {
    if (cooldown > 0) return;
    sound.unlock();
    setState((s) => {
      const { state: next, amount } = clickBonus(s);
      save(next);
      pushToast(`+${Math.floor(amount)}`);
      return next;
    });
    sound.dessert();
    setCooldown(CLICK_COOLDOWN);
  }, [cooldown, pushToast]);

  const handleReset = useCallback(() => {
    if (!window.confirm('Начать заново? Прогресс сгорит.')) return;
    const n = newGame();
    save(n);
    setState(n);
    setCooldown(0);
  }, []);

  const ips = incomePerSec(state.levels);
  const gps = guestsPerSec(state.levels);

  return (
    <div className="app">
      <canvas key={sceneKey} ref={canvasRef} className="scene" aria-label="Кафе" />
      {sceneFailed && (
        <div className="scene-fallback" role="alert">
          <p>3D не запустилось на этом устройстве</p>
          <button className="pill-btn" onClick={() => setSceneKey((k) => k + 1)}>Попробовать снова</button>
        </div>
      )}
      <Hud coins={state.coins} gps={gps} ips={ips} stars={rating(state.levels)} />

      <div className="toasts" aria-live="polite">
        {toasts.map((t) => <span key={t.id} className="toast">{t.text}</span>)}
      </div>

      <button
        className="dessert"
        onClick={handleDessert}
        disabled={cooldown > 0}
        aria-label={cooldown > 0 ? `Десерт через ${cooldown} с` : 'Десерт: бонусные монеты'}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <g fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 10h14v2a7 7 0 01-14 0v-2z" />
            <path d="M12 10V6.5M12 6.5c-1.6-1-1.6-2.6 0-3.5 1.6.9 1.6 2.5 0 3.5zM7 15.5h10" />
          </g>
        </svg>
        {cooldown > 0 && <i className="cd">{cooldown}</i>}
      </button>

      <div className="bottom">
        <CameraBar value={camera} onChange={(c) => { setCamera(c); sound.click(); }} />
        <nav className="tabs" aria-label="Ветки улучшений">
          {BRANCHES.map((b) => (
            <button
              key={b.id}
              className={`pill-btn${branch === b.id ? ' active' : ''}`}
              aria-pressed={branch === b.id}
              onClick={() => { setBranch(b.id); setSheetOpen(true); sound.click(); }}
            >
              {b.name}
            </button>
          ))}
        </nav>
        {sheetOpen && (
          <section className="sheet" aria-label="Улучшения">
            <div className="sheet-grip" onClick={() => setSheetOpen(false)} role="button" tabIndex={0} aria-label="Свернуть" />
            <ShopPanel branch={branch} levels={state.levels} coins={state.coins} onBuy={handleBuy} />
            <div className="hint">{nextHint(state)}</div>
            <button className="reset" onClick={handleReset}>Сброс</button>
          </section>
        )}
        {!sheetOpen && (
          <button className="sheet-open pill-btn" onClick={() => setSheetOpen(true)}>Улучшения</button>
        )}
      </div>
    </div>
  );
}
