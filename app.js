'use strict';
(() => {
const $ = id => document.getElementById(id);
const i18n = {
  pt: {
    inBrowser: "Conversão no seu navegador",
    howItWorks: "Como funciona",
    eyebrow: "SEU TEXTO, SEU ESTILO",
    title: "Do Markdown ao documento.",
    subtitle: "Escreva, escolha um tema e exporte.",
    fileName: "Nome do arquivo",
    openMd: "Abrir .md",
    saveMd: "Salvar .md",
    exportFormat: "Formato de exportação",
    exportBtn: "Download",
    appearance: "Aparência",
    docTheme: "Tema do documento",
    filterThemes: "Filtrar temas...",
    page: "Página",
    format: "Formato",
    margin: "Margem",
    paperLetter: "Carta",
    exportHintHTML: "HTML: documento completo com o CSS incorporado. Imagens por URL continuam externas.",
    exportHintPDF: "PDF: na janela de impressão, escolha “Salvar como PDF”. Ative os gráficos de plano de fundo para manter as cores.",
    exportHintDOCX: "Word: texto editável e formatação compatível. O CSS é aproximado; layouts e efeitos podem mudar.",
    templatesTitle: "Modelos de documento",
    chooseTemplate: "Escolha um modelo",
    select: "Selecione…",
    mdTab: "Markdown",
    cssTab: "CSS adicional",
    cssPlaceholder: "/* Ajustes aplicados depois do tema selecionado */\nh1 { color: #166534; }",
    docPreview: "Prévia do documento",
    footerProcess: "Seus arquivos são processados localmente. Imagens externas podem acessar a internet.",
    helpTitle: "Seu documento, do início ao fim",
    closeHelp: "Fechar",
    helpDesc: "Abra um arquivo .md ou escreva no editor. Escolha um tema, confira a prévia e exporte no formato desejado.",
    helpHtmlDesc: "Arquivo completo com CSS incorporado. Imagens por URL continuam externas.",
    helpPdfDesc: "Abre a impressão do navegador. Escolha “Salvar como PDF”, habilite os gráficos de plano de fundo e desabilite cabeçalhos e rodapés do navegador.",
    helpDocxDesc: "Documento editável com títulos, listas, tabelas, links, código e imagens compatíveis. Fontes, cores e tamanhos são aproximados a partir do tema. Layouts CSS, fundos de página, pseudoelementos e efeitos não têm equivalência completa no Word.",
    langBtn: "English",
    defaultMd: `# Um documento bem apresentado\n\nTransforme suas ideias em um documento pronto para compartilhar.\n\n## Tudo começa com Markdown\n\nEscreva com **clareza**, destaque o que importa e deixe a formatação com o tema que você escolher.\n\n> O mesmo conteúdo. Diferentes formas de apresentar.\n\n## Checklist de qualidade\n\n- [x] Organizar o conteúdo em seções\n- [x] Escolher um tema para o documento\n- [ ] Revisar a prévia antes de exportar\n\n## Resultados da revisão\n\n| Verificação | Resultado |\n| :--- | :--- |\n| Critérios de aceitação | Aprovado |\n| Testes de API | Aprovado |\n| Regressão | Em andamento |\n\n### Um exemplo em Python\n\n\`\`\`python\ndef validar_status(resposta):\n    assert resposta.status_code == 200\n    return "Teste aprovado"\n\`\`\`\n\n1. Abra ou edite seu Markdown.\n2. Selecione um tema na lateral.\n3. Exporte para **HTML**, **Word** ou **PDF**.\n\n---\n\n[Referência de Markdown](https://www.markdownguide.org/basic-syntax/)\n`,
    saved: "Salvo neste navegador",
    noLocalSave: "Sem salvamento local",
    couldNotSave: "Não foi possível salvar no navegador. Baixe seu .md e mantenha uma cópia dos CSS.",
    saving: "Salvando…",
    words: "palavras",
    chars: "caracteres",
    docWillAppear: "Seu documento aparecerá aqui.",
    notReady: "A prévia ainda não está pronta. Tente novamente.",
    fileUpTo5mb: "Use um Markdown de até 5 MB.",
    replaceText: "Substituir o texto atual pelo arquivo selecionado?",
    mdOpened: "Markdown aberto.",
    htmlExported: "HTML exportado com o tema incorporado.",
    pdfExported: "Na impressão, selecione “Salvar como PDF”.",
    docxExported: "DOCX editável exportado.",
    exportError: "Não foi possível exportar. Tente novamente.",
    replaceMdTemplate: "Carregar o modelo substituirá o Markdown atual. Deseja continuar?",
    templateLoaded: "Modelo carregado.",
    invalidTheme: "Tema inválido. Consulte list_document_themes.",
    selectCss: "selecione um arquivo .css.",
    limitCss: "o limite é 1 MB por CSS.",
    emptyFile: "arquivo vazio.",
    yourThemes: "Seus temas",
    themeAdded: "tema adicionado",
    themesAdded: "temas adicionados",
    storageFull: "Não salvo: armazenamento indisponível ou cheio.",
    removeThemeBrowser: "Remover “{0}” deste navegador?",
    themeRemoved: "Tema removido.",
    noImportedCss: "Nenhum CSS importado para limpar.",
    removeAllThemes: "Remover todos os temas CSS importados?",
    allThemesRemoved: "Todos os temas importados foram removidos.",
    myDocument: "meu-documento",
    document: "documento"
  },
  en: {
    inBrowser: "In-browser conversion",
    howItWorks: "How it works",
    eyebrow: "YOUR TEXT, YOUR STYLE",
    title: "From Markdown to document.",
    subtitle: "Write, choose a theme and export.",
    fileName: "File name",
    openMd: "Open .md",
    saveMd: "Save .md",
    exportFormat: "Export format",
    exportBtn: "Download",
    appearance: "Appearance",
    docTheme: "Document theme",
    filterThemes: "Filter themes...",
    page: "Page",
    format: "Format",
    margin: "Margin",
    paperLetter: "Letter",
    exportHintHTML: "HTML: complete document with embedded CSS. URL images remain external.",
    exportHintPDF: "PDF: in the print dialog, choose \"Save as PDF\". Enable background graphics to keep colors.",
    exportHintDOCX: "Word: editable text and compatible formatting. CSS is approximated; layouts and effects may change.",
    templatesTitle: "Document templates",
    chooseTemplate: "Choose a template",
    select: "Select...",
    mdTab: "Markdown",
    cssTab: "Additional CSS",
    cssPlaceholder: "/* Adjustments applied after the selected theme */\nh1 { color: #166534; }",
    docPreview: "Document preview",
    footerProcess: "Your files are processed locally. External images may access the internet.",
    helpTitle: "Your document, from start to finish",
    closeHelp: "Close",
    helpDesc: "Open a .md file or type in the editor. Choose a theme, check the preview and export in the desired format.",
    helpHtmlDesc: "Complete file with embedded CSS. URL images remain external.",
    helpPdfDesc: "Opens the browser's print dialog. Choose \"Save as PDF\", enable background graphics and disable browser headers and footers.",
    helpDocxDesc: "Editable document with compatible headings, lists, tables, links, code and images. Fonts, colors and sizes are approximated from the theme. CSS layouts, page backgrounds, pseudo-elements and effects do not have full equivalence in Word.",
    langBtn: "Português",
    defaultMd: `# A well-presented document\n\nTurn your ideas into a ready-to-share document.\n\n## It all starts with Markdown\n\nWrite with **clarity**, highlight what matters and leave the formatting to the theme you choose.\n\n> The same content. Different ways to present.\n\n## Quality checklist\n\n- [x] Organize content into sections\n- [x] Choose a theme for the document\n- [ ] Review the preview before exporting\n\n## Review results\n\n| Check | Result |\n| :--- | :--- |\n| Acceptance criteria | Passed |\n| API testing | Passed |\n| Regression | In progress |\n\n### A Python example\n\n\`\`\`python\ndef validate_status(response):\n    assert response.status_code == 200\n    return "Test passed"\n\`\`\`\n\n1. Open or edit your Markdown.\n2. Select a theme on the sidebar.\n3. Export to **HTML**, **Word** or **PDF**.\n\n---\n\n[Markdown Reference](https://www.markdownguide.org/basic-syntax/)\n`,
    saved: "Saved in this browser",
    noLocalSave: "No local saving",
    couldNotSave: "Could not save in browser. Download your .md and keep a copy of your CSS.",
    saving: "Saving…",
    words: "words",
    chars: "characters",
    docWillAppear: "Your document will appear here.",
    notReady: "The preview is not ready yet. Try again.",
    fileUpTo5mb: "Use a Markdown file up to 5 MB.",
    replaceText: "Replace current text with the selected file?",
    mdOpened: "Markdown opened.",
    htmlExported: "HTML exported with embedded theme.",
    pdfExported: "When printing, select \"Save as PDF\".",
    docxExported: "Editable DOCX exported.",
    exportError: "Could not export. Try again.",
    replaceMdTemplate: "Loading the template will replace the current Markdown. Do you want to continue?",
    templateLoaded: "Template loaded.",
    invalidTheme: "Invalid theme. Check list_document_themes.",
    selectCss: "select a .css file.",
    limitCss: "limit is 1 MB per CSS.",
    emptyFile: "empty file.",
    yourThemes: "Your themes",
    themeAdded: "theme added",
    themesAdded: "themes added",
    storageFull: "Not saved: storage unavailable or full.",
    removeThemeBrowser: "Remove “{0}” from this browser?",
    themeRemoved: "Theme removed.",
    noImportedCss: "No imported CSS to clear.",
    removeAllThemes: "Remove all imported CSS themes?",
    allThemesRemoved: "All imported themes have been removed.",
    myDocument: "my-document",
    document: "document"
  }
};

let lang = 'pt';

function updateUI() {
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.innerHTML = i18n[lang][el.dataset.i18n];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = i18n[lang][el.dataset.i18nPlaceholder];
  });
  const t = i18n[lang];
  $('lang-toggle').textContent = t.langBtn;
  if($('markdown').value === i18n['en'].defaultMd || $('markdown').value === i18n['pt'].defaultMd) {
    $('markdown').value = t.defaultMd;
  }
  if($('filename').value === i18n['en'].myDocument || $('filename').value === i18n['pt'].myDocument) {
    $('filename').value = t.myDocument;
  }
  if($('save-status').textContent === i18n['en'].saved || $('save-status').textContent === i18n['pt'].saved) {
    $('save-status').textContent = t.saved;
  }
  updateExportHint();
  render();
}

