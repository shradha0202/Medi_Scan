// Sidebar navigation. Fixed on desktop; slides in from the left on mobile (opened by the hamburger).
import { NavLink } from 'react-router-dom';
import { Home, ScanLine, History, Flag, Languages, LifeBuoy, Info, X, User, Plus } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

const ITEMS = [
  { to: '/', key: 'home', icon: Home },
  { to: '/scan', key: 'scan', icon: ScanLine },
  { to: '/history', key: 'history', icon: History },
  { to: '/report', key: 'report', icon: Flag },
  { to: '/language', key: 'language', icon: Languages },
  { to: '/help', key: 'help', icon: LifeBuoy },
  { to: '/about', key: 'about', icon: Info },
];

export default function Sidebar({ open, onClose }) {
  const { t } = useLang();
  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} aria-hidden="true" />}
      <aside className={`sidebar ${open ? 'open' : ''}`} aria-label="Main navigation">
        <div className="sidebar-top">
          <div className="logo">
            <span className="logo-mark"><Plus size={20} strokeWidth={3} /></span>
            <span className="logo-text">MediScan</span>
          </div>
          <button className="icon-btn sidebar-close" onClick={onClose} aria-label={t('nav.close')}><X size={22} /></button>
        </div>
        <nav className="sidebar-nav">
          {ITEMS.map(({ to, key, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'} onClick={onClose} className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Icon size={20} />
              <span>{t(`nav.${key}`)}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-profile">
          <span className="avatar"><User size={18} /></span>
          <div>
            <strong>{t('nav.guest')}</strong>
            <small>{t('nav.guest_sub')}</small>
          </div>
        </div>
      </aside>
    </>
  );
}
