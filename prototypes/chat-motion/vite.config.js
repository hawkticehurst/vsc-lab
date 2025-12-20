import { defineConfig } from "vite";
import htmlComponents from "./lib/vite-plugin.js";

export default defineConfig({
  plugins: [htmlComponents()],
  build: {
    outDir: "dist",
  },
});
