# DJK-1 Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Đurađ Manojlović's bilingual (EN default, SR) freelance portfolio site in the DJK-1 retro design system, with a working inquiry form, full SEO, deployed to Cloudflare Workers.

**Architecture:** Next.js 16 App Router with two root layouts (route groups `(en)` and `(sr)`), so every page is fully static HTML with the right `<html lang>` and no locale middleware. Content and UI strings live in typed TypeScript modules (`Localized<T>` = `{ en, sr }`). The only server code at runtime is the inquiry Server Action, which runs on the Worker and talks to D1, Turnstile and Resend through injected dependencies.

**Tech Stack:** Next.js 16.4.6, React 19.3.1, TypeScript 6.0.3 (same as `D:\code\Kaneko-EU\web`), zod 4, `@opennextjs/cloudflare` + wrangler 4, Cloudflare D1, Vitest, Playwright + `@axe-core/playwright`, sharp, Lighthouse.

**Spec:** `docs/superpowers/specs/2026-11-26-portfolio-site-design.md`. Design system source: `design/design-system/` (`tokens.json`, `components/bundle.css`, component READMEs). Content facts: Obsidian note `SecondBrain/07 - Portfolio/06 - Sadržaj — usluge, radovi i projekti.md`.

**Two deliberate deviations from the spec (builder calls, flag to Đurađ):**
1. **No `next-intl`.** Translated slugs and EN-at-`/` would need locale middleware (Next 16 `proxy.ts`) on every request. Two root layouts + a typed route map keep every page static and enforce SR translations at compile time. Same URLs, hreflang and switcher as the spec.
2. **No MDX.** Case-study bodies are typed `Localized<Section[]>` in TS, type-checked for both languages, no MDX toolchain.

## Global Constraints

- English is the default at `/`; Serbian is under `/sr`. No redirect by browser language.
- Route table (exact): `/`↔`/sr`, `/services`↔`/sr/usluge`, `/work/<slug>`↔`/sr/radovi/<slug>`, `/projects/<slug>`↔`/sr/projekti/<slug>`, `/about`↔`/sr/o-meni`, `/contact`↔`/sr/kontakt`.
- Work slugs: `usluzionica`, `broker-auditor`, `md-mont`, `kaneko`, `simplice`. Project slugs: `language-id`, `connect-4`, `pdf-fast-reading`, `flappy`.
- `hreflang`: `en`, `sr`, `x-default` → English URL.
- Stay in English in both locales: technology names (chips), LCD metrics and captions, CI step names, project names.
- LCD metrics allowed (exact): 134 REST endpoints, 574 automated tests, 86.9 % line coverage, 3 platforms, 99.5 % accuracy, GPA 9.36, 185 ECTS. No other numbers on screens.
- Every absolute URL (canonical, sitemap, OG, JSON-LD) comes from `SITE_URL` (env), default `http://localhost:3000`.
- Contact info on site: email + form only, no phone number.
- One `djk-key--accent` per view; primary CTA copy "Start a project" / "Započni projekat".
- Styles come only from DJK-1 tokens (generated `tokens.css`) + `djk.css` (port of `bundle.css`). No Tailwind.
- Client JS only for: theme switch, key-sound switch (default off), number-key shortcuts, CI pipeline animation, enhanced form. Everything else is a Server Component.
- `prefers-reduced-motion` disables transitions and blinking.
- Lighthouse mobile ≥ 95 in all four categories on `/` and `/work/usluzionica`.
- Commit messages: plain imperative, no `Co-Authored-By` or tool attribution lines.

## Review Focus

1. **Switching language on a detail page** (`/work/md-mont` → SR) must land on `/sr/radovi/md-mont`, not a 404 or the SR home. → test in Task 4.
2. **Inquiry sent with JavaScript disabled** must still be stored and show the success state. → test in Task 9.
3. **Resend down or `RESEND_API_KEY` missing**: inquiry is still saved, the visitor still sees "sent", `emailed` stays 0. → test in Task 8.
4. **Typing digits in a form field** (e.g. "5 pages" in the message) must not trigger the 1–5 section shortcuts. → test in Task 4.
5. **Serbian diacritics** (Đurađ, Ćirić, šđčćž) in name and message round-trip intact into D1 and the notification email. → test in Task 8.

---

## File Structure

