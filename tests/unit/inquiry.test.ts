import { describe, expect, it, vi } from 'vitest';
import { handleInquiry, type InquiryDeps, type InquiryRecord } from '@/lib/inquiry/handle';
import { getDictionary } from '@/i18n/dictionaries';

const NOW = new Date('2026-11-26T12:00:00Z');
const en = getDictionary('en');
const sr = getDictionary('sr');

function form(over: Record<string, string | string[]> = {}): FormData {
  const base: Record<string, string | string[]> = {
    locale: 'en',
    name: 'Ana Petrović',
    email: 'ana@company.com',
    types: ['website', 'mobile-app'],
    timeline: 'by March',
    message: 'We need a site for our clinic in two languages.',
    company_website: '',
    'cf-turnstile-response': 'token',
    ...over,
  };
  const fd = new FormData();
  for (const [k, v] of Object.entries(base)) for (const one of Array.isArray(v) ? v : [v]) fd.append(k, one);
  return fd;
}

function fakeDeps(over: Partial<InquiryDeps> & { prior?: string[] } = {}) {
  const saved: InquiryRecord[] = [];
  const prior = over.prior ?? [];
  const deps: InquiryDeps = {
    verifyCaptcha: vi.fn(async () => true),
    hashIp: vi.fn(async (ip: string) => `hash:${ip}`),
    countSince: vi.fn(async (_h: string, sinceIso: string) => prior.filter((t) => t >= sinceIso).length),
    save: vi.fn(async (r: InquiryRecord) => {
      saved.push(r);
      return saved.length;
    }),
    markEmailed: vi.fn(async () => {}),
    notify: vi.fn(async () => {}),
    now: () => NOW,
    log: vi.fn(),
    ...over,
  };
  return { deps, saved };
}

