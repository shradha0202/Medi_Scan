// A compact card for one medicine (used in recent scans, history and search results).
// `item` = { identifier, status, record, scannedAt? }
import { Link } from 'react-router-dom';
import { Pill, ChevronRight } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { useLang } from '../context/LanguageContext';
import { fmtDate, fmtDateTime, LOCALES, expiryState } from '../utils/format';

export default function MedicineCard({ item, showMeta = false }) {
  const { t, lang } = useLang();
  const r = item.record;
  const expiry = r ? expiryState(r.expiryDate) : 'ok';
  return (
    <article className="med-card">
      <span className="med-icon"><Pill size={22} /></span>
      <div className="med-main">
        <h3>{r ? r.name : t('common.unknown')}</h3>
        <p className="muted">
          {r ? `${t('result.batch')}: ${r.batch}` : `${t('result.id')}: ${item.identifier}`}
          {showMeta && r ? ` · ${r.manufacturer}` : ''}
        </p>
        <p className="muted small">
          {item.scannedAt && <>{t('history.scanned_on')}: {fmtDateTime(item.scannedAt, LOCALES[lang])}</>}
          {r && !item.scannedAt && <>{t('result.expiry')}: {fmtDate(r.expiryDate, LOCALES[lang])}</>}
          {r && item.scannedAt && expiry !== 'ok' && <span className={`expiry-note ${expiry}`}> · {t('result.expiry')}: {fmtDate(r.expiryDate, LOCALES[lang])}</span>}
        </p>
      </div>
      <div className="med-side">
        <StatusBadge status={item.status} />
        <Link className="btn btn-ghost btn-sm" to={`/medicine/${encodeURIComponent(item.identifier)}`}>
          {t('home.view_details')} <ChevronRight size={16} />
        </Link>
      </div>
    </article>
  );
}
