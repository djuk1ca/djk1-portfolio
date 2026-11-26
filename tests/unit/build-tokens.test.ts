import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
// @ts-expect-error plain ESM script without types
import { buildTokensCss } from '../../scripts/build-tokens.mjs';

const tokens = JSON.parse(readFileSync(new URL('../../design/design-system/tokens.json', import.meta.url), 'utf8'));
const css: string = buildTokensCss(tokens);

function block(selectorStart: string): string {
  const i = css.indexOf(selectorStart);
  expect(i, `missing block ${selectorStart}`).toBeGreaterThanOrEqual(0);
  return css.slice(i, css.indexOf('}', i) + 1);
}

describe('buildTokensCss', () => {
  it('puts the kit theme on :root and [data-theme="kit"]', () => {
    const kit = block(':root, [data-theme="kit"] {');
    expect(kit).toContain('--desk: #d9d7d0;');
    expect(kit).toContain('--accent: #2d4bd2;');
  });

  it('writes the grafit theme under [data-theme="grafit"]', () => {
    const grafit = block('[data-theme="grafit"] {');
    expect(grafit).toContain('--desk: #17181b;');
    expect(grafit).toContain('color-scheme: dark;');
  });

  it('follows a dark OS setting unless kit is chosen explicitly', () => {
    expect(css).toContain('@media (prefers-color-scheme: dark) { :root:not([data-theme="kit"]) {');
    const media = css.slice(css.indexOf('@media (prefers-color-scheme: dark)'));
    expect(media.slice(0, media.indexOf('}'))).toContain('--accent: #4863ee;');
  });

  it('writes a single-value color once, in the kit block', () => {
    expect(block(':root, [data-theme="kit"] {')).toContain('--phosphor: #ffb547;');
    expect(css.match(/--phosphor:/g)?.length).toBe(1);
  });

  it('writes spacing, radius, depth and shadow tokens', () => {
    expect(css).toContain('--space-4: 16px;');
    expect(css).toContain('--radius-panel: 18px;');
    expect(css).toContain('--depth-key: 6px;');
    expect(block(':root, [data-theme="kit"] {')).toContain(
      '--raise: inset 0 1px 0 rgba(255,255,255,0.55), inset 0 -2px 0 rgba(0,0,0,0.06), 0 2px 0 #b8b4aa, 0 22px 34px -22px rgba(45,38,25,0.30);',
    );
  });

  it('starts with the generated marker', () => {
    expect(css.startsWith('/* DJK-1 — generated from tokens.json */')).toBe(true);
  });
});
