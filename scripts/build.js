import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

// Get current file's directory with ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directories to exclude from the build process
const EXCLUDED_DIRS = ['assets', 'scripts', 'node_modules', 'build', '.git', '.vscode'];

// Get all directories in the root folder
function getDirectories(srcPath) {
	return fs.readdirSync(srcPath)
		.filter(
			file => fs.statSync(path.join(srcPath, file)).isDirectory() && !EXCLUDED_DIRS.includes(file)
		);
}

// Build a specific project
function buildProject(projectPath) {
    console.log(`\nBuilding project in ${projectPath}...`);
    
    try {
        // Check if node_modules exists
        const nodeModulesPath = path.join(projectPath, 'node_modules');
        if (!fs.existsSync(nodeModulesPath)) {
            // Install dependencies only if node_modules doesn't exist
            console.log('Installing dependencies...');
            execSync('npm install', {
                cwd: projectPath,
                stdio: 'inherit'
            });
        } else {
            console.log('Node modules already installed, skipping npm install...');
        }

        // Run build command
        console.log('Running build command...');
        execSync('npm run build', {
            cwd: projectPath,
            stdio: 'inherit'
        });

        console.log(`Successfully built ${projectPath}`);
        return true;
    } catch (error) {
        console.error(`Error building ${projectPath}:`, error.message);
        return false;
    }
}

// Copy build output to consolidated build directory
function copyBuildOutput(projectPath, consolidatedBuildPath) {
    const projectName = path.basename(projectPath);
    const sourceBuildPath = path.join(projectPath, 'build');
    const targetPath = path.join(consolidatedBuildPath, projectName);

    if (!fs.existsSync(sourceBuildPath)) {
        console.error(`No build directory found in ${projectPath}`);
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

// Recursive copy function
function copyRecursive(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();

    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest);
        }
        fs.readdirSync(src).forEach(childItemName => {
            copyRecursive(
                path.join(src, childItemName),
                path.join(dest, childItemName)
            );
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

// Main function
async function main() {
    const rootDir = path.resolve(__dirname, '..');
    const consolidatedBuildPath = path.join(rootDir, 'build');

    // Create consolidated build directory
    if (fs.existsSync(consolidatedBuildPath)) {
        fs.rmSync(consolidatedBuildPath, { recursive: true });
    }
    fs.mkdirSync(consolidatedBuildPath);

    // Get all project directories
    const projects = getDirectories(rootDir);
    console.log('Found projects:', projects);

    // Build each project
    for (const project of projects) {
        const projectPath = path.join(rootDir, project);
        const success = buildProject(projectPath);
        
        if (success) {
            copyBuildOutput(projectPath, consolidatedBuildPath);
        }
    }

    console.log('\nBuild process completed!');
    console.log(`Consolidated build output is in: ${consolidatedBuildPath}`);
}

// Run the script
main().catch(error => {
    console.error('Build failed:', error);
    process.exit(1);
});