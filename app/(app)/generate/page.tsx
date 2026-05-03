"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { generateMockSession } from "@/app/lib/services/mockGenerator";
import type { TrainingSession, Level, Goal, Stroke } from "@/app/lib/types";

type EquipmentKey = "planche" | "pullbuoy" | "palmes" | "plaquettes" | "elastique" | "tuba";

const DURATIONS     = ["30min", "45min", "1h00", "1h15", "1h30", "2h00"];
const DURATION_MINS = [30, 45, 60, 75, 90, 120];

const LEVEL_LABELS: Record<Level, string> = {
  debutant:      "Débutant",
  intermediaire: "Intermédiaire",
  avance:        "Avancé",
};

const GOAL_LABELS: Record<Goal, string> = {
  endurance:    "Endurance",
  technique:    "Technique",
  vitesse:      "Vitesse",
  recuperation: "Récupération",
};

const GOAL_DESCS: Record<Goal, string> = {
  endurance:    "Travail aérobie long",
  technique:    "Drills et correction",
  vitesse:      "Séries courtes intenses",
  recuperation: "Faible intensité",
};

const STROKE_LABELS: Record<string, string> = {
  crawl:    "Crawl",
  dos:      "Dos",
  brasse:   "Brasse",
  papillon: "Papillon",
  "4nages": "4 Nages",
};

const PHASE_COLORS: Record<string, string> = {
  warmup:   "#90CAF9",
  drills:   "#64B5F6",
  main:     "#0055A4",
  cooldown: "#BBDEFB",
};

const EQUIPMENT_ITEMS: { key: EquipmentKey; label: string }[] = [
  { key: "planche",    label: "Planche" },
  { key: "pullbuoy",   label: "Pull buoy" },
  { key: "palmes",     label: "Palmes" },
  { key: "plaquettes", label: "Plaquettes" },
  { key: "elastique",  label: "Élastique" },
  { key: "tuba",       label: "Tuba" },
];

function formatDuration(mins: number): string {
  if (mins < 60) return `${mins}min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h00` : `${h}h${String(m).padStart(2, "0")}`;
}

function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active || target === 0) { setValue(0); return; }
    const duration = 600;
    const startTime = performance.now();
    function tick(now: number) {
      const t = Math.min((now - startTime) / duration, 1);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      setValue(Math.round(ease * target));
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [target, active]);
  return value;
}

function ConfigLabel({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ display: "block", fontFamily: "var(--font-dm-sans)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gris-doux)", marginBottom: 16 }}>
      {children}
    </span>
  );
}

