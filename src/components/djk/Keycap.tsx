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
  /** Small-key height, label only (header navigation). The number key still works as a shortcut. */
  compact?: boolean;
}) {
  const cls = ['djk-key djk-kc', compact && 'djk-kc--compact djk-key--sm', variant && `djk-key--${variant}`]
    .filter(Boolean)
    .join(' ');
  return (
    <a className={cls} href={href} data-key={n}>
      {!compact && <b aria-hidden="true">{n}</b>}
      <span>{label}</span>
    </a>
  );
}
