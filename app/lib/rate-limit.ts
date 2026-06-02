// Rate limiter en mémoire — suffisant pour un déploiement single-instance (Vercel serverless).
// Limite : les compteurs sont réinitialisés à chaque cold start de la fonction.

interface Bucket { count: number; resetAt: number }

const store = new Map<string, Bucket>()

export function rateLimit(
  key:      string,
  max:      number,
  windowMs: number,
): { ok: boolean; retryAfterMs: number } {
  const now   = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, retryAfterMs: 0 }
  }

  if (entry.count >= max) {
    return { ok: false, retryAfterMs: entry.resetAt - now }
  }

  entry.count++
  return { ok: true, retryAfterMs: 0 }
}

// Retourne l'IP de la requête (header Vercel ou fallback)
export function getIP(req: Request): string {
  const headers = new Headers((req as Request & { headers: Headers }).headers)
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headers.get("x-real-ip") ??
    "unknown"
  )
}
