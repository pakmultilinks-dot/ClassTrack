import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) {
            return undefined;
          }

          if (id.includes("face-api.js") || id.includes("@tensorflow")) {
            return "face";
          }

          if (id.includes("jspdf") || id.includes("xlsx") || id.includes("html2canvas") || id.includes("dompurify")) {
            return "exports";
          }

          if (id.includes("recharts") || id.includes("d3-")) {
            return "charts";
          }

          if (id.includes("framer-motion")) {
            return "motion";
          }

          return "vendor";
        }
      }
    }
  }
});
