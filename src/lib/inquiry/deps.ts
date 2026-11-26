import type { InquiryDeps, InquiryRecord } from './handle';

export type InquiryEnv = {
  DB: D1Database;
  TURNSTILE_SECRET?: string;
  RESEND_API_KEY?: string;
  IP_SALT?: string;
  NOTIFY_EMAIL?: string;
};

export class ResendNotConfigured extends Error {
  constructor() {
    super('RESEND_API_KEY is not set: inquiry stored, not emailed');
  }
}

const TURNSTILE_VERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const RESEND_EMAILS = 'https://api.resend.com/emails';

async function sha256Hex(text: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function emailText(r: InquiryRecord & { id: number }): string {
  return [
    `Inquiry #${r.id} (${r.locale.toUpperCase()}) · ${r.createdAt}`,
    '',
    `Name:     ${r.name}`,
    `Email:    ${r.email}`,
    `Needs:    ${r.types.join(', ')}`,
    `Timeline: ${r.timeline ?? '—'}`,
    '',
    r.message,
  ].join('\n');
}

/** The real dependencies on the Worker: Turnstile, D1 and Resend. */
export function createDeps(env: InquiryEnv): InquiryDeps {
  return {
    async verifyCaptcha(token, ip) {
      if (!env.TURNSTILE_SECRET) return false;
      const body = new FormData();
      body.append('secret', env.TURNSTILE_SECRET);
      body.append('response', token);
      if (ip) body.append('remoteip', ip);
      const res = await fetch(TURNSTILE_VERIFY, { method: 'POST', body });
      if (!res.ok) return false;
      return ((await res.json()) as { success?: boolean }).success === true;
    },

    hashIp: (ip) => sha256Hex(`${env.IP_SALT ?? ''}${ip}`),

    async countSince(ipHash, sinceIso) {
      const row = await env.DB.prepare('SELECT COUNT(*) AS n FROM inquiries WHERE ip_hash = ? AND created_at >= ?')
        .bind(ipHash, sinceIso)
        .first<{ n: number }>();
      return row?.n ?? 0;
    },

    async save(r) {
      const row = await env.DB.prepare(
        `INSERT INTO inquiries (created_at, locale, name, email, types, timeline, message, ip_hash, verified)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`,
      )
        .bind(r.createdAt, r.locale, r.name, r.email, JSON.stringify(r.types), r.timeline, r.message, r.ipHash, r.verified ? 1 : 0)
        .first<{ id: number }>();
      if (!row) throw new Error('D1 insert returned no id');
      return row.id;
    },

    async markEmailed(id) {
      await env.DB.prepare('UPDATE inquiries SET emailed = 1 WHERE id = ?').bind(id).run();
    },

    async notify(r) {
      if (!env.RESEND_API_KEY || !env.NOTIFY_EMAIL) throw new ResendNotConfigured();
      const res = await fetch(RESEND_EMAILS, {
        method: 'POST',
        headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          // Resend's shared sender until a custom domain is verified.
          from: 'Portfolio <onboarding@resend.dev>',
          to: [env.NOTIFY_EMAIL],
          reply_to: r.email,
          subject: `New inquiry: ${r.types.join(', ')} — ${r.name}`,
          text: emailText(r),
        }),
      });
      if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
    },

    now: () => new Date(),
    log: (message, error) => console.error(message, error),
  };
}
