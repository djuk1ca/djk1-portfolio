'use client';

import { useEffect, useState } from 'react';
import { THEME_KEY, type Theme } from '@/lib/theme';

function currentTheme(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === 'kit' || set === 'grafit') return set;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'grafit' : 'kit';
}

export function ThemeSwitch({ label }: { label: string }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // Sync with the theme the inline head script (or the OS) already applied.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDark(currentTheme() === 'grafit');
  }, []);

  function toggle() {
    const next: Theme = dark ? 'kit' : 'grafit';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Storage blocked: the choice lasts for this page only.
    }
    setDark(!dark);
  }

  return (
    <button className="djk-switch" type="button" role="switch" aria-checked={dark} onClick={toggle}>
      <span className="djk-switch-track" aria-hidden="true">
        <span className="djk-switch-knob" />
      </span>
      {label}
    </button>
  );
}
