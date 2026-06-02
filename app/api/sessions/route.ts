import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth } from "@/app/lib/auth"
import { prisma } from "@/app/lib/prisma"
import { validationError, apiError } from "@/app/lib/api-error"
import type { Stroke, Phase, Intensity } from "@/app/generated/prisma/client"

const STROKE_TO_DB: Record<string, Stroke> = {
  crawl:      "crawl",
  dos:        "dos",
  brasse:     "brasse",
  papillon:   "papillon",
  "4nages":   "four_nages",
}

const SetSchema = z.object({
  phase:       z.enum(["warmup", "drills", "main", "cooldown"]),
  label:       z.string().min(1).max(200),
  repetitions: z.number().int().min(1).max(50),
  distance:    z.number().int().min(1).max(5000),
  stroke:      z.string().max(20),
  restSeconds: z.number().int().min(0).max(600).optional(),
  intensity:   z.enum(["easy", "moderate", "hard", "sprint"]).optional(),
  equipment:   z.string().max(100).optional().nullable(),
  note:        z.string().max(500).optional().nullable(),
})

const SessionSchema = z.object({
  title:             z.string().min(1).max(200).trim(),
  subtitle:          z.string().max(300).optional().nullable(),
  level:             z.enum(["debutant", "intermediaire", "avance"]),
  stroke:            z.enum(["crawl", "dos", "brasse", "papillon", "4nages"]),
  goal:              z.enum(["endurance", "technique", "vitesse", "recuperation"]),
  totalDistance:     z.number().int().min(100).max(20000),
  estimatedDuration: z.number().int().min(5).max(240),
  poolLength:        z.union([z.literal(25), z.literal(50)]).optional(),
  sets:              z.array(SetSchema).min(1).max(50),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id)
    return apiError(401, "UNAUTHORIZED", "Non autorisé.")

  const body   = await req.json().catch(() => null)
  const parsed = SessionSchema.safeParse(body)
  if (!parsed.success) return validationError(parsed.error)

  const { title, subtitle, level, stroke, goal, totalDistance, estimatedDuration, poolLength, sets } = parsed.data

  const dbStroke = STROKE_TO_DB[stroke]
  if (!dbStroke) return apiError(400, "INVALID_STROKE", "Nage invalide.")

  const saved = await prisma.trainingSession.create({
    data: {
      userId: session.user.id,
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
        create: sets.map((s, i) => ({
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

const PaginationSchema = z.object({
  page:  z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id)
    return apiError(401, "UNAUTHORIZED", "Non autorisé.")

  const { searchParams } = new URL(req.url)
  const parsed = PaginationSchema.safeParse({
    page:  searchParams.get("page")  ?? 1,
    limit: searchParams.get("limit") ?? 20,
  })
  if (!parsed.success) return validationError(parsed.error)

  const { page, limit } = parsed.data
  const skip  = (page - 1) * limit
  const where = { userId: session.user.id }

  const [data, total] = await Promise.all([
    prisma.trainingSession.findMany({
      where,
      include: { sets: { orderBy: { order: "asc" } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.trainingSession.count({ where }),
  ])

  return NextResponse.json({
    data,
    meta: { total, page, limit, pages: Math.ceil(total / limit) },
  })
}
