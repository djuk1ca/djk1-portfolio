import { describe, expect, it } from 'vitest';
import { alternates, href, PROJECT_SLUGS, WORK_SLUGS, type PageRef } from '@/i18n/routes';
import { DEFAULT_LOCALE, LOCALES } from '@/i18n/locales';

const table: Array<[PageRef, string, string]> = [
  [{ page: 'home' }, '/', '/sr'],
  [{ page: 'services' }, '/services', '/sr/usluge'],
  [{ page: 'work', slug: 'md-mont' }, '/work/md-mont', '/sr/radovi/md-mont'],
  [{ page: 'work', slug: 'usluzionica' }, '/work/usluzionica', '/sr/radovi/usluzionica'],
  [{ page: 'projects', slug: 'connect-4' }, '/projects/connect-4', '/sr/projekti/connect-4'],
  [{ page: 'about' }, '/about', '/sr/o-meni'],
  [{ page: 'contact' }, '/contact', '/sr/kontakt'],
];

describe('locales', () => {
  it('has English as the default', () => {
    expect(LOCALES).toEqual(['en', 'sr']);
    expect(DEFAULT_LOCALE).toBe('en');
  });
});

describe('href', () => {
  it.each(table)('%o → %s / %s', (ref, en, sr) => {
    expect(href('en', ref)).toBe(en);
    expect(href('sr', ref)).toBe(sr);
  });

  it('rejects an unknown slug', () => {
    expect(() => href('en', { page: 'work', slug: 'nope' })).toThrow();
    expect(() => href('sr', { page: 'projects', slug: 'md-mont' })).toThrow();
  });
});

describe('alternates', () => {
  it('pairs both locales', () => {
    expect(alternates({ page: 'about' })).toEqual({ en: '/about', sr: '/sr/o-meni' });
  });
});

describe('slugs', () => {
  it('lists the exact work and project slugs', () => {
    expect(WORK_SLUGS).toEqual(['usluzionica', 'broker-auditor', 'md-mont', 'kaneko', 'simplice']);
    expect(PROJECT_SLUGS).toEqual(['language-id', 'connect-4', 'pdf-fast-reading', 'flappy']);
  });
});
