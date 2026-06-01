import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/app/lib/auth"
import { prisma } from "@/app/lib/prisma"
import type { TrainingSession } from "@/app/lib/types"

function toDbStroke(stroke: string) {
  return stroke === "4nages" ? "four_nages" : stroke
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id)
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 })

  const body: TrainingSession = await req.json()

  const created = await prisma.trainingSession.create({
    data: {
      userId:            session.user.id,
      title:             body.title,
      subtitle:          body.subtitle ?? null,
      level:             body.level   as any,
      stroke:            toDbStroke(body.stroke) as any,
      goal:              body.goal    as any,
      totalDistance:     body.totalDistance,
      estimatedDuration: body.estimatedDuration,
      poolLength:        body.poolLength ?? 25,
      source:            "generated",
      sets: {
        create: body.sets.map((set, index) => ({
          order:       index,
          phase:       set.phase     as any,
          label:       set.label,
          repetitions: set.repetitions,
          distance:    set.distance,
          stroke:      set.stroke,
          restSeconds: set.restSeconds,
          intensity:   set.intensity as any,
          equipment:   set.equipment ?? null,
          note:        set.note      ?? null,
        })),
      },
    },
  })

  return NextResponse.json({ id: created.id }, { status: 201 })
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
