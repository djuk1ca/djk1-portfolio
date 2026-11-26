// Production build for Cloudflare Workers Builds (`npm run cf:build`).
// Pages are prerendered, so the public address and the Turnstile site key are baked in here.
// Both are public values (they end up in the HTML); build variables set in the Cloudflare dashboard win.
import { spawnSync } from 'node:child_process';
import { checkDeployEnv } from './check-deploy-env.mjs';

export const PRODUCTION = {
  SITE_URL: 'https://djk1-portfolio.djuradj-manojlovic04.workers.dev',
  TURNSTILE_SITE_KEY: '0x4AAAAAAGUzt-RVAGQ6XVYx',
};

process.env.SITE_URL ||= PRODUCTION.SITE_URL;
process.env.TURNSTILE_SITE_KEY ||= PRODUCTION.TURNSTILE_SITE_KEY;

const problems = checkDeployEnv(process.env);
if (problems.length) {
  console.error(['Build stopped:', ...problems.map((p) => `  - ${p}`)].join('\n'));
  process.exit(1);
}
console.log(`Building for ${process.env.SITE_URL}`);
const result = spawnSync('npx', ['opennextjs-cloudflare', 'build'], { stdio: 'inherit', env: process.env, shell: true });
process.exit(result.status ?? 1);
