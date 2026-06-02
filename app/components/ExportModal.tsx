"use client";

import { useState } from "react";
import type { ReadySession, TrainingSession } from "@/app/lib/types";
import { exportToPDF, exportToGarmin, exportToCoros } from "@/app/lib/services/exportService";

type ExportSession = ReadySession | TrainingSession;

interface Props {
  session:    ExportSession;
  sessionId?: string;
  onClose:    () => void;
}

interface Option {
  id: "pdf" | "garmin" | "coros";
  label: string;
  description: string;
  ext: string;
  icon: React.ReactNode;
}

const OPTIONS: Option[] = [
  {
    id: "pdf",
    label: "PDF",
    description: "Fiche imprimable de la séance, parfaite pour le bord du bassin.",
    ext: ".pdf",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="2" width="12" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M8 7h6M8 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M14 2v4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 14v5M13 16l3 3 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: "garmin",
    label: "Garmin",
    description: "Fichier .tcx à importer dans Garmin Connect → Entraînements → Importer.",
    ext: ".tcx",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "coros",
    label: "COROS",
    description: "Fichier .fit natif : training.coros.com → Training → Workouts → Import → sync montre via l'app COROS.",
    ext: ".fit",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M18 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 6h-5a3 3 0 00-3 3v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

const COROS_STEPS = [
  "Va sur training.coros.com et connecte-toi",
  "Clique sur Training → Workouts → Import",
  "Sélectionne le fichier .fit téléchargé",
  "Ouvre l'app COROS sur ton téléphone — la séance sync automatiquement sur ta montre",
];

export default function ExportModal({ session, sessionId, onClose }: Props) {
  const [loading, setLoading]           = useState<Option["id"] | null>(null);
  const [done, setDone]                 = useState<Option["id"] | null>(null);
  const [showCorosGuide, setCorosGuide] = useState(false);

  async function handleExport(id: Option["id"]) {
    setLoading(id);
    try {
      if (id === "pdf")    await exportToPDF(session);
      if (id === "garmin") exportToGarmin(session);
      if (id === "coros")  { exportToCoros(session); setCorosGuide(true); }

      if (sessionId && id !== "pdf") {
        await fetch(`/api/sessions/${sessionId}/log`, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ exportTarget: id }),
        });
      }

      setDone(id);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 300,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}
    >
      <div style={{
        background: "var(--blanc)", borderRadius: 16, width: "100%", maxWidth: 480,
        padding: 32, position: "relative",
      }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: 16, right: 16, background: "none", border: "none",
            cursor: "pointer", color: "var(--gris-doux)", fontSize: 18, lineHeight: 1,
          }}
        >
          ✕
        </button>

        <h2 style={{
          fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 700,
          fontSize: 22, color: "var(--encre)", marginBottom: 6,
        }}>
          Exporter la séance
        </h2>
        <p style={{ fontSize: 13, color: "var(--gris-doux)", marginBottom: 24 }}>
          {session.title} · {session.totalDistance.toLocaleString("fr-FR")} m
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {OPTIONS.map(opt => {
            const isLoading = loading === opt.id;
            const isDone    = done    === opt.id;

            return (
              <button
                key={opt.id}
                onClick={() => handleExport(opt.id)}
                disabled={isLoading}
                style={{
                  display: "flex", alignItems: "center", gap: 16, padding: "16px 20px",
                  border: `1.5px solid ${isDone ? "#22C55E" : "var(--ligne)"}`,
                  borderRadius: 12, background: isDone ? "#F0FDF4" : "var(--blanc)",
                  cursor: isLoading ? "wait" : "pointer", textAlign: "left",
                  transition: "border-color 200ms, background 200ms",
                  opacity: isLoading ? 0.7 : 1,
                }}
                onMouseEnter={e => {
                  if (!isDone) (e.currentTarget as HTMLElement).style.borderColor = "var(--bleu-piscine)";
                }}
                onMouseLeave={e => {
                  if (!isDone) (e.currentTarget as HTMLElement).style.borderColor = "var(--ligne)";
                }}
              >
                <span style={{ color: isDone ? "#22C55E" : "var(--bleu-piscine)", flexShrink: 0 }}>
                  {isDone
                    ? <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    : opt.icon
                  }
                </span>
                <span style={{ flex: 1 }}>
                  <span style={{
                    display: "block", fontFamily: "var(--font-dm-sans)", fontWeight: 600,
                    fontSize: 14, color: "var(--encre)", marginBottom: 2,
                  }}>
                    {isLoading ? "Génération en cours…" : isDone ? "Téléchargement lancé" : opt.label}
                    {!isLoading && !isDone && (
                      <span style={{ marginLeft: 8, fontSize: 11, color: "var(--gris-doux)", fontWeight: 400 }}>
                        {opt.ext}
                      </span>
                    )}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--gris-doux)", lineHeight: 1.4 }}>
                    {opt.description}
                  </span>
                </span>
              </button>
            );
          })}

          {/* Guide d'import COROS — toggle manuel ou auto après export */}
          <button
            onClick={() => setCorosGuide(v => !v)}
            style={{
              alignSelf: "flex-start", background: "none", border: "none",
              cursor: "pointer", padding: "2px 0", display: "flex", alignItems: "center", gap: 4,
            }}
          >
            <span style={{
              fontSize: 11, color: "var(--bleu-piscine)", fontWeight: 500,
              textDecoration: "underline", textUnderlineOffset: 2,
            }}>
              {showCorosGuide ? "▾" : "▸"} Comment importer sur ma montre COROS ?
            </span>
          </button>

          {showCorosGuide && (
            <div style={{
              padding: "14px 16px", background: "#F0F7FF",
              borderRadius: 10, border: "1px solid #BDD7F5",
            }}>
              <p style={{
                fontSize: 12, fontWeight: 600, color: "var(--bleu-piscine)",
                marginBottom: 10,
              }}>
                4 étapes pour mettre la séance sur ta montre
              </p>
              {COROS_STEPS.map((step, i) => (
                <div key={i} style={{
                  display: "flex", gap: 10, marginBottom: i < COROS_STEPS.length - 1 ? 8 : 0,
                }}>
                  <span style={{
                    width: 20, height: 20, borderRadius: "50%",
                    background: "var(--bleu-piscine)", color: "white",
                    fontSize: 11, fontWeight: 700, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {i + 1}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--encre)", lineHeight: 1.5 }}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
