// ─── admin/TeamScoreRow.jsx ───────────────────────────────────────────────────
// Inline-editable score row in the quick-edit panel
import { useState } from "react";

export default function TeamScoreRow({ team, rank, onSave }) {
  const [r1,      setR1]      = useState(team.round1 || 0);
  const [r2,      setR2]      = useState(team.round2 || 0);
  const [editing, setEditing] = useState(false);

  const handleSave = () => {
    onSave(team.id, r1, r2);
    setEditing(false);
  };

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "32px 1fr 80px 80px 80px",
      gap: 8, alignItems: "center",
      padding: "10px 0",
      borderBottom: "1px solid rgba(26,58,92,0.4)",
    }}>
      {/* Rank */}
      <span style={{ fontFamily: "var(--mm-font)", fontSize: 11, color: "var(--mm-muted)" }}>#{rank}</span>

      {/* Team */}
      <div>
        <div style={{ fontFamily: "var(--mm-mono)", fontSize: 12 }}>{team.teamName}</div>
        <div style={{ fontFamily: "var(--mm-mono)", fontSize: 10, color: "var(--mm-muted)" }}>{team.teamNumber}</div>
      </div>

      {editing ? (
        <>
          <input
            className="mm-input"
            type="number" min="0" max="100"
            value={r1}
            onChange={e => setR1(Math.max(0, parseInt(e.target.value) || 0))}
            style={{ padding: "6px 8px", fontSize: 12, textAlign: "center" }}
          />
          <input
            className="mm-input"
            type="number" min="0" max="100"
            value={r2}
            onChange={e => setR2(Math.max(0, parseInt(e.target.value) || 0))}
            style={{ padding: "6px 8px", fontSize: 12, textAlign: "center" }}
          />
          <button className="mm-btn mm-btn-success" style={{ padding: "6px", fontSize: 9 }} onClick={handleSave}>✓</button>
        </>
      ) : (
        <>
          <span style={{ fontFamily: "var(--mm-font)", fontSize: 12, color: "var(--mm-accent)",  textAlign: "center" }}>{team.round1 || 0}</span>
          <span style={{ fontFamily: "var(--mm-font)", fontSize: 12, color: "var(--mm-accent3)", textAlign: "center" }}>{team.round2 || 0}</span>
          <button className="mm-btn" style={{ padding: "6px", fontSize: 9 }} onClick={() => setEditing(true)}>✎</button>
        </>
      )}
    </div>
  );
}
