"use client";

import { useState } from "react";
import Link from "next/link";
import { READY_SESSIONS } from "@/app/lib/data/sessions";
import type { ReadySession, Level, Stroke } from "@/app/lib/types";

const LEVEL_MAP: Record<Level, string> = {
  debutant:      "Débutant",
  intermediaire: "Intermédiaire",
  avance:        "Avancé",
};

const STROKE_MAP: Record<Stroke, string> = {
  crawl:    "Crawl",
  dos:      "Dos",
  brasse:   "Brasse",
  papillon: "Papillon",
  "4nages": "4 Nages",
};

const STROKE_COLORS: Record<Stroke, string> = {
  crawl:    "#0055A4",
  dos:      "#4DB6AC",
  brasse:   "#64B5F6",
  papillon: "#F48FB1",
  "4nages": "#B39DDB",
};

const PHASE_COLORS: Record<string, string> = {
  warmup:   "#90CAF9",
  drills:   "#64B5F6",
  main:     "#0055A4",
  cooldown: "#BBDEFB",
};

const PHASE_LABELS: Record<string, string> = {
  warmup:   "Échauffement",
  drills:   "Drills",
  main:     "Principal",
  cooldown: "Retour au calme",
};

function formatDuration(mins: number): string {
  if (mins < 60) return `${mins}min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h00` : `${h}h${String(m).padStart(2, "0")}`;
}

function getPreview(session: ReadySession): string[] {
  const order = ["warmup", "drills", "main", "cooldown"] as const;
  const shortLabels: Record<string, string> = {
    warmup:   "Échauff.",
    drills:   "Drills",
    main:     "Principal",
    cooldown: "RC",
  };
  return order
    .map(phase => {
      const phaseSets = session.sets.filter(s => s.phase === phase);
      if (phaseSets.length === 0) return null;
      const total = phaseSets.reduce((sum, s) => sum + s.repetitions * s.distance, 0);
      return `${shortLabels[phase]} ${total}m`;
    })
    .filter(Boolean)
    .slice(0, 3) as string[];
}

