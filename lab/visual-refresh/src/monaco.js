import * as monaco from "monaco-editor";
import { fileCodeExamples } from "./code.js";
import themeData from "./theme.js";

// Monaco-specific token rules (Monaco uses simpler token names than VS Code TextMate scopes)
const monacoTokenRules = [
	// Comments - muted blue-gray italic
	{ token: "comment", foreground: "7a8aa8", fontStyle: "italic" },
	{ token: "comment.go", foreground: "7a8aa8", fontStyle: "italic" },
	{ token: "comment.js", foreground: "7a8aa8", fontStyle: "italic" },
	{ token: "comment.ts", foreground: "7a8aa8", fontStyle: "italic" },
	
	// Keywords - bright cyan
	{ token: "keyword", foreground: "7cd5f0" },
	{ token: "keyword.go", foreground: "7cd5f0" },
	{ token: "keyword.js", foreground: "7cd5f0" },
	{ token: "keyword.ts", foreground: "7cd5f0" },
	{ token: "keyword.tsx", foreground: "7cd5f0" },
	{ token: "keyword.jsx", foreground: "7cd5f0" },
	
	// Control flow keywords - lavender purple
	{ token: "keyword.flow", foreground: "d4a8ff" },
	{ token: "keyword.control", foreground: "d4a8ff" },
	{ token: "keyword.flow.go", foreground: "d4a8ff" },
	{ token: "keyword.control.go", foreground: "d4a8ff" },
	{ token: "keyword.flow.js", foreground: "d4a8ff" },
	{ token: "keyword.flow.ts", foreground: "d4a8ff" },
	
	// Strings - coral pink
	{ token: "string", foreground: "ffb5a0" },
	{ token: "string.go", foreground: "ffb5a0" },
	{ token: "string.js", foreground: "ffb5a0" },
	{ token: "string.ts", foreground: "ffb5a0" },
	{ token: "string.escape", foreground: "ffc87a" },
	{ token: "string.escape.go", foreground: "ffc87a" },
	
	// Numbers - peachy gold  
	{ token: "number", foreground: "ffc87a" },
	{ token: "number.go", foreground: "ffc87a" },
	{ token: "number.js", foreground: "ffc87a" },
	{ token: "number.ts", foreground: "ffc87a" },
	{ token: "number.float", foreground: "ffc87a" },
	{ token: "number.hex", foreground: "ffc87a" },
	
	// Types - teal mint (for Go structs, interfaces, type names)
	{ token: "type", foreground: "7ae8d0" },
	{ token: "type.go", foreground: "7ae8d0" },
	{ token: "type.ts", foreground: "7ae8d0" },
	{ token: "type.identifier", foreground: "7ae8d0" },
	{ token: "type.identifier.go", foreground: "7ae8d0" },
	{ token: "type.identifier.ts", foreground: "7ae8d0" },
	
	// Predefined/builtin types and functions - warm gold
	{ token: "predefined", foreground: "f8d87a" },
	{ token: "predefined.go", foreground: "f8d87a" },
	{ token: "predefined.ts", foreground: "f8d87a" },
	
	// Identifiers/Variables - soft lavender-blue (different from sky blue)
	{ token: "identifier", foreground: "b8c8e8" },
	{ token: "identifier.go", foreground: "b8c8e8" },
	{ token: "identifier.js", foreground: "b8c8e8" },
	{ token: "identifier.ts", foreground: "b8c8e8" },
	{ token: "variable", foreground: "b8c8e8" },
	{ token: "variable.go", foreground: "b8c8e8" },
	{ token: "variable.js", foreground: "b8c8e8" },
	{ token: "variable.ts", foreground: "b8c8e8" },
	
	// Functions - warm peach/apricot
	{ token: "function", foreground: "ffcaa0" },
	{ token: "function.go", foreground: "ffcaa0" },
	{ token: "function.js", foreground: "ffcaa0" },
	{ token: "function.ts", foreground: "ffcaa0" },
	{ token: "entity.name.function", foreground: "ffcaa0" },
	
	// Operators - soft pink (different from keywords)
	{ token: "operator", foreground: "f0a8c0" },
	{ token: "operator.go", foreground: "f0a8c0" },
	{ token: "operator.js", foreground: "f0a8c0" },
	{ token: "operator.ts", foreground: "f0a8c0" },
	
	// Delimiters - muted
	{ token: "delimiter", foreground: "a0a8b8" },
	{ token: "delimiter.go", foreground: "a0a8b8" },
	{ token: "delimiter.js", foreground: "a0a8b8" },
	{ token: "delimiter.ts", foreground: "a0a8b8" },
	
	// Brackets/punctuation - subtle
	{ token: "delimiter.bracket", foreground: "c8d0df" },
	{ token: "delimiter.parenthesis", foreground: "c8d0df" },
	{ token: "delimiter.curly", foreground: "c8d0df" },
	{ token: "delimiter.square", foreground: "c8d0df" },
	{ token: "bracket", foreground: "c8d0df" },
	
	// ===== JSX/TSX SPECIFIC - more color variety =====
	// HTML tag names (lowercase like div, span, header) - soft rose pink
	{ token: "tag", foreground: "ff9eb0" },
	{ token: "tag.html", foreground: "ff9eb0" },
	{ token: "tag.js", foreground: "ff9eb0" },
	{ token: "tag.ts", foreground: "ff9eb0" },
	{ token: "tag.jsx", foreground: "ff9eb0" },
	{ token: "tag.tsx", foreground: "ff9eb0" },
	{ token: "metatag", foreground: "ff9eb0" },
	{ token: "metatag.html", foreground: "ff9eb0" },
	{ token: "metatag.js", foreground: "ff9eb0" },
	{ token: "metatag.jsx", foreground: "ff9eb0" },
	{ token: "metatag.tsx", foreground: "ff9eb0" },
	
	// JSX Attributes - warm gold/yellow (distinct from tags)
	{ token: "attribute.name", foreground: "f8d87a", fontStyle: "italic" },
	{ token: "attribute.name.html", foreground: "f8d87a", fontStyle: "italic" },
	{ token: "attribute.name.js", foreground: "f8d87a", fontStyle: "italic" },
	{ token: "attribute.name.jsx", foreground: "f8d87a", fontStyle: "italic" },
	{ token: "attribute.name.tsx", foreground: "f8d87a", fontStyle: "italic" },
	{ token: "attribute.name.ts", foreground: "f8d87a", fontStyle: "italic" },
	{ token: "attribute.value", foreground: "ffb5a0" },
	{ token: "attribute.value.html", foreground: "ffb5a0" },
	{ token: "attribute.value.js", foreground: "ffb5a0" },
	{ token: "attribute.value.jsx", foreground: "ffb5a0" },
	
	// ===== GO SPECIFIC - more color diversity =====
	// Struct fields - soft mint/seafoam (different from variables)
	{ token: "variable.property", foreground: "a8e0c8" },
	{ token: "variable.property.go", foreground: "a8e0c8" },
	{ token: "property", foreground: "a8e0c8" },
	{ token: "property.go", foreground: "a8e0c8" },
	
	// Package/namespace - warm lavender
	{ token: "namespace", foreground: "d4a8f0" },
	{ token: "namespace.go", foreground: "d4a8f0" },
	{ token: "namespace.ts", foreground: "d4a8f0" },
	
	// Constants - bright mint green
	{ token: "constant", foreground: "8be8af" },
	{ token: "constant.go", foreground: "8be8af" },
	{ token: "constant.language", foreground: "7aecd6" },
	{ token: "constant.language.go", foreground: "7aecd6" },
	
	// Regexp
	{ token: "regexp", foreground: "ff9eb0" },
	
	// Annotations/decorators - lavender
	{ token: "annotation", foreground: "c8a8f0" },
	{ token: "annotation.go", foreground: "c8a8f0" },
	{ token: "decorator", foreground: "c8a8f0" },
	
	// ===== CSS specific =====
	{ token: "attribute.name.css", foreground: "f8d87a" },
	{ token: "attribute.value.css", foreground: "ffb5a0" },
	{ token: "tag.css", foreground: "ff9eb0" },
	{ token: "selector.css", foreground: "f8d87a" },
	{ token: "property.css", foreground: "9dcfff" },
	{ token: "value.css", foreground: "ffb5a0" },
	
	// ===== JSON specific =====
	{ token: "string.key.json", foreground: "a8c8ff" },
	{ token: "string.value.json", foreground: "ffb5a0" },
	
	// Invalid
	{ token: "invalid", foreground: "ff9eb0" },
	
	// White/default - subtle blue-gray
	{ token: "", foreground: "c8d0e0" },
	{ token: "source", foreground: "c8d0e0" },
	{ token: "source.go", foreground: "c8d0e0" },
	{ token: "source.js", foreground: "c8d0e0" },
	{ token: "source.ts", foreground: "c8d0e0" },
];

// Convert VS Code theme to Monaco theme format
function convertVSCodeThemeToMonaco(vscodeTheme) {
	const monacoTheme = {
		base: vscodeTheme.type === "dark" ? "vs-dark" : "vs",
		inherit: false, // Don't inherit from base - use our rules only
		rules: [...monacoTokenRules], // Start with Monaco-specific rules
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

	// Also add TextMate-style rules for any languages that use TextMate grammars
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
