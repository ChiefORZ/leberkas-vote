'use client';

import './global.css';

import { Lexend as FontLexend } from '@next/font/google';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';

import { classNames } from '@/utils/index';

const fontSans = FontLexend({
  subsets: ['latin'],
  variable: '--font-lexend',
});

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
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
            <div className="relative z-20 mx-auto max-w-7xl py-2 px-2 sm:px-4 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="flex items-center px-2 lg:px-0">
                  <div className="shrink-0">
                    <Link href="/">
                      <Image
                        className="relative block h-14"
                        width={350}
                        height={75}
                        // fill
                        src="./logo-with-text.svg"
                        alt="Leberkas Vote Logo"
                      />
                    </Link>
                  </div>
                </div>
                <div className="flex items-center">
                  {/* Nav options to home and results that is only displayed on desktop and highlighting the active one */}
                  <div className="hidden lg:ml-6 lg:block">
                    <div className="flex">
                      <Link
                        href="/"
                        className={clsx(
                          'm-4 inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700 focus:outline-none'
                        )}
                      >
                        Abstimmen
                      </Link>
                      <Link
                        href="/results"
                        className={clsx(
                          'm-4 inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700 focus:outline-none'
                        )}
                      >
                        Ergebnis
                      </Link>
                    </div>
                  </div>

                  <Link
                    href="/login"
                    className="inline-flex w-full items-center rounded-md border border-white bg-brand-400 px-4 py-2 text-sm font-medium text-white hover:bg-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:ring-offset-2"
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
            <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
              <div className="lg:text-center">
                <h2 className="text-base font-semibold uppercase tracking-wide text-brand-400">
                  Error
                </h2>
                <p className="mt-2 text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl">
                  Something went wrong!
                </p>
                <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                  {error.message}
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <button
                      onClick={
                        // Attempt to recover by trying to re-render the segment
                        () => reset()
                      }
                      className="flex w-full items-center justify-center rounded-md border border-transparent bg-brand-400 px-8 py-3 text-base font-medium text-white hover:bg-brand-500 md:py-4 md:px-10 md:text-lg"
                    >
                      Try again
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
