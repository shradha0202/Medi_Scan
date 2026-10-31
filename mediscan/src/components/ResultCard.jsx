// Shows a verification result (verified / expired / not found / failed / suspicious).
// It only displays what the API returned. An unverified medicine is never shown as authentic.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ShieldAlert, ShieldX, SearchX, AlertTriangle, Volume2, VolumeX, Flag, ChevronRight, WifiOff } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { fmtDate, LOCALES, daysUntil, expiryState } from '../utils/format';
import { speak, stopSpeaking } from '../services/voiceService';

const TONE = {
  verified: { icon: ShieldCheck, tone: 'good' },
  expired: { icon: ShieldAlert, tone: 'bad' },
  not_found: { icon: SearchX, tone: 'bad' },
  failed: { icon: ShieldX, tone: 'bad' },
  suspicious: { icon: AlertTriangle, tone: 'warn' },
};

export default function ResultCard({ result, showFullLink = false, duplicateCount = 0, offlineCopy = false }) {
  const { t, lang } = useLang();
  const [reading, setReading] = useState(false);
  const [voiceNote, setVoiceNote] = useState('');
  const { status, record, identifier } = result;
  const { icon: Icon, tone } = TONE[status] || TONE.not_found;
  const locale = LOCALES[lang];
  const expiry = record ? expiryState(record.expiryDate) : 'ok';

  // Stop any speech when this card goes away.
  useEffect(() => () => stopSpeaking(), []);

  const sigText = !record ? t('result.sig_none') : t(`result.sig_${record.signature || 'none'}`);

  // Text that is read aloud (in the selected language).
  const speechText = () => {
    const parts = [t(`result.${status}_title`) + '.'];
    if (record) {
      parts.push(`${t('result.name')}: ${record.name}.`, `${t('result.batch')}: ${record.batch}.`,
        `${t('result.manufacturer')}: ${record.manufacturer}.`, `${t('result.expiry')}: ${fmtDate(record.expiryDate, locale)}.`);
    } else parts.push(`${t('result.id')}: ${identifier}.`);
    parts.push(t(`result.${status}_msg`), t('result.integrity'));
    if (record?.demo) parts.push(t('result.demo_note'));
    return parts.join(' ');
  };

  const toggleRead = () => {
    if (reading) { stopSpeaking(); setReading(false); return; }
    const r = speak(speechText(), lang, () => setReading(false));
    if (r === 'unsupported') { setVoiceNote(t('voice.tts_unsupported')); return; }
    setVoiceNote(r === 'no-voice' ? t('voice.no_voice') : '');
    setReading(true);
  };

  const reportState = { name: record?.name || '', batch: record?.batch || '', manufacturer: record?.manufacturer || '' };
  const rows = record && [
    ['name', record.name], ['batch', record.batch], ['manufacturer', record.manufacturer],
    ['mfg', fmtDate(record.manufacturedOn, locale)], ['expiry', fmtDate(record.expiryDate, locale)],
  ];

  return (
    <section className={`result tone-${tone}`} aria-live="polite">
      <header className="result-head">
        <span className="result-icon"><Icon size={30} /></span>
        <div>
          <h2>{t(`result.${status}_title`)}</h2>
          <p>{t(`result.${status}_msg`)}</p>
        </div>
      </header>

      <div className="result-body">
        {offlineCopy && <p className="notice notice-warn"><WifiOff size={16} /> {t('scan.offline_notice')}</p>}
        {duplicateCount > 0 && <p className="notice notice-warn"><AlertTriangle size={16} /> {t('result.duplicate', { n: duplicateCount })}</p>}
        {record?.demo && <p className="notice notice-demo"><strong>{t('common.demo')}.</strong> {t('result.demo_note')}</p>}

        {record ? (
          <dl className="fields">
            {rows.map(([key, val]) => (
              <div key={key} className={key === 'expiry' && expiry === 'expired' ? 'field-bad' : ''}>
                <dt>{t(`result.${key}`)}</dt>
                <dd>
                  {val}
                  {key === 'expiry' && expiry === 'expired' && <em> · {t('result.expired_on', { n: Math.abs(daysUntil(record.expiryDate)) })}</em>}
                  {key === 'expiry' && expiry === 'soon' && <em className="field-soon"> · {t('result.expires_in', { n: daysUntil(record.expiryDate) })}</em>}
                </dd>
              </div>
            ))}
            <div><dt>{t('result.status')}</dt><dd>{t(`status.${status}`)}</dd></div>
            <div><dt>{t('result.signature')}</dt><dd>{sigText}</dd></div>
          </dl>
        ) : (
          <dl className="fields"><div><dt>{t('result.id')}</dt><dd>{identifier}</dd></div></dl>
        )}

        <p className="integrity">{t('result.integrity')}</p>
        {voiceNote && <p className="notice notice-warn">{voiceNote}</p>}

        <div className="result-actions">
          {showFullLink && record && (
            <Link className="btn btn-primary" to={`/medicine/${encodeURIComponent(identifier)}`}>{t('result.view_full')} <ChevronRight size={18} /></Link>
          )}
          <button className="btn btn-ghost" onClick={toggleRead}>
            {reading ? <VolumeX size={18} /> : <Volume2 size={18} />} {reading ? t('result.stop_read') : t('result.read')}
          </button>
          <Link className={`btn ${status === 'verified' ? 'btn-ghost' : 'btn-danger'}`} to="/report" state={reportState}>
            <Flag size={18} /> {t('result.report')}
          </Link>
        </div>
      </div>
    </section>
  );
}
