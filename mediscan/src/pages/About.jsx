// About page with the privacy notice and a button to delete saved data.
import { useState } from 'react';
import { Lock, FlaskConical, Trash2 } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { clearAllData } from '../services/historyService';

export default function About() {
  const { t } = useLang();
  const [cleared, setCleared] = useState(false);
  const wipe = () => { if (window.confirm(t('about.clear_confirm'))) { clearAllData(); setCleared(true); } };
  return (
    <div className="page narrow">
      <div className="page-head"><h1>{t('about.title')}</h1><p>{t('about.desc')}</p></div>
      <div className="stack">
        <section className="card help-block"><h2 className="h3"><Lock size={20} /> {t('about.privacy_title')}</h2><p>{t('about.privacy_body')}</p>
          <button className="btn btn-ghost danger-text" onClick={wipe}><Trash2 size={18} /> {t('about.clear_data')}</button>
          {cleared && <p className="notice notice-demo" role="status">{t('about.cleared')}</p>}
        </section>
        <section className="card help-block"><h2 className="h3"><FlaskConical size={20} /> {t('about.demo_title')}</h2><p>{t('about.demo_body')}</p></section>
        <p className="muted small">{t('about.version')}</p>
      </div>
    </div>
  );
}
