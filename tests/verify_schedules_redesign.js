const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log('=== VERIFYING ACADEMIC SCHEDULES RESTRUCTURING & REDESIGN ===\n');

// 1. Verify Assets
console.log('1. Checking required schedule artwork & banner assets:');
const requiredAssets = [
  'assets/hero/academic-schedules-hero.png',
  'assets/schedules/kuro-theory-lectures.png',
  'assets/schedules/kuro-clinical-lab.png',
  'assets/schedules/kuro-exams-board.png'
];
requiredAssets.forEach(assetPath => {
  const fullPath = path.join(rootDir, assetPath);
  const exists = fs.existsSync(fullPath);
  const size = exists ? fs.statSync(fullPath).size : 0;
  assert(exists && size > 50000, `Asset exists with valid size: ${assetPath} (${Math.round(size / 1024)} KB)`);
});

// 2. Verify index.html Navigation Structure
console.log('\n2. Checking index.html top nav and IA:');
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');

assert(indexHtml.includes('data-route="/schedules"'), 'Top nav contains Schedules route [data-route="/schedules"]');
assert(indexHtml.includes('id="nav-item-sheets"'), 'Top nav contains Sheets pill [id="nav-item-sheets"]');
assert(indexHtml.includes('id="nav-item-schedules"'), 'Top nav contains Schedules pill [id="nav-item-schedules"]');

// Ensure Exams is NOT a standalone top navigation pill
const navCenterMatch = indexHtml.match(/<nav class="header-nav-center"[^>]*>([\s\S]*?)<\/nav>/);
if (navCenterMatch) {
  const centerNavContent = navCenterMatch[1];
  const hasStandaloneExams = /<a [^>]*data-route="\/exams"[^>]*class="header-nav-pill"/.test(centerNavContent);
  assert(!hasStandaloneExams, 'Exams is NOT a standalone top nav pill (consolidated under Schedules)');
} else {
  assert(false, 'Could not find header-nav-center in index.html');
}

// Check cache busting version
assert(/css\/polish\.css\?v=(9\.[3-9]|10\.\d+)/.test(indexHtml), 'Cache busting bumped to ?v>=9.3 for css');
assert(/js\/router\.js\?v=(9\.[3-9]|10\.\d+)/.test(indexHtml), 'Cache busting bumped to ?v>=9.3 for js');

// 3. Verify js/router.js
console.log('\n3. Checking js/router.js:');
const routerJs = fs.readFileSync(path.join(rootDir, 'js/router.js'), 'utf8');
assert(routerJs.includes("'/schedules'"), "Router registers '/schedules' route");
assert(routerJs.includes('renderSchedulesHub'), "Router calls renderSchedulesHub on /schedules");
assert(routerJs.includes("target === '/schedules'"), "Router groups schedule subroutes under /schedules for active highlighting");

// 4. Verify js/pages/exams.js
console.log('\n4. Checking js/pages/exams.js:');
const examsJs = fs.readFileSync(path.join(rootDir, 'js/pages/exams.js'), 'utf8');
assert(examsJs.includes('renderSchedulesHub('), "exams.js exports renderSchedulesHub method");
assert(examsJs.includes('academic-schedules-hero.png'), "renderSchedulesHub renders panoramic top banner");
assert(examsJs.includes('kuro-theory-lectures.png'), "Card 1 renders kuro-theory-lectures.png");
assert(examsJs.includes('kuro-clinical-lab.png'), "Card 2 renders kuro-clinical-lab.png");
assert(examsJs.includes('kuro-exams-board.png'), "Card 3 renders kuro-exams-board.png");
assert(examsJs.includes('schedules-top-back-bar'), "Sub-schedule views render schedules-top-back-bar");
assert(examsJs.includes('Back to Academic Schedules') || examsJs.includes('الرجوع للجداول الدراسية'), "Back button text present in exams.js");

// Card metadata & Blueprint text assertions
assert(examsJs.includes('Auditorium 2'), "Card 1 contains Auditorium 2 metadata");
assert(examsJs.includes('Groups A1') || examsJs.includes('A1 – E2'), "Card 2 contains Groups A1 - E2 metadata");
assert(examsJs.includes('Midterm & Final') || examsJs.includes('النصفي والنهائي'), "Card 3 contains Midterm & Final metadata");
assert(examsJs.includes('Open Schedule') || examsJs.includes('فتح الجدول'), "Cards contain Open Schedule button");

// 5. Verify css/polish.css
console.log('\n5. Checking css/polish.css:');
const polishCss = fs.readFileSync(path.join(rootDir, 'css/polish.css'), 'utf8');
assert(polishCss.includes('.schedules-hub-hero'), "polish.css includes .schedules-hub-hero styling");
assert(polishCss.includes('.schedules-cards-grid'), "polish.css includes .schedules-cards-grid grid styling");
assert(polishCss.includes('.sched-card'), "polish.css includes .sched-card elevation styling");
assert(polishCss.includes('@media (max-width: 1199px)'), "polish.css includes iPad responsive rules");
assert(polishCss.includes('@media (max-width: 767px)'), "polish.css includes Mobile responsive rules");

// 6. Summary
console.log('\n======================================================');
console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
console.log('======================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL TESTS PASSED SUCCESSFULLY! ✓');
}
