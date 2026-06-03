import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import Anthropic from "@anthropic-ai/sdk"
import { auth } from "@/app/lib/auth"
import { apiError, validationError } from "@/app/lib/api-error"
import { rateLimit } from "@/app/lib/rate-limit"
import { generateMockSession } from "@/app/lib/services/mockGenerator"
import type { TrainingSet } from "@/app/lib/types"

const ConfigSchema = z.object({
  level:            z.enum(["debutant", "intermediaire", "avance"]),
  stroke:           z.enum(["crawl", "dos", "brasse", "papillon", "4nages"]),
  goal:             z.enum(["endurance", "technique", "vitesse", "recuperation"]),
  durationMinutes:  z.number().int().min(20).max(180),
  poolLength:       z.union([z.literal(25), z.literal(50)]).optional(),
  techFocus:        z.string().max(50).optional(),
  intensity:        z.number().int().min(1).max(5).optional(),
  includeWarmup:    z.boolean().optional(),
  includeCooldown:  z.boolean().optional(),
})

// Schéma tool_use — force Claude à retourner un JSON strictement typé
const SESSION_TOOL: Anthropic.Tool = {
  name: "generate_swim_session",
  description: "Generate a structured swim training session.",
  input_schema: {
    type: "object",
    properties: {
      title:         { type: "string" },
      subtitle:      { type: "string" },
      totalDistance: { type: "number" },
      sets: {
        type: "array",
        items: {
          type: "object",
          properties: {
            phase:       { type: "string", enum: ["warmup", "drills", "main", "cooldown"] },
            label:       { type: "string" },
            repetitions: { type: "number" },
            distance:    { type: "number" },
            stroke:      { type: "string" },
            restSeconds: { type: "number" },
            intensity:   { type: "string", enum: ["easy", "moderate", "hard", "sprint"] },
            equipment:   { type: "string" },
            note:        { type: "string" },
          },
          required: ["phase", "label", "repetitions", "distance", "stroke", "restSeconds", "intensity"],
        },
      },
    },
    required: ["title", "subtitle", "totalDistance", "sets"],
  },
}

function buildPrompt(config: z.infer<typeof ConfigSchema>): string {
  const poolLen = config.poolLength ?? 25
  const intensity = config.intensity ?? 3
  const distPerMin = { debutant: 20, intermediaire: 27, avance: 33 }[config.level]
  const approxTotal = Math.round((config.durationMinutes * distPerMin) / poolLen) * poolLen

  const restLabel = ["très long (90-120s)", "long (60-90s)", "moyen (30-60s)", "court (15-30s)", "minimal (10-15s)"][intensity - 1]

  return `Tu es un entraîneur de natation expert. Génère une séance d'entraînement complète.

Paramètres :
- Niveau : ${config.level}
- Nage principale : ${config.stroke}
- Objectif : ${config.goal}
- Durée : ${config.durationMinutes} minutes
- Bassin : ${poolLen}m
- Intensité : ${intensity}/5 (repos ${restLabel})
- Échauffement : ${config.includeWarmup !== false ? "oui" : "non"}
- Retour au calme : ${config.includeCooldown !== false ? "oui" : "non"}
${config.techFocus ? `- Focus technique : ${config.techFocus}` : ""}

Contraintes strictes :
- Distance totale ≈ ${approxTotal}m, OBLIGATOIREMENT multiple de ${poolLen}
- Chaque distance individuelle doit être un multiple de ${poolLen}
- Labels, notes et titre en français
- Échauffement en crawl si la nage principale est papillon
- Au moins 1 note de coaching pertinente sur la première série principale
- Titre concis (ex : "Endurance Crawl — 60min")
- Sous-titre : "[nage] · [niveau] · [tagline objectif]"
- Pour "endurance" : 2-4 séries longues avec repos modéré
- Pour "vitesse" : nombreuses répétitions courtes (25-100m) avec repos complet
- Pour "technique" : phase drills (50% distance) + application
- Pour "recuperation" : effort unique facile, pas de fractionnés`
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id)
    return apiError(401, "UNAUTHORIZED", "Non autorisé.")

  // 20 générations par heure par utilisateur (chaque appel coûte de l'API)
  const { ok, retryAfterMs } = rateLimit(`generate:${session.user.id}`, 20, 60 * 60 * 1000)
  if (!ok)
    return apiError(429, "RATE_LIMITED", `Limite atteinte. Réessaie dans ${Math.ceil(retryAfterMs / 60000)} min.`)

  const body   = await req.json().catch(() => null)
  const parsed = ConfigSchema.safeParse(body)
  if (!parsed.success) return validationError(parsed.error)

  const config = parsed.data

  // Fallback algorithmique si la clé API est absente (dev sans clé, CI, etc.)
  if (!process.env.ANTHROPIC_API_KEY) {
    const fallback = generateMockSession({ ...config, poolLength: config.poolLength ?? 25 })
    return NextResponse.json({ ...fallback, mode: "algorithmic" })
  }

  try {
    const client = new Anthropic()

    const message = await client.messages.create({
      model:      "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      tools:      [SESSION_TOOL],
      tool_choice: { type: "any" },
      system: "Tu es un entraîneur de natation expert. Tu génères des séances structurées avec des conseils techniques précis adaptés au niveau et aux objectifs du nageur.",
      messages: [{ role: "user", content: buildPrompt(config) }],
    })

    const toolUse = message.content.find(b => b.type === "tool_use")
    if (!toolUse || toolUse.type !== "tool_use")
      throw new Error("Pas de réponse tool_use de Claude")

    const raw = toolUse.input as {
      title: string
      subtitle: string
      totalDistance: number
      sets: Array<{
        phase: string; label: string; repetitions: number; distance: number
        stroke: string; restSeconds: number; intensity: string
        equipment?: string; note?: string
      }>
    }

    const sets: TrainingSet[] = raw.sets.map((s, i) => ({
      id:          `ai-${Date.now()}-${i}`,
      phase:       s.phase       as TrainingSet["phase"],
      label:       s.label,
      repetitions: s.repetitions,
      distance:    s.distance,
      stroke:      s.stroke,
      restSeconds: s.restSeconds,
      intensity:   s.intensity   as TrainingSet["intensity"],
      equipment:   s.equipment,
      note:        s.note,
    }))

    return NextResponse.json({
      id:                `ai-${Date.now().toString(36)}`,
      title:             raw.title,
      subtitle:          raw.subtitle,
      level:             config.level,
      stroke:            config.stroke,
      goal:              config.goal,
      totalDistance:     raw.totalDistance,
      estimatedDuration: config.durationMinutes,
      poolLength:        config.poolLength ?? 25,
      sets,
      generatedAt:       new Date().toISOString(),
      mode:              "ai",
    })
  } catch (err) {
    // En cas d'erreur Claude, on ne casse pas l'UX — fallback silencieux
    console.error("[/api/generate] Claude error, falling back to mock:", err)
    const fallback = generateMockSession({ ...config, poolLength: config.poolLength ?? 25 })
    return NextResponse.json({ ...fallback, mode: "algorithmic" })
  }
}
