import { prisma } from "@/app/lib/prisma"
import { Stroke } from "@/app/generated/prisma/client"

// "four_nages" en base → "4nages" dans l'UI
const STROKE_DISPLAY: Record<string, string> = {
  crawl:      "crawl",
  dos:        "dos",
  brasse:     "brasse",
  papillon:   "papillon",
  four_nages: "4nages",
}

// ─── Types retournés ──────────────────────────────────────────────────────────

export interface DashboardStats {
  totalSessions:    number
  totalDistance:    number   // mètres
  totalDuration:    number   // minutes
  favoriteStroke:   string
  currentStreak:    number   // semaines consécutives
  exportsCount:     number
  distanceByStroke: Record<string, number>
  distanceByMonth:  { month: string; distance: number }[]
}

export interface RecentSession {
  id:             string
  title:          string
  completedAt:    Date
  actualDuration: number
  actualDistance: number
  stroke:         string
  level:          string
  exportTarget:   string | null
}

// ─── Streak : semaines consécutives avec au moins 1 séance ───────────────────

function computeStreak(dates: Date[]): number {
  if (dates.length === 0) return 0

  // Numéro de semaine ISO : "2026-W18"
  function isoWeek(d: Date): string {
    const tmp = new Date(d)
    tmp.setHours(0, 0, 0, 0)
    tmp.setDate(tmp.getDate() + 3 - ((tmp.getDay() + 6) % 7))
    const week1 = new Date(tmp.getFullYear(), 0, 4)
    const weekNum = 1 + Math.round(((tmp.getTime() - week1.getTime()) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7)
    return `${tmp.getFullYear()}-W${String(weekNum).padStart(2, "0")}`
  }

  const weeks = [...new Set(dates.map(isoWeek))].sort()
  const currentWeek = isoWeek(new Date())

  let streak = 0
  let expected = currentWeek

  // On remonte semaine par semaine depuis aujourd'hui
  for (let i = weeks.length - 1; i >= 0; i--) {
    if (weeks[i] === expected) {
      streak++
      // Semaine précédente
      const d = new Date()
      d.setDate(d.getDate() - streak * 7)
      expected = isoWeek(d)
    } else {
      break
    }
  }

  return streak
}

// ─── Requêtes principales ─────────────────────────────────────────────────────

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const logs = await prisma.completedLog.findMany({
    where: { userId },
    include: {
      session: { select: { stroke: true } },
    },
    orderBy: { completedAt: "asc" },
  })

  if (logs.length === 0) {
    return {
      totalSessions:    0,
      totalDistance:    0,
      totalDuration:    0,
      favoriteStroke:   "—",
      currentStreak:    0,
      exportsCount:     0,
      distanceByStroke: {},
      distanceByMonth:  [],
    }
  }

  // ── Totaux ────────────────────────────────────────────────────────────────
  const totalDistance  = logs.reduce((s, l) => s + l.actualDistance, 0)
  const totalDuration  = logs.reduce((s, l) => s + l.actualDuration, 0)
  const exportsCount   = logs.filter((l) => l.exportTarget !== null).length

  // ── Distance par nage ────────────────────────────────────────────────────
  const distanceByStroke: Record<string, number> = {}
  for (const log of logs) {
    const key = STROKE_DISPLAY[log.session.stroke] ?? log.session.stroke
    distanceByStroke[key] = (distanceByStroke[key] ?? 0) + log.actualDistance
  }

  // ── Nage favorite (la plus nagée en distance) ────────────────────────────
  const favoriteStroke = Object.entries(distanceByStroke)
    .sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—"

  // ── Distance par mois ────────────────────────────────────────────────────
  const monthMap: Record<string, number> = {}
  for (const log of logs) {
    const label = log.completedAt.toLocaleDateString("fr-FR", {
      month: "long",
      year:  "numeric",
    })
    // Capitalise le premier caractère
    const key = label.charAt(0).toUpperCase() + label.slice(1)
    monthMap[key] = (monthMap[key] ?? 0) + log.actualDistance
  }
  const distanceByMonth = Object.entries(monthMap).map(([month, distance]) => ({
    month,
    distance,
  }))

  // ── Streak ───────────────────────────────────────────────────────────────
  const currentStreak = computeStreak(logs.map((l) => l.completedAt))

  return {
    totalSessions:    logs.length,
    totalDistance,
    totalDuration,
    favoriteStroke,
    currentStreak,
    exportsCount,
    distanceByStroke,
    distanceByMonth,
  }
}

export async function getRecentSessions(userId: string, limit = 5): Promise<RecentSession[]> {
  const logs = await prisma.completedLog.findMany({
    where: { userId },
    include: {
      session: { select: { title: true, stroke: true, level: true } },
    },
    orderBy: { completedAt: "desc" },
    take: limit,
  })

  return logs.map((l) => ({
    id:             l.id,
    title:          l.session.title,
    completedAt:    l.completedAt,
    actualDuration: l.actualDuration,
    actualDistance: l.actualDistance,
    stroke:         STROKE_DISPLAY[l.session.stroke] ?? l.session.stroke,
    level:          l.session.level,
    exportTarget:   l.exportTarget,
  }))
}
