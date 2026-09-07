import { createRoot } from 'react-dom/client';
import './tw.out.css';
import Fabrika from './Fabrika';

const el = document.getElementById('root');
if (el) createRoot(el).render(<Fabrika />);
