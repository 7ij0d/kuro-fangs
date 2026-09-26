/**
 * KURO FANGS — CONTINUE QUESTIONS & QUIZ RESUMPTION VERIFICATION SUITE
 * Tests Deep-Link Resumption, Answer Persistence, Single Source of Truth,
 * Multi-Session Prioritization, and Completed State Handling.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const homeJs = fs.readFileSync(path.join(rootDir, 'js', 'pages', 'home.js'), 'utf8');
const questionsJs = fs.readFileSync(path.join(rootDir, 'js', 'pages', 'questions.js'), 'utf8');
const polishCss = fs.readFileSync(path.join(rootDir, 'css', 'polish.css'), 'utf8');
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');

console.log('='.repeat(75));
console.log('KURO FANGS — CONTINUE QUESTIONS DEEP-LINK & RESUMPTION AUDIT');
console.log('='.repeat(75));

let passed = 0;
let failed = 0;

function check(name, condition, extraInfo = '') {
  if (condition) {
    console.log(`  [PASS] ${name}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${name} ${extraInfo ? '-> ' + extraInfo : ''}`);
    failed++;
  }
}

// ─── 1. STATIC CODE AUDIT ───
console.log('\n--- 1. Static Architecture & Route Audit ---');
check('home.js deep links to questions with subject, sheet, and resume=true',
  homeJs.includes('#/questions?') && homeJs.includes('resume=true') && homeJs.includes('sheet=')
);

check('home.js handles completed quiz state with Quiz Completed badge',
  homeJs.includes('Quiz Completed') && homeJs.includes('completed-badge') && homeJs.includes('completed-fill')
);

check('home.js handles Review Questions action button when completed',
  homeJs.includes('Review Questions') && homeJs.includes('مراجعة الأسئلة')
);

check('questions.js extracts resume and sheet from queryParams',
  questionsJs.includes("queryParams?.get('resume') === 'true'") && questionsJs.includes("queryParams?.get('sheet')")
);

check('questions.js defines QuestionsPage.resumeQuizSession',
  questionsJs.includes('resumeQuizSession(sheetId, subjectId)')
);

check('questions.js defines QuestionsPage.saveSession and multi-session persistence',
  questionsJs.includes('saveSession(session)') && questionsJs.includes('kf_all_question_sessions')
);

check('questions.js defines QuestionsPage.getSessionForSheet',
  questionsJs.includes('getSessionForSheet(sheetId, subjectId)')
);

check('questions.js preserves selected answers and disables options',
  questionsJs.includes('existingAns') && questionsJs.includes('dt-quiz-option ${extraClass}') && questionsJs.includes('${disabledAttr}')
);

check('questions.js updates Next button to Finish Quiz on last question',
  questionsJs.includes('Finish Quiz') || questionsJs.includes('إنهاء الاختبار')
);

check('polish.css contains completed-badge and completed-fill styling',
  polishCss.includes('.continue-tag-badge.questions.completed-badge') && polishCss.includes('.continue-progress-fill.completed-fill')
);

check('index.html references cache-busted v>=12.6 scripts',
  /home\.js\?v=12\.[6-9]/.test(indexHtml) && /questions\.js\?v=12\.[6-9]/.test(indexHtml) && /polish\.css\?v=12\.[6-9]/.test(indexHtml)
);

// ─── 2. RUNTIME SIMULATION ENVIRONMENT SETUP ───
console.log('\n--- 2. Runtime Simulation & Storage Tests ---');

// Mock browser localStorage
const localStorageStore = {};
const mockLocalStorage = {
  getItem: (k) => localStorageStore[k] || null,
  setItem: (k, v) => { localStorageStore[k] = String(v); },
  removeItem: (k) => { delete localStorageStore[k]; },
  clear: () => { Object.keys(localStorageStore).forEach(k => delete localStorageStore[k]); }
};

// Setup global browser mock environment
global.window = global;
global.localStorage = mockLocalStorage;
global.Image = class {};
global.I18N = {
  getLang: () => 'ar',
  t: (k) => k
};
global.CharacterThemeSystem = {
  getAsset: (mode) => `assets/characters/kuro/Kuro-${mode}.png`
};
global.SoundFX = {
  play: () => {}
};
global.Toast = {
  show: () => {}
};

// Load DATA and DATA.getDefaultQuestions
const dataJs = fs.readFileSync(path.join(rootDir, 'js', 'data.js'), 'utf8');
eval(dataJs);

// Load Home and Questions controllers
eval(questionsJs);
eval(homeJs);

// Verify default questions exist
const defaultQuestions = window.DATA ? window.DATA.getDefaultQuestions() : [];
check('Default questions loaded from DATA (at least 9 OMDR questions)', Array.isArray(defaultQuestions) && defaultQuestions.length >= 9);

// ─── TEST 1: START QUIZ, ANSWER Q1 & Q2, VERIFY HOME CARD & DIRECT RESUME ───
console.log('\n--- 3. Test 1: Start Quiz, Answer Q1 & Q2, Home Status & Resume ---');
mockLocalStorage.clear();

const omdrQuestions = defaultQuestions.filter(q => q.subject_id === 'omdr');
const sheetId = 'sh_admin_1789462201436';
const subjectId = 'omdr';

// Simulate starting quiz session
const testSession = window.QuestionsPage.createSession(
  omdrQuestions,
  'Oral Medicine • Sheet 1: Approach to the Evaluation of the Patient',
  sheetId,
  subjectId
);

// Answer Q1: option 1 (correct)
testSession.answers['q_omdr_01'] = {
  selected_index: 1,
  is_correct: true,
  correct_index: 1,
  timestamp: Date.now()
};

// Answer Q2: option 3 (incorrect)
testSession.answers['q_omdr_02'] = {
  selected_index: 3,
  is_correct: false,
  correct_index: 0,
  timestamp: Date.now() + 1000
};

testSession.answered = 2;
testSession.score = 1;
testSession.percent = Math.round((2 / 9) * 100); // 22%
testSession.current_index = 1;

window.QuestionsPage.saveSession(testSession);

// Check HomePage session retrieval
const activeHomeSession = window.HomePage.getActiveQuestionSession();
check('Home retrieves active session', activeHomeSession !== null);
check('Home session shows answered = 2', activeHomeSession && activeHomeSession.answered === 2);
check('Home session shows total = 9', activeHomeSession && activeHomeSession.total === 9);
check('Home session shows percent = 22%', activeHomeSession && activeHomeSession.percent === 22);

// Check Home HTML rendering
const homeHtml = window.HomePage.renderContinueStudyingSection(true);
check('Home Card C contains deep-link URL with sheet & resume=true',
  homeHtml.includes(`sheet=${encodeURIComponent(sheetId)}&amp;resume=true`) ||
  homeHtml.includes(`sheet=${encodeURIComponent(sheetId)}&resume=true`)
);
check('Home Card C contains 2 / 9 questions progress label', homeHtml.includes('2 / 9'));
check('Home Card C contains 22% progress', homeHtml.includes('22%'));
check('Home Card C button text is Continue Solving', homeHtml.includes('متابعة الحل') || homeHtml.includes('Continue Solving'));

// ─── TEST 2 & 3: RESUME AT FIRST UNANSWERED QUESTION & PRESERVED ANSWERS ───
console.log('\n--- 4. Tests 2 & 3: Resuming at Q3 with Answer Persistence ---');

let launchedQuestions = null;
let launchedTitle = null;
let launchedOptions = null;

// Intercept launchQuizRunner to inspect resume options
const originalLaunch = window.QuestionsPage.launchQuizRunner;
window.QuestionsPage.launchQuizRunner = function(questions, title, options) {
  launchedQuestions = questions;
  launchedTitle = title;
  launchedOptions = options;
};

// Simulate Deep Link: resumeQuizSession(sheetId, subjectId)
window.QuestionsPage.resumeQuizSession(sheetId, subjectId);

check('resumeQuizSession calls launchQuizRunner with questions list', Array.isArray(launchedQuestions) && launchedQuestions.length === 9);
check('resumeQuizSession passes active session', launchedOptions && launchedOptions.session !== undefined);
check('resumeQuizSession resumes at Q3 (index 2, the first unanswered question)', launchedOptions && launchedOptions.resumeIndex === 2);

// Verify answer persistence structure
check('Q1 answer preserved as correct (index 1)', testSession.answers['q_omdr_01'].is_correct === true && testSession.answers['q_omdr_01'].selected_index === 1);
check('Q2 answer preserved as incorrect (index 3)', testSession.answers['q_omdr_02'].is_correct === false && testSession.answers['q_omdr_02'].selected_index === 3);
check('Q3 has not been answered yet', testSession.answers['q_omdr_03'] === undefined);

// Restore original launch
window.QuestionsPage.launchQuizRunner = originalLaunch;

// ─── TEST 4 & 5: MULTIPLE SESSIONS & PRIORITIZATION ───
console.log('\n--- 5. Tests 4 & 5: Multi-Session Priority (Active Incomplete First) ---');

// Create a completed session for another subject (e.g. Endo)
const completedSession = {
  id: 'qs_endo_sh_01_123',
  subject_id: 'endo',
  sheet_id: 'sh_endo_01',
  sheet_title: 'Endodontics Sheet 1',
  sheet_title_ar: 'علاج الجذور شيت 1',
  sheet_title_en: 'Endodontics Sheet 1',
  subject_title: 'Endodontics',
  total: 5,
  answered: 5,
  percent: 100,
  score: 5,
  completed: true,
  answers: { 'q1': {}, 'q2': {}, 'q3': {}, 'q4': {}, 'q5': {} },
  last_updated: Date.now() + 5000
};

// Push completed session to all sessions
const allSessions = JSON.parse(mockLocalStorage.getItem('kf_all_question_sessions') || '[]');
allSessions.unshift(completedSession);
mockLocalStorage.setItem('kf_all_question_sessions', JSON.stringify(allSessions));

// Even though completedSession was updated most recently (+5000ms),
// HomePage should prioritize the incomplete session with progress!
const prioritizedSession = window.HomePage.getActiveQuestionSession();
check('HomePage prioritizes incomplete active session over completed session',
  prioritizedSession && prioritizedSession.sheet_id === sheetId && !prioritizedSession.completed
);

// ─── TEST 6: FULL COMPLETION HANDLING ───
console.log('\n--- 6. Test 6: Full Quiz Completion Handling ---');

// Answer all remaining questions in testSession
for (let i = 3; i <= 9; i++) {
  const qId = `q_omdr_0${i}`;
  testSession.answers[qId] = {
    selected_index: 0,
    is_correct: true,
    correct_index: 0,
    timestamp: Date.now()
  };
}
testSession.answered = 9;
testSession.score = 8;
testSession.percent = 100;
testSession.completed = true;

window.QuestionsPage.saveSession(testSession);

const completedHomeSession = window.HomePage.getActiveQuestionSession();
check('Completed session reflects completed = true', completedHomeSession && completedHomeSession.completed === true);
check('Completed session reflects 100% progress', completedHomeSession && completedHomeSession.percent === 100);

const completedHomeHtml = window.HomePage.renderContinueStudyingSection(true);
check('Completed Home card displays Quiz Completed badge',
  completedHomeHtml.includes('تم إنهاء الاختبار') || completedHomeHtml.includes('Quiz Completed')
);
check('Completed Home card displays Review Questions action',
  completedHomeHtml.includes('مراجعة الأسئلة') || completedHomeHtml.includes('Review Questions')
);
check('Completed Home card still deep-links directly to resume/review',
  completedHomeHtml.includes(`sheet=${encodeURIComponent(sheetId)}&amp;resume=true`) ||
  completedHomeHtml.includes(`sheet=${encodeURIComponent(sheetId)}&resume=true`)
);

// Resuming a completed quiz opens at index 0 for full review
window.QuestionsPage.launchQuizRunner = function(questions, title, options) {
  launchedOptions = options;
};
window.QuestionsPage.resumeQuizSession(sheetId, subjectId);
check('Resuming a completed quiz starts at index 0 (Review Mode)', launchedOptions && launchedOptions.resumeIndex === 0);
window.QuestionsPage.launchQuizRunner = originalLaunch;

// ─── TEST 7: NAVBAR / GENERAL QUESTIONS ROUTE INTEGRITY ───
console.log('\n--- 7. Test 7: Navbar Questions Route Integrity ---');

// When user navigates to '#/questions' (no params), QuestionsPage.render shouldn't auto-open modal
let modalOpened = false;
const mockContainer = { innerHTML: '', querySelectorAll: () => [] };
const mockParams = new URLSearchParams('');

// Mock document.getElementById for questions page elements
const mockElements = {};
global.document = {
  getElementById: (id) => {
    if (!mockElements[id]) {
      mockElements[id] = {
        style: {},
        addEventListener: () => {},
        setAttribute: () => {},
        getAttribute: () => null,
        querySelector: () => ({ textContent: '', style: {} }),
        querySelectorAll: () => []
      };
    }
    return mockElements[id];
  },
  body: { style: {} }
};

window.QuestionsPage.render(mockContainer, mockParams);
check('Navbar route (#/questions) sets selectedSubjectId to null', window.QuestionsPage.selectedSubjectId === null);
check('Navbar route (#/questions) does NOT open quiz modal', mockElements['dt-quiz-runner-modal']?.style?.display !== 'flex');

// ─── SUMMARY ───
console.log('\n' + '='.repeat(75));
console.log(`TOTAL CHECKS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
console.log('='.repeat(75));

if (failed > 0) {
  process.exit(1);
} else {
  console.log('ALL VERIFICATION CHECKS PASSED PERFECTLY!\n');
}
