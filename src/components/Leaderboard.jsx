// ─── Leaderboard.jsx ──────────────────────────────────────────────────────────
// Shared leaderboard table used by both Admin and Contestant dashboards
import RankIcon from "./RankIcon";
import { totalScore, sorted } from "../utils/scoring";

export default function Leaderboard({ teams, isAdmin, onLike, likedTeams }) {
  const ranked = sorted(teams);

  return (
    <div>
      {/* Header Row */}
      <div className="lb-row lb-row-header" style={{ fontFamily: "var(--mm-font)", fontSize: 9 }}>
        <span>RANK</span>
        <span>TEAM</span>
        <span style={{ textAlign: "right" }}>ROUND 1</span>
        <span style={{ textAlign: "right" }}>ROUND 2</span>
        <span style={{ textAlign: "right" }}>TOTAL</span>
        <span style={{ textAlign: "center" }}>LIKES</span>
      </div>

      {/* Data Rows */}
      {ranked.map((team, i) => {
        const rank  = i + 1;
        const total = totalScore(team);
        const isTop = rank <= 3;

        const rankColors = {
          border: rank === 1 ? "var(--mm-gold)"   : rank === 2 ? "var(--mm-silver)" : rank === 3 ? "var(--mm-bronze)" : "var(--mm-border)",
          text:   rank === 1 ? "var(--mm-gold)"   : rank === 2 ? "var(--mm-silver)" : rank === 3 ? "var(--mm-bronze)" : "var(--mm-muted)",
          rowBg:  rank === 1 ? "rgba(255,215,0,0.03)" : rank === 2 ? "rgba(192,192,192,0.02)" : rank === 3 ? "rgba(205,127,50,0.02)" : "transparent",
        };

        const isLiked = likedTeams?.includes(team.id);

        return (
          <div
            key={team.id}
            className="lb-row"
            style={{
              background: rankColors.rowBg,
              animation: `slide-in 0.3s ease ${i * 0.04}s both`,
            }}
          >
            {/* Rank Badge */}
            <div className="rank-badge" style={{ borderColor: rankColors.border, color: rankColors.text }}>
              <RankIcon rank={rank} />
            </div>

            {/* Team Info */}
            <div>
              <div style={{ fontFamily: "var(--mm-mono)", fontSize: 13, fontWeight: isTop ? 600 : 400 }}>
                {team.teamName}
              </div>
              <div style={{ fontFamily: "var(--mm-mono)", fontSize: 10, color: "var(--mm-muted)" }}>
                {team.teamNumber}
              </div>
            </div>

            {/* Round 1 */}
            <div style={{ textAlign: "right", fontFamily: "var(--mm-font)", fontSize: 13, color: "var(--mm-accent)" }}>
              {team.round1 || 0}
            </div>

            {/* Round 2 */}
            <div style={{ textAlign: "right", fontFamily: "var(--mm-font)", fontSize: 13, color: "var(--mm-accent3)" }}>
              {team.round2 || 0}
            </div>

            {/* Total */}
            <div style={{ textAlign: "right", fontFamily: "var(--mm-font)", fontSize: 15, fontWeight: 700, color: rank === 1 ? "var(--mm-gold)" : "var(--mm-text)" }}>
              {total}
            </div>

            {/* Likes */}
            <div style={{ textAlign: "center" }}>
              {!isAdmin ? (
                <button
                  className={`like-btn ${isLiked ? "liked" : ""}`}
                  onClick={() => onLike && onLike(team.id)}
                  title={isLiked ? "Unlike" : "Like"}
                >
                  ♥ {team.likes || 0}
                </button>
              ) : (
                <span style={{ fontFamily: "var(--mm-mono)", fontSize: 12, color: "var(--mm-pink)" }}>
                  ♥ {team.likes || 0}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
