"use client";

import Link from "next/link";
import { useState } from "react";

const F = "var(--font-fraunces), Georgia, serif";
const S = "var(--font-dm-sans), system-ui, sans-serif";

type Tab = "login" | "signup";
type StrengthLevel = { width: string; color: string; label: string };

const STRENGTHS: StrengthLevel[] = [
  { width: "20%",  color: "#EF4444", label: "Trop court" },
  { width: "40%",  color: "#F97316", label: "Faible"     },
  { width: "65%",  color: "#EAB308", label: "Moyen"      },
  { width: "85%",  color: "#22C55E", label: "Bon"        },
  { width: "100%", color: "#16A34A", label: "Excellent"  },
];

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M1 9s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="#9CA3AF" strokeWidth="1.3" />
      <circle cx="9" cy="9" r="2.5" stroke="#9CA3AF" strokeWidth="1.3" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M16.51 9.19c0-.57-.05-1.12-.14-1.65H9v3.12h4.2a3.59 3.59 0 01-1.56 2.36v1.96h2.52c1.47-1.35 2.35-3.34 2.35-5.79z" fill="#4285F4" />
      <path d="M9 17c2.1 0 3.86-.7 5.15-1.88l-2.52-1.96c-.7.47-1.59.75-2.63.75-2.02 0-3.73-1.37-4.34-3.2H2.06v2.01A8 8 0 009 17z" fill="#34A853" />
      <path d="M4.66 10.71A4.8 4.8 0 014.41 9c0-.59.1-1.16.25-1.71V5.28H2.06A8 8 0 001 9c0 1.3.31 2.52.86 3.6l2.58-1.93.22-.96z" fill="#FBBC05" />
      <path d="M9 3.84c1.14 0 2.16.39 2.96 1.16l2.22-2.22C12.85 1.49 11.1.75 9 .75A8 8 0 002.06 5.28l2.6 2.01C5.27 5.2 6.98 3.84 9 3.84z" fill="#EA4335" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
      <path d="M13.56 9.6c-.02-2.1 1.71-3.12 1.79-3.17C14.3 4.5 12.53 4.27 11.9 4.25c-1.4-.14-2.76.83-3.47.83-.72 0-1.8-.82-2.97-.8C3.96 4.3 2.6 5.13 1.86 6.44c-1.51 2.62-.39 6.49 1.07 8.62.72 1.04 1.57 2.2 2.69 2.16 1.08-.04 1.49-.7 2.8-.7 1.3 0 1.67.7 2.8.67 1.16-.02 1.9-1.05 2.6-2.1a9.5 9.5 0 001.19-2.42c-.03-.01-2.27-.87-2.3-3.07h-.15zm-2.16-5.64c.6-.72 1-1.72.89-2.72-.86.04-1.9.58-2.52 1.29-.55.63-.1 1.73.8 2.72.87-.03 1.23-.57 1.83-1.29z" fill="#111111" />
    </svg>
  );
}

function FormField({ label, labelRight, children }: { label: string; labelRight?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <label style={{ fontFamily: S, fontSize: 13, fontWeight: 500, color: "#111" }}>{label}</label>
        {labelRight}
      </div>
      {children}
    </div>
  );
}

function SocialButtons() {
  return (
    <>
      <button type="button" className="swim-btn-social">
        <GoogleIcon /> Continuer avec Google
      </button>
      <button type="button" className="swim-btn-social">
        <AppleIcon /> Continuer avec Apple
      </button>
    </>
  );
}

function Divider() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
      <div style={{ flex: 1, height: 1, background: "#E5E5E5" }} />
      <span style={{ fontFamily: S, fontSize: 12, color: "#9CA3AF", whiteSpace: "nowrap" }}>ou continuer avec</span>
      <div style={{ flex: 1, height: 1, background: "#E5E5E5" }} />
    </div>
  );
}

