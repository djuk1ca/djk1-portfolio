import type { ReactNode } from 'react';
import { Archivo, IBM_Plex_Mono, IBM_Plex_Sans, VT323 } from 'next/font/google';
import type { Locale } from '@/i18n/locales';
import { themeInitScript } from '@/lib/theme';
import '@/styles/globals.css';

const display = Archivo({ subsets: ['latin', 'latin-ext'], axes: ['wdth'], variable: '--font-display', display: 'swap' });
const body = IBM_Plex_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-body',
  display: 'swap',
});
const mono = IBM_Plex_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
  preload: false,
});
const screen = VT323({ subsets: ['latin', 'latin-ext'], weight: '400', variable: '--font-screen', display: 'swap', preload: false });

/** The <html> document shared by both root layouts (English at /, Serbian at /sr). */
export function RootDocument({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <html
      lang={locale}
      className={`${display.variable} ${body.variable} ${mono.variable} ${screen.variable}`}
      suppressHydrationWarning
    >
      {/* App Router root layout: a plain <head> is the supported way to inline the pre-paint theme script. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="djk-root">{children}</body>
    </html>
  );
}