```
src/
  app/
    (en)/layout.tsx                 root layout, <html lang="en">
    (en)/page.tsx                   → <HomePage locale="en" />
    (en)/services/page.tsx
    (en)/work/[slug]/page.tsx
    (en)/projects/[slug]/page.tsx
    (en)/about/page.tsx
    (en)/contact/page.tsx
    (en)/not-found.tsx
    (en)/[...missing]/page.tsx      notFound()
    (sr)/sr/layout.tsx              root layout, <html lang="sr">
    (sr)/sr/page.tsx, usluge/, radovi/[slug]/, projekti/[slug]/, o-meni/, kontakt/, not-found.tsx, [...missing]/
    sitemap.ts, robots.ts
  i18n/
    locales.ts                      Locale type, LOCALES
    routes.ts                       href(), alternates(), PageRef
    dictionaries/en.ts, sr.ts, index.ts   UI strings, Dictionary type
  content/
    types.ts                        Localized<T>, Service, Work, Project, Section, Metric
    services.ts, work.ts, projects.ts, profile.ts
  components/
    djk/                            Key, Keycap, Switch, Led, Lcd, Chip, Field, Panel, ProjectModule, Monitor, Service (server components)
    shell/                          SiteShell, Header, Footer, LanguageSwitch
    client/                         ThemeSwitch, SoundSwitch, KeyShortcuts, PipelineRun, InquiryForm ("use client")
    seo/JsonLd.tsx
  pages/                            locale-agnostic page bodies: HomePage, ServicesPage, WorkPage, ProjectPage, AboutPage, ContactPage, NotFoundPage
  lib/
    theme.ts                        THEME_KEY, themeInitScript
    seo.ts                          pageMetadata(), personJsonLd(), serviceJsonLd(), breadcrumbJsonLd()
    inquiry/schema.ts, handle.ts, deps.ts, action.ts
  styles/tokens.css (generated), djk.css, globals.css
scripts/build-tokens.mjs, screenshots.mjs, og-images.mjs, lighthouse.mjs
migrations/0001_inquiries.sql
public/work/*, public/og/*, public/cv/Djuradj-Manojlovic-CV.pdf
tests/unit/*.test.ts(x)   (Vitest)
tests/e2e/*.spec.ts       (Playwright)
wrangler.jsonc, open-next.config.ts, next.config.ts, vitest.config.ts, playwright.config.ts
.github/workflows/ci.yml
```

---

### Task 1: Project scaffold and design tokens

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `.prettierrc`, `.gitignore`, `vitest.config.ts`
- Create: `scripts/build-tokens.mjs`, `src/styles/djk.css`, `src/styles/globals.css`
- Test: `tests/unit/build-tokens.test.ts`

**Interfaces:**
- Produces: `npm run tokens` writes `src/styles/tokens.css`; CSS custom properties named exactly as `design/design-system/tokens.json` (`--desk`, `--accent`, `--raise`, `--space-4`, `--radius-key`, `--depth-key`, …) plus `--font-display|body|mono|screen` (set by `next/font` in Task 4). `buildTokensCss(tokens: object): string` exported from the script.
- Scripts: `dev`, `build`, `tokens`, `lint`, `typecheck` (`tsc --noEmit`), `test` (vitest run), `e2e` (playwright), `preview`, `deploy` (Task 12).

- [ ] **Step 1:** `git init -b main` in `D:\code\djk1-portfolio`; add `package.json` with the pinned versions from Tech Stack (copy dev-tool versions from `D:\code\Kaneko-EU\web\package.json`), `.gitignore` (`node_modules`, `.next`, `.open-next`, `.wrangler`, `.dev.vars`, `test-results`, `playwright-report`). `npm install`.
- [ ] **Step 2: Write the failing test** `tests/unit/build-tokens.test.ts`:
  - `buildTokensCss(tokens)` output contains `:root, [data-theme="kit"] {` with `--desk: #d9d7d0;` and `--accent: #2d4bd2;`
  - contains `[data-theme="grafit"] {` with `--desk: #17181b;`
  - contains `@media (prefers-color-scheme: dark) { :root:not([data-theme="kit"]) {` with `--accent: #4863ee;`
  - a single-string value (`phosphor`) appears once in the kit block as `--phosphor: #ffb547;`
  - `--space-4: 16px;`, `--radius-panel: 18px;`, `--depth-key: 6px;`, and `--raise:` with the kit shadow string
- [ ] **Step 3:** Run `npx vitest run tests/unit/build-tokens.test.ts` → FAIL (module missing).
- [ ] **Step 4:** Implement `scripts/build-tokens.mjs`: read `design/design-system/tokens.json`; color + shadow tokens per theme (first theme = `kit` on `:root, [data-theme="kit"]`, `grafit` in `[data-theme="grafit"]` and in the `prefers-color-scheme: dark` block guarded by `:not([data-theme="kit"])`, also `color-scheme: dark` there); spacing, radius, depth on `:root`. CLI mode writes `src/styles/tokens.css` with first line `/* DJK-1 — generated from tokens.json */`.
- [ ] **Step 5:** Run the test → PASS. Run `npm run tokens`.
- [ ] **Step 6:** Port `design/design-system/components/bundle.css` to `src/styles/djk.css` verbatim minus the `@import` line (fonts come from `next/font`). `globals.css` imports `tokens.css` then `djk.css`, sets `html { scroll-behavior: smooth }` (off under reduced motion), and the page gutter `padding-inline: max(16px, env(safe-area-inset-left))` on `.djk-page`.
- [ ] **Step 7:** Minimal `src/app/(en)/layout.tsx` + `page.tsx` rendering "DJK-1". Run `npm run build` → succeeds; `npm run lint` and `npm run typecheck` → clean.
- [ ] **Step 8: Commit** `git add -A && git commit -m "Scaffold Next.js 16 project with DJK-1 tokens"`

