"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const F = "var(--font-fraunces), Georgia, serif";
const S = "var(--font-dm-sans), system-ui, sans-serif";

const IMG = {
  hero:     "/swimmer_landing.webp",
  pool:     "https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=900&q=80",
  swimmer:  "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&q=80",
  nature:   "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=700&q=80",
  cta:      "https://images.unsplash.com/photo-1560090995-01632a28895b?w=1800&q=80",
};

const SEANCES = [
  { title: "Endurance Fondamentale", level: "Débutant",     nage: "Crawl",    duration: "1h00",  preview: "Échauff. 300m · Principal 800m · RC 200m",                    featured: false },
  { title: "Technique Crawl",         level: "Intermédiaire", nage: "Crawl",  duration: "1h15",  preview: "Échauff. 400m · Drills 600m · Principal 600m · RC 200m",     featured: false },
  { title: "Récupération Active",     level: "Tous niveaux", nage: "4 Nages", duration: "45min", preview: "Échauff. 200m · Mixte 800m · RC 200m",                        featured: false },
  { title: "Vitesse & Relances",      level: "Avancé",       nage: "Crawl",   duration: "1h30",  preview: "Échauff. 500m · Séries 1200m · RC 300m",                     featured: true  },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
      }),
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ background: "#fff", color: "#111", fontFamily: S }}>

      {/* ── NAV ── */}
      <nav
        className="swim-nav"
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
          background: "#fff", height: 64,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: scrolled ? "1px solid #E5E5E5" : "1px solid transparent",
          transition: "border-bottom 200ms ease",
        }}
      >
        <Link href="/" style={{ fontFamily: F, fontStyle: "italic", fontWeight: 700, fontSize: 22, color: "#111", textDecoration: "none", letterSpacing: "-0.02em" }}>
          swim
        </Link>

        <ul className="hidden md:flex" style={{ gap: 36, listStyle: "none", alignItems: "center", margin: 0, padding: 0 }}>
          {([["Générer", "/generate"], ["Séances", "/history"], ["Apprendre", "/library"]] as [string, string][]).map(([l, h]) => (
            <li key={h}>
              <Link href={h} className="swim-nav-link" style={{ fontFamily: S, fontWeight: 400, fontSize: 15, color: "#111", textDecoration: "none" }}>
                {l}
              </Link>
            </li>
          ))}
        </ul>

        <Link href="/login" className="swim-btn-ink" style={{ fontSize: 14, padding: "9px 20px" }}>
          Connexion
        </Link>
      </nav>

      {/* ── HERO ── */}
      <section style={{ height: "100vh", position: "relative", display: "flex", alignItems: "center", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={IMG.hero} alt="" aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.26) 100%)" }} />

        <div style={{
          position: "relative", zIndex: 2, padding: "0 80px", maxWidth: 700,
          opacity: 0, transform: "translateY(20px)",
          animation: "heroIn 600ms 200ms ease forwards",
        }}>
          <h1 style={{ fontFamily: F, fontStyle: "italic", fontWeight: 900, fontSize: "clamp(52px, 7vw, 88px)", color: "#fff", lineHeight: 1.05, marginBottom: 24, letterSpacing: "-0.02em" }}>
            Swim.<br />Nage avec intention.
          </h1>
          <p style={{ fontFamily: S, fontSize: 18, color: "rgba(255,255,255,0.85)", lineHeight: 1.65, maxWidth: 480, marginBottom: 36 }}>
            Génère des séances sur-mesure, exporte sur Garmin &amp; COROS,
            apprends chaque nage pas à pas.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/generate" className="swim-btn-white">Créer une séance</Link>
            <Link href="/history" className="swim-btn-ghost-white">Voir les séances prêtes</Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: "absolute", bottom: 40, left: 80, zIndex: 2,
          display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
          opacity: 0, animation: "heroIn 600ms 800ms ease forwards",
        }}>
          <span style={{ fontFamily: S, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.7)" }}>Scroll</span>
          <div style={{ width: 1, background: "rgba(255,255,255,0.5)", animation: "scrollLine 1.4s 1.2s ease-in-out infinite" }} />
        </div>
      </section>

      {/* ── EDITORIAL ── */}
      <section className="swim-editorial" style={{ padding: "140px 80px", background: "#fff" }}>
        <p className="reveal" style={{ fontFamily: F, fontStyle: "italic", fontWeight: 700, fontSize: "clamp(36px, 5vw, 64px)", color: "#111", maxWidth: 900, lineHeight: 1.15, letterSpacing: "-0.02em" }}>
          &ldquo;Pour ceux qui veulent nager mieux. Pas juste nager.&rdquo;
        </p>
      </section>

      <hr style={{ border: "none", borderTop: "1px solid #E5E5E5", margin: "0 80px" }} />

      {/* ── 3 AXES ── */}
      <section className="swim-axes" style={{ padding: "80px 80px 100px", background: "#fff" }}>
        <h2 className="reveal" style={{ fontFamily: F, fontStyle: "italic", fontWeight: 700, fontSize: 40, color: "#111", marginBottom: 56, letterSpacing: "-0.02em" }}>
          Tout ce qu&apos;il te faut pour progresser
        </h2>
        <div className="axes-grid">
          {[
            { img: IMG.pool,    title: "Générateur de séances",  desc: "Configure ton niveau, ta nage, ta durée. La séance se construit en quelques secondes, structurée et prête à l'export.", link: "Générer une séance →",      href: "/generate", ratio: "3/4" },
            { img: IMG.swimmer, title: "Export Garmin & COROS",  desc: "Retrouve ta séance directement sur ta montre, sans saisie manuelle. Format natif, compatible avec les deux plateformes.",  link: "Exporter une séance →",     href: "/generate", ratio: "4/3" },
            { img: IMG.nature,  title: "Bibliothèque éducative", desc: "Des vidéos sélectionnées par nage et par niveau. Technique, drills, conseils — ce qu'il faut pour vraiment progresser.", link: "Explorer la bibliothèque →", href: "/library",  ratio: "4/3" },
          ].map(({ img, title, desc, link, href, ratio }, i) => (
            <div key={title} className="reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt={title} loading="lazy" style={{ width: "100%", aspectRatio: ratio, objectFit: "cover", display: "block", marginBottom: 20 }} />
              <h3 style={{ fontFamily: F, fontStyle: "italic", fontWeight: 700, fontSize: 24, color: "#111", marginBottom: 10, lineHeight: 1.2, letterSpacing: "-0.01em" }}>
                {title}
              </h3>
              <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.65, marginBottom: 14 }}>{desc}</p>
              <Link href={href} className="swim-axe-link">{link}</Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── SPLIT ── */}
      <section className="swim-split">
        <div className="swim-split-text reveal-left" style={{ padding: "100px 80px", display: "flex", flexDirection: "column", justifyContent: "center", gap: 20, background: "#fff" }}>
          <span style={{ fontFamily: S, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6B7280" }}>
            Pourquoi c&apos;est différent
          </span>
          <h2 style={{ fontFamily: F, fontStyle: "italic", fontWeight: 700, fontSize: "clamp(32px, 3.5vw, 48px)", color: "#111", lineHeight: 1.15, letterSpacing: "-0.02em" }}>
            La séance est prête avant même d&apos;arriver au bassin.
          </h2>
          <div style={{ fontSize: 18, color: "#6B7280", lineHeight: 1.65, maxWidth: 400 }}>
            <p>Configure en 2 minutes. Exporte en 1 clic.</p>
            <p>Retrouve ta séance directement sur ta montre.</p>
          </div>
          <div style={{ marginTop: 8 }}>
            <Link href="/generate" className="swim-btn-primary">
              Créer ma première séance
            </Link>
          </div>
        </div>
        <div className="swim-split-img reveal-right" style={{ overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={IMG.hero} alt="Piscine couloirs" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </div>
      </section>

      {/* ── SÉANCES TEASER ── */}
      <section className="swim-seances" style={{ padding: "100px 80px", background: "#F5F5F3" }}>
        <div className="reveal" style={{ marginBottom: 40 }}>
          <span style={{ fontFamily: S, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#6B7280", display: "block", marginBottom: 12 }}>
            Séances prêtes à l&apos;emploi
          </span>
          <h2 style={{ fontFamily: F, fontStyle: "italic", fontWeight: 700, fontSize: 40, color: "#111", maxWidth: 500, lineHeight: 1.15, letterSpacing: "-0.02em", marginTop: 12 }}>
            Pas le temps de configurer ?<br />On a ce qu&apos;il te faut.
          </h2>
        </div>

        <div className="swim-seances-scroll" style={{ overflowX: "auto", margin: "0 -80px", padding: "0 80px 20px", scrollbarWidth: "none" }}>
          <div style={{ display: "flex", gap: 20, width: "max-content" }}>
            {SEANCES.map((s) => (
              <div key={s.title} className="swim-seance-card" style={{ background: "#fff", border: "1px solid #E5E5E5", borderRadius: 12, padding: 24, width: 280, flexShrink: 0 }}>
                <h3 style={{ fontFamily: F, fontStyle: "italic", fontWeight: 700, fontSize: 20, color: "#111", marginBottom: 12, lineHeight: 1.2 }}>
                  {s.title}
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", fontFamily: S, fontWeight: 500, fontSize: 12, background: s.featured ? "#0055A4" : "#D6E8F5", color: s.featured ? "#fff" : "#0055A4", padding: "4px 12px", borderRadius: 999 }}>{s.level}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", fontFamily: S, fontWeight: 500, fontSize: 12, background: "#D6E8F5", color: "#0055A4", padding: "4px 12px", borderRadius: 999 }}>{s.nage}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", fontFamily: S, fontWeight: 500, fontSize: 12, background: "#F5F5F3", color: "#6B7280", padding: "4px 12px", borderRadius: 999 }}>{s.duration}</span>
                </div>
                <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6, marginBottom: 20, borderTop: "1px solid #E5E5E5", paddingTop: 14 }}>{s.preview}</p>
                <Link href="/history" className="swim-btn-ghost" style={{ width: "100%", textAlign: "center", justifyContent: "center" }}>
                  Voir la séance
                </Link>
              </div>
            ))}
          </div>
        </div>

        <Link href="/history" className="swim-seances-more reveal">
          Voir toutes les séances →
        </Link>
      </section>

      {/* ── FULL CTA ── */}
      <section style={{ position: "relative", height: "70vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={IMG.cta} alt="" aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} />
        <div className="reveal" style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "0 40px" }}>
          <h2 style={{ fontFamily: F, fontStyle: "italic", fontWeight: 900, fontSize: "clamp(40px, 5vw, 64px)", color: "#fff", marginBottom: 16, letterSpacing: "-0.02em" }}>
            Prêt à nager ?
          </h2>
          <p style={{ fontSize: 18, color: "rgba(255,255,255,0.9)", marginBottom: 32, lineHeight: 1.5, fontFamily: S }}>
            Ta première séance est à deux minutes.
          </p>
          <Link href="/generate" className="swim-btn-white">Créer une séance</Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="swim-footer" style={{ background: "#fff", borderTop: "1px solid #E5E5E5", padding: "60px 80px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 40, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontFamily: F, fontStyle: "italic", fontWeight: 700, fontSize: 20, color: "#111" }}>swim</div>
          <p style={{ fontSize: 13, color: "#6B7280", marginTop: 8, lineHeight: 1.5 }}>
            Nage avec intention.<br />
            Ton entraînement, configuré et exporté en minutes.
          </p>
          <p style={{ fontSize: 11, color: "#9CA3AF", marginTop: 12, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Compatible Garmin &amp; COROS
          </p>
        </div>
        <ul style={{ display: "flex", gap: 32, listStyle: "none", alignItems: "flex-start", margin: 0, padding: 0, flexWrap: "wrap" }}>
          {([["Générer", "/generate"], ["Séances", "/history"], ["Apprendre", "/library"], ["Connexion", "/login"]] as [string, string][]).map(([l, h]) => (
            <li key={h}>
              <Link href={h} className="swim-footer-link">{l}</Link>
            </li>
          ))}
        </ul>
      </footer>

    </div>
  );
}
