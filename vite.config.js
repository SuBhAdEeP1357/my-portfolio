import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: process.env.GITHUB_ACTIONS === "true"
    ? "/my-portfolio/"
    : "/",

  plugins: [react()],

  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: false,
  },

  preview: {
    host: "127.0.0.1",
    port: 4173,
    strictPort: false,
  },
});
