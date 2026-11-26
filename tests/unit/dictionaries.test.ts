import { describe, expect, it } from 'vitest';
import { en } from '@/i18n/dictionaries/en';
import { sr } from '@/i18n/dictionaries/sr';
import { getDictionary } from '@/i18n/dictionaries';

type Tree = { [k: string]: string | Tree };

function leaves(tree: Tree, prefix = ''): Array<[string, string]> {
  return Object.entries(tree).flatMap(([k, v]) =>
    typeof v === 'string' ? [[prefix + k, v] as [string, string]] : leaves(v, `${prefix}${k}.`),
  );
}

// Strings that are legitimately identical in both languages (names, English-only labels).
const SAME_IN_BOTH = new Set([
  'brand',
  'lang.en',
  'lang.sr',
  'cta.demo',
  'work.period',
  'projects.status',
  'contact.labels.email',
  'contact.placeholders.name',
  'contact.placeholders.email',
  'contact.types.backend',
  'footer.hosting',
  'meta.titleTemplate',
]);

describe('dictionaries', () => {
  const enLeaves = new Map(leaves(en as unknown as Tree));
  const srLeaves = new Map(leaves(sr as unknown as Tree));

  it('have the same keys', () => {
    expect([...srLeaves.keys()].sort()).toEqual([...enLeaves.keys()].sort());
  });

  it('have no empty Serbian strings', () => {
    for (const [k, v] of srLeaves) expect(v.trim(), k).not.toBe('');
  });

  it('translate every Serbian string', () => {
    const untranslated = [...srLeaves].filter(([k, v]) => !SAME_IN_BOTH.has(k) && v === enLeaves.get(k)).map(([k]) => k);
    expect(untranslated).toEqual([]);
  });

  it('contain the inquiry error messages', () => {
    for (const key of ['name', 'email', 'types', 'message', 'timeline', 'rateLimited', 'captcha', 'server'])
      expect(enLeaves.has(`contact.errors.${key}`), key).toBe(true);
  });

  it('returns the dictionary for a locale', () => {
    expect(getDictionary('sr')).toBe(sr);
    expect(getDictionary('en')).toBe(en);
  });
});
