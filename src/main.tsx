import './lib/leafletSafetyPatch';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeCustomizerProvider } from './context/ThemeCustomizerContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeCustomizerProvider>
      <App />
    </ThemeCustomizerProvider>
  </StrictMode>,
);
