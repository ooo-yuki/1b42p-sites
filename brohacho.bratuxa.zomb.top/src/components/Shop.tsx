import type { JSX } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { lvlCost } from '../game/formulas';
import { fmt } from '../game/formulas';
import type { ShopItem } from '../game/content';

/* Магазин 1:1 с legacy shopList: уровни, цены ×3, MAX. */
export function Shop(props: {
  id: string;
  items: Record<string, ShopItem>;
  lvls: Record<string, number>;
  isF: boolean;
  onBuy: (key: string) => void;
}): JSX.Element {
  return (
    <div className="shop" id={props.id}>
      {Object.entries(props.items).map(([key, o]) => {
        const lv = props.lvls[key] ?? 0;
        const max = 3;
        const cost = lvlCost(o.base, lv);
        return (
          <Card key={key} size="sm">
            <b>
              {o.em} {o.n}
            </b>{' '}
            <Badge className="lvl" data-icon="none">
              {lv}/{max}
            </Badge>
            <br />
            <span className="hint">{o.d}</span>
            <br />
            {lv >= max ? (
              <b style={{ color: 'gold' }}>MAX 🏆</b>
            ) : (
              <Button className="buy" onClick={() => props.onBuy(key)} data-icon="inline-start">
                Улучшить: {fmt(cost)}
                {props.isF ? ' 🎟️' : ' 🔥'}
              </Button>
            )}
          </Card>
        );
      })}
    </div>
  );
}