export default function LoginPage() {
  const [tab, setTab]                   = useState<Tab>("login");
  const [showLoginPwd, setShowLoginPwd] = useState(false);
  const [showSignupPwd, setShowSignupPwd] = useState(false);
  const [strength, setStrength]         = useState<StrengthLevel | null>(null);
  const [selectedLevel, setSelectedLevel] = useState("Débutant");

  const [loginEmail, setLoginEmail]   = useState("");
  const [loginPwd,   setLoginPwd]     = useState("");
  const [firstName,  setFirstName]    = useState("");
  const [lastName,   setLastName]     = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPwd,  setSignupPwd]    = useState("");

  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function switchTab(t: Tab) {
    setTab(t);
    setError("");
  }

  function checkStrength(val: string) {
    let score = 0;
    if (val.length >= 8)        score++;
    if (/[A-Z]/.test(val))      score++;
    if (/[0-9]/.test(val))      score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    setStrength(val ? STRENGTHS[Math.min(score, 4)] : null);
  }

  function handleLogin() {
    if (!loginEmail || !loginPwd) { setError("Merci de remplir tous les champs."); return; }
    if (!loginEmail.includes("@")) { setError("Email invalide."); return; }
    setError("");
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 900);
  }

  function handleSignup() {
    if (!firstName || !signupEmail || !signupPwd) { setError("Merci de remplir tous les champs obligatoires."); return; }
    if (signupPwd.length < 8) { setError("Le mot de passe doit contenir au moins 8 caractères."); return; }
    setError("");
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 1000);
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "100vh", fontFamily: S }}>

      {/* ── LEFT — visual ── */}
      <div className="hidden md:block" style={{ position: "relative", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1530549387789-4c1017266635?w=1200&q=80"
          alt=""
          aria-hidden
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(0,30,70,0.65) 0%, rgba(0,55,164,0.3) 100%)" }} />
        <div style={{ position: "relative", zIndex: 2, height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 48 }}>
          <Link href="/" style={{ fontFamily: F, fontStyle: "italic", fontWeight: 700, fontSize: 26, color: "#fff", textDecoration: "none" }}>
            swim
          </Link>
          <div>
            <p style={{ fontFamily: F, fontStyle: "italic", fontWeight: 700, fontSize: "clamp(28px, 3vw, 44px)", color: "#fff", lineHeight: 1.15, letterSpacing: "-0.02em", maxWidth: 420 }}>
              &ldquo;Chaque séance compte. Autant qu&apos;elle soit bien pensée.&rdquo;
            </p>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", marginTop: 12, fontFamily: S }}>
              Rejoins des milliers de nageurs qui s&apos;entraînent avec intention.
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT — form ── */}
      <div className="swim-login-form" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 80px", background: "#fff" }}>
        <div style={{ width: "100%", maxWidth: 380 }}>

          {success ? (
            /* Success state */
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "#D6E8F5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l5 5L20 7" stroke="#0055A4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 style={{ fontFamily: F, fontStyle: "italic", fontWeight: 700, fontSize: 26, color: "#111", marginBottom: 8 }}>
                Connexion réussie !
              </h3>
              <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.6, marginBottom: 28 }}>
                Bienvenue sur swim. Ta première séance t&apos;attend.
              </p>
              <Link href="/generate" className="swim-btn-submit" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                Créer une séance →
              </Link>
            </div>
          ) : (
            <>
              {/* Tab row */}
              <div style={{ display: "flex", borderBottom: "1px solid #E5E5E5", marginBottom: 40 }}>
                {(["login", "signup"] as Tab[]).map((t, i) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => switchTab(t)}
                    style={{
                      fontFamily: S, fontSize: 16, fontWeight: 400,
                      color: tab === t ? "#111" : "#9CA3AF",
                      padding: "12px 0", marginRight: 28,
                      background: "none",
                      border: "none",
                      borderBottom: `2px solid ${tab === t ? "#111" : "transparent"}`,
                      marginBottom: -1,
                      cursor: "pointer",
                      transition: "color 150ms",
                    }}
                  >
                    {i === 0 ? "Connexion" : "Créer un compte"}
                  </button>
                ))}
              </div>

              {error && (
                <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#DC2626", marginBottom: 20 }}>
                  {error}
                </div>
              )}

              {tab === "login" ? (
                /* Login panel */
                <div>
                  <h2 style={{ fontFamily: F, fontStyle: "italic", fontWeight: 700, fontSize: 32, color: "#111", marginBottom: 8, letterSpacing: "-0.02em" }}>
                    Bon retour.
                  </h2>
                  <p style={{ fontSize: 15, color: "#6B7280", marginBottom: 32, lineHeight: 1.5 }}>
                    Connecte-toi pour retrouver tes séances et ta progression.
                  </p>

                  <FormField label="Email">
                    <input
                      type="email"
                      placeholder="ton@email.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="swim-input"
                      autoComplete="email"
                    />
                  </FormField>

                  <FormField
                    label="Mot de passe"
                    labelRight={
                      <a href="#" style={{ fontSize: 13, color: "#6B7280", textDecoration: "none" }}>
                        Mot de passe oublié ?
                      </a>
                    }
                  >
                    <div style={{ position: "relative" }}>
                      <input
                        type={showLoginPwd ? "text" : "password"}
                        placeholder="••••••••"
                        value={loginPwd}
                        onChange={(e) => setLoginPwd(e.target.value)}
                        className="swim-input swim-input-pr"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPwd((v) => !v)}
                        style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 4, opacity: showLoginPwd ? 0.5 : 1 }}
                      >
                        <EyeIcon />
                      </button>
                    </div>
                  </FormField>

                  <button type="button" onClick={handleLogin} disabled={loading} className="swim-btn-submit">
                    {loading ? "Connexion…" : "Se connecter"}
                  </button>

                  <Divider />
                  <SocialButtons />

                  <p style={{ textAlign: "center", fontSize: 14, color: "#6B7280", marginTop: 24 }}>
                    Pas encore de compte ?{" "}
                    <button
                      type="button"
                      onClick={() => switchTab("signup")}
                      style={{ fontFamily: S, color: "#111", fontWeight: 500, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 2, fontSize: 14 }}
                    >
                      Créer un compte
                    </button>
                  </p>
                </div>
              ) : (
                /* Signup panel */
                <div>
                  <h2 style={{ fontFamily: F, fontStyle: "italic", fontWeight: 700, fontSize: 32, color: "#111", marginBottom: 8, letterSpacing: "-0.02em" }}>
                    Crée ton compte.
                  </h2>
                  <p style={{ fontSize: 15, color: "#6B7280", marginBottom: 32, lineHeight: 1.5 }}>
                    Rejoins swim et commence à nager avec intention.
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <FormField label="Prénom">
                      <input type="text" placeholder="Alex" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="swim-input" autoComplete="given-name" />
                    </FormField>
                    <FormField label="Nom">
                      <input type="text" placeholder="Dupont" value={lastName} onChange={(e) => setLastName(e.target.value)} className="swim-input" autoComplete="family-name" />
                    </FormField>
                  </div>

                  <FormField label="Email">
                    <input type="email" placeholder="ton@email.com" value={signupEmail} onChange={(e) => setSignupEmail(e.target.value)} className="swim-input" autoComplete="email" />
                  </FormField>

                  <FormField label="Mot de passe">
                    <div style={{ position: "relative" }}>
                      <input
                        type={showSignupPwd ? "text" : "password"}
                        placeholder="8 caractères minimum"
                        value={signupPwd}
                        onChange={(e) => { setSignupPwd(e.target.value); checkStrength(e.target.value); }}
                        className="swim-input swim-input-pr"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPwd((v) => !v)}
                        style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 4, opacity: showSignupPwd ? 0.5 : 1 }}
                      >
                        <EyeIcon />
                      </button>
                    </div>
                    {strength && (
                      <div style={{ marginTop: 8 }}>
                        <div style={{ height: 3, borderRadius: 2, background: "#E5E5E5", overflow: "hidden", marginBottom: 6 }}>
                          <div style={{ height: "100%", borderRadius: 2, background: strength.color, width: strength.width, transition: "width 300ms ease, background 300ms ease" }} />
                        </div>
                        <span style={{ fontSize: 11, color: strength.color }}>{strength.label}</span>
                      </div>
                    )}
                  </FormField>

                  <FormField label="Niveau de natation">
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                      {["Débutant", "Intermédiaire", "Avancé"].map((l) => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => setSelectedLevel(l)}
                          className={`swim-level-chip ${selectedLevel === l ? "active" : ""}`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </FormField>

                  <button type="button" onClick={handleSignup} disabled={loading} className="swim-btn-submit">
                    {loading ? "Création du compte…" : "Créer mon compte"}
                  </button>

                  <Divider />
                  <SocialButtons />

                  <p style={{ textAlign: "center", fontSize: 14, color: "#6B7280", marginTop: 24 }}>
                    Déjà un compte ?{" "}
                    <button
                      type="button"
                      onClick={() => switchTab("login")}
                      style={{ fontFamily: S, color: "#111", fontWeight: 500, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 2, fontSize: 14 }}
                    >
                      Se connecter
                    </button>
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
