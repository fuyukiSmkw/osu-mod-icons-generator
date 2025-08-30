import { readFileSync, writeFileSync } from 'fs';
import { spawn } from 'child_process';
import { resolve } from 'path';

// Helper function to convert a string to snake-case-with-dashes
function toDashCase(str) {
  return str.toLowerCase().replace(/\s+/g, '-');
}

// Get the current directory
const currentDir = process.cwd();
const exportDir = resolve(currentDir, 'export');

// Define file paths
const modsFile = resolve(currentDir, 'mods.json');
const templateFile = resolve(currentDir, process.env.TEMPLATE || 'template.svg');

// Define the DPI from environment variables or use a default
const dpi = process.env.DPI || 96;

try {
  fs.mkdirSync(exportDir, { recursive: true });

  // Read the mods data
  const modsDataRaw = readFileSync(modsFile, 'utf8');
  const allRulesets = JSON.parse(modsDataRaw);

  // Read the template SVG file
  const svgTemplate = readFileSync(templateFile, 'utf8');

  // Use a Set to store processed acronyms and avoid duplicates
  const processedAcronyms = new Set();

  // Process each ruleset and its mods
  for (const ruleset of allRulesets) {
    if (!ruleset.Mods) continue;

    for (const mod of ruleset.Mods) {
      const { Acronym, Name, Type } = mod;

      // Skip if this mod has already been processed
      if (processedAcronyms.has(Acronym)) {
        continue;
      }
      processedAcronyms.add(Acronym);

      // Sanitize the filename
      const dashCaseName = toDashCase(Name);
      const outputFileName = `${Acronym}.png`;

      // Replace placeholders in the SVG template
      const modifiedSvgContent = svgTemplate
        .replace(/MODACRONYM/g, Acronym)
        .replace(/MODTYPE/g, Type)
        .replace(/MODNAME/g, dashCaseName);

      // Define Inkscape arguments
      const inkscapeArgs = [
        '--export-dpi',
        dpi.toString(),
        '--export-type',
        'png',
        '--export-filename',
        resolve(exportDir, outputFileName),
        '--pipe',
      ];

      // DEBUG
      // console.log(modifiedSvgContent);
      // process.exit();

      // Spawn the Inkscape process
      const inkscapeProcess = spawn('inkscape', inkscapeArgs);

      // Pipe the modified SVG content to Inkscape's stdin
      inkscapeProcess.stdin.write(modifiedSvgContent);
      inkscapeProcess.stdin.end();

      // Handle process close
      inkscapeProcess.on('close', (code) => {
        if (code === 0) {
          console.log(`Successfully generated: ${outputFileName}`);
        } else {
          console.error(`Inkscape failed for ${outputFileName} with code ${code}`);
        }
      });

      // Handle errors
      inkscapeProcess.on('error', (err) => {
        console.error(`Failed to start Inkscape process: ${err.message}`);
      });
    }
  }

  console.log('Mod image generation process started.');
} catch (error) {
  console.error(`An error occurred: ${error.message}`);
}
