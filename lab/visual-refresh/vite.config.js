import { defineConfig } from "vite";
import htmlComponents from "./lib/vite-plugin.js";

export default defineConfig({
	base: "./",
	plugins: [htmlComponents()],
	build: {
		outDir: "dist",
	},
});
