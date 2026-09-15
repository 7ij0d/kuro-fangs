/**
 * KURO FANGS — ACADEMIC PDF ANNOTATION WORKSPACE & JNOTES NOTE STUDIO
 * 
 * Comprehensive Upgrade featuring:
 * 1. High-DPI Retina PDF.js Multi-Page Rendering + True Selectable TextLayer (select, copy, search, translate)
 * 2. Dedicated Reading / Browse Mode (Default mode, touch pan/scroll, zero accidental marks)
 * 3. Real Translucent Highlighter with Multiply Blend Mode (text remains 100% sharp and readable underneath)
 * 4. Glitch-Free Straight Line Drafting with transient preview canvas (zero radiating lines / spiderwebs)
 * 5. Precision Eraser with Partial/Segment and Object/Stroke Modes + Dynamic Circle Cursor Indicator
 * 6. First-Click (Activate) / Second-Click (Expand Settings) Interaction with Isolated Pen & Highlighter Presets
 * 7. Streamlined 6-Tool Annotation Toolbar (Undo, Redo, Browse, Pen, Highlighter, Eraser, Text, Laser)
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
      position: fixed !important;
      inset: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      height: 100dvh !important;
      display: flex !important;
      flex-direction: column !important;
      overflow: hidden !important;
      z-index: 99990 !important;
      touch-action: none;
    }

    /* ==========================================================================
       LAYER A: GLOBAL TOP NAVIGATION BAR (.jnotes-global-bar)
       ========================================================================== */
    .jnotes-global-bar {
      height: 40px;
      min-height: 40px;
      background: var(--j-top);
      border-bottom: 1px solid var(--j-border);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 12px;
      gap: 10px;
      z-index: 100;
      flex-shrink: 0;
      position: sticky;
      top: 0;
      width: 100%;
      box-sizing: border-box;
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
       LAYER B: STREAMLINED ANNOTATION TOOLBAR (.jnotes-annotation-toolbar)
       ========================================================================== */
    .jnotes-annotation-toolbar {
      height: 46px;
      background: var(--j-tool);
      border-bottom: 1px solid var(--j-border);
      display: flex;
      align-items: center;
      padding: 0 12px;
      gap: 6px;
      z-index: 99;
      flex-shrink: 0;
      overflow-x: auto;
      scrollbar-width: none;
      position: sticky;
      top: 40px;
      width: 100%;
      box-sizing: border-box;
    }
    .jnotes-annotation-toolbar::-webkit-scrollbar { display: none; }

    .j-tool-btn {
      background: transparent;
      border: 1px solid transparent;
      color: #CBD5E1;
      border-radius: 8px;
      height: 36px;
      padding: 0 10px;
      font-size: 0.775rem;
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
      background: rgba(255, 255, 255, 0.08);
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
       LAYER C: DYNAMIC CONTEXTUAL PROPERTIES BAR (.jnotes-context-bar)
       ========================================================================== */
    .jnotes-context-bar {
      min-height: 40px;
      background: var(--j-ctx);
      border-bottom: 1px solid var(--j-border);
      display: flex;
      align-items: center;
      padding: 3px 12px;
      gap: 10px;
      z-index: 98;
      flex-shrink: 0;
      overflow-x: auto;
      scrollbar-width: none;
      transition: background 0.2s;
      position: sticky;
      top: 84px;
      width: 100%;
      box-sizing: border-box;
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

    /* Quick Preset Chips */
    .j-preset-chip {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 20px;
      padding: 3px 10px;
      font-size: 0.725rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .j-preset-chip:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.25);
    }
    .j-preset-chip.active {
      background: rgba(2, 132, 199, 0.25);
      border-color: #38BDF8;
      color: #38BDF8;
    }
    .j-preset-dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
    }

    /* ==========================================================================
       WORKSPACE & VIEWPORT WITH REAL HIGH-DPI TEXT LAYER
       ========================================================================== */
    .jnotes-workspace {
      flex: 1;
      display: flex;
      position: relative;
      overflow: hidden;
      width: 100%;
      height: 100%;
      user-select: none;
      -webkit-user-select: none;
    }
    .jnotes-viewport {
      flex: 1;
      overflow: hidden;
      position: relative;
      background: var(--j-bg);
      touch-action: none;
      user-select: none;
      -webkit-user-select: none;
    }
    .jnotes-pages-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      transform-origin: 0 0;
      will-change: transform;
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

    /* PDF.js Real TextLayer Styles (Selectable, Copyable, Searchable) */
    .textLayer {
      position: absolute;
      text-align: initial;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      overflow: hidden;
      line-height: 1.0;
      text-size-adjust: none;
      forced-color-adjust: none;
      transform-origin: 0 0;
      z-index: 2;
      user-select: text;
      -webkit-user-select: text;
    }
    .textLayer span, .textLayer br {
      color: transparent;
      position: absolute;
      white-space: pre;
      cursor: text;
      transform-origin: 0% 0%;
    }
    .textLayer ::selection {
      background: rgba(2, 132, 199, 0.4);
      color: transparent;
    }

    /* Canvas Overlays */
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
    .draft-canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: block;
      z-index: 6;
      pointer-events: none;
    }

    /* Dynamic Circle Eraser Cursor */
    .jnotes-eraser-cursor {
      position: fixed;
      border: 2px solid rgba(239, 68, 68, 0.85);
      background: rgba(239, 68, 68, 0.18);
      border-radius: 50%;
      pointer-events: none;
      z-index: 99999;
      transform: translate(-50%, -50%);
      display: none;
      box-shadow: 0 0 10px rgba(239, 68, 68, 0.4);
      transition: width 0.05s ease, height 0.05s ease;
    }

    /* Virtual Straightedge Ruler Overlay */
    .jnotes-ruler-overlay {
      position: absolute;
      top: 140px;
      left: 60px;
      width: 440px;
      height: 56px;
      background: rgba(15, 23, 42, 0.9);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1.5px solid rgba(56, 189, 248, 0.5);
      border-radius: 8px;
      box-shadow: 0 14px 40px rgba(0, 0, 0, 0.65), 0 0 15px rgba(56, 189, 248, 0.2);
      z-index: 150;
      display: none;
      user-select: none;
      -webkit-user-select: none;
      touch-action: none;
      transform-origin: center center;
    }
    .jnotes-ruler-overlay.active {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .ruler-top-edge {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, #38BDF8, #818CF8, #38BDF8);
      box-shadow: 0 0 8px #38BDF8;
      border-radius: 4px 4px 0 0;
    }
    .ruler-ticks-container {
      position: absolute;
      top: 3px;
      left: 0;
      right: 0;
      height: 18px;
      display: flex;
      justify-content: space-between;
      padding: 0 10px;
      pointer-events: none;
      overflow: hidden;
    }
    .ruler-tick {
      width: 1px;
      background: rgba(255, 255, 255, 0.25);
    }
    .ruler-tick.cm {
      height: 14px;
      background: rgba(56, 189, 248, 0.85);
      width: 1.5px;
    }
    .ruler-tick.half {
      height: 9px;
      background: rgba(255, 255, 255, 0.5);
    }
    .ruler-tick.mm {
      height: 5px;
    }
    .ruler-drag-handle {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.725rem;
      font-weight: 700;
      color: #94A3B8;
      cursor: grab;
      user-select: none;
      touch-action: none;
      padding-top: 14px;
    }
    .ruler-drag-handle:active {
      cursor: grabbing;
    }
    .ruler-quick-angles {
      display: flex;
      gap: 4px;
      padding-top: 14px;
      margin-left: 8px;
      margin-right: 8px;
    }
    .ruler-angle-btn {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 4px;
      color: #E2E8F0;
      font-size: 0.65rem;
      font-weight: 700;
      padding: 2px 5px;
      cursor: pointer;
      transition: background 0.15s, border-color 0.15s;
    }
    .ruler-angle-btn:hover {
      background: rgba(56, 189, 248, 0.25);
      color: #38BDF8;
      border-color: #38BDF8;
    }
    .ruler-rotate-handle {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      background: rgba(56, 189, 248, 0.15);
      border: 1px solid rgba(56, 189, 248, 0.4);
      color: #38BDF8;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: crosshair;
      font-size: 0.75rem;
      margin-top: 14px;
      margin-left: 6px;
      margin-right: 6px;
      touch-action: none;
    }
    .ruler-close-btn {
      background: none;
      border: none;
      color: #94A3B8;
      font-size: 0.85rem;
      cursor: pointer;
      padding: 4px 8px;
      margin-top: 14px;
      transition: color 0.15s;
    }
    .ruler-close-btn:hover {
      color: #EF4444;
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

    /* Pure Borderless Typography Text */
    .jnotes-text-box {
      position: absolute;
      z-index: 9;
      min-width: 16px;
      min-height: 22px;
      padding: 0 !important;
      border: none !important;
      background: transparent !important;
      box-shadow: none !important;
      outline: none !important;
      font-family: inherit;
      font-size: 1.05rem;
      line-height: 1.35;
      cursor: text;
      caret-color: var(--j-accent, #38BDF8);
      white-space: pre-wrap;
      word-break: break-word;
      user-select: text;
      -webkit-user-select: text;
    }
    .jnotes-text-box:focus-within,
    .jnotes-text-box:focus {
      border: none !important;
      background: transparent !important;
      box-shadow: none !important;
      outline: none !important;
    }
    .jnotes-text-box[data-placeholder]:empty:before {
      content: attr(data-placeholder);
      color: rgba(148, 163, 184, 0.45);
      pointer-events: none;
    }

    /* Multi-Tab Sidebar */
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
    .jnotes-sidebar-backdrop.open { display: block; opacity: 1; }

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
    .jnotes-multi-sidebar.open { transform: translateX(0); }

    .j-sidebar-tabs-nav {
      display: flex;
      background: #12131F;
      border-bottom: 1px solid var(--j-border);
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
    .j-thumb-card.active {
      border-color: var(--j-accent);
      background: rgba(2, 132, 199, 0.15);
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

    /* Popover Menus */
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

    /* Mobile Responsive Optimizations */
    @media (max-width: 768px) {
      .jnotes-global-bar {
        height: 44px;
        padding: 0 8px;
        gap: 6px;
        overflow-x: auto;
        overflow-y: hidden;
        scrollbar-width: none;
        -webkit-overflow-scrolling: touch;
      }
      .jnotes-global-bar::-webkit-scrollbar { display: none; }
      .j-title-pill {
        max-width: 130px;
        padding: 3px 6px;
      }
      .j-title-text {
        font-size: 0.7rem;
      }
      .j-badge-subject {
        display: none;
      }
      .j-autosave-badge span#auto-save-text {
        display: none;
      }
      .j-autosave-badge {
        padding: 4px;
      }
      .j-btn {
        padding: 4px 8px;
        font-size: 0.72rem;
      }
      .jnotes-annotation-toolbar {
        height: 40px;
        padding: 0 8px;
        gap: 4px;
        position: sticky;
        top: 40px;
      }
      .j-tool-btn {
        height: 32px;
        padding: 0 8px;
        font-size: 0.725rem;
        gap: 4px;
      }
      .j-tool-btn svg {
        width: 14px;
        height: 14px;
      }
      .jnotes-context-bar {
        min-height: 38px;
        padding: 3px 8px;
        gap: 8px;
        position: sticky;
        top: 80px;
      }
    }
  `;

  // Global Workspace State
  let currentDoc = null;
  let totalPages = 1;
  let currentPage = 1;
  let currentTool = 'pan'; // Default mode is Reading/Browse mode!
  let currentTheme = 'white';
  let zoomLevel = 1.0;
  let isContextExpanded = false;

  // 2D Matrix Camera Viewport State (Hardware-Accelerated Translation & Scale)
  let panX = 0;
  let panY = 15;
  let minZoom = 0.85;
  let maxZoom = 3.5;
  let docNaturalWidth = 850;
  let docNaturalHeight = 1100;

  // Distinct & Independent Tool States
  const penState = {
    color: '#0284C7',
    width: 0.8, // mm
    opacity: 1.0,
    isStraight: false
  };

  const highlighterState = {
    color: '#FFE600',
    width: 6.0, // mm (wide highlighter)
    opacity: 0.38,
    isStraight: false
  };

  const eraserState = {
    mode: 'partial', // 'partial' (segment eraser) | 'object' (stroke eraser)
    radius: 16 // px
  };

  // Virtual Ruler State (Optional straightedge guide)
  let isRulerActive = false;
  let rulerAngle = 0; // in degrees
  let rulerPos = { x: 80, y: 140 }; // px relative to workspace

  // Annotation Data Structures
  let pageStrokes = {}; // { [pageNum]: Array<Stroke> }
  let undoStack = {};
  let redoStack = {};
  let pageBookmarks = [];

  // Presets Storage
  function getPenPresets() {
    try {
      const raw = localStorage.getItem('kf_pen_presets');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [
      { id: 'p1', name: 'أزرق أساسي', color: '#0284C7', width: 0.5 },
      { id: 'p2', name: 'أحمر امتحاني', color: '#EF4444', width: 0.8 },
      { id: 'p3', name: 'أخضر ملاحظات', color: '#10B981', width: 0.5 }
    ];
  }

  function getHighlighterPresets() {
    try {
      const raw = localStorage.getItem('kf_highlighter_presets_v2');
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return [
      { id: 'h1', name: 'تظليل أصفر', color: '#FFE600', width: 6.0, opacity: 0.38 },
      { id: 'h2', name: 'تظليل أخضر', color: '#6EE7B7', width: 6.0, opacity: 0.38 },
      { id: 'h3', name: 'تظليل وردي', color: '#F472B6', width: 6.0, opacity: 0.38 },
      { id: 'h4', name: 'تظليل أزرق', color: '#7DD3FC', width: 6.0, opacity: 0.38 },
      { id: 'h5', name: 'تظليل بنفسجي', color: '#C084FC', width: 6.0, opacity: 0.38 },
      { id: 'h6', name: 'تظليل برتقالي', color: '#FDBA74', width: 6.0, opacity: 0.38 }
    ];
  }

  // Render Studio Base Markup
  function getStudioMarkup(doc, isAr) {
    const title = doc.title || (isAr ? doc.title_ar : doc.title_en) || 'شيت دراسي';
    const subjectName = doc.subject_name || (isAr ? 'المادة الدراسية' : 'Subject');
    const numPages = Math.max(1, parseInt(doc.pages, 10) || 1);

    return `
      <!-- Eraser Circle Cursor Indicator -->
      <div class="jnotes-eraser-cursor" id="jnotes-eraser-cursor"></div>

      <!-- LAYER A: MINIMAL GLOBAL TOP BAR (Back, Sheet Name, Page Indicator) -->
      <header class="jnotes-global-bar">
        <div class="j-bar-section" style="flex: 1; min-width: 0; overflow: hidden; gap: 10px;">
          <button class="j-btn" onclick="exitStudio()" title="العودة">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m15 18-6-6 6-6"/></svg>
            <span>العودة</span>
          </button>
          <span class="j-title-text" style="font-size: 0.825rem; font-weight: 700; color: #F8FAFC; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${title}">${title}</span>
        </div>
        <div class="j-bar-section" style="flex-shrink: 0;">
          <span class="j-page-stepper-text" id="page-counter-stepper" onclick="openPageJumpModal()" style="background: rgba(255, 255, 255, 0.06); border: 1px solid var(--j-border); border-radius: 14px; padding: 3px 12px; font-size: 0.75rem; font-weight: 700; color: var(--j-accent); cursor: pointer;" title="انتقال مباشر لرقم الصفحة">
            1 / ${numPages}
          </span>
        </div>
      </header>

      <!-- LAYER B: STREAMLINED ANNOTATION TOOLBAR -->
      <nav class="jnotes-annotation-toolbar">
        <button class="j-tool-btn" id="btn-undo" onclick="undoAction()" title="تراجع (Ctrl+Z)">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
        </button>
        <button class="j-tool-btn" id="btn-redo" onclick="redoAction()" title="إعادة (Ctrl+Y)">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/></svg>
        </button>

        <div class="j-divider"></div>

        <!-- 1. Reading / Browse Mode (Active by default) -->
        <button class="j-tool-btn active" id="tbtn-pan" onclick="handleToolClick('pan')" title="تصفح وقراءة (بدون رسم)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>
          <span>تصفح</span>
        </button>

        <div class="j-divider"></div>

        <!-- 2. Pen -->
        <button class="j-tool-btn" id="tbtn-pen" onclick="handleToolClick('pen')" title="قلم الملاحظات (انقر مرة أخرى للإعدادات)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
          <span>قلم</span>
        </button>

        <!-- 3. Real Highlighter / Marker -->
        <button class="j-tool-btn" id="tbtn-highlighter" onclick="handleToolClick('highlighter')" title="خطاط تظليل شفاف (انقر مرة أخرى للإعدادات)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 11-6 6v3h3l6-6"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></svg>
          <span>خطاط</span>
        </button>

        <!-- 4. Eraser -->
        <button class="j-tool-btn" id="tbtn-eraser" onclick="handleToolClick('eraser')" title="ممحاة ذكية (انقر مرة أخرى للتبديل بين مسح جزئي ومسح كامل)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>
          <span>ممحاة</span>
        </button>

        <!-- 5. Text Box -->
        <button class="j-tool-btn" id="tbtn-text" onclick="handleToolClick('text')" title="إضافة نص">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
          <span>نص</span>
        </button>

        <!-- 6. Laser Pointer -->
        <button class="j-tool-btn ptool-laser" id="tbtn-laser" data-tool="laser" onclick="handleToolClick('laser')" title="مؤشر ليزر للعرض والتوضيح">
          <span style="color: #EF4444; font-size: 0.95rem;">📍</span>
          <span>ليزر</span>
        </button>
      </nav>

      <!-- LAYER C: DYNAMIC CONTEXTUAL PROPERTIES BAR -->
      <div class="jnotes-context-bar" id="jnotes-context-bar"></div>

      <!-- WORKSPACE & MAIN VIEWPORT -->
      <div class="jnotes-workspace" id="jnotes-workspace">
        <!-- VIRTUAL RULER OVERLAY -->
        <div class="jnotes-ruler-overlay" id="jnotes-ruler-overlay">
          <div class="ruler-top-edge"></div>
          <div class="ruler-ticks-container" id="ruler-ticks"></div>
          <div class="ruler-drag-handle" id="ruler-drag-handle" title="اسحب المسطرة لتحريكها">
            <span>📐 مسطرة التسطير</span>
          </div>
          <div class="ruler-quick-angles">
            <button type="button" class="ruler-angle-btn" onclick="snapRulerAngle(0)" title="أفقي تماماً">0°</button>
            <button type="button" class="ruler-angle-btn" onclick="snapRulerAngle(45)" title="بزاوية 45">45°</button>
            <button type="button" class="ruler-angle-btn" onclick="snapRulerAngle(90)" title="عمودي تماماً">90°</button>
          </div>
          <div class="ruler-rotate-handle" id="ruler-rotate-handle" title="اسحب لتدوير المسطرة بدقة">🔄</div>
          <button type="button" class="ruler-close-btn" onclick="toggleRuler()" title="إغلاق المسطرة">✕</button>
        </div>

        <main class="jnotes-viewport" id="jnotes-viewport">
          <div class="jnotes-pages-wrapper" id="jnotes-pages-wrapper">
            <!-- RENDERED DYNAMICALLY WITH HIGH-DPI & REAL TEXT LAYER -->
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
            <button class="j-sidebar-tab-btn" data-tab="search" onclick="openSidebarTab('search')">
              <span>🔍</span>
              <span>بحث</span>
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

          <div class="j-tab-panel" id="tab-panel-search">
            <span style="font-weight: 800; font-size: 0.85rem; margin-bottom: 6px;">البحث في المستند 🔍</span>
            <div style="display: flex; gap: 6px;">
              <input type="text" id="jnotes-search-input" placeholder="ابحث عن نص داخل الشيت..." style="flex: 1; background: #232536; border: 1px solid var(--j-border); border-radius: 8px; color: #FFF; padding: 8px 10px; font-size: 0.8rem; outline: none;" onkeydown="if(event.key==='Enter') executeDocSearch()" />
              <button class="j-btn j-btn-primary" onclick="executeDocSearch()">بحث</button>
            </div>
            <div id="sidebar-search-results" style="display: flex; flex-direction: column; gap: 8px; margin-top: 12px;"></div>
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

  // Dynamic Contextual Bar Renderer with First/Second Click Expansion
  function renderContextBar() {
    const bar = document.getElementById('jnotes-context-bar');
    if (!bar) return;

    let html = '';

    if (currentTool === 'pan') {
      html = `
        <div class="j-ctx-group">
          <span class="j-ctx-label">وضع التصفح والقراءة ✋:</span>
          <span style="font-size: 0.75rem; color: #94A3B8;">يمكنك السحب بحرية، التكبير باللمس، وتحديد ونسخ نصوص الـ PDF مباشرة 📖</span>
        </div>
      `;
    } else if (currentTool === 'pen') {
      const presets = getPenPresets();
      const presetChips = presets.map(p => {
        const isActive = (p.color.toLowerCase() === penState.color.toLowerCase() && p.width === penState.width);
        return `
          <div class="j-preset-chip ${isActive ? 'active' : ''}" onclick="applyPenPreset('${p.id}')">
            <span class="j-preset-dot" style="background: ${p.color};"></span>
            <span>${p.name}</span>
          </div>
        `;
      }).join('');

      const swatches = ['#0284C7', '#EF4444', '#10B981', '#F59E0B', '#0F172A'].map(c => {
        const isActive = c.toLowerCase() === penState.color.toLowerCase();
        return `<div class="j-swatch ${isActive ? 'active' : ''}" style="background: ${c};" onclick="setPenColor('${c}')"></div>`;
      }).join('');

      const thicknessChips = [0.3, 0.5, 0.8, 1.2].map(w => {
        return `<div class="j-thickness-chip ${penState.width === w ? 'active' : ''}" onclick="setPenWidth(${w})">${w}mm</div>`;
      }).join('');

      html = `
        <div class="j-ctx-group">
          <span class="j-ctx-label">الأقلام السريعة:</span>
          ${presetChips}
          <button class="j-btn" onclick="saveCurrentPenPreset()" style="font-size: 0.68rem; padding: 2px 7px;">+ حفظ كقلم سريع</button>
        </div>
        <div class="j-divider"></div>
        <div class="j-ctx-group">
          <span class="j-ctx-label">اللون:</span>
          <div class="j-swatch-list">
            ${swatches}
            <input type="color" value="${penState.color}" onchange="setPenColor(this.value)" style="width: 22px; height: 22px; border: none; background: transparent; cursor: pointer;" title="لون مخصص" />
          </div>
        </div>
        <div class="j-divider"></div>
        <div class="j-ctx-group">
          <span class="j-ctx-label">السمك:</span>
          ${thicknessChips}
        </div>
        <div class="j-divider"></div>
        <div class="j-ctx-group">
          <button class="j-btn ${penState.isStraight ? 'j-btn-primary' : ''}" onclick="togglePenStraight()">
            <span>📏</span>
            <span>خط مستقيم: ${penState.isStraight ? 'مفعل' : 'معطل'}</span>
          </button>
        </div>
        <div class="j-divider"></div>
        <div class="j-ctx-group">
          <button class="j-btn ${isRulerActive ? 'j-btn-primary' : ''}" onclick="toggleRuler()" title="إظهار / إخفاء مسطرة التسطير">
            <span>📐</span>
            <span>مسطرة: ${isRulerActive ? 'مفعلة' : 'معطلة'}</span>
          </button>
        </div>
      `;
    } else if (currentTool === 'highlighter') {
      const presets = getHighlighterPresets();
      const presetChips = presets.map(p => {
        const isActive = (p.color.toLowerCase() === highlighterState.color.toLowerCase());
        return `
          <div class="j-preset-chip ${isActive ? 'active' : ''}" onclick="applyHighlighterPreset('${p.id}')">
            <span class="j-preset-dot" style="background: ${p.color};"></span>
            <span>${p.name}</span>
          </div>
        `;
      }).join('');

      const swatches = ['#FFE600', '#6EE7B7', '#F472B6', '#7DD3FC', '#C084FC', '#FDBA74'].map(c => {
        const isActive = c.toLowerCase() === highlighterState.color.toLowerCase();
        return `<div class="j-swatch ${isActive ? 'active' : ''}" style="background: ${c};" onclick="setHighlighterColor('${c}')"></div>`;
      }).join('');

      html = `
        <div class="j-ctx-group">
          <span class="j-ctx-label">الخطاطات السريعة:</span>
          ${presetChips}
          <button class="j-btn" onclick="saveCurrentHighlighterPreset()" style="font-size: 0.68rem; padding: 2px 7px;">+ حفظ كخطاط سريع</button>
        </div>
        <div class="j-divider"></div>
        <div class="j-ctx-group">
          <span class="j-ctx-label">اللون:</span>
          <div class="j-swatch-list">
            ${swatches}
          </div>
        </div>
        <div class="j-divider"></div>
        <div class="j-ctx-group">
          <span class="j-ctx-label">سماكة الخطاط: ${highlighterState.width}mm</span>
          <input type="range" min="3.0" max="10.0" step="0.5" value="${highlighterState.width}" style="width: 75px; accent-color: #FACC15; cursor: pointer;" oninput="setHighlighterWidth(this.value)" />
        </div>
        <div class="j-divider"></div>
        <div class="j-ctx-group">
          <button class="j-btn ${highlighterState.isStraight ? 'j-btn-primary' : ''}" onclick="toggleHighlighterStraight()">
            <span>📏</span>
            <span>تظليل مستقيم: ${highlighterState.isStraight ? 'مفعل' : 'معطل'}</span>
          </button>
        </div>
        <div class="j-divider"></div>
        <div class="j-ctx-group">
          <button class="j-btn ${isRulerActive ? 'j-btn-primary' : ''}" onclick="toggleRuler()" title="إظهار / إخفاء مسطرة التسطير">
            <span>📐</span>
            <span>مسطرة: ${isRulerActive ? 'مفعلة' : 'معطلة'}</span>
          </button>
        </div>
      `;
    } else if (currentTool === 'eraser') {
      html = `
        <div class="j-ctx-group">
          <span class="j-ctx-label">نمط الممحاة:</span>
          <button class="j-btn ${eraserState.mode === 'partial' ? 'j-btn-primary' : ''}" onclick="setEraserMode('partial')" title="يمسح فقط الجزء الملموس من الخط">✂️ مسح جزئي (Segment)</button>
          <button class="j-btn ${eraserState.mode === 'object' ? 'j-btn-primary' : ''}" onclick="setEraserMode('object')" title="يحذف الخط كاملاً بمجرد لمسه">🎯 مسح العنصر (Object)</button>
        </div>
        <div class="j-divider"></div>
        <div class="j-ctx-group">
          <span class="j-ctx-label">حجم الممحاة:</span>
          ${[10, 16, 26].map(r => `
            <button class="j-thickness-chip ${eraserState.radius === r ? 'active' : ''}" onclick="setEraserRadius(${r})">${r === 10 ? 'صغير' : (r === 16 ? 'متوسط' : 'كبير')}</button>
          `).join('')}
        </div>
        <div class="j-divider"></div>
        <div class="j-ctx-group">
          <button class="j-btn" style="color: #EF4444;" onclick="clearCurrentPageStrokes()">🗑️ مسح رسومات الصفحة الحالية</button>
        </div>
      `;
    } else if (currentTool === 'text') {
      html = `
        <div class="j-ctx-group">
          <span class="j-ctx-label">أداة النص:</span>
          <span style="font-size: 0.75rem; color: #94A3B8;">انقر في أي مكان داخل الشريحة لإضافة ملاحظة نصية ✍️</span>
        </div>
      `;
    } else if (currentTool === 'laser') {
      html = `
        <div class="j-ctx-group">
          <span class="j-ctx-label">مؤشر الليزر:</span>
          <span style="font-size: 0.75rem; color: #EF4444; font-weight: 700;">● مؤشر مضيء مؤقت للعرض والشرح يختفي تلقائياً</span>
        </div>
      `;
    }

    bar.innerHTML = html;
  }

  // First-Click & Second-Click Tool Management
  window.handleToolClick = function(toolName) {
    if (currentTool !== toolName) {
      // First click: activate tool and display contextual strip
      isContextExpanded = false;
      setTool(toolName);
    } else {
      // Second click on already active tool: toggle expanded properties panel
      isContextExpanded = !isContextExpanded;
      renderContextBar();
    }
  };

  window.setTool = function(tool) {
    currentTool = tool;

    // Update active states on main toolbar buttons
    document.querySelectorAll('.j-tool-btn').forEach(b => b.classList.remove('active'));
    const activeBtn = document.getElementById('tbtn-' + tool) || document.getElementById('ptool-' + tool) || document.querySelector('.ptool-' + tool);
    if (activeBtn) activeBtn.classList.add('active');

    // Manage pointer events:
    // When in 'pan' mode, overlayCanvas has pointer-events: none so textLayer is fully selectable and touch scroll is fluid!
    const isPan = (tool === 'pan');
    document.querySelectorAll('.canvas-overlay').forEach(c => {
      c.style.pointerEvents = isPan ? 'none' : 'auto';
      if (tool === 'eraser') {
        c.style.cursor = 'none';
      } else if (tool === 'text') {
        c.style.cursor = 'text';
      } else if (tool === 'laser') {
        c.style.cursor = 'crosshair';
      } else if (isPan) {
        c.style.cursor = 'grab';
      } else {
        c.style.cursor = 'crosshair';
      }
    });

    // Hide eraser circle if not eraser
    const cursor = document.getElementById('jnotes-eraser-cursor');
    if (cursor && tool !== 'eraser') cursor.style.display = 'none';

    renderContextBar();
  };

  // Pen Controls
  window.setPenColor = function(c) {
    penState.color = c;
    renderContextBar();
  };
  window.setPenWidth = function(w) {
    penState.width = parseFloat(w) || 0.8;
    renderContextBar();
  };
  window.togglePenStraight = function() {
    penState.isStraight = !penState.isStraight;
    renderContextBar();
  };
  window.applyPenPreset = function(id) {
    const p = getPenPresets().find(item => item.id === id);
    if (!p) return;
    penState.color = p.color;
    penState.width = p.width;
    renderContextBar();
  };
  window.saveCurrentPenPreset = function() {
    const presets = getPenPresets();
    presets.push({
      id: 'p_' + Date.now(),
      name: 'قلم ' + penState.width + 'mm',
      color: penState.color,
      width: penState.width
    });
    localStorage.setItem('kf_pen_presets', JSON.stringify(presets));
    renderContextBar();
    showToast('تم حفظ القلم في القائمة السريعة! 🖊️');
  };

  // Highlighter Controls
  window.setHighlighterColor = function(c) {
    highlighterState.color = c;
    renderContextBar();
  };
  window.setHighlighterWidth = function(w) {
    highlighterState.width = parseFloat(w) || 5.0;
    renderContextBar();
  };
  window.toggleHighlighterStraight = function() {
    highlighterState.isStraight = !highlighterState.isStraight;
    renderContextBar();
  };
  window.applyHighlighterPreset = function(id) {
    const p = getHighlighterPresets().find(item => item.id === id);
    if (!p) return;
    highlighterState.color = p.color;
    highlighterState.width = p.width;
    highlighterState.opacity = p.opacity || 0.45;
    renderContextBar();
  };
  window.saveCurrentHighlighterPreset = function() {
    const presets = getHighlighterPresets();
    presets.push({
      id: 'h_' + Date.now(),
      name: 'تظليل ' + highlighterState.width + 'mm',
      color: highlighterState.color,
      width: highlighterState.width,
      opacity: highlighterState.opacity
    });
    localStorage.setItem('kf_highlighter_presets', JSON.stringify(presets));
    renderContextBar();
    showToast('تم حفظ الخطاط في القائمة السريعة! 🖍️');
  };

  // Eraser Controls
  window.setEraserMode = function(m) {
    eraserState.mode = m;
    renderContextBar();
  };
  window.setEraserRadius = function(r) {
    eraserState.radius = r;
    const cursor = document.getElementById('jnotes-eraser-cursor');
    if (cursor) {
      cursor.style.width = (r * 2) + 'px';
      cursor.style.height = (r * 2) + 'px';
    }
    renderContextBar();
  };

  // Virtual Ruler Engine & Straightedge Guide
  window.toggleRuler = function() {
    isRulerActive = !isRulerActive;
    const rulerEl = document.getElementById('jnotes-ruler-overlay');
    if (rulerEl) {
      if (isRulerActive) {
        rulerEl.classList.add('active');
        updateRulerTransform();
        generateRulerTicks();
      } else {
        rulerEl.classList.remove('active');
      }
    }
    renderContextBar();
  };

  window.snapRulerAngle = function(deg) {
    rulerAngle = deg;
    updateRulerTransform();
  };

  function updateRulerTransform() {
    const rulerEl = document.getElementById('jnotes-ruler-overlay');
    if (!rulerEl) return;
    rulerEl.style.left = rulerPos.x + 'px';
    rulerEl.style.top = rulerPos.y + 'px';
    rulerEl.style.transform = `rotate(${rulerAngle}deg)`;
  }

  function generateRulerTicks() {
    const container = document.getElementById('ruler-ticks');
    if (!container || container.children.length > 0) return;
    let ticksHtml = '';
    for (let i = 0; i <= 40; i++) {
      let cls = 'mm';
      if (i % 10 === 0) cls = 'cm';
      else if (i % 5 === 0) cls = 'half';
      ticksHtml += `<div class="ruler-tick ${cls}"></div>`;
    }
    container.innerHTML = ticksHtml;
  }

  function snapPointToRuler(pt, canvas, clientX, clientY) {
    if (!isRulerActive) return pt;
    const rulerEl = document.getElementById('jnotes-ruler-overlay');
    if (!rulerEl) return pt;

    const rRect = rulerEl.getBoundingClientRect();
    const cx = rRect.left + rRect.width / 2;
    const cy = rRect.top + rRect.height / 2;
    const rad = (rulerAngle * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    // Top edge center in client coordinates
    const edgeCx = cx + 28 * sin;
    const edgeCy = cy - 28 * cos;

    const vx = clientX - edgeCx;
    const vy = clientY - edgeCy;

    // Normal distance to ruler edge line
    const distNormal = Math.abs(vx * sin - vy * cos);

    // Tangential offset along the ruler edge
    const distTangent = vx * cos + vy * sin;

    // Snapping threshold: within 50px normal distance, and within ruler length +/- 30px
    const halfWidth = 220; // 440px / 2
    if (distNormal <= 50 && distTangent >= -halfWidth - 30 && distTangent <= halfWidth + 30) {
      const clampedTangent = Math.max(-halfWidth, Math.min(halfWidth, distTangent));
      const snappedClientX = edgeCx + clampedTangent * cos;
      const snappedClientY = edgeCy + clampedTangent * sin;

      const cRect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / cRect.width;
      const scaleY = canvas.height / cRect.height;

      return {
        x: (snappedClientX - cRect.left) * scaleX,
        y: (snappedClientY - cRect.top) * scaleY
      };
    }

    return pt;
  }

  function initRulerInteractions() {
    const rulerEl = document.getElementById('jnotes-ruler-overlay');
    const dragHandle = document.getElementById('ruler-drag-handle');
    const rotateHandle = document.getElementById('ruler-rotate-handle');
    if (!rulerEl || !dragHandle || !rotateHandle) return;

    if (rulerEl._rulerBound) return;
    rulerEl._rulerBound = true;

    // Dragging
    let isDraggingRuler = false;
    let dragStart = { x: 0, y: 0 };
    let posStart = { x: 0, y: 0 };

    const onDragStart = (e) => {
      e.stopPropagation();
      isDraggingRuler = true;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      dragStart = { x: clientX, y: clientY };
      posStart = { x: rulerPos.x, y: rulerPos.y };
    };

    const onDragMove = (e) => {
      if (!isDraggingRuler) return;
      e.preventDefault();
      e.stopPropagation();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      rulerPos.x = posStart.x + (clientX - dragStart.x);
      rulerPos.y = posStart.y + (clientY - dragStart.y);
      updateRulerTransform();
    };

    const onDragEnd = () => {
      isDraggingRuler = false;
    };

    dragHandle.addEventListener('mousedown', onDragStart);
    dragHandle.addEventListener('touchstart', onDragStart, { passive: false });
    window.addEventListener('mousemove', onDragMove);
    window.addEventListener('touchmove', onDragMove, { passive: false });
    window.addEventListener('mouseup', onDragEnd);
    window.addEventListener('touchend', onDragEnd);

    // Rotating
    let isRotatingRuler = false;

    const onRotateStart = (e) => {
      e.stopPropagation();
      e.preventDefault();
      isRotatingRuler = true;
    };

    const onRotateMove = (e) => {
      if (!isRotatingRuler) return;
      e.preventDefault();
      e.stopPropagation();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const rRect = rulerEl.getBoundingClientRect();
      const cx = rRect.left + rRect.width / 2;
      const cy = rRect.top + rRect.height / 2;
      const rad = Math.atan2(clientY - cy, clientX - cx);
      let deg = Math.round((rad * 180) / Math.PI);
      const standardAngles = [-180, -135, -90, -45, 0, 45, 90, 135, 180];
      for (const sa of standardAngles) {
        if (Math.abs(deg - sa) <= 4) {
          deg = sa;
          break;
        }
      }
      rulerAngle = deg;
      updateRulerTransform();
    };

    const onRotateEnd = () => {
      isRotatingRuler = false;
    };

    rotateHandle.addEventListener('mousedown', onRotateStart);
    rotateHandle.addEventListener('touchstart', onRotateStart, { passive: false });
    window.addEventListener('mousemove', onRotateMove);
    window.addEventListener('touchmove', onRotateMove, { passive: false });
    window.addEventListener('mouseup', onRotateEnd);
    window.addEventListener('touchend', onRotateEnd);
  }

  // ==========================================================================
  // 2D MATRIX CAMERA VIEWPORT CONTROLLER (Hardware-Accelerated Translation & Scale)
  // ==========================================================================
  function getViewportDimensions() {
    const vp = document.getElementById('jnotes-viewport');
    if (!vp) return { width: window.innerWidth, height: window.innerHeight };
    return { width: vp.clientWidth || window.innerWidth, height: vp.clientHeight || window.innerHeight };
  }

  function getDocumentDimensions() {
    const wrapper = document.getElementById('jnotes-pages-wrapper');
    if (!wrapper) return { width: docNaturalWidth, height: docNaturalHeight };
    const w = wrapper.offsetWidth || docNaturalWidth;
    const h = wrapper.offsetHeight || docNaturalHeight;
    return { width: Math.max(300, w), height: Math.max(400, h) };
  }

  function getFitWidthScale() {
    const vp = getViewportDimensions();
    const doc = getDocumentDimensions();
    const targetW = vp.width - 24; // 12px margin each side
    const scale = targetW / (doc.width || 850);
    return Math.max(0.35, Math.min(1.5, scale));
  }

  function clampViewport(forceCenter = false) {
    const vp = getViewportDimensions();
    const doc = getDocumentDimensions();
    const scaledW = doc.width * zoomLevel;
    const scaledH = doc.height * zoomLevel;

    if (forceCenter) {
      if (scaledW <= vp.width) {
        panX = (vp.width - scaledW) / 2;
      }
      if (scaledH <= vp.height) {
        panY = Math.max(15, (vp.height - scaledH) / 2);
      }
      return;
    }

    // Horizontal boundaries: preserve focal point during zoom/pan with soft margins
    const padX = Math.min(vp.width * 0.45, 200);
    if (scaledW <= vp.width) {
      const minX = -padX;
      const maxX = vp.width - scaledW + padX;
      panX = Math.max(minX, Math.min(maxX, panX));
    } else {
      const minX = vp.width - scaledW - padX;
      const maxX = padX;
      panX = Math.max(minX, Math.min(maxX, panX));
    }

    // Vertical boundaries:
    const padY = Math.min(vp.height * 0.45, 200);
    if (scaledH <= vp.height) {
      const minY = -padY;
      const maxY = vp.height - scaledH + padY;
      panY = Math.max(minY, Math.min(maxY, panY));
    } else {
      const minY = vp.height - scaledH - padY;
      const maxY = padY;
      panY = Math.max(minY, Math.min(maxY, panY));
    }
  }

  function settleViewport() {
    const vp = getViewportDimensions();
    const doc = getDocumentDimensions();
    const scaledW = doc.width * zoomLevel;
    const scaledH = doc.height * zoomLevel;
    let changed = false;

    if (scaledW <= vp.width) {
      panX = (vp.width - scaledW) / 2;
      changed = true;
    } else {
      const minX = vp.width - scaledW - 15;
      const maxX = 15;
      if (panX < minX) { panX = minX; changed = true; }
      if (panX > maxX) { panX = maxX; changed = true; }
    }

    if (scaledH <= vp.height) {
      panY = Math.max(15, (vp.height - scaledH) / 2);
      changed = true;
    } else {
      const minY = vp.height - scaledH - 30;
      const maxY = 15;
      if (panY < minY) { panY = minY; changed = true; }
      if (panY > maxY) { panY = maxY; changed = true; }
    }

    if (changed) {
      updateTransform(true);
    }
  }

  function updateTransform(smooth) {
    const wrapper = document.getElementById('jnotes-pages-wrapper');
    if (!wrapper) return;

    if (smooth) {
      wrapper.style.transition = 'transform 0.18s cubic-bezier(0.25, 1, 0.5, 1)';
    } else {
      wrapper.style.transition = 'none';
    }

    wrapper.style.transform = `translate3d(${panX}px, ${panY}px, 0) scale(${zoomLevel})`;

    const textEl = document.getElementById('zoom-val-text');
    if (textEl) textEl.textContent = Math.round(zoomLevel * 100) + '%';
  }

  // GitHub Panzoom & Leaflet Focal-Point Invariant Zoom Engine
  function zoomAtPoint(targetZoom, clientX, clientY, smooth = false) {
    const viewportEl = document.getElementById('jnotes-viewport');
    if (!viewportEl) return;
    const rect = viewportEl.getBoundingClientRect();
    const focalX = clientX - rect.left;
    const focalY = clientY - rect.top;

    // 1. Calculate the point on the unscaled plane under the cursor:
    const planeX = (focalX - panX) / zoomLevel;
    const planeY = (focalY - panY) / zoomLevel;

    // 2. Clamp target zoom:
    const newZoom = Math.max(minZoom, Math.min(maxZoom, targetZoom));

    // 3. Re-anchor pan so planeX and planeY remain precisely at focalX and focalY:
    panX = focalX - planeX * newZoom;
    panY = focalY - planeY * newZoom;
    zoomLevel = newZoom;

    clampViewport(false);
    updateTransform(smooth);
    updateCurrentPageFromPan();
  }

  window.zoomAtPoint = zoomAtPoint;

  window.setZoom = function(val, focalPoint, smooth) {
    const vp = document.getElementById('jnotes-viewport');
    const rect = vp ? vp.getBoundingClientRect() : { left: 0, top: 0, width: 800, height: 600 };
    const clientX = focalPoint ? focalPoint.x : (rect.left + rect.width / 2);
    const clientY = focalPoint ? focalPoint.y : (rect.top + rect.height / 2);
    zoomAtPoint(val, clientX, clientY, smooth !== false);
  };

  window.zoomIn = function() {
    const vp = document.getElementById('jnotes-viewport');
    const rect = vp ? vp.getBoundingClientRect() : { left: 0, top: 0, width: 800, height: 600 };
    zoomAtPoint(zoomLevel * 1.25, rect.left + rect.width / 2, rect.top + rect.height / 2, true);
  };

  window.zoomOut = function() {
    const vp = document.getElementById('jnotes-viewport');
    const rect = vp ? vp.getBoundingClientRect() : { left: 0, top: 0, width: 800, height: 600 };
    zoomAtPoint(zoomLevel / 1.25, rect.left + rect.width / 2, rect.top + rect.height / 2, true);
  };

  window.resetZoom = function() { window.fitWidth(); };

  window.fitWidth = function() {
    zoomLevel = getFitWidthScale();
    const vp = getViewportDimensions();
    const doc = getDocumentDimensions();
    panX = (vp.width - doc.width * zoomLevel) / 2;
    panY = 15;
    clampViewport(true);
    updateTransform(true);
  };

  window.fitPage = function() {
    const vp = getViewportDimensions();
    const doc = getDocumentDimensions();
    const perPageH = (doc.height / totalPages) || 1100;
    const scale = Math.min((vp.width - 24) / doc.width, (vp.height - 30) / perPageH);
    zoomLevel = Math.max(minZoom, Math.min(maxZoom, scale));
    panX = (vp.width - doc.width * zoomLevel) / 2;
    panY = 15;
    clampViewport(true);
    updateTransform(true);
  };

  // Page Stepper & Smooth Viewport Navigation
  window.scrollToPage = function(pageNum, smooth) {
    if (pageNum < 1 || pageNum > totalPages) return;
    currentPage = pageNum;
    const pageEl = document.getElementById('page-' + pageNum);
    if (pageEl) {
      const pageTopOffset = pageEl.offsetTop;
      panY = -pageTopOffset * zoomLevel + 15;
      clampViewport();
      updateTransform(smooth !== false);
    }
    const counter = document.getElementById('page-counter-stepper');
    if (counter) counter.textContent = currentPage + ' / ' + totalPages;
  };

  function updateCurrentPageFromPan() {
    const pages = document.querySelectorAll('.doc-page');
    if (pages.length === 0) return;
    const vp = getViewportDimensions();
    const docCenterY = (vp.height / 2 - panY) / zoomLevel;

    for (let i = 0; i < pages.length; i++) {
      const pEl = pages[i];
      const top = pEl.offsetTop;
      const bottom = top + pEl.offsetHeight + 24;
      if (docCenterY >= top && docCenterY <= bottom) {
        const pNum = parseInt(pEl.getAttribute('data-page'), 10);
        if (pNum && pNum !== currentPage) {
          currentPage = pNum;
          const counter = document.getElementById('page-counter-stepper');
          if (counter) counter.textContent = currentPage + ' / ' + totalPages;
        }
        break;
      }
    }
  }

  window.prevPage = function() { window.scrollToPage(currentPage - 1); };
  window.nextPage = function() { window.scrollToPage(currentPage + 1); };

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

  // Popover Menus
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
  };

  // Sidebar Controls
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
      const isBM = pageBookmarks.some(b => b.page === i);
      html += `
        <div class="j-thumb-card ${i === currentPage ? 'active' : ''}" onclick="scrollToPage(${i}); closeMultiSidebar();">
          <span class="j-thumb-badge-num">${i}</span>
          <div style="flex: 1;">
            <h5 style="font-size: 0.8rem; font-weight: 700; color: #FFF;">شريحة رقم ${i}</h5>
            <div style="display: flex; gap: 6px; margin-top: 4px; font-size: 0.68rem; color: #94A3B8;">
              ${hasStrokes ? '<span style="color: #38BDF8;">✏️ ملاحظات</span>' : ''}
              ${isBM ? '<span style="color: #34D399;">🔖 إشارة</span>' : ''}
              ${!hasStrokes && !isBM ? '<span>صفحة نقية</span>' : ''}
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
      title: 'شريحة ' + currentPage,
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

  // In-Document Search
  window.executeDocSearch = function() {
    const input = document.getElementById('jnotes-search-input');
    const results = document.getElementById('sidebar-search-results');
    if (!input || !results) return;
    const q = input.value.trim().toLowerCase();
    if (!q) return;

    // Search across real textLayer spans
    let matches = [];
    document.querySelectorAll('.textLayer').forEach(tl => {
      const pageDiv = tl.closest('.doc-page');
      const pNum = pageDiv ? parseInt(pageDiv.getAttribute('data-page'), 10) : 1;
      const text = tl.textContent.toLowerCase();
      if (text.includes(q)) {
        matches.push(pNum);
      }
    });

    if (matches.length > 0) {
      results.innerHTML = matches.map(p => `
        <div class="j-thumb-card" onclick="scrollToPage(${p}); closeMultiSidebar();">
          <span style="color: #38BDF8; font-weight: 800;">ص ${p}</span>
          <div style="font-size: 0.75rem; color: #CBD5E1;">
            تم العثور على كلمة البحث في الشريحة رقم ${p}
          </div>
        </div>
      `).join('');
    } else {
      results.innerHTML = '<p style="color: #94A3B8; font-size: 0.75rem; text-align: center; padding: 10px;">لم يتم العثور على تطابقات لهذه الكلمة.</p>';
    }
  };

  // Export & Download
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
    showToast('تم تصدير الشريحة كصورة PNG عالية الدقة! 🖼️');
  };

  window.exportAnnotatedPdf = function() {
    document.querySelectorAll('.j-popover-menu').forEach(el => el.classList.remove('open'));
    showToast('جاري تحضير ملف PDF للطباعة والتنزيل... 🖨️');
    setTimeout(() => window.print(), 300);
  };

  // Platform Integration
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

  // ==========================================================================
  // DRAWING, HIGHLIGHTING & PRECISION ERASER ENGINE
  // ==========================================================================
  let isDrawing = false;
  let startX = 0, startY = 0;
  let currentStroke = null;

  // Laser Pointer Engine (Ephemeral Neon Glowing Comet-Trail with 650ms Decay)
  let laserPoints = []; // Array of { pageNum, x, y, timestamp }
  let laserRafId = null;

  function startLaserAnimation() {
    if (laserRafId) return;
    renderLaserFrame();
  }

  function renderLaserFrame() {
    const now = Date.now();
    // Decay points older than 650ms
    laserPoints = laserPoints.filter(p => (now - p.timestamp) <= 650);

    const pointsByPage = {};
    for (let i = 0; i < laserPoints.length; i++) {
      const p = laserPoints[i];
      if (!pointsByPage[p.pageNum]) pointsByPage[p.pageNum] = [];
      pointsByPage[p.pageNum].push(p);
    }

    document.querySelectorAll('.draft-canvas').forEach(dc => {
      const pNum = parseInt(dc.id.replace('draft-canvas-', ''), 10);
      const dctx = dc.getContext('2d');
      if (pointsByPage[pNum] && pointsByPage[pNum].length > 0) {
        dctx.clearRect(0, 0, dc.width, dc.height);
        drawLaserCometTrail(dctx, pointsByPage[pNum], now);
      } else {
        if (!currentStroke || (!currentStroke.isStraight && currentStroke.tool !== 'highlighter')) {
          dctx.clearRect(0, 0, dc.width, dc.height);
        }
      }
    });

    if (laserPoints.length > 0) {
      laserRafId = requestAnimationFrame(renderLaserFrame);
    } else {
      laserRafId = null;
    }
  }

  function drawLaserCometTrail(ctx, points, now) {
    if (!points || points.length === 0) return;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (points.length === 1) {
      const pt = points[0];
      const age = now - pt.timestamp;
      const alpha = Math.max(0, 1 - age / 650);
      ctx.globalAlpha = alpha;
      ctx.shadowBlur = 14;
      ctx.shadowColor = '#EF4444';
      ctx.fillStyle = '#F43F5E';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }

    for (let i = 1; i < points.length; i++) {
      const p0 = points[i - 1];
      const p1 = points[i];
      const age = now - p1.timestamp;
      const progress = Math.max(0, 1 - age / 650);

      ctx.save();
      ctx.globalAlpha = progress;

      // Outer glow and stroke
      ctx.shadowBlur = 14;
      ctx.shadowColor = '#EF4444';
      ctx.strokeStyle = '#F43F5E';
      ctx.lineWidth = Math.max(2, 6 * progress);
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.stroke();

      // Inner white core
      ctx.shadowBlur = 0;
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = Math.max(1, 2.5 * progress);
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.stroke();

      ctx.restore();
    }

    // Glowing head dot at latest point
    const head = points[points.length - 1];
    const headAge = now - head.timestamp;
    const headAlpha = Math.max(0, 1 - headAge / 650);
    ctx.save();
    ctx.globalAlpha = headAlpha;
    ctx.shadowBlur = 14;
    ctx.shadowColor = '#EF4444';
    ctx.fillStyle = '#F43F5E';
    ctx.beginPath();
    ctx.arc(head.x, head.y, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(head.x, head.y, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
  }

  function abortActiveDrawing() {
    isDrawing = false;
    currentStroke = null;
    laserPoints = [];
    if (laserRafId) {
      cancelAnimationFrame(laserRafId);
      laserRafId = null;
    }
    document.querySelectorAll('.draft-canvas').forEach(dc => {
      const ctx = dc.getContext('2d');
      ctx.clearRect(0, 0, dc.width, dc.height);
    });
    for (let p = 1; p <= totalPages; p++) {
      if (typeof redrawCanvas === 'function') redrawCanvas(p);
    }
  }

  function initCanvases() {
    const cursor = document.getElementById('jnotes-eraser-cursor');

    document.querySelectorAll('.doc-page').forEach(page => {
      const pageNum = parseInt(page.getAttribute('data-page'), 10);
      const canvas = page.querySelector('.canvas-overlay');
      const draftCanvas = page.querySelector('.draft-canvas');
      if (!canvas || canvas._studioAttached) return;
      canvas._studioAttached = true;

      // Update dynamic eraser circle cursor on pointer move
      const updateCursorPos = (e) => {
        if (currentTool === 'eraser' && cursor) {
          const r = eraserState.radius;
          cursor.style.width = (r * 2) + 'px';
          cursor.style.height = (r * 2) + 'px';
          cursor.style.left = e.clientX + 'px';
          cursor.style.top = e.clientY + 'px';
          cursor.style.display = 'block';
        }
      };

      const onStart = (e) => {
        if (currentTool === 'pan') return;
        if (Date.now() < preventDrawUntil) return;
        if (e.touches && e.touches.length >= 2) return;
        const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
        const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
        let pt = getCanvasPoint(e, canvas);
        if (isRulerActive && (currentTool === 'pen' || currentTool === 'highlighter')) {
          pt = snapPointToRuler(pt, canvas, clientX, clientY);
        }
        isDrawing = true;
        startX = pt.x;
        startY = pt.y;

        if (currentTool === 'eraser') {
          eraseAt(pageNum, pt.x, pt.y);
        } else if (currentTool === 'text') {
          isDrawing = false;
          createNewTextBox(pageNum, clientX, clientY);
        } else if (currentTool === 'laser') {
          laserPoints.push({ pageNum, x: pt.x, y: pt.y, timestamp: Date.now() });
          startLaserAnimation();
        } else if (currentTool === 'pen') {
          currentStroke = {
            id: 'st_' + Date.now(),
            tool: 'pen',
            color: penState.color,
            strokeWidth: penState.width * 5, // mm to px on high-dpi canvas
            opacity: 1.0,
            isStraight: penState.isStraight,
            points: [{ x: pt.x, y: pt.y }]
          };
          if (!pageStrokes[pageNum]) pageStrokes[pageNum] = [];
        } else if (currentTool === 'highlighter') {
          currentStroke = {
            id: 'hl_' + Date.now(),
            tool: 'highlighter',
            color: highlighterState.color,
            strokeWidth: highlighterState.width * 4.5, // wide highlighter
            opacity: highlighterState.opacity || 0.38,
            isStraight: highlighterState.isStraight,
            points: [{ x: pt.x, y: pt.y }]
          };
          if (!pageStrokes[pageNum]) pageStrokes[pageNum] = [];
        }
      };

      const onMove = (e) => {
        updateCursorPos(e);
        if (!isDrawing) return;
        const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
        const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
        let pt = getCanvasPoint(e, canvas);
        if (isRulerActive && (currentTool === 'pen' || currentTool === 'highlighter')) {
          pt = snapPointToRuler(pt, canvas, clientX, clientY);
        }

        if (currentTool === 'eraser') {
          eraseAt(pageNum, pt.x, pt.y);
        } else if (currentTool === 'laser') {
          laserPoints.push({ pageNum, x: pt.x, y: pt.y, timestamp: Date.now() });
          startLaserAnimation();
        } else if (currentStroke) {
          if (currentStroke.isStraight) {
            // GLITCH-FREE STRAIGHT LINE DRAFTING:
            if (draftCanvas) {
              const dctx = draftCanvas.getContext('2d');
              dctx.clearRect(0, 0, draftCanvas.width, draftCanvas.height);
              drawSingleSegment(dctx, startX, startY, pt.x, pt.y, currentStroke);
            }
          } else if (currentStroke.tool === 'highlighter') {
            // REAL TRANSLUCENT HIGHLIGHTER:
            currentStroke.points.push({ x: pt.x, y: pt.y });
            if (draftCanvas) {
              const dctx = draftCanvas.getContext('2d');
              dctx.clearRect(0, 0, draftCanvas.width, draftCanvas.height);
              drawPermanentStroke(draftCanvas, currentStroke);
            }
          } else {
            // Smooth freehand drawing on canvas-overlay
            currentStroke.points.push({ x: pt.x, y: pt.y });
            drawStrokeIncrement(canvas, currentStroke);
          }
        }
      };

      const onEnd = (e) => {
        if (!isDrawing) return;
        isDrawing = false;

        if (currentTool === 'laser') {
          // Ephemeral trail decays automatically via rAF, never saved to localStorage
          return;
        }

        if (currentStroke) {
          const clientX = e.clientX !== undefined ? e.clientX : (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : 0);
          const clientY = e.clientY !== undefined ? e.clientY : (e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientY : 0);
          let pt = getCanvasPoint(e, canvas);
          if (isRulerActive && (currentTool === 'pen' || currentTool === 'highlighter')) {
            pt = snapPointToRuler(pt, canvas, clientX, clientY);
          }

          if (currentStroke.isStraight) {
            // Finish straight line: clear draft canvas and commit clean 2-point line
            if (draftCanvas) {
              const dctx = draftCanvas.getContext('2d');
              dctx.clearRect(0, 0, draftCanvas.width, draftCanvas.height);
            }
            currentStroke.points = [{ x: startX, y: startY }, { x: pt.x, y: pt.y }];
            pageStrokes[pageNum].push(currentStroke);
            drawPermanentStroke(canvas, currentStroke);
          } else if (currentStroke.tool === 'highlighter') {
            // Commit clean single-path highlighter stroke to canvas-overlay
            if (draftCanvas) {
              const dctx = draftCanvas.getContext('2d');
              dctx.clearRect(0, 0, draftCanvas.width, draftCanvas.height);
            }
            if (currentStroke.points.length >= 2) {
              pageStrokes[pageNum].push(currentStroke);
              drawPermanentStroke(canvas, currentStroke);
            }
          } else if (currentStroke.points.length > 0) {
            pageStrokes[pageNum].push(currentStroke);
          }
          currentStroke = null;
          saveAnnotations();
        }
      };

      canvas.addEventListener('mousedown', onStart);
      canvas.addEventListener('mousemove', onMove);
      canvas.addEventListener('mouseup', onEnd);
      canvas.addEventListener('mouseleave', () => {
        if (cursor) cursor.style.display = 'none';
      });

      // Mobile Touch Handling: 1 finger draws/erases, 2 fingers abort drawing and bubble to gesture camera
      canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length >= 2) {
          abortActiveDrawing();
          return; // Allow event to bubble to viewport gesture engine
        }
        if (Date.now() < preventDrawUntil) {
          e.preventDefault();
          return;
        }
        if (currentTool === 'pan') return;
        if (e.touches.length === 1) {
          e.preventDefault();
          updateCursorPos(e.touches[0]);
          onStart(e.touches[0]);
        }
      }, { passive: false });

      canvas.addEventListener('touchmove', (e) => {
        if (e.touches.length >= 2) {
          abortActiveDrawing();
          return; // Allow event to bubble to viewport gesture engine
        }
        if (currentTool === 'pan') return;
        if (e.touches.length === 1 && isDrawing) {
          e.preventDefault();
          updateCursorPos(e.touches[0]);
          onMove(e.touches[0]);
        }
      }, { passive: false });

      canvas.addEventListener('touchend', (e) => {
        if (currentTool === 'pan') return;
        if (cursor) cursor.style.display = 'none';
        if (isDrawing && e.changedTouches && e.changedTouches.length > 0) {
          onEnd(e.changedTouches[0]);
        }
      });
    });
  }

  function getCanvasPoint(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  }

  // Draw a single straight line on draft or final canvas
  function drawSingleSegment(ctx, x1, y1, x2, y2, st) {
    ctx.save();
    ctx.strokeStyle = st.color;
    ctx.lineWidth = st.strokeWidth;
    ctx.lineCap = (st.tool === 'highlighter') ? 'square' : 'round';
    ctx.lineJoin = (st.tool === 'highlighter') ? 'bevel' : 'round';
    ctx.globalAlpha = st.opacity || 1.0;

    if (st.tool === 'highlighter') {
      ctx.globalCompositeOperation = 'multiply';
    }

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  }

  // Draw incremental smooth freehand stroke segment
  function drawStrokeIncrement(canvas, st) {
    const ctx = canvas.getContext('2d');
    const pts = st.points;
    const len = pts.length;
    if (len < 2) return;

    ctx.save();
    ctx.strokeStyle = st.color;
    ctx.lineWidth = st.strokeWidth;
    ctx.lineCap = (st.tool === 'highlighter') ? 'square' : 'round';
    ctx.lineJoin = (st.tool === 'highlighter') ? 'bevel' : 'round';
    ctx.globalAlpha = st.opacity || 1.0;

    if (st.tool === 'highlighter') {
      ctx.globalCompositeOperation = 'multiply';
    }

    ctx.beginPath();
    if (len === 2) {
      ctx.moveTo(pts[0].x, pts[0].y);
      ctx.lineTo(pts[1].x, pts[1].y);
    } else {
      const p1 = pts[len - 2];
      const p2 = pts[len - 1];
      const p0 = pts[len - 3];
      const xc1 = (p0.x + p1.x) / 2;
      const yc1 = (p0.y + p1.y) / 2;
      const xc2 = (p1.x + p2.x) / 2;
      const yc2 = (p1.y + p2.y) / 2;
      ctx.moveTo(xc1, yc1);
      ctx.quadraticCurveTo(p1.x, p1.y, xc2, yc2);
    }
    ctx.stroke();
    ctx.restore();
  }

  // Draw full permanent stroke (used on redraw or straight line completion)
  function drawPermanentStroke(canvas, st) {
    const ctx = canvas.getContext('2d');
    const pts = st.points;
    if (!pts || pts.length < 2) return;

    ctx.save();
    ctx.strokeStyle = st.color;
    ctx.lineWidth = st.strokeWidth;
    ctx.lineCap = (st.tool === 'highlighter') ? 'square' : 'round';
    ctx.lineJoin = (st.tool === 'highlighter') ? 'bevel' : 'round';
    ctx.globalAlpha = st.opacity || 1.0;

    if (st.tool === 'highlighter') {
      ctx.globalCompositeOperation = 'multiply';
    }

    ctx.beginPath();
    if (st.isStraight || pts.length === 2) {
      ctx.moveTo(pts[0].x, pts[0].y);
      ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
    } else if (st.isSegmentSplitted || st.tool === 'highlighter') {
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) {
        ctx.lineTo(pts[i].x, pts[i].y);
      }
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
    strokes.forEach(st => drawPermanentStroke(canvas, st));
  }

  // ==========================================================================
  // PRECISION ERASER: OBJECT VS PARTIAL / SEGMENT ERASER
  // ==========================================================================
  function distSq(p1, p2) {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    return dx * dx + dy * dy;
  }

  function distToSegmentSquared(p, a, b) {
    const l2 = distSq(a, b);
    if (l2 === 0) return distSq(p, a);
    let t = ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    const proj = { x: a.x + t * (b.x - a.x), y: a.y + t * (b.y - a.y) };
    return distSq(p, proj);
  }

  function eraseAt(pageNum, cx, cy) {
    const strokes = pageStrokes[pageNum] || [];
    const radius = eraserState.radius * 2; // radius in high-dpi canvas units
    const radiusSq = radius * radius;
    let modified = false;

    if (eraserState.mode === 'object') {
      // OBJECT ERASER: Delete entire stroke if any segment is within radius
      const initialCount = strokes.length;
      pageStrokes[pageNum] = strokes.filter(st => {
        const pts = st.points;
        if (!pts || pts.length === 0) return false;
        if (pts.length === 1) return distSq(pts[0], { x: cx, y: cy }) > radiusSq;
        for (let i = 0; i < pts.length - 1; i++) {
          if (distToSegmentSquared({ x: cx, y: cy }, pts[i], pts[i + 1]) <= radiusSq) {
            return false; // touched! delete stroke
          }
        }
        return true; // keep
      });
      if (pageStrokes[pageNum].length !== initialCount) {
        modified = true;
      }
    } else {
      // PARTIAL / SEGMENT ERASER: Densely subdivide segments & clean cut without warping
      const nextStrokes = [];
      strokes.forEach(st => {
        const pts = st.points;
        if (!pts || pts.length === 0) return;

        // Check if stroke touches eraser circle
        let touched = false;
        if (pts.length === 1) {
          touched = (distSq(pts[0], { x: cx, y: cy }) <= radiusSq);
        } else {
          for (let i = 0; i < pts.length - 1; i++) {
            if (distToSegmentSquared({ x: cx, y: cy }, pts[i], pts[i + 1]) <= radiusSq) {
              touched = true;
              break;
            }
          }
        }

        if (!touched) {
          nextStrokes.push(st);
          return;
        }

        modified = true;

        // Densely interpolate points (every 3px)
        const densePoints = [];
        for (let i = 0; i < pts.length - 1; i++) {
          const p1 = pts[i];
          const p2 = pts[i + 1];
          const d = Math.hypot(p2.x - p1.x, p2.y - p1.y);
          const steps = Math.max(1, Math.ceil(d / 3));
          for (let s = 0; s < steps; s++) {
            const frac = s / steps;
            densePoints.push({
              x: p1.x + frac * (p2.x - p1.x),
              y: p1.y + frac * (p2.y - p1.y)
            });
          }
        }
        densePoints.push(pts[pts.length - 1]);

        // Split into runs of points strictly outside the eraser circle
        let currentRun = [];
        densePoints.forEach(pt => {
          if (distSq(pt, { x: cx, y: cy }) > radiusSq) {
            currentRun.push(pt);
          } else {
            if (currentRun.length >= 2) {
              nextStrokes.push({
                ...st,
                id: 'st_split_' + Date.now() + '_' + Math.random(),
                isStraight: false,
                isSegmentSplitted: true,
                points: currentRun
              });
            }
            currentRun = [];
          }
        });
        if (currentRun.length >= 2) {
          nextStrokes.push({
            ...st,
            id: 'st_split_' + Date.now() + '_' + Math.random(),
            isStraight: false,
            isSegmentSplitted: true,
            points: currentRun
          });
        }
      });

      if (modified) {
        pageStrokes[pageNum] = nextStrokes;
      }
    }

    if (modified) {
      redrawCanvas(pageNum);
      saveAnnotations();
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

  // Text Box Creation (Pure Typographic Borderless Freehand Text)
  function createNewTextBox(pageNum, clientX, clientY) {
    const pageEl = document.getElementById('page-' + pageNum);
    if (!pageEl) return;

    // Zero Page Shift: Map directly to unscaled document coordinates on pageEl
    const pageRect = pageEl.getBoundingClientRect();
    const unscaledLeft = (clientX - pageRect.left) / zoomLevel;
    const unscaledTop = (clientY - pageRect.top) / zoomLevel;

    const box = document.createElement('div');
    box.className = 'jnotes-text-box';
    box.contentEditable = 'true';
    box.spellcheck = false;
    box.style.left = unscaledLeft + 'px';
    box.style.top = unscaledTop + 'px';
    box.style.color = penState.color || '#F8FAFC';
    box.setAttribute('data-placeholder', 'اكتب هنا...');

    box.addEventListener('blur', function() {
      if (!box.textContent.trim()) {
        box.remove();
      }
      saveAnnotations();
    });

    box.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        box.blur();
      }
    });

    pageEl.appendChild(box);

    // CRITICAL UX FIX: Always call preventScroll: true to eliminate violent page shifts
    try {
      box.focus({ preventScroll: true });
    } catch (err) {
      box.focus();
    }
  }

  // Persistence & Auto-Save
  function saveAnnotations() {
    const dot = document.getElementById('auto-save-dot');
    const text = document.getElementById('auto-save-text');

    if (dot) dot.classList.add('saving');
    if (text) text.textContent = 'جاري الحفظ...';

    const docId = currentDoc?.id || 'sheet_doc';

    // Collect all text boxes
    const texts = [];
    document.querySelectorAll('.doc-page').forEach(page => {
      const pNum = parseInt(page.getAttribute('data-page'), 10);
      page.querySelectorAll('.jnotes-text-box').forEach(tb => {
        const str = tb.textContent.trim();
        if (str) {
          texts.push({
            page: pNum,
            left: tb.style.left,
            top: tb.style.top,
            color: tb.style.color,
            html: tb.innerHTML
          });
        }
      });
    });

    const payload = {
      version: 2,
      docId: docId,
      strokes: pageStrokes,
      texts: texts,
      bookmarks: pageBookmarks,
      savedAt: Date.now()
    };

    try {
      localStorage.setItem('kf_doc_annotations_' + docId, JSON.stringify(payload));
      setTimeout(() => {
        if (dot) dot.classList.remove('saving');
        if (text) text.textContent = 'تم الحفظ تلقائياً';
      }, 350);
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
        if (data.bookmarks) pageBookmarks = data.bookmarks;
        for (let p in pageStrokes) {
          redrawCanvas(p);
        }
        if (data.texts && Array.isArray(data.texts)) {
          document.querySelectorAll('.jnotes-text-box').forEach(b => b.remove());
          data.texts.forEach(t => {
            const pageEl = document.getElementById('page-' + t.page);
            if (!pageEl) return;
            const box = document.createElement('div');
            box.className = 'jnotes-text-box';
            box.contentEditable = 'true';
            box.spellcheck = false;
            box.style.left = t.left;
            box.style.top = t.top;
            box.style.color = t.color || '#F8FAFC';
            box.setAttribute('data-placeholder', 'اكتب هنا...');
            box.innerHTML = t.html || '';
            box.addEventListener('blur', function() {
              if (!box.textContent.trim()) box.remove();
              saveAnnotations();
            });
            box.addEventListener('keydown', function(e) {
              if (e.key === 'Escape') box.blur();
            });
            pageEl.appendChild(box);
          });
        }
      }
    } catch (e) {}
  }

  // ==========================================================================
  // HIGH-DPI MULTI-PAGE PDF.JS RENDERER WITH REAL SELECTABLE TEXT LAYER
  // ==========================================================================
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

      let maxPageW = 850;

      for (let p = 1; p <= numPages; p++) {
        const pdfPage = await pdf.getPage(p);

        // High-DPI Resolution: Render at 2.0x base scale for razor-sharp text
        const baseScale = 2.0;
        const viewport = pdfPage.getViewport({ scale: baseScale });
        const cssViewport = pdfPage.getViewport({ scale: 1.0 });
        if (cssViewport.width > maxPageW) maxPageW = cssViewport.width;

        const pageDiv = document.createElement('div');
        pageDiv.className = 'doc-page pdf-page-rendered';
        pageDiv.id = 'page-' + p;
        pageDiv.setAttribute('data-page', p);
        pageDiv.style.width = cssViewport.width + 'px';
        pageDiv.style.maxWidth = '100%';
        pageDiv.style.aspectRatio = cssViewport.width + ' / ' + cssViewport.height;
        pageDiv.style.position = 'relative';

        // 1. PDF Canvas Background (z-index: 1)
        const pdfCanvas = document.createElement('canvas');
        pdfCanvas.className = 'pdf-render-canvas';
        pdfCanvas.width = viewport.width;
        pdfCanvas.height = viewport.height;
        pdfCanvas.style.width = '100%';
        pdfCanvas.style.height = '100%';
        pdfCanvas.style.position = 'absolute';
        pdfCanvas.style.top = '0';
        pdfCanvas.style.left = '0';
        pdfCanvas.style.zIndex = '1';

        // 2. Real Selectable PDF TextLayer (z-index: 2)
        const textLayerDiv = document.createElement('div');
        textLayerDiv.className = 'textLayer';
        textLayerDiv.style.width = '100%';
        textLayerDiv.style.height = '100%';
        textLayerDiv.style.position = 'absolute';
        textLayerDiv.style.top = '0';
        textLayerDiv.style.left = '0';
        textLayerDiv.style.zIndex = '2';

        // 3. Annotation Canvas Overlay (z-index: 5)
        const overlayCanvas = document.createElement('canvas');
        overlayCanvas.className = 'canvas-overlay';
        overlayCanvas.id = 'canvas-' + p;
        overlayCanvas.width = viewport.width;
        overlayCanvas.height = viewport.height;
        overlayCanvas.style.width = '100%';
        overlayCanvas.style.height = '100%';
        overlayCanvas.style.position = 'absolute';
        overlayCanvas.style.top = '0';
        overlayCanvas.style.left = '0';
        overlayCanvas.style.zIndex = '5';
        overlayCanvas.style.pointerEvents = (currentTool === 'pan') ? 'none' : 'auto';

        // 4. Straight Line Draft Preview Canvas (z-index: 6)
        const draftCanvas = document.createElement('canvas');
        draftCanvas.className = 'draft-canvas';
        draftCanvas.id = 'draft-canvas-' + p;
        draftCanvas.width = viewport.width;
        draftCanvas.height = viewport.height;
        draftCanvas.style.width = '100%';
        draftCanvas.style.height = '100%';
        draftCanvas.style.position = 'absolute';
        draftCanvas.style.top = '0';
        draftCanvas.style.left = '0';
        draftCanvas.style.zIndex = '6';
        draftCanvas.style.pointerEvents = 'none';

        pageDiv.appendChild(pdfCanvas);
        pageDiv.appendChild(textLayerDiv);
        pageDiv.appendChild(overlayCanvas);
        pageDiv.appendChild(draftCanvas);
        pagesWrapper.appendChild(pageDiv);

        // Render Canvas
        await pdfPage.render({
          canvasContext: pdfCanvas.getContext('2d'),
          viewport: viewport
        }).promise;

        // Render PDF.js TextLayer
        try {
          const textContent = await pdfPage.getTextContent();
          if (window.pdfjsLib && typeof window.pdfjsLib.renderTextLayer === 'function') {
            await window.pdfjsLib.renderTextLayer({
              textContentSource: textContent,
              container: textLayerDiv,
              viewport: cssViewport,
              textDivs: []
            }).promise;
          }
        } catch (err) {
          console.warn('TextLayer render error:', err);
        }
      }

      docNaturalWidth = maxPageW;
      if (pagesWrapper) {
        pagesWrapper.style.width = docNaturalWidth + 'px';
      }
      initCanvases();
      loadSavedAnnotations();
      window.fitWidth();
    } catch (e) {
      console.warn('PDF.js render failed, using fallback slides:', e);
      renderPlaceholderPages(currentDoc, totalPages);
    }
  }

  // Fallback Academic Sheet Page Generator
  function renderPlaceholderPages(doc, count) {
    const pagesWrapper = document.getElementById('jnotes-pages-wrapper');
    if (!pagesWrapper) return;
    pagesWrapper.innerHTML = '';
    const pageWidth = 850;
    const pageHeight = 1150;
    docNaturalWidth = pageWidth;
    pagesWrapper.style.width = pageWidth + 'px';
    totalPages = Math.max(1, count || 1);

    const stepper = document.getElementById('page-counter-stepper');
    if (stepper) stepper.textContent = '1 / ' + totalPages;
    const totalEl = document.getElementById('sidebar-total-pages');
    if (totalEl) totalEl.textContent = totalPages;

    for (let p = 1; p <= totalPages; p++) {
      const pageDiv = document.createElement('div');
      pageDiv.className = 'doc-page pdf-page-rendered';
      pageDiv.id = 'page-' + p;
      pageDiv.setAttribute('data-page', p);
      pageDiv.style.width = pageWidth + 'px';
      pageDiv.style.height = pageHeight + 'px';
      pageDiv.style.position = 'relative';

      const bgCanvas = document.createElement('canvas');
      bgCanvas.className = 'pdf-render-canvas';
      bgCanvas.width = pageWidth * 2;
      bgCanvas.height = pageHeight * 2;
      bgCanvas.style.width = '100%';
      bgCanvas.style.height = '100%';
      bgCanvas.style.position = 'absolute';
      bgCanvas.style.top = '0';
      bgCanvas.style.left = '0';
      bgCanvas.style.zIndex = '1';
      const bgCtx = bgCanvas.getContext('2d');
      bgCtx.fillStyle = '#FFFFFF';
      bgCtx.fillRect(0, 0, bgCanvas.width, bgCanvas.height);
      bgCtx.fillStyle = '#E2E8F0';
      // Light grid lines
      bgCtx.strokeStyle = '#F1F5F9';
      bgCtx.lineWidth = 1.5;
      for (let y = 60; y < bgCanvas.height; y += 40) {
        bgCtx.beginPath();
        bgCtx.moveTo(40, y);
        bgCtx.lineTo(bgCanvas.width - 40, y);
        bgCtx.stroke();
      }
      bgCtx.fillStyle = '#94A3B8';
      bgCtx.font = 'bold 32px sans-serif';
      bgCtx.fillText('صفحة دراسية رقم ' + p, 50, 48);

      const overlayCanvas = document.createElement('canvas');
      overlayCanvas.className = 'canvas-overlay';
      overlayCanvas.id = 'canvas-' + p;
      overlayCanvas.width = pageWidth * 2;
      overlayCanvas.height = pageHeight * 2;
      overlayCanvas.style.width = '100%';
      overlayCanvas.style.height = '100%';
      overlayCanvas.style.position = 'absolute';
      overlayCanvas.style.top = '0';
      overlayCanvas.style.left = '0';
      overlayCanvas.style.zIndex = '5';
      overlayCanvas.style.pointerEvents = (currentTool === 'pan') ? 'none' : 'auto';

      const draftCanvas = document.createElement('canvas');
      draftCanvas.className = 'draft-canvas';
      draftCanvas.id = 'draft-canvas-' + p;
      draftCanvas.width = pageWidth * 2;
      draftCanvas.height = pageHeight * 2;
      draftCanvas.style.width = '100%';
      draftCanvas.style.height = '100%';
      draftCanvas.style.position = 'absolute';
      draftCanvas.style.top = '0';
      draftCanvas.style.left = '0';
      draftCanvas.style.zIndex = '6';
      draftCanvas.style.pointerEvents = 'none';

      pageDiv.appendChild(bgCanvas);
      pageDiv.appendChild(overlayCanvas);
      pageDiv.appendChild(draftCanvas);
      pagesWrapper.appendChild(pageDiv);
    }

    initCanvases();
    loadSavedAnnotations();
    window.fitWidth();
  }

  // ==========================================================================
  // TWO-FINGER PINCH-TO-ZOOM & PAN GESTURE ENGINE (Unified 2D Camera & Physics)
  // ==========================================================================
  let isGesturePinching = false;
  let isGesturePanning = false;
  let startPinchDist = 0;
  let startPinchZoom = 1.0;
  let focalDocX = 0;
  let focalDocY = 0;
  let lastPanPoint = { x: 0, y: 0 };
  let preventDrawUntil = 0;

  // Smooth Inertial Momentum Physics State
  let lastTouchTime = 0;
  let lastTouchX = 0;
  let lastTouchY = 0;
  let velocityX = 0;
  let velocityY = 0;
  let momentumRafId = null;

  function stopMomentum() {
    if (momentumRafId) {
      cancelAnimationFrame(momentumRafId);
      momentumRafId = null;
    }
  }

  function startMomentum(vx, vy) {
    stopMomentum();
    let currentVx = vx;
    let currentVy = vy;

    function step() {
      currentVx *= 0.92;
      currentVy *= 0.92;

      panX += currentVx;
      panY += currentVy;

      clampViewport(false);
      updateTransform(false);
      updateCurrentPageFromPan();

      if (Math.abs(currentVx) > 0.35 || Math.abs(currentVy) > 0.35) {
        momentumRafId = requestAnimationFrame(step);
      } else {
        momentumRafId = null;
        settleViewport();
      }
    }
    momentumRafId = requestAnimationFrame(step);
  }

  function initGestureEngine() {
    const viewport = document.getElementById('jnotes-viewport');
    if (!viewport || viewport._gestureAttached) return;
    viewport._gestureAttached = true;

    function getTouchDist(t1, t2) {
      return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
    }

    const onTouchStart = (e) => {
      stopMomentum();
      const vRect = viewport.getBoundingClientRect();

      if (e.touches.length >= 2) {
        // TWO FINGERS: Always pinch & pan across all modes!
        e.preventDefault();
        abortActiveDrawing();

        isGesturePinching = true;
        isGesturePanning = false;

        const t1 = e.touches[0];
        const t2 = e.touches[1];
        startPinchDist = getTouchDist(t1, t2);
        startPinchZoom = zoomLevel;

        const midX = (t1.clientX + t2.clientX) / 2 - vRect.left;
        const midY = (t1.clientY + t2.clientY) / 2 - vRect.top;

        // Document coordinate locked under midpoint
        focalDocX = (midX - panX) / zoomLevel;
        focalDocY = (midY - panY) / zoomLevel;

        updateTransform(false);

        const cursor = document.getElementById('jnotes-eraser-cursor');
        if (cursor) cursor.style.display = 'none';
      } else if (e.touches.length === 1 && currentTool === 'pan') {
        // ONE FINGER IN READING MODE: Direct 1:1 pan with velocity tracking!
        isGesturePanning = true;
        isGesturePinching = false;
        lastPanPoint = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        lastTouchTime = performance.now();
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
        velocityX = 0;
        velocityY = 0;
        updateTransform(false);
      }
    };

    const onTouchMove = (e) => {
      const vRect = viewport.getBoundingClientRect();

      if (e.touches.length >= 2 && isGesturePinching) {
        e.preventDefault();

        const t1 = e.touches[0];
        const t2 = e.touches[1];
        const currDist = getTouchDist(t1, t2);

        // Calculate new zoom level
        let newZoom = zoomLevel;
        if (startPinchDist > 10) {
          const ratio = currDist / startPinchDist;
          newZoom = Math.max(minZoom, Math.min(maxZoom, startPinchZoom * ratio));
          zoomLevel = newZoom;
        }

        // Current midpoint in viewport
        const currMidX = (t1.clientX + t2.clientX) / 2 - vRect.left;
        const currMidY = (t1.clientY + t2.clientY) / 2 - vRect.top;

        // Keep the exact document point locked under the current finger midpoint:
        panX = currMidX - focalDocX * newZoom;
        panY = currMidY - focalDocY * newZoom;

        clampViewport(false);
        updateTransform(false);
        updateCurrentPageFromPan();
      } else if (e.touches.length === 1 && isGesturePanning && currentTool === 'pan') {
        e.preventDefault();
        const t = e.touches[0];
        const dx = t.clientX - lastPanPoint.x;
        const dy = t.clientY - lastPanPoint.y;
        lastPanPoint = { x: t.clientX, y: t.clientY };

        const now = performance.now();
        const dt = now - lastTouchTime;
        if (dt > 8) {
          const vx = (t.clientX - lastTouchX) / dt;
          const vy = (t.clientY - lastTouchY) / dt;
          velocityX = velocityX * 0.4 + vx * 0.6;
          velocityY = velocityY * 0.4 + vy * 0.6;
          lastTouchX = t.clientX;
          lastTouchY = t.clientY;
          lastTouchTime = now;
        }

        panX += dx;
        panY += dy;

        clampViewport(false);
        updateTransform(false);
        updateCurrentPageFromPan();
      }
    };

    const onTouchEnd = (e) => {
      if (isGesturePinching && e.touches.length < 2) {
        isGesturePinching = false;
        preventDrawUntil = Date.now() + 320; // 320ms cooldown prevents accidental marks on lifting fingers
        settleViewport();
      }
      if (isGesturePanning && e.touches.length === 0) {
        isGesturePanning = false;
        if (Math.abs(velocityX) > 0.1 || Math.abs(velocityY) > 0.1) {
          startMomentum(velocityX * 16, velocityY * 16);
        } else {
          settleViewport();
        }
      }
    };

    viewport.addEventListener('touchstart', onTouchStart, { passive: false });
    viewport.addEventListener('touchmove', onTouchMove, { passive: false });
    viewport.addEventListener('touchend', onTouchEnd, { passive: false });
    viewport.addEventListener('touchcancel', onTouchEnd, { passive: false });

    // Desktop Mouse Wheel & Trackpad Pinch
    viewport.addEventListener('wheel', (e) => {
      e.preventDefault();
      stopMomentum();

      if (e.ctrlKey || e.metaKey) {
        const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
        zoomAtPoint(zoomLevel * zoomFactor, e.clientX, e.clientY, false);
      } else {
        panX -= e.deltaX;
        panY -= e.deltaY;
        clampViewport(false);
        updateTransform(false);
        updateCurrentPageFromPan();
      }
    }, { passive: false });
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
      currentTool = 'pan'; // Start in Reading/Browse mode!
      pageStrokes = {};
      pageBookmarks = [];

      // Inject Dedicated Studio CSS once into head
      let styleEl = document.getElementById('jnotes-studio-styles');
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'jnotes-studio-styles';
        styleEl.textContent = STUDIO_STYLES;
        document.head.appendChild(styleEl);
      }

      // Check for local IndexedDB PDF file
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

      // Lock body scrolling and scroll window to top
      document.body.style.overflow = 'hidden';
      window.scrollTo(0, 0);

      // Initialize Tools, Canvases, Gestures & Ruler
      renderContextBar();
      initCanvases();
      initGestureEngine();
      initRulerInteractions();
      loadSavedAnnotations();

      // Render uploaded PDF if available, otherwise render clean academic sheet pages
      if (pdfSourceUrl) {
        loadPdfPages(pdfSourceUrl);
      } else {
        renderPlaceholderPages(currentDoc, totalPages);
      }
    },

    render(container, doc, isAr) {
      return this.renderStudio(container, doc, isAr);
    }
  };

  window.DocumentViewer = DocumentViewer;

})();
