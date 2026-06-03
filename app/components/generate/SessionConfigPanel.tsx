import type { Level, Goal, Stroke } from "@/app/lib/types"
import type { EquipmentKey } from "@/app/lib/hooks/useGenerateSession"
import type { TrainingSession } from "@/app/lib/types"
import { DURATIONS, LEVEL_LABELS, GOAL_LABELS, GOAL_DESCS, EQUIPMENT_ITEMS } from "./consts"

interface Props {
  level: Level;           setLevel: (l: Level) => void
  stroke: Stroke;         setStroke: (s: Stroke) => void
  goal: Goal;             setGoal: (g: Goal) => void
  durationIdx: number;    setDurationIdx: (i: number) => void
  equipment: Set<EquipmentKey>; toggleEquipment: (k: EquipmentKey) => void
  techFocus: string | null; setTechFocus: (f: string | null) => void
  intensity: number;      setIntensity: (n: number) => void
  includeWarmup: boolean; setIncludeWarmup: (v: boolean) => void
  includeCooldown: boolean; setIncludeCooldown: (v: boolean) => void
  accordionOpen: boolean; setAccordionOpen: (fn: (prev: boolean) => boolean) => void
  loading: boolean;       session: TrainingSession | null
  handleGenerate: () => void
}

function ConfigLabel({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ display: "block", fontFamily: "var(--font-dm-sans)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gris-doux)", marginBottom: 16 }}>
      {children}
    </span>
  )
}

