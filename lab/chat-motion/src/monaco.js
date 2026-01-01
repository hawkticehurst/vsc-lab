import * as monaco from "monaco-editor";
import { fileCodeExamples } from "./code.js";
import themeData from "./theme.js";

// Convert VS Code theme to Monaco theme format
function convertVSCodeThemeToMonaco(vscodeTheme) {
	const monacoTheme = {
		base: vscodeTheme.type === "dark" ? "vs-dark" : "vs",
		inherit: true,
		rules: [],
		colors: {},
	};

	// Convert colors (filter out commented/null values)
	if (vscodeTheme.colors) {
		for (const [key, value] of Object.entries(vscodeTheme.colors)) {
			if (value && typeof value === "string") {
				monacoTheme.colors[key] = value;
			}
		}
	}

	// Convert token colors to Monaco rules
	if (vscodeTheme.tokenColors) {
		for (const tokenColor of vscodeTheme.tokenColors) {
			const settings = tokenColor.settings || {};
			const scopes = Array.isArray(tokenColor.scope)
				? tokenColor.scope
				: tokenColor.scope
					? [tokenColor.scope]
					: [""];

			for (const scope of scopes) {
				const rule = { token: scope };
				if (settings.foreground) rule.foreground = settings.foreground.replace("#", "");
				if (settings.background) rule.background = settings.background.replace("#", "");
				if (settings.fontStyle) {
					if (settings.fontStyle.includes("italic")) rule.fontStyle = "italic";
					if (settings.fontStyle.includes("bold")) rule.fontStyle = "bold";
				}
				monacoTheme.rules.push(rule);
			}
		}
	}

	return monacoTheme;
}

// Define custom theme
const customTheme = convertVSCodeThemeToMonaco(themeData);
// Disable the scroll shadow at the top of the editor
customTheme.colors["scrollbar.shadow"] = "#00000000";
monaco.editor.defineTheme("vscode-custom", customTheme);

// Configure Monaco environment for web workers
self.MonacoEnvironment = {
	getWorker: function (workerId, label) {
		const getWorkerModule = (moduleUrl, label) => {
			return new Worker(new URL(`monaco-editor/esm/vs/editor/editor.worker.js`, import.meta.url), {
				type: "module",
			});
		};
		switch (label) {
			case "json":
				return new Worker(
					new URL(`monaco-editor/esm/vs/language/json/json.worker.js`, import.meta.url),
					{ type: "module" },
				);
			case "css":
			case "scss":
			case "less":
				return new Worker(
					new URL(`monaco-editor/esm/vs/language/css/css.worker.js`, import.meta.url),
					{ type: "module" },
				);
			case "html":
			case "handlebars":
			case "razor":
				return new Worker(
					new URL(`monaco-editor/esm/vs/language/html/html.worker.js`, import.meta.url),
					{ type: "module" },
				);
			case "typescript":
			case "javascript":
				return new Worker(
					new URL(`monaco-editor/esm/vs/language/typescript/ts.worker.js`, import.meta.url),
					{ type: "module" },
				);
			default:
				return getWorkerModule("monaco-editor/esm/vs/editor/editor.worker.js", label);
		}
	},
};

let editorInstance = null;

/**
 * Initialize Monaco Editor in the editor-file element
 */
export async function initMonacoEditor() {
	const editorFile = document.querySelector("editor-file[active]");
	if (!editorFile) return null;

	// Find the initial file from the active tab
	const activeTab = document.querySelector("tab-bar tab-item[active] .filename");
	const initialFileName = activeTab ? activeTab.textContent.trim() : "batch.go";
	const codeExample = fileCodeExamples[initialFileName];

	if (!codeExample) return null;

	// Create the Monaco editor
	editorInstance = monaco.editor.create(editorFile, {
		value: codeExample.code,
		language: codeExample.language,
		theme: "vscode-custom",
		automaticLayout: true,
		readOnly: false,
		minimap: { enabled: false },
		scrollBeyondLastLine: false,
		lineNumbers: "on",
		renderLineHighlight: "none",
		overviewRulerLanes: 0,
		hideCursorInOverviewRuler: true,
		overviewRulerBorder: false,
		scrollbar: {
			vertical: "auto",
			horizontal: "auto",
			handleMouseWheel: true,
		},
		fontFamily: "var(--vscode-editor-font-family, 'Menlo', 'Monaco', 'Courier New', monospace)",
		fontSize: 13,
		lineHeight: 18,
		padding: { top: 8, bottom: 8 },
		folding: false,
		glyphMargin: false,
		contextmenu: false,
		selectionHighlight: false,
		occurrencesHighlight: "off",
		renderValidationDecorations: "off",
		stickyScroll: { enabled: false },
	});

	return editorInstance;
}

/**
 * Set the editor content for a given filename
 * @param {string} filename - The filename to load
 */
export function setEditorContent(filename) {
	if (!editorInstance) return;

	const codeExample = fileCodeExamples[filename];
	if (!codeExample) return;

	// Get the language model for the file
	const model = editorInstance.getModel();
	if (model) {
		// Update both the content and language
		monaco.editor.setModelLanguage(model, codeExample.language);
		editorInstance.setValue(codeExample.code);
		// Scroll to top
		editorInstance.setScrollPosition({ scrollTop: 0 });
	}
}

/**
 * Get the current Monaco editor instance
 */
export function getEditorInstance() {
	return editorInstance;
}

/**
 * Dispose of the Monaco editor instance
 */
export function disposeEditor() {
	if (editorInstance) {
		editorInstance.dispose();
		editorInstance = null;
	}
}
