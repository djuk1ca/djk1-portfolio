'use server';

import { headers } from 'next/headers';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { getDictionary } from '@/i18n/dictionaries';
import { createDeps, type InquiryEnv } from './deps';
import { handleInquiry, type InquiryState } from './handle';

export async function submitInquiry(_prev: InquiryState, form: FormData): Promise<InquiryState> {
  const locale = form.get('locale') === 'sr' ? 'sr' : 'en';
  const h = await headers();
  const ip = h.get('cf-connecting-ip') ?? h.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '';
  try {
    const { env } = await getCloudflareContext({ async: true });
    return await handleInquiry(form, ip, createDeps(env as unknown as InquiryEnv), getDictionary(locale));
  } catch (error) {
    console.error('inquiry: unexpected failure', error);
    return { status: 'error', formError: 'server' };
  }
}
