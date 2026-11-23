import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const isDashboard = request.nextUrl.pathname.startsWith('/admin/dashboard');
  const isLoginPage = request.nextUrl.pathname === '/admin/login';

  // 1. Check offline/local demo mode
  if (!supabaseUrl || supabaseUrl.includes('dummy-url') || supabaseUrl.includes('placeholder')) {
    const adminSession = request.cookies.get('kuliner_admin_session');

    if (isDashboard && !adminSession) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }

    if (isLoginPage && adminSession) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/dashboard';
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  }

  // 2. Supabase Live Mode: createServerClient
  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Also check backup cookie if client verified login
  const backupSession = request.cookies.get('kuliner_admin_session');

  // Verify auth session
  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (err) {
    console.warn('Middleware getUser check:', err);
  }

  const isAuthenticated = Boolean(user || backupSession);

  if (isDashboard && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  if (isLoginPage && isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
