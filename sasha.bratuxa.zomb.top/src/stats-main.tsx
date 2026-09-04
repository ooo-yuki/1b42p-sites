import { createRoot } from 'react-dom/client';
import Stats from './Stats';

const el = document.getElementById('root');
if (el) createRoot(el).render(<Stats />);
