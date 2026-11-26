import type { Work } from '@/content';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/locales';
import { href } from '@/i18n/routes';
import { Key } from './Key';

const SIZES = '(max-width: 640px) 100vw, 540px';

/** A CRT monitor showing a client site, with the client name (to the case study) and a key to the live site. */
export function Monitor({
  work,
  locale,
  dict,
  eager,
}: {
  work: Work;
  locale: Locale;
  dict: Dictionary;
  eager?: boolean;
}) {
  const shot = work.screenshot;
  return (
    <article className="djk-monitor">
      <div className="djk-monitor-screen">
        {shot ? (
          <picture>
            <source type="image/avif" srcSet={`${shot}-800.avif 800w, ${shot}-1600.avif 1600w`} sizes={SIZES} />
            <source type="image/webp" srcSet={`${shot}-800.webp 800w, ${shot}-1600.webp 1600w`} sizes={SIZES} />
            <img
              src={`${shot}-800.webp`}
              width={800}
              height={450}
              alt={`${work.name}: ${work.domain} homepage`}
              loading={eager ? 'eager' : 'lazy'}
              decoding="async"
            />
          </picture>
        ) : (
          <>
            <span className="djk-monitor-domain">{work.domain}</span>
            <span className="djk-monitor-note" aria-hidden="true">
              [ screenshot ]
            </span>
          </>
        )}
      </div>
      <div className="djk-monitor-chin">
        <div>
          <h3>
            <a href={href(locale, { page: 'work', slug: work.slug })}>{work.name}</a>
          </h3>
          <p>{work.kind[locale]}</p>
        </div>
        <Key size="sm" href={work.url} external>
          {dict.cta.visit}
        </Key>
      </div>
    </article>
  );
}
