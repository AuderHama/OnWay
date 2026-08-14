import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const LOGIN = "/dashboard/login"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get("token")?.value

  const isDashboard = pathname.startsWith("/dashboard")
  const isLoginPage = pathname === LOGIN

  // Not logged in → redirect to login
  if (isDashboard && !isLoginPage && !token) {
    return NextResponse.redirect(new URL(LOGIN, request.url))
  }

  // Already logged in → skip login page
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL("/dashboard/stores", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
