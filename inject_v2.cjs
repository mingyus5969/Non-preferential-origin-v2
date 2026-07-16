const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf-8');
const mappedCasesStr = fs.readFileSync('output_cases_v2.cjs', 'utf-8');

const startMarker = "const ALL_CASES = [";
const endMarker = "const lawsData = [";

const startIndex = indexHtml.indexOf(startMarker);
const endIndex = indexHtml.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
  console.error("Could not find markers!");
  process.exit(1);
}

// 1. Inject ALL_CASES
let injection1 = indexHtml.substring(0, startIndex) + mappedCasesStr.trim() + "\n\n" + indexHtml.substring(endIndex);

// 2. Inject pagination HTML container
// Find `<div id="case-empty-state"...>...</div>` and `<div id="pagination-container"` if it already exists?
// Wait, we didn't add it yet.
const emptyStateStr = `      <div id="case-empty-state" class="hidden flex flex-col items-center justify-center py-24 text-center text-slate-500 surface border-dashed border-slate-300">
        <i class="fa-solid fa-folder-open text-[48px] text-slate-200 mb-5" aria-hidden="true"></i>
        <p class="text-[16px] font-bold text-brand-navy mb-1.5">검색 결과가 없습니다.</p>
        <p class="text-[14px] text-slate-500 font-medium">다른 키워드를 입력하거나 필터를 '전체'로 변경해보세요.</p>
      </div>`;
    
const paginationHtml = `
      <div id="pagination-container" class="mt-12 flex justify-center items-center gap-2"></div>`;

let injection2 = injection1;
if (!injection2.includes('id="pagination-container"')) {
    injection2 = injection2.replace(emptyStateStr, emptyStateStr + "\n" + paginationHtml);
}

// 3. Inject new scripts
const scriptStart = 'function filterCases() {';
const scriptEnd = 'function toggleAcc(id) {';

const startScriptIndex = injection2.indexOf(scriptStart);
const endScriptIndex = injection2.indexOf(scriptEnd);

