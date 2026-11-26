import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { RootDocument } from '@/components/shell/RootDocument';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = { metadataBase: new URL(SITE_URL) };

export default function EnglishRootLayout({ children }: { children: ReactNode }) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
