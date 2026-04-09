// ─── BarChart.jsx ─────────────────────────────────────────────────────────────
// Horizontal stacked bar chart: Round 1 + Round 2 per team
// BUG FIX: removed duplicate `top` CSS property on bar segments
import { totalScore, sorted } from "../utils/scoring";

export default function BarChart({ teams }) {
  const top8     = sorted(teams).slice(0, 8);
  const maxScore = Math.max(...top8.map(t => totalScore(t)), 1);

  return (
    <div style={{ padding: "8px 0" }}>
      {top8.map((team, i) => {
        const r1    = team.round1 || 0;
        const r2    = team.round2 || 0;
        const total = r1 + r2;

        return (
          <div key={team.id} style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 12 }}>
            {/* Team name */}
            <div style={{
              width: 110, fontFamily: "var(--mm-mono)", fontSize: 10,
              color: "var(--mm-muted)", textAlign: "right", flexShrink: 0,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
              {team.teamName}
            </div>

            {/* Bar container */}
            <div style={{ flex: 1, height: 20, background: "var(--mm-surface2)", position: "relative", overflow: "hidden" }}>
              {/* Round 1 segment — FIX: single `top` via `inset` shorthand */}
              <div style={{
                position: "absolute",
                inset: "20% 0 20% 0",
                width: `${(r1 / maxScore) * 100}%`,
                background: "var(--mm-accent)",
                transformOrigin: "left",
                animation: `bar-anim 0.6s ease ${i * 0.06}s both`,
              }} />
              {/* Round 2 segment */}
              <div style={{
                position: "absolute",
                inset: "20% 0 20% 0",
                left: `${(r1 / maxScore) * 100}%`,
                width: `${(r2 / maxScore) * 100}%`,
                background: "var(--mm-accent3)",
                transformOrigin: "left",
                animation: `bar-anim 0.6s ease ${i * 0.06 + 0.1}s both`,
              }} />
            </div>

            {/* Score label */}
            <div style={{ width: 36, fontFamily: "var(--mm-font)", fontSize: 11, color: "var(--mm-text)", textAlign: "right", flexShrink: 0 }}>
              {total}
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginTop: 12, fontFamily: "var(--mm-mono)", fontSize: 10, color: "var(--mm-muted)" }}>
        <span><span style={{ color: "var(--mm-accent)" }}>■</span> Round 1</span>
        <span><span style={{ color: "var(--mm-accent3)" }}>■</span> Round 2</span>
      </div>
    </div>
  );
}
