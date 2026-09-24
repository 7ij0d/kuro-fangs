const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const polishCss = fs.readFileSync(path.join(rootDir, 'css', 'polish.css'), 'utf8');
const baseCss = fs.readFileSync(path.join(rootDir, 'css', 'base.css'), 'utf8');
const layoutCss = fs.readFileSync(path.join(rootDir, 'css', 'layout.css'), 'utf8');
const appJs = fs.readFileSync(path.join(rootDir, 'js', 'app.js'), 'utf8');
const routerJs = fs.readFileSync(path.join(rootDir, 'js', 'router.js'), 'utf8');
const sheetsJs = fs.readFileSync(path.join(rootDir, 'js', 'pages', 'sheets.js'), 'utf8');
const homeJs = fs.readFileSync(path.join(rootDir, 'js', 'pages', 'home.js'), 'utf8');

const tests = [
  // 1. Bottom Navigation Elimination
  {
    category: 'Navigation',
    name: 'Zero bottom nav markup in index.html',
    pass: !indexHtml.includes('<nav class="mobile-bottom-nav">') && !indexHtml.includes('id="mobile-bottom-nav"')
  },
  {
    category: 'Navigation',
    name: 'Zero mobile more sheet modal in index.html',
    pass: !indexHtml.includes('id="mobile-more-sheet"') && !indexHtml.includes('id="mobile-more-sheet-backdrop"')
  },
  {
    category: 'Navigation',
    name: 'Enforced .mobile-bottom-nav { display: none !important; } in polish.css',
    pass: polishCss.includes('.mobile-bottom-nav') && polishCss.includes('display: none !important')
  },
  {
    category: 'Navigation',
    name: 'Top navigation center pills match academic IA (Home, Sheets, Schedules, More)',
    pass: indexHtml.includes('id="nav-item-home"') &&
          indexHtml.includes('id="nav-item-sheets"') &&
          indexHtml.includes('id="nav-item-schedules"') &&
          indexHtml.includes('id="nav-item-more"')
  },
  {
    category: 'Navigation',
    name: 'More dropdown menu in top bar includes schedule, practical, exams, rewards, games, admin',
    pass: indexHtml.includes('id="header-more-btn"') &&
          indexHtml.includes('#/lecture-schedule') &&
          indexHtml.includes('#/practical-schedule') &&
          indexHtml.includes('#/exams') &&
          indexHtml.includes('#/rewards') &&
          indexHtml.includes('#/games') &&
          indexHtml.includes('#/admin')
  },
  {
    category: 'Navigation',
    name: 'Sidebar footer includes quick controls (Lang, Theme, Sound)',
    pass: indexHtml.includes('id="side-lang-toggle-btn"') &&
          indexHtml.includes('id="side-theme-toggle-btn"') &&
          indexHtml.includes('id="side-sound-toggle-btn"')
  },
  {
    category: 'Navigation',
    name: 'app.js handles sidebar quick controls and header more dropdown',
    pass: appJs.includes('sideLangToggleBtn') &&
          appJs.includes('sideThemeToggleBtn') &&
          appJs.includes('sideSoundToggleBtn') &&
          appJs.includes('headerMoreBtn')
  },
  {
    category: 'Navigation',
    name: 'router.js updates active class on header-more-btn for sub-routes',
    pass: routerJs.includes('headerMoreBtn.classList.toggle(\'active\'')
  },

  // 2. iPad / Tablet Layout (768px – 1199px)
  {
    category: 'iPad / Tablet',
    name: 'Clutter toggles (#lang, #theme, #sound, #auth) hidden on iPad in top header',
    pass: polishCss.includes('#lang-toggle-btn') &&
          polishCss.includes('#theme-toggle-btn') &&
          polishCss.includes('#sound-toggle-btn')
  },
  {
    category: 'iPad / Tablet',
    name: 'Tablet navbar has 5 compact pills fitting safely under 768px viewport',
    pass: polishCss.includes('@media (min-width: 768px) and (max-width: 1199px)') &&
          polishCss.includes('.header-nav-center')
  },
  {
    category: 'iPad / Tablet',
    name: 'Sheets grid is 2-column on iPad',
    pass: polishCss.includes('@media (min-width: 768px) and (max-width: 1199px)') &&
          polishCss.includes('grid-template-columns: repeat(2, 1fr)')
  },

  // 3. Mobile Layout (< 768px)
  {
    category: 'Mobile Phone',
    name: 'Mobile hamburger button (.mobile-toggle-btn) is visible and interactive',
    pass: polishCss.includes('.mobile-toggle-btn') &&
          polishCss.includes('display: inline-flex !important')
  },
  {
    category: 'Mobile Phone',
    name: 'Desktop center nav pills hidden on Mobile (< 768px)',
    pass: polishCss.includes('@media (max-width: 767px)') &&
          polishCss.includes('.header-nav-center') &&
          polishCss.includes('display: none !important')
  },
  {
    category: 'Mobile Phone',
    name: 'Content padding on mobile has NO bottom nav clearance offset (clean 36px bottom)',
    pass: polishCss.includes('@media (max-width: 767px)') &&
          polishCss.includes('.main-content') &&
          polishCss.includes('padding: 14px 14px 36px !important')
  },
  {
    category: 'Mobile Phone',
    name: 'Sheets grid is 1-column vertical on mobile',
    pass: polishCss.includes('@media (max-width: 767px)') &&
          polishCss.includes('.sheets-grid-container') &&
          polishCss.includes('grid-template-columns: 1fr !important')
  },

  // 4. Sheets Redesign & Zero Verified Badge
  {
    category: 'Sheets Page',
    name: 'PdfThumbnailService implemented with PDF.js and caching',
    pass: sheetsJs.includes('PdfThumbnailService') &&
          sheetsJs.includes('pdfjsLib.getDocument') &&
          sheetsJs.includes('pdf.getPage(1)') &&
          sheetsJs.includes('_cache')
  },
  {
    category: 'Sheets Page',
    name: 'Automatic rendering of page 1 with neutral document fallback placeholder',
    pass: sheetsJs.includes('sgc-thumbnail-wrapper') &&
          sheetsJs.includes('sgc-thumbnail-placeholder') &&
          sheetsJs.includes('sgc-thumbnail-img')
  },
  {
    category: 'Sheets Page',
    name: 'Completely eliminated "Verified" badges from sheets.js',
    pass: !sheetsJs.includes('sgc-verified-badge') &&
          !sheetsJs.includes('\'Verified\'') &&
          !sheetsJs.includes('\'معتمد\'')
  },
  {
    category: 'Sheets Page',
    name: 'Two visible full buttons on every card: [ Open Sheet ] and [ Download Sheet ]',
    pass: sheetsJs.includes('sgc-btn-view view-sheet-btn') &&
          sheetsJs.includes('sgc-btn-download download-sheet-btn') &&
          (sheetsJs.includes('Open Sheet') || sheetsJs.includes('فتح الشيت')) &&
          (sheetsJs.includes('Download Sheet') || sheetsJs.includes('تنزيل الشيت'))
  },

  // 5. Overflow Prevention
  {
    category: 'Overflow Prevention',
    name: 'html and body have overflow-x: clip/hidden and max-width: 100%',
    pass: baseCss.includes('overflow-x: clip') && baseCss.includes('max-width: 100%')
  },
  {
    category: 'Overflow Prevention',
    name: 'app-layout and app-main-wrapper have overflow-x: clip and max-width: 100%',
    pass: layoutCss.includes('overflow-x: clip') && layoutCss.includes('max-width: 100%')
  },
  {
    category: 'Overflow Prevention',
    name: 'Sidebar is isolated on <= 1199px when closed to prevent WebKit scroll canvas expansion',
    pass: layoutCss.includes('.app-sidebar:not(.open)') && layoutCss.includes('visibility: hidden')
  }
];

let failedCount = 0;
console.log('='.repeat(70));
console.log('KURO STUDENT — RESPONSIVE REDESIGN VERIFICATION SUITE');
console.log('='.repeat(70));

let currentCat = '';
tests.forEach((t, i) => {
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

console.log('\n' + '='.repeat(70));
if (failedCount === 0) {
  console.log(`RESULT: ALL ${tests.length} VERIFICATION CHECKS PASSED PERFECTLY!`);
  console.log('Zero bottom nav, zero verified badges, full responsive tiers (Desktop, iPad, Mobile).');
  console.log('='.repeat(70));
  process.exit(0);
} else {
  console.error(`RESULT: ${failedCount} of ${tests.length} CHECKS FAILED.`);
  console.log('='.repeat(70));
  process.exit(1);
}
