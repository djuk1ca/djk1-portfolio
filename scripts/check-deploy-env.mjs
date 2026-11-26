// Refuses a production build whose prerendered pages would carry localhost URLs or the Turnstile test key.
// Runs before `npm run deploy` (see package.json).
import { fileURLToPath } from 'node:url';

const TEST_SITE_KEY = '1x00000000000000000000AA';

/** @param {Record<string, string | undefined>} env @returns {string[]} problems, empty when the env is fine */
export function checkDeployEnv(env) {
  const problems = [];
  const url = env.SITE_URL ?? '';
  if (!url) problems.push('SITE_URL is not set (export SITE_URL=https://… before deploying).');
  else if (!/^https:\/\//.test(url) || /localhost|127\.0\.0\.1/.test(url))
    problems.push(`SITE_URL must be the public https address, got "${url}".`);
  const key = env.TURNSTILE_SITE_KEY ?? '';
  if (!key) problems.push('TURNSTILE_SITE_KEY is not set (the site key of your Turnstile widget).');
  else if (key === TEST_SITE_KEY) problems.push('TURNSTILE_SITE_KEY is the always-pass test key; use your widget key.');
  return problems;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const problems = checkDeployEnv(process.env);
  if (problems.length) {
    console.error(['Deploy stopped:', ...problems.map((p) => `  - ${p}`)].join('\n'));
    process.exit(1);
  }
  console.log(`Deploying ${process.env.SITE_URL}`);
}
