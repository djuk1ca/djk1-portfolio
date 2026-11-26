import type { Locale } from '@/i18n/locales';
import { SiteShell } from '@/components/shell/SiteShell';

export function WorkPage({ locale, slug }: { locale: Locale; slug: string }) {
  return (
    <SiteShell locale={locale} current={{ page: 'work', slug }}>
      <h1>{slug}</h1>
    </SiteShell>
  );
}
