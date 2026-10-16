import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const path = request.nextUrl.pathname;

  if (path.startsWith('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const role = profile?.role || 'author';

    // Strict role redirection boundaries
    if (path.startsWith('/dashboard/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard/author', request.url));
    }
    if (path.startsWith('/dashboard/editor-in-chief') && !['admin', 'editor_in_chief'].includes(role)) {
      return NextResponse.redirect(new URL('/dashboard/author', request.url));
    }
    if (path.startsWith('/dashboard/editor') && !['admin', 'editor_in_chief', 'editor'].includes(role)) {
      return NextResponse.redirect(new URL('/dashboard/author', request.url));
    }
    if (path.startsWith('/dashboard/reviewer') && !['admin', 'reviewer'].includes(role)) {
      return NextResponse.redirect(new URL('/dashboard/author', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*'],
};