import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbJsonLd } from '@/lib/seo';
import { notFound } from 'next/navigation';
import { Chips, Key, LcdGrid, Monitor, Panel } from '@/components/djk';
import { SiteShell } from '@/components/shell/SiteShell';
import { getWork, WORKS } from '@/content';
import { getDictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/locales';
import { href } from '@/i18n/routes';
import { Prose } from './Prose';
import s from './views.module.css';

export function WorkPage({ locale, slug }: { locale: Locale; slug: string }) {
  const work = getWork(slug);
  if (!work) notFound();
  const dict = getDictionary(locale);
  const others = WORKS.filter((w) => w.slug !== work.slug && !w.featured).slice(0, 2);

  return (
    <SiteShell locale={locale} current={{ page: 'work', slug: work.slug }}>
      <JsonLd data={breadcrumbJsonLd(locale, { page: 'work', slug: work.slug })} />
      <header className={s.heroCopy}>
        <span className="djk-eyebrow">{work.kind[locale]}</span>
        <h1 className="display">{work.name}</h1>
        <p className={`body-lg ${s.lead}`}>{work.summary[locale]}</p>
        <p className={s.metaRow}>
          <span>
            <b>{dict.work.role}</b>
            {work.role[locale]}
          </span>
          <span>
            <b>{dict.work.period}</b>
            {work.period[locale]}
          </span>
        </p>
        <div className="djk-row">
          <Key href={work.url} external>
            {work.domain}
          </Key>
        </div>
      </header>

      <Monitor work={work} locale={locale} dict={dict} eager />

      {work.metrics.length > 0 && (
        <Panel screws>
          <h2 className="eyebrow">{dict.work.numbers}</h2>
          <LcdGrid metrics={work.metrics} />
        </Panel>
      )}

      <Prose sections={work.sections[locale]} />

      <section className={s.section} aria-labelledby="stack-title">
        <h2 id="stack-title" className="eyebrow">
          {dict.work.stack}
        </h2>
        <Chips items={work.stack} />
      </section>

      {others.length > 0 && (
        <section className={s.section} aria-labelledby="more-title">
          <h2 id="more-title" className="heading-2">
            {dict.work.otherWork}
          </h2>
          <div className={s.monitors}>
            {others.map((w) => (
              <Monitor key={w.slug} work={w} locale={locale} dict={dict} />
            ))}
          </div>
        </section>
      )}

      <div>
        <Key variant="accent" href={href(locale, { page: 'contact' })}>
          {dict.cta.startProject}
        </Key>
      </div>
    </SiteShell>
  );
}
