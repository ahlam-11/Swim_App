import { auth } from "@/app/lib/auth"
import { NextResponse } from "next/server"

const PROTECTED = ["/dashboard", "/generate", "/history", "/library"]

export const proxy = auth((req) => {
  const session     = req.auth
  const { pathname} = req.nextUrl

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p))

  // Pas connecté + route protégée → login
  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Déjà connecté + page login → dashboard
  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
