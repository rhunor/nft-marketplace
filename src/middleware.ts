import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { authConfig } from './auth.config';
import { routing, defaultLocale, LOCALE_COOKIE_NAME, type Locale } from './i18n/routing';
import { countryToLocale } from './i18n/geoLocaleMap';

const { auth } = NextAuth(authConfig);
const intlMiddleware = createIntlMiddleware(routing);

// Protected routes that require authentication
const protectedRoutes = ['/dashboard', '/upload', '/fund'];

// Admin-only routes (outside the [locale] segment - always unprefixed)
const adminRoutes = ['/admin'];

// Auth routes (redirect if already logged in)
const authRoutes = ['/login', '/register'];

function stripLocale(pathname: string): { locale: Locale | null; path: string } {
  const [, first = '', ...rest] = pathname.split('/');
  if ((routing.locales as readonly string[]).includes(first)) {
    return { locale: first as Locale, path: `/${rest.join('/')}` || '/' };
  }
  return { locale: null, path: pathname };
}

function withLocalePrefix(path: string, locale: Locale | null): string {
  if (!locale || locale === defaultLocale) return path;
  return `/${locale}${path}`;
}

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;
  const isAdmin = userRole === 'admin';

  const { locale, path } = stripLocale(nextUrl.pathname);

  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isAdminRoute = adminRoutes.some((route) => nextUrl.pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

  // Redirect to login if trying to access a protected route without auth
  if (isProtectedRoute && !isLoggedIn) {
    const callbackUrl = encodeURIComponent(nextUrl.pathname + nextUrl.search);
    return NextResponse.redirect(
      new URL(`${withLocalePrefix('/login', locale)}?callbackUrl=${callbackUrl}`, nextUrl)
    );
  }

  // Admin panel is English-only and lives outside the [locale] segment
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', nextUrl));
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', nextUrl));
    }
    return NextResponse.next();
  }

  // Redirect to dashboard if trying to access auth routes while logged in
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL(withLocalePrefix('/dashboard', locale), nextUrl));
  }

  // Geo is only ever a fallback: it's consulted purely to pick the first
  // locale for a visitor whose browser sends no usable Accept-Language
  // header (most real browsers always send one, so this rarely fires).
  // It never overrides an explicit choice or a working Accept-Language match.
  const hasLocaleCookie = req.cookies.has(LOCALE_COOKIE_NAME);
  const acceptLanguage = req.headers.get('accept-language');
  const hasUsableAcceptLanguage = !!acceptLanguage && acceptLanguage.trim() !== '*';

  if (!hasLocaleCookie && !hasUsableAcceptLanguage && !locale) {
    const country = req.headers.get('x-vercel-ip-country');
    const geoLocale = countryToLocale(country);
    if (geoLocale && geoLocale !== defaultLocale) {
      const redirectUrl = new URL(withLocalePrefix(path, geoLocale) + nextUrl.search, nextUrl);
      const response = NextResponse.redirect(redirectUrl);
      response.cookies.set(LOCALE_COOKIE_NAME, geoLocale, { path: '/' });
      return response;
    }
  }

  return intlMiddleware(req);
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
