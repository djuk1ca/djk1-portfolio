// Captures the top of each client site (16:9) and writes 800 and 1600 px wide AVIF and WebP into public/work/.
// Usage: node scripts/screenshots.mjs [slug …]   (default: all)
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import sharp from 'sharp';

const SITES = {
  usluzionica: 'https://usluzionica.rs',
  'broker-auditor': 'https://broker-auditory-fe.vercel.app/',
  'md-mont': 'https://mdmont.rs',
  kaneko: 'https://kaneko-eeu.com',
  simplice: 'https://simplicebeautylounge.com',
};

const only = process.argv.slice(2);
const out = fileURLToPath(new URL('../public/work/', import.meta.url));
mkdirSync(out, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 2, locale: 'en-US' });

for (const [slug, url] of Object.entries(SITES)) {
  if (only.length && !only.includes(slug)) continue;
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 45_000 }).catch(() => page.waitForLoadState('load'));
    await page.evaluate(() => document.fonts?.ready);
    await page.waitForTimeout(1500); // let entrance animations settle
    const png = await page.screenshot({ type: 'png' });
    for (const width of [800, 1600]) {
      const img = sharp(png).resize({ width, height: Math.round((width * 9) / 16), fit: 'cover', position: 'top' });
      await img.clone().avif({ quality: 50, effort: 6 }).toFile(`${out}${slug}-${width}.avif`);
      await img.clone().webp({ quality: 72 }).toFile(`${out}${slug}-${width}.webp`);
    }
    console.log(`${slug}: ok`);
  } catch (error) {
    console.error(`${slug}: failed — ${error.message}`);
    process.exitCode = 1;
  } finally {
    await page.close();
  }
}
await browser.close();
