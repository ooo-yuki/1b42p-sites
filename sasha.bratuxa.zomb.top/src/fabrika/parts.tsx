import type { JSX } from 'react';
import {
  Coins, Crown, Database, Dumbbell, Flame, Footprints, Headphones, Heart, Lock, Megaphone, Mic, Scissors,
  Shield, Shirt, Sparkles, Tent, Ticket, Trophy, Users, Warehouse, Wind, Zap,
  type LucideIcon,
} from 'lucide-react';
import { fmt, lvlCost, unlocked, type Save } from './formulas';
import { VENUES, type ShopItem, type Venue } from './content';

export const VENUE_ICONS: Record<string, LucideIcon> = {
  garage: Warehouse,
  club: Tent,
  arena: Trophy,
  slay: Crown,
  stadium: Trophy,
  kuzbass: Crown,
};

const SHOP_ICONS: Record<string, LucideIcon> = {
  denis: Mic,
  freak: Sparkles,
  oper: Headphones,
  guard: Shield,
  piar: Megaphone,
  jacket: Shirt,
  mantle: Crown,
  sneakers: Footprints,
  hair: Scissors,
  chains: Coins,
  arena: Trophy,
  banka: Database,
  garden: Wind,
  club: Heart,
};

/* Липкая мачта-афиша + пилюли ресурсов. id те же, что в legacy. */
export function Masthead(props: { h: number; f: number; fans: number; seasons?: number }): JSX.Element {
  return (
    <div id="top">
      <h1>
        <span className="k">42 БРАТУХА</span>
        <span className="title-row">
          <Trophy data-icon="inline-start" aria-hidden size={30} />
          ФАБРИКА ХАЙПА
        </span>
      </h1>
      <div id="res">
        <span className="pill">
          <Flame data-icon="inline-start" aria-hidden /> Хайп: <b id="rH">{fmt(props.h)}</b>
        </span>
        <span className="pill">
          <Ticket data-icon="inline-start" aria-hidden /> Фантики: <b id="rF">{fmt(props.f)}</b>
        </span>
        <span className="pill">
          <Users data-icon="inline-start" aria-hidden /> Фанаты: <b id="rFans">{fmt(props.fans)}</b>
        </span>
        <span className="pill">
          <Zap data-icon="inline-start" aria-hidden /> Комбо: <b id="rC">0</b>
        </span>
        {(props.seasons ?? 0) > 0 ? (
          <span className="pill">
            <Trophy data-icon="inline-start" aria-hidden /> Сезон: <b id="rS">{props.seasons}</b>
          </span>
        ) : null}
      </div>
    </div>
  );
}

function ShopRow(props: {
  icon: LucideIcon;
  item: ShopItem;
  lv: number;
  max: number;
  cost: string;
  cur: string;
  onBuy: () => void;
}): JSX.Element {
  const Icon = props.icon;
  return (
    <div className="frow">
      <b>
        <Icon data-icon="inline-start" aria-hidden size={16} /> {props.item.n}
      </b>{' '}
      <span data-slot="badge" className="lvl">
        {props.lv}/{props.max}
      </span>
      <span className="hint">{props.item.d}</span>
      {props.lv >= props.max ? (
        <b style={{ color: '#fff' }}>MAX — полный кач</b>
      ) : (
        <button className="buy" onClick={props.onBuy}>
          <Dumbbell data-icon="inline-start" aria-hidden size={16} /> Улучшить: {props.cost} {props.cur}
        </button>
      )}
    </div>
  );
}

/* Магазин 1:1 с legacy shopList: уровни, цены ×3, MAX. */
export function Shop(props: {
  id: string;
  items: Record<string, ShopItem>;
  lvls: Record<string, number>;
  isF: boolean;
  seasons?: number;
  onBuy: (key: string) => void;
}): JSX.Element {
  return (
    <div className="shop" id={props.id}>
      {Object.entries(props.items).map(([key, o]) => {
        const need = o.needSeasons ?? 0;
        if (need > (props.seasons ?? 0)) {
          const Icon = SHOP_ICONS[key] ?? Sparkles;
          return (
            <div className="frow" key={key}>
              <b>
                <Icon data-icon="inline-start" aria-hidden size={16} /> {o.n}
              </b>{' '}
              <span className="hint">{o.d}</span>
              <span className="lock">
                <Lock data-icon="inline-start" aria-hidden size={14} /> Откроется в сезоне {need}
              </span>
            </div>
          );
        }
        const lv = props.lvls[key] ?? 0;
        const max = 3;
        const cost = lvlCost(o.base, lv);
        return (
          <ShopRow
            key={key}
            icon={SHOP_ICONS[key] ?? Sparkles}
            item={o}
            lv={lv}
            max={max}
            cost={fmt(cost)}
            cur={props.isF ? 'фантиков' : 'хайпа'}
            onBuy={() => props.onBuy(key)}
          />
        );
      })}
    </div>
  );
}

/* Площадки 1:1 с legacy renderVenues: те же строки, те же замки. */
export function Venues(props: { save: Save; onShow: (v: Venue) => void }): JSX.Element {
  return (
    <div data-slot="card" className="venue-card">
      <h3>
        <Mic data-icon="inline-start" aria-hidden size={16} /> Площадки
      </h3>
      <div id="venues">
        {VENUES.map((v) => {
          const u = unlocked(props.save, v);
          const Icon = VENUE_ICONS[v.id] ?? Tent;
          return (
            <div key={v.id} className="frow">
              <b>
                <Icon data-icon="inline-start" aria-hidden size={16} /> {v.n}
              </b>
              <span className="hint">
                Темп {v.speed} · зона {v.zone}% · нота каждые ~{v.gap}с · база {v.base} хайпа
                {v.cost ? ` · вход ${fmt(v.cost)} хайпа` : ''}
              </span>
              {u.ok ? (
                <button className="buy" onClick={() => props.onShow(v)}>
                  {u.buy ? 'Открыть и выступить' : 'Выступить'}
                </button>
              ) : (
                <span className="lock">
                  <Lock data-icon="inline-start" aria-hidden size={14} /> {u.why}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
