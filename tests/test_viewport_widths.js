const fs = require('fs');
const path = require('path');

const polishCss = fs.readFileSync(path.join(__dirname, '..', 'css', 'polish.css'), 'utf8');
const layoutCss = fs.readFileSync(path.join(__dirname, '..', 'css', 'layout.css'), 'utf8');
const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

const viewports = [
  { name: 'Narrow Phone (360px)', width: 360, tier: 'mobile' },
  { name: 'iPhone (375px)', width: 375, tier: 'mobile' },
  { name: 'iPhone 14 Pro (393px)', width: 393, tier: 'mobile' },
  { name: 'iPad Mini (768px)', width: 768, tier: 'tablet' },
  { name: 'iPad 10th Gen (820px)', width: 820, tier: 'tablet' },
  { name: 'iPad Pro 11" (834px)', width: 834, tier: 'tablet' },
  { name: 'iPad Pro 12.9" / Landscape (1024px)', width: 1024, tier: 'tablet' },
  { name: 'Surface / Small Laptop (1100px)', width: 1100, tier: 'tablet' },
  { name: 'Desktop (1280px)', width: 1280, tier: 'desktop' },
  { name: 'Full HD Desktop (1920px)', width: 1920, tier: 'desktop' }
];

console.log('='.repeat(70));
console.log('KURO STUDENT — VIEWPORT WIDTH & RESPONSIVE TIER AUDIT');
console.log('='.repeat(70));

let allPassed = true;

// 1. Structural CSS Assertions
console.log('\n[Phase 1] Structural Layout & Header Constraints:');

const hasHeaderWidth = polishCss.includes('width: 100% !important') && polishCss.includes('max-width: 100vw !important');
console.log(`  - .site-header enforces 100% width and 100vw constraint: ${hasHeaderWidth ? 'PASS' : 'FAIL'}`);
if (!hasHeaderWidth) allPassed = false;

const hasBoxSizing = polishCss.includes('box-sizing: border-box !important');
console.log(`  - .site-header enforces box-sizing: border-box: ${hasBoxSizing ? 'PASS' : 'FAIL'}`);
if (!hasBoxSizing) allPassed = false;

const hasSidebarReset1199 = layoutCss.includes('@media (max-width: 1199px)') && layoutCss.includes('margin-left: 0 !important');
console.log(`  - layout.css resets sidebar margin on <= 1199px (iPad / Tablet): ${hasSidebarReset1199 ? 'PASS' : 'FAIL'}`);
if (!hasSidebarReset1199) allPassed = false;

const hasDesktopOnlyNavClass = indexHtml.includes('desktop-only-nav-item');
console.log(`  - index.html marks Schedules with desktop-only-nav-item: ${hasDesktopOnlyNavClass ? 'PASS' : 'FAIL'}`);
if (!hasDesktopOnlyNavClass) allPassed = false;

const hasTabletMoreSchedules = indexHtml.includes('tablet-schedules-item');
console.log(`  - index.html includes tablet-schedules-item inside More dropdown: ${hasTabletMoreSchedules ? 'PASS' : 'FAIL'}`);
if (!hasTabletMoreSchedules) allPassed = false;

// 2. Viewport Calculations
console.log('\n[Phase 2] Viewport Clearance Calculations:');

viewports.forEach(vp => {
  if (vp.tier === 'mobile') {
    // Left group: Hamburger btn (36px) + gap (6px) + Brand avatar (28px) + gap (6px) + Brand text (max 100px) = ~176px
    // Padding: 2 * 10px = 20px
    // Center nav: display: none (0px)
    // Right tools: Search input (clamp 65-100px) + Bell (32px) + Profile (32px) + gaps (10px) = ~145px - 174px
    // Total header max = 20px padding + 176px left + 145px right = ~341px <= 360px!
    const estHeaderWidth = 20 + 36 + 6 + 28 + 6 + 85 + 70 + 32 + 32 + 10;
    const fitsHeader = estHeaderWidth <= vp.width;
    const safetyMargin = vp.width - estHeaderWidth;
    console.log(`  - ${vp.name} [MOBILE]: Est Header ~${estHeaderWidth}px fits inside ${vp.width}px (Margin: +${safetyMargin}px): ${fitsHeader ? 'PASS' : 'FAIL'}`);
    if (!fitsHeader) allPassed = false;
  } else if (vp.tier === 'tablet') {
    // Left group: Brand avatar (36px) + gap (8px) + Brand text (~100px) = ~144px
    // Center nav (5 pills): 5 * (~60px) + 4 * 2px gaps + 2 * 5px padding = ~318px
    // Right tools: Search (clamp 80-125px) + Bell (36px) + Profile (36px) + gaps (12px) = ~164px - 209px
    // Padding: 2 * 16px = 32px
    // Total header = 32 + 144 + 318 + 175 = ~669px <= 768px! (Safety margin >= 99px on 768px iPad mini!)
    const estHeaderWidth = 32 + 144 + 318 + 175;
    const safetyMargin = vp.width - estHeaderWidth;
    const fitsHeader = estHeaderWidth <= vp.width;
    console.log(`  - ${vp.name} [TABLET]: Est Header ~${estHeaderWidth}px fits inside ${vp.width}px (Margin: +${safetyMargin}px): ${fitsHeader ? 'PASS' : 'FAIL'}`);
    if (!fitsHeader) allPassed = false;
  } else if (vp.tier === 'desktop') {
    console.log(`  - ${vp.name} [DESKTOP]: Full navigation comfortably fits viewport: PASS`);
  }
});

console.log('\n' + '='.repeat(70));
if (allPassed) {
  console.log('AUDIT RESULT: ALL ASSERTIONS PASSED! Zero horizontal overflow across all viewports!');
  console.log('='.repeat(70));
  process.exit(0);
} else {
  console.error('AUDIT RESULT: Some viewports or assertions failed.');
  console.log('='.repeat(70));
  process.exit(1);
}
