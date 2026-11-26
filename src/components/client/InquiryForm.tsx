'use client';

import { useActionState, useEffect, useRef, useState, type FormEvent } from 'react';
import { Field } from '@/components/djk/Field';
import { Status } from '@/components/djk/Status';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/locales';
import { submitInquiry } from '@/lib/inquiry/action';
import type { InquiryState } from '@/lib/inquiry/handle';
import { CAPTCHA_FIELD, HONEYPOT_FIELD, PROJECT_TYPES } from '@/lib/inquiry/schema';
import styles from './InquiryForm.module.css';
import { useTurnstile } from './useTurnstile';

const INITIAL: InquiryState = { status: 'idle' };

const valuesOf = (fd: FormData): InquiryState['values'] => ({
  name: String(fd.get('name') ?? ''),
  email: String(fd.get('email') ?? ''),
  types: fd.getAll('types').map(String),
  timeline: String(fd.get('timeline') ?? ''),
  message: String(fd.get('message') ?? ''),
});

/**
 * Without JavaScript the browser posts the form to the Server Action and the page re-renders with its state
 * (typed values come back in `state.values`). With JavaScript the submit is handled here instead: it waits for
 * the spam-check token, never sends twice, keeps what was typed, and turns a network failure into a message.
 */
export function InquiryForm({
  locale,
  dict,
  siteKey,
  email,
}: {
  locale: Locale;
  dict: Dictionary;
  siteKey: string;
  email: string;
}) {
  const [serverState, formAction] = useActionState(submitInquiry, INITIAL);
  const [jsState, setJsState] = useState<InquiryState | null>(null);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const { setContainer, start, waitForToken, reset, remove } = useTurnstile(siteKey, locale);
  const state = jsState ?? serverState;
  const t = dict.contact;
  const err = state.fieldErrors ?? {};
  const v = state.values;

  useEffect(() => {
    if (state.status === 'sent') remove();
  }, [state.status, remove]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    try {
      if (!fd.get(CAPTCHA_FIELD)) {
        const token = await waitForToken();
        if (token) fd.set(CAPTCHA_FIELD, token);
      }
      const result = await submitInquiry(INITIAL, fd);
      setJsState(result);
      if (result.status !== 'sent') reset();
    } catch {
      setJsState({ status: 'error', formError: 'server', values: valuesOf(fd) });
      reset();
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }

  if (state.status === 'sent')
    return (
      <div className={`djk-panel ${styles.sent}`} role="status">
        <h3 className="heading-2">{t.sentTitle}</h3>
        <Status state="on">{t.sent}</Status>
      </div>
    );

  return (
    <form
      action={formAction}
      onSubmit={onSubmit}
      onFocus={start}
      onPointerDown={start}
      className={`djk-panel ${styles.form}`}
      noValidate
      aria-busy={busy}
    >
      <input type="hidden" name="locale" value={locale} />
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor={HONEYPOT_FIELD}>Leave this field empty</label>
        <input
          id={HONEYPOT_FIELD}
          name={HONEYPOT_FIELD}
          type="text"
          tabIndex={-1}
          autoComplete="one-time-code"
          defaultValue=""
        />
      </div>

      <div className={styles.pair}>
        <Field id="inquiry-name" label={t.labels.name} error={err.name}>
          <input
            id="inquiry-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder={t.placeholders.name}
            maxLength={100}
            defaultValue={v?.name}
          />
        </Field>
        <Field id="inquiry-email" label={t.labels.email} error={err.email}>
          <input
            id="inquiry-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={t.placeholders.email}
            maxLength={254}
            defaultValue={v?.email}
          />
        </Field>
      </div>

      <fieldset className={styles.types} aria-describedby={err.types ? 'inquiry-types-error' : undefined}>
        <legend>{t.labels.types}</legend>
        <div className="djk-row">
          {PROJECT_TYPES.map((type) => (
            <label key={type} className="djk-key djk-key--sm">
              <input
                className="djk-visually-hidden"
                type="checkbox"
                name="types"
                value={type}
                defaultChecked={v?.types.includes(type)}
              />
              {t.types[type]}
            </label>
          ))}
        </div>
        {err.types && (
          <p className="djk-field-error" id="inquiry-types-error">
            {err.types}
          </p>
        )}
      </fieldset>

      <Field id="inquiry-timeline" label={t.labels.timeline} error={err.timeline}>
        <input
          id="inquiry-timeline"
          name="timeline"
          type="text"
          placeholder={t.placeholders.timeline}
          maxLength={100}
          defaultValue={v?.timeline}
        />
      </Field>
      <Field id="inquiry-message" label={t.labels.message} error={err.message}>
        <textarea
          id="inquiry-message"
          name="message"
          rows={5}
          placeholder={t.placeholders.message}
          maxLength={5000}
          defaultValue={v?.message}
        />
      </Field>

      <div ref={setContainer} className={styles.turnstile} />

      {state.formError && (
        <p className={styles.formError} role="alert">
          {t.errors[state.formError]} <a href={`mailto:${email}`}>{email}</a>
        </p>
      )}

      <div className={styles.foot}>
        <Status state={busy ? 'warn' : 'on'}>{busy ? t.sending : dict.status.replyWithin}</Status>
        <button type="submit" className="djk-key djk-key--accent" disabled={busy}>
          {t.submit}
        </button>
      </div>
    </form>
  );
}
