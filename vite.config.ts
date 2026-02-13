import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // For GitHub Pages: if GITHUB_REPOSITORY is set, use repo name as base path
  // Otherwise, use '/' for local development
  const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1];
  const base = repoName ? `/${repoName}/` : '/';
  
  return {
    base,
  server: {
    host: "localhost",
    port: 5173,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  };
});
