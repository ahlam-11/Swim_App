"use client"

import { useState, useEffect } from "react"
import type { TrainingSession } from "@/app/lib/types"
import type { GenerationMode } from "@/app/lib/hooks/useGenerateSession"
import { LEVEL_LABELS, STROKE_LABELS, formatDuration } from "./consts"
import SessionSetRow from "./SessionSetRow"

interface Props {
  session:       TrainingSession | null
  loading:       boolean
  visible:       boolean
  genMode:       GenerationMode | null
  savedId:       string | null
  saving:        boolean
  saveError:     string | null
  customTitle:   string
  editingTitle:  boolean
  setCustomTitle:  (t: string) => void
  setEditingTitle: (v: boolean) => void
  handleSave:      () => void
  handleGenerate:  () => void
  setExportOpen:   (v: boolean) => void
}

function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active || target === 0) { setValue(0); return } // eslint-disable-line react-hooks/set-state-in-effect
    const duration  = 600
    const startTime = performance.now()
    function tick(now: number) {
      const t    = Math.min((now - startTime) / duration, 1)
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
      setValue(Math.round(ease * target))
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, active])
  return value
}

const badgeStyle = (gray = false): React.CSSProperties => ({
  display: "inline-flex", alignItems: "center",
  padding: "4px 12px", borderRadius: 999,
  fontFamily: "var(--font-dm-sans)", fontSize: 12, fontWeight: 500,
  background: gray ? "#F3F4F6" : "var(--bleu-clair)",
  color: gray ? "var(--gris-doux)" : "var(--bleu-piscine)",
})

const actionBtnStyle: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 6,
  fontFamily: "var(--font-dm-sans)", fontSize: 13, color: "var(--gris-doux)",
  background: "none", border: "none", cursor: "pointer", padding: 0,
}

export default function SessionResultPanel(props: Props) {
  const { session, loading, visible, genMode, savedId, saving, saveError,
    customTitle, editingTitle, setCustomTitle, setEditingTitle,
    handleSave, handleGenerate, setExportOpen } = props

  const countUpValue = useCountUp(session?.totalDistance ?? 0, visible)

  if (loading) return (
    <div style={{ minHeight: 500, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid var(--ligne)", borderTopColor: "var(--bleu-piscine)", animation: "spin 0.8s linear infinite" }} />
      <p style={{ fontFamily: "var(--font-dm-sans)", fontStyle: "italic", fontSize: 16, color: "var(--gris-doux)" }}>Génération en cours…</p>
    </div>
  )

  if (!session) return (
    <div style={{ position: "relative", minHeight: 500, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", inset: 0, opacity: 0.12, pointerEvents: "none", padding: 32 }}>
        <div style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 24, color: "var(--encre)", marginBottom: 16 }}>Endurance Crawl — 1h00</div>
        <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
          <span style={badgeStyle()}>Débutant</span><span style={badgeStyle()}>Crawl</span>
        </div>
        <div style={{ borderTop: "1px solid var(--ligne)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 16 }}>
          {[{color:"#90CAF9",label:"Échauffement",content:"1×300m Crawl facile"},{color:"#0055A4",label:"Principal",content:"4×200m Crawl — 30s repos"}].map(({ color, label, content }) => (
            <div key={label} style={{ display: "flex", gap: 12 }}>
              <div style={{ width: 3, background: color, borderRadius: 2 }} />
              <div>
                <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9CA3AF", marginBottom: 8 }}>{label}</div>
                <div style={{ fontSize: 14, color: "var(--encre)" }}>{content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p style={{ position: "relative", zIndex: 2, fontFamily: "var(--font-dm-sans)", fontStyle: "italic", fontSize: 18, color: "var(--gris-doux)", textAlign: "center" }}>
        Ta séance générée apparaît ici.
      </p>
    </div>
  )

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid var(--ligne)" }}>
        {editingTitle ? (
          <input autoFocus value={customTitle} onChange={e => setCustomTitle(e.target.value)} onBlur={() => setEditingTitle(false)} onKeyDown={e => { if (e.key === "Enter" || e.key === "Escape") setEditingTitle(false) }} style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 700, fontSize: 32, color: "var(--encre)", marginBottom: 8, letterSpacing: "-0.01em", lineHeight: 1.15, border: "none", borderBottom: "2px solid var(--bleu-piscine)", outline: "none", background: "transparent", width: "100%", padding: 0 }} />
        ) : (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
            <h2 onClick={() => !savedId && setEditingTitle(true)} style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 700, fontSize: 32, color: "var(--encre)", letterSpacing: "-0.01em", lineHeight: 1.15, flex: 1, cursor: savedId ? "default" : "text" }}>{customTitle}</h2>
            {!savedId && (
              <button onClick={() => setEditingTitle(true)} aria-label="Renommer la séance" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--gris-doux)", padding: "8px 0", flexShrink: 0 }}>
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true"><path d="M9.5 1.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            )}
          </div>
        )}
        <p style={{ fontSize: 14, color: "var(--gris-doux)", marginBottom: 12, lineHeight: 1.5 }}>{session.subtitle}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          <span style={badgeStyle()}>{LEVEL_LABELS[session.level]}</span>
          <span style={badgeStyle()}>{STROKE_LABELS[session.stroke]}</span>
          <span style={badgeStyle(true)}>{formatDuration(session.estimatedDuration)}</span>
          {genMode === "ai" && <span style={{ ...badgeStyle(), background: "#EDE9FE", color: "#7C3AED", border: "1px solid #DDD6FE" }}>✦ IA</span>}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 12 }}>
          <button onClick={handleSave} disabled={saving || !!savedId} style={{ ...actionBtnStyle, color: savedId ? "#22C55E" : "var(--gris-doux)" }}>
            {savedId ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7l4 4 6-6" stroke="#22C55E" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg> : <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M11 8v3a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M8 2h4v4M6 8L12 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            {saving ? "Sauvegarde…" : savedId ? "Sauvegardée" : "Sauvegarder"}
          </button>
          {saveError && <span style={{ fontSize: 12, color: "#EF4444" }}>{saveError}</span>}
          <div style={{ width: 1, height: 14, background: "var(--ligne)" }} />
          <button onClick={() => setExportOpen(true)} style={actionBtnStyle}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1v8M4 6l3 3 3-3M2 10v1a1 1 0 001 1h8a1 1 0 001-1v-1" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Exporter
          </button>
          <div style={{ width: 1, height: 14, background: "var(--ligne)" }} />
          <button onClick={handleGenerate} style={actionBtnStyle}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7a5 5 0 015-5 5 5 0 013.54 1.46L12 5M12 7a5 5 0 01-5 5 5 5 0 01-3.54-1.46L2 9" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round"/><path d="M12 2v3H9M2 12v-3h3" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Régénérer
          </button>
        </div>
      </div>

      {session.sets.map((set, i) => <SessionSetRow key={set.id} set={set} index={i} visible={visible} />)}

      {/* Footer */}
      <div style={{ paddingTop: 24, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 700, fontSize: 40, color: "var(--encre)", letterSpacing: "-0.02em", lineHeight: 1 }}>{countUpValue.toLocaleString("fr-FR")} m</div>
          <div style={{ fontSize: 14, color: "var(--gris-doux)", marginTop: 4 }}>Distance totale estimée</div>
        </div>
        <button onClick={() => setExportOpen(true)} className="swim-btn-primary" style={{ whiteSpace: "nowrap" }}>Exporter vers ma montre</button>
      </div>
    </div>
  )
}
