// scripts/strudel-entry.js — вход для сборки движка. Перегон:
// ./node_modules/.bin/esbuild scripts/strudel-entry.js --bundle --format=iife \
//   --global-name=TulenkoMusic --minify \
//   --outfile=tulenko.bratuxa.zomb.top/lib/strudel-bundle.js
import { initStrudel, hush } from '@strudel/web';
export async function boot() { await initStrudel(); return true; }
export function play(code) { (0, eval)(code); }
export function stop() { hush(); }
