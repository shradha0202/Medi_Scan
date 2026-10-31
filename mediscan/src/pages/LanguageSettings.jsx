// Language selection and the "larger text" accessibility option.
import { Check } from 'lucide-react';
import { LANGUAGES, useLang } from '../context/LanguageContext';
import { usePrefs } from '../context/PrefsContext';

export default function LanguageSettings() {
  const { t, lang, setLang } = useLang();
  const { largeText, setLargeText } = usePrefs();
  return (
    <div className="page narrow">
      <div className="page-head"><h1>{t('lang.title')}</h1><p className="muted">{t('lang.subtitle')}</p></div>
      <div className="stack" role="radiogroup" aria-label={t('lang.title')}>
        {LANGUAGES.map((l) => (
          <button key={l.code} role="radio" aria-checked={lang === l.code} className={`lang-card ${lang === l.code ? 'active' : ''}`} onClick={() => setLang(l.code)}>
            <span className="lang-native">{l.native}</span>
            <span className="muted">{l.english}</span>
            {lang === l.code && <span className="lang-check"><Check size={16} /> {t('lang.current')}</span>}
          </button>
        ))}
      </div>
      <p className="muted small">{t('lang.voice_note')}</p>
      <label className="toggle-card">
        <span><strong>{t('lang.large_text')}</strong><br /><span className="muted small">{t('lang.large_text_desc')}</span></span>
        <input type="checkbox" role="switch" checked={largeText} onChange={(e) => setLargeText(e.target.checked)} />
      </label>
    </div>
  );
}
