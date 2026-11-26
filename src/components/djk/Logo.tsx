/**
 * The DJK-1 mark: a cobalt keycap seen from the front, with "Đ" as its main legend and a small "1"
 * as the secondary legend in the corner (from the handle djuk1ca, read as the model number DJK-1).
 */
export function LogoMark({ size = 40 }: { size?: number }) {
  return (
    <svg className="djk-logo-mark" width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      {/* side of the key (depth) */}
      <rect x="2" y="7" width="36" height="31" rx="8" className="djk-logo-side" />
      {/* top of the key */}
      <rect x="2" y="2" width="36" height="31" rx="8" className="djk-logo-top" />
      <rect x="5.5" y="4.5" width="29" height="24" rx="5.5" className="djk-logo-dish" />
      {/* Đ: stem and bowl, with the stroke through the stem */}
      <path
        className="djk-logo-legend"
        fillRule="evenodd"
        d="M11.5 9.5h6.2c5.3 0 8.3 3.1 8.3 8s-3 8-8.3 8h-6.2zm4 3.4v9.2h2.1c2.8 0 4.3-1.7 4.3-4.6s-1.5-4.6-4.3-4.6z"
      />
      <rect className="djk-logo-legend" x="8.4" y="16.1" width="9.4" height="2.8" rx="0.6" />
      {/* secondary legend "1" */}
      <path className="djk-logo-legend djk-logo-sub" d="M30.1 22.6l1.9-1.2h1.1v6.1h-1.4v-4.5l-1.6 1z" />
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
