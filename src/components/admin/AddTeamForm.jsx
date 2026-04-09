// ─── admin/AddTeamForm.jsx ────────────────────────────────────────────────────
// Form for admin to add a new team to the database
import { useState } from "react";

const FIELDS = [
  { key: "teamName",   label: "TEAM NAME",   type: "text"     },
  { key: "teamNumber", label: "TEAM NUMBER", type: "text"     },
  { key: "username",   label: "USERNAME",    type: "text"     },
  { key: "password",   label: "PASSWORD",    type: "password" },
];

const EMPTY = { teamName: "", teamNumber: "", username: "", password: "" };

export default function AddTeamForm({ teams, onAdd }) {
  const [form, setForm] = useState(EMPTY);
  const [err,  setErr]  = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = () => {
    const { teamName, teamNumber, username, password } = form;
    if (!teamName || !teamNumber || !username || !password) {
      setErr("All fields are required."); return;
    }
    if (teams.find(t => t.username === username)) {
      setErr("Username already exists."); return;
    }
    if (teams.find(t => t.teamNumber === teamNumber)) {
      setErr("Team number already exists."); return;
    }
    onAdd(form);
    setForm(EMPTY);
    setErr("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {FIELDS.map(({ key, label, type }) => (
        <div key={key}>
          <div style={{ fontFamily: "var(--mm-mono)", fontSize: 9, color: "var(--mm-muted)", letterSpacing: 2, marginBottom: 4 }}>
            {label}
          </div>
          <input
            className="mm-input"
            type={type}
            placeholder={label.toLowerCase()}
            value={form[key]}
            onChange={e => set(key, e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
          />
        </div>
      ))}

      {err && <div className="error-banner">⚠ {err}</div>}

      <button className="mm-btn mm-btn-success" onClick={submit}>
        + ADD TEAM
      </button>
    </div>
  );
}
