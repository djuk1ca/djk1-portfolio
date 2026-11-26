import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.E2E_PORT ?? 8787);
const baseURL = process.env.E2E_BASE_URL ?? `http://localhost:${port}`;

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL,
    contextOptions: { reducedMotion: 'reduce' },
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        // The real Worker (OpenNext build + wrangler) with local D1 and .dev.vars.
        command: 'npm run db:migrate:local && npm run preview',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 600_000,
      },
});
