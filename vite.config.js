import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    open: true,
  },

  build: {
    // Produce a clean dist/ on every build
    emptyOutDir: true,

    // Raise the inline-asset limit so small SVGs/icons get base64-inlined
    assetsInlineLimit: 4096,

    // Chunk splitting: keep react-dom separate for better long-term caching
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
        },
        // Consistent asset naming for cache busting
        assetFileNames: "assets/[name].[hash][extname]",
        chunkFileNames: "assets/[name].[hash].js",
        entryFileNames: "assets/[name].[hash].js",
      },
    },
  },
});
