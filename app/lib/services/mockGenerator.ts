import type { SessionConfig, TrainingSession, TrainingSet, Level, Goal, Stroke, Intensity } from "../types"

// ─── Générateur de séances — mode démo sans appel API ────────────────────────
// Même signature que le futur generateSession(config) côté Anthropic.
// Remplacer ce fichier par un appel API suffira pour passer en production.

// ─── Tables de configuration ─────────────────────────────────────────────────

const DISTANCES: Record<Level, { perMinute: number; warmupRatio: number; cooldownRatio: number }> = {
  debutant:      { perMinute: 20, warmupRatio: 0.20, cooldownRatio: 0.12 },
  intermediaire: { perMinute: 27, warmupRatio: 0.16, cooldownRatio: 0.10 },
  avance:        { perMinute: 33, warmupRatio: 0.13, cooldownRatio: 0.08 },
}

const TITLES: Record<Goal, Record<Stroke, string[]>> = {
  endurance: {
    crawl:    ["Endurance Crawl", "Fond Crawl", "Aérobie Crawl"],
    dos:      ["Endurance Dos", "Fond Dos", "Longue Distance Dos"],
    brasse:   ["Endurance Brasse", "Fond Brasse", "Rythme Brasse"],
    papillon: ["Endurance Papillon", "Volume Papillon", "Papillon Continu"],
    "4nages": ["Endurance 4 Nages", "IM Volume", "4 Nages Fond"],
  },
  technique: {
    crawl:    ["Technique Crawl", "Crawl Précision", "Mécanique Crawl"],
    dos:      ["Technique Dos", "Dos Précision", "Rotation Dos"],
    brasse:   ["Technique Brasse", "Glisse Brasse", "Brasse Précision"],
    papillon: ["Technique Papillon", "Ondulation Fly", "Papillon Précision"],
    "4nages": ["Technique 4 Nages", "IM Technique", "Coordination IM"],
  },
  vitesse: {
    crawl:    ["Vitesse Crawl", "Sprint Crawl", "Crawl Explosif"],
    dos:      ["Vitesse Dos", "Sprint Dos", "Dos Explosif"],
    brasse:   ["Vitesse Brasse", "Sprint Brasse", "Brasse Explosive"],
    papillon: ["Vitesse Papillon", "Sprint Fly", "Papillon Explosif"],
    "4nages": ["Vitesse 4 Nages", "Sprint IM", "IM Explosif"],
  },
  recuperation: {
    crawl:    ["Récupération Crawl", "Crawl Doux", "Active Recovery Crawl"],
    dos:      ["Récupération Dos", "Dos Doux", "Active Recovery Dos"],
    brasse:   ["Récupération Brasse", "Brasse Douce", "Active Recovery Brasse"],
    papillon: ["Récupération Fly", "Fly Doux", "Active Recovery Papillon"],
    "4nages": ["Récupération 4 Nages", "IM Doux", "Active Recovery IM"],
  },
}

const GOAL_SUBTITLES: Record<Goal, string> = {
  endurance:    "Construis ta base aérobie avec des efforts maintenus",
  technique:    "Perfectionne ta gestuelle pour nager plus vite avec moins d'effort",
  vitesse:      "Développe ta puissance et ton explosivité",
  recuperation: "Relance la circulation sans accumuler de fatigue",
}

const STROKE_LABELS: Record<Stroke, string> = {
  crawl:    "Crawl",
  dos:      "Dos crawlé",
  brasse:   "Brasse",
  papillon: "Papillon",
  "4nages": "4 Nages",
}

// ─── Notes par phase et objectif ─────────────────────────────────────────────

const WARMUP_NOTES: Record<Stroke, string> = {
  crawl:    "Démarre à 60% de ton allure — respiration toutes les 3 foulées",
  dos:      "Rotation des épaules dès le premier coup — ne nage pas plat",
  brasse:   "Glisse 2 secondes après chaque poussée — laisse ton corps s'allonger",
  papillon: "Ondulation en crawl d'abord, puis intègre les bras progressivement",
  "4nages": "Commence par le dos pour chauffer le dos et les épaules",
}

