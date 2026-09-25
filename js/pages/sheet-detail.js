/**
 * KURO NOTES — FINAL PDF SHEET VIEWER MASTER INTERFACE & UNIFIED TOOL SUITE
 * ---------------------------------------------------------------------------
 * Implements the complete Kuro Notes academic workspace:
 *  - 4 Main Screen Areas: Header, Fixed Top Toolbar, Left Sidebar, Central PDF
 *    Workspace, Right Smart Panel + iPad FABs + Mobile Bottom Bar
 *  - 5-Layer Page Stack:
 *      1. .kn-pdf-canvas (Original PDF.js render)
 *      2. .kn-highlight-canvas (Under-text Highlighter via mix-blend-mode: multiply)
 *      3. .kn-text-layer (Selectable PDF text + Temporary Search Highlights)
 *      4. .kn-annotation-layer (Vector Pen & Shape strokes)
 *      5. .kn-objects-layer (Interactive Text Boxes, Images with Crop, Study Notes, Selection UI)
 *  - Unified HistoryManager (Undo/Redo for all 9 tools)
 *  - Persisted per-sheet state in localStorage
 */

window.Pages = window.Pages || {};

Pages.sheetDetail = async function (sheetId) {
  const container = document.getElementById('page-content');
  if (!container) return;

  const isAr = typeof I18n !== 'undefined' && I18n.currentLang === 'ar';
  const t = (ar, en) => (isAr ? ar : en);

  let sheet = Store.getById('sheets', sheetId);
  if (!sheet && window.CloudSync && CloudSync.isConfigured()) {
    try {
      await CloudSync.pullAll();
      sheet = Store.getById('sheets', sheetId);
    } catch (e) {}
  }

  if (!sheet) {
    container.innerHTML = `
      <div class="empty-state" style="padding:80px 20px;text-align:center;">
        <h3>${t('الشيت غير موجود', 'Sheet Not Found')}</h3>
        <button class="btn btn-primary" onclick="Router.navigate('/sheets')">${t('العودة للشيتات', 'Back to Sheets')}</button>
      </div>`;
    return;
  }

  Store.addRecent({
    type: 'sheet',
    id: sheet.id,
    title: sheet.title || sheet.name,
    subjectId: sheet.subjectId,
    url: `/sheets/${sheet.id}`,
  });

  try {
    localStorage.setItem(
      'kf_last_opened_sheet',
      JSON.stringify({
        id: sheet.id,
        title: sheet.title || sheet.name,
        subjectId: sheet.subjectId,
        openedAt: Date.now(),
      })
    );
  } catch (e) {}

  // Hide global chrome so Kuro Notes owns 100% of the viewport
  const appSidebar = document.getElementById('sidebar');
  const appHeader = document.getElementById('top-header');
  const mobileNav = document.querySelector('.mobile-bottom-nav');
  if (appSidebar) appSidebar.style.display = 'none';
  if (appHeader) appHeader.style.display = 'none';
  if (mobileNav) mobileNav.style.display = 'none';
  document.body.style.overflow = 'hidden';

  const restoreGlobalUI = () => {
    if (appSidebar) appSidebar.style.display = '';
    if (appHeader) appHeader.style.display = '';
    if (mobileNav) mobileNav.style.display = '';
    document.body.style.overflow = '';
    if (window._knKeyHandler) {
      window.removeEventListener('keydown', window._knKeyHandler);
      window._knKeyHandler = null;
    }
  };

  // Logical coordinate system per page (scales cleanly with zoom & rotation)
  const BASE_W = 720;
  const BASE_H = 960;

  // Storage keys
  const KEY_ANNOTS = `kf_kn_annotations_${sheet.id}`;
  const KEY_BM = `kf_kn_bookmarks_${sheet.id}`;
  const KEY_STATE = `kf_kn_viewstate_${sheet.id}`;
  const KEY_HL_PRESETS = `kf_kn_hl_presets_v1`;
  const KEY_PEN_PRESETS = `kf_kn_pen_presets_v1`;

  const safeJSON = (key, fallback) => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  };

  const savedView = safeJSON(KEY_STATE, {});
  const isDesktop = window.innerWidth > 1100;
  const isTablet = window.innerWidth >= 768 && window.innerWidth <= 1100;

  // Unified State
  const state = {
    pdfDoc: null,
    totalPages: Math.max(1, parseInt(sheet.pages, 10) || 12),
    currentPage: savedView.currentPage || 1,
    zoom: savedView.zoom || 1.0,
    zoomMode: savedView.zoomMode || 'custom', // 'custom' | 'fit-width' | 'fit-page'
    rotation: savedView.rotation || 0, // 0, 90, 180, 270
    // IMPORTANT: Default opening state has NO active annotation tool (pure reading mode)
    activeTool: null,
    toolPopoverOpen: false,
    leftSidebarOpen: savedView.leftSidebarOpen !== undefined ? savedView.leftSidebarOpen : (isDesktop || isTablet),
    rightSidebarOpen: savedView.rightSidebarOpen !== undefined ? savedView.rightSidebarOpen : isDesktop,
    leftTab: savedView.leftTab || 'pages', // 'pages' | 'bookmarks' | 'annotations'
    rightTab: savedView.rightTab || 'outline', // 'outline' | 'notes' | 'ai'
    readingMode: false,

    // Unified Annotations Array (persisted per sheet)
    // Types: 'highlighter', 'pen', 'shape', 'text', 'image', 'note'
    annotations: safeJSON(KEY_ANNOTS, []),
    bookmarks: safeJSON(KEY_BM, []),
    undoStack: [],
    redoStack: [],

    // Selection / Lasso State
    selectionMode: 'rect', // 'rect' | 'lasso'
    selectionFilter: 'all', // 'all' | 'handwriting' | 'pen' | 'highlighter' | 'shape' | 'image' | 'text' | 'note'
    selectedIds: [],
    clipboard: [],
    croppingId: null,
    cropRect: null, // { x, y, w, h } normalized 0..1 relative to image

    // Tool Configurations
    highlighter: {
      mode: 'freehand', // 'freehand' | 'straight'
      color: '#FACC15',
      size: 22,
      opacity: 0.42,
      presets: safeJSON(KEY_HL_PRESETS, [
        { id: 'hl-p1', name: 'Key Concept', color: '#FACC15', size: 22, opacity: 0.42, mode: 'freehand' },
        { id: 'hl-p2', name: 'Definition', color: '#4ADE80', size: 20, opacity: 0.38, mode: 'straight' },
        { id: 'hl-p3', name: 'Exam Alert', color: '#F472B6', size: 24, opacity: 0.45, mode: 'freehand' },
      ]),
      activePresetId: 'hl-p1',
    },
    pen: {
      mode: 'freehand', // 'freehand' | 'straight'
      color: '#7E1D2A',
      size: 3,
      opacity: 1.0,
      presets: safeJSON(KEY_PEN_PRESETS, [
        { id: 'pen-p1', name: 'Burgundy Ink', color: '#7E1D2A', size: 3, opacity: 1.0, mode: 'freehand' },
        { id: 'pen-p2', name: 'Fine Black', color: '#1F1A17', size: 2, opacity: 1.0, mode: 'freehand' },
        { id: 'pen-p3', name: 'Blue Diagram', color: '#1D4ED8', size: 4, opacity: 0.95, mode: 'straight' },
      ]),
      activePresetId: 'pen-p1',
    },
    eraser: {
      mode: 'stroke', // 'stroke' | 'object' | 'partial'
      size: 24,
    },
    shapes: {
      shapeType: 'rect', // 'rect' | 'ellipse' | 'line' | 'arrow'
      color: '#7E1D2A',
      size: 3,
      opacity: 1.0,
    },
    text: {
      fontFamily: "'IBM Plex Sans Arabic', 'Inter', sans-serif",
      fontSize: 16,
      color: '#1F1A17',
      bold: false,
      italic: false,
      underline: false,
      strike: false,
      align: 'start',
      dir: 'auto',
      lineHeight: 1.45,
      opacity: 1.0,
    },
    notesConfig: {
      color: '#FEF3C7',
      category: 'Important', // 'Important' | 'Review' | 'Question' | 'Reminder' | 'Definition' | 'Idea'
      filterCategory: 'all',
      sortBy: 'page', // 'page' | 'created' | 'updated' | 'pinned'
      searchQuery: '',
    },

    // PDF Outline & Extracted Page Text (for Real Search & Outline)
    outline: [],
    pageTexts: {}, // { [pageNum]: { fullText: string, items: [{ str, x, y, w, h }] } }
    search: {
      open: false,
      query: '',
      matchCase: false,
      wholeWords: false,
      matches: [], // [{ page, snippet, rects, index }]
      currentIndex: -1,
    },
  };

  const docTitle = sheet.fileName || `${sheet.title || sheet.name || 'Lecture Sheet'}.pdf`;

  const saveAnnotations = () => {
    try {
      localStorage.setItem(KEY_ANNOTS, JSON.stringify(state.annotations));
    } catch (e) {}
  };

  const saveViewState = () => {
    try {
      localStorage.setItem(
        KEY_STATE,
        JSON.stringify({
          currentPage: state.currentPage,
          zoom: state.zoom,
          zoomMode: state.zoomMode,
          rotation: state.rotation,
          leftSidebarOpen: state.leftSidebarOpen,
          rightSidebarOpen: state.rightSidebarOpen,
          leftTab: state.leftTab,
          rightTab: state.rightTab,
        })
      );
    } catch (e) {}
  };

  const pushHistory = () => {
    state.undoStack.push(JSON.stringify(state.annotations));
    if (state.undoStack.length > 60) state.undoStack.shift();
    state.redoStack = [];
    updateHistoryButtons();
  };

  const updateHistoryButtons = () => {
    const uBtn = document.getElementById('kn-btn-undo');
    const rBtn = document.getElementById('kn-btn-redo');
    if (uBtn) uBtn.disabled = state.undoStack.length === 0;
    if (rBtn) rBtn.disabled = state.redoStack.length === 0;
  };

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER MASTER SHELL HTML
  // ══════════════════════════════════════════════════════════════════════════
  container.innerHTML = `
    <div class="kuro-notes-workspace" id="kuro-notes-workspace" dir="ltr">
      <!-- Hidden File Input for Image Tool -->
      <input type="file" id="kn-image-file-input" accept="image/png,image/jpeg,image/webp,image/gif" style="display:none;" />

      <!-- Eraser Live Circle Cursor -->
      <div class="kn-eraser-cursor" id="kn-eraser-cursor"></div>

      <!-- Focus / Reading Mode Floating Pill -->
      <div class="kn-reading-mode-pill" id="kn-reading-pill" style="display:none;">
        <span>Kuro Notes — Focus Mode</span>
        <span id="kn-reading-page-badge">Page ${state.currentPage} / ${state.totalPages}</span>
        <button id="kn-exit-reading-btn" title="Exit Focus Mode (Esc)">✕ Exit</button>
      </div>

      <!-- 1. TOP HEADER (56px Desktop) -->
      <header class="kn-header" id="kn-header">
        <div class="kn-header-left">
          <button class="kn-btn kn-btn-back" id="kn-btn-back" title="${t('رجوع', 'Back to Sheets')}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            <span class="kn-btn-text">${t('رجوع', 'Back')}</span>
          </button>

          <button class="kn-icon-btn ${state.leftSidebarOpen ? 'active' : ''}" id="kn-btn-left-sidebar" title="Toggle Pages Sidebar">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>

          <div class="kn-brand">
            <img src="assets/kuro-avatar.png" alt="Kuro" class="kn-mascot-avatar" onerror="this.style.display='none'" />
            <span class="kn-app-title">Kuro Notes</span>
          </div>

          <div class="kn-header-sep"></div>

          <div class="kn-doc-title-pill" id="kn-doc-title-pill" title="${escapeHtml(docTitle)}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7E1D2A" stroke-width="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <span class="kn-doc-title-text">${escapeHtml(docTitle)}</span>
          </div>
        </div>

        <div class="kn-header-right">
          <button class="kn-icon-btn" id="kn-btn-search" title="Search in Sheet (Ctrl+F)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>

          <button class="kn-icon-btn" id="kn-btn-bookmark" title="Bookmark Current Page">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
          </button>

          <button class="kn-btn kn-btn-primary" id="kn-btn-share" title="Share Sheet">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            <span class="kn-btn-text">Share</span>
          </button>

          <div class="kn-dropdown-wrap">
            <button class="kn-icon-btn" id="kn-btn-header-more" title="Document Actions & More">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg>
            </button>
            <div class="kn-dropdown-menu" id="kn-header-more-menu">
              <button class="kn-dropdown-item" data-doc-action="info"><span>Document Info</span></button>
              <button class="kn-dropdown-item" data-doc-action="fit-page"><span>Fit Page</span></button>
              <button class="kn-dropdown-item" data-doc-action="fit-width"><span>Fit Width</span></button>
              <button class="kn-dropdown-item" data-doc-action="actual-size"><span>Actual Size (100%)</span></button>
              <button class="kn-dropdown-item" data-doc-action="rotate-left"><span>Rotate Left ↺</span></button>
              <button class="kn-dropdown-item" data-doc-action="rotate-right"><span>Rotate Right ↻</span></button>
              <button class="kn-dropdown-item" data-doc-action="print"><span>Print Sheet</span></button>
              <button class="kn-dropdown-item" data-doc-action="download"><span>Download Original PDF</span></button>
              <button class="kn-dropdown-item" data-doc-action="export"><span>Export with Annotations</span></button>
              <button class="kn-dropdown-item" data-doc-action="focus"><span>Focus Mode</span></button>
              <button class="kn-dropdown-item" data-doc-action="dark-mode"><span>Toggle Dark Mode</span></button>
              <button class="kn-dropdown-item" data-doc-action="discussion"><span>Academic Discussion</span></button>
            </div>
          </div>
        </div>
      </header>

      <!-- 2. FIXED TOP TOOLBAR (Exact Group & Tool Order 1..10) -->
      <div class="kn-toolbar" id="kn-toolbar" role="toolbar" aria-label="Kuro Notes Study Toolbar">
        <!-- GROUP 01: History -->
        <div class="kn-tool-group kn-group-history">
          <button class="kn-tool-btn" id="kn-btn-undo" title="Undo (Ctrl+Z)" disabled>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
          </button>
          <button class="kn-tool-btn" id="kn-btn-redo" title="Redo (Ctrl+Y)" disabled>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/></svg>
          </button>
        </div>

        <div class="kn-toolbar-divider"></div>

        <!-- GROUP 02: Page Navigation -->
        <div class="kn-tool-group kn-group-pagenav">
          <button class="kn-tool-btn" id="kn-btn-prev" title="Previous Page">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <div class="kn-page-input-wrap" title="Jump to Page">
            <input type="number" class="kn-page-input" id="kn-page-input" value="${state.currentPage}" min="1" max="${state.totalPages}" />
            <span style="color:var(--kn-text-muted);">/</span>
            <span id="kn-total-pages">${state.totalPages}</span>
          </div>
          <button class="kn-tool-btn" id="kn-btn-next" title="Next Page">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        <div class="kn-toolbar-divider kn-group-pagenav"></div>

        <!-- GROUP 03: Zoom Controls -->
        <div class="kn-tool-group kn-group-zoom">
          <button class="kn-tool-btn" id="kn-btn-zoom-out" title="Zoom Out">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
          <div class="kn-dropdown-wrap">
            <button class="kn-zoom-btn" id="kn-btn-zoom-menu" title="Zoom Presets">
              <span id="kn-zoom-label">${Math.round(state.zoom * 100)}%</span>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
            <div class="kn-dropdown-menu" id="kn-zoom-dropdown">
              <button class="kn-dropdown-item" data-zoom="fit-page"><span>Fit Page</span></button>
              <button class="kn-dropdown-item" data-zoom="fit-width"><span>Fit Width</span></button>
              <button class="kn-dropdown-item" data-zoom="0.5"><span>50%</span></button>
              <button class="kn-dropdown-item" data-zoom="0.75"><span>75%</span></button>
              <button class="kn-dropdown-item" data-zoom="1.0"><span>100%</span></button>
              <button class="kn-dropdown-item" data-zoom="1.2"><span>120%</span></button>
              <button class="kn-dropdown-item" data-zoom="1.25"><span>125%</span></button>
              <button class="kn-dropdown-item" data-zoom="1.5"><span>150%</span></button>
              <button class="kn-dropdown-item" data-zoom="2.0"><span>200%</span></button>
            </div>
          </div>
          <button class="kn-tool-btn" id="kn-btn-zoom-in" title="Zoom In">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </button>
        </div>

        <div class="kn-toolbar-divider kn-group-zoom"></div>

        <!-- GROUP 04: Annotation Tools (Fixed Exact Order 1..8) -->
        <div class="kn-tool-group kn-group-annotations">
          <!-- 1. Selection / Lasso -->
          <button class="kn-tool-btn" data-tool="select" title="1. Selection / Lasso Tool (V)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="m13 13 6 6"/></svg>
          </button>

          <!-- 2. Highlighter -->
          <button class="kn-tool-btn kn-tool-highlighter" data-tool="highlighter" title="2. Highlighter Tool — Under-Text (H)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></svg>
            <span class="kn-tool-label">Highlighter</span>
            <span class="kn-tool-color-dot" id="kn-hl-dot" style="background:${state.highlighter.color};"></span>
          </button>

          <!-- 3. Pen -->
          <button class="kn-tool-btn" data-tool="pen" title="3. Pen Tool (P)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
            <span class="kn-tool-color-dot" id="kn-pen-dot" style="background:${state.pen.color};"></span>
          </button>

          <!-- 4. Eraser -->
          <button class="kn-tool-btn" data-tool="eraser" title="4. Eraser Tool (E)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>
          </button>

          <!-- 5. Shapes -->
          <button class="kn-tool-btn" data-tool="shapes" title="5. Shapes Tool (S)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>
          </button>

          <!-- 6. Images -->
          <button class="kn-tool-btn" data-tool="image" title="6. Insert Image (I)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
          </button>

          <!-- 7. Text -->
          <button class="kn-tool-btn" data-tool="text" title="7. Text Box Tool (T)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
          </button>

          <!-- 8. Notes -->
          <button class="kn-tool-btn" data-tool="notes" title="8. Study Note Card (N)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"/><path d="M15 3v6h6"/></svg>
          </button>
        </div>

        <div class="kn-toolbar-divider"></div>

        <!-- GROUP 05: Intelligent / Extra Tools (9..10) -->
        <div class="kn-tool-group kn-group-extra">
          <!-- 9. AI Assistant -->
          <button class="kn-tool-btn" data-tool="ai" id="kn-btn-ai" title="9. Kuro AI Study Assistant">
            <span class="kn-ai-badge">AI</span>
          </button>

          <!-- 10. More / Secondary Toolbar Options -->
          <div class="kn-dropdown-wrap">
            <button class="kn-tool-btn" id="kn-toolbar-more" title="10. More Tool Options">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>
            </button>
            <div class="kn-dropdown-menu" id="kn-toolbar-more-menu">
              <button class="kn-dropdown-item" data-more-action="clear-page"><span>Clear Page Annotations</span></button>
              <button class="kn-dropdown-item" data-more-action="select-all"><span>Select All on Page (Ctrl+A)</span></button>
              <button class="kn-dropdown-item" data-more-action="rotate-right"><span>Rotate Page 90°</span></button>
              <button class="kn-dropdown-item" data-more-action="export-json"><span>Backup Notes (JSON)</span></button>
            </div>
          </div>
        </div>

        <!-- Right-aligned Focus Mode & Smart Panel Toggle -->
        <div class="kn-toolbar-end">
          <button class="kn-tool-btn" id="kn-btn-reading-mode" title="Distraction-Free Focus Mode">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
          </button>
          <button class="kn-tool-btn ${state.rightSidebarOpen ? 'active' : ''}" id="kn-btn-right-sidebar" title="Toggle Smart Study Panel">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
          </button>
        </div>
      </div>

      <!-- FLOATING TOOL CONTROL POPOVER (Dynamically populated for active tool) -->
      <div class="kn-tool-popover" id="kn-tool-popover"></div>

      <!-- FLOATING SEARCH POPOVER -->
      <div class="kn-search-popover" id="kn-search-popover">
        <div class="kn-search-bar-row">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" id="kn-search-input" placeholder="Search Arabic or English text..." autocomplete="off" />
          <span class="kn-search-count" id="kn-search-count">0 / 0</span>
          <button class="kn-icon-btn" id="kn-search-prev" title="Previous Match" style="width:24px;height:24px;">↑</button>
          <button class="kn-icon-btn" id="kn-search-next" title="Next Match" style="width:24px;height:24px;">↓</button>
          <button class="kn-icon-btn" id="kn-search-close" title="Close Search" style="width:24px;height:24px;">✕</button>
        </div>
        <div style="display:flex;align-items:center;gap:12px;font-size:0.74rem;color:var(--kn-text-muted);padding-inline:4px;">
          <label style="display:inline-flex;align-items:center;gap:4px;cursor:pointer;">
            <input type="checkbox" id="kn-search-case" /> Match case
          </label>
          <label style="display:inline-flex;align-items:center;gap:4px;cursor:pointer;">
            <input type="checkbox" id="kn-search-whole" /> Whole words
          </label>
        </div>
        <div class="kn-search-results-list" id="kn-search-results"></div>
      </div>

      <!-- 3. MAIN WORKSPACE BODY (Left Sidebar + Central Document + Right Smart Panel) -->
      <div class="kn-workspace-body">
        <!-- LEFT NAVIGATION SIDEBAR -->
        <aside class="kn-sidebar-left ${state.leftSidebarOpen ? '' : 'kn-sidebar-collapsed'}" id="kn-sidebar-left">
          <div class="kn-sidebar-tab-bar" id="kn-left-tabs">
            <button class="kn-tab-pill ${state.leftTab === 'pages' ? 'active' : ''}" data-left-tab="pages">Pages</button>
            <button class="kn-tab-pill ${state.leftTab === 'bookmarks' ? 'active' : ''}" data-left-tab="bookmarks">Bookmarks</button>
            <button class="kn-tab-pill ${state.leftTab === 'annotations' ? 'active' : ''}" data-left-tab="annotations">Annotations</button>
          </div>
          <div class="kn-sidebar-content" id="kn-left-content"></div>
        </aside>

        <!-- CENTRAL DOCUMENT VIEWPORT -->
        <main class="kn-document-viewport" id="kn-viewport" tabindex="0">
          <div class="kn-pages-container" id="kn-pages-container"></div>
        </main>

        <!-- RIGHT SMART PANEL -->
        <aside class="kn-sidebar-right ${state.rightSidebarOpen ? '' : 'kn-sidebar-collapsed'}" id="kn-sidebar-right">
          <div class="kn-sidebar-tab-bar" id="kn-right-tabs">
            <button class="kn-tab-pill ${state.rightTab === 'outline' ? 'active' : ''}" data-right-tab="outline">Outline</button>
            <button class="kn-tab-pill ${state.rightTab === 'notes' ? 'active' : ''}" data-right-tab="notes">Notes</button>
            <button class="kn-tab-pill ${state.rightTab === 'ai' ? 'active' : ''}" data-right-tab="ai">AI</button>
          </div>
          <div id="kn-right-content" style="display:flex;flex-direction:column;flex:1;overflow:hidden;"></div>
        </aside>
      </div>

      <!-- iPad Quick-Toggle Floating Corner Buttons -->
      <button class="kn-ipad-fab kn-ipad-fab-left" id="kn-ipad-fab-left">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
        <span>Pages</span>
      </button>
      <button class="kn-ipad-fab kn-ipad-fab-right" id="kn-ipad-fab-right">
        <span>Smart Panel</span>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
      </button>

      <!-- Mobile Compact Bottom Navigation Bar (<768px) -->
      <div class="kn-mobile-bottom-bar" id="kn-mobile-bottom-bar">
        <button class="kn-btn" id="kn-mob-pages-btn" style="font-weight:700;gap:5px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          <span>Pages</span>
        </button>
        <div style="display:flex;align-items:center;gap:6px;">
          <button class="kn-icon-btn" id="kn-mob-prev" style="width:28px;height:28px;">‹</button>
          <span id="kn-mob-page-indicator" style="font-size:0.8rem;font-weight:800;">${state.currentPage} / ${state.totalPages}</span>
          <button class="kn-icon-btn" id="kn-mob-next" style="width:28px;height:28px;">›</button>
        </div>
        <button class="kn-zoom-btn" id="kn-mob-zoom-btn">${Math.round(state.zoom * 100)}%</button>
        <button class="kn-btn" id="kn-mob-panel-btn" style="font-weight:700;gap:5px;color:var(--kn-primary);">
          <span>Smart Panel</span>
        </button>
      </div>
    </div>
  `;

  // ══════════════════════════════════════════════════════════════════════════
  // PAGE STACK BUILDER (5-Layer Architecture per Page)
  // ══════════════════════════════════════════════════════════════════════════
  const pagesContainer = document.getElementById('kn-pages-container');

  function getPageDimensions() {
    const swapped = state.rotation === 90 || state.rotation === 270;
    const w = (swapped ? BASE_H : BASE_W) * state.zoom;
    const h = (swapped ? BASE_W : BASE_H) * state.zoom;
    return { width: Math.round(w), height: Math.round(h) };
  }

  function buildPageCards() {
    pagesContainer.innerHTML = '';
    const { width, height } = getPageDimensions();
    for (let p = 1; p <= state.totalPages; p++) {
      const card = document.createElement('div');
      card.className = 'kn-page-card';
      card.dataset.page = p;
      card.style.width = `${width}px`;
      card.style.height = `${height}px`;
      card.innerHTML = `
        <canvas class="kn-pdf-canvas" id="kn-pdf-canvas-${p}" width="${width}" height="${height}"></canvas>
        <canvas class="kn-highlight-canvas" id="kn-hl-canvas-${p}" width="${width}" height="${height}"></canvas>
        <div class="kn-text-layer" id="kn-text-layer-${p}"></div>
        <canvas class="kn-annotation-layer" id="kn-annot-canvas-${p}" width="${width}" height="${height}"></canvas>
        <div class="kn-objects-layer" id="kn-objects-layer-${p}"></div>
        <div class="kn-interaction-layer ${state.activeTool ? 'tool-active' : ''}" id="kn-interact-layer-${p}" data-page="${p}"></div>
      `;
      pagesContainer.appendChild(card);
      drawFallbackSheetPage(p, document.getElementById(`kn-pdf-canvas-${p}`));
      renderPageAnnotations(p);
      bindPageInteraction(card, p);
    }
  }

  function drawFallbackSheetPage(pageNum, canvas) {
    if (!canvas || state.pdfDoc) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const s = state.zoom;

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, w, h);

    // Header bar
    ctx.fillStyle = '#7E1D2A';
    ctx.fillRect(40 * s, 36 * s, w - 80 * s, 3 * s);

    ctx.fillStyle = '#7C736B';
    ctx.font = `600 ${Math.round(11 * s)}px Inter, sans-serif`;
    ctx.fillText(`KURO ACADEMIC SHEET  •  ${(sheet.title || 'ORAL PATHOLOGY').toUpperCase()}`, 40 * s, 28 * s);
    ctx.fillText(`Page ${pageNum} of ${state.totalPages}`, w - 115 * s, 28 * s);

    // Section title
    const headings = [
      '1. Introduction & Clinical Overview',
      '2. Pathogenesis & Histological Features',
      '3. Differential Diagnosis & Radiology',
      '4. Treatment Protocol & Prognosis',
    ];
    const heading = headings[(pageNum - 1) % headings.length];

    ctx.fillStyle = '#1F1A17';
    ctx.font = `800 ${Math.round(20 * s)}px Inter, sans-serif`;
    ctx.fillText(`Lecture ${pageNum}: ${ sheet.title || 'Dental Clinical Study' }`, 40 * s, 76 * s);

    ctx.fillStyle = '#7E1D2A';
    ctx.font = `700 ${Math.round(14 * s)}px Inter, sans-serif`;
    ctx.fillText(heading, 40 * s, 110 * s);

    // Populate real selectable text layer for fallback pages so Search & Text-Selection Highlighting work out of the box
    const sampleParagraphs = [
      'Odontogenic cysts and tumors represent a diverse group of lesions derived from the tooth-forming apparatus.',
      'Histopathological examination demonstrates a stratified squamous epithelial lining with palisading basal cells.',
      'Radiographic evaluation typically reveals a well-circumscribed radiolucency associated with an unerupted crown.',
      'Clinical management requires careful enucleation, curettage, and periodic radiographic follow-up to prevent recurrence.',
      'Key Point: Early recognition of ameloblastoma and keratocystic odontogenic tumor is essential for conservative surgery.',
    ];

    ctx.fillStyle = '#292524';
    ctx.font = `400 ${Math.round(12.5 * s)}px Inter, sans-serif`;
    const items = [];
    let yCursor = 148;
    sampleParagraphs.forEach((para, idx) => {
      ctx.fillText(para, 40 * s, yCursor * s);
      items.push({ str: para, x: 40, y: yCursor - 12, w: 620, h: 18 });
      yCursor += 34;

      // Sub-bullet lines
      ctx.fillStyle = '#57534E';
      const sub = `• Clinical correlation ${idx + 1}.${pageNum}: Evaluate cortical expansion, root resorption, and vitality.`;
      ctx.fillText(sub, 56 * s, (yCursor - 12) * s);
      items.push({ str: sub, x: 56, y: yCursor - 24, w: 590, h: 16 });
      ctx.fillStyle = '#292524';
      yCursor += 32;
    });

    // Diagram box
    ctx.strokeStyle = '#E8E2D5';
    ctx.fillStyle = '#FCFAF6';
    ctx.lineWidth = 1.5 * s;
    ctx.fillRect(40 * s, 490 * s, w - 80 * s, 180 * s);
    ctx.strokeRect(40 * s, 490 * s, w - 80 * s, 180 * s);

    ctx.fillStyle = '#7E1D2A';
    ctx.font = `700 ${Math.round(12 * s)}px Inter, sans-serif`;
    ctx.fillText(`Figure ${pageNum}.1 — Histological & Radiographic Summary Diagram`, 58 * s, 520 * s);

    if (!state.pageTexts[pageNum]) {
      state.pageTexts[pageNum] = {
        fullText: items.map((i) => i.str).join(' '),
        items,
      };
      populateSelectableTextLayer(pageNum);
    }
  }

  function populateSelectableTextLayer(pageNum) {
    const layer = document.getElementById(`kn-text-layer-${pageNum}`);
    const pageData = state.pageTexts[pageNum];
    if (!layer || !pageData) return;
    const s = state.zoom;
    layer.innerHTML = pageData.items
      .map(
        (it) =>
          `<span style="position:absolute;left:${it.x * s}px;top:${it.y * s}px;font-size:${Math.max(9, (it.h - 3) * s)}px;color:transparent;white-space:pre;pointer-events:auto;">${escapeHtml(it.str)}</span>`
      )
      .join('');
    renderSearchMarksOnPage(pageNum);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // RENDER ALL ANNOTATIONS ON A PAGE (5-Layer Stack)
  // ══════════════════════════════════════════════════════════════════════════
  function renderPageAnnotations(pageNum) {
    const hlCanvas = document.getElementById(`kn-hl-canvas-${pageNum}`);
    const penCanvas = document.getElementById(`kn-annot-canvas-${pageNum}`);
    const objLayer = document.getElementById(`kn-objects-layer-${pageNum}`);
    if (!hlCanvas || !penCanvas || !objLayer) return;

    const hlCtx = hlCanvas.getContext('2d');
    const penCtx = penCanvas.getContext('2d');
    hlCtx.clearRect(0, 0, hlCanvas.width, hlCanvas.height);
    penCtx.clearRect(0, 0, penCanvas.width, penCanvas.height);
    objLayer.innerHTML = '';

    const s = state.zoom;
    const pageAnnots = state.annotations
      .filter((a) => a.page === pageNum)
      .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

    pageAnnots.forEach((ann) => {
      if (ann.type === 'highlighter') {
        drawStrokeOnCanvas(hlCtx, ann, s);
      } else if (ann.type === 'pen') {
        drawStrokeOnCanvas(penCtx, ann, s);
      } else if (ann.type === 'shape') {
        drawShapeOnCanvas(penCtx, ann, s);
      } else if (ann.type === 'text') {
        renderTextObject(objLayer, ann, s);
      } else if (ann.type === 'image') {
        renderImageObject(objLayer, ann, s);
      } else if (ann.type === 'note') {
        renderNoteObject(objLayer, ann, s);
      }
    });

    // Render Selection Bounding Box & Contextual Action Bar if selected objects are on this page
    renderSelectionOverlay(pageNum, objLayer, s);
  }

  function drawStrokeOnCanvas(ctx, ann, s) {
    if (!ann.points || ann.points.length === 0) return;
    ctx.save();
    ctx.globalAlpha = ann.opacity !== undefined ? ann.opacity : 1.0;
    ctx.strokeStyle = ann.color || '#7E1D2A';
    ctx.fillStyle = ann.color || '#7E1D2A';
    ctx.lineCap = ann.type === 'highlighter' ? 'butt' : 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = (ann.size || 4) * s;

    if (ann.rects && ann.rects.length > 0) {
      // Text-aware highlighter rects
      ann.rects.forEach((r) => {
        ctx.fillRect(r.x * s, r.y * s, r.w * s, r.h * s);
      });
      ctx.restore();
      return;
    }

    const pts = ann.points;
    ctx.beginPath();
    ctx.moveTo(pts[0].x * s, pts[0].y * s);
    if (pts.length === 1) {
      ctx.lineTo(pts[0].x * s + 0.5, pts[0].y * s + 0.5);
    } else if (pts.length === 2 || ann.mode === 'straight') {
      const last = pts[pts.length - 1];
      ctx.lineTo(last.x * s, last.y * s);
    } else {
      // Smooth Quadratic Midpoint Curve
      for (let i = 1; i < pts.length - 1; i++) {
        const midX = ((pts[i].x + pts[i + 1].x) / 2) * s;
        const midY = ((pts[i].y + pts[i + 1].y) / 2) * s;
        ctx.quadraticCurveTo(pts[i].x * s, pts[i].y * s, midX, midY);
      }
      const last = pts[pts.length - 1];
      ctx.lineTo(last.x * s, last.y * s);
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawShapeOnCanvas(ctx, ann, s) {
    ctx.save();
    ctx.globalAlpha = ann.opacity !== undefined ? ann.opacity : 1.0;
    ctx.strokeStyle = ann.color || '#7E1D2A';
    ctx.fillStyle = ann.color || '#7E1D2A';
    ctx.lineWidth = (ann.size || 3) * s;
    const x = (ann.x || 0) * s;
    const y = (ann.y || 0) * s;
    const w = (ann.w || 60) * s;
    const h = (ann.h || 40) * s;

    if (ann.shapeType === 'rect') {
      ctx.strokeRect(x, y, w, h);
    } else if (ann.shapeType === 'ellipse') {
      ctx.beginPath();
      ctx.ellipse(x + w / 2, y + h / 2, Math.abs(w / 2), Math.abs(h / 2), 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (ann.shapeType === 'line' || ann.shapeType === 'arrow') {
      const x1 = (ann.x1 !== undefined ? ann.x1 : ann.x) * s;
      const y1 = (ann.y1 !== undefined ? ann.y1 : ann.y) * s;
      const x2 = (ann.x2 !== undefined ? ann.x2 : ann.x + ann.w) * s;
      const y2 = (ann.y2 !== undefined ? ann.y2 : ann.y + ann.h) * s;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      if (ann.shapeType === 'arrow') {
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const headLen = 12 * s;
        ctx.beginPath();
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - headLen * Math.cos(angle - Math.PI / 6), y2 - headLen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(x2, y2);
        ctx.lineTo(x2 - headLen * Math.cos(angle + Math.PI / 6), y2 - headLen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ON-PAGE INTERACTIVE OBJECTS: TEXT, IMAGE (WITH CROP), STUDY NOTE
  // ══════════════════════════════════════════════════════════════════════════
  function renderTextObject(objLayer, ann, s) {
    const el = document.createElement('div');
    const isSelected = state.selectedIds.includes(ann.id);
    el.className = `kn-page-object kn-textbox-obj ${isSelected ? 'selected' : ''}`;
    el.dataset.id = ann.id;
    el.style.left = `${ann.x * s}px`;
    el.style.top = `${ann.y * s}px`;
    el.style.width = `${(ann.w || 200) * s}px`;
    el.style.minHeight = `${(ann.h || 36) * s}px`;
    el.style.opacity = ann.opacity !== undefined ? ann.opacity : 1;
    if (ann.rotation) el.style.transform = `rotate(${ann.rotation}deg)`;

    const editor = document.createElement('div');
    editor.className = 'kn-textbox-editor';
    editor.contentEditable = 'true';
    editor.dir = ann.dir || 'auto';
    editor.style.fontFamily = ann.fontFamily || state.text.fontFamily;
    editor.style.fontSize = `${(ann.fontSize || 16) * s}px`;
    editor.style.color = ann.color || '#1F1A17';
    editor.style.fontWeight = ann.bold ? '700' : '400';
    editor.style.fontStyle = ann.italic ? 'italic' : 'normal';
    editor.style.textDecoration = [ann.underline ? 'underline' : '', ann.strike ? 'line-through' : '']
      .filter(Boolean)
      .join(' ');
    editor.style.textAlign = ann.align || 'start';
    editor.style.lineHeight = ann.lineHeight || 1.45;
    editor.innerText = ann.text || '';

    editor.addEventListener('focus', () => {
      el.classList.add('editing');
      if (!state.selectedIds.includes(ann.id)) {
        state.selectedIds = [ann.id];
      }
    });

    editor.addEventListener('blur', () => {
      el.classList.remove('editing');
      const val = editor.innerText.trim();
      if (!val) {
        // Cancel/delete empty text box cleanly
        state.annotations = state.annotations.filter((a) => a.id !== ann.id);
        state.selectedIds = state.selectedIds.filter((id) => id !== ann.id);
      } else if (ann.text !== editor.innerText) {
        pushHistory();
        ann.text = editor.innerText;
      }
      saveAnnotations();
      renderPageAnnotations(ann.page);
      renderLeftSidebarContent();
    });

    makeObjectDraggable(el, ann);
    el.appendChild(editor);
    objLayer.appendChild(el);
  }

  function renderImageObject(objLayer, ann, s) {
    const el = document.createElement('div');
    const isSelected = state.selectedIds.includes(ann.id);
    el.className = `kn-page-object kn-image-obj ${isSelected ? 'selected' : ''}`;
    el.dataset.id = ann.id;
    el.style.left = `${ann.x * s}px`;
    el.style.top = `${ann.y * s}px`;
    el.style.width = `${(ann.w || 220) * s}px`;
    el.style.height = `${(ann.h || 160) * s}px`;
    if (ann.rotation) el.style.transform = `rotate(${ann.rotation}deg)`;

    const img = document.createElement('img');
    img.src = ann.displaySrc || ann.src;
    img.alt = 'Study Image';
    el.appendChild(img);

    // Interactive Crop Mode Overlay
    if (state.croppingId === ann.id) {
      const cropRect = state.cropRect || { x: 0.1, y: 0.1, w: 0.8, h: 0.8 };
      state.cropRect = cropRect;
      const overlay = document.createElement('div');
      overlay.className = 'kn-crop-overlay';
      const box = document.createElement('div');
      box.className = 'kn-crop-box';
      box.style.left = `${cropRect.x * 100}%`;
      box.style.top = `${cropRect.y * 100}%`;
      box.style.width = `${cropRect.w * 100}%`;
      box.style.height = `${cropRect.h * 100}%`;
      overlay.appendChild(box);
      el.appendChild(overlay);
    }

    makeObjectDraggable(el, ann);
    objLayer.appendChild(el);
  }

  function renderNoteObject(objLayer, ann, s) {
    const el = document.createElement('div');
    const isSelected = state.selectedIds.includes(ann.id);
    el.className = `kn-page-object kn-note-obj ${ann.collapsed ? 'collapsed' : ''} ${isSelected ? 'selected' : ''}`;
    el.dataset.id = ann.id;
    el.style.left = `${ann.x * s}px`;
    el.style.top = `${ann.y * s}px`;
    el.style.width = `${(ann.w || 210) * s}px`;
    el.style.height = `${(ann.h || 145) * s}px`;
    el.style.background = ann.color || '#FEF3C7';

    if (ann.collapsed) {
      el.title = `${ann.category || 'Note'}: ${ann.title || ann.text || ''}`;
      el.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7E1D2A" stroke-width="2.2"><path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"/><path d="M15 3v6h6"/></svg>`;
      el.addEventListener('dblclick', (e) => {
        e.stopPropagation();
        ann.collapsed = false;
        saveAnnotations();
        renderPageAnnotations(ann.page);
      });
    } else {
      el.innerHTML = `
        <div class="kn-note-header">
          <span style="color:#7E1D2A;">${escapeHtml(ann.category || 'Important')}</span>
          <div style="display:flex;align-items:center;gap:4px;">
            <button class="kn-note-pin-btn" title="Pin Note" style="border:none;background:transparent;cursor:pointer;font-size:0.75rem;opacity:${ann.pinned ? '1' : '0.4'};">📌</button>
            <button class="kn-note-collapse-btn" title="Minimize to Compact Icon" style="border:none;background:transparent;cursor:pointer;font-size:0.75rem;">—</button>
            <button class="kn-note-del-btn" title="Delete Note" style="border:none;background:transparent;cursor:pointer;font-size:0.75rem;color:#DC2626;">✕</button>
          </div>
        </div>
        <input type="text" class="kn-note-title-input" dir="auto" placeholder="Note Title (optional)..." value="${escapeHtml(ann.title || '')}" />
        <textarea class="kn-note-body-input" dir="auto" placeholder="Write study note...">${escapeHtml(ann.text || '')}</textarea>
      `;

      const titleInp = el.querySelector('.kn-note-title-input');
      const bodyInp = el.querySelector('.kn-note-body-input');
      titleInp.addEventListener('change', () => {
        pushHistory();
        ann.title = titleInp.value;
        ann.updatedAt = Date.now();
        saveAnnotations();
        if (state.rightTab === 'notes') renderRightSidebarContent();
      });
      bodyInp.addEventListener('change', () => {
        pushHistory();
        ann.text = bodyInp.value;
        ann.updatedAt = Date.now();
        saveAnnotations();
        if (state.rightTab === 'notes') renderRightSidebarContent();
      });
      el.querySelector('.kn-note-pin-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        ann.pinned = !ann.pinned;
        saveAnnotations();
        renderPageAnnotations(ann.page);
        if (state.rightTab === 'notes') renderRightSidebarContent();
      });
      el.querySelector('.kn-note-collapse-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        ann.collapsed = true;
        saveAnnotations();
        renderPageAnnotations(ann.page);
      });
      el.querySelector('.kn-note-del-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        pushHistory();
        state.annotations = state.annotations.filter((a) => a.id !== ann.id);
        saveAnnotations();
        renderPageAnnotations(ann.page);
        renderRightSidebarContent();
        renderLeftSidebarContent();
      });
    }

    makeObjectDraggable(el, ann);
    objLayer.appendChild(el);
  }

  function makeObjectDraggable(el, ann) {
    el.addEventListener('pointerdown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable || e.target.tagName === 'BUTTON') {
        return;
      }
      e.stopPropagation();
      if (e.shiftKey) {
        if (state.selectedIds.includes(ann.id)) {
          state.selectedIds = state.selectedIds.filter((id) => id !== ann.id);
        } else {
          state.selectedIds.push(ann.id);
        }
      } else if (!state.selectedIds.includes(ann.id)) {
        state.selectedIds = [ann.id];
      }
      renderPageAnnotations(ann.page);

      const startX = e.clientX;
      const startY = e.clientY;
      const origX = ann.x;
      const origY = ann.y;
      let moved = false;

      const onMove = (me) => {
        const dx = (me.clientX - startX) / state.zoom;
        const dy = (me.clientY - startY) / state.zoom;
        if (Math.abs(dx) > 2 || Math.abs(dy) > 2) moved = true;
        ann.x = Math.max(0, Math.min(BASE_W - 20, origX + dx));
        ann.y = Math.max(0, Math.min(BASE_H - 20, origY + dy));
        el.style.left = `${ann.x * state.zoom}px`;
        el.style.top = `${ann.y * state.zoom}px`;
      };

      const onUp = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        if (moved) {
          pushHistory();
          saveAnnotations();
          renderPageAnnotations(ann.page);
        }
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SELECTION BOUNDING BOX, RESIZE/ROTATE HANDLES & CONTEXTUAL ACTION BAR
  // ══════════════════════════════════════════════════════════════════════════
  function getAnnotationBounds(ann) {
    if (ann.points && ann.points.length > 0) {
      const xs = ann.points.map((p) => p.x);
      const ys = ann.points.map((p) => p.y);
      const minX = Math.min(...xs);
      const minY = Math.min(...ys);
      const maxX = Math.max(...xs);
      const maxY = Math.max(...ys);
      return { x: minX - 4, y: minY - 4, w: Math.max(16, maxX - minX + 8), h: Math.max(16, maxY - minY + 8) };
    }
    return { x: ann.x || 0, y: ann.y || 0, w: ann.w || 160, h: ann.h || 90 };
  }

  function renderSelectionOverlay(pageNum, objLayer, s) {
    const selectedOnPage = state.annotations.filter(
      (a) => a.page === pageNum && state.selectedIds.includes(a.id)
    );
    if (selectedOnPage.length === 0) return;

    const boundsList = selectedOnPage.map(getAnnotationBounds);
    const minX = Math.min(...boundsList.map((b) => b.x));
    const minY = Math.min(...boundsList.map((b) => b.y));
    const maxX = Math.max(...boundsList.map((b) => b.x + b.w));
    const maxY = Math.max(...boundsList.map((b) => b.y + b.h));
    const boxW = Math.max(24, maxX - minX);
    const boxH = Math.max(24, maxY - minY);

    const selBox = document.createElement('div');
    selBox.className = 'kn-selection-box';
    selBox.style.left = `${minX * s}px`;
    selBox.style.top = `${minY * s}px`;
    selBox.style.width = `${boxW * s}px`;
    selBox.style.height = `${boxH * s}px`;

    // 8 Resize Handles + 1 Rotation Handle
    ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w', 'rot'].forEach((dir) => {
      const h = document.createElement('div');
      h.className = `kn-sel-handle ${dir}`;
      h.dataset.handle = dir;
      h.addEventListener('pointerdown', (e) => {
        e.stopPropagation();
        startResizeOrRotateSelection(e, dir, selectedOnPage, { x: minX, y: minY, w: boxW, h: boxH }, pageNum);
      });
      selBox.appendChild(h);
    });

    // Dragging inside selection box moves all selected items together
    selBox.addEventListener('pointerdown', (e) => {
      if (e.target.dataset.handle) return;
      e.stopPropagation();
      const startX = e.clientX;
      const startY = e.clientY;
      const snapshots = JSON.parse(JSON.stringify(selectedOnPage));
      pushHistory();

      const onMove = (me) => {
        const dx = (me.clientX - startX) / s;
        const dy = (me.clientY - startY) / s;
        selectedOnPage.forEach((ann, idx) => {
          const snap = snapshots[idx];
          if (snap.points) {
            ann.points = snap.points.map((pt) => ({ x: pt.x + dx, y: pt.y + dy }));
          } else {
            ann.x = (snap.x || 0) + dx;
            ann.y = (snap.y || 0) + dy;
          }
        });
        renderPageAnnotations(pageNum);
      };
      const onUp = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        saveAnnotations();
      };
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    });

    objLayer.appendChild(selBox);

    // Floating Contextual Quick Action Bar above or below selection
    const ctxBar = document.createElement('div');
    ctxBar.className = 'kn-context-bar open';
    ctxBar.style.left = `${(minX + boxW / 2) * s}px`;
    ctxBar.style.top = `${Math.max(8, minY * s - 42)}px`;

    const singleImg = selectedOnPage.length === 1 && selectedOnPage[0].type === 'image' ? selectedOnPage[0] : null;

    if (singleImg && state.croppingId === singleImg.id) {
      ctxBar.innerHTML = `
        <button class="kn-ctx-btn" data-ctx="apply-crop" style="color:#15803D;">✓ Apply Crop</button>
        <button class="kn-ctx-btn danger" data-ctx="cancel-crop">✕ Cancel</button>
      `;
    } else {
      ctxBar.innerHTML = `
        ${singleImg ? `<button class="kn-ctx-btn" data-ctx="crop">Crop</button><button class="kn-ctx-btn" data-ctx="rot-left">↺</button><button class="kn-ctx-btn" data-ctx="rot-right">↻</button>` : ''}
        <button class="kn-ctx-btn" data-ctx="copy">Copy</button>
        <button class="kn-ctx-btn" data-ctx="cut">Cut</button>
        <button class="kn-ctx-btn" data-ctx="duplicate">Duplicate</button>
        ${selectedOnPage.length > 1 ? `<button class="kn-ctx-btn" data-ctx="group">Group</button>` : ''}
        <button class="kn-ctx-btn" data-ctx="front">↑ Front</button>
        <button class="kn-ctx-btn" data-ctx="back">↓ Back</button>
        <button class="kn-ctx-btn danger" data-ctx="delete">Delete</button>
      `;
    }

    ctxBar.addEventListener('click', (e) => {
      e.stopPropagation();
      const btn = e.target.closest('[data-ctx]');
      if (!btn) return;
      handleContextAction(btn.dataset.ctx, selectedOnPage, pageNum);
    });

    objLayer.appendChild(ctxBar);
  }

  function startResizeOrRotateSelection(e, handle, selectedItems, initBox, pageNum) {
    const startX = e.clientX;
    const startY = e.clientY;
    const s = state.zoom;
    const snapshots = JSON.parse(JSON.stringify(selectedItems));
    pushHistory();

    const onMove = (me) => {
      const dx = (me.clientX - startX) / s;
      const dy = (me.clientY - startY) / s;

      if (handle === 'rot') {
        const cx = initBox.x + initBox.w / 2;
        const cy = initBox.y + initBox.h / 2;
        const angle = Math.round((Math.atan2(me.clientY / s - cy, me.clientX / s - cx) * 180) / Math.PI);
        selectedItems.forEach((ann) => {
          ann.rotation = angle;
        });
      } else {
        const scaleX = Math.max(0.25, (initBox.w + (handle.includes('e') ? dx : handle.includes('w') ? -dx : 0)) / initBox.w);
        const scaleY = Math.max(0.25, (initBox.h + (handle.includes('s') ? dy : handle.includes('n') ? -dy : 0)) / initBox.h);
        selectedItems.forEach((ann, idx) => {
          const snap = snapshots[idx];
          if (snap.points) {
            ann.points = snap.points.map((pt) => ({
              x: initBox.x + (pt.x - initBox.x) * scaleX,
              y: initBox.y + (pt.y - initBox.y) * scaleY,
            }));
          } else {
            ann.w = Math.max(30, (snap.w || 160) * scaleX);
            ann.h = Math.max(24, (snap.h || 90) * scaleY);
          }
        });
      }
      renderPageAnnotations(pageNum);
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      saveAnnotations();
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  }

  function handleContextAction(action, selectedItems, pageNum) {
    if (action === 'copy') {
      state.clipboard = JSON.parse(JSON.stringify(selectedItems));
    } else if (action === 'cut') {
      pushHistory();
      state.clipboard = JSON.parse(JSON.stringify(selectedItems));
      state.annotations = state.annotations.filter((a) => !state.selectedIds.includes(a.id));
      state.selectedIds = [];
    } else if (action === 'duplicate') {
      pushHistory();
      const clones = selectedItems.map((item) => {
        const copy = JSON.parse(JSON.stringify(item));
        copy.id = `kn_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        if (copy.points) {
          copy.points = copy.points.map((pt) => ({ x: pt.x + 18, y: pt.y + 18 }));
        } else {
          copy.x = (copy.x || 0) + 18;
          copy.y = (copy.y || 0) + 18;
        }
        return copy;
      });
      state.annotations.push(...clones);
      state.selectedIds = clones.map((c) => c.id);
    } else if (action === 'delete') {
      pushHistory();
      state.annotations = state.annotations.filter((a) => !state.selectedIds.includes(a.id));
      state.selectedIds = [];
    } else if (action === 'front') {
      pushHistory();
      const maxZ = Math.max(0, ...state.annotations.map((a) => a.zIndex || 0));
      selectedItems.forEach((a) => (a.zIndex = maxZ + 1));
    } else if (action === 'back') {
      pushHistory();
      const minZ = Math.min(0, ...state.annotations.map((a) => a.zIndex || 0));
      selectedItems.forEach((a) => (a.zIndex = minZ - 1));
    } else if (action === 'rot-left') {
      pushHistory();
      selectedItems.forEach((a) => (a.rotation = ((a.rotation || 0) - 90) % 360));
    } else if (action === 'rot-right') {
      pushHistory();
      selectedItems.forEach((a) => (a.rotation = ((a.rotation || 0) + 90) % 360));
    } else if (action === 'crop' && selectedItems[0]) {
      state.croppingId = selectedItems[0].id;
      state.cropRect = { x: 0.1, y: 0.1, w: 0.8, h: 0.8 };
    } else if (action === 'cancel-crop') {
      state.croppingId = null;
      state.cropRect = null;
    } else if (action === 'apply-crop' && selectedItems[0]) {
      applyImageCrop(selectedItems[0], state.cropRect, pageNum);
      return;
    }
    saveAnnotations();
    renderPageAnnotations(pageNum);
    renderLeftSidebarContent();
    if (state.rightTab === 'notes') renderRightSidebarContent();
  }

  function applyImageCrop(imgAnn, cropRect, pageNum) {
    if (!cropRect) return;
    const image = new Image();
    image.onload = () => {
      const c = document.createElement('canvas');
      const sx = image.width * cropRect.x;
      const sy = image.height * cropRect.y;
      const sw = image.width * cropRect.w;
      const sh = image.height * cropRect.h;
      c.width = Math.max(20, sw);
      c.height = Math.max(20, sh);
      c.getContext('2d').drawImage(image, sx, sy, sw, sh, 0, 0, c.width, c.height);
      pushHistory();
      imgAnn.displaySrc = c.toDataURL('image/png');
      imgAnn.w = Math.max(40, imgAnn.w * cropRect.w);
      imgAnn.h = Math.max(40, imgAnn.h * cropRect.h);
      state.croppingId = null;
      state.cropRect = null;
      saveAnnotations();
      renderPageAnnotations(pageNum);
    };
    image.src = imgAnn.src;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // PAGE INTERACTION HANDLER (Drawing, Erasing, Selection Marquee/Lasso, Click-to-Add)
  // ══════════════════════════════════════════════════════════════════════════
  function bindPageInteraction(card, pageNum) {
    const interactLayer = card.querySelector('.kn-interaction-layer');
    if (!interactLayer) return;

    const toPageCoords = (e) => {
      const rect = card.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left) / state.zoom,
        y: (e.clientY - rect.top) / state.zoom,
      };
    };

    interactLayer.addEventListener('pointerdown', (e) => {
      if (!state.activeTool) return;
      // Palm rejection: if stylus is active or multi-touch, ignore stray palm touches
      if (e.pointerType === 'touch' && !e.isPrimary) return;

      const startPt = toPageCoords(e);

      // 1. TEXT TOOL: Click on page to create inline editable text box
      if (state.activeTool === 'text') {
        pushHistory();
        const newText = {
          id: `kn_txt_${Date.now()}`,
          type: 'text',
          page: pageNum,
          x: Math.max(20, Math.min(BASE_W - 220, startPt.x)),
          y: Math.max(20, Math.min(BASE_H - 60, startPt.y)),
          w: 220,
          h: 40,
          text: '',
          ...state.text,
          createdAt: Date.now(),
        };
        state.annotations.push(newText);
        state.selectedIds = [newText.id];
        renderPageAnnotations(pageNum);
        setTimeout(() => {
          const domEl = card.querySelector(`[data-id="${newText.id}"] .kn-textbox-editor`);
          if (domEl) domEl.focus();
        }, 20);
        return;
      }

      // 2. NOTES TOOL: Click on page to create structured Study Note card
      if (state.activeTool === 'notes') {
        pushHistory();
        const newNote = {
          id: `kn_note_${Date.now()}`,
          type: 'note',
          page: pageNum,
          x: Math.max(20, Math.min(BASE_W - 220, startPt.x)),
          y: Math.max(20, Math.min(BASE_H - 160, startPt.y)),
          w: 215,
          h: 150,
          title: '',
          text: '',
          color: state.notesConfig.color,
          category: state.notesConfig.category,
          pinned: false,
          collapsed: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        state.annotations.push(newNote);
        state.selectedIds = [newNote.id];
        saveAnnotations();
        renderPageAnnotations(pageNum);
        renderRightSidebarContent();
        renderLeftSidebarContent();
        setTimeout(() => {
          const inp = card.querySelector(`[data-id="${newNote.id}"] .kn-note-title-input`);
          if (inp) inp.focus();
        }, 20);
        return;
      }

      // 3. IMAGE TOOL: Open file picker to place image at clicked spot
      if (state.activeTool === 'image') {
        state._pendingImageTarget = { page: pageNum, x: startPt.x, y: startPt.y };
        const fileInput = document.getElementById('kn-image-file-input');
        if (fileInput) fileInput.click();
        return;
      }

      // 4. HIGHLIGHTER / PEN TOOL
      if (state.activeTool === 'highlighter' || state.activeTool === 'pen') {
        pushHistory();
        const cfg = state.activeTool === 'highlighter' ? state.highlighter : state.pen;
        const stroke = {
          id: `kn_${state.activeTool}_${Date.now()}`,
          type: state.activeTool,
          mode: cfg.mode,
          page: pageNum,
          color: cfg.color,
          size: cfg.size,
          opacity: cfg.opacity,
          points: [startPt],
          createdAt: Date.now(),
        };
        state.annotations.push(stroke);

        const onMove = (me) => {
          const pt = toPageCoords(me);
          if (cfg.mode === 'straight') {
            stroke.points = [startPt, pt];
          } else {
            stroke.points.push(pt);
          }
          renderPageAnnotations(pageNum);
        };
        const onUp = () => {
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onUp);
          saveAnnotations();
          renderLeftSidebarContent();
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        return;
      }

      // 5. SHAPES TOOL
      if (state.activeTool === 'shapes') {
        pushHistory();
        const shape = {
          id: `kn_shape_${Date.now()}`,
          type: 'shape',
          shapeType: state.shapes.shapeType,
          page: pageNum,
          color: state.shapes.color,
          size: state.shapes.size,
          opacity: state.shapes.opacity,
          x: startPt.x,
          y: startPt.y,
          w: 1,
          h: 1,
          x1: startPt.x,
          y1: startPt.y,
          x2: startPt.x,
          y2: startPt.y,
          createdAt: Date.now(),
        };
        state.annotations.push(shape);

        const onMove = (me) => {
          const pt = toPageCoords(me);
          shape.x = Math.min(startPt.x, pt.x);
          shape.y = Math.min(startPt.y, pt.y);
          shape.w = Math.abs(pt.x - startPt.x);
          shape.h = Math.abs(pt.y - startPt.y);
          shape.x2 = pt.x;
          shape.y2 = pt.y;
          renderPageAnnotations(pageNum);
        };
        const onUp = () => {
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onUp);
          saveAnnotations();
          renderLeftSidebarContent();
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        return;
      }

      // 6. ERASER TOOL (Stroke, Object, and Partial Path-Splitting Eraser)
      if (state.activeTool === 'eraser') {
        pushHistory();
        eraseAtPoint(pageNum, startPt);

        const onMove = (me) => {
          updateEraserCursor(me);
          eraseAtPoint(pageNum, toPageCoords(me));
        };
        const onUp = () => {
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onUp);
          const cur = document.getElementById('kn-eraser-cursor');
          if (cur) cur.style.display = 'none';
          saveAnnotations();
          renderLeftSidebarContent();
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        return;
      }

      // 7. SELECTION / LASSO TOOL (Click, Rectangle Marquee, Freehand Lasso)
      if (state.activeTool === 'select') {
        const hit = findAnnotationAtPoint(pageNum, startPt);
        if (hit) {
          if (e.shiftKey) {
            state.selectedIds = state.selectedIds.includes(hit.id)
              ? state.selectedIds.filter((id) => id !== hit.id)
              : [...state.selectedIds, hit.id];
          } else {
            state.selectedIds = [hit.id];
          }
          renderPageAnnotations(pageNum);
          return;
        }

        // Deselect if clicking empty space without Shift
        if (!e.shiftKey) state.selectedIds = [];
        const lassoPts = [startPt];
        const penCanvas = document.getElementById(`kn-annot-canvas-${pageNum}`);
        const ctx = penCanvas.getContext('2d');

        const onMove = (me) => {
          const pt = toPageCoords(me);
          lassoPts.push(pt);
          renderPageAnnotations(pageNum);
          ctx.save();
          ctx.strokeStyle = '#7E1D2A';
          ctx.fillStyle = 'rgba(126, 29, 42, 0.06)';
          ctx.setLineDash([5, 4]);
          ctx.lineWidth = 1.5;
          if (state.selectionMode === 'lasso') {
            ctx.beginPath();
            ctx.moveTo(lassoPts[0].x * state.zoom, lassoPts[0].y * state.zoom);
            lassoPts.forEach((p) => ctx.lineTo(p.x * state.zoom, p.y * state.zoom));
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          } else {
            const rx = Math.min(startPt.x, pt.x) * state.zoom;
            const ry = Math.min(startPt.y, pt.y) * state.zoom;
            const rw = Math.abs(pt.x - startPt.x) * state.zoom;
            const rh = Math.abs(pt.y - startPt.y) * state.zoom;
            ctx.fillRect(rx, ry, rw, rh);
            ctx.strokeRect(rx, ry, rw, rh);
          }
          ctx.restore();
        };

        const onUp = () => {
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onUp);
          selectAnnotationsInRegion(pageNum, lassoPts);
          renderPageAnnotations(pageNum);
        };

        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
      }
    });
  }

  function matchesSelectionFilter(ann) {
    const f = state.selectionFilter;
    if (f === 'all') return true;
    if (f === 'handwriting') return ann.type === 'pen' || ann.type === 'highlighter';
    return ann.type === f;
  }

  function findAnnotationAtPoint(pageNum, pt) {
    const candidates = state.annotations.filter((a) => a.page === pageNum && matchesSelectionFilter(a));
    for (let i = candidates.length - 1; i >= 0; i--) {
      const a = candidates[i];
      const b = getAnnotationBounds(a);
      if (pt.x >= b.x && pt.x <= b.x + b.w && pt.y >= b.y && pt.y <= b.y + b.h) {
        return a;
      }
    }
    return null;
  }

  function selectAnnotationsInRegion(pageNum, pts) {
    if (pts.length < 2) return;
    const minX = Math.min(...pts.map((p) => p.x));
    const minY = Math.min(...pts.map((p) => p.y));
    const maxX = Math.max(...pts.map((p) => p.x));
    const maxY = Math.max(...pts.map((p) => p.y));

    const matched = state.annotations.filter((a) => {
      if (a.page !== pageNum || !matchesSelectionFilter(a)) return false;
      const b = getAnnotationBounds(a);
      const cx = b.x + b.w / 2;
      const cy = b.y + b.h / 2;
      if (state.selectionMode === 'lasso' && pts.length > 3) {
        return pointInPolygon({ x: cx, y: cy }, pts);
      }
      return b.x < maxX && b.x + b.w > minX && b.y < maxY && b.y + b.h > minY;
    });
    state.selectedIds = matched.map((m) => m.id);
  }

  function pointInPolygon(pt, vs) {
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      const xi = vs[i].x, yi = vs[i].y;
      const xj = vs[j].x, yj = vs[j].y;
      const intersect = yi > pt.y !== yj > pt.y && pt.x < ((xj - xi) * (pt.y - yi)) / (yj - yi + 0.00001) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ERASER ENGINE (Stroke, Object, and Partial Path-Splitting)
  // ══════════════════════════════════════════════════════════════════════════
  function updateEraserCursor(e) {
    const cur = document.getElementById('kn-eraser-cursor');
    if (!cur) return;
    const d = state.eraser.size * state.zoom;
    cur.style.width = `${d}px`;
    cur.style.height = `${d}px`;
    cur.style.left = `${e.clientX}px`;
    cur.style.top = `${e.clientY}px`;
    cur.style.display = 'block';
  }

  function eraseAtPoint(pageNum, pt) {
    const radius = state.eraser.size / 2;
    const mode = state.eraser.mode; // 'stroke' | 'object' | 'partial'
    const nextAnnots = [];
    let changed = false;

    for (const ann of state.annotations) {
      if (ann.page !== pageNum) {
        nextAnnots.push(ann);
        continue;
      }

      if (ann.points && ann.points.length > 0) {
        if (mode === 'partial' && ann.mode !== 'straight') {
          // Split stroke points into remaining sub-segments outside eraser radius
          let currentSeg = [];
          let hitAny = false;
          for (const p of ann.points) {
            const dist = Math.hypot(p.x - pt.x, p.y - pt.y);
            if (dist <= radius) {
              hitAny = true;
              if (currentSeg.length >= 2) {
                nextAnnots.push({
                  ...ann,
                  id: `kn_${ann.type}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
                  points: currentSeg,
                });
              }
              currentSeg = [];
            } else {
              currentSeg.push(p);
            }
          }
          if (hitAny) {
            changed = true;
            if (currentSeg.length >= 2) {
              nextAnnots.push({
                ...ann,
                id: `kn_${ann.type}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
                points: currentSeg,
              });
            }
          } else {
            nextAnnots.push(ann);
          }
        } else {
          // Stroke or Object eraser: remove entire stroke if any point is within radius
          const hit = ann.points.some((p) => Math.hypot(p.x - pt.x, p.y - pt.y) <= radius + (ann.size || 4) / 2);
          if (hit) {
            changed = true;
          } else {
            nextAnnots.push(ann);
          }
        }
      } else if (mode === 'object') {
        const b = getAnnotationBounds(ann);
        const hit = pt.x >= b.x - radius && pt.x <= b.x + b.w + radius && pt.y >= b.y - radius && pt.y <= b.y + b.h + radius;
        if (hit) {
          changed = true;
        } else {
          nextAnnots.push(ann);
        }
      } else {
        nextAnnots.push(ann);
      }
    }

    if (changed) {
      state.annotations = nextAnnots;
      renderPageAnnotations(pageNum);
    }
  }

  // Text-Selection Auto-Highlighting when Highlighter tool is active
  document.addEventListener('selectionchange', () => {});
  pagesContainer.addEventListener('pointerup', () => {
    if (state.activeTool !== 'highlighter') return;
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const card = range.startContainer.parentElement?.closest('.kn-page-card');
    if (!card) return;
    const pageNum = parseInt(card.dataset.page, 10);
    const cardRect = card.getBoundingClientRect();
    const clientRects = Array.from(range.getClientRects());
    if (clientRects.length === 0) return;

    const rects = clientRects.map((r) => ({
      x: (r.left - cardRect.left) / state.zoom,
      y: (r.top - cardRect.top) / state.zoom,
      w: r.width / state.zoom,
      h: r.height / state.zoom,
    }));

    pushHistory();
    state.annotations.push({
      id: `kn_hl_txt_${Date.now()}`,
      type: 'highlighter',
      mode: 'text',
      page: pageNum,
      color: state.highlighter.color,
      size: state.highlighter.size,
      opacity: state.highlighter.opacity,
      rects,
      points: [{ x: rects[0].x, y: rects[0].y }],
      createdAt: Date.now(),
    });
    sel.removeAllRanges();
    saveAnnotations();
    renderPageAnnotations(pageNum);
    renderLeftSidebarContent();
  });

  // ══════════════════════════════════════════════════════════════════════════
  // FLOATING TOOL CONTROL PANELS (Highlighter, Pen, Eraser, Shapes, Text, Select, Notes)
  // ══════════════════════════════════════════════════════════════════════════
  const toolPopover = document.getElementById('kn-tool-popover');

  function renderToolPopover() {
    if (!toolPopover) return;
    const tool = state.activeTool;
    if (!tool || !state.toolPopoverOpen || tool === 'ai') {
      toolPopover.classList.remove('open');
      return;
    }

    toolPopover.classList.add('open');

    if (tool === 'highlighter') {
      const hl = state.highlighter;
      const colors = ['#FACC15', '#4ADE80', '#38BDF8', '#F472B6', '#FB923C', '#C084FC'];
      toolPopover.innerHTML = `
        <div class="kn-popover-header">
          <span>Highlighter — Under-Text Multiply</span>
          <button class="kn-icon-btn" id="kn-close-popover" style="width:22px;height:22px;">✕</button>
        </div>
        <div class="kn-live-preview-box">
          <span class="kn-hl-preview-sample" style="background:${hexToRgba(hl.color, hl.opacity)};">Oral Pathology Study Highlight</span>
        </div>
        <div class="kn-segmented-control">
          <button class="kn-seg-btn ${hl.mode === 'freehand' ? 'active' : ''}" data-hl-mode="freehand">Freehand</button>
          <button class="kn-seg-btn ${hl.mode === 'straight' ? 'active' : ''}" data-hl-mode="straight">Straight Line</button>
        </div>
        <div class="kn-popover-row">
          <span class="kn-popover-label">Color</span>
          <div class="kn-swatch-row">
            ${colors.map((c) => `<button class="kn-color-swatch ${hl.color === c ? 'active' : ''}" data-hl-color="${c}" style="background:${c};"></button>`).join('')}
          </div>
        </div>
        <div class="kn-slider-row">
          <span class="kn-popover-label">Size</span>
          <input type="range" id="kn-hl-size" min="10" max="44" value="${hl.size}" />
          <span class="kn-slider-val">${hl.size}px</span>
        </div>
        <div class="kn-slider-row">
          <span class="kn-popover-label">Opacity</span>
          <input type="range" id="kn-hl-opacity" min="15" max="80" value="${Math.round(hl.opacity * 100)}" />
          <span class="kn-slider-val">${Math.round(hl.opacity * 100)}%</span>
        </div>
        <div class="kn-popover-row" style="border-top:1px solid var(--kn-border-subtle);padding-top:6px;">
          <span class="kn-popover-label">Presets</span>
          <button class="kn-ctx-btn" id="kn-hl-add-preset" style="color:var(--kn-primary);">+ Save Preset</button>
        </div>
        <div class="kn-presets-strip">
          ${hl.presets
            .map(
              (p) => `
            <div class="kn-preset-chip ${hl.activePresetId === p.id ? 'active' : ''}" data-hl-preset="${p.id}">
              <span class="kn-tool-color-dot" style="background:${p.color};"></span>
              <span>${escapeHtml(p.name)}</span>
              <span class="kn-preset-del" data-hl-del-preset="${p.id}" title="Delete Preset">×</span>
            </div>`
            )
            .join('')}
        </div>
      `;
    } else if (tool === 'pen') {
      const pen = state.pen;
      const colors = ['#1F1A17', '#7E1D2A', '#DC2626', '#1D4ED8', '#15803D', '#7E22CE', '#EA580C'];
      toolPopover.innerHTML = `
        <div class="kn-popover-header">
          <span>Pen Tool — Smooth Academic Ink</span>
          <button class="kn-icon-btn" id="kn-close-popover" style="width:22px;height:22px;">✕</button>
        </div>
        <div class="kn-segmented-control">
          <button class="kn-seg-btn ${pen.mode === 'freehand' ? 'active' : ''}" data-pen-mode="freehand">Freehand</button>
          <button class="kn-seg-btn ${pen.mode === 'straight' ? 'active' : ''}" data-pen-mode="straight">Straight Line</button>
        </div>
        <div class="kn-popover-row">
          <span class="kn-popover-label">Ink</span>
          <div class="kn-swatch-row">
            ${colors.map((c) => `<button class="kn-color-swatch ${pen.color === c ? 'active' : ''}" data-pen-color="${c}" style="background:${c};"></button>`).join('')}
          </div>
        </div>
        <div class="kn-slider-row">
          <span class="kn-popover-label">Width</span>
          <input type="range" id="kn-pen-size" min="1" max="18" value="${pen.size}" />
          <span class="kn-slider-val">${pen.size}px</span>
        </div>
        <div class="kn-slider-row">
          <span class="kn-popover-label">Opacity</span>
          <input type="range" id="kn-pen-opacity" min="20" max="100" value="${Math.round(pen.opacity * 100)}" />
          <span class="kn-slider-val">${Math.round(pen.opacity * 100)}%</span>
        </div>
        <div class="kn-popover-row" style="border-top:1px solid var(--kn-border-subtle);padding-top:6px;">
          <span class="kn-popover-label">Presets</span>
          <button class="kn-ctx-btn" id="kn-pen-add-preset" style="color:var(--kn-primary);">+ Save Preset</button>
        </div>
        <div class="kn-presets-strip">
          ${pen.presets
            .map(
              (p) => `
            <div class="kn-preset-chip ${pen.activePresetId === p.id ? 'active' : ''}" data-pen-preset="${p.id}">
              <span class="kn-tool-color-dot" style="background:${p.color};"></span>
              <span>${escapeHtml(p.name)} (${p.size}px)</span>
              <span class="kn-preset-del" data-pen-del-preset="${p.id}">×</span>
            </div>`
            )
            .join('')}
        </div>
      `;
    } else if (tool === 'eraser') {
      const er = state.eraser;
      toolPopover.innerHTML = `
        <div class="kn-popover-header">
          <span>Eraser — Annotations Only (PDF Safe)</span>
          <button class="kn-icon-btn" id="kn-close-popover" style="width:22px;height:22px;">✕</button>
        </div>
        <div class="kn-segmented-control">
          <button class="kn-seg-btn ${er.mode === 'stroke' ? 'active' : ''}" data-er-mode="stroke">Stroke (الضربة)</button>
          <button class="kn-seg-btn ${er.mode === 'object' ? 'active' : ''}" data-er-mode="object">Object (العنصر)</button>
          <button class="kn-seg-btn ${er.mode === 'partial' ? 'active' : ''}" data-er-mode="partial">Partial (جزئي)</button>
        </div>
        <div class="kn-slider-row">
          <span class="kn-popover-label">Size</span>
          <input type="range" id="kn-er-size" min="8" max="64" value="${er.size}" />
          <span class="kn-slider-val">${er.size} px</span>
        </div>
        <div class="kn-eraser-quick-row">
          <button class="kn-eraser-size-btn ${er.size <= 14 ? 'active' : ''}" data-er-quick="12">
            <span style="width:8px;height:8px;border-radius:50%;background:currentColor;display:inline-block;"></span>
            <span>Small (صغير)</span>
          </button>
          <button class="kn-eraser-size-btn ${er.size > 14 && er.size < 34 ? 'active' : ''}" data-er-quick="24">
            <span style="width:14px;height:14px;border-radius:50%;background:currentColor;display:inline-block;"></span>
            <span>Medium (متوسط)</span>
          </button>
          <button class="kn-eraser-size-btn ${er.size >= 34 ? 'active' : ''}" data-er-quick="42">
            <span style="width:20px;height:20px;border-radius:50%;background:currentColor;display:inline-block;"></span>
            <span>Large (كبير)</span>
          </button>
        </div>
      `;
    } else if (tool === 'select') {
      const filters = ['all', 'handwriting', 'pen', 'highlighter', 'shape', 'image', 'text', 'note'];
      toolPopover.innerHTML = `
        <div class="kn-popover-header">
          <span>Selection & Lasso Tool</span>
          <button class="kn-icon-btn" id="kn-close-popover" style="width:22px;height:22px;">✕</button>
        </div>
        <div class="kn-segmented-control">
          <button class="kn-seg-btn ${state.selectionMode === 'rect' ? 'active' : ''}" data-sel-mode="rect">Rectangle</button>
          <button class="kn-seg-btn ${state.selectionMode === 'lasso' ? 'active' : ''}" data-sel-mode="lasso">Freehand Lasso</button>
        </div>
        <div class="kn-popover-label">Select Target Filter</div>
        <div class="kn-presets-strip" style="flex-wrap:wrap;">
          ${filters
            .map(
              (f) => `<button class="kn-preset-chip ${state.selectionFilter === f ? 'active' : ''}" data-sel-filter="${f}">${f.charAt(0).toUpperCase() + f.slice(1)}</button>`
            )
            .join('')}
        </div>
      `;
    } else if (tool === 'shapes') {
      const sh = state.shapes;
      const types = [
        { id: 'rect', label: 'Rectangle' },
        { id: 'ellipse', label: 'Circle' },
        { id: 'line', label: 'Line' },
        { id: 'arrow', label: 'Arrow' },
      ];
      const colors = ['#7E1D2A', '#1F1A17', '#1D4ED8', '#15803D', '#EA580C'];
      toolPopover.innerHTML = `
        <div class="kn-popover-header">
          <span>Geometric Shapes</span>
          <button class="kn-icon-btn" id="kn-close-popover" style="width:22px;height:22px;">✕</button>
        </div>
        <div class="kn-segmented-control">
          ${types.map((tItem) => `<button class="kn-seg-btn ${sh.shapeType === tItem.id ? 'active' : ''}" data-shape-type="${tItem.id}">${tItem.label}</button>`).join('')}
        </div>
        <div class="kn-popover-row">
          <span class="kn-popover-label">Color</span>
          <div class="kn-swatch-row">
            ${colors.map((c) => `<button class="kn-color-swatch ${sh.color === c ? 'active' : ''}" data-shape-color="${c}" style="background:${c};"></button>`).join('')}
          </div>
        </div>
      `;
    } else if (tool === 'image') {
      toolPopover.innerHTML = `
        <div class="kn-popover-header">
          <span>Insert Image (JPG, PNG, WebP)</span>
          <button class="kn-icon-btn" id="kn-close-popover" style="width:22px;height:22px;">✕</button>
        </div>
        <div class="kn-img-action-grid">
          <button class="kn-img-action-card" id="kn-img-upload-btn">
            <span style="font-size:1.1rem;">📤</span>
            <span>Upload Device</span>
          </button>
          <div class="kn-img-action-card" style="cursor:default;">
            <span style="font-size:1.1rem;">🖼️</span>
            <span>Drag & Drop on Page</span>
          </div>
          <div class="kn-img-action-card" style="cursor:default;">
            <span style="font-size:1.1rem;">📋</span>
            <span>Paste (Ctrl+V)</span>
          </div>
        </div>
      `;
    } else if (tool === 'text') {
      const tx = state.text;
      const colors = ['#1F1A17', '#DC2626', '#2563EB', '#16A34A', '#9333EA', '#EA580C', '#7E1D2A'];
      const fonts = [
        { label: 'Tajawal / Arabic', val: "'Tajawal', 'IBM Plex Sans Arabic', sans-serif" },
        { label: 'IBM Plex Sans Arabic', val: "'IBM Plex Sans Arabic', 'Inter', sans-serif" },
        { label: 'Inter Sans', val: "'Inter', sans-serif" },
        { label: 'Academic Serif', val: "Georgia, serif" },
      ];
      toolPopover.innerHTML = `
        <div class="kn-popover-header">
          <span>Text Tool — Direct Page Writing (RTL / LTR)</span>
          <button class="kn-icon-btn" id="kn-close-popover" style="width:22px;height:22px;">✕</button>
        </div>
        <div class="kn-popover-row">
          <select id="kn-txt-font" style="flex:1;padding:4px 6px;border-radius:6px;border:1px solid var(--kn-border);background:var(--kn-bg);color:var(--kn-text);font-size:0.75rem;font-weight:600;">
            ${fonts.map((f) => `<option value="${escapeHtml(f.val)}" ${tx.fontFamily === f.val ? 'selected' : ''}>${f.label}</option>`).join('')}
          </select>
          <div style="display:flex;align-items:center;gap:4px;">
            <button class="kn-ctx-btn" id="kn-txt-size-dec">−</button>
            <span style="font-size:0.76rem;font-weight:800;min-width:34px;text-align:center;">${tx.fontSize}px</span>
            <button class="kn-ctx-btn" id="kn-txt-size-inc">+</button>
          </div>
        </div>
        <div class="kn-popover-row">
          <div style="display:flex;gap:3px;">
            <button class="kn-ctx-btn ${tx.bold ? 'active' : ''}" data-txt-toggle="bold" title="Bold"><b>B</b></button>
            <button class="kn-ctx-btn ${tx.italic ? 'active' : ''}" data-txt-toggle="italic" title="Italic"><i>I</i></button>
            <button class="kn-ctx-btn ${tx.underline ? 'active' : ''}" data-txt-toggle="underline" title="Underline"><u>U</u></button>
            <button class="kn-ctx-btn ${tx.strike ? 'active' : ''}" data-txt-toggle="strike" title="Strikethrough"><s>S</s></button>
          </div>
          <div style="display:flex;gap:3px;">
            <button class="kn-ctx-btn ${tx.align === 'right' ? 'active' : ''}" data-txt-align="right" title="Align Right">⇥</button>
            <button class="kn-ctx-btn ${tx.align === 'center' ? 'active' : ''}" data-txt-align="center" title="Align Center">⇔</button>
            <button class="kn-ctx-btn ${tx.align === 'left' ? 'active' : ''}" data-txt-align="left" title="Align Left">⇤</button>
            <button class="kn-ctx-btn ${tx.dir === 'auto' ? 'active' : ''}" data-txt-dir="auto" title="Auto Direction">A⇄</button>
            <button class="kn-ctx-btn ${tx.dir === 'rtl' ? 'active' : ''}" data-txt-dir="rtl">RTL</button>
            <button class="kn-ctx-btn ${tx.dir === 'ltr' ? 'active' : ''}" data-txt-dir="ltr">LTR</button>
          </div>
        </div>
        <div class="kn-popover-row">
          <span class="kn-popover-label">Color</span>
          <div class="kn-swatch-row">
            ${colors.map((c) => `<button class="kn-color-swatch ${tx.color === c ? 'active' : ''}" data-txt-color="${c}" style="background:${c};width:20px;height:20px;"></button>`).join('')}
          </div>
        </div>
        <div class="kn-slider-row">
          <span class="kn-popover-label">Opacity</span>
          <input type="range" id="kn-txt-opacity" min="25" max="100" value="${Math.round((tx.opacity || 1) * 100)}" />
          <span class="kn-slider-val">${Math.round((tx.opacity || 1) * 100)}%</span>
        </div>
      `;
    } else if (tool === 'notes') {
      const nc = state.notesConfig;
      const noteColors = ['#FEF3C7', '#FCE7F3', '#DCFCE7', '#E0F2FE', '#F3E8FF'];
      const cats = ['Important', 'Review', 'Question', 'Reminder', 'Definition', 'Idea'];
      toolPopover.innerHTML = `
        <div class="kn-popover-header">
          <span>Study Note Card — Tap Page to Place</span>
          <button class="kn-icon-btn" id="kn-close-popover" style="width:22px;height:22px;">✕</button>
        </div>
        <div class="kn-popover-row">
          <span class="kn-popover-label">Card Color</span>
          <div class="kn-swatch-row">
            ${noteColors.map((c) => `<button class="kn-color-swatch ${nc.color === c ? 'active' : ''}" data-note-color="${c}" style="background:${c};"></button>`).join('')}
          </div>
        </div>
        <div class="kn-presets-strip" style="flex-wrap:wrap;">
          ${cats.map((cat) => `<button class="kn-preset-chip ${nc.category === cat ? 'active' : ''}" data-note-cat="${cat}">${cat}</button>`).join('')}
        </div>
      `;
    }

    bindPopoverEvents();
  }

  function applyTextFormattingToSelected() {
    let updated = false;
    state.annotations.forEach((a) => {
      if (a.type === 'text' && state.selectedIds.includes(a.id)) {
        Object.assign(a, {
          fontFamily: state.text.fontFamily,
          fontSize: state.text.fontSize,
          color: state.text.color,
          bold: state.text.bold,
          italic: state.text.italic,
          underline: state.text.underline,
          strike: state.text.strike,
          align: state.text.align,
          dir: state.text.dir,
          opacity: state.text.opacity,
        });
        updated = true;
      }
    });
    if (updated) {
      saveAnnotations();
      renderPageAnnotations(state.currentPage);
    }
  }

  function bindPopoverEvents() {
    const closeBtn = document.getElementById('kn-close-popover');
    if (closeBtn) {
      closeBtn.onclick = () => {
        state.toolPopoverOpen = false;
        toolPopover.classList.remove('open');
      };
    }

    // Image Upload button inside Image Popover
    const imgUpBtn = document.getElementById('kn-img-upload-btn');
    if (imgUpBtn) {
      imgUpBtn.onclick = () => {
        state._pendingImageTarget = { page: state.currentPage, x: 180, y: 200 };
        document.getElementById('kn-image-file-input')?.click();
      };
    }

    // Highlighter bindings
    toolPopover.querySelectorAll('[data-hl-mode]').forEach((b) => {
      b.onclick = () => {
        state.highlighter.mode = b.dataset.hlMode;
        renderToolPopover();
      };
    });
    toolPopover.querySelectorAll('[data-hl-color]').forEach((b) => {
      b.onclick = () => {
        state.highlighter.color = b.dataset.hlColor;
        const dot = document.getElementById('kn-hl-dot');
        if (dot) dot.style.background = state.highlighter.color;
        renderToolPopover();
      };
    });
    const hlSize = document.getElementById('kn-hl-size');
    if (hlSize) {
      hlSize.oninput = () => {
        state.highlighter.size = parseInt(hlSize.value, 10);
        renderToolPopover();
      };
    }
    const hlOp = document.getElementById('kn-hl-opacity');
    if (hlOp) {
      hlOp.oninput = () => {
        state.highlighter.opacity = parseInt(hlOp.value, 10) / 100;
        renderToolPopover();
      };
    }
    const addHlPreset = document.getElementById('kn-hl-add-preset');
    if (addHlPreset) {
      addHlPreset.onclick = () => {
        const p = {
          id: `hl_${Date.now()}`,
          name: `Preset ${state.highlighter.presets.length + 1}`,
          color: state.highlighter.color,
          size: state.highlighter.size,
          opacity: state.highlighter.opacity,
          mode: state.highlighter.mode,
        };
        state.highlighter.presets.push(p);
        state.highlighter.activePresetId = p.id;
        localStorage.setItem(KEY_HL_PRESETS, JSON.stringify(state.highlighter.presets));
        renderToolPopover();
      };
    }
    toolPopover.querySelectorAll('[data-hl-preset]').forEach((chip) => {
      chip.onclick = (e) => {
        const delId = e.target.dataset?.hlDelPreset;
        if (delId) {
          state.highlighter.presets = state.highlighter.presets.filter((p) => p.id !== delId);
          localStorage.setItem(KEY_HL_PRESETS, JSON.stringify(state.highlighter.presets));
          renderToolPopover();
          return;
        }
        const preset = state.highlighter.presets.find((p) => p.id === chip.dataset.hlPreset);
        if (preset) {
          state.highlighter.color = preset.color;
          state.highlighter.size = preset.size;
          state.highlighter.opacity = preset.opacity;
          state.highlighter.mode = preset.mode;
          state.highlighter.activePresetId = preset.id;
          const dot = document.getElementById('kn-hl-dot');
          if (dot) dot.style.background = preset.color;
          renderToolPopover();
        }
      };
    });

    // Pen bindings
    toolPopover.querySelectorAll('[data-pen-mode]').forEach((b) => {
      b.onclick = () => {
        state.pen.mode = b.dataset.penMode;
        renderToolPopover();
      };
    });
    toolPopover.querySelectorAll('[data-pen-color]').forEach((b) => {
      b.onclick = () => {
        state.pen.color = b.dataset.penColor;
        const dot = document.getElementById('kn-pen-dot');
        if (dot) dot.style.background = state.pen.color;
        renderToolPopover();
      };
    });
    const penSize = document.getElementById('kn-pen-size');
    if (penSize) {
      penSize.oninput = () => {
        state.pen.size = parseInt(penSize.value, 10);
        renderToolPopover();
      };
    }
    const penOp = document.getElementById('kn-pen-opacity');
    if (penOp) {
      penOp.oninput = () => {
        state.pen.opacity = parseInt(penOp.value, 10) / 100;
        renderToolPopover();
      };
    }
    const addPenPreset = document.getElementById('kn-pen-add-preset');
    if (addPenPreset) {
      addPenPreset.onclick = () => {
        const p = {
          id: `pen_${Date.now()}`,
          name: `Pen ${state.pen.presets.length + 1}`,
          color: state.pen.color,
          size: state.pen.size,
          opacity: state.pen.opacity,
          mode: state.pen.mode,
        };
        state.pen.presets.push(p);
        state.pen.activePresetId = p.id;
        localStorage.setItem(KEY_PEN_PRESETS, JSON.stringify(state.pen.presets));
        renderToolPopover();
      };
    }
    toolPopover.querySelectorAll('[data-pen-preset]').forEach((chip) => {
      chip.onclick = (e) => {
        const delId = e.target.dataset?.penDelPreset;
        if (delId) {
          state.pen.presets = state.pen.presets.filter((p) => p.id !== delId);
          localStorage.setItem(KEY_PEN_PRESETS, JSON.stringify(state.pen.presets));
          renderToolPopover();
          return;
        }
        const preset = state.pen.presets.find((p) => p.id === chip.dataset.penPreset);
        if (preset) {
          state.pen.color = preset.color;
          state.pen.size = preset.size;
          state.pen.opacity = preset.opacity;
          state.pen.mode = preset.mode;
          state.pen.activePresetId = preset.id;
          const dot = document.getElementById('kn-pen-dot');
          if (dot) dot.style.background = preset.color;
          renderToolPopover();
        }
      };
    });

    // Eraser bindings
    toolPopover.querySelectorAll('[data-er-mode]').forEach((b) => {
      b.onclick = () => {
        state.eraser.mode = b.dataset.erMode;
        renderToolPopover();
      };
    });
    const erSize = document.getElementById('kn-er-size');
    if (erSize) {
      erSize.oninput = () => {
        state.eraser.size = parseInt(erSize.value, 10);
        renderToolPopover();
      };
    }
    toolPopover.querySelectorAll('[data-er-quick]').forEach((b) => {
      b.onclick = () => {
        state.eraser.size = parseInt(b.dataset.erQuick, 10);
        renderToolPopover();
      };
    });

    // Selection bindings
    toolPopover.querySelectorAll('[data-sel-mode]').forEach((b) => {
      b.onclick = () => {
        state.selectionMode = b.dataset.selMode;
        renderToolPopover();
      };
    });
    toolPopover.querySelectorAll('[data-sel-filter]').forEach((b) => {
      b.onclick = () => {
        state.selectionFilter = b.dataset.selFilter;
        renderToolPopover();
      };
    });

    // Shapes bindings
    toolPopover.querySelectorAll('[data-shape-type]').forEach((b) => {
      b.onclick = () => {
        state.shapes.shapeType = b.dataset.shapeType;
        renderToolPopover();
      };
    });
    toolPopover.querySelectorAll('[data-shape-color]').forEach((b) => {
      b.onclick = () => {
        state.shapes.color = b.dataset.shapeColor;
        renderToolPopover();
      };
    });

    // Text bindings
    const txtFont = document.getElementById('kn-txt-font');
    if (txtFont) {
      txtFont.onchange = () => {
        state.text.fontFamily = txtFont.value;
        applyTextFormattingToSelected();
        renderToolPopover();
      };
    }
    const decBtn = document.getElementById('kn-txt-size-dec');
    if (decBtn) {
      decBtn.onclick = () => {
        state.text.fontSize = Math.max(10, state.text.fontSize - 2);
        applyTextFormattingToSelected();
        renderToolPopover();
      };
    }
    const incBtn = document.getElementById('kn-txt-size-inc');
    if (incBtn) {
      incBtn.onclick = () => {
        state.text.fontSize = Math.min(48, state.text.fontSize + 2);
        applyTextFormattingToSelected();
        renderToolPopover();
      };
    }
    toolPopover.querySelectorAll('[data-txt-toggle]').forEach((b) => {
      b.onclick = () => {
        const prop = b.dataset.txtToggle;
        state.text[prop] = !state.text[prop];
        applyTextFormattingToSelected();
        renderToolPopover();
      };
    });
    toolPopover.querySelectorAll('[data-txt-align]').forEach((b) => {
      b.onclick = () => {
        state.text.align = b.dataset.txtAlign;
        applyTextFormattingToSelected();
        renderToolPopover();
      };
    });
    toolPopover.querySelectorAll('[data-txt-dir]').forEach((b) => {
      b.onclick = () => {
        state.text.dir = b.dataset.txtDir;
        applyTextFormattingToSelected();
        renderToolPopover();
      };
    });
    toolPopover.querySelectorAll('[data-txt-color]').forEach((b) => {
      b.onclick = () => {
        state.text.color = b.dataset.txtColor;
        applyTextFormattingToSelected();
        renderToolPopover();
      };
    });
    const txtOp = document.getElementById('kn-txt-opacity');
    if (txtOp) {
      txtOp.oninput = () => {
        state.text.opacity = parseInt(txtOp.value, 10) / 100;
        applyTextFormattingToSelected();
        renderToolPopover();
      };
    }

    // Notes bindings
    toolPopover.querySelectorAll('[data-note-color]').forEach((b) => {
      b.onclick = () => {
        state.notesConfig.color = b.dataset.noteColor;
        renderToolPopover();
      };
    });
    toolPopover.querySelectorAll('[data-note-cat]').forEach((b) => {
      b.onclick = () => {
        state.notesConfig.category = b.dataset.noteCat;
        renderToolPopover();
      };
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // LEFT SIDEBAR CONTENT (Pages Thumbnails, Bookmarks, Annotations Summary)
  // ══════════════════════════════════════════════════════════════════════════
  function renderLeftSidebarContent() {
    const leftContent = document.getElementById('kn-left-content');
    if (!leftContent) return;

    // Update Notes count badge in Right Panel tab
    const totalNotesCount = state.annotations.filter((a) => a.type === 'note').length;
    const notesTabBtn = document.querySelector('[data-right-tab="notes"]');
    if (notesTabBtn) {
      notesTabBtn.textContent = totalNotesCount > 0 ? `Notes (${totalNotesCount})` : 'Notes';
    }

    if (state.leftTab === 'pages') {
      let html = '';
      for (let p = 1; p <= state.totalPages; p++) {
        const hasAnnot = state.annotations.some((a) => a.page === p);
        const hasBm = state.bookmarks.includes(p);
        html += `
          <div class="kn-thumbnail-item ${p === state.currentPage ? 'active' : ''}" data-thumb-page="${p}">
            <div class="kn-thumb-badges">
              ${hasBm ? '<span class="kn-thumb-badge" title="Bookmarked"></span>' : ''}
              ${hasAnnot ? '<span class="kn-thumb-badge" style="background:#FACC15;" title="Has Annotations"></span>' : ''}
            </div>
            <div class="kn-thumb-preview">
              <canvas id="kn-thumb-canvas-${p}" width="150" height="200"></canvas>
            </div>
            <span class="kn-thumb-index">${p}</span>
          </div>
        `;
      }
      leftContent.innerHTML = html;

      for (let p = 1; p <= state.totalPages; p++) {
        const tc = document.getElementById(`kn-thumb-canvas-${p}`);
        if (tc) {
          const ctx = tc.getContext('2d');
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, 150, 200);
          ctx.fillStyle = '#7E1D2A';
          ctx.fillRect(12, 12, 126, 3);
          ctx.fillStyle = '#E8E2D5';
          for (let y = 28; y < 170; y += 12) {
            ctx.fillRect(12, y, y % 24 === 0 ? 96 : 122, 4);
          }
        }
      }

      leftContent.querySelectorAll('.kn-thumbnail-item').forEach((item) => {
        item.onclick = () => {
          goToPage(parseInt(item.dataset.thumbPage, 10));
        };
      });
    } else if (state.leftTab === 'bookmarks') {
      if (state.bookmarks.length === 0) {
        leftContent.innerHTML = `<div style="padding:32px 12px;text-align:center;color:var(--kn-text-muted);font-size:0.8rem;">No bookmarked pages yet.<br/>Tap the bookmark icon in the header to save key pages.</div>`;
        return;
      }
      leftContent.innerHTML = state.bookmarks
        .sort((a, b) => a - b)
        .map(
          (p) => `
          <div class="kn-outline-item ${p === state.currentPage ? 'active' : ''}" data-bm-page="${p}">
            <span>🔖 Page ${p}</span>
          </div>`
        )
        .join('');
      leftContent.querySelectorAll('[data-bm-page]').forEach((el) => {
        el.onclick = () => goToPage(parseInt(el.dataset.bmPage, 10));
      });
    } else if (state.leftTab === 'annotations') {
      if (state.annotations.length === 0) {
        leftContent.innerHTML = `<div style="padding:32px 12px;text-align:center;color:var(--kn-text-muted);font-size:0.8rem;">No annotations on this sheet yet.</div>`;
        return;
      }
      leftContent.innerHTML = state.annotations
        .slice()
        .reverse()
        .map(
          (a) => `
          <div class="kn-outline-item" data-ann-jump="${a.page}" data-ann-id="${a.id}" style="justify-content:space-between;">
            <span style="text-transform:capitalize;">${escapeHtml(a.type)} • Page ${a.page}</span>
            <span class="kn-tool-color-dot" style="background:${a.color || '#7E1D2A'};"></span>
          </div>`
        )
        .join('');
      leftContent.querySelectorAll('[data-ann-jump]').forEach((el) => {
        el.onclick = () => {
          state.selectedIds = [el.dataset.annId];
          goToPage(parseInt(el.dataset.annJump, 10));
        };
      });
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // RIGHT SMART PANEL CONTENT (Outline, Study Notes Manager, Kuro AI)
  // ══════════════════════════════════════════════════════════════════════════
  function renderRightSidebarContent() {
    const rightContent = document.getElementById('kn-right-content');
    if (!rightContent) return;

    const totalNotesCount = state.annotations.filter((a) => a.type === 'note').length;
    const notesTabBtn = document.querySelector('[data-right-tab="notes"]');
    if (notesTabBtn) {
      notesTabBtn.textContent = totalNotesCount > 0 ? `Notes (${totalNotesCount})` : 'Notes';
    }

    if (state.rightTab === 'outline') {
      const outlineItems =
        state.outline.length > 0
          ? state.outline
          : [
              { title: '1. Clinical Overview & Classification', page: 1, sub: false },
              { title: '2. Pathogenesis & Histopathology', page: Math.min(2, state.totalPages), sub: false },
              { title: '3. Radiographic & Differential Diagnosis', page: Math.min(3, state.totalPages), sub: false },
              { title: '4. Surgical Management & Follow-Up', page: Math.min(4, state.totalPages), sub: false },
            ];

      rightContent.innerHTML = `
        <input type="text" class="kn-outline-search" id="kn-outline-filter" placeholder="Search in this sheet..." />
        <div class="kn-outline-list" id="kn-outline-list">
          ${outlineItems
            .map(
              (item) => `
            <div class="kn-outline-item ${item.sub ? 'sub-item' : ''} ${item.page === state.currentPage ? 'active' : ''}" data-outline-page="${item.page}">
              <span style="flex:1;">${escapeHtml(item.title)}</span>
              <span style="font-size:0.72rem;color:var(--kn-text-muted);">p.${item.page}</span>
            </div>`
            )
            .join('')}
        </div>
      `;

      const filterInp = document.getElementById('kn-outline-filter');
      if (filterInp) {
        filterInp.oninput = () => {
          const q = filterInp.value.toLowerCase();
          rightContent.querySelectorAll('.kn-outline-item').forEach((el) => {
            el.style.display = el.textContent.toLowerCase().includes(q) ? 'flex' : 'none';
          });
        };
      }

      rightContent.querySelectorAll('[data-outline-page]').forEach((el) => {
        el.onclick = () => goToPage(parseInt(el.dataset.outlinePage, 10));
      });
    } else if (state.rightTab === 'notes') {
      const nc = state.notesConfig;
      let notesList = state.annotations.filter((a) => a.type === 'note');
      if (nc.filterCategory !== 'all') {
        if (nc.filterCategory === 'pinned') {
          notesList = notesList.filter((n) => n.pinned);
        } else {
          notesList = notesList.filter((n) => n.category === nc.filterCategory);
        }
      }
      if (nc.searchQuery.trim()) {
        const q = nc.searchQuery.toLowerCase();
        notesList = notesList.filter(
          (n) => (n.title || '').toLowerCase().includes(q) || (n.text || '').toLowerCase().includes(q)
        );
      }

      notesList.sort((a, b) => {
        if (nc.sortBy === 'pinned') return (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || a.page - b.page;
        if (nc.sortBy === 'created') return (b.createdAt || 0) - (a.createdAt || 0);
        if (nc.sortBy === 'updated') return (b.updatedAt || 0) - (a.updatedAt || 0);
        return a.page - b.page;
      });

      rightContent.innerHTML = `
        <div style="padding:10px;border-bottom:1px solid var(--kn-border);display:flex;flex-direction:column;gap:8px;">
          <div style="display:flex;gap:6px;">
            <input type="text" id="kn-notes-search" class="kn-outline-search" style="margin:0;flex:1;" placeholder="Search study notes..." value="${escapeHtml(nc.searchQuery)}" />
            <button class="kn-btn kn-btn-primary" id="kn-add-note-sidebar" style="padding:4px 10px;">+ Note</button>
          </div>
          <div style="display:flex;gap:6px;align-items:center;justify-content:space-between;">
            <select id="kn-notes-cat-filter" style="flex:1;padding:4px 6px;border-radius:6px;border:1px solid var(--kn-border);background:var(--kn-bg);color:var(--kn-text);font-size:0.74rem;font-weight:600;">
              <option value="all" ${nc.filterCategory === 'all' ? 'selected' : ''}>All Categories</option>
              <option value="pinned" ${nc.filterCategory === 'pinned' ? 'selected' : ''}>📌 Pinned Only</option>
              <option value="Important" ${nc.filterCategory === 'Important' ? 'selected' : ''}>📌 Important</option>
              <option value="Review" ${nc.filterCategory === 'Review' ? 'selected' : ''}>⭐ Review</option>
              <option value="Question" ${nc.filterCategory === 'Question' ? 'selected' : ''}>❓ Question</option>
              <option value="Reminder" ${nc.filterCategory === 'Reminder' ? 'selected' : ''}>🔔 Reminder</option>
              <option value="Definition" ${nc.filterCategory === 'Definition' ? 'selected' : ''}>📖 Definition</option>
              <option value="Idea" ${nc.filterCategory === 'Idea' ? 'selected' : ''}>💡 Idea</option>
            </select>
            <select id="kn-notes-sort" style="padding:4px 6px;border-radius:6px;border:1px solid var(--kn-border);background:var(--kn-bg);color:var(--kn-text);font-size:0.74rem;font-weight:600;">
              <option value="page" ${nc.sortBy === 'page' ? 'selected' : ''}>Page Order</option>
              <option value="pinned" ${nc.sortBy === 'pinned' ? 'selected' : ''}>Pinned First</option>
              <option value="updated" ${nc.sortBy === 'updated' ? 'selected' : ''}>Recently Edited</option>
              <option value="created" ${nc.sortBy === 'created' ? 'selected' : ''}>Recently Created</option>
            </select>
          </div>
        </div>
        <div class="kn-outline-list" style="padding-top:10px;gap:8px;">
          ${
            notesList.length === 0
              ? `<div style="padding:36px 14px;text-align:center;color:var(--kn-text-muted);font-size:0.8rem;">
                  <div style="font-weight:800;color:var(--kn-text);margin-bottom:4px;">No Notes Yet</div>
                  Select the Notes tool in the toolbar or click <b>+ Note</b> to add structured study notes on any page.
                </div>`
              : notesList
                  .map(
                    (n) => `
                  <div class="kn-sidebar-note-card" data-note-jump="${n.id}" data-note-page="${n.page}" style="border-inline-start:4px solid ${n.color || '#FEF3C7'};">
                    <div style="display:flex;align-items:center;justify-content:space-between;font-size:0.72rem;font-weight:800;color:var(--kn-primary);">
                      <span>${escapeHtml(n.category || 'Important')} ${n.pinned ? '📌' : ''}</span>
                      <span style="color:var(--kn-text-muted);">Page ${n.page}</span>
                    </div>
                    ${n.title ? `<div style="font-weight:800;font-size:0.8rem;color:var(--kn-text);" dir="auto">${escapeHtml(n.title)}</div>` : ''}
                    <div style="font-size:0.76rem;color:var(--kn-text-muted);line-height:1.4;" dir="auto">${escapeHtml(n.text || '(Empty note)')}</div>
                  </div>`
                  )
                  .join('')
          }
        </div>
      `;

      const sInp = document.getElementById('kn-notes-search');
      if (sInp) {
        sInp.oninput = () => {
          state.notesConfig.searchQuery = sInp.value;
          renderRightSidebarContent();
        };
      }
      const catSel = document.getElementById('kn-notes-cat-filter');
      if (catSel) {
        catSel.onchange = () => {
          state.notesConfig.filterCategory = catSel.value;
          renderRightSidebarContent();
        };
      }
      const sortSel = document.getElementById('kn-notes-sort');
      if (sortSel) {
        sortSel.onchange = () => {
          state.notesConfig.sortBy = sortSel.value;
          renderRightSidebarContent();
        };
      }
      const addBtn = document.getElementById('kn-add-note-sidebar');
      if (addBtn) {
        addBtn.onclick = () => {
          pushHistory();
          const newNote = {
            id: `kn_note_${Date.now()}`,
            type: 'note',
            page: state.currentPage,
            x: 440,
            y: 90,
            w: 215,
            h: 150,
            title: '',
            text: '',
            color: state.notesConfig.color,
            category: state.notesConfig.category,
            pinned: false,
            collapsed: false,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };
          state.annotations.push(newNote);
          state.selectedIds = [newNote.id];
          saveAnnotations();
          renderPageAnnotations(state.currentPage);
          renderRightSidebarContent();
          renderLeftSidebarContent();
        };
      }
      rightContent.querySelectorAll('[data-note-jump]').forEach((cardEl) => {
        cardEl.onclick = () => {
          const nid = cardEl.dataset.noteJump;
          const npage = parseInt(cardEl.dataset.notePage, 10);
          const target = state.annotations.find((a) => a.id === nid);
          if (target) target.collapsed = false;
          state.selectedIds = [nid];
          goToPage(npage);
          renderPageAnnotations(npage);
        };
      });
    } else if (state.rightTab === 'ai') {
      rightContent.innerHTML = `
        <div style="padding:14px;display:flex;flex-direction:column;gap:10px;flex:1;overflow-y:auto;">
          <div style="background:var(--kn-bg);border:1px solid var(--kn-border);border-radius:10px;padding:12px;font-size:0.8rem;line-height:1.5;">
            <div style="font-weight:800;color:var(--kn-primary);margin-bottom:4px;">Kuro AI Study Assistant</div>
            Ask about <b>${escapeHtml(sheet.title || docTitle)}</b> (Page ${state.currentPage}), generate high-yield flashcards, or summarize key clinical concepts.
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;">
            <button class="kn-preset-chip" data-ai-prompt="Summarize Page ${state.currentPage}">✨ Summarize Page ${state.currentPage}</button>
            <button class="kn-preset-chip" data-ai-prompt="Generate 5 High-Yield MCQs">📝 Generate 5 MCQs</button>
            <button class="kn-preset-chip" data-ai-prompt="Key Clinical Definitions">🦷 Key Definitions</button>
          </div>
          <div id="kn-ai-response-box" style="flex:1;background:var(--kn-surface);border:1px solid var(--kn-border);border-radius:10px;padding:12px;font-size:0.79rem;line-height:1.55;overflow-y:auto;color:var(--kn-text-muted);">
            Select a prompt above to analyze Page ${state.currentPage}.
          </div>
        </div>
      `;
      rightContent.querySelectorAll('[data-ai-prompt]').forEach((btn) => {
        btn.onclick = () => {
          const box = document.getElementById('kn-ai-response-box');
          if (!box) return;
          const pText = state.pageTexts[state.currentPage]?.fullText || sheet.title || 'Dental Lecture';
          box.style.color = 'var(--kn-text)';
          box.innerHTML = `
            <div style="font-weight:800;color:var(--kn-primary);margin-bottom:6px;">${escapeHtml(btn.dataset.aiPrompt)}</div>
            <div>• <b>Core Concept (Page ${state.currentPage}):</b> ${escapeHtml(pText.slice(0, 220))}...</div>
            <div style="margin-top:6px;">• <b>Exam Pearl:</b> Correlate histopathological lining features with radiographic margins before surgical planning.</div>
          `;
        };
      });
    }
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SEARCH ENGINE (Page-Grouped Results & Highlighted Context Snippets)
  // ══════════════════════════════════════════════════════════════════════════
  function highlightSnippetHtml(snippet, queryRaw) {
    const safeText = escapeHtml(snippet);
    if (!queryRaw) return safeText;
    const escaped = escapeHtml(queryRaw).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const flags = state.search.matchCase ? 'g' : 'gi';
    return safeText.replace(new RegExp(escaped, flags), (m) => `<mark class="kn-search-snippet-mark">${m}</mark>`);
  }

  function runSearch() {
    const qRaw = state.search.query.trim();
    const countEl = document.getElementById('kn-search-count');
    const resultsEl = document.getElementById('kn-search-results');
    state.search.matches = [];
    state.search.currentIndex = -1;

    if (!qRaw) {
      if (countEl) countEl.textContent = '0 / 0';
      if (resultsEl) resultsEl.innerHTML = '';
      clearAllSearchMarks();
      return;
    }

    const flags = state.search.matchCase ? 'g' : 'gi';
    const escaped = qRaw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = state.search.wholeWords ? `\\b${escaped}\\b` : escaped;
    const regex = new RegExp(pattern, flags);

    for (let p = 1; p <= state.totalPages; p++) {
      const pData = state.pageTexts[p];
      if (!pData) continue;
      pData.items.forEach((it) => {
        if (regex.test(it.str)) {
          state.search.matches.push({
            page: p,
            snippet: it.str,
            rect: { x: it.x, y: it.y, w: it.w, h: it.h },
          });
        }
        regex.lastIndex = 0;
      });
    }

    if (state.search.matches.length > 0) {
      state.search.currentIndex = 0;
      focusSearchMatch(0);
    } else {
      if (countEl) countEl.textContent = '0 / 0';
      if (resultsEl) {
        resultsEl.innerHTML = `
          <div style="padding:18px 10px;text-align:center;color:var(--kn-text-muted);font-size:0.78rem;">
            <div style="font-weight:800;color:var(--kn-primary);margin-bottom:4px;">لا توجد نتائج • No Results Found</div>
            <div>No matches found for "${escapeHtml(qRaw)}" in this sheet.</div>
          </div>`;
      }
      clearAllSearchMarks();
    }
  }

  function focusSearchMatch(idx) {
    if (state.search.matches.length === 0) return;
    const total = state.search.matches.length;
    state.search.currentIndex = ((idx % total) + total) % total;
    const match = state.search.matches[state.search.currentIndex];

    const countEl = document.getElementById('kn-search-count');
    if (countEl) countEl.textContent = `${state.search.currentIndex + 1} of ${total}`;

    const resultsEl = document.getElementById('kn-search-results');
    if (resultsEl) {
      // Group matches by page exactly like reference image 5
      const byPage = {};
      state.search.matches.forEach((m, i) => {
        if (!byPage[m.page]) byPage[m.page] = [];
        byPage[m.page].push({ ...m, globalIdx: i });
      });

      resultsEl.innerHTML = Object.keys(byPage)
        .map((pKey) => {
          const group = byPage[pKey];
          return `
            <div class="kn-search-page-group">
              <span>📄 Page ${pKey}</span>
              <span>(${group.length} ${group.length === 1 ? 'result' : 'results'})</span>
            </div>
            ${group
              .map(
                (m) => `
              <div class="kn-search-result-item ${m.globalIdx === state.search.currentIndex ? 'active' : ''}" data-search-idx="${m.globalIdx}">
                <div style="display:flex;align-items:center;justify-content:space-between;gap:6px;">
                  <div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;" dir="auto">${highlightSnippetHtml(m.snippet, state.search.query.trim())}</div>
                  <span style="font-size:0.7rem;font-weight:700;color:var(--kn-text-muted);">${m.page}</span>
                </div>
              </div>`
              )
              .join('')}
          `;
        })
        .join('');

      resultsEl.querySelectorAll('[data-search-idx]').forEach((el) => {
        el.onclick = () => focusSearchMatch(parseInt(el.dataset.searchIdx, 10));
      });
    }

    goToPage(match.page);
    for (let p = 1; p <= state.totalPages; p++) {
      renderSearchMarksOnPage(p);
    }
  }

  function renderSearchMarksOnPage(pageNum) {
    const layer = document.getElementById(`kn-text-layer-${pageNum}`);
    if (!layer) return;
    layer.querySelectorAll('.kn-search-mark').forEach((m) => m.remove());
    if (!state.search.open || state.search.matches.length === 0) return;

    const s = state.zoom;
    state.search.matches.forEach((m, idx) => {
      if (m.page !== pageNum) return;
      const mark = document.createElement('div');
      mark.className = `kn-search-mark ${idx === state.search.currentIndex ? 'current' : ''}`;
      mark.style.left = `${m.rect.x * s}px`;
      mark.style.top = `${m.rect.y * s}px`;
      mark.style.width = `${m.rect.w * s}px`;
      mark.style.height = `${m.rect.h * s}px`;
      layer.appendChild(mark);
    });
  }

  function clearAllSearchMarks() {
    document.querySelectorAll('.kn-search-mark').forEach((m) => m.remove());
  }

  // ══════════════════════════════════════════════════════════════════════════
  // NAVIGATION, ZOOM, TOOL SELECTION & EVENT WIRING
  // ══════════════════════════════════════════════════════════════════════════
  function goToPage(pageNum, scrollSmooth = true) {
    const clamped = Math.max(1, Math.min(state.totalPages, pageNum));
    state.currentPage = clamped;

    const inp = document.getElementById('kn-page-input');
    if (inp) inp.value = clamped;
    const mobInd = document.getElementById('kn-mob-page-indicator');
    if (mobInd) mobInd.textContent = `${clamped} / ${state.totalPages}`;
    const readBadge = document.getElementById('kn-reading-page-badge');
    if (readBadge) readBadge.textContent = `Page ${clamped} / ${state.totalPages}`;

    const bmBtn = document.getElementById('kn-btn-bookmark');
    if (bmBtn) bmBtn.classList.toggle('active', state.bookmarks.includes(clamped));

    const targetCard = pagesContainer.querySelector(`.kn-page-card[data-page="${clamped}"]`);
    if (targetCard && scrollSmooth) {
      targetCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    document.querySelectorAll('.kn-thumbnail-item').forEach((tEl) => {
      tEl.classList.toggle('active', parseInt(tEl.dataset.thumbPage, 10) === clamped);
    });
    saveViewState();
  }

  function setZoom(newZoom, mode = 'custom') {
    const viewport = document.getElementById('kn-viewport');
    if (mode === 'fit-width' && viewport) {
      const availW = viewport.clientWidth - 56;
      newZoom = availW / BASE_W;
    } else if (mode === 'fit-page' && viewport) {
      const availH = viewport.clientHeight - 64;
      newZoom = availH / BASE_H;
    }
    state.zoom = Math.max(0.5, Math.min(2.5, newZoom));
    state.zoomMode = mode;

    const lbl = document.getElementById('kn-zoom-label');
    if (lbl) lbl.textContent = `${Math.round(state.zoom * 100)}%`;
    const mobZoom = document.getElementById('kn-mob-zoom-btn');
    if (mobZoom) mobZoom.textContent = `${Math.round(state.zoom * 100)}%`;

    buildPageCards();
    if (state.pdfDoc) renderVisiblePdfPages();
    saveViewState();
  }

  function setActiveTool(toolName) {
    if (toolName === 'ai') {
      state.rightSidebarOpen = true;
      state.rightTab = 'ai';
      document.getElementById('kn-sidebar-right')?.classList.remove('kn-sidebar-collapsed');
      document.querySelectorAll('[data-right-tab]').forEach((b) => b.classList.toggle('active', b.dataset.rightTab === 'ai'));
      renderRightSidebarContent();
      return;
    }

    if (state.activeTool === toolName) {
      if (state.toolPopoverOpen) {
        state.activeTool = null;
        state.toolPopoverOpen = false;
      } else {
        state.toolPopoverOpen = true;
      }
    } else {
      state.activeTool = toolName;
      state.toolPopoverOpen = Boolean(toolName);
    }

    document.querySelectorAll('.kn-group-annotations .kn-tool-btn').forEach((btn) => {
      const isAct = btn.dataset.tool === state.activeTool;
      btn.classList.toggle('active', isAct);
      btn.setAttribute('aria-checked', isAct ? 'true' : 'false');
    });

    document.querySelectorAll('.kn-interaction-layer').forEach((layer) => {
      layer.classList.toggle('tool-active', Boolean(state.activeTool));
    });

    renderToolPopover();
  }

  function insertImageDataUrl(dataUrl, target) {
    const pageNum = target?.page || state.currentPage;
    pushHistory();
    const newImg = {
      id: `kn_img_${Date.now()}`,
      type: 'image',
      page: pageNum,
      x: target?.x || 160,
      y: target?.y || 180,
      w: 240,
      h: 180,
      src: dataUrl,
      displaySrc: dataUrl,
      rotation: 0,
      createdAt: Date.now(),
    };
    state.annotations.push(newImg);
    state.selectedIds = [newImg.id];
    state.activeTool = 'select';
    saveAnnotations();
    renderPageAnnotations(pageNum);
    renderLeftSidebarContent();
  }

  // Image File Upload, Drag & Drop, and Clipboard Paste
  const imgInput = document.getElementById('kn-image-file-input');
  if (imgInput) {
    imgInput.onchange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        insertImageDataUrl(ev.target.result, state._pendingImageTarget);
        imgInput.value = '';
      };
      reader.readAsDataURL(file);
    };
  }

  const viewportEl = document.getElementById('kn-viewport');
  if (viewportEl) {
    viewportEl.addEventListener('dragover', (e) => e.preventDefault());
    viewportEl.addEventListener('drop', (e) => {
      e.preventDefault();
      const file = e.dataTransfer?.files?.[0];
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (ev) => insertImageDataUrl(ev.target.result, { page: state.currentPage, x: 150, y: 150 });
        reader.readAsDataURL(file);
      }
    });

    // Track current page on scroll
    viewportEl.addEventListener('scroll', () => {
      const cards = pagesContainer.querySelectorAll('.kn-page-card');
      const vRect = viewportEl.getBoundingClientRect();
      const midY = vRect.top + vRect.height * 0.38;
      for (const c of cards) {
        const r = c.getBoundingClientRect();
        if (r.top <= midY && r.bottom >= midY) {
          const p = parseInt(c.dataset.page, 10);
          if (p !== state.currentPage) {
            state.currentPage = p;
            const inp = document.getElementById('kn-page-input');
            if (inp) inp.value = p;
            const mobInd = document.getElementById('kn-mob-page-indicator');
            if (mobInd) mobInd.textContent = `${p} / ${state.totalPages}`;
            document.querySelectorAll('.kn-thumbnail-item').forEach((tEl) => {
              tEl.classList.toggle('active', parseInt(tEl.dataset.thumbPage, 10) === p);
            });
          }
          break;
        }
      }
    });
  }

  window.addEventListener('paste', (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (ev) => insertImageDataUrl(ev.target.result, { page: state.currentPage, x: 160, y: 160 });
          reader.readAsDataURL(file);
        }
      }
    }
  });

  // Wire Header & Toolbar Buttons
  document.getElementById('kn-btn-back').onclick = () => {
    restoreGlobalUI();
    if (window.history.length > 1) window.history.back();
    else Router.navigate('/sheets');
  };

  const toggleLeftSidebar = () => {
    state.leftSidebarOpen = !state.leftSidebarOpen;
    document.getElementById('kn-sidebar-left')?.classList.toggle('kn-sidebar-collapsed', !state.leftSidebarOpen);
    document.getElementById('kn-btn-left-sidebar')?.classList.toggle('active', state.leftSidebarOpen);
    saveViewState();
  };

  const toggleRightSidebar = () => {
    state.rightSidebarOpen = !state.rightSidebarOpen;
    document.getElementById('kn-sidebar-right')?.classList.toggle('kn-sidebar-collapsed', !state.rightSidebarOpen);
    document.getElementById('kn-btn-right-sidebar')?.classList.toggle('active', state.rightSidebarOpen);
    saveViewState();
  };

  document.getElementById('kn-btn-left-sidebar').onclick = toggleLeftSidebar;
  document.getElementById('kn-btn-right-sidebar').onclick = toggleRightSidebar;
  document.getElementById('kn-ipad-fab-left').onclick = toggleLeftSidebar;
  document.getElementById('kn-ipad-fab-right').onclick = toggleRightSidebar;
  document.getElementById('kn-mob-pages-btn').onclick = toggleLeftSidebar;
  document.getElementById('kn-mob-panel-btn').onclick = toggleRightSidebar;

  // Search Toggle
  document.getElementById('kn-btn-search').onclick = () => {
    state.search.open = !state.search.open;
    const pop = document.getElementById('kn-search-popover');
    if (pop) pop.classList.toggle('open', state.search.open);
    if (state.search.open) {
      document.getElementById('kn-search-input')?.focus();
    } else {
      clearAllSearchMarks();
    }
  };
  document.getElementById('kn-search-close').onclick = () => {
    state.search.open = false;
    document.getElementById('kn-search-popover')?.classList.remove('open');
    clearAllSearchMarks();
  };
  document.getElementById('kn-search-input').oninput = (e) => {
    state.search.query = e.target.value;
    runSearch();
  };
  document.getElementById('kn-search-case').onchange = (e) => {
    state.search.matchCase = e.target.checked;
    runSearch();
  };
  document.getElementById('kn-search-whole').onchange = (e) => {
    state.search.wholeWords = e.target.checked;
    runSearch();
  };
  document.getElementById('kn-search-prev').onclick = () => focusSearchMatch(state.search.currentIndex - 1);
  document.getElementById('kn-search-next').onclick = () => focusSearchMatch(state.search.currentIndex + 1);

  // Bookmark Toggle
  document.getElementById('kn-btn-bookmark').onclick = () => {
    const p = state.currentPage;
    if (state.bookmarks.includes(p)) {
      state.bookmarks = state.bookmarks.filter((b) => b !== p);
    } else {
      state.bookmarks.push(p);
    }
    localStorage.setItem(KEY_BM, JSON.stringify(state.bookmarks));
    document.getElementById('kn-btn-bookmark')?.classList.toggle('active', state.bookmarks.includes(p));
    renderLeftSidebarContent();
  };

  // Share Button
  document.getElementById('kn-btn-share').onclick = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    if (typeof UI !== 'undefined' && UI.showToast) {
      UI.showToast('Sheet link copied to clipboard!', 'success');
    }
  };

  // Undo / Redo
  const performUndo = () => {
    if (state.undoStack.length === 0) return;
    state.redoStack.push(JSON.stringify(state.annotations));
    state.annotations = JSON.parse(state.undoStack.pop());
    saveAnnotations();
    updateHistoryButtons();
    for (let p = 1; p <= state.totalPages; p++) renderPageAnnotations(p);
    renderLeftSidebarContent();
    if (state.rightTab === 'notes') renderRightSidebarContent();
  };

  const performRedo = () => {
    if (state.redoStack.length === 0) return;
    state.undoStack.push(JSON.stringify(state.annotations));
    state.annotations = JSON.parse(state.redoStack.pop());
    saveAnnotations();
    updateHistoryButtons();
    for (let p = 1; p <= state.totalPages; p++) renderPageAnnotations(p);
    renderLeftSidebarContent();
    if (state.rightTab === 'notes') renderRightSidebarContent();
  };

  document.getElementById('kn-btn-undo').onclick = performUndo;
  document.getElementById('kn-btn-redo').onclick = performRedo;

  // Page Prev / Next / Input
  document.getElementById('kn-btn-prev').onclick = () => goToPage(state.currentPage - 1);
  document.getElementById('kn-btn-next').onclick = () => goToPage(state.currentPage + 1);
  document.getElementById('kn-mob-prev').onclick = () => goToPage(state.currentPage - 1);
  document.getElementById('kn-mob-next').onclick = () => goToPage(state.currentPage + 1);
  document.getElementById('kn-page-input').onchange = (e) => goToPage(parseInt(e.target.value, 10) || 1);

  // Zoom Controls
  document.getElementById('kn-btn-zoom-out').onclick = () => setZoom(state.zoom - 0.15);
  document.getElementById('kn-btn-zoom-in').onclick = () => setZoom(state.zoom + 0.15);
  document.getElementById('kn-btn-zoom-menu').onclick = (e) => {
    e.stopPropagation();
    document.getElementById('kn-zoom-dropdown')?.classList.toggle('open');
  };
  document.querySelectorAll('#kn-zoom-dropdown [data-zoom]').forEach((item) => {
    item.onclick = () => {
      const val = item.dataset.zoom;
      if (val === 'fit-page' || val === 'fit-width') setZoom(1.0, val);
      else setZoom(parseFloat(val), 'custom');
      document.getElementById('kn-zoom-dropdown')?.classList.remove('open');
    };
  });

  // Annotation Tool Buttons (Group 04 + AI)
  document.querySelectorAll('#kn-toolbar [data-tool]').forEach((btn) => {
    btn.onclick = (e) => {
      e.stopPropagation();
      setActiveTool(btn.dataset.tool);
    };
  });

  // Focus / Distraction-Free Reading Mode
  const toggleReadingMode = (force) => {
    state.readingMode = force !== undefined ? force : !state.readingMode;
    document.getElementById('kuro-notes-workspace')?.classList.toggle('kn-reading-mode', state.readingMode);
    const pill = document.getElementById('kn-reading-pill');
    if (pill) pill.style.display = state.readingMode ? 'flex' : 'none';
  };
  document.getElementById('kn-btn-reading-mode').onclick = () => toggleReadingMode();
  document.getElementById('kn-exit-reading-btn').onclick = () => toggleReadingMode(false);

  // Header More Menu & Toolbar More Menu
  document.getElementById('kn-btn-header-more').onclick = (e) => {
    e.stopPropagation();
    document.getElementById('kn-header-more-menu')?.classList.toggle('open');
  };
  document.getElementById('kn-toolbar-more').onclick = (e) => {
    e.stopPropagation();
    document.getElementById('kn-toolbar-more-menu')?.classList.toggle('open');
  };

  document.querySelectorAll('[data-doc-action]').forEach((btn) => {
    btn.onclick = () => {
      const act = btn.dataset.docAction;
      document.getElementById('kn-header-more-menu')?.classList.remove('open');
      if (act === 'fit-page') setZoom(1.0, 'fit-page');
      else if (act === 'fit-width') setZoom(1.0, 'fit-width');
      else if (act === 'actual-size') setZoom(1.0, 'custom');
      else if (act === 'rotate-left') {
        state.rotation = (state.rotation + 270) % 360;
        setZoom(state.zoom, state.zoomMode);
      } else if (act === 'rotate-right') {
        state.rotation = (state.rotation + 90) % 360;
        setZoom(state.zoom, state.zoomMode);
      } else if (act === 'print' || act === 'export') window.print();
      else if (act === 'download' && sheet.fileUrl) window.open(sheet.fileUrl, '_blank');
      else if (act === 'focus') toggleReadingMode(true);
      else if (act === 'dark-mode') {
        const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nextTheme);
      }
    };
  });

  document.querySelectorAll('[data-more-action]').forEach((btn) => {
    btn.onclick = () => {
      const act = btn.dataset.moreAction;
      document.getElementById('kn-toolbar-more-menu')?.classList.remove('open');
      if (act === 'clear-page') {
        pushHistory();
        state.annotations = state.annotations.filter((a) => a.page !== state.currentPage);
        saveAnnotations();
        renderPageAnnotations(state.currentPage);
        renderLeftSidebarContent();
      } else if (act === 'select-all') {
        state.activeTool = 'select';
        state.selectedIds = state.annotations.filter((a) => a.page === state.currentPage).map((a) => a.id);
        renderPageAnnotations(state.currentPage);
      } else if (act === 'rotate-right') {
        state.rotation = (state.rotation + 90) % 360;
        setZoom(state.zoom, state.zoomMode);
      }
    };
  });

  // Left & Right Sidebar Tab Switching
  document.querySelectorAll('[data-left-tab]').forEach((tabBtn) => {
    tabBtn.onclick = () => {
      state.leftTab = tabBtn.dataset.leftTab;
      document.querySelectorAll('[data-left-tab]').forEach((b) => b.classList.toggle('active', b === tabBtn));
      renderLeftSidebarContent();
      saveViewState();
    };
  });

  document.querySelectorAll('[data-right-tab]').forEach((tabBtn) => {
    tabBtn.onclick = () => {
      state.rightTab = tabBtn.dataset.rightTab;
      document.querySelectorAll('[data-right-tab]').forEach((b) => b.classList.toggle('active', b === tabBtn));
      renderRightSidebarContent();
      saveViewState();
    };
  });

  // Close open dropdowns on outside click
  document.addEventListener('click', () => {
    document.querySelectorAll('.kn-dropdown-menu.open').forEach((m) => m.classList.remove('open'));
  });

  // Keyboard Shortcuts
  window._knKeyHandler = (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      if (e.shiftKey) performRedo();
      else performUndo();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
      e.preventDefault();
      performRedo();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
      e.preventDefault();
      document.getElementById('kn-btn-search')?.click();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'a') {
      e.preventDefault();
      state.selectedIds = state.annotations.filter((a) => a.page === state.currentPage).map((a) => a.id);
      renderPageAnnotations(state.currentPage);
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      if (state.selectedIds.length > 0) {
        pushHistory();
        state.annotations = state.annotations.filter((a) => !state.selectedIds.includes(a.id));
        state.selectedIds = [];
        saveAnnotations();
        renderPageAnnotations(state.currentPage);
        renderLeftSidebarContent();
      }
    } else if (e.key === 'Escape') {
      if (state.readingMode) toggleReadingMode(false);
      state.selectedIds = [];
      state.croppingId = null;
      state.toolPopoverOpen = false;
      toolPopover?.classList.remove('open');
      renderPageAnnotations(state.currentPage);
    }
  };
  window.addEventListener('keydown', window._knKeyHandler);

  // Initial Build & Real PDF.js Loader (when sheet.fileUrl is available)
  buildPageCards();
  renderLeftSidebarContent();
  renderRightSidebarContent();
  updateHistoryButtons();

  async function renderVisiblePdfPages() {
    if (!state.pdfDoc) return;
    for (let p = 1; p <= state.totalPages; p++) {
      try {
        const page = await state.pdfDoc.getPage(p);
        const vp = page.getViewport({ scale: state.zoom * 1.2, rotation: state.rotation });
        const canvas = document.getElementById(`kn-pdf-canvas-${p}`);
        if (canvas) {
          canvas.width = vp.width;
          canvas.height = vp.height;
          await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
        }
      } catch (e) {}
    }
  }

  if (sheet.fileUrl && window.pdfjsLib) {
    try {
      const loadingTask = window.pdfjsLib.getDocument(sheet.fileUrl);
      state.pdfDoc = await loadingTask.promise;
      state.totalPages = state.pdfDoc.numPages;
      document.getElementById('kn-total-pages').textContent = state.totalPages;
      buildPageCards();
      renderLeftSidebarContent();
      await renderVisiblePdfPages();
    } catch (e) {}
  }
};

function hexToRgba(hex, alpha) {
  const clean = (hex || '#FACC15').replace('#', '');
  const num = parseInt(clean, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
