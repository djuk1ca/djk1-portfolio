import type { Locale } from './locales';

export const WORK_SLUGS = ['usluzionica', 'broker-auditor', 'md-mont', 'kaneko', 'simplice'] as const;
export const PROJECT_SLUGS = ['language-id', 'connect-4', 'pdf-fast-reading', 'flappy'] as const;

export type WorkSlug = (typeof WORK_SLUGS)[number];
export type ProjectSlug = (typeof PROJECT_SLUGS)[number];

export type PageRef = { page: 'home' | 'services' | 'about' | 'contact' } | { page: 'work' | 'projects'; slug: string };

const BASE: Record<Locale, Record<PageRef['page'], string>> = {
  en: { home: '/', services: '/services', work: '/work', projects: '/projects', about: '/about', contact: '/contact' },
  sr: {
    home: '/sr',
    services: '/sr/usluge',
    work: '/sr/radovi',
    projects: '/sr/projekti',
    about: '/sr/o-meni',
    contact: '/sr/kontakt',
  },
};

const SLUGS: Record<'work' | 'projects', readonly string[]> = { work: WORK_SLUGS, projects: PROJECT_SLUGS };

export function href(locale: Locale, ref: PageRef): string {
  const base = BASE[locale][ref.page];
  if (ref.page !== 'work' && ref.page !== 'projects') return base;
  if (!SLUGS[ref.page].includes(ref.slug)) throw new Error(`Unknown ${ref.page} slug: ${ref.slug}`);
  return `${base}/${ref.slug}`;
}

export function alternates(ref: PageRef): Record<Locale, string> {
  return { en: href('en', ref), sr: href('sr', ref) };
}

/** Every page of the site, for sitemaps and route tests. */
export function allPageRefs(): PageRef[] {
  return [
    { page: 'home' },
    { page: 'services' },
    ...WORK_SLUGS.map((slug) => ({ page: 'work' as const, slug })),
    ...PROJECT_SLUGS.map((slug) => ({ page: 'projects' as const, slug })),
    { page: 'about' },
    { page: 'contact' },
  ];
}
