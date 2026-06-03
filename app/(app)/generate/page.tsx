"use client"

import Link from "next/link"
import ExportModal from "@/app/components/ExportModal"
import SessionConfigPanel from "@/app/components/generate/SessionConfigPanel"
import SessionResultPanel from "@/app/components/generate/SessionResultPanel"
import { useGenerateSession } from "@/app/lib/hooks/useGenerateSession"

export default function GeneratePage() {
  const {
    level, setLevel, stroke, setStroke, goal, setGoal,
    durationIdx, setDurationIdx, equipment, toggleEquipment,
    techFocus, setTechFocus, intensity, setIntensity,
    includeWarmup, setIncludeWarmup, includeCooldown, setIncludeCooldown,
    accordionOpen, setAccordionOpen,
    loading, session, visible, genMode,
    savedId, saving, saveError, handleSave,
    customTitle, setCustomTitle, editingTitle, setEditingTitle,
    exportOpen, setExportOpen,
    handleGenerate,
  } = useGenerateSession()

  return (
    <>
      <div style={{ background: "var(--blanc)", minHeight: "100vh" }}>

        {/* PAGE HEADER */}
        <div style={{ padding: "60px clamp(20px,5vw,80px) 0" }}>
          <span style={{ display: "block", fontFamily: "var(--font-dm-sans)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gris-doux)", marginBottom: 12 }}>
            Générateur
          </span>
          <h1 style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(36px,5vw,52px)", color: "var(--encre)", letterSpacing: "-0.02em", lineHeight: 1.05, marginBottom: 12 }}>
            Configure ta séance
          </h1>
          <p style={{ fontSize: 18, color: "var(--gris-doux)", lineHeight: 1.6, marginBottom: 40 }}>
            Adapte chaque paramètre à ce que tu veux travailler.
          </p>
        </div>

        {/* TABS */}
        <div className="page-tabs">
          <Link href="/generate" className="page-tab active">Générer</Link>
          <Link href="/history"  className="page-tab">Séances prêtes</Link>
        </div>

        {/* MAIN GRID */}
        <div
          className="generator-grid"
          style={{ display: "grid", gridTemplateColumns: "44fr 56fr", gap: "clamp(40px,6vw,80px)", padding: "60px clamp(20px,5vw,80px)", alignItems: "start" }}
        >
          <SessionConfigPanel
            level={level} setLevel={setLevel}
            stroke={stroke} setStroke={setStroke}
            goal={goal} setGoal={setGoal}
            durationIdx={durationIdx} setDurationIdx={setDurationIdx}
            equipment={equipment} toggleEquipment={toggleEquipment}
            techFocus={techFocus} setTechFocus={setTechFocus}
            intensity={intensity} setIntensity={setIntensity}
            includeWarmup={includeWarmup} setIncludeWarmup={setIncludeWarmup}
            includeCooldown={includeCooldown} setIncludeCooldown={setIncludeCooldown}
            accordionOpen={accordionOpen} setAccordionOpen={setAccordionOpen}
            loading={loading} session={session}
            handleGenerate={handleGenerate}
          />

          <div style={{ position: "sticky", top: 80 }}>
            <SessionResultPanel
              session={session} loading={loading} visible={visible} genMode={genMode}
              savedId={savedId} saving={saving} saveError={saveError}
              customTitle={customTitle} editingTitle={editingTitle}
              setCustomTitle={setCustomTitle} setEditingTitle={setEditingTitle}
              handleSave={handleSave} handleGenerate={handleGenerate}
              setExportOpen={setExportOpen}
            />
          </div>
        </div>

      </div>

      {exportOpen && session && (
        <ExportModal session={session} sessionId={savedId ?? undefined} onClose={() => setExportOpen(false)} />
      )}
    </>
  )
}
