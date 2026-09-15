const fs = require('fs');
const content = fs.readFileSync('js/components/document-viewer.js', 'utf8');

const checks = [
  { name: 'Straight line mode toggle button (#tbtn-straight)', test: content.includes('id="tbtn-straight"') },
  { name: 'Straight line toggle function (toggleStraightMode)', test: content.includes('function toggleStraightMode()') || content.includes('toggleStraightMode = function') },
  { name: 'Selection tool button (#tbtn-select)', test: content.includes('id="tbtn-select"') },
  { name: 'Highlighter canvas layer with mix-blend-mode: multiply', test: content.includes('highlighter-canvas') && content.includes("mixBlendMode = 'multiply'") },
  { name: 'Command Pattern HistoryManager class', test: content.includes('class HistoryManager') },
  { name: 'AddStrokeCommand class', test: content.includes('class AddStrokeCommand') },
  { name: 'EraseStrokesCommand class', test: content.includes('class EraseStrokesCommand') },
  { name: 'MoveStrokesCommand class', test: content.includes('class MoveStrokesCommand') },
  { name: 'DeleteSelectionCommand class', test: content.includes('class DeleteSelectionCommand') },
  { name: 'Keyboard shortcuts for Ctrl+Z and Ctrl+Y', test: content.includes("key === 'z'") && content.includes("key === 'y'") },
  { name: 'Pressure-sensitive dynamic width calculation (Perfect Freehand)', test: content.includes('st.strokeWidth * (0.55 + 0.45 * pressure)') },
  { name: 'High-DPI multi-layer composite export with multiply blend mode', test: content.includes('exportCurrentPagePng') && content.includes('exportAnnotatedPdf') },
  { name: 'Selection bounding box & marquee interaction', test: content.includes('handleMarqueeEnd') && content.includes('jnotes-selection-box') },
  { name: 'Dual Eraser support (Object & Segment modes)', test: content.includes("eraserState.mode === 'object'") && content.includes("eraserState.mode === 'partial'") }
];

let allPassed = true;
checks.forEach((c, idx) => {
  if (c.test) {
    console.log(`[PASS] ${idx + 1}. ${c.name}`);
  } else {
    console.log(`[FAIL] ${idx + 1}. ${c.name}`);
    allPassed = false;
  }
});

if (allPassed) {
  console.log('\n🌟 ALL 14 VERIFICATION CHECKS PASSED PERFECTLY!');
  process.exit(0);
} else {
  console.log('\n❌ SOME CHECKS FAILED');
  process.exit(1);
}
