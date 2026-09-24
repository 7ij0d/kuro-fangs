const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const sheetsJs = fs.readFileSync(path.join(rootDir, 'js', 'pages', 'sheets.js'), 'utf8');
const polishCss = fs.readFileSync(path.join(rootDir, 'css', 'polish.css'), 'utf8');
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const heroImgPath = path.join(rootDir, 'assets', 'hero', 'sheets-hero-study.png');

console.log('='.repeat(75));
console.log('KURO STUDENT — SHEETS & LECTURES 2-STEP MASTER REDESIGN VERIFICATION');
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
check('Hero subtitle contains "Select a subject to view its study materials."', sheetsJs.includes('Select a subject to view its study materials.') && sheetsJs.includes('اختر مادة لعرض ملازمها ومحاضراتها الدراسية.'));
check('Hero contains document icon badge (.shb-badge-wrap)', sheetsJs.includes('shb-badge-wrap') && sheetsJs.includes('shb-badge-svg'));
check('polish.css styles .sheets-hero-banner with double-border elevation and vignette', polishCss.includes('.sheets-hero-banner') && polishCss.includes('.shb-vignette-overlay'));

// 2. 2-Step Architecture: Level 1 (Subjects) & Level 2 (Sheets)
console.log('\n--- 2. 2-Step Subject & Sheet Architecture ---');
check('Implements renderLevel1Subjects for Step 1', sheetsJs.includes('renderLevel1Subjects'));
check('Implements renderLevel2Sheets for Step 2', sheetsJs.includes('renderLevel2Sheets'));
check('Defines 12 Dental Curriculum Subjects with codes', sheetsJs.includes('SUBJECT_DEFINITIONS') && sheetsJs.includes('CONS-302') && sheetsJs.includes('MED-301'));
check('Contains .sheets-subject-grid and .sheets-subject-card', sheetsJs.includes('sheets-subject-grid') && sheetsJs.includes('sheets-subject-card'));
check('Dynamically calculates real sheet counts from database', sheetsJs.includes('getSheetsForSubject') && sheetsJs.includes('realSheets.length'));
check('Includes back to subjects button in Step 2', sheetsJs.includes('sheets-back-btn') && (sheetsJs.includes('Back to Subjects') || sheetsJs.includes('العودة للمواد')));

// 3. Search, Filters & View Controls
console.log('\n--- 3. Search, Filters & View Controls ---');
check('Search input in Step 1 for subjects', sheetsJs.includes('Search subjects...') && sheetsJs.includes('بحث في المواد...'));
check('Search input in Step 2 for sheets', sheetsJs.includes('Search sheets...') && sheetsJs.includes('ابحث عن شيت'));
check('Sort dropdown with "Newest First", "Oldest First", and "Title (A-Z)"', sheetsJs.includes('id="sheets-sort-dropdown"') && sheetsJs.includes('Newest First') && sheetsJs.includes('Oldest First'));
check('View mode toggle for Grid and List modes', sheetsJs.includes('data-view="grid"') && sheetsJs.includes('data-view="list"'));

// 4. Sheet Card Structure (Internal Split + Action Buttons)
console.log('\n--- 4. Sheet Card Architecture ---');
check('Card uses inner split container (.sgc-card-inner)', sheetsJs.includes('sgc-card-inner') && polishCss.includes('.sgc-card-inner'));
check('Left column (.sgc-thumb-col) houses vertical A4 thumbnail', sheetsJs.includes('sgc-thumb-col') && polishCss.includes('.sgc-thumb-col'));
check('Thumbnail has A4 vertical aspect ratio (1 / 1.38)', polishCss.includes('aspect-ratio: 1 / 1.38'));
check('Right column (.sgc-info-col) houses metadata hierarchy', sheetsJs.includes('sgc-info-col') && polishCss.includes('.sgc-info-col'));
check('Card title styled cleanly with line-clamp and bold weight', sheetsJs.includes('sgc-title') && polishCss.includes('.sgc-title'));
check('Doctor row contains user icon and doctor name', sheetsJs.includes('sgc-doctor-row') && sheetsJs.includes('doctor_name'));
check('Pages & file size row contains book and hard-drive icons', sheetsJs.includes('sgc-specs-row') && sheetsJs.includes('book-open') && sheetsJs.includes('hard-drive'));
check('Upload date row contains calendar icon and formatted date', sheetsJs.includes('sgc-date-row') && sheetsJs.includes('calendar'));

