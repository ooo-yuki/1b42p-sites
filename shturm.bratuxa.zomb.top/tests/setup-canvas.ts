// Минимальный стаб canvas для `bun test` (в рантайме bun нет DOM).
// Ставится только если document отсутствует; браузерный код не затрагивает.
if (typeof (globalThis as Record<string, unknown>).document === 'undefined') {
  const ctxStub = (): CanvasRenderingContext2D =>
    new Proxy(
      {},
      {
        get: (_t, prop) => {
          if (typeof prop === 'symbol') return undefined;
          if (prop === 'measureText') return () => ({ width: 0 });
          if (prop === 'getImageData') return () => ({ data: [] });
          return (..._a: unknown[]) => undefined;
        },
        set: () => true,
      },
    ) as unknown as CanvasRenderingContext2D;

  (globalThis as Record<string, unknown>).document = {
    createElement: (tag: string) => {
      if (tag !== 'canvas') throw new Error(`stub document поддерживает только canvas, получено: ${tag}`);
      return {
        width: 0,
        height: 0,
        getContext: () => ctxStub(),
      };
    },
  };
}
