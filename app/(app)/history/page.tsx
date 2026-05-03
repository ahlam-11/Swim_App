"use client";

import { useState } from "react";
import Link from "next/link";

type Level = "debutant" | "intermediaire" | "avance";
type Nage = "crawl" | "dos" | "brasse" | "papillon" | "4nages";

interface PhaseRow { name: string; color: string; rows: string[]; }
interface Session {
  id: number; level: Level; nage: Nage; color: string;
  title: string; duration: string; distance: string;
  preview: string[];
  phases: PhaseRow[];
}

const LEVEL_MAP: Record<Level, string> = { debutant: "Débutant", intermediaire: "Intermédiaire", avance: "Avancé" };
const NAGE_MAP:  Record<Nage, string>  = { crawl: "Crawl", dos: "Dos", brasse: "Brasse", papillon: "Papillon", "4nages": "4 Nages" };

const SESSIONS: Session[] = [
  { id: 1,  level: "debutant",      nage: "crawl",    color: "#90CAF9", title: "Premier Kilomètre",     duration: "45min",  distance: "1 000m",
    preview: ["Échauff. 200m","Principal 600m","RC 200m"],
    phases: [{ name:"Échauffement",color:"#90CAF9",rows:["1×200m Crawl facile"]},{name:"Principal",color:"#0055A4",rows:["6×100m Crawl — 45s repos"]},{name:"Retour au calme",color:"#BBDEFB",rows:["1×200m Dos facile"]}] },
  { id: 2,  level: "debutant",      nage: "crawl",    color: "#90CAF9", title: "Endurance Fondamentale",duration: "1h00",   distance: "1 500m",
    preview: ["Échauff. 300m","Principal 1000m","RC 200m"],
    phases: [{name:"Échauffement",color:"#90CAF9",rows:["1×300m Crawl facile"]},{name:"Principal",color:"#0055A4",rows:["5×200m Crawl — 30s repos"]},{name:"Retour au calme",color:"#BBDEFB",rows:["1×200m 4 nages"]}] },
  { id: 3,  level: "debutant",      nage: "brasse",   color: "#64B5F6", title: "Brasse Débutant",       duration: "45min",  distance: "900m",
    preview: ["Échauff. 200m","Principal 500m","RC 200m"],
    phases: [{name:"Échauffement",color:"#90CAF9",rows:["1×200m Crawl"]},{name:"Principal",color:"#64B5F6",rows:["5×100m Brasse — 40s repos"]},{name:"Retour au calme",color:"#BBDEFB",rows:["1×200m Dos"]}] },
  { id: 4,  level: "debutant",      nage: "brasse",   color: "#64B5F6", title: "Brasse & Respiration",  duration: "1h00",   distance: "1 200m",
    preview: ["Échauff. 300m","Drills 400m","RC 200m"],
    phases: [{name:"Échauffement",color:"#90CAF9",rows:["1×300m Mixte"]},{name:"Drills",color:"#64B5F6",rows:["8×50m Brasse — focus jambes — 20s"]},{name:"Principal",color:"#0055A4",rows:["2×200m Brasse — 45s"]},{name:"Retour au calme",color:"#BBDEFB",rows:["1×200m Dos"]}] },
  { id: 5,  level: "debutant",      nage: "4nages",   color: "#B39DDB", title: "Découverte 4 Nages",    duration: "1h00",   distance: "1 200m",
    preview: ["Échauff. 200m","Principal 800m","RC 200m"],
    phases: [{name:"Échauffement",color:"#90CAF9",rows:["1×200m Crawl"]},{name:"Principal",color:"#B39DDB",rows:["4×200m 4 nages (50m chaque) — 1min repos"]},{name:"Retour au calme",color:"#BBDEFB",rows:["1×200m Crawl facile"]}] },
  { id: 6,  level: "intermediaire", nage: "crawl",    color: "#0055A4", title: "Endurance Progression", duration: "1h15",   distance: "2 400m",
    preview: ["Échauff. 400m","Principal 1600m","RC 400m"],
    phases: [{name:"Échauffement",color:"#90CAF9",rows:["1×400m Crawl — zones alternées"]},{name:"Principal",color:"#0055A4",rows:["4×400m Crawl — 40s repos","4×100m Sprint — 30s"]},{name:"Retour au calme",color:"#BBDEFB",rows:["1×400m 4 nages facile"]}] },
  { id: 7,  level: "intermediaire", nage: "crawl",    color: "#0055A4", title: "Technique Crawl",       duration: "1h15",   distance: "2 200m",
    preview: ["Échauff. 400m","Drills 600m","Principal 1000m"],
    phases: [{name:"Échauffement",color:"#90CAF9",rows:["1×400m Mixte"]},{name:"Drills",color:"#64B5F6",rows:["6×100m Drill bras — 20s","6×100m Kicking — 20s"]},{name:"Principal",color:"#0055A4",rows:["5×200m Crawl technique — 30s"]},{name:"Retour au calme",color:"#BBDEFB",rows:["1×200m Dos"]}] },
  { id: 8,  level: "intermediaire", nage: "dos",      color: "#4DB6AC", title: "Dos Intermédiaire",     duration: "1h00",   distance: "2 000m",
    preview: ["Échauff. 300m","Principal 1400m","RC 300m"],
    phases: [{name:"Échauffement",color:"#90CAF9",rows:["1×300m Crawl"]},{name:"Principal",color:"#4DB6AC",rows:["7×200m Dos — 30s repos"]},{name:"Retour au calme",color:"#BBDEFB",rows:["1×300m 4 nages"]}] },
  { id: 9,  level: "intermediaire", nage: "papillon", color: "#F48FB1", title: "Papillon & Ondulation", duration: "1h00",   distance: "1 800m",
    preview: ["Échauff. 400m","Drills 400m","Principal 800m"],
    phases: [{name:"Échauffement",color:"#90CAF9",rows:["1×400m Crawl + dos"]},{name:"Drills",color:"#F48FB1",rows:["8×50m Ondulation — 20s"]},{name:"Principal",color:"#0055A4",rows:["4×200m Papillon/Crawl — 45s"]},{name:"Retour au calme",color:"#BBDEFB",rows:["1×200m Dos facile"]}] },
  { id: 10, level: "avance",        nage: "crawl",    color: "#0055A4", title: "Vitesse & Relances",    duration: "1h30",   distance: "3 500m",
    preview: ["Échauff. 600m","Principal 2500m","RC 400m"],
    phases: [{name:"Échauffement",color:"#90CAF9",rows:["1×600m progressif"]},{name:"Principal",color:"#0055A4",rows:["10×100m — 1:30min départ","5×200m — 3min départ"]},{name:"Récupération active",color:"#64B5F6",rows:["4×100m Crawl facile — 20s"]},{name:"Retour au calme",color:"#BBDEFB",rows:["1×400m Dos"]}] },
  { id: 11, level: "intermediaire", nage: "4nages",   color: "#B39DDB", title: "Récupération Active",   duration: "45min",  distance: "1 400m",
    preview: ["Échauff. 200m","Principal 1000m","RC 200m"],
    phases: [{name:"Échauffement",color:"#90CAF9",rows:["1×200m Dos"]},{name:"Principal",color:"#B39DDB",rows:["5×200m 4 nages — très facile — 40s"]},{name:"Retour au calme",color:"#BBDEFB",rows:["1×200m Crawl lent"]}] },
  { id: 12, level: "avance",        nage: "4nages",   color: "#B39DDB", title: "IM Complet Avancé",     duration: "1h30",   distance: "3 800m",
    preview: ["Échauff. 600m","Drills 800m","Principal 1800m"],
    phases: [{name:"Échauffement",color:"#90CAF9",rows:["1×600m 4 nages"]},{name:"Drills",color:"#64B5F6",rows:["4×200m — 50 papillon/50 dos/50 brasse/50 crawl — 40s"]},{name:"Principal",color:"#0055A4",rows:["3×400m 4 nages — 1min30","6×100m sprint — 30s"]},{name:"Retour au calme",color:"#BBDEFB",rows:["1×600m facile"]}] },
];

