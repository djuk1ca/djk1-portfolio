import type { Locale } from '@/i18n/locales';
import { SiteShell } from '@/components/shell/SiteShell';

export function ServicesPage({ locale }: { locale: Locale }) {
  return (
    <SiteShell locale={locale} current={{ page: 'services' }}>
      <h1>services</h1>
    </SiteShell>
  );
}
