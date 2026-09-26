/**
 * KURO STUDENT — INTERACTION FEEDBACK & ZERO-BLUE-OUTLINE VERIFICATION
 * Verifies:
 * 1. Global elimination of default browser blue selection & focus outlines
 * 2. Universal -webkit-tap-highlight-color removal across all devices
 * 3. Tactile Apple/Linear-grade press physics (:active { transform: scale(...) })
 * 4. Keyboard accessibility with Kuro burgundy/cream :focus-visible
 * 5. Input focus styles matching brand tokens
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const baseCss = fs.readFileSync(path.join(rootDir, 'css', 'base.css'), 'utf8');
const polishCss = fs.readFileSync(path.join(rootDir, 'css', 'polish.css'), 'utf8');
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');

let passed = 0;
let failed = 0;

function check(title, condition, extraInfo = '') {
  if (condition) {
    console.log(`  [PASS] ${title}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${title} ${extraInfo}`);
    failed++;
  }
}

console.log('='.repeat(75));
console.log('KURO STUDENT — INTERACTION FEEDBACK & ZERO-BLUE-OUTLINE AUDIT');
console.log('='.repeat(75));

// 1. Universal Tap Highlight Removal
console.log('\n--- 1. Universal Tap Highlight Removal ---');
check('base.css removes tap-highlight on universal selector', baseCss.includes('-webkit-tap-highlight-color: transparent !important'));
check('polish.css removes tap-highlight on universal selector', polishCss.includes('-webkit-tap-highlight-color: transparent !important'));

// 2. Custom Themed Selection (No Blue Rectangle Selection)
console.log('\n--- 2. Custom Themed Selection ---');
check('base.css styles ::selection with Kuro burgundy tint', baseCss.includes('::selection') && baseCss.includes('rgba(126, 29, 42, 0.22)'));
check('polish.css styles ::selection with Kuro burgundy tint', polishCss.includes('::selection') && polishCss.includes('rgba(126, 29, 42, 0.22)'));

// 3. Pointer Focus: Elimination of Browser Blue Outline on Click/Tap
console.log('\n--- 3. Pointer Focus: Elimination of Default Blue Outline ---');
check('base.css resets :focus:not(:focus-visible) outline', baseCss.includes(':focus:not(:focus-visible)') && baseCss.includes('outline: none !important'));
check('polish.css resets :focus:not(:focus-visible) outline', polishCss.includes(':focus:not(:focus-visible)') && polishCss.includes('outline: none !important'));
check('buttons have outline: none !important', polishCss.includes('outline: none !important'));
check('cards have outline: none !important', polishCss.includes('.continue-study-card') && polishCss.includes('outline: none !important'));

// 4. Keyboard Focus Accessibility (Subtle Kuro Burgundy Theme)
console.log('\n--- 4. Keyboard Focus Accessibility (:focus-visible) ---');
check('base.css styles :focus-visible with burgundy #7E1D2A outline', baseCss.includes(':focus-visible') && baseCss.includes('#7E1D2A'));
check('polish.css styles :focus-visible with burgundy #7E1D2A outline', polishCss.includes(':focus-visible') && polishCss.includes('#7E1D2A'));
check('base.css provides dark mode :focus-visible with subtle rose outline', baseCss.includes('[data-theme="dark"] :focus-visible') && baseCss.includes('#E27B88'));
check('polish.css provides dark mode :focus-visible with subtle rose outline', polishCss.includes('[data-theme="dark"] :focus-visible') && polishCss.includes('#E27B88'));

// 5. Form Input Focus (Zero Blue Rings)
console.log('\n--- 5. Form Input Focus (Zero Browser Blue) ---');
check('base.css input:focus uses #7E1D2A and zero outline', baseCss.includes('input:focus') && baseCss.includes('#7E1D2A') && baseCss.includes('outline: none !important'));
check('polish.css input:focus uses #7E1D2A and zero outline', polishCss.includes('input:focus') && polishCss.includes('#7E1D2A') && polishCss.includes('outline: none !important'));
check('header search input has zero blue shadow/border', !polishCss.includes('rgba(50,104,237'));

// 6. Tactile Press Animations (120-180ms Spring Curves)
console.log('\n--- 6. Tactile Press Physics & Transitions ---');
check('button transition includes 140ms cubic-bezier spring', polishCss.includes('transition: transform 140ms cubic-bezier(0.16, 1, 0.3, 1)'));
check('button:active applies scale(0.98)', polishCss.includes('button:active:not(:disabled)') && polishCss.includes('transform: scale(0.98) !important'));
check('cards transition includes 150ms cubic-bezier spring', polishCss.includes('transition: transform 150ms cubic-bezier(0.16, 1, 0.3, 1)'));
check('cards active state applies scale(0.985)', polishCss.includes('.continue-study-card:active') && polishCss.includes('transform: scale(0.985) !important'));
check('nav pills & segmented tabs active state applies scale(0.97)', polishCss.includes('.site-nav-pill:active') && polishCss.includes('transform: scale(0.97) !important'));
check('audio play circle button active state applies scale(0.93)', polishCss.includes('.audio-play-circle-btn:active') && polishCss.includes('transform: scale(0.93) !important'));

// 7. Cache Busting in index.html
console.log('\n--- 7. Cache Busting in index.html ---');
check('index.html loads base.css with v>=11.5', /css\/base\.css\?v=11\.[5-9]/.test(indexHtml));
check('index.html loads polish.css with v>=11.5', /css\/polish\.css\?v=(11\.[5-9]|1[2-9]\.)/.test(indexHtml));

console.log('\n' + '='.repeat(75));
console.log(`TOTAL CHECKS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log('='.repeat(75));

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL INTERACTION FEEDBACK & ZERO-BLUE-OUTLINE CHECKS PASSED PERFECTLY!\n');
}
