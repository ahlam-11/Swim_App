import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/app/lib/auth"
import { prisma } from "@/app/lib/prisma"
import { validationError, apiError } from "@/app/lib/api-error"

const PatchSchema = z.object({
  title: z.string().min(1).max(200).trim(),
})

type Ctx = { params: Promise<{ id: string }> }

// PATCH /api/sessions/:id — renomme la séance
export async function PATCH(req: NextRequest, { params }: Ctx) {
  const session = await auth()
  if (!session?.user?.id) return apiError(401, "UNAUTHORIZED", "Non autorisé.")

  const body   = await req.json().catch(() => null)
  const parsed = PatchSchema.safeParse(body)
  if (!parsed.success) return validationError(parsed.error)

  const { id } = await params
  const existing = await prisma.trainingSession.findFirst({
    where:  { id, userId: session.user.id },
    select: { id: true },
  })
  if (!existing) return apiError(404, "NOT_FOUND", "Séance introuvable.")

  const updated = await prisma.trainingSession.update({
    where: { id },
    data:  { title: parsed.data.title },
  })

  return NextResponse.json({ id: updated.id })
}

// DELETE /api/sessions/:id — supprime la séance et ses sets (cascade)
export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const session = await auth()
  if (!session?.user?.id) return apiError(401, "UNAUTHORIZED", "Non autorisé.")

  const { id } = await params
  const existing = await prisma.trainingSession.findFirst({
    where:  { id, userId: session.user.id },
    select: { id: true },
  })
  if (!existing) return apiError(404, "NOT_FOUND", "Séance introuvable.")

  await prisma.trainingSession.delete({ where: { id } })

  return new NextResponse(null, { status: 204 })
}
