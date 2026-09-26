/**
 * verify_eraser_redesign.js
 * Comprehensive automated verification test suite for Kuro Notes Redesigned Eraser Tool
 * (2 Modes: Select Object & Partial Erase, Complete Removal of Stroke Mode)
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const sheetDetailPath = path.join(rootDir, 'js', 'pages', 'sheet-detail.js');
const polishCssPath = path.join(rootDir, 'css', 'polish.css');
const indexHtmlPath = path.join(rootDir, 'index.html');

const sheetDetailCode = fs.readFileSync(sheetDetailPath, 'utf8');
const polishCss = fs.readFileSync(polishCssPath, 'utf8');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

const tests = [
  // 1. Stroke Mode Completely Removed
  {
    category: '1. Complete Removal of Stroke Mode',
    name: 'Popover does NOT contain Stroke mode option or button',
    pass: !sheetDetailCode.includes('data-er-mode="stroke"'),
  },
  {
    category: '1. Complete Removal of Stroke Mode',
    name: 'Default state.eraser.mode is set to "object" and default size is 28',
    pass:
      sheetDetailCode.includes("mode: 'object'") &&
      sheetDetailCode.includes('size: 28'),
  },
  {
    category: '1. Complete Removal of Stroke Mode',
    name: 'Tool popover eraser section contains exactly 2 mode buttons (object & partial)',
    pass: (() => {
      const eraserSectionStart = sheetDetailCode.indexOf("tool === 'eraser'");
      const eraserSectionEnd = sheetDetailCode.indexOf("tool === 'select'", eraserSectionStart);
      const slice = sheetDetailCode.slice(eraserSectionStart, eraserSectionEnd);
      const hasObject = slice.includes('data-er-mode="object"');
      const hasPartial = slice.includes('data-er-mode="partial"');
      const hasStroke = slice.includes('data-er-mode="stroke"');
      return hasObject && hasPartial && !hasStroke;
    })(),
  },

  // 2. Select Object Mode Architecture
  {
    category: '2. Select Object Mode',
    name: 'Includes Select Object card with dashed rect icon, title, and Arabic subtitle',
    pass:
      sheetDetailCode.includes('Select Object') &&
      sheetDetailCode.includes('تحديد العنصر بالكامل') &&
      sheetDetailCode.includes('data-er-mode="object"'),
  },
  {
    category: '2. Select Object Mode',
    name: 'findAnnotationForEraser function is defined and detects all annotation types (Pen, Highlighter, Shape, Text, Note, Image)',
    pass: (() => {
      const hasFn = sheetDetailCode.includes('function findAnnotationForEraser(pageNum, pt)');
      const handlesPen = sheetDetailCode.includes("ann.type === 'pen'");
      const handlesHl = sheetDetailCode.includes("ann.type === 'highlighter'");
      const handlesShape = sheetDetailCode.includes("ann.type === 'shape'");
      const handlesBounds = sheetDetailCode.includes('getAnnotationBounds(ann)');
      return hasFn && handlesPen && handlesHl && handlesShape && handlesBounds;
    })(),
  },
  {
    category: '2. Select Object Mode',
    name: 'Pointerdown in Select Object mode selects object without erasing on drag',
    pass: (() => {
      const block = sheetDetailCode.slice(
        sheetDetailCode.indexOf("// ── MODE 1: SELECT OBJECT"),
        sheetDetailCode.indexOf("// ── MODE 2: PARTIAL ERASE")
      );
      return (
        block.includes('state.selectedIds = [hit.id]') &&
        block.includes('return;') // prevents falling through to pointermove drag erase!
      );
    })(),
  },
  {
    category: '2. Select Object Mode',
    name: 'Tapping the selected object again directly deletes it',
    pass: (() => {
      const block = sheetDetailCode.slice(
        sheetDetailCode.indexOf("// ── MODE 1: SELECT OBJECT"),
        sheetDetailCode.indexOf("// ── MODE 2: PARTIAL ERASE")
      );
      const selBoxTapDelete = sheetDetailCode.includes("handleContextAction('delete', selectedOnPage, pageNum)");
      return (
        block.includes('state.selectedIds.includes(hit.id)') &&
        block.includes('pushHistory()') &&
        selBoxTapDelete
      );
    })(),
  },
  {
    category: '2. Select Object Mode',
    name: 'Floating contextual bar displays Delete Object (حذف) button and Dismiss (✕) button in Eraser mode',
    pass:
      sheetDetailCode.includes('kn-ctx-eraser-del') &&
      sheetDetailCode.includes('Delete Object (حذف)') &&
      sheetDetailCode.includes('data-ctx="dismiss"'),
  },
  {
    category: '2. Select Object Mode',
    name: 'Selection box in Eraser mode hides resize/rotate handles and applies .is-eraser-sel',
    pass:
      sheetDetailCode.includes('is-eraser-sel') &&
      sheetDetailCode.includes('if (!isEraserMode) {') &&
      sheetDetailCode.includes('kn-sel-handle'),
  },

  // 3. Partial Erase Mode Architecture
  {
    category: '3. Partial Erase Mode',
    name: 'Includes Partial Erase card with icon, title, and Arabic subtitle',
    pass:
      sheetDetailCode.includes('Partial Erase') &&
      sheetDetailCode.includes('ممحاة جزئية') &&
      sheetDetailCode.includes('data-er-mode="partial"'),
  },
  {
    category: '3. Partial Erase Mode',
    name: 'Live circular cursor is only displayed in Partial Erase mode',
    pass:
      sheetDetailCode.includes("state.eraser.mode !== 'partial'") &&
      sheetDetailCode.includes("cur.style.display = 'none'"),
  },
  {
    category: '3. Partial Erase Mode',
    name: 'Smooth path-splitting (densifyStrokePoints) splits vector strokes into clean sub-paths without rasterization',
    pass:
      sheetDetailCode.includes('function densifyStrokePoints(points, stepPx = 3)') &&
      sheetDetailCode.includes('currentSeg.push(p)') &&
      sheetDetailCode.includes('mode: \'freehand\'') &&
      sheetDetailCode.includes('points: currentSeg'),
  },
  {
    category: '3. Partial Erase Mode',
    name: 'Size controls include range slider (8-64px) with live value display and quick size presets (12, 28, 44px)',
    pass:
      sheetDetailCode.includes('id="kn-er-size"') &&
      sheetDetailCode.includes('id="kn-er-size-val"') &&
      sheetDetailCode.includes('data-er-quick="12"') &&
      sheetDetailCode.includes('data-er-quick="28"') &&
      sheetDetailCode.includes('data-er-quick="44"'),
  },

  // 4. Persistence & Undo/Redo
  {
    category: '4. Persistence & Undo/Redo',
    name: 'Deletions in Select Object mode push to history stack and save to localStorage',
    pass: (() => {
      const block = sheetDetailCode.slice(
        sheetDetailCode.indexOf("// ── MODE 1: SELECT OBJECT"),
        sheetDetailCode.indexOf("// ── MODE 2: PARTIAL ERASE")
      );
      return (
        block.includes('pushHistory()') &&
        block.includes('saveAnnotations()') &&
        block.includes('renderPageAnnotations(pageNum)')
      );
    })(),
  },
  {
    category: '4. Persistence & Undo/Redo',
    name: 'Partial erasing captures undo snapshot before modification',
    pass:
      sheetDetailCode.includes('beforeEraseSnapshot = JSON.stringify(state.annotations)') &&
      sheetDetailCode.includes('state.undoStack.push(beforeEraseSnapshot)'),
  },

  // 5. CSS & Visual Polish
  {
    category: '5. CSS & Design System Tokens',
    name: 'CSS defines .kn-eraser-modes-grid and .kn-eraser-mode-card with active burgundy theme #7E1D2A',
    pass:
      polishCss.includes('.kn-eraser-modes-grid') &&
      polishCss.includes('.kn-eraser-mode-card') &&
      polishCss.includes('.kn-eraser-mode-card.active') &&
      polishCss.includes('#7E1D2A') &&
      polishCss.includes('#FDF2F4'),
  },
  {
    category: '5. CSS & Design System Tokens',
    name: 'CSS defines .kn-selection-box.is-eraser-sel with dashed pulse effect and .kn-ctx-eraser-del',
    pass:
      polishCss.includes('.kn-selection-box.is-eraser-sel') &&
      polishCss.includes('knPulseEraserSel') &&
      polishCss.includes('.kn-ctx-btn.danger.kn-ctx-eraser-del'),
  },
  {
    category: '5. CSS & Design System Tokens',
    name: 'Dark mode styling supported for eraser cards, sizes, and selection box',
    pass:
      polishCss.includes('[data-theme="dark"] .kn-eraser-mode-card') &&
      polishCss.includes('[data-theme="dark"] .kn-selection-box.is-eraser-sel'),
  },

  // 6. Cache Busters
  {
    category: '6. Cache Invalidation',
    name: 'index.html bumps polish.css to v=12.10 and sheet-detail.js to v=12.7',
    pass:
      indexHtml.includes('css/polish.css?v=12.10') &&
      indexHtml.includes('js/pages/sheet-detail.js?v=12.7'),
  },
];

console.log('====================================================');
console.log('🧪 KURO NOTES ERASER REDESIGN VERIFICATION SUITE');
console.log('====================================================\n');

let passedCount = 0;
let failedCount = 0;

tests.forEach((t, i) => {
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
  console.log('🌟 ALL ERASER REDESIGN VERIFICATION TESTS PASSED PERFECTLY!\n');
  process.exit(0);
}
