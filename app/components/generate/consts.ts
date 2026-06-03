import type { Level, Goal } from "@/app/lib/types"
import type { EquipmentKey } from "@/app/lib/hooks/useGenerateSession"

export const DURATIONS = ["30min", "45min", "1h00", "1h15", "1h30", "2h00"]

export const LEVEL_LABELS: Record<Level, string> = {
  debutant:      "Débutant",
  intermediaire: "Intermédiaire",
  avance:        "Avancé",
}

export const GOAL_LABELS: Record<Goal, string> = {
  endurance:    "Endurance",
  technique:    "Technique",
  vitesse:      "Vitesse",
  recuperation: "Récupération",
}

export const GOAL_DESCS: Record<Goal, string> = {
  endurance:    "Travail aérobie long",
  technique:    "Drills et correction",
  vitesse:      "Séries courtes intenses",
  recuperation: "Faible intensité",
}

export const STROKE_LABELS: Record<string, string> = {
  crawl:    "Crawl",
  dos:      "Dos",
  brasse:   "Brasse",
  papillon: "Papillon",
  "4nages": "4 Nages",
}

export const PHASE_COLORS: Record<string, string> = {
  warmup:   "#90CAF9",
  drills:   "#64B5F6",
  main:     "#0055A4",
  cooldown: "#BBDEFB",
}

export const EQUIPMENT_ITEMS: { key: EquipmentKey; label: string }[] = [
  { key: "planche",    label: "Planche" },
  { key: "pullbuoy",   label: "Pull buoy" },
  { key: "palmes",     label: "Palmes" },
  { key: "plaquettes", label: "Plaquettes" },
  { key: "elastique",  label: "Élastique" },
  { key: "tuba",       label: "Tuba" },
]

export function formatDuration(mins: number): string {
  if (mins < 60) return `${mins}min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m === 0 ? `${h}h00` : `${h}h${String(m).padStart(2, "0")}`
}
