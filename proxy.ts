import { auth } from "@/app/lib/auth"
import { NextResponse } from "next/server"

const PROTECTED = ["/dashboard", "/generate", "/history", "/library"]
const isDev      = process.env.NODE_ENV === "development"

function buildSecurityHeaders(nonce: string): Record<string, string> {
  const csp = [
    "default-src 'self'",
    // 'strict-dynamic' propage le nonce aux scripts chargés dynamiquement
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ""}`,
    // unsafe-inline requis car le projet utilise des style={{}} React (style attrs HTML)
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' blob: data: https://images.unsplash.com https://img.youtube.com",
    "font-src 'self'",            // next/font auto-héberge les Google Fonts
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ")

  const headers: Record<string, string> = {
    "Content-Security-Policy":  csp,
    "X-Content-Type-Options":   "nosniff",
    "X-Frame-Options":          "DENY",
    "Referrer-Policy":          "strict-origin-when-cross-origin",
    "Permissions-Policy":       "camera=(), microphone=(), geolocation=()",
  }
  // HSTS uniquement en production — le header est ignoré sur HTTP de toute façon
  if (!isDev) {
    headers["Strict-Transport-Security"] = "max-age=63072000; includeSubDomains; preload"
  }
  return headers
}

export const proxy = auth((req) => {
  const session    = req.auth
  const { pathname } = req.nextUrl

  const isProtected = PROTECTED.some(p => pathname.startsWith(p))

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", req.url))
  }
  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Nonce unique par requête — passé via x-nonce pour les Server Components
  const nonce      = Buffer.from(crypto.randomUUID()).toString("base64")
  const reqHeaders = new Headers(req.headers)
  reqHeaders.set("x-nonce", nonce)

  const response = NextResponse.next({ request: { headers: reqHeaders } })
  for (const [key, value] of Object.entries(buildSecurityHeaders(nonce))) {
    response.headers.set(key, value)
  }
  return response
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
