/* дождь 42 строго по клеткам сетки 64px */
const CELL = 64;

interface Drop {
  x: number;
  y: number;
  vy: number;
  s: number;
  r: boolean;
  deep: boolean;
}

export class Rain {
  private ctx: CanvasRenderingContext2D;
  private drops: Drop[] = [];
  private raf = 0;
  private timer: ReturnType<typeof setInterval> | null = null;
  private dead = false;

  constructor(private cv: HTMLCanvasElement) {
    const ctx = cv.getContext('2d');
    if (!ctx) throw new Error('no 2d context');
    this.ctx = ctx;
    this.fit();
    window.addEventListener('resize', this.fit);
    for (let i = 0; i < 42; i++) {
      this.spawn(Math.random() * window.innerWidth, Math.random() * window.innerHeight, false);
    }
    this.timer = setInterval(() => {
      if (this.drops.length < 140) this.spawn(null, null, false);
    }, 450);
    this.loop();
  }

  private fit = (): void => {
    this.cv.width = window.innerWidth;
    this.cv.height = window.innerHeight;
  };

  private colX(x: number): number {
    return Math.round(x / CELL) * CELL + CELL / 2;
  }

  spawn(x: number | null, y: number | null, big: boolean): void {
    const px = x == null
      ? Math.floor(Math.random() * Math.ceil(this.cv.width / CELL)) * CELL + CELL / 2
      : this.colX(x);
    this.drops.push({
      x: px,
      y: y == null ? -50 : y,
      vy: (big ? 2.2 : 0.9) + Math.random() * (big ? 1.6 : 1.4),
      s: big ? 44 + Math.random() * 38 : 13 + Math.random() * 24,
      r: Math.random() < 0.5,
      deep: Math.random() < 0.4,
    });
  }

  burst(x: number, y: number): void {
    for (let i = 0; i < 24; i++) this.spawn(x, y, false);
  }

  private loop = (): void => {
    if (this.dead) return;
    const { ctx, cv } = this;
    ctx.clearRect(0, 0, cv.width, cv.height);
    for (let i = this.drops.length - 1; i >= 0; i--) {
      const p = this.drops[i];
      p.y += p.vy * (p.deep ? 0.6 : 1);
      if (p.y > cv.height + 60) {
        this.drops.splice(i, 1);
        continue;
      }
      ctx.font = `700 ${p.s}px "Segoe UI",system-ui,sans-serif`;
      ctx.textAlign = 'center';
      ctx.globalAlpha = p.deep ? 0.45 : 0.9;
      ctx.fillStyle = p.r ? '#ff5a5a' : '#5b93ff';
      ctx.shadowColor = p.r ? '#ff2a2a' : '#2a5bff';
      ctx.shadowBlur = 12;
      ctx.fillText('42', p.x, p.y);
    }
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
    this.raf = requestAnimationFrame(this.loop);
  };

  destroy(): void {
    this.dead = true;
    cancelAnimationFrame(this.raf);
    if (this.timer) clearInterval(this.timer);
    window.removeEventListener('resize', this.fit);
  }
}
