import { UPGRADES, costOf, levelOf, type Branch, type Levels, type UpgradeId } from '../game/balance';

interface Props { branch: Branch; levels: Levels; coins: number; onBuy: (id: UpgradeId) => void }

const G = {
  fill: 'none', stroke: '#8a6a5a', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round',
} as const;

/** Компактные инлайн-SVG по id апгрейда, 16×16. */
function Icon({ id }: { id: UpgradeId }) {
  let p: JSX.Element;
  switch (id) {
    case 'comfort-building': p = <path d="M2 13V7l6-4.5L14 7v6z M6 13v-3.4h4V13" />; break;
    case 'comfort-chairs': p = <path d="M4 2v6h6M4 8l-1.4 5M10 8l1.4 5M4 11h7" />; break;
    case 'comfort-veranda': p = <path d="M2 6h12M3 6V4h10v2M4 6v7M12 6v7" />; break;
    case 'comfort-umbrellas': p = <path d="M8 2a6 6 0 016 6H2a6 6 0 016-6zM8 8v5" />; break;
    case 'comfort-garden': p = <path d="M8 13V7M8 7C8 4.5 6 3 3.5 3c0 2.5 2 4 4.5 4zM8 9c0-2.5 2-4 4.5-4 0 2.5-2 4-4.5 4z" />; break;
    case 'staff-waiter': p = <g><circle cx="8" cy="4.4" r="2.2" /><path d="M4 13.4c.5-2.4 2-3.6 4-3.6s3.5 1.2 4 3.6" /></g>; break;
    case 'staff-cook': p = <path d="M4.5 6.5c0-2 1.4-3 3.5-3s3.5 1 3.5 3v1h-7zM5.5 7.5V13M10.5 7.5V13M5.5 10.5h5" />; break;
    case 'staff-cleaner': p = <path d="M9.5 2.5l4 4-6.5 6.5-4-4zM5 11l-2.5 2.5" />; break;
    case 'kitchen-fridge': p = <g><rect x="4.5" y="2" width="7" height="12" rx="1" /><path d="M4.5 7h7M6.4 4.4v1.2M6.4 9v2" /></g>; break;
    case 'kitchen-stove': p = <g><rect x="3" y="5" width="10" height="8" rx="1" /><circle cx="6" cy="8.6" r="1.2" /><circle cx="10" cy="8.6" r="1.2" /></g>; break;
    case 'kitchen-pan': p = <g><circle cx="6.4" cy="9" r="3.8" /><path d="M9.8 6.8L14 2.8" /></g>; break;
    case 'menu-seasonal': p = <path d="M8 2.5c-2.6 2-4 3.9-4 5.9a4 4 0 008 0c0-2-1.4-3.9-4-5.9z" />; break;
    case 'menu-recipes': p = <path d="M4 2.5h5.5L12 5v8.5H4zM9.5 2.5V5H12M6 8h4M6 10.5h4" />; break;
    case 'menu-asian': p = <g><path d="M2 11.5c2-1 3.5-1 6-1s4 0 6 1" /><circle cx="10.6" cy="5.4" r="1.8" /><path d="M4 8.5c1.6-.8 2.8-.8 4-.8" /></g>; break;
    case 'menu-european': p = <path d="M3 13.5h10M4 13.5c0-3 1-4.5 2-6L8 5l2 2.5c1 1.5 2 3 2 6" />; break;
    case 'menu-american': p = <g><path d="M3 6.5h10v1a5 5 0 01-10 0v-1z" /><path d="M3 10.5h10" /></g>; break;
    case 'promo-ads': p = <path d="M2 4h9v6H7l-2.6 2.4v-2.4H2zM12.5 7.5h.01" />; break;
    case 'promo-flyer': p = <path d="M9.5 2.5l4 4-7 7-4-4zM8 5.5l1.5 1.5M6.5 7l1.5 1.5" />; break;
    default: p = <path d="M3 11V7l2-4 2 4v4M9 11V7l2-4 2 4v4M2 11h12v2.5H2z" />; break; // promo-music
  }
  return <svg viewBox="0 0 16 16" aria-hidden="true"><g {...G}>{p}</g></svg>;
}

function Dots({ level, max }: { level: number; max: number }) {
  return (
    <span className="dots" aria-label={`Уровень ${level} из ${max}`}>
      {Array.from({ length: max }, (_, i) => <i key={i} className={i < level ? 'on' : ''} />)}
    </span>
  );
}

const IDS = Object.keys(UPGRADES) as UpgradeId[];

export default function ShopPanel({ branch, levels, coins, onBuy }: Props) {
  const list = IDS.filter((id) => UPGRADES[id].branch === branch);
  return (
    <div className="cards">
      {list.map((id) => {
        const u = UPGRADES[id];
        const lv = levelOf(levels, id);
        const maxed = lv >= u.max;
        const cost = costOf(id, lv);
        return (
          <article key={id} className="card">
            <span className="card-icon"><Icon id={id} /></span>
            <div className="card-main">
              <div className="card-top"><b>{u.name}</b><Dots level={lv} max={u.max} /></div>
              <div className="card-fx">{u.effect}</div>
              <div className="card-row">
                <span className="price">{maxed ? 'MAX' : `${cost}`}</span>
                <button
                  className="buy"
                  disabled={maxed || coins < cost}
                  onClick={() => onBuy(id)}
                  aria-label={maxed ? `${u.name}: максимум` : `Купить ${u.name} за ${cost}`}
                >
                  {maxed ? 'MAX' : 'Взять'}
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
