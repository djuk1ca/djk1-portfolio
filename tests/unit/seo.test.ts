import { beforeAll, describe, expect, it, vi } from 'vitest';

let seo: typeof import('@/lib/seo');
let sitemap: typeof import('@/app/sitemap').default;
let robots: typeof import('@/app/robots').default;

beforeAll(async () => {
  vi.stubEnv('SITE_URL', 'https://example.test');
  vi.resetModules();
  seo = await import('@/lib/seo');
  sitemap = (await import('@/app/sitemap')).default;
  robots = (await import('@/app/robots')).default;
});

describe('pageMetadata', () => {
  it('sets canonical and hreflang alternates with an English x-default', () => {
    expect(seo.pageMetadata('sr', { page: 'work', slug: 'kaneko' }).alternates).toEqual({
      canonical: 'https://example.test/sr/radovi/kaneko',
      languages: {
        en: 'https://example.test/work/kaneko',
        sr: 'https://example.test/sr/radovi/kaneko',
        'x-default': 'https://example.test/work/kaneko',
      },
    });
  });

  it('uses the localized home title and description', () => {
    const m = seo.pageMetadata('sr', { page: 'home' });
    expect(m.title).toEqual({ absolute: 'Đurađ Manojlović · Izrada sajtova, aplikacija i backenda' });
    expect(m.description).toContain('Novog Sada');
  });

  it('titles a work page with the work name and its summary', () => {
    const m = seo.pageMetadata('en', { page: 'work', slug: 'md-mont' });
    expect(m.title).toEqual({ absolute: 'M&D Mont · Đurađ Manojlović' });
    expect(m.description).toContain('steel-structure');
  });

  it('points Open Graph at the per-page image and locale', () => {
    const og = seo.pageMetadata('sr', { page: 'projects', slug: 'flappy' }).openGraph as Record<string, unknown>;
    expect(og.locale).toBe('sr_RS');
    expect(og.url).toBe('https://example.test/sr/projekti/flappy');
    expect(og.images).toEqual([{ url: 'https://example.test/og/sr-projects-flappy.png', width: 1200, height: 630 }]);
  });
});

describe('sitemap', () => {
  it('lists every page in both languages with absolute, unique URLs', () => {
    const entries = sitemap();
    expect(entries).toHaveLength(26);
    const urls = entries.map((e) => e.url);
    expect(new Set(urls).size).toBe(26);
    for (const u of urls) expect(u.startsWith('https://example.test/')).toBe(true);
    const about = entries.find((e) => e.url === 'https://example.test/about');
    expect(about?.alternates?.languages).toEqual({
      en: 'https://example.test/about',
      sr: 'https://example.test/sr/o-meni',
      'x-default': 'https://example.test/about',
    });
  });
});

describe('robots', () => {
  it('allows everything and points to the sitemap', () => {
    expect(robots()).toEqual({ rules: [{ userAgent: '*', allow: '/' }], sitemap: 'https://example.test/sitemap.xml' });
  });
});

describe('JSON-LD', () => {
  it('describes a professional service in Novi Sad', () => {
    const ld = seo.professionalServiceJsonLd('en');
    expect(ld['@type']).toBe('ProfessionalService');
    expect(JSON.stringify(ld)).toContain('Novi Sad');
    expect(ld.url).toBe('https://example.test');
  });

  it('builds breadcrumbs from home to the page', () => {
    const ld = seo.breadcrumbJsonLd('sr', { page: 'work', slug: 'usluzionica' });
    expect(ld.itemListElement.map((i: { item: string }) => i.item)).toEqual([
      'https://example.test/sr',
      'https://example.test/sr/radovi/usluzionica',
    ]);
  });
});
