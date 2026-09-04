// Запой 2.0: тонкий композитор. Логика — в game/zapoi/*, состояние — в hooks/useZapoiState.
import { CHARACTERS, isUnlocked, newRun } from '../game/zapoi/index';
import { useZapoiState } from '../hooks/useZapoiState';
import Artifacts from './zapoi/Artifacts';
import Bottle from './zapoi/Bottle';
import CharSelect from './zapoi/CharSelect';
import DrinkPanel from './zapoi/DrinkPanel';
import HealButtons from './zapoi/HealButtons';
import Synergies from './zapoi/Synergies';
import UpgradeTree from './zapoi/UpgradeTree';

export default function ZapoiGame() {
  const { z, setZ, log, mutate, shatterBottle, pickChar, resetToSelect } = useZapoiState();

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
