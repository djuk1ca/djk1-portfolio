import type { ReactNode } from 'react';
import { RootDocument } from '@/components/shell/RootDocument';

export default function EnglishRootLayout({ children }: { children: ReactNode }) {
  return <RootDocument locale="en">{children}</RootDocument>;
}
