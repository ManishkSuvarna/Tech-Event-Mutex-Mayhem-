// ─── DATABASE LAYER — Seed Data ───────────────────────────────────────────────
// Represents the initial state of the three "tables" in our localStorage DB.
// Schema:
//   admins    → { id, username, password, name }
//   teams     → { id, teamName, teamNumber, username, password, round1, round2, likes }
//   results   → { id, round, first, second, third }

/** @type {Array<{id:number, username:string, password:string, name:string}>} */
export const ADMIN_CREDENTIALS = [
  { id: 1, username: "admin1",  password: "admin123", name: "Admin One"   },
  { id: 2, username: "admin2",  password: "admin123", name: "Admin Two"   },
  { id: 3, username: "admin3",  password: "admin456", name: "Admin Three" },
];

/**
 * @typedef {Object} Team
 * @property {number}  id
 * @property {string}  teamName
 * @property {string}  teamNumber
 * @property {string}  username
 * @property {string}  password
 * @property {number}  round1
 * @property {number}  round2
 * @property {number}  likes
 */

/** @type {Team[]} */
export const SEED_TEAMS = [
  { id: 1, teamName: "Binary Beasts",  teamNumber: "T001", username: "binarybeasts",  password: "team123", round1: 87, round2: 92, likes: 5 },
  { id: 2, teamName: "Code Crushers",  teamNumber: "T002", username: "codecrushers",  password: "team123", round1: 95, round2: 88, likes: 3 },
  { id: 3, teamName: "Stack Overflow", teamNumber: "T003", username: "stackoverflow", password: "team123", round1: 78, round2: 95, likes: 7 },
  { id: 4, teamName: "Null Pointers",  teamNumber: "T004", username: "nullpointers",  password: "team123", round1: 82, round2: 79, likes: 2 },
  { id: 5, teamName: "Async Avengers", teamNumber: "T005", username: "asyncavengers", password: "team123", round1: 91, round2: 85, likes: 9 },
  { id: 6, teamName: "Git Gud",        teamNumber: "T006", username: "gitgud",        password: "team123", round1: 70, round2: 88, likes: 4 },
  { id: 7, teamName: "Dark Matter",    teamNumber: "T007", username: "darkmatter",    password: "team123", round1: 88, round2: 76, likes: 6 },
  { id: 8, teamName: "Debug Demons",   teamNumber: "T008", username: "debugdemons",   password: "team123", round1: 65, round2: 91, likes: 1 },
];

/**
 * @typedef {Object} RoundResult
 * @property {number} id
 * @property {number} round
 * @property {string} first
 * @property {string} second
 * @property {string} third
 */

/** @type {RoundResult[]} */
export const SEED_RESULTS = [
  { id: 1, round: 1, first: "Code Crushers",  second: "Async Avengers", third: "Binary Beasts"  },
  { id: 2, round: 2, first: "Stack Overflow", second: "Debug Demons",   third: "Code Crushers"  },
];
