import { Key, LcdNumber, Panel } from '@/components/djk';
import { SiteShell } from '@/components/shell/SiteShell';
import { PROFILE } from '@/content';
import { getDictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/locales';
import { href } from '@/i18n/routes';
import s from './views.module.css';

export function AboutPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const facts: Array<[string, string]> = [
    [dict.about.education, PROFILE.education[locale]],
    [dict.about.training, PROFILE.training[locale]],
    [dict.about.remote, PROFILE.remote[locale]],
    [dict.about.languages, PROFILE.languages[locale]],
  ];

  return (
    <SiteShell locale={locale} current={{ page: 'about' }}>
      <header className={s.heroCopy}>
        <h1 className="display">{dict.about.title}</h1>
        <p className={`body-lg ${s.lead}`}>{dict.about.lead}</p>
      </header>

      <Panel>
        <div className={s.about}>
          <LcdNumber metric={PROFILE.gpa} />
          <dl className={s.facts}>
            {facts.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Panel>

      <div className="djk-row">
        <Key variant="accent" href={href(locale, { page: 'contact' })}>
          {dict.cta.startProject}
        </Key>
        <Key href={PROFILE.cv}>{dict.about.cv}</Key>
        <Key variant="mod" href={PROFILE.linkedin} external>
          LinkedIn
        </Key>
      </div>
    </SiteShell>
  );
}
