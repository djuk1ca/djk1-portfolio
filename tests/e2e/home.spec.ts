import { expect, test } from '@playwright/test';

for (const [path, cta] of [
  ['/', 'Start a project'],
  ['/sr', 'Započni projekat'],
] as const) {
  test.describe(`home ${path}`, () => {
    test.beforeEach(async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
    });

    test('has one h1 with the full name', async ({ page }) => {
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).toHaveText('Đurađ Manojlović');
    });

    test('has exactly one primary key in the hero', async ({ page }) => {
      const hero = page.locator('#top');
      await expect(hero.locator('.djk-key--accent')).toHaveCount(1);
      await expect(hero.locator('.djk-key--accent')).toHaveText(cta);
    });

    test('shows services, client work and projects', async ({ page }) => {
      await expect(page.locator('#services .djk-service')).toHaveCount(5);
      await expect(page.locator('#work .djk-monitor')).toHaveCount(4);
      await expect(page.locator('#projects .djk-module')).toHaveCount(4);
    });

    test('keeps LCD metrics in English', async ({ page }) => {
      const lcd = page.locator('#featured .djk-lcd');
      await expect(lcd.filter({ hasText: '574' })).toContainText('AUTOMATED TESTS');
      await expect(lcd.filter({ hasText: '86.9' })).toContainText('% LINE COVERAGE');
    });

    test('runs the CI pipeline', async ({ page }) => {
      await page.locator('#featured').getByRole('button').click();
      await expect(page.locator('#featured .djk-pipeline .djk-led.is-on')).toHaveCount(8, { timeout: 3000 });
    });

    test('has every home section', async ({ page }) => {
      for (const id of ['services', 'work', 'projects', 'about', 'contact']) await expect(page.locator(`#${id}`)).toHaveCount(1);
    });
  });
}

for (const path of ['/services', '/sr/usluge']) {
  test(`services page ${path} has a section per service`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveCount(1);
    const ids = await page.locator('main section[id] > h2').evaluateAll((hs) => hs.map((h) => h.parentElement!.id));
    expect(ids).toEqual(['websites', 'web-apps', 'mobile-apps', 'backends', 'ai']);
  });
}
