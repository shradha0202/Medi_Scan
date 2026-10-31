// Search page: search by medicine name, batch number or manufacturer.
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Clock, SearchX, Loader2 } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import MedicineCard from '../components/MedicineCard';
import { useLang } from '../context/LanguageContext';
import { searchMedicines } from '../services/api';
import { addRecentSearch, clearRecentSearches, getRecentSearches } from '../services/historyService';

export default function Search() {
  const { t } = useLang();
  const [params, setParams] = useSearchParams();
  const q = params.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const [recent, setRecent] = useState(getRecentSearches());

  useEffect(() => {
    if (!q.trim()) { setResults([]); return; }
    let alive = true;
    setLoading(true); setFailed(false);
    searchMedicines(q)
      .then((r) => alive && setResults(r))
      .catch(() => alive && setFailed(true))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [q]);

  const run = (text) => {
    setParams(text ? { q: text } : {});
    if (text) { addRecentSearch(text); setRecent(getRecentSearches()); }
  };

  return (
    <div className="page narrow">
      <div className="page-head"><h1>{t('search.title')}</h1><p className="muted">{t('search.hint')}</p></div>
      <SearchBar value={q} onSearch={run} autoFocus />

      {!q && recent.length > 0 && (
        <section className="section">
          <div className="section-head">
            <h2 className="h3"><Clock size={18} /> {t('search.recent')}</h2>
            <button className="link-btn" onClick={() => { clearRecentSearches(); setRecent([]); }}>{t('search.clear_recent')}</button>
          </div>
          <div className="chips">{recent.map((s) => <button key={s} className="chip" onClick={() => run(s)}>{s}</button>)}</div>
        </section>
      )}

      {loading && <div className="loading-card" role="status"><Loader2 size={32} className="spin" /><p>{t('search.searching')}</p></div>}
      {failed && <p className="notice notice-danger">{t('common.error')}</p>}
      {q && !loading && !failed && (
        results.length === 0
          ? <div className="empty"><SearchX size={28} /><p>{t('search.no_results')}</p></div>
          : (
            <section className="section">
              <p className="muted small">{t('search.results', { n: results.length })}</p>
              <div className="stack">{results.map((r) => <MedicineCard key={r.identifier} item={r} showMeta />)}</div>
            </section>
          )
      )}
    </div>
  );
}
