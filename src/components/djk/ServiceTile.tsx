import type { Service } from '@/content';
import type { Locale } from '@/i18n/locales';
import { href } from '@/i18n/routes';
import { Chips } from './Chips';

export function ServiceTile({ service, locale }: { service: Service; locale: Locale }) {
  return (
    <article className="djk-service">
      <span className="djk-service-cap" aria-hidden="true">
        {service.letter}
      </span>
      <div>
        <h3>
          <a href={`${href(locale, { page: 'services' })}#${service.slug}`}>{service.title[locale]}</a>
        </h3>
        <p>{service.summary[locale]}</p>
        <Chips items={service.chips} />
      </div>
    </article>
  );
}