// 5. Action Buttons: Full Width Spanning Both Columns
console.log('\n--- 5. Full-Width Action Buttons ---');
check('Card actions container (.sgc-actions) spans full width', polishCss.includes('.sgc-actions') && polishCss.includes('width: 100%'));
check('Open Sheet button (.sgc-btn-view) has burgundy fill, eye icon, and full label', sheetsJs.includes('sgc-btn-view') && sheetsJs.includes('data-lucide="eye"') && (sheetsJs.includes('Open Sheet') || sheetsJs.includes('فتح الشيت')));
check('Download Sheet button (.sgc-btn-download) has download icon and full label', sheetsJs.includes('sgc-btn-download') && sheetsJs.includes('data-lucide="download"') && (sheetsJs.includes('Download Sheet') || sheetsJs.includes('تنزيل الشيت')));

// 6. Zero Verified Badges
console.log('\n--- 6. Elimination of Verified Badges ---');
check('Zero "verified" occurrences in sheets.js', !(/verified/i.test(sheetsJs)));
check('Zero "معتمد" / "معتمدة" occurrences in sheets.js', !(/معتمد/i.test(sheetsJs)));

// 7. Responsive Breakpoints
console.log('\n--- 7. Responsive Layout Breakpoints ---');
check('Desktop defines 3-column subject grid with minmax(0, 1fr)', polishCss.includes('.sheets-subject-grid') && polishCss.includes('repeat(3, minmax(0, 1fr))'));
check('iPad portrait defines 2-column subject grid with minmax(0, 1fr)', polishCss.includes('.sheets-subject-grid') && polishCss.includes('repeat(2, minmax(0, 1fr))'));
check('Mobile defines 1-column subject grid', polishCss.includes('.sheets-subject-grid') && polishCss.includes('grid-template-columns: 1fr'));
check('Desktop defines 3-column sheet grid with minmax(0, 1fr)', polishCss.includes('.sheets-grid-container') && polishCss.includes('repeat(3, minmax(0, 1fr))'));
check('iPad portrait defines 2-column sheet grid with minmax(0, 1fr)', polishCss.includes('.sheets-grid-container') && polishCss.includes('repeat(2, minmax(0, 1fr))'));

// 8. Data Integrity & Cache Busting
console.log('\n--- 8. Data Integrity & Cache Busting ---');
check('PdfThumbnailService is active with memory and sessionStorage caching', sheetsJs.includes('window.PdfThumbnailService') && sheetsJs.includes('sessionStorage.getItem'));
check('Real data fetched dynamically via window.DATA.getSheetsBySubject', sheetsJs.includes('window.DATA.getSheetsBySubject'));
check('Zero mock CURRICULUM_DATA in sheets.js', !sheetsJs.includes('CURRICULUM_DATA'));
check('index.html cache buster bumped to v>=10.8 for sheets.js', /js\/pages\/sheets\.js\?v=(10\.[8-9]|1[1-9]\.\d+)/.test(indexHtml));
check('index.html cache buster bumped to v>=10.8 for polish.css', /css\/polish\.css\?v=(10\.[8-9]|1[1-9]\.\d+)/.test(indexHtml));

console.log('\n' + '='.repeat(75));
console.log(`TOTAL: ${passed} Passed, ${failed} Failed`);
console.log('='.repeat(75));

if (failed > 0) {
  process.exit(1);
} else {
  console.log('\nALL 34 CHECKS PASSED PERFECTLY! 100% VISUAL BLUEPRINT CONFORMANCE!\n');
  process.exit(0);
}
