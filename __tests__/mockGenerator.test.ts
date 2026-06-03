import { describe, it, expect } from "vitest"
import { roundToPool, generateMockSession } from "@/app/lib/services/mockGenerator"
import type { SessionConfig } from "@/app/lib/types"

// ── roundToPool ───────────────────────────────────────────────────────────────

describe("roundToPool", () => {
  it("arrondit vers le bas quand plus proche du multiple inférieur (bassin 25m)", () => {
    expect(roundToPool(30, 25)).toBe(25)
  })

  it("arrondit vers le haut quand plus proche du multiple supérieur (bassin 25m)", () => {
    expect(roundToPool(38, 25)).toBe(50)
  })

  it("retourne 0 pour une entrée nulle", () => {
    expect(roundToPool(0, 25)).toBe(0)
  })

  it("respecte les multiples de 50m pour un bassin olympique", () => {
    expect(roundToPool(75, 50)).toBe(100)
    expect(roundToPool(124, 50)).toBe(100)
    expect(roundToPool(126, 50)).toBe(150)
  })

  it("retourne la valeur exacte si déjà multiple de la longueur du bassin", () => {
    expect(roundToPool(200, 25)).toBe(200)
    expect(roundToPool(200, 50)).toBe(200)
  })
})

// ── generateMockSession ───────────────────────────────────────────────────────

const BASE_CONFIG: SessionConfig = {
  level:            "intermediaire",
  stroke:           "crawl",
  goal:             "endurance",
  durationMinutes:  60,
  poolLength:       25,
  intensity:        3,
  includeWarmup:    true,
  includeCooldown:  true,
}

describe("generateMockSession", () => {
  it("ne génère aucune série warmup quand includeWarmup est false", () => {
    const session = generateMockSession({ ...BASE_CONFIG, includeWarmup: false })
    const hasWarmup = session.sets.some(s => s.phase === "warmup")
    expect(hasWarmup).toBe(false)
  })

  it("ne génère aucune série cooldown quand includeCooldown est false", () => {
    const session = generateMockSession({ ...BASE_CONFIG, includeCooldown: false })
    const hasCooldown = session.sets.some(s => s.phase === "cooldown")
    expect(hasCooldown).toBe(false)
  })

  it("la distance totale est un multiple de la longueur du bassin", () => {
    const session = generateMockSession(BASE_CONFIG)
    expect(session.totalDistance % BASE_CONFIG.poolLength!).toBe(0)
  })

  it("l'intensité vitesse génère des séries main avec intensité hard ou sprint", () => {
    const session = generateMockSession({ ...BASE_CONFIG, goal: "vitesse", intensity: 5 })
    const mainSets = session.sets.filter(s => s.phase === "main")
    expect(mainSets.length).toBeGreaterThan(0)
    mainSets.forEach(s => {
      expect(["hard", "sprint"]).toContain(s.intensity)
    })
  })

  it("inclut le focus technique dans la note quand techFocus est défini", () => {
    const session = generateMockSession({ ...BASE_CONFIG, goal: "technique", techFocus: "Bras" })
    const allNotes = session.sets.flatMap(s => s.note ?? []).join(" ")
    // La note contient le texte développé du focus, pas le label brut
    expect(allNotes).toContain("Focus")
    expect(allNotes).toContain("Traction haute coude")
  })

  it("la durée estimée correspond à la config", () => {
    const session = generateMockSession(BASE_CONFIG)
    expect(session.estimatedDuration).toBe(BASE_CONFIG.durationMinutes)
  })
})
