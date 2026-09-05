import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './ui/App';
import { initScene } from './three/scene';

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

// Связка с canvas #game из index.html.
const canvas = document.getElementById('game') as HTMLCanvasElement | null;
if (canvas) initScene(canvas);
else console.error('[shturm] canvas #game не найден');
