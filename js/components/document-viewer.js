/**
 * KURO FANGS — JNOTES INTERACTIVE NOTE STUDIO & DEDICATED SHEET READER
 * Features Mark Pen Settings (Straight line drawing, Bottom display, Add to pen-box),
 * Line Weight Thickness Slider (0.1mm - 3.0mm), Right Vertical Pen Box,
 * Mobile Touch Drawing, Straight-line Snap, and Instant Auto-Save on Every Action.
 */

const DocumentViewer = {
  currentDoc: null,
  isOpen: false,

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

    /* JNotes Top Header Toolbar */
    .jnotes-top-bar {
      height: 56px;
      background: #1B1D2C;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 12px;
      gap: 6px;
      z-index: 1000;
      flex-shrink: 0;
    }

    .jnotes-tool-group {
      display: flex;
      align-items: center;
      gap: 4px;
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
      gap: 4px;
      transition: all 0.15s ease;
      user-select: none;
      position: relative;
    }

    .jtool-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #F8FAFC;
    }

    .jtool-btn.active {
      background: #0284C7 !important;
      color: #FFFFFF !important;
      border-color: rgba(255, 255, 255, 0.25) !important;
      box-shadow: 0 0 10px rgba(2, 132, 199, 0.4);
    }

    /* Floating Page counter pill top left */
    .jnotes-page-pill {
      background: rgba(15, 23, 42, 0.85);
      color: #F8FAFC;
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    /* Auto Save indicator badge */
    .auto-save-pill {
      background: rgba(16, 185, 129, 0.15);
      color: #34D399;
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 3px 8px;
      border-radius: 10px;
      font-size: 0.7rem;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    /* Right Vertical Floating Pen Box Dock (JNotes Style) */
    .jnotes-vertical-dock {
      position: fixed;
      right: 14px;
      top: 90px;
      z-index: 10000;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px);
      border-radius: 24px;
      padding: 10px 8px;
      box-shadow: 0 12px 35px rgba(0, 0, 0, 0.35);
      display: flex;
      flex-direction: column;
      gap: 10px;
      border: 1px solid rgba(0, 0, 0, 0.1);
      align-items: center;
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

    /* JNotes Popups (Line Weight Slider & Mark Pen Settings) */
    .jnotes-popup-card {
      position: absolute;
      top: 52px;
      background: #FFFFFF;
      color: #0F172A;
      border-radius: 14px;
      padding: 16px 18px;
      box-shadow: 0 15px 40px rgba(0,0,0,0.35);
      z-index: 2000;
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

    /* JNotes Left Sidebar */
    .jnotes-sidebar {
      width: 230px;
      background: #181926;
      border-left: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      flex-direction: column;
      height: calc(100vh - 56px);
      transition: margin-right 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      flex-shrink: 0;
      z-index: 100;
    }

    .jnotes-sidebar.collapsed {
      margin-right: -230px;
    }

    .sidebar-header {
      padding: 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      color: #F8FAFC;
      font-size: 0.8rem;
      font-weight: 700;
      display: flex;
      justify-content: space-between;
    }

    .sidebar-thumbnails-list {
      flex: 1;
      overflow-y: auto;
      padding: 8px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .thumb-card {
      background: #232536;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .thumb-card.active {
      border-color: #0284C7;
      background: rgba(2, 132, 199, 0.2);
    }

    .thumb-num {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #0284C7;
      color: #FFF;
      font-size: 0.7rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .thumb-info h5 {
      color: #F8FAFC;
      font-size: 0.725rem;
      font-weight: 700;
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

  <!-- JNotes Top Control Header Bar -->
  <div class="jnotes-top-bar">
    <div class="jnotes-tool-group">
      <button class="jtool-btn" id="btn-undo" title="تراجع (Undo)">↩️</button>
      <button class="jtool-btn" id="btn-redo" title="إعادة (Redo)">↪️</button>

      <button class="jtool-btn active" id="tool-pan" onclick="setTool('pan')">🖐️ <span>قراءة</span></button>
      <button class="jtool-btn" id="tool-pen" onclick="setTool('pen')">🖋️ <span>قلم</span></button>
      
      <!-- Mark Pen (Highlighter) Button + Popup Trigger -->
      <button class="jtool-btn" id="tool-highlighter" onclick="toggleMarkPenMenu()">
        🖍️ <span>تظليل (Mark)</span>
      </button>

      <button class="jtool-btn" id="tool-eraser" onclick="setTool('eraser')">🧹 <span>ممحاة</span></button>

      <!-- Line Weight Thickness Slider Popup Trigger -->
      <button class="jtool-btn" id="tool-thickness" onclick="toggleThicknessMenu()">
        📏 <span id="stroke-label-btn">0.8mm</span>
      </button>

      <!-- Color Swatches Palette -->
      <div class="jnotes-color-dots">
        <div class="color-dot active" data-color="rgba(254, 240, 138, 0.65)" style="background: #FEF08A;" onclick="setColor('rgba(254, 240, 138, 0.65)')" title="أصفر"></div>
        <div class="color-dot" data-color="rgba(168, 85, 247, 0.65)" style="background: #A855F7;" onclick="setColor('rgba(168, 85, 247, 0.65)')" title="أرجواني"></div>
        <div class="color-dot" data-color="#0284C7" style="background: #0284C7;" onclick="setColor('#0284C7')" title="أزرق حبر"></div>
        <div class="color-dot" data-color="#78350F" style="background: #78350F;" onclick="setColor('#78350F')" title="بني حبر"></div>
        <div class="color-dot" data-color="#16A34A" style="background: #16A34A;" onclick="setColor('#16A34A')" title="أخضر"></div>
        <div class="color-dot" data-color="#0F172A" style="background: #0F172A;" onclick="setColor('#0F172A')" title="أسود"></div>
      </div>
    </div>

    <!-- Center: Auto Save Status Pill & Floating Page Counter Pill -->
    <div style="display: flex; align-items: center; gap: 8px;">
      <span class="auto-save-pill" id="auto-save-badge">
        <span style="display: inline-block; width: 5px; height: 5px; border-radius: 50%; background: #34D399;"></span>
        <span>تم الحفظ تلقائياً</span>
      </span>

      <div class="jnotes-page-pill" id="page-counter-pill">
        <span>&lt; 1 / 16 &gt;</span>
      </div>

      <button class="jtool-btn" onclick="toggleSidebar()" title="فهرس الصفحات">🗂️ <span>الفهرس</span></button>
    </div>

    <!-- POPUP 1: JNotes Line Weight Slider (Matching Screenshot 1) -->
    <div class="jnotes-popup-card" id="popup-thickness" style="left: 200px;">
      <div class="popup-title">Line weight</div>
      <div style="margin-bottom: 12px;">
        <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 6px;">
          <span>Thickness setting</span>
          <strong id="slider-val-text" style="color: #0284C7;">0.8mm</strong>
        </div>
        <input type="range" id="line-weight-slider" min="0.1" max="3.0" step="0.1" value="0.8" style="width: 100%; accent-color: #0284C7; cursor: pointer;" oninput="updateLineWeight(this.value)" />
      </div>
    </div>

    <!-- POPUP 2: JNotes Mark Pen Settings (Matching Screenshot 2) -->
    <div class="jnotes-popup-card" id="popup-markpen" style="left: 140px;">
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

  <!-- Right Vertical Floating Pen Dock (JNotes Style) -->
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

  <!-- Workspace Container -->
  <div class="jnotes-workspace">

    <!-- Collapsible Page Thumbnail Sidebar -->
    <div class="jnotes-sidebar" id="jnotes-sidebar">
      <div class="sidebar-header">
        <span>🗂️ فهرس الصفحات (16)</span>
      </div>
      <div class="sidebar-thumbnails-list">
        ${Array.from({length: 16}, (_, i) => `
          <div class="thumb-card ${i === 0 ? 'active' : ''}" onclick="scrollToPage(${i + 1})">
            <div class="thumb-num">${i + 1}</div>
            <div class="thumb-info">
              <h5>صفحة ${i + 1}</h5>
              <p>Dental Lecture Slide ${i + 1}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

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
    let currentStroke = 3;
    let straightLineMode = false;
    let bottomDisplayMode = true;

    let isDrawing = false;
    let startX = 0;
    let startY = 0;
    let strokes = {}; // pageNum -> array of stroke paths

    // Popups Controls
    window.toggleThicknessMenu = function() {
      const p = document.getElementById('popup-thickness');
      const pm = document.getElementById('popup-markpen');
      if (pm) pm.classList.remove('open');
      if (p) p.classList.toggle('open');
    };

    window.toggleMarkPenMenu = function() {
      window.setTool('highlighter');
      const pm = document.getElementById('popup-markpen');
      const pt = document.getElementById('popup-thickness');
      if (pt) pt.classList.remove('open');
      if (pm) pm.classList.toggle('open');
    };

    window.updateLineWeight = function(val) {
      currentStroke = parseFloat(val) * 3.5;
      const text = document.getElementById('slider-val-text');
      const labelBtn = document.getElementById('stroke-label-btn');
      if (text) text.textContent = val + 'mm';
      if (labelBtn) labelBtn.textContent = val + 'mm';
    };

    window.toggleStraightLineSetting = function() {
      straightLineMode = !straightLineMode;
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
      const mmVal = (currentStroke / 3.5).toFixed(1);
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

    // Navigation & Tool Switchers
    window.scrollToPage = function(pageNum) {
      const pageEl = document.getElementById('page-' + pageNum);
      if (pageEl) {
        pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        document.querySelectorAll('.thumb-card').forEach((c, idx) => {
          c.classList.toggle('active', idx + 1 === pageNum);
        });
        updateCounterPill(pageNum);
      }
    };

    window.toggleSidebar = function() {
      const sb = document.getElementById('jnotes-sidebar');
      if (sb) sb.classList.toggle('collapsed');
    };

    window.setTool = function(tool) {
      currentTool = tool;
      document.querySelectorAll('.jtool-btn').forEach(b => {
        if (b.id === 'tool-' + tool) b.classList.add('active');
        else if (b.id && b.id.startsWith('tool-')) b.classList.remove('active');
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

        canvas.addEventListener('touchend', () => {
          if (currentTool === 'pan') return;
          stopDraw(pageNum);
        });
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
          isStraight: straightLineMode,
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
          if (st.isStraight) {
            // Straight line drawing mode (horizontal snap)
            const dy = Math.abs(y - startY);
            const targetY = dy < 15 ? startY : y;
            st.points = [{ x: startX, y: startY }, { x: x, y: targetY }];
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

    // Undo Handler
    document.getElementById('btn-undo')?.addEventListener('click', () => {
      Object.keys(strokes).forEach(pNum => {
        if (strokes[pNum] && strokes[pNum].length > 0) {
          strokes[pNum].pop();
          redrawCanvas(pNum);
        }
      });
      triggerAutoSave();
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
          }
        });
      });
    }

    function updateCounterPill(pageNum) {
      const pill = document.getElementById('page-counter-pill');
      if (pill) pill.textContent = '< ' + pageNum + ' / 16 >';
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
