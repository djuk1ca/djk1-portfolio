import { Cursor, Key, Lcd, LcdGrid, LcdNumber, Monitor, Panel, ProjectModule, ServiceTile, Status, Chips } from '@/components/djk';
import { InquiryForm } from '@/components/client/InquiryForm';
import { PipelineRun } from '@/components/client/PipelineRun';
import { SiteShell } from '@/components/shell/SiteShell';
import { PROFILE, PROJECTS, SERVICES, WORKS } from '@/content';
import { getDictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/locales';
import { href } from '@/i18n/routes';
import { TURNSTILE_SITE_KEY } from '@/lib/site';
import s from './views.module.css';

export const PIPELINE_STEPS = ['build', 'analyzers', 'tests', 'coverage ≥75%', 'CodeQL', 'docker', 'deploy', 'smoke test'];

export function HomePage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const featured = WORKS.find((w) => w.featured)!;
  const clients = WORKS.filter((w) => !w.featured);
  const contactHref = href(locale, { page: 'contact' });

  return (
    <SiteShell locale={locale} current={{ page: 'home' }}>
      <section id="top" className={s.hero} aria-labelledby="hero-title">
        <div className={s.heroCopy}>
          <span className="djk-eyebrow">{dict.home.eyebrow}</span>
          <h1 id="hero-title" className="display-xl">
            {PROFILE.name}
          </h1>
          <p className={`body-lg ${s.lead}`}>{dict.home.lead}</p>
          <div className="djk-row">
            <Key variant="accent" href={contactHref}>
              {dict.cta.startProject}
            </Key>
            <Key href="#work">{dict.cta.viewWork}</Key>
            <Key variant="mod" href={PROFILE.github} external>
              GitHub
            </Key>
          </div>
        </div>
        <div className={s.heroSide}>
          <Lcd className="lcd">
            {dict.home.lcdLine1}
            <br />
            {dict.home.lcdLine2}
            <Cursor />
          </Lcd>
          <div className={s.statusRow}>
            <Status state="on">{dict.status.available}</Status>
            <Status state="on">
              {featured.name} · {dict.status.live}
            </Status>
          </div>
        </div>
      </section>

      <section id="services" className={s.section} aria-labelledby="services-title">
        <div className={s.sectionHead}>
          <h2 id="services-title" className="heading-1">
            {dict.home.servicesTitle}
          </h2>
          <p>{dict.home.servicesLead}</p>
        </div>
        <div className="djk-services">
          {SERVICES.map((svc) => (
            <ServiceTile key={svc.slug} service={svc} locale={locale} />
          ))}
        </div>
        <div>
          <Key href={href(locale, { page: 'services' })}>{dict.cta.allServices}</Key>
        </div>
      </section>

      <Panel as="section" id="featured" screws labelledBy="featured-title">
        <div className={s.featured}>
          <div className={s.featuredCopy}>
            <span className="djk-eyebrow">{dict.home.featuredEyebrow}</span>
            <h2 id="featured-title" className="heading-1">
              {featured.name}
            </h2>
            <p className={s.lead}>{featured.summary[locale]}</p>
            <Chips items={featured.stack} />
            <div className="djk-row">
              <Key href={featured.url} external>
                {featured.domain}
              </Key>
              <Key href={href(locale, { page: 'work', slug: featured.slug })}>{dict.cta.caseStudy}</Key>
              <Key variant="mod" href="https://github.com/djuk1ca/UsluzionicaServer" external>
                {dict.cta.code}
              </Key>
            </div>
          </div>
          <div className={s.featuredSide}>
            <LcdGrid metrics={featured.metrics} />
            <PipelineRun steps={PIPELINE_STEPS} title={dict.home.pipelineTitle} runLabel={dict.home.runPipeline} />
          </div>
        </div>
      </Panel>

      <section id="work" className={s.section} aria-labelledby="work-title">
        <div className={s.sectionHead}>
          <h2 id="work-title" className="heading-1">
            {dict.home.workTitle}
          </h2>
          <span className="djk-eyebrow">
            {clients.length} {dict.home.workCount}
          </span>
        </div>
        <div className={s.monitors}>
          {clients.map((w) => (
            <Monitor key={w.slug} work={w} locale={locale} dict={dict} />
          ))}
        </div>
      </section>

      <section id="projects" className={s.section} aria-labelledby="projects-title">
        <div className={s.sectionHead}>
          <h2 id="projects-title" className="heading-1">
            {dict.home.projectsTitle}
          </h2>
          <span className="djk-eyebrow">{dict.home.projectsLead}</span>
        </div>
        <div className={s.modules}>
          {PROJECTS.map((p) => (
            <ProjectModule key={p.slug} project={p} locale={locale} dict={dict} />
          ))}
        </div>
      </section>

      <section id="about" className={s.section} aria-labelledby="about-title">
        <div className={s.sectionHead}>
          <h2 id="about-title" className="heading-1">
            {dict.home.aboutTitle}
          </h2>
        </div>
        <div className={s.about}>
          <LcdNumber metric={PROFILE.gpa} />
          <div className={s.prose}>
            <p>{dict.home.aboutLead}</p>
            <dl className={s.facts}>
              <div>
                <dt>{dict.about.education}</dt>
                <dd>{PROFILE.education[locale]}</dd>
              </div>
              <div>
                <dt>{dict.about.languages}</dt>
                <dd>{PROFILE.languages[locale]}</dd>
              </div>
            </dl>
            <div>
              <Key href={href(locale, { page: 'about' })}>{dict.nav.about}</Key>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className={s.section} aria-labelledby="contact-title">
        <div className={s.sectionHead}>
          <h2 id="contact-title" className="heading-1">
            {dict.home.contactTitle}
          </h2>
          <p>{dict.home.contactLead}</p>
        </div>
        <InquiryForm locale={locale} dict={dict} siteKey={TURNSTILE_SITE_KEY} email={PROFILE.email} />
      </section>
    </SiteShell>
  );
}
