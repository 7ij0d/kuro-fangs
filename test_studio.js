const fs = require('fs');
const path = require('path');

const code = fs.readFileSync(path.join(__dirname, 'js/components/document-viewer.js'), 'utf8');

const mockElement = {
  classList: { add: () => {}, remove: () => {}, toggle: () => true, contains: () => false },
  setAttribute: () => {},
  getAttribute: () => null,
  addEventListener: () => {},
  removeEventListener: () => {},
  style: {},
  getBoundingClientRect: () => ({ left: 100, top: 50, width: 200, height: 40 }),
  querySelectorAll: () => [],
  querySelector: () => null,
  focus: () => {},
  remove: () => {},
  getContext: () => ({ drawImage: () => {}, clearRect: () => {}, beginPath: () => {}, moveTo: () => {}, lineTo: () => {}, stroke: () => {}, fill: () => {}, fillRect: () => {}, save: () => {}, restore: () => {} })
};

const win = {
  addEventListener: () => {},
  removeEventListener: () => {},
  location: { hash: '', href: '' },
  localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  sessionStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} },
  scrollTo: () => {},
  innerWidth: 1024,
  innerHeight: 768,
  STORE: { isFavorite: () => false, addPoints: () => {} },
  I18N: { getLang: () => 'ar', t: k => k }
};

global.window = win;
global.localStorage = win.localStorage;
global.sessionStorage = win.sessionStorage;
global.document = {
  addEventListener: () => {},
  removeEventListener: () => {},
  documentElement: { setAttribute: () => {}, style: {}, requestFullscreen: async () => {} },
  getElementById: (id) => mockElement,
  querySelectorAll: () => [mockElement],
  querySelector: () => mockElement,
  body: { classList: mockElement.classList, style: {}, appendChild: (node) => {
    if (node && node.textContent && node.nodeName === 'SCRIPT') {
      try {
        const fn = new Function(node.textContent);
        fn.call(win);
      } catch(e) {
        console.error('SCRIPT EXECUTION ERROR:', e);
      }
    }
  } },
  createElement: (tag) => {
    const el = { ...mockElement, nodeName: tag.toUpperCase() };
    return el;
  }
};

try {
  eval(code);
  const container = mockElement;
  win.DocumentViewer.renderStudio(container, { id: 'sh1', title: 'Test Sheet (التركيبات المؤقتة)' }, true);
} catch(err) {
  console.error('EVAL ERROR:', err);
}

const handlers = [
  'setTool', 'setColor', 'setEraserMode', 'toggleSideToolsPanel', 'closeSideToolsPanel',
  'toggleColorPaletteMenu',
  'updateLineWeight', 'toggleStraightLineSetting', 'toggleBottomDisplaySetting',
  'undoAction', 'redoAction', 'prevPage', 'nextPage', 'scrollToPage',
  'toggleSidebar', 'closeSidebar', 'setCustomColor', 'deleteDockPreset',
  'applyDockPreset', 'addToPenBox', 'zoomIn', 'zoomOut', 'resetZoom',
  'cyclePaperTheme', 'applyPaperTheme', 'clearCurrentPageStrokes',
  'exitStudio', 'downloadDoc', 'toggleDiscussionDrawer', 'toggleFullscreenMode'
];

console.log('Testing Studio Window Handlers:');
let passCount = 0;
handlers.forEach(h => {
  if (typeof win[h] === 'function') {
    passCount++;
  } else {
    console.error('  MISSING:', h);
  }
});
console.log('FINAL RESULT:', passCount, '/', handlers.length, 'HANDLERS ATTACHED SUCCESSFULLY!');
