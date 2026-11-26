import type { ReactNode } from 'react';
import { RootDocument } from '@/components/shell/RootDocument';

export default function SerbianRootLayout({ children }: { children: ReactNode }) {
  return <RootDocument locale="sr">{children}</RootDocument>;
}
