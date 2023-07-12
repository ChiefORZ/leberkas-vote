import './global.css';

import { Lexend as FontLexend } from 'next/font/google';
import { Metadata } from 'next';

import RootLayoutClient from '@/app/layout.client';
import { getCurrentUser } from '@/lib/session';
import { classNames } from '@/utils/index';

const fontSans = FontLexend({
  subsets: ['latin'],
  variable: '--font-lexend',
});

export const metadata: Metadata = {
  charset: 'utf-8',
  description: 'Stimme für die beliebteste Speise Österreichs ab.',
  icons: {
    apple: '/apple-touch-icon.png',
    icon: '/favicon.ico',
    other: '/favicon-32x32.png',
    shortcut: '/favicon-16x16.png',
  },
  openGraph: {
    images: [{ url: 'https://leberkas.vote/og.png' }],
    title: 'Leberkas Vote',
    type: 'website',
    url: 'https://leberkas.vote',
  },
  title: 'Leberkas Vote',
  twitter: {
    card: 'summary_large_image',
    images: [{ url: 'https://leberkas.vote/og.png' }],
    title: 'Leberkas Vote',
    url: 'https://leberkas.vote',
  },
  viewport: 'width=device-width',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  return (
    <html
      className={classNames(
        'h-screen max-h-screen min-h-screen bg-white font-sans text-slate-900 antialiased',
        fontSans.variable
      )}
      lang="en"
    >
      <body className="h-screen max-h-screen min-h-screen overflow-hidden">
        <div className="flex h-full flex-col">
          <div className="relative">
            {/* <div className="before:content-{''} absolute top-0 w-full before:z-0 before:block before:bg-brand-400 before:pb-48" /> */}
            <RootLayoutClient user={user} />
          </div>

          <main className="z-10 mt-2">{children}</main>
        </div>
      </body>
    </html>
  );
}
