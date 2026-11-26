import { describe, expect, it } from 'vitest';
import { THEME_KEY, themeInitScript } from '@/lib/theme';
import { shortcutKey } from '@/lib/shortcuts';

function runInit(storage: { getItem: (k: string) => string | null }) {
  const documentElement = { dataset: {} as Record<string, string> };
  new Function('document', 'localStorage', themeInitScript)({ documentElement }, storage);
  return documentElement.dataset.theme;
}

describe('themeInitScript', () => {
  it('applies a stored grafit theme', () => {
    expect(runInit({ getItem: (k) => (k === THEME_KEY ? 'grafit' : null) })).toBe('grafit');
  });

  it('applies a stored kit theme', () => {
    expect(runInit({ getItem: () => 'kit' })).toBe('kit');
  });

  it('ignores unknown values', () => {
    expect(runInit({ getItem: () => 'neon' })).toBeUndefined();
  });

  it('survives blocked storage', () => {
    expect(
      runInit({
        getItem: () => {
          throw new Error('SecurityError');
        },
      }),
    ).toBeUndefined();
  });
});

describe('shortcutKey', () => {
  const ev = (over: Partial<Parameters<typeof shortcutKey>[0]>) => ({
    key: '2',
    ctrlKey: false,
    altKey: false,
    metaKey: false,
    target: { tagName: 'BODY', isContentEditable: false },
    ...over,
  });

  it('returns the digit for 1–5 on the page', () => {
    expect(shortcutKey(ev({}))).toBe('2');
    expect(shortcutKey(ev({ key: '5' }))).toBe('5');
  });

  it('ignores other keys', () => {
    expect(shortcutKey(ev({ key: '6' }))).toBeNull();
    expect(shortcutKey(ev({ key: 'a' }))).toBeNull();
  });

  it('ignores digits typed into form fields', () => {
    for (const tagName of ['INPUT', 'TEXTAREA', 'SELECT']) expect(shortcutKey(ev({ target: { tagName } }))).toBeNull();
    expect(shortcutKey(ev({ target: { tagName: 'DIV', isContentEditable: true } }))).toBeNull();
  });

  it('ignores modified keys', () => {
    expect(shortcutKey(ev({ ctrlKey: true }))).toBeNull();
    expect(shortcutKey(ev({ metaKey: true }))).toBeNull();
    expect(shortcutKey(ev({ altKey: true }))).toBeNull();
  });
});
