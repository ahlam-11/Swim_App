"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";

const NAV_ITEMS = [
  { href: "/generate",  label: "Générer" },
  { href: "/history",   label: "Séances" },
  { href: "/library",   label: "Apprendre" },
  { href: "/dashboard", label: "Tableau de bord" },
];

export default function AppNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <>
      {/* ── Fixed top nav ── */}
      <nav
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 100,
          height: 64,
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: `1px solid ${scrolled ? "var(--ligne)" : "transparent"}`,
          display: "flex",
          alignItems: "center",
          padding: "0 clamp(20px, 5vw, 80px)",
          transition: "border-color 200ms ease",
        }}
      >
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-fraunces)",
            fontStyle: "italic",
            fontWeight: 700,
            fontSize: 22,
            color: "var(--encre)",
            textDecoration: "none",
            letterSpacing: "-0.02em",
            marginRight: 40,
            flexShrink: 0,
          }}
        >
          swim
        </Link>

        {/* Desktop nav links */}
        <ul
          className="hidden lg:flex"
          style={{ listStyle: "none", margin: 0, padding: 0, flex: 1, gap: 32 }}
        >
          {NAV_ITEMS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  style={{
                    fontFamily: "var(--font-dm-sans)",
                    fontSize: 15,
                    color: active ? "var(--encre)" : "var(--gris-doux)",
                    textDecorationLine: active ? "underline" : "none",
                    textDecorationColor: "var(--bleu-piscine)",
                    textUnderlineOffset: "4px",
                    transition: "color 150ms",
                  }}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex-1 lg:hidden" />

        {session ? (
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: 14,
              fontWeight: 500,
              color: "var(--encre)",
              background: "none",
              border: "1.5px solid var(--encre)",
              borderRadius: 999,
              padding: "7px 18px",
              whiteSpace: "nowrap",
              flexShrink: 0,
              cursor: "pointer",
            }}
          >
            Déconnexion
          </button>
        ) : (
          <Link
            href="/login"
            style={{
              fontFamily: "var(--font-dm-sans)",
              fontSize: 14,
              fontWeight: 500,
              color: "var(--encre)",
              textDecoration: "none",
              border: "1.5px solid var(--encre)",
              borderRadius: 999,
              padding: "7px 18px",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            Connexion
          </Link>
        )}
      </nav>

      {/* ── Mobile bottom tab bar ── */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50"
        style={{
          borderTop: "1px solid var(--ligne)",
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(12px)",
          display: "flex",
          padding: "8px 0 16px",
        }}
      >
        {NAV_ITEMS.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 4,
                textDecoration: "none",
                paddingTop: 4,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 3,
                  background: active ? "var(--bleu-piscine)" : "transparent",
                  borderRadius: 2,
                  marginBottom: 2,
                  transition: "background 0.15s",
                }}
              />
              <span
                style={{
                  fontSize: 9,
                  letterSpacing: "0.06em",
                  fontFamily: "var(--font-dm-sans)",
                  fontWeight: 500,
                  color: active ? "var(--bleu-piscine)" : "var(--gris-doux)",
                  transition: "color 0.15s",
                  textTransform: "uppercase",
                }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
