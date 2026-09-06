import * as THREE from 'three';

export type TexKind =
  | 'fur'
  | 'camo'
  | 'rust'
  | 'fabric'
  | 'sand'
  | 'asphalt'
  | 'sign'
  | 'wood'
  | 'palm';

const cache = new Map<TexKind, THREE.CanvasTexture>();

function canvas(n: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const c = document.createElement('canvas');
  c.width = c.height = n;
  return [c, c.getContext('2d')!];
}

function noise(ctx: CanvasRenderingContext2D, n: number, a: string, b: string): void {
  ctx.fillStyle = a;
  ctx.fillRect(0, 0, n, n);
  for (let i = 0; i < n * 12; i++) {
    ctx.fillStyle = Math.random() < 0.5 ? a : b;
    ctx.fillRect(Math.random() * n, Math.random() * n, 2, 2);
  }
}

const painters: Record<TexKind, (ctx: CanvasRenderingContext2D, n: number) => void> = {
  fur: (ctx, n) => {
    noise(ctx, n, '#6b4a2f', '#4a3120');
    ctx.strokeStyle = '#3a2617';
    for (let i = 0; i < 900; i++) {
      const x = Math.random() * n;
      const y = Math.random() * n;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 3, y + 6);
      ctx.stroke();
    }
  },
  camo: (ctx, n) => {
    noise(ctx, n, '#3a5a2e', '#3a5a2e');
    ctx.fillStyle = '#2b4222';
    for (let i = 0; i < 14; i++) {
      ctx.beginPath();
      ctx.ellipse(
        Math.random() * n,
        Math.random() * n,
        12 + Math.random() * 22,
        8 + Math.random() * 14,
        Math.random() * 3,
        0,
        7,
      );
      ctx.fill();
    }
  },
  rust: (ctx, n) => {
    noise(ctx, n, '#5a3a22', '#7a4a22');
    ctx.fillStyle = '#8a3a10';
    for (let i = 0; i < 40; i++) {
      ctx.globalAlpha = 0.5;
      ctx.fillRect(Math.random() * n, Math.random() * n, 3 + Math.random() * 10, 2 + Math.random() * 5);
    }
    ctx.globalAlpha = 1;
  },
  fabric: (ctx, n) => {
    noise(ctx, n, '#4a4a52', '#4a4a52');
    ctx.strokeStyle = '#3a3a42';
    for (let y = 0; y < n; y += 4) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(n, y);
      ctx.stroke();
    }
  },
  sand: (ctx, n) => {
    noise(ctx, n, '#c2a35e', '#a8894a');
  },
  asphalt: (ctx, n) => {
    noise(ctx, n, '#23242a', '#2e2f36');
  },
  sign: (ctx, n) => {
    ctx.fillStyle = '#0b0e1a';
    ctx.fillRect(0, 0, n, n);
    ctx.fillStyle = '#00f0ff';
    ctx.font = `bold ${n / 5}px sans-serif`;
    ctx.fillText('ШТУРМ-43', n / 10, n / 2);
  },
  wood: (ctx, n) => {
    noise(ctx, n, '#7a4a21', '#6a3d1a');
    ctx.strokeStyle = '#5a3315';
    for (let y = 0; y < n; y += 7) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(n / 3, y + 4, (2 * n) / 3, y - 4, n, y);
      ctx.stroke();
    }
  },
  palm: (ctx, n) => {
    noise(ctx, n, '#2e6b2e', '#245a24');
    ctx.strokeStyle = '#1d4a1d';
    for (let i = 0; i < 60; i++) {
      const x = Math.random() * n;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + 6, n);
      ctx.stroke();
    }
  },
};

export function getTex(kind: TexKind, size = 256): THREE.CanvasTexture {
  const hit = cache.get(kind);
  if (hit) return hit;
  const [c, ctx] = canvas(size);
  painters[kind](ctx, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  cache.set(kind, t);
  return t;
}

export function roughFrom(src: HTMLCanvasElement): THREE.CanvasTexture {
  const [c, ctx] = canvas(src.width);
  ctx.filter = 'grayscale(1)';
  ctx.drawImage(src, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}
