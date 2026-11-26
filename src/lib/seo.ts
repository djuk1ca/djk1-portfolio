import type { Metadata } from 'next';
import { getProject, getWork, PROFILE, SERVICES } from '@/content';
import { getDictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/locales';
import { alternates, href, type PageRef } from '@/i18n/routes';
import { SITE_URL } from './site';

export const absolute = (path: string) => `${SITE_URL}${path}`;

const OG_LOCALE: Record<Locale, string> = { en: 'en_US', sr: 'sr_RS' };

/** File name of the page's Open Graph image under /og/ (made by scripts/og-images.mjs). */
export function ogImagePath(locale: Locale, ref: PageRef): string {
  const slug = 'slug' in ref ? `-${ref.slug}` : '';
  return `/og/${locale}-${ref.page}${slug}.png`;
}

function titleAndDescription(locale: Locale, ref: PageRef): { title: string; description: string } {
  const m = getDictionary(locale).meta;
  const withName = (t: string) => m.titleTemplate.replace('%s', t);
  switch (ref.page) {
    case 'home':
      return { title: m.homeTitle, description: m.homeDescription };
    case 'services':
      return { title: withName(m.servicesTitle), description: m.servicesDescription };
    case 'about':
      return { title: withName(m.aboutTitle), description: m.aboutDescription };
    case 'contact':
      return { title: withName(m.contactTitle), description: m.contactDescription };
    case 'work': {
      const w = getWork(ref.slug)!;
      return { title: withName(w.name), description: w.summary[locale] };
    }
    case 'projects': {
      const p = getProject(ref.slug)!;
      return { title: withName(p.name), description: p.summary[locale] };
    }
  }
}

export function pageMetadata(locale: Locale, ref: PageRef): Metadata {
  const { title, description } = titleAndDescription(locale, ref);
  const alt = alternates(ref);
  const url = absolute(href(locale, ref));
  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: url,
      languages: { en: absolute(alt.en), sr: absolute(alt.sr), 'x-default': absolute(alt.en) },
    },
    openGraph: {
      type: 'website',
      url,
      siteName: PROFILE.name,
      title,
      description,
      locale: OG_LOCALE[locale],
      alternateLocale: OG_LOCALE[locale === 'en' ? 'sr' : 'en'],
      images: [{ url: absolute(ogImagePath(locale, ref)), width: 1200, height: 630 }],
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export function notFoundMetadata(locale: Locale): Metadata {
  return { title: { absolute: getDictionary(locale).meta.notFoundTitle }, robots: { index: false, follow: true } };
}

export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    name: PROFILE.name,
    url: SITE_URL,
    email: `mailto:${PROFILE.email}`,
    jobTitle: 'Software developer',
    address: { '@type': 'PostalAddress', addressLocality: 'Novi Sad', addressCountry: 'RS' },
    sameAs: [PROFILE.github, PROFILE.linkedin],
  };
}

export function professionalServiceJsonLd(locale: Locale) {
  const m = getDictionary(locale).meta;
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    '@id': `${SITE_URL}/#service`,
    name: PROFILE.name,
    description: m.homeDescription,
    url: SITE_URL,
    email: PROFILE.email,
    founder: { '@id': `${SITE_URL}/#person` },
    address: { '@type': 'PostalAddress', addressLocality: 'Novi Sad', addressCountry: 'RS' },
    areaServed: [
      { '@type': 'City', name: 'Novi Sad' },
      { '@type': 'Country', name: 'Serbia' },
      'Worldwide',
    ],
    availableLanguage: ['en', 'sr'],
    knowsAbout: SERVICES.map((s) => s.title[locale]),
  };
}

export function breadcrumbJsonLd(locale: Locale, ref: PageRef) {
  const crumbs = [
    { name: PROFILE.name, item: absolute(href(locale, { page: 'home' })) },
    { name: titleAndDescription(locale, ref).title, item: absolute(href(locale, ref)) },
  ];
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, ...c })),
  };
}
