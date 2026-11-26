import type { ReactNode } from 'react';

export type LedState = 'on' | 'warn' | 'off';

export function Led({ state }: { state: LedState }) {
  return <i className={state === 'off' ? 'djk-led' : `djk-led is-${state}`} aria-hidden="true" />;
}

/** An LED with its word: the state is never told by color alone. */
export function Status({ state, children }: { state: LedState; children: ReactNode }) {
  return (
    <span className="djk-status">
      <Led state={state} />
      {children}
    </span>
  );
}
