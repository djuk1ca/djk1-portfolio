// Generates src/styles/tokens.css from the DJK-1 design system's tokens.json (the single source of every value).
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const HEADER = '/* DJK-1 — generated from tokens.json */';

/** @param {unknown} value @param {string} theme @param {string} first */
function themed(value, theme, first) {
  if (typeof value === 'string') return theme === first ? value : undefined;
  if (value && typeof value === 'object') return /** @type {Record<string, string>} */ (value)[theme];
  return undefined;
}

/** @param {string[]} lines */
const body = (lines) => lines.map((l) => `  ${l}`).join('\n');

/** @param {any} tokens */
export function buildTokensCss(tokens) {
  const themes = tokens.color.themes.map((t) => t.id);
  const [first, ...rest] = themes;
  const themedTokens = [...tokens.color.tokens, ...(tokens.shadow?.tokens ?? [])];

  const linesFor = (theme) =>
    themedTokens.flatMap((t) => {
      const v = themed(t.value, theme, first);
      return v === undefined ? [] : [`--${t.name}: ${v};`];
    });

  const out = [HEADER, '', `:root, [data-theme="${first}"] {`, body([...linesFor(first), 'color-scheme: light;']), '}'];

  for (const theme of rest) {
    const lines = [...linesFor(theme), 'color-scheme: dark;'];
    out.push('', `[data-theme="${theme}"] {`, body(lines), '}');
    out.push(
      '',
      `@media (prefers-color-scheme: dark) { :root:not([data-theme="${first}"]) {`,
      body(lines),
      '} }',
    );
  }

  const scalar = ['spacing', 'radius', 'depth'].flatMap((family) =>
    (tokens[family]?.tokens ?? []).map((t) => `--${t.name}: ${t.value};`),
  );
  out.push('', ':root {', body(scalar), '}', '');

  // One class per type style, e.g. .display-xl, .body, .lcd-xl (family from the group unless the style has its own).
  for (const group of tokens.type?.groups ?? []) {
    for (const s of group.styles) {
      const decls = [
        `font-family: var(--font-${s.family ?? group.family});`,
        `font-size: ${s.fontSize};`,
        s.lineHeight !== undefined && `line-height: ${s.lineHeight};`,
        s.fontWeight !== undefined && `font-weight: ${s.fontWeight};`,
        s.letterSpacing !== undefined && `letter-spacing: ${s.letterSpacing};`,
      ].filter(Boolean);
      out.push(`.${s.name} { ${decls.join(' ')} }`);
    }
  }
  out.push('');
  return out.join('\n');
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const src = new URL('../design/design-system/tokens.json', import.meta.url);
  const dest = new URL('../src/styles/tokens.css', import.meta.url);
  writeFileSync(dest, buildTokensCss(JSON.parse(readFileSync(src, 'utf8'))));
  console.log('wrote src/styles/tokens.css');
}
