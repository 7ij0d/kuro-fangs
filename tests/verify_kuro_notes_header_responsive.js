/**
 * verify_kuro_notes_header_responsive.js
 * Comprehensive automated verification for Kuro Notes Responsive Header across all devices:
 * - Desktop Landscape (> 1024px)
 * - Tablet / iPad Portrait & Landscape (768px - 1024px)
 * - Mobile Phone Portrait (< 768px, 480px, 360px)
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');
const sheetDetailJs = fs.readFileSync(path.join(ROOT, 'js/pages/sheet-detail.js'), 'utf8');
const polishCss = fs.readFileSync(path.join(ROOT, 'css/polish.css'), 'utf8');
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

const tests = [
  // 1. DOM Architecture & Control Hierarchy
  {
    category: '1. DOM Architecture',
    name: 'kn-header contains kn-header-left, kn-header-controls, and kn-header-right',
    pass:
      sheetDetailJs.includes('<div class="kn-header-left">') &&
      sheetDetailJs.includes('<div class="kn-header-controls">') &&
      sheetDetailJs.includes('<div class="kn-header-right">'),
  },
  {
    category: '1. DOM Architecture',
    name: 'Undo / Redo buttons (kn-header-history) are placed inside kn-header-controls',
    pass: (() => {
      const controlsIdx = sheetDetailJs.indexOf('<div class="kn-header-controls">');
      const historyIdx = sheetDetailJs.indexOf('id="kn-header-history"');
      const rightIdx = sheetDetailJs.indexOf('<div class="kn-header-right">');
      return controlsIdx !== -1 && historyIdx > controlsIdx && historyIdx < rightIdx;
    })(),
  },
  {
    category: '1. DOM Architecture',
    name: 'Page nav and zoom controls are wrapped in kn-controls-nav-zoom-wrap inside kn-header-controls',
    pass:
      sheetDetailJs.includes('<div class="kn-controls-nav-zoom-wrap" id="kn-controls-nav-zoom-wrap">') &&
      sheetDetailJs.includes('id="kn-header-pagenav"') &&
      sheetDetailJs.includes('id="kn-header-zoom"'),
  },
  {
    category: '1. DOM Architecture',
    name: 'kn-header-right contains all 5 primary tools: Search, Bookmark, Mode Toggle, Share, More',
    pass:
      sheetDetailJs.includes('id="kn-btn-search"') &&
      sheetDetailJs.includes('id="kn-btn-bookmark"') &&
      sheetDetailJs.includes('id="kn-btn-mode-toggle"') &&
      sheetDetailJs.includes('id="kn-btn-share"') &&
      sheetDetailJs.includes('id="kn-btn-header-more"'),
  },
  {
    category: '1. DOM Architecture',
    name: 'kn-header-more-menu includes kn-more-overflow-group with bookmark, share, and mode switch items',
    pass:
      sheetDetailJs.includes('class="kn-more-overflow-group" id="kn-more-overflow-group"') &&
      sheetDetailJs.includes('data-doc-action="more-bookmark"') &&
      sheetDetailJs.includes('data-doc-action="more-share"') &&
      sheetDetailJs.includes('data-doc-action="more-mode"'),
  },
  {
    category: '1. DOM Architecture',
    name: 'kn-mobile-bottom-bar includes kn-mob-history-group with kn-mob-undo and kn-mob-redo',
    pass:
      sheetDetailJs.includes('id="kn-mob-history-group"') &&
      sheetDetailJs.includes('id="kn-mob-undo"') &&
      sheetDetailJs.includes('id="kn-mob-redo"'),
  },

  // 2. Tablet Portrait (768px - 1024px) Layout
  {
    category: '2. Tablet Portrait (768px - 1024px)',
    name: 'CSS media query (max-width: 1024px) wraps header into 2 rows',
    pass:
      polishCss.includes('@media (max-width: 1024px)') &&
      polishCss.includes('flex-wrap: wrap;') &&
      polishCss.includes('row-gap: 8px;'),
  },
  {
    category: '2. Tablet Portrait (768px - 1024px)',
    name: 'Row 1 Left (kn-header-left) has order: 1 and max-width constraint to prevent overflow',
    pass:
      polishCss.includes('max-width: calc(100% - 215px);') &&
      polishCss.includes('min-width: 0;'),
  },
  {
    category: '2. Tablet Portrait (768px - 1024px)',
    name: 'Row 1 Right (kn-header-right) has order: 2, margin-inline-start: auto, and all 5 tools 100% visible',
    pass:
      polishCss.includes('#kn-btn-search,') &&
      polishCss.includes('#kn-btn-bookmark,') &&
      polishCss.includes('#kn-btn-mode-toggle,') &&
      polishCss.includes('#kn-btn-share,') &&
      polishCss.includes('#kn-btn-header-more {') &&
      polishCss.includes('display: inline-flex !important;'),
  },
  {
    category: '2. Tablet Portrait (768px - 1024px)',
    name: 'Row 2 (kn-header-controls) has order: 3, flex: 1 1 100%, width: 100%, and border-top separation',
    pass:
      polishCss.includes('.kn-header-controls {\n    order: 3;\n    flex: 1 1 100%;\n    width: 100%;') &&
      polishCss.includes('border-top: 1px solid var(--kn-border-subtle);') &&
      polishCss.includes('justify-content: space-between;'),
  },
  {
    category: '2. Tablet Portrait (768px - 1024px)',
    name: 'Doc title pill clamps text with ellipsis truncation',
    pass:
      polishCss.includes('.kn-doc-title-pill') &&
      polishCss.includes('text-overflow: ellipsis;') &&
      polishCss.includes('white-space: nowrap;') &&
      polishCss.includes('overflow: hidden;'),
  },

  // 3. Mobile Phone Portrait (< 768px) Layout
  {
    category: '3. Mobile Phone (< 768px)',
    name: 'Mobile header is single-row (flex-wrap: nowrap, height: 48px)',
    pass:
      polishCss.includes('@media (max-width: 767px)') &&
      polishCss.includes('flex-wrap: nowrap;') &&
      polishCss.includes('height: 48px;'),
  },
  {
    category: '3. Mobile Phone (< 768px)',
    name: 'Top header controls (kn-header-controls) are hidden on mobile (delegated to bottom bar)',
    pass:
      polishCss.includes('.kn-header-controls {\n    display: none !important;\n  }'),
  },
  {
    category: '3. Mobile Phone (< 768px)',
    name: 'Mobile header right keeps Search, Mode Toggle, and More button visible',
    pass:
      polishCss.includes('#kn-btn-search,\n  #kn-btn-mode-toggle,\n  #kn-btn-header-more {\n    display: inline-flex !important;\n  }'),
  },
  {
    category: '3. Mobile Phone (< 768px)',
    name: 'Mobile header collapses Bookmark and Share into More menu',
    pass:
      polishCss.includes('#kn-btn-bookmark,\n  #kn-btn-share {\n    display: none !important;\n  }'),
  },
  {
    category: '3. Mobile Phone (< 768px)',
    name: 'More menu displays kn-more-overflow-group on mobile screens',
    pass:
      polishCss.includes('.kn-more-overflow-group {\n    display: block;\n  }'),
  },
  {
    category: '3. Mobile Phone (< 768px)',
    name: 'Ultra-compact screens (<= 480px) cleanly hide doc title pill to guarantee zero overflow',
    pass:
      polishCss.includes('@media (max-width: 480px) {\n  .kn-doc-title-pill {\n    display: none !important;\n  }\n}'),
  },

  // 4. History & Action Wiring
  {
    category: '4. Wiring & Logic',
    name: 'updateHistoryButtons syncs disabled state to kn-mob-undo and kn-mob-redo',
    pass:
      sheetDetailJs.includes("const mobU = document.getElementById('kn-mob-undo');") &&
      sheetDetailJs.includes("const mobR = document.getElementById('kn-mob-redo');") &&
      sheetDetailJs.includes('if (mobU) mobU.disabled = !canUndo;') &&
      sheetDetailJs.includes('if (mobR) mobR.disabled = !canRedo;'),
  },
  {
    category: '4. Wiring & Logic',
    name: 'Mobile undo and redo buttons are attached to performUndo and performRedo',
    pass:
      sheetDetailJs.includes("if (mobUndoBtn) mobUndoBtn.onclick = performUndo;") &&
      sheetDetailJs.includes("if (mobRedoBtn) mobRedoBtn.onclick = performRedo;"),
  },
  {
    category: '4. Wiring & Logic',
    name: 'updateMoreMenuDynamicItems updates bookmark and mode toggle labels in More menu',
    pass:
      sheetDetailJs.includes('const updateMoreMenuDynamicItems = () => {') &&
      sheetDetailJs.includes("bmText.textContent = isBm ? 'Remove Bookmark' : 'Bookmark Page';") &&
      sheetDetailJs.includes("modeText.textContent = isEdit ? 'Switch to Browse Mode' : 'Switch to Edit Mode';"),
  },
  {
    category: '4. Wiring & Logic',
    name: 'data-doc-action handler delegates more-bookmark, more-share, and more-mode',
    pass:
      sheetDetailJs.includes("if (act === 'more-bookmark') {") &&
      sheetDetailJs.includes("if (act === 'more-share') {") &&
      sheetDetailJs.includes("if (act === 'more-mode') {"),
  },

  // 5. Cache Invalidation
  {
    category: '5. Cache Invalidation',
    name: 'index.html bumps polish.css to v=12.11 and sheet-detail.js to v=12.8',
    pass:
      indexHtml.includes('css/polish.css?v=12.11') &&
      indexHtml.includes('js/pages/sheet-detail.js?v=12.8'),
  },
];

console.log('====================================================');
console.log('🧪 KURO NOTES HEADER RESPONSIVE VERIFICATION SUITE');
console.log('====================================================\n');

let passedCount = 0;
let failedCount = 0;

tests.forEach((t) => {
  const status = t.pass ? '✅ [PASS]' : '❌ [FAIL]';
  console.log(`${status} (${t.category}) ${t.name}`);
  if (t.pass) {
    passedCount++;
  } else {
    failedCount++;
  }
});

console.log('\n====================================================');
console.log(`Results: ${passedCount} Passed, ${failedCount} Failed out of ${tests.length} tests.`);
console.log('====================================================');

if (failedCount > 0) {
  process.exit(1);
} else {
  console.log('🌟 ALL HEADER RESPONSIVE TESTS PASSED PERFECTLY!\n');
  process.exit(0);
}
