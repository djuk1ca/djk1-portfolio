// Renders one 1200×630 Open Graph image per page into public/og/, in the DJK-1 style.
// Reads the page list from a running site's sitemap and each page's own og:image path, title and description.
// Usage: node scripts/og-images.mjs [baseUrl]   (default http://localhost:8787)
import { mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const base = (process.argv[2] ?? 'http://localhost:8787').replace(/\/$/, '');
const out = new URL('../public/og/', import.meta.url);
mkdirSync(out, { recursive: true });

const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function template({ title, description, lang }) {
  const name = 'Đurađ Manojlović';
  const heading = title.split(' · ')[0] === name ? title.split(' · ')[1] ?? name : title.split(' · ')[0];
  const line = lang === 'sr' ? '> sajtovi, aplikacije i backend' : '> websites, apps & backends';
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=IBM+Plex+Sans:wght@400;500&family=VT323&display=block">
<style>
  html,body{margin:0;width:1200px;height:630px;background:#d9d7d0;font-family:"IBM Plex Sans",sans-serif;color:#1f1e1b}
  .case{position:absolute;inset:36px;background:#e7e5df;border-radius:28px;box-shadow:inset 0 2px 0 rgba(255,255,255,.6),0 3px 0 #b8b4aa,0 30px 50px -30px rgba(45,38,25,.4);padding:56px 64px;display:flex;flex-direction:column;justify-content:space-between}
  .screw{position:absolute;width:16px;height:16px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#f6f5f1,#b8b4aa 85%);box-shadow:inset 0 0 0 1px rgba(0,0,0,.18)}
  .eyebrow{font:600 18px/1 Archivo;font-stretch:112%;letter-spacing:.14em;text-transform:uppercase;color:#68645c}
  h1{margin:18px 0 0;font:900 76px/.98 Archivo;font-stretch:122%;letter-spacing:-.02em;max-width:900px}
  p{margin:20px 0 0;font-size:25px;line-height:1.4;color:#55524b;max-width:820px}
  .row{display:flex;align-items:flex-end;justify-content:space-between;gap:24px}
  .lcd{background:#16120a;border-radius:10px;box-shadow:inset 0 2px 6px rgba(0,0,0,.4),0 0 0 4px #b8b4aa;color:#ffb547;font:36px/1 VT323;padding:16px 22px;text-shadow:0 0 8px rgba(255,181,71,.55)}
  .keys{display:flex;gap:12px}
  .k{width:64px;height:58px;border-radius:10px;background:#f4f3ef;box-shadow:0 7px 0 #c2beb4,0 14px 16px -6px rgba(45,38,25,.3);font:800 22px/58px Archivo;text-align:center;color:#1f1e1b}
  .k.a{background:#2d4bd2;box-shadow:0 7px 0 #1b3093,0 14px 16px -6px rgba(45,38,25,.3);color:#fff}
  .k.m{background:#6a6762;box-shadow:0 7px 0 #4d4a46,0 14px 16px -6px rgba(45,38,25,.3);color:#f4f3ef}
</style></head><body><div class="case">
  <i class="screw" style="top:18px;left:18px"></i><i class="screw" style="top:18px;right:18px"></i>
  <i class="screw" style="bottom:18px;left:18px"></i><i class="screw" style="bottom:18px;right:18px"></i>
  <div><div class="eyebrow">ĐM · DJK-1 · ${esc(name)}</div><h1>${esc(heading)}</h1><p>${esc(description)}</p></div>
  <div class="row"><div class="lcd">${esc(line)}<span style="display:inline-block;width:.55em;height:.9em;background:#ffb547;margin-left:6px;vertical-align:-.08em"></span></div>
  <div class="keys"><span class="k m">W</span><span class="k">A</span><span class="k">M</span><span class="k">B</span><span class="k a">E</span></div></div>
</div></body></html>`;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);

for (const path of urls) {
  await page.goto(`${base}${path}`);
  const og = await page.locator('meta[property="og:image"]').getAttribute('content');
  const title = await page.title();
  const description = (await page.locator('meta[name="description"]').getAttribute('content')) ?? '';
  const lang = (await page.locator('html').getAttribute('lang')) ?? 'en';
  const file = new URL(og).pathname.replace(/^\/og\//, '');
  await page.setContent(template({ title, description, lang }), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: fileURLToPath(new URL(file, out)), type: 'png' });
  console.log(`og/${file}`);
}
await browser.close();
