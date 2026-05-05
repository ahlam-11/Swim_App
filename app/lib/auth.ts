import NextAuth, { type DefaultSession } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { prisma } from "@/app/lib/prisma"

declare module "next-auth" {
  interface Session {
    user: { id: string } & DefaultSession["user"]
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    Credentials({
      credentials: {
        email:    { label: "Email",        type: "email"    },
        password: { label: "Mot de passe", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        })

        if (!user || !user.passwordHash) return null

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash,
        )
        if (!valid) return null

        return { id: user.id, name: user.name, email: user.email }
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      // Création automatique du compte pour les users Google
      if (account?.provider === "google" && user.email) {
        const existing = await prisma.user.findUnique({
          where: { email: user.email },
        })
        if (!existing) {
          await prisma.user.create({
            data: {
              email: user.email,
              name:  user.name ?? null,
            },
          })
        }
      }
      return true
    },

    async jwt({ token, user, account }) {
      // Première connexion : on récupère l'id DB
      if (user?.email || account) {
        const email = token.email ?? user?.email
        if (email) {
          const dbUser = await prisma.user.findUnique({ where: { email } })
          if (dbUser) token.id = dbUser.id
        }
      }
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
