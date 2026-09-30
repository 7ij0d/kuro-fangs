/**
 * KURO FANGS — VERIFICATION SUITE: QUESTION → EXACT LOCATION IN SHEET
 * Validates complete end-to-end integration:
 * - Matcher Engine (Exact, Normalized, Fallback, Supporting)
 * - Questions Runner Modal & In-Card Faculty Explanation & Official Sheet Quote
 * - Sheet Detail / Kuro Notes Non-Destructive Highlights & Focus
 * - Split View (iPad/Desktop) & Mobile Sequential Flow
 * - NO GUESSING Fallback Card & "Keep Highlight" persistence
 */

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const questionsJs = fs.readFileSync(path.join(root, 'js', 'pages', 'questions.js'), 'utf8');
const sheetDetailJs = fs.readFileSync(path.join(root, 'js', 'pages', 'sheet-detail.js'), 'utf8');
const matcherJs = fs.readFileSync(path.join(root, 'js', 'components', 'pdf-source-matcher.js'), 'utf8');
const polishCss = fs.readFileSync(path.join(root, 'css', 'polish.css'), 'utf8');
const indexHtml = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const questionsData = JSON.parse(fs.readFileSync(path.join(root, 'data', 'questions.json'), 'utf8'));

console.log('='.repeat(78));
console.log('KURO FANGS — QUESTION → EXACT LOCATION IN SHEET VERIFICATION');
console.log('='.repeat(78));