---

### Task 2: Locales, route map and dictionaries

**Files:**
- Create: `src/i18n/locales.ts`, `src/i18n/routes.ts`, `src/i18n/dictionaries/{en,sr,index}.ts`
- Test: `tests/unit/routes.test.ts`, `tests/unit/dictionaries.test.ts`

**Interfaces:**
- Produces:
  - `type Locale = 'en' | 'sr'`; `LOCALES: readonly Locale[] = ['en','sr']`; `DEFAULT_LOCALE = 'en'`
  - `type PageRef = { page: 'home' | 'services' | 'about' | 'contact' } | { page: 'work' | 'projects'; slug: string }`
  - `href(locale: Locale, ref: PageRef): string`
  - `alternates(ref: PageRef): { en: string; sr: string }`
  - `WORK_SLUGS`, `PROJECT_SLUGS` (readonly tuples, exact slugs from Global Constraints)
  - `type Dictionary` (derived from `en` with every leaf widened to `string`); `getDictionary(locale: Locale): Dictionary`
- Dictionary keys (both files): `nav.{services,work,projects,about,contact}`, `cta.{startProject,viewWork,visit,code,demo,details,downloadCv}`, `status.{available,replyWithin}`, `theme.graphite`, `sound.keySound`, `lang.switchTo`, `home.*`, `services.*`, `about.*`, `contact.*` (form labels, placeholders, every error message used in Task 8: `errors.{name,email,types,message,timeline,rateLimited,captcha,server}`, `sent`, `sending`), `notFound.*`, `footer.*`.

- [ ] **Step 1: Write the failing tests**
  - `routes.test.ts`: table test over every row of the Global Constraints route table, e.g. `href('en',{page:'home'}) === '/'`, `href('sr',{page:'home'}) === '/sr'`, `href('sr',{page:'work',slug:'md-mont'}) === '/sr/radovi/md-mont'`, `href('en',{page:'projects',slug:'connect-4'}) === '/projects/connect-4'`, `href('sr',{page:'contact'}) === '/sr/kontakt'`; `alternates({page:'about'})` equals `{ en: '/about', sr: '/sr/o-meni' }`; `href('en',{page:'work',slug:'nope'})` throws.
  - `dictionaries.test.ts`: recursive key sets of `en` and `sr` are equal; no `sr` leaf is an empty string; no `sr` leaf equals its `en` counterpart except an allow-list (`nav.*` items that are proper nouns, none expected) — fails loudly so untranslated strings are caught.
- [ ] **Step 2:** Run `npx vitest run tests/unit/routes.test.ts tests/unit/dictionaries.test.ts` → FAIL.
- [ ] **Step 3:** Implement the modules. Write the EN strings and Serbian translations (Latin script, natural Serbian, correct diacritics; voice rules from `design/design-system/README.md` → "Sadržaj i glas").
- [ ] **Step 4:** Run tests → PASS; `npm run typecheck` → clean.
- [ ] **Step 5: Commit** `git commit -am "Add locale route map and EN/SR dictionaries"`

---

### Task 3: Content model

**Files:**
- Create: `src/content/{types,services,work,projects,profile}.ts`
- Test: `tests/unit/content.test.ts`

**Interfaces:**
- Consumes: `Locale`, `WORK_SLUGS`, `PROJECT_SLUGS` (Task 2).
- Produces:
  - `type Localized<T> = { en: T; sr: T }`
  - `type Section = { heading: string; body: string[] }`
  - `type Metric = { value: string; ghost: string; caption: string }` (caption English-only)
  - `type Service = { slug: 'websites'|'web-apps'|'mobile-apps'|'backends'|'ai'; letter: 'W'|'A'|'M'|'B'|'E'; title: Localized<string>; summary: Localized<string>; chips: string[]; proof: string[] /* work/project slugs */ }`
  - `type Work = { slug: WorkSlug; name: string; domain: string; url: string; role: Localized<string>; kind: Localized<string>; summary: Localized<string>; stack: string[]; metrics: Metric[]; sections: Localized<Section[]>; screenshot: string | null; featured: boolean; period: string }`
  - `type Project = { slug: ProjectSlug; name: string; kicker: string /* English, e.g. 'ML · Sep 2026' */; tone: 'teal'|'red'|'violet'|'green'; summary: Localized<string>; status: Localized<string>; chips: string[]; link: { kind: 'code'|'demo'|'details'; url: string | null }; sections: Localized<Section[]> }`
  - `SERVICES: Service[]` (order W, A, M, B, E), `WORKS: Work[]` (Uslužionica first, `featured: true`), `PROJECTS: Project[]`, `PROFILE` (name `Đurađ Manojlović`, email `djuradj.manojlovic04@gmail.com`, `github`, `linkedin`, education, training, languages; no phone)
  - `getWork(slug)`, `getProject(slug)` → item or `undefined`
- Facts come from the Obsidian note `06 - Sadržaj…` and the CV. Broker Auditor role is "frontend features in a distributed team" (not "built the site"). Uslužionica metrics: `134`/`888` REST ENDPOINTS, `574`/`888` AUTOMATED TESTS, `86.9`/`88.8` % LINE COVERAGE, `3`/`8` PLATFORMS.

