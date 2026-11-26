import type { ReactNode } from 'react';
import '@/styles/globals.css';

export default function EnglishRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="djk-root">{children}</body>
    </html>
  );
}
