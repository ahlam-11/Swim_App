"use client";

import { useState } from "react";

const S = {
  serif: { fontFamily: "var(--font-dm-serif)" } as const,
  sans:  { fontFamily: "var(--font-dm-sans)"  } as const,
  mono:  { fontFamily: "var(--font-space-mono)" } as const,
};

const FILTERS = ["Tout", "Crawl", "Dos", "Brasse", "Papillon"] as const;
type Filter = (typeof FILTERS)[number];

const VIDEOS: { nage: string; title: string; tag: string; dur: string; level: string }[] = [
  { nage: "Crawl",    title: "Position du corps et gainage",    tag: "Position",    dur: "2:34", level: "Débutant" },
  { nage: "Crawl",    title: "Respiration bilatérale",          tag: "Respiration", dur: "3:12", level: "Débutant" },
  { nage: "Crawl",    title: "Coordination bras / battements",  tag: "Coordination",dur: "4:05", level: "Intermédiaire" },
  { nage: "Dos",      title: "Virage culbute dos",              tag: "Virage",      dur: "4:01", level: "Intermédiaire" },
  { nage: "Dos",      title: "Rotation du corps dos crawlé",    tag: "Technique",   dur: "2:50", level: "Débutant" },
  { nage: "Brasse",   title: "Ondulation de hanches",           tag: "Technique",   dur: "1:55", level: "Débutant" },
  { nage: "Brasse",   title: "Timing traction / grenouille",    tag: "Coordination",dur: "3:20", level: "Intermédiaire" },
  { nage: "Papillon", title: "Ondulation complète",             tag: "Technique",   dur: "5:10", level: "Avancé" },
  { nage: "Papillon", title: "Départ plongeon papillon",        tag: "Départ",      dur: "2:48", level: "Avancé" },
];

const DRILLS = [
  { problem: "Je coule les hanches en crawl",        count: 3, dur: "15 min" },
  { problem: "Je n'arrive pas à respirer en brasse", count: 4, dur: "20 min" },
  { problem: "Mes virages sont trop lents",          count: 3, dur: "12 min" },
  { problem: "Je me fatigue trop vite en papillon",  count: 5, dur: "25 min" },
];

function VideoCard({ nage, title, tag, dur, level }: typeof VIDEOS[number]) {
  return (
    <div className="card-hover" style={{ border: "1px solid var(--rule-light)", overflow: "hidden", cursor: "pointer" }}>
      {/* Thumbnail placeholder */}
      <div style={{
        height: 140,
        background: "repeating-linear-gradient(-55deg, #ebebeb 0, #ebebeb 1px, #f5f5f5 0, #f5f5f5 50%)",
        backgroundSize: "8px 8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.9)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          color: "var(--ink)",
        }}>▶</div>
        <div style={{
          position: "absolute",
          bottom: 8,
          right: 10,
          ...S.mono,
          fontSize: 9,
          color: "var(--ink)",
          background: "rgba(255,255,255,0.85)",
          padding: "2px 6px",
        }}>{dur}</div>
      </div>

      {/* Info */}
      <div style={{ padding: "14px 16px" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
          <span style={{ ...S.mono, fontSize: 8, background: "var(--ink)", color: "#fff", padding: "2px 6px", letterSpacing: "0.06em" }}>{nage}</span>
          <span style={{ ...S.mono, fontSize: 8, border: "1px solid var(--rule)", color: "var(--ink-soft)", padding: "2px 6px", letterSpacing: "0.06em" }}>{tag}</span>
          <span style={{ ...S.mono, fontSize: 8, border: "1px solid var(--blue-light)", color: "var(--blue)", padding: "2px 6px", letterSpacing: "0.06em" }}>{level}</span>
        </div>
        <div style={{ ...S.sans, fontSize: 14, fontWeight: 500, lineHeight: 1.3, color: "var(--ink)" }}>{title}</div>
      </div>
    </div>
  );
}

export default function LibraryPage() {
  const [filter, setFilter]   = useState<Filter>("Tout");
  const [search, setSearch]   = useState("");

  const filtered = VIDEOS.filter((v) => {
    const matchFilter = filter === "Tout" || v.nage === filter;
    const matchSearch = search === "" || v.title.toLowerCase().includes(search.toLowerCase()) || v.nage.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div style={{ padding: "36px 32px", maxWidth: 1100, margin: "0 auto" }}>
      {/* Header */}
      <div className="au" style={{ marginBottom: 36 }}>
        <div className="mono-label" style={{ marginBottom: 8 }}>Bibliothèque</div>
        <h1 style={{ ...S.serif, fontSize: "clamp(28px, 4vw, 42px)", color: "var(--ink)", lineHeight: 1.05 }}>
          Apprendre les nages
        </h1>
        <p style={{ ...S.sans, fontSize: 15, color: "var(--ink-soft)", marginTop: 8, fontWeight: 300 }}>
          Vidéos sélectionnées par thème et niveau.
        </p>
      </div>

      {/* Search */}
      <div className="au d1" style={{ marginBottom: 20 }}>
        <div style={{
          border: "1px solid var(--rule-light)",
          background: "var(--surface)",
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 16px",
          maxWidth: 400,
        }}>
          <span style={{ color: "var(--ink-faint)", fontSize: 14 }}>⌕</span>
          <input
            type="text"
            placeholder="Rechercher…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              border: "none",
              outline: "none",
              ...S.sans,
              fontSize: 14,
              color: "var(--ink)",
              background: "transparent",
              width: "100%",
            }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="au d2" style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
        {FILTERS.map((f) => (
          <button
            key={f}
            className={`chip ${filter === f ? "chip-active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Videos grid */}
      {filtered.length > 0 ? (
        <div className="au d3" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20, marginBottom: 48 }}>
          {filtered.map((v) => (
            <VideoCard key={v.title} {...v} />
          ))}
        </div>
      ) : (
        <div style={{ padding: "48px", textAlign: "center", border: "1px dashed var(--rule)", marginBottom: 48 }}>
          <div style={{ ...S.serif, fontSize: 18, color: "var(--ink-soft)" }}>Aucune vidéo trouvée</div>
        </div>
      )}

      {/* Exercices ciblés */}
      <div style={{ borderTop: "1px solid var(--rule-light)", paddingTop: 40 }}>
        <div className="mono-label mono-label-blue" style={{ marginBottom: 24 }}>Exercices ciblés</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {DRILLS.map(({ problem, count, dur }) => (
            <div
              key={problem}
              className="card-hover"
              style={{ padding: "20px", background: "var(--blue-pale)", border: "1px solid var(--blue-light)", cursor: "pointer" }}
            >
              <div style={{ ...S.sans, fontSize: 14, fontWeight: 500, color: "var(--ink)", lineHeight: 1.4, marginBottom: 8 }}>
                {problem}
              </div>
              <div style={{ ...S.mono, fontSize: 9, color: "var(--blue)", letterSpacing: "0.1em" }}>
                {count} exercices · {dur} →
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
