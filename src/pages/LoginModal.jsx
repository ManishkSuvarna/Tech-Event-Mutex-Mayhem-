// ─── LoginModal.jsx ───────────────────────────────────────────────────────────
// Authentication modal for both admin and contestant login
// BUG FIX: type is always a valid string ("admin"|"contestant") before this renders
import { useState } from "react";
import { ADMIN_CREDENTIALS } from "../data/seedData";
import { loadState } from "../db/storage";
import { SEED_TEAMS } from "../data/seedData";

export default function LoginModal({ type, onClose, onSuccess }) {
  const [user,    setUser]    = useState("");
  const [pass,    setPass]    = useState("");
  const [err,     setErr]     = useState("");
  const [loading, setLoading] = useState(false);

  const isAdmin = type === "admin";

  const handleLogin = () => {
    if (!user || !pass) { setErr("Please enter both username and password."); return; }
    setLoading(true);
    setErr("");

    // Simulate async auth (300ms)
    setTimeout(() => {
      if (isAdmin) {
        const admin = ADMIN_CREDENTIALS.find(a => a.username === user && a.password === pass);
        if (admin) { onSuccess(admin); }
        else        { setErr("Invalid admin credentials. Access denied."); }
      } else {
        const teams = loadState("teams", SEED_TEAMS);
        const team  = teams.find(t => t.username === user && t.password === pass);
        if (team) { onSuccess(team); }
        else       { setErr("Invalid team credentials. Please check your login."); }
      }
      setLoading(false);
    }, 400);
  };

  const accentColor = isAdmin ? "#7c3aed" : "var(--mm-accent)";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>{isAdmin ? "⚙" : "🏆"}</div>
          <div style={{ fontFamily: "var(--mm-font)", fontSize: 16, letterSpacing: 3, color: accentColor }}>
            {isAdmin ? "ADMIN ACCESS" : "TEAM LOGIN"}
          </div>
          <div style={{ fontFamily: "var(--mm-mono)", fontSize: 11, color: "var(--mm-muted)", marginTop: 6 }}>
            {isAdmin ? "Restricted — Authorized personnel only" : "Enter your team credentials"}
          </div>
        </div>

        {/* Form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <div style={{ fontFamily: "var(--mm-mono)", fontSize: 10, color: "var(--mm-muted)", letterSpacing: 2, marginBottom: 6 }}>USERNAME</div>
            <input
              id="login-username"
              className="mm-input"
              placeholder={isAdmin ? "admin username" : "team username"}
              value={user}
              onChange={e => setUser(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              autoFocus
              autoComplete="username"
            />
          </div>
          <div>
            <div style={{ fontFamily: "var(--mm-mono)", fontSize: 10, color: "var(--mm-muted)", letterSpacing: 2, marginBottom: 6 }}>PASSWORD</div>
            <input
              id="login-password"
              className="mm-input"
              type="password"
              placeholder="••••••••"
              value={pass}
              onChange={e => setPass(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
              autoComplete="current-password"
            />
          </div>

          {err && <div className="error-banner">⚠ {err}</div>}

          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button className="mm-btn"               style={{ flex: 1 }} onClick={onClose}>CANCEL</button>
            <button className="mm-btn mm-btn-success" style={{ flex: 1 }} onClick={handleLogin} disabled={loading}>
              {loading
                ? <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>◌</span>
                : "AUTHENTICATE"}
            </button>
          </div>
        </div>

        {/* Demo hint */}
        <div style={{
          marginTop: 16, padding: "10px 14px",
          background: isAdmin ? "rgba(124,58,237,0.03)" : "rgba(0,212,255,0.03)",
          border: "1px solid var(--mm-border)",
          fontFamily: "var(--mm-mono)", fontSize: 10, color: "var(--mm-muted)",
        }}>
          💡 Demo: <span style={{ color: accentColor }}>{isAdmin ? "admin1" : "binarybeasts"}</span>
          {" / "}
          <span style={{ color: accentColor }}>{isAdmin ? "admin123" : "team123"}</span>
        </div>
      </div>
    </div>
  );
}