- [ ] **Step 1: Write the failing test** `content.test.ts`: slugs of `WORKS` equal `WORK_SLUGS` as a set, same for `PROJECTS`; exactly one featured work and it is `usluzionica`; every metric `value` is in the allow-list from Global Constraints and `ghost.length === value.length`; every `Localized` field has non-empty `en` and `sr`; `SERVICES.map(s => s.letter).join('') === 'WAMBE'`; `JSON.stringify(PROFILE)` contains no `+381`.
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Write the content (EN + SR). Case-study sections: 3–5 per work (what was built, for whom, what the client got, stack/approach). Mark claims you could not verify from the CV/repos with a `// TODO(Đurađ): confirm` comment rather than inventing.
- [ ] **Step 4:** Run → PASS.
- [ ] **Step 5: Commit** `git commit -am "Add typed bilingual content for services, work and projects"`

---

### Task 4: Site shell, theme, language switch, shortcuts (+ Playwright setup)

**Files:**
- Create: `src/app/(en)/layout.tsx`, `src/app/(sr)/sr/layout.tsx`, `src/components/shell/{SiteShell,Header,Footer,LanguageSwitch}.tsx`, `src/components/client/{ThemeSwitch,SoundSwitch,KeyShortcuts}.tsx`, `src/lib/theme.ts`
- Create: `playwright.config.ts`, `tests/e2e/shell.spec.ts`
- Test: `tests/unit/theme.test.ts`

**Interfaces:**
- Consumes: `href`, `getDictionary` (Task 2).
- Produces:
  - `<SiteShell locale: Locale; current: PageRef; children>` — every page body renders inside it (header with brand "ĐM · DJK-1", Keycap nav `1 Services, 2 Work, 3 Projects, 4 About, 5 Contact` (5 = `djk-key--accent`), `EN`/`SR` keys with `aria-pressed`, ThemeSwitch, SoundSwitch; footer).
  - `THEME_KEY = 'djk-theme'`; `themeInitScript: string` (inline, sets `document.documentElement.dataset.theme` to stored `'kit'|'grafit'`, ignores other values, wrapped in try/catch).
  - Fonts: `next/font/google` Archivo (axes `['wdth']`), IBM Plex Sans (400/500/600), IBM Plex Mono (400/500), VT323 (400), subsets `latin`, `latin-ext`, exposed as CSS variables `--font-display|body|mono|screen` on `<html>`.
  - Keycap hrefs point to section anchors on home (`#services`, `#work`, `#projects`, `#about`, `#contact`) and to `href(locale,{page:'home'}) + '#…'` on other pages.
- Playwright: `webServer` = `npm run build && npm run start` on port 3000 for this task; Task 9 switches it to `npm run preview` (port 8787) once the Worker exists. `baseURL` from `E2E_BASE_URL` with that default.

- [ ] **Step 1: Write failing tests**
  - `theme.test.ts`: evaluate `themeInitScript` against a fake `document`/`localStorage`: stored `'grafit'` → `dataset.theme === 'grafit'`; stored `'neon'` → unset; `localStorage.getItem` throwing → no exception, unset.
  - `shell.spec.ts`: on `/work/md-mont`, clicking `SR` navigates to `/sr/radovi/md-mont` and `<html lang="sr">` (**Review Focus 1**); on `/sr/projekti/flappy`, `EN` → `/projects/flappy`; with `localStorage['djk-theme']='grafit'` set via `addInitScript`, `/` loads with `data-theme="grafit"` before any client JS runs (check in `page.on('domcontentloaded')`); pressing `2` on `/` scrolls `#work` into view and the keycap gets `is-down` while held; focusing the contact message `textarea` and typing `5 pages` leaves the URL hash unchanged and the textarea value `5 pages` (**Review Focus 4**).
- [ ] **Step 2:** Run unit test → FAIL; `npx playwright test tests/e2e/shell.spec.ts` → FAIL.
- [ ] **Step 3:** Implement. Root layouts render `<html lang>`, the inline theme script in `<head>`, fonts, and `globals.css`. Use placeholder page bodies with the five section ids so the shell test can run; real bodies come in Tasks 6–7. `KeyShortcuts` ignores events with Ctrl/Alt/Meta or when the target is `input`, `textarea`, `select` or `contenteditable`. `SoundSwitch` implements the click from the design README (noise burst through a 2.6 kHz bandpass + 190→90 Hz oscillator), default off, preference in `localStorage['djk-sound']`.
- [ ] **Step 4:** Run tests → PASS.
- [ ] **Step 5: Commit** `git commit -am "Add site shell with theme, language switch and key shortcuts"`

---

### Task 5: DJK-1 React components

**Files:**
- Create: `src/components/djk/{Key,Keycap,Switch,Led,Lcd,Chip,Field,Panel,ProjectModule,Monitor,Service,index}.tsx`
- Test: `tests/unit/djk.test.tsx` (uses `react-dom/server` `renderToStaticMarkup`, no extra deps)

