// "Small Habits, Healthier Living": a daily tip (can be changed) plus expandable tip cards.
import { useState } from 'react';
import { Droplets, Moon, Apple, Footprints, Leaf, Lightbulb } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

const TIPS = [
  { id: 'hydration', icon: Droplets },
  { id: 'sleep', icon: Moon },
  { id: 'diet', icon: Apple },
  { id: 'movement', icon: Footprints },
  { id: 'tulsi', icon: Leaf },
];

export default function HealthTips() {
  const { t } = useLang();
  // The first "tip of the day" depends on today's date; the button cycles to the next one.
  const [daily, setDaily] = useState(Math.floor(Date.now() / 86400000) % TIPS.length);
  const [openId, setOpenId] = useState(null);
  const featured = TIPS[daily];
  const FeaturedIcon = featured.icon;

  return (
    <section className="section">
      <h2>{t('home.tips_title')}</h2>
      <div className="daily-tip">
        <span className="daily-icon"><FeaturedIcon size={26} /></span>
        <div>
          <small><Lightbulb size={14} /> {t('home.tip_of_day')}</small>
          <h3>{t(`tips.${featured.id}.title`)}</h3>
          <p>{t(`tips.${featured.id}.desc`)}</p>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={() => setDaily((d) => (d + 1) % TIPS.length)}>{t('home.another_tip')}</button>
      </div>
      <div className="tips-grid">
        {TIPS.map(({ id, icon: Icon }) => (
          <article key={id} className="tip-card">
            <span className="tip-icon"><Icon size={20} /></span>
            <h3>{t(`tips.${id}.title`)}</h3>
            <p className="muted">{t(`tips.${id}.desc`)}</p>
            {openId === id && <p className="tip-more">{t(`tips.${id}.more`)}</p>}
            <button className="link-btn" onClick={() => setOpenId(openId === id ? null : id)} aria-expanded={openId === id}>
              {openId === id ? t('home.read_less') : t('home.read_more')}
            </button>
          </article>
        ))}
      </div>
      <p className="muted small">{t('home.tips_note')}</p>
    </section>
  );
}