function t(key, ...args) {
  let str = i18n[lang][key];
  if(args.length) args.forEach((arg, i) => str = str.replace(`{${i}}`, arg));
  return str;
}

$('lang-toggle').onclick = () => {
  lang = lang === 'pt' ? 'en' : 'pt';
  stored.lang = lang;
  save();
  updateUI();
};

const KEY='markdown-studio:v1';
let stored={}, storageAvailable=true;
try { stored=JSON.parse(localStorage.getItem(KEY)||'{}') || {}; } catch { storageAvailable=false; }
if (stored.lang === 'en' || stored.lang === 'pt') lang = stored.lang;

let imported=Array.isArray(stored.imported)?stored.imported.filter(x=>typeof x.id==='string' && typeof x.css==='string' && typeof x.name==='string'):[];
let themes=[...window.BUILTIN_THEMES,...imported];
let activeId=themes.some(x=>x.id===stored.theme)?stored.theme:'sindresorhus/github-markdown-light.css';
let currentDocument='',renderTimer,saveTimer,toastTimer,revision=0,framePromise=Promise.resolve(),dirty=false;

$('markdown').value=typeof stored.markdown==='string'?stored.markdown:t('defaultMd');
$('custom-css').value=typeof stored.extra==='string'?stored.extra:'';
$('filename').value=stored.filename||t('myDocument');
if(['A4','Letter'].includes(stored.paper))$('paper').value=stored.paper;
if(['15','20','25'].includes(stored.margin))$('margin').value=stored.margin;
function toast(message){clearTimeout(toastTimer);$('toast').textContent=message;$('toast').hidden=false;toastTimer=setTimeout(()=>$('toast').hidden=true,6500);}
function currentTheme(){return themes.find(x=>x.id===activeId)||themes[0];}
function save(){clearTimeout(saveTimer);const data={lang,markdown:$('markdown').value,extra:$('custom-css').value,filename:$('filename').value,theme:activeId,imported,paper:$('paper').value,margin:$('margin').value};try{localStorage.setItem(KEY,JSON.stringify(data));storageAvailable=true;$('save-status').textContent=t('saved');}catch{storageAvailable=false;$('save-status').textContent=t('noLocalSave');toast(t('couldNotSave'));}}
function scheduleSave(){clearTimeout(saveTimer);$('save-status').textContent=t('saving');saveTimer=setTimeout(save,600);}
function updateOptions(filterText = ''){const select=$('theme');select.replaceChildren();const lowerFilter=filterText.toLowerCase();const filteredThemes=themes.filter(x=>x.name.toLowerCase().includes(lowerFilter)||x.id.toLowerCase().includes(lowerFilter));filteredThemes.forEach(x=>{select.append(new Option(x.name,x.id));});select.value=activeId;if(select.selectedIndex===-1&&filteredThemes.length>0){select.value=filteredThemes[0].id;activeId=select.value;render();save();} $('theme-count').textContent=filteredThemes.length+' CSS';}
function updateThemeInfo(){const x=currentTheme();if($('remove-css'))$('remove-css').hidden=!x.custom;if($('theme-source')){$('theme-source').hidden=!x.source;if(x.source)$('theme-source').href=x.source;}$('sample-name').textContent=x.name;$('preview-theme').textContent=x.name;}
function escapeHTML(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function cleanMarkdown(text){return text.replace(/^\uFEFF/,'').replace(/^---\s*\r?\n[\s\S]*?\r?\n(?:---|\.\.\.)\s*(?:\r?\n|$)/,'');}
const BASE=`html{color-scheme:light}body{margin:0;background:#fff;color:#24292f;font-family:Arial,sans-serif;font-size:16px;line-height:1.6}article{padding:32px;overflow-wrap:anywhere}h1,h2,h3,h4,h5,h6{line-height:1.3}h1{font-size:2em}h2{font-size:1.5em}img{max-width:100%;height:auto}table{border-collapse:collapse;max-width:100%;width:100%;font-size:inherit}th,td{border:1px solid #d0d7de;padding:8px 12px}th:not([align]),td:not([align]){text-align:left}pre{padding:16px;background:#f6f8fa;white-space:pre-wrap;overflow-wrap:anywhere}code{font-family:Consolas,monospace}blockquote{margin-left:0;padding-left:16px;border-left:3px solid #d0d7de;color:#59636e}a{color:#0969da}hr{border:0;border-top:1px solid #d0d7de;margin:24px 0}input[type=checkbox]{vertical-align:middle}li{margin:.25em 0}dl{margin:0 0 16px}dt{font-weight:600}dd{margin:0 0 .75em 1.5em}mark{background:#fff2ac;color:inherit;border-radius:2px;padding:0 .1em}.footnotes{margin-top:2em;padding-top:1em;font-size:.85em;color:#59636e}.footnotes ol{padding-left:1.25em}.footnotes a{text-decoration:none}`;
function makeDocument(){const theme=currentTheme(), md=cleanMarkdown($('markdown').value);const raw=marked.parse(md,{gfm:true,breaks:false});const html=DOMPurify.sanitize(raw,{USE_PROFILES:{html:true},FORBID_TAGS:['style','link','form','iframe','object','embed','video','audio','source','meta','base'],FORBID_ATTR:['style','srcset'],ADD_ATTR:['target'],ALLOW_DATA_ATTR:false});const content=html||'<p style="color:#8a958e">'+t('docWillAppear')+'</p>';
const css=(theme.css+'\n'+$('custom-css').value).replace(/<\/style/gi,'<\\/style');
const title=escapeHTML($('filename').value||t('document'));const margin=Number($('margin').value);const paper=$('paper').value;
const wrapper=theme.group==='aruizcastillo/md-juice'?'md-juice':theme.group==='sindresorhus/github-markdown-css'?'markdown-body':'markdown-body md-juice';
const safety=`html{overflow-x:auto}body{min-width:0!important;box-sizing:border-box}#document{box-sizing:border-box;min-width:0;max-width:100%;margin:0 auto}#document img{max-width:100%;height:auto}#document pre{white-space:pre-wrap;overflow-wrap:anywhere}#document{padding:${margin*1.35}px} @page{size:${paper};margin:${margin}mm}@media print{html,body{width:auto!important;max-width:none!important;margin:0!important;padding:0!important;height:auto!important;overflow:visible!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}#document{max-width:none!important;padding:0!important;margin:0!important}h1,h2,h3,h4,h5,h6{break-after:avoid}p,li{orphans:3;widows:3}tr,img{break-inside:avoid}thead{display:table-header-group}pre{white-space:pre-wrap!important;overflow-wrap:anywhere!important}a{overflow-wrap:anywhere}table{width:100%!important}}`;
return `<!doctype html><html lang="${lang==='pt'?'pt-BR':'en'}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src https: data: blob:; style-src 'unsafe-inline'; font-src data:; base-uri 'none'; form-action 'none'"><title>${title}</title><style>${BASE}\n${css}\n${safety}</style></head><body><article id="document" class="${wrapper}">${content}</article></body></html>`;}
function render(){clearTimeout(renderTimer);const text=$('markdown').value;const words=text.trim()?text.trim().split(/\s+/).length:0;$('word-count').textContent=`${words} ${t('words')} · ${text.length} ${t('chars')}`;$('page-label').textContent=$('paper').value+' · '+$('margin').value+' mm';updateThemeInfo();const source=makeDocument();if(source===currentDocument)return framePromise;currentDocument=source;const r=++revision;const frame=$('preview');framePromise=new Promise(resolve=>{frame.onload=()=>{if(r!==revision){resolve();return;}resolve();};frame.srcdoc=source;});return framePromise;}
function scheduleRender(){clearTimeout(renderTimer);renderTimer=setTimeout(render,180);scheduleSave();dirty=true;}
function filename(){return ($('filename').value.trim()||t('document')).replace(/[<>:"/\\|?*\x00-\x1f]/g,'-').replace(/\.(md|html|pdf|docx)$/i,'');}
function download(data,name,type){const blob=data instanceof Blob?data:new Blob([data],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);}
async function waitForDocument(){await render();await framePromise;const doc=$('preview').contentDocument;if(!doc?.getElementById('document'))throw Error(t('notReady'));if(doc.fonts)await doc.fonts.ready;await Promise.all([...doc.images].map(img=>img.complete?Promise.resolve():Promise.race([new Promise(resolve=>{img.onload=resolve;img.onerror=resolve;}),new Promise(resolve=>setTimeout(resolve,3500))])));return doc;}
$('markdown').addEventListener('input',scheduleRender);$('custom-css').addEventListener('input',scheduleRender);$('filename').addEventListener('input',scheduleRender);for(const id of ['paper','margin'])$(id).addEventListener('change',()=>{render();save();});$('theme').addEventListener('change',()=>{activeId=$('theme').value;render();save();});if($('theme-filter'))$('theme-filter').addEventListener('input', e => { updateOptions(e.target.value); });
function activateTab(isCss){$('md-tab').classList.toggle('active',!isCss);$('css-tab').classList.toggle('active',isCss);$('md-tab').setAttribute('aria-selected',String(!isCss));$('css-tab').setAttribute('aria-selected',String(isCss));$('md-tab').tabIndex=isCss?-1:0;$('css-tab').tabIndex=isCss?0:-1;$('markdown-pane').hidden=isCss;$('css-pane').hidden=!isCss;$('editor-kind').textContent=isCss?'.css':'.md';}
$('md-tab').onclick=()=>activateTab(false);$('css-tab').onclick=()=>activateTab(true);for(const id of ['md-tab','css-tab'])$(id).onkeydown=e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const css=e.key==='End'||(e.key!=='Home'&&id==='md-tab');activateTab(css);$(css?'css-tab':'md-tab').focus();}};
for(const id of ['markdown','custom-css'])$(id).addEventListener('keydown',e=>{if(e.key==='Tab'){e.preventDefault();const el=e.target;el.setRangeText('  ',el.selectionStart,el.selectionEnd,'end');scheduleRender();}});
$('open-md').onclick=()=>$('md-file').click();$('md-file').onchange=async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>5*1024*1024)throw Error(t('fileUpTo5mb'));if(dirty&&!confirm(t('replaceText')))return;$('markdown').value=await file.text();$('filename').value=file.name.replace(/\.(md|markdown|txt)$/i,'');dirty=true;activateTab(false);render();save();toast(t('mdOpened'));}catch(err){toast(err.message);}finally{e.target.value='';}};
$('save-md').onclick=()=>{download($('markdown').value,filename()+'.md','text/markdown;charset=utf-8');dirty=false;};
if($('import-css'))$('import-css').onclick=()=>$('css-files').click();$('css-files').onchange=async e=>{const files=[...e.target.files];let count=0,errors=[];for(const file of files){try{if(!/\.css$/i.test(file.name))throw Error(file.name+': '+t('selectCss'));if(file.size>1024*1024)throw Error(file.name+': '+t('limitCss'));const css=await file.text();if(!css.trim())throw Error(file.name+': '+t('emptyFile'));const id='custom:'+(crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+'-'+Math.random().toString(36).slice(2));const same=themes.filter(x=>x.name===file.name||x.name.startsWith(file.name+' (')).length;const theme={id,name:file.name+(same?' ('+(same+1)+')':''),css,custom:true,group:t('yourThemes')};imported.push(theme);themes.push(theme);activeId=id;count++;}catch(err){errors.push(err.message);}}updateOptions();render();save();toast([count?`${count} ${count===1?t('themeAdded'):t('themesAdded')}.`:'',...errors,!storageAvailable?t('storageFull'):''].filter(Boolean).join(' '));e.target.value='';};
if($('remove-css'))$('remove-css').onclick=()=>{const x=currentTheme();if(!x.custom||!confirm(t('removeThemeBrowser', x.name)))return;imported=imported.filter(y=>y.id!==activeId);themes=[...window.BUILTIN_THEMES,...imported];activeId='sindresorhus/github-markdown-light.css';updateOptions();render();save();toast(t('themeRemoved'));};

