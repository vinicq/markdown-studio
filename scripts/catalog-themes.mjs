// Node.js 18+. Rebuild the catalog after editing or adding CSS under themes/.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const sandbox={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'themes.js'),'utf8'),sandbox);
const old=new Map(sandbox.window.BUILTIN_THEMES.map(t=>[t.path,t]));const entries=[];
function walk(directory){for(const item of fs.readdirSync(directory,{withFileTypes:true})){const full=path.join(directory,item.name);if(item.isDirectory())walk(full);else if(item.name.endsWith('.css')){const relative=path.relative(root,full).split(path.sep).join('/');const previous=old.get(relative);entries.push({...previous,id:previous?.id||relative,name:previous?.name||item.name,group:previous?.group||'Temas do projeto',path:relative,css:fs.readFileSync(full,'utf8')});}}}
walk(path.join(root,'themes'));fs.writeFileSync(path.join(root,'themes.js'),'window.BUILTIN_THEMES = '+JSON.stringify(entries)+';\n');console.log(entries.length+' temas no catálogo.');
