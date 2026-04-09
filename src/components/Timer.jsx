// ─── Timer.jsx ────────────────────────────────────────────────────────────────
// Countdown timer with start/pause/reset and manual time-set capability
import { useState, useEffect, useRef } from "react";

/**
 * Format seconds into MM:SS or HH:MM:SS
 * @param {number} s
 * @returns {string}
 */
function fmt(s) {
  const h   = Math.floor(s / 3600);
  const m   = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(sec)}` : `${pad(m)}:${pad(sec)}`;
}

export default function Timer({ label, initialSeconds = 0, editable = false }) {
  const [secs,     setSecs]     = useState(initialSeconds);
  const [running,  setRunning]  = useState(false);
  const [editing,  setEditing]  = useState(false);
  const [inputVal, setInputVal] = useState("");
  const intRef = useRef(null);

  useEffect(() => {
    if (running) {
      intRef.current = setInterval(() => {
        setSecs(s => {
          if (s <= 0) { setRunning(false); return 0; }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intRef.current);
  }, [running]);

  const applyInput = () => {
    const parsed = parseInt(inputVal, 10);
    if (!isNaN(parsed) && parsed >= 0) setSecs(parsed);
    setEditing(false);
    setInputVal("");
  };

  const isUrgent = secs < 60 && secs > 0;
  const isEmpty  = secs === 0;
  const timeColor = isUrgent ? "var(--mm-red)" : isEmpty ? "var(--mm-muted)" : "var(--mm-accent)";

  return (
    <div style={{
      textAlign: "center", padding: "16px",
      background: "var(--mm-surface2)", border: "1px solid var(--mm-border)",
    }}>
      <div style={{ fontFamily: "var(--mm-mono)", fontSize: 10, letterSpacing: 3, color: "var(--mm-muted)", marginBottom: 8, textTransform: "uppercase" }}>
        {label}
      </div>

      {editing ? (
        <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "center" }}>
          <input
            className="mm-input"
            style={{ width: 120, textAlign: "center" }}
            placeholder="seconds"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onKeyDown={e => e.key === "Enter" && applyInput()}
            autoFocus
          />
          <button className="mm-btn mm-btn-success" style={{ padding: "8px 12px", fontSize: 10 }} onClick={applyInput}>SET</button>
          <button className="mm-btn"                style={{ padding: "8px 12px", fontSize: 10 }} onClick={() => setEditing(false)}>✕</button>
        </div>
      ) : (
        <div className="timer-display" style={{ color: timeColor }}>
          {fmt(secs)}
        </div>
      )}

      {editable && !editing && (
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 12 }}>
          <button className="mm-btn" style={{ padding: "6px 14px", fontSize: 9 }} onClick={() => setRunning(r => !r)}>
            {running ? "⏸ PAUSE" : "▶ START"}
          </button>
          <button className="mm-btn" style={{ padding: "6px 14px", fontSize: 9 }} onClick={() => { setRunning(false); setSecs(initialSeconds); }}>
            ⏹ RESET
          </button>
          <button className="mm-btn" style={{ padding: "6px 14px", fontSize: 9 }} onClick={() => setEditing(true)}>
            ✎ SET
          </button>
        </div>
      )}
    </div>
  );
}
