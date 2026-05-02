"use client";

import { useState } from "react";

const S = {
  serif: { fontFamily: "var(--font-dm-serif)" } as const,
  sans:  { fontFamily: "var(--font-dm-sans)"  } as const,
  mono:  { fontFamily: "var(--font-space-mono)" } as const,
};

const STROKES   = ["Crawl", "Dos", "Brasse", "Papillon", "4 nages", "Ciblé"] as const;
const LEVELS    = ["Débutant", "Interméd.", "Avancé", "Élite"] as const;
const GOALS     = ["Endurance", "Vitesse", "Technique", "Récupération"] as const;

type Stroke = (typeof STROKES)[number];
type Level  = (typeof LEVELS)[number];
type Goal   = (typeof GOALS)[number];

const MOCK_SESSIONS: Record<string, { title: string; subtitle: string; warmup: [string, string, string][]; main: [string, string, string][]; cooldown: string }> = {
  default: {
    title: "Endurance Crawl",
    subtitle: "45 min · ~2 500m",
    warmup: [
      ["4 × 50m",  "Nage libre facile, respiration naturelle", "repos 10\""],
      ["2 × 100m", "Crawl — focus position du corps",          "repos 15\""],
    ],
    main: [
      ["6 × 200m", "Crawl @75% · inspire tous les 3 temps · régulier",  "repos 20\""],
      ["4 × 50m",  "Sprint · départ bassin · récupération complète",     "repos 30\""],
      ["2 × 100m", "Pull-buoy · bras seuls · rythme régulier",           "repos 20\""],
    ],
    cooldown: "500m nage libre très facile · focus flottaison et allongement",
  },
};

function getMockSession(stroke: Stroke, level: Level, goal: Goal, duration: number) {
  const session = { ...MOCK_SESSIONS.default };
  const dist = duration < 40 ? "~1 500m" : duration < 55 ? "~2 000m" : "~2 500m";
  session.subtitle = `${duration} min · ${dist}`;
  session.title = `${goal === "Récupération" ? "Récupération" : goal === "Vitesse" ? "Vitesse" : goal === "Technique" ? "Technique" : "Endurance"} ${stroke}`;
  return session;
}

