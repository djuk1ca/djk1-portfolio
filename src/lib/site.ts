// Build-time site settings. Pages are prerendered, so these must be set in the shell that runs the build
// (e.g. `export SITE_URL=https://…` before `npm run deploy`, or the CI env). wrangler.jsonc vars only exist at runtime.
// `||` (not `??`): an unset GitHub Actions variable arrives as an empty string. `npm run deploy` refuses both defaults.

export const TURNSTILE_TEST_SITE_KEY = '1x00000000000000000000AA';

export const SITE_URL = (process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

/** Turnstile's always-pass test key until a real widget is configured. */
export const TURNSTILE_SITE_KEY = process.env.TURNSTILE_SITE_KEY || TURNSTILE_TEST_SITE_KEY;
