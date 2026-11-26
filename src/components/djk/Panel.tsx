import type { ReactNode } from 'react';

type PanelProps = {
  as?: 'section' | 'div';
  id?: string;
  screws?: boolean;
  grille?: boolean;
  className?: string;
  labelledBy?: string;
  children: ReactNode;
};

/** The case (level +1). At most one decoration per panel: screws or a grille. */
export function Panel({ as: Tag = 'div', id, screws, grille, className, labelledBy, children }: PanelProps) {
  if (screws && grille) throw new Error('Panel: use screws or a grille, not both (one detail per panel).');
  return (
    <Tag id={id} className={className ? `djk-panel ${className}` : 'djk-panel'} aria-labelledby={labelledBy}>
      {screws &&
        (['tl', 'tr', 'bl', 'br'] as const).map((p) => <i key={p} className={`djk-screw ${p}`} aria-hidden="true" />)}
      {children}
      {grille && <div className="djk-grille" aria-hidden="true" />}
    </Tag>
  );
}
