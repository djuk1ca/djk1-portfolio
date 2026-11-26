import { expect, test } from '@playwright/test';

test.describe('language switch', () => {
  test('keeps the same work item when switching to Serbian', async ({ page }) => {
    await page.goto('/work/md-mont');
    await page.getByRole('link', { name: 'SR', exact: true }).click();
    await expect(page).toHaveURL(/\/sr\/radovi\/md-mont$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'sr');
  });

  test('keeps the same project when switching to English', async ({ page }) => {
    await page.goto('/sr/projekti/flappy');
    await page.getByRole('link', { name: 'EN', exact: true }).click();
    await expect(page).toHaveURL(/\/projects\/flappy$/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('marks the current language', async ({ page }) => {
    await page.goto('/sr/usluge');
    await expect(page.getByRole('link', { name: 'SR', exact: true })).toHaveAttribute('aria-current', 'true');
  });
});

test.describe('theme', () => {
  test('applies a stored theme before the page paints', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('djk-theme', 'grafit'));
    let themeAtDomReady: string | null = null;
    page.on('domcontentloaded', async () => {
      themeAtDomReady = await page.evaluate(() => document.documentElement.dataset.theme ?? null);
    });
    await page.goto('/');
    await expect.poll(() => themeAtDomReady).toBe('grafit');
  });

  test('toggles and remembers Graphite', async ({ page }) => {
    await page.goto('/');
    const sw = page.getByRole('switch', { name: 'Graphite' });
    await sw.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'grafit');
    await page.reload();
    await expect(page.getByRole('switch', { name: 'Graphite' })).toHaveAttribute('aria-checked', 'true');
  });
});

test.describe('key shortcuts', () => {
  test('pressing 2 presses the Work key and scrolls to the section', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-shortcuts', 'on');
    await page.keyboard.down('2');
    await expect(page.locator('.djk-kc[data-key="2"]')).toHaveClass(/is-down/);
    await page.keyboard.up('2');
    await expect(page.locator('.djk-kc[data-key="2"]')).not.toHaveClass(/is-down/);
    await expect.poll(async () => (await page.locator('#work').boundingBox())?.y ?? 9999).toBeLessThan(200);
  });
});
