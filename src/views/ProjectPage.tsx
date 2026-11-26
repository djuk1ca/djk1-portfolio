import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbJsonLd } from '@/lib/seo';
import { notFound } from 'next/navigation';
import { Chips, Key, LcdGrid, Panel, Status } from '@/components/djk';
import { SiteShell } from '@/components/shell/SiteShell';
import { getProject } from '@/content';
import { getDictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/locales';
import { href } from '@/i18n/routes';
import { Prose } from './Prose';
import s from './views.module.css';

export function ProjectPage({ locale, slug }: { locale: Locale; slug: string }) {
  const project = getProject(slug);
  if (!project) notFound();
  const dict = getDictionary(locale);
  const { kind, url } = project.link;

  return (
    <SiteShell locale={locale} current={{ page: 'projects', slug: project.slug }}>
      <JsonLd data={breadcrumbJsonLd(locale, { page: 'projects', slug: project.slug })} />
      <header className={s.heroCopy}>
        <span className="djk-eyebrow">{project.kicker}</span>
        <h1 className="display">{project.name}</h1>
        <p className={`body-lg ${s.lead}`}>{project.summary[locale]}</p>
        <div className="djk-row" style={{ alignItems: 'center' }}>
          <Status state="on">{project.status[locale]}</Status>
          {kind !== 'details' && url && (
            <Key href={url} external>
              {kind === 'code' ? dict.cta.code : dict.cta.demo}
            </Key>
          )}
        </div>
      </header>

      {project.metrics.length > 0 && (
        <Panel>
          <LcdGrid metrics={project.metrics} />
        </Panel>
      )}

      <Prose sections={project.sections[locale]} />

      <section className={s.section} aria-labelledby="stack-title">
        <h2 id="stack-title" className="eyebrow">
          {dict.projects.stack}
        </h2>
        <Chips items={project.chips} />
      </section>

      <div className="djk-row">
        <Key variant="accent" href={href(locale, { page: 'contact' })}>
          {dict.cta.startProject}
        </Key>
        <Key href={`${href(locale, { page: 'home' })}#projects`}>{dict.cta.backHome}</Key>
      </div>
    </SiteShell>
  );
}
