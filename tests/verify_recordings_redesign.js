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

console.log('=== VERIFYING AUDIO RECORDINGS LIBRARY MASTER REDESIGN ===\n');

// 1. Verify Assets
console.log('1. Checking required audio recordings artwork assets:');
const requiredAssets = [
  'assets/hero/audio-recordings-hero.png'
];
requiredAssets.forEach(assetPath => {
  const fullPath = path.join(rootDir, assetPath);
  const exists = fs.existsSync(fullPath);
  const size = exists ? fs.statSync(fullPath).size : 0;
  assert(exists && size > 50000, `Asset exists with valid size: ${assetPath} (${Math.round(size / 1024)} KB)`);
});

// 2. Verify index.html Script & Cache Busting
console.log('\n2. Checking index.html script tag & version:');
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
assert(indexHtml.includes('js/pages/recordings.js'), 'index.html includes js/pages/recordings.js script');
assert(/css\/polish\.css\?v=(9\.[7-9]|10\.\d+)/.test(indexHtml), 'Cache busting bumped to ?v>=9.7 for css');
assert(/js\/pages\/recordings\.js\?v=(9\.[7-9]|10\.\d+)/.test(indexHtml), 'Cache busting bumped to ?v>=9.7 for recordings.js');

// 3. Verify js/router.js & app.js
console.log('\n3. Checking js/router.js & js/app.js:');
const routerJs = fs.readFileSync(path.join(rootDir, 'js/router.js'), 'utf8');
assert(routerJs.includes("'/recordings'"), "router.js registers '/recordings' route in constructor");
assert(routerJs.includes('RecordingsPage'), "router.js invokes RecordingsPage.render");

const appJs = fs.readFileSync(path.join(rootDir, 'js/app.js'), 'utf8');
assert(appJs.includes("router.register('/recordings'"), "app.js registers '/recordings' route");
assert(appJs.includes('RecordingsPage'), "app.js references window.RecordingsPage");

// 4. Verify js/pages/recordings.js Architecture
console.log('\n4. Checking js/pages/recordings.js:');
const recordingsJs = fs.readFileSync(path.join(rootDir, 'js/pages/recordings.js'), 'utf8');
assert(recordingsJs.includes('window.RecordingsPage = RecordingsPage'), 'Exports window.RecordingsPage');
assert(recordingsJs.includes('assets/hero/audio-recordings-hero.png'), 'References audio-recordings-hero.png');
assert(recordingsJs.includes('Audio Recordings') || recordingsJs.includes('التسجيلات الصوتية'), 'Contains Audio Recordings title');
assert(recordingsJs.includes('Faculty lecture audio recordings') || recordingsJs.includes('تسجيلات صوتية لمحاضرات دكاترة الكلية'), 'Contains subtitle');

// Filter & Control Bar
assert(recordingsJs.includes('audio-subject-filter'), 'Includes subject filter dropdown');
assert(recordingsJs.includes('audio-search-input'), 'Includes full-text search input');
assert(recordingsJs.includes('audio-lecturer-filter'), 'Includes lecturer filter dropdown');
assert(recordingsJs.includes('audio-sort-filter'), 'Includes sort dropdown');
assert(recordingsJs.includes('audio-view-btn'), 'Includes view mode toggle');

// Section Header
assert(recordingsJs.includes('Lecture Audio Recordings') || recordingsJs.includes('تسجيلات المحاضرات الصوتية'), 'Includes Lecture Audio Recordings section title');
assert(recordingsJs.includes('audio-section-count-badge'), 'Includes total count badge');

// Card Structure
assert(recordingsJs.includes('audio-subject-pill'), 'Card contains subject pill');
assert(recordingsJs.includes('audio-order-pill'), 'Card contains order pill');
assert(recordingsJs.includes('audio-waveform-wrap') || recordingsJs.includes('generateWaveformSvg'), 'Card contains waveform visualization');
assert(recordingsJs.includes('audio-play-btn'), 'Card contains play button');
assert(recordingsJs.includes('audio-sheet-link'), 'Card links to associated sheet');
assert(recordingsJs.includes('audio-btn-listen'), 'Card contains Listen action button');
assert(recordingsJs.includes('audio-btn-sheet'), 'Card contains View Sheet action button');
assert(recordingsJs.includes('audio-card-unavailable'), 'Implements subtle unavailable card state');
assert(recordingsJs.includes('audio-btn-unavailable'), 'Implements Not Available disabled action');

// No Verified Badges
const verifiedMatches = recordingsJs.match(/verified|معتمد/gi);
assert(!verifiedMatches, 'Zero "verified" / "معتمد" badges in recordings.js');

// 5. Verify css/polish.css
console.log('\n5. Checking css/polish.css:');
const polishCss = fs.readFileSync(path.join(rootDir, 'css/polish.css'), 'utf8');
assert(polishCss.includes('.audio-hub-container'), 'Includes .audio-hub-container');
assert(polishCss.includes('.audio-hero-card'), 'Includes .audio-hero-card');
assert(polishCss.includes('.audio-controls-bar'), 'Includes .audio-controls-bar');
assert(polishCss.includes('.audio-recordings-grid'), 'Includes .audio-recordings-grid');
assert(polishCss.includes('.audio-card'), 'Includes .audio-card styling');
assert(polishCss.includes('.audio-play-btn'), 'Includes .audio-play-btn');
assert(polishCss.includes('.audio-btn-listen'), 'Includes .audio-btn-listen');
assert(polishCss.includes('.audio-btn-sheet'), 'Includes .audio-btn-sheet');
assert(polishCss.includes('.audio-card-unavailable'), 'Includes .audio-card-unavailable styling');
assert(polishCss.includes('@media (max-width: 1199px)'), 'Includes iPad responsive media query');
assert(polishCss.includes('@media (max-width: 767px)'), 'Includes Mobile responsive media query');

// 6. Summary
console.log('\n======================================================');
console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
console.log('======================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL AUDIO RECORDINGS TESTS PASSED SUCCESSFULLY! ✓');
}
