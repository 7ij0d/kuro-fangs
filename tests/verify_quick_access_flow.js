const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const subjectModalJs = fs.readFileSync(path.join(rootDir, 'js', 'components', 'subject-modal.js'), 'utf8');
const dataJs = fs.readFileSync(path.join(rootDir, 'js', 'data.js'), 'utf8');
const homeJs = fs.readFileSync(path.join(rootDir, 'js', 'pages', 'home.js'), 'utf8');
const polishCss = fs.readFileSync(path.join(rootDir, 'css', 'polish.css'), 'utf8');
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');

console.log('='.repeat(75));
console.log('KURO STUDENT — 4-STEP QUICK-ACCESS & SHEET-CENTERED ARCHITECTURE AUDIT');
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

// 1. Step 1: Subject Quick-Access Menu
console.log('\n--- 1. Step 1: Select Subject Quick-Access ---');
check('Defines window.SubjectModal controller', subjectModalJs.includes('window.SubjectModal = SubjectModal'));
check('Step 1 contains Sheets action', subjectModalJs.includes('id="sqm-action-sheets"'));
check('Step 1 contains Recordings action', subjectModalJs.includes('id="sqm-action-recordings"'));
check('Step 1 contains Questions action', subjectModalJs.includes('id="sqm-action-questions"'));
check('Step 1 contains Notes action', subjectModalJs.includes('id="sqm-action-notes"'));
check('Step 1 contains Other action', subjectModalJs.includes('id="sqm-action-other"'));
check('Zero "Best Papers" in subject-modal.js', !subjectModalJs.toLowerCase().includes('best papers'));
check('Zero Schedule option in Step 1 actions grid', !subjectModalJs.includes('sqm-action-schedule'));

// 2. Step 2: Select Sheets
console.log('\n--- 2. Step 2: Select Sheets (Real Database Only) ---');
check('Step 2 queries real database via getSheetsBySubject', subjectModalJs.includes('DATA.getSheetsBySubject'));
check('Step 2 includes live search input (#sqm-sheets-search)', subjectModalJs.includes('id="sqm-sheets-search"'));
check('Step 2 handles clean empty state when no sheets exist', subjectModalJs.includes('sqm-empty-state') && subjectModalJs.includes('No sheets available yet'));
check('Sheet rows display real title, page count, and file size', subjectModalJs.includes('sqm-sheet-title') && subjectModalJs.includes('sqm-sheet-specs'));

// 3. Step 3: Sheet Options
console.log('\n--- 3. Step 3: Sheet Options ---');
check('Step 3 contains Open Sheet option', subjectModalJs.includes('id="sqm-opt-open"') && subjectModalJs.includes('Open Sheet'));
check('Step 3 contains Download Sheet option', subjectModalJs.includes('id="sqm-opt-download"') && subjectModalJs.includes('Download Sheet'));
check('Step 3 contains Recordings option', subjectModalJs.includes('id="sqm-opt-recordings"') && subjectModalJs.includes('Lectures for this sheet'));
check('Step 3 contains Questions option', subjectModalJs.includes('id="sqm-opt-questions"') && subjectModalJs.includes('View question options'));
check('Step 3 contains Notes option', subjectModalJs.includes('id="sqm-opt-notes"') && subjectModalJs.includes('View notes for this sheet'));

// 4. Step 4: Question Options
console.log('\n--- 4. Step 4: Question Options ---');
check('Step 4 includes Questions (This Sheet)', subjectModalJs.includes('data-qtype="this-sheet"') && subjectModalJs.includes('Questions (This Sheet)'));
check('Step 4 includes Previous Years Questions (Arabic)', subjectModalJs.includes('data-qtype="past-ar"') && subjectModalJs.includes('Previous Years Questions (Arabic)'));
check('Step 4 includes Previous Years Questions (English)', subjectModalJs.includes('data-qtype="past-en"') && subjectModalJs.includes('Previous Years Questions (English)'));
check('Step 4 includes AI Generated Questions', subjectModalJs.includes('data-qtype="ai"') && subjectModalJs.includes('AI Generated Questions'));
check('Step 4 includes Other Questions', subjectModalJs.includes('data-qtype="other"') && subjectModalJs.includes('Other Questions'));
check('Step 4 includes Notes', subjectModalJs.includes('data-qtype="notes"') && subjectModalJs.includes('Notes'));

