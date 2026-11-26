import { Chips, Key } from '@/components/djk';
import { SiteShell } from '@/components/shell/SiteShell';
import { getProject, getWork, SERVICES } from '@/content';
import { getDictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/locales';
import { href } from '@/i18n/routes';
import s from './views.module.css';

export function ServicesPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <SiteShell locale={locale} current={{ page: 'services' }}>
      <header className={s.heroCopy}>
        <h1 className="display">{dict.services.title}</h1>
        <p className={`body-lg ${s.lead}`}>{dict.services.lead}</p>
      </header>

      {SERVICES.map((svc) => (
        <section key={svc.slug} id={svc.slug} className={`djk-panel ${s.serviceSection}`}>
          <h2 className="heading-2">{svc.title[locale]}</h2>
          <span className="djk-service-cap" aria-hidden="true">
            {svc.letter}
          </span>
          <div className={s.prose}>
            <p className={s.lead}>{svc.summary[locale]}</p>
            <h3 className="eyebrow">{dict.services.getsTitle}</h3>
            <ul className={s.list}>
              {svc.gets[locale].map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
            <Chips items={svc.chips} />
            <h3 className="eyebrow">{dict.services.proofTitle}</h3>
            <div className={s.proof}>
              {svc.proof.map((p) => {
                const item = p.kind === 'work' ? getWork(p.slug) : getProject(p.slug);
                return (
                  <Key key={p.slug} size="sm" href={href(locale, { page: p.kind, slug: p.slug })}>
                    {item?.name ?? p.slug}
                  </Key>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      <div>
        <Key variant="accent" href={href(locale, { page: 'contact' })}>
          {dict.cta.startProject}
        </Key>
      </div>
    </SiteShell>
  );
}
