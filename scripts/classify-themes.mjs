// classify-themes.mjs
// Classifica cada tema em claro/escuro e traços (papel, serifado, alto contraste)
// e grava o resultado em themes/manifest.json e themes.js.
//
// A medição roda no Chrome porque ler CSS por regex erra: tema com variável CSS
// (`var(--color-canvas-default)`) ou com @media devolve o fundo errado, e temas
// escuros como Dracula e Tokyo Night foram classificados como claros nesse teste.
// O navegador resolve cascata, especificidade e variáveis; é a única fonte confiável.
//
// Uso: node scripts/classify-themes.mjs   (precisa do Chrome instalado)

import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const PORT = 8123;
const DEBUG_PORT = 9422;

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean);

const chromePath = CHROME_CANDIDATES.find(p => existsSync(p));
if (!chromePath) {
  console.error('Chrome não encontrado. Defina CHROME_PATH apontando para o executável.');
  process.exit(1);
}

const MIME = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json' };
const server = createServer((req, res) => {
  const urlPath = decodeURIComponent(req.url.split('?')[0]);
  try {
    const body = readFileSync(join(root, urlPath));
    res.writeHead(200, { 'Content-Type': MIME[extname(urlPath)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404); res.end('not found');
  }
});
await new Promise(resolve => server.listen(PORT, resolve));

const profile = mkdtempSync(join(tmpdir(), 'theme-classify-'));
const chrome = spawn(chromePath, [
  '--headless=new', '--disable-gpu', '--no-sandbox',
  `--remote-debugging-port=${DEBUG_PORT}`, `--user-data-dir=${profile}`, 'about:blank',
], { stdio: 'ignore' });

function shutdown() {
  chrome.kill();
  server.close();
  try { rmSync(profile, { recursive: true, force: true }); } catch {}
}

try {
  let target = null;
  for (let i = 0; i < 30 && !target; i++) {
    await new Promise(r => setTimeout(r, 400));
    try {
      const list = await (await fetch(`http://localhost:${DEBUG_PORT}/json`)).json();
      target = list.find(t => t.type === 'page');
    } catch {}
  }
  if (!target) throw new Error('Chrome não respondeu na porta de depuração.');

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  let msgId = 0;
  const pending = new Map();
  const send = (method, params = {}) => new Promise(resolve => {
    const id = ++msgId; pending.set(id, resolve);
    ws.send(JSON.stringify({ id, method, params }));
  });
  ws.addEventListener('message', ev => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg.result); pending.delete(msg.id); }
  });
  await new Promise(resolve => ws.addEventListener('open', resolve));

  await send('Page.enable');
  await send('Runtime.enable');
  // a prévia do app roda em esquema claro; medir em dark mudaria o resultado de temas com @media
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: 'light' }] });
  await send('Page.navigate', { url: `http://localhost:${PORT}/scripts/measure-themes.html` });

  let measurements = null;
  for (let i = 0; i < 120; i++) {
    await new Promise(r => setTimeout(r, 1000));
    const status = await send('Runtime.evaluate', { expression: `document.getElementById('status').textContent`, returnByValue: true });
    process.stdout.write(`\r${status.result.value}   `);
    if (String(status.result.value).startsWith('pronto')) {
      const raw = await send('Runtime.evaluate', { expression: `JSON.stringify(window.__RESULTS__)`, returnByValue: true });
      measurements = JSON.parse(raw.result.value);
      break;
    }
  }
  console.log('');
  if (!measurements) throw new Error('a medição não terminou');

  const classify = m => {
    const tone = m.lum < 0.22 ? 'escuro' : 'claro';
    const tags = [];
    if (tone === 'claro' && Math.min(...m.bg) < 246) tags.push('papel');
    if (m.serif) tags.push('serifado');
    if (m.ratio >= 15) tags.push('contraste');
    return { tone, tags };
  };
  const byId = new Map(measurements.map(m => [m.id, classify(m)]));

  // manifest.json: objeto por objeto, preservando o resto
  const manifestPath = join(root, 'themes/manifest.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  let written = 0;
  for (const theme of manifest) {
    const c = byId.get(theme.id);
    if (!c) continue;
    theme.tone = c.tone; theme.tags = c.tags; written++;
  }
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

  // themes.js: reescreve só o array embutido, mantendo o IIFE que busca o manifest
  const themesJsPath = join(root, 'themes.js');
  const src = readFileSync(themesJsPath, 'utf8');
  const cut = src.indexOf('\n(function(){');
  const sandbox = { window: {} };
  new Function('window', src.slice(0, cut)).call(sandbox, sandbox.window);
  const builtin = sandbox.window.BUILTIN_THEMES;
  let writtenBuiltin = 0;
  for (const theme of builtin) {
    const c = byId.get(theme.id);
    if (!c) continue;
    theme.tone = c.tone; theme.tags = c.tags; writtenBuiltin++;
  }
  writeFileSync(themesJsPath, `window.BUILTIN_THEMES = ${JSON.stringify(builtin)};\n${src.slice(cut + 1)}`, 'utf8');

  const tally = {};
  for (const c of byId.values()) tally[c.tone] = (tally[c.tone] || 0) + 1;
  console.log(`classificados ${byId.size} temas`, JSON.stringify(tally));
  console.log(`manifest.json: ${written} | themes.js: ${writtenBuiltin}`);
} finally {
  shutdown();
}
