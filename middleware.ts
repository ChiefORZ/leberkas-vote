import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';

const secret = process.env.NEXTAUTH_SECRET;

const protectedPages = ['/results'];

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req, secret: secret });
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith('/login');

    // check if the page is protected
    if (protectedPages.includes(req.nextUrl.pathname)) {
      if (!isAuth) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/', req.url));
      }

      return null;
    }
  },
  {
    callbacks: {
      async authorized() {
        // This is a work-around for handling redirect on auth pages.
        // We return true here so that the middleware function above
        // is always called.
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/', '/login', '/results'],
};
