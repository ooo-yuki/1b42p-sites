import { createRoot } from 'react-dom/client';
import './tw.out.css';
import './style.css';
import Defense from './Defense';

const el = document.getElementById('root');
if (el) createRoot(el).render(<Defense />);
