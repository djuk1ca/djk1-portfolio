#!/usr/bin/env node
// Lighthouse (mobile) for the pages with a quality target. Run against the Worker preview:
//   npm run preview          (in another terminal)
//   npm run lighthouse       # or: node scripts/lighthouse.mjs http://localhost:8787 /work/md-mont
// Writes HTML reports to lighthouse/ and exits 1 if any category scores below 95.
import fs from 'node:fs';
import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse';

const args = process.argv.slice(2);
const base = (args.find((a) => a.startsWith('http')) ?? 'http://localhost:8787').replace(/\/$/, '');
const paths = args.filter((a) => a.startsWith('/'));
const targets = paths.length ? paths : ['/', '/work/usluzionica'];
const MIN = 95;
const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];

fs.mkdirSync('lighthouse', { recursive: true });
const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new'] });
let failed = false;
try {
  for (const path of targets) {
    await fetch(base + path); // warm the Worker
    const { lhr, report } = await lighthouse(base + path, {
      port: chrome.port,
      output: 'html',
      onlyCategories: CATEGORIES,
      logLevel: 'error',
    });
    const file = `lighthouse/${path === '/' ? 'home' : path.slice(1).replace(/\//g, '-')}.html`;
    fs.writeFileSync(file, report);
    const scores = CATEGORIES.map((c) => [c, Math.round((lhr.categories[c].score ?? 0) * 100)]);
    console.log(`${path}  ${scores.map(([c, s]) => `${c} ${s}`).join(' · ')}  → ${file}`);
    for (const [c, s] of scores)
      if (s < MIN) {
        failed = true;
        console.log(`  ✗ ${c} ${s} < ${MIN}`);
      }
  }
} finally {
  await chrome.kill();
}
process.exit(failed ? 1 : 0);
