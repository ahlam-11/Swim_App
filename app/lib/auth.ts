import NextAuth, { type DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"

// --- Type augmentation -------------------------------------------------
// Ajoute `id` à la session user (nécessaire pour les Server Components)
declare module "next-auth" {
  interface Session {
    user: { id: string } & DefaultSession["user"]
  }
}

// --- Config NextAuth v5 ------------------------------------------------
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email:    { label: "Email",          type: "email"    },
        password: { label: "Mot de passe",   type: "password" },
      },

      async authorize(credentials) {
        // TODO (étape 3 – Prisma) : remplacer par une vraie requête :
        //   const user = await prisma.user.findUnique({ where: { email } })
        //   if (!user || !await bcrypt.compare(password, user.passwordHash)) return null
        //   return user

        // Compte de test temporaire – supprimé dès que Prisma est branché
        if (
          credentials?.email    === "test@swim.dev" &&
          credentials?.password === "swim1234"
        ) {
          return { id: "1", name: "Nageur Test", email: "test@swim.dev" }
        }
        return null
      },
    }),
  ],

  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string
      return session
    },
  },

  pages: {
    signIn: "/login",
  },
})
