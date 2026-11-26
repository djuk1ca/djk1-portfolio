import type { ReactNode } from 'react';
import type { Locale } from '@/i18n/locales';
import type { PageRef } from '@/i18n/routes';
import { getDictionary } from '@/i18n/dictionaries';
import { Footer } from './Footer';
import { Header } from './Header';

export function SiteShell({ locale, current, children }: { locale: Locale; current: PageRef; children: ReactNode }) {
  const dict = getDictionary(locale);
  return (
    <>
      <Header locale={locale} current={current} dict={dict} />
      <main id="main" className="djk-page">
        {children}
      </main>
      <Footer dict={dict} />
    </>
  );
}
