// Accessibility preference: larger text. Saved in LocalStorage.
import { createContext, useContext, useEffect, useState } from 'react';

const PrefsContext = createContext(null);

export function PrefsProvider({ children }) {
  const [largeText, setLargeText] = useState(() => localStorage.getItem('mediscan.largeText') === 'true');

  useEffect(() => {
    localStorage.setItem('mediscan.largeText', String(largeText));
    document.documentElement.dataset.large = String(largeText);
  }, [largeText]);

  return <PrefsContext.Provider value={{ largeText, setLargeText }}>{children}</PrefsContext.Provider>;
}

export const usePrefs = () => useContext(PrefsContext);
