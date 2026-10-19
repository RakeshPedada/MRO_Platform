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

    // 5-Tier Strict RBAC boundaries
    // 1. Admin dashboard: strictly admin
    if (path.startsWith('/dashboard/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard/author', request.url));
    }

    // 2. Editor-in-Chief dashboard: admin or editor_in_chief
    if (
      (path.startsWith('/dashboard/eic') || path.startsWith('/dashboard/editor-in-chief')) &&
      !['admin', 'editor_in_chief'].includes(role)
    ) {
      return NextResponse.redirect(new URL('/dashboard/author', request.url));
    }

    // 3. Section Editor dashboard: admin, editor_in_chief, or editor
    if (
      path.startsWith('/dashboard/editor') &&
      !path.startsWith('/dashboard/editor-in-chief') &&
      !['admin', 'editor_in_chief', 'editor'].includes(role)
    ) {
      return NextResponse.redirect(new URL('/dashboard/author', request.url));
    }

    // 4. Peer Reviewer dashboard: admin or reviewer
    if (path.startsWith('/dashboard/reviewer') && !['admin', 'reviewer'].includes(role)) {
      return NextResponse.redirect(new URL('/dashboard/author', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/dashboard/:path*'],
};