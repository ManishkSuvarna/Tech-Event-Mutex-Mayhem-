// ─── Podium.jsx ───────────────────────────────────────────────────────────────
// Visual top-3 podium display
import RankIcon from "./RankIcon";
import { totalScore, sorted } from "../utils/scoring";

export default function Podium({ teams }) {
  const top3 = sorted(teams).slice(0, 3);
  const [first, second, third] = top3;

  // Display order: 2nd (left), 1st (center), 3rd (right)
  const order   = [second, first, third];
  const ranks   = [2, 1, 3];
  const colors  = ["var(--mm-silver)", "var(--mm-gold)", "var(--mm-bronze)"];
  const podiumH = [80, 120, 60]; // heights matching display order

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 8, padding: "24px 0 0" }}>
      {order.map((team, i) =>
        team ? (
          <div key={team.id} className="podium-item" style={{ animationDelay: `${i * 0.15}s` }}>
            {/* Team label above podium block */}
            <div style={{ textAlign: "center", marginBottom: 8 }}>
              <RankIcon rank={ranks[i]} />
              <div style={{ fontFamily: "var(--mm-font)", fontSize: 10, letterSpacing: 1, color: colors[i], marginTop: 4 }}>
                {team.teamName.split(" ").map(w => w[0]).join("").slice(0, 3)}
              </div>
              <div style={{ fontFamily: "var(--mm-font)", fontSize: 14, fontWeight: 700, color: colors[i] }}>
                {totalScore(team)}
              </div>
              <div style={{ fontFamily: "var(--mm-mono)", fontSize: 9, color: "var(--mm-muted)", maxWidth: 80, textAlign: "center" }}>
                {team.teamName}
              </div>
            </div>

            {/* Podium block */}
            <div style={{
              width: 90,
              height: podiumH[i],
              background: `linear-gradient(180deg, ${colors[i]}22, ${colors[i]}08)`,
              border: `1px solid ${colors[i]}`,
              borderBottom: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}>
              <span style={{ fontFamily: "var(--mm-font)", fontSize: 24, fontWeight: 900, color: colors[i], opacity: 0.5 }}>
                {ranks[i]}
              </span>
            </div>
          </div>
        ) : null
      )}
    </div>
  );
}
