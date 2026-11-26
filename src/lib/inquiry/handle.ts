import type { Dictionary } from '@/i18n/dictionaries';
import type { Locale } from '@/i18n/locales';
import { inquirySchema, readInquiryForm } from './schema';

export type InquiryField = 'name' | 'email' | 'types' | 'timeline' | 'message';

export type InquiryState = {
  status: 'idle' | 'sent' | 'error';
  fieldErrors?: Partial<Record<InquiryField, string>>;
  formError?: 'rateLimited' | 'captcha' | 'server';
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
  /** False when sent without a Turnstile token (no JavaScript): stored, not emailed. */
  verified: boolean;
};

export type InquiryDeps = {
  verifyCaptcha(token: string, ip: string): Promise<boolean>;
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
 * The inquiry counts as sent once it is stored: a failed email never loses it.
 */
export async function handleInquiry(
  form: FormData,
  ip: string,
  deps: InquiryDeps,
  dict: Dictionary,
): Promise<InquiryState> {
  const { input, honeypot, captcha } = readInquiryForm(form);

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
    return { status: 'error', fieldErrors };
  }

  // Without JavaScript the Turnstile widget cannot run, so there is no token. Such inquiries are kept
  // (never lost) but stored as unverified and not emailed, so token-less bots cannot fill the inbox.
  const verified = captcha.trim() !== '';
  if (verified && !(await deps.verifyCaptcha(captcha, ip))) return { status: 'error', formError: 'captcha' };

  const now = deps.now();
  const ipHash = await deps.hashIp(ip);
  const since = new Date(now.getTime() - RATE_LIMIT.windowMs).toISOString();
  if ((await deps.countSince(ipHash, since)) >= RATE_LIMIT.max) return { status: 'error', formError: 'rateLimited' };

  const record: InquiryRecord = { ...parsed.data, ipHash, createdAt: now.toISOString(), verified };
  let id: number;
  try {
    id = await deps.save(record);
  } catch (error) {
    deps.log('inquiry: save failed', error);
    return { status: 'error', formError: 'server' };
  }

  if (!verified) return { status: 'sent' };
  try {
    await deps.notify({ ...record, id });
    await deps.markEmailed(id);
  } catch (error) {
    deps.log(`inquiry ${id}: stored, email notification failed`, error);
  }
  return { status: 'sent' };
}
