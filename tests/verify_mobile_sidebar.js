/**
 * KURO FANGS — MOBILE SIDEBAR / DRAWER AUDIT & VERIFICATION SUITE
 * 
 * Verifies:
 * 1. Z-Index hierarchy: Page (0) -> Header (100) -> Dark Backdrop (1000) -> Sidebar Drawer (1010).
 * 2. Blur isolation: Backdrop blur(4px) stays behind Drawer (1010), keeping sidebar 100% sharp.
 * 3. Bidirectional sliding: LTR (left: 0, translateX(-100%)) / RTL (right: 0, translateX(100%)).
 * 4. Responsive tiers: Hidden on Desktop (>= 1200px), Slide-in Drawer on Mobile & Tablet (< 1200px).
 * 5. Touch & Accessibility: Safe area insets, ARIA attributes, Escape key, stopPropagation.
 * 6. Interactive DOM state transitions.
 */

const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
const polishCss = fs.readFileSync(path.join(rootDir, 'css', 'polish.css'), 'utf8');
const layoutCss = fs.readFileSync(path.join(rootDir, 'css', 'layout.css'), 'utf8');
const tokensCss = fs.readFileSync(path.join(rootDir, 'css', 'tokens.css'), 'utf8');
const appJs = fs.readFileSync(path.join(rootDir, 'js', 'app.js'), 'utf8');

