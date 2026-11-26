import Link from 'next/link';
import type { Locale } from '@/i18n/locales';
import { href, type PageRef } from '@/i18n/routes';
import type { Dictionary } from '@/i18n/dictionaries';
import { KeyShortcuts } from '@/components/client/KeyShortcuts';
import { SoundSwitch } from '@/components/client/SoundSwitch';
import { ThemeSwitch } from '@/components/client/ThemeSwitch';
import { LanguageSwitch } from './LanguageSwitch';
import styles from './shell.module.css';

const SECTIONS = ['services', 'work', 'projects', 'about', 'contact'] as const;

export function Header({ locale, current, dict }: { locale: Locale; current: PageRef; dict: Dictionary }) {
  const home = href(locale, { page: 'home' });
  const onHome = current.page === 'home';

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link className={styles.brand} href={home}>
          {dict.brand}
        </Link>
        <nav aria-label={dict.nav.label} className="djk-row">
          {SECTIONS.map((section, i) => (
            <a
              key={section}
              className={`djk-key djk-kc${section === 'contact' ? ' djk-key--accent' : ''}`}
              href={`${onHome ? '' : home}#${section}`}
              data-key={i + 1}
            >
              <b aria-hidden="true">{i + 1}</b>
              <span>{dict.nav[section]}</span>
            </a>
          ))}
        </nav>
        <div className={styles.controls}>
          <LanguageSwitch locale={locale} current={current} dict={dict} />
          <ThemeSwitch label={dict.theme.graphite} />
          <SoundSwitch label={dict.sound.keySound} />
        </div>
      </div>
      <KeyShortcuts />
    </header>
  );
}
