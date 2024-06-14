'use client';

import { Magic } from 'magic-sdk';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import toast, { Toaster } from 'react-hot-toast';

const magic = typeof window !== 'undefined' && new Magic(process.env.NEXT_PUBLIC_MAGIC_PK || 'a');

export default function LoginPage() {
  const { register, handleSubmit } = useForm();

  const displayError = (error: string) => {
    toast.error(error);
  };

  const handleLoginWithMagic = async ({ email }) => {
    try {
      if (!magic) throw new Error('magic not defined');
      // login with Magic
      const didToken = await magic.auth.loginWithMagicLink({ email });

      // sign in with NextAuth
      await signIn('credentials', {
        didToken,
      });
    } catch (e) {
      if (typeof e === 'string') {
        console.error(e.toUpperCase());
      } else if (e instanceof Error) {
        console.error(e.message);
      }
      displayError('Uje, da is was schief glaufen!');
    }
  };

  const handleLoginWithGoogle = async () => {
    try {
      await signIn('google');
    } catch (e) {
      if (typeof e === 'string') {
        console.error(e.toUpperCase());
      } else if (e instanceof Error) {
        console.error(e.message);
      }
      displayError('Uje, da is was schief glaufen!');
    }
  };

  return (
    <>
      <form className="space-y-6" onSubmit={handleSubmit(handleLoginWithMagic)}>
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="email">
            E-Mail
          </label>
          <div className="mt-1">
            <input
              autoComplete="email"
              className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:ring-offset-2 sm:text-sm"
              id="email"
              name="email"
              required
              type="email"
              {...register('email', { required: true })}
            />
          </div>
        </div>

        <div>
          <button
            className="inline-flex w-full justify-center rounded-md border border-brand-300 bg-white px-4 py-2 text-sm font-medium text-brand-500 shadow-sm hover:bg-gray-50 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:ring-offset-2"
            role="button"
            type="submit"
          >
            Anmelden
          </button>
        </div>
      </form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">oder weiter mit</span>
          </div>
        </div>

        {/*grid grid-cols-3 gap-3*/}
        <div className="mt-6">
          <div>
            <button
              className="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 shadow-sm hover:bg-gray-50 focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-300 focus:ring-offset-2"
              onClick={handleLoginWithGoogle}
              role="button"
            >
              <span className="sr-only">Login mit Google</span>
              <svg
                className="mr-2"
                fill="currentColor"
                height="20"
                viewBox="0 0 1792 1792"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M896 786h725q12 67 12 128 0 217-91 387.5t-259.5 266.5-386.5 96q-157 0-299-60.5t-245-163.5-163.5-245-60.5-299 60.5-299 163.5-245 245-163.5 299-60.5q300 0 515 201l-209 201q-123-119-306-119-129 0-238.5 65t-173.5 176.5-64 243.5 64 243.5 173.5 176.5 238.5 65q87 0 160-24t120-60 82-82 51.5-87 22.5-78h-436v-264z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  );
}
