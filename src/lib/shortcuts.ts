export type ShortcutEvent = {
  key: string;
  ctrlKey: boolean;
  altKey: boolean;
  metaKey: boolean;
  target: { tagName?: string; isContentEditable?: boolean } | null;
};

const TYPING_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

/** The section shortcut ('1'–'5') this key event should trigger, or null when it must be left alone. */
export function shortcutKey(e: ShortcutEvent): string | null {
  if (e.ctrlKey || e.altKey || e.metaKey) return null;
  if (!/^[1-5]$/.test(e.key)) return null;
  const t = e.target;
  if (t && (TYPING_TAGS.has((t.tagName ?? '').toUpperCase()) || t.isContentEditable)) return null;
  return e.key;
}
