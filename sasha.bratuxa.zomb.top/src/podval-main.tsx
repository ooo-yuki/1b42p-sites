import { createRoot } from 'react-dom/client';
import './tw.out.css';
import Podval from './Podval';

const el = document.getElementById('root');
if (el) createRoot(el).render(<Podval />);
