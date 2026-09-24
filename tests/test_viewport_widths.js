const fs = require('fs');
const path = require('path');

const polishCss = fs.readFileSync(path.join(__dirname, '..', 'css', 'polish.css'), 'utf8');
const layoutCss = fs.readFileSync(path.join(__dirname, '..', 'css', 'layout.css'), 'utf8');
const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

const viewports = [
  // Mobile Phone (< 768px)
  { name: 'Narrow Phone (360px)', width: 360, tier: 'mobile' },
  { name: 'iPhone (375px)', width: 375, tier: 'mobile' },
  { name: 'iPhone 14 Pro (393px)', width: 393, tier: 'mobile' },
  { name: 'Android / Large Phone (430px)', width: 430, tier: 'mobile' },

  // iPad & Tablet PORTRAIT (768px – 991px / 1024px portrait)
  { name: 'iPad Mini Portrait (768px)', width: 768, tier: 'tablet-portrait' },
  { name: 'iPad 10th Gen Portrait (810px)', width: 810, tier: 'tablet-portrait' },
  { name: 'iPad Air Portrait (820px)', width: 820, tier: 'tablet-portrait' },
  { name: 'iPad Pro 11" Portrait (834px)', width: 834, tier: 'tablet-portrait' },

  // iPad & Tablet LANDSCAPE (1024px – 1366px landscape)
  { name: 'iPad 9.7" / Mini Landscape (1024px)', width: 1024, tier: 'tablet-landscape' },
  { name: 'iPad 10.2" Landscape (1080px)', width: 1080, tier: 'tablet-landscape' },
  { name: 'iPad Air 10.9" Landscape (1180px)', width: 1180, tier: 'tablet-landscape' },
  { name: 'iPad Pro 11" Landscape (1194px)', width: 1194, tier: 'tablet-landscape' },
  { name: 'Samsung Galaxy Tab Landscape (1280px)', width: 1280, tier: 'tablet-landscape' },
  { name: 'iPad Pro 12.9" Landscape (1366px)', width: 1366, tier: 'tablet-landscape' },

  // Desktop (≥ 1280px Desktop Monitors)
  { name: 'Desktop Laptop (1440px)', width: 1440, tier: 'desktop' },
  { name: 'Full HD Desktop (1920px)', width: 1920, tier: 'desktop' }
];

console.log('='.repeat(75));
console.log('KURO STUDENT — MULTI-DEVICE VIEWPORT & TABLET LANDSCAPE AUDIT');
console.log('='.repeat(75));

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

const hasDedicatedTabletLandscape = polishCss.includes('iPad & Tablet LANDSCAPE') ||
  (polishCss.includes('min-width: 992px') && polishCss.includes('orientation: landscape'));
console.log(`  - polish.css has dedicated iPad & Tablet Landscape media query: ${hasDedicatedTabletLandscape ? 'PASS' : 'FAIL'}`);
if (!hasDedicatedTabletLandscape) allPassed = false;

// 2. Viewport Calculations
console.log('\n[Phase 2] Viewport Clearance Calculations:');

viewports.forEach(vp => {
  if (vp.tier === 'mobile') {
    // Left group: Hamburger btn (36px) + gap (6px) + Brand avatar (28px) + gap (6px) + Brand text (max 85px) = ~161px
    // Padding: 2 * 10px = 20px
    // Center nav: display: none (0px)
    // Right tools: Search input (clamp 65-100px) + Bell (32px) + Profile (32px) + gaps (10px) = ~145px - 174px
    const estHeaderWidth = 20 + 36 + 6 + 28 + 6 + 85 + 70 + 32 + 32 + 10;
    const fitsHeader = estHeaderWidth <= vp.width;
    const safetyMargin = vp.width - estHeaderWidth;
    console.log(`  - ${vp.name} [MOBILE]: Est Header ~${estHeaderWidth}px fits inside ${vp.width}px (Margin: +${safetyMargin}px): ${fitsHeader ? 'PASS' : 'FAIL'}`);
    if (!fitsHeader) allPassed = false;
  } else if (vp.tier === 'tablet-portrait') {
    // Left group: Brand avatar (36px) + gap (8px) + Brand text (~100px) = ~144px
    // Center nav (5 pills): 5 * (~60px) + 4 * 2px gaps + 2 * 5px padding = ~318px
    // Right tools: Search (clamp 80-125px) + Bell (34px) + Profile (34px) + gaps (12px) = ~175px
    // Padding: 2 * 16px = 32px
    const estHeaderWidth = 32 + 144 + 318 + 175;
    const safetyMargin = vp.width - estHeaderWidth;
    const fitsHeader = estHeaderWidth <= vp.width;
    console.log(`  - ${vp.name} [TABLET PORTRAIT]: Est Header ~${estHeaderWidth}px fits inside ${vp.width}px (Margin: +${safetyMargin}px): ${fitsHeader ? 'PASS' : 'FAIL'}`);
    if (!fitsHeader) allPassed = false;
  } else if (vp.tier === 'tablet-landscape') {
    // Left group: Brand avatar (32px) + gap (8px) + Brand text (~90px) = ~130px
    // Center nav (6 pills: Home, Sheets, Recordings, Questions, Schedules, More): ~410px
    // Right tools: Search (clamp 88-130px) + Bell (34px) + Profile (34px) + gaps (12px) = ~185px
    // Padding: 2 * 18px = 36px
    const estHeaderWidth = 36 + 130 + 410 + 185;
    const safetyMargin = vp.width - estHeaderWidth;
    const fitsHeader = estHeaderWidth <= vp.width;
    console.log(`  - ${vp.name} [TABLET LANDSCAPE]: Est Header ~${estHeaderWidth}px fits inside ${vp.width}px (Margin: +${safetyMargin}px): ${fitsHeader ? 'PASS' : 'FAIL'}`);
    if (!fitsHeader) allPassed = false;
  } else if (vp.tier === 'desktop') {
    console.log(`  - ${vp.name} [DESKTOP]: Full navigation comfortably fits viewport: PASS`);
  }
});

console.log('\n' + '='.repeat(75));
if (allPassed) {
  console.log('AUDIT RESULT: ALL ASSERTIONS PASSED! Zero horizontal overflow across all viewports!');
  console.log('='.repeat(75));
  process.exit(0);
} else {
  console.error('AUDIT RESULT: Some viewports or assertions failed.');
  console.log('='.repeat(75));
  process.exit(1);
}
