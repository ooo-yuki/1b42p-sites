import { createRoot } from 'react-dom/client';
import Game from './Game';

const el = document.getElementById('root');
if (el) createRoot(el).render(<Game />);
