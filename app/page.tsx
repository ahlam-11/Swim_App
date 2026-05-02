import Link from "next/link";

const S = {
  serif: { fontFamily: "var(--font-dm-serif)" } as const,
  sans:  { fontFamily: "var(--font-dm-sans)"  } as const,
  mono:  { fontFamily: "var(--font-space-mono)" } as const,
};

const P = {
  hero:    "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1600&auto=format&q=85",
  pool:    "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=900&auto=format&q=80",
  swimmer: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&auto=format&q=80",
  watch:   "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=900&auto=format&q=80",
  water:   "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1400&auto=format&q=80",
};

function Wave({ flip = false, fromColor, toColor }: { flip?: boolean; fromColor: string; toColor: string }) {
  return (
    <div style={{ lineHeight: 0, background: fromColor }}>
      <svg viewBox="0 0 1440 64" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 64 }}>
        <path
          d={flip
            ? "M0,32 C360,0 1080,64 1440,32 L1440,0 L0,0 Z"
            : "M0,32 C360,64 1080,0 1440,32 L1440,64 L0,64 Z"}
          fill={toColor}
        />
      </svg>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* ── Navigation ── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(255,255,255,0.94)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--rule-light)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 32px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ ...S.serif, fontSize: 22, letterSpacing: "-0.01em", color: "var(--ink)" }}>
            swim<span style={{ color: "var(--blue)" }}>gen</span>
          </span>
          <nav style={{ display: "flex", gap: 32 }}>
            {[["Générer", "/generate"], ["Bibliothèque", "/library"], ["Progression", "/history"]].map(([l, h]) => (
              <Link key={h} href={h} style={{ ...S.sans, fontSize: 14, color: "var(--ink-soft)", textDecoration: "none" }}>
                {l}
              </Link>
            ))}
          </nav>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Link href="/login" style={{ ...S.sans, fontSize: 14, color: "var(--ink-soft)", textDecoration: "none", padding: "8px 18px", border: "1px solid var(--rule)", borderRadius: 100 }}>
              Se connecter
            </Link>
            <Link href="/generate" className="btn-pill btn-blue-pill" style={{ fontSize: 14, padding: "10px 22px" }}>
              Commencer →
            </Link>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "flex-end", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={P.hero}
          alt=""
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 30%" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(175deg, rgba(5,18,60,0.18) 0%, rgba(5,18,60,0.68) 50%, rgba(8,25,85,0.94) 100%)" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "0 32px 88px", width: "100%" }}>
          <div className="au mono-label mono-label-white" style={{ marginBottom: 22 }}>
            Natation · Séances sur-mesure · Garmin & COROS
          </div>
          <h1 className="au d1" style={{ ...S.serif, fontSize: "clamp(60px, 8.5vw, 120px)", lineHeight: 1.0, letterSpacing: "-0.025em", color: "#fff", marginBottom: 24 }}>
            Nage avec<br />
            <em>intention.</em>
          </h1>
          <p className="au d2" style={{ ...S.sans, fontSize: 19, color: "rgba(255,255,255,0.75)", marginBottom: 40, maxWidth: 480, fontWeight: 300, lineHeight: 1.65 }}>
            Génère ta séance sur-mesure en 30 secondes.
            Export direct sur ta montre — Garmin ou COROS.
          </p>
          <div className="au d3" style={{ display: "flex", gap: 12 }}>
            <Link href="/generate" className="btn-pill btn-blue-pill">
              Générer ma séance →
            </Link>
            <Link href="/library" className="btn-pill btn-white-pill">
              Bibliothèque éducative
            </Link>
          </div>

          <div className="au d4" style={{ display: "flex", gap: 48, marginTop: 56, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.18)" }}>
            {[["4 nages", "couvertes"], ["Garmin + COROS", "export direct"], ["PDF", "impression bassin"], ["Cloud", "sync multi-appareils"]].map(([v, l]) => (
              <div key={l}>
                <div style={{ ...S.serif, fontSize: 22, color: "#fff", lineHeight: 1 }}>{v}</div>
                <div style={{ ...S.sans, fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 4, fontWeight: 300 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: "absolute", bottom: -1, left: 0, right: 0, zIndex: 2, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 64" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 64 }}>
            <path d="M0,32 C360,64 1080,0 1440,32 L1440,64 L0,64 Z" fill="var(--bg)" />
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CHIFFRES CLÉS
      ══════════════════════════════════════ */}
      <section style={{ background: "var(--blue)", padding: "52px 32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", textAlign: "center" }}>
          {[
            { n: "4",    label: "Nages couvertes",    sub: "Crawl · Dos · Brasse · Papillon" },
            { n: "100%", label: "Sur-mesure",          sub: "Séances adaptées à ton profil" },
            { n: "3",    label: "Formats d'export",    sub: "Garmin · COROS · PDF" },
          ].map(({ n, label, sub }, i) => (
            <div key={label} style={{ padding: "16px 32px", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.15)" : "none" }}>
              <div style={{ ...S.serif, fontSize: "clamp(44px, 5vw, 68px)", color: "#fff", lineHeight: 1, marginBottom: 8 }}>{n}</div>
              <div style={{ ...S.sans, fontSize: 15, color: "rgba(255,255,255,0.9)", fontWeight: 500, marginBottom: 4 }}>{label}</div>
              <div style={{ ...S.sans, fontSize: 13, color: "rgba(255,255,255,0.5)", fontWeight: 300 }}>{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          FONCTIONNALITÉS
      ══════════════════════════════════════ */}
      <Wave fromColor="var(--blue)" toColor="var(--bg)" />

      <section style={{ background: "var(--bg)", padding: "16px 32px 80px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div className="mono-label" style={{ marginBottom: 14 }}>Fonctionnalités</div>
            <h2 style={{ ...S.serif, fontSize: "clamp(34px, 4.5vw, 56px)", color: "var(--ink)", lineHeight: 1.05 }}>
              Tout ce qu&apos;il faut<br />
              <em>pour progresser.</em>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[
              { title: "Séances sur-mesure",        desc: "Configure ta nage, ton niveau et ton objectif. La séance s'adapte à toi, pas l'inverse.", photo: P.swimmer },
              { title: "Export Garmin · COROS · PDF", desc: "Un clic pour ta montre, ou génère un PDF optimisé pour le bord du bassin.", photo: P.watch },
              { title: "Compte & sync cloud",        desc: "Historique, favoris et stats sauvegardés. Accessibles depuis n'importe quel appareil.", photo: P.pool },
            ].map(({ title, desc, photo }) => (
              <div key={title} className="photo-card" style={{ borderRadius: 8, overflow: "hidden", boxShadow: "0 2px 20px rgba(0,0,0,0.08)" }}>
                <div style={{ position: "relative", height: 420 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo} alt={title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(5,18,60,0.04) 30%, rgba(5,18,60,0.82) 75%, rgba(5,18,60,0.97) 100%)" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "28px 24px" }}>
                    <h3 style={{ ...S.serif, fontSize: 24, color: "#fff", lineHeight: 1.2, marginBottom: 10 }}>{title}</h3>
                    <p style={{ ...S.sans, fontSize: 13, color: "rgba(255,255,255,0.68)", lineHeight: 1.55, fontWeight: 300 }}>{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          COMMENT ÇA MARCHE
      ══════════════════════════════════════ */}
      <Wave fromColor="var(--bg)" toColor="var(--blue-pale)" flip />

      <section style={{ background: "var(--blue-pale)", padding: "16px 32px 80px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 52 }}>
            <div>
              <div className="mono-label" style={{ marginBottom: 14 }}>Processus</div>
              <h2 style={{ ...S.serif, fontSize: "clamp(34px, 4.5vw, 56px)", color: "var(--ink)", lineHeight: 1.05 }}>
                Trois étapes.<br />
                <em>C&apos;est tout.</em>
              </h2>
            </div>
            <Link href="/generate" style={{ ...S.sans, fontSize: 14, color: "var(--blue)", textDecoration: "none" }}>
              Essayer maintenant →
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {[
              { step: "01", title: "Tu te connectes",          desc: "Crée ton profil. Tes séances et stats sont synchronisées sur tous tes appareils." },
              { step: "02", title: "La séance se génère",      desc: "Nage, niveau, objectif, durée. Une séance structurée, sauvegardée automatiquement." },
              { step: "03", title: "Tu exportes et tu nages",  desc: "Garmin, COROS ou PDF bord de bassin. Un clic, direction la piscine." },
            ].map(({ step, title, desc }) => (
              <div key={step} style={{
                padding: "32px",
                background: "var(--surface)",
                border: "1px solid var(--rule-light)",
                borderRadius: 8,
                borderTop: "3px solid var(--blue)",
              }}>
                <div style={{ ...S.mono, fontSize: 28, color: "var(--rule)", lineHeight: 1, marginBottom: 24 }}>{step}</div>
                <h3 style={{ ...S.serif, fontSize: 22, color: "var(--ink)", marginBottom: 12, lineHeight: 1.2 }}>{title}</h3>
                <p style={{ ...S.sans, fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.65, fontWeight: 300 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA FINAL
      ══════════════════════════════════════ */}
      <Wave fromColor="var(--blue-pale)" toColor="transparent" />

      <section style={{ position: "relative", overflow: "hidden", minHeight: 460, display: "flex", alignItems: "center" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={P.water} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(8,22,80,0.90) 0%, rgba(20,90,200,0.82) 100%)" }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "80px 32px", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 48 }}>
          <div>
            <div className="mono-label mono-label-white" style={{ marginBottom: 18 }}>Prêt ?</div>
            <h2 style={{ ...S.serif, fontSize: "clamp(34px, 4.5vw, 56px)", color: "#fff", lineHeight: 1.05, marginBottom: 16 }}>
              Générer ta première<br />
              <em>séance maintenant.</em>
            </h2>
            <p style={{ ...S.sans, fontSize: 16, color: "rgba(255,255,255,0.65)", fontWeight: 300, maxWidth: 400, lineHeight: 1.65 }}>
              Pas de compte requis pour commencer. L&apos;IA, quand tu en auras besoin, tournera côté serveur — ta clé ne sera jamais exposée.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, flexShrink: 0 }}>
            <Link href="/generate" className="btn-pill" style={{ fontSize: 16, padding: "16px 40px", background: "#fff", color: "var(--blue)", fontFamily: "var(--font-dm-sans)", fontWeight: 500, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 100 }}>
              Générer ma séance →
            </Link>
            <Link href="/library" className="btn-pill btn-white-pill" style={{ justifyContent: "center" }}>
              Voir la bibliothèque
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: "var(--ink)", padding: "32px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <span style={{ ...S.serif, fontSize: 20, color: "#fff" }}>swimgen</span>
          <div style={{ display: "flex", gap: 28 }}>
            {[["Générer", "/generate"], ["Bibliothèque", "/library"], ["Progression", "/history"], ["Connexion", "/login"]].map(([l, h]) => (
              <Link key={h} href={h} style={{ ...S.sans, fontSize: 13, color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>{l}</Link>
            ))}
          </div>
          <span style={{ ...S.mono, fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>MIT · 2026</span>
        </div>
      </footer>
    </div>
  );
}
