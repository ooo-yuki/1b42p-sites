export function Hud({ hp, wave, ammo, slot }: { hp: number; wave: number; ammo: number; slot: string }) {
  return (<div style={{ position: 'fixed', top: 8, left: 8, color: '#fff', fontFamily: 'system-ui' }}>
    <div>HP {hp} | Волна {wave}/7 | {slot} [{ammo}]</div>
    <div style={{ fontSize: 12 }}>V — 1/3 лицо • 1/2/3 — оружие • R — перезарядка 🏆</div>
  </div>);
}
