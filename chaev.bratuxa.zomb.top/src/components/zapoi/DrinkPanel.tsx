// Витрина забега: статистика + большая кнопка глотка ягера.
import { effMult, fmtZ, hangoverRate, jagerClick, sipPreview } from '../../game/zapoi/index';
import type { Character, ZapoiState } from '../../game/zapoi/index';
import type { MutateFn } from '../../hooks/useZapoiState';
import ImgButton from '../ui/ImgButton';

interface DrinkPanelProps {
  z: ZapoiState;
  charDef: Character;
  drinkImg: string | null;
  mutate: MutateFn;
  onShattered: () => void;
  onChangeChar: () => void;
}

export default function DrinkPanel({ z, charDef, drinkImg, mutate, onShattered, onChangeChar }: DrinkPanelProps) {
  const pct = Math.max(0, Math.min(100, (z.hp / z.maxhp) * 100));
  return (
    <>
      <p><img src={charDef.img} alt={charDef.name} style={{ width: 64, borderRadius: 12, border: '2px solid gold', verticalAlign: 'middle', marginRight: 10 }} /><b style={{ fontSize: 18 }}>{charDef.emoji} {charDef.name}</b>{' '}
        <button onClick={onChangeChar} style={{ fontSize: 12 }}>сменить</button>
      </p>
      <p>Бухло: <b style={{ color: 'gold', fontSize: 26 }}>{Math.floor(z.m).toLocaleString('ru-RU')} 🍾</b> <span className="hint">(+{Math.round(z.auto * effMult(z) + (z.char === 'vladimir' ? 0.2 * z.mult : 0))}/с • это {fmtZ(z.m)} запоя)</span></p>
      <p>Здоровье: <b style={{ color: '#7f7', fontSize: 20 }}>{Math.ceil(z.hp)}/{z.maxhp}</b></p>
      <div className="hpbar-wrap"><div className="hpbar" style={{ width: pct + '%' }}></div></div>
      {z.char === 'ghost' && (
        <p>👻 Остатки души: <b style={{ color: '#c9f', fontSize: 20 }}>{Math.ceil(z.soul)}/100</b> <span className="hint">(душа восстанавливается, глоток её тратит; в 0 — бутылка бьётся!)</span></p>
      )}
      {z.char === 'demon' && z.demonForm > 0 && (
        <p style={{ color: 'red', fontWeight: 'bold', fontSize: 20 }}>😈 ДЕМОНИЧЕСКАЯ ФОРМА: {z.demonForm} сек — жги!</p>
      )}
      {z.char === 'vladimir' && z.sips > 0 && (
        <p className="hint">🧔 Солидность растёт: глоток сильнее, цены ниже</p>
      )}
      {z.char === 'ghost' && z.deals > 0 && (
        <p className="hint">✨ Святость: цены ниже</p>
      )}
      <p className="hint">Качай ветки — глоток сильнее, пойло добрее</p>
      <div style={{ margin: '10px 0' }}>
        {drinkImg && <img src={drinkImg} alt="Пойло персонажа" style={{ width: 120, borderRadius: 12, border: '2px solid gold', verticalAlign: 'middle' }} />}
      </div>
      <ImgButton
        img={drinkImg ?? undefined}
        imgSize={34}
        onClick={() => mutate((n) => {
          const ev = jagerClick(n);
          if (ev === 'hangover') {
            const rate = hangoverRate(n);
            const lost = n._hangoverLost ?? Math.floor(n.m * rate / (1 - rate));
            return `🤢 Похмелье! −${lost} бухла, здоровье упало. Пикулей накати!`;
          }
          if (ev === 'shattered') {
            setTimeout(onShattered, 50);
            return '💥 Бутылка разбилась! Возвращаю к выбору персонажа…';
          }
          if (ev === 'demonform') return '😈 ДЕМОНИЧЕСКАЯ ФОРМА! ЖГИ, ПОКА ЖИВ!';
          return '';
        }, 400)}
        style={{ background: 'linear-gradient(180deg,#ff7a00,#c50)', color: '#fff', fontSize: 22, padding: '14px 30px' }}
      >
        ЯГЕРМЕЙСТЕР (+{z.char === 'winline' ? '~' : ''}{sipPreview(z)})
      </ImgButton><br /><br />
    </>
  );
}
