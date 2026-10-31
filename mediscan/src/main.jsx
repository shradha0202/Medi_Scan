import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { LanguageProvider } from './context/LanguageContext';
import { PrefsProvider } from './context/PrefsContext';
import './styles/global.css';
import './styles/sidebar.css';
import './styles/dashboard.css';
import './styles/scanner.css';
import './styles/responsive.css'; // keep last so its rules override the others

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <PrefsProvider>
          <App />
        </PrefsProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>
);
