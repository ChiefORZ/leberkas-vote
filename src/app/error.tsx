'use client'; // Error components must be Client components

import { useEffect } from 'react';

export default function ErrorPage({
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
      <div className="border-styria bg-white px-8 py-12 sm:rounded-lg sm:px-10">
        <div className="grid place-content-center bg-white px-4">
          <div className="text-center">
            <h1 className="font-black text-8xl text-gray-200">500</h1>

            <p className="font-bold font-sans-alt text-2xl text-gray-900 tracking-tight sm:text-4xl">
              Hoppla!
            </p>

            <p className="mt-4 text-gray-500">Irgendwas lauft ned rund.</p>

            <button
              className="inline-flex items-center rounded-md border border-white bg-brand-400 px-4 py-2 font-medium text-sm text-white hover:bg-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:ring-offset-2"
              onClick={() => reset()}
              type="button"
            >
              Nochmal probieren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
