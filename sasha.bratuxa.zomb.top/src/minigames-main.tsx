import { createRoot } from 'react-dom/client';
import './tw.out.css';
import Minigames from './Minigames';

const el = document.getElementById('root');
if (el) createRoot(el).render(<Minigames />);
