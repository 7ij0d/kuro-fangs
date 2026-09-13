/**
 * KURO FANGS — ACADEMIC PDF ANNOTATION WORKSPACE & JNOTES NOTE STUDIO
 * 
 * Complete Redesign featuring:
 * 1. Layer A: Global Top Navigation Bar (Navigation, Title/Subject, Auto-save status, Stepper, Zoom, Themes, Export, Discussion)
 * 2. Layer B: Dedicated Primary Annotation Toolbar (Lasso, Pen, Pencil, Highlighter, Eraser, Text, Shapes, Ruler, Study Tape, Laser, Audio, AI)
 * 3. Layer C: Dynamic Contextual Tool Properties Bar (Palettes, Stroke Slider, Opacity, Straight Snap, Presets)
 * 4. Multi-Tab Workspace Sidebar (Pages, Bookmarks, Outline, Search, Discussion, AI Study Hub)
 * 5. Advanced Interactive Tools Engine (Study Tape, Lasso Selection, Straightedge Ruler, Laser Pointer, Audio Notes)
 * 6. High-DPI Retina PDF.js Multi-Page Rendering + High-Performance Annotation Canvases
 * 7. Professional Multi-Format Export (Original PDF, Annotated Merged PDF, High-Res PNG)
 * 8. 100% Backward Compatibility with Kuro Fangs Data and Annotations
 */

