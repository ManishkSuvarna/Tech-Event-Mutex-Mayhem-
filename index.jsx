// Mutex Mayhem - Full Leaderboard Platform
// React + Full Auth + Admin/Contestant Sections + Charts + Animations

import { useState, useEffect, useRef, useCallback } from "react";

// ─── INITIAL DATA ────────────────────────────────────────────────────────────
const ADMIN_CREDENTIALS = [
  { id: 1, username: "admin1", password: "admin123", name: "Admin One" },
  { id: 2, username: "admin2", password: "admin123", name: "Admin Two" },
  { id: 3, username: "admin3", password: "admin456", name: "Admin Three" },
];

const SEED_TEAMS = [
  { id: 1, teamName: "Binary Beasts", teamNumber: "T001", username: "binarybeasts", password: "team123", round1: 87, round2: 92, likes: 5 },
  { id: 2, teamName: "Code Crushers", teamNumber: "T002", username: "codecrushers", password: "team123", round1: 95, round2: 88, likes: 3 },
  { id: 3, teamName: "Stack Overflow", teamNumber: "T003", username: "stackoverflow", password: "team123", round1: 78, round2: 95, likes: 7 },
  { id: 4, teamName: "Null Pointers", teamNumber: "T004", username: "nullpointers", password: "team123", round1: 82, round2: 79, likes: 2 },
  { id: 5, teamName: "Async Avengers", teamNumber: "T005", username: "asyncavengers", password: "team123", round1: 91, round2: 85, likes: 9 },
  { id: 6, teamName: "Git Gud", teamNumber: "T006", username: "gitgud", password: "team123", round1: 70, round2: 88, likes: 4 },
  { id: 7, teamName: "Dark Matter", teamNumber: "T007", username: "darkmatter", password: "team123", round1: 88, round2: 76, likes: 6 },
  { id: 8, teamName: "Debug Demons", teamNumber: "T008", username: "debugdemons", password: "team123", round1: 65, round2: 91, likes: 1 },
];

const SAVED_RESULTS = [
  { round: 1, first: "Code Crushers", second: "Async Avengers", third: "Binary Beasts" },
  { round: 2, first: "Stack Overflow", second: "Debug Demons", third: "Code Crushers" },
];

// ─── STORAGE HELPERS ─────────────────────────────────────────────────────────
const loadState = (key, fallback) => {
  try {
    const raw = localStorage.getItem("mm_" + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
};
const saveState = (key, val) => {
  try { localStorage.setItem("mm_" + key, JSON.stringify(val)); } catch {}
};

// ─── ANIMATIONS CSS ──────────────────────────────────────────────────────────
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=JetBrains+Mono:wght@300;400;600&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --mm-bg: #040810;
  --mm-surface: #080f1e;
  --mm-surface2: #0d1a2e;
  --mm-border: #1a3a5c;
  --mm-accent: #00d4ff;
  --mm-accent2: #ff6b35;
  --mm-accent3: #7c3aed;
  --mm-gold: #ffd700;
  --mm-silver: #c0c0c0;
  --mm-bronze: #cd7f32;
  --mm-green: #00ff88;
  --mm-red: #ff4444;
  --mm-text: #e0f0ff;
  --mm-muted: #5a7a9a;
  --mm-font: 'Orbitron', monospace;
  --mm-mono: 'JetBrains Mono', monospace;
}

body { background: var(--mm-bg); color: var(--mm-text); font-family: var(--mm-mono); }

@keyframes scanline {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 8px var(--mm-accent); }
  50% { box-shadow: 0 0 24px var(--mm-accent), 0 0 48px rgba(0,212,255,0.3); }
}
@keyframes flicker {
  0%, 90%, 100% { opacity: 1; }
  92% { opacity: 0.8; }
  94% { opacity: 1; }
  96% { opacity: 0.9; }
}
@keyframes float-up {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes matrix-rain {
  0% { transform: translateY(-100%); opacity: 1; }
  100% { transform: translateY(100vh); opacity: 0; }
}
@keyframes rank-change {
  0% { transform: scale(1.2); background: rgba(0,212,255,0.3); }
  100% { transform: scale(1); background: transparent; }
}
@keyframes crown-bounce {
  0%, 100% { transform: translateY(0) rotate(-5deg); }
  50% { transform: translateY(-6px) rotate(5deg); }
}
@keyframes bar-grow {
  from { width: 0; }
  to { width: var(--bar-w); }
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
@keyframes slide-in {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}
@keyframes like-pop {
  0% { transform: scale(1); }
  50% { transform: scale(1.5); }
  100% { transform: scale(1); }
}
@keyframes neon-pulse {
  0%, 100% { text-shadow: 0 0 7px var(--mm-accent), 0 0 10px var(--mm-accent); }
  50% { text-shadow: 0 0 20px var(--mm-accent), 0 0 40px var(--mm-accent), 0 0 80px rgba(0,212,255,0.5); }
}
@keyframes hex-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.mm-app {
  min-height: 100vh;
  background: var(--mm-bg);
  position: relative;
  overflow-x: hidden;
}

.scanline-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,212,255,0.015) 2px, rgba(0,212,255,0.015) 4px);
  pointer-events: none; z-index: 9999;
  animation: flicker 8s infinite;
}

.mm-btn {
  background: transparent;
  border: 1px solid var(--mm-accent);
  color: var(--mm-accent);
  font-family: var(--mm-font);
  font-size: 11px;
  letter-spacing: 2px;
  padding: 10px 20px;
  cursor: pointer;
  text-transform: uppercase;
  transition: all 0.2s;
  position: relative;
  overflow: hidden;
}
.mm-btn::before {
  content: '';
  position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0,212,255,0.15), transparent);
  transition: left 0.4s;
}
.mm-btn:hover::before { left: 100%; }
.mm-btn:hover { background: rgba(0,212,255,0.1); box-shadow: 0 0 16px rgba(0,212,255,0.4); }
.mm-btn:active { transform: scale(0.97); }

.mm-btn-danger { border-color: var(--mm-red); color: var(--mm-red); }
.mm-btn-danger:hover { background: rgba(255,68,68,0.1); box-shadow: 0 0 16px rgba(255,68,68,0.4); }

.mm-btn-success { border-color: var(--mm-green); color: var(--mm-green); }
.mm-btn-success:hover { background: rgba(0,255,136,0.1); box-shadow: 0 0 16px rgba(0,255,136,0.4); }

.mm-btn-orange { border-color: var(--mm-accent2); color: var(--mm-accent2); }
.mm-btn-orange:hover { background: rgba(255,107,53,0.1); }

.mm-input {
  background: var(--mm-surface2);
  border: 1px solid var(--mm-border);
  color: var(--mm-text);
  font-family: var(--mm-mono);
  font-size: 13px;
  padding: 10px 14px;
  width: 100%;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.mm-input:focus { border-color: var(--mm-accent); box-shadow: 0 0 8px rgba(0,212,255,0.2); }
.mm-input::placeholder { color: var(--mm-muted); }

.mm-select {
  background: var(--mm-surface2);
  border: 1px solid var(--mm-border);
  color: var(--mm-text);
  font-family: var(--mm-mono);
  font-size: 13px;
  padding: 10px 14px;
  width: 100%;
  outline: none;
  cursor: pointer;
  appearance: none;
}

.mm-card {
  background: var(--mm-surface);
  border: 1px solid var(--mm-border);
  padding: 20px;
  position: relative;
}
.mm-card::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 1px;
  background: linear-gradient(90deg, transparent, var(--mm-accent), transparent);
}