export default function GeneratePage() {
  const [level,         setLevel]         = useState<Level>("debutant");
  const [stroke,        setStroke]        = useState<Stroke>("crawl");
  const [goal,          setGoal]          = useState<Goal>("endurance");
  const [durationIdx,   setDurationIdx]   = useState(2);
  const [equipment,     setEquipment]     = useState<Set<EquipmentKey>>(new Set(["planche", "pullbuoy"]));
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [loading,       setLoading]       = useState(false);
  const [session,       setSession]       = useState<TrainingSession | null>(null);
  const [visible,       setVisible]       = useState(false);

  const countUpValue = useCountUp(session?.totalDistance ?? 0, visible);

  function toggleEquipment(k: EquipmentKey) {
    setEquipment(prev => {
      const next = new Set(prev);
      if (next.has(k)) next.delete(k); else next.add(k);
      return next;
    });
  }

  function handleGenerate() {
    setLoading(true);
    setSession(null);
    setVisible(false);
    setTimeout(() => {
      const data = generateMockSession({
        level,
        stroke,
        goal,
        durationMinutes: DURATION_MINS[durationIdx],
        poolLength: 25,
      });
      setSession(data);
      setLoading(false);
      setTimeout(() => setVisible(true), 50);
    }, 1200);
  }

  const sliderPct = (durationIdx / 5) * 100;

  const badgeStyle = (gray = false): React.CSSProperties => ({
    display: "inline-flex", alignItems: "center",
    padding: "4px 12px", borderRadius: 999,
    fontFamily: "var(--font-dm-sans)", fontSize: 12, fontWeight: 500,
    background: gray ? "#F3F4F6" : "var(--bleu-clair)",
    color: gray ? "var(--gris-doux)" : "var(--bleu-piscine)",
  });

  const actionBtnStyle: React.CSSProperties = {
    display: "flex", alignItems: "center", gap: 6,
    fontFamily: "var(--font-dm-sans)", fontSize: 13, color: "var(--gris-doux)",
    background: "none", border: "none", cursor: "pointer", padding: 0,
  };

  return (
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

        {/* ── LEFT — CONFIG ── */}
        <div>

          {/* NIVEAU */}
          <div style={{ paddingBottom: 28, borderBottom: "1px solid var(--ligne)" }}>
            <ConfigLabel>Niveau</ConfigLabel>
            <div style={{ display: "flex", gap: 24 }}>
              {(["debutant", "intermediaire", "avance"] as Level[]).map(l => (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  style={{
                    fontFamily: "var(--font-dm-sans)", fontWeight: 500, fontSize: 16,
                    color: level === l ? "var(--bleu-piscine)" : "var(--gris-doux)",
                    background: "none", border: "none", cursor: "pointer", padding: 0,
                    textDecoration: level === l ? "underline" : "none",
                    textDecorationColor: "var(--bleu-piscine)",
                    textUnderlineOffset: "3px",
                  }}
                >
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
                <button
                  key={s}
                  onClick={() => setStroke(s)}
                  className={`swim-chip${stroke === s ? " selected" : ""}`}
                >
                  {STROKE_LABELS[s]}
                </button>
              ))}
            </div>
          </div>

          {/* OBJECTIF */}
          <div style={{ padding: "28px 0", borderBottom: "1px solid var(--ligne)" }}>
            <ConfigLabel>Objectif</ConfigLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {(["endurance", "technique", "vitesse", "recuperation"] as Goal[]).map(g => {
                const checked = goal === g;
                return (
                  <div key={g} onClick={() => setGoal(g)} style={{ display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
                    <div style={{ width: 16, height: 16, minWidth: 16, borderRadius: "50%", border: `1.5px solid ${checked ? "var(--bleu-piscine)" : "var(--ligne)"}`, background: checked ? "var(--bleu-piscine)" : "var(--blanc)", display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 150ms, background 150ms" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: "white", opacity: checked ? 1 : 0, transition: "opacity 150ms" }} />
                    </div>
                    <span style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 500, fontSize: 16, color: "var(--encre)", flex: 1 }}>{GOAL_LABELS[g]}</span>
                    <span style={{ fontSize: 14, color: "var(--gris-doux)" }}>{GOAL_DESCS[g]}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DURÉE */}
          <div style={{ padding: "28px 0", borderBottom: "1px solid var(--ligne)" }}>
            <ConfigLabel>Durée</ConfigLabel>
            <div style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 700, fontSize: 32, color: "var(--encre)", marginBottom: 16, letterSpacing: "-0.01em" }}>
              {DURATIONS[durationIdx]}
            </div>
            <input
              type="range" min={0} max={5} step={1} value={durationIdx}
              onChange={e => setDurationIdx(Number(e.target.value))}
              style={{ background: `linear-gradient(to right, var(--bleu-piscine) ${sliderPct}%, var(--ligne) ${sliderPct}%)` }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              {["30'","45'","1h","1h15","1h30","2h"].map(t => (
                <span key={t} style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "var(--font-dm-sans)" }}>{t}</span>
              ))}
            </div>
          </div>

          {/* ÉQUIPEMENT */}
          <div style={{ padding: "28px 0", borderBottom: "1px solid var(--ligne)" }}>
            <ConfigLabel>Équipement disponible</ConfigLabel>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px 20px" }}>
              {EQUIPMENT_ITEMS.map(({ key, label }) => {
                const checked = equipment.has(key);
                return (
                  <div key={key} onClick={() => toggleEquipment(key)} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
                    <div style={{ width: 16, height: 16, minWidth: 16, border: `1.5px solid ${checked ? "var(--bleu-piscine)" : "var(--ligne)"}`, borderRadius: 3, background: checked ? "var(--bleu-piscine)" : "var(--blanc)", display: "flex", alignItems: "center", justifyContent: "center", transition: "border-color 150ms, background 150ms" }}>
                      {checked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                    </div>
                    <span style={{ fontSize: 14, color: "var(--encre)", fontFamily: "var(--font-dm-sans)" }}>{label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* OPTIONS AVANCÉES */}
          <div>
            <button
              onClick={() => setAccordionOpen(o => !o)}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", width: "100%", padding: "28px 0", background: "none", border: "none", textAlign: "left" }}
            >
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
                      <button key={f} className="swim-chip">{f}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <ConfigLabel>Intensité</ConfigLabel>
                  <div style={{ display: "flex", gap: 20 }}>
                    {[1,2,3,4,5].map(n => (
                      <button key={n} style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 500, fontSize: 16, color: n === 3 ? "var(--bleu-piscine)" : "var(--gris-doux)", background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: n === 3 ? "underline" : "none", textUnderlineOffset: "3px" }}>{n}</button>
                    ))}
                  </div>
                </div>
                {[["Échauffement", true], ["Retour au calme", true]].map(([label, on]) => (
                  <div key={label as string} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 15, color: "var(--encre)" }}>{label}</span>
                    <div style={{ width: 40, height: 22, borderRadius: 999, background: on ? "var(--bleu-piscine)" : "var(--ligne)", position: "relative", cursor: "pointer", transition: "background 200ms" }}>
                      <div style={{ position: "absolute", top: 3, width: 16, height: 16, borderRadius: "50%", background: "white", transition: "left 200ms ease", left: on ? 21 : 3 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* GENERATE BUTTON */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{ width: "100%", height: 52, fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 700, fontSize: 20, background: "var(--bleu-piscine)", color: "var(--blanc)", border: "none", borderRadius: 999, cursor: loading ? "not-allowed" : "pointer", transition: "background 200ms ease", marginTop: 32, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, opacity: loading ? 0.8 : 1 }}
          >
            {loading ? (
              <>
                <span>Génération en cours</span>
                <span style={{ display: "inline-flex", gap: 3 }}>
                  {[0,1,2].map(i => <span key={i} style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.6)", animation: "dotPulse 1.2s ease-in-out infinite", animationDelay: `${i * 0.2}s` }} />)}
                </span>
              </>
            ) : session ? "Régénérer" : "Générer ma séance"}
          </button>
        </div>

        {/* ── RIGHT — RESULT ── */}
        <div style={{ position: "sticky", top: 80 }}>

          {!session && !loading && (
            <div style={{ position: "relative", minHeight: 500, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ position: "absolute", inset: 0, opacity: 0.12, pointerEvents: "none", padding: 32 }}>
                <div style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontSize: 24, color: "var(--encre)", marginBottom: 16 }}>Endurance Crawl — 1h00</div>
                <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                  <span style={badgeStyle()}>Débutant</span>
                  <span style={badgeStyle()}>Crawl</span>
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
          )}

          {loading && (
            <div style={{ minHeight: 500, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 16 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", border: "2px solid var(--ligne)", borderTopColor: "var(--bleu-piscine)", animation: "spin 0.8s linear infinite" }} />
              <p style={{ fontFamily: "var(--font-dm-sans)", fontStyle: "italic", fontSize: 16, color: "var(--gris-doux)" }}>Génération en cours…</p>
            </div>
          )}

          {session && !loading && (
            <div>
              {/* Header */}
              <div style={{ marginBottom: 24, paddingBottom: 20, borderBottom: "1px solid var(--ligne)" }}>
                <h2 style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 700, fontSize: 32, color: "var(--encre)", marginBottom: 8, letterSpacing: "-0.01em", lineHeight: 1.15 }}>
                  {session.title}
                </h2>
                <p style={{ fontSize: 14, color: "var(--gris-doux)", marginBottom: 12, lineHeight: 1.5 }}>
                  {session.subtitle}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                  <span style={badgeStyle()}>{LEVEL_LABELS[session.level]}</span>
                  <span style={badgeStyle()}>{STROKE_LABELS[session.stroke]}</span>
                  <span style={badgeStyle(true)}>{formatDuration(session.estimatedDuration)}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 12 }}>
                  <button style={actionBtnStyle}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M11 8v3a1 1 0 01-1 1H3a1 1 0 01-1-1V5a1 1 0 011-1h3" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round"/><path d="M8 2h4v4M6 8L12 2" stroke="#6B7280" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Sauvegarder
                  </button>
                  <div style={{ width: 1, height: 14, background: "var(--ligne)" }} />
                  <button style={actionBtnStyle}>
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

              {/* Sets */}
              {session.sets.map((set, i) => (
                <div
                  key={set.id}
                  style={{ padding: "20px 0", borderBottom: "1px solid var(--ligne)", display: "flex", gap: 16, opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(8px)", transition: `opacity 300ms ease ${i * 60}ms, transform 300ms ease ${i * 60}ms` }}
                >
                  <div style={{ width: 3, borderRadius: 2, background: PHASE_COLORS[set.phase] ?? "#ccc", flexShrink: 0, minHeight: 60 }} />
                  <div style={{ flex: 1 }}>
                    <span style={{ display: "block", fontFamily: "var(--font-dm-sans)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gris-doux)", marginBottom: 12 }}>
                      {set.label}
                    </span>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 10 }}>
                      <thead>
                        <tr>
                          {["Rép.","Distance","Nage","Repos"].map(h => (
                            <th key={h} style={{ fontFamily: "var(--font-dm-sans)", fontSize: 11, letterSpacing: "0.06em", textTransform: "uppercase", color: "#9CA3AF", textAlign: "left", padding: "0 0 8px", borderBottom: "1px solid var(--ligne)", fontWeight: 400 }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ fontFamily: "var(--font-dm-sans)", fontSize: 13, color: "var(--gris-doux)", padding: "10px 0" }}>
                            {set.repetitions}×
                          </td>
                          <td style={{ fontFamily: "var(--font-dm-sans)", fontSize: 15, color: "var(--encre)", padding: "10px 0" }}>
                            {set.distance}m
                          </td>
                          <td style={{ fontFamily: "var(--font-dm-sans)", fontSize: 15, color: "var(--encre)", padding: "10px 0" }}>
                            {STROKE_LABELS[set.stroke] ?? set.stroke}
                          </td>
                          <td style={{ fontFamily: "var(--font-dm-sans)", fontSize: 15, color: "var(--encre)", padding: "10px 0" }}>
                            {set.restSeconds === 0 ? "—" : `${set.restSeconds}s`}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    {set.note && (
                      <p style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic", fontSize: 14, color: "var(--gris-doux)", lineHeight: 1.5, marginTop: 8 }}>
                        {set.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* Footer */}
              <div style={{ paddingTop: 24, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 700, fontSize: 40, color: "var(--encre)", letterSpacing: "-0.02em", lineHeight: 1 }}>
                    {countUpValue.toLocaleString("fr-FR")} m
                  </div>
                  <div style={{ fontSize: 14, color: "var(--gris-doux)", marginTop: 4 }}>Distance totale estimée</div>
                </div>
                <button className="swim-btn-primary" style={{ whiteSpace: "nowrap" }}>
                  Exporter vers ma montre
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
