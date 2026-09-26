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

async function renderKuroNotesSheet(containerOrId, sheetIdOrQuery, maybeQuery) {
  let container = null;
  let targetId = null;

  if (typeof containerOrId === 'string') {
    targetId = containerOrId.trim();
    container = document.getElementById('page-content') || document.getElementById('app');
  } else if (containerOrId && containerOrId.nodeType === 1) {
    container = containerOrId;
    if (typeof sheetIdOrQuery === 'string' && sheetIdOrQuery.trim()) {
      targetId = sheetIdOrQuery.trim();
    } else if (sheetIdOrQuery && typeof sheetIdOrQuery.get === 'function') {
      targetId = sheetIdOrQuery.get('id') || sheetIdOrQuery.get('sheetId');
    } else if (sheetIdOrQuery && typeof sheetIdOrQuery === 'object') {
      targetId = sheetIdOrQuery.id || sheetIdOrQuery.sheetId;
    }
    if (!targetId && maybeQuery) {
      if (typeof maybeQuery.get === 'function') {
        targetId = maybeQuery.get('id') || maybeQuery.get('sheetId');
      } else if (typeof maybeQuery === 'object') {
        targetId = maybeQuery.id || maybeQuery.sheetId;
      }
    }
  } else {
    container = document.getElementById('app') || document.getElementById('page-content');
  }

  if (!targetId) {
    try {
      const hash = window.location.hash || '';
      const qIdx = hash.indexOf('?');
      if (qIdx !== -1) {
        const params = new URLSearchParams(hash.slice(qIdx + 1));
        targetId = params.get('id') || params.get('sheetId');
      } else {
        const m = hash.match(/\/sheet(?:s|-detail)?\/([^/?#]+)/i);
        if (m && m[1]) targetId = decodeURIComponent(m[1]);
      }
    } catch (e) {}
  }

  if (!container) return;

  const isAr =
    (typeof window.I18N !== 'undefined' && typeof window.I18N.getLang === 'function' && window.I18N.getLang() === 'ar') ||
    (typeof I18n !== 'undefined' && I18n.currentLang === 'ar');
  const t = (ar, en) => (isAr ? ar : en);

  // Helper: Hide global chrome so Kuro Notes owns 100% of the viewport
  const appSidebar = document.getElementById('app-sidebar') || document.getElementById('sidebar');
  const appHeader = document.getElementById('site-header') || document.getElementById('top-header');
  const mobileNav = document.querySelector('.mobile-bottom-nav');
  if (appSidebar) appSidebar.style.display = 'none';
  if (appHeader) appHeader.style.display = 'none';
  if (mobileNav) mobileNav.style.display = 'none';
  document.body.style.overflow = 'hidden';

  const restoreGlobalUI = () => {
    if (appSidebar) appSidebar.style.display = '';
    if (appHeader) appHeader.style.display = '';
    if (mobileNav) mobileNav.style.display = '';
    document.body.classList.remove('studio-fullscreen-active');
    document.body.style.overflow = '';
    if (window._knKeyHandler) {
      window.removeEventListener('keydown', window._knKeyHandler);
      window._knKeyHandler = null;
    }
  };

  const navigateBackToSheets = (subjectId) => {
    restoreGlobalUI();
    const targetRoute = subjectId ? `/sheets?subject=${encodeURIComponent(subjectId)}` : '/sheets';
    if (window.router && typeof window.router.navigate === 'function') {
      window.router.navigate(targetRoute);
    } else if (typeof Router !== 'undefined' && typeof Router.navigate === 'function') {
      Router.navigate(targetRoute);
    } else {
      window.location.hash = `#${targetRoute}`;
    }
  };

  // Multi-source lookup across window.DATA, cached cloud sheets, custom admin sheets, and legacy Store
  const findSheetById = (id) => {
    if (!id) return null;
    const cleanId = String(id).trim();
    if (window.DATA) {
      if (typeof window.DATA.getSheetById === 'function') {
        const found = window.DATA.getSheetById(cleanId);
        if (found) return found;
      }
      if (Array.isArray(window.DATA.sheets)) {
        const found = window.DATA.sheets.find((s) => s && String(s.id) === cleanId);
        if (found) return found;
      }
    }
    const storageKeys = ['kf_cloud_cached_sheets', 'kf_admin_custom_sheets', 'kf_sheets'];
    for (const k of storageKeys) {
      try {
        const arr = JSON.parse(localStorage.getItem(k) || '[]');
        if (Array.isArray(arr)) {
          const found = arr.find((s) => s && String(s.id) === cleanId);
          if (found) return found;
        }
      } catch (e) {}
    }
    if (typeof Store !== 'undefined' && typeof Store.getById === 'function') {
      try {
        const found = Store.getById('sheets', cleanId);
        if (found) return found;
      } catch (e) {}
    }
    return null;
  };

  let sheet = findSheetById(targetId);

  // If sheet is not yet in memory/localStorage, show a branded Kuro Notes loading state while syncing cloud data
  if (!sheet && targetId) {
    container.innerHTML = `
      <div class="kuro-notes-workspace" style="display:flex;align-items:center;justify-content:center;min-height:100vh;background:#F6F1E8;color:#1F1A17;font-family:'IBM Plex Sans Arabic','Inter',sans-serif;">
        <div style="background:#FFFFFF;border:1px solid #E8E2D5;border-radius:16px;padding:36px 42px;text-align:center;box-shadow:0 16px 40px rgba(31,26,23,0.08);max-width:420px;width:90%;">
          <div style="width:44px;height:44px;margin:0 auto 16px;border-radius:50%;border:3.5px solid #F3ECE3;border-top-color:#7E1D2A;animation:knSpin 0.8s linear infinite;"></div>
          <div style="font-size:1.05rem;font-weight:800;color:#7E1D2A;margin-bottom:6px;">Kuro Notes</div>
          <div style="font-size:0.9rem;font-weight:700;color:#1F1A17;">${t('جاري تحميل الشيت...', 'Loading sheet...')}</div>
          <div style="font-size:0.78rem;color:#7C736B;margin-top:4px;">${t('يرجى الانتظار لحظات بينما يتم تجهيز ملف المحاضرة', 'Fetching lecture sheet data and preparing workspace')}</div>
        </div>
        <style>@keyframes knSpin { to { transform: rotate(360deg); } }</style>
      </div>
    `;

    try {
      if (window.DATA && !window.DATA.loaded && typeof window.DATA.init === 'function') {
        await window.DATA.init();
      }
      sheet = findSheetById(targetId);
      if (!sheet && window.DATA && typeof window.DATA.syncCloudSheets === 'function') {
        await window.DATA.syncCloudSheets();
        sheet = findSheetById(targetId);
      }
      if (!sheet) {
        try {
          const res = await fetch('data/sheets.json');
          if (res.ok) {
            const json = await res.json();
            if (Array.isArray(json?.sheets)) {
              sheet = json.sheets.find((s) => s && String(s.id) === String(targetId)) || null;
            }
          }
        } catch (e) {}
      }
      if (!sheet && window.CloudSync && typeof CloudSync.isConfigured === 'function' && CloudSync.isConfigured()) {
        await CloudSync.pullAll();
        sheet = findSheetById(targetId);
      }
    } catch (syncErr) {
      console.error('[KuroNotes] Error syncing sheet data:', syncErr);
    }
  }

  if (!sheet) {
    console.error('[KuroNotes] Unable to open sheet — Sheet ID not found in local or cloud stores:', targetId);
    container.innerHTML = `
      <div class="kuro-notes-workspace" style="display:flex;flex-direction:column;min-height:100vh;background:#F6F1E8;color:#1F1A17;font-family:'IBM Plex Sans Arabic','Inter',sans-serif;">
        <header class="kn-header" style="display:flex;align-items:center;justify-content:space-between;padding:0 20px;height:56px;background:#FBF8F3;border-bottom:1px solid #E8E2D5;">
          <button class="kn-btn kn-btn-back" id="kn-notfound-back" style="cursor:pointer;">
            <span>← ${t('العودة للشيتات', 'Back to Sheets')}</span>
          </button>
          <div style="font-weight:800;color:#7E1D2A;">Kuro Notes</div>
          <div></div>
        </header>
        <div style="flex:1;display:flex;align-items:center;justify-content:center;padding:24px;">
          <div class="empty-state" style="background:#FFFFFF;border:1px solid #E8E2D5;border-radius:16px;padding:40px 32px;text-align:center;max-width:460px;width:100%;box-shadow:0 16px 40px rgba(31,26,23,0.08);">
            <div style="width:52px;height:52px;margin:0 auto 16px;border-radius:14px;background:rgba(126,29,42,0.08);color:#7E1D2A;display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:800;">!</div>
            <h3 style="font-size:1.15rem;font-weight:800;color:#1F1A17;margin-bottom:8px;">${t('تعذر فتح هذا الشيت • الشيت غير موجود', 'Unable to open this sheet • Sheet Not Found')}</h3>
            <p style="font-size:0.84rem;color:#7C736B;line-height:1.6;margin-bottom:22px;">
              ${t('لم نتمكن من العثور على بيانات هذا الشيت أو ربما تم حذفه.', 'The requested lecture sheet could not be found or failed to load.')}
              ${targetId ? `<br/><code style="font-size:0.74rem;color:#7E1D2A;">ID: ${escapeHtml(targetId)}</code>` : ''}
            </p>
            <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
              <button class="kn-btn kn-btn-primary" id="kn-notfound-retry" style="padding:8px 18px;font-weight:700;cursor:pointer;">
                ${t('إعادة المحاولة (Retry)', 'Retry')}
              </button>
              <button class="kn-btn" id="kn-notfound-sheets" style="padding:8px 18px;font-weight:700;cursor:pointer;">
                ${t('العودة للشيتات (Back to Sheets)', 'Back to Sheets')}
              </button>
            </div>
          </div>
        </div>
      </div>`;
    document.getElementById('kn-notfound-back')?.addEventListener('click', () => navigateBackToSheets());
    document.getElementById('kn-notfound-sheets')?.addEventListener('click', () => navigateBackToSheets());
    document.getElementById('kn-notfound-retry')?.addEventListener('click', () => {
      renderKuroNotesSheet(container, targetId);
    });
    return;
  }

  // Record recent sheet view in both Store APIs
  try {
    if (typeof Store !== 'undefined' && typeof Store.addRecent === 'function') {
      Store.addRecent({
        type: 'sheet',
        id: sheet.id,
        title: sheet.title_en || sheet.title || sheet.title_ar || sheet.name,
        subjectId: sheet.subject_id || sheet.subjectId,
        url: `/sheet-detail?id=${sheet.id}`,
      });
    }
    if (window.Store && typeof window.Store.recordSheetView === 'function') {
      window.Store.recordSheetView(sheet.id);
    }
  } catch (e) {}

  try {
    localStorage.setItem(
      'kf_last_opened_sheet',
      JSON.stringify({
        id: sheet.id,
        title: sheet.title_en || sheet.title || sheet.title_ar || sheet.name,
        subjectId: sheet.subject_id || sheet.subjectId,
        openedAt: Date.now(),
      })
    );
  } catch (e) {}

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
    pdfBaseRatio: null,
    totalPages: Math.max(1, parseInt(sheet.pages || sheet.pages_count, 10) || 12),
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
    annotations: safeJSON(KEY_ANNOTS, []).filter((a) => a && (a.type !== 'text' || (a.text && a.text.trim().length > 0))),
    bookmarks: safeJSON(KEY_BM, []),
    undoStack: [],
    redoStack: [],

    // Selection / Lasso & Active Editing State Machine
    selectionMode: 'rect', // 'rect' | 'lasso'
    selectionFilter: 'all', // 'all' | 'handwriting' | 'pen' | 'highlighter' | 'shape' | 'image' | 'text' | 'note'
    selectedIds: [],
    editingTextId: null,
    editingNoteId: null,
    textCreationGuardUntil: 0,
    noteCreationState: 'IDLE', // 'IDLE' | 'NOTE_TOOL_ACTIVE' | 'CREATE_NOTE' | 'EDIT_NOTE'
    clipboard: [],
    croppingId: null,
    cropRect: null, // { x, y, w, h } normalized 0..1 relative to image

    // Tool Configurations
    highlighter: {
      mode: 'freehand', // 'freehand' | 'straight'
      color: '#FACC15',
      size: 20,
      opacity: 0.42,
      presets: safeJSON(KEY_HL_PRESETS, [
        { id: 'hl-p1', name: 'مهم Important', color: '#FACC15', size: 20, opacity: 0.42, mode: 'straight' },
        { id: 'hl-p2', name: 'تعريف Definition', color: '#F472B6', size: 20, opacity: 0.40, mode: 'straight' },
        { id: 'hl-p3', name: 'مثال Example', color: '#38BDF8', size: 20, opacity: 0.38, mode: 'freehand' },
        { id: 'hl-p4', name: 'مراجعة Review', color: '#4ADE80', size: 22, opacity: 0.40, mode: 'freehand' },
      ]),
      activePresetId: 'hl-p1',
    },
    pen: {
      mode: 'freehand', // 'freehand' | 'straight'
      color: '#7E1D2A',
      size: 4,
      opacity: 1.0,
      presets: safeJSON(KEY_PEN_PRESETS, [
        { id: 'pen-p1', name: 'مهم Important', color: '#7E1D2A', size: 4, opacity: 1.0, mode: 'freehand' },
        { id: 'pen-p2', name: 'ملاحظات Notes', color: '#1D4ED8', size: 3, opacity: 1.0, mode: 'freehand' },
        { id: 'pen-p3', name: 'شرح Explanation', color: '#15803D', size: 3, opacity: 0.95, mode: 'freehand' },
        { id: 'pen-p4', name: 'رسم Diagram', color: '#EA580C', size: 4, opacity: 0.95, mode: 'straight' },
      ]),
      activePresetId: 'pen-p1',
    },
    eraser: {
      mode: 'stroke', // 'stroke' | 'object' | 'partial'
      size: 24,
      showCursor: true,
      smoothEdges: true,
      fixedSize: false,
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

      <!-- 1. TOP HEADER (Responsive across Desktop, Tablet/iPad, and Mobile) -->
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

          <!-- Sheet Name Pill -->
          <div class="kn-doc-title-pill" id="kn-doc-title-pill" title="${escapeHtml(docTitle)}">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7E1D2A" stroke-width="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <span class="kn-doc-title-text">${escapeHtml(docTitle)}</span>
          </div>

          <!-- Undo / Redo Pill in Header -->
          <div class="kn-header-pill-group kn-tool-group kn-group-history" id="kn-header-history">
            <button class="kn-tool-btn" id="kn-btn-undo" title="Undo (Ctrl+Z)" disabled>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
            </button>
            <button class="kn-tool-btn" id="kn-btn-redo" title="Redo (Ctrl+Y)" disabled>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/></svg>
            </button>
          </div>
        </div>

        <!-- Center / Right Header Controls: Page Navigation + Zoom + Search + Bookmark + Share + More -->
        <div class="kn-header-controls">
          <!-- Page Navigation Pill -->
          <div class="kn-header-pill-group kn-tool-group kn-group-pagenav" id="kn-header-pagenav">
            <button class="kn-tool-btn" id="kn-btn-prev" title="Previous Page">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div class="kn-page-input-wrap" title="Jump to Page">
              <input type="number" class="kn-page-input" id="kn-page-input" value="${state.currentPage}" min="1" max="${state.totalPages}" />
              <span style="color:var(--kn-text-muted);font-weight:700;">/</span>
              <span id="kn-total-pages">${state.totalPages}</span>
            </div>
            <button class="kn-tool-btn" id="kn-btn-next" title="Next Page">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>

          <!-- Zoom Controls Pill (50%, 75%, 100%, 130%, 150%, 200%, 300%) -->
          <div class="kn-header-pill-group kn-tool-group kn-group-zoom" id="kn-header-zoom">
            <button class="kn-tool-btn" id="kn-btn-zoom-out" title="Zoom Out">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
            <div class="kn-dropdown-wrap">
              <button class="kn-zoom-btn" id="kn-btn-zoom-menu" title="Zoom Presets (50% - 300%)">
                <span id="kn-zoom-label">${Math.round(state.zoom * 100)}%</span>
              </button>
              <div class="kn-dropdown-menu" id="kn-zoom-dropdown">
                <button class="kn-dropdown-item" data-zoom="fit-page"><span>Fit Page</span></button>
                <button class="kn-dropdown-item" data-zoom="fit-width"><span>Fit Width</span></button>
                <button class="kn-dropdown-item" data-zoom="0.5"><span>50%</span></button>
                <button class="kn-dropdown-item" data-zoom="0.75"><span>75%</span></button>
                <button class="kn-dropdown-item" data-zoom="1.0"><span>100%</span></button>
                <button class="kn-dropdown-item" data-zoom="1.3"><span>130%</span></button>
                <button class="kn-dropdown-item" data-zoom="1.5"><span>150%</span></button>
                <button class="kn-dropdown-item" data-zoom="2.0"><span>200%</span></button>
                <button class="kn-dropdown-item" data-zoom="3.0"><span>300%</span></button>
              </div>
            </div>
            <button class="kn-tool-btn" id="kn-btn-zoom-in" title="Zoom In">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
          </div>
        </div>

        <div class="kn-header-right">
          <button class="kn-icon-btn" id="kn-btn-search" title="Search in Sheet (Ctrl+F)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>

          <button class="kn-icon-btn ${state.bookmarks.includes(state.currentPage) ? 'active' : ''}" id="kn-btn-bookmark" title="Bookmark Current Page">
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
            </div>
          </div>
        </div>
      </header>

      <!-- 2. FIXED TOP TOOLBAR (Responsive, No Horizontal Scrollbar, Core Study Tools Only) -->
      <div class="kn-toolbar" id="kn-toolbar" role="toolbar" aria-label="Kuro Notes Study Toolbar">
        <div class="kn-tool-group kn-group-annotations">
          <!-- 1. Select -->
          <button class="kn-tool-btn kn-pill-tool" data-tool="select" title="Select & Transform Tool (V)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 3 7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="m13 13 6 6"/></svg>
            <span class="kn-tool-label">Select</span>
          </button>

          <!-- 2. Pen -->
          <button class="kn-tool-btn kn-pill-tool" data-tool="pen" title="Pen Tool (P)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
            <span class="kn-tool-label">Pen</span>
            <span class="kn-tool-color-dot" id="kn-pen-dot" style="background:${state.pen.color};"></span>
            <span class="kn-tool-chevron">⌄</span>
          </button>

          <!-- 3. Highlighter -->
          <button class="kn-tool-btn kn-pill-tool kn-tool-highlighter" data-tool="highlighter" title="Highlighter Tool — Under-Text (H)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 11-6 6v3h9l3-3"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></svg>
            <span class="kn-tool-label">Highlighter</span>
            <span class="kn-tool-color-dot" id="kn-hl-dot" style="background:${state.highlighter.color};"></span>
            <span class="kn-tool-chevron">⌄</span>
          </button>

          <!-- 4. Eraser -->
          <button class="kn-tool-btn kn-pill-tool" data-tool="eraser" title="Eraser Tool (E)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>
            <span class="kn-tool-label">Eraser</span>
            <span class="kn-tool-chevron">⌄</span>
          </button>

          <!-- 5. Text -->
          <button class="kn-tool-btn kn-pill-tool" data-tool="text" title="Text Tool (T)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
            <span class="kn-tool-label">Text</span>
          </button>

          <!-- 6. Image -->
          <button class="kn-tool-btn kn-pill-tool" data-tool="image" title="Insert Image (I)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <span class="kn-tool-label">Image</span>
          </button>

          <!-- 7. Note -->
          <button class="kn-tool-btn kn-pill-tool" data-tool="notes" title="Study Note Card (N)">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"/><path d="M15 3v6h6"/></svg>
            <span class="kn-tool-label">Note</span>
          </button>

          <!-- 8. Bookmark -->
          <button class="kn-tool-btn kn-pill-tool ${state.bookmarks.includes(state.currentPage) ? 'active' : ''}" id="kn-toolbar-bookmark" title="Bookmark Current Page">
            <svg viewBox="0 0 24 24" fill="none" stroke="#7E1D2A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
            <span class="kn-tool-label">Bookmark</span>
          </button>

          <!-- 9. More / Secondary Actions -->
          <div class="kn-dropdown-wrap kn-group-extra">
            <button class="kn-tool-btn kn-pill-tool" id="kn-toolbar-more" title="More Tool Options">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>
              <span class="kn-tool-label kn-more-label">More</span>
            </button>
            <div class="kn-dropdown-menu" id="kn-toolbar-more-menu">
              <button class="kn-dropdown-item" data-more-action="select-all"><span>Select All on Page (Ctrl+A)</span></button>
              <button class="kn-dropdown-item" data-more-action="clear-page"><span>Clear Page Annotations</span></button>
              <button class="kn-dropdown-item" data-more-action="rotate-right"><span>Rotate Page 90°</span></button>
              <button class="kn-dropdown-item" data-more-action="focus-mode"><span>Focus Reading Mode</span></button>
            </div>
          </div>
        </div>

        <!-- Hidden legacy buttons preserved for backwards-compatible hooks -->
        <div class="kn-toolbar-end" style="display:none;">
          <button class="kn-tool-btn" id="kn-btn-reading-mode" title="Focus Mode"></button>
          <button class="kn-tool-btn" id="kn-btn-right-sidebar" title="Notes Panel"></button>
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

      <!-- 3. MAIN WORKSPACE BODY (Left Pages Sidebar + Central Document Workspace) -->
      <div class="kn-workspace-body">
        <!-- LEFT PAGES SIDEBAR (Matching Reference Image: Pages header + « Collapse button + vertical page thumbnails) -->
        <aside class="kn-sidebar-left ${state.leftSidebarOpen ? '' : 'kn-sidebar-collapsed'}" id="kn-sidebar-left">
          <div class="kn-sidebar-pages-header" id="kn-left-tabs">
            <div class="kn-sidebar-pages-tabs">
              <button class="kn-pages-header-btn kn-tab-pill ${state.leftTab === 'pages' ? 'active' : ''}" data-left-tab="pages">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7E1D2A" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
                <span>Pages</span>
              </button>
              <button class="kn-pages-header-btn kn-tab-pill ${state.leftTab === 'bookmarks' ? 'active' : ''}" data-left-tab="bookmarks" title="Bookmarked Pages">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
              </button>
              <button class="kn-pages-header-btn kn-tab-pill ${state.leftTab === 'annotations' ? 'active' : ''}" data-left-tab="annotations" title="Annotations List">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/></svg>
              </button>
            </div>
            <button class="kn-sidebar-collapse-btn" id="kn-sidebar-collapse-btn" title="Collapse Pages Sidebar">«</button>
          </div>
          <div class="kn-sidebar-content" id="kn-left-content"></div>
        </aside>

        <!-- CENTRAL DOCUMENT VIEWPORT -->
        <main class="kn-document-viewport" id="kn-viewport" tabindex="0">
          <!-- Loading State Banner inside Kuro Notes while PDF is fetched & rendered -->
          <div id="kn-doc-loader" style="display:none;align-items:center;justify-content:center;gap:12px;background:#FFFFFF;border:1px solid #E8E2D5;border-radius:12px;padding:14px 22px;margin:8px auto 14px;box-shadow:0 8px 24px rgba(31,26,23,0.08);max-width:440px;width:92%;">
            <div style="width:22px;height:22px;border-radius:50%;border:3px solid #F3ECE3;border-top-color:#7E1D2A;animation:knSpin 0.8s linear infinite;flex-shrink:0;"></div>
            <div style="text-align:start;">
              <div style="font-size:0.84rem;font-weight:800;color:#1F1A17;">${t('جاري تحميل ملف الشيت...', 'Loading sheet...')}</div>
              <div style="font-size:0.72rem;color:#7C736B;" id="kn-doc-loader-sub">${escapeHtml(docTitle)}</div>
            </div>
            <style>@keyframes knSpin { to { transform: rotate(360deg); } }</style>
          </div>

          <!-- Error State Banner inside Kuro Notes if PDF fails to load -->
          <div id="kn-doc-error" style="display:none;flex-direction:column;align-items:center;justify-content:center;gap:10px;background:#FFFFFF;border:1px solid #FECACA;border-radius:14px;padding:24px 28px;margin:12px auto 18px;box-shadow:0 12px 32px rgba(126,29,42,0.1);max-width:520px;width:92%;text-align:center;">
            <div style="width:42px;height:42px;border-radius:12px;background:rgba(220,38,38,0.1);color:#DC2626;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:1.2rem;">!</div>
            <div style="font-size:1rem;font-weight:800;color:#1F1A17;">${t('تعذر فتح ملف الـ PDF الأصلي لهذا الشيت', 'Unable to open this sheet PDF')}</div>
            <div id="kn-doc-error-msg" style="font-size:0.78rem;color:#7C736B;line-height:1.5;"></div>
            <div style="display:flex;align-items:center;justify-content:center;gap:8px;flex-wrap:wrap;margin-top:6px;">
              <button class="kn-btn kn-btn-primary" id="kn-pdf-retry-btn" style="padding:6px 14px;font-weight:700;cursor:pointer;">${t('إعادة المحاولة (Retry)', 'Retry')}</button>
              <a class="kn-btn" id="kn-pdf-direct-link" href="#" target="_blank" rel="noopener" style="padding:6px 14px;font-weight:700;text-decoration:none;display:none;">${t('فتح الملف مباشرة', 'Open PDF Directly')}</a>
              <button class="kn-btn" id="kn-pdf-error-back-btn" style="padding:6px 14px;font-weight:700;cursor:pointer;">${t('العودة للشيتات (Back to Sheets)', 'Back to Sheets')}</button>
            </div>
          </div>

          <div class="kn-pages-container" id="kn-pages-container"></div>
        </main>

        <!-- RIGHT SIDEBAR (Collapsed by default; no AI or Outline clutter) -->
        <aside class="kn-sidebar-right kn-sidebar-collapsed" id="kn-sidebar-right" style="display:none;">
          <div class="kn-sidebar-tab-bar" id="kn-right-tabs">
            <button class="kn-tab-pill active" data-right-tab="notes">Notes (${state.annotations.filter((a) => a.type === 'note').length})</button>
          </div>
          <div id="kn-right-content" style="display:flex;flex-direction:column;flex:1;overflow:hidden;"></div>
        </aside>
      </div>

      <!-- Tablet / iPad Quick-Toggle Floating Corner Button for Pages -->
      <button class="kn-ipad-fab kn-ipad-fab-left" id="kn-ipad-fab-left">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
        <span>Pages</span>
      </button>
      <button class="kn-ipad-fab kn-ipad-fab-right" id="kn-ipad-fab-right" style="display:none;"></button>

      <!-- Mobile Compact Bottom Bar (<768px) -->
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
        <button class="kn-btn" id="kn-mob-panel-btn" style="display:none;"></button>
      </div>
    </div>
  `;

  // ══════════════════════════════════════════════════════════════════════════
  // PAGE STACK BUILDER (5-Layer Architecture per Page)
  // ══════════════════════════════════════════════════════════════════════════
  const pagesContainer = document.getElementById('kn-pages-container');

  function getPageDimensions() {
    const baseHeight = state.pdfBaseRatio ? Math.round(BASE_W * state.pdfBaseRatio) : BASE_H;
    const swapped = state.rotation === 90 || state.rotation === 270;
    const w = (swapped ? baseHeight : BASE_W) * state.zoom;
    const h = (swapped ? BASE_W : baseHeight) * state.zoom;
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
        <div class="kn-interaction-layer ${state.activeTool ? 'tool-active' : ''} ${['pen', 'highlighter', 'eraser', 'shapes'].includes(state.activeTool) ? 'kn-drawing-active' : ''}" id="kn-interact-layer-${p}" data-page="${p}"></div>
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
  // RENDER ALL ANNOTATIONS ON A PAGE (5-Layer Stack + Zoom-Locked Scale Helpers)
  // ══════════════════════════════════════════════════════════════════════════
  function getPageLogicalSize(pageNum) {
    const isSideways = state.rotation === 90 || state.rotation === 270;
    return {
      w: isSideways ? BASE_H : BASE_W,
      h: isSideways ? BASE_W : BASE_H,
    };
  }

  function getCardScale(pageNum) {
    const card = pagesContainer.querySelector(`.kn-page-card[data-page="${pageNum}"]`);
    const { w: logicalW } = getPageLogicalSize(pageNum);
    if (card) {
      const rect = card.getBoundingClientRect();
      if (rect.width > 10) return rect.width / logicalW;
    }
    return state.zoom;
  }

  function getCanvasScale(pageNum) {
    const hlCanvas = document.getElementById(`kn-hl-canvas-${pageNum}`);
    const { w: logicalW } = getPageLogicalSize(pageNum);
    if (hlCanvas && hlCanvas.width > 10) {
      return hlCanvas.width / logicalW;
    }
    return state.zoom;
  }

  function redrawPageCanvasesOnly(pageNum, s) {
    const hlCanvas = document.getElementById(`kn-hl-canvas-${pageNum}`);
    const penCanvas = document.getElementById(`kn-annot-canvas-${pageNum}`);
    if (!hlCanvas || !penCanvas) return;
    const hlCtx = hlCanvas.getContext('2d');
    const penCtx = penCanvas.getContext('2d');
    hlCtx.clearRect(0, 0, hlCanvas.width, hlCanvas.height);
    penCtx.clearRect(0, 0, penCanvas.width, penCanvas.height);

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
      }
    });
  }

  function renderPageAnnotations(pageNum) {
    const hlCanvas = document.getElementById(`kn-hl-canvas-${pageNum}`);
    const penCanvas = document.getElementById(`kn-annot-canvas-${pageNum}`);
    const objLayer = document.getElementById(`kn-objects-layer-${pageNum}`);
    if (!hlCanvas || !penCanvas || !objLayer) return;

    const s = getCanvasScale(pageNum);
    redrawPageCanvasesOnly(pageNum, s);
    objLayer.innerHTML = '';

    const pageAnnots = state.annotations
      .filter((a) => a.page === pageNum)
      .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

    pageAnnots.forEach((ann) => {
      if (ann.type === 'text') {
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
    if ((!ann.points || ann.points.length === 0) && (!ann.rects || ann.rects.length === 0)) return;
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
  function focusTextEditor(editorEl) {
    if (!editorEl) return;
    try {
      editorEl.contentEditable = 'true';
      editorEl.focus({ preventScroll: true });
      const sel = window.getSelection();
      if (sel) {
        const range = document.createRange();
        range.selectNodeContents(editorEl);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      }
    } catch (_) {
      try {
        editorEl.focus();
      } catch (__) {}
    }
  }

  function attachObjectPropagationBarrier(el) {
    ['pointerdown', 'pointerup', 'mousedown', 'mouseup', 'click', 'dblclick', 'touchstart', 'touchend'].forEach((evtName) => {
      el.addEventListener(
        evtName,
        (ev) => {
          if (state.activeTool !== 'eraser') {
            ev.stopPropagation();
          }
        },
        evtName.startsWith('touch') ? { passive: true } : false
      );
    });
  }

  function updateSelectionOverlayOnly(pageNum) {
    const objLayer = document.getElementById(`kn-objects-layer-${pageNum}`);
    if (!objLayer) return;
    objLayer.querySelectorAll('.kn-selection-box, .kn-context-bar').forEach((node) => node.remove());
    objLayer.querySelectorAll('.kn-page-object').forEach((node) => {
      node.classList.toggle('selected', state.selectedIds.includes(node.dataset.id));
    });
    const s = getCanvasScale(pageNum);
    renderSelectionOverlay(pageNum, objLayer, s);
  }

  function renderTextObject(objLayer, ann, s) {
    const el = document.createElement('div');
    const isSelected = state.selectedIds.includes(ann.id);
    const isEditing = state.editingTextId === ann.id;
    el.className = `kn-page-object kn-textbox-obj ${isSelected ? 'selected' : ''} ${isEditing ? 'editing' : ''}`;
    el.dataset.id = ann.id;
    el.style.left = `${ann.x * s}px`;
    el.style.top = `${ann.y * s}px`;
    el.style.width = `${(ann.w || 200) * s}px`;
    el.style.minHeight = `${(ann.h || 36) * s}px`;
    el.style.opacity = ann.opacity !== undefined ? ann.opacity : 1;
    if (ann.rotation) el.style.transform = `rotate(${ann.rotation}deg)`;

    const editor = document.createElement('div');
    editor.className = 'kn-textbox-editor';
    editor.contentEditable = isEditing ? 'true' : 'false';
    editor.tabIndex = 0;
    editor.dataset.placeholder = 'Type here... / اكتب هنا...';
    editor.setAttribute('role', 'textbox');
    editor.setAttribute('aria-multiline', 'true');
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

    let beforeEditSnapshot = null;
    let pushedHistoryForSession = false;

    const startInlineTextEditing = (e) => {
      if (e) e.stopPropagation();
      state.editingTextId = ann.id;
      state.textCreationGuardUntil = Date.now() + 450;
      state.selectedIds = [ann.id];
      if (state.activeTool === 'text') {
        deactivateCreationTool();
      }
      el.classList.add('editing');
      editor.contentEditable = 'true';
      updateSelectionOverlayOnly(ann.page);
      focusTextEditor(editor);
    };

    // Double-click (or single-click when Text Tool is active) enables inline text editing
    el.addEventListener('dblclick', startInlineTextEditing);
    el.addEventListener('click', (e) => {
      if (state.activeTool === 'text' && state.editingTextId !== ann.id) {
        startInlineTextEditing(e);
      }
    });

    editor.addEventListener('pointerdown', (e) => {
      if (state.editingTextId === ann.id || editor.contentEditable === 'true') {
        e.stopPropagation();
      }
    });
    editor.addEventListener(
      'touchstart',
      (e) => {
        if (state.editingTextId === ann.id || editor.contentEditable === 'true') {
          e.stopPropagation();
        }
      },
      { passive: true }
    );

    editor.addEventListener('focus', () => {
      state.editingTextId = ann.id;
      el.classList.add('editing');
      if (!state.selectedIds.includes(ann.id)) {
        state.selectedIds = [ann.id];
      }
      if (!beforeEditSnapshot) {
        // Capture state before typing (if newly created, snapshot without this empty text)
        const snapList = !ann.text
          ? state.annotations.filter((a) => a.id !== ann.id)
          : state.annotations;
        beforeEditSnapshot = JSON.stringify(snapList);
      }
    });

    // Live in-place persistence on every keystroke without DOM remounting (keeps mobile keyboard open!)
    editor.addEventListener('input', () => {
      const currentRaw = editor.innerText;
      if (!pushedHistoryForSession && currentRaw.trim().length > 0 && beforeEditSnapshot) {
        state.undoStack.push(beforeEditSnapshot);
        if (state.undoStack.length > 60) state.undoStack.shift();
        state.redoStack = [];
        updateHistoryButtons();
        pushedHistoryForSession = true;
      }
      ann.text = currentRaw;
      saveAnnotations();
    });

    editor.addEventListener('keydown', (e) => {
      e.stopPropagation();
      if (e.key === 'Escape') {
        state.textCreationGuardUntil = 0;
        editor.blur();
      }
    });

    editor.addEventListener('blur', () => {
      // Guard against synthetic mobile/tablet blur during finger-release or virtual keyboard slide-up
      if (state.editingTextId === ann.id && Date.now() < state.textCreationGuardUntil) {
        requestAnimationFrame(() => focusTextEditor(editor));
        return;
      }

      if (state.editingTextId === ann.id) {
        state.editingTextId = null;
      }
      el.classList.remove('editing');
      editor.contentEditable = 'false';

      const rawText = editor.innerText;
      const val = rawText.trim();
      if (!val) {
        // Cancel/delete empty text box cleanly
        state.annotations = state.annotations.filter((a) => a.id !== ann.id);
        state.selectedIds = state.selectedIds.filter((id) => id !== ann.id);
        saveAnnotations();
        renderPageAnnotations(ann.page);
        renderLeftSidebarContent();
        return;
      }

      if (!pushedHistoryForSession && ann.text !== rawText && beforeEditSnapshot) {
        state.undoStack.push(beforeEditSnapshot);
        if (state.undoStack.length > 60) state.undoStack.shift();
        state.redoStack = [];
        updateHistoryButtons();
        pushedHistoryForSession = true;
      }
      ann.text = rawText;
      beforeEditSnapshot = null;
      pushedHistoryForSession = false;
      saveAnnotations();
      updateSelectionOverlayOnly(ann.page);
      renderLeftSidebarContent();
    });

    attachObjectPropagationBarrier(el);
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
    img.draggable = false;
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

    attachObjectPropagationBarrier(el);
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
    if (ann.rotation) el.style.transform = `rotate(${ann.rotation}deg)`;

    if (ann.collapsed) {
      el.title = `${ann.category || 'Note'}: ${ann.title || ann.text || ''}`;
      el.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7E1D2A" stroke-width="2.2"><path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"/><path d="M15 3v6h6"/></svg>`;
      el.addEventListener('dblclick', (e) => {
        e.preventDefault();
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
            <button type="button" class="kn-note-pin-btn" title="Pin Note" style="border:none;background:transparent;cursor:pointer;font-size:0.75rem;padding:2px 4px;opacity:${ann.pinned ? '1' : '0.4'};">📌</button>
            <button type="button" class="kn-note-collapse-btn" title="Minimize to Compact Icon" style="border:none;background:transparent;cursor:pointer;font-size:0.75rem;padding:2px 4px;">—</button>
            <button type="button" class="kn-note-del-btn" title="Delete Note" style="border:none;background:transparent;cursor:pointer;font-size:0.78rem;font-weight:800;padding:2px 5px;color:#DC2626;">✕</button>
          </div>
        </div>
        <input type="text" class="kn-note-title-input" dir="auto" placeholder="Note Title (optional)..." value="${escapeHtml(ann.title || '')}" />
        <textarea class="kn-note-body-input" dir="auto" placeholder="Write study note...">${escapeHtml(ann.text || '')}</textarea>
      `;

      const titleInp = el.querySelector('.kn-note-title-input');
      const bodyInp = el.querySelector('.kn-note-body-input');
      const pinBtn = el.querySelector('.kn-note-pin-btn');
      const collapseBtn = el.querySelector('.kn-note-collapse-btn');
      const delBtn = el.querySelector('.kn-note-del-btn');

      // Stop pointer/touch propagation on all Note inputs & buttons so they never trigger page creation or drag
      [titleInp, bodyInp, pinBtn, collapseBtn, delBtn].forEach((ctrl) => {
        if (!ctrl) return;
        ['pointerdown', 'pointerup', 'mousedown', 'mouseup', 'click'].forEach((evName) => {
          ctrl.addEventListener(evName, (ev) => ev.stopPropagation());
        });
        ctrl.addEventListener('touchstart', (ev) => ev.stopPropagation(), { passive: true });
        ctrl.addEventListener('touchend', (ev) => ev.stopPropagation(), { passive: true });
      });

      let noteEditSnap = null;
      let noteHistoryPushed = false;
      const captureNoteSnapOnFocus = () => {
        state.editingNoteId = ann.id;
        noteEditSnap = JSON.stringify(state.annotations);
        noteHistoryPushed = false;
      };
      const recordNoteHistoryOnce = () => {
        if (!noteHistoryPushed && noteEditSnap) {
          state.undoStack.push(noteEditSnap);
          if (state.undoStack.length > 60) state.undoStack.shift();
          state.redoStack = [];
          updateHistoryButtons();
          noteHistoryPushed = true;
        }
      };

      titleInp.addEventListener('focus', captureNoteSnapOnFocus);
      bodyInp.addEventListener('focus', captureNoteSnapOnFocus);

      titleInp.addEventListener('input', () => {
        recordNoteHistoryOnce();
        ann.title = titleInp.value;
        ann.updatedAt = Date.now();
        saveAnnotations();
        if (state.rightTab === 'notes') renderRightSidebarContent();
      });
      bodyInp.addEventListener('input', () => {
        recordNoteHistoryOnce();
        ann.text = bodyInp.value;
        ann.updatedAt = Date.now();
        saveAnnotations();
        if (state.rightTab === 'notes') renderRightSidebarContent();
      });

      pinBtn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
      pinBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        ann.pinned = !ann.pinned;
        saveAnnotations();
        renderPageAnnotations(ann.page);
        if (state.rightTab === 'notes') renderRightSidebarContent();
      });

      collapseBtn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
      collapseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        ann.collapsed = true;
        saveAnnotations();
        renderPageAnnotations(ann.page);
      });

      delBtn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
      });
      delBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        pushHistory();
        state.annotations = state.annotations.filter((a) => a.id !== ann.id);
        state.selectedIds = state.selectedIds.filter((id) => id !== ann.id);
        if (state.editingNoteId === ann.id) state.editingNoteId = null;
        saveAnnotations();
        renderPageAnnotations(ann.page);
        renderRightSidebarContent();
        renderLeftSidebarContent();
      });
    }

    attachObjectPropagationBarrier(el);
    makeObjectDraggable(el, ann);
    objLayer.appendChild(el);
  }

  function makeObjectDraggable(el, ann) {
    el.addEventListener(
      'touchstart',
      (e) => {
        if (state.activeTool !== 'eraser') {
          e.stopPropagation();
        }
      },
      { passive: true }
    );

    el.addEventListener('pointerdown', (e) => {
      // Always stop propagation on existing page objects (unless Eraser is active) so tapping inside an object NEVER triggers page creation!
      if (state.activeTool !== 'eraser') {
        e.stopPropagation();
      } else {
        return;
      }

      if (
        e.target.tagName === 'INPUT' ||
        e.target.tagName === 'TEXTAREA' ||
        e.target.isContentEditable ||
        e.target.tagName === 'BUTTON' ||
        e.target.closest('button') ||
        el.classList.contains('editing')
      ) {
        return;
      }
      // If a drawing tool is active, do not drag object
      if (state.activeTool && state.activeTool !== 'select') {
        return;
      }
      e.preventDefault();

      if (e.shiftKey) {
        if (state.selectedIds.includes(ann.id)) {
          state.selectedIds = state.selectedIds.filter((id) => id !== ann.id);
        } else {
          state.selectedIds.push(ann.id);
        }
      } else if (!state.selectedIds.includes(ann.id)) {
        if (ann.groupId) {
          state.selectedIds = state.annotations
            .filter((a) => a.page === ann.page && a.groupId === ann.groupId)
            .map((a) => a.id);
        } else {
          state.selectedIds = [ann.id];
        }
      }

      // Update selection overlay in-place WITHOUT wiping objLayer.innerHTML so el stays alive for dblclick & drag!
      updateSelectionOverlayOnly(ann.page);

      const pageNum = ann.page;
      const objLayer = document.getElementById(`kn-objects-layer-${pageNum}`);
      const selBox = objLayer?.querySelector('.kn-selection-box');
      const ctxBar = objLayer?.querySelector('.kn-context-bar');
      const selectedOnPage = state.annotations.filter(
        (a) => a.page === pageNum && state.selectedIds.includes(a.id)
      );
      const snapshots = JSON.parse(JSON.stringify(selectedOnPage));
      const initBounds = selectedOnPage.map(getAnnotationBounds);
      const initMinX = Math.min(...initBounds.map((b) => b.x));
      const initMinY = Math.min(...initBounds.map((b) => b.y));
      const initMaxX = Math.max(...initBounds.map((b) => b.x + b.w));
      const initMaxY = Math.max(...initBounds.map((b) => b.y + b.h));
      const boxW = Math.max(24, initMaxX - initMinX);
      const boxH = Math.max(24, initMaxY - initMinY);

      const startX = e.clientX;
      const startY = e.clientY;
      const pointerScale = getCardScale(pageNum);
      const canvasScale = getCanvasScale(pageNum);
      const { w: logicalW, h: logicalH } = getPageLogicalSize(pageNum);
      let moved = false;

      const onMove = (me) => {
        const dx = (me.clientX - startX) / pointerScale;
        const dy = (me.clientY - startY) / pointerScale;
        if (Math.abs(dx) > 1.5 || Math.abs(dy) > 1.5) moved = true;
        if (!moved) return;

        selectedOnPage.forEach((item, idx) => {
          const snap = snapshots[idx];
          if (snap.points && snap.points.length > 0) {
            item.points = snap.points.map((pt) => ({ x: pt.x + dx, y: pt.y + dy }));
          } else if (snap.rects && snap.rects.length > 0) {
            item.rects = snap.rects.map((r) => ({ ...r, x: r.x + dx, y: r.y + dy }));
          } else {
            item.x = Math.max(0, Math.min(logicalW - 20, (snap.x || 0) + dx));
            item.y = Math.max(0, Math.min(logicalH - 20, (snap.y || 0) + dy));
            const domNode = objLayer?.querySelector(`.kn-page-object[data-id="${item.id}"]`);
            if (domNode) {
              domNode.style.left = `${item.x * canvasScale}px`;
              domNode.style.top = `${item.y * canvasScale}px`;
            }
          }
        });

        redrawPageCanvasesOnly(pageNum, canvasScale);

        if (selBox) {
          const nextMinX = Math.max(0, Math.min(logicalW - 20, initMinX + dx));
          const nextMinY = Math.max(0, Math.min(logicalH - 20, initMinY + dy));
          selBox.style.left = `${nextMinX * canvasScale}px`;
          selBox.style.top = `${nextMinY * canvasScale}px`;
          if (ctxBar) {
            ctxBar.style.left = `${(nextMinX + boxW / 2) * canvasScale}px`;
            ctxBar.style.top = `${Math.max(8, nextMinY * canvasScale - 44)}px`;
          }
        }
      };

      const onUp = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
        if (moved) {
          pushHistory();
          saveAnnotations();
          renderPageAnnotations(pageNum);
        }
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
    });
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SELECTION BOUNDING BOX, RESIZE/ROTATE HANDLES & CONTEXTUAL ACTION BAR
  // ══════════════════════════════════════════════════════════════════════════
  function getAnnotationBounds(ann) {
    if (ann.rects && ann.rects.length > 0) {
      const minX = Math.min(...ann.rects.map((r) => r.x));
      const minY = Math.min(...ann.rects.map((r) => r.y));
      const maxX = Math.max(...ann.rects.map((r) => r.x + r.w));
      const maxY = Math.max(...ann.rects.map((r) => r.y + r.h));
      return { x: minX - 4, y: minY - 4, w: Math.max(16, maxX - minX + 8), h: Math.max(16, maxY - minY + 8) };
    }
    if (ann.points && ann.points.length > 0) {
      const xs = ann.points.map((p) => p.x);
      const ys = ann.points.map((p) => p.y);
      const minX = Math.min(...xs);
      const minY = Math.min(...ys);
      const maxX = Math.max(...xs);
      const maxY = Math.max(...ys);
      const pad = Math.max(6, (ann.size || 4) / 2 + 4);
      return {
        x: minX - pad,
        y: minY - pad,
        w: Math.max(20, maxX - minX + pad * 2),
        h: Math.max(20, maxY - minY + pad * 2),
      };
    }
    return { x: ann.x || 0, y: ann.y || 0, w: ann.w || 160, h: ann.h || 90 };
  }

  function renderSelectionOverlay(pageNum, objLayer, s) {
    // Do not cover a text box with a selection drag box while the user is actively typing inside it
    const selectedOnPage = state.annotations.filter(
      (a) => a.page === pageNum && state.selectedIds.includes(a.id) && a.id !== state.editingTextId
    );
    if (selectedOnPage.length === 0) return;

    const boundsList = selectedOnPage.map(getAnnotationBounds);
    const minX = Math.min(...boundsList.map((b) => b.x));
    const minY = Math.min(...boundsList.map((b) => b.y));
    const maxX = Math.max(...boundsList.map((b) => b.x + b.w));
    const maxY = Math.max(...boundsList.map((b) => b.y + b.h));
    const boxW = Math.max(24, maxX - minX);
    const boxH = Math.max(24, maxY - minY);

    const isSingleText = selectedOnPage.length === 1 && selectedOnPage[0].type === 'text';
    const hasNoteSelected = selectedOnPage.some((a) => a.type === 'note');

    const selBox = document.createElement('div');
    selBox.className = `kn-selection-box ${isSingleText ? 'is-text-sel' : ''} ${hasNoteSelected ? 'is-note-sel' : ''}`;
    selBox.style.left = `${minX * s}px`;
    selBox.style.top = `${minY * s}px`;
    selBox.style.width = `${boxW * s}px`;
    selBox.style.height = `${boxH * s}px`;
    if (selectedOnPage.length === 1 && selectedOnPage[0].rotation) {
      selBox.style.transform = `rotate(${selectedOnPage[0].rotation}deg)`;
    }

    // Double-clicking a selected text box opens inline editing immediately
    if (isSingleText) {
      selBox.addEventListener('dblclick', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleContextAction('edit', selectedOnPage, pageNum);
      });
    }

    // 8 Square Resize Handles (nw, n, ne, e, se, s, sw, w) + 1 Top Circular Rotation Handle (rot)
    ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w', 'rot'].forEach((dir) => {
      const h = document.createElement('div');
      h.className = `kn-sel-handle ${dir}`;
      h.dataset.handle = dir;
      h.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        startResizeOrRotateSelection(e, dir, selectedOnPage, { x: minX, y: minY, w: boxW, h: boxH }, pageNum);
      });
      selBox.appendChild(h);
    });

    // Dragging inside selection box moves all selected items together smoothly without DOM rebuilds
    selBox.addEventListener('pointerdown', (e) => {
      if (e.target.dataset.handle) return;
      e.preventDefault();
      e.stopPropagation();
      try {
        selBox.setPointerCapture(e.pointerId);
      } catch (_) {}

      const startX = e.clientX;
      const startY = e.clientY;
      const pointerScale = getCardScale(pageNum);
      const canvasScale = getCanvasScale(pageNum);
      const { w: logicalW, h: logicalH } = getPageLogicalSize(pageNum);
      const snapshots = JSON.parse(JSON.stringify(selectedOnPage));
      const ctxBarEl = objLayer.querySelector('.kn-context-bar');
      let moved = false;

      const onMove = (me) => {
        const dx = (me.clientX - startX) / pointerScale;
        const dy = (me.clientY - startY) / pointerScale;
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) moved = true;
        if (!moved) return;

        selectedOnPage.forEach((ann, idx) => {
          const snap = snapshots[idx];
          if (snap.points && snap.points.length > 0) {
            ann.points = snap.points.map((pt) => ({ x: pt.x + dx, y: pt.y + dy }));
          } else if (snap.rects && snap.rects.length > 0) {
            ann.rects = snap.rects.map((r) => ({ ...r, x: r.x + dx, y: r.y + dy }));
          } else {
            ann.x = Math.max(0, Math.min(logicalW - 20, (snap.x || 0) + dx));
            ann.y = Math.max(0, Math.min(logicalH - 20, (snap.y || 0) + dy));
            const domNode = objLayer.querySelector(`.kn-page-object[data-id="${ann.id}"]`);
            if (domNode) {
              domNode.style.left = `${ann.x * canvasScale}px`;
              domNode.style.top = `${ann.y * canvasScale}px`;
            }
          }
        });

        redrawPageCanvasesOnly(pageNum, canvasScale);

        const nextMinX = minX + dx;
        const nextMinY = minY + dy;
        selBox.style.left = `${nextMinX * canvasScale}px`;
        selBox.style.top = `${nextMinY * canvasScale}px`;
        if (ctxBarEl) {
          ctxBarEl.style.left = `${(nextMinX + boxW / 2) * canvasScale}px`;
          ctxBarEl.style.top = `${Math.max(8, nextMinY * canvasScale - 44)}px`;
        }
      };

      const onUp = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
        window.removeEventListener('pointercancel', onUp);
        if (moved) {
          pushHistory();
          saveAnnotations();
          renderPageAnnotations(pageNum);
        }
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
    });

    objLayer.appendChild(selBox);

    // Floating Contextual Quick Action Bar above or below selection
    const ctxBar = document.createElement('div');
    ctxBar.className = 'kn-context-bar open';
    ctxBar.style.left = `${(minX + boxW / 2) * s}px`;
    ctxBar.style.top = `${minY * s > 52 ? minY * s - 44 : (minY + boxH) * s + 12}px`;

    const singleImg = selectedOnPage.length === 1 && selectedOnPage[0].type === 'image' ? selectedOnPage[0] : null;
    const hasGrouped = selectedOnPage.some((a) => Boolean(a.groupId));

    if (singleImg && state.croppingId === singleImg.id) {
      ctxBar.innerHTML = `
        <button class="kn-ctx-btn" data-ctx="apply-crop" style="color:#15803D;">✓ Apply Crop</button>
        <button class="kn-ctx-btn danger" data-ctx="cancel-crop">✕ Cancel</button>
      `;
    } else if (isSingleText) {
      ctxBar.innerHTML = `
        <button class="kn-ctx-btn" data-ctx="edit">Edit</button>
        <span class="kn-ctx-sep"></span>
        <button class="kn-ctx-btn" data-ctx="copy">Copy</button>
        <span class="kn-ctx-sep"></span>
        <button class="kn-ctx-btn" data-ctx="duplicate">Duplicate</button>
        <span class="kn-ctx-sep"></span>
        <button class="kn-ctx-btn danger" data-ctx="delete">Delete</button>
        <span class="kn-ctx-sep"></span>
        <button class="kn-ctx-btn" data-ctx="more" title="More Actions">•••</button>
      `;
    } else {
      ctxBar.innerHTML = `
        ${singleImg ? `<button class="kn-ctx-btn" data-ctx="crop">Crop</button><span class="kn-ctx-sep"></span><button class="kn-ctx-btn" data-ctx="rot-left">↺</button><button class="kn-ctx-btn" data-ctx="rot-right">↻</button><span class="kn-ctx-sep"></span>` : ''}
        <button class="kn-ctx-btn" data-ctx="copy">Copy</button>
        <span class="kn-ctx-sep"></span>
        <button class="kn-ctx-btn" data-ctx="duplicate">Duplicate</button>
        <span class="kn-ctx-sep"></span>
        <button class="kn-ctx-btn danger" data-ctx="delete">Delete</button>
        ${selectedOnPage.length > 1 ? `<span class="kn-ctx-sep"></span><button class="kn-ctx-btn" data-ctx="group">Group</button>` : ''}
        ${hasGrouped ? `<span class="kn-ctx-sep"></span><button class="kn-ctx-btn" data-ctx="ungroup">Ungroup</button>` : ''}
        <span class="kn-ctx-sep"></span>
        <button class="kn-ctx-btn" data-ctx="more" title="More Options">•••</button>
      `;
    }

    ['pointerdown', 'pointerup', 'touchstart', 'touchend', 'click'].forEach((evName) => {
      ctxBar.addEventListener(evName, (e) => e.stopPropagation());
    });
    ctxBar.addEventListener('click', (e) => {
      e.stopPropagation();
      const btn = e.target.closest('[data-ctx]');
      if (!btn) return;
      if (btn.dataset.ctx === 'more') {
        // Expand layer & cut controls inline inside the context bar
        ctxBar.innerHTML = `
          <button class="kn-ctx-btn" data-ctx="cut">Cut</button>
          <span class="kn-ctx-sep"></span>
          <button class="kn-ctx-btn" data-ctx="front">↑ Front</button>
          <span class="kn-ctx-sep"></span>
          <button class="kn-ctx-btn" data-ctx="back">↓ Back</button>
          <span class="kn-ctx-sep"></span>
          <button class="kn-ctx-btn" data-ctx="rot-left">↺</button>
          <button class="kn-ctx-btn" data-ctx="rot-right">↻</button>
          <span class="kn-ctx-sep"></span>
          <button class="kn-ctx-btn danger" data-ctx="delete">Delete</button>
        `;
        return;
      }
      handleContextAction(btn.dataset.ctx, selectedOnPage, pageNum);
    });

    objLayer.appendChild(ctxBar);
  }

  function startResizeOrRotateSelection(e, handle, selectedItems, initBox, pageNum) {
    try {
      e.target.setPointerCapture(e.pointerId);
    } catch (_) {}

    const startX = e.clientX;
    const startY = e.clientY;
    const pointerScale = getCardScale(pageNum);
    const canvasScale = getCanvasScale(pageNum);
    const card = pagesContainer.querySelector(`.kn-page-card[data-page="${pageNum}"]`);
    const objLayer = document.getElementById(`kn-objects-layer-${pageNum}`);
    const selBox = objLayer?.querySelector('.kn-selection-box');
    const ctxBar = objLayer?.querySelector('.kn-context-bar');

    const snapshots = JSON.parse(JSON.stringify(selectedItems));
    const snapBounds = snapshots.map(getAnnotationBounds);
    const MIN_SIZE = 24;
    let changed = false;

    const onMove = (me) => {
      const dx = (me.clientX - startX) / pointerScale;
      const dy = (me.clientY - startY) / pointerScale;
      changed = true;

      if (handle === 'rot') {
        const cardRect = card ? card.getBoundingClientRect() : { left: 0, top: 0 };
        const cx = initBox.x + initBox.w / 2;
        const cy = initBox.y + initBox.h / 2;
        const ptX = (me.clientX - cardRect.left) / pointerScale;
        const ptY = (me.clientY - cardRect.top) / pointerScale;
        const angle = Math.round(((Math.atan2(ptY - cy, ptX - cx) * 180) / Math.PI) + 90);
        selectedItems.forEach((ann) => {
          ann.rotation = angle;
          const domNode = objLayer?.querySelector(`.kn-page-object[data-id="${ann.id}"]`);
          if (domNode) domNode.style.transform = `rotate(${angle}deg)`;
        });
        if (selBox) selBox.style.transform = `rotate(${angle}deg)`;
        return;
      }

      // Compute new bounding box anchored on the opposite edge/corner
      let newX = initBox.x;
      let newY = initBox.y;
      let newW = initBox.w;
      let newH = initBox.h;
      const initRight = initBox.x + initBox.w;
      const initBottom = initBox.y + initBox.h;

      if (handle.includes('e')) {
        newW = Math.max(MIN_SIZE, initBox.w + dx);
      }
      if (handle.includes('w')) {
        newW = Math.max(MIN_SIZE, initBox.w - dx);
        newX = initRight - newW;
      }
      if (handle.includes('s')) {
        newH = Math.max(MIN_SIZE, initBox.h + dy);
      }
      if (handle.includes('n')) {
        newH = Math.max(MIN_SIZE, initBox.h - dy);
        newY = initBottom - newH;
      }

      const scaleX = newW / Math.max(1, initBox.w);
      const scaleY = newH / Math.max(1, initBox.h);

      selectedItems.forEach((ann, idx) => {
        const snap = snapshots[idx];
        const sb = snapBounds[idx];
        if (snap.points && snap.points.length > 0) {
          ann.points = snap.points.map((pt) => ({
            x: newX + (pt.x - initBox.x) * scaleX,
            y: newY + (pt.y - initBox.y) * scaleY,
          }));
        } else if (snap.rects && snap.rects.length > 0) {
          ann.rects = snap.rects.map((r) => ({
            x: newX + (r.x - initBox.x) * scaleX,
            y: newY + (r.y - initBox.y) * scaleY,
            w: Math.max(4, r.w * scaleX),
            h: Math.max(4, r.h * scaleY),
          }));
        } else {
          const relX = ((snap.x !== undefined ? snap.x : sb.x) - initBox.x) / Math.max(1, initBox.w);
          const relY = ((snap.y !== undefined ? snap.y : sb.y) - initBox.y) / Math.max(1, initBox.h);
          ann.x = newX + relX * newW;
          ann.y = newY + relY * newH;
          ann.w = Math.max(MIN_SIZE, (snap.w || sb.w || 160) * scaleX);
          ann.h = Math.max(MIN_SIZE, (snap.h || sb.h || 90) * scaleY);

          if (ann.type === 'text' && handle.length === 2) {
            // Corner drag proportionally scales text font size as well
            const avgScale = (scaleX + scaleY) / 2;
            ann.fontSize = Math.max(10, Math.min(72, Math.round((snap.fontSize || 16) * avgScale)));
          }

          const domNode = objLayer?.querySelector(`.kn-page-object[data-id="${ann.id}"]`);
          if (domNode) {
            domNode.style.left = `${ann.x * canvasScale}px`;
            domNode.style.top = `${ann.y * canvasScale}px`;
            domNode.style.width = `${ann.w * canvasScale}px`;
            if (ann.type === 'text') {
              domNode.style.minHeight = `${ann.h * canvasScale}px`;
              const ed = domNode.querySelector('.kn-textbox-editor');
              if (ed && ann.fontSize) ed.style.fontSize = `${ann.fontSize * canvasScale}px`;
            } else {
              domNode.style.height = `${ann.h * canvasScale}px`;
            }
          }
        }
      });

      redrawPageCanvasesOnly(pageNum, canvasScale);

      if (selBox) {
        selBox.style.left = `${newX * canvasScale}px`;
        selBox.style.top = `${newY * canvasScale}px`;
        selBox.style.width = `${newW * canvasScale}px`;
        selBox.style.height = `${newH * canvasScale}px`;
      }
      if (ctxBar) {
        ctxBar.style.left = `${(newX + newW / 2) * canvasScale}px`;
        ctxBar.style.top = `${newY * canvasScale > 52 ? newY * canvasScale - 44 : (newY + newH) * canvasScale + 12}px`;
      }
    };

    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      if (changed) {
        pushHistory();
        saveAnnotations();
        renderPageAnnotations(pageNum);
      }
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  }

  function handleContextAction(action, selectedItems, pageNum) {
    if (action === 'edit' && selectedItems[0]?.type === 'text') {
      const objLayer = document.getElementById(`kn-objects-layer-${pageNum}`);
      const domEl = objLayer?.querySelector(`.kn-page-object[data-id="${selectedItems[0].id}"]`);
      const editor = domEl?.querySelector('.kn-textbox-editor');
      if (domEl && editor) {
        state.editingTextId = selectedItems[0].id;
        state.textCreationGuardUntil = Date.now() + 450;
        domEl.classList.add('editing');
        updateSelectionOverlayOnly(pageNum);
        focusTextEditor(editor);
      }
      return;
    } else if (action === 'copy') {
      state.clipboard = JSON.parse(JSON.stringify(selectedItems));
      if (typeof UI !== 'undefined' && UI.showToast) UI.showToast('Copied selection', 'success');
    } else if (action === 'cut') {
      pushHistory();
      state.clipboard = JSON.parse(JSON.stringify(selectedItems));
      state.annotations = state.annotations.filter((a) => !state.selectedIds.includes(a.id));
      state.selectedIds = [];
      state.editingTextId = null;
      state.editingNoteId = null;
    } else if (action === 'duplicate') {
      pushHistory();
      const clones = selectedItems.map((item) => {
        const copy = JSON.parse(JSON.stringify(item));
        copy.id = `kn_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
        if (copy.points) {
          copy.points = copy.points.map((pt) => ({ x: pt.x + 18, y: pt.y + 18 }));
        } else if (copy.rects) {
          copy.rects = copy.rects.map((r) => ({ ...r, x: r.x + 18, y: r.y + 18 }));
        } else {
          copy.x = (copy.x || 0) + 18;
          copy.y = (copy.y || 0) + 18;
        }
        return copy;
      });
      state.annotations.push(...clones);
      state.selectedIds = clones.map((c) => c.id);
    } else if (action === 'group') {
      pushHistory();
      const gid = `kn_grp_${Date.now()}`;
      selectedItems.forEach((a) => {
        a.groupId = gid;
      });
    } else if (action === 'ungroup') {
      pushHistory();
      selectedItems.forEach((a) => {
        delete a.groupId;
      });
    } else if (action === 'delete') {
      pushHistory();
      state.annotations = state.annotations.filter((a) => !state.selectedIds.includes(a.id));
      state.selectedIds = [];
      state.editingTextId = null;
      state.editingNoteId = null;
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

  // Deactivate one-shot creation tools (Text, Note) and return to Neutral/Select state
  function deactivateCreationTool() {
    state.activeTool = null;
    state.noteCreationState = 'IDLE';
    state.toolPopoverOpen = false;
    document.querySelectorAll('#kn-toolbar .kn-tool-btn[data-tool]').forEach((btn) => {
      btn.classList.remove('active');
      btn.setAttribute('aria-checked', 'false');
    });
    document.querySelectorAll('.kn-interaction-layer').forEach((layer) => {
      layer.classList.remove('tool-active', 'kn-drawing-active');
    });
    renderToolPopover();
  }

  // ══════════════════════════════════════════════════════════════════════════
  // PAGE INTERACTION HANDLER (Drawing, Erasing, Selection Marquee/Lasso, Click-to-Add)
  // ══════════════════════════════════════════════════════════════════════════
  function bindPageInteraction(card, pageNum) {
    const interactLayer = card.querySelector('.kn-interaction-layer');
    if (!interactLayer) return;

    const toPageCoords = (e) => {
      const rect = card.getBoundingClientRect();
      const s = getCardScale(pageNum);
      return {
        x: (e.clientX - rect.left) / s,
        y: (e.clientY - rect.top) / s,
      };
    };

    interactLayer.addEventListener('pointerdown', (e) => {
      // Never trigger page creation or canvas actions if pointer started inside an existing object/note/control
      if (e.target.closest('.kn-page-object, .kn-note-obj, .kn-context-bar, .kn-selection-box')) {
        return;
      }

      // Close any open tool popover when interacting with the page canvas
      if (state.toolPopoverOpen) {
        state.toolPopoverOpen = false;
        renderToolPopover();
      }

      // If no tool is active, allow clicking any stroke/object on the page to select it, or deselect on empty space
      if (!state.activeTool) {
        // If user was editing a text box and intentionally tapped empty page canvas, commit & exit edit mode
        if (state.editingTextId) {
          state.textCreationGuardUntil = 0;
          const activeEd = document.querySelector(`.kn-page-object[data-id="${state.editingTextId}"] .kn-textbox-editor`);
          if (activeEd && document.activeElement === activeEd) {
            activeEd.blur();
            return;
          }
          state.editingTextId = null;
        }
        const pt = toPageCoords(e);
        const hit = findAnnotationAtPoint(pageNum, pt);
        if (hit) {
          state.selectedIds = [hit.id];
          renderPageAnnotations(pageNum);
        } else if (state.selectedIds.length > 0) {
          state.selectedIds = [];
          renderPageAnnotations(pageNum);
        }
        return;
      }

      // Palm rejection: if stylus is active or multi-touch, ignore stray palm touches
      if (e.pointerType === 'touch' && !e.isPrimary) return;

      const startPt = toPageCoords(e);
      const { w: logicalW, h: logicalH } = getPageLogicalSize(pageNum);

      // 1. TEXT TOOL: One-shot creation with immediate focus & persistent virtual keyboard
      if (state.activeTool === 'text') {
        e.preventDefault();
        e.stopPropagation();

        // If another text box was being edited, clear its guard first
        state.textCreationGuardUntil = 0;

        const newText = {
          id: `kn_txt_${Date.now()}`,
          type: 'text',
          page: pageNum,
          x: Math.max(20, Math.min(logicalW - 220, startPt.x)),
          y: Math.max(20, Math.min(logicalH - 60, startPt.y)),
          w: 220,
          h: 40,
          text: '',
          ...state.text,
          createdAt: Date.now(),
        };
        state.annotations.push(newText);
        state.selectedIds = [newText.id];
        state.editingTextId = newText.id;
        state.textCreationGuardUntil = Date.now() + 500;

        // One-shot creation: immediately deactivate Text Tool so subsequent taps don't spawn extra boxes
        deactivateCreationTool();
        renderPageAnnotations(pageNum);

        const domEl = card.querySelector(`.kn-page-object[data-id="${newText.id}"] .kn-textbox-editor`);
        if (domEl) {
          // Focus synchronously inside pointerdown gesture
          focusTextEditor(domEl);
          // Also reinforce focus on pointerup/touchend so iOS/Android soft keyboards stay open
          const reinforceFocus = () => {
            window.removeEventListener('pointerup', reinforceFocus, true);
            window.removeEventListener('touchend', reinforceFocus, true);
            if (state.editingTextId === newText.id && domEl.isConnected) {
              focusTextEditor(domEl);
            }
          };
          window.addEventListener('pointerup', reinforceFocus, true);
          window.addEventListener('touchend', reinforceFocus, true);
        }
        return;
      }

      // 2. NOTES TOOL: Strict One-Shot State Machine
      // IDLE -> NOTE_TOOL_ACTIVE -> USER_TAPS_PAGE -> CREATE_NOTE -> EDIT_NOTE -> NOTE_TOOL_DEACTIVATED -> IDLE
      if (state.activeTool === 'notes') {
        e.preventDefault();
        e.stopPropagation();
        state.noteCreationState = 'USER_TAPS_PAGE';
        pushHistory();
        state.noteCreationState = 'CREATE_NOTE';
        const newNote = {
          id: `kn_note_${Date.now()}`,
          type: 'note',
          page: pageNum,
          x: Math.max(20, Math.min(logicalW - 220, startPt.x)),
          y: Math.max(20, Math.min(logicalH - 160, startPt.y)),
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
        state.editingNoteId = newNote.id;
        state.noteCreationState = 'EDIT_NOTE';

        // Immediately deactivate Note Tool after creating one Note
        state.noteCreationState = 'NOTE_TOOL_DEACTIVATED';
        deactivateCreationTool();

        saveAnnotations();
        renderPageAnnotations(pageNum);
        renderRightSidebarContent();
        renderLeftSidebarContent();

        const inp = card.querySelector(`.kn-page-object[data-id="${newNote.id}"] .kn-note-title-input`);
        if (inp) {
          try {
            inp.focus({ preventScroll: true });
          } catch (_) {
            inp.focus();
          }
          const reinforceNoteFocus = () => {
            window.removeEventListener('pointerup', reinforceNoteFocus, true);
            window.removeEventListener('touchend', reinforceNoteFocus, true);
            if (inp.isConnected && document.activeElement !== inp) {
              try {
                inp.focus({ preventScroll: true });
              } catch (_) {
                inp.focus();
              }
            }
          };
          window.addEventListener('pointerup', reinforceNoteFocus, true);
          window.addEventListener('touchend', reinforceNoteFocus, true);
        }
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
        e.preventDefault();
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
        const canvasScale = getCanvasScale(pageNum);

        const onMove = (me) => {
          const pt = toPageCoords(me);
          if (cfg.mode === 'straight') {
            stroke.points = [startPt, pt];
          } else {
            stroke.points.push(pt);
          }
          redrawPageCanvasesOnly(pageNum, canvasScale);
        };
        const onUp = () => {
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onUp);
          window.removeEventListener('pointercancel', onUp);
          saveAnnotations();
          renderPageAnnotations(pageNum);
          renderLeftSidebarContent();
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', onUp);
        return;
      }

      // 5. SHAPES TOOL
      if (state.activeTool === 'shapes') {
        e.preventDefault();
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
        const canvasScale = getCanvasScale(pageNum);

        const onMove = (me) => {
          const pt = toPageCoords(me);
          shape.x = Math.min(startPt.x, pt.x);
          shape.y = Math.min(startPt.y, pt.y);
          shape.w = Math.abs(pt.x - startPt.x);
          shape.h = Math.abs(pt.y - startPt.y);
          shape.x2 = pt.x;
          shape.y2 = pt.y;
          redrawPageCanvasesOnly(pageNum, canvasScale);
        };
        const onUp = () => {
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onUp);
          window.removeEventListener('pointercancel', onUp);
          saveAnnotations();
          renderPageAnnotations(pageNum);
          renderLeftSidebarContent();
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', onUp);
        return;
      }

      // 6. ERASER TOOL (Stroke, Partial Path-Splitting, and Object Eraser)
      if (state.activeTool === 'eraser') {
        e.preventDefault();
        const beforeEraseSnapshot = JSON.stringify(state.annotations);
        let didErase = false;

        const recordEraseIfNeeded = (erased) => {
          if (erased && !didErase) {
            didErase = true;
            state.undoStack.push(beforeEraseSnapshot);
            if (state.undoStack.length > 60) state.undoStack.shift();
            state.redoStack = [];
            updateUndoRedoButtons();
          }
        };

        updateEraserCursor(e);
        recordEraseIfNeeded(eraseAtPoint(pageNum, startPt));

        const onMove = (me) => {
          updateEraserCursor(me);
          recordEraseIfNeeded(eraseAtPoint(pageNum, toPageCoords(me)));
        };
        const onUp = () => {
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onUp);
          window.removeEventListener('pointercancel', onUp);
          const cur = document.getElementById('kn-eraser-cursor');
          if (cur) cur.style.display = 'none';
          if (didErase) {
            saveAnnotations();
            renderPageAnnotations(pageNum);
            renderLeftSidebarContent();
            if (state.rightTab === 'notes') renderRightSidebarContent();
          }
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', onUp);
        return;
      }

      // 7. SELECTION / LASSO TOOL (Click, Immediate Drag-Move, Rectangle Marquee, Freehand Lasso)
      if (state.activeTool === 'select') {
        e.preventDefault();
        const hit = findAnnotationAtPoint(pageNum, startPt);
        if (hit) {
          if (e.shiftKey) {
            state.selectedIds = state.selectedIds.includes(hit.id)
              ? state.selectedIds.filter((id) => id !== hit.id)
              : [...state.selectedIds, hit.id];
          } else if (!state.selectedIds.includes(hit.id)) {
            if (hit.groupId) {
              state.selectedIds = state.annotations
                .filter((a) => a.page === pageNum && a.groupId === hit.groupId)
                .map((a) => a.id);
            } else {
              state.selectedIds = [hit.id];
            }
          }
          renderPageAnnotations(pageNum);

          // Allow immediate click-and-drag movement of the newly selected stroke/object in one fluid motion
          const selectedOnPage = state.annotations.filter(
            (a) => a.page === pageNum && state.selectedIds.includes(a.id)
          );
          const snapshots = JSON.parse(JSON.stringify(selectedOnPage));
          const objLayer = document.getElementById(`kn-objects-layer-${pageNum}`);
          const selBox = objLayer?.querySelector('.kn-selection-box');
          const ctxBar = objLayer?.querySelector('.kn-context-bar');
          const boundsList = selectedOnPage.map(getAnnotationBounds);
          const initMinX = Math.min(...boundsList.map((b) => b.x));
          const initMinY = Math.min(...boundsList.map((b) => b.y));
          const initMaxX = Math.max(...boundsList.map((b) => b.x + b.w));
          const initMaxY = Math.max(...boundsList.map((b) => b.y + b.h));
          const boxW = Math.max(24, initMaxX - initMinX);
          const boxH = Math.max(24, initMaxY - initMinY);
          const startClientX = e.clientX;
          const startClientY = e.clientY;
          const pointerScale = getCardScale(pageNum);
          const canvasScale = getCanvasScale(pageNum);
          let moved = false;

          const onDragHit = (me) => {
            const dx = (me.clientX - startClientX) / pointerScale;
            const dy = (me.clientY - startClientY) / pointerScale;
            if (Math.abs(dx) > 1.5 || Math.abs(dy) > 1.5) moved = true;
            if (!moved) return;

            selectedOnPage.forEach((ann, idx) => {
              const snap = snapshots[idx];
              if (snap.points && snap.points.length > 0) {
                ann.points = snap.points.map((pt) => ({ x: pt.x + dx, y: pt.y + dy }));
              } else if (snap.rects && snap.rects.length > 0) {
                ann.rects = snap.rects.map((r) => ({ ...r, x: r.x + dx, y: r.y + dy }));
              } else {
                ann.x = (snap.x || 0) + dx;
                ann.y = (snap.y || 0) + dy;
                const domNode = objLayer?.querySelector(`.kn-page-object[data-id="${ann.id}"]`);
                if (domNode) {
                  domNode.style.left = `${ann.x * canvasScale}px`;
                  domNode.style.top = `${ann.y * canvasScale}px`;
                }
              }
            });

            redrawPageCanvasesOnly(pageNum, canvasScale);
            if (selBox) {
              selBox.style.left = `${(initMinX + dx) * canvasScale}px`;
              selBox.style.top = `${(initMinY + dy) * canvasScale}px`;
            }
            if (ctxBar) {
              ctxBar.style.left = `${(initMinX + dx + boxW / 2) * canvasScale}px`;
              ctxBar.style.top = `${Math.max(8, (initMinY + dy) * canvasScale - 44)}px`;
            }
          };

          const onUpHit = () => {
            window.removeEventListener('pointermove', onDragHit);
            window.removeEventListener('pointerup', onUpHit);
            window.removeEventListener('pointercancel', onUpHit);
            if (moved) {
              pushHistory();
              saveAnnotations();
              renderPageAnnotations(pageNum);
            }
          };

          window.addEventListener('pointermove', onDragHit);
          window.addEventListener('pointerup', onUpHit);
          window.addEventListener('pointercancel', onUpHit);
          return;
        }

        // Deselect if clicking empty space without Shift
        if (!e.shiftKey) {
          state.selectedIds = [];
          renderPageAnnotations(pageNum);
        }
        const lassoPts = [startPt];
        const penCanvas = document.getElementById(`kn-annot-canvas-${pageNum}`);
        const ctx = penCanvas.getContext('2d');
        const canvasScale = getCanvasScale(pageNum);

        const onMove = (me) => {
          const pt = toPageCoords(me);
          lassoPts.push(pt);
          redrawPageCanvasesOnly(pageNum, canvasScale);
          ctx.save();
          ctx.strokeStyle = '#7E1D2A';
          ctx.fillStyle = 'rgba(126, 29, 42, 0.06)';
          ctx.setLineDash([5, 4]);
          ctx.lineWidth = 1.5;
          if (state.selectionMode === 'lasso') {
            ctx.beginPath();
            ctx.moveTo(lassoPts[0].x * canvasScale, lassoPts[0].y * canvasScale);
            lassoPts.forEach((p) => ctx.lineTo(p.x * canvasScale, p.y * canvasScale));
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
          } else {
            const rx = Math.min(startPt.x, pt.x) * canvasScale;
            const ry = Math.min(startPt.y, pt.y) * canvasScale;
            const rw = Math.abs(pt.x - startPt.x) * canvasScale;
            const rh = Math.abs(pt.y - startPt.y) * canvasScale;
            ctx.fillRect(rx, ry, rw, rh);
            ctx.strokeRect(rx, ry, rw, rh);
          }
          ctx.restore();
        };

        const onUp = () => {
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onUp);
          window.removeEventListener('pointercancel', onUp);
          selectAnnotationsInRegion(pageNum, lassoPts);
          renderPageAnnotations(pageNum);
        };

        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', onUp);
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
  // ERASER ENGINE (Stroke, Partial Path-Splitting, and Object Eraser)
  // ══════════════════════════════════════════════════════════════════════════
  function updateEraserCursor(e) {
    const cur = document.getElementById('kn-eraser-cursor');
    if (!cur || state.eraser.showCursor === false) return;
    const d = state.eraser.size * state.zoom;
    cur.style.width = `${d}px`;
    cur.style.height = `${d}px`;
    cur.style.left = `${e.clientX}px`;
    cur.style.top = `${e.clientY}px`;
    cur.style.display = 'block';
  }

  // Shortest distance from point P to line segment AB
  function distToSegment(p, a, b) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const lenSq = dx * dx + dy * dy;
    if (lenSq === 0) return Math.hypot(p.x - a.x, p.y - a.y);
    const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq));
    const projX = a.x + t * dx;
    const projY = a.y + t * dy;
    return Math.hypot(p.x - projX, p.y - projY);
  }

  // Returns true if any vertex or segment of a stroke is within effectiveRadius of pt
  function isStrokeHitByCircle(points, pt, effectiveRadius) {
    if (!points || points.length === 0) return false;
    if (points.length === 1) {
      return Math.hypot(points[0].x - pt.x, points[0].y - pt.y) <= effectiveRadius;
    }
    for (let i = 0; i < points.length - 1; i++) {
      if (distToSegment(pt, points[i], points[i + 1]) <= effectiveRadius) {
        return true;
      }
    }
    return false;
  }

  // Subdivides long stroke segments so Partial Eraser cleanly splits both freehand and straight strokes
  function densifyStrokePoints(points, stepPx = 3) {
    if (!points || points.length < 2) return points ? [...points] : [];
    const out = [points[0]];
    for (let i = 0; i < points.length - 1; i++) {
      const a = points[i];
      const b = points[i + 1];
      const dist = Math.hypot(b.x - a.x, b.y - a.y);
      if (dist > stepPx) {
        const steps = Math.ceil(dist / stepPx);
        for (let s = 1; s < steps; s++) {
          const t = s / steps;
          out.push({
            x: a.x + (b.x - a.x) * t,
            y: a.y + (b.y - a.y) * t,
          });
        }
      }
      out.push(b);
    }
    return out;
  }

  function eraseAtPoint(pageNum, pt) {
    const radius = Math.max(4, state.eraser.size / 2);
    const mode = state.eraser.mode; // 'stroke' | 'partial' | 'object'
    const nextAnnots = [];
    const removedIds = new Set();
    let changed = false;

    for (const ann of state.annotations) {
      if (ann.page !== pageNum) {
        nextAnnots.push(ann);
        continue;
      }

      const isStroke = (ann.type === 'pen' || ann.type === 'highlighter') && Array.isArray(ann.points) && ann.points.length > 0;
      const strokeHalfWidth = (ann.size || (ann.type === 'highlighter' ? 22 : 4)) / 2;
      const effectiveRadius = radius + strokeHalfWidth;

      // Check text-anchored highlighter rects if present
      if (ann.type === 'highlighter' && Array.isArray(ann.rects) && ann.rects.length > 0 && (!ann.points || ann.points.length <= 1)) {
        if (mode === 'stroke' || mode === 'object' || mode === 'partial') {
          const hitRect = ann.rects.some(
            (r) => pt.x >= r.x - radius && pt.x <= r.x + r.w + radius && pt.y >= r.y - radius && pt.y <= r.y + r.h + radius
          );
          if (hitRect) {
            changed = true;
            removedIds.add(ann.id);
          } else {
            nextAnnots.push(ann);
          }
          continue;
        }
      }

      if (isStroke) {
        if (mode === 'partial') {
          // Partial Eraser: erase only the sub-section of the stroke inside effectiveRadius
          if (!isStrokeHitByCircle(ann.points, pt, effectiveRadius)) {
            nextAnnots.push(ann);
            continue;
          }
          const densePts = densifyStrokePoints(ann.points, 3);
          let currentSeg = [];
          let hitAny = false;

          for (const p of densePts) {
            if (Math.hypot(p.x - pt.x, p.y - pt.y) <= effectiveRadius) {
              hitAny = true;
              if (currentSeg.length >= 2) {
                nextAnnots.push({
                  ...ann,
                  id: `kn_${ann.type}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
                  mode: 'freehand',
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
            removedIds.add(ann.id);
            if (currentSeg.length >= 2) {
              nextAnnots.push({
                ...ann,
                id: `kn_${ann.type}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
                mode: 'freehand',
                points: currentSeg,
              });
            }
          } else {
            nextAnnots.push(ann);
          }
        } else {
          // Stroke Eraser or Object Eraser: delete entire stroke when touched anywhere along its path
          if (isStrokeHitByCircle(ann.points, pt, effectiveRadius)) {
            changed = true;
            removedIds.add(ann.id);
          } else {
            nextAnnots.push(ann);
          }
        }
      } else if (mode === 'object') {
        // Object Eraser: delete complete object (text, note, image, shape) when touched
        const b = getAnnotationBounds(ann);
        const hit =
          pt.x >= b.x - radius &&
          pt.x <= b.x + b.w + radius &&
          pt.y >= b.y - radius &&
          pt.y <= b.y + b.h + radius;
        if (hit) {
          changed = true;
          removedIds.add(ann.id);
        } else {
          nextAnnots.push(ann);
        }
      } else {
        // Stroke or Partial mode does not delete non-stroke objects (text, note, image, shape)
        nextAnnots.push(ann);
      }
    }

    if (changed) {
      state.annotations = nextAnnots;
      if (removedIds.size > 0) {
        state.selectedIds = state.selectedIds.filter((id) => !removedIds.has(id));
        if (state.editingTextId && removedIds.has(state.editingTextId)) state.editingTextId = null;
        if (state.editingNoteId && removedIds.has(state.editingNoteId)) state.editingNoteId = null;
      }
      renderPageAnnotations(pageNum);
    }
    return changed;
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
          <span>Highlighter — Under-Text Multiply (أداة الهايلايتر)</span>
          <button class="kn-icon-btn" id="kn-close-popover" style="width:22px;height:22px;">✕</button>
        </div>
        <div class="kn-live-preview-box">
          <span class="kn-hl-preview-sample" style="background:${hexToRgba(hl.color, hl.opacity)};">A localized post-eruptive process of chemical origin</span>
        </div>
        <div class="kn-segmented-control">
          <button class="kn-seg-btn ${hl.mode === 'freehand' ? 'active' : ''}" data-hl-mode="freehand">تحديد حر (Freehand)</button>
          <button class="kn-seg-btn ${hl.mode === 'straight' ? 'active' : ''}" data-hl-mode="straight">خط مستقيم (Straight)</button>
        </div>
        <div class="kn-popover-row">
          <span class="kn-popover-label">Color</span>
          <div class="kn-swatch-row">
            ${colors.map((c) => `<button class="kn-color-swatch ${hl.color.toUpperCase() === c ? 'active' : ''}" data-hl-color="${c}" style="background:${c};"></button>`).join('')}
            <label class="kn-color-swatch kn-custom-color-label" title="Custom Color (لون مخصص)" style="background:conic-gradient(#f43f5e,#eab308,#22c55e,#3b82f6,#a855f7,#f43f5e);position:relative;overflow:hidden;cursor:pointer;">
              <input type="color" id="kn-hl-custom-color" value="${hl.color}" style="opacity:0;position:absolute;inset:0;width:100%;height:100%;cursor:pointer;" />
            </label>
          </div>
        </div>
        <div class="kn-slider-row">
          <span class="kn-popover-label">Size</span>
          <input type="range" id="kn-hl-size" min="10" max="44" value="${hl.size}" />
          <span class="kn-slider-val">${hl.size} px</span>
        </div>
        <div class="kn-slider-row">
          <span class="kn-popover-label">Opacity</span>
          <input type="range" id="kn-hl-opacity" min="15" max="80" value="${Math.round(hl.opacity * 100)}" />
          <span class="kn-slider-val">${Math.round(hl.opacity * 100)}%</span>
        </div>
        <div class="kn-popover-row" style="border-top:1px solid var(--kn-border-subtle);padding-top:6px;">
          <span class="kn-popover-label">Presets (الاختصارات)</span>
          <button class="kn-btn kn-btn-primary" id="kn-hl-add-preset" style="height:26px;padding:0 10px;font-size:0.72rem;">+ حفظ كاختصار جديد</button>
        </div>
        <div class="kn-presets-strip">
          ${hl.presets
            .map(
              (p) => `
            <div class="kn-preset-chip ${hl.activePresetId === p.id ? 'active' : ''}" data-hl-preset="${p.id}">
              <span class="kn-tool-color-dot" style="background:${p.color};"></span>
              <span>${escapeHtml(p.name)}</span>
              <span class="kn-preset-action" data-hl-rename-preset="${p.id}" title="Rename Preset (تعديل)">✎</span>
              <span class="kn-preset-action" data-hl-move-preset="${p.id}" title="Reorder Preset (إعادة الترتيب)">⇅</span>
              <span class="kn-preset-del" data-hl-del-preset="${p.id}" title="Delete Preset (حذف)">×</span>
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
          <span>Pen Tool — Smooth Ink (أداة القلم)</span>
          <button class="kn-icon-btn" id="kn-close-popover" style="width:22px;height:22px;">✕</button>
        </div>
        <div class="kn-live-preview-box" style="flex-direction:column;gap:4px;padding:8px 12px;">
          <svg width="100%" height="30" viewBox="0 0 240 30" fill="none">
            <path d="M 12 18 Q 65 4, 120 16 T 228 14" stroke="${pen.color}" stroke-width="${Math.max(1.5, pen.size)}" stroke-linecap="round" stroke-opacity="${pen.opacity}" fill="none"/>
          </svg>
          <span style="font-size:0.68rem;color:var(--kn-text-muted);font-weight:700;">معاينة مباشرة • ${pen.size}px • ${Math.round(pen.opacity * 100)}%</span>
        </div>
        <div class="kn-segmented-control">
          <button class="kn-seg-btn ${pen.mode === 'freehand' ? 'active' : ''}" data-pen-mode="freehand">تحديد حر (Freehand)</button>
          <button class="kn-seg-btn ${pen.mode === 'straight' ? 'active' : ''}" data-pen-mode="straight">خط مستقيم (Straight)</button>
        </div>
        <div class="kn-popover-row">
          <span class="kn-popover-label">Ink</span>
          <div class="kn-swatch-row">
            ${colors.map((c) => `<button class="kn-color-swatch ${pen.color.toUpperCase() === c ? 'active' : ''}" data-pen-color="${c}" style="background:${c};"></button>`).join('')}
            <label class="kn-color-swatch kn-custom-color-label" title="Custom Color (لون مخصص)" style="background:conic-gradient(#f43f5e,#eab308,#22c55e,#3b82f6,#a855f7,#f43f5e);position:relative;overflow:hidden;cursor:pointer;">
              <input type="color" id="kn-pen-custom-color" value="${pen.color}" style="opacity:0;position:absolute;inset:0;width:100%;height:100%;cursor:pointer;" />
            </label>
          </div>
        </div>
        <div class="kn-slider-row">
          <span class="kn-popover-label">Width</span>
          <input type="range" id="kn-pen-size" min="1" max="18" value="${pen.size}" />
          <span class="kn-slider-val">${pen.size} px</span>
        </div>
        <div class="kn-slider-row">
          <span class="kn-popover-label">Opacity</span>
          <input type="range" id="kn-pen-opacity" min="20" max="100" value="${Math.round(pen.opacity * 100)}" />
          <span class="kn-slider-val">${Math.round(pen.opacity * 100)}%</span>
        </div>
        <div class="kn-popover-row" style="border-top:1px solid var(--kn-border-subtle);padding-top:6px;">
          <span class="kn-popover-label">Presets (الاختصارات)</span>
          <button class="kn-btn kn-btn-primary" id="kn-pen-add-preset" style="height:26px;padding:0 10px;font-size:0.72rem;">+ إضافة اختصار</button>
        </div>
        <div class="kn-presets-strip">
          ${pen.presets
            .map(
              (p) => `
            <div class="kn-preset-chip ${pen.activePresetId === p.id ? 'active' : ''}" data-pen-preset="${p.id}">
              <span class="kn-tool-color-dot" style="background:${p.color};"></span>
              <span>${escapeHtml(p.name)} (${p.size}px)</span>
              <span class="kn-preset-action" data-pen-rename-preset="${p.id}" title="Rename Preset">✎</span>
              <span class="kn-preset-action" data-pen-move-preset="${p.id}" title="Reorder Preset">⇅</span>
              <span class="kn-preset-del" data-pen-del-preset="${p.id}" title="Delete Preset">×</span>
            </div>`
            )
            .join('')}
        </div>
      `;
    } else if (tool === 'eraser') {
      const er = state.eraser;
      const modeDesc =
        er.mode === 'stroke'
          ? 'يمسح الضربة (Pen / Highlighter) بالكامل عند لمسها'
          : er.mode === 'partial'
            ? 'يمسح فقط الجزء الذي تمر عليه الممحاة ويقسم الخط'
            : 'يمسح أي عنصر كامل (Text, Note, Image, Stroke)';
      toolPopover.innerHTML = `
        <div class="kn-popover-header">
          <span>Eraser — Annotations Only (الممحاة)</span>
          <button class="kn-icon-btn" id="kn-close-popover" style="width:22px;height:22px;">✕</button>
        </div>
        <div class="kn-segmented-control">
          <button class="kn-seg-btn ${er.mode === 'stroke' ? 'active' : ''}" data-er-mode="stroke">Stroke</button>
          <button class="kn-seg-btn ${er.mode === 'partial' ? 'active' : ''}" data-er-mode="partial">Partial</button>
          <button class="kn-seg-btn ${er.mode === 'object' ? 'active' : ''}" data-er-mode="object">Object</button>
        </div>
        <div style="font-size:0.72rem;color:var(--kn-text-secondary);padding:2px 4px;font-weight:600;" dir="rtl">${modeDesc}</div>
        <div class="kn-slider-row">
          <span class="kn-popover-label">Size</span>
          <input type="range" id="kn-er-size" min="8" max="64" value="${er.size}" />
          <span class="kn-slider-val">${er.size} px</span>
        </div>
        <div class="kn-eraser-quick-row">
          <button class="kn-eraser-size-btn ${er.size <= 14 ? 'active' : ''}" data-er-quick="12">
            <span style="width:8px;height:8px;border-radius:50%;background:currentColor;display:inline-block;"></span>
            <span>Small</span>
          </button>
          <button class="kn-eraser-size-btn ${er.size > 14 && er.size < 34 ? 'active' : ''}" data-er-quick="24">
            <span style="width:14px;height:14px;border-radius:50%;background:currentColor;display:inline-block;"></span>
            <span>Medium</span>
          </button>
          <button class="kn-eraser-size-btn ${er.size >= 34 ? 'active' : ''}" data-er-quick="42">
            <span style="width:20px;height:20px;border-radius:50%;background:currentColor;display:inline-block;"></span>
            <span>Large</span>
          </button>
        </div>
      `;
    } else if (tool === 'select') {
      const filters = ['all', 'handwriting', 'pen', 'highlighter', 'shape', 'image', 'text', 'note'];
      toolPopover.innerHTML = `
        <div class="kn-popover-header">
          <span>Selection & Lasso Tool (أداة التحديد)</span>
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
    const hlCustomColor = document.getElementById('kn-hl-custom-color');
    if (hlCustomColor) {
      hlCustomColor.oninput = () => {
        state.highlighter.color = hlCustomColor.value;
        const dot = document.getElementById('kn-hl-dot');
        if (dot) dot.style.background = state.highlighter.color;
        renderToolPopover();
      };
    }
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
        const renameId = e.target.dataset?.hlRenamePreset;
        if (renameId) {
          const target = state.highlighter.presets.find((p) => p.id === renameId);
          if (target) {
            const nextName = window.prompt('Rename Highlighter Preset:', target.name);
            if (nextName && nextName.trim()) {
              target.name = nextName.trim();
              localStorage.setItem(KEY_HL_PRESETS, JSON.stringify(state.highlighter.presets));
              renderToolPopover();
            }
          }
          return;
        }
        const moveId = e.target.dataset?.hlMovePreset;
        if (moveId) {
          const idx = state.highlighter.presets.findIndex((p) => p.id === moveId);
          if (idx !== -1 && state.highlighter.presets.length > 1) {
            const nextIdx = (idx + 1) % state.highlighter.presets.length;
            const [item] = state.highlighter.presets.splice(idx, 1);
            state.highlighter.presets.splice(nextIdx, 0, item);
            localStorage.setItem(KEY_HL_PRESETS, JSON.stringify(state.highlighter.presets));
            renderToolPopover();
          }
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
    const penCustomColor = document.getElementById('kn-pen-custom-color');
    if (penCustomColor) {
      penCustomColor.oninput = () => {
        state.pen.color = penCustomColor.value;
        const dot = document.getElementById('kn-pen-dot');
        if (dot) dot.style.background = state.pen.color;
        renderToolPopover();
      };
    }
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
        const renameId = e.target.dataset?.penRenamePreset;
        if (renameId) {
          const target = state.pen.presets.find((p) => p.id === renameId);
          if (target) {
            const nextName = window.prompt('Rename Pen Preset:', target.name);
            if (nextName && nextName.trim()) {
              target.name = nextName.trim();
              localStorage.setItem(KEY_PEN_PRESETS, JSON.stringify(state.pen.presets));
              renderToolPopover();
            }
          }
          return;
        }
        const moveId = e.target.dataset?.penMovePreset;
        if (moveId) {
          const idx = state.pen.presets.findIndex((p) => p.id === moveId);
          if (idx !== -1 && state.pen.presets.length > 1) {
            const nextIdx = (idx + 1) % state.pen.presets.length;
            const [item] = state.pen.presets.splice(idx, 1);
            state.pen.presets.splice(nextIdx, 0, item);
            localStorage.setItem(KEY_PEN_PRESETS, JSON.stringify(state.pen.presets));
            renderToolPopover();
          }
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
    const erShowCur = document.getElementById('kn-er-show-cursor');
    if (erShowCur) {
      erShowCur.onchange = () => {
        state.eraser.showCursor = erShowCur.checked;
      };
    }
    const erSmooth = document.getElementById('kn-er-smooth');
    if (erSmooth) {
      erSmooth.onchange = () => {
        state.eraser.smoothEdges = erSmooth.checked;
      };
    }

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

    // Update Notes count badge in both Left & Right Panel tabs
    const totalNotesCount = state.annotations.filter((a) => a.type === 'note').length;
    const notesTabBtn = document.querySelector('[data-right-tab="notes"]');
    if (notesTabBtn) {
      notesTabBtn.textContent = `Notes (${totalNotesCount})`;
    }
    const leftNotesLbl = document.getElementById('kn-left-notes-label');
    if (leftNotesLbl) {
      leftNotesLbl.textContent = `Notes (${totalNotesCount})`;
    }

    if (state.leftTab === 'outline' || state.leftTab === 'notes' || state.leftTab === 'ai') {
      state.rightSidebarOpen = true;
      state.rightTab = state.leftTab;
      document.getElementById('kn-sidebar-right')?.classList.remove('kn-sidebar-collapsed');
      document.querySelectorAll('[data-right-tab]').forEach((b) => b.classList.toggle('active', b.dataset.rightTab === state.rightTab));
      renderRightSidebarContent();
    }

    if (state.leftTab === 'pages' || state.leftTab === 'outline' || state.leftTab === 'notes' || state.leftTab === 'ai') {
      let html = '';
      for (let p = 1; p <= state.totalPages; p++) {
        const hasAnnot = state.annotations.some((a) => a.page === p);
        const hasBm = state.bookmarks.includes(p);
        html += `
          <div class="kn-thumbnail-item ${p === state.currentPage ? 'active' : ''}" data-thumb-page="${p}">
            <span class="kn-thumb-index">${p}</span>
            <div class="kn-thumb-preview">
              <div class="kn-thumb-badges">
                ${hasBm ? '<span class="kn-thumb-badge" title="Bookmarked"></span>' : ''}
                ${hasAnnot ? '<span class="kn-thumb-badge" style="background:#FACC15;" title="Has Annotations"></span>' : ''}
              </div>
              <canvas id="kn-thumb-canvas-${p}" width="150" height="200"></canvas>
            </div>
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

      if (state.pdfDoc && typeof renderSidebarPdfThumbnails === 'function') {
        renderSidebarPdfThumbnails();
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
    const tbBmBtn = document.getElementById('kn-toolbar-bookmark');
    if (tbBmBtn) tbBmBtn.classList.toggle('active', state.bookmarks.includes(clamped));

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
    state.zoom = Math.max(0.5, Math.min(3.0, newZoom));
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
    if (state.editingTextId) {
      state.textCreationGuardUntil = 0;
      const activeEd = document.querySelector(`.kn-page-object[data-id="${state.editingTextId}"] .kn-textbox-editor`);
      if (activeEd && document.activeElement === activeEd) {
        activeEd.blur();
      }
      state.editingTextId = null;
    }

    if (toolName === 'ai') {
      state.rightSidebarOpen = true;
      state.rightTab = 'ai';
      document.getElementById('kn-sidebar-right')?.classList.remove('kn-sidebar-collapsed');
      document.querySelectorAll('[data-right-tab]').forEach((b) => b.classList.toggle('active', b.dataset.rightTab === 'ai'));
      renderRightSidebarContent();
      return;
    }

    const toolsWithPopover = ['pen', 'highlighter', 'eraser', 'text', 'notes', 'shapes'];
    if (state.activeTool === toolName) {
      if (toolsWithPopover.includes(toolName)) {
        if (state.toolPopoverOpen) {
          state.activeTool = null;
          state.toolPopoverOpen = false;
        } else {
          state.toolPopoverOpen = true;
        }
      } else {
        state.activeTool = null;
        state.toolPopoverOpen = false;
      }
    } else {
      state.activeTool = toolName;
      state.toolPopoverOpen = toolsWithPopover.includes(toolName);
    }

    state.noteCreationState = state.activeTool === 'notes' ? 'NOTE_TOOL_ACTIVE' : 'IDLE';

    document.querySelectorAll('#kn-toolbar .kn-tool-btn[data-tool]').forEach((btn) => {
      const isAct = btn.dataset.tool === state.activeTool;
      btn.classList.toggle('active', isAct);
      btn.setAttribute('aria-checked', isAct ? 'true' : 'false');
    });

    const isDrawingTool = ['pen', 'highlighter', 'eraser', 'shapes'].includes(state.activeTool);
    document.querySelectorAll('.kn-interaction-layer').forEach((layer) => {
      layer.classList.toggle('tool-active', Boolean(state.activeTool));
      layer.classList.toggle('kn-drawing-active', isDrawingTool);
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
    navigateBackToSheets(sheet.subject_id || sheet.subjectId);
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
  const collapseSidebarBtn = document.getElementById('kn-sidebar-collapse-btn');
  if (collapseSidebarBtn) collapseSidebarBtn.onclick = toggleLeftSidebar;
  const rightSidebarBtn = document.getElementById('kn-btn-right-sidebar');
  if (rightSidebarBtn) rightSidebarBtn.onclick = toggleRightSidebar;
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

  // Bookmark Toggle (both Header & Toolbar Bookmark buttons)
  const toggleCurrentPageBookmark = () => {
    const p = state.currentPage;
    if (state.bookmarks.includes(p)) {
      state.bookmarks = state.bookmarks.filter((b) => b !== p);
    } else {
      state.bookmarks.push(p);
    }
    localStorage.setItem(KEY_BM, JSON.stringify(state.bookmarks));
    const isBm = state.bookmarks.includes(p);
    document.getElementById('kn-btn-bookmark')?.classList.toggle('active', isBm);
    document.getElementById('kn-toolbar-bookmark')?.classList.toggle('active', isBm);
    renderLeftSidebarContent();
  };
  document.getElementById('kn-btn-bookmark').onclick = toggleCurrentPageBookmark;
  const tbBmEl = document.getElementById('kn-toolbar-bookmark');
  if (tbBmEl) tbBmEl.onclick = toggleCurrentPageBookmark;

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
      const dlUrl = sheet.pdf_url || sheet.download_url || sheet.fileUrl || sheet.file_url || sheet.url;
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
      else if (act === 'download' && dlUrl && dlUrl !== '#') window.open(dlUrl, '_blank');
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

  // ══════════════════════════════════════════════════════════════════════════
  // REAL PDF.JS DOCUMENT LOADER, RETINA RENDERER & THUMBNAIL PIPELINE
  // ══════════════════════════════════════════════════════════════════════════
  async function renderSidebarPdfThumbnails() {
    if (!state.pdfDoc) return;
    for (let p = 1; p <= state.totalPages; p++) {
      try {
        const tc = document.getElementById(`kn-thumb-canvas-${p}`);
        if (!tc) continue;
        const page = await state.pdfDoc.getPage(p);
        const unscaledVp = page.getViewport({ scale: 1.0, rotation: state.rotation });
        const thumbScale = 150 / (unscaledVp.width || BASE_W);
        const thumbVp = page.getViewport({ scale: thumbScale, rotation: state.rotation });
        tc.width = Math.max(1, Math.round(thumbVp.width));
        tc.height = Math.max(1, Math.round(thumbVp.height));
        const tCtx = tc.getContext('2d');
        tCtx.fillStyle = '#FFFFFF';
        tCtx.fillRect(0, 0, tc.width, tc.height);
        await page.render({ canvasContext: tCtx, viewport: thumbVp }).promise;
      } catch (e) {}
    }
  }

  async function renderVisiblePdfPages() {
    if (!state.pdfDoc) return;
    const loaderEl = document.getElementById('kn-doc-loader');
    const dpr = Math.min(window.devicePixelRatio || 1.5, 2.0);

    for (let p = 1; p <= state.totalPages; p++) {
      try {
        const page = await state.pdfDoc.getPage(p);
        const unscaledVp = page.getViewport({ scale: 1.0, rotation: state.rotation });
        const cssWidth = Math.round(BASE_W * state.zoom);
        const cssScale = cssWidth / (unscaledVp.width || BASE_W);
        const cssViewport = page.getViewport({ scale: cssScale, rotation: state.rotation });
        const cssW = Math.max(1, Math.round(cssViewport.width));
        const cssH = Math.max(1, Math.round(cssViewport.height));

        const card = pagesContainer.querySelector(`.kn-page-card[data-page="${p}"]`);
        if (card) {
          card.style.width = `${cssW}px`;
          card.style.height = `${cssH}px`;
        }

        const hlCanvas = document.getElementById(`kn-hl-canvas-${p}`);
        const annotCanvas = document.getElementById(`kn-annot-canvas-${p}`);
        if (hlCanvas && (hlCanvas.width !== cssW || hlCanvas.height !== cssH)) {
          hlCanvas.width = cssW;
          hlCanvas.height = cssH;
        }
        if (annotCanvas && (annotCanvas.width !== cssW || annotCanvas.height !== cssH)) {
          annotCanvas.width = cssW;
          annotCanvas.height = cssH;
        }

        const canvas = document.getElementById(`kn-pdf-canvas-${p}`);
        if (canvas) {
          const renderViewport = page.getViewport({ scale: cssScale * dpr, rotation: state.rotation });
          canvas.width = Math.max(1, Math.round(renderViewport.width));
          canvas.height = Math.max(1, Math.round(renderViewport.height));
          canvas.style.width = `${cssW}px`;
          canvas.style.height = `${cssH}px`;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          await page.render({ canvasContext: ctx, viewport: renderViewport }).promise;
        }

        renderPageAnnotations(p);

        if (p === 1 && loaderEl) {
          loaderEl.style.display = 'none';
        }

        // Extract real PDF text items for Search & Text-Aware Highlighting
        if (!state.pageTexts[p]?.fromPdf && typeof page.getTextContent === 'function') {
          try {
            const textContent = await page.getTextContent();
            const baseScale = BASE_W / (unscaledVp.width || BASE_W);
            const baseVp = page.getViewport({ scale: baseScale, rotation: state.rotation });
            const items = [];
            for (const item of textContent.items || []) {
              const str = (item.str || '').trim();
              if (!str) continue;
              const tx =
                window.pdfjsLib?.Util && typeof window.pdfjsLib.Util.transform === 'function'
                  ? window.pdfjsLib.Util.transform(baseVp.transform, item.transform)
                  : item.transform || [12, 0, 0, 12, 40, 100];
              const fontH = Math.max(10, Math.hypot(tx[2] || 0, tx[3] || 0) || item.height || 12);
              const x = Math.max(0, tx[4] || 0);
              const y = Math.max(0, (tx[5] || 0) - fontH);
              const w = Math.max(16, (item.width || str.length * 6) * baseScale);
              items.push({ str, x, y, w, h: fontH + 3 });
            }
            if (items.length > 0) {
              state.pageTexts[p] = {
                fromPdf: true,
                fullText: items.map((i) => i.str).join(' '),
                items,
              };
              populateSelectableTextLayer(p);
            }
          } catch (txtErr) {}
        }
      } catch (pageErr) {
        console.warn(`[KuroNotes] Error rendering PDF page ${p}:`, pageErr);
      }
    }
    if (loaderEl) loaderEl.style.display = 'none';
  }

  // Initial Build of Kuro Notes Shell
  buildPageCards();
  renderLeftSidebarContent();
  renderRightSidebarContent();
  updateHistoryButtons();

  // Resolve PDF URL from all possible sheet properties & IndexedDB pdfStore
  async function resolvePdfUrl() {
    let url = sheet.pdf_url || sheet.download_url || sheet.fileUrl || sheet.file_url || sheet.url || null;
    if (url === '#') url = null;
    if (!url && window.DATA?.pdfStore && typeof window.DATA.pdfStore.getPdfUrl === 'function') {
      try {
        url = await window.DATA.pdfStore.getPdfUrl(sheet.id);
      } catch (e) {}
    }
    return url;
  }

  async function loadRealPdfDocument() {
    const loaderEl = document.getElementById('kn-doc-loader');
    const errorEl = document.getElementById('kn-doc-error');
    const errorMsgEl = document.getElementById('kn-doc-error-msg');
    const directLinkEl = document.getElementById('kn-pdf-direct-link');

    if (errorEl) errorEl.style.display = 'none';

    let pdfUrl = await resolvePdfUrl();
    if (!pdfUrl || !window.pdfjsLib) {
      return;
    }

    if (loaderEl) loaderEl.style.display = 'flex';

    try {
      if (window.pdfjsLib.GlobalWorkerOptions && !window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc =
          'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      }

      const docParam =
        typeof pdfUrl === 'string' && !pdfUrl.startsWith('blob:') && !pdfUrl.startsWith('data:')
          ? {
              url: pdfUrl,
              cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
              cMapPacked: true,
            }
          : pdfUrl;

      let loadingTask = window.pdfjsLib.getDocument(docParam);
      try {
        state.pdfDoc = await loadingTask.promise;
      } catch (firstErr) {
        // Fallback: check if an offline copy exists in IndexedDB pdfStore
        let fallbackBlobUrl = null;
        if (window.DATA?.pdfStore && typeof window.DATA.pdfStore.getPdfUrl === 'function') {
          try {
            fallbackBlobUrl = await window.DATA.pdfStore.getPdfUrl(sheet.id);
          } catch (e) {}
        }
        if (fallbackBlobUrl && fallbackBlobUrl !== pdfUrl) {
          pdfUrl = fallbackBlobUrl;
          loadingTask = window.pdfjsLib.getDocument(fallbackBlobUrl);
          state.pdfDoc = await loadingTask.promise;
        } else {
          throw firstErr;
        }
      }

      state.totalPages = Math.max(1, state.pdfDoc.numPages || state.totalPages);
      if (state.currentPage > state.totalPages) state.currentPage = 1;

      // Measure Page 1 aspect ratio so slide decks (16:9 / 4:3) and A4 sheets render in true aspect ratio
      try {
        const firstPage = await state.pdfDoc.getPage(1);
        const vp1 = firstPage.getViewport({ scale: 1.0, rotation: 0 });
        if (vp1 && vp1.width > 0 && vp1.height > 0) {
          state.pdfBaseRatio = vp1.height / vp1.width;
        }
      } catch (e) {}

      const totalPagesEl = document.getElementById('kn-total-pages');
      if (totalPagesEl) totalPagesEl.textContent = state.totalPages;
      const pageInputEl = document.getElementById('kn-page-input');
      if (pageInputEl) pageInputEl.max = state.totalPages;
      const mobIndEl = document.getElementById('kn-mob-page-indicator');
      if (mobIndEl) mobIndEl.textContent = `${state.currentPage} / ${state.totalPages}`;

      buildPageCards();
      renderLeftSidebarContent();
      await renderVisiblePdfPages();
      await renderSidebarPdfThumbnails();
    } catch (err) {
      console.error('[KuroNotes] Failed to load PDF document:', pdfUrl, err);
      if (loaderEl) loaderEl.style.display = 'none';
      if (errorEl) {
        errorEl.style.display = 'flex';
        if (errorMsgEl) {
          errorMsgEl.textContent = `${t('تعذر جلب أو قراءة ملف الـ PDF:', 'Failed to load PDF file:')} ${err?.message || String(err)}`;
        }
        if (directLinkEl && pdfUrl) {
          directLinkEl.href = pdfUrl;
          directLinkEl.style.display = 'inline-flex';
        }
      }
    }
  }

  document.getElementById('kn-pdf-retry-btn')?.addEventListener('click', () => {
    loadRealPdfDocument();
  });
  document.getElementById('kn-pdf-error-back-btn')?.addEventListener('click', () => {
    navigateBackToSheets(sheet.subject_id || sheet.subjectId);
  });

  await loadRealPdfDocument();
}

window.Pages.sheetDetail = renderKuroNotesSheet;
window.SheetDetailPage = {
  render(container, sheetIdOrQuery, maybeQuery) {
    return renderKuroNotesSheet(container, sheetIdOrQuery, maybeQuery);
  },
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
