import type { Locale } from '@/i18n/locales';
import { SiteShell } from '@/components/shell/SiteShell';

export function ContactPage({ locale }: { locale: Locale }) {
  return (
    <SiteShell locale={locale} current={{ page: 'contact' }}>
      <h1>contact</h1>
    </SiteShell>
  );
}
