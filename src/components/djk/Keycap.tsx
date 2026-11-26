export function Keycap({
  n,
  label,
  href,
  variant,
  compact,
}: {
  n: number;
  label: string;
  href: string;
  variant?: 'accent' | 'mod';
  /** Single-row, small-key height: number and label side by side (header navigation). */
  compact?: boolean;
}) {
  const cls = ['djk-key djk-kc', compact && 'djk-kc--compact djk-key--sm', variant && `djk-key--${variant}`]
    .filter(Boolean)
    .join(' ');
  return (
    <a className={cls} href={href} data-key={n}>
      <b aria-hidden="true">{n}</b>
      <span>{label}</span>
    </a>
  );
}
