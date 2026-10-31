// Form to report a suspicious medicine. Submission goes through api.submitReport (demo: saved locally).
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { submitReport } from '../services/api';

const REASONS = ['expired', 'qr', 'info', 'signature', 'other'];

export default function ReportMedicine() {
  const { t } = useLang();
  const { state } = useLocation(); // pre-filled when opened from a result card
  const empty = { name: state?.name || '', batch: state?.batch || '', manufacturer: state?.manufacturer || '', reason: '', description: '', image: null };
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState('idle'); // idle | sending | done
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: k === 'image' ? e.target.files?.[0] || null : e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if ((!form.name.trim() && !form.batch.trim()) || !form.reason) { setError(t('report.required')); return; }
    setError(''); setStatus('sending');
    try { await submitReport(form); setStatus('done'); }
    catch { setError(t('report.failed')); setStatus('idle'); }
  };

  if (status === 'done') {
    return (
      <div className="page narrow">
        <div className="result tone-good">
          <header className="result-head"><span className="result-icon"><CheckCircle2 size={30} /></span>
            <div><h2>{t('report.success_title')}</h2><p>{t('report.success_msg')}</p></div></header>
          <div className="result-body"><button className="btn btn-primary" onClick={() => { setForm({ ...empty, name: '', batch: '', manufacturer: '' }); setStatus('idle'); }}>{t('report.another')}</button></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page narrow">
      <div className="page-head"><h1>{t('report.title')}</h1><p className="muted">{t('report.intro')}</p></div>
      <form className="card form" onSubmit={submit}>
        <label>{t('report.name')}<input className="input" value={form.name} onChange={set('name')} /></label>
        <label>{t('report.batch')}<input className="input" value={form.batch} onChange={set('batch')} /></label>
        <label>{t('report.manufacturer')}<input className="input" value={form.manufacturer} onChange={set('manufacturer')} /></label>
        <label>{t('report.reason')}
          <select className="input" value={form.reason} onChange={set('reason')}>
            <option value="">{t('report.select')}</option>
            {REASONS.map((r) => <option key={r} value={r}>{t(`report.${r}`)}</option>)}
          </select>
        </label>
        <label>{t('report.description')}<textarea className="input" rows={4} value={form.description} onChange={set('description')} placeholder={t('report.description_ph')} /></label>
        <label>{t('report.image')}<input className="input" type="file" accept="image/*" onChange={set('image')} /></label>
        {error && <p className="notice notice-danger" role="alert">{error}</p>}
        <button className="btn btn-primary" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? <><Loader2 size={18} className="spin" /> {t('report.submitting')}</> : t('report.submit')}
        </button>
      </form>
    </div>
  );
}
