export function Hud({ hp, wave, ammo, slot, reserve, kills, enemies, fps, map, message }: {
  hp: number; wave: number; ammo: number; slot: string;
  reserve?: number; kills?: number; enemies?: number; fps?: number; map?: string; message?: string;
}) {
  const low = hp <= 30;
  return (<div style={{ position: 'fixed', top: 8, left: 8, color: '#fff', fontFamily: 'system-ui', zIndex: 5 }}>
    <div style={{
      background: low ? 'rgba(160,20,20,0.75)' : 'rgba(0,0,0,0.45)',
      padding: '6px 10px', borderRadius: 8, fontSize: 15,
    }}>
      HP {hp} | Волна {wave}/7 | {slot} [{ammo}{reserve !== undefined ? `+${reserve}` : ''}]
      {kills !== undefined ? ` | frags ${kills}` : ''}
      {enemies !== undefined ? ` | мобы ${enemies}` : ''}
    </div>
    <div style={{ fontSize: 12, marginTop: 4, opacity: 0.85 }}>
      V — 1/3 лицо • 1/2/3 — оружие • R — перезарядка 🏆
      {fps !== undefined ? ` • ${fps} FPS` : ''}{map ? ` • ${map}` : ''}
    </div>
    {message ? <div style={{ fontSize: 13, marginTop: 4, color: '#ffd166' }}>{message}</div> : null}
  </div>);
}
