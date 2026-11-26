'use client';

import { useCallback, useEffect, useRef } from 'react';

type TurnstileApi = {
  render(el: HTMLElement, opts: Record<string, unknown>): string;
  remove(id: string): void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
let scriptPromise: Promise<TurnstileApi> | null = null;

function loadScript(): Promise<TurnstileApi> {
  scriptPromise ??= new Promise((resolve, reject) => {
    if (window.turnstile) return resolve(window.turnstile);
    const s = document.createElement('script');
    s.src = SRC;
    s.async = true;
    s.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('turnstile missing')));
    s.onerror = () => {
      scriptPromise = null;
      reject(new Error('turnstile failed to load'));
    };
    document.head.appendChild(s);
  });
  return scriptPromise;
}

/**
 * Loads Cloudflare Turnstile only once the visitor starts on the form (it is ~200 KB of third-party JS),
 * renders it into `container`, and lets a submit wait for the token instead of going out without one.
 */
export function useTurnstile(siteKey: string, language: string) {
  const container = useRef<HTMLDivElement | null>(null);
  const setContainer = useCallback((el: HTMLDivElement | null) => {
    container.current = el;
  }, []);
  const token = useRef<string>('');
  const waiters = useRef<Array<(t: string) => void>>([]);
  const started = useRef(false);
  const widgetId = useRef<string | null>(null);

  const start = useCallback(() => {
    if (started.current || !container.current) return;
    started.current = true;
    loadScript()
      .then((api) => {
        if (!container.current) return;
        widgetId.current = api.render(container.current, {
          sitekey: siteKey,
          language,
          theme: 'auto',
          callback: (t: string) => {
            token.current = t;
            waiters.current.splice(0).forEach((w) => w(t));
          },
          'expired-callback': () => {
            token.current = '';
          },
        });
      })
      .catch(() => {
        started.current = false;
        // Without the widget the inquiry still goes out, stored as unverified.
        waiters.current.splice(0).forEach((w) => w(''));
      });
  }, [siteKey, language]);

  /** Resolves with the token (or '' if Turnstile could not load); waits at most `timeoutMs`. */
  const waitForToken = useCallback(
    (timeoutMs = 10_000) =>
      new Promise<string>((resolve) => {
        if (token.current) return resolve(token.current);
        start();
        const timer = setTimeout(() => resolve(''), timeoutMs);
        waiters.current.push((t) => {
          clearTimeout(timer);
          resolve(t);
        });
      }),
    [start],
  );

  useEffect(
    () => () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current);
    },
    [],
  );

  const hasToken = useCallback(() => token.current !== '', []);
  return { setContainer, start, waitForToken, hasToken };
}
