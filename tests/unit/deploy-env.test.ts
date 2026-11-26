import { afterEach, describe, expect, it, vi } from 'vitest';
// @ts-expect-error plain ESM script without types
import { checkDeployEnv } from '../../scripts/check-deploy-env.mjs';

const GOOD = { SITE_URL: 'https://djk1-portfolio.example.workers.dev', TURNSTILE_SITE_KEY: '0x4AAAAAAAreal' };

describe('checkDeployEnv', () => {
  it('accepts a real URL and a real site key', () => {
    expect(checkDeployEnv(GOOD)).toEqual([]);
  });

  it.each([
    ['missing', { TURNSTILE_SITE_KEY: GOOD.TURNSTILE_SITE_KEY }],
    ['empty', { ...GOOD, SITE_URL: '' }],
    ['localhost', { ...GOOD, SITE_URL: 'http://localhost:3000' }],
    ['not https', { ...GOOD, SITE_URL: 'http://example.com' }],
  ])('rejects a %s SITE_URL', (_case, env) => {
    expect(checkDeployEnv(env).join(' ')).toMatch(/SITE_URL/);
  });

  it.each([
    ['missing', { SITE_URL: GOOD.SITE_URL }],
    ['empty', { ...GOOD, TURNSTILE_SITE_KEY: '' }],
    ['the always-pass test key', { ...GOOD, TURNSTILE_SITE_KEY: '1x00000000000000000000AA' }],
  ])('rejects a %s TURNSTILE_SITE_KEY', (_case, env) => {
    expect(checkDeployEnv(env).join(' ')).toMatch(/TURNSTILE_SITE_KEY/);
  });
});

describe('site settings', () => {
  afterEach(() => vi.unstubAllEnvs());

  it('falls back to defaults when the build env vars are empty strings (unset CI variables)', async () => {
    vi.stubEnv('SITE_URL', '');
    vi.stubEnv('TURNSTILE_SITE_KEY', '');
    vi.resetModules();
    const site = await import('@/lib/site');
    expect(site.SITE_URL).toBe('http://localhost:3000');
    expect(site.TURNSTILE_SITE_KEY).toBe('1x00000000000000000000AA');
  });
});
