import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="footer">
      <span>MediScan · {t('about.version')}</span>
      <span>{t('about.demo_body')}</span>
      <Link to="/about">{t('about.privacy_title')}</Link>
    </footer>
  );
}
