import { expect, test } from '@playwright/test';
import { allPageRefs, href } from '../../src/i18n/routes';

const urls = allPageRefs().flatMap((ref) => [href('en', ref), href('sr', ref)]);

test('every page answers 200 in both languages, without a phone number', async ({ request }) => {
  expect(urls.length).toBe(26); // (home, services, 5 work, 4 projects, about, contact) × 2
  for (const url of urls) {
    const res = await request.get(url);
    expect(res.status(), url).toBe(200);
    expect(await res.text(), url).not.toContain('+381');
  }
});

for (const [url, lang, heading] of [
  ['/work/nope', 'en', 'Nothing on this channel'],
  ['/projects/nope', 'en', 'Nothing on this channel'],
  ['/totally-missing', 'en', 'Nothing on this channel'],
  ['/sr/radovi/nope', 'sr', 'Na ovom kanalu nema ničega'],
  ['/sr/nepostoji', 'sr', 'Na ovom kanalu nema ničega'],
] as const) {
  test(`unknown ${url} is a localized 404`, async ({ page }) => {
    const res = await page.goto(url);
    expect(res?.status()).toBe(404);
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
    await expect(page.locator('h1')).toHaveText(heading);
  });
}

test('a work page shows the case study', async ({ page }) => {
  await page.goto('/work/usluzionica');
  await expect(page.locator('h1')).toHaveText('Uslužionica');
  await expect(page.getByRole('heading', { level: 2, name: 'What it is' })).toBeVisible();
  await expect(page.locator('main .djk-lcd').filter({ hasText: '574' })).toContainText('AUTOMATED TESTS');
  await expect(page.getByRole('link', { name: /usluzionica\.rs/ })).toHaveAttribute('href', 'https://usluzionica.rs');
});

test('a Serbian project page is in Serbian', async ({ page }) => {
  await page.goto('/sr/projekti/language-id');
  await expect(page.locator('h1')).toHaveText('Language ID');
  await expect(page.getByRole('heading', { level: 2, name: 'Model' })).toBeVisible();
  await expect(page.locator('main')).toContainText('99.5');
});

test('about links to the CV', async ({ page, request }) => {
  await page.goto('/about');
  const cv = page.getByRole('link', { name: /CV/ });
  await expect(cv).toHaveAttribute('href', '/cv/Djuradj-Manojlovic-CV.pdf');
  expect((await request.get('/cv/Djuradj-Manojlovic-CV.pdf')).status()).toBe(200);
});
