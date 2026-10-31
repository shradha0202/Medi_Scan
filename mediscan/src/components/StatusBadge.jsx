// Small coloured label for a verification status.
import { useLang } from '../context/LanguageContext';

export default function StatusBadge({ status }) {
  const { t } = useLang();
  return <span className={`status-badge s-${status}`}>{t(`status.${status}`)}</span>;
}
