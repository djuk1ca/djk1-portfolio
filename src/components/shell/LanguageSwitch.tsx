import type { Locale } from '@/i18n/locales';
import { alternates, type PageRef } from '@/i18n/routes';
import type { Dictionary } from '@/i18n/dictionaries';

/** EN / SR keys; each links to the same page in that language (a full load, since each language has its own root layout). */
export function LanguageSwitch({ locale, current, dict }: { locale: Locale; current: PageRef; dict: Dictionary }) {
  const alt = alternates(current);
  return (
    <div className="djk-row" role="group" aria-label={dict.lang.label}>
      {(['en', 'sr'] as const).map((l) => (
        <a
          key={l}
          className="djk-key djk-key--sm"
          href={alt[l]}
          hrefLang={l}
          lang={l}
          aria-current={l === locale ? 'true' : undefined}
        >
          {dict.lang[l]}
        </a>
      ))}
    </div>
  );
}
