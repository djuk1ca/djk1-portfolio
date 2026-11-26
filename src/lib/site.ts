// Build-time site settings. Pages are prerendered, so these come from the build environment
// (process.env, or the wrangler.jsonc vars that OpenNext exposes during `opennextjs-cloudflare build`).

export const SITE_URL = (process.env.SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

/** Turnstile's always-pass test key until a real widget is configured. */
export const TURNSTILE_SITE_KEY = process.env.TURNSTILE_SITE_KEY ?? '1x00000000000000000000AA';
