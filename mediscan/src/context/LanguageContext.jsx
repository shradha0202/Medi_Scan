// Provides the current language and the t() translate function to the whole app.
// To add a language: create src/translations/xx.json and add one line to LANGUAGES below.
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import en from '../translations/en.json';
import kn from '../translations/kn.json';
import hi from '../translations/hi.json';

export const LANGUAGES = [
  { code: 'en', native: 'English', english: 'English', dict: en },
  { code: 'kn', native: 'ಕನ್ನಡ', english: 'Kannada', dict: kn },
  { code: 'hi', native: 'हिन्दी', english: 'Hindi', dict: hi },
];

const LanguageContext = createContext(null);
const lookup = (dict, path) => path.split('.').reduce((o, k) => (o ? o[k] : undefined), dict);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('mediscan.lang');
    return LANGUAGES.some((l) => l.code === saved) ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('mediscan.lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  // t('home.hero_title') or t('result.expires_in', { n: 5 }). Falls back to English, then to the key.
  const t = useCallback(
    (key, vars = {}) => {
      const dict = LANGUAGES.find((l) => l.code === lang).dict;
      const text = lookup(dict, key) ?? lookup(en, key) ?? key;
      return String(text).replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? vars[k] : `{${k}}`));
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLang = () => useContext(LanguageContext);
