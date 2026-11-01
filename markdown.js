// Renderer Markdown locale: nessuna libreria, HTML utente sempre escaped.
// Esporta funzioni pure, utilizzabili anche dai test Node.js.
export function escapeHTML(value) {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function safeLink(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : '#';
  } catch { return '#'; }
}

// Le fonti appartengono al pannello dedicato. Rimuovi i marcatori bibliografici
// dai soli segmenti di prosa: mai da codice, link utili o dati dell'utente.
// Compatibile anche con le conversazioni salvate nelle versioni precedenti.
export function stripSourceCitations(value, sources = [], { streaming = false } = {}) {
  const text = String(value ?? '');
  if (!Array.isArray(sources) || !sources.length) return text;
  let fence = null;
  return text.replace(/\r\n?/g, '\n').split('\n').map(line => {
    const marker = /^\s*(`{3,}|~{3,})/.exec(line);
    if (marker) {
      if (!fence) fence = { ch: marker[1][0], n: marker[1].length };
      else if (marker[1][0] === fence.ch && marker[1].length >= fence.n) fence = null;
      return line;
    }
    if (fence) return line;
    const protectedTokens = [];
    const protect = token => `\u0001${protectedTokens.push(token) - 1}\u0002`;
    // Blocchi inline e link normali non vanno alterati. I link che rappresentano
    // *solo* una citazione vengono invece nascosti (sono già nel pannello).
    let result = line.replace(/(`+[^`\n]*`+|\[[^\]\n]+\]\(https?:\/\/[^\s)]+\))/g, token => {
      if (token.startsWith('`')) return protect(token);
      const label = /^\[([^\]]+)\]/.exec(token)?.[1]?.trim() || '';
      if (/^(?:(?:fonte|source|citation|citazione|ref(?:erence)?)\s*#?\s*)?\d{1,3}$/i.test(label)) return '';
      return protect(token);
    });
    // [4], [4][3], [4, 3], [4] [3], [4-5] e marcatori simili;
    // non toccare gli accessi a vettori come items[4] (senza spazio).
    const citation = /(^|[^\p{L}\p{N}_\\])((?:\[\s*\d{1,3}(?:\s*[,;–-]\s*\d{1,3})*\s*\]\s*)+)(?!\()/gu;
    result = result.replace(/(<https?:\/\/[^>]+>);(?=\s*\[\s*\d{1,3}\s*\])/g, '$1');
    result = result.replace(citation, (_, before) => before);
    result = result.replace(/(^|[^\p{L}\p{N}_\\])\[(?:fonte|source|citation|citazione|ref(?:erence)?)\s*#?\s*\d{1,3}\]/giu, '$1');
    // Durante lo streaming non mostrare neanche un marcatore incompleto ([4).
    if (streaming) result = result.replace(/(?:\s*\[\s*\d{0,3}(?:\s*[,;–-]\s*\d{0,3})*)$/u, '');
    result = result.replace(/([^ \t]) {2,}(?=\S)/g, '$1 ');
    result = result.replace(/[ \t]+(?=[.,;:!?])/g, '').replace(/[ \t]+$/g, '');
    return result.replace(/\u0001(\d+)\u0002/g, (_, i) => protectedTokens[Number(i)] ?? '');
  }).join('\n');
}

function inlineMarkdown(value) {
  const protectedTokens = [];
  const protect = html => `\u0001${protectedTokens.push(html) - 1}\u0002`;
  let s = escapeHTML(value);
  s = s.replace(/`([^`\n]+)`/g, (_, code) => protect(`<code>${code}</code>`));
  // Link espliciti richiesti dall'utente restano cliccabili.
  s = s.replace(/\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, label, href) =>
    protect(`<a href="${escapeHTML(safeLink(href.replace(/&amp;/g, '&')))}" target="_blank" rel="noopener noreferrer">${label}</a>`));
  s = s.replace(/&lt;(https?:\/\/[^\s<>]+?)&gt;(?:;(?=\s*\[\d+\]))?/g, (_, rawHref) => {
    const href = safeLink(rawHref.replace(/&amp;/g, '&'));
    return protect(`<a href="${escapeHTML(href)}" target="_blank" rel="noopener noreferrer">${rawHref}</a>`);
  });
  s = s.replace(/https?:\/\/[^\s<>\u0001\u0002]+/g, raw => {
    const clean = raw.replace(/[.,;!?]+$/, '');
    const trailing = raw.slice(clean.length);
    const href = safeLink(clean.replace(/&amp;/g, '&'));
    return protect(`<a href="${escapeHTML(href)}" target="_blank" rel="noopener noreferrer">${clean}</a>`) + trailing;
  });
  s = s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.+?)__/g, '<strong>$1</strong>')
    .replace(/~~(.+?)~~/g, '<del>$1</del>')
    .replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>')
    .replace(/(^|[\s(])_([^_\n]+)_/g, '$1<em>$2</em>');
  return s.replace(/\u0001(\d+)\u0002/g, (_, id) => protectedTokens[Number(id)] ?? '');
}

// Le tabelle generate dai modelli possono contenere pipe nel codice inline,
// colonne senza pipe terminali e spaziature irregolari.
function tableCells(line) {
  const source = line.trim().replace(/^\|/, '').replace(/\|$/, '');
  const cells = [];
  let cell = '', ticks = 0;
  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    if (ch === '\\' && i + 1 < source.length) {
      cell += source[i + 1] === '|' ? '|' : ch + source[i + 1];
      i++;
    } else if (ch === '`') {
      ticks = ticks ? 0 : 1;
      cell += ch;
    } else if (ch === '|' && !ticks) {
      cells.push(cell.trim()); cell = '';
    } else {
      cell += ch;
    }
  }
  cells.push(cell.trim());
  return cells;
}
function isDividerRow(line) {
  const cells = tableCells(line);
  return cells.length >= 2 && cells.every(s => /^:?-{3,}:?$/.test(s));
}
function tableStart(lines, i) {
  const first = lines[i];
  if (!first || !first.includes('|')) return null;
  const columns = tableCells(first);
  if (columns.length < 2 || columns.every(x => !x)) return null;
  // Consenti anche una riga vuota tra intestazione e separatore.
  let separator = i + 1;
  if (lines[separator]?.trim() === '' && lines[separator + 1]?.trim()) separator++;
  if (!lines[separator] || !isDividerRow(lines[separator])) return null;
  if (tableCells(lines[separator]).length !== columns.length) return null;
  return { columns, separator };
}
function isList(line) {
  return /^(\s*)([-*+]\s+|\d+[.)]\s+)(.*)$/.exec(line);
}
function fencedCode(language, code) {
  const lang = language.trim().split(/\s+/)[0].replace(/[^a-zA-Z0-9_+.#-]/g, '').slice(0, 35) || 'Testo';
  return `<div class="code-block"><div class="code-head"><span>${escapeHTML(lang)}</span><button type="button" data-action="copy-code" data-value="${escapeHTML(encodeURIComponent(code))}">Copia codice</button></div><pre><code>${escapeHTML(code)}</code></pre></div>`;
}

function blocksMarkdown(raw, depth = 0, sources = []) {
  const lines = String(raw).replace(/\r\n?/g, '\n').split('\n');
  const html = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i], trimmed = line.trim();
    if (!trimmed) { i++; continue; }

    const fence = /^\s*(`{3,}|~{3,})([^\n]*)$/.exec(line);
    if (fence) {
      const marker = fence[1]; i++;
      const codeLines = [];
      while (i < lines.length && !new RegExp(`^\\s*${marker[0]}{${marker.length},}\\s*$`).test(lines[i])) codeLines.push(lines[i++]);
      if (i < lines.length) i++;
      html.push(fencedCode(fence[2], codeLines.join('\n')));
      continue;
    }
    if (/^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/.test(line)) {
      html.push('<hr>'); i++; continue;
    }
    const heading = /^\s*(#{1,6})\s+(.+)$/.exec(line);
    if (heading) {
      const n = heading[1].length;
      html.push(`<h${n}>${inlineMarkdown(heading[2].replace(/\s+#+\s*$/, ''), sources)}</h${n}>`); i++; continue;
    }
    if (trimmed.startsWith('>') && depth < 4) {
      const group = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) group.push(lines[i++].replace(/^\s*>\s?/, ''));
      html.push(`<blockquote>${blocksMarkdown(group.join('\n'), depth + 1, sources)}</blockquote>`);
      continue;
    }
    const table = tableStart(lines, i);
    if (table) {
      const headings = table.columns;
      i = table.separator + 1;
      const body = [];
      while (i < lines.length && lines[i].trim() && lines[i].includes('|')) {
        const cells = tableCells(lines[i]);
        if (cells.length !== headings.length) break;
        body.push(cells);
        i++;
      }
      const th = headings.map(x => `<th scope="col">${inlineMarkdown(x, sources)}</th>`).join('');
      const rows = body.map(cells => `<tr>${cells.map(x => `<td>${inlineMarkdown(x, sources)}</td>`).join('')}</tr>`).join('');
      html.push(`<div class="md-table-wrap" role="region" aria-label="Tabella della risposta" tabindex="0"><table><thead><tr>${th}</tr></thead><tbody>${rows}</tbody></table></div>`);
      continue;
    }
    const bullet = isList(line);
    if (bullet) {
      const ordered = /^\d/.test(bullet[2]);
      const tag = ordered ? 'ol' : 'ul';
      const items = [];
      const baseIndent = bullet[1].length;
      while (i < lines.length) {
        const m = isList(lines[i]);
        if (!m || m[1].length !== baseIndent || /^\d/.test(m[2]) !== ordered) break;
        i++;
        const nested = [];
        while (i < lines.length && (/^\s{2,}\S/.test(lines[i]) || (lines[i].trim() === '' && i+1 < lines.length && /^\s{2,}\S/.test(lines[i+1])))) nested.push(lines[i++]);
        const task = /^\[([xX ])\]\s+(.+)$/.exec(m[3]);
        const content = task ? `<span class="md-task">${task[1].toLowerCase() === 'x' ? '☑' : '☐'}</span> ${inlineMarkdown(task[2], sources)}` : inlineMarkdown(m[3], sources);
        const child = nested.length && depth < 4 ? blocksMarkdown(nested.map(s => s.slice(Math.min(s.length, baseIndent+2))).join('\n'), depth+1, sources) : '';
        items.push(`<li>${content}${child}</li>`);
      }
      html.push(`<${tag}>${items.join('')}</${tag}>`);
      continue;
    }
    // Paragrafo: terminare davanti a un elemento di blocco, senza forzare <br> per ogni riga.
    const paragraph = [line]; i++;
    while (i < lines.length && lines[i].trim()) {
      const next = lines[i];
      if (/^\s*(`{3,}|~{3,}|#{1,6}\s+|>|(?:-{3,}|\*{3,}|_{3,})\s*$)/.test(next) || isList(next) || tableStart(lines, i)) break;
      paragraph.push(next); i++;
    }
    html.push(`<p>${inlineMarkdown(paragraph.map(s => s.trim()).join(' '), sources)}</p>`);
  }
  return html.join('\n');
}

export function renderMarkdown(value, sources = [], options = {}) {
  return blocksMarkdown(stripSourceCitations(value, sources, options), 0, sources);
}

// Il testo copiato o esportato deve essere identico alla risposta visibile.
// I collegamenti alle fonti rimangono disponibili nel pannello Fonti web.
export function expandSourceCitations(value, sources = []) {
  return stripSourceCitations(value, sources);
}

// While receiving SSE, never show unfinished Markdown tables, code fences or lists.
// Completed paragraphs are presented in one piece, with a subtle reveal animation.
export function stableMarkdownPrefix(value){
 const text=String(value||'').replace(/\r\n?/g,'\n');
 let fenced=false,lastSafe=0;const lines=text.split('\n');let pos=0;
 for(let i=0;i<lines.length-1;i++){
   const line=lines[i];
   if(/^\s*```/.test(line))fenced=!fenced;
   pos+=line.length+1;
   if(!fenced && !line.trim() && i>0)lastSafe=pos;
 }
 if(fenced)return text.slice(0,lastSafe);
 const tail=text.slice(lastSafe);
 // Hold block syntax until its table/list/code structure is complete.
 const first=tail.split('\n').find(x=>x.trim())||'';
 if(/^\s*(?:[`~]{3}|#{1,6}\s|>|[-*+]\s|\d+[.)]\s|\|)/.test(first))return text.slice(0,lastSafe);
 if(first.split('|').length>=3)return text.slice(0,lastSafe);
 // Text paragraphs are shown word by word, but incomplete Markdown markers
 // are held back so the user never sees raw **, `, or [link]( markup.
 const lastSpace=tail.search(/\s+$/)>=0?tail.length:Math.max(tail.lastIndexOf(' '),tail.lastIndexOf('\n'));
 if(lastSpace<1)return text.slice(0,lastSafe);
 let partial=tail.slice(0,lastSpace).trimEnd();
 for(const mark of ['**','__','`']){
   const count=partial.split(mark).length-1;
   if(count%2)partial=partial.slice(0,partial.lastIndexOf(mark)).trimEnd();
 }
 const unmatchedBracket=partial.lastIndexOf('[');
 if(unmatchedBracket>partial.lastIndexOf(']'))partial=partial.slice(0,unmatchedBracket).trimEnd();
 return text.slice(0,lastSafe)+partial;
}
