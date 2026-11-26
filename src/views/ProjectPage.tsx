import type { Locale } from '@/i18n/locales';
import { SiteShell } from '@/components/shell/SiteShell';

export function ProjectPage({ locale, slug }: { locale: Locale; slug: string }) {
  return (
    <SiteShell locale={locale} current={{ page: 'projects', slug }}>
      <h1>{slug}</h1>
    </SiteShell>
  );
}
