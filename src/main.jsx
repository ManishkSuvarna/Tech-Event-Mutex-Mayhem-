// ─── main.jsx ────────────────────────────────────────────────────────────────
// React DOM entry point — mounts <App /> into #root, imports global CSS once
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

const root = document.getElementById("root");
if (!root) throw new Error("[main.jsx] #root element not found in index.html");

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);
