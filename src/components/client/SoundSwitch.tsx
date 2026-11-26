'use client';

import { useEffect, useRef, useState } from 'react';
import { SOUND_KEY } from '@/lib/theme';

/** A short mechanical-key click: a noise burst through a ~2.6 kHz bandpass plus a low 190→90 Hz "thock". */
function playClick(ctx: AudioContext) {
  const t = ctx.currentTime;
  const len = Math.floor(ctx.sampleRate * 0.035);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 5);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const bp = ctx.createBiquadFilter();
  bp.type = 'bandpass';
  bp.frequency.value = 2600;
  bp.Q.value = 0.8;
  const gain = ctx.createGain();
  gain.gain.value = 0.55;
  src.connect(bp).connect(gain).connect(ctx.destination);
  src.start(t);

  const osc = ctx.createOscillator();
  const og = ctx.createGain();
  osc.frequency.setValueAtTime(190, t);
  osc.frequency.exponentialRampToValueAtTime(90, t + 0.05);
  og.gain.setValueAtTime(0.18, t);
  og.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
  osc.connect(og).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.07);
}

export function SoundSwitch({ label }: { label: string }) {
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const onRef = useRef(false);

  useEffect(() => {
    let stored = false;
    try {
      stored = localStorage.getItem(SOUND_KEY) === 'on';
    } catch {}
    onRef.current = stored;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOn(stored);

    const handler = (e: PointerEvent) => {
      if (!onRef.current) return;
      if (!(e.target instanceof Element) || !e.target.closest('.djk-key, .djk-switch')) return;
      try {
        ctxRef.current ??= new AudioContext();
        playClick(ctxRef.current);
      } catch {}
    };
    document.addEventListener('pointerdown', handler);
    return () => document.removeEventListener('pointerdown', handler);
  }, []);

  function toggle() {
    const next = !on;
    onRef.current = next;
    setOn(next);
    try {
      localStorage.setItem(SOUND_KEY, next ? 'on' : 'off');
    } catch {}
  }

  return (
    <button className="djk-switch" type="button" role="switch" aria-checked={on} onClick={toggle}>
      <span className="djk-switch-track" aria-hidden="true">
        <span className="djk-switch-knob" />
      </span>
      {label}
    </button>
  );
}
