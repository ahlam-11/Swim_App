import Link from "next/link";

const S = {
  serif: { fontFamily: "var(--font-dm-serif)" } as const,
  sans:  { fontFamily: "var(--font-dm-sans)"  } as const,
  mono:  { fontFamily: "var(--font-space-mono)" } as const,
};

/* Free Unsplash swimming photos */
const P = {
  hero:    "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1600&auto=format&q=85",
  pool:    "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=900&auto=format&q=80",
  swimmer: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&auto=format&q=80",
  coros:   "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=900&auto=format&q=80",
  water:   "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1400&auto=format&q=80",
};

function WaveDown({ fill = "var(--bg)" }: { fill?: string }) {
  return (
    <div style={{ lineHeight: 0, display: "block" }}>
      <svg viewBox="0 0 1440 72" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 72 }}>
        <path d="M0,36 C240,72 480,0 720,36 C960,72 1200,0 1440,36 L1440,72 L0,72 Z" fill={fill} />
      </svg>
    </div>
  );
}

function WaveUp({ fill = "var(--bg)" }: { fill?: string }) {
  return (
    <div style={{ lineHeight: 0, display: "block" }}>
      <svg viewBox="0 0 1440 72" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 72 }}>
        <path d="M0,36 C240,0 480,72 720,36 C960,0 1200,72 1440,36 L1440,0 L0,0 Z" fill={fill} />
      </svg>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* ── Sticky nav ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--rule-light)",
      }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ ...S.serif, fontSize: 24, letterSpacing: "-0.01em", color: "var(--ink)" }}>
            swim<span style={{ color: "var(--blue)" }}>gen</span>
          </span>
          <nav style={{ display: "flex", gap: 36 }}>
            {[["Générer", "/generate"], ["Bibliothèque", "/library"], ["Progression", "/history"]].map(([l, h]) => (
              <Link key={h} href={h} style={{ ...S.sans, fontSize: 14, color: "var(--ink-soft)", textDecoration: "none", transition: "color 0.15s" }}>
                {l}
              </Link>
            ))}
          </nav>
          <Link href="/generate" className="btn-pill btn-blue-pill" style={{ fontSize: 14, padding: "10px 24px" }}>
            Commencer →
          </Link>
        </div>
      </header>

      {/* ══════════════════════════════════════════
          HERO — plein écran avec photo piscine
      ══════════════════════════════════════════ */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", overflow: "hidden" }}>
        {/* Background photo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={P.hero}
          alt="Nageur en piscine"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }}
        />
        {/* Blue gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(170deg, rgba(5,20,70,0.25) 0%, rgba(5,20,70,0.75) 60%, rgba(10,30,100,0.92) 100%)" }} />

        {/* Content */}
        <div style={{ position: "relative", zIndex: 1, maxWidth: 1240, margin: "0 auto", padding: "0 32px 96px", width: "100%" }}>
          <div className="au mono-label mono-label-white" style={{ marginBottom: 24 }}>
            Natation · Séances sur-mesure · Garmin & COROS
          </div>
          <h1 className="au d1" style={{ ...S.serif, fontSize: "clamp(64px, 9vw, 130px)", lineHeight: 0.97, letterSpacing: "-0.025em", color: "#fff", marginBottom: 28 }}>
            Nage avec<br />
            <em>intention.</em>
          </h1>
          <p className="au d2" style={{ ...S.sans, fontSize: 20, color: "rgba(255,255,255,0.8)", marginBottom: 44, maxWidth: 500, fontWeight: 300, lineHeight: 1.6 }}>
            Génère ta séance sur-mesure en 30 secondes.
            <br />Export direct sur ta montre — Garmin ou COROS.
          </p>
          <div className="au d3" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/generate" className="btn-pill btn-blue-pill">
              Générer ma séance →
            </Link>
            <Link href="/library" className="btn-pill btn-white-pill">
              Bibliothèque éducative
            </Link>
          </div>

          {/* Floating stats */}
          <div className="au d4" style={{ display: "flex", gap: 40, marginTop: 64, paddingTop: 36, borderTop: "1px solid rgba(255,255,255,0.2)" }}>
            {[["4 nages", "couvertes"], ["30 sec", "pour générer"], ["Garmin + COROS", "export direct"]].map(([v, l]) => (
              <div key={l}>
                <div style={{ ...S.serif, fontSize: 26, color: "#fff", lineHeight: 1 }}>{v}</div>
                <div style={{ ...S.sans, fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 4, fontWeight: 300 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Wave at bottom */}
        <div style={{ position: "absolute", bottom: -2, left: 0, right: 0, zIndex: 2 }}>
          <WaveDown fill="var(--bg)" />
        </div>
      </section>

      {/* ══════════════════════════════════════════
          BANDE BLEUE — chiffres clés
      ══════════════════════════════════════════ */}
      <section style={{ background: "var(--blue)", padding: "56px 32px", marginTop: -2 }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, textAlign: "center" }}>
          {[
            { n: "4", label: "Nages couvertes", sub: "Crawl · Dos · Brasse · Papillon" },
            { n: "100%", label: "Sur-mesure", sub: "Séances adaptées à ton profil" },
            { n: "0€", label: "Backend requis", sub: "Tout tourne en local" },
          ].map(({ n, label, sub }) => (
            <div key={label} style={{ padding: "16px 0" }}>
              <div style={{ ...S.serif, fontSize: "clamp(48px, 5vw, 72px)", color: "#fff", lineHeight: 1, marginBottom: 8 }}>{n}</div>
              <div style={{ ...S.sans, fontSize: 16, color: "rgba(255,255,255,0.95)", fontWeight: 500, marginBottom: 4 }}>{label}</div>
              <div style={{ ...S.sans, fontSize: 13, color: "rgba(255,255,255,0.55)", fontWeight: 300 }}>{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURES — cartes photo
      ══════════════════════════════════════════ */}
      <div style={{ background: "var(--blue)", lineHeight: 0 }}>
        <WaveDown fill="var(--bg)" />
      </div>

      <section style={{ background: "var(--bg)", padding: "20px 32px 80px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="mono-label" style={{ marginBottom: 14, display: "block" }}>Fonctionnalités</div>
            <h2 style={{ ...S.serif, fontSize: "clamp(36px, 5vw, 60px)", color: "var(--ink)", lineHeight: 1.0 }}>
              Tout ce qu&apos;il faut<br />
              <em>pour progresser.</em>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[
              { n: "01", title: "Séances sur-mesure", desc: "Configure ta nage, ton niveau et ton objectif. La séance s'adapte à toi, pas l'inverse.", photo: P.swimmer },
              { n: "02", title: "Export vers ta montre", desc: "Un clic pour envoyer sur ta Garmin ou COROS. Prêt à nager.", photo: P.coros },
              { n: "03", title: "Bibliothèque éducative", desc: "Vidéos sélectionnées par compétence. Exercices ciblés par problème technique.", photo: P.pool },
            ].map(({ n, title, desc, photo }) => (
              <div key={n} className="photo-card" style={{ borderRadius: 4, overflow: "hidden" }}>
                {/* Photo */}
                <div style={{ position: "relative", height: 420 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo} alt={title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  {/* Overlay gradient */}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(5,20,70,0.05) 0%, rgba(5,20,70,0.80) 70%, rgba(5,20,70,0.95) 100%)" }} />
                  {/* Text */}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 24px" }}>
                    <div className="mono-label" style={{ color: "rgba(255,255,255,0.45)", marginBottom: 10 }}>{n}</div>
                    <h3 style={{ ...S.serif, fontSize: 26, color: "#fff", lineHeight: 1.15, marginBottom: 10 }}>{title}</h3>
                    <p style={{ ...S.sans, fontSize: 13, color: "rgba(255,255,255,0.72)", lineHeight: 1.55, fontWeight: 300 }}>{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          COMMENT ÇA MARCHE — fond bleu
      ══════════════════════════════════════════ */}
      <div style={{ background: "var(--bg)", lineHeight: 0 }}>
        <WaveUp fill="var(--blue-pale)" />
      </div>

      <section style={{ background: "var(--blue-pale)", padding: "20px 32px 80px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 56 }}>
            <div>
              <div className="mono-label" style={{ marginBottom: 14 }}>Processus</div>
              <h2 style={{ ...S.serif, fontSize: "clamp(36px, 5vw, 60px)", color: "var(--ink)", lineHeight: 1.0 }}>
                Trois étapes.<br />
                <em>C&apos;est tout.</em>
              </h2>
            </div>
            <Link href="/generate" style={{ ...S.sans, fontSize: 14, color: "var(--blue)", textDecoration: "none" }}>
              Essayer maintenant →
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {[
              { step: "01", emoji: "🎯", title: "Tu configures", desc: "Nage, niveau, objectif, durée. Trente secondes top chrono." },
              { step: "02", emoji: "⚡", title: "La séance se génère", desc: "Séries, temps de repos, consignes techniques. Structuré et adapté." },
              { step: "03", emoji: "⌚", title: "Tu exportes et tu nages", desc: "Un clic pour ta Garmin ou COROS. Direction le bassin." },
            ].map(({ step, emoji, title, desc }, i) => (
              <div key={step} style={{
                padding: "36px 32px",
                background: "var(--surface)",
                border: "1px solid var(--rule-light)",
                borderRadius: 4,
                borderTop: `4px solid var(--blue)`,
                boxShadow: "0 2px 16px rgba(26,107,219,0.06)",
              }}>
                <div style={{ fontSize: 36, marginBottom: 20 }}>{emoji}</div>
                <div style={{ ...S.mono, fontSize: 10, color: "var(--blue)", marginBottom: 12, letterSpacing: "0.12em" }}>{step}</div>
                <h3 style={{ ...S.serif, fontSize: 24, color: "var(--ink)", marginBottom: 12, lineHeight: 1.2 }}>{title}</h3>
                <p style={{ ...S.sans, fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.65, fontWeight: 300 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA — photo plein écran avec overlay
      ══════════════════════════════════════════ */}
      <div style={{ background: "var(--blue-pale)", lineHeight: 0 }}>
        <WaveDown fill="transparent" />
      </div>

      <section style={{ position: "relative", overflow: "hidden", minHeight: 480, display: "flex", alignItems: "center" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={P.water}
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(10,30,100,0.88) 0%, rgba(26,107,219,0.80) 100%)" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1240, margin: "0 auto", padding: "80px 32px", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 40 }}>
          <div>
            <div className="mono-label mono-label-white" style={{ marginBottom: 16 }}>Prêt ?</div>
            <h2 style={{ ...S.serif, fontSize: "clamp(36px, 5vw, 60px)", color: "#fff", lineHeight: 1.0, marginBottom: 16 }}>
              Générer ta première<br />
              <em>séance maintenant.</em>
            </h2>
            <p style={{ ...S.sans, fontSize: 17, color: "rgba(255,255,255,0.7)", fontWeight: 300, maxWidth: 420, lineHeight: 1.6 }}>
              Aucune inscription. Aucun abonnement. Juste toi, une piscine et une séance qui te correspond.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, flexShrink: 0 }}>
            <Link href="/generate" className="btn-pill btn-blue-pill" style={{ fontSize: 16, padding: "16px 40px", background: "#fff", color: "var(--blue)" }}>
              Générer ma séance →
            </Link>
            <Link href="/library" className="btn-pill btn-white-pill" style={{ justifyContent: "center" }}>
              Voir la bibliothèque
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: "var(--ink)", padding: "36px 32px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <span style={{ ...S.serif, fontSize: 20, color: "#fff" }}>swimgen</span>
          <div style={{ display: "flex", gap: 28 }}>
            {[["Générer", "/generate"], ["Bibliothèque", "/library"], ["Progression", "/history"]].map(([l, h]) => (
              <Link key={h} href={h} style={{ ...S.sans, fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>{l}</Link>
            ))}
          </div>
          <span style={{ ...S.mono, fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>MIT · 2026</span>
        </div>
      </footer>
    </div>
  );
}
