import "dotenv/config"
import { PrismaNeon } from "@prisma/adapter-neon"
import { PrismaClient } from "../app/generated/prisma/client"
import bcrypt from "bcryptjs"

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma  = new PrismaClient({ adapter } as never)

async function main() {
  console.log("🌊 Seed en cours…\n")

  // ─── Compte démo ────────────────────────────────────────────────────────────
  const hash = await bcrypt.hash("Demo1234!swim", 12)
  const demo = await prisma.user.upsert({
    where:  { email: "demo@demo.local" },
    update: {},
    create: {
      email:        "demo@demo.local",
      name:         "Demo Nageur",
      passwordHash: hash,
      level:        "intermediaire",
    },
  })
  console.log(`✓ Utilisateur démo : ${demo.email}`)

  // ─── Séances de démonstration ────────────────────────────────────────────────
  const existing = await prisma.trainingSession.count({ where: { userId: demo.id } })
  if (existing > 0) {
    console.log(`ℹ  ${existing} séances déjà présentes — seed ignoré pour les séances.`)
    console.log("\n🎉 Seed terminé !")
    console.log("   Email    : demo@demo.local")
    console.log("   Password : Demo1234!swim")
    return
  }

  const sessions = await Promise.all([

    // 1. Endurance crawl
    prisma.trainingSession.create({ data: {
      userId: demo.id, title: "Endurance fondamentale — Crawl",
      subtitle: "Séance de base · Niveau intermédiaire",
      level: "intermediaire", stroke: "crawl", goal: "endurance",
      totalDistance: 2000, estimatedDuration: 60, poolLength: 25, source: "generated",
      sets: { create: [
        { order: 0, phase: "warmup",   label: "Échauffement crawl",      repetitions: 1, distance: 400, stroke: "crawl",  restSeconds: 30, intensity: "easy",     note: "Nage lente, focus respiratoire" },
        { order: 1, phase: "drills",   label: "Crawl bras seuls",        repetitions: 4, distance: 50,  stroke: "crawl",  restSeconds: 20, intensity: "easy",     equipment: "Pull buoy" },
        { order: 2, phase: "main",     label: "200m crawl continu",      repetitions: 4, distance: 200, stroke: "crawl",  restSeconds: 45, intensity: "moderate", note: "70 % effort max, rythme régulier" },
        { order: 3, phase: "cooldown", label: "Retour au calme",         repetitions: 1, distance: 200, stroke: "crawl",  restSeconds: 0,  intensity: "easy" },
      ]},
    }}),

    // 2. Technique dos
    prisma.trainingSession.create({ data: {
      userId: demo.id, title: "Technique dos — Rotation épaules",
      subtitle: "Travail de placement · Débutant",
      level: "debutant", stroke: "dos", goal: "technique",
      totalDistance: 1500, estimatedDuration: 45, poolLength: 25, source: "generated",
      sets: { create: [
        { order: 0, phase: "warmup",   label: "Échauffement dos",          repetitions: 1, distance: 300, stroke: "dos",   restSeconds: 30, intensity: "easy" },
        { order: 1, phase: "drills",   label: "Jambes dos, bras le long",  repetitions: 6, distance: 50,  stroke: "dos",   restSeconds: 15, intensity: "easy",     note: "Regard vers le ciel, rotation hanches" },
        { order: 2, phase: "main",     label: "100m dos technique",        repetitions: 6, distance: 100, stroke: "dos",   restSeconds: 30, intensity: "moderate", note: "Focus rotation épaules" },
        { order: 3, phase: "cooldown", label: "Retour au calme crawl",     repetitions: 1, distance: 300, stroke: "crawl", restSeconds: 0,  intensity: "easy" },
      ]},
    }}),

    // 3. Récupération 4 nages
    prisma.trainingSession.create({ data: {
      userId: demo.id, title: "Récupération active — 4 Nages",
      subtitle: "Séance légère · Tous niveaux",
      level: "intermediaire", stroke: "four_nages", goal: "recuperation",
      totalDistance: 1200, estimatedDuration: 40, poolLength: 25, source: "generated",
      sets: { create: [
        { order: 0, phase: "warmup",   label: "Échauffement libre",         repetitions: 1, distance: 200, stroke: "crawl",      restSeconds: 0,  intensity: "easy" },
        { order: 1, phase: "main",     label: "IM 4 nages",                 repetitions: 5, distance: 100, stroke: "four_nages", restSeconds: 30, intensity: "easy", note: "25m papillon · 25m dos · 25m brasse · 25m crawl" },
        { order: 2, phase: "cooldown", label: "Retour au calme crawl",      repetitions: 1, distance: 200, stroke: "crawl",      restSeconds: 0,  intensity: "easy" },
      ]},
    }}),

    // 4. Vitesse crawl avancé
    prisma.trainingSession.create({ data: {
      userId: demo.id, title: "Vitesse & relances — Crawl avancé",
      subtitle: "Séances intensives · Avancé",
      level: "avance", stroke: "crawl", goal: "vitesse",
      totalDistance: 3000, estimatedDuration: 75, poolLength: 25, source: "generated",
      sets: { create: [
        { order: 0, phase: "warmup",   label: "Échauffement complet",  repetitions: 1, distance: 500, stroke: "crawl", restSeconds: 0,  intensity: "easy" },
        { order: 1, phase: "drills",   label: "Sprint 25m",            repetitions: 8, distance: 25,  stroke: "crawl", restSeconds: 45, intensity: "sprint",   note: "Effort maximal, départ plongé" },
        { order: 2, phase: "main",     label: "Série 200m crawl",      repetitions: 6, distance: 200, stroke: "crawl", restSeconds: 60, intensity: "hard",     note: "85-90 % effort max" },
        { order: 3, phase: "main",     label: "Finisher 50m sprint",   repetitions: 4, distance: 50,  stroke: "crawl", restSeconds: 90, intensity: "sprint" },
        { order: 4, phase: "cooldown", label: "Retour au calme",       repetitions: 1, distance: 300, stroke: "crawl", restSeconds: 0,  intensity: "easy" },
      ]},
    }}),

    // 5. Brasse technique
    prisma.trainingSession.create({ data: {
      userId: demo.id, title: "Brasse technique — Synchronisation",
      subtitle: "Travail de coordination · Intermédiaire",
      level: "intermediaire", stroke: "brasse", goal: "technique",
      totalDistance: 1800, estimatedDuration: 55, poolLength: 25, source: "generated",
      sets: { create: [
        { order: 0, phase: "warmup",   label: "Échauffement brasse",    repetitions: 1, distance: 300, stroke: "brasse", restSeconds: 20, intensity: "easy" },
        { order: 1, phase: "drills",   label: "Jambes brasse seules",   repetitions: 6, distance: 50,  stroke: "brasse", restSeconds: 20, intensity: "easy",     note: "Bras tendus, focus phase de glisse" },
        { order: 2, phase: "main",     label: "150m brasse technique",  repetitions: 4, distance: 150, stroke: "brasse", restSeconds: 45, intensity: "moderate", note: "2 cycles par longueur" },
        { order: 3, phase: "cooldown", label: "Retour au calme dos",    repetitions: 1, distance: 300, stroke: "dos",    restSeconds: 0,  intensity: "easy" },
      ]},
    }}),

  ])
  console.log(`✓ ${sessions.length} séances créées`)

  // ─── Logs de séances complétées (pour alimenter les stats du dashboard) ─────
  const now = new Date()
  const logsData = [
    { daysAgo: 1,  idx: 0, duration: 58, distance: 1950 },
    { daysAgo: 3,  idx: 3, duration: 72, distance: 2900 },
    { daysAgo: 5,  idx: 1, duration: 44, distance: 1450 },
    { daysAgo: 8,  idx: 2, duration: 38, distance: 1200 },
    { daysAgo: 10, idx: 4, duration: 52, distance: 1750 },
    { daysAgo: 14, idx: 0, duration: 61, distance: 2000 },
    { daysAgo: 17, idx: 3, duration: 74, distance: 3000 },
    { daysAgo: 21, idx: 1, duration: 43, distance: 1500 },
  ]

  for (const { daysAgo, idx, duration, distance } of logsData) {
    const completedAt = new Date(now)
    completedAt.setDate(completedAt.getDate() - daysAgo)
    await prisma.completedLog.create({
      data: {
        userId:         demo.id,
        sessionId:      sessions[idx].id,
        actualDuration: duration,
        actualDistance: distance,
        completedAt,
      },
    })
  }
  console.log(`✓ ${logsData.length} séances complétées (stats dashboard)`)

  console.log("\n🎉 Seed terminé !")
  console.log("   Email    : demo@demo.local")
  console.log("   Password : Demo1234!swim")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
