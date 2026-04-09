// ─── admin/TeamRow.jsx ────────────────────────────────────────────────────────
// Single row in the team roster — shows team info with Edit/Delete actions
import { totalScore } from "../../utils/scoring";

export default function TeamRow({ team, onEdit, onDelete }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 0",
      borderBottom: "1px solid rgba(26,58,92,0.4)",
    }}>
      {/* Team Info */}
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "var(--mm-mono)", fontSize: 13, color: "var(--mm-text)" }}>
          {team.teamName}
        </div>
        <div style={{ fontFamily: "var(--mm-mono)", fontSize: 10, color: "var(--mm-muted)" }}>
          {team.teamNumber} · @{team.username}
        </div>
      </div>

      {/* Score Summary */}
      <div style={{ display: "flex", gap: 12, fontFamily: "var(--mm-mono)", fontSize: 11 }}>
        <span style={{ color: "var(--mm-accent)"  }}>R1:{team.round1 || 0}</span>
        <span style={{ color: "var(--mm-accent3)" }}>R2:{team.round2 || 0}</span>
        <span style={{ color: "var(--mm-gold)"    }}>∑{totalScore(team)}</span>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: 8 }}>
        <button className="mm-btn mm-btn-orange" style={{ padding: "6px 12px", fontSize: 9 }} onClick={() => onEdit(team)}>
          EDIT
        </button>
        <button className="mm-btn mm-btn-danger" style={{ padding: "6px 12px", fontSize: 9 }} onClick={() => onDelete(team.id)}>
          DEL
        </button>
      </div>
    </div>
  );
}