export default function HistoryPage() {
  const [levelFilter, setLevelFilter] = useState<Level | "all">("all");
  const [strokeFilter, setStrokeFilter] = useState<Stroke | "all">("all");
  const [modal, setModal] = useState<ReadySession | null>(null);

  const filtered = READY_SESSIONS.filter(s => {
    const lm = levelFilter  === "all" || s.level  === levelFilter;
    const sm = strokeFilter === "all" || s.stroke === strokeFilter;
    return lm && sm;
  });

  const badgeStyle = (gray = false): React.CSSProperties => ({
    display: "inline-flex", alignItems: "center", padding: "4px 12px",
    borderRadius: 999, fontFamily: "var(--font-dm-sans)", fontSize: 12, fontWeight: 500,
    background: gray ? "#F3F4F6" : "var(--bleu-clair)",
    color: gray ? "var(--gris-doux)" : "var(--bleu-piscine)",
  });

  return (
    <div style={{ background: "var(--blanc)", minHeight: "100vh" }}>

      {/* PAGE HEADER */}
      <div style={{ padding: "60px clamp(20px,5vw,80px) 0" }}>
        <span style={{ display: "block", fontFamily: "var(--font-dm-sans)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gris-doux)", marginBottom: 12 }}>
          Séances
        </span>
        <h1 style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(36px,5vw,52px)", color: "var(--encre)", letterSpacing: "-0.02em", lineHeight: 1.05, marginBottom: 12 }}>
          Séances prêtes à nager
        </h1>
        <p style={{ fontSize: 18, color: "var(--gris-doux)", lineHeight: 1.6, marginBottom: 40 }}>
          Aucune configuration. Tu choisis, tu exportes, tu nages.
        </p>
      </div>

      {/* TABS */}
      <div className="page-tabs">
        <Link href="/generate" className="page-tab">Générer</Link>
        <Link href="/history"  className="page-tab active">Séances prêtes</Link>
      </div>

      {/* FILTER BAR */}
      <div style={{ padding: "24px clamp(20px,5vw,80px)", borderBottom: "1px solid var(--ligne)", display: "flex", flexDirection: "column", gap: 12, background: "var(--blanc)" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {([["all","Tous"], ["debutant","Débutant"], ["intermediaire","Intermédiaire"], ["avance","Avancé"]] as [Level | "all", string][]).map(([v, label]) => (
            <button key={v} onClick={() => setLevelFilter(v)} className={`swim-chip${levelFilter === v ? " selected" : ""}`}>{label}</button>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {([["all","Toutes"], ["crawl","Crawl"], ["dos","Dos"], ["brasse","Brasse"], ["papillon","Papillon"], ["4nages","4 Nages"]] as [Stroke | "all", string][]).map(([v, label]) => (
            <button key={v} onClick={() => setStrokeFilter(v)} className={`swim-chip${strokeFilter === v ? " selected" : ""}`}>{label}</button>
          ))}
        </div>
      </div>

      {/* SESSIONS GRID */}
      <div style={{ padding: "48px clamp(20px,5vw,80px) 100px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 380px), 1fr))", gap: 24 }}>
        {filtered.length === 0 ? (
          <p style={{ gridColumn: "1/-1", textAlign: "center", padding: "80px 0", fontFamily: "var(--font-instrument-serif)", fontStyle: "italic", fontSize: 20, color: "var(--gris-doux)" }}>
            Aucune séance ne correspond à ce filtre.
          </p>
        ) : filtered.map(s => (
          <div
            key={s.id}
            style={{ background: "var(--blanc)", border: "1px solid var(--ligne)", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column", transition: "transform 250ms ease, box-shadow 250ms ease", cursor: "default" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.07)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
          >
            <div style={{ height: 4, background: STROKE_COLORS[s.stroke] }} />
            <div style={{ padding: 24, flex: 1, display: "flex", flexDirection: "column" }}>
              <h3 style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 700, fontSize: 22, color: "var(--encre)", marginBottom: 12, lineHeight: 1.2, letterSpacing: "-0.01em" }}>
                {s.title}
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                <span style={badgeStyle()}>{LEVEL_MAP[s.level]}</span>
                <span style={badgeStyle()}>{STROKE_MAP[s.stroke]}</span>
                <span style={badgeStyle(true)}>{formatDuration(s.estimatedDuration)}</span>
                <span style={badgeStyle(true)}>{s.totalDistance.toLocaleString("fr-FR")} m</span>
              </div>
              <p style={{ fontSize: 14, color: "var(--gris-doux)", lineHeight: 1.6, marginBottom: 20, flex: 1 }}>
                {getPreview(s).map((p, i, arr) => (
                  <span key={p}>{p}{i < arr.length - 1 && <span style={{ margin: "0 6px", color: "#C4C4C4" }}>·</span>}</span>
                ))}
              </p>
              <hr style={{ border: "none", borderTop: "1px solid var(--ligne)", marginBottom: 16 }} />
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setModal(s)} className="swim-btn-ghost" style={{ flex: 1, justifyContent: "center" }}>Voir la séance</button>
                <button className="swim-btn-primary" style={{ flex: 1, fontSize: 14, padding: "10px 16px" }}>Exporter</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {modal && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setModal(null); }}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}
        >
          <div style={{ background: "var(--blanc)", borderRadius: 16, maxWidth: 600, width: "100%", maxHeight: "80vh", overflowY: "auto", padding: 40, position: "relative" }}>
            <button
              onClick={() => setModal(null)}
              style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", cursor: "pointer", color: "var(--gris-doux)", fontSize: 20, lineHeight: 1 }}
            >
              ✕
            </button>
            <h2 style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 700, fontSize: 28, color: "var(--encre)", marginBottom: 16 }}>
              {modal.title}
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
              <span style={badgeStyle()}>{LEVEL_MAP[modal.level]}</span>
              <span style={badgeStyle()}>{STROKE_MAP[modal.stroke]}</span>
              <span style={badgeStyle(true)}>{formatDuration(modal.estimatedDuration)}</span>
            </div>

            {modal.sets.map((set, i) => (
              <div
                key={set.id}
                style={{ padding: "16px 0", borderBottom: i < modal.sets.length - 1 ? "1px solid var(--ligne)" : "none", display: "flex", gap: 14 }}
              >
                <div style={{ width: 3, borderRadius: 2, background: PHASE_COLORS[set.phase] ?? "#ccc", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <span style={{ display: "block", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gris-doux)", marginBottom: 6 }}>
                    {PHASE_LABELS[set.phase]}
                  </span>
                  <div style={{ fontFamily: "var(--font-dm-sans)", fontSize: 15, color: "var(--encre)", marginBottom: set.note || set.equipment ? 6 : 0 }}>
                    {set.repetitions}× {set.distance}m — {set.stroke}
                    {set.restSeconds > 0 && <span style={{ color: "var(--gris-doux)", fontSize: 13 }}> · {set.restSeconds}s repos</span>}
                  </div>
                  {set.equipment && (
                    <div style={{ fontSize: 12, color: "var(--bleu-piscine)", fontFamily: "var(--font-dm-sans)", marginBottom: 4 }}>
                      {set.equipment}
                    </div>
                  )}
                  {set.note && (
                    <p style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic", fontSize: 14, color: "var(--gris-doux)", lineHeight: 1.5, margin: 0 }}>
                      {set.note}
                    </p>
                  )}
                </div>
              </div>
            ))}

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--ligne)", gap: 16, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 700, fontSize: 36, color: "var(--encre)" }}>
                  {modal.totalDistance.toLocaleString("fr-FR")} m
                </div>
                <div style={{ fontSize: 13, color: "var(--gris-doux)", marginTop: 4 }}>
                  Distance totale · {formatDuration(modal.estimatedDuration)}
                </div>
              </div>
              <button className="swim-btn-primary">Exporter vers ma montre</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
