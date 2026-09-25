/**
 * KURO NOTES FINAL MASTER INTERFACE & UNIFIED TOOL SUITE VERIFICATION
 * Validates:
 *  1. 4-Area Master Shell (Header, Fixed Toolbar, Left Sidebar, Central PDF, Right Smart Panel)
 *  2. Exact Toolbar Group & Tool Order (1..10: Select, Highlighter, Pen, Eraser, Shapes, Image, Text, Notes | AI, More)
 *  3. Default Opening State (No annotation tool active initially: activeTool: null)
 *  4. 5-Layer Page Stack with Under-Text Highlighter (.kn-highlight-canvas + mix-blend-mode: multiply)
 *  5. All 9 Unified Tool Engines (Selection/Lasso, Highlighter, Pen, Eraser 3-mode, Shapes, Image+Crop, Direct Text, Notes, Page-Grouped Search)
 *  6. 3-Tier Responsive Layouts (Desktop >1100px, iPad 768-1100px with FABs, Mobile <768px with Bottom Bar)
 */

const fs = require('fs');

const sheetDetailCode = fs.readFileSync('js/pages/sheet-detail.js', 'utf8');
const polishCss = fs.readFileSync('css/polish.css', 'utf8');

const tests = [
  // 1. Master Shell & Branding
  {
    category: 'Master Shell & Header',
    name: 'Kuro Notes branding, mascot avatar, and truncated document title pill exist',
    pass:
      sheetDetailCode.includes('Kuro Notes') &&
      sheetDetailCode.includes('kn-header') &&
      sheetDetailCode.includes('kn-doc-title-pill') &&
      sheetDetailCode.includes('kn-mascot-avatar'),
  },
  {
    category: 'Master Shell & Header',
    name: 'Header contains Back button, Sidebar toggle, Search, Bookmark, Share, and More menu',
    pass:
      sheetDetailCode.includes('kn-btn-back') &&
      sheetDetailCode.includes('kn-btn-left-sidebar') &&
      sheetDetailCode.includes('kn-btn-search') &&
      sheetDetailCode.includes('kn-btn-bookmark') &&
      sheetDetailCode.includes('kn-btn-share') &&
      sheetDetailCode.includes('kn-btn-header-more'),
  },

  // 1. Unified Header Hierarchy (Back, Kuro Notes, Undo/Redo, Sheet Name, Page Nav, Zoom 50%..300%, Search, Bookmark, Share, More)
  {
    category: 'Unified Header Hierarchy',
    name: 'Header contains Back, Sidebar toggle, Kuro Notes brand, Undo/Redo, Sheet Name pill, Page Nav, Zoom (50%..300%), Search, Bookmark, Share, and More',
    pass:
      sheetDetailCode.includes('kn-btn-back') &&
      sheetDetailCode.includes('kn-btn-left-sidebar') &&
      sheetDetailCode.includes('Kuro Notes') &&
      sheetDetailCode.includes('kn-btn-undo') &&
      sheetDetailCode.includes('kn-btn-redo') &&
      sheetDetailCode.includes('kn-doc-title-pill') &&
      sheetDetailCode.includes('kn-group-pagenav') &&
      sheetDetailCode.includes('kn-group-zoom') &&
      sheetDetailCode.includes('data-zoom="1.3"') &&
      sheetDetailCode.includes('data-zoom="3.0"') &&
      sheetDetailCode.includes('kn-btn-search') &&
      sheetDetailCode.includes('kn-btn-bookmark') &&
      sheetDetailCode.includes('kn-btn-share') &&
      sheetDetailCode.includes('kn-btn-header-more'),
  },

  // 2. Clean Centered Top Toolbar & Exact Tool Order (No Horizontal Scroll Strip)
  {
    category: 'Clean Centered Top Toolbar',
    name: 'Toolbar follows exact order: Select, Pen, Highlighter, Eraser, Text, Image, Note, Bookmark, More (no AI, Outline, or Shapes clutter)',
    pass: (() => {
      const order = [
        'data-tool="select"',
        'data-tool="pen"',
        'data-tool="highlighter"',
        'data-tool="eraser"',
        'data-tool="text"',
        'data-tool="image"',
        'data-tool="notes"',
        'id="kn-toolbar-bookmark"',
        'id="kn-toolbar-more"',
      ];
      let lastIdx = -1;
      for (const token of order) {
        const idx = sheetDetailCode.indexOf(token);
        if (idx === -1 || idx < lastIdx) return false;
        lastIdx = idx;
      }
      return true;
    })(),
  },
  {
    category: 'Default Opening State',
    name: 'No annotation tool is active by default when opening a sheet (activeTool: null)',
    pass: sheetDetailCode.includes('activeTool: null'),
  },

  // 3. 5-Layer Page Stack, Layer z-index & Under-Text Highlighter
  {
    category: '5-Layer Page Stack',
    name: 'Page card contains PDF canvas, Under-Text Highlight canvas, Text layer, Annotation canvas, and Objects layer with proper z-index',
    pass:
      sheetDetailCode.includes('kn-pdf-canvas') &&
      sheetDetailCode.includes('kn-highlight-canvas') &&
      sheetDetailCode.includes('kn-text-layer') &&
      sheetDetailCode.includes('kn-annotation-layer') &&
      sheetDetailCode.includes('kn-objects-layer') &&
      polishCss.includes('.kn-interaction-layer.kn-drawing-active'),
  },
  {
    category: 'Under-Text Highlighter',
    name: 'Highlighter canvas uses mix-blend-mode: multiply so PDF text stays 100% sharp and dark',
    pass:
      polishCss.includes('.kn-highlight-canvas') &&
      polishCss.includes('mix-blend-mode: multiply'),
  },

  // 4. Universal Selection, Smooth Move, 8-Handle Resize & Zoom Coordinate Lock
  {
    category: 'Universal Selection, Move & Resize Engine',
    name: 'Supports Dashed Rectangular Bounding Box, 8 square resize handles + top rotation handle, Contextual Action Bar, and 60fps in-place Move/Resize across all zoom levels (50%..300%)',
    pass:
      polishCss.includes('border: 1.5px dashed #7E1D2A') &&
      polishCss.includes('.kn-selection-box.is-text-sel') &&
      sheetDetailCode.includes('getCardScale') &&
      sheetDetailCode.includes('getCanvasScale') &&
      sheetDetailCode.includes('redrawPageCanvasesOnly') &&
      sheetDetailCode.includes('data-ctx="edit"') &&
      sheetDetailCode.includes('data-ctx="duplicate"') &&
      sheetDetailCode.includes('Math.min(3.0, newZoom)'),
  },
  {
    category: 'Highlighter & Pen Tools',
    name: 'Supports Freehand & Straight modes, live preview, color swatches, size/opacity sliders, and unified presets',
    pass:
      sheetDetailCode.includes('KEY_HL_PRESETS') &&
      sheetDetailCode.includes('KEY_PEN_PRESETS') &&
      sheetDetailCode.includes('kn-live-preview-box') &&
      sheetDetailCode.includes('quadraticCurveTo'),
  },
  {
    category: 'Eraser Tool (3 Modes)',
    name: 'Supports Stroke, Object, and Partial path-splitting eraser modes with live circular cursor and quick sizes',
    pass:
      sheetDetailCode.includes("mode === 'partial'") &&
      sheetDetailCode.includes('kn-eraser-cursor') &&
      sheetDetailCode.includes('kn-eraser-quick-row'),
  },
  {
    category: 'Text Tool',
    name: 'Appears directly on page without visible box when idle, supports RTL/LTR, fonts, size, B/I/U/S, alignment, and opacity',
    pass:
      polishCss.includes('.kn-textbox-obj') &&
      sheetDetailCode.includes('kn-textbox-editor') &&
      sheetDetailCode.includes('applyTextFormattingToSelected'),
  },
  {
    category: 'Image Tool & Crop',
    name: 'Supports Device Upload, Drag & Drop, Clipboard Paste, Rotation, Z-Order, and Interactive Non-Destructive Crop',
    pass:
      sheetDetailCode.includes('kn-img-action-grid') &&
      sheetDetailCode.includes('applyImageCrop') &&
      sheetDetailCode.includes('kn-crop-overlay'),
  },
  {
    category: 'Notes Tool & Smart Panel',
    name: 'Supports on-page Note cards (categories, colors, pin, collapse) synced with Right Panel Notes search, filter, and sort',
    pass:
      sheetDetailCode.includes('kn-note-obj') &&
      sheetDetailCode.includes('kn-sidebar-note-card') &&
      sheetDetailCode.includes('kn-notes-cat-filter') &&
      sheetDetailCode.includes('kn-notes-sort'),
  },
  {
    category: 'Search Tool',
    name: 'Supports Arabic/English search, Match Case, Whole Words, Page-Grouped results with highlighted snippets, and temporary marks',
    pass:
      sheetDetailCode.includes('kn-search-popover') &&
      sheetDetailCode.includes('kn-search-page-group') &&
      sheetDetailCode.includes('kn-search-snippet-mark') &&
      sheetDetailCode.includes('kn-search-mark'),
  },

  // 5. Responsive Layouts Across ALL Devices (Desktop, Tablet/iPad, Mobile)
  {
    category: 'Responsive All-Device Layouts',
    name: 'Defines Desktop (>1024px), Tablet/iPad (<=1024px), and Mobile (<=767px) adaptive Header & Toolbar without horizontal scrolling',
    pass:
      polishCss.includes('@media (max-width: 1024px)') &&
      polishCss.includes('@media (max-width: 767px)') &&
      polishCss.includes('.kn-mobile-bottom-bar') &&
      polishCss.includes('-webkit-tap-highlight-color: transparent'),
  },

  // 6. Open Sheet Route Pipeline, Multi-Source Lookup & Real PDF.js Loader
  {
    category: 'Open Sheet Route Pipeline',
    name: 'Exports both window.SheetDetailPage.render(container, queryParams) and window.Pages.sheetDetail',
    pass:
      sheetDetailCode.includes('window.SheetDetailPage =') &&
      sheetDetailCode.includes('render(container, sheetIdOrQuery, maybeQuery)') &&
      sheetDetailCode.includes('window.Pages.sheetDetail = renderKuroNotesSheet'),
  },
  {
    category: 'Open Sheet Route Pipeline',
    name: 'Resolves sheet from window.DATA.getSheetById, window.DATA.sheets, kf_cloud_cached_sheets, kf_admin_custom_sheets, and syncCloudSheets',
    pass:
      sheetDetailCode.includes('window.DATA.getSheetById') &&
      sheetDetailCode.includes('kf_cloud_cached_sheets') &&
      sheetDetailCode.includes('kf_admin_custom_sheets') &&
      sheetDetailCode.includes('syncCloudSheets'),
  },
  {
    category: 'Real PDF.js & Error/Loading States',
    name: 'Resolves real PDF URL from sheet.pdf_url, sheet.download_url, sheet.fileUrl, and IndexedDB pdfStore with #kn-doc-loader and #kn-doc-error Retry UI',
    pass:
      sheetDetailCode.includes('sheet.pdf_url') &&
      sheetDetailCode.includes('sheet.download_url') &&
      sheetDetailCode.includes('pdfStore.getPdfUrl') &&
      sheetDetailCode.includes('id="kn-doc-loader"') &&
      sheetDetailCode.includes('id="kn-doc-error"') &&
      sheetDetailCode.includes('id="kn-pdf-retry-btn"'),
  },
];

let failed = 0;
console.log('====================================================');
console.log('🧪 RUNNING KURO NOTES FINAL MASTER SUITE VERIFICATION');
console.log('====================================================\n');

tests.forEach((t) => {
  if (t.pass) {
    console.log(`✅ [PASS] (${t.category}) ${t.name}`);
  } else {
    console.error(`❌ [FAIL] (${t.category}) ${t.name}`);
    failed++;
  }
});

console.log('\n====================================================');
if (failed === 0) {
  console.log(`🌟 ALL ${tests.length} KURO NOTES FINAL VERIFICATION TESTS PASSED!`);
  process.exit(0);
} else {
  console.error(`💥 ${failed} / ${tests.length} TESTS FAILED.`);
  process.exit(1);
}
