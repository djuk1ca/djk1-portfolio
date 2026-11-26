import type { Locale } from '@/i18n/locales';
import { SiteShell } from '@/components/shell/SiteShell';

export function AboutPage({ locale }: { locale: Locale }) {
  return (
    <SiteShell locale={locale} current={{ page: 'about' }}>
      <h1>about</h1>
    </SiteShell>
  );
}
