import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // THÊM DÒNG NÀY
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      {' '}
      {/* WRAP APP TRONG BROWSERROUTER */}
      <App />
    </BrowserRouter>
  </StrictMode>,
);
