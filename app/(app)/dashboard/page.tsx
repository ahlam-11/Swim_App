"use client";

import { USER_STATS } from "@/app/lib/data/stats";
import { MOCK_HISTORY } from "@/app/lib/data/mockHistory";

const STROKE_LABELS: Record<string, string> = {
  crawl:    "Crawl",
  dos:      "Dos",
  brasse:   "Brasse",
  papillon: "Papillon",
  "4nages": "4 Nages",
};

const STROKE_COLORS: Record<string, string> = {
  crawl:    "#0055A4",
  dos:      "#4DB6AC",
  brasse:   "#64B5F6",
  papillon: "#F48FB1",
  "4nages": "#B39DDB",
};

const LEVEL_LABELS: Record<string, string> = {
  debutant:      "Débutant",
  intermediaire: "Intermédiaire",
  avance:        "Avancé",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function formatDuration(mins: number): string {
  if (mins < 60) return `${mins}min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h}h00` : `${h}h${String(m).padStart(2, "0")}`;
}

const recentSessions = [...MOCK_HISTORY]
  .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
  .slice(0, 5);

const maxMonthDistance = Math.max(...USER_STATS.distanceByMonth.map(m => m.distance));
const totalStrokeDistance = Object.values(USER_STATS.distanceByStroke).reduce((s, v) => s + v, 0);
const strokeEntries = Object.entries(USER_STATS.distanceByStroke).sort((a, b) => b[1] - a[1]);

export default function DashboardPage() {
  return (
    <div style={{ background: "var(--blanc)", minHeight: "100vh" }}>

      {/* PAGE HEADER */}
      <div style={{ padding: "60px clamp(20px,5vw,80px) 40px" }}>
        <span style={{ display: "block", fontFamily: "var(--font-dm-sans)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gris-doux)", marginBottom: 12 }}>
          Tableau de bord
        </span>
        <h1 style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(36px,5vw,52px)", color: "var(--encre)", letterSpacing: "-0.02em", lineHeight: 1.05, marginBottom: 8 }}>
          Bienvenue.
        </h1>
        <p style={{ fontSize: 18, color: "var(--gris-doux)", lineHeight: 1.6 }}>
          {USER_STATS.totalSessions} séances · {(USER_STATS.totalDistance / 1000).toFixed(1)} km nagés · streak de {USER_STATS.currentStreak} semaines
        </p>
      </div>

      <div style={{ padding: "0 clamp(20px,5vw,80px) 100px", display: "flex", flexDirection: "column", gap: 60 }}>

        {/* ── STATS CARDS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
          {[
            { label: "Distance totale",  value: `${(USER_STATS.totalDistance / 1000).toFixed(1)} km`, sub: `${USER_STATS.totalDistance.toLocaleString("fr-FR")} m` },
            { label: "Séances",          value: USER_STATS.totalSessions,                              sub: `${USER_STATS.sessionsCompleted} complétées` },
            { label: "Temps à l'eau",    value: formatDuration(USER_STATS.totalDuration),              sub: `${USER_STATS.totalDuration} minutes` },
            { label: "Streak",           value: `${USER_STATS.currentStreak} sem.`,                   sub: "consécutives avec 1+ séance" },
            { label: "Nage favorite",    value: STROKE_LABELS[USER_STATS.favoriteStroke] ?? USER_STATS.favoriteStroke, sub: `${USER_STATS.exportsCount} exports montre` },
          ].map(card => (
            <div key={card.label} style={{ border: "1px solid var(--ligne)", borderRadius: 12, padding: 24 }}>
              <span style={{ display: "block", fontFamily: "var(--font-dm-sans)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gris-doux)", marginBottom: 12 }}>
                {card.label}
              </span>
              <div style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 700, fontSize: 32, color: "var(--encre)", letterSpacing: "-0.02em", lineHeight: 1, marginBottom: 6 }}>
                {card.value}
              </div>
              <div style={{ fontSize: 13, color: "var(--gris-doux)", fontFamily: "var(--font-dm-sans)" }}>
                {card.sub}
              </div>
            </div>
          ))}
        </div>

        {/* ── PROGRESSION + RÉPARTITION ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }} className="dashboard-cols">

          {/* Progression mensuelle */}
          <div>
            <h2 style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 700, fontSize: 24, color: "var(--encre)", letterSpacing: "-0.01em", marginBottom: 28 }}>
              Progression
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {USER_STATS.distanceByMonth.map(({ month, distance }) => {
                const pct = (distance / maxMonthDistance) * 100;
                return (
                  <div key={month}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                      <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 14, color: "var(--encre)", fontWeight: 500 }}>{month}</span>
                      <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 13, color: "var(--gris-doux)" }}>{distance.toLocaleString("fr-FR")} m</span>
                    </div>
                    <div style={{ height: 8, background: "#F3F4F6", borderRadius: 999, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: "var(--bleu-piscine)", borderRadius: 999, transition: "width 600ms ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Répartition par nage */}
          <div>
            <h2 style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 700, fontSize: 24, color: "var(--encre)", letterSpacing: "-0.01em", marginBottom: 28 }}>
              Par nage
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {strokeEntries.map(([stroke, distance]) => {
                const pct = (distance / totalStrokeDistance) * 100;
                return (
                  <div key={stroke}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                      <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 14, color: "var(--encre)", fontWeight: 500 }}>
                        {STROKE_LABELS[stroke] ?? stroke}
                      </span>
                      <span style={{ fontFamily: "var(--font-dm-sans)", fontSize: 13, color: "var(--gris-doux)" }}>
                        {pct.toFixed(0)}% · {distance.toLocaleString("fr-FR")} m
                      </span>
                    </div>
                    <div style={{ height: 8, background: "#F3F4F6", borderRadius: 999, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, background: STROKE_COLORS[stroke] ?? "var(--bleu-piscine)", borderRadius: 999 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── DERNIÈRES SÉANCES ── */}
        <div>
          <h2 style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 700, fontSize: 24, color: "var(--encre)", letterSpacing: "-0.01em", marginBottom: 28 }}>
            Dernières séances
          </h2>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {recentSessions.map((session, i) => (
              <div
                key={session.id}
                style={{ display: "flex", alignItems: "center", gap: 20, padding: "18px 0", borderBottom: i < recentSessions.length - 1 ? "1px solid var(--ligne)" : "none", flexWrap: "wrap" }}
              >
                {/* Barre couleur nage */}
                <div style={{ width: 4, height: 40, borderRadius: 2, background: STROKE_COLORS[session.stroke] ?? "#ccc", flexShrink: 0 }} />

                {/* Titre + date */}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 500, fontSize: 15, color: "var(--encre)", marginBottom: 4 }}>
                    {session.title}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--gris-doux)" }}>
                    {formatDate(session.completedAt)} · {LEVEL_LABELS[session.level] ?? session.level}
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display: "flex", gap: 24, flexShrink: 0 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 700, fontSize: 20, color: "var(--encre)", lineHeight: 1 }}>
                      {session.totalDistance.toLocaleString("fr-FR")} m
                    </div>
                    <div style={{ fontSize: 12, color: "var(--gris-doux)", marginTop: 3 }}>
                      {formatDuration(session.actualDuration)}
                    </div>
                  </div>

                  {/* Badge export */}
                  <div style={{ display: "flex", alignItems: "center", minWidth: 70 }}>
                    {session.exported && session.exportTarget ? (
                      <span style={{ fontSize: 11, fontFamily: "var(--font-dm-sans)", fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", background: "var(--bleu-clair)", color: "var(--bleu-piscine)", padding: "3px 8px", borderRadius: 4 }}>
                        {session.exportTarget}
                      </span>
                    ) : (
                      <span style={{ fontSize: 11, color: "#D1D5DB", fontFamily: "var(--font-dm-sans)" }}>—</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 700px) {
          .dashboard-cols { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
