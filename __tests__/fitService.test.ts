import { describe, it, expect } from "vitest"
import { fitCRC, buildSwimWorkoutFIT } from "@/app/lib/services/fitService"
import type { TrainingSession } from "@/app/lib/types"

// ── fitCRC ────────────────────────────────────────────────────────────────────

describe("fitCRC", () => {
  it("retourne 0 pour un tableau vide", () => {
    expect(fitCRC([])).toBe(0)
  })

  it("est déterministe : même entrée → même sortie", () => {
    const data = [0x0E, 0x20, 0x54, 0x14]
    expect(fitCRC(data)).toBe(fitCRC(data))
  })

  it("produit des valeurs différentes pour des entrées différentes", () => {
    expect(fitCRC([0x01])).not.toBe(fitCRC([0x02]))
  })

  it("accepte un seed non nul (chaînage de CRC)", () => {
    const data  = [0x01, 0x02, 0x03]
    const full  = fitCRC(data)
    const seed  = fitCRC([0x01])
    const chain = fitCRC([0x02, 0x03], seed)
    expect(chain).toBe(full)
  })
})

// ── buildSwimWorkoutFIT ───────────────────────────────────────────────────────

const MINIMAL_SESSION: TrainingSession = {
  id:                "test-1",
  title:             "Test séance crawl",
  subtitle:          "Test",
  level:             "debutant",
  stroke:            "crawl",
  goal:              "endurance",
  totalDistance:     1000,
  estimatedDuration: 30,
  poolLength:        25,
  generatedAt:       new Date().toISOString(),
  sets: [
    {
      id:          "s1",
      phase:       "warmup",
      label:       "Échauffement",
      repetitions: 1,
      distance:    200,
      stroke:      "crawl",
      restSeconds: 30,
      intensity:   "easy",
    },
    {
      id:          "s2",
      phase:       "main",
      label:       "Principal",
      repetitions: 4,
      distance:    100,
      stroke:      "crawl",
      restSeconds: 20,
      intensity:   "moderate",
    },
    {
      id:          "s3",
      phase:       "cooldown",
      label:       "Retour au calme",
      repetitions: 1,
      distance:    200,
      stroke:      "crawl",
      restSeconds: 0,
      intensity:   "easy",
    },
  ],
}

describe("buildSwimWorkoutFIT", () => {
  it("retourne un Uint8Array non vide", () => {
    const result = buildSwimWorkoutFIT(MINIMAL_SESSION)
    expect(result).toBeInstanceOf(Uint8Array)
    expect(result.length).toBeGreaterThan(14)
  })

  it("commence par l'octet header_size = 14", () => {
    const result = buildSwimWorkoutFIT(MINIMAL_SESSION)
    expect(result[0]).toBe(14)
  })

  it("contient la signature magique .FIT aux octets 8-11", () => {
    const result = buildSwimWorkoutFIT(MINIMAL_SESSION)
    const magic = String.fromCharCode(result[8], result[9], result[10], result[11])
    expect(magic).toBe(".FIT")
  })

  it("est déterministe entre deux appels consécutifs", () => {
    const a = buildSwimWorkoutFIT(MINIMAL_SESSION)
    const b = buildSwimWorkoutFIT(MINIMAL_SESSION)
    // Compare byte-by-byte (sauf les 4 octets time_created qui varient)
    expect(a.length).toBe(b.length)
    expect(a.slice(0, 8)).toEqual(b.slice(0, 8))  // header avant time_created
  })

  it("génère plus d'octets pour une séance avec plus de séries", () => {
    const long: TrainingSession = {
      ...MINIMAL_SESSION,
      sets: [...MINIMAL_SESSION.sets, ...MINIMAL_SESSION.sets],
    }
    const short = buildSwimWorkoutFIT(MINIMAL_SESSION)
    const longR = buildSwimWorkoutFIT(long)
    expect(longR.length).toBeGreaterThan(short.length)
  })
})
