// Scanner page: scan with camera, upload a QR image, or type the medicine ID. Then shows the result.
import { useCallback, useState } from 'react';
import { Loader2, RotateCcw, Keyboard, Info } from 'lucide-react';
import MedicineScanner from '../components/MedicineScanner';
import ResultCard from '../components/ResultCard';
import { useLang } from '../context/LanguageContext';
import { verifyMedicine } from '../services/api';
import { extractIdentifier } from '../services/scannerService';
import { countRecentScans, findSaved, recordScan } from '../services/historyService';
import { mockMedicines } from '../data/mockMedicines';
import { USING_MOCK } from '../services/api';

export default function Scanner() {
  const { t } = useLang();
  const [phase, setPhase] = useState('idle'); // idle | verifying | done
  const [result, setResult] = useState(null);
  const [dupCount, setDupCount] = useState(0);
  const [offlineCopy, setOfflineCopy] = useState(false);
  const [error, setError] = useState('');
  const [manual, setManual] = useState('');

  // Called with the text read from a QR code (camera or image) or typed by the user.
  const handleText = useCallback(async (raw) => {
    const identifier = extractIdentifier(raw);
    if (!identifier) { setError(t('scan.no_qr')); return; }
    setError('');
    setOfflineCopy(false);
    setPhase('verifying');
    try {
      if (!navigator.onLine) {
        // Offline: show only what is already saved in the local history.
        const saved = findSaved(identifier);
        if (!saved) { setError(t('scan.offline_none')); setPhase('idle'); return; }
        setResult({ status: saved.status, identifier, record: saved.record });
        setOfflineCopy(true);
        setDupCount(0);
        setPhase('done');
        return;
      }
      const res = await verifyMedicine(identifier);
      // Duplicate scan warning: the same ID scanned 3 or more times in 24 hours.
      const count = countRecentScans(identifier) + 1;
      const duplicate = count >= 3;
      const status = duplicate && res.status === 'verified' ? 'suspicious' : res.status;
      const final = { ...res, status, duplicate };
      recordScan(final);
      setDupCount(duplicate ? count : 0);
      setResult(final);
      setPhase('done');
    } catch {
      setError(t('common.error'));
      setPhase('idle');
    }
  }, [t]);

  const reset = () => { setPhase('idle'); setResult(null); setError(''); setManual(''); };

  if (phase === 'verifying') {
    return (
      <div className="page narrow">
        <div className="loading-card" role="status">
          <Loader2 size={40} className="spin" />
          <h2>{t('scan.verifying')}</h2>
        </div>
      </div>
    );
  }

  if (phase === 'done' && result) {
    return (
      <div className="page narrow">
        <ResultCard result={result} showFullLink duplicateCount={dupCount} offlineCopy={offlineCopy} />
        <button className="btn btn-primary scan-again" onClick={reset}><RotateCcw size={18} /> {t('scan.scan_again')}</button>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-head">
        <h1>{t('scan.title')}</h1>
        <p className="muted">{t('scan.subtitle')}</p>
      </div>
      {error && <p className="notice notice-danger" role="alert">{error}</p>}
      <div className="scan-layout">
        <div className="card"><MedicineScanner onDetected={handleText} /></div>
        <div className="scan-side">
          <form className="card" onSubmit={(e) => { e.preventDefault(); handleText(manual); }}>
            <h3><Keyboard size={18} /> {t('scan.manual_title')}</h3>
            <p className="muted small">{t('scan.manual_hint')}</p>
            <div className="inline-form">
              <input className="input" value={manual} onChange={(e) => setManual(e.target.value)} placeholder={t('scan.manual_placeholder')} aria-label={t('scan.manual_title')} />
              <button className="btn btn-primary" type="submit" disabled={!manual.trim()}>{t('scan.verify')}</button>
            </div>
            {USING_MOCK && (
              <>
                <p className="muted small">{t('scan.demo_ids')}</p>
                <div className="chips">
                  {mockMedicines.map((m) => <button type="button" key={m.id} className="chip" onClick={() => handleText(m.id)}>{m.id}</button>)}
                  <button type="button" className="chip" onClick={() => handleText('MS-UNKNOWN-0000')}>MS-UNKNOWN-0000</button>
                </div>
              </>
            )}
          </form>
          <div className="card guide">
            <h3><Info size={18} /> {t('scan.guide_title')}</h3>
            <ul>
              <li>{t('scan.guide1')}</li><li>{t('scan.guide2')}</li><li>{t('scan.guide3')}</li><li>{t('scan.guide4')}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
