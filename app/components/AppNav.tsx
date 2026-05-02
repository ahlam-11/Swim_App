"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const S = {
  serif: { fontFamily: "var(--font-dm-serif)" } as const,
  sans:  { fontFamily: "var(--font-dm-sans)"  } as const,
  mono:  { fontFamily: "var(--font-space-mono)" } as const,
};

const navItems = [
  { href: "/generate", label: "Générer",      icon: "⚡" },
  { href: "/library",  label: "Bibliothèque", icon: "📚" },
  { href: "/history",  label: "Progression",  icon: "📈" },
  { href: "/login",    label: "Mon compte",   icon: "👤" },
];

export default function AppNav() {
  const pathname = usePathname();

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside
        className="hidden lg:flex"
        style={{
          width: 230,
          flexShrink: 0,
          borderRight: "1px solid var(--rule-light)",
          display: "flex",
          flexDirection: "column",
          padding: "32px 0",
          position: "sticky",
          top: 0,
          height: "100vh",
          background: "var(--surface)",
          overflowY: "auto",
        }}
      >
        {/* Logo */}
        <div style={{ padding: "0 24px", marginBottom: 44 }}>
          <Link href="/" style={{ ...S.serif, fontSize: 22, color: "var(--ink)", textDecoration: "none", letterSpacing: "-0.01em" }}>
            swim<span style={{ color: "var(--blue)" }}>gen</span>
          </Link>
          <div style={{ width: 24, height: 3, background: "var(--blue)", marginTop: 8, borderRadius: 2 }} />
        </div>

        {/* Nav */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {navItems.map(({ href, label, icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  padding: "11px 24px",
                  ...S.sans,
                  fontSize: 14,
                  letterSpacing: "0.01em",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  transition: "background 0.12s, color 0.12s",
                  background: active ? "var(--blue)" : "transparent",
                  color: active ? "#fff" : "var(--ink-soft)",
                  borderRadius: active ? "0 100px 100px 0" : 0,
                  marginRight: 16,
                }}
              >
                <span style={{ fontSize: 14 }}>{icon}</span>
                {label}
              </Link>
            );
          })}
        </nav>

        <div style={{ flex: 1 }} />

        {/* Back to home */}
        <div style={{ padding: "0 24px" }}>
          <Link href="/" style={{ ...S.sans, fontSize: 12, color: "var(--ink-faint)", textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
            ← Accueil
          </Link>
        </div>
      </aside>

      {/* ── Mobile bottom tab bar ── */}
      <div
        className="lg:hidden"
        style={{
          position: "fixed",
          bottom: 0, left: 0, right: 0,
          zIndex: 50,
          borderTop: "1px solid var(--rule-light)",
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(12px)",
          padding: "8px 0 16px",
          display: "flex",
        }}
      >
        {[{ href: "/", label: "Accueil", icon: "🏠" }, ...navItems].map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, textDecoration: "none" }}
            >
              <div style={{ width: 28, height: 3, background: active ? "var(--blue)" : "transparent", borderRadius: 2, marginBottom: 2, transition: "background 0.15s" }} />
              <span style={{ fontSize: 18 }}>{icon}</span>
              <span style={{ ...S.mono, fontSize: 7.5, letterSpacing: "0.06em", color: active ? "var(--blue)" : "var(--ink-faint)", transition: "color 0.15s" }}>
                {label.toUpperCase()}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
