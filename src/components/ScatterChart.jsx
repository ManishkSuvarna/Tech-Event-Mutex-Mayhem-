// ─── ScatterChart.jsx ─────────────────────────────────────────────────────────
// SVG scatter plot: Round 1 (X) vs Round 2 (Y) for top 10 teams
import { sorted } from "../utils/scoring";

const COLORS = ["#00d4ff","#7c3aed","#ff6b35","#ffd700","#00ff88","#ff4d8d","#c0c0c0","#60a5fa","#f59e0b","#34d399"];
const GRID_LINES = [0, 25, 50, 75, 100];

export default function ScatterChart({ teams }) {
  const top10  = sorted(teams).slice(0, 10);
  const maxVal = Math.max(...top10.flatMap(t => [t.round1 || 0, t.round2 || 0]), 100);
  const W = 280, H = 240, PAD = 36;

  const scaleX = (v) => PAD + (v / maxVal) * (W - PAD * 2);
  const scaleY = (v) => H - PAD - (v / maxVal) * (H - PAD * 2);

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      {/* Grid lines */}
      {GRID_LINES.map(g => (
        <g key={g}>
          <line x1={PAD} y1={scaleY(g)} x2={W - PAD} y2={scaleY(g)} stroke="rgba(26,58,92,0.6)" strokeWidth="0.5" />
          <line x1={scaleX(g)} y1={PAD} x2={scaleX(g)} y2={H - PAD} stroke="rgba(26,58,92,0.6)" strokeWidth="0.5" />
          <text x={PAD - 4} y={scaleY(g) + 4} textAnchor="end" fontSize="9" fill="rgba(90,122,154,0.8)">{g}</text>
          <text x={scaleX(g)} y={H - PAD + 14} textAnchor="middle" fontSize="9" fill="rgba(90,122,154,0.8)">{g}</text>
        </g>
      ))}

      {/* Diagonal equality guide (R1 = R2) */}
      <line
        x1={scaleX(0)} y1={scaleY(0)}
        x2={scaleX(maxVal)} y2={scaleY(maxVal)}
        stroke="rgba(0,212,255,0.15)" strokeWidth="0.5" strokeDasharray="4,4"
      />

      {/* Axis labels */}
      <text x={W / 2} y={H - 4} textAnchor="middle" fontSize="9" fill="var(--mm-accent)" letterSpacing="1">ROUND 1</text>
      <text x={12} y={H / 2} textAnchor="middle" fontSize="9" fill="#7c3aed" letterSpacing="1" transform={`rotate(-90, 12, ${H / 2})`}>ROUND 2</text>

      {/* Data points */}
      {top10.map((team, i) => {
        const cx = scaleX(team.round1 || 0);
        const cy = scaleY(team.round2 || 0);
        return (
          <g key={team.id}>
            <circle cx={cx} cy={cy} r="6"  fill={COLORS[i]} opacity="0.8" />
            <circle cx={cx} cy={cy} r="10" fill={COLORS[i]} opacity="0.15" />
            <text x={cx + 10} y={cy + 4} fontSize="8" fill={COLORS[i]} opacity="0.9">
              {team.teamName.split(" ")[0]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
