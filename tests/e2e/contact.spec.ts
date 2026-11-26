import { execSync } from 'node:child_process';
import { expect, test, type Page } from '@playwright/test';

// These tests share the local D1 database and one client IP (rate limit), so they run one at a time.
test.describe.configure({ mode: 'serial' });

function d1<T = Record<string, unknown>>(sql: string): T[] {
  const out = execSync(`npx wrangler d1 execute djk1-inquiries --local --json --command "${sql}"`, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  });
  return (JSON.parse(out) as Array<{ results: T[] }>)[0].results;
}

async function fill(page: Page, name = 'Đurađ Test') {
  await page.getByLabel('Your name').fill(name);
  await page.getByLabel('Email').fill('client@example.com');
  await page.getByText('Website', { exact: true }).click();
  await page.getByLabel('About the project').fill('We need a company site in two languages.');
}

test.beforeEach(() => {
  d1('DELETE FROM inquiries');
});

test('shows localized errors for an empty form', async ({ page }) => {
  await page.goto('/contact');
  await page.getByRole('button', { name: 'Send inquiry' }).click();
  await expect(page.locator('#inquiry-email-error')).toHaveText('Add an email address so I can reply.');
  await expect(page.locator('#inquiry-message-error')).toHaveText('Tell me a bit more: at least 10 characters.');

  await page.goto('/sr/kontakt');
  await page.getByRole('button', { name: 'Pošalji upit' }).click();
  await expect(page.locator('#inquiry-email-error')).toHaveText('Upišite email adresu da bih mogao da odgovorim.');
});

test('sends a valid inquiry and stores it with diacritics intact', async ({ page }) => {
  await page.goto('/contact');
  await fill(page, 'Đurađ Ćirić');
  await expect(page.locator('input[name="cf-turnstile-response"]')).not.toHaveValue('', { timeout: 15_000 });
  await page.getByRole('button', { name: 'Send inquiry' }).click();
  await expect(page.getByRole('heading', { name: 'Inquiry sent' })).toBeVisible();
  const rows = d1<{ name: string; types: string; emailed: number; verified: number }>(
    'SELECT name, types, emailed, verified FROM inquiries',
  );
  expect(rows).toEqual([{ name: 'Đurađ Ćirić', types: '["website"]', emailed: 0, verified: 1 }]);
});

test('works without JavaScript and keeps the inquiry', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/contact');
  await fill(page);
  await page.getByRole('button', { name: 'Send inquiry' }).click();
  await expect(page.getByRole('heading', { name: 'Inquiry sent' })).toBeVisible();
  expect(d1('SELECT verified FROM inquiries')).toEqual([{ verified: 0 }]);
  await context.close();
});

test('limits a connection to five inquiries an hour', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (let i = 0; i < 5; i++) {
    await page.goto('/contact');
    await fill(page, `Client ${i}`);
    await page.getByRole('button', { name: 'Send inquiry' }).click();
    await expect(page.getByRole('heading', { name: 'Inquiry sent' })).toBeVisible();
  }
  await page.goto('/contact');
  await fill(page, 'Client 6');
  await page.getByRole('button', { name: 'Send inquiry' }).click();
  await expect(page.getByRole('alert')).toContainText('Too many inquiries');
  await context.close();
});

test('typing digits in the message does not trigger section shortcuts', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveAttribute('data-shortcuts', 'on');
  const message = page.locator('#contact').getByLabel('About the project');
  await message.fill('');
  await message.pressSequentially('5 pages');
  await expect(message).toHaveValue('5 pages');
  expect(new URL(page.url()).hash).toBe('');
});
