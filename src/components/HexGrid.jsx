// ─── HexGrid.jsx ──────────────────────────────────────────────────────────────
// SVG hex-pattern background overlay
export default function HexGrid() {
  return (
    <svg
      style={{
        position: "fixed", top: 0, left: 0,
        width: "100%", height: "100%",
        opacity: 0.04, pointerEvents: "none", zIndex: 0,
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="hex" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
          <polygon
            points="30,2 58,17 58,35 30,50 2,35 2,17"
            fill="none" stroke="#00d4ff" strokeWidth="0.5"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hex)" />
    </svg>
  );
}
