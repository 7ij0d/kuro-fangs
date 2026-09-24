const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('--- 1. Testing syntax of all JS files ---');
const jsFiles = [
  'js/i18n.js',
  'js/audio-fx.js',
  'js/character-theme.js',
  'js/store.js',
  'js/components/toast.js',
  'js/components/auth-modal.js',
  'js/supabase.js',
  'js/data.js',
  'js/data-clinical.js',
  'js/components/subject-modal.js',
  'js/components/sheet-edit-modal.js',
  'js/components/notifications-center.js',
  'js/components/sheet-copy-engine.js',
  'js/router.js',
  'js/pages/home.js',
  'js/pages/sheets.js',
  'js/pages/sheet-detail.js',
  'js/pages/recordings.js',
  'js/pages/exams.js',
  'js/pages/quizzes.js',
  'js/pages/questions.js',
  'js/pages/flashcards.js',
  'js/pages/previous-years.js',
  'js/pages/rewards.js',
  'js/pages/games.js',
  'js/git-sync.js',
  'js/pages/admin.js',
  'js/pages/profile.js',
  'js/pages/secondary.js',
  'js/app.js'
];

let hasSyntaxError = false;
for (const file of jsFiles) {
  const fullPath = path.resolve(__dirname, '..', file);
  try {
    execSync(`node -c "${fullPath}"`, { stdio: 'pipe' });
    console.log(`[PASS] ${file}`);
  } catch (err) {
    console.error(`[FAIL] Syntax error in ${file}:`, err.message);
    hasSyntaxError = true;
  }
}

if (hasSyntaxError) {
  process.exit(1);
}

console.log('All files passed syntax check!');
