// ─── LandingPage.jsx ──────────────────────────────────────────────────────────
// Home screen with animated background and portal card selection
import { useState } from "react";
import MatrixRain from "../components/MatrixRain";
import HexGrid    from "../components/HexGrid";

const STATS = [
  ["2",         "ROUNDS"],
  ["100",       "MAX TEAMS"],
  ["LIVE",      "SCORING"],
  ["REAL-TIME", "LEADERBOARD"],
];

const PORTALS = [
  {
    id:       "admin",
    icon:     "⚙",
    title:    "ADMIN PORTAL",
    desc:     "Manage teams, scores,\nresults & competition",
    tag:      "RESTRICTED ACCESS",
    activeColor: "#7c3aed",
    activeBg:    "rgba(124,58,237,0.1)",
    activeShadow:"rgba(124,58,237,0.3)",
  },
  {
    id:       "contestant",
    icon:     "🏆",
    title:    "TEAM PORTAL",
    desc:     "View live rankings,\nscores & leaderboard",
    tag:      "TEAM LOGIN",
    activeColor: "var(--mm-accent)",
    activeBg:    "rgba(0,212,255,0.08)",
    activeShadow:"rgba(0,212,255,0.25)",
  },
];

export default function LandingPage({ onAdminLogin, onContestantLogin }) {
  const [hovered, setHovered] = useState(null);

  const handlers = { admin: onAdminLogin, contestant: onContestantLogin };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      position: "relative", zIndex: 1, padding: "40px 20px",
    }}>
      <MatrixRain />
      <HexGrid />
      <div className="scanline-overlay" />

      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: 60, animation: "float-up 0.8s ease" }}>
        <div style={{ fontFamily: "var(--mm-mono)", fontSize: 11, letterSpacing: 8, color: "var(--mm-muted)", marginBottom: 12, textTransform: "uppercase" }}>
          &lt; PRESENTING &gt;
        </div>
        <h1 style={{
          fontFamily: "var(--mm-font)", fontSize: "clamp(36px, 8vw, 96px)",
          fontWeight: 900, letterSpacing: "0.05em", lineHeight: 1,
          background: "linear-gradient(135deg, #00d4ff 0%, #7c3aed 50%, #ff6b35 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text", marginBottom: 4,
        }}>
          MUTEX
        </h1>
        <h1 style={{
          fontFamily: "var(--mm-font)", fontSize: "clamp(36px, 8vw, 96px)",
          fontWeight: 900, letterSpacing: "0.1em", lineHeight: 1,
          background: "linear-gradient(135deg, #ff6b35 0%, #ffd700 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          backgroundClip: "text", marginBottom: 24,
        }}>
          MAYHEM
        </h1>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <div style={{ height: 1, width: 80, background: "linear-gradient(90deg, transparent, var(--mm-accent))" }} />
          <span style={{ fontFamily: "var(--mm-mono)", fontSize: 12, letterSpacing: 4, color: "var(--mm-muted)", textTransform: "uppercase" }}>
            Live Leaderboard System
          </span>
          <div style={{ height: 1, width: 80, background: "linear-gradient(90deg, var(--mm-accent), transparent)" }} />
        </div>
      </div>

      {/* Stats Strip */}
      <div style={{ display: "flex", gap: 32, marginBottom: 60, animation: "float-up 1s ease 0.2s both", flexWrap: "wrap", justifyContent: "center" }}>
        {STATS.map(([val, label]) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "var(--mm-font)", fontSize: 20, fontWeight: 700, color: "var(--mm-accent)" }}>{val}</div>
            <div style={{ fontFamily: "var(--mm-mono)", fontSize: 9, letterSpacing: 2, color: "var(--mm-muted)", textTransform: "uppercase" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Portal Cards */}
      <div style={{ display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center", animation: "float-up 1s ease 0.4s both" }}>
        {PORTALS.map(p => {
          const isHov = hovered === p.id;
          return (
            <div
              key={p.id}
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={handlers[p.id]}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === "Enter" && handlers[p.id]()}
              style={{
                width: 260, background: isHov ? p.activeBg : "var(--mm-surface)",
                border: `1px solid ${isHov ? p.activeColor : "var(--mm-border)"}`,
                padding: 32, cursor: "pointer",
                transition: "all 0.3s", textAlign: "center", position: "relative",
                boxShadow: isHov ? `0 0 32px ${p.activeShadow}` : "none",
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 16 }}>{p.icon}</div>
              <div style={{ fontFamily: "var(--mm-font)", fontSize: 14, letterSpacing: 2, color: isHov ? p.activeColor : "var(--mm-text)", marginBottom: 8 }}>
                {p.title}
              </div>
              <div style={{ fontFamily: "var(--mm-mono)", fontSize: 11, color: "var(--mm-muted)", lineHeight: 1.6, whiteSpace: "pre-line" }}>
                {p.desc}
              </div>
              <div style={{ marginTop: 20 }}>
                <span className="tag" style={{ borderColor: p.activeColor, color: p.activeColor }}>{p.tag}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: 60, fontFamily: "var(--mm-mono)", fontSize: 10, color: "var(--mm-muted)", letterSpacing: 2, animation: "float-up 1s ease 0.6s both" }}>
        &copy; MUTEX MAYHEM — COMPETITION MANAGEMENT SYSTEM
      </div>
    </div>
  );
}
