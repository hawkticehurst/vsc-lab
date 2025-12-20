import fs from "fs";
import path from "path";

/**
 * A simple Vite plugin for HTML component templating.
 * - Reads `.html` component files from `src/components/`
 * - Replaces custom element tags in index.html with their component markup
 * - Bundles all component styles into a single CSS file
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
   */
  function replaceComponentTags(html, maxDepth = 10) {
    if (maxDepth <= 0) {
      console.warn("Max component nesting depth reached");
      return html;
    }

    let result = html;
    let hasReplacements = false;

    for (const [name, component] of componentCache) {
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

      if (result !== before) hasReplacements = true;
    }

    // Recursively process for nested components
    return hasReplacements ? replaceComponentTags(result, maxDepth - 1) : result;
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

    transformIndexHtml: {
      order: "pre",
      handler(html) {
        loadComponents();
        let result = replaceComponentTags(html);

        const allStyles = collectAllStyles();
        if (allStyles) {
          result = result.replace(
            "</head>",
            `<style data-html-components>\n${allStyles}</style>\n</head>`,
          );
        }

        return result;
      },
    },

    generateBundle(options, bundle) {
      const allStyles = collectAllStyles();
      if (!allStyles) return;

      // Emit separate CSS file
      this.emitFile({
        type: "asset",
        fileName: "components.css",
        source: allStyles,
      });

      // Update HTML: remove inline styles, add link to CSS file
      for (const fileName of Object.keys(bundle)) {
        if (fileName.endsWith(".html")) {
          const chunk = bundle[fileName];
          if (chunk.type === "asset" && typeof chunk.source === "string") {
            chunk.source = chunk.source
              .replace(/<style data-html-components>[\s\S]*?<\/style>\s*/, "")
              .replace("</head>", `<link rel="stylesheet" href="./components.css">\n</head>`);
          }
        }
      }
    },

    configureServer(server) {
      const componentsPath = path.resolve(root, componentsDir);
      server.watcher.add(componentsPath);

      server.watcher.on("change", (file) => {
        if (file.startsWith(componentsPath) && file.endsWith(".html")) {
          loadComponents();
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
