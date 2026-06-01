import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/app/lib/auth"
import { prisma } from "@/app/lib/prisma"
import type { Stroke, Phase, Intensity } from "@/app/generated/prisma/client"

const STROKE_TO_DB: Record<string, Stroke> = {
  crawl:    "crawl",
  dos:      "dos",
  brasse:   "brasse",
  papillon: "papillon",
  "4nages": "four_nages",
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const body = await req.json()
  const { title, subtitle, level, stroke, goal, totalDistance, estimatedDuration, poolLength, sets } = body

  const dbStroke = STROKE_TO_DB[stroke]
  if (!dbStroke)
    return NextResponse.json({ error: "Nage invalide." }, { status: 400 })

  const saved = await prisma.trainingSession.create({
    data: {
      userId:            session.user.id,
      title,
      subtitle:          subtitle ?? null,
      level,
      stroke:            dbStroke,
      goal,
      totalDistance,
      estimatedDuration,
      poolLength:        poolLength ?? 25,
      source:            "generated",
      sets: {
        create: sets.map((s: any, i: number) => ({
          order:       i,
          phase:       s.phase       as Phase,
          label:       s.label,
          repetitions: s.repetitions,
          distance:    s.distance,
          stroke:      s.stroke,
          restSeconds: s.restSeconds ?? 0,
          intensity:   (s.intensity ?? "moderate") as Intensity,
          equipment:   s.equipment ?? null,
          note:        s.note       ?? null,
        })),
      },
    },
  })

  return NextResponse.json({ id: saved.id }, { status: 201 })
}

export async function GET() {
  const session = await auth()
  if (!session?.user?.id)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const sessions = await prisma.trainingSession.findMany({
    where:   { userId: session.user.id },
    include: { sets: { orderBy: { order: "asc" } } },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(sessions)
}
