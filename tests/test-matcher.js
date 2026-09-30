const fs = require('fs');

// Mock window
global.window = {};
eval(fs.readFileSync('js/components/pdf-source-matcher.js', 'utf8'));
const matcher = global.window.PdfSourceMatcher;

const pageData = {
  items: [
    { str: 'Definition:', x: 40, y: 100, w: 80, h: 18 },
    { str: "• It's a progressive bacterial damage of hard tooth structure exposed to the oral", x: 40, y: 130, w: 580, h: 18 },
    { str: 'environment, characterized by demineralization of the inorganic portion', x: 40, y: 154, w: 560, h: 18 },
    { str: 'followed by destruction of the organic substance of the tooth leading to a', x: 40, y: 178, w: 570, h: 18 },
    { str: 'cavity.', x: 40, y: 202, w: 60, h: 18 }
  ]
};

// Test 1: Exact match
const r1 = matcher.matchSourceInPage(pageData, {
  page_number: 2,
  source_type: 'exact',
  source_text: 'characterized by demineralization of the inorganic portion followed by destruction of the organic substance'
}, 2);
console.log('TEST 1 (Exact): verified =', r1.verified, 'rects =', r1.rects?.length, 'bounds =', JSON.stringify(r1.bounds));

// Test 2: Formatting / Normalized difference
const r2 = matcher.matchSourceInPage(pageData, {
  page_number: 2,
  source_type: 'exact',
  source_text: 'CHARACTERIZED BY   DEMINERALIZATION OF THE INORGANIC PORTION\n\nFOLLOWED BY DESTRUCTION OF THE ORGANIC SUBSTANCE'
}, 2);
console.log('TEST 2 (Normalized): verified =', r2.verified, 'method =', r2.matchMethod);

// Test 3: Unresolved (non-existent text) -> NO GUESSING
const r3 = matcher.matchSourceInPage(pageData, {
  page_number: 2,
  source_type: 'exact',
  source_text: 'Non-existent text about dental implants completely absent here'
}, 2);
console.log('TEST 3 (Unresolved): verified =', r3.verified, 'status =', r3.status);

// Test 4: Supporting source
const r4 = matcher.matchSourceInPage(pageData, {
  page_number: 2,
  source_type: 'supporting',
  source_text: 'progressive bacterial damage of hard tooth structure'
}, 2);
console.log('TEST 4 (Supporting): verified =', r4.verified, 'sourceType =', r4.sourceType);
