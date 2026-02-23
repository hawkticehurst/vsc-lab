import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get current file's directory with ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// The folders containing projects
const LAB_DIR = "lab";
const TOOLS_DIR = "tools";

// Directories to exclude when scanning for projects
const EXCLUDED_DIRS = ["node_modules", "build", ".git", ".vscode"];

// File extensions to copy for vanilla projects
const VANILLA_EXTENSIONS = [
	".html",
	".css",
	".js",
	".json",
	".svg",
	".png",
	".jpg",
	".jpeg",
	".gif",
	".ico",
	".woff",
	".woff2",
	".ttf",
	".eot",
];

// Get all project directories in the lab folder
function getProjects(labPath) {
	return fs.readdirSync(labPath).filter((file) => {
		const fullPath = path.join(labPath, file);
		return fs.statSync(fullPath).isDirectory() && !EXCLUDED_DIRS.includes(file);
	});
}

// Check if a project has a build command in package.json
function hasBuildCommand(projectPath) {
	const packageJsonPath = path.join(projectPath, "package.json");
	if (!fs.existsSync(packageJsonPath)) {
		return false;
	}
	try {
		const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
		return packageJson.scripts && packageJson.scripts.build;
	} catch {
		return false;
	}
}

// Build a project that has a build command
function buildProject(projectPath) {
	const projectName = path.basename(projectPath);
	console.log(`\nBuilding project: ${projectName}...`);

	try {
		// Check if node_modules exists
		const nodeModulesPath = path.join(projectPath, "node_modules");
		if (!fs.existsSync(nodeModulesPath)) {
			console.log("Installing dependencies...");
			execSync("pnpm install", {
				cwd: projectPath,
				stdio: "inherit",
			});
		} else {
			console.log("Dependencies already installed, skipping install...");
		}

		// Run build command
		console.log("Running build command...");
		execSync("pnpm run build", {
			cwd: projectPath,
			stdio: "inherit",
		});

		console.log(`Successfully built ${projectName}`);
		return true;
	} catch (error) {
		console.error(`Error building ${projectName}:`, error.message);
		return false;
	}
}

// Copy build output from a built project to consolidated build directory
function copyBuildOutput(projectPath, consolidatedBuildPath) {
	const projectName = path.basename(projectPath);
	const targetPath = path.join(consolidatedBuildPath, projectName);

	// Check for common build output directories (build/ or dist/)
	const possibleBuildDirs = ["build", "dist"];
	let sourceBuildPath = null;

	for (const dir of possibleBuildDirs) {
		const candidate = path.join(projectPath, dir);
		if (fs.existsSync(candidate)) {
			sourceBuildPath = candidate;
			break;
		}
	}

	if (!sourceBuildPath) {
		console.error(
			`No build directory found in ${projectName} (checked: ${possibleBuildDirs.join(", ")})`,
		);
		return;
	}

	// Create target directory if it doesn't exist
	if (!fs.existsSync(targetPath)) {
		fs.mkdirSync(targetPath, { recursive: true });
	}

	// Copy build contents, but skip the nested project directory
	console.log(`Copying build output from ${projectName}...`);
	const nestedProjectDir = path.join(sourceBuildPath, projectName);

	// If there's a nested project directory, copy from there instead
	const sourceDir = fs.existsSync(nestedProjectDir) ? nestedProjectDir : sourceBuildPath;
	copyRecursive(sourceDir, targetPath);
}

// Copy vanilla project (no build step) to consolidated build directory
function copyVanillaProject(projectPath, consolidatedBuildPath) {
	const projectName = path.basename(projectPath);
	const targetPath = path.join(consolidatedBuildPath, projectName);

	console.log(`\nCopying vanilla project: ${projectName}...`);

	// Create target directory if it doesn't exist
	if (!fs.existsSync(targetPath)) {
		fs.mkdirSync(targetPath, { recursive: true });
	}

	// Copy all relevant files (excluding node_modules, etc.)
	copyRecursive(projectPath, targetPath, true);
	console.log(`Successfully copied ${projectName}`);
}

