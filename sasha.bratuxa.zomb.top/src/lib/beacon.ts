/* 42-трекер онлайна */
export function startBeacon(site: string): void {
  try {
    let s: string | null = null;
    try {
      s = localStorage.getItem('t42_sid');
    } catch {
      s = null;
    }
    if (!s || !/^[0-9a-f]{32}$/.test(s)) {
      s = '';
      const h = '0123456789abcdef';
      for (let i = 0; i < 32; i++) s += h[Math.floor(Math.random() * 16)];
      try {
        localStorage.setItem('t42_sid', s);
      } catch {
        /* ignore */
      }
    }
    const sid = s;
    const b = () => {
      try {
        fetch('https://hub.bratuxa.zomb.top/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ site, sid }),
          keepalive: true,
        }).catch(() => {});
      } catch {
        /* ignore */
      }
    };
    b();
    setInterval(b, 30000);
  } catch {
    /* ignore */
  }
}