describe('handleInquiry', () => {
  it('saves, notifies and marks a valid inquiry as emailed', async () => {
    const { deps, saved } = fakeDeps();
    expect(await handleInquiry(form(), '1.2.3.4', deps, en)).toEqual({ status: 'sent' });
    expect(saved).toHaveLength(1);
    expect(saved[0]).toMatchObject({
      locale: 'en',
      name: 'Ana Petrović',
      email: 'ana@company.com',
      types: ['website', 'mobile-app'],
      timeline: 'by March',
      ipHash: 'hash:1.2.3.4',
      createdAt: NOW.toISOString(),
    });
    expect(deps.notify).toHaveBeenCalledOnce();
    expect(deps.markEmailed).toHaveBeenCalledWith(1);
  });

  it('still reports sent when the email notification fails', async () => {
    const { deps, saved } = fakeDeps({ notify: vi.fn(async () => Promise.reject(new Error('Resend down'))) });
    expect(await handleInquiry(form(), '1.2.3.4', deps, en)).toEqual({ status: 'sent' });
    expect(saved).toHaveLength(1);
    expect(deps.markEmailed).not.toHaveBeenCalled();
    expect(deps.log).toHaveBeenCalled();
  });

  it('keeps Serbian diacritics intact', async () => {
    const { deps, saved } = fakeDeps();
    const message = 'Treba nam sajt — šđčćž ŠĐČĆŽ';
    await handleInquiry(form({ name: 'Đurađ Ćirić', message }), '1.2.3.4', deps, en);
    expect(saved[0].name).toBe('Đurađ Ćirić');
    expect(saved[0].message).toBe(message);
    expect(vi.mocked(deps.notify).mock.calls[0][0]).toMatchObject({ name: 'Đurađ Ćirić', message, id: 1 });
  });

  it('stores an empty timeline as null', async () => {
    const { deps, saved } = fakeDeps();
    await handleInquiry(form({ timeline: '   ' }), '1.2.3.4', deps, en);
    expect(saved[0].timeline).toBeNull();
  });

  it.each([
    ['en', en],
    ['sr', sr],
  ] as const)('rejects a bad email with the %s message', async (_l, dict) => {
    const { deps } = fakeDeps();
    const res = await handleInquiry(form({ email: 'not-an-email' }), '1.2.3.4', deps, dict);
    expect(res).toEqual({ status: 'error', fieldErrors: { email: dict.contact.errors.email } });
    expect(deps.save).not.toHaveBeenCalled();
  });

  it('requires at least one project type', async () => {
    const { deps } = fakeDeps();
    const res = await handleInquiry(form({ types: [] }), '1.2.3.4', deps, en);
    expect(res.fieldErrors?.types).toBe(en.contact.errors.types);
  });

  it('rejects unknown project types', async () => {
    const { deps } = fakeDeps();
    const res = await handleInquiry(form({ types: ['crypto'] }), '1.2.3.4', deps, en);
    expect(res.fieldErrors?.types).toBe(en.contact.errors.types);
  });

  it('rejects a message under 10 characters and over 5000', async () => {
    const { deps } = fakeDeps();
    expect((await handleInquiry(form({ message: '123456789' }), 'ip', deps, en)).fieldErrors?.message).toBe(
      en.contact.errors.message,
    );
    expect((await handleInquiry(form({ message: 'x'.repeat(5001) }), 'ip', deps, en)).fieldErrors?.message).toBe(
      en.contact.errors.messageLong,
    );
  });

  it('requires a name', async () => {
    const { deps } = fakeDeps();
    expect((await handleInquiry(form({ name: '  ' }), 'ip', deps, en)).fieldErrors?.name).toBe(en.contact.errors.name);
  });

  it('pretends success for a filled honeypot and saves nothing', async () => {
    const { deps } = fakeDeps();
    expect(await handleInquiry(form({ company_website: 'http://spam' }), 'ip', deps, en)).toEqual({ status: 'sent' });
    expect(deps.save).not.toHaveBeenCalled();
    expect(deps.verifyCaptcha).not.toHaveBeenCalled();
  });

  it('stores a token-less (no-JavaScript) inquiry as unverified and does not email it', async () => {
    const { deps, saved } = fakeDeps();
    expect(await handleInquiry(form({ 'cf-turnstile-response': '' }), 'ip', deps, en)).toEqual({ status: 'sent' });
    expect(deps.verifyCaptcha).not.toHaveBeenCalled();
    expect(saved[0].verified).toBe(false);
    expect(deps.notify).not.toHaveBeenCalled();
  });

  it('marks a captcha-checked inquiry as verified', async () => {
    const { deps, saved } = fakeDeps();
    await handleInquiry(form(), 'ip', deps, en);
    expect(saved[0].verified).toBe(true);
  });

  it('stops on a failed captcha', async () => {
    const { deps } = fakeDeps({ verifyCaptcha: vi.fn(async () => false) });
    expect(await handleInquiry(form(), 'ip', deps, en)).toEqual({ status: 'error', formError: 'captcha' });
    expect(deps.save).not.toHaveBeenCalled();
  });

  it('rate-limits the sixth inquiry within an hour', async () => {
    const recent = Array.from({ length: 5 }, (_, i) => new Date(NOW.getTime() - (i + 1) * 60_000).toISOString());
    const { deps } = fakeDeps({ prior: recent });
    expect(await handleInquiry(form(), 'ip', deps, en)).toEqual({ status: 'error', formError: 'rateLimited' });
    expect(deps.save).not.toHaveBeenCalled();
  });

  it('allows a new inquiry when the earlier five are older than an hour', async () => {
    const old = Array.from({ length: 5 }, (_, i) => new Date(NOW.getTime() - (61 + i) * 60_000).toISOString());
    const { deps } = fakeDeps({ prior: old });
    expect(await handleInquiry(form(), 'ip', deps, en)).toEqual({ status: 'sent' });
  });

  it('reports a server error when saving fails', async () => {
    const { deps } = fakeDeps({ save: vi.fn(async () => Promise.reject(new Error('D1 down'))) });
    expect(await handleInquiry(form(), 'ip', deps, en)).toEqual({ status: 'error', formError: 'server' });
    expect(deps.notify).not.toHaveBeenCalled();
  });
});