// Recursive copy function
// When isVanilla is true, filter out non-essential directories and files
function copyRecursive(src, dest, isVanilla = false) {
	const exists = fs.existsSync(src);
	const stats = exists && fs.statSync(src);
	const isDirectory = exists && stats.isDirectory();

	if (isDirectory) {
		const dirName = path.basename(src);

		// Skip excluded directories for vanilla projects
		if (isVanilla && EXCLUDED_DIRS.includes(dirName)) {
			return;
		}

		if (!fs.existsSync(dest)) {
			fs.mkdirSync(dest);
		}
		fs.readdirSync(src).forEach((childItemName) => {
			copyRecursive(path.join(src, childItemName), path.join(dest, childItemName), isVanilla);
		});
	} else {
		// For vanilla projects, only copy specific file types
		if (isVanilla) {
			const ext = path.extname(src).toLowerCase();
			if (!VANILLA_EXTENSIONS.includes(ext)) {
				return;
			}
		}
		fs.copyFileSync(src, dest);
	}
}

// Format project name for display (e.g., "mcp-tool-picker" -> "MCP Tool Picker")
function formatProjectName(name) {
	return name
		.split("-")
		.map((word) => {
			// Keep common acronyms uppercase
			if (["mcp", "ui", "api", "css", "html", "js"].includes(word.toLowerCase())) {
				return word.toUpperCase();
			}
			return word.charAt(0).toUpperCase() + word.slice(1);
		})
		.join(" ");
}

// Generate HTML links for a list of projects
function generateProjectLinks(projects, emptyMessage) {
	if (projects.length === 0) {
		return `<div class="empty-state">${emptyMessage}</div>`;
	}

	return projects
		.sort()
		.map((project) => {
			const displayName = formatProjectName(project);
			return `<a href="./${project}/" class="demo-link">
                    <span class="demo-name">${displayName}</span>
                    <svg class="demo-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </a>`;
		})
		.join("\n                ");
}

// Generate the index.html homepage with links to all demos and tools
function generateHomepage(demos, tools, consolidatedBuildPath, rootDir) {
	const templatePath = path.join(rootDir, "assets", "index.html");
	const outputPath = path.join(consolidatedBuildPath, "index.html");

	if (!fs.existsSync(templatePath)) {
		console.error("Homepage template not found at assets/index.html");
		return;
	}

	let template = fs.readFileSync(templatePath, "utf-8");

	// Generate the demo links HTML
	const demosHtml = generateProjectLinks(demos, "No demos found");

	// Generate the tools links HTML
	const toolsHtml = generateProjectLinks(tools, "No tools found");

	// Replace the placeholders with generated links
	template = template.replace("<!-- DEMOS_LIST -->", demosHtml);
	template = template.replace("<!-- TOOLS_LIST -->", toolsHtml);

	fs.writeFileSync(outputPath, template);
	console.log("\nGenerated homepage: index.html");
}

// Process all projects in a directory and return list of successfully built projects
function processDirectory(sourceDir, consolidatedBuildPath, label) {
	if (!fs.existsSync(sourceDir)) {
		console.log(`\n${label} directory not found: ${sourceDir}, skipping...`);
		return [];
	}

	const projects = getProjects(sourceDir);
	console.log(`\nFound ${label.toLowerCase()}:`, projects);

	const builtProjects = [];
	for (const project of projects) {
		const projectPath = path.join(sourceDir, project);

		if (hasBuildCommand(projectPath)) {
			// Project has a build command - build it and copy output
			const success = buildProject(projectPath);
			if (success) {
				copyBuildOutput(projectPath, consolidatedBuildPath);
				builtProjects.push(project);
			}
		} else {
			// Vanilla project - copy files directly
			copyVanillaProject(projectPath, consolidatedBuildPath);
			builtProjects.push(project);
		}
	}

	return builtProjects;
}

// Main function
async function main() {
	const rootDir = path.resolve(__dirname, "..");
	const labDir = path.join(rootDir, LAB_DIR);
	const toolsDir = path.join(rootDir, TOOLS_DIR);
	const consolidatedBuildPath = path.join(rootDir, "build");

	// Create consolidated build directory
	if (fs.existsSync(consolidatedBuildPath)) {
		fs.rmSync(consolidatedBuildPath, { recursive: true });
	}
	fs.mkdirSync(consolidatedBuildPath);

	// Process lab demos
	const builtDemos = processDirectory(labDir, consolidatedBuildPath, "Demos");

	// Process tools
	const builtTools = processDirectory(toolsDir, consolidatedBuildPath, "Tools");

	// Generate the homepage with links to all demos and tools
	generateHomepage(builtDemos, builtTools, consolidatedBuildPath, rootDir);

	console.log("\nBuild process completed!");
	console.log(`Consolidated build output is in: ${consolidatedBuildPath}`);
}

// Run the script
main().catch((error) => {
	console.error("Build failed:", error);
	process.exit(1);
});
