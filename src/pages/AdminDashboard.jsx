// ─── AdminDashboard.jsx ───────────────────────────────────────────────────────
// Full admin panel: leaderboard, score management, team roster, timer, analytics, results
import { useState } from "react";
import HexGrid         from "../components/HexGrid";
import Toast           from "../components/Toast";
import Podium          from "../components/Podium";
import Leaderboard     from "../components/Leaderboard";
import BarChart        from "../components/BarChart";
import ScatterChart    from "../components/ScatterChart";
import Timer           from "../components/Timer";
import ResultsSection  from "../components/ResultsSection";
import AddTeamForm     from "../components/admin/AddTeamForm";
import TeamRow         from "../components/admin/TeamRow";
import TeamScoreRow    from "../components/admin/TeamScoreRow";
import EditTeamModal   from "../components/admin/EditTeamModal";
import { loadState, saveState } from "../db/storage";
import { SEED_TEAMS, SEED_RESULTS } from "../data/seedData";
import { sorted, totalScore } from "../utils/scoring";

const TABS = [
  { id: "leaderboard", label: "Leaderboard"    },
  { id: "scores",      label: "Manage Scores"  },
  { id: "teams",       label: "Teams"          },
  { id: "timer",       label: "Timer"          },
  { id: "charts",      label: "Analytics"      },
  { id: "results",     label: "Results"        },
];

