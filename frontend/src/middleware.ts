import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let res = (NextResponse.next as any)({ request: { headers: req.headers } })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return (req.cookies as any).get(name)?.value
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          (req.cookies as any).set({ name, value, ...options })
          res = (NextResponse.next as any)({ request: { headers: req.headers } })
          (res.cookies as any).set({ name, value, ...options })
        },
        remove(name: string, options: Record<string, unknown>) {
          (req.cookies as any).set({ name, value: '', ...options })
          res = (NextResponse.next as any)({ request: { headers: req.headers } })
          (res.cookies as any).set({ name, value: '', ...options })
        }
      }
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  const { pathname } = req.nextUrl

  if (!session) {
    if (
      pathname.startsWith('/dashboard') ||
      pathname.startsWith('/portal') ||
      pathname.startsWith('/intake') ||
      pathname.startsWith('/analysis') ||
      pathname.startsWith('/case')
    ) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  if (session) {
    if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      if (roleData?.role === 'lawyer') {
        return NextResponse.redirect(new URL('/portal/dashboard', req.url))
      }
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/portal/:path*',
    '/intake/:path*',
    '/analysis/:path*',
    '/case/:path*',
    '/login',
    '/register'
  ]
}
