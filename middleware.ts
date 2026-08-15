import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname

  // 🌟 PERMANENT FIX: Auto-Redirect
  // Agar koi purane '/admin/login' par aata hai, toh use automatically naye '/login' par bhej do
  if (path === '/admin/login') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 🌟 CUSTOM COOKIE CHECK
  // Humari custom cookie ka naam 'admin_auth' hai jo login page ne set ki hai
  const isAuthenticated = request.cookies.has('admin_auth')
  const isTargetingAdmin = path.startsWith('/admin')

  // Agar user /admin page kholne ki koshish kar raha hai bina login ke
  if (isTargetingAdmin && !isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Middleware ko bata rahe hain ki kin URLs par nazar rakhni hai
  matcher: ['/admin/:path*'],
}