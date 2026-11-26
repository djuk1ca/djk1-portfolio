import type { MetadataRoute } from 'next';
import { LOCALES } from '@/i18n/locales';
import { allPageRefs, alternates, href } from '@/i18n/routes';
import { absolute } from '@/lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return allPageRefs().flatMap((ref) => {
    const alt = alternates(ref);
    const languages = { en: absolute(alt.en), sr: absolute(alt.sr), 'x-default': absolute(alt.en) };
    return LOCALES.map((locale) => ({ url: absolute(href(locale, ref)), alternates: { languages } }));
  });
}