// 5. Step 3b & 3c: Sheet-Linked Recordings & Notes
console.log('\n--- 5. Sheet-Linked Recordings & Notes ---');
check('Step 3b queries recordings strictly by sheet_id via getRecordingsBySheet', subjectModalJs.includes('DATA.getRecordingsBySheet(sheet.id)'));
check('Step 3b includes clean empty state when no recordings exist', subjectModalJs.includes('No recordings available yet') && subjectModalJs.includes('mic-off'));
check('Step 3c provides study notes pad with save button', subjectModalJs.includes('sqm-notes-textarea') && subjectModalJs.includes('sqm-btn-save-notes'));

// 6. Data Service Layer: Sheets as Central Source
console.log('\n--- 6. Central Source of Truth (js/data.js) ---');
check('data.js getRecordingsBySheet filters out deleted sheets', dataJs.includes('getRecordingsBySheet') && dataJs.includes('getDeletedSheetIds'));
check('data.js getQuestionsBySheet filters out deleted sheets', dataJs.includes('getQuestionsBySheet') && dataJs.includes('getDeletedSheetIds'));
check('data.js provides getNotesBySheet and saveNotesForSheet', dataJs.includes('getNotesBySheet') && dataJs.includes('saveNotesForSheet'));

// 7. Home Page: Your Subjects Section
console.log('\n--- 7. Home Page Subjects Grid (js/pages/home.js) ---');
check('HomePage defines getSubjectIconHtml', homeJs.includes('getSubjectIconHtml'));
check('HomePage builds horizontal cards with icon wrap and info col', homeJs.includes('ksc-icon-wrap') && homeJs.includes('ksc-info-col'));
check('HomePage cards click opens SubjectModal', homeJs.includes('handleSubjectClick'));

// 8. Styles & Visual Polish (css/polish.css)
console.log('\n--- 8. CSS Polish & Visual Tokens ---');
check('polish.css defines .kuro-subjects-grid with 4 columns on desktop', polishCss.includes('grid-template-columns: repeat(4, minmax(0, 1fr))'));
check('polish.css defines .kuro-subject-card as horizontal row', polishCss.includes('.kuro-subject-card') && polishCss.includes('flex-direction: row'));
check('polish.css styles .sqm-modal-box with compact 460px width', polishCss.includes('.subject-modal-box.sqm-modal-box') && polishCss.includes('max-width: 460px'));
check('polish.css styles .sqm-actions-grid with 6-column layout and centered row 2', polishCss.includes('.sqm-actions-grid') && polishCss.includes('#sqm-action-notes'));
check('polish.css styles .sqm-sheet-row and .sqm-option-row', polishCss.includes('.sqm-sheet-row') && polishCss.includes('.sqm-option-row'));
check('polish.css provides dark mode overrides for sqm-modal-box', polishCss.includes('[data-theme="dark"] .subject-modal-box.sqm-modal-box'));

// 9. Cache Busters
console.log('\n--- 9. Cache Busting in index.html ---');
check('index.html loads polish.css with v=11.0', indexHtml.includes('css/polish.css?v=11.0'));
check('index.html loads data.js with v=11.0', indexHtml.includes('js/data.js?v=11.0'));
check('index.html loads subject-modal.js with v=11.0', indexHtml.includes('js/components/subject-modal.js?v=11.0'));
check('index.html loads home.js with v=11.0', indexHtml.includes('js/pages/home.js?v=11.0'));

console.log('\n' + '='.repeat(75));
console.log(`TOTAL CHECKS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log('='.repeat(75));

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL 4-STEP QUICK-ACCESS CHECKS PASSED PERFECTLY!\n');
}
