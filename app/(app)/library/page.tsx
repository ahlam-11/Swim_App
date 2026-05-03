"use client";

import { useState } from "react";
import { LEARN_VIDEOS } from "@/app/lib/data/learnContent";
import { TARGETED_DRILLS } from "@/app/lib/data/drills";
import type { VideoStroke } from "@/app/lib/types";

type StrokeFilter = "all" | VideoStroke;

const STROKE_LABELS: Record<VideoStroke, string> = {
  crawl:    "Crawl",
  dos:      "Dos",
  brasse:   "Brasse",
  papillon: "Papillon",
};

const STROKE_DESCS: Record<VideoStroke, string> = {
  crawl:    "La nage la plus rapide — maîtrise la rotation, la traction et la respiration bilatérale.",
  dos:      "Position dans l'axe, rotation épaules, battements réguliers — la nage qui corrige ta posture.",
  brasse:   "La synchronisation bras-jambes, la phase de glisse — une nage technique à chaque détail.",
  papillon: "Ondulation du corps, double battement, sortie bras simultanée — la nage la plus exigeante.",
};

const STROKE_LEVEL_BADGE: Record<VideoStroke, string> = {
  crawl:    "Débutant+",
  dos:      "Débutant+",
  brasse:   "Débutant+",
  papillon: "Intermédiaire+",
};

const STROKE_COLORS: Record<VideoStroke, string> = {
  crawl:    "#0055A4",
  dos:      "#4DB6AC",
  brasse:   "#64B5F6",
  papillon: "#F48FB1",
};

const TAG_LABELS: Record<string, string> = {
  complet:     "Complet",
  drill:       "Drill",
  technique:   "Technique",
  virage:      "Virage",
  depart:      "Départ",
  respiration: "Respiration",
  erreurs:     "Erreurs",
};

const STROKE_ORDER: VideoStroke[] = ["crawl", "dos", "brasse", "papillon"];

