import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    // Vercel uses the domain root; GitHub Pages uses the repository subpath.
    base: process.env.GITHUB_ACTIONS === "true" ? "/my-portfolio/" : "/",

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

    build: {
        target: "es2022",
        sourcemap: false,
        cssMinify: true,
        reportCompressedSize: true,
        chunkSizeWarningLimit: 1000,
    },

    resolve: {
        extensions: [
            ".js",
            ".jsx",
            ".json",
            ".webp",
            ".png",
            ".jpg",
            ".jpeg",
            ".svg",
            ".mp3",
        ],
    },

});
