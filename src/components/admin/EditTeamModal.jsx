// ─── admin/EditTeamModal.jsx ──────────────────────────────────────────────────
// Modal for editing an existing team's details
import { useState } from "react";

const FIELDS = [
  { key: "teamName",   label: "TEAM NAME",   type: "text"     },
  { key: "teamNumber", label: "TEAM NUMBER", type: "text"     },
  { key: "username",   label: "USERNAME",    type: "text"     },
  { key: "password",   label: "PASSWORD",    type: "password" },
];

export default function EditTeamModal({ team, onClose, onSave }) {
  const [form, setForm] = useState({ ...team });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="panel-header" style={{ justifyContent: "center", marginBottom: 20 }}>
          EDIT TEAM — {team.teamNumber}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {FIELDS.map(({ key, label, type }) => (
            <div key={key}>
              <div style={{ fontFamily: "var(--mm-mono)", fontSize: 9, color: "var(--mm-muted)", letterSpacing: 2, marginBottom: 4 }}>
                {label}
              </div>
              <input
                className="mm-input"
                type={type}
                value={form[key] || ""}
                onChange={e => set(key, e.target.value)}
              />
            </div>
          ))}

          <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
            <button className="mm-btn"               style={{ flex: 1 }} onClick={onClose}>CANCEL</button>
            <button className="mm-btn mm-btn-success" style={{ flex: 1 }} onClick={() => onSave(form)}>SAVE</button>
          </div>
        </div>
      </div>
    </div>
  );
}