.panel-header {
  font-family: var(--mm-font);
  font-size: 11px;
  letter-spacing: 3px;
  color: var(--mm-accent);
  text-transform: uppercase;
  margin-bottom: 16px;
  display: flex; align-items: center; gap: 8px;
}
.panel-header::before {
  content: '//';
  color: var(--mm-muted);
}

.lb-row {
  display: grid;
  grid-template-columns: 40px 1fr 80px 80px 90px 60px;
  gap: 8px;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(26,58,92,0.5);
  transition: all 0.3s;
  cursor: default;
}
.lb-row:hover { background: rgba(0,212,255,0.04); }
.lb-row-header { color: var(--mm-muted); font-size: 10px; letter-spacing: 2px; }

.rank-badge {
  width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center;
  font-family: var(--mm-font);
  font-size: 12px; font-weight: 700;
  border: 1px solid var(--mm-border);
}

.tab-bar {
  display: flex; gap: 2px;
  border-bottom: 1px solid var(--mm-border);
  margin-bottom: 20px;
}
.tab {
  padding: 10px 20px;
  font-family: var(--mm-font);
  font-size: 10px;
  letter-spacing: 2px;
  cursor: pointer;
  color: var(--mm-muted);
  border: none; background: none;
  text-transform: uppercase;
  transition: all 0.2s;
  border-bottom: 2px solid transparent;
}
.tab.active { color: var(--mm-accent); border-bottom-color: var(--mm-accent); }
.tab:hover:not(.active) { color: var(--mm-text); }

.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(4,8,16,0.9);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}
.modal-box {
  background: var(--mm-surface);
  border: 1px solid var(--mm-accent);
  padding: 32px;
  width: 480px;
  max-width: 95vw;
  box-shadow: 0 0 40px rgba(0,212,255,0.2);
  animation: float-up 0.3s ease;
  position: relative;
}
.modal-box::before {
  content: '';
  position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, var(--mm-accent3), var(--mm-accent), var(--mm-accent2));
}

.timer-display {
  font-family: var(--mm-font);
  font-size: 32px;
  font-weight: 900;
  letter-spacing: 4px;
  animation: neon-pulse 2s ease-in-out infinite;
  color: var(--mm-accent);
}

.podium-item {
  display: flex; flex-direction: column; align-items: center;
  gap: 8px;
  animation: float-up 0.5s ease both;
}

