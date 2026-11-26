import type { ReactNode } from 'react';
import type { Metric } from '@/content';

export function Lcd({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className ? `djk-lcd ${className}` : 'djk-lcd'}>{children}</div>;
}

export function LcdNumber({ metric }: { metric: Metric }) {
  return (
    <Lcd>
      <span className="djk-seg">
        <span className="djk-ghost" aria-hidden="true">
          {metric.ghost}
        </span>
        <span>{metric.value}</span>
      </span>
      <span className="djk-lcd-cap">{metric.caption}</span>
    </Lcd>
  );
}

export function LcdGrid({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="djk-lcd-grid">
      {metrics.map((m) => (
        <LcdNumber key={m.caption} metric={m} />
      ))}
    </div>
  );
}

export function Cursor() {
  return <span className="djk-cursor" aria-hidden="true" />;
}
