import { NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/app/lib/auth"
import { prisma } from "@/app/lib/prisma"
import { validationError, apiError } from "@/app/lib/api-error"

const CompleteSchema = z.object({
  actualDuration: z.number().int().min(1).max(480),
  actualDistance: z.number().int().min(1).max(20000),
})

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id)
    return apiError(401, "UNAUTHORIZED", "Non authentifié.")

  const body   = await req.json().catch(() => null)
  const parsed = CompleteSchema.safeParse(body)
  if (!parsed.success) return validationError(parsed.error)

  const { id } = await params
  const { actualDuration, actualDistance } = parsed.data

  const training = await prisma.trainingSession.findFirst({
    where: { id, userId: session.user.id },
  })
  if (!training)
    return apiError(404, "NOT_FOUND", "Séance introuvable.")

  const log = await prisma.completedLog.create({
    data: {
      userId:         session.user.id,
      sessionId:      id,
      actualDuration,
      actualDistance,
    },
  })

  return NextResponse.json({ id: log.id }, { status: 201 })
}