.like-btn {
  background: none; border: 1px solid var(--mm-border);
  color: var(--mm-muted);
  cursor: pointer;
  padding: 4px 10px;
  font-size: 13px;
  transition: all 0.2s;
  display: flex; align-items: center; gap: 4px;
  font-family: var(--mm-mono);
}
.like-btn:hover { border-color: #ff4d8d; color: #ff4d8d; }
.like-btn.liked { border-color: #ff4d8d; color: #ff4d8d; animation: like-pop 0.3s ease; }

.scrollbar-thin::-webkit-scrollbar { width: 4px; }
.scrollbar-thin::-webkit-scrollbar-track { background: var(--mm-surface); }
.scrollbar-thin::-webkit-scrollbar-thumb { background: var(--mm-border); }
.scrollbar-thin::-webkit-scrollbar-thumb:hover { background: var(--mm-accent); }

.tag {
  display: inline-block;
  padding: 2px 8px;
  font-size: 10px;
  letter-spacing: 1px;
  border: 1px solid;
  font-family: var(--mm-mono);
}
`;

// ─── MATRIX RAIN CANVAS ──────────────────────────────────────────────────────
function MatrixRain() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const cols = Math.floor(canvas.width / 20);
    const drops = Array(cols).fill(1);
    const chars = "01アイウエオカキクケコ{}[]<>/\\#@$%^&*ABCDEFGHIJKLMNOP";
    let frame;
    const draw = () => {
      ctx.fillStyle = "rgba(4,8,16,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = "14px JetBrains Mono, monospace";
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const progress = y / (canvas.height / 14);
        const alpha = Math.max(0.05, 1 - progress * 0.8);
        ctx.fillStyle = i % 5 === 0
          ? `rgba(0,212,255,${alpha})`
          : `rgba(0,100,150,${alpha * 0.4})`;
        ctx.fillText(char, i * 20, y * 14);
        if (y * 14 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
      frame = requestAnimationFrame(draw);
    };
    draw();
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, opacity: 0.35, pointerEvents: "none", zIndex: 0 }} />;
}

// ─── HEX GRID BACKGROUND ────────────────────────────────────────────────────
function HexGrid() {
  return (
    <svg style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.04, pointerEvents: "none", zIndex: 0 }} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="hex" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
          <polygon points="30,2 58,17 58,35 30,50 2,35 2,17" fill="none" stroke="#00d4ff" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hex)" />
    </svg>
  );
}

// ─── UTILS ───────────────────────────────────────────────────────────────────
const totalScore = (t) => (t.round1 || 0) + (t.round2 || 0);
const sorted = (teams) => [...teams].sort((a, b) => totalScore(b) - totalScore(a));

function RankIcon({ rank }) {
  if (rank === 1) return <span style={{ fontSize: 18, animation: "crown-bounce 1.5s ease-in-out infinite" }}>👑</span>;
  if (rank === 2) return <span style={{ fontSize: 16 }}>🥈</span>;
  if (rank === 3) return <span style={{ fontSize: 16 }}>🥉</span>;
  if (rank <= 5) return <span style={{ fontSize: 14 }}>⭐</span>;
  return <span style={{ fontSize: 12, color: "var(--mm-muted)" }}>#{rank}</span>;
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage({ onAdminLogin, onContestantLogin }) {
  const [hovAdmin, setHovAdmin] = useState(false);
  const [hovTeam, setHovTeam] = useState(false);
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 1, padding: "40px 20px" }}>
      <MatrixRain />
      <HexGrid />
      <div className="scanline-overlay" />

      {/* Logo / Title */}
      <div style={{ textAlign: "center", marginBottom: 60, animation: "float-up 0.8s ease" }}>
        <div style={{ fontFamily: "var(--mm-mono)", fontSize: 11, letterSpacing: 8, color: "var(--mm-muted)", marginBottom: 12, textTransform: "uppercase" }}>
          &lt; PRESENTING &gt;
        </div>
        <h1 style={{
          fontFamily: "var(--mm-font)",
          fontSize: "clamp(36px, 8vw, 96px)",
          fontWeight: 900,
          letterSpacing: "0.05em",
          lineHeight: 1,
          background: "linear-gradient(135deg, #00d4ff 0%, #7c3aed 50%, #ff6b35 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          textShadow: "none",
          marginBottom: 8,
        }}>
          MUTEX
        </h1>
        <h1 style={{
          fontFamily: "var(--mm-font)",
          fontSize: "clamp(36px, 8vw, 96px)",
          fontWeight: 900,
          letterSpacing: "0.1em",
          lineHeight: 1,
          background: "linear-gradient(135deg, #ff6b35 0%, #ffd700 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginBottom: 24,
        }}>
          MAYHEM
        </h1>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
          <div style={{ height: 1, width: 80, background: "linear-gradient(90deg, transparent, var(--mm-accent))" }} />
          <span style={{ fontFamily: "var(--mm-mono)", fontSize: 12, letterSpacing: 4, color: "var(--mm-muted)", textTransform: "uppercase" }}>Live Leaderboard System</span>
          <div style={{ height: 1, width: 80, background: "linear-gradient(90deg, var(--mm-accent), transparent)" }} />
        </div>
      </div>

      {/* Stats Strip */}
      <div style={{ display: "flex", gap: 32, marginBottom: 60, animation: "float-up 1s ease 0.2s both" }}>
        {[["2", "ROUNDS"], ["100", "MAX TEAMS"], ["LIVE", "SCORING"], ["REAL-TIME", "LEADERBOARD"]].map(([val, label]) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "var(--mm-font)", fontSize: 20, fontWeight: 700, color: "var(--mm-accent)" }}>{val}</div>
            <div style={{ fontFamily: "var(--mm-mono)", fontSize: 9, letterSpacing: 2, color: "var(--mm-muted)", textTransform: "uppercase" }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Portal Cards */}
      <div style={{ display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center", animation: "float-up 1s ease 0.4s both" }}>
        {/* Admin Portal */}
        <div
          onMouseEnter={() => setHovAdmin(true)}
          onMouseLeave={() => setHovAdmin(false)}
          onClick={onAdminLogin}
          style={{
            width: 260,
            background: hovAdmin ? "rgba(124,58,237,0.1)" : "var(--mm-surface)",
            border: `1px solid ${hovAdmin ? "#7c3aed" : "var(--mm-border)"}`,
            padding: 32,
            cursor: "pointer",
            transition: "all 0.3s",
            textAlign: "center",
            position: "relative",
            boxShadow: hovAdmin ? "0 0 32px rgba(124,58,237,0.3)" : "none",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 16 }}>⚙</div>
          <div style={{ fontFamily: "var(--mm-font)", fontSize: 14, letterSpacing: 2, color: hovAdmin ? "#7c3aed" : "var(--mm-text)", marginBottom: 8 }}>ADMIN PORTAL</div>
          <div style={{ fontFamily: "var(--mm-mono)", fontSize: 11, color: "var(--mm-muted)", lineHeight: 1.6 }}>
            Manage teams, scores,<br />results & competition
          </div>
          <div style={{ marginTop: 20 }}>
            <span className="tag" style={{ borderColor: "#7c3aed", color: "#7c3aed" }}>RESTRICTED ACCESS</span>
          </div>
        </div>

        {/* Contestant Portal */}
        <div
          onMouseEnter={() => setHovTeam(true)}
          onMouseLeave={() => setHovTeam(false)}
          onClick={onContestantLogin}
          style={{
            width: 260,
            background: hovTeam ? "rgba(0,212,255,0.08)" : "var(--mm-surface)",
            border: `1px solid ${hovTeam ? "var(--mm-accent)" : "var(--mm-border)"}`,
            padding: 32,
            cursor: "pointer",
            transition: "all 0.3s",
            textAlign: "center",
            position: "relative",
            boxShadow: hovTeam ? "0 0 32px rgba(0,212,255,0.25)" : "none",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 16 }}>🏆</div>
          <div style={{ fontFamily: "var(--mm-font)", fontSize: 14, letterSpacing: 2, color: hovTeam ? "var(--mm-accent)" : "var(--mm-text)", marginBottom: 8 }}>TEAM PORTAL</div>
          <div style={{ fontFamily: "var(--mm-mono)", fontSize: 11, color: "var(--mm-muted)", lineHeight: 1.6 }}>
            View live rankings,<br />scores & leaderboard
          </div>
          <div style={{ marginTop: 20 }}>
            <span className="tag" style={{ borderColor: "var(--mm-accent)", color: "var(--mm-accent)" }}>TEAM LOGIN</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 60, fontFamily: "var(--mm-mono)", fontSize: 10, color: "var(--mm-muted)", letterSpacing: 2, animation: "float-up 1s ease 0.6s both" }}>
        &copy; MUTEX MAYHEM — COMPETITION MANAGEMENT SYSTEM
      </div>
    </div>
  );
}

// ─── LOGIN MODAL ──────────────────────────────────────────────────────────────
function LoginModal({ type, onClose, onSuccess }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const teams = loadState("teams", SEED_TEAMS);

  const handleLogin = () => {
    setLoading(true);
    setErr("");
    setTimeout(() => {
      if (type === "admin") {
        const admin = ADMIN_CREDENTIALS.find(a => a.username === user && a.password === pass);
        if (admin) { onSuccess(admin); }
        else { setErr("Invalid admin credentials. Access denied."); }
      } else {
        const team = teams.find(t => t.username === user && t.password === pass);
        if (team) { onSuccess(team); }
        else { setErr("Invalid team credentials. Please check your login."); }
      }
      setLoading(false);
    }, 600);
  };

  const isAdmin = type === "admin";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>{isAdmin ? "⚙" : "🏆"}</div>
          <div style={{ fontFamily: "var(--mm-font)", fontSize: 16, letterSpacing: 3, color: isAdmin ? "#7c3aed" : "var(--mm-accent)" }}>
            {isAdmin ? "ADMIN ACCESS" : "TEAM LOGIN"}
          </div>
          <div style={{ fontFamily: "var(--mm-mono)", fontSize: 11, color: "var(--mm-muted)", marginTop: 6 }}>
            {isAdmin ? "Restricted — Authorized personnel only" : "Enter your team credentials"}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <div style={{ fontFamily: "var(--mm-mono)", fontSize: 10, color: "var(--mm-muted)", letterSpacing: 2, marginBottom: 6 }}>USERNAME</div>
            <input className="mm-input" placeholder={isAdmin ? "admin username" : "team username"} value={user} onChange={e => setUser(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} autoFocus />
          </div>
          <div>
            <div style={{ fontFamily: "var(--mm-mono)", fontSize: 10, color: "var(--mm-muted)", letterSpacing: 2, marginBottom: 6 }}>PASSWORD</div>
            <input className="mm-input" type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} />
          </div>
          {err && <div style={{ fontFamily: "var(--mm-mono)", fontSize: 11, color: "var(--mm-red)", padding: "8px 12px", border: "1px solid var(--mm-red)", background: "rgba(255,68,68,0.05)" }}>⚠ {err}</div>}
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button className="mm-btn" style={{ flex: 1 }} onClick={onClose}>CANCEL</button>
            <button className="mm-btn mm-btn-success" style={{ flex: 1 }} onClick={handleLogin} disabled={loading}>
              {loading ? <span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>◌</span> : "AUTHENTICATE"}
            </button>
          </div>
        </div>

        {!isAdmin && (
          <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(0,212,255,0.03)", border: "1px solid var(--mm-border)", fontFamily: "var(--mm-mono)", fontSize: 10, color: "var(--mm-muted)" }}>
            💡 Demo: Use username <span style={{ color: "var(--mm-accent)" }}>binarybeasts</span> / password <span style={{ color: "var(--mm-accent)" }}>team123</span>
          </div>
        )}
        {isAdmin && (
          <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(124,58,237,0.03)", border: "1px solid var(--mm-border)", fontFamily: "var(--mm-mono)", fontSize: 10, color: "var(--mm-muted)" }}>
            💡 Demo: Use username <span style={{ color: "#7c3aed" }}>admin1</span> / password <span style={{ color: "#7c3aed" }}>admin123</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── LEADERBOARD COMPONENT (shared) ──────────────────────────────────────────
function Leaderboard({ teams, isAdmin, onLike, likedTeams }) {
  const ranked = sorted(teams);
  return (
    <div>
      <div className="lb-row lb-row-header" style={{ fontFamily: "var(--mm-font)", fontSize: 9 }}>
        <span>RANK</span>
        <span>TEAM</span>
        <span style={{ textAlign: "right" }}>ROUND 1</span>
        <span style={{ textAlign: "right" }}>ROUND 2</span>
        <span style={{ textAlign: "right" }}>TOTAL</span>
        <span style={{ textAlign: "center" }}>LIKES</span>
      </div>
      {ranked.map((team, i) => {
        const rank = i + 1;
        const total = totalScore(team);
        const isTop = rank <= 3;
        return (
          <div key={team.id} className="lb-row" style={{
            background: rank === 1 ? "rgba(255,215,0,0.03)" : rank === 2 ? "rgba(192,192,192,0.02)" : rank === 3 ? "rgba(205,127,50,0.02)" : "transparent",
            animation: `slide-in 0.3s ease ${i * 0.04}s both`,
          }}>
            <div className="rank-badge" style={{
              borderColor: rank === 1 ? "var(--mm-gold)" : rank === 2 ? "var(--mm-silver)" : rank === 3 ? "var(--mm-bronze)" : "var(--mm-border)",
              color: rank === 1 ? "var(--mm-gold)" : rank === 2 ? "var(--mm-silver)" : rank === 3 ? "var(--mm-bronze)" : "var(--mm-muted)",
            }}>
              <RankIcon rank={rank} />
            </div>
            <div>
              <div style={{ fontFamily: "var(--mm-mono)", fontSize: 13, color: isTop ? "var(--mm-text)" : "var(--mm-text)", fontWeight: isTop ? 600 : 400 }}>{team.teamName}</div>
              <div style={{ fontFamily: "var(--mm-mono)", fontSize: 10, color: "var(--mm-muted)" }}>{team.teamNumber}</div>
            </div>
            <div style={{ textAlign: "right", fontFamily: "var(--mm-font)", fontSize: 13, color: "var(--mm-accent)" }}>{team.round1 || 0}</div>
            <div style={{ textAlign: "right", fontFamily: "var(--mm-font)", fontSize: 13, color: "#7c3aed" }}>{team.round2 || 0}</div>
            <div style={{ textAlign: "right", fontFamily: "var(--mm-font)", fontSize: 15, fontWeight: 700, color: rank === 1 ? "var(--mm-gold)" : "var(--mm-text)" }}>{total}</div>
            <div style={{ textAlign: "center" }}>
              {!isAdmin ? (
                <button className={`like-btn ${likedTeams?.includes(team.id) ? "liked" : ""}`} onClick={() => onLike && onLike(team.id)}>
                  ♥ {team.likes || 0}
                </button>
              ) : (
                <span style={{ fontFamily: "var(--mm-mono)", fontSize: 12, color: "#ff4d8d" }}>♥ {team.likes || 0}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── PODIUM TOP 3 ────────────────────────────────────────────────────────────
function Podium({ teams }) {
  const top3 = sorted(teams).slice(0, 3);
  const [first, second, third] = top3;
  const heights = [120, 80, 60];
  const order = [second, first, third];
  const ranks = [2, 1, 3];
  const colors = ["var(--mm-silver)", "var(--mm-gold)", "var(--mm-bronze)"];
  const podiumH = [heights[1], heights[0], heights[2]];

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 8, padding: "24px 0 0" }}>
      {order.map((team, i) => team && (
        <div key={team.id} className="podium-item" style={{ animationDelay: `${i * 0.15}s` }}>
          <div style={{ textAlign: "center", marginBottom: 8 }}>
            <RankIcon rank={ranks[i]} />
            <div style={{ fontFamily: "var(--mm-font)", fontSize: 10, letterSpacing: 1, color: colors[i], marginTop: 4 }}>
              {team.teamName.split(" ").map(w => w[0]).join("").slice(0, 3)}
            </div>
            <div style={{ fontFamily: "var(--mm-font)", fontSize: 14, fontWeight: 700, color: colors[i] }}>
              {totalScore(team)}
            </div>
            <div style={{ fontFamily: "var(--mm-mono)", fontSize: 9, color: "var(--mm-muted)", maxWidth: 80, textAlign: "center" }}>
              {team.teamName}
            </div>
          </div>
          <div style={{
            width: 90,
            height: podiumH[i],
            background: `linear-gradient(180deg, ${colors[i]}22, ${colors[i]}08)`,
            border: `1px solid ${colors[i]}`,
            borderBottom: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <span style={{ fontFamily: "var(--mm-font)", fontSize: 24, fontWeight: 900, color: colors[i], opacity: 0.5 }}>
              {ranks[i]}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── BAR CHART ───────────────────────────────────────────────────────────────
function BarChart({ teams }) {
  const top8 = sorted(teams).slice(0, 8);
  const maxScore = Math.max(...top8.map(t => totalScore(t)), 1);

  return (
    <div style={{ padding: "8px 0" }}>
      <style>{`
        @keyframes bar-anim { from { transform: scaleX(0); } to { transform: scaleX(1); } }
      `}</style>
      {top8.map((team, i) => {
        const r1 = team.round1 || 0;
        const r2 = team.round2 || 0;
        const total = r1 + r2;
        const pct = (total / maxScore) * 100;
        return (
          <div key={team.id} style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 110, fontFamily: "var(--mm-mono)", fontSize: 10, color: "var(--mm-muted)", textAlign: "right", flexShrink: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {team.teamName}
            </div>
            <div style={{ flex: 1, height: 20, background: "var(--mm-surface2)", position: "relative", overflow: "hidden" }}>
              <div style={{
                position: "absolute", top: 0, left: 0, height: "60%", top: "20%",
                width: `${(r1 / maxScore) * 100}%`,
                background: "var(--mm-accent)",
                transformOrigin: "left",
                animation: `bar-anim 0.6s ease ${i * 0.06}s both`,
              }} />
              <div style={{
                position: "absolute", top: 0, left: `${(r1 / maxScore) * 100}%`, height: "60%", top: "20%",
                width: `${(r2 / maxScore) * 100}%`,
                background: "#7c3aed",
                transformOrigin: "left",
                animation: `bar-anim 0.6s ease ${i * 0.06 + 0.1}s both`,
              }} />
            </div>
            <div style={{ width: 36, fontFamily: "var(--mm-font)", fontSize: 11, color: "var(--mm-text)", textAlign: "right", flexShrink: 0 }}>
              {total}
            </div>
          </div>
        );
      })}
      <div style={{ display: "flex", gap: 16, marginTop: 12, fontFamily: "var(--mm-mono)", fontSize: 10, color: "var(--mm-muted)" }}>
        <span><span style={{ color: "var(--mm-accent)" }}>■</span> Round 1</span>
        <span><span style={{ color: "#7c3aed" }}>■</span> Round 2</span>
      </div>
    </div>
  );
}

// ─── RADAR / SCATTER CHART (Round comparison) ────────────────────────────────
function ScatterChart({ teams }) {
  const top10 = sorted(teams).slice(0, 10);
  const maxVal = Math.max(...top10.flatMap(t => [t.round1 || 0, t.round2 || 0]), 100);
  const W = 280, H = 240, PAD = 36;
  const scaleX = (v) => PAD + ((v / maxVal) * (W - PAD * 2));
  const scaleY = (v) => H - PAD - ((v / maxVal) * (H - PAD * 2));

  const colors = ["#00d4ff", "#7c3aed", "#ff6b35", "#ffd700", "#00ff88", "#ff4d8d", "#c0c0c0", "#60a5fa", "#f59e0b", "#34d399"];

  const gridLines = [0, 25, 50, 75, 100];

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      {/* Grid */}
      {gridLines.map(g => (
        <g key={g}>
          <line x1={PAD} y1={scaleY(g)} x2={W - PAD} y2={scaleY(g)} stroke="rgba(26,58,92,0.6)" strokeWidth="0.5" />
          <line x1={scaleX(g)} y1={PAD} x2={scaleX(g)} y2={H - PAD} stroke="rgba(26,58,92,0.6)" strokeWidth="0.5" />
          <text x={PAD - 4} y={scaleY(g) + 4} textAnchor="end" fontSize="9" fill="rgba(90,122,154,0.8)">{g}</text>
          <text x={scaleX(g)} y={H - PAD + 14} textAnchor="middle" fontSize="9" fill="rgba(90,122,154,0.8)">{g}</text>
        </g>
      ))}
      {/* Diagonal guide (R1 = R2) */}
      <line x1={scaleX(0)} y1={scaleY(0)} x2={scaleX(maxVal)} y2={scaleY(maxVal)} stroke="rgba(0,212,255,0.15)" strokeWidth="0.5" strokeDasharray="4,4" />
      {/* Axis labels */}
      <text x={W / 2} y={H - 4} textAnchor="middle" fontSize="9" fill="var(--mm-accent)" letterSpacing="1">ROUND 1</text>
      <text x={12} y={H / 2} textAnchor="middle" fontSize="9" fill="#7c3aed" letterSpacing="1" transform={`rotate(-90, 12, ${H / 2})`}>ROUND 2</text>
      {/* Points */}
      {top10.map((team, i) => {
        const cx = scaleX(team.round1 || 0);
        const cy = scaleY(team.round2 || 0);
        return (
          <g key={team.id}>
            <circle cx={cx} cy={cy} r="6" fill={colors[i]} opacity="0.8" />
            <circle cx={cx} cy={cy} r="10" fill={colors[i]} opacity="0.15" />
            <text x={cx + 10} y={cy + 4} fontSize="8" fill={colors[i]} opacity="0.9">{team.teamName.split(" ")[0]}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── TIMER ───────────────────────────────────────────────────────────────────
function Timer({ label, initialSeconds, onUpdate, editable }) {
  const [secs, setSecs] = useState(initialSeconds || 0);
  const [running, setRunning] = useState(false);
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const intRef = useRef(null);

  useEffect(() => {
    if (running) {
      intRef.current = setInterval(() => setSecs(s => {
        if (s <= 0) { setRunning(false); return 0; }
        return s - 1;
      }), 1000);
    }
    return () => clearInterval(intRef.current);
  }, [running]);

  const fmt = (s) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    if (h > 0) return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return (
    <div style={{ textAlign: "center", padding: "16px", background: "var(--mm-surface2)", border: "1px solid var(--mm-border)" }}>
      <div style={{ fontFamily: "var(--mm-mono)", fontSize: 10, letterSpacing: 3, color: "var(--mm-muted)", marginBottom: 8, textTransform: "uppercase" }}>{label}</div>
      {editing ? (
        <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "center" }}>
          <input className="mm-input" style={{ width: 100, textAlign: "center" }} placeholder="seconds" value={inputVal} onChange={e => setInputVal(e.target.value)} />
          <button className="mm-btn mm-btn-success" style={{ padding: "8px 12px", fontSize: 10 }} onClick={() => { setSecs(parseInt(inputVal) || 0); setEditing(false); }}>SET</button>
        </div>
      ) : (
        <div className="timer-display" style={{ color: secs < 60 && secs > 0 ? "var(--mm-red)" : secs === 0 ? "var(--mm-muted)" : "var(--mm-accent)" }}>
          {fmt(secs)}
        </div>
      )}
      {editable && !editing && (
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12 }}>
          <button className="mm-btn" style={{ padding: "6px 14px", fontSize: 9 }} onClick={() => setRunning(r => !r)}>{running ? "⏸ PAUSE" : "▶ START"}</button>
          <button className="mm-btn" style={{ padding: "6px 14px", fontSize: 9 }} onClick={() => { setRunning(false); setSecs(0); }}>⏹ RESET</button>
          <button className="mm-btn" style={{ padding: "6px 14px", fontSize: 9 }} onClick={() => setEditing(true)}>✎ SET</button>
        </div>
      )}
    </div>
  );
}

// ─── RESULTS SECTION ─────────────────────────────────────────────────────────
function ResultsSection({ results, teams, editable, onSave }) {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});

  const startEdit = (r) => {
    setEditing(r.round);
    setForm({ first: r.first, second: r.second, third: r.third });
  };

  const save = () => {
    onSave && onSave(editing, form);
    setEditing(null);
  };

  const teamNames = teams.map(t => t.teamName);

  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      {results.map((r) => (
        <div key={r.round} style={{ flex: 1, minWidth: 220, background: "var(--mm-surface2)", border: "1px solid var(--mm-border)", padding: 20, position: "relative" }}>
          <div className="panel-header" style={{ fontSize: 10 }}>ROUND {r.round} RESULTS</div>
          {editing === r.round ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {["first", "second", "third"].map((pos) => (
                <div key={pos}>
                  <div style={{ fontFamily: "var(--mm-mono)", fontSize: 9, color: "var(--mm-muted)", letterSpacing: 2, marginBottom: 4 }}>{pos.toUpperCase()}</div>
                  <select className="mm-select" value={form[pos] || ""} onChange={e => setForm(f => ({ ...f, [pos]: e.target.value }))}>
                    <option value="">-- Select Team --</option>
                    {teamNames.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              ))}
              <div style={{ display: "flex", gap: 8 }}>
                <button className="mm-btn mm-btn-success" style={{ flex: 1, padding: "8px", fontSize: 9 }} onClick={save}>SAVE</button>
                <button className="mm-btn" style={{ flex: 1, padding: "8px", fontSize: 9 }} onClick={() => setEditing(null)}>CANCEL</button>
              </div>
            </div>
          ) : (
            <>
              {[["🥇", "1ST", r.first, "var(--mm-gold)"], ["🥈", "2ND", r.second, "var(--mm-silver)"], ["🥉", "3RD", r.third, "var(--mm-bronze)"]].map(([ico, lbl, val, col]) => (
                <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 20 }}>{ico}</span>
                  <div>
                    <div style={{ fontFamily: "var(--mm-mono)", fontSize: 9, color: "var(--mm-muted)", letterSpacing: 2 }}>{lbl} PLACE</div>
                    <div style={{ fontFamily: "var(--mm-font)", fontSize: 12, color: col }}>{val || "—"}</div>
                  </div>
                </div>
              ))}
              {editable && <button className="mm-btn" style={{ width: "100%", marginTop: 8, fontSize: 9, padding: "8px" }} onClick={() => startEdit(r)}>✎ EDIT RESULTS</button>}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── ADMIN DASHBOARD ─────────────────────────────────────────────────────────
function AdminDashboard({ admin, onLogout }) {
  const [teams, setTeams] = useState(() => loadState("teams", SEED_TEAMS));
  const [results, setResults] = useState(() => loadState("results", SAVED_RESULTS));
  const [activeTab, setActiveTab] = useState("leaderboard");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTeam, setEditTeam] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [scoreTeamId, setScoreTeamId] = useState("");
  const [scoreR1, setScoreR1] = useState("");
  const [scoreR2, setScoreR2] = useState("");
  const [toast, setToast] = useState(null);

  const persist = (t) => { setTeams(t); saveState("teams", t); };
  const persistResults = (r) => { setResults(r); saveState("results", r); };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  const handleUpdateScore = () => {
    if (!scoreTeamId) return;
    const updated = teams.map(t => t.id === parseInt(scoreTeamId) ? {
      ...t,
      round1: scoreR1 !== "" ? parseInt(scoreR1) : t.round1,
      round2: scoreR2 !== "" ? parseInt(scoreR2) : t.round2,
    } : t);
    persist(updated);
    setScoreTeamId(""); setScoreR1(""); setScoreR2("");
    showToast("Scores updated successfully!");
  };

  const handleDeleteTeam = (id) => {
    persist(teams.filter(t => t.id !== id));
    setDeleteConfirm(null);
    showToast("Team removed.", "danger");
  };

  const handleSaveResults = (round, form) => {
    const updated = results.map(r => r.round === round ? { ...r, ...form } : r);
    persistResults(updated);
    showToast("Results saved!");
  };

  const selectedTeam = teams.find(t => t.id === parseInt(scoreTeamId));

  const tabs = [
    { id: "leaderboard", label: "Leaderboard" },
    { id: "scores", label: "Manage Scores" },
    { id: "teams", label: "Teams" },
    { id: "timer", label: "Timer" },
    { id: "charts", label: "Analytics" },
    { id: "results", label: "Results" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--mm-bg)", position: "relative" }}>
      <HexGrid />
      <div className="scanline-overlay" />
      <style>{GLOBAL_CSS}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 2000,
          background: toast.type === "danger" ? "rgba(255,68,68,0.15)" : "rgba(0,255,136,0.1)",
          border: `1px solid ${toast.type === "danger" ? "var(--mm-red)" : "var(--mm-green)"}`,
          color: toast.type === "danger" ? "var(--mm-red)" : "var(--mm-green)",
          fontFamily: "var(--mm-mono)", fontSize: 12,
          padding: "12px 20px",
          animation: "float-up 0.3s ease",
          boxShadow: `0 0 20px ${toast.type === "danger" ? "rgba(255,68,68,0.2)" : "rgba(0,255,136,0.2)"}`,
        }}>
          {toast.type === "danger" ? "⚠ " : "✓ "}{toast.msg}
        </div>
      )}

      {/* Top Bar */}
      <div style={{ background: "var(--mm-surface)", borderBottom: "1px solid var(--mm-border)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontFamily: "var(--mm-font)", fontSize: 14, letterSpacing: 3, color: "#7c3aed" }}>MUTEX MAYHEM</div>
          <span className="tag" style={{ borderColor: "#7c3aed", color: "#7c3aed" }}>ADMIN</span>
          <span style={{ fontFamily: "var(--mm-mono)", fontSize: 11, color: "var(--mm-muted)" }}>Welcome, {admin.name}</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontFamily: "var(--mm-mono)", fontSize: 10, color: "var(--mm-muted)" }}>{teams.length} / 100 teams</span>
          <button className="mm-btn mm-btn-danger" style={{ padding: "6px 16px", fontSize: 9 }} onClick={onLogout}>LOGOUT</button>
        </div>
      </div>

      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px", position: "relative", zIndex: 1 }}>
        {/* Podium */}
        <div className="mm-card" style={{ marginBottom: 24 }}>
          <div className="panel-header">TOP PERFORMERS</div>
          <Podium teams={teams} />
        </div>

        {/* Tab Nav */}
        <div className="tab-bar">
          {tabs.map(t => (
            <button key={t.id} className={`tab ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {/* LEADERBOARD TAB */}
        {activeTab === "leaderboard" && (
          <div className="mm-card">
            <div className="panel-header">LIVE LEADERBOARD — {teams.length} TEAMS</div>
            <Leaderboard teams={teams} isAdmin={true} />
          </div>
        )}

        {/* MANAGE SCORES TAB */}
        {activeTab === "scores" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
            <div className="mm-card">
              <div className="panel-header">UPDATE SCORES</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div>
                  <div style={{ fontFamily: "var(--mm-mono)", fontSize: 10, color: "var(--mm-muted)", letterSpacing: 2, marginBottom: 6 }}>SELECT TEAM</div>
                  <select className="mm-select" value={scoreTeamId} onChange={e => setScoreTeamId(e.target.value)}>
                    <option value="">-- Choose Team --</option>
                    {sorted(teams).map(t => (
                      <option key={t.id} value={t.id}>{t.teamNumber} — {t.teamName}</option>
                    ))}
                  </select>
                </div>
                {selectedTeam && (
                  <div style={{ padding: "12px", background: "rgba(0,212,255,0.03)", border: "1px solid var(--mm-border)", fontFamily: "var(--mm-mono)", fontSize: 11 }}>
                    Current: R1={selectedTeam.round1 || 0} / R2={selectedTeam.round2 || 0} / Total={totalScore(selectedTeam)}
                  </div>
                )}
                <div>
                  <div style={{ fontFamily: "var(--mm-mono)", fontSize: 10, color: "var(--mm-muted)", letterSpacing: 2, marginBottom: 6 }}>ROUND 1 SCORE</div>
                  <input className="mm-input" type="number" placeholder="0–100" min="0" max="100" value={scoreR1} onChange={e => setScoreR1(e.target.value)} />
                </div>
                <div>
                  <div style={{ fontFamily: "var(--mm-mono)", fontSize: 10, color: "var(--mm-muted)", letterSpacing: 2, marginBottom: 6 }}>ROUND 2 SCORE</div>
                  <input className="mm-input" type="number" placeholder="0–100" min="0" max="100" value={scoreR2} onChange={e => setScoreR2(e.target.value)} />
                </div>
                <button className="mm-btn mm-btn-success" onClick={handleUpdateScore}>UPDATE SCORES</button>
              </div>
            </div>
            <div className="mm-card">
              <div className="panel-header">ALL TEAMS — QUICK EDIT</div>
              <div className="scrollbar-thin" style={{ maxHeight: 460, overflowY: "auto" }}>
                {sorted(teams).map((team, i) => (
                  <TeamScoreRow key={team.id} team={team} rank={i + 1} onSave={(id, r1, r2) => {
                    const updated = teams.map(t => t.id === id ? { ...t, round1: r1, round2: r2 } : t);
                    persist(updated);
                    showToast("Score updated!");
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TEAMS TAB */}
        {activeTab === "teams" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
            <div className="mm-card">
              <div className="panel-header">ADD TEAM</div>
              <AddTeamForm teams={teams} onAdd={(team) => {
                if (teams.length >= 100) { showToast("Max 100 teams reached.", "danger"); return; }
                const newTeam = { ...team, id: Date.now(), round1: 0, round2: 0, likes: 0 };
                persist([...teams, newTeam]);
                showToast(`Team "${team.teamName}" added!`);
              }} />
            </div>
            <div className="mm-card">
              <div className="panel-header">TEAM ROSTER — {teams.length} TEAMS</div>
              <div className="scrollbar-thin" style={{ maxHeight: 460, overflowY: "auto" }}>
                {teams.map((team) => (
                  <TeamRow key={team.id} team={team}
                    onEdit={(t) => setEditTeam(t)}
                    onDelete={(id) => setDeleteConfirm(id)} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TIMER TAB */}
        {activeTab === "timer" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="mm-card">
              <div className="panel-header">ROUND 1 TIMER</div>
              <Timer label="WEB ROUND" initialSeconds={3600} editable={true} />
            </div>
            <div className="mm-card">
              <div className="panel-header">ROUND 2 TIMER</div>
              <Timer label="DSA ROUND" initialSeconds={5400} editable={true} />
            </div>
          </div>
        )}

        {/* CHARTS TAB */}
        {activeTab === "charts" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="mm-card">
              <div className="panel-header">SCORE DISTRIBUTION — BAR</div>
              <BarChart teams={teams} />
            </div>
            <div className="mm-card">
              <div className="panel-header">R1 vs R2 PERFORMANCE — SCATTER</div>
              <ScatterChart teams={teams} />
            </div>
          </div>
        )}

        {/* RESULTS TAB */}
        {activeTab === "results" && (
          <div className="mm-card">
            <div className="panel-header">PUBLISHED RESULTS</div>
            <ResultsSection results={results} teams={teams} editable={true} onSave={handleSaveResults} />
          </div>
        )}
      </div>

      {/* Edit Team Modal */}
      {editTeam && (
        <EditTeamModal team={editTeam} onClose={() => setEditTeam(null)} onSave={(updated) => {
          persist(teams.map(t => t.id === updated.id ? updated : t));
          setEditTeam(null);
          showToast("Team updated!");
        }} />
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ width: 360 }}>
            <div style={{ textAlign: "center", fontFamily: "var(--mm-font)", fontSize: 14, color: "var(--mm-red)", marginBottom: 16 }}>CONFIRM DELETE</div>
            <div style={{ fontFamily: "var(--mm-mono)", fontSize: 12, color: "var(--mm-muted)", textAlign: "center", marginBottom: 24 }}>
              This will permanently remove the team and all their scores.
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="mm-btn" style={{ flex: 1 }} onClick={() => setDeleteConfirm(null)}>CANCEL</button>
              <button className="mm-btn mm-btn-danger" style={{ flex: 1 }} onClick={() => handleDeleteTeam(deleteConfirm)}>DELETE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TeamScoreRow({ team, rank, onSave }) {
  const [r1, setR1] = useState(team.round1 || 0);
  const [r2, setR2] = useState(team.round2 || 0);
  const [editing, setEditing] = useState(false);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "32px 1fr 80px 80px 80px", gap: 8, alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(26,58,92,0.4)" }}>
      <span style={{ fontFamily: "var(--mm-font)", fontSize: 11, color: "var(--mm-muted)" }}>#{rank}</span>
      <div>
        <div style={{ fontFamily: "var(--mm-mono)", fontSize: 12 }}>{team.teamName}</div>
        <div style={{ fontFamily: "var(--mm-mono)", fontSize: 10, color: "var(--mm-muted)" }}>{team.teamNumber}</div>
      </div>
      {editing ? (
        <>
          <input className="mm-input" type="number" value={r1} onChange={e => setR1(parseInt(e.target.value) || 0)} style={{ padding: "6px 8px", fontSize: 12, textAlign: "center" }} />
          <input className="mm-input" type="number" value={r2} onChange={e => setR2(parseInt(e.target.value) || 0)} style={{ padding: "6px 8px", fontSize: 12, textAlign: "center" }} />
          <button className="mm-btn mm-btn-success" style={{ padding: "6px", fontSize: 9 }} onClick={() => { onSave(team.id, r1, r2); setEditing(false); }}>✓</button>
        </>
      ) : (
        <>
          <span style={{ fontFamily: "var(--mm-font)", fontSize: 12, color: "var(--mm-accent)", textAlign: "center" }}>{team.round1 || 0}</span>
          <span style={{ fontFamily: "var(--mm-font)", fontSize: 12, color: "#7c3aed", textAlign: "center" }}>{team.round2 || 0}</span>
          <button className="mm-btn" style={{ padding: "6px", fontSize: 9 }} onClick={() => setEditing(true)}>✎</button>
        </>
      )}
    </div>
  );
}

function TeamRow({ team, onEdit, onDelete }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid rgba(26,58,92,0.4)" }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "var(--mm-mono)", fontSize: 13, color: "var(--mm-text)" }}>{team.teamName}</div>
        <div style={{ fontFamily: "var(--mm-mono)", fontSize: 10, color: "var(--mm-muted)" }}>{team.teamNumber} · @{team.username}</div>
      </div>
      <div style={{ display: "flex", gap: 12, fontFamily: "var(--mm-mono)", fontSize: 11 }}>
        <span style={{ color: "var(--mm-accent)" }}>R1:{team.round1 || 0}</span>
        <span style={{ color: "#7c3aed" }}>R2:{team.round2 || 0}</span>
        <span style={{ color: "var(--mm-gold)" }}>∑{totalScore(team)}</span>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button className="mm-btn mm-btn-orange" style={{ padding: "6px 12px", fontSize: 9 }} onClick={() => onEdit(team)}>EDIT</button>
        <button className="mm-btn mm-btn-danger" style={{ padding: "6px 12px", fontSize: 9 }} onClick={() => onDelete(team.id)}>DEL</button>
      </div>
    </div>
  );
}

function AddTeamForm({ teams, onAdd }) {
  const [form, setForm] = useState({ teamName: "", teamNumber: "", username: "", password: "" });
  const [err, setErr] = useState("");
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const submit = () => {
    if (!form.teamName || !form.teamNumber || !form.username || !form.password) { setErr("All fields required."); return; }
    if (teams.find(t => t.username === form.username)) { setErr("Username already exists."); return; }
    if (teams.find(t => t.teamNumber === form.teamNumber)) { setErr("Team number already exists."); return; }
    onAdd(form);
    setForm({ teamName: "", teamNumber: "", username: "", password: "" });
    setErr("");
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {[["teamName", "TEAM NAME"], ["teamNumber", "TEAM NUMBER"], ["username", "USERNAME"], ["password", "PASSWORD"]].map(([k, lbl]) => (
        <div key={k}>
          <div style={{ fontFamily: "var(--mm-mono)", fontSize: 9, color: "var(--mm-muted)", letterSpacing: 2, marginBottom: 4 }}>{lbl}</div>
          <input className="mm-input" type={k === "password" ? "password" : "text"} placeholder={lbl.toLowerCase()} value={form[k]} onChange={e => set(k, e.target.value)} />
        </div>
      ))}
      {err && <div style={{ fontFamily: "var(--mm-mono)", fontSize: 11, color: "var(--mm-red)" }}>⚠ {err}</div>}
      <button className="mm-btn mm-btn-success" onClick={submit}>+ ADD TEAM</button>
    </div>
  );
}

function EditTeamModal({ team, onClose, onSave }) {
  const [form, setForm] = useState({ ...team });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="panel-header" style={{ justifyContent: "center" }}>EDIT TEAM — {team.teamNumber}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {[["teamName", "TEAM NAME"], ["teamNumber", "TEAM NUMBER"], ["username", "USERNAME"], ["password", "PASSWORD"]].map(([k, lbl]) => (
            <div key={k}>
              <div style={{ fontFamily: "var(--mm-mono)", fontSize: 9, color: "var(--mm-muted)", letterSpacing: 2, marginBottom: 4 }}>{lbl}</div>
              <input className="mm-input" type={k === "password" ? "password" : "text"} value={form[k] || ""} onChange={e => set(k, e.target.value)} />
            </div>
          ))}
          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button className="mm-btn" style={{ flex: 1 }} onClick={onClose}>CANCEL</button>
            <button className="mm-btn mm-btn-success" style={{ flex: 1 }} onClick={() => onSave(form)}>SAVE</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── CONTESTANT DASHBOARD ────────────────────────────────────────────────────
function ContestantDashboard({ contestant, onLogout }) {
  const [teams, setTeams] = useState(() => loadState("teams", SEED_TEAMS));
  const [results] = useState(() => loadState("results", SAVED_RESULTS));
  const [likedTeams, setLikedTeams] = useState(() => loadState(`likes_${contestant.id}`, []));
  const [activeTab, setActiveTab] = useState("leaderboard");

  // Refresh teams every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setTeams(loadState("teams", SEED_TEAMS));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLike = (teamId) => {
    const already = likedTeams.includes(teamId);
    let newLiked;
    if (already) {
      newLiked = likedTeams.filter(id => id !== teamId);
    } else {
      newLiked = [...likedTeams, teamId];
    }
    setLikedTeams(newLiked);
    saveState(`likes_${contestant.id}`, newLiked);

    const updated = teams.map(t => t.id === teamId ? { ...t, likes: Math.max(0, (t.likes || 0) + (already ? -1 : 1)) } : t);
    setTeams(updated);
    saveState("teams", updated);
  };

  const myTeam = teams.find(t => t.id === contestant.id);
  const myRank = sorted(teams).findIndex(t => t.id === contestant.id) + 1;

  const tabs = [
    { id: "leaderboard", label: "Leaderboard" },
    { id: "my-scores", label: "My Scores" },
    { id: "charts", label: "Analytics" },
    { id: "results", label: "Results" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "var(--mm-bg)", position: "relative" }}>
      <HexGrid />
      <div className="scanline-overlay" />
      <style>{GLOBAL_CSS}</style>

      {/* Top Bar */}
      <div style={{ background: "var(--mm-surface)", borderBottom: "1px solid var(--mm-border)", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative", zIndex: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontFamily: "var(--mm-font)", fontSize: 14, letterSpacing: 3, color: "var(--mm-accent)" }}>MUTEX MAYHEM</div>
          <span className="tag" style={{ borderColor: "var(--mm-accent)", color: "var(--mm-accent)" }}>TEAM</span>
          <span style={{ fontFamily: "var(--mm-mono)", fontSize: 11, color: "var(--mm-muted)" }}>{contestant.teamName}</span>
          <span className="tag" style={{ borderColor: "var(--mm-muted)", color: "var(--mm-muted)" }}>{contestant.teamNumber}</span>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <span style={{ fontFamily: "var(--mm-mono)", fontSize: 10, color: "var(--mm-muted)" }}>
            LIVE · Updates every 5s
          </span>
          <button className="mm-btn mm-btn-danger" style={{ padding: "6px 16px", fontSize: 9 }} onClick={onLogout}>LOGOUT</button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px", position: "relative", zIndex: 1 }}>
        {/* My Stats */}
        {myTeam && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
            {[
              ["RANK", `#${myRank}`, myRank <= 3 ? "var(--mm-gold)" : "var(--mm-accent)"],
              ["ROUND 1", myTeam.round1 || 0, "var(--mm-accent)"],
              ["ROUND 2", myTeam.round2 || 0, "#7c3aed"],
              ["TOTAL", totalScore(myTeam), "var(--mm-green)"],
            ].map(([lbl, val, col]) => (
              <div key={lbl} style={{ background: "var(--mm-surface)", border: "1px solid var(--mm-border)", padding: "16px", textAlign: "center", position: "relative" }}>
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${col}, transparent)` }} />
                <div style={{ fontFamily: "var(--mm-mono)", fontSize: 10, color: "var(--mm-muted)", letterSpacing: 2, marginBottom: 6 }}>{lbl}</div>
                <div style={{ fontFamily: "var(--mm-font)", fontSize: 28, fontWeight: 700, color: col }}>{val}</div>
              </div>
            ))}
          </div>
        )}

        {/* Podium */}
        <div className="mm-card" style={{ marginBottom: 24 }}>
          <div className="panel-header">TOP 3 TEAMS</div>
          <Podium teams={teams} />
        </div>

        {/* Tab Nav */}
        <div className="tab-bar">
          {tabs.map(t => (
            <button key={t.id} className={`tab ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}>{t.label}</button>
          ))}
        </div>

        {activeTab === "leaderboard" && (
          <div className="mm-card">
            <div className="panel-header">LIVE RANKINGS — ♥ SUPPORT YOUR FAVORITES</div>
            <Leaderboard teams={teams} isAdmin={false} onLike={handleLike} likedTeams={likedTeams} />
          </div>
        )}

        {activeTab === "my-scores" && myTeam && (
          <div className="mm-card">
            <div className="panel-header">YOUR PERFORMANCE</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              <div>
                <div style={{ fontFamily: "var(--mm-font)", fontSize: 11, letterSpacing: 2, color: "var(--mm-muted)", marginBottom: 16 }}>SCORE BREAKDOWN</div>
                {[["WEB ROUND (R1)", myTeam.round1 || 0, "var(--mm-accent)"], ["DSA ROUND (R2)", myTeam.round2 || 0, "#7c3aed"]].map(([lbl, score, col]) => (
                  <div key={lbl} style={{ marginBottom: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "var(--mm-mono)", fontSize: 11, marginBottom: 6 }}>
                      <span style={{ color: "var(--mm-muted)" }}>{lbl}</span>
                      <span style={{ color: col, fontFamily: "var(--mm-font)" }}>{score} pts</span>
                    </div>
                    <div style={{ height: 8, background: "var(--mm-surface2)", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${score}%`, background: col, transition: "width 1s ease" }} />
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 20, padding: "16px", background: "var(--mm-surface2)", border: "1px solid var(--mm-border)", textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--mm-mono)", fontSize: 10, color: "var(--mm-muted)", letterSpacing: 2, marginBottom: 6 }}>TOTAL SCORE</div>
                  <div style={{ fontFamily: "var(--mm-font)", fontSize: 40, fontWeight: 900, color: "var(--mm-green)" }}>{totalScore(myTeam)}</div>
                </div>
              </div>
              <div>
                <div style={{ fontFamily: "var(--mm-font)", fontSize: 11, letterSpacing: 2, color: "var(--mm-muted)", marginBottom: 16 }}>POSITION IN LEADERBOARD</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {sorted(teams).slice(0, 8).map((team, i) => {
                    const isMe = team.id === myTeam.id;
                    return (
                      <div key={team.id} style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "8px 12px",
                        background: isMe ? "rgba(0,255,136,0.06)" : "var(--mm-surface2)",
                        border: `1px solid ${isMe ? "var(--mm-green)" : "var(--mm-border)"}`,
                        transition: "all 0.3s",
                      }}>
                        <span style={{ fontFamily: "var(--mm-font)", fontSize: 11, color: isMe ? "var(--mm-green)" : "var(--mm-muted)", width: 24 }}>#{i + 1}</span>
                        <span style={{ flex: 1, fontFamily: "var(--mm-mono)", fontSize: 12, color: isMe ? "var(--mm-green)" : "var(--mm-text)" }}>{team.teamName}{isMe ? " ← YOU" : ""}</span>
                        <span style={{ fontFamily: "var(--mm-font)", fontSize: 12, color: isMe ? "var(--mm-green)" : "var(--mm-muted)" }}>{totalScore(team)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "charts" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div className="mm-card">
              <div className="panel-header">SCORE COMPARISON</div>
              <BarChart teams={teams} />
            </div>
            <div className="mm-card">
              <div className="panel-header">R1 vs R2 SCATTER</div>
              <ScatterChart teams={teams} />
            </div>
          </div>
        )}

        {activeTab === "results" && (
          <div className="mm-card">
            <div className="panel-header">OFFICIAL RESULTS</div>
            <ResultsSection results={results} teams={teams} editable={false} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("landing");
  const [loginType, setLoginType] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [contestantUser, setContestantUser] = useState(null);

  return (
    <div className="mm-app">
      <style>{GLOBAL_CSS}</style>

      {screen === "landing" && (
        <LandingPage
          onAdminLogin={() => { setLoginType("admin"); setScreen("login"); }}
          onContestantLogin={() => { setLoginType("contestant"); setScreen("login"); }}
        />
      )}

      {screen === "login" && (
        <>
          <LandingPage
            onAdminLogin={() => setLoginType("admin")}
            onContestantLogin={() => setLoginType("contestant")}
          />
          <LoginModal
            type={loginType}
            onClose={() => setScreen("landing")}
            onSuccess={(user) => {
              if (loginType === "admin") {
                setAdminUser(user);
                setScreen("admin");
              } else {
                setContestantUser(user);
                setScreen("contestant");
              }
            }}
          />
        </>
      )}

      {screen === "admin" && adminUser && (
        <AdminDashboard
          admin={adminUser}
          onLogout={() => { setAdminUser(null); setScreen("landing"); }}
        />
      )}

      {screen === "contestant" && contestantUser && (
        <ContestantDashboard
          contestant={contestantUser}
          onLogout={() => { setContestantUser(null); setScreen("landing"); }}
        />
      )}
    </div>
  );
}
