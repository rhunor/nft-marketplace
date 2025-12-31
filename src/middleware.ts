import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

// Protected routes that require authentication
const protectedRoutes = ['/dashboard', '/upload', '/fund'];

// Admin-only routes
const adminRoutes = ['/admin'];

// Auth routes (redirect if already logged in)
const authRoutes = ['/login', '/register'];

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;
  const isAdmin = userRole === 'admin';

  console.log('[Middleware] Path:', nextUrl.pathname);
  console.log('[Middleware] isLoggedIn:', isLoggedIn);
  console.log('[Middleware] User:', req.auth?.user?.email);
  console.log('[Middleware] Role:', userRole);
  console.log('[Middleware] isAdmin:', isAdmin);

  // Check if current path matches any protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  // Check if current path is an admin route
  const isAdminRoute = adminRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  // Check if current path is an auth route
  const isAuthRoute = authRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  // Redirect to login if trying to access protected route without auth
  if (isProtectedRoute && !isLoggedIn) {
    console.log('[Middleware] Redirecting to login - protected route without auth');
    const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, nextUrl)
    );
  }

  // Redirect to home if trying to access admin route without admin role
  if (isAdminRoute) {
    console.log('[Middleware] Admin route detected');
    if (!isLoggedIn) {
      console.log('[Middleware] Redirecting - not logged in');
      return NextResponse.redirect(new URL('/login', nextUrl));
    }
    if (!isAdmin) {
      console.log('[Middleware] Redirecting - not admin, role is:', userRole);
      return NextResponse.redirect(new URL('/', nextUrl));
    }
    console.log('[Middleware] Admin access granted');
  }

  // Redirect to dashboard if trying to access auth routes while logged in
  if (isAuthRoute && isLoggedIn) {
    console.log('[Middleware] Redirecting to dashboard - already logged in');
    return NextResponse.redirect(new URL('/dashboard', nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};