function ResultPanel({ stroke, level, goal, duration }: { stroke: Stroke; level: Level; goal: Goal; duration: number }) {
  const s = getMockSession(stroke, level, goal, duration);

  return (
    <div className="arr" style={{ background: "var(--surface)", border: "1px solid var(--rule-light)", boxShadow: "0 16px 48px rgba(0,0,0,0.07)", overflow: "hidden" }}>
      {/* Header */}
      <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid var(--rule-light)" }}>
        <div className="mono-label mono-label-blue" style={{ marginBottom: 8 }}>
          {stroke} · {level} · {goal}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ ...S.serif, fontSize: 22, lineHeight: 1.1, color: "var(--ink)" }}>{s.title}</div>
            <div style={{ ...S.sans, fontSize: 12, color: "var(--ink-faint)", marginTop: 6, fontWeight: 300 }}>{s.subtitle} · généré maintenant</div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "var(--ink-faint)", lineHeight: 1 }}>♡</button>
            <button style={{ background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "var(--ink-faint)", lineHeight: 1 }}>⊙</button>
          </div>
        </div>
      </div>

      {/* Blocks */}
      <div style={{ padding: "16px 24px", overflowY: "auto", maxHeight: "calc(100vh - 360px)", display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Warmup */}
        <div>
          <div className="mono-label" style={{ marginBottom: 10 }}>Échauffement</div>
          {s.warmup.map(([sets, desc, rest]) => (
            <div key={sets + desc} style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: "1px solid var(--rule-light)" }}>
              <span style={{ ...S.mono, fontSize: 10, color: "var(--ink)", minWidth: 54, lineHeight: 1.5 }}>{sets}</span>
              <div>
                <div style={{ ...S.sans, fontSize: 13, lineHeight: 1.4 }}>{desc}</div>
                <div style={{ ...S.mono, fontSize: 9, color: "var(--ink-faint)", marginTop: 2 }}>{rest}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main */}
        <div>
          <div className="mono-label mono-label-blue" style={{ marginBottom: 10 }}>Corps de séance</div>
          {s.main.map(([sets, desc, rest]) => (
            <div key={sets + desc} style={{ display: "flex", gap: 12, padding: "8px 12px", background: "var(--blue-pale)", marginBottom: 6 }}>
              <span style={{ ...S.mono, fontSize: 10, color: "var(--blue)", minWidth: 54, lineHeight: 1.5 }}>{sets}</span>
              <div>
                <div style={{ ...S.sans, fontSize: 13, lineHeight: 1.4 }}>{desc}</div>
                <div style={{ ...S.mono, fontSize: 9, color: "var(--blue-mid)", marginTop: 2 }}>{rest}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Cool down */}
        <div>
          <div className="mono-label" style={{ marginBottom: 8 }}>Retour au calme</div>
          <div style={{ ...S.sans, fontSize: 13, color: "var(--ink-soft)", fontWeight: 300, lineHeight: 1.5 }}>{s.cooldown}</div>
        </div>
      </div>

      {/* Export */}
      <div style={{ padding: "14px 24px", borderTop: "1px solid var(--rule-light)", background: "var(--ink)", display: "flex", gap: 8 }}>
        <div className="mono-label" style={{ color: "rgba(255,255,255,0.3)", alignSelf: "center", marginRight: 4 }}>Export</div>
        {[
          { l: "Garmin", s: { background: "var(--blue)", color: "#fff", border: "none" } },
          { l: "COROS",  s: { background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.25)" } },
          { l: "PDF",    s: { background: "transparent", color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.12)" } },
        ].map(({ l, s: bs }) => (
          <button key={l} className="btn-blue" style={{ flex: 1, fontSize: 12, padding: "9px", ...bs, transition: "opacity 0.15s" }}>
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function GeneratePage() {
  const [stroke,   setStroke]   = useState<Stroke>("Crawl");
  const [level,    setLevel]    = useState<Level>("Interméd.");
  const [goal,     setGoal]     = useState<Goal>("Endurance");
  const [duration, setDuration] = useState(45);
  const [result,   setResult]   = useState(false);
  const [loading,  setLoading]  = useState(false);

  function handleGenerate() {
    setLoading(true);
    setResult(false);
    setTimeout(() => { setLoading(false); setResult(true); }, 900);
  }

  return (
    <div style={{ padding: "36px 32px", maxWidth: 1100, margin: "0 auto" }}>
      {/* Page header */}
      <div className="au" style={{ marginBottom: 40 }}>
        <div className="mono-label" style={{ marginBottom: 8 }}>Générateur</div>
        <h1 style={{ ...S.serif, fontSize: "clamp(28px, 4vw, 42px)", color: "var(--ink)", lineHeight: 1.05 }}>
          Configurer ma séance
        </h1>
        <p style={{ ...S.sans, fontSize: 15, color: "var(--ink-soft)", marginTop: 8, fontWeight: 300 }}>
          Quelques choix, une séance adaptée.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: result ? "1fr 1fr" : "560px 1fr", gap: 32, alignItems: "start" }}>
        {/* ── Left: Form ── */}
        <div className="au d1" style={{ background: "var(--surface)", border: "1px solid var(--rule-light)", padding: "28px" }}>

          {/* Stroke */}
          <div style={{ marginBottom: 28 }}>
            <div className="mono-label" style={{ marginBottom: 14 }}>Nage</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {STROKES.map((s) => (
                <button key={s} className={`chip ${stroke === s ? "chip-active" : ""}`} onClick={() => setStroke(s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Level */}
          <div style={{ marginBottom: 28 }}>
            <div className="mono-label" style={{ marginBottom: 14 }}>Niveau</div>
            <div className="segment">
              {LEVELS.map((l) => (
                <button key={l} className={`segment-item ${level === l ? "segment-active" : ""}`} onClick={() => setLevel(l)}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Goal */}
          <div style={{ marginBottom: 28 }}>
            <div className="mono-label" style={{ marginBottom: 14 }}>Objectif</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {GOALS.map((g) => (
                <button
                  key={g}
                  onClick={() => setGoal(g)}
                  style={{
                    padding: "11px 14px",
                    ...S.sans,
                    fontSize: 14,
                    textAlign: "left",
                    cursor: "pointer",
                    border: `1px solid ${goal === g ? "var(--ink)" : "var(--rule-light)"}`,
                    background: goal === g ? "var(--ink)" : "transparent",
                    color: goal === g ? "#fff" : "var(--ink)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "all 0.15s ease",
                  }}
                >
                  {g}
                  {goal === g && <span style={{ fontSize: 10 }}>✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div style={{ marginBottom: 32 }}>
            <div className="mono-label" style={{ marginBottom: 14 }}>
              Durée —{" "}
              <span style={{ color: "var(--ink)", fontFamily: "var(--font-space-mono)" }}>
                {duration} min
              </span>
            </div>
            <input
              type="range"
              min={20}
              max={120}
              step={5}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <span style={{ ...S.mono, fontSize: 9, color: "var(--ink-faint)" }}>20 min</span>
              <span style={{ ...S.mono, fontSize: 9, color: "var(--ink-faint)" }}>2 h</span>
            </div>
          </div>

          {/* Generate button */}
          <button
            className="btn-ink"
            style={{ width: "100%", justifyContent: "center", fontSize: 16, padding: "15px", ...S.serif, letterSpacing: 0 }}
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <span style={{ ...S.mono, fontSize: 11, letterSpacing: "0.1em", opacity: 0.7 }}>GÉNÉRATION…</span>
            ) : (
              <>Générer ma séance →</>
            )}
          </button>
        </div>

        {/* ── Right: Result ── */}
        {result ? (
          <ResultPanel stroke={stroke} level={level} goal={goal} duration={duration} />
        ) : (
          <div className="au d2" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 32px", border: "1px dashed var(--rule)", color: "var(--ink-faint)", gap: 16, minHeight: 240 }}>
            {loading ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                <div style={{ width: 32, height: 32, border: "2px solid var(--rule-light)", borderTop: "2px solid var(--blue)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                <span style={{ ...S.mono, fontSize: 10, letterSpacing: "0.12em", color: "var(--blue)" }}>GÉNÉRATION EN COURS…</span>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 32, opacity: 0.3 }}>◈</div>
                <div style={{ ...S.serif, fontSize: 18, color: "var(--ink-soft)", textAlign: "center" }}>
                  Ta séance<br />apparaîtra ici
                </div>
                <div style={{ ...S.sans, fontSize: 13, color: "var(--ink-faint)", textAlign: "center", fontWeight: 300 }}>
                  Configure et clique sur<br />« Générer ma séance »
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
