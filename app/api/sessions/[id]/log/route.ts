import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/app/lib/auth"
import { prisma } from "@/app/lib/prisma"
import { validationError, apiError } from "@/app/lib/api-error"

const LogSchema = z.object({
  exportTarget:   z.enum(["garmin", "coros", "pdf"]).optional().nullable(),
  actualDuration: z.number().int().min(1).max(480).optional(),
  actualDistance: z.number().int().min(1).max(20000).optional(),
})

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id)
    return apiError(401, "UNAUTHORIZED", "Non autorisé.")

  const body   = await req.json().catch(() => null)
  const parsed = LogSchema.safeParse(body)
  if (!parsed.success) return validationError(parsed.error)

  const { id } = await params
  const { exportTarget, actualDuration, actualDistance } = parsed.data

  const trainingSession = await prisma.trainingSession.findUnique({
    where:  { id },
    select: { userId: true, totalDistance: true, estimatedDuration: true },
  })
  if (!trainingSession || trainingSession.userId !== session.user.id)
    return apiError(404, "NOT_FOUND", "Séance introuvable.")

  const log = await prisma.completedLog.create({
    data: {
      userId:         session.user.id,
      sessionId:      id,
      actualDuration: actualDuration ?? trainingSession.estimatedDuration,
      actualDistance: actualDistance ?? trainingSession.totalDistance,
      exportTarget:   exportTarget   ?? null,
      exportedAt:     exportTarget   ? new Date() : null,
    },
  })

  return NextResponse.json({ id: log.id }, { status: 201 })
}
