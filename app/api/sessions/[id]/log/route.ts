import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/app/lib/auth"
import { prisma } from "@/app/lib/prisma"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const { id } = await params
  const { exportTarget, actualDuration, actualDistance } = await req.json()

  const trainingSession = await prisma.trainingSession.findUnique({
    where:  { id },
    select: { userId: true, totalDistance: true, estimatedDuration: true },
  })

  if (!trainingSession || trainingSession.userId !== session.user.id)
    return NextResponse.json({ error: "Séance introuvable" }, { status: 404 })

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
