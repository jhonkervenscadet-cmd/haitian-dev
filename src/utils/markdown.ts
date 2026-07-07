/**
 * Client-side markdown render compiler to show beautiful rich HTML
 */
export function renderMarkdownToHtml(md: string): string {
  if (!md || !md.trim()) {
    return `<p class="text-zinc-550 font-mono text-xs italic">Aucun contenu. Utilisez l'éditeur pour rédiger du contenu.</p>`;
  }

  let html = md;

  // Secure HTML sanitization
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Headings
  html = html.replace(/^### (.*?)$/gm, '<h3 class="text-base font-bold text-white tracking-tight mt-5 mb-2 border-b border-white/5 pb-1">$1</h3>');
  html = html.replace(/^## (.*?)$/gm, '<h2 class="text-lg font-bold text-zinc-100 tracking-tight mt-6 mb-3 border-b border-white/5 pb-1">$1</h2>');
  html = html.replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-zinc-400 mt-2 mb-4">$1</h1>');

  // Code blocks with syntax highlights
  html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-black border border-white/5 rounded-xl p-4 my-4 overflow-x-auto text-[11px] font-mono text-[#00E5FF] leading-relaxed">$1</pre>');
  html = html.replace(/`([^`]+)`/g, '<code class="bg-black text-[#00E5FF] px-1.5 py-0.5 rounded text-xs font-mono font-bold">$1</code>');

  // Bold & Italic
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  // Blockquotes
  html = html.replace(/^&gt; (.*?)$/gm, '<blockquote class="border-l-4 border-amber-500/50 bg-amber-500/[0.02] rounded-r-xl px-4 py-2.5 my-4 italic text-zinc-300 font-sans">$1</blockquote>');

  // Lists
  html = html.replace(/^- (.*?)$/gm, '<li class="ml-4 list-disc text-zinc-300 my-1 font-sans text-sm">$1</li>');
  html = html.replace(/^\d+\. (.*?)$/gm, '<li class="ml-4 list-decimal text-zinc-300 my-1 font-sans text-sm">$1</li>');

  // Hyperlinks - styled nicely with custom target
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 font-medium underline inline-flex items-center gap-0.5">$1 <span class="text-[9px]">↗</span></a>');

  // Tables parsing (robust basic Markdown tables)
  const lines = html.split('\n');
  let insideTable = false;
  let tableHtml = "";
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const isTableRow = line.startsWith('|') && line.endsWith('|');
    
    if (isTableRow) {
      if (!insideTable) {
        insideTable = true;
        tableHtml += '<div class="overflow-x-auto my-4 border border-zinc-850 rounded-xl"><table class="w-full text-xs text-left text-zinc-350 border-collapse">';
      }
      
      const cells = line.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
      const isHeaderDivider = cells.every(c => c.startsWith(':') || c.startsWith('-') || c.endsWith(':'));
      
      if (isHeaderDivider) {
        continue; // skip alignment lines
      }

      const isHeader = tableHtml.endsWith('</thead>') === false && tableHtml.indexOf('<thead>') === -1;
      
      if (isHeader) {
        tableHtml += '<thead><tr class="bg-slate-900 border-b border-zinc-800 text-zinc-400 uppercase font-mono tracking-wider">';
        cells.forEach(c => {
          tableHtml += `<th class="p-3 font-semibold">${c}</th>`;
        });
        tableHtml += '</tr></thead><tbody>';
      } else {
        tableHtml += '<tr class="border-b border-zinc-900 hover:bg-white/[0.01] transition-colors">';
        cells.forEach(c => {
          tableHtml += `<td class="p-3">${c}</td>`;
        });
        tableHtml += '</tr>';
      }
    } else {
      if (insideTable) {
        insideTable = false;
        tableHtml += '</tbody></table></div>';
        lines[i] = tableHtml + lines[i];
        tableHtml = "";
      }
    }
  }

  html = lines.join('\n');

  // Paragraphs
  html = html.split('\n\n').map(p => {
    p = p.trim();
    if (!p) return '';
    if (p.startsWith('<h') || p.startsWith('<pre') || p.startsWith('<block') || p.startsWith('<li') || p.startsWith('<div')) {
      return p;
    }
    return `<p class="text-zinc-350 text-sm leading-relaxed my-2.5 font-sans">${p}</p>`;
  }).join('\n\n');

  return html;
}
