import { createRoot } from 'react-dom/client';
import './tw.out.css';
import Terminal from './Terminal';

const el = document.getElementById('root');
if (el) createRoot(el).render(<Terminal />);
