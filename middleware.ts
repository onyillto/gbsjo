import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AUTH_PATHS = ['/auth/login', '/auth/signup', '/auth/forgot-password', '/auth/verify-token']

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  const { pathname } = request.nextUrl

  const isAuthPath = AUTH_PATHS.some((p) => pathname.startsWith(p))

  if (!isAuthPath && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  if (isAuthPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|logo.png|theme.jpg|gbajo.jpg|gbajjo.jpg).*)'],
}