const DRILL_NOTES: Record<Goal, string> = {
  endurance:    "Maintiens un rythme de nage régulier — respiration stable",
  technique:    "Concentre-toi sur une correction à la fois",
  vitesse:      "Effort à 85-90% — récupération complète entre chaque répétition",
  recuperation: "Nage à l'aise — si tu dois souffler, c'est trop vite",
}

const COOLDOWN_NOTES: Record<Stroke, string> = {
  crawl:    "Alterne crawl et dos — laisse le rythme cardiaque descendre",
  dos:      "Nage lentement en dos — bras à 90° d'amplitude uniquement",
  brasse:   "Brasse très lente — compte 3 secondes de glisse après chaque cycle",
  papillon: "Crawl uniquement — pas de papillon en récupération",
  "4nages": "Dos crawlé uniquement — le plus lentement possible",
}

// ─── Notes de focus technique ─────────────────────────────────────────────────

const TECH_FOCUS_NOTES: Record<string, string> = {
  Bras:         "Traction haute coude, poussée complète jusqu'à la cuisse",
  Jambes:       "Battements compacts et réguliers depuis la hanche",
  Respiration:  "Expire complètement sous l'eau avant de tourner la tête",
  Virage:       "Approche à vitesse, touche franche, poussée forte sur le mur",
}

// ─── Multiplicateurs de repos selon l'intensité ───────────────────────────────

const REST_MULTIPLIERS: Record<number, number> = { 1: 1.75, 2: 1.35, 3: 1.0, 4: 0.70, 5: 0.50 }

// ─── Utilitaires ─────────────────────────────────────────────────────────────

function pick<T>(arr: T[]): T {
  return arr[Math.floor(arr.length * 0.5)]
}

export function roundToPool(metres: number, poolLength: 25 | 50): number {
  return Math.round(metres / poolLength) * poolLength
}

function makeId(): string {
  return `gen-${Date.now().toString(36)}`
}

// ─── Constructeurs de séries ──────────────────────────────────────────────────

let setCounter = 0

function makeSet(partial: Omit<TrainingSet, "id">): TrainingSet {
  return { id: `set-${++setCounter}`, ...partial }
}

// ─── Générateur principal ─────────────────────────────────────────────────────

