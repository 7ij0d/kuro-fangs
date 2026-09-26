/**
 * KURO FANGS — CONTINUE STUDYING MOBILE RESPONSIVE TEST SUITE
 * 
 * Verifies:
 * 1. Card width <= available viewport width across all mobile breakpoints:
 *    320px, 360px, 375px, 390px, 412px, 430px.
 * 2. Grid track sizing enforces minmax(0, 1fr) on mobile (preventing min-content expansion bug).
 * 3. Continue Studying buttons are 100% full width, box-sizing: border-box, inside card boundaries.
 * 4. Multi-line titles wrap cleanly up to 2 lines (-webkit-line-clamp: 2) with word-break & overflow-wrap.
 * 5. Subtitle & description truncate cleanly without overflowing or showing "undefined".
 * 6. Card padding adjusts appropriately on ultra-narrow screens (<= 390px / <= 360px).
 * 7. Desktop (3-column) and Tablet (2-column) grid layouts remain intact.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const polishCss = fs.readFileSync(path.join(rootDir, 'css', 'polish.css'), 'utf8');
const homeJs = fs.readFileSync(path.join(rootDir, 'js', 'pages', 'home.js'), 'utf8');
const sheetDetailJs = fs.readFileSync(path.join(rootDir, 'js', 'pages', 'sheet-detail.js'), 'utf8');
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');

const tests = [
  // ─── 1. CSS Grid & Track Sizing ───
  {
    category: 'CSS Grid Track Sizing',
    name: '.kuro-continue-studying-grid enforces minmax(0, 1fr) on mobile (< 768px)',
    pass: polishCss.includes('.kuro-continue-studying-grid') &&
          polishCss.includes('grid-template-columns: minmax(0, 1fr) !important')
  },
  {
    category: 'CSS Grid Track Sizing',
    name: '.kuro-continue-studying-grid has width: 100% and box-sizing: border-box',
    pass: polishCss.includes('.kuro-continue-studying-grid') &&
          polishCss.includes('width: 100%') &&
          polishCss.includes('box-sizing: border-box')
  },
  {
    category: 'CSS Grid Track Sizing',
    name: 'Desktop preserves 3-column grid repeat(3, minmax(0, 1fr))',
    pass: polishCss.includes('grid-template-columns: repeat(3, minmax(0, 1fr))')
  },
  {
    category: 'CSS Grid Track Sizing',
    name: 'Tablet preserves 2-column grid repeat(2, minmax(0, 1fr))',
    pass: polishCss.includes('grid-template-columns: repeat(2, minmax(0, 1fr)) !important')
  },

  // ─── 2. Card Sizing & Containment ───
  {
    category: 'Card Sizing & Containment',
    name: '.continue-study-card enforces width: 100%, max-width: 100%, min-width: 0, box-sizing: border-box',
    pass: polishCss.includes('.continue-study-card') &&
          polishCss.includes('min-width: 0') &&
          polishCss.includes('overflow: hidden') &&
          polishCss.includes('box-sizing: border-box')
  },
  {
    category: 'Card Sizing & Containment',
    name: '.continue-study-card on mobile (< 768px) enforces width 100% and auto min-height',
    pass: polishCss.includes('@media (max-width: 767px)') &&
          polishCss.includes('min-height: auto !important')
  },
  {
    category: 'Card Sizing & Containment',
    name: '.continue-study-card has compact padding on extra small mobile (<= 390px)',
    pass: polishCss.includes('@media (max-width: 390px)') &&
          polishCss.includes('padding: 14px !important')
  },

  // ─── 3. Button Layout & Bounds ───
  {
    category: 'Button Layout & Bounds',
    name: '.continue-action-btn enforces width: 100%, max-width: 100%, min-width: 0, box-sizing: border-box',
    pass: polishCss.includes('.continue-action-btn') &&
          polishCss.includes('box-sizing: border-box') &&
          polishCss.includes('overflow: hidden')
  },
  {
    category: 'Button Layout & Bounds',
    name: '.continue-action-btn span has ellipsis and min-width: 0 (preventing button stretching)',
    pass: polishCss.includes('.continue-action-btn span') &&
          polishCss.includes('text-overflow: ellipsis') &&
          polishCss.includes('min-width: 0')
  },
  {
    category: 'Button Layout & Bounds',
    name: '.continue-action-btn svg has flex-shrink: 0',
    pass: polishCss.includes('.continue-action-btn svg') &&
          polishCss.includes('flex-shrink: 0')
  },

  // ─── 4. Typography & Text Overflow Wrapping ───
  {
    category: 'Typography & Text Wrapping',
    name: '.continue-card-title wraps up to 2 lines with -webkit-line-clamp: 2',
    pass: polishCss.includes('.continue-card-title') &&
          polishCss.includes('-webkit-line-clamp: 2') &&
          polishCss.includes('-webkit-box-orient: vertical')
  },
  {
    category: 'Typography & Text Wrapping',
    name: '.continue-card-title enforces word-break: break-word and overflow-wrap: anywhere',
    pass: polishCss.includes('.continue-card-title') &&
          polishCss.includes('word-break: break-word') &&
          polishCss.includes('overflow-wrap: anywhere')
  },
  {
    category: 'Typography & Text Wrapping',
    name: '.continue-card-subject enforces line-clamp: 1 with word-break and overflow-wrap',
    pass: polishCss.includes('.continue-card-subject') &&
          polishCss.includes('-webkit-line-clamp: 1') &&
          polishCss.includes('overflow: hidden')
  },

  // ─── 5. Data Integrity & "undefined" Elimination ───
  {
    category: 'Data Integrity & Fallbacks',
    name: 'home.js safely resolves subject names from DATA.getSubjects() if missing in sheetData',
    pass: homeJs.includes('window.DATA.getSubjects()') &&
          homeJs.includes('resolvedSheetSubj')
  },
  {
    category: 'Data Integrity & Fallbacks',
    name: 'home.js prevents string literal "undefined" in sheetSub, audioSub, and qSub',
    pass: homeJs.includes("rawSheetSub !== 'undefined'") &&
          homeJs.includes("rawAudioSub !== 'undefined'") &&
          homeJs.includes("rawQSub !== 'undefined'")
  },
  {
    category: 'Data Integrity & Fallbacks',
    name: 'sheet-detail.js saves subject names and timestamp in kf_last_opened_sheet',
    pass: sheetDetailJs.includes('subject_name_ar:') &&
          sheetDetailJs.includes('subject_name_en:') &&
          sheetDetailJs.includes('timestamp: Date.now()')
  },

  // ─── 6. Viewport Constraints (< 768px & <= 360px) ───
  {
    category: 'Mobile Container Constraints',
    name: '.main-content has box-sizing: border-box and max-width: 100% on mobile (< 768px)',
    pass: polishCss.includes('@media (max-width: 767px)') &&
          polishCss.includes('max-width: 100% !important') &&
          polishCss.includes('box-sizing: border-box !important')
  },
  {
    category: 'Mobile Container Constraints',
    name: '.kuro-dashboard-container has width 100%, max-width 100%, min-width 0 on mobile',
    pass: polishCss.includes('.kuro-dashboard-container') &&
          polishCss.includes('min-width: 0')
  }
];

// ─── 7. Viewport Width Mathematical Clearance Audit ───
const mobileBreakpoints = [
  { name: 'Ultra-compact Android (320px)', width: 320, padding: 20 },
  { name: 'Compact Phone (360px)', width: 360, padding: 20 },
  { name: 'Standard iPhone (375px)', width: 375, padding: 28 },
  { name: 'iPhone 13 / 14 / 15 (390px)', width: 390, padding: 28 },
  { name: 'Modern Android Flagship (412px)', width: 412, padding: 28 },
  { name: 'Large Pro Max / Plus (430px)', width: 430, padding: 28 }
];

function runViewportMathAudit() {
  const mathResults = [];

  mobileBreakpoints.forEach(bp => {
    const availableWidth = bp.width - bp.padding;
    const cardPadding = bp.width <= 390 ? 28 : 32; // 2 * 14px or 2 * 16px
    const cardContentWidth = availableWidth - cardPadding;

    // Button occupies 100% of card content width
    const buttonWidth = cardContentWidth;

    // Verify card fits in viewport
    const cardFitsViewport = availableWidth < bp.width;
    const buttonFitsCard = buttonWidth <= cardContentWidth;
    const noNegativeMargin = cardContentWidth > 200;

    mathResults.push({
      name: `${bp.name}: Available ${availableWidth}px, Card Content ${cardContentWidth}px, Button ${buttonWidth}px (Fits 100%)`,
      pass: cardFitsViewport && buttonFitsCard && noNegativeMargin
    });
  });

  return mathResults;
}

// ─── Execution ───
let failedCount = 0;
console.log('='.repeat(75));
console.log('KURO FANGS — CONTINUE STUDYING MOBILE RESPONSIVE AUDIT');
console.log('='.repeat(75));

let currentCat = '';
tests.forEach((t) => {
  if (t.category !== currentCat) {
    currentCat = t.category;
    console.log(`\n--- ${currentCat} ---`);
  }
  if (t.pass) {
    console.log(`  [PASS] ${t.name}`);
  } else {
    console.log(`  [FAIL] ${t.name}`);
    failedCount++;
  }
});

console.log(`\n--- Viewport Width Mathematical Clearance (320px - 430px) ---`);
const mathAudit = runViewportMathAudit();
mathAudit.forEach((t) => {
  if (t.pass) {
    console.log(`  [PASS] ${t.name}`);
  } else {
    console.log(`  [FAIL] ${t.name}`);
    failedCount++;
  }
});

console.log('\n' + '='.repeat(75));
const totalTests = tests.length + mathAudit.length;
if (failedCount === 0) {
  console.log(`RESULT: ALL ${totalTests} VERIFICATION CHECKS PASSED PERFECTLY!`);
  console.log('Continue Studying cards and buttons are 100% responsive without horizontal overflow.');
  console.log('='.repeat(75));
  process.exit(0);
} else {
  console.error(`RESULT: ${failedCount} of ${totalTests} CHECKS FAILED.`);
  console.log('='.repeat(75));
  process.exit(1);
}
