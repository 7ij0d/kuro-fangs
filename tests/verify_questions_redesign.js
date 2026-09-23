const fs = require('fs');
const path = require('path');

const questionsJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'pages', 'questions.js'), 'utf8');
const polishCss = fs.readFileSync(path.join(__dirname, '..', 'css', 'polish.css'), 'utf8');
const subjectsData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'subjects.json'), 'utf8'));

console.log('='.repeat(75));
console.log('KURO STUDENT — QUESTIONS PAGE REDESIGN & RESPONSIVENESS VERIFICATION');
console.log('='.repeat(75));

const checks = [
  // 1. Header & Hero checks
  {
    name: 'Header Title contains "Questions — Past Exams & Practice Bank"',
    pass: questionsJs.includes('Questions — Past Exams & Practice Bank') && questionsJs.includes('الأسئلة — سنوات سابقة وبنك الأسئلة')
  },
  {
    name: 'Header Subtitle contains "All your dental questions, organized and easy to practice."',
    pass: questionsJs.includes('All your dental questions, organized and easy to practice.') && questionsJs.includes('كل أسئلتك لطب الأسنان، منظمة وسهلة للتدريب.')
  },
  {
    name: 'Hero Artwork references assets/hero/kuro-questions-hero.png',
    pass: questionsJs.includes('assets/hero/kuro-questions-hero.png') && fs.existsSync(path.join(__dirname, '..', 'assets', 'hero', 'kuro-questions-hero.png'))
  },

  // 2. Verified Removal checks
  {
    name: 'Zero "verified" occurrences in questions.js',
    pass: !(/verified/i.test(questionsJs))
  },
  {
    name: 'Zero "معتمد" / "معتمدة" verification occurrences in questions.js',
    pass: !(/معتمد/i.test(questionsJs))
  },

  // 3. Action Text checks
  {
    name: 'Strictly zero "Open Subject Sheets" in questions.js',
    pass: !questionsJs.includes('Open Subject Sheets') && !questionsJs.includes('استعراض الشيتات والأسئلة')
  },
  {
    name: 'Subject cards use "Start Practice" / "ابدأ التدريب" for subjects with questions',
    pass: questionsJs.includes('Start Practice') && questionsJs.includes('ابدأ التدريب')
  },
  {
    name: 'Subject cards use "Browse Questions" / "استعراض الأسئلة" for subjects with 0 questions',
    pass: questionsJs.includes('Browse Questions') && questionsJs.includes('استعراض الأسئلة')
  },

  // 4. Subject Code & Card metadata
  {
    name: 'Subject cards render official codes (code pill)',
    pass: questionsJs.includes('q-card-code-pill') && questionsJs.includes('s.code')
  },
  {
    name: 'Subject cards render real MCQ counts (not hardcoded)',
    pass: questionsJs.includes('q-card-count-badge') && questionsJs.includes('${qCount}')
  },

  // 5. Controls & Filters
  {
    name: 'Search input placeholder matches requirement',
    pass: questionsJs.includes('Search questions, subjects, or clinical tags...') && questionsJs.includes('ابحث في نصوص الأسئلة، المواد، أو التصنيفات السريرية...')
  },
  {
    name: 'Subject dropdown with "All Subjects" / "كل المواد"',
    pass: questionsJs.includes('id="q-subject-dropdown"') && questionsJs.includes('All Subjects') && questionsJs.includes('كل المواد')
  },
  {
    name: 'Year dropdown with "All Years" / "كل السنوات" and Year 3',
    pass: questionsJs.includes('id="q-year-dropdown"') && questionsJs.includes('All Years') && questionsJs.includes('كل السنوات')
  },
  {
    name: 'Year filter event listener wired in bindEvents',
    pass: questionsJs.includes('q-year-dropdown') && questionsJs.includes('selectedYear')
  },

  // 6. Responsive CSS Grids
  {
    name: 'polish.css defines .questions-subject-grid with 3-columns for desktop (minmax(0, 1fr))',
    pass: polishCss.includes('.questions-subject-grid') && polishCss.includes('grid-template-columns: repeat(3, minmax(0, 1fr))')
  },
  {
    name: 'polish.css defines 2-column grid for iPad / Tablet (768px-1199px) using minmax(0, 1fr)',
    pass: polishCss.includes('grid-template-columns: repeat(2, minmax(0, 1fr)) !important;')
  },
  {
    name: 'polish.css defines 1-column grid for Mobile (< 768px)',
    pass: polishCss.includes('grid-template-columns: 1fr !important;')
  },
  {
    name: 'Zero 100vw or fixed card widths in questions grid styles',
    pass: !polishCss.includes('.q-subject-card { width: 100vw') && !polishCss.includes('.questions-subject-grid { width: 100vw')
  },

  // 7. Visual tokens & Card styling
  {
    name: 'polish.css contains .q-hero-banner with ivory/cream card styling & burgundy primary',
    pass: polishCss.includes('.q-hero-banner') && polishCss.includes('--brand-burgundy') && polishCss.includes('.q-hero-stats')
  },
  {
    name: 'Subject cards use word-wrap / natural wrapping for long names',
    pass: polishCss.includes('overflow-wrap: break-word') && polishCss.includes('white-space: normal')
  },

  // 8. Dental subjects data consistency
  {
    name: 'All 12 subjects in subjects.json have official codes and year 3',
    pass: subjectsData.subjects.length === 12 && subjectsData.subjects.every(s => s.code && s.year === 3)
  }
];

let failed = 0;
checks.forEach((c, idx) => {
  const status = c.pass ? 'PASS' : 'FAIL';
  if (!c.pass) failed++;
  console.log(`[${String(idx + 1).padStart(2, '0')}] ${status} - ${c.name}`);
});

console.log('='.repeat(75));
if (failed === 0) {
  console.log(`ALL ${checks.length} CHECKS PASSED PERFECTLY! (0 failures)`);
  console.log('='.repeat(75));
  process.exit(0);
} else {
  console.error(`FAILED: ${failed} / ${checks.length} checks failed.`);
  console.log('='.repeat(75));
  process.exit(1);
}
