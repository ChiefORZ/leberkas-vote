import './global.css';

import { Inter as FontSans } from '@next/font/google';

import { getCurrentUser } from '@/lib/session';

import { classNames } from '../utils';
import RootLayoutClient from './layout.client';

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-inter',
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  return (
    <html
      lang="en"
      className={classNames(
        'h-screen max-h-screen min-h-screen bg-white font-sans text-slate-900 antialiased',
        fontSans.variable
      )}
    >
      <body className="h-screen max-h-screen min-h-screen overflow-hidden">
        <div className="flex h-full flex-col">
          <div className="relative">
            <div className="before:content-{''} absolute top-0 w-full before:z-0 before:block before:bg-brand-400 before:pb-48" />
            <RootLayoutClient user={user} />
          </div>

          <main className="z-10 mt-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
