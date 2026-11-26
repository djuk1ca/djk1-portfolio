/**
 * The DJK-1 mark: a cobalt keycap whose legend is the model name set in two rows, "DJ" over "K1"
 * (from the handle djuk1ca). The letters are drawn as geometric shapes after expanded Archivo:
 * the stems of D and K share one column, the stems of J and 1 the other. The "1" is dimmed like a
 * serial number.
 */
export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg className="djk-logo-mark" width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      {/* side of the key (depth) */}
      <rect x="2" y="7" width="36" height="31" rx="8" className="djk-logo-side" />
      {/* top of the key */}
      <rect x="2" y="2" width="36" height="31" rx="8" className="djk-logo-top" />
      <rect x="5.5" y="4.5" width="29" height="24" rx="5.5" className="djk-logo-dish" />
      {/* D and J */}
      <path
        className="djk-logo-legend"
        fillRule="evenodd"
        d="M10.2 6.3H15A4.2 4.2 0 0 1 19.2 10.5V11.5A4.2 4.2 0 0 1 15 15.7H10.2ZM12.6 8.7V13.3H15A1.8 1.8 0 0 0 16.8 11.5V10.5A1.8 1.8 0 0 0 15 8.7ZM29.6 6.3V11.7A4 4 0 0 1 21.6 11.7V10.53H24V11.7A1.6 1.6 0 0 0 27.2 11.7V6.3Z"
      />
      {/* K */}
      <path
        className="djk-logo-legend"
        d="M10.2 17.5h2.4v9.4h-2.4ZM11.4 21.72L16.09 17.5L19.67 17.5L11.4 24.96ZM15.2 20.13L19.26 26.76L19.03 26.9L16.42 26.9L13.07 21.43Z"
      />
      {/* 1, the serial number */}
      <path
        className="djk-logo-legend djk-logo-sub"
        d="M27.2 17.5h2.4v9.4h-2.4ZM24.13 19.66L26.94 17.5L28.23 17.5L29.07 18.59L25.45 21.37Z"
      />
    </svg>
  );
}

export function Logo({ name, tagline }: { name: string; tagline: string }) {
  return (
    <span className="djk-logo">
      <LogoMark />
      <span className="djk-logo-text">
        <span className="djk-logo-name">{name}</span>
        <span className="djk-logo-tag">{tagline}</span>
      </span>
    </span>
  );
}
