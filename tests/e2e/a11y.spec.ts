import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const PAGES = ['/', '/sr', '/services', '/work/usluzionica', '/projects/connect-4', '/contact', '/sr/kontakt'];

for (const theme of ['kit', 'grafit'] as const) {
  for (const path of PAGES) {
    test(`${path} has no serious accessibility issues (${theme})`, async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem('djk-theme', t), theme);
      await page.goto(path);
      await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
      const { violations } = await new AxeBuilder({ page }).exclude('[class*="turnstile"]').analyze();
      const serious = violations
        .filter((v) => v.impact === 'serious' || v.impact === 'critical')
        .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`);
      expect(serious).toEqual([]);
    });
  }
}

test('keyboard focus reaches the navigation with a visible outline', async ({ page }) => {
  await page.goto('/');
  const first = page.locator('.djk-kc[data-key="1"]');
  for (let i = 0; i < 6 && !(await first.evaluate((el) => el === document.activeElement)); i++) await page.keyboard.press('Tab');
  await expect(first).toBeFocused();
  const outline = await first.evaluate((el) => getComputedStyle(el).outlineStyle);
  expect(outline).toBe('solid');
});
