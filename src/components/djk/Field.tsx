import { cloneElement, type ReactElement } from 'react';

type InputProps = { 'aria-describedby'?: string; 'aria-invalid'?: boolean };

/** A recessed form field with its label above and, when given, an error under it. */
export function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: ReactElement<InputProps>;
}) {
  const errorId = `${id}-error`;
  return (
    <div className="djk-field">
      <label htmlFor={id}>{label}</label>
      {error ? cloneElement(children, { 'aria-describedby': errorId, 'aria-invalid': true }) : children}
      {error && (
        <p className="djk-field-error" id={errorId}>
          {error}
        </p>
      )}
    </div>
  );
}
