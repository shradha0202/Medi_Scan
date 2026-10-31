// Help & Support: how to scan, how verification works, understanding results, FAQ and safety checklist.
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ScanLine, ShieldCheck, FileQuestion, Flag, ListChecks } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

export default function Help() {
  const { t } = useLang();
  const { hash } = useLocation();

  // Scroll to #checklist when arriving from the "Learn more" button.
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [hash]);

  const blocks = [
    { icon: ScanLine, title: 'how_title', body: 'how_body' },
    { icon: ShieldCheck, title: 'works_title', body: 'works_body' },
    { icon: FileQuestion, title: 'results_title', body: 'results_body' },
    { icon: Flag, title: 'report_title', body: 'report_body' },
  ];

  return (
    <div className="page narrow">
      <div className="page-head"><h1>{t('help.title')}</h1></div>
      <div className="stack">
        {blocks.map(({ icon: Icon, title, body }) => (
          <section key={title} className="card help-block">
            <h2 className="h3"><Icon size={20} /> {t(`help.${title}`)}</h2>
            <p>{t(`help.${body}`)}</p>
          </section>
        ))}
        <section id="checklist" className="card help-block checklist">
          <h2 className="h3"><ListChecks size={20} /> {t('help.checklist_title')}</h2>
          <ul>{[1, 2, 3, 4, 5].map((n) => <li key={n}>{t(`help.check${n}`)}</li>)}</ul>
        </section>
        <section className="card help-block">
          <h2 className="h3">{t('help.faq_title')}</h2>
          {[1, 2, 3].map((n) => (
            <details key={n}><summary>{t(`help.faq${n}_q`)}</summary><p>{t(`help.faq${n}_a`)}</p></details>
          ))}
        </section>
      </div>
    </div>
  );
}
