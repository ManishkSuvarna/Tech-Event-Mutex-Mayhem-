// ─── ResultsSection.jsx ───────────────────────────────────────────────────────
// Round results display with optional inline editing (admin only)
import { useState } from "react";

export default function ResultsSection({ results, teams, editable, onSave }) {
  const [editing, setEditing] = useState(null); // round number being edited
  const [form,    setForm]    = useState({});
  const teamNames = teams.map(t => t.teamName);

  const startEdit = (r) => {
    setEditing(r.round);
    setForm({ first: r.first, second: r.second, third: r.third });
  };

  const save = () => {
    if (onSave) onSave(editing, form);
    setEditing(null);
  };

  const positions = [
    ["🥇", "1ST", "first",  "var(--mm-gold)"],
    ["🥈", "2ND", "second", "var(--mm-silver)"],
    ["🥉", "3RD", "third",  "var(--mm-bronze)"],
  ];

  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
      {results.map(r => (
        <div
          key={r.round}
          style={{
            flex: 1, minWidth: 220,
            background: "var(--mm-surface2)",
            border: "1px solid var(--mm-border)",
            padding: 20, position: "relative",
          }}
        >
          <div className="panel-header" style={{ fontSize: 10 }}>ROUND {r.round} RESULTS</div>

          {editing === r.round ? (
            /* Edit form */
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {positions.map(([, lbl, key]) => (
                <div key={key}>
                  <div style={{ fontFamily: "var(--mm-mono)", fontSize: 9, color: "var(--mm-muted)", letterSpacing: 2, marginBottom: 4 }}>
                    {lbl} PLACE
                  </div>
                  <select
                    className="mm-select"
                    value={form[key] || ""}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                  >
                    <option value="">-- Select Team --</option>
                    {teamNames.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
              ))}
              <div style={{ display: "flex", gap: 8 }}>
                <button className="mm-btn mm-btn-success" style={{ flex: 1, padding: "8px", fontSize: 9 }} onClick={save}>SAVE</button>
                <button className="mm-btn"               style={{ flex: 1, padding: "8px", fontSize: 9 }} onClick={() => setEditing(null)}>CANCEL</button>
              </div>
            </div>
          ) : (
            /* Display view */
            <>
              {positions.map(([ico, lbl, key, col]) => (
                <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <span style={{ fontSize: 20 }}>{ico}</span>
                  <div>
                    <div style={{ fontFamily: "var(--mm-mono)", fontSize: 9, color: "var(--mm-muted)", letterSpacing: 2 }}>{lbl} PLACE</div>
                    <div style={{ fontFamily: "var(--mm-font)", fontSize: 12, color: col }}>{r[key] || "—"}</div>
                  </div>
                </div>
              ))}
              {editable && (
                <button
                  className="mm-btn"
                  style={{ width: "100%", marginTop: 8, fontSize: 9, padding: "8px" }}
                  onClick={() => startEdit(r)}
                >
                  ✎ EDIT RESULTS
                </button>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
