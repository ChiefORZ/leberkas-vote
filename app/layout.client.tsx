'use client';

import { Menu, Transition } from '@headlessui/react';
import Image from 'next/image';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import React, { Fragment } from 'react';

import { classNames } from '@/utils/index';

const RootLayoutClient = ({
  user,
}: {
  user?: {
    id?: string;
    name?: string;
    email?: string;
    image?: string;
  };
}) => {
  return (
    <div className="relative z-20 mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
      <div className="relative flex h-16 items-center justify-between">
        <div className="flex items-center px-2 lg:px-0">
          <div className="shrink-0">
            <Link href="/">
              <Image
                className="relative block h-14"
                width={350}
                height={75}
                // fill
                src="./logo-with-text-on-primary.svg"
                alt="Leberkas Vote Logo"
              />
            </Link>
          </div>
        </div>
        <div className="flex items-center">
          {/* Profile dropdown */}
          {user ? (
            <Menu as="div" className="relative ml-3 shrink-0">
              <div>
                <Menu.Button className="flex rounded-full bg-brand-400 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-brand-400">
                  <span className="sr-only">Öffnen Sie das Benutzermenü</span>
                  <Image
                    className="h-8 w-8 rounded-full"
                    height={32}
                    width={32}
                    src={user.image}
                    alt="Profilbild"
                  />
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
                  <Menu.Item>
                    <button
                      aria-label="Logout"
                      className="inline-flex w-full py-2 px-4 text-left text-sm text-gray-700"
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
              href="/login"
              className="inline-flex w-full items-center rounded-md border border-white bg-brand-400 px-4 py-2 text-sm font-medium text-white hover:bg-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:ring-offset-2"
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
