// ─── ContestantDashboard.jsx ──────────────────────────────────────────────────
// Team-facing view: live rankings, own scores, analytics, results + like system
import { useState, useEffect } from "react";
import HexGrid        from "../components/HexGrid";
import Podium         from "../components/Podium";
import Leaderboard    from "../components/Leaderboard";
import BarChart       from "../components/BarChart";
import ScatterChart   from "../components/ScatterChart";
import ResultsSection from "../components/ResultsSection";
import { loadState, saveState } from "../db/storage";
import { SEED_TEAMS, SEED_RESULTS } from "../data/seedData";
import { totalScore, sorted } from "../utils/scoring";

const TABS = [
  { id: "leaderboard", label: "Leaderboard" },
  { id: "my-scores",   label: "My Scores"   },
  { id: "charts",      label: "Analytics"   },
  { id: "results",     label: "Results"     },
];

// How often to pull fresh data from localStorage (simulates live updates)
const POLL_INTERVAL_MS = 5000;

export default function ContestantDashboard({ contestant, onLogout }) {
  const [teams,      setTeams]      = useState(() => loadState("teams",   SEED_TEAMS));
  const [results]                   = useState(() => loadState("results", SEED_RESULTS));
  const [likedTeams, setLikedTeams] = useState(() => loadState(`likes_${contestant.id}`, []));
  const [activeTab,  setActiveTab]  = useState("leaderboard");

  // ── Live poll (refresh from DB every 5s) ─────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setTeams(loadState("teams", SEED_TEAMS));
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  // ── Like / Unlike ─────────────────────────────────────────────────────────
  const handleLike = (teamId) => {
    const already  = likedTeams.includes(teamId);
    const newLiked = already
      ? likedTeams.filter(id => id !== teamId)
      : [...likedTeams, teamId];

    setLikedTeams(newLiked);
    saveState(`likes_${contestant.id}`, newLiked);

    const updated = teams.map(t =>
      t.id === teamId
        ? { ...t, likes: Math.max(0, (t.likes || 0) + (already ? -1 : 1)) }
        : t
    );
    setTeams(updated);
    saveState("teams", updated);
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const myTeam = teams.find(t => t.id === contestant.id);
  const myRank = sorted(teams).findIndex(t => t.id === contestant.id) + 1;

  return (
    <div style={{ minHeight: "100vh", background: "var(--mm-bg)", position: "relative" }}>
      <HexGrid />
      <div className="scanline-overlay" />

      {/* ── Top Bar ────────────────────────────────────────────────────────── */}
      <div style={{
        background: "var(--mm-surface)", borderBottom: "1px solid var(--mm-border)",
        padding: "12px 24px", display: "flex", alignItems: "center",
        justifyContent: "space-between", position: "relative", zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontFamily: "var(--mm-font)", fontSize: 14, letterSpacing: 3, color: "var(--mm-accent)" }}>
            MUTEX MAYHEM
          </div>
          <span className="tag" style={{ borderColor: "var(--mm-accent)", color: "var(--mm-accent)" }}>TEAM</span>
          <span style={{ fontFamily: "var(--mm-mono)", fontSize: 11, color: "var(--mm-muted)" }}>
            {contestant.teamName}
          </span>
          <span className="tag" style={{ borderColor: "var(--mm-muted)", color: "var(--mm-muted)" }}>
            {contestant.teamNumber}
          </span>
        </div>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <span style={{ fontFamily: "var(--mm-mono)", fontSize: 10, color: "var(--mm-muted)" }}>
            LIVE · Updates every 5s
          </span>
          <button
            className="mm-btn mm-btn-danger"
            style={{ padding: "6px 16px", fontSize: 9 }}
            onClick={onLogout}
          >
            LOGOUT
          </button>
        </div>
      </div>

      {/* ── Main Content ───────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px", position: "relative", zIndex: 1 }}>

        {/* My Stats Bar */}
        {myTeam && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
            {[
              ["RANK",    `#${myRank}`,            myRank <= 3 ? "var(--mm-gold)"  : "var(--mm-accent)"],
              ["ROUND 1", myTeam.round1 || 0,       "var(--mm-accent)"],
              ["ROUND 2", myTeam.round2 || 0,       "var(--mm-accent3)"],
              ["TOTAL",   totalScore(myTeam),        "var(--mm-green)"],
            ].map(([lbl, val, col]) => (
              <div key={lbl} className="stat-card">
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

        {/* Tab Navigation */}
        <div className="tab-bar">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`tab ${activeTab === t.id ? "active" : ""}`}
              onClick={() => setActiveTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── LEADERBOARD ──────────────────────────────────────────────────── */}
        {activeTab === "leaderboard" && (
          <div className="mm-card">
            <div className="panel-header">LIVE RANKINGS — ♥ SUPPORT YOUR FAVORITES</div>
            <Leaderboard
              teams={teams}
              isAdmin={false}
              onLike={handleLike}
              likedTeams={likedTeams}
            />
          </div>
        )}

        {/* ── MY SCORES ────────────────────────────────────────────────────── */}
        {activeTab === "my-scores" && myTeam && (
          <div className="mm-card">
            <div className="panel-header">YOUR PERFORMANCE</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              {/* Score breakdown */}
              <div>
                <div style={{ fontFamily: "var(--mm-font)", fontSize: 11, letterSpacing: 2, color: "var(--mm-muted)", marginBottom: 16 }}>
                  SCORE BREAKDOWN
                </div>
                {[
                  ["WEB ROUND (R1)", myTeam.round1 || 0, "var(--mm-accent)"],
                  ["DSA ROUND (R2)", myTeam.round2 || 0, "var(--mm-accent3)"],
                ].map(([lbl, score, col]) => (
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
                  <div style={{ fontFamily: "var(--mm-font)", fontSize: 40, fontWeight: 900, color: "var(--mm-green)" }}>
                    {totalScore(myTeam)}
                  </div>
                </div>
              </div>

              {/* Position in leaderboard */}
              <div>
                <div style={{ fontFamily: "var(--mm-font)", fontSize: 11, letterSpacing: 2, color: "var(--mm-muted)", marginBottom: 16 }}>
                  POSITION IN LEADERBOARD
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {sorted(teams).slice(0, 8).map((team, i) => {
                    const isMe = team.id === myTeam.id;
                    return (
                      <div
                        key={team.id}
                        style={{
                          display: "flex", alignItems: "center", gap: 10,
                          padding: "8px 12px",
                          background: isMe ? "rgba(0,255,136,0.06)"    : "var(--mm-surface2)",
                          border:     `1px solid ${isMe ? "var(--mm-green)" : "var(--mm-border)"}`,
                          transition: "all 0.3s",
                        }}
                      >
                        <span style={{ fontFamily: "var(--mm-font)", fontSize: 11, color: isMe ? "var(--mm-green)" : "var(--mm-muted)", width: 24 }}>#{i + 1}</span>
                        <span style={{ flex: 1, fontFamily: "var(--mm-mono)", fontSize: 12, color: isMe ? "var(--mm-green)" : "var(--mm-text)" }}>
                          {team.teamName}{isMe ? " ← YOU" : ""}
                        </span>
                        <span style={{ fontFamily: "var(--mm-font)", fontSize: 12, color: isMe ? "var(--mm-green)" : "var(--mm-muted)" }}>
                          {totalScore(team)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── ANALYTICS ────────────────────────────────────────────────────── */}
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

        {/* ── RESULTS ──────────────────────────────────────────────────────── */}
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
