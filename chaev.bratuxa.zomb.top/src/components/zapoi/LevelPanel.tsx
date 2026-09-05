// Уровни запоя: бейдж стадии, выхлоп, прогресс и кнопка перехода (бесплатно),
// плюс предложение «с рук» — взять или пропустить.
import { LEVELS, LAST_LVL, advanceLevel, canAdvance, hiddenById, lvlMult, skipOffer, takeOffer } from '../../game/zapoi/index';
import type { ZapoiState } from '../../game/zapoi/index';
import type { MutateFn } from '../../hooks/useZapoiState';

interface LevelPanelProps {
  z: ZapoiState;
  mutate: MutateFn;
}

export default function LevelPanel({ z, mutate }: LevelPanelProps) {
  const lvl = Math.max(0, Math.min(LAST_LVL, z.lvl ?? 0));
  const def = LEVELS[lvl];
  const out = Math.round(lvlMult(z) * 100);
  const canGo = canAdvance(z);
  const next = lvl < LAST_LVL ? LEVELS[lvl + 1] : null;
  const need = lvl < LAST_LVL ? LEVELS[lvl].need : 0;
  const prog = lvl < LAST_LVL ? Math.min(100, Math.floor(((z.earned ?? 0) / need) * 100)) : 100;
  const offer = z.offer ? hiddenById(z.offer) : undefined;

  return (
    <div style={{ border: '2px solid gold', borderRadius: 12, padding: 10, margin: '10px 0', background: 'rgba(60,30,0,.35)' }}>
      <p style={{ margin: '4px 0' }}>
        <b style={{ fontSize: 18 }}>{def.emoji} Уровень запоя: {def.name}</b>{' '}
        <span className="hint">({lvl + 1}/5)</span>
      </p>
      <p className="hint" style={{ margin: '4px 0' }}>{def.desc}</p>
      <p style={{ margin: '4px 0' }}>
        Выхлоп организма: <b style={{ color: out > 50 ? '#7f7' : out > 0 ? 'orange' : 'red' }}>{out}%</b>{' '}
        <span className="hint">(со временем падает до 0 — глоток и пассив сохнут, жать можно всегда)</span>
      </p>
      {next && (
        <>
          <div className="hpbar-wrap"><div className="hpbar" style={{ width: prog + '%' }}></div></div>
          <p className="hint" style={{ margin: '4px 0' }}>
            Нагнано за забег: {Math.floor(z.earned ?? 0).toLocaleString('ru-RU')} / {need.toLocaleString('ru-RU')} до «{next.emoji} {next.name}»
          </p>
          {canGo && (
            <button
              onClick={() => mutate((n) => {
                const got = advanceLevel(n);
                const nl = LEVELS[Math.min(LAST_LVL, n.lvl ?? 0)];
                return `🌀 Переход: «${nl.emoji} ${nl.name}»! Выхлоп свежий — 100%.` +
                  (got && hiddenById(got) ? ` Тебе кое-что предлагают с рук: ${hiddenById(got)!.name} 👀` : '');
              }, 600)}
              style={{ background: 'linear-gradient(180deg,#ffd23f,#c80)', fontSize: 18, padding: '12px 26px', marginTop: 4 }}
            >
              🌀 УГЛУБИТЬСЯ: {next.emoji} {next.name} (бесплатно)
            </button>
          )}
        </>
      )}
      {!next && (
        <p className="hint" style={{ margin: '4px 0' }}>👁️ Делирий — дно достигнуто. Здесь бьётся бутылка 💥</p>
      )}
      {offer && (
        <div style={{ border: '2px dashed #c9f', borderRadius: 10, padding: 8, marginTop: 8 }}>
          <p style={{ margin: '4px 0' }}><b>🤝 Предлагают с рук: {offer.name}</b></p>
          <p className="hint" style={{ margin: '4px 0' }}>{offer.desc} В магазине такого нет. Бесплатно, раз за забег.</p>
          <button
            onClick={() => mutate((n) => {
              const a = takeOffer(n);
              return a ? `🤝 Взял «с рук»: ${a.name}! ${a.desc}` : 'Уже разобрали…';
            }, 700)}
            style={{ background: 'linear-gradient(180deg,#39d353,#173)', color: '#fff', fontSize: 16, padding: '10px 22px', marginRight: 8 }}
          >
            ВЗЯТЬ
          </button>
          <button
            onClick={() => mutate((n) => { skipOffer(n); return 'Отказался. Предложение ушло — а уровень остался.'; }, 300)}
            style={{ fontSize: 16, padding: '10px 22px' }}
          >
            ПРОПУСТИТЬ
          </button>
        </div>
      )}
    </div>
  );
}
