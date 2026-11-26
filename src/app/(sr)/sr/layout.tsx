import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { RootDocument } from '@/components/shell/RootDocument';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = { metadataBase: new URL(SITE_URL) };

export default function SerbianRootLayout({ children }: { children: ReactNode }) {
  return <RootDocument locale="sr">{children}</RootDocument>;
}
