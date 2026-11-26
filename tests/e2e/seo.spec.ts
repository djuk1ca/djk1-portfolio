import { expect, test } from '@playwright/test';

for (const path of ['/', '/sr/usluge', '/work/kaneko', '/sr/projekti/connect-4']) {
  test(`${path} has canonical, hreflang and an Open Graph image`, async ({ page, request }) => {
    await page.goto(path);
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(1);
    expect(new URL((await canonical.getAttribute('href'))!).pathname).toBe(path);

    const langs = await page
      .locator('link[rel="alternate"][hreflang]')
      .evaluateAll((ls) => ls.map((l) => [l.getAttribute('hreflang'), l.getAttribute('href')] as const));
    expect(langs.map(([l]) => l).sort()).toEqual(['en', 'sr', 'x-default']);
    for (const [, href] of langs) expect((await request.get(new URL(href!).pathname)).status(), href!).toBe(200);

    const og = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect((await request.get(new URL(og!).pathname)).status(), og!).toBe(200);
  });
}

test('home carries ProfessionalService and Person JSON-LD', async ({ page }) => {
  await page.goto('/');
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const types = blocks.map((b) => JSON.parse(b)['@type']);
  expect(types).toEqual(expect.arrayContaining(['ProfessionalService', 'Person']));
});

test('a work page carries breadcrumbs', async ({ page }) => {
  await page.goto('/sr/radovi/md-mont');
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  expect(blocks.map((b) => JSON.parse(b)['@type'])).toContain('BreadcrumbList');
});

test('sitemap and robots are served', async ({ request }) => {
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  expect((await sitemap.text()).match(/<url>/g)?.length).toBe(26);
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  expect(await robots.text()).toContain('Sitemap:');
});

test('the 404 page is not indexed', async ({ page }) => {
  await page.goto('/sr/nepostoji');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});
