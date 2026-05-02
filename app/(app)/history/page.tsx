import Link from "next/link";

const S = {
  serif: { fontFamily: "var(--font-dm-serif)" } as const,
  sans:  { fontFamily: "var(--font-dm-sans)"  } as const,
  mono:  { fontFamily: "var(--font-space-mono)" } as const,
};

const WEEKLY = [40, 55, 70, 45, 85, 60, 95, 50];

const SESSIONS = [
  { date: "Hier",     name: "Endurance Crawl",       dist: "2 500m", dur: "45 min", stroke: "Crawl"    },
  { date: "Lundi",    name: "Technique Dos",          dist: "1 800m", dur: "40 min", stroke: "Dos"      },
  { date: "Vendredi", name: "4 nages récupération",   dist: "1 200m", dur: "30 min", stroke: "4 nages"  },
  { date: "Mercredi", name: "Sprint Crawl",           dist: "2 000m", dur: "50 min", stroke: "Crawl"    },
  { date: "Mardi",    name: "Technique Brasse",       dist: "1 500m", dur: "35 min", stroke: "Brasse"   },
];

const SWIM_DIST = [
  { nage: "Crawl",    pct: 65 },
  { nage: "Dos",      pct: 20 },
  { nage: "Brasse",   pct: 10 },
  { nage: "Papillon", pct: 5  },
];

export default function HistoryPage() {
  return (
    <div style={{ padding: "36px 32px", maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div className="au" style={{ marginBottom: 40 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <div className="mono-label" style={{ marginBottom: 8 }}>Progression</div>
            <h1 style={{ ...S.serif, fontSize: "clamp(28px, 4vw, 42px)", color: "var(--ink)", lineHeight: 1.05 }}>
              Avril 2026
            </h1>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["Mars", "Avril", "Mai"].map((m, i) => (
              <button
                key={m}
                className={`chip ${i === 1 ? "chip-active" : ""}`}
                style={{ fontSize: 12, padding: "5px 14px" }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="au d1" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 36 }}>
        {[["12", "Séances"], ["28 km", "Distance totale"], ["4", "Nages pratiquées"]].map(([val, lbl]) => (
          <div key={lbl} style={{ padding: "24px", background: "var(--surface)", border: "1px solid var(--rule-light)" }}>
            <div style={{ ...S.serif, fontSize: 36, lineHeight: 1, color: "var(--ink)", marginBottom: 6 }}>{val}</div>
            <div style={{ ...S.sans, fontSize: 13, color: "var(--ink-faint)", fontWeight: 300 }}>{lbl}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginBottom: 36 }}>
        {/* Bar chart */}
        <div className="au d2" style={{ padding: "24px", background: "var(--surface)", border: "1px solid var(--rule-light)" }}>
          <div className="mono-label" style={{ marginBottom: 20 }}>Distance par semaine (km)</div>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 80 }}>
            {WEEKLY.map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  background: i === 6 ? "var(--ink)" : i === 7 ? "var(--blue-light)" : "var(--rule-light)",
                  borderRadius: "1px 1px 0 0",
                  transition: "background 0.2s",
                  position: "relative",
                }}
                title={`S${i + 1}: ${Math.round(h * 0.35)} km`}
              />
            ))}
          </div>
          <div style={{ display: "flex", marginTop: 8 }}>
            {WEEKLY.map((_, i) => (
              <div key={i} style={{ flex: 1, ...S.mono, fontSize: 8, color: i === 6 ? "var(--ink)" : "var(--ink-faint)", textAlign: "center" }}>
                S{i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Swim distribution */}
        <div className="au d3" style={{ padding: "24px", background: "var(--surface)", border: "1px solid var(--rule-light)" }}>
          <div className="mono-label" style={{ marginBottom: 20 }}>Répartition par nage</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {SWIM_DIST.map(({ nage, pct }) => (
              <div key={nage}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ ...S.sans, fontSize: 13 }}>{nage}</span>
                  <span style={{ ...S.mono, fontSize: 10, color: "var(--ink-faint)" }}>{pct}%</span>
                </div>
                <div style={{ height: 2, background: "var(--rule-light)", position: "relative" }}>
                  <div style={{
                    position: "absolute",
                    left: 0, top: 0, height: "100%",
                    width: `${pct}%`,
                    background: "var(--ink)",
                    transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent sessions */}
      <div className="au d4" style={{ background: "var(--surface)", border: "1px solid var(--rule-light)" }}>
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--rule-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="mono-label">Séances récentes</div>
          <Link href="/generate" style={{ ...S.sans, fontSize: 13, color: "var(--ink-soft)", textDecoration: "none" }}>
            + Nouvelle séance
          </Link>
        </div>
        {SESSIONS.map(({ date, name, dist, dur, stroke }, i) => (
          <div
            key={name}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 24px",
              borderBottom: i < SESSIONS.length - 1 ? "1px solid var(--rule-light)" : "none",
              transition: "background 0.12s",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
              <div>
                <div style={{ ...S.sans, fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>{name}</div>
                <div style={{ ...S.sans, fontSize: 12, color: "var(--ink-faint)", marginTop: 2, fontWeight: 300 }}>
                  {date} · {dist}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span style={{ ...S.mono, fontSize: 8, background: "var(--blue-pale)", color: "var(--blue)", padding: "3px 8px", letterSpacing: "0.08em" }}>
                {stroke.toUpperCase()}
              </span>
              <span style={{ ...S.mono, fontSize: 10, color: "var(--ink-faint)" }}>{dur}</span>
              <span style={{ color: "var(--ink-faint)", fontSize: 12 }}>↻</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
