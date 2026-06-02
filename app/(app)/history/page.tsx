"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { READY_SESSIONS } from "@/app/lib/data/sessions";
import type { ReadySession, TrainingSession, Level, Stroke } from "@/app/lib/types";
import ExportModal from "@/app/components/ExportModal";

// ─── Type séance sauvegardée (réponse API normalisée) ─────────────────────────

type SavedSession = Omit<TrainingSession, "generatedAt"> & {
  createdAt: string;
  generatedAt: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeSaved(raw: any): SavedSession {
  const fixStroke = (s: string) => s === "four_nages" ? "4nages" : s;
  return {
    id:                raw.id,
    title:             raw.title,
    subtitle:          raw.subtitle ?? "",
    level:             raw.level,
    stroke:            fixStroke(raw.stroke) as Stroke,
    goal:              raw.goal,
    totalDistance:     raw.totalDistance,
    estimatedDuration: raw.estimatedDuration,
    poolLength:        raw.poolLength as 25 | 50,
    createdAt:         raw.createdAt,
    generatedAt:       raw.createdAt,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sets:              (raw.sets ?? []).map((s: any) => ({
      id:          s.id,
      phase:       s.phase,
      label:       s.label,
      repetitions: s.repetitions,
      distance:    s.distance,
      stroke:      fixStroke(s.stroke),
      restSeconds: s.restSeconds,
      intensity:   s.intensity,
      equipment:   s.equipment ?? undefined,
      note:        s.note ?? undefined,
    })),
  };
}

function relativeDate(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return "Hier";
  if (days < 7)  return `Il y a ${days} jours`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "Il y a 1 semaine";
  if (weeks < 5)  return `Il y a ${weeks} semaines`;
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
}

// ─── Constantes d'affichage ───────────────────────────────────────────────────

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

// ─── Composant ────────────────────────────────────────────────────────────────

type ModalSession = ReadySession | SavedSession;
type SubTab = "mes-seances" | "bibliotheque";

export default function HistoryPage() {
  const [levelFilter,    setLevelFilter]    = useState<Level | "all">("all");
  const [strokeFilter,   setStrokeFilter]   = useState<Stroke | "all">("all");
  const [modal,          setModal]          = useState<ModalSession | null>(null);
  const [exportSession,  setExportSession]  = useState<ModalSession | null>(null);
  const [activeSubTab,   setActiveSubTab]   = useState<SubTab>("mes-seances");
  const [savedSessions,  setSavedSessions]  = useState<SavedSession[]>([]);
  const [loadingSaved,   setLoadingSaved]   = useState(true);

  useEffect(() => {
    fetch("/api/sessions?limit=100")
      .then(r => r.ok ? r.json() : { data: [] })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((res: { data: any[] } | any[]) => {
        const arr = Array.isArray(res) ? res : (res.data ?? [])
        setSavedSessions(arr.map(normalizeSaved))
      })
      .catch(() => {})
      .finally(() => setLoadingSaved(false));
  }, []);

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

  const subTabStyle = (active: boolean): React.CSSProperties => ({
    fontFamily: "var(--font-dm-sans)", fontWeight: 500, fontSize: 14,
    color: active ? "var(--encre)" : "var(--gris-doux)",
    background: active ? "var(--bleu-clair)" : "none",
    border: "none", cursor: "pointer",
    padding: "10px 16px", borderRadius: 8,
  });

  const exportSessionId = exportSession && "createdAt" in exportSession ? exportSession.id : undefined;

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

      {/* MAIN TABS */}
      <div className="page-tabs">
        <Link href="/generate" className="page-tab">Générer</Link>
        <Link href="/history"  className="page-tab active">Séances prêtes</Link>
      </div>

      {/* SUB-TABS */}
      <div style={{ padding: "16px clamp(20px,5vw,80px) 0", display: "flex", gap: 4, borderBottom: "1px solid var(--ligne)" }}>
        <button onClick={() => setActiveSubTab("mes-seances")} style={subTabStyle(activeSubTab === "mes-seances")}>
          Mes séances
          {savedSessions.length > 0 && (
            <span style={{ marginLeft: 6, background: "var(--bleu-piscine)", color: "white", borderRadius: 999, fontSize: 11, fontWeight: 600, padding: "1px 6px" }}>
              {savedSessions.length}
            </span>
          )}
        </button>
        <button onClick={() => setActiveSubTab("bibliotheque")} style={subTabStyle(activeSubTab === "bibliotheque")}>
          Bibliothèque
        </button>
      </div>

      {/* ── MES SÉANCES ── */}
      {activeSubTab === "mes-seances" && (
        <div style={{ padding: "48px clamp(20px,5vw,80px) 100px" }}>
          {loadingSaved ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 0", gap: 12 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", border: "2px solid var(--ligne)", borderTopColor: "var(--bleu-piscine)", animation: "spin 0.8s linear infinite" }} />
              <span style={{ fontFamily: "var(--font-dm-sans)", color: "var(--gris-doux)", fontSize: 15 }}>Chargement…</span>
            </div>
          ) : savedSessions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 0" }}>
              <p style={{ fontFamily: "var(--font-instrument-serif)", fontStyle: "italic", fontSize: 20, color: "var(--gris-doux)", marginBottom: 16 }}>
                Aucune séance sauvegardée pour l&apos;instant.
              </p>
              <Link href="/generate" style={{ fontFamily: "var(--font-dm-sans)", fontSize: 14, color: "var(--bleu-piscine)", textDecoration: "underline", textUnderlineOffset: 3 }}>
                Générer ma première séance →
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 380px), 1fr))", gap: 24 }}>
              {savedSessions.map(s => (
                <div
                  key={s.id}
                  style={{ background: "var(--blanc)", border: "1px solid var(--ligne)", borderRadius: 12, overflow: "hidden", display: "flex", flexDirection: "column", transition: "transform 250ms ease, box-shadow 250ms ease" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.07)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
                >
                  <div style={{ height: 4, background: STROKE_COLORS[s.stroke] ?? "#0055A4" }} />
                  <div style={{ padding: 24, flex: 1, display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12, gap: 8 }}>
                      <h3 style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 700, fontSize: 22, color: "var(--encre)", lineHeight: 1.2, letterSpacing: "-0.01em" }}>
                        {s.title}
                      </h3>
                      <span style={{ fontSize: 12, color: "var(--gris-doux)", fontFamily: "var(--font-dm-sans)", whiteSpace: "nowrap", marginTop: 4, flexShrink: 0 }}>
                        {relativeDate(s.createdAt)}
                      </span>
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                      <span style={badgeStyle()}>{LEVEL_MAP[s.level]}</span>
                      <span style={badgeStyle()}>{STROKE_MAP[s.stroke] ?? s.stroke}</span>
                      <span style={badgeStyle(true)}>{formatDuration(s.estimatedDuration)}</span>
                      <span style={badgeStyle(true)}>{s.totalDistance.toLocaleString("fr-FR")} m</span>
                    </div>
                    {s.subtitle && (
                      <p style={{ fontSize: 13, color: "var(--gris-doux)", lineHeight: 1.5, marginBottom: 20, flex: 1 }}>
                        {s.subtitle}
                      </p>
                    )}
                    <hr style={{ border: "none", borderTop: "1px solid var(--ligne)", marginBottom: 16, marginTop: "auto" }} />
                    <div style={{ display: "flex", gap: 10 }}>
                      <button onClick={() => setModal(s)} className="swim-btn-ghost" style={{ flex: 1, justifyContent: "center" }}>Voir la séance</button>
                      <button onClick={() => setExportSession(s)} className="swim-btn-primary" style={{ flex: 1, fontSize: 14, padding: "10px 16px" }}>Exporter</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── BIBLIOTHÈQUE ── */}
      {activeSubTab === "bibliotheque" && (
        <>
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
                    <button onClick={() => setExportSession(s)} className="swim-btn-primary" style={{ flex: 1, fontSize: 14, padding: "10px 16px" }}>Exporter</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* EXPORT MODAL */}
      {exportSession && (
        <ExportModal
          session={exportSession as unknown as TrainingSession}
          sessionId={exportSessionId}
          onClose={() => setExportSession(null)}
        />
      )}

      {/* DETAIL MODAL */}
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
              <span style={badgeStyle()}>{STROKE_MAP[modal.stroke] ?? modal.stroke}</span>
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
                    {PHASE_LABELS[set.phase] ?? set.phase}
                  </span>
                  <div style={{ fontFamily: "var(--font-dm-sans)", fontSize: 15, color: "var(--encre)", marginBottom: set.note || set.equipment ? 6 : 0 }}>
                    {set.repetitions}× {set.distance}m — {STROKE_MAP[set.stroke as Stroke] ?? set.stroke}
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
              <button onClick={() => { setExportSession(modal); setModal(null); }} className="swim-btn-primary">
                Exporter vers ma montre
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