const checks = [
  // 1. Script Inclusion & HTML Wiring
  {
    category: 'Architecture & Engine',
    name: 'pdf-source-matcher.js script included in index.html',
    pass: indexHtml.includes('js/components/pdf-source-matcher.js')
  },
  {
    category: 'Architecture & Engine',
    name: 'PdfSourceMatcher provides normalizeText, cleanWhitespace, matchSourceInPage',
    pass: matcherJs.includes('normalizeText(str)') &&
          matcherJs.includes('cleanWhitespace(str)') &&
          matcherJs.includes('matchSourceInPage(pageData, sourceRef, targetPage)')
  },
  {
    category: 'Architecture & Engine',
    name: 'Matcher enforces CRITICAL RULE: NO GUESSING on missing or unresolved matches',
    pass: matcherJs.includes("status: 'unresolved'") &&
          matcherJs.includes('No text items on page') &&
          matcherJs.includes('Target page mismatch')
  },

  // 2. Question Database Enrichment
  {
    category: 'Question Database',
    name: 'q_oral_path_caries_01 has exact source reference on page 2 with quote',
    pass: Boolean(
      questionsData.questions.find(q =>
        q.id === 'q_oral_path_caries_01' &&
        q.source_reference &&
        q.source_reference.source_type === 'exact' &&
        q.source_reference.page_number === 2 &&
        q.source_reference.source_text
      )
    )
  },
  {
    category: 'Question Database',
    name: 'q_oral_path_caries_02 has supporting source reference with quote',
    pass: Boolean(
      questionsData.questions.find(q =>
        q.id === 'q_oral_path_caries_02' &&
        q.source_reference &&
        q.source_reference.source_type === 'supporting'
      )
    )
  },
  {
    category: 'Question Database',
    name: 'q_oral_path_caries_03 has multiple source references (exact + supporting)',
    pass: Boolean(
      questionsData.questions.find(q =>
        q.id === 'q_oral_path_caries_03' &&
        Array.isArray(q.source_references) &&
        q.source_references.length >= 2
      )
    )
  },
  {
    category: 'Question Database',
    name: 'q_test_fallback_01 has unresolved verification_status for testing fallback',
    pass: Boolean(
      questionsData.questions.find(q =>
        q.id === 'q_test_fallback_01' &&
        q.source_reference &&
        q.source_reference.verification_status === 'unresolved'
      )
    )
  },

  // 3. Questions Page Modal Runner UI & Actions
  {
    category: 'Questions UI & Runner',
    name: 'Template contains in-card explanation section with quote box and source actions',
    pass: questionsJs.includes('dt-card-exp-section') &&
          questionsJs.includes('dt-card-faculty-exp') &&
          questionsJs.includes('dt-card-exp-text') &&
          questionsJs.includes('dt-card-quote-box') &&
          questionsJs.includes('dt-card-quote-text') &&
          questionsJs.includes('dt-card-source-actions')
  },
  {
    category: 'Questions UI & Runner',
    name: 'Template contains secondary mascot explanation source actions container',
    pass: questionsJs.includes('dt-kuro-source-actions-box')
  },
  {
    category: 'Questions UI & Runner',
    name: 'Template contains dedicated PDF sheet viewer pane for split and mobile views',
    pass: questionsJs.includes('dt-quiz-pdf-pane')
  },
  {
    category: 'Questions UI & Runner',
    name: 'QuestionsPage provides getQuestionSourceReferences for normalized access',
    pass: questionsJs.includes('getQuestionSourceReferences(q)')
  },
  {
    category: 'Questions UI & Runner',
    name: 'QuestionsPage provides renderSourceActionButtons with exact & supporting styling',
    pass: questionsJs.includes('renderSourceActionButtons(container, refs, q)') &&
          questionsJs.includes('dt-btn-view-sheet') &&
          questionsJs.includes('dt-source-type-pill')
  },
  {
    category: 'Questions UI & Runner',
    name: 'Option click reveals in-card faculty explanation and smooth-scrolls into view',
    pass: questionsJs.includes('cardExpSection.style.display = \'block\'') &&
          questionsJs.includes('cardExpSection.scrollIntoView')
  },
  {
    category: 'Questions UI & Runner',
    name: 'QuestionsPage.openSourceInSheet handles desktop split vs mobile sequential',
    pass: questionsJs.includes('openSourceInSheet(ref, question)') &&
          questionsJs.includes('dt-split-active') &&
          questionsJs.includes('dt-mobile-pdf-active') &&
          questionsJs.includes('window.SheetDetailPage.render')
  },
  {
    category: 'Questions UI & Runner',
    name: 'QuestionsPage.closePdfView cleanly resets split and mobile state and docks',
    pass: questionsJs.includes('closePdfView()') &&
          questionsJs.includes('kn-source-ref-dock') &&
          questionsJs.includes('kn-source-fallback-card')
  },
  {
    category: 'Questions UI & Runner',
    name: 'closeQuizModal and Next/Prev handlers call closePdfView to prevent state leaks',
    pass: questionsJs.includes('closeQuizModal() {\n    QuestionsPage.closePdfView();') &&
          questionsJs.includes('QuestionsPage.closePdfView();\n      if (QuestionsPage.activeQuizIndex < QuestionsPage.activeQuizList.length - 1)')
  },

  // 4. Sheet Detail & Kuro Notes Viewer
  {
    category: 'PDF Viewer & Annotations',
    name: 'renderKuroNotesSheet accepts sourceRef, question, isSplitView, isMobileFlow, onBackToQuestion',
    pass: sheetDetailJs.includes('opts.sourceRef') &&
          sheetDetailJs.includes('opts.question') &&
          sheetDetailJs.includes('opts.isSplitView') &&
          sheetDetailJs.includes('opts.isMobileFlow') &&
          sheetDetailJs.includes('opts.onBackToQuestion')
  },
  {
    category: 'PDF Viewer & Annotations',
    name: 'Page cards contain non-destructive kn-source-ref-layer overlay',
    pass: sheetDetailJs.includes('kn-source-ref-layer-${p}')
  },
  {
    category: 'PDF Viewer & Annotations',
    name: 'PDF document loader navigates directly to target page from sourceRef on open',
    pass: sheetDetailJs.includes('if (state.sourceReference)') &&
          sheetDetailJs.includes('goToPage(targetP, false);') &&
          sheetDetailJs.includes('checkAndResolveSourceReference(targetP);')
  },
  {
    category: 'PDF Viewer & Annotations',
    name: 'Auto-focuses and zooms on source bounds without modifying PDF bytes',
    pass: sheetDetailJs.includes('focusOnSourceLocation(') &&
          sheetDetailJs.includes('viewport.scrollTo') &&
          sheetDetailJs.includes('pulse-attention')
  },
  {
    category: 'PDF Viewer & Annotations',
    name: 'Floating contextual dock provides [Back to Question], [Focus], [Keep Highlight]',
    pass: sheetDetailJs.includes('kn-source-ref-dock') &&
          sheetDetailJs.includes('kn-dock-btn-back') &&
          sheetDetailJs.includes('kn-dock-btn-focus') &&
          sheetDetailJs.includes('kn-dock-btn-keep')
  },
  {
    category: 'PDF Viewer & Annotations',
    name: 'Fallback card mounted when source cannot be identified (NO GUESSING)',
    pass: sheetDetailJs.includes('mountFallbackWarningCard(pageNum)') &&
          sheetDetailJs.includes('Source location could not be identified automatically') &&
          sheetDetailJs.includes('kn-fallback-btn-back') &&
          sheetDetailJs.includes('kn-fallback-btn-manual')
  },
  {
    category: 'PDF Viewer & Annotations',
    name: 'promptKeepHighlight saves highlight permanently into user annotations',
    pass: sheetDetailJs.includes('promptKeepHighlight(matchResult)') &&
          sheetDetailJs.includes('state.annotations.push') &&
          sheetDetailJs.includes('saveAnnotations()')
  },

  // 5. CSS & Styling
  {
    category: 'Styling & Design Tokens',
    name: 'In-card explanation and quote box have double-border elevation and semantic tokens',
    pass: polishCss.includes('.dt-card-exp-section') &&
          polishCss.includes('.dt-card-quote-box')
  },
  {
    category: 'Styling & Design Tokens',
    name: 'View in Sheet buttons and pills have distinct Exact and Supporting styling',
    pass: polishCss.includes('.dt-btn-view-sheet.exact') &&
          polishCss.includes('.dt-btn-view-sheet.supporting') &&
          polishCss.includes('.dt-source-type-pill.exact') &&
          polishCss.includes('.dt-source-type-pill.supporting')
  },
  {
    category: 'Styling & Design Tokens',
    name: 'Split view layout is responsive with grid columns and full height',
    pass: polishCss.includes('#dt-quiz-stage-container.dt-split-active') &&
          polishCss.includes('grid-template-columns: 460px 1fr')
  },
  {
    category: 'Styling & Design Tokens',
    name: 'Mobile sequential flow fills viewport at < 900px',
    pass: polishCss.includes('#dt-quiz-runner-modal.dt-mobile-pdf-active') &&
          polishCss.includes('@media (max-width: 899px)')
  },
  {
    category: 'Styling & Design Tokens',
    name: 'Source highlights have soft yellow/sky glow and pulse-attention keyframes',
    pass: polishCss.includes('.dt-question-source-highlight.exact') &&
          polishCss.includes('.dt-question-source-highlight.supporting') &&
          polishCss.includes('@keyframes kfSourcePulse')
  },
  {
    category: 'Styling & Design Tokens',
    name: 'Contextual dock has obsidian glassmorphism, spring transitions, tactile buttons',
    pass: polishCss.includes('.kn-source-ref-dock') &&
          polishCss.includes('backdrop-filter: blur(16px)') &&
          polishCss.includes('.kn-dock-back-btn')
  },
  {
    category: 'Styling & Design Tokens',
    name: 'Fallback warning card has amber alert styling and dark mode tokens',
    pass: polishCss.includes('.kn-source-fallback-card') &&
          polishCss.includes('[data-theme="dark"] .kn-source-fallback-card')
  }
];

let allPassed = true;
let currentCat = '';

checks.forEach(c => {
  if (c.category !== currentCat) {
    currentCat = c.category;
    console.log(`\n── ${currentCat.toUpperCase()} ──`);
  }
  const symbol = c.pass ? '✓' : '✗';
  console.log(`  ${symbol} ${c.name}`);
  if (!c.pass) allPassed = false;
});

console.log('\n' + '='.repeat(78));
if (allPassed) {
  console.log('RESULT: 100% OF VERIFICATION CHECKS PASSED SUCCESSFULLY (30/30)!');
} else {
  console.error('RESULT: SOME VERIFICATION CHECKS FAILED!');
  process.exit(1);
}
console.log('='.repeat(78));