**Interfaces:**
- Produces (all Server Components, markup and class names exactly as in `design/design-system/components/*/preview.html`):
  - `Key({ variant?: 'accent'|'mod'|'cap'; size?: 'md'|'sm'; href?: string; external?: boolean; pressed?: boolean; children })` → `<a>` when `href`, else `<button type="button">`; external adds `target="_blank" rel="noopener"` and `<span class="djk-arrow">↗</span>`
  - `Keycap({ n: number; label: string; href: string; variant? })`
  - `Led({ state: 'on'|'warn'|'off' })`, `Status({ state; children })`
  - `Lcd({ children })`, `LcdNumber({ metric: Metric })`, `LcdGrid`
  - `Chip`, `Chips({ items: string[] })`
  - `Field({ id; label; error?: string; children })` (children = the input), error rendered in `djk-field-error` with `aria-describedby` wiring
  - `Panel({ screws?: boolean; grille?: boolean; as?: 'section'|'div'; id?; children })` — throws in dev if both `screws` and `grille` (one detail per panel)
  - `ProjectModule({ project: Project; locale: Locale; dict: Dictionary })`, `Monitor({ work: Work; locale; dict })`, `ServiceTile({ service: Service; locale })`

- [ ] **Step 1: Write the failing tests**: `Key` with `variant="accent" href="/contact"` renders `<a class="djk-key djk-key--accent" href="/contact">`; `external` adds `rel="noopener"` and `↗`; `Key pressed` renders `aria-pressed="true"`; `LcdNumber` for `{value:'86.9',ghost:'88.8',…}` renders ghost then value inside `.djk-seg`; `Monitor` with `screenshot: null` renders the domain in `.djk-monitor-domain`, with a screenshot renders `<img alt=…>` whose alt contains the work name; `ProjectModule` sets `--tone:var(--tone-red)` for tone `red`; `Panel screws grille` throws.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run → PASS.
- [ ] **Step 5: Commit** `git commit -am "Add DJK-1 React components"`

---

### Task 6: Home and Services pages (both locales)

**Files:**
- Create: `src/pages/{HomePage,ServicesPage}.tsx`, `src/components/client/PipelineRun.tsx`
- Modify: `src/app/(en)/page.tsx`, create `src/app/(en)/services/page.tsx`, `src/app/(sr)/sr/page.tsx`, `src/app/(sr)/sr/usluge/page.tsx`
- Test: `tests/e2e/home.spec.ts`

**Interfaces:**
- Consumes: SiteShell (Task 4), components (Task 5), content (Task 3), dictionaries (Task 2).
- Produces: `HomePage({ locale })`, `ServicesPage({ locale })`. Route files are one-liners passing the locale.
- Home section order (spec): hero (`display-xl` name in an `h1`, LCD line `> websites, apps / > & the backends behind them`, `Start a project` accent → contact, `View work` → `#work`, Status "available for new projects") → `#services` (5 ServiceTiles) → featured Uslužionica Panel with screws (LcdGrid of 4 metrics + `djk-statusbox` pipeline: build, analyzers, tests, coverage ≥75%, CodeQL, docker, deploy, smoke test + `PipelineRun` key) → `#work` (4 Monitors, non-featured works) → `#projects` (4 ProjectModules) → `#about` (GPA LcdNumber `9.36`/`8.88` caption `GPA · 185 ECTS`, short facts, link to About) → `#contact` (InquiryForm placeholder until Task 9).
- Services page: one `<section id={slug}>` per service with its own `h2`, what the client gets, links to proof works/projects, CTA.

- [ ] **Step 1: Write the failing test** `home.spec.ts`: for `/` and `/sr` — status 200, exactly one `h1` containing `Đurađ Manojlović`, exactly one `.djk-key--accent` in `main` hero, five `.djk-service`, four `.djk-monitor`, four `.djk-module`, LCD texts include `574` and `86.9` in both locales and the caption `AUTOMATED TESTS` also on `/sr`; `/sr` hero CTA text is `Započni projekat`; clicking "Run pipeline" makes all 8 LEDs `is-on` within 3 s; `/services` and `/sr/usluge` have five `h2` ids `websites, web-apps, mobile-apps, backends, ai`.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run → PASS.
- [ ] **Step 5: Commit** `git commit -am "Add home and services pages"`

---

### Task 7: Work, project, about pages and 404 (both locales)

**Files:**
- Create: `src/pages/{WorkPage,ProjectPage,AboutPage,NotFoundPage}.tsx`
- Create route files: `(en)/work/[slug]`, `(en)/projects/[slug]`, `(en)/about`, `(en)/not-found.tsx`, `(en)/[...missing]/page.tsx`, and the `(sr)/sr/radovi/[slug]`, `projekti/[slug]`, `o-meni`, `not-found.tsx`, `[...missing]` counterparts
- Add: `public/cv/Djuradj-Manojlovic-CV.pdf` (copy from `D:\code\0PMF\CV\Djuradj Manojlovic CV.pdf`)
- Test: `tests/e2e/pages.spec.ts`

