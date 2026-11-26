export type Locale = 'en' | 'sr';

export const LOCALES: readonly Locale[] = ['en', 'sr'];
export const DEFAULT_LOCALE: Locale = 'en';

export const otherLocale = (locale: Locale): Locale => (locale === 'en' ? 'sr' : 'en');
