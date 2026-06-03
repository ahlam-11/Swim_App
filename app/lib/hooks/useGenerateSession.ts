"use client"

import { useState } from "react"
import type { Level, Goal, Stroke, TrainingSession } from "@/app/lib/types"

export type GenerationMode = "ai" | "algorithmic"

export type EquipmentKey = "planche" | "pullbuoy" | "palmes" | "plaquettes" | "elastique" | "tuba"

const DURATION_MINS = [30, 45, 60, 75, 90, 120]

export function useGenerateSession() {
  // ── Config form ──────────────────────────────────────────────────────────────
  const [level,          setLevel]          = useState<Level>("debutant")
  const [stroke,         setStroke]         = useState<Stroke>("crawl")
  const [goal,           setGoal]           = useState<Goal>("endurance")
  const [durationIdx,    setDurationIdx]    = useState(2)
  const [equipment,      setEquipment]      = useState<Set<EquipmentKey>>(new Set(["planche", "pullbuoy"]))
  const [techFocus,      setTechFocus]      = useState<string | null>(null)
  const [intensity,      setIntensity]      = useState(3)
  const [includeWarmup,  setIncludeWarmup]  = useState(true)
  const [includeCooldown,setIncludeCooldown]= useState(true)
  const [accordionOpen,  setAccordionOpen]  = useState(false)

  // ── Session result ───────────────────────────────────────────────────────────
  const [loading,        setLoading]        = useState(false)
  const [session,        setSession]        = useState<TrainingSession | null>(null)
  const [visible,        setVisible]        = useState(false)
  const [genMode,        setGenMode]        = useState<GenerationMode | null>(null)

  // ── Export & save ────────────────────────────────────────────────────────────
  const [exportOpen,     setExportOpen]     = useState(false)
  const [savedId,        setSavedId]        = useState<string | null>(null)
  const [saving,         setSaving]         = useState(false)
  const [saveError,      setSaveError]      = useState<string | null>(null)
  const [customTitle,    setCustomTitle]    = useState("")
  const [editingTitle,   setEditingTitle]   = useState(false)

  function toggleEquipment(k: EquipmentKey) {
    setEquipment(prev => {
      const next = new Set(prev)
      if (next.has(k)) next.delete(k); else next.add(k)
      return next
    })
  }

  async function handleGenerate() {
    setLoading(true)
    setSession(null)
    setVisible(false)
    setSavedId(null)
    setSaveError(null)
    setGenMode(null)
    try {
      const res  = await fetch("/api/generate", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          level,
          stroke,
          goal,
          durationMinutes:  DURATION_MINS[durationIdx],
          poolLength:        25,
          techFocus:         techFocus ?? undefined,
          intensity,
          includeWarmup,
          includeCooldown,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSaveError(data.error?.message ?? "Erreur lors de la génération.")
        return
      }
      const { mode, ...sessionData } = data
      setSession(sessionData as TrainingSession)
      setCustomTitle(sessionData.title)
      setEditingTitle(false)
      setGenMode(mode as GenerationMode)
      setTimeout(() => setVisible(true), 50)
    } catch {
      setSaveError("Erreur réseau — réessaie.")
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    if (!session || saving || savedId) return
    setSaving(true)
    setSaveError(null)
    try {
      const res  = await fetch("/api/sessions", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ ...session, title: customTitle }),
      })
      const data = await res.json()
      if (res.ok) setSavedId(data.id)
      else setSaveError(data.error?.message ?? "Erreur lors de la sauvegarde.")
    } catch {
      setSaveError("Erreur réseau.")
    } finally {
      setSaving(false)
    }
  }

  return {
    // form config
    level, setLevel,
    stroke, setStroke,
    goal, setGoal,
    durationIdx, setDurationIdx,
    equipment, toggleEquipment,
    techFocus, setTechFocus,
    intensity, setIntensity,
    includeWarmup, setIncludeWarmup,
    includeCooldown, setIncludeCooldown,
    accordionOpen, setAccordionOpen,
    // result
    loading, session, visible, genMode,
    // save
    savedId, saving, saveError, handleSave,
    customTitle, setCustomTitle,
    editingTitle, setEditingTitle,
    // export
    exportOpen, setExportOpen,
    // actions
    handleGenerate,
  }
}