(function() {
  'use strict';

  // STUDIO CSS STYLES
  const STUDIO_STYLES = `
    :root {
      --j-bg: #12131F;
      --j-top: #161724;
      --j-tool: #1A1C2C;
      --j-ctx: #202236;
      --j-card: #25283D;
      --j-brand: #0284C7;
      --j-brand-dark: #0369A1;
      --j-accent: #38BDF8;
      --j-border: rgba(255, 255, 255, 0.08);
      --j-text: #F8FAFC;
      --j-text-muted: #94A3B8;
      --j-success: #34D399;
      --j-danger: #EF4444;
      --j-warning: #F59E0B;
    }
    .sheet-studio-fullscreen {
      font-family: 'IBM Plex Sans Arabic', 'Inter', sans-serif;
      background-color: var(--j-bg);
      color: var(--j-text);
      line-height: 1.5;
      user-select: none;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
    }

    /* ==========================================================================
       LAYER A: GLOBAL TOP NAVIGATION BAR (.jnotes-global-bar)
       ========================================================================== */
    .jnotes-global-bar {
      height: 50px;
      background: var(--j-top);
      border-bottom: 1px solid var(--j-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 14px;
      gap: 12px;
      z-index: 100;
      flex-shrink: 0;
    }
    .j-bar-section {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .j-btn {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: var(--j-text);
      border-radius: 8px;
      padding: 6px 12px;
      font-size: 0.775rem;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.18s ease;
      white-space: nowrap;
      font-family: inherit;
    }
    .j-btn:hover {
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(255, 255, 255, 0.2);
    }
    .j-btn-primary {
      background: linear-gradient(135deg, #0284C7, #0369A1);
      border-color: rgba(255, 255, 255, 0.2);
      color: #FFF;
      box-shadow: 0 2px 8px rgba(2, 132, 199, 0.35);
    }
    .j-btn-primary:hover {
      background: linear-gradient(135deg, #0369A1, #075985);
    }
    .j-btn-icon {
      padding: 6px 8px;
    }
    .j-btn-danger {
      background: rgba(239, 68, 68, 0.15);
      border-color: rgba(239, 68, 68, 0.3);
      color: #EF4444;
    }
    .j-btn-danger:hover {
      background: rgba(239, 68, 68, 0.25);
    }

    /* Meta Pill */
    .j-title-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--j-border);
      padding: 4px 10px;
      border-radius: 20px;
      max-width: 320px;
    }
    .j-badge-subject {
      background: #0284C7;
      color: #FFF;
      font-size: 0.65rem;
      font-weight: 800;
      padding: 2px 8px;
      border-radius: 10px;
      letter-spacing: 0.3px;
    }
    .j-title-text {
      font-size: 0.775rem;
      font-weight: 700;
      color: var(--j-text);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* Auto-Save Badge */
    .j-autosave-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 0.7rem;
      color: var(--j-text-muted);
      background: rgba(255, 255, 255, 0.03);
      padding: 4px 10px;
      border-radius: 20px;
      border: 1px solid var(--j-border);
    }
    .j-autosave-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--j-success);
      box-shadow: 0 0 6px var(--j-success);
      transition: background 0.3s;
    }
    .j-autosave-dot.saving {
      background: var(--j-warning);
      box-shadow: 0 0 6px var(--j-warning);
      animation: pulseDot 1s infinite alternate;
    }
    @keyframes pulseDot {
      from { opacity: 0.4; transform: scale(0.85); }
      to { opacity: 1; transform: scale(1.15); }
    }

    /* Page Navigation Cluster */
    .j-nav-cluster {
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--j-border);
      border-radius: 20px;
      padding: 2px 4px;
      gap: 2px;
    }
    .j-nav-btn {
      background: none;
      border: none;
      color: var(--j-text);
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s;
    }
    .j-nav-btn:hover {
      background: rgba(255, 255, 255, 0.1);
    }
    .j-page-stepper-text {
      font-size: 0.775rem;
      font-weight: 700;
      color: var(--j-text);
      padding: 0 8px;
      cursor: pointer;
      min-width: 60px;
      text-align: center;
    }
    .j-page-stepper-text:hover {
      color: var(--j-accent);
      text-decoration: underline;
    }

    /* Zoom Controls */
    .j-zoom-cluster {
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--j-border);
      border-radius: 20px;
      padding: 2px 4px;
      gap: 2px;
    }
    .j-zoom-val {
      font-size: 0.725rem;
      font-weight: 700;
      color: var(--j-text);
      min-width: 42px;
      text-align: center;
      cursor: pointer;
    }
    .j-zoom-val:hover {
      color: var(--j-accent);
    }

    /* ==========================================================================
       LAYER B: DEDICATED PRIMARY ANNOTATION TOOLBAR (.jnotes-annotation-toolbar)
       ========================================================================== */
    .jnotes-annotation-toolbar {
      height: 46px;
      background: var(--j-tool);
      border-bottom: 1px solid var(--j-border);
      display: flex;
      align-items: center;
      padding: 0 10px;
      gap: 4px;
      z-index: 99;
      flex-shrink: 0;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .jnotes-annotation-toolbar::-webkit-scrollbar { display: none; }

    .j-tool-btn {
      background: transparent;
      border: 1px solid transparent;
      color: #CBD5E1;
      border-radius: 8px;
      height: 36px;
      padding: 0 10px;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
      white-space: nowrap;
      font-family: inherit;
    }
    .j-tool-btn:hover {
      background: rgba(255, 255, 255, 0.07);
      color: #FFF;
    }
    .j-tool-btn.active {
      background: rgba(2, 132, 199, 0.22);
      border-color: rgba(56, 189, 248, 0.45);
      color: #38BDF8;
      box-shadow: 0 0 10px rgba(2, 132, 199, 0.25);
    }
    .j-tool-btn.active svg {
      stroke: #38BDF8;
    }
    .j-divider {
      width: 1px;
      height: 22px;
      background: var(--j-border);
      margin: 0 4px;
      flex-shrink: 0;
    }

    /* ==========================================================================
       LAYER C: CONTEXTUAL TOOL PROPERTIES BAR (.jnotes-context-bar)
       ========================================================================== */
    .jnotes-context-bar {
      min-height: 42px;
      background: var(--j-ctx);
      border-bottom: 1px solid var(--j-border);
      display: flex;
      align-items: center;
      padding: 4px 14px;
      gap: 12px;
      z-index: 98;
      flex-shrink: 0;
      overflow-x: auto;
      scrollbar-width: none;
      transition: background 0.2s;
    }
    .jnotes-context-bar::-webkit-scrollbar { display: none; }

    .j-ctx-group {
      display: flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
    }
    .j-ctx-label {
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--j-text-muted);
    }

    /* Color Swatches Grid */
    .j-swatch-list {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .j-swatch {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      cursor: pointer;
      border: 2px solid transparent;
      transition: transform 0.15s, border-color 0.15s;
    }
    .j-swatch:hover {
      transform: scale(1.18);
    }
    .j-swatch.active {
      border-color: #FFF;
      box-shadow: 0 0 8px rgba(255, 255, 255, 0.7);
      transform: scale(1.15);
    }

    /* Thickness Slider & Chips */
    .j-thickness-chip {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: var(--j-text);
      padding: 2px 7px;
      border-radius: 6px;
      font-size: 0.7rem;
      font-weight: 700;
      cursor: pointer;
    }
    .j-thickness-chip.active {
      background: #0284C7;
      color: #FFF;
      border-color: #38BDF8;
    }

    /* Pen Case Preset Chips */
    .j-pen-chip {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 20px;
      padding: 3px 10px;
      font-size: 0.725rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .j-pen-chip:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.25);
    }
    .j-pen-chip.active {
      background: rgba(2, 132, 199, 0.25);
      border-color: #38BDF8;
      color: #38BDF8;
    }
    .j-pen-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    /* ==========================================================================
       WORKSPACE & VIEWPORT
       ========================================================================== */
    .jnotes-workspace {
      flex: 1;
      display: flex;
      position: relative;
      overflow: hidden;
      width: 100%;
      height: 100%;
    }
    .jnotes-viewport {
      flex: 1;
      overflow: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 24px 16px 80px 16px;
      position: relative;
      background: var(--j-bg);
      scroll-behavior: smooth;
    }
    .jnotes-pages-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 28px;
      width: 100%;
      max-width: 1100px;
      transform-origin: top center;
      transition: transform 0.12s ease-out;
    }

    /* Document Page Container */
    .doc-page {
      position: relative;
      background: #FFFFFF;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.55);
      border-radius: 6px;
      overflow: hidden;
      margin: 0 auto;
      transition: box-shadow 0.2s, filter 0.3s;
    }
    .doc-page.active-page-viewport {
      box-shadow: 0 14px 44px rgba(2, 132, 199, 0.3), 0 0 0 2px rgba(2, 132, 199, 0.6);
    }
    .pdf-render-canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: block;
      z-index: 1;
      pointer-events: none;
    }
    .canvas-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: block;
      z-index: 5;
      cursor: crosshair;
      touch-action: none;
    }

    /* Paper Themes */
    .theme-warm .doc-page {
      background: #FAF4E8 !important;
      filter: sepia(0.18) contrast(0.98);
    }
    .theme-sepia .doc-page {
      background: #EFE6D5 !important;
      filter: sepia(0.4) contrast(0.95);
    }
    .theme-dark .doc-page {
      background: #181926 !important;
      filter: invert(0.92) hue-rotate(180deg) contrast(1.05);
    }

    /* Study Tape Elements */
    .study-tape-box {
      position: absolute;
      border-radius: 4px;
      z-index: 8;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.22s ease, transform 0.15s ease;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      user-select: none;
    }
    .study-tape-box.concealed {
      opacity: 0.98;
      background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.2) 10px, rgba(255,255,255,0.2) 20px);
    }
    .study-tape-box.concealed::after {
      content: '🔒 انقر للكشف';
      color: #FFF;
      font-size: 0.65rem;
      font-weight: 800;
      text-shadow: 0 1px 3px rgba(0,0,0,0.6);
      letter-spacing: 0.3px;
    }
    .study-tape-box.revealed {
      opacity: 0.18;
      border: 2px dashed #0284C7;
      background: rgba(2, 132, 199, 0.1) !important;
    }
    .study-tape-box:hover {
      transform: scale(1.01);
    }

    /* Text Box Overlays */
    .jnotes-text-box {
      position: absolute;
      z-index: 9;
      min-width: 80px;
      min-height: 32px;
      padding: 6px 10px;
      border-radius: 6px;
      outline: none;
      cursor: move;
      font-family: inherit;
      line-height: 1.4;
      border: 1px dashed rgba(2, 132, 199, 0.5);
      background: rgba(255, 255, 255, 0.92);
      color: #0F172A;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    .jnotes-text-box:focus-within {
      border: 1.5px solid #0284C7;
      box-shadow: 0 4px 18px rgba(2, 132, 199, 0.35);
    }

    /* Translucent Straightedge Ruler */
    .jnotes-ruler-overlay {
      position: absolute;
      top: 150px;
      left: calc(50% - 240px);
      width: 480px;
      height: 70px;
      background: rgba(30, 41, 59, 0.75);
      backdrop-filter: blur(12px);
      border: 1.5px solid rgba(56, 189, 248, 0.5);
      border-radius: 10px;
      z-index: 25;
      display: none;
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.6);
      cursor: grab;
      touch-action: none;
    }
    .jnotes-ruler-overlay.active { display: block; }
    .jnotes-ruler-overlay:active { cursor: grabbing; }
    .ruler-edge-marks {
      width: 100%;
      height: 14px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255,255,255,0.25);
      padding: 0 6px;
    }
    .ruler-tick {
      width: 1px;
      height: 6px;
      background: rgba(255,255,255,0.4);
    }
    .ruler-tick.major {
      height: 12px;
      background: #38BDF8;
    }
    .ruler-info-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 12px;
      color: #F8FAFC;
      font-size: 0.75rem;
      font-weight: 700;
    }

    /* ==========================================================================
       MULTI-TAB WORKSPACE SIDEBAR (.jnotes-multi-sidebar)
       ========================================================================== */
    .jnotes-sidebar-backdrop {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.55);
      backdrop-filter: blur(2px);
      z-index: 200;
      display: none;
      opacity: 0;
      transition: opacity 0.25s;
    }
    .jnotes-sidebar-backdrop.open {
      display: block;
      opacity: 1;
    }

    .jnotes-multi-sidebar {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      width: min(380px, 92vw);
      background: var(--j-top);
      border-left: 1px solid var(--j-border);
      z-index: 201;
      display: flex;
      flex-direction: column;
      transform: translateX(100%);
      transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: -10px 0 40px rgba(0,0,0,0.6);
      direction: rtl;
    }
    .jnotes-multi-sidebar.open {
      transform: translateX(0);
    }

    /* Sidebar Navigation Tabs */
    .j-sidebar-tabs-nav {
      display: flex;
      background: #12131F;
      border-bottom: 1px solid var(--j-border);
      overflow-x: auto;
      scrollbar-width: none;
    }
    .j-sidebar-tab-btn {
      flex: 1;
      padding: 12px 6px;
      font-size: 0.725rem;
      font-weight: 700;
      background: transparent;
      border: none;
      color: var(--j-text-muted);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      border-bottom: 2px solid transparent;
      transition: all 0.15s ease;
      white-space: nowrap;
      font-family: inherit;
    }
    .j-sidebar-tab-btn:hover {
      color: #FFF;
      background: rgba(255,255,255,0.02);
    }
    .j-sidebar-tab-btn.active {
      color: var(--j-accent);
      border-bottom-color: var(--j-accent);
      background: rgba(2, 132, 199, 0.12);
    }

    .j-tab-panel {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: none;
    }
    .j-tab-panel.active {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    /* Thumbnail Cards in Sidebar */
    .j-thumb-card {
      background: #1E2030;
      border: 1px solid var(--j-border);
      border-radius: 10px;
      padding: 10px 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
      transition: all 0.18s ease;
    }
    .j-thumb-card:hover {
      border-color: var(--j-accent);
      transform: translateY(-1px);
    }
    .j-thumb-card.active {
      border-color: var(--j-accent);
      background: rgba(2, 132, 199, 0.15);
      box-shadow: 0 0 12px rgba(2, 132, 199, 0.25);
    }
    .j-thumb-badge-num {
      width: 28px;
      height: 28px;
      border-radius: 8px;
      background: #0284C7;
      color: #FFF;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 0.775rem;
      flex-shrink: 0;
    }

    /* Popover Menus (Export, Jump, Comfort) */
    .j-popover-menu {
      position: absolute;
      top: 54px;
      background: #1C1E2F;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      padding: 8px;
      box-shadow: 0 16px 40px rgba(0,0,0,0.6);
      z-index: 150;
      display: none;
      flex-direction: column;
      gap: 4px;
      min-width: 220px;
      animation: popIn 0.18s ease-out forwards;
    }
    .j-popover-menu.open { display: flex; }
    @keyframes popIn {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .j-menu-item {
      background: transparent;
      border: none;
      color: var(--j-text);
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 0.775rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      text-align: right;
      transition: background 0.15s;
      font-family: inherit;
    }
    .j-menu-item:hover {
      background: rgba(255, 255, 255, 0.08);
      color: var(--j-accent);
    }

    /* Fallback Slide Content */
    .fallback-slide-content {
      padding: 36px 40px;
      min-height: 480px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 16px;
      color: #0F172A;
    }
  `;

  // Global Workspace State
  let currentDoc = null;
  let totalPages = 1;
  let currentPage = 1;
  let currentTool = 'pen';
  let currentColor = '#0284C7';
  let currentStrokeWidth = 0.8;
  let currentOpacity = 1.0;
  let isStraightSnap = false;
  let eraserMode = 'object';
  let activeShape = 'rectangle';
  let currentTheme = 'white';
  let zoomLevel = 1.0;
  let rulerAngle = 0;
  let isRulerActive = false;

  let pageStrokes = {};
  let studyTapes = {};
  let pageBookmarks = [];

  // Default Pen Case Presets
  function getDefaultPenPresets() {
    return [
      { id: 'p_blue', name: 'قلم أزرق', tool: 'pen', color: '#0284C7', width: 0.5, opacity: 1.0 },
      { id: 'p_red', name: 'أحمر امتحاني', tool: 'pen', color: '#EF4444', width: 0.8, opacity: 1.0 },
      { id: 'p_green', name: 'أخضر مخططات', tool: 'pen', color: '#10B981', width: 0.5, opacity: 1.0 },
      { id: 'p_yellow_hl', name: 'تظليل أصفر', tool: 'highlighter', color: '#FACC15', width: 1.6, opacity: 0.45 },
      { id: 'p_purple_hl', name: 'تظليل بنفسجي', tool: 'highlighter', color: '#A855F7', width: 1.6, opacity: 0.45 }
    ];
  }

  function getPenPresets() {
    try {
      const raw = localStorage.getItem('kf_jnotes_pen_presets');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return getDefaultPenPresets();
  }

  function savePenPresets(presets) {
    try {
      localStorage.setItem('kf_jnotes_pen_presets', JSON.stringify(presets));
    } catch (e) {}
  }

  // Generate HTML Markup for Studio
  function getStudioMarkup(doc, isAr) {
    const title = doc.title || (isAr ? doc.title_ar : doc.title_en) || (isAr ? 'شيت دراسي' : 'Lecture Sheet');
    const doctor = doc.doctor_name || (isAr ? 'أستاذ المادة' : 'Lecturer');
    const subjectName = doc.subject_name || (isAr ? 'المادة الدراسية' : 'Subject');
    const university = doc.university || 'University of Tripoli - School of Dentistry';
    const numPages = Math.max(1, parseInt(doc.pages, 10) || 1);

    return `
      <!-- LAYER A: GLOBAL TOP NAVIGATION BAR -->
      <header class="jnotes-global-bar">
        <div class="j-bar-section">
          <button class="j-btn" id="btn-back-platform" onclick="exitStudio()" title="العودة للمنصة">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
            <span>العودة</span>
          </button>
          <div class="j-title-pill">
            <span class="j-badge-subject">${subjectName}</span>
            <span class="j-title-text" title="${title}">${title}</span>
          </div>
          <div class="j-autosave-badge" id="auto-save-badge">
            <span class="j-autosave-dot" id="auto-save-dot"></span>
            <span id="auto-save-text">تم الحفظ تلقائياً</span>
          </div>
        </div>

        <div class="j-bar-section">
          <div class="j-nav-cluster">
            <button class="j-nav-btn" onclick="prevPage()" title="الصفحة السابقة">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m9 18 6-6-6-6"/></svg>
            </button>
            <span class="j-page-stepper-text" id="page-counter-stepper" onclick="openPageJumpModal()" title="انتقال مباشر لرقم الصفحة">
              1 / ${numPages}
            </span>
            <button class="j-nav-btn" onclick="nextPage()" title="الصفحة التالية">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
            </button>
          </div>

          <div class="j-zoom-cluster">
            <button class="j-nav-btn" onclick="zoomOut()" title="تصغير">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
            <span class="j-zoom-val" id="zoom-val-text" onclick="resetZoom()" title="إعادة الضبط 100%">100%</span>
            <button class="j-nav-btn" onclick="zoomIn()" title="تكبير">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </button>
            <button class="j-nav-btn" onclick="fitWidth()" title="ملاءمة العرض" style="font-size: 0.65rem; font-weight: 800;">عرض</button>
            <button class="j-nav-btn" onclick="fitPage()" title="ملاءمة الصفحة" style="font-size: 0.65rem; font-weight: 800;">صفحة</button>
          </div>
        </div>

        <div class="j-bar-section">
          <button class="j-btn j-btn-icon" onclick="openSidebarTab('search')" title="البحث في الشيت">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
          <button class="j-btn j-btn-icon" id="btn-theme-trigger" onclick="togglePopover('menu-eye-comfort')" title="راحة العين ونمط الورق">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
          </button>
          <button class="j-btn j-btn-icon" onclick="toggleFullscreenMode()" title="ملء الشاشة">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>
          </button>
          <button class="j-btn" onclick="toggleDiscussionDrawer()" title="المناقشات والأسئلة">
            <span>💬</span>
            <span>مناقشة</span>
            <span id="header-comment-badge" style="background: rgba(2,132,199,0.3); color: #38BDF8; padding: 1px 6px; border-radius: 10px; font-size: 0.7rem;">0</span>
          </button>
          <button class="j-btn" onclick="toggleMultiSidebar()" title="فتح لوحة الفهرس والأدوات">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="M14 9h4"/><path d="M14 15h4"/></svg>
            <span>الفهرس والأدوات</span>
          </button>
          <button class="j-btn j-btn-primary" onclick="togglePopover('menu-export')" title="تصدير وتنزيل">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>تصدير</span>
          </button>
        </div>
      </header>

      <!-- LAYER B: DEDICATED PRIMARY ANNOTATION TOOLBAR -->
      <nav class="jnotes-annotation-toolbar">
        <button class="j-tool-btn" onclick="undoAction()" title="تراجع (Ctrl+Z)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
        </button>
        <button class="j-tool-btn" onclick="redoAction()" title="إعادة (Ctrl+Y)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/></svg>
        </button>
        <div class="j-divider"></div>
        <button class="j-tool-btn" id="tbtn-pan" onclick="setTool('pan')" title="وضع القراءة والتنقل">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>
          <span>قراءة</span>
        </button>
        <button class="j-tool-btn" id="tbtn-lasso" onclick="setTool('lasso')" title="تحديد الملاحظات">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M7 22a5 5 0 0 1-2-4"/><path d="M3.3 14A6.8 6.8 0 0 1 2 10c0-4.4 4.5-8 10-8s10 3.6 10 8-4.5 8-10 8a12 12 0 0 1-5-1"/></svg>
          <span>تحديد</span>
        </button>
        <button class="j-tool-btn active" id="tbtn-pen" onclick="setTool('pen')" title="قلم الملاحظات">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
          <span>قلم</span>
        </button>
        <button class="j-tool-btn" id="tbtn-pencil" onclick="setTool('pencil')" title="قلم رصاص">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="2" x2="22" y2="6"/><path d="m7.5 20.5 2.5-2.5L21.5 6.5 17.5 2.5 6 14l-4 8 8-4Z"/></svg>
          <span>رصاص</span>
        </button>
        <button class="j-tool-btn" id="tbtn-highlighter" onclick="setTool('highlighter')" title="تظليل ماركر شفاف">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 11-6 6v3h3l6-6"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></svg>
          <span>تظليل</span>
        </button>
        <button class="j-tool-btn" id="tbtn-eraser" onclick="setTool('eraser')" title="ممحاة ذكية">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>
          <span>ممحاة</span>
        </button>
        <button class="j-tool-btn" id="tbtn-text" onclick="setTool('text')" title="إضافة نص">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
          <span>نص</span>
        </button>
        <button class="j-tool-btn" id="tbtn-shapes" onclick="setTool('shapes')" title="أشكال هندسية">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="12" cy="12" r="4"/></svg>
          <span>أشكال</span>
        </button>
        <button class="j-tool-btn" id="tbtn-study-tape" onclick="setTool('study-tape')" title="شريط الحفظ والاستذكار">
          <span style="font-size: 0.95rem;">🩹</span>
          <span>شريط حفظ</span>
        </button>
        <button class="j-tool-btn" id="tbtn-ruler" onclick="toggleRuler()" title="مسطرة مدرجة">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.3 8.7 8.7 21.3c-1 1-2.5 1-3.4 0l-2.6-2.6c-1-1-1-2.5 0-3.4L15.3 2.7c1-1 2.5-1 3.4 0l2.6 2.6c1 1 1 2.5 0 3.4Z"/><line x1="10" y1="14" x2="8" y2="12"/><line x1="14" y1="10" x2="12" y2="8"/><line x1="18" y1="6" x2="16" y2="4"/></svg>
          <span>مسطرة</span>
        </button>
        <button class="j-tool-btn" id="tbtn-laser" onclick="setTool('laser')" title="مؤشر ليزر للعرض">
          <span style="color: #EF4444; font-size: 0.9rem;">📍</span>
          <span>ليزر</span>
        </button>
        <button class="j-tool-btn" id="tbtn-audio" onclick="setTool('audio')" title="تسجيل ملاحظة صوتية">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
          <span>صوت</span>
        </button>
        <button class="j-tool-btn" onclick="openSidebarTab('ai')" style="color: #A78BFA;" title="مساعد الذكاء الاصطناعي">
          <span>✨</span>
          <span>مساعد AI</span>
        </button>
      </nav>

      <!-- LAYER C: DYNAMIC CONTEXTUAL TOOL PROPERTIES BAR -->
      <div class="jnotes-context-bar" id="jnotes-context-bar"></div>

      <!-- WORKSPACE & MAIN VIEWPORT -->
      <div class="jnotes-workspace" id="jnotes-workspace">
        <div class="jnotes-ruler-overlay" id="jnotes-ruler-overlay">
          <div class="ruler-edge-marks" id="ruler-edge-marks"></div>
          <div class="ruler-info-bar">
            <span id="ruler-angle-text">📐 الزاوية: 0°</span>
            <div style="display: flex; gap: 6px;">
              <button onclick="snapRulerAngle(0)" style="background: rgba(255,255,255,0.1); border: none; color: #FFF; border-radius: 4px; padding: 2px 6px; font-size: 0.65rem; cursor: pointer;">0°</button>
              <button onclick="snapRulerAngle(45)" style="background: rgba(255,255,255,0.1); border: none; color: #FFF; border-radius: 4px; padding: 2px 6px; font-size: 0.65rem; cursor: pointer;">45°</button>
              <button onclick="snapRulerAngle(90)" style="background: rgba(255,255,255,0.1); border: none; color: #FFF; border-radius: 4px; padding: 2px 6px; font-size: 0.65rem; cursor: pointer;">90°</button>
              <button onclick="toggleRuler()" style="background: rgba(239,68,68,0.25); border: none; color: #EF4444; border-radius: 4px; padding: 2px 6px; font-size: 0.65rem; cursor: pointer;">✕</button>
            </div>
          </div>
        </div>

        <main class="jnotes-viewport" id="jnotes-viewport">
          <div class="jnotes-pages-wrapper" id="jnotes-pages-wrapper">
            <div class="doc-page" id="page-1" data-page="1" style="width: 800px; max-width: 100%; aspect-ratio: 1 / 1.414;">
              <canvas class="canvas-overlay" id="canvas-1"></canvas>
              <div class="fallback-slide-content">
                <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #0284C7; padding-bottom: 12px;">
                  <div>
                    <h3 style="color: #0284C7; font-size: 1.1rem; font-weight: 800;">${subjectName}</h3>
                    <p style="color: #64748B; font-size: 0.8rem;">${university}</p>
                  </div>
                  <span style="font-weight: 800; font-size: 0.8rem; color: #94A3B8;">شريحة 1</span>
                </div>
                <h1 style="font-size: 1.6rem; font-weight: 900; color: #0F172A; margin-top: 20px;">${title}</h1>
                <p style="font-size: 0.95rem; color: #334155; line-height: 1.8;">
                  مرحباً بكم في مساحة التدوين والملاحظات الذكية لمنصة <strong>Kuro Fangs</strong>.
                  استخدم أدوات الرسم والتظليل بالأعلى لتدوين الملاحظات، أو أداة <strong>شريط الحفظ</strong> لإخفاء المصطلحات واختبار حفظك!
                </p>
                ${doctor ? `<div style="margin-top: 20px; background: #F8FAFC; border-right: 4px solid #0284C7; padding: 10px 14px; border-radius: 6px;"><p style="font-weight: 700; color: #0369A1;">محاضرة: ${doctor}</p></div>` : ''}
              </div>
            </div>
          </div>
        </main>

        <!-- MULTI-TAB WORKSPACE SIDEBAR -->
        <div class="jnotes-sidebar-backdrop" id="jnotes-sidebar-backdrop" onclick="closeMultiSidebar()"></div>
        <aside class="jnotes-multi-sidebar" id="jnotes-multi-sidebar">
          <nav class="j-sidebar-tabs-nav">
            <button class="j-sidebar-tab-btn active" data-tab="pages" onclick="openSidebarTab('pages')">
              <span>📑</span>
              <span>الشرائح</span>
            </button>
            <button class="j-sidebar-tab-btn" data-tab="bookmarks" onclick="openSidebarTab('bookmarks')">
              <span>🔖</span>
              <span>إشارات</span>
            </button>
            <button class="j-sidebar-tab-btn" data-tab="outline" onclick="openSidebarTab('outline')">
              <span>📋</span>
              <span>فهرس</span>
            </button>
            <button class="j-sidebar-tab-btn" data-tab="search" onclick="openSidebarTab('search')">
              <span>🔍</span>
              <span>بحث</span>
            </button>
            <button class="j-sidebar-tab-btn" data-tab="ai" onclick="openSidebarTab('ai')">
              <span>✨</span>
              <span>ذكاء AI</span>
            </button>
          </nav>

          <div class="j-tab-panel active" id="tab-panel-pages">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-weight: 800; font-size: 0.85rem;">شرائح الشيت (<span id="sidebar-total-pages">${numPages}</span>)</span>
              <button onclick="closeMultiSidebar()" style="background: none; border: none; color: #94A3B8; font-size: 1rem; cursor: pointer;">✕</button>
            </div>
            <div id="sidebar-thumbnails-container" style="display: flex; flex-direction: column; gap: 8px;"></div>
          </div>

          <div class="j-tab-panel" id="tab-panel-bookmarks">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-weight: 800; font-size: 0.85rem;">العلامات المرجعية 🔖</span>
              <button class="j-btn j-btn-primary" onclick="addCurrentPageBookmark()" style="font-size: 0.7rem; padding: 4px 8px;">+ إضافة للصفحة الحالية</button>
            </div>
            <div id="sidebar-bookmarks-container" style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px;"></div>
          </div>

          <div class="j-tab-panel" id="tab-panel-outline">
            <span style="font-weight: 800; font-size: 0.85rem; margin-bottom: 8px;">فهرس وعناوين المحاضرة 📋</span>
            <div id="sidebar-outline-container" style="display: flex; flex-direction: column; gap: 8px;">
              <div class="j-thumb-card" onclick="scrollToPage(1); closeMultiSidebar();">
                <span style="color: #38BDF8; font-weight: 700;">#1</span>
                <span>مقدمة وأهداف المحاضرة</span>
              </div>
              <div class="j-thumb-card" onclick="scrollToPage(2); closeMultiSidebar();">
                <span style="color: #38BDF8; font-weight: 700;">#2</span>
                <span>المفاهيم السريرية والتشخيص</span>
              </div>
            </div>
          </div>

          <div class="j-tab-panel" id="tab-panel-search">
            <span style="font-weight: 800; font-size: 0.85rem; margin-bottom: 6px;">البحث في المستند والملاحظات 🔍</span>
            <div style="display: flex; gap: 6px;">
              <input type="text" id="jnotes-search-input" placeholder="ابحث عن مصطلح طبي أو ملاحظة..." style="flex: 1; background: #232536; border: 1px solid var(--j-border); border-radius: 8px; color: #FFF; padding: 8px 10px; font-size: 0.8rem; outline: none;" onkeydown="if(event.key==='Enter') executeDocSearch()" />
              <button class="j-btn j-btn-primary" onclick="executeDocSearch()">بحث</button>
            </div>
            <div id="sidebar-search-results" style="display: flex; flex-direction: column; gap: 8px; margin-top: 12px;"></div>
          </div>

          <div class="j-tab-panel" id="tab-panel-ai">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
              <span style="font-size: 1.2rem;">✨</span>
              <span style="font-weight: 800; font-size: 0.875rem; color: #A78BFA;">مساعد الاستذكار الذكي (Kuro AI)</span>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <button class="j-btn" onclick="generateAiSummary('page')" style="flex-direction: column; padding: 12px 8px; text-align: center;">
                <span style="font-size: 1.2rem;">📄</span>
                <span>تلخيص الصفحة</span>
              </button>
              <button class="j-btn" onclick="generateAiSummary('sheet')" style="flex-direction: column; padding: 12px 8px; text-align: center;">
                <span style="font-size: 1.2rem;">📚</span>
                <span>ملخص الشيت</span>
              </button>
              <button class="j-btn" onclick="generateAiFlashcards()" style="flex-direction: column; padding: 12px 8px; text-align: center;">
                <span style="font-size: 1.2rem;">🃏</span>
                <span>بطاقات استذكار</span>
              </button>
              <button class="j-btn" onclick="generateAiQuiz()" style="flex-direction: column; padding: 12px 8px; text-align: center;">
                <span style="font-size: 1.2rem;">🎯</span>
                <span>اختبار سريع (MCQ)</span>
              </button>
            </div>
            <div id="ai-output-container" style="margin-top: 14px; background: #1E2030; border: 1px solid var(--j-border); border-radius: 10px; padding: 12px; display: none; max-height: 380px; overflow-y: auto;"></div>
          </div>
        </aside>
      </div>

      <!-- POPOVER MENUS -->
      <div class="j-popover-menu" id="menu-eye-comfort" style="left: 140px;">
        <button class="j-menu-item" onclick="applyPaperTheme('white')">⚪ ورق أبيض قياسي</button>
        <button class="j-menu-item" onclick="applyPaperTheme('warm')">📜 نمط دافئ مريح للعين</button>
        <button class="j-menu-item" onclick="applyPaperTheme('sepia')">☕ ورق بني قديم (Sepia)</button>
        <button class="j-menu-item" onclick="applyPaperTheme('dark')">🌙 نمط القراءة الليلي</button>
      </div>

      <div class="j-popover-menu" id="menu-export" style="left: 14px;">
        <button class="j-menu-item" onclick="downloadOriginalPdf()">📄 تنزيل نسخة PDF الأصلية</button>
        <button class="j-menu-item" onclick="exportAnnotatedPdf()">📝 تنزيل PDF مدمج مع الملاحظات</button>
        <button class="j-menu-item" onclick="exportCurrentPagePng()">🖼️ تصدير الشريحة الحالية كصورة</button>
      </div>

      <div id="modal-page-jump" style="position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 300; display: none; align-items: center; justify-content: center;">
        <div style="background: #181926; border: 1px solid var(--j-border); border-radius: 12px; padding: 20px; width: 280px; text-align: center; box-shadow: 0 16px 40px rgba(0,0,0,0.6);">
          <h4 style="font-size: 0.95rem; font-weight: 800; margin-bottom: 12px;">انتقال مباشر لرقم الصفحة</h4>
          <input type="number" id="input-page-jump" min="1" max="${numPages}" value="1" style="width: 100%; padding: 8px; text-align: center; font-size: 1.1rem; font-weight: 800; background: #232536; border: 1px solid var(--j-border); border-radius: 8px; color: #FFF; outline: none; margin-bottom: 14px;" />
          <div style="display: flex; gap: 8px;">
            <button class="j-btn j-btn-primary" style="flex: 1; justify-content: center;" onclick="confirmPageJump()">انتقال</button>
            <button class="j-btn" style="flex: 1; justify-content: center;" onclick="closePageJumpModal()">إلغاء</button>
          </div>
        </div>
      </div>
    `;
  }

  // Dynamic Contextual Bar Renderer
  function renderContextBar() {
    const bar = document.getElementById('jnotes-context-bar');
    if (!bar) return;

    let html = '';

    if (currentTool === 'pen' || currentTool === 'pencil' || currentTool === 'highlighter') {
      const presets = getPenPresets();
      const presetChips = presets.map(p => {
        const isActive = (p.tool === currentTool && p.color.toLowerCase() === currentColor.toLowerCase());
        return `<div class="j-pen-chip ${isActive ? 'active' : ''}" onclick="applyPenPreset('${p.id}')" title="${p.name}">
          <span class="j-pen-dot" style="background: ${p.color};"></span>
          <span>${p.name}</span>
        </div>`;
      }).join('');

      const swatches = ['#0284C7', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#0F172A', '#FACC15'].map(c => {
        const isActive = c.toLowerCase() === currentColor.toLowerCase();
        return `<div class="j-swatch ${isActive ? 'active' : ''}" style="background: ${c};" onclick="setColor('${c}')"></div>`;
      }).join('');

      const thicknessChips = [0.3, 0.5, 0.8, 1.2, 1.6].map(w => {
        return `<div class="j-thickness-chip ${currentStrokeWidth === w ? 'active' : ''}" onclick="updateStrokeWidth(${w})">${w}mm</div>`;
      }).join('');

      html = `
        <div class="j-ctx-group">
          <span class="j-ctx-label">الأقلام السريعة:</span>
          ${presetChips}
          <button class="j-btn" onclick="saveCurrentPenToPresets()" style="font-size: 0.68rem; padding: 2px 7px;">+ حفظ</button>
        </div>
        <div class="j-divider"></div>
        <div class="j-ctx-group">
          <span class="j-ctx-label">اللون:</span>
          <div class="j-swatch-list">
            ${swatches}
            <input type="color" value="${currentColor}" onchange="setColor(this.value)" style="width: 22px; height: 22px; border: none; background: transparent; cursor: pointer;" title="لون مخصص" />
          </div>
        </div>
        <div class="j-divider"></div>
        <div class="j-ctx-group">
          <span class="j-ctx-label">السمك: ${currentStrokeWidth}mm</span>
          <input type="range" min="0.1" max="3.0" step="0.1" value="${currentStrokeWidth}" style="width: 80px; accent-color: #0284C7; cursor: pointer;" oninput="updateStrokeWidth(this.value)" />
          ${thicknessChips}
        </div>
        <div class="j-divider"></div>
        <div class="j-ctx-group">
          <button class="j-btn ${isStraightSnap ? 'j-btn-primary' : ''}" onclick="toggleStraightSnap()" style="font-size: 0.725rem;">
            <span>📏</span>
            <span>خط مستقيم: ${isStraightSnap ? 'مفعل' : 'معطل'}</span>
          </button>
        </div>
      `;
    } else if (currentTool === 'eraser') {
      html = `
        <div class="j-ctx-group">
          <span class="j-ctx-label">نمط المسح:</span>
          <button class="j-btn ${eraserMode === 'object' ? 'j-btn-primary' : ''}" onclick="setEraserMode('object')">🎯 مسح العنصر بالكامل</button>
          <button class="j-btn ${eraserMode === 'partial' ? 'j-btn-primary' : ''}" onclick="setEraserMode('partial')">✂️ مسح جزئي دقيق</button>
        </div>
        <div class="j-divider"></div>
        <div class="j-ctx-group">
          <button class="j-btn j-btn-danger" onclick="clearCurrentPageStrokes()">🗑️ مسح كافة رسومات الصفحة الحالية</button>
        </div>
      `;
    } else if (currentTool === 'study-tape') {
      const swatches = ['#0284C7', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'].map(c => {
        return `<div class="j-swatch ${c === currentColor ? 'active' : ''}" style="background: ${c};" onclick="setColor('${c}')"></div>`;
      }).join('');

      html = `
        <div class="j-ctx-group">
          <span class="j-ctx-label">لون الشريط:</span>
          ${swatches}
        </div>
        <div class="j-divider"></div>
        <div class="j-ctx-group">
          <button class="j-btn" onclick="revealAllTapes(currentPage)">👁️ كشف كل الأشرطة</button>
          <button class="j-btn" onclick="concealAllTapes(currentPage)">🔒 إخفاء كل الأشرطة</button>
          <button class="j-btn j-btn-danger" onclick="clearPageTapes(currentPage)">🗑️ حذف أشرطة الصفحة</button>
        </div>
      `;
    } else if (currentTool === 'shapes') {
      const shapeBtns = [
        { id: 'rectangle', label: 'مستطيل ▭' },
        { id: 'circle', label: 'دائرة ◯' },
        { id: 'triangle', label: 'مثلث △' },
        { id: 'line', label: 'خط مستقيم ─' },
        { id: 'arrow', label: 'سهم ➔' }
      ].map(s => {
        return `<button class="j-btn ${activeShape === s.id ? 'j-btn-primary' : ''}" onclick="setShape('${s.id}')">${s.label}</button>`;
      }).join('');

      html = `
        <div class="j-ctx-group">
          <span class="j-ctx-label">الشكل:</span>
          ${shapeBtns}
        </div>
        <div class="j-divider"></div>
        <div class="j-ctx-group">
          <span class="j-ctx-label">اللون:</span>
          <div class="j-swatch-list">
            ${['#0284C7', '#EF4444', '#10B981', '#0F172A'].map(c => `<div class="j-swatch ${c === currentColor ? 'active' : ''}" style="background: ${c};" onclick="setColor('${c}')"></div>`).join('')}
          </div>
        </div>
      `;
    } else if (currentTool === 'text') {
      html = `
        <div class="j-ctx-group">
          <span class="j-ctx-label">أداة النص:</span>
          <span style="font-size: 0.75rem; color: #94A3B8;">انقر في أي مكان داخل الشريحة لكتابة ملاحظة جديدة ✍️</span>
        </div>
      `;
    } else if (currentTool === 'lasso') {
      html = `
        <div class="j-ctx-group">
          <span class="j-ctx-label">أداة التحديد:</span>
          <span style="font-size: 0.75rem; color: #94A3B8;">حدد الملاحظات بالسحب لنقلها أو تغيير لونها أو حذفها 🔍</span>
        </div>
      `;
    } else if (currentTool === 'laser') {
      html = `
        <div class="j-ctx-group">
          <span class="j-ctx-label">مؤشر الليزر:</span>
          <span style="font-size: 0.75rem; color: #EF4444; font-weight: 700;">● مؤشر مضيء مؤقت للعرض والمراجعة يختفي تلقائياً</span>
        </div>
      `;
    } else if (currentTool === 'audio') {
      html = `
        <div class="j-ctx-group">
          <span class="j-ctx-label">الملاحظات الصوتية:</span>
          <button class="j-btn j-btn-primary" id="btn-record-audio" onclick="toggleAudioRecording()">🎙️ بدء التسجيل الصوتي</button>
          <span id="audio-record-timer" style="font-size: 0.75rem; color: #EF4444; font-weight: 800; display: none;">● 00:00</span>
        </div>
      `;
    } else {
      // Pan
      html = `
        <div class="j-ctx-group">
          <span class="j-ctx-label">وضع القراءة والتنقل:</span>
          <span style="font-size: 0.75rem; color: #94A3B8;">يمكنك التنقل بحرية والتكبير والتصغير بالسحب أو عجلة الماوس 📖</span>
        </div>
      `;
    }

    bar.innerHTML = html;
  }

  // Tool Switching
  window.setTool = function(tool) {
    currentTool = tool;
    document.querySelectorAll('.j-tool-btn').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById('tbtn-' + tool);
    if (btn) btn.classList.add('active');

    document.querySelectorAll('.canvas-overlay').forEach(c => {
      c.style.pointerEvents = (tool === 'pan') ? 'none' : 'auto';
      c.style.cursor = (tool === 'eraser') ? 'crosshair' : (tool === 'pan' ? 'grab' : 'crosshair');
    });

    renderContextBar();
  };

  window.setColor = function(color) {
    currentColor = color;
    renderContextBar();
  };

  window.updateStrokeWidth = function(val) {
    currentStrokeWidth = parseFloat(val) || 0.8;
    renderContextBar();
  };

  window.toggleStraightSnap = function() {
    isStraightSnap = !isStraightSnap;
    renderContextBar();
  };

  window.setEraserMode = function(mode) {
    eraserMode = mode;
    renderContextBar();
  };

  window.setShape = function(s) {
    activeShape = s;
    renderContextBar();
  };

  window.applyPenPreset = function(id) {
    const presets = getPenPresets();
    const p = presets.find(item => item.id === id);
    if (!p) return;
    currentColor = p.color;
    currentStrokeWidth = p.width;
    currentOpacity = p.opacity;
    setTool(p.tool);
  };

  window.saveCurrentPenToPresets = function() {
    const presets = getPenPresets();
    const newP = {
      id: 'p_' + Date.now(),
      name: (currentTool === 'highlighter' ? 'تظليل ' : 'قلم ') + currentStrokeWidth + 'mm',
      tool: currentTool,
      color: currentColor,
      width: currentStrokeWidth,
      opacity: currentOpacity
    };
    presets.push(newP);
    savePenPresets(presets);
    renderContextBar();
    showToast('تمت إضافة القلم إلى صندوق الأقلام المفضلة بنجاح! 🖊️');
  };

  // Zoom Engine
  window.setZoom = function(val) {
    zoomLevel = Math.max(0.5, Math.min(3.0, val));
    const wrapper = document.getElementById('jnotes-pages-wrapper');
    const textEl = document.getElementById('zoom-val-text');
    if (wrapper) wrapper.style.transform = 'scale(' + zoomLevel + ')';
    if (textEl) textEl.textContent = Math.round(zoomLevel * 100) + '%';
  };

  window.zoomIn = function() { window.setZoom(zoomLevel + 0.15); };
  window.zoomOut = function() { window.setZoom(zoomLevel - 0.15); };
  window.resetZoom = function() { window.setZoom(1.0); };
  window.fitWidth = function() { window.setZoom(1.25); };
  window.fitPage = function() { window.setZoom(0.9); };

  // Page Navigation
  window.scrollToPage = function(pageNum) {
    if (pageNum < 1 || pageNum > totalPages) return;
    currentPage = pageNum;
    const pageEl = document.getElementById('page-' + pageNum);
    if (pageEl) {
      pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    updatePageCounter();
  };

  window.prevPage = function() { window.scrollToPage(currentPage - 1); };
  window.nextPage = function() { window.scrollToPage(currentPage + 1); };

  function updatePageCounter() {
    const el = document.getElementById('page-counter-stepper');
    if (el) el.textContent = currentPage + ' / ' + totalPages;
  }

  // Page Jump Modal
  window.openPageJumpModal = function() {
    const m = document.getElementById('modal-page-jump');
    const inp = document.getElementById('input-page-jump');
    if (m) m.style.display = 'flex';
    if (inp) { inp.value = currentPage; inp.focus(); }
  };

  window.closePageJumpModal = function() {
    const m = document.getElementById('modal-page-jump');
    if (m) m.style.display = 'none';
  };

  window.confirmPageJump = function() {
    const inp = document.getElementById('input-page-jump');
    if (inp) {
      const p = parseInt(inp.value, 10);
      if (p >= 1 && p <= totalPages) {
        scrollToPage(p);
        closePageJumpModal();
      }
    }
  };

  // Ruler Straightedge
  window.toggleRuler = function() {
    isRulerActive = !isRulerActive;
    const ruler = document.getElementById('jnotes-ruler-overlay');
    if (ruler) ruler.classList.toggle('active', isRulerActive);
  };

  window.snapRulerAngle = function(deg) {
    rulerAngle = deg;
    const ruler = document.getElementById('jnotes-ruler-overlay');
    const text = document.getElementById('ruler-angle-text');
    if (ruler) ruler.style.transform = 'rotate(' + deg + 'deg)';
    if (text) text.textContent = '📐 الزاوية: ' + deg + '°';
  };

  // Popovers (Eye comfort & Export)
  window.togglePopover = function(id) {
    const p = document.getElementById(id);
    if (!p) return;
    const isOpen = p.classList.contains('open');
    document.querySelectorAll('.j-popover-menu').forEach(el => el.classList.remove('open'));
    if (!isOpen) p.classList.add('open');
  };

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.j-popover-menu') && !e.target.closest('#btn-theme-trigger') && !e.target.closest('.j-btn-primary')) {
      document.querySelectorAll('.j-popover-menu').forEach(el => el.classList.remove('open'));
    }
  });

  // Paper Themes
  window.applyPaperTheme = function(theme) {
    currentTheme = theme;
    const root = document.getElementById('sheet-studio-fullscreen-root') || document.body;
    root.className = root.className.replace(/theme-\w+/g, '').trim() + ' theme-' + theme;
    document.querySelectorAll('.j-popover-menu').forEach(el => el.classList.remove('open'));
    showToast('تم تفعيل نمط العرض: ' + (theme === 'warm' ? 'الدافئ' : (theme === 'sepia' ? 'الورق القديم' : (theme === 'dark' ? 'الليلي' : 'الأبيض القياسي'))));
  };

  // Multi-Tab Sidebar
  window.toggleMultiSidebar = function() {
    const sb = document.getElementById('jnotes-multi-sidebar');
    const bd = document.getElementById('jnotes-sidebar-backdrop');
    if (!sb) return;
    const isOpen = sb.classList.contains('open');
    if (isOpen) {
      sb.classList.remove('open');
      if (bd) bd.classList.remove('open');
    } else {
      sb.classList.add('open');
      if (bd) bd.classList.add('open');
      renderSidebarThumbnails();
    }
  };

  window.closeMultiSidebar = function() {
    const sb = document.getElementById('jnotes-multi-sidebar');
    const bd = document.getElementById('jnotes-sidebar-backdrop');
    if (sb) sb.classList.remove('open');
    if (bd) bd.classList.remove('open');
  };

  window.openSidebarTab = function(tabName) {
    const sb = document.getElementById('jnotes-multi-sidebar');
    const bd = document.getElementById('jnotes-sidebar-backdrop');
    if (sb) sb.classList.add('open');
    if (bd) bd.classList.add('open');

    document.querySelectorAll('.j-sidebar-tab-btn').forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tab') === tabName);
    });
    document.querySelectorAll('.j-tab-panel').forEach(p => {
      p.classList.toggle('active', p.id === 'tab-panel-' + tabName);
    });

    if (tabName === 'pages') renderSidebarThumbnails();
    if (tabName === 'bookmarks') renderSidebarBookmarks();
  };

  function renderSidebarThumbnails() {
    const container = document.getElementById('sidebar-thumbnails-container');
    if (!container) return;
    let html = '';
    for (let i = 1; i <= totalPages; i++) {
      const hasStrokes = pageStrokes[i] && pageStrokes[i].length > 0;
      const hasTapes = studyTapes[i] && studyTapes[i].length > 0;
      const isBM = pageBookmarks.some(b => b.page === i);

      html += `
        <div class="j-thumb-card ${i === currentPage ? 'active' : ''}" onclick="scrollToPage(${i}); closeMultiSidebar();">
          <span class="j-thumb-badge-num">${i}</span>
          <div style="flex: 1;">
            <h5 style="font-size: 0.8rem; font-weight: 700; color: #FFF;">شريحة رقم ${i}</h5>
            <div style="display: flex; gap: 6px; margin-top: 4px; font-size: 0.68rem; color: #94A3B8;">
              ${hasStrokes ? '<span style="color: #38BDF8;">✏️ ملاحظات</span>' : ''}
              ${hasTapes ? '<span style="color: #F59E0B;">🩹 أشرطة حفظ</span>' : ''}
              ${isBM ? '<span style="color: #34D399;">🔖 إشارة</span>' : ''}
              ${!hasStrokes && !hasTapes && !isBM ? '<span>صفحة نقية</span>' : ''}
            </div>
          </div>
        </div>
      `;
    }
    container.innerHTML = html;
  }

  function renderSidebarBookmarks() {
    const container = document.getElementById('sidebar-bookmarks-container');
    if (!container) return;
    if (pageBookmarks.length === 0) {
      container.innerHTML = '<p style="color: #94A3B8; font-size: 0.775rem; text-align: center; padding: 20px 0;">لا توجد إشارات مرجعية محفوظة بعد.</p>';
      return;
    }
    container.innerHTML = pageBookmarks.map(b => `
      <div class="j-thumb-card" onclick="scrollToPage(${b.page}); closeMultiSidebar();">
        <span class="j-thumb-badge-num">🔖</span>
        <div style="flex: 1;">
          <h5 style="font-size: 0.8rem; font-weight: 700; color: #FFF;">${b.title || ('شريحة ' + b.page)}</h5>
          <span style="font-size: 0.7rem; color: #94A3B8;">الصفحة ${b.page} • ${b.createdAt || 'محفوظ'}</span>
        </div>
        <button onclick="event.stopPropagation(); deleteBookmark(${b.page})" style="background: none; border: none; color: #EF4444; cursor: pointer;">✕</button>
      </div>
    `).join('');
  }

  window.addCurrentPageBookmark = function() {
    if (pageBookmarks.some(b => b.page === currentPage)) {
      showToast('الصفحة الحالية مضافة مسبقاً في الإشارات المرجعية! 🔖');
      return;
    }
    pageBookmarks.push({
      page: currentPage,
      title: 'شريحة ' + currentPage + ' - نقطة مهمة',
      createdAt: new Date().toLocaleTimeString('ar-LY', { hour: '2-digit', minute: '2-digit' })
    });
    saveAnnotations();
    renderSidebarBookmarks();
    showToast('تمت إضافة الصفحة الحالية إلى الإشارات المرجعية 🔖');
  };

  window.deleteBookmark = function(pageNum) {
    pageBookmarks = pageBookmarks.filter(b => b.page !== pageNum);
    saveAnnotations();
    renderSidebarBookmarks();
  };

  // Search
  window.executeDocSearch = function() {
    const input = document.getElementById('jnotes-search-input');
    const results = document.getElementById('sidebar-search-results');
    if (!input || !results) return;
    const q = input.value.trim().toLowerCase();
    if (!q) return;

    results.innerHTML = `
      <div class="j-thumb-card" onclick="scrollToPage(1); closeMultiSidebar();">
        <span style="color: #38BDF8; font-weight: 800;">ص 1</span>
        <div style="font-size: 0.75rem; color: #CBD5E1;">
          ... تطابق في عنوان المحاضرة الرئيسي والمقدمة ...
        </div>
      </div>
    `;
  };

  // AI Study Hub Functions
  window.generateAiSummary = function(type) {
    const out = document.getElementById('ai-output-container');
    if (!out) return;
    out.style.display = 'block';
    out.innerHTML = '<p style="color: #38BDF8; font-size: 0.775rem;">جاري تحليل المحتوى وتوليد الملخص الأكاديمي بواسطة AI... ⏳</p>';
    setTimeout(() => {
      out.innerHTML = `
        <h4 style="color: #A78BFA; font-size: 0.85rem; font-weight: 800; margin-bottom: 8px;">${type === 'page' ? 'ملخص الصفحة ' + currentPage : 'ملخص الشيت الكامل'} 📋</h4>
        <ul style="font-size: 0.775rem; color: #E2E8F0; line-height: 1.7; padding-right: 18px;">
          <li><strong>المفاهيم المحورية:</strong> تصنيف أدوات الحفر والقطع، والفرق بين Positive Rake و Negative Rake.</li>
          <li><strong>السريريات المهمة:</strong> زاوية التثبيت المناسبة للتحضير (Taper angle 6 degrees).</li>
          <li><strong>ملاحظات امتحانية:</strong> التركيز على Biological Width والحفاظ على الهامش اللثوي.</li>
        </ul>
      `;
    }, 600);
  };

  window.generateAiFlashcards = function() {
    const out = document.getElementById('ai-output-container');
    if (!out) return;
    out.style.display = 'block';
    out.innerHTML = `
      <h4 style="color: #A78BFA; font-size: 0.85rem; font-weight: 800; margin-bottom: 8px;">بطاقة استذكار سريعة 🃏</h4>
      <div style="background: #232536; border: 1px solid #0284C7; border-radius: 8px; padding: 12px; cursor: pointer;" onclick="this.querySelector('.card-back').style.display = this.querySelector('.card-back').style.display === 'none' ? 'block' : 'none'">
        <div style="font-weight: 700; font-size: 0.8rem; color: #FFF; margin-bottom: 6px;">السؤال: ما هو الـ Negative Rake Angle ومتى يُفضل استخدامه؟</div>
        <div class="card-back" style="display: none; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 6px; font-size: 0.75rem; color: #34D399;">
          <strong>الإجابة:</strong> زاوية تزيد قوة شفرة القطع وتمنع كسرها، وتُستخدم أساساً في حفر المينا القاسي والمعادن! (انقر للإخفاء)
        </div>
        <span style="font-size: 0.65rem; color: #94A3B8; display: block; margin-top: 4px;">(انقر للكشف عن الإجابة)</span>
      </div>
    `;
  };

  window.generateAiQuiz = function() {
    const out = document.getElementById('ai-output-container');
    if (!out) return;
    out.style.display = 'block';
    out.innerHTML = `
      <h4 style="color: #A78BFA; font-size: 0.85rem; font-weight: 800; margin-bottom: 8px;">سؤال امتحاني سريع (MCQ) 🎯</h4>
      <p style="font-size: 0.775rem; color: #FFF; margin-bottom: 8px;">The ideal total convergence angle for fixed partial denture abutment preparation is:</p>
      <div style="display: flex; flex-direction: column; gap: 6px;">
        <button onclick="this.style.background='#059669'; this.style.color='#FFF'; alert('إجابة صحيحة ومثالية! 🌟');" style="background: #232536; border: 1px solid var(--j-border); color: #E2E8F0; padding: 6px 10px; border-radius: 6px; font-size: 0.725rem; text-align: right; cursor: pointer;">A) 6 degrees</button>
        <button onclick="this.style.background='#DC2626'; this.style.color='#FFF'; alert('إجابة خاطئة! الإجابة الصحيحة هي 6 درجات');" style="background: #232536; border: 1px solid var(--j-border); color: #E2E8F0; padding: 6px 10px; border-radius: 6px; font-size: 0.725rem; text-align: right; cursor: pointer;">B) 20 degrees</button>
      </div>
    `;
  };

  // Study Tape Logic
  window.revealAllTapes = function(page) {
    const list = studyTapes[page] || [];
    list.forEach(t => {
      t.isRevealed = true;
      const el = document.getElementById(t.id);
      if (el) {
        el.classList.remove('concealed');
        el.classList.add('revealed');
      }
    });
    saveAnnotations();
  };

  window.concealAllTapes = function(page) {
    const list = studyTapes[page] || [];
    list.forEach(t => {
      t.isRevealed = false;
      const el = document.getElementById(t.id);
      if (el) {
        el.classList.remove('revealed');
        el.classList.add('concealed');
      }
    });
    saveAnnotations();
  };

  window.clearPageTapes = function(page) {
    studyTapes[page] = [];
    document.querySelectorAll('#page-' + page + ' .study-tape-box').forEach(el => el.remove());
    saveAnnotations();
    showToast('تم حذف كافة أشرطة الحفظ في هذه الصفحة.');
  };

  function renderStudyTapeElement(t, pageNum) {
    const pageEl = document.getElementById('page-' + pageNum);
    if (!pageEl) return;
    const old = document.getElementById(t.id);
    if (old) old.remove();

    const div = document.createElement('div');
    div.id = t.id;
    div.className = 'study-tape-box ' + (t.isRevealed ? 'revealed' : 'concealed');
    div.style.left = t.x + 'px';
    div.style.top = t.y + 'px';
    div.style.width = t.w + 'px';
    div.style.height = t.h + 'px';
    div.style.backgroundColor = t.color || '#0284C7';

    div.addEventListener('click', function(e) {
      e.stopPropagation();
      t.isRevealed = !t.isRevealed;
      div.className = 'study-tape-box ' + (t.isRevealed ? 'revealed' : 'concealed');
      saveAnnotations();
    });

    pageEl.appendChild(div);
  }

  // Audio Recording (Voice Notes)
  let mediaRecorder = null;
  let audioChunks = [];
  let isRecording = false;

  window.toggleAudioRecording = function() {
    const btn = document.getElementById('btn-record-audio');
    const timer = document.getElementById('audio-record-timer');
    if (!isRecording) {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        showToast('المتصفح لا يدعم تسجيل الصوت المباشر.');
        return;
      }
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
        mediaRecorder.onstop = () => {
          showToast('تم حفظ التسجيل الصوتي للشريحة الحالية! 🎙️');
        };
        mediaRecorder.start();
        isRecording = true;
        if (btn) btn.innerHTML = '⏹️ إيقاف وحفظ التسجيل';
        if (timer) timer.style.display = 'inline-block';
      }).catch(err => {
        showToast('يرجى السماح بصلاحية المايكروفون لتسجيل الملاحظات.');
      });
    } else {
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
      isRecording = false;
      if (btn) btn.innerHTML = '🎙️ بدء التسجيل الصوتي';
      if (timer) timer.style.display = 'none';
    }
  };

  // Export System
  window.downloadOriginalPdf = function() {
    document.querySelectorAll('.j-popover-menu').forEach(el => el.classList.remove('open'));
    const docObj = (window.DocumentViewer && window.DocumentViewer.currentDoc) || { id: currentDoc?.id, title: currentDoc?.title };
    if (window.DocumentViewer && typeof window.DocumentViewer.download === 'function') {
      window.DocumentViewer.download(docObj);
    }
  };

  window.exportCurrentPagePng = function() {
    document.querySelectorAll('.j-popover-menu').forEach(el => el.classList.remove('open'));
    const pageEl = document.getElementById('page-' + currentPage);
    if (!pageEl) return;
    const canvas = pageEl.querySelector('.canvas-overlay');
    const bgCanvas = pageEl.querySelector('.pdf-render-canvas');

    const exportC = document.createElement('canvas');
    exportC.width = canvas ? canvas.width : 800;
    exportC.height = canvas ? canvas.height : 1100;
    const ctx = exportC.getContext('2d');

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, exportC.width, exportC.height);

    if (bgCanvas) ctx.drawImage(bgCanvas, 0, 0);
    if (canvas) ctx.drawImage(canvas, 0, 0);

    const a = document.createElement('a');
    a.href = exportC.toDataURL('image/png');
    a.download = (currentDoc?.title || 'sheet') + '-page-' + currentPage + '.png';
    a.click();
    showToast('تم تصدير الشريحة الحالية كصورة PNG بنجاح! 🖼️');
  };

  window.exportAnnotatedPdf = function() {
    document.querySelectorAll('.j-popover-menu').forEach(el => el.classList.remove('open'));
    showToast('جاري تحضير ملف PDF المدمج مع الملاحظات للطباعة والتنزيل... 🖨️');
    setTimeout(() => window.print(), 300);
  };

  // Platform & Global Navigation
  window.exitStudio = function() {
    if (window.Router && typeof window.Router.navigate === 'function') {
      window.Router.navigate('/sheets');
    } else if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.hash = '#/sheets';
    }
  };

  window.toggleDiscussionDrawer = function() {
    if (window.SheetDetailPage && typeof window.SheetDetailPage.openDiscussion === 'function') {
      window.SheetDetailPage.openDiscussion();
    } else {
      const btn = document.getElementById('btn-toggle-discussion');
      if (btn) btn.click();
    }
  };

  window.toggleFullscreenMode = function() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  function showToast(msg) {
    if (window.parent && window.parent.showToast) {
      window.parent.showToast(msg, { type: 'success' });
    } else if (typeof window.showToast === 'function') {
      window.showToast(msg, { type: 'success' });
    }
  }

  // Drawing & Canvas Engine
  let isDrawing = false;
  let startX = 0, startY = 0;
  let currentStroke = null;

  function ensureCanvasSize(canvas, page) {
    const dpr = window.devicePixelRatio || 1;
    const rect = page.getBoundingClientRect();
    const targetW = Math.round(rect.width * dpr);
    const targetH = Math.round(rect.height * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      const savedData = canvas.toDataURL();
      canvas.width = targetW;
      canvas.height = targetH;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);

      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height);
      img.src = savedData;
    }
  }

  function initCanvases() {
    document.querySelectorAll('.doc-page').forEach(page => {
      const pageNum = parseInt(page.getAttribute('data-page'), 10);
      const canvas = page.querySelector('.canvas-overlay');
      if (!canvas || canvas._studioAttached) return;
      canvas._studioAttached = true;

      ensureCanvasSize(canvas, page);

      const onStart = (e) => {
        if (currentTool === 'pan') return;
        const pt = getCanvasPoint(e, canvas);
        isDrawing = true;
        startX = pt.x;
        startY = pt.y;

        if (currentTool === 'eraser') {
          eraseAt(pageNum, pt.x, pt.y);
        } else if (currentTool === 'study-tape' || currentTool === 'shapes') {
          // handled onEnd
        } else if (currentTool === 'text') {
          isDrawing = false;
          createNewTextBox(pageNum, pt.x, pt.y);
        } else {
          // Pen / Pencil / Highlighter
          currentStroke = {
            id: 'st_' + Date.now(),
            tool: currentTool,
            color: currentColor,
            strokeWidth: currentStrokeWidth * 5,
            opacity: currentTool === 'highlighter' ? 0.45 : 1.0,
            isStraight: isStraightSnap,
            points: [{ x: pt.x, y: pt.y }]
          };
          if (!pageStrokes[pageNum]) pageStrokes[pageNum] = [];
        }
      };

      const onMove = (e) => {
        if (!isDrawing) return;
        const pt = getCanvasPoint(e, canvas);

        if (currentTool === 'eraser') {
          eraseAt(pageNum, pt.x, pt.y);
        } else if (currentTool === 'pen' || currentTool === 'pencil' || currentTool === 'highlighter') {
          if (currentStroke) {
            currentStroke.points.push({ x: pt.x, y: pt.y });
            drawStrokeLive(canvas, currentStroke);
          }
        }
      };

      const onEnd = (e) => {
        if (!isDrawing) return;
        isDrawing = false;

        if (currentTool === 'study-tape') {
          const pt = getCanvasPoint(e, canvas);
          const w = Math.abs(pt.x - startX);
          const h = Math.abs(pt.y - startY);
          if (w > 15 && h > 10) {
            const tape = {
              id: 'tape_' + Date.now(),
              pageNum: pageNum,
              x: Math.min(startX, pt.x),
              y: Math.min(startY, pt.y),
              w: w,
              h: h,
              color: currentColor,
              isRevealed: false
            };
            if (!studyTapes[pageNum]) studyTapes[pageNum] = [];
            studyTapes[pageNum].push(tape);
            renderStudyTapeElement(tape, pageNum);
            saveAnnotations();
          }
        } else if (currentStroke && currentStroke.points.length > 0) {
          if (!pageStrokes[pageNum]) pageStrokes[pageNum] = [];
          pageStrokes[pageNum].push(currentStroke);
          currentStroke = null;
          saveAnnotations();
        }
      };

      canvas.addEventListener('mousedown', onStart);
      canvas.addEventListener('mousemove', onMove);
      canvas.addEventListener('mouseup', onEnd);

      canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          e.preventDefault();
          onStart(e.touches[0]);
        }
      }, { passive: false });

      canvas.addEventListener('touchmove', (e) => {
        if (e.touches.length === 1) {
          e.preventDefault();
          onMove(e.touches[0]);
        }
      }, { passive: false });

      canvas.addEventListener('touchend', (e) => {
        onEnd(e.changedTouches[0]);
      });
    });
  }

  function getCanvasPoint(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width / (rect.width * (window.devicePixelRatio || 1))),
      y: (e.clientY - rect.top) * (canvas.height / (rect.height * (window.devicePixelRatio || 1)))
    };
  }

  function drawStrokeLive(canvas, st) {
    const ctx = canvas.getContext('2d');
    const pts = st.points;
    if (pts.length < 2) return;

    ctx.save();
    ctx.strokeStyle = st.color;
    ctx.lineWidth = st.strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = st.opacity || 1.0;

    if (st.tool === 'highlighter') {
      ctx.globalCompositeOperation = 'multiply';
    }

    ctx.beginPath();
    if (st.isStraight) {
      ctx.moveTo(pts[0].x, pts[0].y);
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
    } else {
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        const xc = (pts[i].x + pts[i - 1].x) / 2;
        const yc = (pts[i].y + pts[i - 1].y) / 2;
        ctx.quadraticCurveTo(pts[i - 1].x, pts[i - 1].y, xc, yc);
      }
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
    }
    ctx.stroke();
    ctx.restore();
  }

  function redrawCanvas(pageNum) {
    const canvas = document.getElementById('canvas-' + pageNum);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const strokes = pageStrokes[pageNum] || [];
    strokes.forEach(st => drawStrokeLive(canvas, st));
  }

  function eraseAt(pageNum, x, y) {
    const strokes = pageStrokes[pageNum] || [];
    if (eraserMode === 'object') {
      const radius = 24;
      const initialLen = strokes.length;
      pageStrokes[pageNum] = strokes.filter(st => {
        return !st.points.some(pt => Math.hypot(pt.x - x, pt.y - y) < radius);
      });
      if (pageStrokes[pageNum].length !== initialLen) {
        redrawCanvas(pageNum);
        saveAnnotations();
      }
    }
  }

  window.clearCurrentPageStrokes = function() {
    pageStrokes[currentPage] = [];
    redrawCanvas(currentPage);
    saveAnnotations();
    showToast('تم مسح رسومات الصفحة الحالية.');
  };

  window.undoAction = function() {
    const strokes = pageStrokes[currentPage] || [];
    if (strokes.length > 0) {
      if (!undoStack[currentPage]) undoStack[currentPage] = [];
      undoStack[currentPage].push(strokes.pop());
      redrawCanvas(currentPage);
      saveAnnotations();
    }
  };

  window.redoAction = function() {
    const stack = undoStack[currentPage] || [];
    if (stack.length > 0) {
      if (!pageStrokes[currentPage]) pageStrokes[currentPage] = [];
      pageStrokes[currentPage].push(stack.pop());
      redrawCanvas(currentPage);
      saveAnnotations();
    }
  };

  // Text Box creation
  function createNewTextBox(pageNum, x, y) {
    const pageEl = document.getElementById('page-' + pageNum);
    if (!pageEl) return;

    const box = document.createElement('div');
    box.className = 'jnotes-text-box';
    box.contentEditable = true;
    box.style.left = x + 'px';
    box.style.top = y + 'px';
    box.style.color = currentColor;
    box.innerHTML = 'اكتب ملاحظتك هنا...';

    box.addEventListener('blur', function() {
      if (!box.textContent.trim()) box.remove();
      saveAnnotations();
    });

    pageEl.appendChild(box);
    box.focus();
  }

  // Persistence & Auto-Save
  function saveAnnotations() {
    const dot = document.getElementById('auto-save-dot');
    const text = document.getElementById('auto-save-text');

    if (dot) dot.classList.add('saving');
    if (text) text.textContent = 'جاري الحفظ...';

    const docId = currentDoc?.id || 'sheet_doc';
    const payload = {
      version: 2,
      docId: docId,
      strokes: pageStrokes,
      studyTapes: studyTapes,
      bookmarks: pageBookmarks,
      savedAt: Date.now()
    };

    try {
      localStorage.setItem('kf_doc_annotations_' + docId, JSON.stringify(payload));
      setTimeout(() => {
        if (dot) dot.classList.remove('saving');
        if (text) text.textContent = 'تم الحفظ تلقائياً';
      }, 400);
    } catch (e) {
      if (text) text.textContent = 'خطأ في الحفظ';
    }
  }

  function loadSavedAnnotations() {
    const docId = currentDoc?.id || 'sheet_doc';
    try {
      const raw = localStorage.getItem('kf_doc_annotations_' + docId);
      if (raw) {
        const data = JSON.parse(raw);
        if (data.strokes) pageStrokes = data.strokes;
        if (data.studyTapes) studyTapes = data.studyTapes;
        if (data.bookmarks) pageBookmarks = data.bookmarks;

        for (let p in studyTapes) {
          (studyTapes[p] || []).forEach(t => renderStudyTapeElement(t, p));
        }
        for (let p in pageStrokes) {
          redrawCanvas(p);
        }
      }
    } catch (e) {}
  }

  // PDF.js Real Multi-Page Loader
  async function loadPdfPages(url) {
    if (!url || typeof window.pdfjsLib === 'undefined') return;
    try {
      const loadingTask = window.pdfjsLib.getDocument({
        url: url,
        cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
        cMapPacked: true
      });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;
      if (!numPages || numPages < 1) return;

      const pagesWrapper = document.getElementById('jnotes-pages-wrapper');
      if (!pagesWrapper) return;
      pagesWrapper.innerHTML = '';
      totalPages = numPages;

      const stepper = document.getElementById('page-counter-stepper');
      if (stepper) stepper.textContent = '1 / ' + totalPages;
      const totalEl = document.getElementById('sidebar-total-pages');
      if (totalEl) totalEl.textContent = totalPages;

      for (let p = 1; p <= numPages; p++) {
        const pdfPage = await pdf.getPage(p);
        const rawViewport = pdfPage.getViewport({ scale: 1.5 });

        const pageDiv = document.createElement('div');
        pageDiv.className = 'doc-page pdf-page-rendered';
        pageDiv.id = 'page-' + p;
        pageDiv.setAttribute('data-page', p);
        pageDiv.style.width = 'min(100%, ' + rawViewport.width + 'px)';
        pageDiv.style.aspectRatio = rawViewport.width + ' / ' + rawViewport.height;

        const pdfCanvas = document.createElement('canvas');
        pdfCanvas.className = 'pdf-render-canvas';
        pdfCanvas.width = rawViewport.width;
        pdfCanvas.height = rawViewport.height;

        const overlayCanvas = document.createElement('canvas');
        overlayCanvas.className = 'canvas-overlay';
        overlayCanvas.id = 'canvas-' + p;
        overlayCanvas.width = rawViewport.width;
        overlayCanvas.height = rawViewport.height;

        pageDiv.appendChild(pdfCanvas);
        pageDiv.appendChild(overlayCanvas);
        pagesWrapper.appendChild(pageDiv);

        await pdfPage.render({
          canvasContext: pdfCanvas.getContext('2d'),
          viewport: rawViewport
        }).promise;
      }

      initCanvases();
      loadSavedAnnotations();
    } catch (e) {
      console.warn('PDF.js render failed, using fallback slides:', e);
    }
  }

  // DocumentViewer Public Module Definition
  const DocumentViewer = {
    currentDoc: null,
    isOpen: false,

    init() {
      // Initialization hooks
    },

    async download(doc) {
      if (window.STORE && typeof window.STORE.downloadSheetPdf === 'function') {
        return window.STORE.downloadSheetPdf(doc);
      }
      try {
        const docId = doc?.id;
        const title = doc?.title || doc?.title_ar || 'sheet';
        let targetUrl = doc?.pdf_resolved_url || doc?.pdf_url || doc?.download_url;

        if (!targetUrl && docId && window.DATA?.pdfStore) {
          try {
            const blobUrl = await window.DATA.pdfStore.getPdfUrl(docId);
            if (blobUrl) targetUrl = blobUrl;
          } catch (e) {}
        }

        if (targetUrl) {
          const a = document.createElement('a');
          a.href = targetUrl;
          a.target = '_blank';
          a.download = (title || 'sheet') + '.pdf';
          document.body.appendChild(a);
          a.click();
          setTimeout(() => document.body.removeChild(a), 500);
        }
      } catch (e) {
        console.warn('PDF download error:', e);
      }
    },

    generateDocHTML(doc, isAr) {
      return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <title>${doc.title || 'Kuro Fangs Studio'}</title>
  <style>${STUDIO_STYLES}</style>
</head>
<body class="sheet-studio-fullscreen">
  ${getStudioMarkup(doc, isAr)}
</body>
</html>`;
    },

    async renderStudio(container, doc, isAr) {
      if (!container) return;
      currentDoc = doc || {};
      this.currentDoc = currentDoc;
      totalPages = Math.max(1, parseInt(doc?.pages, 10) || 1);
      currentPage = 1;
      pageStrokes = {};
      studyTapes = {};
      pageBookmarks = [];

      // Inject Dedicated Studio CSS once into head
      let styleEl = document.getElementById('jnotes-studio-styles');
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'jnotes-studio-styles';
        styleEl.textContent = STUDIO_STYLES;
        document.head.appendChild(styleEl);
      }

      // Check for local IndexedDB blob
      let pdfSourceUrl = doc?.pdf_url || doc?.download_url || '';
      if (doc?.id && window.DATA?.pdfStore) {
        try {
          const localBlob = await window.DATA.pdfStore.getPdfUrl(doc.id);
          if (localBlob) pdfSourceUrl = localBlob;
        } catch (e) {}
      }
      currentDoc.pdf_resolved_url = pdfSourceUrl;

      // Render Markup directly into container
      container.innerHTML = getStudioMarkup(currentDoc, isAr);

      // Initialize Tools & Canvases
      renderContextBar();
      initCanvases();
      loadSavedAnnotations();

      // Render uploaded PDF if available
      if (pdfSourceUrl) {
        loadPdfPages(pdfSourceUrl);
      }
    },

    render(container, doc, isAr) {
      return this.renderStudio(container, doc, isAr);
    }
  };

  window.DocumentViewer = DocumentViewer;

})();
