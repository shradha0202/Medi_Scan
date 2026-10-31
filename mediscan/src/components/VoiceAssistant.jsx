// Floating microphone button available on every page.
// It listens for simple voice commands using the Web Speech API (where the browser supports it).
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, X } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { createRecognizer, recognitionSupported } from '../services/voiceService';

// Keywords (English, Kannada, Hindi) for each command. The first match wins, so more specific ones come first.
const COMMANDS = [
  { path: '/history', words: ['history', 'ಇತಿಹಾಸ', 'इतिहास', 'हिस्ट्री'] },
  { path: '/report', words: ['report', 'ವರದಿ', 'रिपोर्ट'] },
  { path: '/search', words: ['search', 'ಹುಡುಕ', 'खोज', 'सर्च'] },
  { path: '/language', words: ['language', 'ಭಾಷೆ', 'भाषा'] },
  { path: '/help', words: ['help', 'ಸಹಾಯ', 'मदद', 'सहायता'] },
  { path: '/scan', words: ['scan', 'ಸ್ಕ್ಯಾನ್', 'स्कैन'] },
  { path: '/', words: ['home', 'ಮುಖಪುಟ', 'होम', 'मुख्य'] },
];

export default function VoiceAssistant() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const recRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState('');
  const supported = recognitionSupported();

  useEffect(() => () => recRef.current?.abort?.(), []);

  const run = (spoken) => {
    const text = spoken.toLowerCase();
    const match = COMMANDS.find((c) => c.words.some((w) => text.includes(w)));
    setMessage(`${t('voice.heard')}: “${spoken}”`);
    if (match) { navigate(match.path); setTimeout(() => setOpen(false), 900); }
    else setMessage(`${t('voice.heard')}: “${spoken}”. ${t('voice.not_understood')}`);
  };

  const toggle = () => {
    if (!open) { setOpen(true); setMessage(''); return; }
    if (!supported) return;
    if (listening) { recRef.current?.stop(); return; }
    setMessage('');
    recRef.current = createRecognizer(lang, {
      onResult: run,
      onEnd: () => setListening(false),
      onError: (err) => { if (err === 'not-allowed' || err === 'service-not-allowed') setMessage(t('voice.mic_denied')); else if (err !== 'no-speech' && err !== 'aborted') setMessage(t('common.error')); },
    });
    try { recRef.current.start(); setListening(true); } catch { setListening(false); }
  };

  return (
    <div className="voice">
      {open && (
        <div className="voice-panel" role="dialog" aria-label={t('voice.title')}>
          <div className="voice-head">
            <strong>{t('voice.title')}</strong>
            <button className="icon-btn" onClick={() => { recRef.current?.abort?.(); setOpen(false); setListening(false); }} aria-label={t('voice.close')}><X size={18} /></button>
          </div>
          {!supported ? (
            <p className="notice notice-warn">{t('voice.unsupported')}</p>
          ) : (
            <>
              <p>{listening ? t('voice.listening') : t('voice.tap')}</p>
              {message && <p className="voice-msg" role="status">{message}</p>}
              <p className="muted small">{t('voice.hint')}</p>
            </>
          )}
        </div>
      )}
      <button className={`voice-fab ${listening ? 'listening' : ''}`} onClick={toggle} aria-label={t('voice.open')}>
        {supported || !open ? <Mic size={26} /> : <MicOff size={26} />}
      </button>
    </div>
  );
}
