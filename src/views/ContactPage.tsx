import { InquiryForm } from '@/components/client/InquiryForm';
import { SiteShell } from '@/components/shell/SiteShell';
import { PROFILE } from '@/content';
import { getDictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/locales';
import { TURNSTILE_SITE_KEY } from '@/lib/site';
import s from './views.module.css';

export function ContactPage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <SiteShell locale={locale} current={{ page: 'contact' }}>
      <header className={s.heroCopy}>
        <h1 className="display">{dict.contact.title}</h1>
        <p className={`body-lg ${s.lead}`}>{dict.contact.lead}</p>
        <p className={s.lead}>
          {dict.contact.emailDirect} <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
        </p>
      </header>
      <InquiryForm locale={locale} dict={dict} siteKey={TURNSTILE_SITE_KEY} email={PROFILE.email} />
    </SiteShell>
  );
}