export default function HistoryPage() {
  const [levelFilter, setLevelFilter] = useState<Level | "all">("all");
  const [nageFilter,  setNageFilter]  = useState<Nage  | "all">("all");
  const [modal,       setModal]       = useState<Session | null>(null);

  const filtered = SESSIONS.filter(s => {
    const lm = levelFilter === "all" || s.level === levelFilter;
    const nm = nageFilter  === "all" || s.nage  === nageFilter;
    return lm && nm;
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
          {([["all","Tous"],["debutant","Débutant"],["intermediaire","Intermédiaire"],["avance","Avancé"]] as [Level|"all", string][]).map(([v, label]) => (
            <button key={v} onClick={() => setLevelFilter(v)} className={`swim-chip${levelFilter === v ? " selected" : ""}`}>{label}</button>
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {([["all","Toutes"],["crawl","Crawl"],["dos","Dos"],["brasse","Brasse"],["papillon","Papillon"],["4nages","4 Nages"]] as [Nage|"all", string][]).map(([v, label]) => (
            <button key={v} onClick={() => setNageFilter(v)} className={`swim-chip${nageFilter === v ? " selected" : ""}`}>{label}</button>
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
            <div style={{ height: 4, background: s.color }} />
            <div style={{ padding: 24, flex: 1, display: "flex", flexDirection: "column" }}>
              <h3 style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 700, fontSize: 22, color: "var(--encre)", marginBottom: 12, lineHeight: 1.2, letterSpacing: "-0.01em" }}>
                {s.title}
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                <span style={badgeStyle()}>{LEVEL_MAP[s.level]}</span>
                <span style={badgeStyle()}>{NAGE_MAP[s.nage]}</span>
                <span style={badgeStyle(true)}>{s.duration}</span>
                <span style={badgeStyle(true)}>{s.distance}</span>
              </div>
              <p style={{ fontSize: 14, color: "var(--gris-doux)", lineHeight: 1.6, marginBottom: 20, flex: 1 }}>
                {s.preview.map((p, i) => (
                  <span key={p}>{p}{i < s.preview.length - 1 && <span style={{ margin: "0 6px", color: "#C4C4C4" }}>·</span>}</span>
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
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
              <span style={badgeStyle()}>{LEVEL_MAP[modal.level]}</span>
              <span style={badgeStyle()}>{NAGE_MAP[modal.nage]}</span>
              <span style={badgeStyle(true)}>{modal.duration}</span>
            </div>
            {modal.phases.map((phase, i) => (
              <div key={phase.name} style={{ padding: "16px 0", borderBottom: i < modal.phases.length - 1 ? "1px solid var(--ligne)" : "none", display: "flex", gap: 14 }}>
                <div style={{ width: 3, borderRadius: 2, background: phase.color, flexShrink: 0 }} />
                <div>
                  <span style={{ display: "block", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--gris-doux)", marginBottom: 8 }}>{phase.name}</span>
                  {phase.rows.map(row => (
                    <div key={row} style={{ fontSize: 14, color: "var(--encre)", lineHeight: 1.7 }}>{row}</div>
                  ))}
                </div>
              </div>
            ))}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--ligne)", gap: 16, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontFamily: "var(--font-fraunces)", fontStyle: "italic", fontWeight: 700, fontSize: 36, color: "var(--encre)" }}>{modal.distance}</div>
                <div style={{ fontSize: 13, color: "var(--gris-doux)", marginTop: 4 }}>Distance totale · {modal.duration}</div>
              </div>
              <button className="swim-btn-primary">Exporter vers ma montre</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
