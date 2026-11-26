'use client';

import { useEffect } from 'react';
import { shortcutKey } from '@/lib/shortcuts';

/** Number keys 1–5 press the matching Keycap in the header and go to its section. */
export function KeyShortcuts() {
  useEffect(() => {
    const keyFor = (key: string) => document.querySelector<HTMLAnchorElement>(`.djk-kc[data-key="${key}"]`);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const down = (e: KeyboardEvent) => {
      const key = shortcutKey({ ...e, key: e.key, target: e.target as HTMLElement | null });
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
    const up = (e: KeyboardEvent) => keyFor(e.key)?.classList.remove('is-down');

    document.addEventListener('keydown', down);
    document.addEventListener('keyup', up);
    return () => {
      document.removeEventListener('keydown', down);
      document.removeEventListener('keyup', up);
    };
  }, []);

  return null;
}
