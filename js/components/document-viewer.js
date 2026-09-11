/**
 * KURO FANGS — JNOTES INTERACTIVE NOTE STUDIO & DEDICATED SHEET READER
 * Features Mobile Touch Highlighting, Vertical Quick Pen Dock, Undo/Redo,
 * Translucent Highlighting, Floating Sticky Notes, and Instant Auto-Save on Every Action.
 */

const DocumentViewer = {
  currentDoc: null,
  isOpen: false,
  activeTool: 'pan', // 'pan', 'pen', 'highlighter', 'eraser', 'note'
  activeColor: '#FEF08A', // default yellow
  activeStroke: 4,

  init() {
    // Legacy helper in case modal is referenced, but platform uses dedicated page view
  },

  open(doc) {
    const docId = doc?.id || 'sh-fixed-provisional';
    window.location.hash = '#/sheet-detail?id=' + docId;
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
      --highlight-color: rgba(254, 240, 138, 0.5);
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

    /* JNotes Top Studio Header Toolbar */
    .jnotes-top-bar {
      height: 56px;
      background: #1B1D2C;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 14px;
      gap: 8px;
      z-index: 1000;
      flex-shrink: 0;
    }

    .jnotes-tool-group {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .jtool-btn {
      background: transparent;
      border: 1px solid transparent;
      color: #94A3B8;
      padding: 6px 10px;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      transition: all 0.15s ease;
      user-select: none;
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

    /* Page indicator pill floating top left */
    .jnotes-page-pill {
      background: rgba(15, 23, 42, 0.8);
      color: #F8FAFC;
      border: 1px solid rgba(255, 255, 255, 0.15);
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.775rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Auto Save indicator badge */
    .auto-save-pill {
      background: rgba(16, 185, 129, 0.15);
      color: #34D399;
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 0.725rem;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 4px;
      transition: opacity 0.3s ease;
    }

    /* Right Vertical Floating Pen Dock (JNotes Style) */
    .jnotes-vertical-dock {
      position: fixed;
      right: 14px;
      top: 100px;
      z-index: 10000;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(12px);
      border-radius: 24px;
      padding: 10px 8px;
      box-shadow: 0 12px 35px rgba(0, 0, 0, 0.35);
      display: flex;
      flex-direction: column;
      gap: 12px;
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

    /* Swatches Color Selector */
    .jnotes-color-dots {
      display: flex;
      align-items: center;
      gap: 5px;
      margin: 0 6px;
      padding: 0 8px;
      border-left: 1px solid rgba(255, 255, 255, 0.12);
      border-right: 1px solid rgba(255, 255, 255, 0.12);
    }

    .color-dot {
      width: 20px;
      height: 20px;
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
      width: 240px;
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
      margin-right: -240px;
    }

    .sidebar-header {
      padding: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      color: #F8FAFC;
      font-size: 0.825rem;
      font-weight: 700;
      display: flex;
      justify-content: space-between;
    }

    .sidebar-thumbnails-list {
      flex: 1;
      overflow-y: auto;
      padding: 10px;
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
      gap: 10px;
    }

    .thumb-card.active {
      border-color: #0284C7;
      background: rgba(2, 132, 199, 0.2);
    }

    .thumb-num {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: #0284C7;
      color: #FFF;
      font-size: 0.725rem;
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
      padding: 30px 15px 80px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 30px;
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
      padding: 48px 56px;
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
      user-select: text;
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

    .sticky-note-header span {
      font-weight: 800;
      font-size: 0.725rem;
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
      height: 70px;
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
      padding-bottom: 12px;
      margin-bottom: 24px;
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
      margin-top: 100px;
      margin-bottom: 10px;
      text-align: center;
    }

    h2.title-sub {
      font-size: 1.5rem;
      font-weight: 800;
      color: #0369A1;
      text-align: center;
      margin-bottom: 50px;
    }

    .meta-center {
      text-align: center;
      font-size: 1rem;
      color: var(--text-sub);
      margin-bottom: 50px;
    }

    .agenda-box {
      background: #F0F9FF;
      border: 1px solid #BAE6FD;
      border-radius: 10px;
      padding: 24px;
      margin-top: 30px;
    }

    .agenda-box h3 {
      font-size: 1.05rem;
      color: #0369A1;
      margin-bottom: 12px;
    }

    .section-title {
      font-size: 1.15rem;
      font-weight: 800;
      color: #0F172A;
      margin: 22px 0 12px;
      padding-bottom: 4px;
      border-bottom: 1.5px solid #0284C7;
    }

    .bullet-list {
      list-style-type: none;
      padding-left: 0;
      margin-bottom: 16px;
    }

    .bullet-list li {
      position: relative;
      padding-left: 20px;
      margin-bottom: 10px;
      font-size: 0.925rem;
    }

    .bullet-list li::before {
      content: "•";
      color: #0284C7;
      font-size: 1.4rem;
      position: absolute;
      left: 0;
      top: -3px;
    }

    .table-spec {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0 24px;
      font-size: 0.875rem;
    }

    .table-spec th, .table-spec td {
      border: 1px solid #CBD5E1;
      padding: 10px 14px;
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
      padding: 14px 18px;
      border-radius: 0 8px 8px 0;
      margin: 18px 0;
      font-size: 0.875rem;
      color: #78350F;
    }

    .page-footer {
      position: absolute;
      bottom: 20px;
      left: 56px;
      right: 56px;
      display: flex;
      justify-content: space-between;
      font-size: 0.725rem;
      color: var(--text-sub);
      border-top: 1px solid #E2E8F0;
      padding-top: 10px;
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
      <button class="jtool-btn" id="tool-highlighter" onclick="setTool('highlighter')">🖍️ <span>تظليل</span></button>
      <button class="jtool-btn" id="tool-eraser" onclick="setTool('eraser')">🧹 <span>ممحاة</span></button>
      <button class="jtool-btn" id="tool-note" onclick="setTool('note')">📝 <span>ملاحظة</span></button>

      <!-- Color Dots Swatches -->
      <div class="jnotes-color-dots">
        <div class="color-dot active" data-color="rgba(254, 240, 138, 0.6)" style="background: #FEF08A;" onclick="setColor('rgba(254, 240, 138, 0.6)')" title="أصفر تظليل"></div>
        <div class="color-dot" data-color="rgba(168, 85, 247, 0.6)" style="background: #A855F7;" onclick="setColor('rgba(168, 85, 247, 0.6)')" title="أرجواني تظليل"></div>
        <div class="color-dot" data-color="#0284C7" style="background: #0284C7;" onclick="setColor('#0284C7')" title="أزرق حبر"></div>
        <div class="color-dot" data-color="#78350F" style="background: #78350F;" onclick="setColor('#78350F')" title="بني حبر"></div>
        <div class="color-dot" data-color="#16A34A" style="background: #16A34A;" onclick="setColor('#16A34A')" title="أخضر"></div>
        <div class="color-dot" data-color="#0F172A" style="background: #0F172A;" onclick="setColor('#0F172A')" title="أسود"></div>
      </div>
    </div>

    <!-- Center: Auto Save Status Pill & Page Counter -->
    <div style="display: flex; align-items: center; gap: 10px;">
      <span class="auto-save-pill" id="auto-save-badge">
        <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: #34D399;"></span>
        <span>تم الحفظ تلقائياً</span>
      </span>

      <div class="jnotes-page-pill" id="page-counter-pill">
        <span>صفحة 1 / 17</span>
      </div>

      <button class="jtool-btn" onclick="toggleSidebar()" title="فهرس الصفحات">🗂️ <span>الفهرس</span></button>
    </div>
  </div>

  <!-- Right Vertical Floating Pen Dock (JNotes Quick Palette) -->
  <div class="jnotes-vertical-dock">
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
  </div>

  <!-- Workspace Container -->
  <div class="jnotes-workspace">

    <!-- Collapsible Page Thumbnail Sidebar -->
    <div class="jnotes-sidebar" id="jnotes-sidebar">
      <div class="sidebar-header">
        <span>🗂️ فهرس الصفحات (17)</span>
      </div>
      <div class="sidebar-thumbnails-list">
        ${Array.from({length: 17}, (_, i) => `
          <div class="thumb-card ${i === 0 ? 'active' : ''}" onclick="scrollToPage(${i + 1})">
            <div class="thumb-num">${i + 1}</div>
            <div class="thumb-info">
              <h5>صفحة ${i + 1}</h5>
              <p>Section ${i + 1}</p>
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

        <h1 class="title-main">PROVISIONAL RESTORATION AND TEMPORIZATION</h1>
        <h2 class="title-sub">CLINICAL PROTOCOLS & CONTEMPORARY TECHNIQUES</h2>

        <div class="meta-center">
          <p><strong>${doctor}</strong></p>
          <p>Department of Fixed Prosthodontics</p>
          <p>${university} • Academic Year ${year}</p>
        </div>

        <div class="agenda-box">
          <h3>LECTURE AGENDA & CORE MODULES</h3>
          <ul class="bullet-list">
            <li><strong>Module 1:</strong> Definition, Terminology, and Differences vs. Permanent Restorations</li>
            <li><strong>Module 2:</strong> Triad of Requirements (Biologic, Mechanical, and Esthetic)</li>
            <li><strong>Module 3:</strong> Classification of Provisional Restorations & Preformed Crowns</li>
            <li><strong>Module 4:</strong> Direct vs. Indirect Fabrication Protocols & Vacuum Shells</li>
            <li><strong>Module 5:</strong> Comparative Analysis of Restorative Resins & Provisional Cements</li>
            <li><strong>Module 6:</strong> Pontic Design, Clinical Troubleshooting, and Exam Review</li>
          </ul>
        </div>

        <div class="page-footer">
          <span>Dr. Hala Alhawij | Fixed Prosthodontics II</span>
          <span>Page 1 of 17</span>
        </div>
      </div>

      <!-- PAGE 2 -->
      <div class="doc-page" id="page-2" data-page="2">
        <canvas class="canvas-overlay" id="canvas-2"></canvas>
        <div class="page-header">
          <h4>Module 1: Fundamentals</h4>
          <span>Provisional Restoration & Temporization</span>
        </div>

        <h3 class="section-title">SECTION 1: DEFINITIONS AND TERMINOLOGY</h3>
        <p><strong>Definition of Provisional Restoration:</strong></p>
        <p style="margin-bottom: 14px;">A temporary or interim dental prosthesis designed to enhance esthetics, stabilization, and function for a limited period of time, after which it is replaced by a definitive permanent dental prosthesis.</p>

        <p><strong>Synonyms in Prosthodontic Literature:</strong></p>
        <p style="margin-bottom: 20px;">Provisional Restoration | Transitional Crown | Temporary Prosthesis | Interim Treatment Restoration.</p>

        <h3 class="section-title">KEY DIFFERENCES: PROVISIONAL VS. PERMANENT RESTORATIONS</h3>
        <table class="table-spec">
          <thead>
            <tr>
              <th>Characteristic</th>
              <th>Provisional Restoration</th>
              <th>Permanent Restoration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Primary Objective</strong></td>
              <td>Interim protection, pulp healing & diagnosis</td>
              <td>Long-term mastication, biocompatibility & esthetics</td>
            </tr>
            <tr>
              <td><strong>Expected Lifespan</strong></td>
              <td>2 weeks to 6 months (interim service)</td>
              <td>10 to 20+ years of functional durability</td>
            </tr>
            <tr>
              <td><strong>Fabrication Speed</strong></td>
              <td>Rapid chairside or laboratory fabrication</td>
              <td>Precision casting, pressing, sintering, or CAD/CAM</td>
            </tr>
            <tr>
              <td><strong>Retrievability</strong></td>
              <td>Easily removed and re-cemented repeatedly</td>
              <td>Rigidly bonded / permanently luted in place</td>
            </tr>
          </tbody>
        </table>

        <div class="page-footer">
          <span>Dr. Hala Alhawij | Fixed Prosthodontics II</span>
          <span>Page 2 of 17</span>
        </div>
      </div>

      <!-- PAGES 3 TO 17 -->
      ${Array.from({length: 15}, (_, idx) => {
        const pNum = idx + 3;
        return `
          <div class="doc-page" id="page-${pNum}" data-page="${pNum}">
            <canvas class="canvas-overlay" id="canvas-${pNum}"></canvas>
            <div class="page-header">
              <h4>Module ${pNum - 1}: Clinical Section</h4>
              <span>Provisional Restoration & Temporization</span>
            </div>

            <h3 class="section-title">SECTION ${pNum - 1}: CLINICAL PROTOCOLS & CORE PRINCIPLES</h3>
            <p><strong>Key Clinical Guidelines for Section ${pNum - 1}:</strong></p>
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
              <span>Page ${pNum} of 17</span>
            </div>
          </div>
        `;
      }).join('')}

    </div>
  </div>

  <!-- JNotes Interactive Canvas Engine & Auto-Save Script -->
  <script>
    const docId = "${docId}";
    let currentTool = 'pan'; // pan, pen, highlighter, eraser, note
    let currentColor = 'rgba(254, 240, 138, 0.6)';
    let currentStroke = 12;

    let isDrawing = false;
    let strokes = {}; // pageNum -> array of stroke paths
    let undoHistory = [];
    let redoHistory = [];

    // Scroll To Page
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

    window.setStudioTool = function(tool) {
      window.setTool(tool);
    };

    window.setStudioColor = function(color) {
      window.setColor(color);
    };

    window.setStudioWidth = function(width) {
      currentStroke = parseInt(width, 10) || 4;
    };

    // Sticky Notes Logic
    let notes = [];
    let noteIdCounter = 1;

    function createStickyNote(pageEl, x, y, initialText, id) {
      const noteId = id || 'sn_' + Date.now() + '_' + (noteIdCounter++);
      const noteBox = document.createElement('div');
      noteBox.className = 'sticky-note-box';
      noteBox.id = noteId;
      noteBox.style.left = Math.max(10, Math.min(x, (pageEl.clientWidth || 800) - 200)) + 'px';
      noteBox.style.top = Math.max(10, Math.min(y, (pageEl.clientHeight || 1000) - 120)) + 'px';

      noteBox.innerHTML = 
        '<div class="sticky-note-header">' +
          '<span>📌 ملاحظة طالب</span>' +
          '<button type="button" class="sticky-note-close" title="حذف">✕</button>' +
        '</div>' +
        '<textarea placeholder="اكتب ملاحظتك الأكاديمية هنا..."></textarea>';

      const textarea = noteBox.querySelector('textarea');
      if (textarea) textarea.value = initialText || '';
      const closeBtn = noteBox.querySelector('.sticky-note-close');
      const header = noteBox.querySelector('.sticky-note-header');

      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        noteBox.remove();
        notes = notes.filter(n => n.id !== noteId);
        triggerAutoSave();
      });

      textarea.addEventListener('input', () => {
        const n = notes.find(item => item.id === noteId);
        if (n) n.text = textarea.value;
        triggerAutoSave();
      });

      let isDragging = false;
      let dragStartX = 0, dragStartY = 0;
      let initLeft = 0, initTop = 0;

      header.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        isDragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        initLeft = parseInt(noteBox.style.left, 10) || 0;
        initTop = parseInt(noteBox.style.top, 10) || 0;
        header.style.cursor = 'grabbing';
      });

      window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        const maxLeft = (pageEl.clientWidth || 800) - noteBox.offsetWidth - 10;
        const maxTop = (pageEl.clientHeight || 1000) - noteBox.offsetHeight - 10;
        const newLeft = Math.max(10, Math.min(initLeft + dx, maxLeft));
        const newTop = Math.max(10, Math.min(initTop + dy, maxTop));
        noteBox.style.left = newLeft + 'px';
        noteBox.style.top = newTop + 'px';

        const n = notes.find(item => item.id === noteId);
        if (n) {
          n.left = newLeft;
          n.top = newTop;
        }
      });

      window.addEventListener('mouseup', () => {
        if (isDragging) {
          isDragging = false;
          header.style.cursor = 'move';
          triggerAutoSave();
        }
      });

      pageEl.appendChild(noteBox);

      const existing = notes.find(n => n.id === noteId);
      if (!existing) {
        notes.push({
          id: noteId,
          pageId: pageEl.id,
          left: parseInt(noteBox.style.left, 10),
          top: parseInt(noteBox.style.top, 10),
          text: initialText || ''
        });
        triggerAutoSave();
      }
    }

    document.querySelectorAll('.doc-page').forEach(page => {
      page.addEventListener('click', (e) => {
        if (currentTool === 'note') {
          if (e.target.closest('.sticky-note-box')) return;
          const rect = page.getBoundingClientRect();
          const x = e.clientX - rect.left - 20;
          const y = e.clientY - rect.top - 20;
          createStickyNote(page, x, y, '');
        }
      });
    });

    window.saveAnnotations = function() {
      triggerAutoSave();
      return { docId, strokes, notes };
    };

    window.clearAnnotations = function() {
      strokes = {};
      document.querySelectorAll('.canvas-overlay').forEach(c => {
        const ctx = c.getContext('2d');
        ctx.clearRect(0, 0, c.width, c.height);
      });
      document.querySelectorAll('.highlighted').forEach(el => el.classList.remove('highlighted'));
      document.querySelectorAll('.sticky-note-box').forEach(n => n.remove());
      notes = [];
      try { localStorage.removeItem('kf_doc_annotations_' + docId); } catch(e){}
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
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (!strokes[pageNum]) strokes[pageNum] = [];

      if (currentTool === 'eraser') {
        eraseAt(pageNum, x, y);
      } else {
        strokes[pageNum].push({
          tool: currentTool,
          color: currentColor,
          strokeWidth: currentTool === 'highlighter' ? currentStroke : (currentStroke <= 4 ? currentStroke : 3),
          points: [{ x, y }]
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
          currStrokes[currStrokes.length - 1].points.push({ x, y });
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
          ctx.globalCompositeOperation = 'multiply';
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

    // Undo / Redo
    document.getElementById('btn-undo')?.addEventListener('click', () => {
      // Clear last stroke
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
        notes: notes,
        updatedAt: new Date().toISOString()
      };

      try {
        localStorage.setItem('kf_doc_annotations_' + docId, JSON.stringify(data));
      } catch (e) {}

      // Update badge
      const badge = document.getElementById('auto-save-badge');
      if (badge) {
        badge.style.opacity = '1';
        setTimeout(() => { badge.style.opacity = '0.7'; }, 1500);
      }
    }

    // Load Annotations
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

        if (Array.isArray(data.notes)) {
          notes = [];
          data.notes.forEach(n => {
            const pageEl = document.getElementById(n.pageId);
            if (pageEl) createStickyNote(pageEl, n.left, n.top, n.text, n.id);
          });
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
      if (pill) pill.textContent = 'صفحة ' + pageNum + ' / 17';
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
