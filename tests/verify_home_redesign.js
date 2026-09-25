/**
 * KURO STUDENT — HOME PAGE REDESIGN & SIMPLIFICATION VERIFICATION
 * Tests visual fidelity to media_1790337430864.png:
 * 1. Compact Hero with dynamic greeting
 * 2. Today & Tomorrow Split Schedule (Side-by-side cards with coffee cup empty state & Full Schedule button)
 * 3. Continue Studying (3 Cards: Last Opened Sheet, Last Listening, Continue Questions)
 * 4. Zero subjects section on Home page
 * 5. Real student study data tracking architecture
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const homeJs = fs.readFileSync(path.join(rootDir, 'js', 'pages', 'home.js'), 'utf8');
const polishCss = fs.readFileSync(path.join(rootDir, 'css', 'polish.css'), 'utf8');
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const sheetDetailJs = fs.readFileSync(path.join(rootDir, 'js', 'pages', 'sheet-detail.js'), 'utf8');
const recordingsJs = fs.readFileSync(path.join(rootDir, 'js', 'pages', 'recordings.js'), 'utf8');
const questionsJs = fs.readFileSync(path.join(rootDir, 'js', 'pages', 'questions.js'), 'utf8');

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
console.log('KURO STUDENT — HOME PAGE SIMPLIFICATION & ACTIVITY ENGINE AUDIT');
console.log('='.repeat(75));

// 1. Elimination of Your Subjects Section from Home Render
console.log('\n--- 1. Elimination of Your Subjects Section from Home Render ---');
// HomePage.render must NOT contain subjects section or grid
const renderFnBody = homeJs.slice(homeJs.indexOf('render(container)'), homeJs.indexOf('render(container)') + 600);
check('HomePage.render does NOT inject #subjects-container', !renderFnBody.includes('id="subjects-container"'));
check('HomePage.render does NOT call renderSubjectsSectionHeader', !renderFnBody.includes('renderSubjectsSectionHeader'));
check('HomePage.render does NOT call renderSubjectsList', !renderFnBody.includes('renderSubjectsList'));
check('HomePage keeps getSubjectIconHtml for component & test compatibility', homeJs.includes('getSubjectIconHtml'));
check('HomePage keeps buildCardsHTML for compatibility', homeJs.includes('buildCardsHTML'));

// 2. Compact Hero Section
console.log('\n--- 2. Compact Hero & Greeting ---');
check('Hero renders dynamic greeting overlay', homeJs.includes('kuro-hero-greeting-overlay'));
check('Hero computes dynamic morning/afternoon/evening greeting', homeJs.includes('Good Morning') && homeJs.includes('Good Afternoon'));
check('Hero renders date chip pill', homeJs.includes('kuro-hero-date-chip'));

// 3. Today & Tomorrow Schedule (Split 2-Column Cards)
console.log('\n--- 3. Today & Tomorrow Split Schedule (Side-by-Side) ---');
check('HomePage defines renderDailyLecturesSection', homeJs.includes('renderDailyLecturesSection'));
check('Schedule uses split grid container .kuro-schedule-split-grid', homeJs.includes('kuro-schedule-split-grid'));
check('Today card defined (#kuro-card-today)', homeJs.includes('id="kuro-card-today"'));
check('Tomorrow card defined (#kuro-card-tomorrow)', homeJs.includes('id="kuro-card-tomorrow"'));
check('Includes coffee cup empty state for days without lectures', homeJs.includes('kuro-empty-day-state') && homeJs.includes('☕'));
check('Includes "No classes today" and "Take this time to study or catch up!"', homeJs.includes('No classes today') && homeJs.includes('Take this time to study or catch up!'));
check('Includes red vertical accent bar on lecture rows (.ksrc-accent-bar)', homeJs.includes('ksrc-accent-bar'));
check('Lecture row renders time, location, and subject', homeJs.includes('ksrc-time') && homeJs.includes('ksrc-location') && homeJs.includes('ksrc-subject'));
check('Includes View Full Schedule button linking to #/schedules', homeJs.includes('kuro-view-full-schedule-btn') && homeJs.includes('#/schedules'));

// 4. Continue Studying Section (3 Core Cards)
console.log('\n--- 4. Continue Studying Section (3 Activity Cards) ---');
check('HomePage defines renderContinueStudyingSection', homeJs.includes('renderContinueStudyingSection'));
check('Section title contains "Continue Studying" / "متابعة الدراسة"', homeJs.includes('Continue Studying') && homeJs.includes('متابعة الدراسة'));
check('Grid container .kuro-continue-studying-grid defined', homeJs.includes('kuro-continue-studying-grid'));
check('Card A: Last Opened Sheet (#continue-card-sheet)', homeJs.includes('id="continue-card-sheet"'));
check('Card A has Last Opened Sheet badge', homeJs.includes('Last Opened Sheet') && homeJs.includes('آخر شيت تم فتحه'));
check('Card B: Last Listening (#continue-card-recording)', homeJs.includes('id="continue-card-recording"'));
check('Card B has Last Listening badge', homeJs.includes('Last Listening') && homeJs.includes('آخر تسجيل صوتي'));
check('Card C: Continue Questions (#continue-card-questions)', homeJs.includes('id="continue-card-questions"'));
check('Card C has Continue Questions badge', homeJs.includes('Continue Questions') && homeJs.includes('متابعة الأسئلة'));
check('Card C contains progress bar track and fill', homeJs.includes('continue-progress-track') && homeJs.includes('continue-progress-fill'));
check('Buttons link to real routes (#/sheet-detail, #/recordings, #/questions)', homeJs.includes('#/sheet-detail') && homeJs.includes('#/recordings') && homeJs.includes('#/questions'));

// 5. Real Student Study Data Architecture (Zero Mock Data)
console.log('\n--- 5. Real Student Study Data Architecture ---');
check('HomePage implements getLastOpenedSheet() querying localStorage', homeJs.includes('getLastOpenedSheet') && homeJs.includes('kf_last_opened_sheet'));
check('HomePage implements getLastListenedAudio() querying localStorage', homeJs.includes('getLastListenedAudio') && homeJs.includes('kf_last_listened_audio'));
check('HomePage implements getActiveQuestionSession() querying localStorage', homeJs.includes('getActiveQuestionSession') && homeJs.includes('kf_active_question_session'));
check('HomePage implements formatRelativeTime() with Today, Yesterday, Days ago', homeJs.includes('formatRelativeTime') && homeJs.includes('Yesterday'));
check('sheet-detail.js tracks kf_last_opened_sheet', sheetDetailJs.includes('kf_last_opened_sheet'));
check('recordings.js tracks kf_last_listened_audio', recordingsJs.includes('kf_last_listened_audio'));
check('questions.js tracks kf_active_question_session', questionsJs.includes('kf_active_question_session'));

// 6. CSS Polish & Visual Tokens
console.log('\n--- 6. CSS Polish & Visual Tokens ---');
check('polish.css defines .kuro-schedule-split-grid with 2 columns', polishCss.includes('.kuro-schedule-split-grid') && polishCss.includes('grid-template-columns: repeat(2, minmax(0, 1fr))'));
check('polish.css defines .kuro-split-card styling', polishCss.includes('.kuro-split-card'));
check('polish.css defines .kuro-view-full-schedule-btn with burgundy background', polishCss.includes('.kuro-view-full-schedule-btn') && polishCss.includes('background: #7E1D2A'));
check('polish.css defines .ksrc-accent-bar with left edge placement', polishCss.includes('.ksrc-accent-bar') && polishCss.includes('inset-inline-start: 0'));
check('polish.css defines .kuro-continue-studying-grid with 3 columns', polishCss.includes('.kuro-continue-studying-grid') && polishCss.includes('grid-template-columns: repeat(3, minmax(0, 1fr))'));
check('polish.css defines .continue-study-card with elevation', polishCss.includes('.continue-study-card'));
check('polish.css defines .continue-tag-badge colors for sheet, recording, questions', polishCss.includes('.continue-tag-badge.recording') && polishCss.includes('.continue-tag-badge.questions'));
check('polish.css defines mobile stack rules (max-width: 767px)', polishCss.includes('@media (max-width: 767px)') && polishCss.includes('.kuro-schedule-split-grid') && polishCss.includes('.kuro-continue-studying-grid'));
check('polish.css provides dark mode overrides for split cards and continue cards', polishCss.includes('[data-theme="dark"] .kuro-split-card') && polishCss.includes('[data-theme="dark"] .continue-study-card'));

// 7. Cache Busting in index.html
console.log('\n--- 7. Cache Busting in index.html ---');
check('index.html loads polish.css with v>=11.4', /css\/polish\.css\?v=(11\.[4-9]|1[2-9]\.)/.test(indexHtml));
check('index.html loads home.js with v>=11.4', /js\/pages\/home\.js\?v=(11\.[4-9]|1[2-9]\.)/.test(indexHtml));
check('index.html loads sheet-detail.js with v>=11.4', /js\/pages\/sheet-detail\.js\?v=(11\.[4-9]|1[2-9]\.)/.test(indexHtml));
check('index.html loads recordings.js with v>=11.4', /js\/pages\/recordings\.js\?v=(11\.[4-9]|1[2-9]\.)/.test(indexHtml));
check('index.html loads questions.js with v>=11.4', /js\/pages\/questions\.js\?v=(11\.[4-9]|1[2-9]\.)/.test(indexHtml));

console.log('\n' + '='.repeat(75));
console.log(`TOTAL CHECKS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log('='.repeat(75));

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL HOME PAGE REDESIGN CHECKS PASSED PERFECTLY!\n');
}
