import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	base: "./",
	plugins: [
		vue({
			template: {
				compilerOptions: {
					// treat all tags with a dash as custom elements
					isCustomElement: (tag) => tag.includes("-"),
				},
			},
		}),
	],
	build: {
		outDir: "build/mcp-tool-confirmation/",
		// Ensure assets from public directory are copied to build output
		copyPublicDir: true,
		rollupOptions: {
			output: {
				manualChunks: () => "index",
				entryFileNames: "assets/index.js",
				assetFileNames: "assets/[name].[ext]",
			},
		},
	},
	publicDir: "public", // explicitly set public directory
});
