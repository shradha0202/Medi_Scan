// Top bar: hamburger (mobile), brand (mobile), search, notifications (expiry alerts) and profile.
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, User, Plus } from 'lucide-react';
import SearchBar from './SearchBar';
import { useLang } from '../context/LanguageContext';
import { getHistory } from '../services/historyService';
import { daysUntil, expiryState } from '../utils/format';

// Builds expiry alerts from the medicines in the scan history (one alert per medicine).
function buildAlerts() {
  const seen = new Set();
  const alerts = [];
  for (const h of getHistory()) {
    if (!h.record || seen.has(h.identifier)) continue;
    seen.add(h.identifier);
    const state = expiryState(h.record.expiryDate);
    if (state !== 'ok') alerts.push({ id: h.identifier, state, record: h.record });
  }
  return alerts;
}

export default function Navbar({ onMenu }) {
  const { t } = useLang();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const box = useRef(null);

  // Refresh alerts each time the bell is opened, and close it when clicking elsewhere.
  useEffect(() => { setAlerts(buildAlerts()); }, [open]);
  useEffect(() => {
    const close = (e) => box.current && !box.current.contains(e.target) && setOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);
  useEffect(() => { setAlerts(buildAlerts()); }, []);

  return (
    <header className="navbar">
      <button className="icon-btn menu-btn" onClick={onMenu} aria-label={t('nav.menu')}><Menu size={24} /></button>
      <div className="navbar-brand"><span className="logo-mark small"><Plus size={14} strokeWidth={3} /></span>MediScan</div>
      <div className="navbar-search">
        <SearchBar onSearch={(q) => navigate(`/search?q=${encodeURIComponent(q)}`)} />
      </div>
      <div className="navbar-actions" ref={box}>
        <button className="icon-btn bell" onClick={() => setOpen((o) => !o)} aria-label={t('nav.notifications')} aria-expanded={open}>
          <Bell size={20} />
          {alerts.length > 0 && <span className="badge-dot">{alerts.length}</span>}
        </button>
        {open && (
          <div className="popover" role="dialog" aria-label={t('nav.notifications')}>
            <h4>{t('nav.notifications')}</h4>
            {alerts.length === 0 && <p className="muted">{t('nav.no_alerts')}</p>}
            {alerts.map((a) => (
              <button key={a.id} className={`alert-row ${a.state}`} onClick={() => { setOpen(false); navigate(`/medicine/${a.id}`); }}>
                {a.state === 'expired'
                  ? t('nav.alert_expired', { name: a.record.name, batch: a.record.batch })
                  : t('nav.alert_soon', { name: a.record.name, batch: a.record.batch, n: daysUntil(a.record.expiryDate) })}
              </button>
            ))}
          </div>
        )}
        <span className="avatar" title={t('nav.guest')}><User size={18} /></span>
      </div>
    </header>
  );
}
