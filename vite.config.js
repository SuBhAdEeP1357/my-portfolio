import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ command }) => ({
// GitHub Pages uses a repository subpath.
// Vercel serves the application from the domain root.
base: command === "build"
? (process.env.GITHUB_PAGES === "true" ? "/my-portfolio/" : "/")
: "/",

```
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
```

}));