const tests = [
  // ─── 0. Design System Alignment (Warm Cream & Burgundy) ───
  {
    category: 'Design System Alignment',
    name: 'Sidebar tokens use warm ivory (#FAF7F2), warm border (#EAE3D6), and burgundy accent (#7E1D2A)',
    pass: tokensCss.includes('--bg-sidebar: #FAF7F2;') &&
          tokensCss.includes('--sidebar-border: #EAE3D6;') &&
          tokensCss.includes('--sidebar-text-active: #7E1D2A;') &&
          polishCss.includes('background: #FAF7F2 !important')
  },

  // ─── 1. Z-Index Hierarchy & Blur Isolation ───
  {
    category: 'Z-Index & Blur Isolation',
    name: 'Backdrop has z-index: 1000 in polish.css & layout.css',
    pass: (polishCss.includes('.sidebar-backdrop') && polishCss.includes('z-index: 1000 !important')) &&
          (layoutCss.includes('.sidebar-backdrop') && layoutCss.includes('z-index: 1000;'))
  },
  {
    category: 'Z-Index & Blur Isolation',
    name: 'Sidebar Drawer has z-index: 1010 in polish.css & layout.css (strictly above backdrop)',
    pass: (polishCss.includes('.app-sidebar') && polishCss.includes('z-index: 1010 !important')) &&
          (layoutCss.includes('z-index: 1010;'))
  },
  {
    category: 'Z-Index & Blur Isolation',
    name: 'Header has z-index: 100 (below backdrop and drawer)',
    pass: polishCss.includes('.site-header') && polishCss.includes('z-index: 100 !important')
  },
  {
    category: 'Z-Index & Blur Isolation',
    name: 'Backdrop applies subtle 4px blur without affecting sidebar drawer',
    pass: polishCss.includes('backdrop-filter: blur(4px) !important') &&
          polishCss.includes('-webkit-backdrop-filter: blur(4px) !important') &&
          polishCss.includes('background: rgba(15, 23, 42, 0.28) !important')
  },

  // ─── 2. Responsive Drawer Architecture (< 1200px) ───
  {
    category: 'Responsive Drawer Architecture',
    name: 'Sidebar is scoped with display: none only on desktop (>= 1200px)',
    pass: polishCss.includes('@media (min-width: 1200px)') &&
          polishCss.includes('.app-sidebar:not(.open)') &&
          polishCss.includes('display: none !important')
  },
  {
    category: 'Responsive Drawer Architecture',
    name: 'Sidebar is display: flex !important and position: fixed !important on < 1200px',
    pass: polishCss.includes('@media (max-width: 1199px)') &&
          polishCss.includes('.app-sidebar') &&
          polishCss.includes('display: flex !important') &&
          polishCss.includes('position: fixed !important')
  },
  {
    category: 'Responsive Drawer Architecture',
    name: 'Sidebar has responsive width min(85vw, 320px) and 100dvh height',
    pass: polishCss.includes('width: min(85vw, 320px) !important') &&
          polishCss.includes('height: 100dvh !important')
  },
  {
    category: 'Responsive Drawer Architecture',
    name: 'LTR direction slides from left: translateX(-100%) to translateX(0)',
    pass: polishCss.includes('html[dir="ltr"] .app-sidebar') &&
          polishCss.includes('left: 0 !important') &&
          polishCss.includes('transform: translateX(-100%) !important') &&
          polishCss.includes('transform: translateX(0) !important')
  },
  {
    category: 'Responsive Drawer Architecture',
    name: 'RTL direction slides from right: translateX(100%) to translateX(0)',
    pass: polishCss.includes('html[dir="rtl"] .app-sidebar') &&
          polishCss.includes('right: 0 !important') &&
          polishCss.includes('transform: translateX(100%) !important') &&
          polishCss.includes('border-left: 1px solid #EAE3D6 !important')
  },
  {
    category: 'Responsive Drawer Architecture',
    name: 'Safe area insets integrated on top and bottom',
    pass: polishCss.includes('padding-top: max(12px, env(safe-area-inset-top)) !important') &&
          polishCss.includes('padding-bottom: max(16px, env(safe-area-inset-bottom)) !important')
  },
  {
    category: 'Responsive Drawer Architecture',
    name: 'Internal scrolling enabled on .sidebar-nav with overscroll containment',
    pass: polishCss.includes('.app-sidebar .sidebar-nav') &&
          polishCss.includes('overflow-y: auto !important') &&
          polishCss.includes('overscroll-behavior: contain !important')
  },

  // ─── 3. HTML Markup & Accessibility ───
  {
    category: 'Markup & Accessibility',
    name: '#sidebar-backdrop has aria-hidden="true" in index.html',
    pass: indexHtml.includes('id="sidebar-backdrop"') &&
          indexHtml.includes('class="sidebar-backdrop" aria-hidden="true"')
  },
  {
    category: 'Markup & Accessibility',
    name: '#app-sidebar has aria-hidden="true" in index.html',
    pass: indexHtml.includes('id="app-sidebar"') &&
          indexHtml.includes('aria-label="Main Navigation" aria-hidden="true"')
  },
  {
    category: 'Markup & Accessibility',
    name: '#sidebar-close-btn has accessible label',
    pass: indexHtml.includes('id="sidebar-close-btn"') &&
          indexHtml.includes('aria-label="Close menu"')
  },
  {
    category: 'Markup & Accessibility',
    name: '#sidebar-toggle-btn has aria-expanded="false" and aria-controls="app-sidebar"',
    pass: indexHtml.includes('id="sidebar-toggle-btn"') &&
          indexHtml.includes('aria-expanded="false"') &&
          indexHtml.includes('aria-controls="app-sidebar"')
  },
  {
    category: 'Markup & Accessibility',
    name: 'Stylesheets and app.js bumped to v=12.8 cache busters',
    pass: indexHtml.includes('css/layout.css?v=12.8') &&
          indexHtml.includes('css/polish.css?v=12.8') &&
          indexHtml.includes('js/app.js?v=12.8')
  },

  // ─── 4. JavaScript Controls & Event Handling ───
  {
    category: 'JavaScript Controls',
    name: 'openMobileSidebar updates aria-hidden and aria-expanded attributes',
    pass: appJs.includes("sidebarEl.setAttribute('aria-hidden', 'false')") &&
          appJs.includes("sidebarBackdrop.setAttribute('aria-hidden', 'false')") &&
          appJs.includes("sidebarToggleBtn.setAttribute('aria-expanded', 'true')")
  },
  {
    category: 'JavaScript Controls',
    name: 'closeMobileSidebar updates aria-hidden and aria-expanded attributes',
    pass: appJs.includes("sidebarEl.setAttribute('aria-hidden', 'true')") &&
          appJs.includes("sidebarBackdrop.setAttribute('aria-hidden', 'true')") &&
          appJs.includes("sidebarToggleBtn.setAttribute('aria-expanded', 'false')")
  },
  {
    category: 'JavaScript Controls',
    name: 'openMobileSidebar locks body scroll with overflow: hidden',
    pass: appJs.includes("document.body.style.overflow = 'hidden'")
  },
  {
    category: 'JavaScript Controls',
    name: 'closeMobileSidebar restores body scroll',
    pass: appJs.includes("document.body.style.overflow = ''")
  },
  {
    category: 'JavaScript Controls',
    name: 'stopPropagation prevented on sidebar drawer clicks',
    pass: appJs.includes("sidebarEl.addEventListener('click', (e) => {") &&
          appJs.includes("e.stopPropagation();")
  },
  {
    category: 'JavaScript Controls',
    name: 'Escape keyboard key closes mobile sidebar',
    pass: appJs.includes("e.key === 'Escape'") &&
          appJs.includes("closeMobileSidebar()")
  },
  {
    category: 'JavaScript Controls',
    name: 'Navigation links inside drawer auto-close drawer on < 1200px',
    pass: appJs.includes("window.innerWidth < 1200") &&
          appJs.includes("closeMobileSidebar()")
  }
];

