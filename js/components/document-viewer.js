/**
 * KURO FANGS — JNOTES INTERACTIVE NOTE STUDIO & DEDICATED SHEET READER
 * Features Mark Pen Settings (Straight line drawing, Bottom display, Add to pen-box),
 * Line Weight Thickness Slider (0.1mm - 3.0mm), Right Vertical Pen Box,
 * Mobile Touch Drawing, Straight-line Snap, and Instant Auto-Save on Every Action.
 */

const DocumentViewer = {
  currentDoc: null,
  isOpen: false,

  init() {
    // Document viewer initialization
  },

  download(doc) {
    window.STORE.addPoints(10);
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
    const title = doc?.title || doc?.title_ar || doc?.title_en || 'Provisional Restoration & Temporization';
    const msg = isAr 
      ? `تم بدء تنزيل الشيت بنجاح! (+10 نقاط أكاديمية) — [${title}]`
      : `Download started! (+10 pts earned) — [${title}]`;
    window.showToast(msg, { type: 'success', points: 10 });
  },

  generateDocHTML(doc, isAr) {
    const docId = doc.id || 'sh-fixed-provisional';
    const title = doc.title || (isAr ? doc.title_ar : doc.title_en) || 'Provisional Restoration & Temporization';
    const doctor = doc.doctor_name || 'Dr. Hala Alhawij';
    const university = doc.university || 'University of Tripoli - School of Dentistry';
    const year = doc.year || '2025-2026';

    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=3.0, user-scalable=yes" />
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=IBM+Plex+Sans+Arabic:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --brand: #0284C7;
      --brand-dark: #0369A1;
      --paper-bg: #FFFFFF;
      --bg: #12131F;
      --text: #0F172A;
      --text-sub: #475569;
      --highlight-color: rgba(254, 240, 138, 0.6);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'IBM Plex Sans Arabic', 'Inter', sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.6;
      height: 100vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      user-select: none;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
    }

    /* JNotes Standalone Professional Header Toolbar */
    .jnotes-top-bar {
      height: 56px;
      background: #181926;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 14px;
      gap: 10px;
      z-index: 9500;
      flex-shrink: 0;
      user-select: none;
    }

    /* Left Section: Exit & Title */
    .jnotes-left-section {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }

    .jtool-exit-btn {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #F8FAFC;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 0.775rem;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
    }

    .jtool-exit-btn:hover {
      background: rgba(239, 68, 68, 0.15);
      border-color: #EF4444;
      color: #EF4444;
    }

    .jnotes-title-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      max-width: 280px;
    }

    .jnotes-badge {
      background: rgba(2, 132, 199, 0.2);
      color: #38BDF8;
      border: 1px solid rgba(2, 132, 199, 0.4);
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 0.72rem;
      font-weight: 800;
      white-space: nowrap;
    }

    .jnotes-title-text {
      color: #E2E8F0;
      font-size: 0.825rem;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Center Section: Tools */
    .jnotes-center-section {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
    }

    .jnotes-tool-segmented {
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 3px 6px;
      gap: 3px;
    }

    .jtool-icon-btn {
      background: transparent;
      border: none;
      color: #94A3B8;
      width: 30px;
      height: 30px;
      border-radius: 8px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
    }

    .jtool-icon-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #F8FAFC;
    }

    .jnotes-divider {
      width: 1px;
      height: 20px;
      background: rgba(255, 255, 255, 0.12);
      margin: 0 4px;
    }

    .jtool-btn {
      background: transparent;
      border: 1px solid transparent;
      color: #94A3B8;
      padding: 5px 9px;
      border-radius: 8px;
      font-size: 0.775rem;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      transition: all 0.15s ease;
      user-select: none;
      position: relative;
    }

    .jtool-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #F8FAFC;
    }

    .jtool-btn.active {
      background: #0284C7 !important;
      color: #FFFFFF !important;
      border-color: rgba(255, 255, 255, 0.25) !important;
      box-shadow: 0 0 12px rgba(2, 132, 199, 0.5);
    }

    /* Right Section */
    .jnotes-right-section {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-shrink: 0;
    }

    .auto-save-pill {
      background: rgba(16, 185, 129, 0.12);
      color: #34D399;
      border: 1px solid rgba(16, 185, 129, 0.25);
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 0.725rem;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: opacity 0.3s ease;
    }

    .auto-save-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #34D399;
      box-shadow: 0 0 8px #34D399;
    }

    .jnotes-page-nav-pill {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 2px 6px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: #E2E8F0;
      font-size: 0.75rem;
      font-weight: 800;
    }

    .page-nav-arrow {
      background: transparent;
      border: none;
      color: #94A3B8;
      width: 22px;
      height: 22px;
      border-radius: 6px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s ease;
    }

    .page-nav-arrow:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #FFF;
    }

    .jtool-download-btn {
      background: #0284C7;
      color: #FFFFFF;
      border-color: #0284C7;
    }

    .jtool-download-btn:hover {
      background: #0369A1;
      color: #FFFFFF;
    }

    /* Page Index Sliding Overlay Drawer (Matching Spec) */
    .jnotes-sidebar-index {
      position: absolute;
      right: 0;
      top: 56px;
      height: calc(100vh - 56px);
      width: 280px;
      background: #181926;
      border-left: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: -8px 0 35px rgba(0, 0, 0, 0.6);
      transform: translateX(100%);
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 9000;
      display: flex;
      flex-direction: column;
    }

    .jnotes-sidebar-index.open {
      transform: translateX(0);
    }

    .drawer-backdrop {
      position: absolute;
      inset: 0;
      top: 56px;
      background: rgba(0, 0, 0, 0.45);
      backdrop-filter: blur(3px);
      z-index: 8990;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.25s ease;
    }

    .drawer-backdrop.open {
      opacity: 1;
      pointer-events: auto;
    }

    /* Right Vertical Floating Pen Dock (Matching Spec) */
    .jnotes-vertical-dock {
      position: fixed;
      right: 16px;
      top: 76px;
      z-index: 8000;
      background: rgba(255, 255, 255, 0.96);
      backdrop-filter: blur(14px);
      border-radius: 24px;
      padding: 10px 8px;
      box-shadow: 0 12px 35px rgba(0, 0, 0, 0.35);
      display: flex;
      flex-direction: column;
      gap: 10px;
      border: 1px solid rgba(0, 0, 0, 0.12);
      align-items: center;
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
    }

    /* Automatically retract dock when drawer opens so it NEVER collides */
    .jnotes-vertical-dock.dock-retracted {
      transform: translateX(90px);
      opacity: 0;
      pointer-events: none;
    }

    .dock-preset-btn {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      border: 2.5px solid #E2E8F0;
      background: #FFFFFF;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 0.65rem;
      font-weight: 800;
      cursor: pointer;
      transition: transform 0.15s ease, border-color 0.15s ease;
      position: relative;
    }

    .dock-preset-btn:hover, .dock-preset-btn.active {
      transform: scale(1.15);
      border-color: #0284C7;
      box-shadow: 0 0 10px rgba(2, 132, 199, 0.4);
    }

    .dock-preset-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-top: 1px;
    }

    /* JNotes Popups */
    .jnotes-popup-card {
      position: absolute;
      top: 60px;
      background: #FFFFFF;
      color: #0F172A;
      border-radius: 14px;
      padding: 16px 18px;
      box-shadow: 0 15px 40px rgba(0,0,0,0.45);
      z-index: 9600;
      width: 280px;
      border: 1px solid #E2E8F0;
      display: none;
      animation: popupZoom 0.18s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes popupZoom {
      from { opacity: 0; transform: scale(0.92) translateY(-6px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }

    .jnotes-popup-card.open {
      display: block;
    }

    .popup-title {
      font-size: 0.85rem;
      font-weight: 800;
      color: #0F172A;
      margin-bottom: 12px;
      text-align: center;
    }

    .popup-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      font-size: 0.8rem;
    }

    .popup-toggle-switch {
      position: relative;
      width: 38px;
      height: 20px;
      background: #CBD5E1;
      border-radius: 20px;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .popup-toggle-switch.on {
      background: #0284C7;
    }

    .popup-toggle-switch::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      background: #FFF;
      border-radius: 50%;
      top: 2px;
      left: 2px;
      transition: transform 0.2s ease;
    }

    .popup-toggle-switch.on::after {
      transform: translateX(18px);
    }

    .btn-add-penbox {
      width: 100%;
      background: #F8FAFC;
      border: 1px solid #CBD5E1;
      border-radius: 8px;
      padding: 8px;
      font-size: 0.775rem;
      font-weight: 700;
      color: #0284C7;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      margin-top: 8px;
    }

    .btn-add-penbox:hover {
      background: #EFF6FF;
      border-color: #0284C7;
    }

    /* Swatches Color Dots */
    .jnotes-color-dots {
      display: flex;
      align-items: center;
      gap: 4px;
      margin: 0 4px;
      padding: 0 6px;
      border-left: 1px solid rgba(255, 255, 255, 0.12);
      border-right: 1px solid rgba(255, 255, 255, 0.12);
    }

    .color-dot {
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 2px solid transparent;
      cursor: pointer;
      transition: transform 0.15s ease;
    }

    .color-dot:hover, .color-dot.active {
      transform: scale(1.2);
      border-color: #FFFFFF;
    }

    .sidebar-header {
      padding: 14px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      color: #F8FAFC;
      font-size: 0.85rem;
      font-weight: 700;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .sidebar-thumbnails-list {
      flex: 1;
      overflow-y: auto;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .thumb-card {
      background: #232536;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: all 0.15s ease;
    }

    .thumb-card:hover {
      background: #2D3045;
      border-color: rgba(255, 255, 255, 0.2);
    }

    .thumb-card.active {
      border-color: #0284C7;
      background: rgba(2, 132, 199, 0.2);
    }

    .thumb-num {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #0284C7;
      color: #FFF;
      font-size: 0.725rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .thumb-info h5 {
      color: #F8FAFC;
      font-size: 0.75rem;
      font-weight: 700;
    }

    .thumb-info p {
      color: #94A3B8;
      font-size: 0.675rem;
    }

    /* Main Viewport Workspace */
    .jnotes-workspace {
      flex: 1;
      display: flex;
      height: calc(100vh - 56px);
      overflow: hidden;
      position: relative;
    }

    .jnotes-viewport {
      flex: 1;
      height: 100%;
      overflow-y: auto;
      padding: 24px 14px 80px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 24px;
      scroll-behavior: smooth;
      background: #12131F;
      -webkit-overflow-scrolling: touch;
    }

    .doc-page {
      background: var(--paper-bg);
      width: 100%;
      max-width: 840px;
      min-height: 1100px;
      border-radius: 6px;
      box-shadow: 0 15px 45px rgba(0, 0, 0, 0.45);
      padding: 44px 50px;
      position: relative;
      user-select: text;
      direction: ltr;
      text-align: left;
    }

    /* Touch Canvas Overlay */
    .canvas-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 10;
      touch-action: none;
    }

    .canvas-overlay.pen-active {
      pointer-events: auto;
    }

    /* Translucent Highlighted Elements */
    p.highlighted, li.highlighted, h3.highlighted {
      background-color: var(--highlight-color) !important;
      border-radius: 4px;
      padding: 2px 4px;
    }

    /* Floating Drag-&-Drop Sticky Notes */
    .sticky-note-box {
      position: absolute;
      background: #FEF9C3;
      border: 1px solid #F59E0B;
      border-radius: 10px;
      padding: 8px 12px;
      font-size: 0.825rem;
      color: #78350F;
      box-shadow: 0 8px 20px rgba(0,0,0,0.25);
      z-index: 20;
      min-width: 180px;
      direction: rtl;
      text-align: right;
    }

    .sticky-note-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
      border-bottom: 1px dashed rgba(245, 158, 11, 0.4);
      padding-bottom: 4px;
      cursor: move;
    }

    .sticky-note-close {
      background: none;
      border: none;
      color: #B45309;
      font-size: 0.9rem;
      cursor: pointer;
      font-weight: bold;
    }

    .sticky-note-box textarea {
      width: 100%;
      height: 65px;
      background: transparent;
      border: none;
      resize: both;
      font-family: inherit;
      font-size: 0.825rem;
      color: #78350F;
      outline: none;
    }

    /* Page Typography */
    .page-header {
      border-bottom: 2px solid #0284C7;
      padding-bottom: 10px;
      margin-bottom: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .page-header h4 {
      color: #0284C7;
      font-size: 0.85rem;
      font-weight: 800;
      text-transform: uppercase;
    }

    .page-header span {
      font-size: 0.75rem;
      color: var(--text-sub);
    }

    h1.title-main {
      font-size: 2.2rem;
      font-weight: 900;
      color: #0284C7;
      margin-top: 80px;
      margin-bottom: 10px;
      text-align: center;
    }

    h2.title-sub {
      font-size: 1.4rem;
      font-weight: 800;
      color: #0369A1;
      text-align: center;
      margin-bottom: 40px;
    }

    .meta-center {
      text-align: center;
      font-size: 0.95rem;
      color: var(--text-sub);
      margin-bottom: 40px;
    }

    .agenda-box {
      background: #F0F9FF;
      border: 1px solid #BAE6FD;
      border-radius: 10px;
      padding: 20px;
      margin-top: 24px;
    }

    .section-title {
      font-size: 1.1rem;
      font-weight: 800;
      color: #0F172A;
      margin: 20px 0 10px;
      padding-bottom: 4px;
      border-bottom: 1.5px solid #0284C7;
    }

    .bullet-list {
      list-style-type: none;
      padding-left: 0;
      margin-bottom: 14px;
    }

    .bullet-list li {
      position: relative;
      padding-left: 18px;
      margin-bottom: 8px;
      font-size: 0.9rem;
    }

    .bullet-list li::before {
      content: "•";
      color: #0284C7;
      font-size: 1.3rem;
      position: absolute;
      left: 0;
      top: -3px;
    }

    .table-spec {
      width: 100%;
      border-collapse: collapse;
      margin: 14px 0 20px;
      font-size: 0.85rem;
    }

    .table-spec th, .table-spec td {
      border: 1px solid #CBD5E1;
      padding: 8px 12px;
      text-align: left;
    }

    .table-spec th {
      background: #0284C7;
      color: #FFF;
      font-weight: 700;
    }

    .clinical-callout {
      background: #FFFBEB;
      border-left: 4px solid #F59E0B;
      padding: 12px 16px;
      border-radius: 0 8px 8px 0;
      margin: 16px 0;
      font-size: 0.85rem;
      color: #78350F;
    }

    .page-footer {
      position: absolute;
      bottom: 18px;
      left: 50px;
      right: 50px;
      display: flex;
      justify-content: space-between;
      font-size: 0.7rem;
      color: var(--text-sub);
      border-top: 1px solid #E2E8F0;
      padding-top: 8px;
    }
  </style>
</head>
<body>

  <!-- JNotes Standalone Professional Header Toolbar -->
  <div class="jnotes-top-bar">
    <!-- LEFT: Exit Button & Title / Subject Badge -->
    <div class="jnotes-left-section">
      <button class="jtool-exit-btn" id="btn-exit-studio" onclick="exitStudio()" title="العودة لقائمة الشيتات بالمنصة">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        <span>العودة للمنصة</span>
      </button>

      <div class="jnotes-title-pill">
        <span class="jnotes-badge">${doc.subject_name || 'Fixed Prosthodontics'}</span>
        <span class="jnotes-title-text" title="${title}">${title}</span>
      </div>
    </div>

    <!-- CENTER: Segmented Professional Tools with Crisp Vector Icons -->
    <div class="jnotes-center-section">
      <div class="jnotes-tool-segmented">
        <!-- Undo / Redo -->
        <button class="jtool-icon-btn" id="btn-undo" onclick="undoAction()" title="تراجع (Undo)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
        </button>
        <button class="jtool-icon-btn" id="btn-redo" onclick="redoAction()" title="إعادة (Redo)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/></svg>
        </button>

        <div class="jnotes-divider"></div>

        <!-- Read (Pan) -->
        <button class="jtool-btn active" id="tool-pan" onclick="setTool('pan')" title="وضع القراءة والتحديد">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>
          <span>قراءة</span>
        </button>

        <!-- Pen -->
        <button class="jtool-btn" id="tool-pen" onclick="setTool('pen')" title="قلم الملاحظات والتدوين">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
          <span>قلم</span>
        </button>

        <!-- Highlighter (Mark Pen) -->
        <button class="jtool-btn" id="tool-highlighter" onclick="toggleMarkPenMenu(event)" title="تظليل نصوص وملاحظات">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 11-6 6v3h3l6-6"/><path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"/></svg>
          <span>تظليل</span>
        </button>

        <!-- Eraser -->
        <button class="jtool-btn" id="tool-eraser" onclick="setTool('eraser')" title="ممحاة التظليلات والرسومات">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>
          <span>ممحاة</span>
        </button>

        <!-- Straight Line Toggle -->
        <button class="jtool-btn" id="tool-straight-toggle" onclick="toggleStraightLineSetting()" title="الرسم بخط مستقيم">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><circle cx="5" cy="12" r="2" fill="currentColor"/><circle cx="19" cy="12" r="2" fill="currentColor"/></svg>
          <span>مستقيم</span>
        </button>

        <!-- Line Weight Thickness Slider Trigger -->
        <button class="jtool-btn" id="tool-thickness" onclick="toggleThicknessMenu(event)" title="تغيير سمك الخط (0.1mm - 3.0mm)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3" fill="currentColor"/><circle cx="12" cy="12" r="8"/></svg>
          <span id="stroke-label-btn">0.8mm</span>
        </button>

        <!-- Color Palette Picker / Swatches -->
        <div class="jnotes-color-dots" id="color-dots-container">
          <div class="color-dot active" data-color="rgba(254, 240, 138, 0.65)" style="background: #FEF08A;" onclick="setColor('rgba(254, 240, 138, 0.65)')" title="أصفر"></div>
          <div class="color-dot" data-color="rgba(168, 85, 247, 0.65)" style="background: #A855F7;" onclick="setColor('rgba(168, 85, 247, 0.65)')" title="أرجواني"></div>
          <div class="color-dot" data-color="#0284C7" style="background: #0284C7;" onclick="setColor('#0284C7')" title="أزرق حبر"></div>
          <div class="color-dot" data-color="#78350F" style="background: #78350F;" onclick="setColor('#78350F')" title="بني حبر"></div>
          <div class="color-dot" data-color="#16A34A" style="background: #16A34A;" onclick="setColor('#16A34A')" title="أخضر"></div>
          <div class="color-dot" data-color="#0F172A" style="background: #0F172A;" onclick="setColor('#0F172A')" title="أسود"></div>
        </div>
      </div>
    </div>

    <!-- RIGHT: Page Navigation, Index Drawer Toggle, Auto-Save Badge, Download -->
    <div class="jnotes-right-section">
      <!-- Auto Save Badge -->
      <span class="auto-save-pill" id="auto-save-badge">
        <span class="auto-save-dot"></span>
        <span>تم الحفظ تلقائياً</span>
      </span>

      <!-- Page Nav Pill -->
      <div class="jnotes-page-nav-pill">
        <button class="page-nav-arrow" onclick="prevPage()" title="الصفحة السابقة">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
        <span id="page-counter-num">1 / 16</span>
        <button class="page-nav-arrow" onclick="nextPage()" title="الصفحة التالية">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
      </div>

      <!-- Page Index Drawer Button -->
      <button id="btn-toggle-index" class="jtool-btn" onclick="toggleSidebar()" title="عرض فهرس الصفحات المصغرة">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="M14 9h4"/><path d="M14 15h4"/></svg>
        <span>فهرس الصفحات</span>
      </button>

      <!-- Download Button -->
      <button class="jtool-btn jtool-download-btn" onclick="downloadDoc()" title="تنزيل نسخة PDF إلى جهازك">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        <span>تنزيل PDF</span>
      </button>
    </div>

    <!-- POPUP 1: JNotes Line Weight Slider -->
    <div class="jnotes-popup-card" id="popup-thickness">
      <div class="popup-title">Line weight</div>
      <div style="margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 6px;">
          <span>Thickness setting</span>
          <strong id="slider-val-text" style="color: #0284C7;">0.8mm</strong>
        </div>
        <input type="range" id="line-weight-slider" min="0.1" max="3.0" step="0.1" value="0.8" style="width: 100%; accent-color: #0284C7; cursor: pointer;" oninput="updateLineWeight(this.value)" />
      </div>
    </div>

    <!-- POPUP 2: JNotes Mark Pen Settings -->
    <div class="jnotes-popup-card" id="popup-markpen">
      <div class="popup-title">Mark pen</div>
      <div class="popup-row">
        <span>Straight line drawing</span>
        <div class="popup-toggle-switch" id="toggle-straight-line" onclick="toggleStraightLineSetting()"></div>
      </div>
      <div class="popup-row">
        <span>Bottom display</span>
        <div class="popup-toggle-switch on" id="toggle-bottom-display" onclick="toggleBottomDisplaySetting()"></div>
      </div>
      <button class="btn-add-penbox" onclick="addToPenBox()">
        <span>➕ Add to pen-box</span>
      </button>
    </div>
  </div>

  <!-- Right Vertical Floating Pen Dock (Matching Spec) -->
  <div class="jnotes-vertical-dock" id="jnotes-vertical-dock">
    <div class="dock-preset-btn active" onclick="applyPreset('rgba(254, 240, 138, 0.65)', 12, 'highlighter')" title="0.5 قلم تظليل أصفر">
      <span>0.5</span>
      <div class="dock-preset-dot" style="background: #FEF08A;"></div>
    </div>
    <div class="dock-preset-btn" onclick="applyPreset('rgba(168, 85, 247, 0.65)', 12, 'highlighter')" title="0.5 قلم تظليل أرجواني">
      <span>0.5</span>
      <div class="dock-preset-dot" style="background: #A855F7;"></div>
    </div>
    <div class="dock-preset-btn" onclick="applyPreset('#78350F', 3, 'pen')" title="0.8 قلم بني">
      <span>0.8</span>
      <div class="dock-preset-dot" style="background: #78350F;"></div>
    </div>
    <div class="dock-preset-btn" onclick="applyPreset('#0284C7', 2.5, 'pen')" title="0.7 قلم أزرق">
      <span>0.7</span>
      <div class="dock-preset-dot" style="background: #0284C7;"></div>
    </div>
    <div class="dock-preset-btn" onclick="applyPreset('#16A34A', 3, 'pen')" title="0.8 قلم أخضر">
      <span>0.8</span>
      <div class="dock-preset-dot" style="background: #16A34A;"></div>
    </div>
    <div class="dock-preset-btn" onclick="addToPenBox()" title="إضافة القلم الحالي للمفضلة">
      <span>➕</span>
    </div>
  </div>

  <!-- Sliding Overlay Page Index Drawer (Matching Spec) -->
  <div class="drawer-backdrop" id="drawer-backdrop" onclick="closeSidebar()"></div>
  <div class="jnotes-sidebar-index" id="jnotes-sidebar-index">
    <div class="sidebar-header">
      <div style="display: flex; align-items: center; gap: 8px;">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="M14 9h4"/><path d="M14 15h4"/></svg>
        <span>فهرس الشرائح (16)</span>
      </div>
      <button class="jtool-icon-btn" onclick="closeSidebar()" title="إغلاق الفهرس" style="color: #94A3B8;">✕</button>
    </div>
    <div class="sidebar-thumbnails-list">
      ${Array.from({length: 16}, (_, i) => `
        <div class="thumb-card ${i === 0 ? 'active' : ''}" onclick="selectPageAndCloseDrawer(${i + 1})">
          <div class="thumb-num">${i + 1}</div>
          <div class="thumb-info">
            <h5>صفحة ${i + 1}</h5>
            <p>Dental Lecture Slide ${i + 1}</p>
          </div>
        </div>
      `).join('')}
    </div>
  </div>

  <!-- Workspace Container -->
  <div class="jnotes-workspace">

    <!-- Main Scrollable Paper Viewport -->
    <div class="jnotes-viewport" id="jnotes-viewport">

      <!-- PAGE 1 -->
      <div class="doc-page" id="page-1" data-page="1">
        <canvas class="canvas-overlay" id="canvas-1"></canvas>
        <div class="page-header">
          <h4>Fixed Prosthodontics II • Lecture Handout</h4>
          <span>${university}</span>
        </div>

        <h1 class="title-main">ROTARY DENTAL INSTRUMENTS & PROVISIONAL RESTORATIONS</h1>
        <h2 class="title-sub">CLINICAL PROTOCOLS & CONTEMPORARY TECHNIQUES</h2>

        <div class="meta-center">
          <p><strong>${doctor}</strong></p>
          <p>Department of Fixed Prosthodontics</p>
          <p>${university} • Academic Year ${year}</p>
        </div>

        <div class="agenda-box">
          <h3>LECTURE AGENDA & CORE MODULES</h3>
          <ul class="bullet-list">
            <li><strong>Module 1:</strong> Rotary Cutting Instruments, Burs & Diamond Abrasives</li>
            <li><strong>Module 2:</strong> Definition & Requirements of Provisional Restorations</li>
            <li><strong>Module 3:</strong> Classification of Provisional Restorations & Preformed Crowns</li>
            <li><strong>Module 4:</strong> Direct vs. Indirect Fabrication Protocols & Vacuum Shells</li>
            <li><strong>Module 5:</strong> Comparative Analysis of Restorative Resins & Provisional Cements</li>
            <li><strong>Module 6:</strong> Pontic Design, Clinical Troubleshooting, and Exam Review</li>
          </ul>
        </div>

        <div class="page-footer">
          <span>Dr. Hala Alhawij | Fixed Prosthodontics II</span>
          <span>Page 1 of 16</span>
        </div>
      </div>

      <!-- PAGE 2: EXACT CONTENT FROM SCREENSHOTS 1 & 2 -->
      <div class="doc-page" id="page-2" data-page="2">
        <canvas class="canvas-overlay" id="canvas-2"></canvas>
        <div class="page-header">
          <h4>Module 1: Rotary Instruments</h4>
          <span>Provisional Restoration & Temporization</span>
        </div>

        <h3 class="section-title">BUR CUTTING ANGLES & TAPERED FISSURE BURS</h3>
        <p style="margin-bottom: 12px;"><strong>Rake Angle Classifications:</strong></p>
        <ul class="bullet-list">
          <li><strong>A = Positive Rake Angle:</strong> Increases cutting efficiency in soft structures.</li>
          <li><strong>B = Radial or Neutral Rake Angle:</strong> Standard balanced cutting mechanism.</li>
          <li><strong>C = Negative Rake Angle:</strong> Increases blade strength for hard metal/enamel reduction.</li>
        </ul>

        <div class="clinical-callout">
          <strong>Tapered Fissure Bur:</strong> A common bur used in fixed prosthesis preparation. Used for:
          <ul class="bullet-list" style="margin-top: 8px;">
            <li>Adding additional retentive features in complete/partial crowns (grooves or boxes).</li>
            <li>Finishing (smoothing) prepared axial walls.</li>
            <li>Preparing proximal boxes, bevels, and occlusal reduction in Class II inlays.</li>
          </ul>
        </div>

        <h3 class="section-title">DIAMOND ABRASIVES IN FIXED PROSTHODONTICS</h3>
        <p style="margin-bottom: 12px;">The second major category of rotary dental cutting instruments involves abrasive rather than blade cutting. The mechanism of abrasion is a grinding operation.</p>
        <p style="margin-bottom: 14px;"><strong>Abrasion:</strong> The wearing away of a substance or structure (such as the skin or the teeth) through an unusual or abnormal mechanical process.</p>

        <p><strong>Structure of Diamond Instruments:</strong></p>
        <p>Diamond instruments consist of three parts: a metal blank, the powdered diamond abrasive, and a metallic bonding material that holds the diamond powder onto the blank.</p>

        <div class="page-footer">
          <span>Dr. Hala Alhawij | Fixed Prosthodontics II</span>
          <span>Page 2 of 16</span>
        </div>
      </div>

      <!-- PAGES 3 TO 16 -->
      ${Array.from({length: 14}, (_, idx) => {
        const pNum = idx + 3;
        return `
          <div class="doc-page" id="page-${pNum}" data-page="${pNum}">
            <canvas class="canvas-overlay" id="canvas-${pNum}"></canvas>
            <div class="page-header">
              <h4>Module ${pNum - 1}: Clinical Section</h4>
              <span>Provisional Restoration & Temporization</span>
            </div>

            <h3 class="section-title">SECTION ${pNum - 1}: CLINICAL PROTOCOLS & CORE PRINCIPLES</h3>
            <p style="margin-bottom: 14px;">Detailed clinical procedures, tissue protection guidelines, and restorative margin management protocols established by Dr. Hala Alhawij for Year 3 Dental Students.</p>

            <ul class="bullet-list">
              <li>Pulp vitality maintenance and dentinal tubule sealing.</li>
              <li>Margin emergence profile adaptation to prevent soft tissue recession.</li>
              <li>Occlusal clearance verification and interproximal contact point stabilization.</li>
            </ul>

            <div class="clinical-callout">
              <strong>EXAM HIGHLIGHT:</strong> Ensure precise cervical margin finishing before cementation to maintain healthy periodontium.
            </div>

            <div class="page-footer">
              <span>Dr. Hala Alhawij | Fixed Prosthodontics II</span>
              <span>Page ${pNum} of 16</span>
            </div>
          </div>
        `;
      }).join('')}

    </div>
  </div>

  <!-- JNotes Interactive Canvas Engine, Popups, Straight Line Snap & Auto-Save Script -->
  <script>
    const docId = "${docId}";
    let currentTool = 'pan'; // pan, pen, highlighter, eraser, note
    let currentColor = 'rgba(254, 240, 138, 0.65)';
    let currentStroke = 4;
    let straightLineMode = false;
    let isStraightLine = false;
    let bottomDisplayMode = true;

    let isDrawing = false;
    let startX = 0;
    let startY = 0;
    let strokes = {}; // pageNum -> array of stroke paths

    // Standalone Navigation & Exit Bar
    window.exitStudio = function() {
      if (window.parent) {
        window.parent.location.hash = '#/sheets';
      } else {
        window.location.hash = '#/sheets';
      }
    };

    window.downloadDoc = function() {
      if (window.parent && window.parent.DocumentViewer) {
        window.parent.DocumentViewer.download({
          id: docId,
          title: "${title}"
        });
      } else {
        alert('جاري تنزيل ملف PDF...');
      }
    };

    // Popups Controls
    window.toggleThicknessMenu = function(e) {
      if (e) e.stopPropagation();
      const p = document.getElementById('popup-thickness');
      const pm = document.getElementById('popup-markpen');
      if (pm) pm.classList.remove('open');
      if (p) {
        const isOpen = p.classList.toggle('open');
        if (isOpen) {
          const btn = document.getElementById('tool-thickness');
          if (btn) {
            const r = btn.getBoundingClientRect();
            p.style.left = Math.max(10, r.left - 50) + 'px';
          }
        }
      }
    };

    window.toggleMarkPenMenu = function(e) {
      if (e) e.stopPropagation();
      window.setTool('highlighter');
      const pm = document.getElementById('popup-markpen');
      const pt = document.getElementById('popup-thickness');
      if (pt) pt.classList.remove('open');
      if (pm) {
        const isOpen = pm.classList.toggle('open');
        if (isOpen) {
          const btn = document.getElementById('tool-highlighter');
          if (btn) {
            const r = btn.getBoundingClientRect();
            pm.style.left = Math.max(10, r.left - 50) + 'px';
          }
        }
      }
    };

    window.updateLineWeight = function(val) {
      currentStroke = parseFloat(val) * 5; // 0.1mm (0.5px) to 3.0mm (15px)
      const text = document.getElementById('slider-val-text');
      const labelBtn = document.getElementById('stroke-label-btn');
      if (text) text.textContent = val + 'mm';
      if (labelBtn) labelBtn.textContent = val + 'mm';
    };

    window.toggleStraightLineSetting = function() {
      straightLineMode = !straightLineMode;
      isStraightLine = straightLineMode;
      const btn = document.getElementById('tool-straight-toggle');
      if (btn) btn.classList.toggle('active', straightLineMode);
      const sw = document.getElementById('toggle-straight-line');
      if (sw) sw.classList.toggle('on', straightLineMode);
    };

    window.toggleBottomDisplaySetting = function() {
      bottomDisplayMode = !bottomDisplayMode;
      const sw = document.getElementById('toggle-bottom-display');
      if (sw) sw.classList.toggle('on', bottomDisplayMode);
    };

    window.addToPenBox = function() {
      const dock = document.getElementById('jnotes-vertical-dock');
      if (!dock) return;

      const newBtn = document.createElement('div');
      newBtn.className = 'dock-preset-btn';
      const mmVal = (currentStroke / 5).toFixed(1);
      newBtn.title = mmVal + 'mm قلم مخصص';
      newBtn.onclick = () => window.applyPreset(currentColor, currentStroke, currentTool);
      newBtn.innerHTML = \`
        <span>\${mmVal}</span>
        <div class="dock-preset-dot" style="background: \${currentColor};"></div>
      \`;

      dock.insertBefore(newBtn, dock.lastElementChild);
      document.getElementById('popup-markpen')?.classList.remove('open');
      if (window.parent && window.parent.showToast) {
        window.parent.showToast('تمت إضافة القلم لقائمة الأقلام المفضلة على اليمين! 🖊️', { type: 'success' });
      }
    };

    // Close popups on click outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#popup-thickness') && !e.target.closest('#tool-thickness')) {
        document.getElementById('popup-thickness')?.classList.remove('open');
      }
      if (!e.target.closest('#popup-markpen') && !e.target.closest('#tool-highlighter')) {
        document.getElementById('popup-markpen')?.classList.remove('open');
      }
    });

    // Undo / Redo Stacks
    let redoStack = [];

    window.undoAction = function() {
      let changed = false;
      Object.keys(strokes).forEach(pNum => {
        if (strokes[pNum] && strokes[pNum].length > 0) {
          const popped = strokes[pNum].pop();
          redoStack.push({ pageNum: pNum, stroke: popped });
          redrawCanvas(pNum);
          changed = true;
        }
      });
      if (changed) triggerAutoSave();
    };

    window.redoAction = function() {
      if (redoStack.length > 0) {
        const item = redoStack.pop();
        if (!strokes[item.pageNum]) strokes[item.pageNum] = [];
        strokes[item.pageNum].push(item.stroke);
        redrawCanvas(item.pageNum);
        triggerAutoSave();
      }
    };

    // Page Navigation & Thumbnail Drawer Controls
    let currentPage = 1;
    const totalPages = 16;

    window.prevPage = function() {
      if (currentPage > 1) {
        window.scrollToPage(currentPage - 1);
      }
    };

    window.nextPage = function() {
      if (currentPage < totalPages) {
        window.scrollToPage(currentPage + 1);
      }
    };

    window.scrollToPage = function(pageNum) {
      currentPage = pageNum;
      const pageEl = document.getElementById('page-' + pageNum);
      if (pageEl) {
        pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        document.querySelectorAll('.thumb-card').forEach((c, idx) => {
          c.classList.toggle('active', idx + 1 === pageNum);
        });
        updateCounterPill(pageNum);
      }
    };

    function updateCounterPill(pageNum) {
      currentPage = pageNum;
      const pill = document.getElementById('page-counter-num');
      if (pill) pill.textContent = pageNum + ' / ' + totalPages;
    }

    window.toggleSidebar = function() {
      const sb = document.getElementById('jnotes-sidebar-index');
      const backdrop = document.getElementById('drawer-backdrop');
      const dock = document.getElementById('jnotes-vertical-dock');
      if (sb) {
        const isOpen = sb.classList.toggle('open');
        if (backdrop) backdrop.classList.toggle('open', isOpen);
        if (dock) dock.classList.toggle('dock-retracted', isOpen);
      }
    };

    window.closeSidebar = function() {
      const sb = document.getElementById('jnotes-sidebar-index');
      const backdrop = document.getElementById('drawer-backdrop');
      const dock = document.getElementById('jnotes-vertical-dock');
      if (sb) sb.classList.remove('open');
      if (backdrop) backdrop.classList.remove('open');
      if (dock) dock.classList.remove('dock-retracted');
    };

    window.selectPageAndCloseDrawer = function(pageNum) {
      window.scrollToPage(pageNum);
      window.closeSidebar();
    };

    window.setTool = function(tool) {
      currentTool = tool;
      document.querySelectorAll('.jtool-btn').forEach(b => {
        if (b.id === 'tool-' + tool) b.classList.add('active');
        else if (b.id && b.id.startsWith('tool-') && b.id !== 'tool-straight-toggle') b.classList.remove('active');
      });

      document.querySelectorAll('.canvas-overlay').forEach(c => {
        c.classList.toggle('pen-active', tool === 'pen' || tool === 'highlighter' || tool === 'eraser');
      });
    };

    window.setColor = function(color) {
      currentColor = color;
      document.documentElement.style.setProperty('--highlight-color', color);
      document.querySelectorAll('.color-dot').forEach(d => {
        d.classList.toggle('active', d.getAttribute('data-color') === color);
      });
    };

    window.applyPreset = function(color, strokeWidth, tool) {
      window.setColor(color);
      currentStroke = strokeWidth;
      window.setTool(tool);
    };

    // Canvas Touch & Drawing Engine
    function initCanvases() {
      document.querySelectorAll('.doc-page').forEach(page => {
        const pageNum = page.getAttribute('data-page');
        const canvas = document.getElementById('canvas-' + pageNum);
        if (!canvas) return;

        canvas.width = page.offsetWidth;
        canvas.height = page.offsetHeight;

        const ctx = canvas.getContext('2d');
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Mouse Events
        canvas.onmousedown = (e) => startDraw(e, canvas, pageNum);
        canvas.onmousemove = (e) => draw(e, canvas, pageNum);
        canvas.onmouseup = () => stopDraw(pageNum);
        canvas.onmouseleave = () => stopDraw(pageNum);

        // Flawless Mobile Touch Events (prevent touch scroll when drawing!)
        canvas.addEventListener('touchstart', (e) => {
          if (currentTool === 'pan') return;
          e.preventDefault();
          startDraw(e.touches[0], canvas, pageNum);
        }, { passive: false });

        canvas.addEventListener('touchmove', (e) => {
          if (currentTool === 'pan') return;
          e.preventDefault();
          draw(e.touches[0], canvas, pageNum);
        }, { passive: false });

        canvas.addEventListener('touchend', (e) => {
          if (currentTool === 'pan') return;
          e.preventDefault();
          stopDraw(pageNum);
        }, { passive: false });
      });
    }

    function startDraw(e, canvas, pageNum) {
      if (currentTool !== 'pen' && currentTool !== 'highlighter' && currentTool !== 'eraser') return;
      isDrawing = true;
      const rect = canvas.getBoundingClientRect();
      startX = e.clientX - rect.left;
      startY = e.clientY - rect.top;

      if (!strokes[pageNum]) strokes[pageNum] = [];

      if (currentTool === 'eraser') {
        eraseAt(pageNum, startX, startY);
      } else {
        strokes[pageNum].push({
          tool: currentTool,
          color: currentColor,
          strokeWidth: currentTool === 'highlighter' ? currentStroke * 2.5 : currentStroke,
          isStraight: straightLineMode || isStraightLine,
          isStraightLine: straightLineMode || isStraightLine,
          bottomDisplay: bottomDisplayMode,
          points: [{ x: startX, y: startY }]
        });
      }
    }

    function draw(e, canvas, pageNum) {
      if (!isDrawing) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (currentTool === 'eraser') {
        eraseAt(pageNum, x, y);
      } else {
        const currStrokes = strokes[pageNum];
        if (currStrokes && currStrokes.length > 0) {
          const st = currStrokes[currStrokes.length - 1];
          if (st.isStraight || st.isStraightLine) {
            // Straight line drawing mode (horizontal and vertical snap)
            const dx = Math.abs(x - startX);
            const dy = Math.abs(y - startY);
            let targetX = x;
            let targetY = y;
            if (dy < 20 || dy <= dx * 0.25) {
              targetY = startY; // Perfect horizontal snap for highlighting lines of text
            } else if (dx < 20 || dx <= dy * 0.25) {
              targetX = startX; // Vertical snap
            }
            st.points = [{ x: startX, y: startY }, { x: targetX, y: targetY }];
          } else {
            st.points.push({ x, y });
          }
          redrawCanvas(pageNum);
        }
      }
    }

    function stopDraw(pageNum) {
      if (isDrawing) {
        isDrawing = false;
        triggerAutoSave();
      }
    }

    function eraseAt(pageNum, x, y) {
      if (!strokes[pageNum]) return;
      const radius = 25;
      strokes[pageNum] = strokes[pageNum].filter(st => {
        return !st.points.some(p => Math.hypot(p.x - x, p.y - y) < radius);
      });
      redrawCanvas(pageNum);
    }

    function redrawCanvas(pageNum) {
      const canvas = document.getElementById('canvas-' + pageNum);
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const pageStrokes = strokes[pageNum] || [];
      pageStrokes.forEach(st => {
        if (st.points.length < 2) return;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(st.points[0].x, st.points[0].y);

        for (let i = 1; i < st.points.length; i++) {
          ctx.lineTo(st.points[i].x, st.points[i].y);
        }

        if (st.tool === 'highlighter') {
          ctx.globalCompositeOperation = st.bottomDisplay ? 'multiply' : 'source-over';
          ctx.strokeStyle = st.color;
          ctx.lineWidth = st.strokeWidth;
        } else {
          ctx.globalCompositeOperation = 'source-over';
          ctx.strokeStyle = st.color;
          ctx.lineWidth = st.strokeWidth;
        }

        ctx.stroke();
        ctx.restore();
      });
    }

    // Text Element Highlight Click
    document.querySelectorAll('.doc-page p, .doc-page li, .doc-page h3').forEach((el, idx) => {
      el.setAttribute('data-idx', idx);
      el.addEventListener('click', (e) => {
        if (currentTool === 'highlighter') {
          el.classList.toggle('highlighted');
          triggerAutoSave();
        } else if (currentTool === 'eraser') {
          el.classList.remove('highlighted');
          triggerAutoSave();
        }
      });
    });

    // Undo / Redo Handlers
    document.getElementById('btn-undo')?.addEventListener('click', () => {
      window.undoAction();
    });
    document.getElementById('btn-redo')?.addEventListener('click', () => {
      window.redoAction();
    });

    // Auto-Save Trigger
    function triggerAutoSave() {
      const highlights = [];
      document.querySelectorAll('.highlighted').forEach(el => {
        highlights.push(parseInt(el.getAttribute('data-idx'), 10));
      });

      const data = {
        docId: docId,
        highlights: highlights,
        strokes: strokes,
        updatedAt: new Date().toISOString()
      };

      try {
        localStorage.setItem('kf_doc_annotations_' + docId, JSON.stringify(data));
      } catch (e) {}

      const badge = document.getElementById('auto-save-badge');
      if (badge) {
        badge.style.opacity = '1';
        setTimeout(() => { badge.style.opacity = '0.7'; }, 1500);
      }
    }

    // Load Saved Annotations
    function loadSavedAnnotations() {
      try {
        const saved = localStorage.getItem('kf_doc_annotations_' + docId);
        if (!saved) return;
        const data = JSON.parse(saved);

        if (Array.isArray(data.highlights)) {
          const allTextEls = document.querySelectorAll('.doc-page p, .doc-page li, .doc-page h3');
          data.highlights.forEach(idx => {
            if (allTextEls[idx]) allTextEls[idx].classList.add('highlighted');
          });
        }

        if (data.strokes) {
          strokes = data.strokes;
          Object.keys(strokes).forEach(pNum => redrawCanvas(pNum));
        }
      } catch (e) {}
    }

    // Scroll Page Counter
    const viewport = document.getElementById('jnotes-viewport');
    if (viewport) {
      viewport.addEventListener('scroll', () => {
        const pages = document.querySelectorAll('.doc-page');
        pages.forEach((p, idx) => {
          const rect = p.getBoundingClientRect();
          if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
            updateCounterPill(idx + 1);
            document.querySelectorAll('.thumb-card').forEach((c, cIdx) => {
              c.classList.toggle('active', cIdx === idx);
            });
          }
        });
      });
    }

    function updateCounterPill(pageNum) {
      currentPage = pageNum;
      const counterEl = document.getElementById('page-counter-num');
      if (counterEl) counterEl.textContent = pageNum + ' / ' + totalPages;
    }

    window.addEventListener('DOMContentLoaded', () => {
      initCanvases();
      loadSavedAnnotations();
    });
    window.addEventListener('resize', initCanvases);
    setTimeout(() => {
      initCanvases();
      loadSavedAnnotations();
    }, 200);
  </script>
</body>
</html>`;
  }
};

window.DocumentViewer = DocumentViewer;
