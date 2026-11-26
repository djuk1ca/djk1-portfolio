import { PROFILE } from '@/content';
import type { Dictionary } from '@/i18n/dictionaries';
import styles from './shell.module.css';

export function Footer({ dict }: { dict: Dictionary }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <p>{dict.footer.built}</p>
        <p className={styles.footerLinks}>
          <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
          <a href={PROFILE.github} target="_blank" rel="noopener">
            GitHub ↗
          </a>
          <a href={PROFILE.linkedin} target="_blank" rel="noopener">
            LinkedIn ↗
          </a>
          <span>{dict.footer.hosting}</span>
        </p>
      </div>
    </footer>
  );
}
