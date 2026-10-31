// Full scan history with filters and search. Data comes from fetchScanHistory (LocalStorage for now).
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { History, Trash2, ScanLine, Search } from 'lucide-react';
import MedicineCard from '../components/MedicineCard';
import { useLang } from '../context/LanguageContext';
import { fetchScanHistory } from '../services/api';
import { clearHistory, getHistory } from '../services/historyService';

const FILTERS = ['all', 'verified', 'expired', 'suspicious', 'not_found'];

export default function ScanHistory() {
  const { t } = useLang();
  const [items, setItems] = useState(getHistory()); // show local data instantly
  const [filter, setFilter] = useState('all');
  const [text, setText] = useState('');

  useEffect(() => { fetchScanHistory().then(setItems).catch(() => setItems(getHistory())); }, []);

  const shown = useMemo(() => {
    const q = text.trim().toLowerCase();
    return items.filter((h) => {
      // "Suspicious" also includes failed signature checks.
      const okFilter = filter === 'all' || h.status === filter || (filter === 'suspicious' && h.status === 'failed');
      const hay = [h.record?.name, h.record?.batch, h.record?.manufacturer, h.identifier].filter(Boolean).join(' ').toLowerCase();
      return okFilter && (!q || hay.includes(q));
    });
  }, [items, filter, text]);

  const wipe = () => { if (window.confirm(t('history.clear_confirm'))) { clearHistory(); setItems([]); } };

  return (
    <div className="page narrow">
      <div className="page-head"><h1>{t('history.title')}</h1><p className="muted">{t('history.subtitle')}</p></div>
      <div className="toolbar">
        <label className="input-icon">
          <Search size={18} />
          <input className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder={t('history.search_placeholder')} aria-label={t('history.search_placeholder')} />
        </label>
        <div className="chips" role="tablist">
          {FILTERS.map((f) => (
            <button key={f} role="tab" aria-selected={filter === f} className={`chip ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{t(`history.${f}`)}</button>
          ))}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="empty"><History size={28} /><p>{t('history.empty')}</p><Link className="btn btn-primary" to="/scan"><ScanLine size={18} /> {t('history.start_scan')}</Link></div>
      ) : shown.length === 0 ? (
        <div className="empty"><Search size={28} /><p>{t('history.empty_filtered')}</p></div>
      ) : (
        <div className="stack">{shown.map((h) => <MedicineCard key={h.scanId} item={h} showMeta />)}</div>
      )}

      {items.length > 0 && <button className="btn btn-ghost danger-text" onClick={wipe}><Trash2 size={18} /> {t('history.clear')}</button>}
    </div>
  );
}
