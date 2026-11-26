'use client';

import { useActionState, useRef, type FormEvent } from 'react';
import { Field } from '@/components/djk/Field';
import { Status } from '@/components/djk/Status';
import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/locales';
import { submitInquiry } from '@/lib/inquiry/action';
import type { InquiryState } from '@/lib/inquiry/handle';
import { HONEYPOT_FIELD, PROJECT_TYPES } from '@/lib/inquiry/schema';
import styles from './InquiryForm.module.css';
import { useTurnstile } from './useTurnstile';

const INITIAL: InquiryState = { status: 'idle' };

export function InquiryForm({ locale, dict, siteKey, email }: { locale: Locale; dict: Dictionary; siteKey: string; email: string }) {
  const [state, formAction, pending] = useActionState(submitInquiry, INITIAL);
  const t = dict.contact;
  const err = state.fieldErrors ?? {};
  const { setContainer, start, waitForToken, hasToken } = useTurnstile(siteKey, locale);
  const waiting = useRef(false);

  // With JavaScript, a submit waits for the spam-check token instead of going out without one.
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    if (hasToken() || waiting.current) return;
    e.preventDefault();
    waiting.current = true;
    const form = e.currentTarget;
    waitForToken().then(() => {
      form.requestSubmit();
      waiting.current = false;
    });
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
    >
      <input type="hidden" name="locale" value={locale} />
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor={HONEYPOT_FIELD}>Company website</label>
        <input id={HONEYPOT_FIELD} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className={styles.pair}>
        <Field id="inquiry-name" label={t.labels.name} error={err.name}>
          <input id="inquiry-name" name="name" type="text" autoComplete="name" placeholder={t.placeholders.name} maxLength={100} />
        </Field>
        <Field id="inquiry-email" label={t.labels.email} error={err.email}>
          <input id="inquiry-email" name="email" type="email" autoComplete="email" placeholder={t.placeholders.email} maxLength={254} />
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
        <input id="inquiry-timeline" name="timeline" type="text" placeholder={t.placeholders.timeline} maxLength={100} />
      </Field>
      <Field id="inquiry-message" label={t.labels.message} error={err.message}>
        <textarea id="inquiry-message" name="message" rows={5} placeholder={t.placeholders.message} maxLength={5000} />
      </Field>

      <div ref={setContainer} className={styles.turnstile} />

      {state.formError && (
        <p className={styles.formError} role="alert">
          {t.errors[state.formError]} <a href={`mailto:${email}`}>{email}</a>
        </p>
      )}

      <div className={styles.foot}>
        <Status state={pending ? 'warn' : 'on'}>{pending ? t.sending : dict.status.replyWithin}</Status>
        <button type="submit" className="djk-key djk-key--accent" disabled={pending}>
          {t.submit}
        </button>
      </div>
    </form>
  );
}
