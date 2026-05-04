import "server-only"
import { cache } from "react"
import { redirect } from "next/navigation"
import { auth } from "@/app/lib/auth"

// verifySession est mémoïsé par render pass (React cache)
// → un seul aller-retour cookie/JWT même si appelé dans plusieurs composants
export const verifySession = cache(async () => {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")
  return { userId: session.user.id, user: session.user }
})
