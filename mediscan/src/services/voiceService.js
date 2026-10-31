// Web Speech API helpers: reading aloud (speechSynthesis) and voice commands (SpeechRecognition).
import { LOCALES } from '../utils/format';

export const ttsSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window;
export const recognitionSupported = () =>
  typeof window !== 'undefined' && !!(window.SpeechRecognition || window.webkitSpeechRecognition);

// Reads text aloud. Returns 'unsupported' | 'ok' | 'no-voice' (device has no voice for that language).
export function speak(text, lang = 'en', onEnd) {
  if (!ttsSupported()) return 'unsupported';
  const synth = window.speechSynthesis;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = LOCALES[lang] || 'en-IN';
  const voices = synth.getVoices();
  const voice = voices.find((v) => v.lang.toLowerCase().startsWith(lang));
  if (voice) u.voice = voice;
  u.onend = u.onerror = () => onEnd && onEnd();
  synth.speak(u);
  return voices.length && !voice ? 'no-voice' : 'ok';
}

export const stopSpeaking = () => ttsSupported() && window.speechSynthesis.cancel();

// Creates a one-shot speech recognizer. Returns an object with start() and stop().
export function createRecognizer(lang, { onResult, onEnd, onError }) {
  const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
  const rec = new Ctor();
  rec.lang = LOCALES[lang] || 'en-IN';
  rec.interimResults = false;
  rec.maxAlternatives = 1;
  rec.onresult = (e) => onResult(e.results[0][0].transcript);
  rec.onerror = (e) => onError && onError(e.error);
  rec.onend = () => onEnd && onEnd();
  return rec;
}
