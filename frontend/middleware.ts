import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get('nexus_session');

  // If user visits /dashboard and has no session cookie, we allow guest preview or redirect
  if (pathname.startsWith('/dashboard') && !sessionCookie) {
    // Optionally redirect to login or allow guest preview
    // const loginUrl = new URL('/login', request.url);
    // loginUrl.searchParams.set('callbackUrl', pathname);
    // return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
