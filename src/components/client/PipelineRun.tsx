'use client';

import { useRef, useState } from 'react';
import { Led, type LedState } from '@/components/djk/Status';

/** The Uslužionica CI pipeline as a row of LEDs. At rest every step is green; the key replays a run. */
export function PipelineRun({ steps, title, runLabel }: { steps: string[]; title: string; runLabel: string }) {
  const [states, setStates] = useState<LedState[]>(() => steps.map(() => 'on'));
  const running = useRef(false);

  function run() {
    if (running.current) return;
    running.current = true;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const step = reduced ? 0 : 260;
    setStates(steps.map(() => 'off'));
    steps.forEach((_, i) => {
      setTimeout(() => setStates((s) => s.map((v, j) => (j === i ? 'warn' : v))), i * step);
      setTimeout(
        () => {
          setStates((s) => s.map((v, j) => (j === i ? 'on' : v)));
          if (i === steps.length - 1) running.current = false;
        },
        i * step + (reduced ? 0 : 220),
      );
    });
  }

  return (
    <div className="djk-statusbox">
      <span className="djk-eyebrow">{title}</span>
      <ul className="djk-pipeline" aria-live="off">
        {steps.map((s, i) => (
          <li key={s} className="djk-status">
            <Led state={states[i]} />
            {s}
          </li>
        ))}
      </ul>
      <div>
        <button type="button" className="djk-key djk-key--sm djk-key--mod" onClick={run}>
          <span aria-hidden="true">▶</span> {runLabel}
        </button>
      </div>
    </div>
  );
}
