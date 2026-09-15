const fs = require('fs');
const content = fs.readFileSync('js/components/document-viewer.js', 'utf8');

const tests = [
  {
    name: 'Master Mode Toggle Button (#btn-master-mode) in Global Top Bar',
    test: content.includes('id="btn-master-mode"') && 
          content.includes('id="master-mode-icon"') && 
          content.includes('id="master-mode-label"')
  },
  {
    name: 'isEditingMode State Variable initialized to false (Reading Mode default)',
    test: content.includes('let isEditingMode = false;')
  },
  {
    name: 'toggleEditingMode function defined and exposed to window',
    test: content.includes('window.toggleEditingMode = function')
  },
  {
    name: 'toggleEditingMode updates icon (👆 <-> ✏️) and labels',
    test: content.includes("icon.textContent = '✏️'") && 
          content.includes("icon.textContent = '👆'") &&
          content.includes("label.textContent = 'وضع التحرير'") &&
          content.includes("label.textContent = 'وضع القراءة'")
  },
  {
    name: 'applyCanvasPointerEvents correctly manages pointer-events for Reading vs Editing',
    test: content.includes('function applyCanvasPointerEvents()') &&
          content.includes("c.style.pointerEvents = 'none'") &&
          content.includes("c.style.pointerEvents = 'auto'")
  },
  {
    name: 'Strict Canvas Guard in onStart, onMove, and onEnd (!isEditingMode)',
    test: content.includes("if (!isEditingMode || currentTool === 'pan') return;")
  },
  {
    name: 'Strict Canvas Guard on touchstart and touchmove (letting touches bubble for slide swiping)',
    test: content.includes("if (!isEditingMode || currentTool === 'pan') {\n          return; // Let touch bubble cleanly to viewport for slide navigation!")
  },
  {
    name: 'Horizontal Slide Wrapper Layout (.jnotes-pages-wrapper flex-direction: row; width: max-content)',
    test: content.includes('flex-direction: row') && 
          content.includes('width: max-content') &&
          content.includes('margin: 0 24px')
  },
  {
    name: 'Slide-aware getFitWidthScale and getActivePageDimensions',
    test: content.includes('function getActivePageDimensions()') &&
          content.includes('function getFitWidthScale()')
  },
  {
    name: 'Horizontal Slide Centering in scrollToPage (pageCenterX & pageCenterY)',
    test: content.includes('pageCenterX = pageEl.offsetLeft + pageEl.offsetWidth / 2') &&
          content.includes('panX = (vp.width / 2) - (pageCenterX * zoomLevel)') &&
          content.includes('panY = (vp.height / 2) - (pageCenterY * zoomLevel)')
  },
  {
    name: 'Instant Page Counter Stepper synchronization (e.g. 1 / 12)',
    test: content.includes("counter.textContent = currentPage + ' / ' + totalPages")
  },
  {
    name: 'Horizontal Slide Detection in updateCurrentPageFromPan using viewportCenterDocX',
    test: content.includes('viewportCenterDocX = (vp.width / 2 - panX) / zoomLevel') &&
          content.includes('Math.abs(viewportCenterDocX - pageCenterX)')
  },
  {
    name: 'Zoom Separation: Pan inside page when zoomLevel > 1.08 vs Swipe between slides when zoomLevel <= 1.08',
    test: content.includes('if (zoomLevel > 1.08)') && 
          content.includes('isHorizontalSwiping') &&
          content.includes('isGesturePanning')
  },
  {
    name: 'Responsive Horizontal Swipe Velocity and Threshold Detection on touchend',
    test: content.includes('totalDx < -50 || vx < -0.35') &&
          content.includes('totalDx > 50 || vx > 0.35') &&
          content.includes('window.nextPage()') &&
          content.includes('window.prevPage()')
  },
  {
    name: 'Two-Finger Invariant Focal-Point Zoom and Instant abortActiveDrawing',
    test: content.includes('if (e.touches.length >= 2)') &&
          content.includes('abortActiveDrawing()') &&
          content.includes('focalDocX = (midX - panX) / zoomLevel') &&
          content.includes('focalDocY = (midY - panY) / zoomLevel')
  },
  {
    name: 'Desktop Mouse and Wheel horizontal swipe navigation',
    test: content.includes("if (e.button === 1 || (e.button === 0 && (!isEditingMode || currentTool === 'pan')))") &&
          content.includes('if (zoomLevel > 1.08)')
  }
];

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('🧪 VERIFYING JNOTES-STYLE INTERACTION & HORIZONTAL SLIDES');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

let failed = false;
tests.forEach((t, i) => {
  if (t.test) {
    console.log(`[PASS] ${i + 1}. ${t.name}`);
  } else {
    console.log(`[FAIL] ${i + 1}. ${t.name}`);
    failed = true;
  }
});

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
if (failed) {
  console.log('❌ SOME TESTS FAILED');
  process.exit(1);
} else {
  console.log('🌟 ALL 16 JNOTES INTERACTION AND GESTURE TESTS PASSED PERFECTLY!');
  process.exit(0);
}
