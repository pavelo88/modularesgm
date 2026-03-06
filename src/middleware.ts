import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('modulares-gm-session');
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin/dashboard')) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  if (pathname === '/admin' && sessionCookie) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
