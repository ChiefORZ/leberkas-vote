import { Session } from 'next-auth';
import { unstable_getServerSession } from 'next-auth/next';

import { authOptions } from '@/lib/auth';

export async function getSession(): Promise<Session> {
  return await unstable_getServerSession(authOptions);
}

export async function getCurrentUser() {
  const session = await getSession();

  return session?.user;
}