if($('clear-imported-css'))$('clear-imported-css').onclick=()=>{if(!imported.length){toast(t('noImportedCss'));return;}if(!confirm(t('removeAllThemes')))return;imported=[];themes=[...window.BUILTIN_THEMES];activeId='sindresorhus/github-markdown-light.css';updateOptions();render();save();toast(t('allThemesRemoved'));};
function updateExportHint(){$('export-hint').textContent={pdf:t('exportHintPDF'),html:t('exportHintHTML'),docx:t('exportHintDOCX')}[$('format').value];}
$('format').onchange=()=>updateExportHint();
$('export').onclick=async()=>{const button=$('export');button.disabled=true;try{const format=$('format').value;const doc=await waitForDocument();if(format==='html'){download(currentDocument,filename()+'.html','text/html;charset=utf-8');toast(t('htmlExported'));}else if(format==='pdf'){document.title=filename();$('preview').contentWindow.focus();$('preview').contentWindow.print();setTimeout(()=>document.title='Markdown Studio',500);toast(t('pdfExported'));}else{const result=await window.exportWord(doc,{title:filename(),paper:$('paper').value,margin:Number($('margin').value)});download(result.blob,filename()+'.docx');toast(result.warnings.length?'DOCX: '+result.warnings.join(' '):t('docxExported'));}}catch(err){console.error(err);toast(err.message||t('exportError'));}finally{button.disabled=false;}};
window.REPORT_TEMPLATES.forEach((x,i)=>$('template').append(new Option(x.path.split('/').pop().replace('.md',''),String(i))));$('template').addEventListener('change',()=>{const select=$('template'),index=select.value;if(index==='')return;if(!confirm(t('replaceMdTemplate'))){select.value='';return;}const x=window.REPORT_TEMPLATES[Number(index)];$('markdown').value=x.content;$('filename').value=x.path.split('/').pop().replace('.md','');dirty=true;activateTab(false);render();save();toast(t('templateLoaded'));select.value='';});
// source list loop removed
$('help').onclick=()=>$('help-dialog').showModal();$('close-help').onclick=()=>$('help-dialog').close();$('help-dialog').addEventListener('click',e=>{if(e.target===$('help-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
window.addEventListener('beforeunload',e=>{if(!storageAvailable&&dirty){e.preventDefault();e.returnValue='';}});
updateUI(); // Setup initially using logic
updateOptions();render();$('save-status').textContent=storageAvailable?t('saved'):t('noLocalSave');
const context=document.modelContext;
if(context?.registerTool){const lifecycle=new AbortController();window.addEventListener('pagehide',()=>lifecycle.abort(),{once:true});const register=tool=>{try{Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(console.warn);}catch(err){console.warn(err);}};
register({name:'list_document_themes',description:'List available CSS themes and the selected theme without changing the document.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:true},execute(){return{selected:activeId,themes:themes.map(x=>({id:x.id,name:x.name,group:x.group}))};}});
register({name:'set_document_theme',description:'Select a CSS theme, update the document preview and save this local preference. Does not export or change the Markdown text.',inputSchema:{type:'object',properties:{themeId:{type:'string'}},required:['themeId'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:true},async execute(input){if(!input||typeof input.themeId!=='string'||Object.keys(input).some(k=>k!=='themeId')||!themes.some(x=>x.id===input.themeId))throw Error(t('invalidTheme'));activeId=input.themeId;$('theme').value=activeId;await render();save();return{selected:activeId,name:currentTheme().name};}});
}
})();
