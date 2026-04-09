// ─── DATABASE LAYER — localStorage Storage Helpers ────────────────────────────
// Simulates a simple key-value database using the browser's localStorage.
// All keys are namespaced with "mm_" to avoid collisions.

const NS = "mm_";

/**
 * Load a value from the localStorage database.
 * @template T
 * @param {string} key
 * @param {T} fallback  Returned when key is absent or JSON is invalid
 * @returns {T}
 */
export function loadState(key, fallback) {
  try {
    const raw = localStorage.getItem(NS + key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

/**
 * Persist a value to the localStorage database.
 * @param {string} key
 * @param {unknown} value
 */
export function saveState(key, value) {
  try {
    localStorage.setItem(NS + key, JSON.stringify(value));
  } catch {
    console.warn("[DB] Could not persist key:", key);
  }
}

/**
 * Remove a key from the localStorage database.
 * @param {string} key
 */
export function clearState(key) {
  try {
    localStorage.removeItem(NS + key);
  } catch { }
}
