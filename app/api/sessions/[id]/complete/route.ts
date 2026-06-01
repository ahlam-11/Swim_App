import { NextResponse } from "next/server"
import { auth } from "@/app/lib/auth"
import { prisma } from "@/app/lib/prisma"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 })
  }

  const { id } = await params
  const { actualDuration, actualDistance } = await req.json()

  if (!actualDuration || !actualDistance) {
    return NextResponse.json({ error: "Durée et distance requises." }, { status: 400 })
  }

  // Vérifie que la séance appartient bien à cet utilisateur
  const training = await prisma.trainingSession.findFirst({
    where: { id, userId: session.user.id },
  })
  if (!training) {
    return NextResponse.json({ error: "Séance introuvable." }, { status: 404 })
  }

  const log = await prisma.completedLog.create({
    data: {
      userId:         session.user.id,
      sessionId:      id,
      actualDuration: Number(actualDuration),
      actualDistance: Number(actualDistance),
    },
  })

  return NextResponse.json({ id: log.id }, { status: 201 })
}
