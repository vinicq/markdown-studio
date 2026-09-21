// generate_theme_manifest.js
// This script scans the `themes` directory and creates a `manifest.json`
// containing theme objects compatible with `window.BUILTIN_THEMES`.
// Each object includes an `id`, `name`, `group`, and the raw CSS content.
// Run with: `node generate_theme_manifest.js`

const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, 'themes');
const manifestPath = path.join(themesDir, 'manifest.json');

function createThemeObject(fileName, content) {
  // Derive id and name from the CSS filename, stripping the first hyphen/underscore segment
  const base = path.parse(fileName).name; // e.g., "github-markdown-dark"
  const parts = base.split(/[-_]/);
  const cleaned = parts.length > 1 ? parts.slice(1).join('-') : base; // remove leading segment
  const id = `custom/${cleaned}`;
  const name = cleaned.replace(/[-_]/g, ' ');
  const group = 'custom/themes';
  return { id, name, group, css: content };
}

// Recursively scan the themes folder for .css files and ignore any folder prefixes.
function collectCssFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const cssFiles = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      // Recurse into subfolders
      cssFiles.push(...collectCssFiles(fullPath));
    } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.css') {
      // Store only the base filename (no directories) for the theme name
+      cssFiles.push({ fileName: entry.name, fullPath });
    }
  }
  return cssFiles;
}

const cssFiles = collectCssFiles(themesDir);
const themeObjs = [];
let counter = 1;
for (const { fileName, fullPath } of cssFiles) {
  const css = fs.readFileSync(fullPath, 'utf8');
  const theme = createThemeObject(fileName, css);
  
  // Add numbering to the theme name
  theme.name = `${counter}. ${theme.name}`;
  
  themeObjs.push(theme);
  counter++;
}
// Write pretty JSON
fs.writeFileSync(manifestPath, JSON.stringify(themeObjs, null, 2), 'utf8');
console.log(`Generated manifest with ${themeObjs.length} themes at ${manifestPath}`);
