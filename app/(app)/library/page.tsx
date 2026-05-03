"use client";

import { useState } from "react";

type StrokeFilter = "all" | "crawl" | "dos" | "brasse" | "papillon";

interface VideoCard {
  src: string;
  title: string;
  tag: string;
  duration: string;
  level: string;
  large?: boolean;
}

interface NageSection {
  key: StrokeFilter;
  name: string;
  desc: string;
  levelBadge: string;
  videos: [VideoCard, VideoCard, VideoCard];
}

const NAGE_SECTIONS: NageSection[] = [
  {
    key: "crawl",
    name: "Crawl",
    desc: "La nage la plus rapide — maîtrise la rotation, la traction et la respiration bilatérale.",
    levelBadge: "Débutant+",
    videos: [
      { src: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=900&q=80", title: "Technique bras : la traction parfaite en crawl", tag: "Technique", duration: "12 min", level: "Avancé", large: true },
      { src: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=700&q=80", title: "Respiration bilatérale — comment y parvenir", tag: "Débutant", duration: "8 min", level: "Débutant" },
      { src: "https://images.unsplash.com/photo-1560090995-01632a28895b?w=700&q=80", title: "Rotation des hanches — le secret de la vitesse", tag: "Intermédiaire", duration: "10 min", level: "Intermédiaire" },
    ],
  },
  {
    key: "dos",
    name: "Dos",
    desc: "Position dans l'axe, rotation épaules, battements réguliers — la nage qui corrige ta posture.",
    levelBadge: "Débutant+",
    videos: [
      { src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80", title: "Position du corps en dos crawlé — les bases", tag: "Débutant", duration: "9 min", level: "Débutant", large: true },
      { src: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=700&q=80", title: "Entrée de main — éviter les erreurs communes", tag: "Technique", duration: "7 min", level: "Intermédiaire" },
      { src: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=700&q=80", title: "Virages en dos — technique culbute", tag: "Avancé", duration: "11 min", level: "Avancé" },
    ],
  },
  {
    key: "brasse",
    name: "Brasse",
    desc: "La synchronisation bras-jambes, la phase de glisse — une nage technique à chaque détail.",
    levelBadge: "Débutant+",
    videos: [
      { src: "https://images.unsplash.com/photo-1560090995-01632a28895b?w=900&q=80", title: "Mouvement de jambes en brasse — l'erreur à éviter", tag: "Débutant", duration: "10 min", level: "Débutant", large: true },
      { src: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=700&q=80", title: "Phase de glisse — allonger sans effort", tag: "Intermédiaire", duration: "6 min", level: "Intermédiaire" },
      { src: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&q=80", title: "Synchronisation respiration — timing parfait", tag: "Technique", duration: "8 min", level: "Intermédiaire" },
    ],
  },
  {
    key: "papillon",
    name: "Papillon",
    desc: "Ondulation du corps, double battement, sortie bras simultanée — la nage la plus exigeante.",
    levelBadge: "Intermédiaire+",
    videos: [
      { src: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=900&q=80", title: "Ondulation corps entier — la clé du papillon", tag: "Intermédiaire", duration: "14 min", level: "Intermédiaire", large: true },
      { src: "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=700&q=80", title: "Double battement — rythme et puissance", tag: "Avancé", duration: "9 min", level: "Avancé" },
      { src: "https://images.unsplash.com/photo-1560090995-01632a28895b?w=700&q=80", title: "Sortie des bras — économiser l'énergie", tag: "Technique", duration: "7 min", level: "Avancé" },
    ],
  },
];

const PROBLEMS = [
  {
    question: "Je coule les hanches en crawl",
    drills: [
      { title: "Drill 1 — Flottaison active", desc: "Pousse les hanches vers la surface en tendant les orteils. 6×50m en se concentrant sur la position haute." },
      { title: "Drill 2 — Planche jambes", desc: "Avec planche, travaille uniquement le battement en maintenant les hanches à la surface. 8×25m." },
      { title: "Drill 3 — Head-lead body rotation", desc: "Sans regarder, laisse la tête dans l'axe. La rotation des épaules remonte naturellement les hanches." },
    ],
  },
  {
    question: "Je manque de souffle en crawl",
    drills: [
      { title: "Drill 1 — Respiration unilatérale", desc: "Commence par respirer du même côté à chaque fois, tous les 2 coups. Crée un rythme stable." },
      { title: "Drill 2 — Expiration sous-marine", desc: "Expire lentement par la bouche sous l'eau. Ne retiens jamais ton souffle — cela cause la panique." },
    ],
  },
  {
    question: "Mes virages me font perdre beaucoup de temps",
    drills: [
      { title: "Drill 1 — Approche couloir", desc: "Apprends à compter les coups depuis les drapeaux. Standardise l'approche pour une culbute au bon moment." },
      { title: "Drill 2 — Culbute sans nage", desc: "Travaille uniquement la culbute et la poussée murale. 20 répétitions en solo, en accélérant progressivement." },
    ],
  },
  {
    question: "Je n'arrive pas à garder un rythme en brasse",
    drills: [
      { title: "Drill 1 — 2 jambes / 1 bras", desc: "Alterne 2 battements jambes seules (avec planche) puis 1 cycle complet. Ça synchronise le tout." },
      { title: "Drill 2 — Pull buoy + bras", desc: "Pull buoy entre les jambes, bouge uniquement les bras en brasse. Isoler les bras aide à corriger le timing." },
    ],
  },
  {
    question: "Mon papillon est épuisant après 25m",
    drills: [
      { title: "Drill 1 — Ondulation seule", desc: "Sans nager, pousse au mur et ondule corps entier jusqu'à l'autre bout. Les bras le long du corps. 10 fois." },
      { title: "Drill 2 — 1 bras à la fois", desc: "Un bras sort, l'autre reste en avant. Alterne 25m droite / 25m gauche. Réduit la charge musculaire." },
      { title: "Drill 3 — 3 coups de dos / 1 papillon", desc: "Séquence de récupération active. Le dos permet de reprendre souffle entre les cycles papillon." },
    ],
  },
];

function VideoCardItem({ video, large }: { video: VideoCard; large?: boolean }) {
  return (
    <div style={{ cursor: "pointer" }}>
      <div style={{ position: "relative", overflow: "hidden", marginBottom: 14 }}>
        <img
          src={video.src}
          alt={video.title}
          style={{
            width: "100%",
            aspectRatio: "16/9",
            objectFit: "cover",
            display: "block",
            borderRadius: large ? 0 : 8,
            transition: "transform 300ms ease",
          }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = "scale(1.02)")}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
        />
        <div
          style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 200ms ease", borderRadius: large ? 0 : 8 }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0.25)"; (e.currentTarget.querySelector(".play-circle") as HTMLElement | null)?.style && ((e.currentTarget.querySelector(".play-circle") as HTMLElement).style.opacity = "1"); (e.currentTarget.querySelector(".play-circle") as HTMLElement | null)?.style && ((e.currentTarget.querySelector(".play-circle") as HTMLElement).style.transform = "scale(1)"); }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(0,0,0,0)"; (e.currentTarget.querySelector(".play-circle") as HTMLElement | null)?.style && ((e.currentTarget.querySelector(".play-circle") as HTMLElement).style.opacity = "0"); (e.currentTarget.querySelector(".play-circle") as HTMLElement | null)?.style && ((e.currentTarget.querySelector(".play-circle") as HTMLElement).style.transform = "scale(0.8)"); }}
        >
          <div className="play-circle" style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.85)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transform: "scale(0.8)", transition: "opacity 200ms ease, transform 200ms ease" }}>
            <svg width="16" height="18" viewBox="0 0 16 18" fill="none"><path d="M2 1.5l12 7-12 7V1.5z" fill="#111"/></svg>
          </div>
        </div>
      </div>
      <h3 style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 500, fontSize: large ? 18 : 15, color: "var(--encre)", marginBottom: 8, lineHeight: 1.3 }}>
        {video.title}
      </h3>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <span className="swim-badge">{video.tag}</span>
        <span style={{ fontSize: 12, color: "var(--gris-doux)", fontFamily: "var(--font-dm-sans)" }}>{video.duration}</span>
      </div>
    </div>
  );
}

export default function LibraryPage() {
  const [filter,      setFilter]      = useState<StrokeFilter>("all");
  const [openProblem, setOpenProblem] = useState<number | null>(null);

  const visibleSections = NAGE_SECTIONS.filter(s => filter === "all" || s.key === filter);

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
        {([["all","Toutes les nages"],["crawl","Crawl"],["dos","Dos"],["brasse","Brasse"],["papillon","Papillon"]] as [StrokeFilter, string][]).map(([v, label]) => (
          <button key={v} onClick={() => setFilter(v)} className={`swim-chip${filter === v ? " selected" : ""}`}>{label}</button>
        ))}
      </div>

      {/* NAGE SECTIONS */}
      {visibleSections.map(section => (
        <section
          key={section.key}
          style={{ padding: "80px clamp(20px,5vw,80px) 60px", borderBottom: "1px solid var(--ligne)" }}
        >
          {/* Section header with watermark */}
          <div style={{ position: "relative", marginBottom: 40 }}>
            <div style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 900, fontSize: "clamp(52px,8vw,80px)", color: "#F0F0F0", lineHeight: 1, letterSpacing: "-0.03em", userSelect: "none", pointerEvents: "none" }}>
              {section.name}
            </div>
            <div style={{ position: "absolute", top: "50%", left: 0, transform: "translateY(-50%)", display: "flex", alignItems: "center", gap: 20 }}>
              <div>
                <h2 style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 700, fontSize: 36, color: "var(--encre)", letterSpacing: "-0.02em" }}>
                  {section.name}
                </h2>
                <p style={{ fontSize: 14, color: "var(--gris-doux)", marginTop: 4 }}>{section.desc}</p>
              </div>
              <span className="swim-badge" style={{ flexShrink: 0 }}>{section.levelBadge}</span>
            </div>
          </div>

          {/* Asymmetric 60/40 video grid */}
          <div style={{ display: "grid", gridTemplateColumns: "60fr 40fr", gap: 24, alignItems: "start", marginBottom: 0 }} className="video-grid-responsive">
            <VideoCardItem video={section.videos[0]} large />
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              <VideoCardItem video={section.videos[1]} />
              <VideoCardItem video={section.videos[2]} />
            </div>
          </div>
        </section>
      ))}

      {/* PROBLÈMES CIBLÉS */}
      <div style={{ padding: "80px clamp(20px,5vw,80px)" }}>
        <h2 style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 700, fontSize: "clamp(28px,5vw,40px)", color: "var(--encre)", marginBottom: 32, letterSpacing: "-0.02em" }}>
          Tu as un problème précis ?
        </h2>

        {PROBLEMS.map((problem, i) => {
          const isOpen = openProblem === i;
          return (
            <div key={problem.question} style={{ borderBottom: "1px solid var(--ligne)" }}>
              <button
                onClick={() => setOpenProblem(isOpen ? null : i)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0", cursor: "pointer", background: "none", border: "none", width: "100%", textAlign: "left" }}
              >
                <span style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 500, fontSize: 16, color: "var(--encre)" }}>
                  {problem.question}
                </span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transition: "transform 250ms ease", transform: isOpen ? "rotate(180deg)" : "none", flexShrink: 0 }}>
                  <path d="M4 6L8 10L12 6" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <div style={{ overflow: "hidden", maxHeight: isOpen ? 500 : 0, opacity: isOpen ? 1 : 0, transition: "max-height 300ms ease, opacity 300ms ease" }}>
                <div style={{ padding: "4px 0 20px", display: "flex", flexDirection: "column", gap: 10 }}>
                  {problem.drills.map(drill => (
                    <div key={drill.title} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <div style={{ width: 6, height: 6, minWidth: 6, borderRadius: "50%", background: "var(--bleu-piscine)", marginTop: 7 }} />
                      <div>
                        <strong style={{ fontFamily: "var(--font-dm-sans)", fontWeight: 500, fontSize: 14, color: "var(--encre)", display: "block", marginBottom: 2 }}>{drill.title}</strong>
                        <span style={{ fontSize: 14, color: "var(--gris-doux)", lineHeight: 1.6 }}>{drill.desc}</span>
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
