#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set paths for the theme and output files
// Adjust the paths as necessary
const themePath = path.join(__dirname, '../public/light-theme.jsonc');
const outputPath = path.join(__dirname, '../public/light-theme.css');

// Function to convert JSON theme to CSS variables
function convertThemeToCss(themePath, outputPath) {
  try {
    // Read the theme file
    const themeContent = fs.readFileSync(themePath, 'utf8');
    
    // Remove comments and parse JSON more robustly
    const cleanedContent = themeContent
      .replace(/\/\/.*$/gm, '')         // Remove single line comments
      .replace(/\/\*[\s\S]*?\*\//gm, '') // Remove multi-line comments
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, ''); // Remove control characters
    
    // Parse the cleaned JSON content
    const themeJson = JSON.parse(cleanedContent);
    
    // Extract colors
    const colors = themeJson.colors || {};
    
    // Convert to CSS variables
    const cssVariables = Object.entries(colors).map(([key, value]) => {
      // Replace dots with hyphens
      const variableName = key.replace(/\./g, '-');
      return `  --${variableName}: ${value};`;
    }).join('\n');
    
    // Create CSS root declaration
    const cssContent = `:root {\n${cssVariables}\n}`;
    
    // Write to output file
    fs.writeFileSync(outputPath, cssContent, 'utf8');
    
    console.log(`✅ CSS variables generated at ${outputPath}`);
  } catch (error) {
    console.error('Error converting theme to CSS:', error);
    // Log more detailed information for debugging
    if (error instanceof SyntaxError) {
      console.error('JSON Syntax Error Details:', error.message);
    }
  }
}

// Execute the conversion
convertThemeToCss(themePath, outputPath);