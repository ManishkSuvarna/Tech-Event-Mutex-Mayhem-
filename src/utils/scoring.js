// ─── UTILITY LAYER — Scoring helpers ──────────────────────────────────────────

/**
 * Compute a team's total score across both rounds.
 * @param {{ round1?: number, round2?: number }} team
 * @returns {number}
 */
export const totalScore = (team) => (team.round1 || 0) + (team.round2 || 0);

/**
 * Return a NEW array of teams sorted by descending total score.
 * @param {Array} teams
 * @returns {Array}
 */
export const sorted = (teams) =>
  [...teams].sort((a, b) => totalScore(b) - totalScore(a));

/**
 * Clamp a numeric value between min and max.
 * @param {number} val
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
