import { createRoot } from 'react-dom/client';
import Landing from './Landing';

const el = document.getElementById('root');
if (el) createRoot(el).render(<Landing />);
