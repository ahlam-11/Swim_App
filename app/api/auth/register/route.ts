import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { prisma } from "@/app/lib/prisma"
import { validationError, apiError } from "@/app/lib/api-error"

const RegisterSchema = z.object({
  email:    z.string().email("Email invalide.").toLowerCase().trim(),
  password: z.string().min(8, "Mot de passe trop court (8 caractères minimum).").max(128),
  name:     z.string().trim().max(100).optional(),
  level:    z.enum(["debutant", "intermediaire", "avance"]).optional(),
})

export async function POST(req: Request) {
  const body = await req.json().catch(() => null)
  const parsed = RegisterSchema.safeParse(body)
  if (!parsed.success) return validationError(parsed.error)

  const { email, password, name, level } = parsed.data

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return apiError(409, "EMAIL_TAKEN", "Un compte existe déjà avec cet email.")

  const passwordHash = await bcrypt.hash(password, 12)
  await prisma.user.create({
    data: { email, passwordHash, name: name ?? null, level: level ?? "debutant" },
  })

  return NextResponse.json({ ok: true }, { status: 201 })
}
