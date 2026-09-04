import type { JSX } from 'react';
import {
  Anchor, Bird, Bomb, Briefcase, Cherry, CircleDot, CircleStar, Clover, Coins,
  Crosshair, Crown, Dices, Flag, Flame, Footprints, Gem, HardHat, Map, Medal,
  Package, Rabbit, Radio, Rocket, Shield, Star, Tornado, Trophy, Truck, Wrench,
  type LucideIcon,
} from 'lucide-react';

const MAP: Record<string, LucideIcon> = {
  barracks: Package,
  arsenal: Wrench,
  hq42: Briefcase,
  hardhat: HardHat,
  boots: Footprints,
  medal: Medal,
  flame: Flame,
  coins: Coins,
  glock: Crosshair,
  vest: Shield,
  truck: Truck,
  rocket: Rocket,
  crown: Crown,
  radio: Radio,
  map: Map,
  anchor: Anchor,
  eagle: Bird,
  jackpot: Trophy,
  tornado: Tornado,
  wheel: CircleDot,
  rabbit: Rabbit,
  star: Star,
  cherry: Cherry,
  clover: Clover,
  dices: Dices,
  seven: CircleStar,
  gem: Gem,
  bomb: Bomb,
  flag: Flag,
};

export function ItemIcon({ name, className }: { name: string; className?: string }): JSX.Element {
  const C = MAP[name] ?? Star;
  return <C className={className ?? 'cic'} aria-hidden />;
}

export function iconNameForDrop(label: string): string {
  const m: Record<string, string> = {
    'Каска': 'hardhat', 'Берцы': 'boots', 'Медалька': 'medal', 'Запал': 'flame',
    'Касса части': 'coins', 'Глок': 'glock', 'Броник': 'vest', 'Урал': 'truck',
    'Ракета': 'rocket', 'Звезда генерала': 'crown', 'Рация': 'radio', 'Карта': 'map',
    'Якорь Авроры': 'anchor', 'Орёл': 'eagle', 'Джекпот 42': 'jackpot',
  };
  return m[label] ?? 'star';
}
