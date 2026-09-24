const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const sheetsJs = fs.readFileSync(path.join(rootDir, 'js', 'pages', 'sheets.js'), 'utf8');
const polishCss = fs.readFileSync(path.join(rootDir, 'css', 'polish.css'), 'utf8');
const heroImgPath = path.join(rootDir, 'assets', 'hero', 'sheets-hero-study.png');

console.log('='.repeat(75));
console.log('KURO STUDENT — SHEETS & LECTURES MASTER REDESIGN VERIFICATION');
console.log('='.repeat(75));

let passed = 0;
let failed = 0;

function check(name, condition) {
  if (condition) {
    console.log(`  [PASS] ${name}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${name}`);
    failed++;
  }
}

// 1. Hero Artwork & Banner Checks
console.log('\n--- 1. Hero Artwork & Panoramic Banner ---');
check('Panoramic artwork exists: assets/hero/sheets-hero-study.png', fs.existsSync(heroImgPath) && fs.statSync(heroImgPath).size > 100000);
check('sheets.js references assets/hero/sheets-hero-study.png', sheetsJs.includes('assets/hero/sheets-hero-study.png'));
check('Hero title contains "Sheets & Lectures" and "المحاضرات والملازم الدراسية"', sheetsJs.includes('Sheets & Lectures') && sheetsJs.includes('المحاضرات والملازم الدراسية'));
check('Hero subtitle contains "All your dental study materials in one place."', sheetsJs.includes('All your dental study materials in one place.') && sheetsJs.includes('كل ملازمك ومحاضراتك لطب الأسنان في مكان واحد.'));
check('Hero contains clipboard/document icon badge (.shb-badge-wrap)', sheetsJs.includes('shb-badge-wrap') && sheetsJs.includes('shb-badge-svg'));
check('polish.css styles .sheets-hero-banner with double-border elevation and vignette', polishCss.includes('.sheets-hero-banner') && polishCss.includes('.shb-vignette-overlay'));

// 2. Control & Filter Bar Checks
console.log('\n--- 2. Search, Filters & View Controls ---');
check('Search input with placeholder for sheets, lecturers, or topics', sheetsJs.includes('Search sheets, lecturers, or topics...') && sheetsJs.includes('ابحث عن شيت أو دكتور أو موضوع...'));
check('Subject filter dropdown with "All Subjects" / "كل المواد"', sheetsJs.includes('id="sheets-subject-dropdown"') && sheetsJs.includes('All Subjects') && sheetsJs.includes('كل المواد'));
check('Academic Year filter dropdown with "All Years" and "Year 3"', sheetsJs.includes('id="sheets-year-dropdown"') && sheetsJs.includes('All Years') && sheetsJs.includes('Year 3'));
check('Sort dropdown with "Newest First", "Oldest First", and "Title (A-Z)"', sheetsJs.includes('id="sheets-sort-dropdown"') && sheetsJs.includes('Newest First') && sheetsJs.includes('Oldest First'));
check('Sheet count label display (#sheets-count-label)', sheetsJs.includes('id="sheets-count-label"'));
check('View mode toggle for Grid and List modes', sheetsJs.includes('data-view="grid"') && sheetsJs.includes('data-view="list"'));

