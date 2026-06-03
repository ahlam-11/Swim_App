// ─── Types partagés — Swim App ───────────────────────────────────────────────

export type Level    = "debutant" | "intermediaire" | "avance"
export type Stroke   = "crawl" | "dos" | "brasse" | "papillon" | "4nages"
export type Goal     = "endurance" | "technique" | "vitesse" | "recuperation"
export type Phase    = "warmup" | "main" | "drills" | "cooldown"
export type Intensity = "easy" | "moderate" | "hard" | "sprint"

// ─── Série d'entraînement ────────────────────────────────────────────────────

export interface TrainingSet {
  id:          string
  phase:       Phase
  label:       string
  repetitions: number
  distance:    number      // mètres par répétition
  stroke:      string
  restSeconds: number
  intensity:   Intensity
  equipment?:  string
  note?:       string
}

// ─── Séances prêtes ──────────────────────────────────────────────────────────

export interface ReadySession {
  id:                string
  title:             string
  level:             Level
  stroke:            Stroke
  goal:              Goal
  totalDistance:     number   // mètres
  estimatedDuration: number   // minutes
  poolLength:        25 | 50
  sets:              TrainingSet[]
  tags:              string[]
}

// ─── Séance générée ──────────────────────────────────────────────────────────

export interface SessionConfig {
  level:            Level
  stroke:           Stroke
  goal:             Goal
  durationMinutes:  number
  poolLength?:      25 | 50
  techFocus?:       string
  intensity?:       number   // 1–5, défaut 3
  includeWarmup?:   boolean
  includeCooldown?: boolean
}

export interface TrainingSession {
  id:                string
  title:             string
  subtitle:          string
  level:             Level
  stroke:            Stroke
  goal:              Goal
  totalDistance:     number
  estimatedDuration: number
  poolLength:        25 | 50
  sets:              TrainingSet[]
  generatedAt:       string   // ISO 8601
}

// ─── Contenu éducatif ────────────────────────────────────────────────────────

export type VideoStroke  = "crawl" | "dos" | "brasse" | "papillon"
export type VideoTag     = "technique" | "drill" | "virage" | "depart" | "respiration" | "erreurs" | "complet"

export interface LearnVideo {
  id:               string
  title:            string
  youtubeId:        string
  stroke:           VideoStroke
  level:            Level
  tag:              VideoTag
  durationMinutes:  number
  description:      string
}

// ─── Exercices ciblés ────────────────────────────────────────────────────────

export interface DrillItem {
  name:        string
  description: string   // 2-3 phrases, ton coach
  distance:    string   // ex: "4×25m"
  equipment?:  string
  tip:         string   // conseil clé
}

export interface TargetedDrill {
  id:      string
  problem: string
  stroke:  string
  drills:  DrillItem[]
}

// ─── Historique ──────────────────────────────────────────────────────────────

export interface SessionHistory {
  id:             string
  sessionId:      string
  title:          string
  completedAt:    string   // ISO 8601
  totalDistance:  number
  actualDuration: number
  stroke:         string
  level:          string
  exported:       boolean
  exportTarget?:  "garmin" | "coros"
}

// ─── Statistiques utilisateur ────────────────────────────────────────────────

export interface UserStats {
  totalSessions:     number
  totalDistance:     number   // mètres
  totalDuration:     number   // minutes
  favoriteStroke:    string
  currentStreak:     number   // semaines consécutives avec au moins 1 séance
  distanceByStroke:  Record<string, number>
  distanceByMonth:   { month: string; distance: number }[]
  sessionsCompleted: number
  exportsCount:      number
}
