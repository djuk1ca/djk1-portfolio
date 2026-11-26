import type { ProjectSlug, WorkSlug } from '@/i18n/routes';

export type Localized<T> = { en: T; sr: T };

export type Section = { heading: string; body: string[] };

/** A number shown on the LCD. `ghost` is the unlit "888" behind it; `caption` stays English in both locales. */
export type Metric = { value: string; ghost: string; caption: string };

export type ServiceSlug = 'websites' | 'web-apps' | 'mobile-apps' | 'backends' | 'ai';

export type Service = {
  slug: ServiceSlug;
  letter: 'W' | 'A' | 'M' | 'B' | 'E';
  title: Localized<string>;
  summary: Localized<string>;
  gets: Localized<string[]>;
  chips: string[];
  /** Work and project slugs that prove this service. */
  proof: Array<{ kind: 'work' | 'projects'; slug: WorkSlug | ProjectSlug }>;
};

export type Work = {
  slug: WorkSlug;
  name: string;
  domain: string;
  url: string;
  role: Localized<string>;
  kind: Localized<string>;
  summary: Localized<string>;
  stack: string[];
  metrics: Metric[];
  sections: Localized<Section[]>;
  /** Base path of the screenshot without size or extension, e.g. "/work/md-mont"; null until captured. */
  screenshot: string | null;
  featured: boolean;
  period: Localized<string>;
};

export type Tone = 'teal' | 'red' | 'violet' | 'green';

export type Project = {
  slug: ProjectSlug;
  name: string;
  /** English in both locales, e.g. "ML · Sep 2026". */
  kicker: string;
  tone: Tone;
  summary: Localized<string>;
  status: Localized<string>;
  chips: string[];
  metrics: Metric[];
  link: { kind: 'code' | 'demo' | 'details'; url: string | null };
  sections: Localized<Section[]>;
};
