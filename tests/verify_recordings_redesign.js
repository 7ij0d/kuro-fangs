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

console.log('=== VERIFYING AUDIO RECORDINGS 3-LEVEL ARCHITECTURE MASTER REDESIGN ===\n');

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

// 4. Verify js/pages/recordings.js Architecture (3-Level Curriculum Hierarchy)
console.log('\n4. Checking js/pages/recordings.js (Level 1 -> Level 2 -> Level 3):');
const recordingsJs = fs.readFileSync(path.join(rootDir, 'js/pages/recordings.js'), 'utf8');
assert(recordingsJs.includes('window.RecordingsPage = RecordingsPage'), 'Exports window.RecordingsPage');
assert(recordingsJs.includes('assets/hero/audio-recordings-hero.png'), 'References audio-recordings-hero.png');

// Level 1: Subject Selection (12 Dental Subjects)
assert(recordingsJs.includes('renderLevel1Subjects'), 'Implements renderLevel1Subjects for Level 1');
assert(recordingsJs.includes('SUBJECT_DEFINITIONS'), 'Defines 12 official dental curriculum subjects');
assert(recordingsJs.includes('audio-subject-grid') || recordingsJs.includes('audio-subject-card'), 'Contains audio subject grid & card');
assert(recordingsJs.includes('audio-search-input'), 'Includes search input for subjects');
assert(recordingsJs.includes('audio-view-btn'), 'Includes view mode toggle');
assert(recordingsJs.includes('audio-subjects-count-badge'), 'Includes subjects count badge');

// Level 2: Sheets of Selected Subject
assert(recordingsJs.includes('renderLevel2Sheets'), 'Implements renderLevel2Sheets for Level 2');
assert(recordingsJs.includes('audio-back-to-subjects'), 'Includes Back to Subjects button');
assert(recordingsJs.includes('audio-sheet-card'), 'Contains audio sheet card component');
assert(recordingsJs.includes('audio-sheets-grid'), 'Includes sheets grid container');

// Level 3: Audio Recordings of Selected Sheet
assert(recordingsJs.includes('renderLevel3Recordings'), 'Implements renderLevel3Recordings for Level 3');
assert(recordingsJs.includes('audio-back-to-sheets'), 'Includes Back to Sheets button');
assert(recordingsJs.includes('audio-recording-card'), 'Contains audio recording card component');
assert(recordingsJs.includes('audio-play-circle-btn'), 'Contains circular terracotta play button');
assert(recordingsJs.includes('audio-rec-waveform-container') || recordingsJs.includes('generateWaveformSvg'), 'Contains waveform container & SVG generator');
assert(recordingsJs.includes('audio-btn-view-sheet'), 'Contains View Sheet action button');
assert(recordingsJs.includes('audio-btn-more-options'), 'Contains More Options action button');

// Zero "verified" / "معتمد" badges
const verifiedMatches = recordingsJs.match(/verified|معتمد/gi);
assert(!verifiedMatches, 'Zero "verified" / "معتمد" badges in recordings.js');

// 5. Verify css/polish.css
console.log('\n5. Checking css/polish.css (Warm Terracotta & Responsive Breakpoints):');
const polishCss = fs.readFileSync(path.join(rootDir, 'css/polish.css'), 'utf8');
assert(polishCss.includes('.audio-hub-container'), 'Includes .audio-hub-container');
assert(polishCss.includes('.audio-hero-card'), 'Includes .audio-hero-card');
assert(polishCss.includes('--audio-primary: #BC4A47') || polishCss.includes('#BC4A47'), 'Contains warm terracotta primary color token (#BC4A47)');
assert(polishCss.includes('.audio-subject-grid'), 'Includes .audio-subject-grid');
assert(polishCss.includes('.audio-subject-card'), 'Includes .audio-subject-card');
assert(polishCss.includes('.audio-sheet-card'), 'Includes .audio-sheet-card');
assert(polishCss.includes('.audio-recording-card'), 'Includes .audio-recording-card');
assert(polishCss.includes('.audio-play-circle-btn'), 'Includes .audio-play-circle-btn');
assert(polishCss.includes('.audio-btn-view-sheet'), 'Includes .audio-btn-view-sheet');
assert(polishCss.includes('.audio-back-btn'), 'Includes .audio-back-btn');

// Responsive Breakpoints
assert(polishCss.includes('@media (min-width: 900px) and (max-width: 1199px)'), 'Includes dedicated iPad Landscape query (3 columns)');
assert(polishCss.includes('@media (min-width: 600px) and (max-width: 899px)'), 'Includes dedicated iPad Portrait query (2 columns)');
assert(polishCss.includes('@media (max-width: 599px)'), 'Includes dedicated Mobile query (1 column)');

// 6. Summary
console.log('\n======================================================');
console.log(`TEST SUMMARY: ${passed} Passed, ${failed} Failed`);
console.log('======================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL AUDIO RECORDINGS 3-LEVEL TESTS PASSED SUCCESSFULLY! ✓');
}
