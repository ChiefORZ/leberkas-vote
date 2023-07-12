'use client';

import { Menu, Transition } from '@headlessui/react';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import React, { Fragment, useEffect } from 'react';

import * as splitbee from '@/utils/splitbee';

const RootLayoutClient = ({
  user,
}: {
  user?: {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
    role?: string;
  };
}) => {
  useEffect(() => {
    splitbee.init();
  }, []);

  const pathname = usePathname();
  return (
    <div className="relative z-20 mx-auto max-w-7xl px-2 py-2 sm:px-4 lg:px-8">
      <div className="relative flex h-16 items-center justify-between">
        <div className="flex items-center px-2 lg:px-0">
          <div className="shrink-0">
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
        </div>
        <div className="flex items-center">
          {/* Nav options to home and results that is only displayed on desktop and highlighting the active one */}
          <div className="hidden lg:ml-6 lg:block">
            <div className="flex">
              <Link
                className={clsx(
                  'm-4 inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700 focus:outline-none',
                  { '!border-brand-400 text-gray-900': pathname === '/' }
                )}
                href="/"
              >
                Abstimmen
              </Link>
              <Link
                className={clsx(
                  'm-4 inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700 focus:outline-none',
                  {
                    '!border-brand-400 text-gray-900': pathname === '/results',
                  }
                )}
                href="/results"
              >
                Ergebnis
              </Link>
              {user?.role === 'ADMIN' ? (
                <Link
                  className={clsx(
                    'm-4 inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700 focus:outline-none',
                    {
                      '!border-brand-400 text-gray-900': pathname === '/admin',
                    }
                  )}
                  href="/admin"
                >
                  Admin
                </Link>
              ) : null}
            </div>
          </div>
          {/* Profile dropdown */}
          {user ? (
            <Menu as="div" className="relative ml-3 shrink-0">
              <div>
                <Menu.Button className="flex rounded-full bg-brand-400 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-400">
                  <span className="sr-only">Öffnen Sie das Benutzermenü</span>
                  {user.image ? (
                    <Image
                      alt="Profilbild"
                      className="h-8 w-8 rounded-full"
                      height={32}
                      src={user.image}
                      width={32}
                    />
                  ) : (
                    // display a Avatar with the first letter of the name if no image is provided
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-300">
                      <span className="select-none text-sm font-medium text-white">
                        {user.email?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {/* display a link to /results when on mobile */}
                  <Menu.Item>
                    <Link
                      aria-label="Ergebnis"
                      className="inline-flex w-full  px-4 py-2 text-left text-sm text-gray-700 lg:hidden"
                      href="/results"
                    >
                      Ergebnis
                    </Link>
                  </Menu.Item>
                  {user?.role === 'ADMIN' ? (
                    <Menu.Item>
                      <Link
                        aria-label="Admin"
                        className="inline-flex w-full  px-4 py-2 text-left text-sm text-gray-700 lg:hidden"
                        href="/admin"
                      >
                        Admin
                      </Link>
                    </Menu.Item>
                  ) : null}
                  <Menu.Item>
                    <button
                      aria-label="Logout"
                      className="inline-flex w-full px-4 py-2 text-left text-sm text-gray-700"
                      onClick={() => signOut({ callbackUrl: '/' })}
                    >
                      Logout
                    </button>
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          ) : (
            <Link
              className="inline-flex w-full items-center rounded-md border border-white bg-brand-400 px-4 py-2 text-sm font-medium text-white hover:bg-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:ring-offset-2"
              href="/login"
            >
              {/* <a className="inline-flex items-center rounded-md border border-transparent bg-brand-400 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:ring-offset-2"> */}
              Login
              {/* </a> */}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default RootLayoutClient;
