// Full details of one medicine. Uses the API; falls back to the saved scan history when offline.
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import ResultCard from '../components/ResultCard';
import { useLang } from '../context/LanguageContext';
import { getMedicine } from '../services/api';
import { findSaved } from '../services/historyService';

export default function MedicineDetails() {
  const { id } = useParams();
  const { t } = useLang();
  const navigate = useNavigate();
  const [state, setState] = useState({ loading: true, result: null, offline: false });

  useEffect(() => {
    let alive = true;
    const useSaved = () => {
      const saved = findSaved(id);
      if (alive) setState({ loading: false, offline: !!saved, result: saved ? { status: saved.status, identifier: id, record: saved.record } : null });
    };
    setState({ loading: true, result: null, offline: false });
    if (!navigator.onLine) { useSaved(); return () => { alive = false; }; }
    getMedicine(id)
      .then((r) => alive && setState({ loading: false, result: r, offline: false }))
      .catch(useSaved);
    return () => { alive = false; };
  }, [id]);

  return (
    <div className="page narrow">
      <button className="link-btn back" onClick={() => navigate(-1)}><ArrowLeft size={16} /> {t('common.back')}</button>
      {state.loading && <div className="loading-card" role="status"><Loader2 size={36} className="spin" /><p>{t('common.loading')}</p></div>}
      {!state.loading && !state.result && <p className="notice notice-danger">{t('result.not_available')}</p>}
      {state.result && <ResultCard result={state.result} offlineCopy={state.offline} />}
    </div>
  );
}