export default function SessionConfigPanel(props: Props) {
  const { level, setLevel, stroke, setStroke, goal, setGoal, durationIdx, setDurationIdx,
    equipment, toggleEquipment, techFocus, setTechFocus, intensity, setIntensity,
    includeWarmup, setIncludeWarmup, includeCooldown, setIncludeCooldown,
    accordionOpen, setAccordionOpen, loading, session, handleGenerate } = props

  const sliderPct = (durationIdx / 5) * 100

  return (
    <div>
      {/* NIVEAU */}
      <div style={{ paddingBottom: 28, borderBottom: "1px solid var(--ligne)" }}>
        <ConfigLabel>Niveau</ConfigLabel>
        <div style={{ display: "flex", gap: 24 }}>
          {(["debutant", "intermediaire", "avance"] as Level[]).map(l => (
            <button key={l} onClick={() => setLevel(l)} style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 500, fontSize: 16, color: level === l ? "var(--bleu-piscine)" : "var(--gris-doux)", background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: level === l ? "underline" : "none", textDecorationColor: "var(--bleu-piscine)", textUnderlineOffset: "3px" }}>
              {LEVEL_LABELS[l]}
            </button>
          ))}
        </div>
      </div>

      {/* NAGE */}
      <div style={{ padding: "28px 0", borderBottom: "1px solid var(--ligne)" }}>
        <ConfigLabel>Nage à travailler</ConfigLabel>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {(["crawl","dos","brasse","papillon","4nages"] as Stroke[]).map(s => (
            <button key={s} onClick={() => setStroke(s)} className={`swim-chip${stroke === s ? " selected" : ""}`}>
              {s === "4nages" ? "4 Nages" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* OBJECTIF */}
      <div style={{ padding: "28px 0", borderBottom: "1px solid var(--ligne)" }}>
        <ConfigLabel>Objectif</ConfigLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {(["endurance", "technique", "vitesse", "recuperation"] as Goal[]).map(g => (
            <div key={g} onClick={() => setGoal(g)} style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
              <div style={{ width: 16, height: 16, minWidth: 16, borderRadius: "50%", border: `1.5px solid ${goal === g ? "var(--bleu-piscine)" : "var(--ligne)"}`, background: goal === g ? "var(--bleu-piscine)" : "var(--blanc)", display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 150ms, background 150ms" }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "white", opacity: goal === g ? 1 : 0, transition: "opacity 150ms" }} />
              </div>
              <span style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 500, fontSize: 16, color: "var(--encre)", flex: 1 }}>{GOAL_LABELS[g]}</span>
              <span style={{ fontSize: 14, color: "var(--gris-doux)" }}>{GOAL_DESCS[g]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* DURÉE */}
      <div style={{ padding: "28px 0", borderBottom: "1px solid var(--ligne)" }}>
        <ConfigLabel>Durée</ConfigLabel>
        <div style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 700, fontSize: 32, color: "var(--encre)", marginBottom: 16, letterSpacing: "-0.01em" }}>{DURATIONS[durationIdx]}</div>
        <input type="range" min={0} max={5} step={1} value={durationIdx} onChange={e => setDurationIdx(Number(e.target.value))} style={{ background: `linear-gradient(to right, var(--bleu-piscine) ${sliderPct}%, var(--ligne) ${sliderPct}%)` }} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          {["30'","45'","1h","1h15","1h30","2h"].map(t => <span key={t} style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "var(--font-dm-sans)" }}>{t}</span>)}
        </div>
      </div>

      {/* ÉQUIPEMENT */}
      <div style={{ padding: "28px 0", borderBottom: "1px solid var(--ligne)" }}>
        <ConfigLabel>Équipement disponible</ConfigLabel>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px 20px" }}>
          {EQUIPMENT_ITEMS.map(({ key, label }) => (
            <div key={key} onClick={() => toggleEquipment(key)} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
              <div style={{ width: 16, height: 16, minWidth: 16, border: `1.5px solid ${equipment.has(key) ? "var(--bleu-piscine)" : "var(--ligne)"}`, borderRadius: 3, background: equipment.has(key) ? "var(--bleu-piscine)" : "var(--blanc)", display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 150ms, background 150ms" }}>
                {equipment.has(key) && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <span style={{ fontSize: 14, color: "var(--encre)", fontFamily: "var(--font-dm-sans)" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* OPTIONS AVANCÉES */}
      <div>
        <button onClick={() => setAccordionOpen(o => !o)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", width: "100%", padding: "28px 0", background: "none", border: "none", textAlign: "left" }}>
          <span style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 500, fontSize: 15, color: "var(--encre)" }}>Options avancées</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transition: "transform 250ms ease", transform: accordionOpen ? "rotate(180deg)" : "none", flexShrink: 0 }}>
            <path d="M4 6L8 10L12 6" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div style={{ overflow: "hidden", maxHeight: accordionOpen ? 400 : 0, opacity: accordionOpen ? 1 : 0, transition: "max-height 300ms ease, opacity 300ms ease" }}>
          <div style={{ paddingBottom: 20, display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <ConfigLabel>Focus technique</ConfigLabel>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["Bras","Jambes","Respiration","Virage"].map(f => (
                  <button key={f} onClick={() => setTechFocus(f === techFocus ? null : f)} className={`swim-chip${techFocus === f ? " selected" : ""}`}>{f}</button>
                ))}
              </div>
            </div>
            <div>
              <ConfigLabel>Intensité</ConfigLabel>
              <div style={{ display: "flex", gap: 20 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setIntensity(n)} style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 500, fontSize: 16, color: n === intensity ? "var(--bleu-piscine)" : "var(--gris-doux)", background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: n === intensity ? "underline" : "none", textUnderlineOffset: "3px" }}>{n}</button>
                ))}
              </div>
            </div>
            {([["Échauffement", includeWarmup, setIncludeWarmup], ["Retour au calme", includeCooldown, setIncludeCooldown]] as [string, boolean, (v: boolean) => void][]).map(([label, on, toggle]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 15, color: "var(--encre)" }}>{label}</span>
                <div onClick={() => toggle(!on)} style={{ width: 40, height: 22, borderRadius: 999, background: on ? "var(--bleu-piscine)" : "var(--ligne)", position: "relative", cursor: "pointer", transition: "background 200ms" }}>
                  <div style={{ position: "absolute", top: 3, width: 16, height: 16, borderRadius: "50%", background: "white", transition: "left 200ms ease", left: on ? 21 : 3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* GENERATE */}
      <button onClick={handleGenerate} disabled={loading} style={{ width: "100%", height: 52, fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 700, fontSize: 20, background: "var(--bleu-piscine)", color: "var(--blanc)", border: "none", borderRadius: 999, cursor: loading ? "not-allowed" : "pointer", transition: "background 200ms ease", marginTop: 32, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading ? 0.8 : 1 }}>
        {loading ? (
          <><span>Génération en cours</span><span style={{ display: "inline-flex", gap: 3 }}>{[0,1,2].map(i => <span key={i} style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.6)", animation: "dotPulse 1.2s ease-in-out infinite", animationDelay: `${i * 0.2}s` }} />)}</span></>
        ) : session ? "Régénérer" : "Générer ma séance"}
      </button>
    </div>
  )
}
