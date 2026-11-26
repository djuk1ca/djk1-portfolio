import { Cursor, Key, Lcd } from '@/components/djk';
import { SiteShell } from '@/components/shell/SiteShell';
import { getDictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/locales';
import { href } from '@/i18n/routes';
import s from './views.module.css';

export function NotFoundPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <SiteShell locale={locale} current={{ page: 'home' }}>
      <header className={s.heroCopy}>
        <Lcd className="lcd">
          &gt; 404
          <Cursor />
        </Lcd>
        <h1 className="display">{dict.notFound.title}</h1>
        <p className={`body-lg ${s.lead}`}>{dict.notFound.lead}</p>
        <div className="djk-row">
          <Key variant="accent" href={href(locale, { page: 'home' })}>
            {dict.cta.backHome}
          </Key>
        </div>
      </header>
    </SiteShell>
  );
}
