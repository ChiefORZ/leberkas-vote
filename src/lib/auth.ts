import { Magic } from '@magic-sdk/admin';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { NextAuthOptions } from 'next-auth';
// import { SessionProvider } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import prisma from '@/lib/prisma';
import type { Role } from '@prisma/client';

const magic = new Magic(process.env.MAGIC_SK);

export const authOptions: NextAuthOptions = {
  // huh any! I know.
  // This is a temporary fix for prisma client.
  // @see https://github.com/prisma/prisma/issues/16117
  // biome-ignore lint/suspicious/noExplicitAny: reasonable explanation
  adapter: PrismaAdapter(prisma as any),
  callbacks: {
    async jwt(payload) {
      const { token, user } = payload;
      try {
        const dbUser = await prisma.user.findFirst({
          where: {
            email: token.email,
          },
        });
        if (!dbUser) {
          if (!token.id) {
            token.id = user.id;
          }
          return token;
        }
        const jwtPayload = {
          email: dbUser?.email,
          id: dbUser?.id,
          image: dbUser?.image,
          name: dbUser?.name,
          role: dbUser?.role,
        };
        return jwtPayload;
      } catch (err) {
        console.error('err ', err);
      }
    },
    async session(payload) {
      const { token, session } = payload;

      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.image;
        session.user.role = token.role as Role;
      }
      return session;
    },
    async signIn(payload) {
      const { user, account } = payload;
      try {
        // check if user exists in db
        const dbUser = await prisma.user.findFirst({
          where: {
            email: user.email,
          },
        });

        if (!dbUser) {
          // create user in db
          await prisma.user.create({
            data: {
              accounts: {
                create: {
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  type: account.type,
                },
              },
              email: user.email,
              image: user.image,
              name: user.name,
            },
          });
        }
        return true;
      } catch (err) {
        console.error('err ', err);
        return false;
      }
    },
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      async authorize({ didToken }, _) {
        // validate magic DID token
        magic.token.validate(didToken);

        // fetch user metadata
        const metadata = await magic.users.getMetadataByToken(didToken);

        // return user info
        return {
          email: metadata.email,
          id: metadata.publicAddress,
          image: '',
          name: metadata.email.substring(0, metadata.email.indexOf('@')),
          role: 'USER',
        };
      },
      credentials: {
        didToken: { label: 'DID Token', type: 'text' },
      },
      name: 'Magic Link',
    }),
  ],
  session: {
    strategy: 'jwt',
  },
};
