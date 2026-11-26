import type { ReactNode } from 'react';

type KeyProps = {
  variant?: 'cap' | 'accent' | 'mod';
  size?: 'md' | 'sm';
  href?: string;
  external?: boolean;
  pressed?: boolean;
  className?: string;
  children: ReactNode;
};

export function keyClass({ variant = 'cap', size = 'md', className }: Pick<KeyProps, 'variant' | 'size' | 'className'>) {
  return ['djk-key', variant !== 'cap' && `djk-key--${variant}`, size === 'sm' && 'djk-key--sm', className]
    .filter(Boolean)
    .join(' ');
}

/** The DJK-1 mechanical key: a link when given href, otherwise a button. */
export function Key({ variant, size, href, external, pressed, className, children }: KeyProps) {
  const cls = keyClass({ variant, size, className });
  const label = (
    <>
      {children}
      {external && (
        <>
          {' '}
          <span className="djk-arrow" aria-hidden="true">
            ↗
          </span>
        </>
      )}
    </>
  );
  if (href)
    return external ? (
      <a className={cls} href={href} target="_blank" rel="noopener">
        {label}
      </a>
    ) : (
      <a className={cls} href={href}>
        {label}
      </a>
    );
  return (
    <button type="button" className={cls} aria-pressed={pressed}>
      {label}
    </button>
  );
}