export default function AdminDashboard({ admin, onLogout }) {
  const [teams,         setTeams]         = useState(() => loadState("teams",   SEED_TEAMS));
  const [results,       setResults]       = useState(() => loadState("results", SEED_RESULTS));
  const [activeTab,     setActiveTab]     = useState("leaderboard");
  const [editTeam,      setEditTeam]      = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [scoreTeamId,   setScoreTeamId]   = useState("");
  const [scoreR1,       setScoreR1]       = useState("");
  const [scoreR2,       setScoreR2]       = useState("");
  const [toast,         setToast]         = useState(null);

  // ── DB helpers ──────────────────────────────────────────────────────────────
  const persist        = (t) => { setTeams(t);   saveState("teams",   t); };
  const persistResults = (r) => { setResults(r); saveState("results", r); };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  // ── Score update ─────────────────────────────────────────────────────────
  const handleUpdateScore = () => {
    if (!scoreTeamId) { showToast("Please select a team.", "danger"); return; }
    const updated = teams.map(t =>
      t.id === parseInt(scoreTeamId, 10)
        ? {
            ...t,
            round1: scoreR1 !== "" ? Math.max(0, parseInt(scoreR1, 10) || 0) : t.round1,
            round2: scoreR2 !== "" ? Math.max(0, parseInt(scoreR2, 10) || 0) : t.round2,
          }
        : t
    );
    persist(updated);
    setScoreTeamId(""); setScoreR1(""); setScoreR2("");
    showToast("Scores updated successfully!");
  };

  // ── Team CRUD ─────────────────────────────────────────────────────────────
  const handleDeleteTeam = (id) => {
    persist(teams.filter(t => t.id !== id));
    setDeleteConfirm(null);
    showToast("Team removed.", "danger");
  };

  const handleSaveResults = (round, form) => {
    persistResults(results.map(r => r.round === round ? { ...r, ...form } : r));
    showToast("Results saved!");
  };

  const selectedTeam = teams.find(t => t.id === parseInt(scoreTeamId, 10));

  return (
    <div style={{ minHeight: "100vh", background: "var(--mm-bg)", position: "relative" }}>
      <HexGrid />
      <div className="scanline-overlay" />

      <Toast toast={toast} />

      {/* ── Top Bar ──────────────────────────────────────────────────────── */}
      <div style={{
        background: "var(--mm-surface)", borderBottom: "1px solid var(--mm-border)",
        padding: "12px 24px", display: "flex", alignItems: "center",
        justifyContent: "space-between", position: "relative", zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontFamily: "var(--mm-font)", fontSize: 14, letterSpacing: 3, color: "var(--mm-accent3)" }}>MUTEX MAYHEM</div>
          <span className="tag" style={{ borderColor: "var(--mm-accent3)", color: "var(--mm-accent3)" }}>ADMIN</span>
          <span style={{ fontFamily: "var(--mm-mono)", fontSize: 11, color: "var(--mm-muted)" }}>Welcome, {admin.name}</span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontFamily: "var(--mm-mono)", fontSize: 10, color: "var(--mm-muted)" }}>{teams.length} / 100 teams</span>
          <button className="mm-btn mm-btn-danger" style={{ padding: "6px 16px", fontSize: 9 }} onClick={onLogout}>LOGOUT</button>
        </div>
      </div>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "24px", position: "relative", zIndex: 1 }}>

        {/* Podium */}
        <div className="mm-card" style={{ marginBottom: 24 }}>
          <div className="panel-header">TOP PERFORMERS</div>
          <Podium teams={teams} />
        </div>

        {/* Tab Navigation */}
        <div className="tab-bar">
          {TABS.map(t => (
            <button key={t.id} className={`tab ${activeTab === t.id ? "active" : ""}`} onClick={() => setActiveTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── LEADERBOARD ─────────────────────────────────────────────── */}
        {activeTab === "leaderboard" && (
          <div className="mm-card">
            <div className="panel-header">LIVE LEADERBOARD — {teams.length} TEAMS</div>
            <Leaderboard teams={teams} isAdmin={true} />
          </div>
        )}

        {/* ── MANAGE SCORES ────────────────────────────────────────────── */}
        {activeTab === "scores" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
            {/* Update panel */}
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

            {/* Quick edit panel */}
            <div className="mm-card">
              <div className="panel-header">ALL TEAMS — QUICK EDIT</div>
              <div className="scrollbar-thin" style={{ maxHeight: 460, overflowY: "auto" }}>
                {sorted(teams).map((team, i) => (
                  <TeamScoreRow
                    key={team.id}
                    team={team}
                    rank={i + 1}
                    onSave={(id, r1, r2) => {
                      persist(teams.map(t => t.id === id ? { ...t, round1: r1, round2: r2 } : t));
                      showToast("Score updated!");
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TEAMS ────────────────────────────────────────────────────── */}
        {activeTab === "teams" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
            <div className="mm-card">
              <div className="panel-header">ADD TEAM</div>
              <AddTeamForm
                teams={teams}
                onAdd={(team) => {
                  if (teams.length >= 100) { showToast("Max 100 teams reached.", "danger"); return; }
                  const newTeam = { ...team, id: Date.now(), round1: 0, round2: 0, likes: 0 };
                  persist([...teams, newTeam]);
                  showToast(`Team "${team.teamName}" added!`);
                }}
              />
            </div>
            <div className="mm-card">
              <div className="panel-header">TEAM ROSTER — {teams.length} TEAMS</div>
              <div className="scrollbar-thin" style={{ maxHeight: 460, overflowY: "auto" }}>
                {teams.map(team => (
                  <TeamRow
                    key={team.id}
                    team={team}
                    onEdit={t => setEditTeam(t)}
                    onDelete={id => setDeleteConfirm(id)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TIMER ────────────────────────────────────────────────────── */}
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

        {/* ── ANALYTICS ────────────────────────────────────────────────── */}
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

        {/* ── RESULTS ──────────────────────────────────────────────────── */}
        {activeTab === "results" && (
          <div className="mm-card">
            <div className="panel-header">PUBLISHED RESULTS</div>
            <ResultsSection results={results} teams={teams} editable={true} onSave={handleSaveResults} />
          </div>
        )}
      </div>

      {/* ── Edit Team Modal ───────────────────────────────────────────── */}
      {editTeam && (
        <EditTeamModal
          team={editTeam}
          onClose={() => setEditTeam(null)}
          onSave={(updated) => {
            persist(teams.map(t => t.id === updated.id ? updated : t));
            setEditTeam(null);
            showToast("Team updated!");
          }}
        />
      )}

      {/* ── Delete Confirm Modal ──────────────────────────────────────── */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ width: 360 }}>
            <div style={{ textAlign: "center", fontFamily: "var(--mm-font)", fontSize: 14, color: "var(--mm-red)", marginBottom: 16 }}>
              CONFIRM DELETE
            </div>
            <div style={{ fontFamily: "var(--mm-mono)", fontSize: 12, color: "var(--mm-muted)", textAlign: "center", marginBottom: 24 }}>
              This will permanently remove the team and all their scores.
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="mm-btn"               style={{ flex: 1 }} onClick={() => setDeleteConfirm(null)}>CANCEL</button>
              <button className="mm-btn mm-btn-danger" style={{ flex: 1 }} onClick={() => handleDeleteTeam(deleteConfirm)}>DELETE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