**Interfaces:**
- Consumes: `getWork`, `getProject`, `WORK_SLUGS`, `PROJECT_SLUGS`, components.
- Produces: `[slug]` routes export `generateStaticParams` from the slug tuples and `dynamicParams = false`; unknown slug → `notFound()`.
- Work page: `display` h1 = work name, `body-lg` intro, Panel with metrics (if any), sections as `h2` + paragraphs on level 0, Chips stack, Visit ↗ key, bottom CTA "Start a project".

- [ ] **Step 1: Write the failing test** `pages.spec.ts`: every route from the Global Constraints table for every slug returns 200 in both locales (generate the URL list from `href` × slugs); `/work/nope` and `/sr/radovi/nope` and `/totally-missing` return 404 with the localized not-found heading (EN for `/totally-missing`, SR for `/sr/nepostoji`); `/about` links to `/cv/Djuradj-Manojlovic-CV.pdf`; no page contains `+381`.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run → PASS.
- [ ] **Step 5: Commit** `git commit -am "Add work, project, about and not-found pages"`

---

### Task 8: Inquiry handling core (pure, dependency-injected)

**Files:**
- Create: `src/lib/inquiry/{schema,handle}.ts`, `migrations/0001_inquiries.sql`
- Test: `tests/unit/inquiry.test.ts`

**Interfaces:**
- Produces:
  - `PROJECT_TYPES = ['website','web-app','mobile-app','backend','ai'] as const`
  - `inquirySchema` (zod): `name` 1–100 trimmed; `email` valid, ≤254; `types` array of `PROJECT_TYPES`, min 1; `timeline` optional ≤100; `message` 10–5000 trimmed; `company_website` (honeypot) must be `''`; `turnstile` token string; `locale` `'en'|'sr'`.
  - `type InquiryState = { status: 'idle'|'sent'|'error'; fieldErrors?: Partial<Record<'name'|'email'|'types'|'timeline'|'message', string>>; formError?: 'rateLimited'|'captcha'|'server' }`
  - `type InquiryRecord = { locale; name; email; types: string[]; timeline: string|null; message: string; ipHash: string; createdAt: string }`
  - `type InquiryDeps = { verifyCaptcha(token: string, ip: string): Promise<boolean>; hashIp(ip: string): Promise<string>; countSince(ipHash: string, sinceIso: string): Promise<number>; save(r: InquiryRecord): Promise<number>; markEmailed(id: number): Promise<void>; notify(r: InquiryRecord & { id: number }): Promise<void>; now(): Date }`
  - `handleInquiry(form: FormData, ip: string, deps: InquiryDeps, dict: Dictionary): Promise<InquiryState>` — order: honeypot filled → return `{status:'sent'}` without saving; validate → field errors (localized messages from `dict.contact.errors`); captcha → `captcha`; `countSince(hash, now − 1h) >= 5` → `rateLimited`; `save`; then `notify` + `markEmailed` inside try/catch (failure is logged, still `sent`); `save` throwing → `server`.
  - Migration (exact): `CREATE TABLE inquiries (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT NOT NULL, locale TEXT NOT NULL, name TEXT NOT NULL, email TEXT NOT NULL, types TEXT NOT NULL, timeline TEXT, message TEXT NOT NULL, ip_hash TEXT NOT NULL, emailed INTEGER NOT NULL DEFAULT 0); CREATE INDEX idx_inquiries_ip_created ON inquiries(ip_hash, created_at);`

- [ ] **Step 1: Write the failing tests** with in-memory fake deps:
  - valid form → `sent`, `save` called once, `notify` called once, `markEmailed(id)` called
  - `notify` rejects → still `sent`, `markEmailed` not called, record saved (**Review Focus 3**)
  - name `Đurađ Ćirić`, message `Treba nam sajt — šđčćž ŠĐČĆŽ` → saved record and the notify argument contain those exact strings (**Review Focus 5**)
  - bad email → `error` with `fieldErrors.email === dict.contact.errors.email` (check for both `en` and `sr` dicts)
  - no types → `fieldErrors.types`; message of 9 chars → `fieldErrors.message`; 5001 chars → `fieldErrors.message`
  - honeypot filled → `sent`, `save` not called
  - captcha false → `formError: 'captcha'`, `save` not called
  - 5 prior in the last hour → `rateLimited`; 5 prior older than 1 h → `sent`
  - `save` throws → `formError: 'server'`
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement. **Step 4:** Run → PASS.
- [ ] **Step 5: Commit** `git commit -am "Add inquiry validation and handling with D1 schema"`

---

### Task 9: Cloudflare Worker, real deps, Server Action and form UI

**Files:**
- Create: `open-next.config.ts`, `wrangler.jsonc`, `.dev.vars.example`, `src/lib/inquiry/{deps,action}.ts`, `src/components/client/InquiryForm.tsx`, `src/pages/ContactPage.tsx`, contact route files (`(en)/contact`, `(sr)/sr/kontakt`)
- Modify: `next.config.ts` (call `initOpenNextCloudflareForDev()`), `package.json` scripts, `playwright.config.ts` (webServer → `npm run preview`, port 8787), HomePage `#contact` uses `InquiryForm`
- Test: `tests/e2e/contact.spec.ts`

