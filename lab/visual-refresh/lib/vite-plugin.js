import fs from "fs";
import path from "path";

const VIRTUAL_CSS_ID = "virtual:html-components.css";
const RESOLVED_VIRTUAL_CSS_ID = "\0" + VIRTUAL_CSS_ID;

/**
 * A simple Vite plugin for HTML component templating.
 * - Reads `.html` component files from `src/components/`
 * - Replaces custom element tags in index.html with their component markup
 * - Bundles all component styles via a virtual CSS module (processed by Vite's CSS pipeline)
 */
export default function htmlComponents() {
	const componentsDir = "src/components";
	let componentCache = new Map();
	let root = process.cwd();

	/**
	 * Parse a component file and extract the HTML markup and styles
	 */
	function parseComponent(filePath) {
		const content = fs.readFileSync(filePath, "utf-8");
		const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;

		let styles = "";
		let match;
		while ((match = styleRegex.exec(content)) !== null) {
			styles += match[1] + "\n";
		}

		const html = content.replace(styleRegex, "").trim();
		return { html, styles };
	}

	/**
	 * Load all components from the components directory
	 */
	function loadComponents() {
		componentCache.clear();
		const componentsPath = path.resolve(root, componentsDir);

		if (!fs.existsSync(componentsPath)) return;

		for (const file of fs.readdirSync(componentsPath)) {
			if (file.endsWith(".html")) {
				const name = file.replace(".html", "");
				const parsed = parseComponent(path.join(componentsPath, file));
				componentCache.set(name, parsed);
			}
		}
	}

	/**
	 * Replace component tags with their markup, supporting slots for children.
	 * - Empty tags get the full component template
	 * - Tags with children: children are injected into <slot></slot> in the template
	 * Handles nested components by recursively processing.
	 * @param {string} html - The HTML to process
	 * @param {number} maxDepth - Maximum recursion depth
	 * @param {Set<string>} skipComponents - Component names to skip (prevents self-referential loops)
	 */
	function replaceComponentTags(html, maxDepth = 10, skipComponents = new Set()) {
		if (maxDepth <= 0) {
			console.warn("Max component nesting depth reached");
			return html;
		}

		let result = html;
		let hasReplacements = false;

		for (const [name, component] of componentCache) {
			// Skip components that would cause self-referential loops
			if (skipComponents.has(name)) continue;

			const before = result;

			// Replace self-closing tags: <name />
			result = result.replace(new RegExp(`<${name}\\s*/>`, "gi"), component.html);

			// Replace empty tags: <name></name> (with optional whitespace inside)
			result = result.replace(
				new RegExp(`<${name}(\\s[^>]*)?>\\s*</${name}>`, "gi"),
				(match, attrs) => {
					// Preserve attributes from the tag
					if (attrs) {
						return component.html.replace(new RegExp(`^<${name}`, "i"), `<${name}${attrs}`);
					}
					return component.html;
				},
			);

			// Replace tags with children: inject children into <slot></slot>
			const tagWithChildrenRegex = new RegExp(`<${name}(\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "gi");
			result = result.replace(tagWithChildrenRegex, (match, attrs, children) => {
				// Only process if there's actual content (not just whitespace)
				const trimmedChildren = children.trim();
				if (!trimmedChildren) {
					// Empty content - already handled above, but just in case
					if (attrs) {
						return component.html.replace(new RegExp(`^<${name}`, "i"), `<${name}${attrs}`);
					}
					return component.html;
				}

				// Check if component has a <slot></slot> placeholder
				if (component.html.includes("<slot></slot>")) {
					let replaced = component.html.replace("<slot></slot>", children);
					// Preserve attributes from the tag
					if (attrs) {
						replaced = replaced.replace(new RegExp(`^<${name}`, "i"), `<${name}${attrs}`);
					}
					return replaced;
				}

				// No slot in component - keep original markup as-is
				return match;
			});

			if (result !== before) {
				hasReplacements = true;
				// If this component's HTML starts with its own tag, skip it in future recursions
				// to prevent infinite self-referential loops
				if (component.html.trim().toLowerCase().startsWith(`<${name.toLowerCase()}`)) {
					skipComponents.add(name);
				}
			}
		}

		// Recursively process for nested components
		return hasReplacements ? replaceComponentTags(result, maxDepth - 1, skipComponents) : result;
	}

	/**
	 * Collect all styles from components
	 */
	function collectAllStyles() {
		let allStyles = "";
		for (const [name, component] of componentCache) {
			if (component.styles) {
				allStyles += `/* Component: ${name} */\n${component.styles}\n`;
			}
		}
		return allStyles;
	}

	return {
		name: "html-components",

		configResolved(config) {
			root = config.root;
			loadComponents();
		},

		// Virtual module for component CSS - this goes through Vite's CSS pipeline
		resolveId(id) {
			if (id === VIRTUAL_CSS_ID) {
				return RESOLVED_VIRTUAL_CSS_ID;
			}
		},

		load(id) {
			if (id === RESOLVED_VIRTUAL_CSS_ID) {
				loadComponents();
				return collectAllStyles();
			}
		},

		transformIndexHtml: {
			order: "pre",
			handler(html) {
				loadComponents();
				let result = replaceComponentTags(html);
				return result;
			},
		},

		configureServer(server) {
			const componentsPath = path.resolve(root, componentsDir);
			server.watcher.add(componentsPath);

			server.watcher.on("change", (file) => {
				if (file.startsWith(componentsPath) && file.endsWith(".html")) {
					loadComponents();
					// Invalidate the virtual CSS module
					const mod = server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_CSS_ID);
					if (mod) {
						server.moduleGraph.invalidateModule(mod);
					}
					server.ws.send({ type: "full-reload" });
				}
			});

			server.watcher.on("add", (file) => {
				if (file.startsWith(componentsPath) && file.endsWith(".html")) {
					loadComponents();
					server.ws.send({ type: "full-reload" });
				}
			});
		},
	};
}
