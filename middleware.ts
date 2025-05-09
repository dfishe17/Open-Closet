import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getCSP } from "./lib/csp"

// Feature flag to easily disable CSP during development or troubleshooting
const CSP_ENABLED = true

export function middleware(request: NextRequest) {
  // Get the response
  const response = NextResponse.next()

  // Check if CSP should be disabled via cookie
  const disableCSP = request.cookies.get("disable_csp")?.value === "true"

  // Add CSP header if enabled and not disabled via cookie
  if (CSP_ENABLED && !disableCSP) {
    response.headers.set("Content-Security-Policy", getCSP())
  }

  // Add other security headers
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("X-Frame-Options", "SAMEORIGIN")
  response.headers.set("X-XSS-Protection", "1; mode=block")
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