**Interfaces:**
- Consumes: `handleInquiry`, `InquiryDeps`, `InquiryState` (Task 8).
- Produces:
  - `wrangler.jsonc`: `name: "djk1-portfolio"`, `main: ".open-next/worker.js"`, `assets: { directory: ".open-next/assets", binding: "ASSETS" }`, `compatibility_flags: ["nodejs_compat"]`, current `compatibility_date`, `d1_databases: [{ binding: "DB", database_name: "djk1-inquiries", database_id: "<set after wrangler d1 create>", migrations_dir: "migrations" }]`, `vars: { SITE_URL, TURNSTILE_SITE_KEY, NOTIFY_EMAIL }`; secrets `TURNSTILE_SECRET`, `RESEND_API_KEY`, `IP_SALT`.
  - Scripts: `preview` = `opennextjs-cloudflare build && opennextjs-cloudflare preview`, `deploy` = `opennextjs-cloudflare build && opennextjs-cloudflare deploy`, `db:migrate:local` = `wrangler d1 migrations apply djk1-inquiries --local`, `db:migrate:remote` = same with `--remote`.
  - `createDeps(env): InquiryDeps` — Turnstile siteverify `https://challenges.cloudflare.com/turnstile/v0/siteverify`; `hashIp` = SHA-256 hex of `IP_SALT + ip` (Web Crypto); D1 prepared statements; `notify` = POST `https://api.resend.com/emails` (from `onboarding@resend.dev` until a domain exists, to `NOTIFY_EMAIL`, subject `New inquiry: <types> — <name>`, UTF-8 text body); missing `RESEND_API_KEY` → `notify` throws `ResendNotConfigured` (handled as in Task 8).
  - `submitInquiry(prev: InquiryState, form: FormData): Promise<InquiryState>` (`'use server'`, ip from `cf-connecting-ip`, env via `getCloudflareContext({ async: true })`).
  - `InquiryForm({ locale, dict, siteKey })`: `useActionState(submitInquiry, {status:'idle'})`, `<form action={formAction}>`; type keys are `<label>`-wrapped checkboxes styled as `djk-key--sm` with `aria-pressed` mirror, so they submit without JS; honeypot `company_website` visually hidden (not `display:none`), `tabindex=-1`, `autocomplete="off"`; Turnstile widget script `https://challenges.cloudflare.com/turnstile/v0/api.js`; Status LED shows `replyWithin` → `sending` (pending) → `sent` / error text; on `sent` the form is replaced by the sent panel.
  - `.dev.vars.example` with Turnstile **test** keys: site `1x00000000000000000000AA`, secret `1x0000000000000000000000000000000AA`, `IP_SALT=dev-salt`, no Resend key.

- [ ] **Step 1: Write the failing test** `contact.spec.ts` (against `npm run preview` with `.dev.vars` from the example and local D1 migrated):
  - `/contact`: submit empty → email and message errors visible in English; `/sr/kontakt` same in Serbian
  - fill valid data with `Đurađ` as name → "sent" state; then `npx wrangler d1 execute djk1-inquiries --local --command "select name, emailed from inquiries order by id desc limit 1" --json` shows `Đurađ` and `emailed = 0` (no Resend key locally)
  - new context with `javaScriptEnabled: false`: submit valid form → response page shows the sent state and a new row exists (**Review Focus 2**)
  - six valid submissions in a row → sixth shows the rate-limit message
- [ ] **Step 2:** Run → FAIL.
- [ ] **Step 3:** Implement; `npm run db:migrate:local`.
- [ ] **Step 4:** Run `npx playwright test` (whole suite now on the Worker preview) → PASS. Check Worker size printed by the build stays under 3 MiB gzip; if not, record it in `README.md` and stop for Đurađ's decision (paid plan vs. separate form Worker).
- [ ] **Step 5: Commit** `git commit -am "Add Cloudflare Worker setup and inquiry form"`

---

### Task 10: SEO — metadata, hreflang, sitemap, robots, JSON-LD, OG images

**Files:**
- Create: `src/lib/seo.ts`, `src/components/seo/JsonLd.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`, `scripts/og-images.mjs`, `public/og/*.png`
- Modify: every route file exports `generateMetadata` via `pageMetadata`
- Test: `tests/unit/seo.test.ts`, `tests/e2e/seo.spec.ts`

**Interfaces:**
- Consumes: `href`, `alternates`, content, dictionaries.
- Produces:
  - `pageMetadata(locale: Locale, ref: PageRef): Metadata` → localized `title` (template `%s · Đurađ Manojlović`), `description`, `alternates.canonical = SITE_URL + href(locale, ref)`, `alternates.languages = { en, sr, 'x-default': en }`, `openGraph` (locale `en_US`/`sr_RS`, image `/og/<locale>-<page>[-<slug>].png`, 1200×630)
  - `personJsonLd()`, `professionalServiceJsonLd(locale)` (areaServed Novi Sad, Serbia + remote; `knowsAbout` from service titles), `breadcrumbJsonLd(locale, ref)`
  - `sitemap()` → every `href` × locale with `alternates.languages`; `robots()` → allow all, sitemap URL
  - `og-images.mjs`: renders one DJK-1 styled 1200×630 PNG per page and locale with Playwright from an inline HTML template (name, page title, LCD line) into `public/og/`

