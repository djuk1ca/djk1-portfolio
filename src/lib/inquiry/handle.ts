import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/locales';
import { inquirySchema, readInquiryForm } from './schema';

export type InquiryField = 'name' | 'email' | 'types' | 'timeline' | 'message';

/** What the visitor typed, sent back with an error so the form can show it again (also without JavaScript). */
export type InquiryValues = { name: string; email: string; types: string[]; timeline: string; message: string };

export type InquiryState = {
  status: 'idle' | 'sent' | 'error';
  fieldErrors?: Partial<Record<InquiryField, string>>;
  formError?: 'rateLimited' | 'captcha' | 'server';
  values?: InquiryValues;
};

export type InquiryRecord = {
  locale: Locale;
  name: string;
  email: string;
  types: string[];
  timeline: string | null;
  message: string;
  ipHash: string;
  createdAt: string;
  /** False when the spam check did not run (no JavaScript, widget blocked, Turnstile unreachable). */
  verified: boolean;
};

/** 'unavailable': Turnstile is not configured or could not be reached; the inquiry is kept as unverified. */
export type CaptchaResult = 'pass' | 'fail' | 'unavailable';

export type InquiryDeps = {
  verifyCaptcha(token: string, ip: string): Promise<CaptchaResult>;
  hashIp(ip: string): Promise<string>;
  countSince(ipHash: string, sinceIso: string): Promise<number>;
  save(record: InquiryRecord): Promise<number>;
  markEmailed(id: number): Promise<void>;
  notify(record: InquiryRecord & { id: number }): Promise<void>;
  now(): Date;
  log(message: string, error?: unknown): void;
};

export const RATE_LIMIT = { max: 5, windowMs: 60 * 60 * 1000 };

/**
 * Validates, checks spam and rate limits, stores the inquiry, then emails it.
 * The inquiry counts as sent once it is stored: a failed email never loses it. Inquiries that skipped the
 * spam check are stored as unverified and still emailed (flagged), so none sits unread in the database.
 */
export async function handleInquiry(
  form: FormData,
  ip: string,
  deps: InquiryDeps,
  dict: Dictionary,
): Promise<InquiryState> {
  const { input, honeypot, captcha } = readInquiryForm(form);
  const values: InquiryValues = {
    name: input.name,
    email: input.email,
    types: input.types,
    timeline: input.timeline,
    message: input.message,
  };

  // Bots that fill the hidden field get a normal-looking answer and nothing is stored.
  if (honeypot.trim() !== '') return { status: 'sent' };

  const parsed = inquirySchema.safeParse(input);
  if (!parsed.success) {
    const errors = dict.contact.errors;
    const fieldErrors: InquiryState['fieldErrors'] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0] as InquiryField | 'locale';
      if (field === 'locale' || fieldErrors[field]) continue;
      fieldErrors[field] = field === 'message' && issue.code === 'too_big' ? errors.messageLong : errors[field];
    }
    return { status: 'error', fieldErrors, values };
  }

  // Without a token (no JavaScript, blocked widget) the check cannot run: keep the inquiry, flagged unverified.
  let verified = false;
  if (captcha.trim() !== '') {
    const result = await deps.verifyCaptcha(captcha, ip);
    if (result === 'fail') return { status: 'error', formError: 'captcha', values };
    verified = result === 'pass';
  }

  const now = deps.now();
  const ipHash = await deps.hashIp(ip);
  const since = new Date(now.getTime() - RATE_LIMIT.windowMs).toISOString();
  if ((await deps.countSince(ipHash, since)) >= RATE_LIMIT.max)
    return { status: 'error', formError: 'rateLimited', values };

  const record: InquiryRecord = { ...parsed.data, ipHash, createdAt: now.toISOString(), verified };
  let id: number;
  try {
    id = await deps.save(record);
  } catch (error) {
    deps.log('inquiry: save failed', error);
    return { status: 'error', formError: 'server', values };
  }

  try {
    await deps.notify({ ...record, id });
  } catch (error) {
    deps.log(`inquiry ${id}: stored, email notification failed`, error);
    return { status: 'sent' };
  }
  try {
    await deps.markEmailed(id);
  } catch (error) {
    deps.log(`inquiry ${id}: emailed, could not mark it as emailed`, error);
  }
  return { status: 'sent' };
}
