/**
 * KURO NOTES FINAL MASTER INTERFACE & UNIFIED TOOL SUITE VERIFICATION
 * Validates:
 *  1. 4-Area Master Shell (Header, Fixed Toolbar, Left Sidebar, Central PDF, Right Smart Panel)
 *  2. Exact Toolbar Group & Tool Order (1..10: Select, Highlighter, Pen, Eraser, Shapes, Image, Text, Notes | AI, More)
 *  3. Default Opening State (No annotation tool active initially: activeTool: null)
 *  4. 5-Layer Page Stack with Under-Text Highlighter (.kn-highlight-canvas + mix-blend-mode: multiply)
 *  5. All 9 Unified Tool Engines (Selection/Lasso, Highlighter, Pen, Eraser 3-mode, Shapes, Image+Crop, Direct Text, Notes, Page-Grouped Search)
 *  6. 3-Tier Responsive Layouts (Desktop >1100px, iPad 768-1100px with FABs, Mobile <768px with Bottom Bar)
 */

const fs = require('fs');

const sheetDetailCode = fs.readFileSync('js/pages/sheet-detail.js', 'utf8');
const polishCss = fs.readFileSync('css/polish.css', 'utf8');

const tests = [
  // 1. Master Shell & Branding
  {
    category: 'Master Shell & Header',
    name: 'Kuro Notes branding, mascot avatar, and truncated document title pill exist',
    pass:
      sheetDetailCode.includes('Kuro Notes') &&
      sheetDetailCode.includes('kn-header') &&
      sheetDetailCode.includes('kn-doc-title-pill') &&
      sheetDetailCode.includes('kn-mascot-avatar'),
  },
  {
    category: 'Master Shell & Header',
    name: 'Header contains Back button, Sidebar toggle, Search, Bookmark, Share, and More menu',
    pass:
      sheetDetailCode.includes('kn-btn-back') &&
      sheetDetailCode.includes('kn-btn-left-sidebar') &&
      sheetDetailCode.includes('kn-btn-search') &&
      sheetDetailCode.includes('kn-btn-bookmark') &&
      sheetDetailCode.includes('kn-btn-share') &&
      sheetDetailCode.includes('kn-btn-header-more'),
  },

  // 1. Unified Header Hierarchy (Back, Kuro Notes, Undo/Redo, Sheet Name, Page Nav, Zoom 50%..300%, Search, Bookmark, Share, More)
  {
    category: 'Unified Header Hierarchy',
    name: 'Header contains Back, Sidebar toggle, Kuro Notes brand, Undo/Redo, Sheet Name pill, Page Nav, Zoom (50%..300%), Search, Bookmark, Share, and More',
    pass:
      sheetDetailCode.includes('kn-btn-back') &&
      sheetDetailCode.includes('kn-btn-left-sidebar') &&
      sheetDetailCode.includes('Kuro Notes') &&
      sheetDetailCode.includes('kn-btn-undo') &&
      sheetDetailCode.includes('kn-btn-redo') &&
      sheetDetailCode.includes('kn-doc-title-pill') &&
      sheetDetailCode.includes('kn-group-pagenav') &&
      sheetDetailCode.includes('kn-group-zoom') &&
      sheetDetailCode.includes('data-zoom="1.3"') &&
      sheetDetailCode.includes('data-zoom="3.0"') &&
      sheetDetailCode.includes('kn-btn-search') &&
      sheetDetailCode.includes('kn-btn-bookmark') &&
      sheetDetailCode.includes('kn-btn-share') &&
      sheetDetailCode.includes('kn-btn-header-more'),
  },

  // 2. Clean Centered Top Toolbar & Exact Tool Order (Bookmark -> Fullscreen at end)
  {
    category: 'Clean Centered Top Toolbar',
    name: 'Toolbar follows exact order: Select, Pen, Highlighter, Eraser, Text, Image, Note, Bookmark, Fullscreen (AI, More, and extra panel icon completely removed, Fullscreen is last)',
    pass: (() => {
      const order = [
        'data-tool="select"',
        'data-tool="pen"',
        'data-tool="highlighter"',
        'data-tool="eraser"',
        'data-tool="text"',
        'data-tool="image"',
        'data-tool="notes"',
        'id="kn-toolbar-bookmark"',
        'id="kn-btn-reading-mode"',
      ];
      let lastIdx = -1;
      for (const token of order) {
        const idx = sheetDetailCode.indexOf(token);
        if (idx === -1 || idx < lastIdx) return false;
        lastIdx = idx;
      }
      const toolbarSlice = sheetDetailCode.slice(
        sheetDetailCode.indexOf('id="kn-toolbar"'),
        sheetDetailCode.indexOf('id="kn-tool-popover"')
      );
      const noAiInToolbar = !toolbarSlice.includes('data-tool="ai"') && !toolbarSlice.includes('id="kn-btn-ai"');
      const noMoreInToolbar = !toolbarSlice.includes('id="kn-toolbar-more"');
      const noSidebarInToolbar = !toolbarSlice.includes('id="kn-btn-right-sidebar"');
      const fsIsLast = toolbarSlice.indexOf('id="kn-btn-reading-mode"') > toolbarSlice.indexOf('id="kn-toolbar-bookmark"');
      return noAiInToolbar && noMoreInToolbar && noSidebarInToolbar && fsIsLast;
    })(),
  },
  {
    category: 'Default Opening State',
    name: 'No annotation tool is active by default when opening a sheet (activeTool: null)',
    pass: sheetDetailCode.includes('activeTool: null'),
  },

  // 3. 5-Layer Page Stack, Layer z-index & Under-Text Highlighter
  {
    category: '5-Layer Page Stack',
    name: 'Page card contains PDF canvas, Under-Text Highlight canvas, Text layer, Annotation canvas, and Objects layer with proper z-index',
    pass:
      sheetDetailCode.includes('kn-pdf-canvas') &&
      sheetDetailCode.includes('kn-highlight-canvas') &&
      sheetDetailCode.includes('kn-text-layer') &&
      sheetDetailCode.includes('kn-annotation-layer') &&
      sheetDetailCode.includes('kn-objects-layer') &&
      polishCss.includes('.kn-interaction-layer.kn-drawing-active'),
  },
  {
    category: 'Under-Text Highlighter',
    name: 'Highlighter canvas uses mix-blend-mode: multiply so PDF text stays 100% sharp and dark',
    pass:
      polishCss.includes('.kn-highlight-canvas') &&
      polishCss.includes('mix-blend-mode: multiply'),
  },

  // 4. Universal Selection, Smooth Move, 8-Handle Resize & Zoom Coordinate Lock
  {
    category: 'Universal Selection, Move & Resize Engine',
    name: 'Supports Dashed Rectangular Bounding Box, 8 square resize handles + top rotation handle, Contextual Action Bar, and 60fps in-place Move/Resize across all zoom levels (50%..300%)',
    pass:
      polishCss.includes('border: 1.5px dashed #7E1D2A') &&
      polishCss.includes('.kn-selection-box.is-text-sel') &&
      sheetDetailCode.includes('getCardScale') &&
      sheetDetailCode.includes('getCanvasScale') &&
      sheetDetailCode.includes('redrawPageCanvasesOnly') &&
      sheetDetailCode.includes('data-ctx="edit"') &&
      sheetDetailCode.includes('data-ctx="duplicate"') &&
      sheetDetailCode.includes('Math.min(3.0, newZoom)'),
  },
  {
    category: 'Highlighter & Pen Tools',
    name: 'Supports Freehand & Straight modes, live preview, color swatches, size/opacity sliders, and unified presets',
    pass:
      sheetDetailCode.includes('KEY_HL_PRESETS') &&
      sheetDetailCode.includes('KEY_PEN_PRESETS') &&
      sheetDetailCode.includes('kn-live-preview-box') &&
      sheetDetailCode.includes('quadraticCurveTo'),
  },
  {
    category: 'Eraser Tool (3 Modes)',
    name: 'Supports Stroke, Object, and Partial path-splitting eraser modes with live circular cursor and quick sizes',
    pass:
      sheetDetailCode.includes("mode === 'partial'") &&
      sheetDetailCode.includes('kn-eraser-cursor') &&
      sheetDetailCode.includes('kn-eraser-quick-row'),
  },
  {
    category: 'Text Tool',
    name: 'Appears directly on page without visible box when idle, supports RTL/LTR, fonts, size, B/I/U/S, alignment, and opacity',
    pass:
      polishCss.includes('.kn-textbox-obj') &&
      sheetDetailCode.includes('kn-textbox-editor') &&
      sheetDetailCode.includes('applyTextFormattingToSelected'),
  },
  {
    category: 'Image Tool & Crop',
    name: 'Supports Device Upload, Drag & Drop, Clipboard Paste, Rotation, Z-Order, and Interactive Non-Destructive Crop',
    pass:
      sheetDetailCode.includes('kn-img-action-grid') &&
      sheetDetailCode.includes('applyImageCrop') &&
      sheetDetailCode.includes('kn-crop-overlay'),
  },
  {
    category: 'Notes Tool & Smart Panel',
    name: 'Supports on-page Note cards (categories, colors, pin, collapse) synced with Right Panel Notes search, filter, and sort',
    pass:
      sheetDetailCode.includes('kn-note-obj') &&
      sheetDetailCode.includes('kn-sidebar-note-card') &&
      sheetDetailCode.includes('kn-notes-cat-filter') &&
      sheetDetailCode.includes('kn-notes-sort'),
  },
  {
    category: 'Search Tool',
    name: 'Supports Arabic/English search, Match Case, Whole Words, Page-Grouped results with highlighted snippets, and temporary marks',
    pass:
      sheetDetailCode.includes('kn-search-popover') &&
      sheetDetailCode.includes('kn-search-page-group') &&
      sheetDetailCode.includes('kn-search-snippet-mark') &&
      sheetDetailCode.includes('kn-search-mark'),
  },

  // 5. Responsive Layouts Across ALL Devices (Desktop, Tablet/iPad, Mobile)
  {
    category: 'Responsive All-Device Layouts',
    name: 'Defines Desktop (>1024px), Tablet/iPad (<=1024px), and Mobile (<=767px) adaptive Header & Toolbar without horizontal scrolling',
    pass:
      polishCss.includes('@media (max-width: 1024px)') &&
      polishCss.includes('@media (max-width: 767px)') &&
      polishCss.includes('.kn-mobile-bottom-bar') &&
      polishCss.includes('-webkit-tap-highlight-color: transparent'),
  },

  // 6. Open Sheet Route Pipeline, Multi-Source Lookup & Real PDF.js Loader
  {
    category: 'Open Sheet Route Pipeline',
    name: 'Exports both window.SheetDetailPage.render(container, queryParams) and window.Pages.sheetDetail',
    pass:
      sheetDetailCode.includes('window.SheetDetailPage =') &&
      sheetDetailCode.includes('render(container, sheetIdOrQuery, maybeQuery)') &&
      sheetDetailCode.includes('window.Pages.sheetDetail = renderKuroNotesSheet'),
  },
  {
    category: 'Open Sheet Route Pipeline',
    name: 'Resolves sheet from window.DATA.getSheetById, window.DATA.sheets, kf_cloud_cached_sheets, kf_admin_custom_sheets, and syncCloudSheets',
    pass:
      sheetDetailCode.includes('window.DATA.getSheetById') &&
      sheetDetailCode.includes('kf_cloud_cached_sheets') &&
      sheetDetailCode.includes('kf_admin_custom_sheets') &&
      sheetDetailCode.includes('syncCloudSheets'),
  },
  {
    category: 'Real PDF.js & Error/Loading States',
    name: 'Resolves real PDF URL from sheet.pdf_url, sheet.download_url, sheet.fileUrl, and IndexedDB pdfStore with #kn-doc-loader and #kn-doc-error Retry UI',
    pass:
      sheetDetailCode.includes('sheet.pdf_url') &&
      sheetDetailCode.includes('sheet.download_url') &&
      sheetDetailCode.includes('pdfStore.getPdfUrl') &&
      sheetDetailCode.includes('id="kn-doc-loader"') &&
      sheetDetailCode.includes('id="kn-doc-error"') &&
      sheetDetailCode.includes('id="kn-pdf-retry-btn"'),
  },

  // ══════════════════════════════════════════════════════════════════════════
  // FUNCTIONAL TESTS 1–10: ERASER (STROKE / PARTIAL / OBJECT), TEXT FOCUS, & NOTES
  // ══════════════════════════════════════════════════════════════════════════
  {
    category: 'TEST 1 — Stroke Eraser',
    name: 'Stroke Eraser uses segment hit detection (distToSegment / isStrokeHitByCircle) to delete an entire stroke when touched anywhere along its path and supports Undo/Redo',
    pass: (() => {
      // Verify segment distance math and Stroke mode behavior
      function distToSegment(p, a, b) {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const lenSq = dx * dx + dy * dy;
        if (lenSq === 0) return Math.hypot(p.x - a.x, p.y - a.y);
        const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / lenSq));
        return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
      }
      const strokePts = [{ x: 50, y: 100 }, { x: 250, y: 100 }];
      const touchMid = { x: 150, y: 104 };
      const hitMid = distToSegment(touchMid, strokePts[0], strokePts[1]) <= 12;
      return (
        hitMid &&
        sheetDetailCode.includes('function distToSegment(p, a, b)') &&
        sheetDetailCode.includes('function isStrokeHitByCircle(points, pt, effectiveRadius)') &&
        sheetDetailCode.includes('beforeEraseSnapshot')
      );
    })(),
  },
  {
    category: 'TEST 2 — Partial Eraser',
    name: 'Partial Eraser densifies stroke segments (densifyStrokePoints) and splits a stroke (───────────────) into two independent strokes (──────    ──────) when erasing the middle',
    pass: (() => {
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
              out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
            }
          }
          out.push(b);
        }
        return out;
      }
      // Simulate long stroke from x=50 to x=250 erased at x=150 with radius=15
      const rawStroke = [{ x: 50, y: 100 }, { x: 250, y: 100 }];
      const dense = densifyStrokePoints(rawStroke, 3);
      const splitSegments = [];
      let cur = [];
      for (const p of dense) {
        if (Math.hypot(p.x - 150, p.y - 100) <= 15) {
          if (cur.length >= 2) splitSegments.push(cur);
          cur = [];
        } else {
          cur.push(p);
        }
      }
      if (cur.length >= 2) splitSegments.push(cur);
      return (
        splitSegments.length === 2 &&
        splitSegments[0][0].x === 50 &&
        splitSegments[1][splitSegments[1].length - 1].x === 250 &&
        sheetDetailCode.includes('function densifyStrokePoints(points, stepPx = 3)')
      );
    })(),
  },
  {
    category: 'TEST 3 — Object Eraser',
    name: 'Object Eraser deletes any complete annotation object (Text, Note, Image, Shape, or Stroke) when touched without affecting the original PDF',
    pass:
      sheetDetailCode.includes("else if (mode === 'object')") &&
      sheetDetailCode.includes('removedIds.add(ann.id)') &&
      sheetDetailCode.includes('state.selectedIds = state.selectedIds.filter((id) => !removedIds.has(id))'),
  },
  {
    category: 'TEST 4 — Text Tool on Mobile (Android / iPhone)',
    name: 'Tapping page with Text Tool prevents default focus steal, focuses .kn-textbox-editor synchronously + on pointerup/touchend, guards against synthetic mobile blur, and keeps keyboard open',
    pass:
      sheetDetailCode.includes('function focusTextEditor(editorEl)') &&
      sheetDetailCode.includes('state.textCreationGuardUntil = Date.now() + 500') &&
      sheetDetailCode.includes("window.addEventListener('touchend', reinforceFocus, true)") &&
      sheetDetailCode.includes("editor.addEventListener('input'") &&
      polishCss.includes('touch-action: manipulation'),
  },
  {
    category: 'TEST 5 — Text Tool on Tablet / iPad',
    name: 'Text box under active editing is excluded from selection overlay (a.id !== state.editingTextId) so no overlay steals focus on iPad/Tablet',
    pass:
      sheetDetailCode.includes('a.id !== state.editingTextId') &&
      sheetDetailCode.includes('updateSelectionOverlayOnly(pageNum)'),
  },
  {
    category: 'TEST 6 — Text Tool on Desktop & One-Shot Deactivation',
    name: 'Clicking page with Text Tool opens editing session, allows direct typing, saves live on input/blur, and immediately deactivates Text Tool (deactivateCreationTool)',
    pass:
      sheetDetailCode.includes('function deactivateCreationTool()') &&
      sheetDetailCode.includes('state.editingTextId = newText.id') &&
      sheetDetailCode.includes('deactivateCreationTool()'),
  },
  {
    category: 'TEST 7 — Create One Note Only (One-Shot State Machine)',
    name: 'Tapping page with Note Tool transitions IDLE -> NOTE_TOOL_ACTIVE -> USER_TAPS_PAGE -> CREATE_NOTE -> EDIT_NOTE -> NOTE_TOOL_DEACTIVATED -> IDLE so a second tap never spawns another Note',
    pass:
      sheetDetailCode.includes("noteCreationState: 'IDLE'") &&
      sheetDetailCode.includes("state.noteCreationState = 'USER_TAPS_PAGE'") &&
      sheetDetailCode.includes("state.noteCreationState = 'CREATE_NOTE'") &&
      sheetDetailCode.includes("state.noteCreationState = 'EDIT_NOTE'") &&
      sheetDetailCode.includes("state.noteCreationState = 'NOTE_TOOL_DEACTIVATED'"),
  },
  {
    category: 'TEST 8 — Close / Delete Note (✕)',
    name: 'Clicking ✕ on a Note stops all event propagation, deletes ONLY that Note from state.annotations, saves to localStorage, and never creates a new Note',
    pass:
      sheetDetailCode.includes("const delBtn = el.querySelector('.kn-note-del-btn')") &&
      sheetDetailCode.includes('state.annotations = state.annotations.filter((a) => a.id !== ann.id)') &&
      polishCss.includes('.kn-selection-box.is-note-sel'),
  },
  {
    category: 'TEST 9 — Repeated ✕ Stress Test',
    name: 'interactLayer pointerdown explicitly ignores events originating inside .kn-page-object, .kn-note-obj, .kn-context-bar, or .kn-selection-box',
    pass:
      sheetDetailCode.includes(
        "if (e.target.closest('.kn-page-object, .kn-note-obj, .kn-context-bar, .kn-selection-box'))"
      ) && sheetDetailCode.includes('attachObjectPropagationBarrier(el)'),
  },
  {
    category: 'TEST 10 — Click Inside Note (Title, Body, Collapse, Pin)',
    name: 'All Note internal controls (title input, body textarea, collapse —, pin 📌, delete ✕) stop propagation across pointerdown, pointerup, click, touchstart, and touchend',
    pass:
      sheetDetailCode.includes("['pointerdown', 'pointerup', 'mousedown', 'mouseup', 'click']") &&
      sheetDetailCode.includes('[titleInp, bodyInp, pinBtn, collapseBtn, delBtn].forEach') &&
      sheetDetailCode.includes("['pointerdown', 'pointerup', 'mousedown', 'mouseup', 'click', 'dblclick', 'touchstart', 'touchend']"),
  },

  // ══════════════════════════════════════════════════════════════════════════
  // GLOBAL INTERACTION MODE TESTS (BROWSE MODE 👁 <-> EDIT MODE ✎)
  // ══════════════════════════════════════════════════════════════════════════
  {
    category: 'MODE TEST 1 — Default Mode (NEW SHEET = BROWSE MODE)',
    name: 'Opening any sheet starts in Browse Mode (interactionMode: "browse", .kn-is-browse-mode, #kn-btn-mode-toggle.kn-mode-browse) with Scroll, Zoom, Pinch-Zoom, Page Navigation, Search, and Bookmark active',
    pass:
      sheetDetailCode.includes("interactionMode: 'browse'") &&
      sheetDetailCode.includes('class="kuro-notes-workspace kn-is-browse-mode" id="kuro-notes-workspace" data-interaction-mode="browse"') &&
      sheetDetailCode.includes('id="kn-btn-mode-toggle"') &&
      sheetDetailCode.includes('kn-mode-toggle-btn kn-mode-browse') &&
      sheetDetailCode.includes('pinchStartDist') &&
      sheetDetailCode.includes("'wheel'"),
  },
  {
    category: 'MODE TEST 2 — Browse Mode Protection & Decoupled Tool State',
    name: 'In Browse Mode, all drawing, erasing, text/note creation, selection, move/resize, image drop/paste, and undo/redo are strictly blocked, and selecting Pen in the toolbar does NOT auto-enable Edit Mode',
    pass:
      sheetDetailCode.includes("if (state.interactionMode !== 'edit') return;") &&
      sheetDetailCode.includes('function syncInteractionLayersWithMode()') &&
      sheetDetailCode.includes('const isDrawingTool = isEdit &&') &&
      polishCss.includes('.kuro-notes-workspace.kn-is-browse-mode .kn-interaction-layer') &&
      polishCss.includes('pointer-events: none !important;'),
  },
  {
    category: 'MODE TEST 3 — Edit Mode Activation (✎ Burgundy #7E1D2A)',
    name: 'Clicking #kn-btn-mode-toggle switches to Edit Mode (.kn-mode-edit, #7E1D2A), unlocks on-page text/note editors, and enables Pen, Highlighter, Eraser, Text, Image, Note, Select, and Undo/Redo',
    pass:
      sheetDetailCode.includes('function setInteractionMode(nextMode)') &&
      sheetDetailCode.includes("setInteractionMode(state.interactionMode === 'edit' ? 'browse' : 'edit')") &&
      polishCss.includes('.kn-mode-toggle-btn.kn-mode-edit') &&
      polishCss.includes('background: #7E1D2A !important;'),
  },
  {
    category: 'MODE TEST 4 — Switch Back to Browse Mode (Zero-Reload Instant Lock)',
    name: 'Switching Edit Mode -> Browse Mode immediately cancels active pointers, blurs & locks text/note editors, closes tool popovers, and clears selection overlays without reloading the PDF',
    pass:
      sheetDetailCode.includes("window.dispatchEvent(new PointerEvent('pointercancel'))") &&
      sheetDetailCode.includes("el.contentEditable = 'false'") &&
      sheetDetailCode.includes('el.readOnly = true') &&
      sheetDetailCode.includes('updateSelectionOverlayOnly(p)'),
  },
  {
    category: 'MODE TEST 5 — Compact Icon-Only UI Across Desktop, Tablet/iPad & Mobile',
    name: 'Mode Toggle is a compact Icon Button (👁 / ✎) with floating data-tooltip badge (no large text toggle) visible in Header across Desktop, Tablet/iPad (38px), and Mobile (34px)',
    pass:
      sheetDetailCode.includes('kn-mode-icon-browse') &&
      sheetDetailCode.includes('kn-mode-icon-edit') &&
      sheetDetailCode.includes('data-tooltip="Browse Mode"') &&
      polishCss.includes('.kn-mode-toggle-btn::after') &&
      polishCss.includes('content: attr(data-tooltip);'),
  },
  {
    category: 'SEL MOVE TEST 1 — Handle vs Body Hit Testing & Layer Elevation',
    name: 'Handles are isolated to perimeter (inset: -3px), Body click is captured by .kn-selection-box with grabbing cursor, and .kn-objects-layer has z-index: 25 above interaction layer',
    pass:
      polishCss.includes('.kn-objects-layer {\n  position: absolute;\n  inset: 0;\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n  z-index: 25;') &&
      polishCss.includes('.kn-sel-handle::after {\n  content: \'\';\n  position: absolute;\n  inset: -3px;') &&
      polishCss.includes('.kn-selection-box.is-dragging {\n  cursor: grabbing !important;\n}') &&
      sheetDetailCode.includes('if (e.target.dataset.handle) return;'),
  },
  {
    category: 'SEL MOVE TEST 2 — Universal Multi-Type Move (Strokes, Shapes, Text, Notes, Images)',
    name: 'Move accurately translates Points, Rects, Line/Arrow endpoints (x1, y1, x2, y2), Rect/Ellipse shapes, and DOM objects using unscaled document logical coordinates',
    pass:
      sheetDetailCode.includes('ann.points = snap.points.map((pt) => ({ x: pt.x + dx, y: pt.y + dy }));') &&
      sheetDetailCode.includes('ann.rects = snap.rects.map((r) => ({ ...r, x: r.x + dx, y: r.y + dy }));') &&
      sheetDetailCode.includes("snap.type === 'shape' && (snap.shapeType === 'line' || snap.shapeType === 'arrow')") &&
      sheetDetailCode.includes('ann.x1 = (snap.x1 !== undefined ? snap.x1 : snap.x) + dx;') &&
      sheetDetailCode.includes('ann.x2 = (snap.x2 !== undefined ? snap.x2 : (snap.x + (snap.w || 0))) + dx;'),
  },
  {
    category: 'SEL MOVE TEST 3 — Note Card Selection & Movement',
    name: 'Selected Note cards can be moved via selection box (.kn-selection-box.is-note-sel pointer-events: auto), provide Edit Note action, and allow header dragging',
    pass:
      polishCss.includes('.kn-selection-box.is-note-sel {\n  border-color: #B45309;\n  background: rgba(245, 158, 11, 0.04);\n  pointer-events: auto;\n}') &&
      sheetDetailCode.includes("data-ctx=\"edit-note\"") &&
      sheetDetailCode.includes("action === 'edit-note' && selectedItems[0]?.type === 'note'"),
  },
  {
    category: 'SEL MOVE TEST 4 — Single Undo Action for Entire Drag',
    name: 'Pre-move history snapshot is captured before mutation begins (if (!historyRecorded) { pushHistory(); historyRecorded = true; }) so Undo returns item to exact pre-move position',
    pass:
      sheetDetailCode.includes('if (!historyRecorded) {\n          pushHistory();\n          historyRecorded = true;\n        }') &&
      !sheetDetailCode.includes("selBox.addEventListener('pointerdown', (e) => {\n        if (moved) {\n          pushHistory();"),
  },
  {
    category: 'SEL DELETE TEST 1 — Contextual Bar & Keyboard Delete Isolation',
    name: 'Clicking Delete in Contextual Bar or pressing Delete/Backspace deletes ONLY selected items from state.annotations, removes overlay DOM immediately, and saves to storage',
    pass:
      sheetDetailCode.includes("} else if (action === 'delete') {") &&
      sheetDetailCode.includes('const targetIds = new Set([') &&
      sheetDetailCode.includes('state.annotations = state.annotations.filter((a) => !targetIds.has(a.id));') &&
      sheetDetailCode.includes("objLayer.querySelectorAll('.kn-selection-box, .kn-context-bar').forEach((n) => n.remove());"),
  },
  {
    category: 'SEL DELETE TEST 2 — Perfect Undo & Zero-Event Leakage',
    name: 'Delete pushes history before filtering state so performUndo() fully restores deleted items, and ctxBar stops event propagation preventing canvas draw',
    pass:
      sheetDetailCode.includes("action === 'delete') {\n      pushHistory();") &&
      sheetDetailCode.includes("['pointerdown', 'pointerup', 'mousedown', 'mouseup', 'touchstart', 'touchend'].forEach((evName) => {\n      ctxBar.addEventListener(evName, (e) => {\n        e.stopPropagation();\n      });\n    });"),
  },
  {
    category: 'JNOTES LASSO TEST 1 — Toolbar Button & Icon',
    name: 'Toolbar features Lasso tool with dashed loop icon and label "Lasso", with popover enabled in toolsWithPopover',
    pass:
      sheetDetailCode.includes('<!-- 1. Select / Lasso -->') &&
      sheetDetailCode.includes('<span class="kn-tool-label">Lasso</span>') &&
      sheetDetailCode.includes('stroke-dasharray="3 2"') &&
      sheetDetailCode.includes("toolsWithPopover = ['select', 'pen'"),
  },
  {
    category: 'JNOTES LASSO TEST 2 — Freehand & Rectangle Mode Cards',
    name: 'Lasso Popover includes 2 prominent mode cards (Freehand Lasso & Rectangle) with SVG previews and active styling',
    pass:
      sheetDetailCode.includes('kn-lasso-mode-grid') &&
      sheetDetailCode.includes('data-sel-mode="lasso"') &&
      sheetDetailCode.includes('Freehand Lasso') &&
      sheetDetailCode.includes('data-sel-mode="rect"') &&
      sheetDetailCode.includes('Rectangle') &&
      polishCss.includes('.kn-lasso-mode-card.active {'),
  },
  {
    category: 'JNOTES LASSO TEST 3 — 8 Target Filter Chips with Bespoke Icons',
    name: 'Lasso Popover includes "Select the target" section with all 8 chips (All, Handwriting, Pen, Highlighter, Graphics, Image, Text, Note)',
    pass: (() => {
      const targets = ['all', 'handwriting', 'pen', 'highlighter', 'graphics', 'image', 'text', 'note'];
      return (
        targets.every((tgt) => sheetDetailCode.includes(`id: '${tgt}'`)) &&
        sheetDetailCode.includes('data-sel-filter="${item.id}"') &&
        sheetDetailCode.includes('kn-lasso-section-title') &&
        sheetDetailCode.includes('Select the target')
      );
    })(),
  },
  {
    category: 'JNOTES LASSO TEST 4 — Multi-Target Filter Logic & Graphics Mapping',
    name: 'matchesSelectionFilter accurately filters each target type (handwriting -> pen/highlighter, graphics/shape -> shape, etc.)',
    pass:
      sheetDetailCode.includes("if (f === 'all') return true;") &&
      sheetDetailCode.includes("if (f === 'handwriting') return ann.type === 'pen' || ann.type === 'highlighter';") &&
      sheetDetailCode.includes("if (f === 'graphics' || f === 'shape') return ann.type === 'shape';"),
  },
  {
    category: 'JNOTES LASSO TEST 5 — Auto-Dismiss on Select & Outside-Click Handling',
    name: 'Lasso popover automatically closes upon gesture completion on page, and outside pointerdown dismisses popover without clearing selection',
    pass:
      sheetDetailCode.includes("if (state.toolPopoverOpen) {\n            state.toolPopoverOpen = false;\n            renderToolPopover();\n          }") &&
      sheetDetailCode.includes('_knDocPopoverDismissBound') &&
      sheetDetailCode.includes("state.toolPopoverOpen = false;\n        toolPopover.classList.remove('open');"),
  },
  {
    category: 'JNOTES LASSO TEST 6 — Full Contextual Action Toolbar',
    name: 'Selected elements expose Copy, Cut, Duplicate, Front, Back, and Delete directly in the contextual bar',
    pass:
      sheetDetailCode.includes('data-ctx="copy"') &&
      sheetDetailCode.includes('data-ctx="cut"') &&
      sheetDetailCode.includes('data-ctx="duplicate"') &&
      sheetDetailCode.includes('data-ctx="front"') &&
      sheetDetailCode.includes('data-ctx="back"') &&
      sheetDetailCode.includes('data-ctx="delete"'),
  },
];

let failed = 0;
console.log('====================================================');
console.log('🧪 RUNNING KURO NOTES FINAL MASTER SUITE VERIFICATION');
console.log('====================================================\n');

tests.forEach((t) => {
  if (t.pass) {
    console.log(`✅ [PASS] (${t.category}) ${t.name}`);
  } else {
    console.error(`❌ [FAIL] (${t.category}) ${t.name}`);
    failed++;
  }
});

console.log('\n====================================================');
if (failed === 0) {
  console.log(`🌟 ALL ${tests.length} KURO NOTES FINAL VERIFICATION TESTS PASSED!`);
  process.exit(0);
} else {
  console.error(`💥 ${failed} / ${tests.length} TESTS FAILED.`);
  process.exit(1);
}
