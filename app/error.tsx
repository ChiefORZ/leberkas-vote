'use client'; // Error components must be Client components

import { useEffect } from 'react';

import { Button } from '@/components/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <div className="border-styria bg-white py-12 px-8 sm:rounded-lg sm:px-10">
        <div className="grid place-content-center bg-white px-4">
          <div className="text-center">
            <h1 className="text-8xl font-black text-gray-200">500</h1>

            <p className="font-sans-alt text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ups!
            </p>

            <p className="mt-4 text-gray-500">Irgendwas lauft ned rund.</p>

            <button
              className="inline-flex items-center rounded-md border border-white bg-brand-400 px-4 py-2 text-sm font-medium text-white hover:bg-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:ring-offset-2"
              onClick={() => reset()}
            >
              Nochmal probieren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