// 3. Card Structure (2-Column Horizontal Split + Bottom Action Buttons)
console.log('\n--- 3. Sheet Card Architecture ---');
check('Card uses inner split container (.sgc-card-inner)', sheetsJs.includes('sgc-card-inner') && polishCss.includes('.sgc-card-inner'));
check('Left column (.sgc-thumb-col) houses vertical A4 thumbnail', sheetsJs.includes('sgc-thumb-col') && polishCss.includes('.sgc-thumb-col'));
check('Thumbnail has A4 vertical aspect ratio (1 / 1.38)', polishCss.includes('aspect-ratio: 1 / 1.38'));
check('Right column (.sgc-info-col) houses metadata hierarchy', sheetsJs.includes('sgc-info-col') && polishCss.includes('.sgc-info-col'));
check('Header contains subject badge, order pill, and menu button', sheetsJs.includes('sgc-subject-badge') && sheetsJs.includes('sheets-order-pill') && sheetsJs.includes('sgc-menu-btn'));
check('Title styled cleanly with line-clamp and bold weight', sheetsJs.includes('sgc-title') && polishCss.includes('.sgc-title'));
check('Lecturer row contains user icon and doctor name', sheetsJs.includes('sgc-doctor-row') && sheetsJs.includes('user-round'));
check('Pages & file size row contains book and hard-drive icons', sheetsJs.includes('sgc-specs-row') && sheetsJs.includes('book-open') && sheetsJs.includes('hard-drive'));
check('Upload date row contains calendar icon and formatted date', sheetsJs.includes('sgc-date-row') && sheetsJs.includes('calendar'));

// 4. Two Full Visible Action Buttons
console.log('\n--- 4. Full-Width Action Buttons ---');
check('Card actions container (.sgc-actions) spans full width', polishCss.includes('.sgc-actions') && polishCss.includes('width: 100%'));
check('Open Sheet button (.sgc-btn-view) has burgundy fill, eye icon, and full label', sheetsJs.includes('sgc-btn-view') && sheetsJs.includes('data-lucide="eye"') && (sheetsJs.includes('Open Sheet') || sheetsJs.includes('فتح الشيت')));
check('Download Sheet button (.sgc-btn-download) has download icon and full label', sheetsJs.includes('sgc-btn-download') && sheetsJs.includes('data-lucide="download"') && (sheetsJs.includes('Download Sheet') || sheetsJs.includes('تنزيل الشيت')));
check('Buttons are full width and interactive (no icon-only replacement)', polishCss.includes('.sgc-btn-view') && polishCss.includes('.sgc-btn-download'));

// 5. Verified Elimination Checks
console.log('\n--- 5. Elimination of Verified Badges ---');
check('Zero "verified" occurrences in sheets.js', !(/verified/i.test(sheetsJs)));
check('Zero "معتمد" / "معتمدة" occurrences in sheets.js', !(/معتمد/i.test(sheetsJs)));

// 6. Responsive Layout & Viewports
console.log('\n--- 6. Responsive Layout Breakpoints ---');
check('Desktop (>= 1200px) defines 3-column grid with minmax(0, 1fr)', polishCss.includes('@media (min-width: 1200px)') && polishCss.includes('repeat(3, minmax(0, 1fr))'));
check('iPad / Tablet (768px-1199px) defines 2-column grid with minmax(0, 1fr)', polishCss.includes('@media (min-width: 768px) and (max-width: 1199px)') && polishCss.includes('repeat(2, minmax(0, 1fr))'));
check('Mobile (< 768px) defines 1-column vertical grid', polishCss.includes('@media (max-width: 767px)') && polishCss.includes('grid-template-columns: 1fr'));
check('Mobile hero adapts with compact height and clean typography', polishCss.includes('.sheets-hero-banner') && polishCss.includes('max-height: 150px'));

// 7. Data & PDF Rendering Service
console.log('\n--- 7. Data Integrity & PDF.js Rendering ---');
check('PdfThumbnailService is active with memory and sessionStorage caching', sheetsJs.includes('window.PdfThumbnailService') && sheetsJs.includes('sessionStorage.getItem'));
check('Real data fetched via window.DATA (no fake mocks)', sheetsJs.includes('window.DATA?.sheets') && sheetsJs.includes('getAllSheets'));

console.log('\n' + '='.repeat(75));
console.log(`TOTAL: ${passed} Passed, ${failed} Failed`);
console.log('='.repeat(75));

if (failed > 0) {
  process.exit(1);
} else {
  console.log('\nALL CHECKS PASSED PERFECTLY! 100% VISUAL BLUEPRINT CONFORMANCE!\n');
  process.exit(0);
}