export function generateMockSession(config: SessionConfig): TrainingSession {
  setCounter = 0

  const {
    level, stroke, goal, durationMinutes, poolLength = 25,
    techFocus, intensity = 3, includeWarmup = true, includeCooldown = true,
  } = config
  const cfg = DISTANCES[level]

  const totalDistance = roundToPool(durationMinutes * cfg.perMinute, poolLength)
  const warmupDist    = includeWarmup   ? roundToPool(totalDistance * cfg.warmupRatio,   poolLength) : 0
  const cooldownDist  = includeCooldown ? roundToPool(totalDistance * cfg.cooldownRatio, poolLength) : 0
  const mainDist      = totalDistance - warmupDist - cooldownDist

  const mult = REST_MULTIPLIERS[intensity] ?? 1
  function adjRest(s: number): number {
    if (s === 0) return 0
    return Math.max(10, Math.round(s * mult / 5) * 5)
  }

  const mainIntensity: Intensity =
    intensity <= 2 ? "easy" : intensity === 3 ? "moderate" : intensity === 4 ? "hard" : "sprint"

  const focusNote = techFocus ? TECH_FOCUS_NOTES[techFocus] ?? techFocus : null

  function mainNote(base: string): string {
    return focusNote ? `${base} — Focus : ${focusNote}` : base
  }

  const sets: TrainingSet[] = []

  // ── Warmup ──────────────────────────────────────────────────────────────────
  if (includeWarmup) {
    sets.push(makeSet({
      phase:       "warmup",
      label:       "Échauffement",
      repetitions: 1,
      distance:    warmupDist,
      stroke:      stroke === "papillon" ? "crawl" : stroke,
      restSeconds: adjRest(30),
      intensity:   "easy",
      note:        WARMUP_NOTES[stroke],
    }))
  }

  // ── Phase principale ─────────────────────────────────────────────────────────
  if (goal === "endurance") {
    const reps = level === "debutant" ? 2 : level === "intermediaire" ? 3 : 4
    const repDist = roundToPool(mainDist / reps, poolLength)
    for (let i = 0; i < reps; i++) {
      sets.push(makeSet({
        phase:       "main",
        label:       `Série endurance ${i + 1}/${reps}`,
        repetitions: 1,
        distance:    repDist,
        stroke,
        restSeconds: adjRest(level === "debutant" ? 60 : level === "intermediaire" ? 45 : 30),
        intensity:   mainIntensity,
        note:        i === 0 ? mainNote(DRILL_NOTES[goal]) : undefined,
      }))
    }
  } else if (goal === "vitesse") {
    const repDist = level === "debutant" ? 25 : level === "intermediaire" ? 50 : 100
    const reps    = Math.round(mainDist / repDist)
    sets.push(makeSet({
      phase:       "main",
      label:       `${reps}×${repDist}m — sprints`,
      repetitions: reps,
      distance:    repDist,
      stroke,
      restSeconds: adjRest(level === "debutant" ? 90 : level === "intermediaire" ? 60 : 45),
      intensity:   mainIntensity,
      note:        mainNote(DRILL_NOTES[goal]),
    }))
  } else if (goal === "technique") {
    const drillDist = roundToPool(mainDist * 0.45, poolLength)
    const swimDist  = mainDist - drillDist
    sets.push(makeSet({
      phase:       "drills",
      label:       techFocus ? `Drills — ${techFocus}` : "Drills techniques",
      repetitions: Math.round(drillDist / (poolLength * 2)),
      distance:    poolLength * 2,
      stroke,
      restSeconds: adjRest(30),
      intensity:   "easy",
      note:        mainNote(DRILL_NOTES[goal]),
    }))
    sets.push(makeSet({
      phase:       "main",
      label:       "Application technique",
      repetitions: Math.round(swimDist / (poolLength * 4)),
      distance:    poolLength * 4,
      stroke,
      restSeconds: adjRest(45),
      intensity:   mainIntensity,
    }))
  } else {
    // récupération
    sets.push(makeSet({
      phase:       "main",
      label:       "Nage libre — allure confort",
      repetitions: 1,
      distance:    mainDist,
      stroke:      stroke === "papillon" ? "crawl" : stroke,
      restSeconds: adjRest(60),
      intensity:   "easy",
      note:        mainNote(DRILL_NOTES[goal]),
    }))
  }

  // ── Cooldown ─────────────────────────────────────────────────────────────────
  if (includeCooldown) {
    sets.push(makeSet({
      phase:       "cooldown",
      label:       "Retour au calme",
      repetitions: 1,
      distance:    cooldownDist,
      stroke:      stroke === "papillon" ? "crawl" : stroke,
      restSeconds: 0,
      intensity:   "easy",
      note:        COOLDOWN_NOTES[stroke],
    }))
  }

  // ── Métadonnées ───────────────────────────────────────────────────────────────
  const titleOptions = TITLES[goal][stroke]
  const title        = `${pick(titleOptions)} — ${durationMinutes}min`
  const strokeLabel  = STROKE_LABELS[stroke]
  const levelLabel   = level === "debutant" ? "Débutant" : level === "intermediaire" ? "Intermédiaire" : "Avancé"

  return {
    id:                makeId(),
    title,
    subtitle:          `${strokeLabel} · ${levelLabel} · ${GOAL_SUBTITLES[goal]}`,
    level,
    stroke,
    goal,
    totalDistance,
    estimatedDuration: durationMinutes,
    poolLength,
    sets,
    generatedAt:       new Date().toISOString(),
  }
}
