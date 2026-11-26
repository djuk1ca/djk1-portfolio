# DJK-1 · Đurađ Manojlović

Bilingual (English at `/`, Serbian at `/sr`) freelance portfolio in the DJK-1 retro design system: mechanical keys, an amber LCD and a plastic case. Next.js 16 on Cloudflare Workers via OpenNext, with an inquiry form stored in D1.

- Design system: `design/design-system/` (tokens, component guidelines) · [live](https://claude.ai/artifact/NwK1ncVjcdGMqCEDCGWjs7)
- Spec: `docs/superpowers/specs/2026-11-26-portfolio-site-design.md` · Plan: `docs/superpowers/plans/2026-11-26-portfolio-site.md`

## Run it

```bash
npm install
cp .dev.vars.example .dev.vars     # Turnstile test keys, no email sending
npm run db:migrate:local           # local D1 for the inquiry form
npm run dev                        # http://localhost:3000 (Next dev with Cloudflare bindings)
npm run preview                    # the real Worker on http://localhost:8787
```

| Script | What it does |
| --- | --- |
| `npm run tokens` | Regenerates `src/styles/tokens.css` from `design/design-system/tokens.json` (the only source of colors, type, spacing). |
| `npm test` | Unit tests (Vitest): routes, dictionaries, content, components, inquiry handling, SEO. |
| `npm run e2e` | Playwright against the Worker preview: every route in both languages, language switch, theme, shortcuts, the form (with and without JavaScript), SEO tags, axe in both themes. |
| `npm run lighthouse` | Mobile Lighthouse on `/` and `/work/usluzionica` against a running preview; fails under 95. In Git Bash pass paths with `MSYS_NO_PATHCONV=1`. |
| `npm run screenshots` | Re-captures the client sites into `public/work/` (AVIF + WebP, 800 and 1600 px). |
| `npm run og -- http://localhost:8787` | Renders the 26 Open Graph images into `public/og/` from a running preview. Rebuild afterwards. |

On Windows OpenNext prints a compatibility warning; builds and previews work, CI runs on Linux.

## Editing content

- UI strings: `src/i18n/dictionaries/en.ts` and `sr.ts`. The build fails if a Serbian string is missing.
- Services, work and projects: `src/content/*.ts`, each text as `{ en, sr }`. Lines marked `TODO(Đurađ)` need a fact check.
- Tech names, LCD metrics, CI step names and project names stay in English in both languages.
- After changing titles or descriptions, regenerate the OG images (`npm run og`).

## Inquiry form

Server Action → zod validation → Cloudflare Turnstile → rate limit (5 per hour per IP) → D1 → email via Resend.
An inquiry counts as sent once it is stored; a failed email never loses it. Inquiries that skipped the spam check (no JavaScript, blocked widget, Turnstile unreachable) are stored with
`verified = 0` and still emailed, with `[unverified]` in the subject. Read all of them with:

```bash
npx wrangler d1 execute djk1-inquiries --remote --command "SELECT * FROM inquiries ORDER BY id DESC LIMIT 20"
```

## Deploying (Cloudflare Workers Builds)

The Worker `djk1-portfolio` is connected to this GitHub repo in the Cloudflare dashboard; every push to `main`
builds and deploys there. GitHub Actions only runs the tests.

`SITE_URL` and `TURNSTILE_SITE_KEY` are **build-time** variables: pages are prerendered, so they are baked in at
build. `npm run cf:build` stops while either is missing, points at localhost or is the Turnstile test key.

One-time setup (Đurađ):

1. **D1 database:** Storage & Databases → D1 → *Create* `djk1-inquiries`. Copy its **Database ID** into
   `wrangler.jsonc` → `d1_databases[0].database_id` and push. Then open the database → *Console*, paste the
   contents of `migrations/0001_inquiries.sql` and run it once.
2. **Turnstile:** Turnstile → *Add widget* for the host `djk1-portfolio.<your-subdomain>.workers.dev`
   (later also the custom domain). Keep the **site key** and the **secret key**.
3. **Worker → Settings → Build:**
   - Build command: `npm run cf:build`
   - Deploy command: `npm run cf:deploy`
   - Build variables: `SITE_URL` = `https://djk1-portfolio.<your-subdomain>.workers.dev`, `TURNSTILE_SITE_KEY` = the site key
4. **Worker → Settings → Variables and Secrets** (runtime, type *Secret*): `TURNSTILE_SECRET`, `RESEND_API_KEY`
   (from resend.com; the shared sender only delivers to your Resend account email), `IP_SALT` (any long random string).
5. *Retry build* (or push). Then Worker → Settings → enable Web Analytics (no cookies, no banner needed).

Manual deploy from your machine instead: `npx wrangler login`, `export SITE_URL=… TURNSTILE_SITE_KEY=…`,
`npm run db:migrate:remote && npm run deploy`.

## Moving to a custom domain

Add the domain under the Worker's *Domains & Routes*, set the `SITE_URL` build variable to it, add the domain to the Turnstile widget, redeploy, and redirect the `workers.dev` address to the domain (301) so search engines carry the pages over. Then submit `https://<domain>/sitemap.xml` in Google Search Console.
