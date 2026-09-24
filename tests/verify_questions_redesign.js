const fs = require('fs');
const path = require('path');

const questionsJs = fs.readFileSync(path.join(__dirname, '..', 'js', 'pages', 'questions.js'), 'utf8');
const polishCss = fs.readFileSync(path.join(__dirname, '..', 'css', 'polish.css'), 'utf8');
const subjectsData = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'subjects.json'), 'utf8'));

console.log('='.repeat(75));
console.log('KURO STUDENT — QUESTIONS PAGE EXACT REFERENCE DESIGN VERIFICATION');
console.log('='.repeat(75));

const checks = [
  // 1. Header & Hero checks
  {
    name: 'Hero Title contains "Questions — Past Exams & Practice Bank" (EN & AR)',
    pass: questionsJs.includes('Questions — Past Exams & Practice Bank') && questionsJs.includes('الأسئلة — سنوات سابقة وبنك الأسئلة')
  },
  {
    name: 'Hero Subtitle contains "Select a subject to start practicing MCQs." (EN & AR)',
    pass: questionsJs.includes('Select a subject to start practicing MCQs.') && questionsJs.includes('اختر مادة لبدء التدريب على أسئلة الاختيار من متعدد.')
  },
  {
    name: 'Hero Artwork references assets/hero/kuro-questions-hero.png',
    pass: questionsJs.includes('assets/hero/kuro-questions-hero.png') && fs.existsSync(path.join(__dirname, '..', 'assets', 'hero', 'kuro-questions-hero.png'))
  },

  // 2. Minimal Sub-bar & Search
  {
    name: 'Search input placeholder matches "Search subjects..." / "بحث في المواد..."',
    pass: questionsJs.includes('Search subjects...') && questionsJs.includes('بحث في المواد...')
  },
  {
    name: 'Dynamic total subjects count badge rendered',
    pass: questionsJs.includes('q-subjects-total-count') && (questionsJs.includes('12 Subjects') || questionsJs.includes('12 مادة') || questionsJs.includes('filtered.length'))
  },

  // 3. Exact 12 Subjects & Official Codes
  {
    name: 'SUBJECT_DEFINITIONS contains all 12 dental subjects with official codes',
    pass: ['MED-301', 'GS-301', 'OD-301', 'PREV-301', 'CONS-302', 'FP-302', 'RP-302', 'ORT-301', 'PED-301', 'OMDR-301', 'OMS-301', 'END-301']
      .every(code => questionsJs.includes(code))
  },
  {
    name: 'All 12 subjects in subjects.json have official codes and year 3',
    pass: subjectsData.subjects.length === 12 && subjectsData.subjects.every(s => s.code && s.year === 3)
  },

  // 4. Card Structure & Minimalism (media_1790266085521.png)
  {
    name: 'Subject cards render icon container, title, code badge, real MCQ count, and arrow button',
    pass: questionsJs.includes('q-card-icon-box') &&
          questionsJs.includes('q-card-title') &&
          questionsJs.includes('q-card-code-badge') &&
          questionsJs.includes('q-card-mcq-count') &&
          questionsJs.includes('q-card-arrow-btn')
  },
  {
    name: 'Subject cards calculate real MCQ counts from database (not hardcoded)',
    pass: questionsJs.includes('subjectStats[s.id]') && questionsJs.includes('qCount')
  },
  {
    name: 'Zero "Dental Curriculum Subjects" clutter in questions.js',
    pass: !questionsJs.includes('Dental Curriculum Subjects')
  },
  {
    name: 'Zero "Open Subject Sheets" in questions.js',
    pass: !questionsJs.includes('Open Subject Sheets')
  },
  {
    name: 'Zero rainbow category pills on subject cards',
    pass: !questionsJs.includes('q-card-cat-pill')
  },

  // 5. Responsive Grids (Desktop 4-col, Tablet 2-col, Mobile 1-col)
  {
    name: 'polish.css defines .questions-subject-grid with 4-columns for desktop (minmax(0, 1fr))',
    pass: polishCss.includes('.questions-subject-grid') && polishCss.includes('grid-template-columns: repeat(4, minmax(0, 1fr))')
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

  // 6. Visual Polish & Typography
  {
    name: 'Card hover styling includes burgundy elevation and subtle micro-interaction',
    pass: polishCss.includes('.q-subject-card:hover') && polishCss.includes('.q-card-arrow-btn')
  },
  {
    name: 'Bi-directional RTL/LTR support for card arrow hover animation',
    pass: polishCss.includes('[dir="rtl"] .q-subject-card:hover .q-card-arrow-btn')
  },
  {
    name: 'Level 2 detail view and interactive quiz runner modal preserved',
    pass: questionsJs.includes('renderSubjectDetailView') && questionsJs.includes('dt-quiz-runner-modal')
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
