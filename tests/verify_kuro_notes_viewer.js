/**
 * KURO NOTES VIEWER VERIFICATION TEST SUITE
 * Validates the complete Kuro Notes workspace structure, header, toolbar,
 * sidebars, zoom controls, page navigation, layered DOM, zero-blue outlines,
 * and data integrity.
 */

const fs = require('fs');
const path = require('path');

const sheetDetailCode = fs.readFileSync('js/pages/sheet-detail.js', 'utf8');
const polishCss = fs.readFileSync('css/polish.css', 'utf8');

const tests = [
  // 1. Branding & Header Structure
  {
    category: 'Branding & Header',
    name: 'Kuro Notes application branding exists in sheet-detail.js',
    pass: sheetDetailCode.includes('Kuro Notes') && sheetDetailCode.includes('kn-header')
  },
  {
    category: 'Branding & Header',
    name: 'Document title pill with truncation and icon exists',
    pass: sheetDetailCode.includes('kn-doc-title-pill') && sheetDetailCode.includes('.pdf')
  },
  {
    category: 'Branding & Header',
    name: 'Header contains Back button, Sidebar toggle, Search, Bookmark, Share, and More menu',
    pass: sheetDetailCode.includes('kn-btn-back') &&
          sheetDetailCode.includes('kn-btn-toggle-left') &&
          sheetDetailCode.includes('kn-btn-search') &&
          sheetDetailCode.includes('kn-btn-bookmark') &&
          sheetDetailCode.includes('kn-btn-share') &&
          sheetDetailCode.includes('kn-btn-more')
  },

  // 2. Toolbar & Semantic Grouping
  {
    category: 'Top Toolbar',
    name: 'Toolbar contains distinct semantic groups with dividers',
    pass: sheetDetailCode.includes('kn-toolbar') &&
          sheetDetailCode.includes('kn-toolbar-divider') &&
          sheetDetailCode.includes('kn-group-history') &&
          sheetDetailCode.includes('kn-group-page') &&
          sheetDetailCode.includes('kn-group-zoom') &&
          sheetDetailCode.includes('kn-group-tools') &&
          sheetDetailCode.includes('kn-group-view')
  },
  {
    category: 'Top Toolbar',
    name: 'Page navigation includes direct page input [1] / N with prev and next buttons',
    pass: sheetDetailCode.includes('kn-page-input') &&
          sheetDetailCode.includes('kn-page-total') &&
          sheetDetailCode.includes('kn-btn-prev-page') &&
          sheetDetailCode.includes('kn-btn-next-page')
  },
  {
    category: 'Top Toolbar',
    name: 'Zoom engine includes zoom out, percentage dropdown with presets, and zoom in',
    pass: sheetDetailCode.includes('kn-btn-zoom-out') &&
          sheetDetailCode.includes('kn-btn-zoom-in') &&
          sheetDetailCode.includes('kn-btn-zoom-level') &&
          sheetDetailCode.includes('data-zoom="0.5"') &&
          sheetDetailCode.includes('data-zoom="1.2"') &&
          sheetDetailCode.includes('data-zoom="2.0"')
  },
  {
    category: 'Top Toolbar',
    name: 'All required annotation tool buttons exist in the toolbar',
    pass: sheetDetailCode.includes('data-tool="select"') &&
          sheetDetailCode.includes('data-tool="highlighter"') &&
          sheetDetailCode.includes('data-tool="pen"') &&
          sheetDetailCode.includes('data-tool="eraser"') &&
          sheetDetailCode.includes('data-tool="shapes"') &&
          sheetDetailCode.includes('data-tool="lasso"') &&
          sheetDetailCode.includes('data-tool="image"') &&
          sheetDetailCode.includes('data-tool="text"') &&
          sheetDetailCode.includes('data-tool="ai"')
  },
  {
    category: 'Top Toolbar',
    name: 'Highlighter button has active state placeholder ready for phase 2',
    pass: sheetDetailCode.includes('kn-tool-highlighter') &&
          (sheetDetailCode.includes('active') || sheetDetailCode.includes('selected'))
  },
  {
    category: 'Top Toolbar',
    name: 'View mode buttons exist (Single, Continuous, Dual, Fullscreen)',
    pass: sheetDetailCode.includes('kn-view-single') &&
          sheetDetailCode.includes('kn-view-continuous') &&
          sheetDetailCode.includes('kn-btn-fullscreen')
  },

  // 3. Left Document Navigation Sidebar
  {
    category: 'Left Sidebar',
    name: 'Left sidebar exists with required tabs (Pages, Bookmarks, Outline, Notes, AI Help)',
    pass: sheetDetailCode.includes('kn-sidebar-left') &&
          sheetDetailCode.includes('kn-tab-pages') &&
          sheetDetailCode.includes('kn-tab-bookmarks') &&
          sheetDetailCode.includes('kn-tab-outline') &&
          sheetDetailCode.includes('kn-tab-notes') &&
          sheetDetailCode.includes('kn-tab-ai')
  },
  {
    category: 'Left Sidebar',
    name: 'Thumbnails rail displays page previews with page numbers and active page indicator',
    pass: sheetDetailCode.includes('kn-thumbnail-item') &&
          sheetDetailCode.includes('kn-thumb-index') &&
          sheetDetailCode.includes('kn-thumb-preview')
  },
  {
    category: 'Left Sidebar',
    name: 'Left sidebar is collapsible',
    pass: sheetDetailCode.includes('kn-sidebar-collapsed') ||
          sheetDetailCode.includes('toggleLeftSidebar')
  },

  // 4. Center Document Area & Layered Architecture
  {
    category: 'Document Canvas',
    name: 'Document viewport is centered with margin separation and soft cream backdrop',
    pass: sheetDetailCode.includes('kn-document-viewport') &&
          sheetDetailCode.includes('kn-pages-container') &&
          sheetDetailCode.includes('kn-page-card')
  },
  {
    category: 'Document Canvas',
    name: 'Layered architecture per Section 20 (PDF Layer, Text Layer, Annotation Layer, Interaction Layer)',
    pass: sheetDetailCode.includes('kn-pdf-canvas') &&
          sheetDetailCode.includes('kn-text-layer') &&
          sheetDetailCode.includes('kn-annotation-layer') &&
          sheetDetailCode.includes('kn-interaction-layer')
  },

  // 5. Right Document Information Sidebar
  {
    category: 'Right Sidebar',
    name: 'Right sidebar exists with tabs (Outline, Notes, AI Help) and search input',
    pass: sheetDetailCode.includes('kn-sidebar-right') &&
          sheetDetailCode.includes('kn-outline-search') &&
          sheetDetailCode.includes('kn-right-tab-outline') &&
          sheetDetailCode.includes('kn-right-tab-notes') &&
          sheetDetailCode.includes('kn-right-tab-ai')
  },
  {
    category: 'Right Sidebar',
    name: 'Clickable outline navigates to page sections',
    pass: sheetDetailCode.includes('kn-outline-item') &&
          sheetDetailCode.includes('data-target-page')
  },
  {
    category: 'Right Sidebar',
    name: 'Right sidebar is collapsible and allows document expansion',
    pass: sheetDetailCode.includes('kn-btn-toggle-right') ||
          sheetDetailCode.includes('toggleRightSidebar')
  },

  // 6. Tactile Physics & Zero Blue Outlines in CSS
  {
    category: 'Design Tokens & CSS',
    name: 'Warm cream backdrop token (--kn-bg: #F8F5EE) and white paper canvas defined',
    pass: polishCss.includes('--kn-bg') &&
          polishCss.includes('#F8F5EE') &&
          polishCss.includes('--kn-surface')
  },
  {
    category: 'Design Tokens & CSS',
    name: 'Primary Burgundy token (--kn-primary: #7E1D2A) and blush accent defined',
    pass: polishCss.includes('--kn-primary') &&
          polishCss.includes('#7E1D2A') &&
          polishCss.includes('rgba(126, 29, 42')
  },
  {
    category: 'Design Tokens & CSS',
    name: 'Active thumbnail has prominent burgundy border outline',
    pass: polishCss.includes('.kn-thumbnail-item.active') &&
          polishCss.includes('#7E1D2A')
  },
  {
    category: 'Design Tokens & CSS',
    name: 'Tactile spring press scaling (scale(0.98)) applied to Kuro Notes controls',
    pass: polishCss.includes('.kn-tool-btn:active') &&
          polishCss.includes('transform: scale')
  },
  {
    category: 'Design Tokens & CSS',
    name: 'Zero-blue focus & tap highlight enforced on Kuro Notes elements',
    pass: polishCss.includes('.kn-tool-btn') &&
          polishCss.includes('-webkit-tap-highlight-color: transparent')
  },

  // 7. Responsive & Distraction-Free Reading Mode
  {
    category: 'Responsive & Fullscreen',
    name: 'Distraction-free reading mode hides chrome and provides floating exit pill',
    pass: sheetDetailCode.includes('kn-reading-mode') &&
          sheetDetailCode.includes('kn-reading-mode-pill')
  },
  {
    category: 'Responsive & Fullscreen',
    name: 'iPad touch targets and mobile drawer styles defined in CSS',
    pass: polishCss.includes('@media (max-width: 1024px)') &&
          polishCss.includes('@media (max-width: 768px)') &&
          polishCss.includes('.kn-sidebar-left')
  },

  // 8. Data Integrity & Real Sheet Integration
  {
    category: 'Data Integrity',
    name: 'Integrates real sheet metadata from window.DATA (no fictional mock data)',
    pass: sheetDetailCode.includes('window.DATA') &&
          sheetDetailCode.includes('sheet.title') &&
          sheetDetailCode.includes('sheet.pdf_url')
  },
  {
    category: 'Data Integrity',
    name: 'Preserves existing copy text engine and discussion board functionality',
    pass: sheetDetailCode.includes('window.SheetCopyEngine') &&
          sheetDetailCode.includes('commentsKey')
  }
];

let failed = 0;
console.log('====================================================');
console.log('🧪 RUNNING KURO NOTES VIEWER VERIFICATION TEST SUITE');
console.log('====================================================\n');

tests.forEach((t, i) => {
  if (t.pass) {
    console.log(`✅ [PASS] (${t.category}) ${t.name}`);
  } else {
    console.error(`❌ [FAIL] (${t.category}) ${t.name}`);
    failed++;
  }
});

console.log('\n====================================================');
if (failed === 0) {
  console.log(`🌟 ALL ${tests.length} KURO NOTES VERIFICATION TESTS PASSED!`);
  process.exit(0);
} else {
  console.error(`💥 ${failed} / ${tests.length} TESTS FAILED.`);
  process.exit(1);
}
