// ─── MatrixRain.jsx ───────────────────────────────────────────────────────────
// Animated canvas background: falling matrix characters
import { useEffect, useRef } from "react";

export default function MatrixRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();

    const cols  = Math.floor(canvas.width / 20);
    const drops = Array(cols).fill(1);
    const chars = "01アイウエオカキクケコ{}[]<>/\\#@$%^&*ABCDEFGHIJKLMNOP";

    let frame;
    const draw = () => {
      ctx.fillStyle = "rgba(4,8,16,0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = "14px JetBrains Mono, monospace";

      drops.forEach((y, i) => {
        const char     = chars[Math.floor(Math.random() * chars.length)];
        const progress = y / (canvas.height / 14);
        const alpha    = Math.max(0.05, 1 - progress * 0.8);
        ctx.fillStyle  = i % 5 === 0
          ? `rgba(0,212,255,${alpha})`
          : `rgba(0,100,150,${alpha * 0.4})`;
        ctx.fillText(char, i * 20, y * 14);
        if (y * 14 > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });

      frame = requestAnimationFrame(draw);
    };
    draw();

    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed", top: 0, left: 0,
        opacity: 0.35, pointerEvents: "none", zIndex: 0,
      }}
    />
  );
}