const newScript = `
let currentPage = 1;
const itemsPerPage = 10;
let currentFilteredCases = [];

function filterCases() {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(() => {
    const q = document.getElementById('case-search').value.trim().toLowerCase();
    
    currentFilteredCases = ALL_CASES.filter(c => {
      const matchCat = activeCat === 'all' || c.category === activeCat;
      const matchQ = !q || [c.title, c.query, c.reply, ...(c.keywords||[])].join(' ').toLowerCase().includes(q);
      return matchCat && matchQ;
    });

    currentPage = 1;
    renderPage(q);
    renderPagination(q);
  }, 250);
}

function renderPage(q = '') {
    const list = document.getElementById('case-list');
    const resultCountEl = document.getElementById('result-count');
    const emptyState = document.getElementById('case-empty-state');
    const paginationContainer = document.getElementById('pagination-container');
    
    if(resultCountEl) {
      resultCountEl.innerHTML = q ? \`검색결과 <strong class="text-brand-cyan font-black">\${currentFilteredCases.length}</strong> 건\` : \`전체 사례 <strong class="text-brand-navy font-black">\${currentFilteredCases.length}</strong> 건\`;
    }

    if (!currentFilteredCases.length) {
      if(emptyState) emptyState.classList.remove('hidden');
      if(paginationContainer) paginationContainer.classList.add('hidden');
      list.innerHTML = '';
      return;
    } else {
      if(emptyState) emptyState.classList.add('hidden');
      if(paginationContainer) paginationContainer.classList.remove('hidden');
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = currentFilteredCases.slice(startIndex, endIndex);

    list.innerHTML = pageItems.map((c, i) => {
      const accId = startIndex + i;
      const badgeStyle = c.category === 'I' 
        ? "background-color: #F0F7FF; color: #0052FF; border: 1px solid rgba(0,82,255,0.2);"
        : "background-color: #FAFCFF; color: #071321; border: 1px solid rgba(7,19,33,0.15);";
        
      const hl = t => q ? t.replace(new RegExp(q.replace(/[.*+?^$\{()|[\\]\\\\]/g,'\\\\$&'),'gi'), m=>\`<mark class="hl">\${m}</mark>\`) : t;
      
      const lawsHtml = c.laws.length 
        ? \`<div class="flex flex-wrap gap-2 mb-8">\${c.laws.map(l => \`<span class="inline-flex items-center text-[12px] font-bold text-brand-navy bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg">\${l}</span>\`).join('')}</div>\`
        : '';
        
      return \`
        <div class="glass-card overflow-hidden tp hover-lift border-slate-200/80 rounded-2xl group">
          <button onclick="toggleAcc('\${accId}')" class="w-full text-left flex justify-between items-center p-6 sm:p-7 cursor-pointer hover:bg-[#FAFCFF] tp focus-visible:outline-none flex-col sm:flex-row gap-4 sm:gap-0" aria-expanded="false" aria-controls="acc-\${accId}">
            <div class="flex items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pr-4 w-full sm:flex-1 min-w-0 flex-col sm:flex-row">
              <span class="inline-block shrink-0 px-3 py-1.5 rounded-lg text-[12px] font-bold shadow-sm" style="\${badgeStyle}">\${c.categoryLabel}</span>
              <h4 class="text-[16px] font-bold text-brand-navy leading-snug break-keep sm:truncate group-hover:text-brand-cyan transition-colors">\${hl(c.title)}</h4>
            </div>
            <div class="flex items-center space-x-3.5 text-slate-400 shrink-0 self-end sm:self-auto">
              <span class="text-[12px] font-mono font-bold hidden sm:inline opacity-70">\${c.year}</span>
              <span class="text-[12px] font-bold \${c.sourceOrg==='관세청'?'text-brand-cyan bg-brand-cyan/5 border-brand-cyan/20':'text-brand-navy bg-slate-100 border-slate-200'} border px-2.5 py-1 rounded-md shadow-sm">\${c.sourceOrg}</span>
              <div class="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200 group-hover:bg-brand-cyan group-hover:text-white group-hover:border-brand-cyan transition-all duration-300">
                <i id="icon-\${accId}" class="fa-solid fa-chevron-down text-[13px] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"></i>
              </div>
            </div>
          </button>
          
          <div id="acc-\${accId}" class="max-h-0 overflow-hidden transition-all duration-300 ease-in-out opacity-0 bg-white" role="region" aria-labelledby="button-acc-\${accId}">
            <div class="p-6 sm:p-8 pt-2 sm:pt-4 border-t border-slate-100">
              \${lawsHtml}
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative">
                <div class="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-gradient-to-b from-slate-100 via-slate-200 to-transparent"></div>
                
                <div class="relative z-10 md:pr-4">
                  <div class="flex items-center gap-2.5 mb-4">
                    <div class="w-7 h-7 rounded-lg bg-orange-50 text-orange-500 flex items-center justify-center font-black text-[14px]">Q</div>
                    <h5 class="font-bold text-[15px] text-brand-navy">질의</h5>
                  </div>
                  <div class="text-[14px] leading-[1.8] text-slate-600 font-medium break-keep whitespace-pre-wrap">\${hl(c.query)}</div>
                </div>
                
                <div class="relative z-10 md:pl-4">
                  <div class="flex items-center gap-2.5 mb-4">
                    <div class="w-7 h-7 rounded-lg bg-brand-cyan/10 text-brand-cyan flex items-center justify-center font-black text-[14px]">A</div>
                    <h5 class="font-bold text-[15px] text-brand-navy">판정 및 회신</h5>
                  </div>
                  <div class="text-[14px] leading-[1.8] text-slate-600 font-medium break-keep whitespace-pre-wrap">\${hl(c.reply)}</div>
                  
                  \${c.detail ? \`<div class="mt-6 pt-5 border-t border-slate-100 text-right"><p class="text-[12.5px] font-bold text-slate-400">\${c.detail}</p></div>\` : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      \`;
    }).join('');
}

function renderPagination() {
    const paginationContainer = document.getElementById('pagination-container');
    if(!paginationContainer) return;

    const totalPages = Math.ceil(currentFilteredCases.length / itemsPerPage);
    if(totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let pHtml = \`<div class="flex items-center gap-1.5 overflow-x-auto pb-2">\`;
    
    // Prev Button
    pHtml += \`<button onclick="goToPage(\${currentPage - 1})" \${currentPage === 1 ? 'disabled' : ''} class="w-9 h-9 rounded-xl flex flex-shrink-0 items-center justify-center text-[13px] font-bold transition-all \${currentPage === 1 ? 'bg-slate-50 text-slate-300 cursor-not-allowed border-slate-100 border' : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-brand-cyan border-slate-200 border cursor-pointer hover:border-brand-cyan/30'}"><i class="fa-solid fa-chevron-left"></i></button>\`;

    // Page Numbers
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
        pHtml += \`<button onclick="goToPage(1)" class="w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center text-[13.5px] font-bold transition-all bg-white text-slate-500 hover:bg-slate-50 hover:text-brand-cyan border-slate-200 border cursor-pointer hover:border-brand-cyan/30">1</button>\`;
        if (startPage > 2) {
            pHtml += \`<span class="w-7 h-9 flex items-center justify-center text-slate-400 text-[13px] tracking-widest">...</span>\`;
        }
    }

    for (let p = startPage; p <= endPage; p++) {
        if(p === currentPage) {
            pHtml += \`<button class="w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center text-[13.5px] font-bold bg-brand-cyan text-white shadow-md cursor-default">\${p}</button>\`;
        } else {
            pHtml += \`<button onclick="goToPage(\${p})" class="w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center text-[13.5px] font-bold transition-all bg-white text-slate-500 hover:bg-slate-50 hover:text-brand-cyan border-slate-200 border cursor-pointer hover:border-brand-cyan/30">\${p}</button>\`;
        }
    }

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pHtml += \`<span class="w-7 h-9 flex items-center justify-center text-slate-400 text-[13px] tracking-widest">...</span>\`;
        }
        pHtml += \`<button onclick="goToPage(\${totalPages})" class="w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center text-[13.5px] font-bold transition-all bg-white text-slate-500 hover:bg-slate-50 hover:text-brand-cyan border-slate-200 border cursor-pointer hover:border-brand-cyan/30">\${totalPages}</button>\`;
    }

    // Next Button
    pHtml += \`<button onclick="goToPage(\${currentPage + 1})" \${currentPage === totalPages ? 'disabled' : ''} class="w-9 h-9 flex-shrink-0 rounded-xl flex items-center justify-center text-[13px] font-bold transition-all \${currentPage === totalPages ? 'bg-slate-50 text-slate-300 cursor-not-allowed border-slate-100 border' : 'bg-white text-slate-500 hover:bg-slate-50 hover:text-brand-cyan border-slate-200 border cursor-pointer hover:border-brand-cyan/30'}"><i class="fa-solid fa-chevron-right"></i></button>\`;

    pHtml += \`</div>\`;
    paginationContainer.innerHTML = pHtml;
}

function goToPage(p) {
    const totalPages = Math.ceil(currentFilteredCases.length / itemsPerPage);
    if(p < 1 || p > totalPages) return;
    currentPage = p;
    const q = document.getElementById('case-search').value.trim().toLowerCase();
    renderPage(q);
    renderPagination();
    document.getElementById('case-search-section').scrollIntoView({behavior: 'smooth', block: 'start'});
}

`;

let injection3 = injection2.substring(0, startScriptIndex) + newScript + injection2.substring(endScriptIndex);

fs.writeFileSync('index.html', injection3, 'utf-8');
console.log('Successfully injected ALL_CASES, pagination HTML, and upgraded filterCases logic into index.html');
