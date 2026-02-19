import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '');
  const path = request.nextUrl.pathname;

  // Public paths that don't require authentication
  const publicPaths = ['/', '/login', '/register', '/verify'];
  const isPublicPath = publicPaths.some(publicPath => path.startsWith(publicPath));

  // Protected paths by role
  const adminPaths = ['/admin'];
  const institutionPaths = ['/institution'];
  const employerPaths = ['/employer'];
  const userPaths = ['/user'];

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Role-based access control would go here
  // You'd need to decode the JWT to check roles

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};