import { z } from 'zod';

export const PROJECT_TYPES = ['website', 'web-app', 'mobile-app', 'backend', 'ai'] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export const HONEYPOT_FIELD = 'company_website';
export const CAPTCHA_FIELD = 'cf-turnstile-response';

export const inquirySchema = z.object({
  locale: z.enum(['en', 'sr']),
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().max(254).pipe(z.email()),
  types: z.array(z.enum(PROJECT_TYPES)).min(1),
  timeline: z
    .string()
    .trim()
    .max(100)
    .transform((v) => (v === '' ? null : v)),
  message: z.string().trim().min(10).max(5000),
});

export type InquiryInput = z.infer<typeof inquirySchema>;

/** Reads the inquiry fields out of a submitted form (missing fields become empty strings). */
export function readInquiryForm(form: FormData) {
  const str = (k: string) => {
    const v = form.get(k);
    return typeof v === 'string' ? v : '';
  };
  return {
    input: {
      locale: str('locale') === 'sr' ? 'sr' : 'en',
      name: str('name'),
      email: str('email'),
      types: form.getAll('types').filter((v): v is string => typeof v === 'string'),
      timeline: str('timeline'),
      message: str('message'),
    },
    honeypot: str(HONEYPOT_FIELD),
    captcha: str(CAPTCHA_FIELD),
  };
}
