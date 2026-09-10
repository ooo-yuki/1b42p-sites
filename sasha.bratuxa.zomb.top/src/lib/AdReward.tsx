import { useEffect, useState } from 'react';
import { Clapperboard } from 'lucide-react';
import { claimAdReward, SHRINKME_URL, showRewardAd } from './adgram';
import { isTgLocked, tgReady } from './tg';
import './adreward.css';

/* Кнопка награды за рекламу. Сайт → shrinkme-ссылка, аппа → Adsgram +100 в игру. */

export default function AdReward({ game }: { game: string }): JSX.Element {
  const [tg, setTg] = useState<boolean>(() => isTgLocked());
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => { tgReady(() => setTg(isTgLocked())); }, []);

  if (!tg) {
    return (
      <a className="adreward" href={SHRINKME_URL} target="_blank" rel="noopener noreferrer"
        title="Реклама батальона — жми, касса скажет спасибо">
        <Clapperboard data-icon="inline-start" /> Реклама +100
      </a>
    );
  }

  const watch = async (): Promise<void> => {
    if (busy) return;
    setBusy(true);
    setMsg('Кручу рекламу…');
    const done = await showRewardAd();
    if (!done) {
      // SDK без blockId или реклама не завелась — открываем ссылку, общак не ждёт.
      try { window.open(SHRINKME_URL, '_blank', 'noopener'); } catch { /* приватный режим */ }
      setMsg('Реклама не завелась — открыл ссылку');
      setBusy(false);
      return;
    }
    const r = await claimAdReward(game);
    setMsg(r.ok ? `+100 на счёт! Баланс ${r.balance}` : r.error);
    setBusy(false);
  };

  return (
    <span className="adreward-wrap">
      <button className="adreward" onClick={() => void watch()} disabled={busy} title="Смотри рекламу — касса капнет +100">
        <Clapperboard data-icon="inline-start" /> {busy ? 'Кручу…' : 'Реклама +100'}
      </button>
      {msg && <span className="adreward-msg" role="status">{msg}</span>}
    </span>
  );
}
