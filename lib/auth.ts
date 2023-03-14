import { Magic } from '@magic-sdk/admin';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { NextAuthOptions } from 'next-auth';
// import { SessionProvider } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import prisma from './prisma';

const magic = new Magic(process.env.MAGIC_SK);

export const authOptions: NextAuthOptions = {
  // huh any! I know.
  // This is a temporary fix for prisma client.
  // @see https://github.com/prisma/prisma/issues/16117
  adapter: PrismaAdapter(prisma as any),
  session: {
    strategy: 'jwt',
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
      name: 'Magic Link',
      credentials: {
        didToken: { label: 'DID Token', type: 'text' },
      },
      async authorize({ didToken }, req) {
        // validate magic DID token
        magic.token.validate(didToken);

        // fetch user metadata
        const metadata = await magic.users.getMetadataByToken(didToken);

        // return user info
        return {
          id: metadata.publicAddress,
          email: metadata.email,
          name: metadata.email.substring(0, metadata.email.indexOf('@')),
          image: '',
        };
      },
    }),
  ],
  callbacks: {
    async signIn(payload) {
      const { user, account, profile, email, credentials } = payload;
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
              name: user.name,
              email: user.email,
              image: user.image,
              accounts: {
                create: {
                  type: account.type,
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                },
              },
            },
          });
        }
        return true;
      } catch (err) {
        console.error('err ', err);
        return false;
      }
    },
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
          id: dbUser?.id,
          name: dbUser?.name,
          email: dbUser?.email,
          image: dbUser?.image,
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
        session.user.role = token.role;
      }
      return session;
    },
  },
};
