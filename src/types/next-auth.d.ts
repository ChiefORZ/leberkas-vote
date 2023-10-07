// next-auth.d.ts
// eslint-disable-next-line import/extensions
import { User as PrismaUser } from '@prisma/client';

declare module 'next-auth' {
  type User = Pick<PrismaUser, 'id' | 'name' | 'email' | 'image' | 'role'>;

  interface Session {
    expires: string;
    user: User;
  }
}

declare module 'next-auth/jwt' {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT {
    id?: string;
    image?: string;
    role?: string;
  }
}