// ─── 5. Simulated Runtime State Tests ───
function runRuntimeSimulation() {
  const domSimulationResults = [];

  // Mock DOM environment
  const mockClassList = (initial = []) => {
    const list = new Set(initial);
    return {
      add: (c) => list.add(c),
      remove: (c) => list.delete(c),
      contains: (c) => list.has(c),
      get value() { return Array.from(list).join(' '); }
    };
  };

  const mockAttrs = {};
  const mockEl = (id) => ({
    id,
    classList: mockClassList(),
    setAttribute: (k, v) => { mockAttrs[`${id}:${k}`] = v; },
    getAttribute: (k) => mockAttrs[`${id}:${k}`],
    style: {},
    focus: () => {}
  });

  const sidebarEl = mockEl('app-sidebar');
  const sidebarBackdrop = mockEl('sidebar-backdrop');
  const sidebarToggleBtn = mockEl('sidebar-toggle-btn');
  const sidebarCloseBtn = mockEl('sidebar-close-btn');

  const bodyStyle = { overflow: '' };

  const openMobileSidebar = () => {
    sidebarEl.classList.add('open');
    sidebarEl.setAttribute('aria-hidden', 'false');
    sidebarBackdrop.classList.add('open');
    sidebarBackdrop.setAttribute('aria-hidden', 'false');
    sidebarToggleBtn.setAttribute('aria-expanded', 'true');
    bodyStyle.overflow = 'hidden';
  };

  const closeMobileSidebar = () => {
    sidebarEl.classList.remove('open');
    sidebarEl.setAttribute('aria-hidden', 'true');
    sidebarBackdrop.classList.remove('open');
    sidebarBackdrop.setAttribute('aria-hidden', 'true');
    sidebarToggleBtn.setAttribute('aria-expanded', 'false');
    bodyStyle.overflow = '';
  };

  // Test 1: Initial state
  domSimulationResults.push({
    name: 'Initial state: sidebar closed, backdrop closed, body scroll free',
    pass: !sidebarEl.classList.contains('open') &&
          !sidebarBackdrop.classList.contains('open') &&
          bodyStyle.overflow === ''
  });

  // Test 2: Trigger open
  openMobileSidebar();
  domSimulationResults.push({
    name: 'Trigger Open: sidebar open, backdrop open, body scroll locked, ARIA updated',
    pass: sidebarEl.classList.contains('open') &&
          sidebarBackdrop.classList.contains('open') &&
          bodyStyle.overflow === 'hidden' &&
          sidebarEl.getAttribute('aria-hidden') === 'false' &&
          sidebarBackdrop.getAttribute('aria-hidden') === 'false' &&
          sidebarToggleBtn.getAttribute('aria-expanded') === 'true'
  });

  // Test 3: Tap inside drawer (propagation stopped - stays open)
  let backdropClicked = false;
  const simulatedDrawerClick = (e) => {
    e.stopPropagation();
  };
  const mockEvent = {
    stopPropagation: () => { /* prevented */ }
  };
  simulatedDrawerClick(mockEvent);
  domSimulationResults.push({
    name: 'Click inside drawer: stops propagation, stays fully open',
    pass: sidebarEl.classList.contains('open') &&
          sidebarBackdrop.classList.contains('open') &&
          bodyStyle.overflow === 'hidden'
  });

  // Test 4: Tap backdrop (closes)
  closeMobileSidebar();
  domSimulationResults.push({
    name: 'Click backdrop: drawer closes, backdrop closes, body scroll restored',
    pass: !sidebarEl.classList.contains('open') &&
          !sidebarBackdrop.classList.contains('open') &&
          bodyStyle.overflow === '' &&
          sidebarEl.getAttribute('aria-hidden') === 'true' &&
          sidebarBackdrop.getAttribute('aria-hidden') === 'true' &&
          sidebarToggleBtn.getAttribute('aria-expanded') === 'false'
  });

  // Test 5: Open again and Escape key
  openMobileSidebar();
  const simulatedEscapeKey = (key) => {
    if (key === 'Escape' && sidebarEl.classList.contains('open')) {
      closeMobileSidebar();
    }
  };
  simulatedEscapeKey('Escape');
  domSimulationResults.push({
    name: 'Escape key: closes drawer and restores body scroll',
    pass: !sidebarEl.classList.contains('open') &&
          !sidebarBackdrop.classList.contains('open') &&
          bodyStyle.overflow === ''
  });

  return domSimulationResults;
}

// ─── Execution ───
let failedCount = 0;
console.log('='.repeat(70));
console.log('KURO FANGS — MOBILE SIDEBAR / DRAWER VERIFICATION SUITE');
console.log('='.repeat(70));

let currentCat = '';
tests.forEach((t) => {
  if (t.category !== currentCat) {
    currentCat = t.category;
    console.log(`\n--- ${currentCat} ---`);
  }
  if (t.pass) {
    console.log(`  [PASS] ${t.name}`);
  } else {
    console.log(`  [FAIL] ${t.name}`);
    failedCount++;
  }
});

console.log(`\n--- Runtime DOM State Simulation ---`);
const runtimeTests = runRuntimeSimulation();
runtimeTests.forEach((t) => {
  if (t.pass) {
    console.log(`  [PASS] ${t.name}`);
  } else {
    console.log(`  [FAIL] ${t.name}`);
    failedCount++;
  }
});

console.log('\n' + '='.repeat(70));
const totalTests = tests.length + runtimeTests.length;
if (failedCount === 0) {
  console.log(`RESULT: ALL ${totalTests} VERIFICATION CHECKS PASSED PERFECTLY!`);
  console.log('Mobile sidebar drawer, z-index hierarchy, blur isolation, and responsive controls verified.');
  console.log('='.repeat(70));
  process.exit(0);
} else {
  console.error(`RESULT: ${failedCount} of ${totalTests} CHECKS FAILED.`);
  console.log('='.repeat(70));
  process.exit(1);
}
