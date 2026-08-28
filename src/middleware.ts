import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const path = request.nextUrl.pathname;
  const isPrivate = path.startsWith('/admin') || path.startsWith('/preview');
  if (!supabaseUrl || !supabaseKey) {
    if (isPrivate && !path.startsWith('/admin/login')) return NextResponse.redirect(new URL('/admin/login', request.url));
    return response;
  }
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
  const { data: { user } } = await supabase.auth.getUser();
  if (isPrivate && !path.startsWith('/admin/login') && (!user || user.id !== process.env.ADMIN_USER_ID)) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  return response;
}

export const config = { matcher: ['/admin/:path*', '/preview/:path*'] };
