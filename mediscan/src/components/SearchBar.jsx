// Search input with search icon and clear button. Calls onSearch(text) on submit and on clear.
import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

export default function SearchBar({ value = '', onSearch, autoFocus = false }) {
  const { t } = useLang();
  const [text, setText] = useState(value);
  useEffect(() => setText(value), [value]); // keep in sync with the URL on the search page

  return (
    <form className="searchbar" role="search" onSubmit={(e) => { e.preventDefault(); onSearch(text.trim()); }}>
      <Search size={18} className="searchbar-icon" />
      <input
        type="search"
        value={text}
        autoFocus={autoFocus}
        onChange={(e) => setText(e.target.value)}
        placeholder={t('nav.search_placeholder')}
        aria-label={t('nav.search_placeholder')}
      />
      {text && (
        <button type="button" className="searchbar-clear" aria-label={t('common.clear')} onClick={() => { setText(''); onSearch(''); }}>
          <X size={16} />
        </button>
      )}
    </form>
  );
}
