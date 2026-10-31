// Small helpers for dates and formatting.
export const LOCALES = { en: 'en-IN', kn: 'kn-IN', hi: 'hi-IN' };

export const fmtDate = (iso, locale) =>
  iso ? new Date(iso).toLocaleDateString(locale, { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

export const fmtDateTime = (iso, locale) =>
  iso
    ? new Date(iso).toLocaleString(locale, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '—';

// Whole days from today until the date (negative = already expired).
export const daysUntil = (iso) => Math.ceil((new Date(iso).setHours(23, 59, 59, 999) - Date.now()) / 86400000);

// 'expired' | 'soon' (within 60 days) | 'ok'
export const expiryState = (iso) => {
  if (!iso) return 'ok';
  const d = daysUntil(iso);
  return d < 0 ? 'expired' : d <= 60 ? 'soon' : 'ok';
};
