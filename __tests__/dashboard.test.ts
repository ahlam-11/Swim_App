import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { computeStreak } from "@/app/lib/data/dashboard"

// Date de référence fixe : mercredi 3 juin 2026 (semaine ISO 23)
const REFERENCE_DATE = new Date("2026-06-03T12:00:00.000Z")

// Crée une Date en milieu de journée UTC pour éviter les décalages horaires
function d(isoDate: string): Date {
  return new Date(`${isoDate}T12:00:00.000Z`)
}

describe("computeStreak", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(REFERENCE_DATE)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("retourne 0 pour un tableau vide", () => {
    expect(computeStreak([])).toBe(0)
  })

  it("retourne 1 si une seule séance dans la semaine courante", () => {
    expect(computeStreak([d("2026-06-02")])).toBe(1)
  })

  it("retourne 0 si la seule séance est dans une semaine passée non consécutive", () => {
    // Semaine 21 (2026-05-18), on saute la semaine 22 → streak rompu
    expect(computeStreak([d("2026-05-18")])).toBe(0)
  })

  it("retourne le nombre correct de semaines consécutives", () => {
    // Semaines 23 (cette semaine), 22, 21 → streak de 3
    const dates = [
      d("2026-06-01"), // semaine 23
      d("2026-05-26"), // semaine 22
      d("2026-05-20"), // semaine 21
    ]
    expect(computeStreak(dates)).toBe(3)
  })

  it("s'arrête dès qu'une semaine est manquante dans la chaîne", () => {
    // Semaines 23 et 21, sans la semaine 22 → streak = 1 (seulement la sem. courante)
    const dates = [
      d("2026-06-01"), // semaine 23
      d("2026-05-20"), // semaine 21 — gap
    ]
    expect(computeStreak(dates)).toBe(1)
  })

  it("tolère plusieurs séances dans la même semaine (pas de doublon de comptage)", () => {
    // 3 séances en semaine 23 + 1 en semaine 22
    const dates = [
      d("2026-06-01"),
      d("2026-06-02"),
      d("2026-06-03"),
      d("2026-05-27"),
    ]
    expect(computeStreak(dates)).toBe(2)
  })
})
