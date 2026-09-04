// Запой 2.0: тонкий композитор. Логика — в game/zapoi/*, состояние — в hooks/useZapoiState.
import { useEffect, useState } from 'react';
import { CHARACTERS, isUnlocked, newRun } from '../game/zapoi/index';
import { useZapoiState } from '../hooks/useZapoiState';
import Artifacts from './zapoi/Artifacts';
import Bottle from './zapoi/Bottle';
import CharSelect from './zapoi/CharSelect';
import DrinkPanel from './zapoi/DrinkPanel';
import HealButtons from './zapoi/HealButtons';
import Synergies from './zapoi/Synergies';
import UpgradeTree from './zapoi/UpgradeTree';
import { motifFor, radio } from './zapoi/charMusic';

export default function ZapoiGame() {
  const { z, setZ, log, mutate, shatterBottle, pickChar, resetToSelect } = useZapoiState();
  const [musicOn, setMusicOn] = useState<boolean>(() => {
    try { return localStorage.getItem('zapoi_music') !== 'off'; } catch { return true; }
  });
  const formActive = z.char === 'demon' && Number(z.demonForm || 0) > 0;

  // Трек персонажа: свой мотив под вайб; в демонической форме — ускоренный и зловещий.
  useEffect(() => {
    if (!z.char) { radio.stop(); return; }
    if (!musicOn) { radio.stop(); return; }
    radio.setMotif(motifFor(z.char, z.demonForm || 0));
    radio.start();
    return () => radio.stop();
  }, [z.char, formActive, musicOn]);

  const toggleMusic = (): void => {
    setMusicOn((prev) => {
      const next = !prev;
      try { localStorage.setItem('zapoi_music', next ? 'on' : 'off'); } catch { /* тихо */ }
      return next;
    });
  };

  // ЭКРАН ВЫБОРА ПЕРСОНАЖА
  if (!z.char) {
    return <CharSelect z={z} onPick={pickChar} />;
  }

  const charDef = CHARACTERS.find((c) => c.id === z.char);
  if (!charDef) return <CharSelect z={z} onPick={pickChar} />;
  // Пойло демона меняется в демонической форме (тёмная рука).
  const drinkImg = z.char === 'demon' && z.demonForm > 0 && charDef.drinkForm ? charDef.drinkForm : charDef.drink;

  return (
    <div className="card">
      <h2>🦌 ЗАПОЙ 2.0: ПЕЧЕНЬ ПРОТИВ БУХЛА 🦌</h2>
      <p className="hint">
        {CHARACTERS.map((c) => (
          <span key={c.id} style={{ marginRight: 8 }}>{c.emoji} {(z.completed && z.completed[c.id]) ? '✅' : (c.id === z.char ? '▶' : (isUnlocked(z, c.id) ? '○' : '🔒'))}</span>
        ))}
      </p>
      <p className="hint">Основа: Чаев гонит <b>Бухло</b> 🍾, но каждый глоток бьёт по <b>Здоровью</b> 🫀. Упал в 0 — похмелье: −20% бухла, здоровье 30%. Лечилки лечат, но жрут бухло. Качай древо, бери артефакты. Формулы цен прямо в описаниях, ня~</p>
      <p className="hint">{motifFor(z.char, z.demonForm || 0).label}{' '}<button onClick={toggleMusic}>{musicOn ? '⏸ Выкл' : '▶ Вкл'}</button></p>
      <DrinkPanel z={z} charDef={charDef} drinkImg={drinkImg} mutate={mutate} onShattered={() => setZ((prev) => newRun(prev.completed, null))} onChangeChar={resetToSelect} />
      <HealButtons z={z} mutate={mutate} />
      <div className="zlog">{log}</div>
      <Artifacts z={z} mutate={mutate} />
      <Synergies z={z} />
      <UpgradeTree z={z} mutate={mutate} />
      <Bottle z={z} charName={charDef.name} onShatter={shatterBottle} />
      <p className="hint">Прогресс сохраняется. Мы уже победили 🏆</p>
    </div>
  );
}
