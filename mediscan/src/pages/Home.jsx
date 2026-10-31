// Home dashboard: welcome, quick scanner card, health tips, recent scans and safety reminder.
import { Link, useNavigate } from 'react-router-dom';
import { ScanLine, Camera, Upload, QrCode, ShieldCheck, ArrowRight } from 'lucide-react';
import HealthTips from '../components/HealthTips';
import MedicineCard from '../components/MedicineCard';
import { useLang } from '../context/LanguageContext';
import { getHistory } from '../services/historyService';

export default function Home() {
  const { t } = useLang();
  const navigate = useNavigate();
  const recent = getHistory().slice(0, 3); // maximum 3 on the home page

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-copy">
          <h1>{t('home.hero_title')}</h1>
          <p>{t('home.hero_sub')}</p>
          <button className="btn btn-accent btn-lg" onClick={() => navigate('/scan')}><ScanLine size={20} /> {t('home.scan_btn')}</button>
        </div>
        <div className="hero-frame" aria-hidden="true">
          <i /><i /><i /><i />
          <QrCode size={64} strokeWidth={1.5} />
          <span className="laser" />
        </div>
      </section>

      <section className="section quick-card">
        <div className="quick-icon"><QrCode size={34} /></div>
        <div className="quick-body">
          <h2>{t('home.quick_title')}</h2>
          <p>{t('home.quick_desc')}</p>
          <ol className="quick-steps">
            <li>{t('home.step1')}</li>
            <li>{t('home.step2')}</li>
            <li>{t('home.step3')}</li>
          </ol>
          <div className="row-actions">
            <button className="btn btn-primary" onClick={() => navigate('/scan')}><Camera size={18} /> {t('home.scan_btn')}</button>
            <button className="btn btn-ghost" onClick={() => navigate('/scan')}><Upload size={18} /> {t('home.upload_btn')}</button>
          </div>
        </div>
      </section>

      <HealthTips />

      <section className="section">
        <div className="section-head">
          <h2>{t('home.recent_title')}</h2>
          <Link className="link-btn" to="/history">{t('home.view_all')} <ArrowRight size={16} /></Link>
        </div>
        {recent.length === 0 ? (
          <div className="empty"><ShieldCheck size={28} /><p>{t('home.no_recent')}</p></div>
        ) : (
          <div className="stack">{recent.map((h) => <MedicineCard key={h.scanId} item={h} />)}</div>
        )}
      </section>

      <section className="reminder">
        <div>
          <h2>{t('home.reminder_title')}</h2>
          <p>{t('home.reminder_desc')}</p>
        </div>
        <Link className="btn btn-primary" to="/help#checklist">{t('home.learn_more')}</Link>
      </section>
    </div>
  );
}
