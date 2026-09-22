// generate_theme_manifest.js
// Varre a pasta `themes` e escreve `themes/manifest.json` com objetos compatíveis
// com `window.BUILTIN_THEMES`. Cada objeto tem `id`, `name`, `group` e o CSS cru.
//
// Arquivos cujo CSS é idêntico a um tema já embutido em themes.js são ignorados:
// eles entrariam duplicados na lista, com nome pior e sem link de origem.
//
// A classificação (tone/tags) não sai daqui: ela exige um motor de CSS de verdade,
// porque tema com variável ou @media engana leitura por regex. Quem mede é
// `node scripts/classify-themes.mjs`, que roda os temas no Chrome. Este script
// preserva a classificação já existente no manifest ao regerar.
//
// Uso: node generate_theme_manifest.js

const fs = require('fs');
const path = require('path');

const themesDir = path.join(__dirname, 'themes');
const manifestPath = path.join(themesDir, 'manifest.json');
const themesJsPath = path.join(__dirname, 'themes.js');

const ACRONYMS = new Map(Object.entries({
  qa: 'QA', api: 'API', iso: 'ISO', ibm: 'IBM', mdn: 'MDN', a4: 'A4', css: 'CSS',
  ui: 'UI', ux: 'UX', pdf: 'PDF', html: 'HTML', vscode: 'VS Code', latex: 'LaTeX',
  github: 'GitHub', macos: 'macOS', ios: 'iOS', os: 'OS', id: 'ID',
}));

function titleCase(words) {
  return words.map(w => ACRONYMS.get(w.toLowerCase()) || w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function displayName(fileBase) {
  const withoutIndex = fileBase.replace(/^\d+[-_]/, '');
  return titleCase(withoutIndex.split(/[-_]/).filter(Boolean));
}

function sortKey(fileBase) {
  const m = fileBase.match(/^(\d+)[-_]/);
  // arquivos numerados vêm primeiro, na ordem numérica; o resto em ordem alfabética
  return m ? [0, Number(m[1]), ''] : [1, 0, fileBase.toLowerCase()];
}

function collectCssFiles(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...collectCssFiles(fullPath));
    else if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.css') files.push({ fileName: entry.name, fullPath });
  }
  return files;
}

function builtinCssSet() {
  const src = fs.readFileSync(themesJsPath, 'utf8');
  const cut = src.indexOf('\n(function(){');
  const sandbox = { window: {} };
  new Function('window', src.slice(0, cut < 0 ? src.length : cut)).call(sandbox, sandbox.window);
  const normalize = css => css.replace(/\s+/g, ' ').trim();
  return new Set((sandbox.window.BUILTIN_THEMES || []).map(t => normalize(t.css)));
}

function previousClassification() {
  try {
    const previous = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    return new Map(previous.filter(t => t.tone).map(t => [t.id, { tone: t.tone, tags: t.tags || [] }]));
  } catch {
    return new Map();
  }
}

const builtinCss = builtinCssSet();
const classification = previousClassification();
const normalize = css => css.replace(/\s+/g, ' ').trim();

const files = collectCssFiles(themesDir)
  .map(f => ({ ...f, base: path.parse(f.fileName).name }))
  .sort((a, b) => {
    const ka = sortKey(a.base), kb = sortKey(b.base);
    return ka[0] - kb[0] || ka[1] - kb[1] || ka[2].localeCompare(kb[2]);
  });

const themes = [];
let skipped = 0;
for (const { base, fullPath } of files) {
  const css = fs.readFileSync(fullPath, 'utf8');
  if (builtinCss.has(normalize(css))) { skipped++; continue; }
  const id = `custom/${base}`;
  const theme = { id, name: displayName(base), group: 'custom/themes', css };
  const known = classification.get(id);
  if (known) { theme.tone = known.tone; theme.tags = known.tags; }
  themes.push(theme);
}

fs.writeFileSync(manifestPath, JSON.stringify(themes, null, 2), 'utf8');
const unclassified = themes.filter(t => !t.tone).length;
console.log(`manifest com ${themes.length} temas em ${manifestPath}`);
console.log(`${skipped} arquivos ignorados por duplicarem um tema embutido em themes.js`);
if (unclassified) console.log(`${unclassified} sem classificação: rode "node scripts/classify-themes.mjs"`);
