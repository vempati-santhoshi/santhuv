import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "/" works for a custom domain (yourdomain.com) and for
// a user site (username.github.io). If you deploy WITHOUT a custom
// domain to a project page (username.github.io/repo-name), change
// base to "/repo-name/".
export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    target: "es2018",
    cssMinify: true,
    reportCompressedSize: false,
  },
});
