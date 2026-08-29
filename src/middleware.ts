import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPrivate = path.startsWith('/admin') || path.startsWith('/preview');
  const isLogin = path.startsWith('/admin/login');

  // Public routes pass through immediately
  if (!isPrivate) return NextResponse.next({ request });

  // Login page always passes through (the client handles its own auth check)
  if (isLogin) return NextResponse.next({ request });

  // Fail closed: any error in auth logic = deny access
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    if (!process.env.ADMIN_USER_ID) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    let response = NextResponse.next({ request });
    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() { return request.cookies.getAll(); },
          setAll(items) {
            items.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({ request });
            items.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          },
        },
      },
    );

    const { data: { user }, error } = await supabase.auth.getUser();

    // Any Supabase error = deny
    if (error || !user) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // User must match the configured admin UUID exactly
    if (user.id !== process.env.ADMIN_USER_ID) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    return response;
  } catch {
    // Unhandled error (network, Supabase outage, etc.) → deny access
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
}

export const config = { matcher: ['/admin/:path*', '/preview/:path*'] };