- [ ] **Step 1: Write failing tests**
  - `seo.test.ts` (with `SITE_URL=https://example.test`): `pageMetadata('sr',{page:'work',slug:'kaneko'}).alternates` equals `{ canonical: 'https://example.test/sr/radovi/kaneko', languages: { en: 'https://example.test/work/kaneko', sr: 'https://example.test/sr/radovi/kaneko', 'x-default': 'https://example.test/work/kaneko' } }`; `sitemap()` has `2 × (4 + 5 + 4)` = 26 entries, all absolute, unique; `professionalServiceJsonLd('en')['@type'] === 'ProfessionalService'`
  - `seo.spec.ts`: on `/` and `/sr/usluge` exactly one `<link rel="canonical">`, three `hreflang` links pointing to existing 200 URLs; `/sitemap.xml` and `/robots.txt` return 200; every `og:image` URL returns 200; home has a `application/ld+json` script with `ProfessionalService`
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement; `node scripts/og-images.mjs`. **Step 4:** Run → PASS.
- [ ] **Step 5: Commit** `git commit -am "Add SEO metadata, hreflang, sitemap, JSON-LD and OG images"`

---

### Task 11: Client-site screenshots

**Files:**
- Create: `scripts/screenshots.mjs`, `public/work/<slug>-{800,1600}.{avif,webp}`
- Modify: `src/content/work.ts` (`screenshot` paths), `Monitor` renders `<picture>` with AVIF + WebP sources, `width`/`height`, `loading="lazy"` (first monitor `eager` only on the work page)
- Test: extend `tests/unit/content.test.ts`

**Interfaces:**
- Produces: `npm run screenshots` captures `https://<domain>` for each work at 1440×810 (16:9, top of page, after fonts load, cookie banners left as-is), writes resized AVIF/WebP via sharp.

- [ ] **Step 1: Write the failing test**: every work with a non-null `screenshot` has both `800` and `1600` files in AVIF and WebP on disk, each < 200 KB.
- [ ] **Step 2:** Run → FAIL. **Step 3:** Implement and run `npm run screenshots`. **Step 4:** Run → PASS; open `/` and `/work/md-mont` in the browser and check the CRT overlay sits over the image.
- [ ] **Step 5: Commit** `git commit -am "Add client site screenshots"`

---

### Task 12: Accessibility, performance and CI

**Files:**
- Create: `tests/e2e/a11y.spec.ts`, `scripts/lighthouse.mjs`, `.github/workflows/ci.yml`, `README.md`

**Interfaces:**
- Produces:
  - `a11y.spec.ts`: axe on `/`, `/sr`, `/services`, `/work/usluzionica`, `/projects/connect-4`, `/contact` in both `kit` and `grafit` themes → zero `serious` or `critical` violations; keyboard: Tab from page start reaches the first Keycap and shows a visible focus outline
  - `lighthouse.mjs` (as in `D:\code\Kaneko-EU\web\scripts\lighthouse.mjs`): mobile preset on `/` and `/work/usluzionica` against the preview server, fails under 95 in any category
  - `ci.yml`: on push/PR — `npm ci`, `npm run tokens` (fails if `git diff --exit-code src/styles/tokens.css` shows drift), lint, typecheck, `npm test`, Playwright (install chromium, `npm run db:migrate:local`, copy `.dev.vars.example` to `.dev.vars`); job `deploy` on `main` only, needs `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` secrets, runs `npm run db:migrate:remote && npm run deploy`
  - `README.md`: local setup, scripts, the one-time steps Đurađ does (`wrangler login`, `wrangler d1 create djk1-inquiries` and paste the id, `wrangler secret put TURNSTILE_SECRET|RESEND_API_KEY|IP_SALT`, Turnstile widget for the workers.dev host, GitHub secrets), enabling Cloudflare Web Analytics for the Worker in the dashboard (no cookies, no banner), and how to switch `SITE_URL` to a custom domain later

- [ ] **Step 1:** Write `a11y.spec.ts`; run → fix any violations until PASS.
- [ ] **Step 2:** Run `node scripts/lighthouse.mjs` → all four ≥ 95 on both URLs; fix regressions (font subsets, image sizes, unused JS) until it passes.
- [ ] **Step 3:** Add `ci.yml` and `README.md`; run the CI steps locally in order → all pass.
- [ ] **Step 4: Commit** `git commit -am "Add accessibility tests, Lighthouse budget and CI"`
- [ ] **Step 5 (Đurađ):** one-time Cloudflare setup from the README, then `npm run deploy`; open the `*.workers.dev` URL and send one real inquiry.
