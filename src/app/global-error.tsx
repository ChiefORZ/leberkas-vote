'use client';

import './global.css';

import clsx from 'clsx';
import { Lexend as FontLexend } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

import { classNames } from '@/utils/index';

const fontSans = FontLexend({
  subsets: ['latin'],
  variable: '--font-lexend',
});

export default function GlobalError({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html
      className={classNames(
        'h-screen max-h-screen min-h-screen bg-white font-sans text-slate-900 antialiased',
        fontSans.variable,
      )}
      lang="en"
    >
      <body className="h-screen max-h-screen min-h-screen overflow-hidden">
        <div className="flex h-full flex-col">
          <div className="relative">
            <div className="relative z-20 mx-auto max-w-7xl px-2 py-2 sm:px-4 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="flex items-center px-2 lg:px-0">
                  <Link href="/">
                    <Image
                      alt="Leberkas Vote Logo"
                      className="relative block h-14"
                      height={75}
                      src="./logo-with-text.svg"
                      width={350}
                    />
                  </Link>
                </div>
                <div className="flex items-center">
                  {/* Nav options to home and results that is only displayed on desktop and highlighting the active one */}
                  <div className="hidden lg:ml-6 lg:block">
                    <div className="flex">
                      <Link
                        className={clsx(
                          'm-4 inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700 focus:outline-none',
                        )}
                        href="/"
                      >
                        Abstimmen
                      </Link>
                    </div>
                  </div>

                  <Link
                    className="inline-flex w-full items-center rounded-md border border-white bg-brand-400 px-4 py-2 text-sm font-medium text-white hover:bg-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:ring-offset-2"
                    href="/login"
                  >
                    {/* <a className="inline-flex items-center rounded-md border border-transparent bg-brand-400 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2"> */}
                    Login
                    {/* </a> */}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <main className="z-10 mt-2">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <div className="border-styria bg-white px-8 py-12 sm:rounded-lg sm:px-10">
                <div className="grid place-content-center bg-white px-4">
                  <div className="text-center">
                    <h1 className="text-8xl font-black text-gray-200">500</h1>

                    <p className="font-sans-alt text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                      Hoppla!
                    </p>

                    <p className="mt-4 text-gray-500">Irgendwas lauft ned rund.</p>

                    <button
                      className="inline-flex items-center rounded-md border border-white bg-brand-400 px-4 py-2 text-sm font-medium text-white hover:bg-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:ring-offset-2"
                      onClick={() => reset()}
                      type="button"
                    >
                      Nochmal probieren
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
