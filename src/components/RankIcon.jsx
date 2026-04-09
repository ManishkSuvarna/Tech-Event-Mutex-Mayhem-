// ─── RankIcon.jsx ─────────────────────────────────────────────────────────────
// Displays the appropriate icon/label for a given rank position
export default function RankIcon({ rank }) {
  if (rank === 1)
    return <span style={{ fontSize: 18, animation: "crown-bounce 1.5s ease-in-out infinite" }}>👑</span>;
  if (rank === 2) return <span style={{ fontSize: 16 }}>🥈</span>;
  if (rank === 3) return <span style={{ fontSize: 16 }}>🥉</span>;
  if (rank <= 5)  return <span style={{ fontSize: 14 }}>⭐</span>;
  return <span style={{ fontSize: 12, color: "var(--mm-muted)" }}>#{rank}</span>;
}
