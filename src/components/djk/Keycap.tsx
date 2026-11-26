export function Keycap({
  n,
  label,
  href,
  variant,
}: {
  n: number;
  label: string;
  href: string;
  variant?: 'accent' | 'mod';
}) {
  return (
    <a className={`djk-key djk-kc${variant ? ` djk-key--${variant}` : ''}`} href={href} data-key={n}>
      <b aria-hidden="true">{n}</b>
      <span>{label}</span>
    </a>
  );
}
