import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { Field, Key, Keycap, LcdNumber, Logo, Monitor, Panel, ProjectModule, ServiceTile, Status } from '@/components/djk';
import { getProject, getWork, SERVICES } from '@/content';
import { getDictionary } from '@/i18n/dictionaries';

const html = (el: React.ReactElement) => renderToStaticMarkup(el);
const dict = getDictionary('en');

describe('Key', () => {
  it('renders a link when given href', () => {
    expect(html(<Key variant="accent" href="/contact">Start a project</Key>)).toBe(
      '<a class="djk-key djk-key--accent" href="/contact">Start a project</a>',
    );
  });

  it('marks external links and adds the arrow', () => {
    const out = html(
      <Key href="https://github.com/djuk1ca" external>
        GitHub
      </Key>,
    );
    expect(out).toContain('target="_blank"');
    expect(out).toContain('rel="noopener"');
    expect(out).toContain('<span class="djk-arrow" aria-hidden="true">↗</span>');
  });

  it('renders a pressed small button', () => {
    const out = html(
      <Key size="sm" pressed>
        EN
      </Key>,
    );
    expect(out).toBe('<button type="button" class="djk-key djk-key--sm" aria-pressed="true">EN</button>');
  });
});

describe('LcdNumber', () => {
  it('stacks the ghost digits behind the value', () => {
    const out = html(<LcdNumber metric={{ value: '86.9', ghost: '88.8', caption: '% LINE COVERAGE' }} />);
    expect(out).toContain(
      '<span class="djk-seg"><span class="djk-ghost" aria-hidden="true">88.8</span><span>86.9</span></span>',
    );
    expect(out).toContain('<span class="djk-lcd-cap">% LINE COVERAGE</span>');
  });
});

describe('Status', () => {
  it('pairs the LED with a word', () => {
    expect(html(<Status state="on">live</Status>)).toBe(
      '<span class="djk-status"><i class="djk-led is-on" aria-hidden="true"></i>live</span>',
    );
  });
});

describe('Field', () => {
  it('wires the label and the error message', () => {
    const out = html(
      <Field id="email" label="Email" error="Add an email.">
        <input id="email" />
      </Field>,
    );
    expect(out).toContain('<label for="email">Email</label>');
    expect(out).toContain('id="email-error"');
    expect(out).toContain('Add an email.');
  });
});

describe('Monitor', () => {
  it('shows the domain while there is no screenshot', () => {
    const work = { ...getWork('md-mont')!, screenshot: null };
    const out = html(<Monitor work={work} locale="en" dict={dict} />);
    expect(out).toContain('<span class="djk-monitor-domain">mdmont.rs</span>');
    expect(out).not.toContain('<img');
  });

  it('shows the screenshot with a descriptive alt', () => {
    const work = { ...getWork('md-mont')!, screenshot: '/work/md-mont' };
    const out = html(<Monitor work={work} locale="en" dict={dict} />);
    expect(out).toMatch(/<img[^>]+alt="[^"]*M&amp;D Mont[^"]*"/);
    expect(out).toContain('/work/md-mont-800.avif');
    expect(out).toContain('/work/md-mont-1600.webp');
  });

  it('links the name to the case study and the key to the live site', () => {
    const out = html(<Monitor work={getWork('md-mont')!} locale="sr" dict={getDictionary('sr')} />);
    expect(out).toContain('href="/sr/radovi/md-mont"');
    expect(out).toContain('href="https://mdmont.rs"');
  });
});

describe('ProjectModule', () => {
  it('colors the label band from the tone token', () => {
    const out = html(<ProjectModule project={getProject('connect-4')!} locale="en" dict={dict} />);
    expect(out).toContain('--tone:var(--tone-red)');
    expect(out).toContain('Connect 4 AI');
  });
});

describe('ServiceTile', () => {
  it('shows the letter cap and the localized title', () => {
    const out = html(<ServiceTile service={SERVICES[2]} locale="sr" />);
    expect(out).toContain('<span class="djk-service-cap" aria-hidden="true">M</span>');
    expect(out).toContain('Mobilne aplikacije');
  });
});

describe('Keycap', () => {
  it('has a compact, single-row variant for the header', () => {
    const out = html(<Keycap n={2} label="Work" href="#work" compact />);
    expect(out).toContain('class="djk-key djk-kc djk-kc--compact djk-key--sm"');
    expect(out).toContain('data-key="2"');
    expect(out).not.toContain('<b');
    expect(out).toContain('>Work</span>');
  });
});

describe('Logo', () => {
  it('draws the DJK-1 keycap mark next to the name', () => {
    const out = html(<Logo name="Đurađ Manojlović" tagline="DJK-1 · Novi Sad" />);
    expect(out).toContain('<svg');
    expect(out).toContain('class="djk-logo-mark"');
    expect(out).toContain('Đurađ Manojlović');
    expect(out).toContain('DJK-1 · Novi Sad');
  });
});

describe('Panel', () => {
  it('allows only one decoration', () => {
    expect(() =>
      html(
        <Panel screws grille>
          x
        </Panel>,
      ),
    ).toThrow();
  });

  it('renders four screws', () => {
    expect(html(<Panel screws>x</Panel>).match(/djk-screw/g)?.length).toBe(4);
  });
});
