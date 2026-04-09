// ─── Toast.jsx ────────────────────────────────────────────────────────────────
// Floating notification toast — success / danger variants
export default function Toast({ toast }) {
  if (!toast) return null;
  const isDanger = toast.type === "danger";
  return (
    <div
      style={{
        position: "fixed", top: 20, right: 20, zIndex: 2000,
        background: isDanger ? "rgba(255,68,68,0.15)" : "rgba(0,255,136,0.1)",
        border: `1px solid ${isDanger ? "var(--mm-red)" : "var(--mm-green)"}`,
        color: isDanger ? "var(--mm-red)" : "var(--mm-green)",
        fontFamily: "var(--mm-mono)", fontSize: 12,
        padding: "12px 20px",
        animation: "float-up 0.3s ease",
        boxShadow: `0 0 20px ${isDanger ? "rgba(255,68,68,0.2)" : "rgba(0,255,136,0.2)"}`,
      }}
    >
      {isDanger ? "⚠ " : "✓ "}{toast.msg}
    </div>
  );
}
