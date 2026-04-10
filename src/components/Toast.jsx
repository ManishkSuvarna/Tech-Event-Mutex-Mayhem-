// ─── Toast.jsx ────────────────────────────────────────────────────────────────
// Floating notification toast — success / danger variants with animate-in
export default function Toast({ toast }) {
  if (!toast) return null;
  const isDanger = toast.type === "danger";
  return (
    <div
      role="alert"
      aria-live="polite"
      style={{
        position: "fixed", top: 20, right: 20, zIndex: 2000,
        background: isDanger ? "rgba(255,68,68,0.15)" : "rgba(0,255,136,0.1)",
        border: `1px solid ${isDanger ? "var(--mm-red)" : "var(--mm-green)"}`,
        color: isDanger ? "var(--mm-red)" : "var(--mm-green)",
        fontFamily: "var(--mm-mono)", fontSize: 12,
        padding: "12px 20px",
        animation: "toast-in 0.35s cubic-bezier(0.34,1.56,0.64,1) both",
        boxShadow: `0 0 24px ${isDanger ? "rgba(255,68,68,0.25)" : "rgba(0,255,136,0.25)"}`,
        backdropFilter: "blur(4px)",
        maxWidth: 320,
        letterSpacing: "0.5px",
      }}
    >
      {isDanger ? "⚠ " : "✓ "}{toast.msg}
    </div>
  );
}
