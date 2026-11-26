import type { CSSProperties } from 'react';
import type { Project } from '@/content';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/locales';
import { href } from '@/i18n/routes';
import { Chips } from './Chips';
import { Key } from './Key';
import { Status } from './Status';

/** A project "cartridge": paper label with a color band, summary, chips, status and one key. */
export function ProjectModule({ project, locale, dict }: { project: Project; locale: Locale; dict: Dictionary }) {
  const page = href(locale, { page: 'projects', slug: project.slug });
  const { kind, url } = project.link;
  const tone = { '--tone': `var(--tone-${project.tone})` } as CSSProperties;
  return (
    <article className="djk-module">
      <div className="djk-module-grip" aria-hidden="true" />
      <div className="djk-label" style={tone}>
        <div className="djk-label-band" />
        <div className="djk-label-body">
          <span className="djk-label-kicker">{project.kicker}</span>
          <h3 className="djk-label-title">
            <a href={page}>{project.name}</a>
          </h3>
        </div>
      </div>
      <p>{project.summary[locale]}</p>
      <Chips items={project.chips} />
      <div className="djk-module-foot">
        <Status state="on">{project.status[locale]}</Status>
        {kind !== 'details' && url ? (
          <Key size="sm" href={url} external>
            {kind === 'code' ? dict.cta.code : dict.cta.demo}
          </Key>
        ) : (
          <Key size="sm" href={page}>
            {dict.cta.details}
          </Key>
        )}
      </div>
    </article>
  );
}
