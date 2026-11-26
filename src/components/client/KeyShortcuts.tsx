'use client';

import { useEffect } from 'react';
import { shortcutKey } from '@/lib/shortcuts';

/** Number keys 1–5 press the matching Keycap in the header and go to its section. */
export function KeyShortcuts() {
  useEffect(() => {
    const keyFor = (key: string) => document.querySelector<HTMLAnchorElement>(`.djk-kc[data-key="${key}"]`);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // KeyboardEvent's ctrlKey/altKey/metaKey are prototype getters, so build the object explicitly (no spread).
    const read = (e: KeyboardEvent) =>
      shortcutKey({
        key: e.key,
        ctrlKey: e.ctrlKey,
        altKey: e.altKey,
        metaKey: e.metaKey,
        target: e.target as HTMLElement | null,
      });

    const down = (e: KeyboardEvent) => {
      const key = read(e);
      if (!key) return;
      const cap = keyFor(key);
      if (!cap) return;
      e.preventDefault();
      cap.classList.add('is-down');
      if (e.repeat) return;
      const url = new URL(cap.href);
      const target = url.pathname === location.pathname && url.hash ? document.querySelector(url.hash) : null;
      if (target) {
        target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
        history.replaceState(null, '', url.hash);
      } else {
        location.assign(cap.href);
      }
    };
    const up = (e: KeyboardEvent) => {
      if (/^[1-5]$/.test(e.key)) keyFor(e.key)?.classList.remove('is-down');
    };

    document.addEventListener('keydown', down);
    document.addEventListener('keyup', up);
    document.documentElement.dataset.shortcuts = 'on';
    return () => {
      delete document.documentElement.dataset.shortcuts;
      document.removeEventListener('keydown', down);
      document.removeEventListener('keyup', up);
    };
  }, []);

  return null;
}