export default function LibraryPage() {
  const [filter,      setFilter]      = useState<StrokeFilter>("all");
  const [openProblem, setOpenProblem] = useState<string | null>(null);

  const visibleStrokes = STROKE_ORDER.filter(s => filter === "all" || s === filter);

  return (
    <div style={{ background: "var(--blanc)", minHeight: "100vh" }}>

      {/* PAGE HEADER */}
      <div style={{ padding: "60px clamp(20px,5vw,80px) 0" }}>
        <span style={{ display: "block", fontFamily: "var(--font-dm-sans)", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gris-doux)", marginBottom: 12 }}>
          Bibliothèque
        </span>
        <h1 style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(36px,5vw,56px)", color: "var(--encre)", letterSpacing: "-0.02em", lineHeight: 1.05, marginBottom: 12 }}>
          Apprends à nager mieux.
        </h1>
        <p style={{ fontSize: 18, color: "var(--gris-doux)", marginBottom: 40, lineHeight: 1.6 }}>
          Des vidéos sélectionnées, organisées par nage et par niveau.
        </p>
      </div>

      {/* FILTER BAR */}
      <div style={{ padding: "20px clamp(20px,5vw,80px)", borderBottom: "1px solid var(--ligne)", display: "flex", gap: 8, flexWrap: "wrap" }}>
        {([["all","Toutes les nages"], ["crawl","Crawl"], ["dos","Dos"], ["brasse","Brasse"], ["papillon","Papillon"]] as [StrokeFilter, string][]).map(([v, label]) => (
          <button key={v} onClick={() => setFilter(v)} className={`swim-chip${filter === v ? " selected" : ""}`}>{label}</button>
        ))}
      </div>

      {/* STROKE SECTIONS */}
      {visibleStrokes.map(stroke => {
        const videos = LEARN_VIDEOS.filter(v => v.stroke === stroke);
        const [featured, ...rest] = videos;

        return (
          <section
            key={stroke}
            style={{ padding: "80px clamp(20px,5vw,80px) 60px", borderBottom: "1px solid var(--ligne)" }}
          >
            {/* Section header with watermark */}
            <div style={{ position: "relative", marginBottom: 40 }}>
              <div style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(52px,8vw,80px)", color: "#F0F0F0", lineHeight: 1, letterSpacing: "-0.03em", userSelect: "none", pointerEvents: "none" }}>
                {STROKE_LABELS[stroke]}
              </div>
              <div style={{ position: "absolute", top: "50%", left: 0, transform: "translateY(-50%)", display: "flex", alignItems: "center", gap: 20 }}>
                <div>
                  <h2 style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 700, fontSize: 36, color: "var(--encre)", letterSpacing: "-0.02em" }}>
                    {STROKE_LABELS[stroke]}
                  </h2>
                  <p style={{ fontSize: 14, color: "var(--gris-doux)", marginTop: 4 }}>{STROKE_DESCS[stroke]}</p>
                </div>
                <span className="swim-badge" style={{ flexShrink: 0 }}>{STROKE_LEVEL_BADGE[stroke]}</span>
              </div>
            </div>

            {/* Video grid — 1 large + 3 small */}
            <div style={{ display: "grid", gridTemplateColumns: "60fr 40fr", gap: 24, alignItems: "start" }} className="video-grid-responsive">

              {/* Featured video */}
              {featured && (
                <a href={`https://www.youtube.com/watch?v=${featured.youtubeId}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }}>
                  <div style={{ position: "relative", overflow: "hidden", marginBottom: 14 }}>
                    <img
                      src={`https://img.youtube.com/vi/${featured.youtubeId}/hqdefault.jpg`}
                      alt={featured.title}
                      style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block", transition: "transform 300ms ease" }}
                      onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                      onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                    />
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 200ms ease" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.25)"; const btn = e.currentTarget.querySelector(".play-circle") as HTMLElement | null; if (btn) { btn.style.opacity = "1"; btn.style.transform = "scale(1)"; }}}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0)"; const btn = e.currentTarget.querySelector(".play-circle") as HTMLElement | null; if (btn) { btn.style.opacity = "0"; btn.style.transform = "scale(0.8)"; }}}
                    >
                      <div className="play-circle" style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transform: "scale(0.8)", transition: "opacity 200ms ease, transform 200ms ease" }}>
                        <svg width="18" height="20" viewBox="0 0 18 20" fill="none"><path d="M2 1.5l14 8.5-14 8.5V1.5z" fill={STROKE_COLORS[stroke]}/></svg>
                      </div>
                    </div>
                    <div style={{ position: "absolute", top: 12, left: 12 }}>
                      <span style={{ background: STROKE_COLORS[stroke], color: "#fff", fontFamily: "var(--font-dm-sans)", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", padding: "4px 10px", borderRadius: 4 }}>
                        {TAG_LABELS[featured.tag] ?? featured.tag}
                      </span>
                    </div>
                  </div>
                  <h3 style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 500, fontSize: 18, color: "var(--encre)", marginBottom: 8, lineHeight: 1.3 }}>
                    {featured.title}
                  </h3>
                  <p style={{ fontSize: 14, color: "var(--gris-doux)", lineHeight: 1.6, marginBottom: 8 }}>
                    {featured.description}
                  </p>
                  <span style={{ fontSize: 12, color: "var(--gris-doux)", fontFamily: "var(--font-dm-sans)" }}>{featured.durationMinutes} min</span>
                </a>
              )}

              {/* Small videos */}
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {rest.map(video => (
                  <a key={video.id} href={`https://www.youtube.com/watch?v=${video.youtubeId}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block", cursor: "pointer" }}>
                    <div style={{ position: "relative", overflow: "hidden", marginBottom: 10, borderRadius: 8 }}>
                      <img
                        src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                        alt={video.title}
                        style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block", borderRadius: 8, transition: "transform 300ms ease" }}
                        onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.02)")}
                        onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                      />
                      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 200ms ease", borderRadius: 8 }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.25)"; const btn = e.currentTarget.querySelector(".play-circle") as HTMLElement | null; if (btn) { btn.style.opacity = "1"; btn.style.transform = "scale(1)"; }}}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0)"; const btn = e.currentTarget.querySelector(".play-circle") as HTMLElement | null; if (btn) { btn.style.opacity = "0"; btn.style.transform = "scale(0.8)"; }}}
                      >
                        <div className="play-circle" style={{ width: 40, height: 40, borderRadius: "50%", background: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transform: "scale(0.8)", transition: "opacity 200ms ease, transform 200ms ease" }}>
                          <svg width="14" height="16" viewBox="0 0 14 16" fill="none"><path d="M1.5 1l11 7-11 7V1z" fill={STROKE_COLORS[stroke]}/></svg>
                        </div>
                      </div>
                    </div>
                    <h3 style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 500, fontSize: 15, color: "var(--encre)", marginBottom: 6, lineHeight: 1.3 }}>
                      {video.title}
                    </h3>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span className="swim-badge">{TAG_LABELS[video.tag] ?? video.tag}</span>
                      <span style={{ fontSize: 12, color: "var(--gris-doux)", fontFamily: "var(--font-dm-sans)" }}>{video.durationMinutes} min</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      {/* PROBLÈMES CIBLÉS */}
      <div style={{ padding: "80px clamp(20px,5vw,80px)" }}>
        <h2 style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 700, fontSize: "clamp(28px,5vw,40px)", color: "var(--encre)", marginBottom: 8, letterSpacing: "-0.02em" }}>
          Tu as un problème précis ?
        </h2>
        <p style={{ fontSize: 16, color: "var(--gris-doux)", marginBottom: 40, lineHeight: 1.6 }}>
          Sélectionne ton problème — on te donne les exercices pour le corriger.
        </p>

        {TARGETED_DRILLS.map(item => {
          const isOpen = openProblem === item.id;
          return (
            <div key={item.id} style={{ borderBottom: "1px solid var(--ligne)" }}>
              <button
                onClick={() => setOpenProblem(isOpen ? null : item.id)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0", cursor: "pointer", background: "none", border: "none", width: "100%", textAlign: "left" }}
              >
                <span style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 500, fontSize: 16, color: "var(--encre)" }}>
                  {item.problem}
                </span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transition: "transform 250ms ease", transform: isOpen ? "rotate(180deg)" : "none", flexShrink: 0, marginLeft: 16 }}>
                  <path d="M4 6L8 10L12 6" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div style={{ overflow: "hidden", maxHeight: isOpen ? 600 : 0, opacity: isOpen ? 1 : 0, transition: "max-height 350ms ease, opacity 300ms ease" }}>
                <div style={{ padding: "4px 0 24px", display: "flex", flexDirection: "column", gap: 16 }}>
                  {item.drills.map(drill => (
                    <div key={drill.name} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                      <div style={{ width: 3, minWidth: 3, borderRadius: 2, background: "var(--bleu-piscine)", alignSelf: "stretch", marginTop: 2 }} />
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
                          <strong style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 500, fontSize: 15, color: "var(--encre)" }}>{drill.name}</strong>
                          <span style={{ fontSize: 12, color: "var(--bleu-piscine)", fontFamily: "var(--font-dm-sans)", background: "var(--bleu-clair)", padding: "2px 8px", borderRadius: 4 }}>{drill.distance}</span>
                          {drill.equipment && (
                            <span style={{ fontSize: 12, color: "var(--gris-doux)", fontFamily: "var(--font-dm-sans)" }}>· {drill.equipment}</span>
                          )}
                        </div>
                        <p style={{ fontSize: 14, color: "var(--gris-doux)", lineHeight: 1.6, margin: "0 0 6px" }}>
                          {drill.description}
                        </p>
                        <p style={{ fontSize: 13, color: "var(--encre)", fontFamily: "var(--font-instrument-serif)", fontStyle: "italic", lineHeight: 1.5, margin: 0 }}>
                          💡 {drill.tip}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 700px) {
          .video-grid-responsive { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
