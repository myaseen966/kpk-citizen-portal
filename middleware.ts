import { NextRequest, NextResponse } from 'next/server'

const PROTECTED_ROUTES = ['/dashboard']
const ADMIN_ROUTES = ['/admin/dashboard']
const AUTH_ROUTES = ['/login', '/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const citizenToken = request.cookies.get('auth-token')?.value
  const adminToken = request.cookies.get('admin-token')?.value

  // Protect citizen dashboard
  if (PROTECTED_ROUTES.some((r) => pathname.startsWith(r)) && !citizenToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Protect admin dashboard
  if (ADMIN_ROUTES.some((r) => pathname.startsWith(r)) && !adminToken) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  // Redirect logged in citizens away from login/register
  if (AUTH_ROUTES.some((r) => pathname.startsWith(r)) && citizenToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/dashboard/:path*', '/login', '/register'],
}