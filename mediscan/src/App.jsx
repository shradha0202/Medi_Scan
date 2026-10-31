// App shell: sidebar + top bar + routed pages + floating voice assistant.
import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { WifiOff } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import VoiceAssistant from './components/VoiceAssistant';
import Home from './pages/Home';
import Scanner from './pages/Scanner';
import MedicineDetails from './pages/MedicineDetails';
import Search from './pages/Search';
import ScanHistory from './pages/ScanHistory';
import ReportMedicine from './pages/ReportMedicine';
import LanguageSettings from './pages/LanguageSettings';
import Help from './pages/Help';
import About from './pages/About';
import { useLang } from './context/LanguageContext';

export default function App() {
  const { t } = useLang();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);

  // Close the mobile menu and scroll to top whenever the page changes.
  useEffect(() => { setMenuOpen(false); window.scrollTo(0, 0); }, [pathname]);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  return (
    <div className="app-shell">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="main">
        <Navbar onMenu={() => setMenuOpen(true)} />
        {!online && <div className="offline-banner" role="status"><WifiOff size={16} /> {t('common.offline_banner')}</div>}
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scan" element={<Scanner />} />
            <Route path="/medicine/:id" element={<MedicineDetails />} />
            <Route path="/search" element={<Search />} />
            <Route path="/history" element={<ScanHistory />} />
            <Route path="/report" element={<ReportMedicine />} />
            <Route path="/language" element={<LanguageSettings />} />
            <Route path="/help" element={<Help />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
      <VoiceAssistant />
    </div>
  );
}
