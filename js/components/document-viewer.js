/**
 * KURO FANGS — JNOTES / GOODNOTES STYLE INTERACTIVE NOTE STUDIO & PDF VIEWER
 * Features Tablet Fullscreen Workspace, JNotes Floating Header Palette, Left Thumbnail Drawer,
 * Pen Drawing, Translucent Highlighting, Eraser, Drag-&-Drop Sticky Notes, Color Swatches & Local Account Sync.
 */

const DocumentViewer = {
  currentDoc: null,
  isOpen: false,
  activeTool: 'pan', // 'pan', 'pen', 'highlighter', 'eraser', 'note'
  activeColor: '#FEF08A', // default yellow
  activeStroke: 4, // 2, 4, 8

  init() {
    if (document.getElementById('doc-viewer-modal')) return;

    const modalMarkup = `
      <div id="doc-viewer-modal" class="doc-viewer-backdrop" aria-hidden="true">
        <div class="doc-viewer-window" role="dialog" aria-modal="true">
          
          <!-- Top JNotes Studio Navigation & Tool Palette Header -->
          <div class="doc-viewer-header">
            <!-- Left: Back & Doc Info -->
            <div class="doc-viewer-title-group">
              <button id="doc-viewer-close-btn" class="doc-viewer-close-btn" title="إغلاق والعودة (Close / Back)">
                ✕
              </button>
              <button id="doc-toggle-sidebar-btn" class="btn-annotation-tool" title="تبديل القائمة الجانبية للصفحات (Thumbnails Drawer)">
                🗂️ <span id="sidebar-toggle-text">الصفحات</span>
              </button>
              <span class="doc-badge-type" id="doc-viewer-badge">FIXED PROS</span>
              <div class="doc-viewer-meta-text">
                <h3 id="doc-viewer-title">Provisional Restoration & Temporization</h3>
                <p id="doc-viewer-subtitle">د. هالة الحويج • 17 صفحة</p>
              </div>
            </div>

            <!-- Center: JNotes Note Studio Tool Bar -->
            <div class="doc-viewer-annotation-bar">
              <button id="jtool-pan" class="btn-annotation-tool active" title="وضع القراءة والتصفح (Pan / Read Mode)">
                🖐️ <span>قراءة</span>
              </button>

              <button id="jtool-pen" class="btn-annotation-tool" title="قلم الكتابة والرسم الحر (Gel Pen)">
                ✏️ <span>قلم</span>
              </button>

              <button id="jtool-highlighter" class="btn-annotation-tool" title="قلم التظليل المضيء (Translucent Highlighter)">
                🖍️ <span>تظليل</span>
              </button>

              <button id="jtool-eraser" class="btn-annotation-tool" title="ممحاة الرسوم والتعديلات (Eraser)">
                🧹 <span>مسح</span>
              </button>

              <button id="jtool-note" class="btn-annotation-tool" title="إضافة ملاحظة نصية لاصقة (Sticky Note)">
                📝 <span>ملاحظة</span>
              </button>

              <!-- Color Palette Swatches -->
              <div class="jnotes-color-swatches" id="jnotes-swatches-box">
                <div class="swatch-dot active" data-color="#FEF08A" style="background-color: #FEF08A;" title="أصفر تظليل (Yellow)"></div>
                <div class="swatch-dot" data-color="#86EFAC" style="background-color: #86EFAC;" title="أخضر نعناعي (Mint Green)"></div>
                <div class="swatch-dot" data-color="#F472B6" style="background-color: #F472B6;" title="وردي زاهي (Pink)"></div>
                <div class="swatch-dot" data-color="#38BDF8" style="background-color: #38BDF8;" title="أزرق ساطع (Cyan Blue)"></div>
                <div class="swatch-dot" data-color="#F87171" style="background-color: #F87171;" title="أحمر مرجاني (Coral Red)"></div>
                <div class="swatch-dot" data-color="#0F172A" style="background-color: #0F172A;" title="أسود قلم (Dark Ink)"></div>
              </div>

              <!-- Stroke Thickness Selector -->
              <div class="jnotes-stroke-selector">
                <button class="stroke-btn" data-stroke="2" title="خط رفيع (2px)">● 2</button>
                <button class="stroke-btn active" data-stroke="4" title="خط متوسط (4px)">● 4</button>
                <button class="stroke-btn" data-stroke="8" title="خط عريض (8px)">● 8</button>
              </div>
            </div>

            <!-- Right: Actions (Save, Download, Print) -->
            <div class="doc-viewer-actions">
              <span class="doc-pages-indicator" id="doc-viewer-pages-pill" title="الصفحة الحالية من الإجمالي">
                <i data-lucide="book-open" style="width: 14px; height: 14px;"></i>
                <span id="doc-viewer-pages-text">1 / 17</span>
              </span>

              <button id="doc-save-annotations-btn" class="btn-annotation-tool save-tool" title="حفظ التعديلات في حسابي (+5 نقاط)">
                💾 <span id="doc-save-btn-text">حفظ بحسابي</span>
              </button>

              <button id="doc-clear-annotations-btn" class="btn-annotation-tool clear-tool" title="تصفير ومسح التعديلات">
                🗑️ <span>تصفير</span>
              </button>

              <button id="doc-viewer-download-btn" class="btn btn-primary btn-sm" title="تنزيل الشيت بصيغة PDF">
                <i data-lucide="download" style="width: 15px; height: 15px;"></i>
                <span>PDF تنزيل</span>
              </button>
            </div>
          </div>

          <!-- Document Viewport Canvas Area -->
          <div class="doc-viewer-body">
            <iframe id="doc-viewer-iframe" class="doc-viewer-iframe" title="JNotes Interactive Document Reader Studio" sandbox="allow-scripts allow-same-origin allow-popups"></iframe>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalMarkup);

    // Event listeners
    const modalEl = document.getElementById('doc-viewer-modal');
    const closeBtn = document.getElementById('doc-viewer-close-btn');
    const downloadBtn = document.getElementById('doc-viewer-download-btn');
    const saveAnnBtn = document.getElementById('doc-save-annotations-btn');
    const clearAnnBtn = document.getElementById('doc-clear-annotations-btn');
    const toggleSidebarBtn = document.getElementById('doc-toggle-sidebar-btn');

    if (closeBtn) closeBtn.addEventListener('click', () => DocumentViewer.close());
    if (modalEl) {
      modalEl.addEventListener('click', (e) => {
        if (e.target === modalEl) DocumentViewer.close();
      });
    }

    if (toggleSidebarBtn) {
      toggleSidebarBtn.addEventListener('click', () => {
        const iframe = document.getElementById('doc-viewer-iframe');
        if (iframe && iframe.contentWindow && typeof iframe.contentWindow.toggleSidebar === 'function') {
          iframe.contentWindow.toggleSidebar();
        }
      });
    }

    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        if (DocumentViewer.currentDoc) {
          DocumentViewer.download(DocumentViewer.currentDoc);
        }
      });
    }

    if (saveAnnBtn) {
      saveAnnBtn.addEventListener('click', () => {
        const iframe = document.getElementById('doc-viewer-iframe');
        if (iframe && iframe.contentWindow && typeof iframe.contentWindow.saveAnnotations === 'function') {
          iframe.contentWindow.saveAnnotations();
          window.STORE.addPoints(5);
          const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
          window.showToast(
            isAr ? 'تم حفظ تظليلاتك وملاحظاتك بنجاح في حسابك! (+5 نقاط)' : 'Annotations & notes saved to your account! (+5 pts)',
            { type: 'success', points: 5 }
          );
        }
      });
    }

    if (clearAnnBtn) {
      clearAnnBtn.addEventListener('click', () => {
        const iframe = document.getElementById('doc-viewer-iframe');
        if (iframe && iframe.contentWindow && typeof iframe.contentWindow.clearAnnotations === 'function') {
          iframe.contentWindow.clearAnnotations();
          const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
          window.showToast(isAr ? 'تم مسح التعديلات.' : 'Annotations cleared.', { type: 'info' });
        }
      });
    }

    // Attach tool switcher handlers for top bar
    const toolBtns = ['pan', 'pen', 'highlighter', 'eraser', 'note'];
    toolBtns.forEach(tool => {
      const btn = document.getElementById(`jtool-${tool}`);
      if (btn) {
        btn.addEventListener('click', () => DocumentViewer.setActiveTool(tool));
      }
    });

    // Swatches click
    document.querySelectorAll('.swatch-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        document.querySelectorAll('.swatch-dot').forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        const color = dot.getAttribute('data-color');
        DocumentViewer.activeColor = color;
        const iframe = document.getElementById('doc-viewer-iframe');
        if (iframe && iframe.contentWindow && typeof iframe.contentWindow.setStudioColor === 'function') {
          iframe.contentWindow.setStudioColor(color);
        }
      });
    });

    // Stroke size click
    document.querySelectorAll('.stroke-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.stroke-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const stroke = parseInt(btn.getAttribute('data-stroke'), 10);
        DocumentViewer.activeStroke = stroke;
        const iframe = document.getElementById('doc-viewer-iframe');
        if (iframe && iframe.contentWindow && typeof iframe.contentWindow.setStudioStroke === 'function') {
          iframe.contentWindow.setStudioStroke(stroke);
        }
      });
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && DocumentViewer.isOpen) {
        DocumentViewer.close();
      }
    });

    if (window.lucide) window.lucide.createIcons();
  },

  setActiveTool(tool) {
    DocumentViewer.activeTool = tool;
    ['pan', 'pen', 'highlighter', 'eraser', 'note'].forEach(t => {
      const btn = document.getElementById(`jtool-${t}`);
      if (btn) btn.classList.toggle('active', t === tool);
    });

    const iframe = document.getElementById('doc-viewer-iframe');
    if (iframe && iframe.contentWindow && typeof iframe.contentWindow.setStudioTool === 'function') {
      iframe.contentWindow.setStudioTool(tool, DocumentViewer.activeColor, DocumentViewer.activeStroke);
    }
  },

  open(doc) {
    DocumentViewer.init();

    DocumentViewer.currentDoc = doc || {
      id: 'sh-fixed-provisional',
      title: 'Provisional Restoration & Temporization',
      subject_name: 'Fixed Prosthodontics II',
      doctor_name: 'د. هالة الحويج (Dr. Hala Alhawij)',
      pages: 17,
      size: '2.8 MB',
      date: '2026-09-11'
    };

    DocumentViewer.isOpen = true;
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;

    const modalEl = document.getElementById('doc-viewer-modal');
    const titleEl = document.getElementById('doc-viewer-title');
    const subEl = document.getElementById('doc-viewer-subtitle');
    const iframe = document.getElementById('doc-viewer-iframe');

    const docTitle = doc.title || (isAr ? doc.title_ar : doc.title_en) || 'Provisional Restoration & Temporization';
    const docDoctor = doc.doctor_name || 'د. هالة الحويج';

    if (titleEl) titleEl.textContent = docTitle;
    if (subEl) subEl.textContent = `${docDoctor} • ${doc.pages || 17} صفحة • ${doc.size || '2.8 MB'}`;

    const srcDocContent = DocumentViewer.generateDocHTML(doc, isAr);
    if (iframe) {
      iframe.srcdoc = srcDocContent;
    }

    if (modalEl) {
      modalEl.classList.add('active');
      modalEl.setAttribute('aria-hidden', 'false');
    }

    document.body.style.overflow = 'hidden';

    // Set initial tool
    setTimeout(() => {
      DocumentViewer.setActiveTool('pan');
    }, 300);

    if (window.lucide) window.lucide.createIcons();
  },

  close() {
    DocumentViewer.isOpen = false;
    const modalEl = document.getElementById('doc-viewer-modal');
    if (modalEl) {
      modalEl.classList.remove('active');
      modalEl.setAttribute('aria-hidden', 'true');
    }

    const iframe = document.getElementById('doc-viewer-iframe');
    if (iframe) {
      iframe.srcdoc = '';
    }

    document.body.style.overflow = '';
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
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=IBM+Plex+Sans+Arabic:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --brand: #0284C7;
      --brand-dark: #0369A1;
      --paper-bg: #FFFFFF;
      --bg: #141522;
      --text: #0F172A;
      --text-sub: #475569;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'IBM Plex Sans Arabic', 'Inter', sans-serif;
      background-color: var(--bg);
      color: var(--text);
      line-height: 1.6;
      height: 100vh;
      display: flex;
      overflow: hidden;
      user-select: text;
    }

    /* JNotes Left Sidebar (Collapsible Page Thumbnails) */
    .jnotes-sidebar {
      width: 240px;
      background: #181926;
      border-left: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      flex-direction: column;
      height: 100vh;
      transition: margin-right 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      flex-shrink: 0;
      z-index: 100;
    }

    .jnotes-sidebar.collapsed {
      margin-right: -240px;
    }

    .sidebar-header {
      padding: 14px;
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
      padding: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .thumb-card:hover, .thumb-card.active {
      border-color: #0284C7;
      background: rgba(2, 132, 199, 0.15);
    }

    .thumb-num {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #0284C7;
      color: #FFF;
      font-size: 0.75rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .thumb-info {
      overflow: hidden;
    }

    .thumb-info h5 {
      color: #F8FAFC;
      font-size: 0.75rem;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .thumb-info p {
      color: #94A3B8;
      font-size: 0.675rem;
    }

    /* Main Viewport Workspace */
    .jnotes-viewport {
      flex: 1;
      height: 100vh;
      overflow-y: auto;
      padding: 30px 20px 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 32px;
      scroll-behavior: smooth;
      background: #141522;
    }

    .doc-page {
      background: var(--paper-bg);
      width: 100%;
      max-width: 840px;
      min-height: 1100px;
      border-radius: 8px;
      box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
      padding: 48px 56px;
      position: relative;
      user-select: text;
      direction: ltr; /* English dental lecture content retains clean LTR formatting */
      text-align: left;
    }

    /* Studio Modes */
    .doc-page.mode-pan { cursor: default; }
    .doc-page.mode-highlighter p:hover, .doc-page.mode-highlighter li:hover, .doc-page.mode-highlighter h3:hover {
      background-color: rgba(254, 240, 138, 0.35);
      cursor: pointer;
      border-radius: 3px;
    }

    .doc-page.mode-pen { cursor: crosshair; }
    .doc-page.mode-note { cursor: copy; }

    /* Highlighted Elements */
    .highlighted {
      background-color: var(--highlight-color, #FEF08A) !important;
      border-radius: 4px;
      padding: 1px 4px;
      box-shadow: 0 0 4px rgba(254, 240, 138, 0.4);
    }

    /* HTML5 Canvas Overlay for Pen & Drawing */
    .canvas-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 10;
    }

    .canvas-overlay.pen-active {
      pointer-events: auto;
    }

    /* Drag & Drop Sticky Note Box */
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

    /* Page Typography & Layout */
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
      letter-spacing: 0.5px;
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
      line-height: 1.25;
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
      line-height: 1.8;
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
      border-bottom: 1px dashed #BAE6FD;
      padding-bottom: 6px;
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

    .table-spec tr:nth-child(even) {
      background: #F8FAFC;
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

  <!-- JNotes Collapsible Page Thumbnail Sidebar -->
  <div class="jnotes-sidebar" id="jnotes-sidebar">
    <div class="sidebar-header">
      <span>🗂️ فهرس الصفحات (17)</span>
      <small style="color: #94A3B8;">JNotes Studio</small>
    </div>
    <div class="sidebar-thumbnails-list">
      <div class="thumb-card active" onclick="scrollToPage(1)">
        <div class="thumb-num">1</div>
        <div class="thumb-info">
          <h5>غلاف المحاضرة</h5>
          <p>Title & Agenda</p>
        </div>
      </div>
      <div class="thumb-card" onclick="scrollToPage(2)">
        <div class="thumb-num">2</div>
        <div class="thumb-info">
          <h5>القسم 1: المفاهيم الأساسية</h5>
          <p>Definitions & Triad</p>
        </div>
      </div>
      <div class="thumb-card" onclick="scrollToPage(3)">
        <div class="thumb-num">3</div>
        <div class="thumb-info">
          <h5>القسم 2: المتطلبات الحيوية</h5>
          <p>Biological Requirements</p>
        </div>
      </div>
      <div class="thumb-card" onclick="scrollToPage(4)">
        <div class="thumb-num">4</div>
        <div class="thumb-info">
          <h5>القسم 3: الميكانيكية والجمالية</h5>
          <p>Mechanical & Esthetic</p>
        </div>
      </div>
      <div class="thumb-card" onclick="scrollToPage(5)">
        <div class="thumb-num">5</div>
        <div class="thumb-info">
          <h5>القسم 4: تصنيف التركيبات</h5>
          <p>Classification Matrix</p>
        </div>
      </div>
      <div class="thumb-card" onclick="scrollToPage(6)">
        <div class="thumb-num">6</div>
        <div class="thumb-info">
          <h5>القسم 5: التيجان المعدنية Preformed</h5>
          <p>Aluminum Crowns</p>
        </div>
      </div>
      <div class="thumb-card" onclick="scrollToPage(7)">
        <div class="thumb-num">7</div>
        <div class="thumb-info">
          <h5>القسم 6: التيجان البلاستيكية</h5>
          <p>Polycarbonate Crowns</p>
        </div>
      </div>
      <div class="thumb-card" onclick="scrollToPage(8)">
        <div class="thumb-num">8</div>
        <div class="thumb-info">
          <h5>القسم 7: التركيبات المخصصة</h5>
          <p>Custom Provisionals</p>
        </div>
      </div>
      <div class="thumb-card" onclick="scrollToPage(9)">
        <div class="thumb-num">9</div>
        <div class="thumb-info">
          <h5>القسم 8: التقنية المباشرة</h5>
          <p>Direct Technique</p>
        </div>
      </div>
      <div class="thumb-card" onclick="scrollToPage(10)">
        <div class="thumb-num">10</div>
        <div class="thumb-info">
          <h5>القسم 9: التقنية غير المباشرة</h5>
          <p>Indirect Lab Technique</p>
        </div>
      </div>
      <div class="thumb-card" onclick="scrollToPage(11)">
        <div class="thumb-num">11</div>
        <div class="thumb-info">
          <h5>القسم 10: مصفوفة Vacuum Matrix</h5>
          <p>Vacuum Shell Form</p>
        </div>
      </div>
      <div class="thumb-card" onclick="scrollToPage(12)">
        <div class="thumb-num">12</div>
        <div class="thumb-info">
          <h5>القسم 11: مقارنة المواد</h5>
          <p>Acrylic vs Composite</p>
        </div>
      </div>
      <div class="thumb-card" onclick="scrollToPage(13)">
        <div class="thumb-num">13</div>
        <div class="thumb-info">
          <h5>القسم 12: أسمنت التثبيت المؤقت</h5>
          <p>Provisional Cements</p>
        </div>
      </div>
      <div class="thumb-card" onclick="scrollToPage(14)">
        <div class="thumb-num">14</div>
        <div class="thumb-info">
          <h5>القسم 13: الجسور متعددة الوحدات</h5>
          <p>Pontic Designs & Bridges</p>
        </div>
      </div>
      <div class="thumb-card" onclick="scrollToPage(15)">
        <div class="thumb-num">15</div>
        <div class="thumb-info">
          <h5>القسم 14: المضاعفات الإكلينيكية</h5>
          <p>Complications & Fixes</p>
        </div>
      </div>
      <div class="thumb-card" onclick="scrollToPage(16)">
        <div class="thumb-num">16</div>
        <div class="thumb-info">
          <h5>القسم 15: التلميع والعناية</h5>
          <p>Finishing & Maintenance</p>
        </div>
      </div>
      <div class="thumb-card" onclick="scrollToPage(17)">
        <div class="thumb-num">17</div>
        <div class="thumb-info">
          <h5>القسم 16: أسئلة المراجعة</h5>
          <p>Exam Review & MCQs</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Document Paper Scroll Viewport -->
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

    <!-- PAGE 3 -->
    <div class="doc-page" id="page-3" data-page="3">
      <canvas class="canvas-overlay" id="canvas-3"></canvas>
      <div class="page-header">
        <h4>Module 2: Biological Requirements</h4>
        <span>Provisional Restoration & Temporization</span>
      </div>

      <h3 class="section-title">SECTION 2: BIOLOGICAL REQUIREMENTS</h3>
      
      <p><strong>1. Pulp Protection:</strong></p>
      <p style="margin-bottom: 14px;">During tooth preparation, dentinal tubules are exposed (over 30,000 to 40,000 tubules per mm²). The provisional restoration seals dentin from microleakage, thermal shock, chemical irritation from cements, and bacterial invasion.</p>

      <p><strong>2. Periodontal Health & Gingival Margins:</strong></p>
      <p style="margin-bottom: 14px;">Smooth, well-contoured subgingival or supragingival margins prevent plaque accumulation and gingival inflammation. Over-extended margins cause gingival ischemia and tissue recession; under-extended margins lead to gingival hyperplasia.</p>

      <p><strong>3. Positional Stability:</strong></p>
      <p style="margin-bottom: 14px;">Maintains inter-arch occlusal contacts and intra-arch proximal contact points. Prevents supra-eruption of opposing teeth and mesial/distal drifting of prepared teeth.</p>

      <p><strong>4. Prevention of Tooth Structure Fracture:</strong></p>
      <p style="margin-bottom: 14px;">Protects weakened prepared cusps, especially in partial-coverage preparations (onlays/inlays) and endodontically treated teeth from masticatory fracture forces.</p>

      <div class="clinical-callout">
        <strong>CRITICAL CLINICAL PEARL:</strong> A poorly contoured provisional margin is the #1 cause of marginal bleeding during final impression and luting procedures!
      </div>

      <div class="page-footer">
        <span>Dr. Hala Alhawij | Fixed Prosthodontics II</span>
        <span>Page 3 of 17</span>
      </div>
    </div>

    <!-- PAGE 4 -->
    <div class="doc-page" id="page-4" data-page="4">
      <canvas class="canvas-overlay" id="canvas-4"></canvas>
      <div class="page-header">
        <h4>Module 3: Mechanical & Esthetic</h4>
        <span>Provisional Restoration & Temporization</span>
      </div>

      <h3 class="section-title">SECTION 3: MECHANICAL & ESTHETIC REQUIREMENTS</h3>

      <p><strong>1. Mechanical Requirements:</strong></p>
      <ul class="bullet-list">
        <li><strong>Functional Strength:</strong> Must withstand functional occlusal forces without fracture or excessive flexure (especially in long-span multi-unit bridges).</li>
        <li><strong>Retention & Resistance:</strong> Must resist displacement under dislodging forces. Internal adaptation to preparation taper is essential.</li>
        <li><strong>Retrievability & Reusability:</strong> Must allow intact removal for diagnostic try-ins of final frameworks and re-cementation without structural collapse.</li>
      </ul>

      <p><strong>2. Esthetic Requirements:</strong></p>
      <ul class="bullet-list">
        <li>Matching optical shade, translucency, and surface texture of adjacent natural dentition.</li>
        <li>Guide for definitive restoration contour, lip support, and anterior guidance line.</li>
        <li>Maintaining proper phonetics (especially labiodental 'F/V' sounds and linguopalatal 'S/Z' sounds).</li>
      </ul>

      <div class="page-footer">
        <span>Dr. Hala Alhawij | Fixed Prosthodontics II</span>
        <span>Page 4 of 17</span>
      </div>
    </div>

    <!-- PAGE 5 -->
    <div class="doc-page" id="page-5" data-page="5">
      <canvas class="canvas-overlay" id="canvas-5"></canvas>
      <div class="page-header">
        <h4>Module 4: Classification</h4>
        <span>Provisional Restoration & Temporization</span>
      </div>

      <h3 class="section-title">SECTION 4: CLASSIFICATION OF PROVISIONAL RESTORATIONS</h3>

      <p><strong>A) By Fabrication Method:</strong></p>
      <ul class="bullet-list">
        <li><strong>Preformed Shells:</strong> Prefabricated stock crowns (Metal or Polycarbonate).</li>
        <li><strong>Custom-Made:</strong> Molded chairside or in lab specifically for patient's anatomical prep.</li>
      </ul>

      <p><strong>B) By Clinical Technique:</strong></p>
      <ul class="bullet-list">
        <li><strong>Direct Technique:</strong> Fabricated directly inside patient's mouth.</li>
        <li><strong>Indirect Technique:</strong> Fabricated outside mouth on a stone cast.</li>
        <li><strong>Direct-Indirect Combination:</strong> Pre-fabricated shell relined intraorally.</li>
      </ul>

      <h3 class="section-title">TYPES OF PREFORMED STOCK CROWNS</h3>
      <table class="table-spec">
        <thead>
          <tr>
            <th>Material Type</th>
            <th>Specific Examples</th>
            <th>Primary Clinical Indications</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Metal Shells</strong></td>
            <td>Aluminum, Ni-Cr, Stainless Steel</td>
            <td>Posterior molars & premolars (high masticatory strength)</td>
          </tr>
          <tr>
            <td><strong>Plastic Shells</strong></td>
            <td>Polycarbonate, Micro-filled Acrylic, Celluloid</td>
            <td>Anterior incisors & canines (high esthetic demand)</td>
          </tr>
        </tbody>
      </table>

      <div class="page-footer">
        <span>Dr. Hala Alhawij | Fixed Prosthodontics II</span>
        <span>Page 5 of 17</span>
      </div>
    </div>

    <!-- PAGE 6 -->
    <div class="doc-page" id="page-6" data-page="6">
      <canvas class="canvas-overlay" id="canvas-6"></canvas>
      <div class="page-header">
        <h4>Module 5: Aluminum Crowns</h4>
        <span>Provisional Restoration & Temporization</span>
      </div>

      <h3 class="section-title">SECTION 5: CLINICAL PROCEDURE - ALUMINUM PREFORMED CROWNS</h3>

      <p><strong>Step-by-Step Clinical Protocol:</strong></p>
      <ul class="bullet-list">
        <li><strong>Step 1: Size Selection:</strong> Measure mesio-distal space using a divider or calipers. Select matching size (Range: 2 to 19).</li>
        <li><strong>Step 2: Cervical Trimming:</strong> Trim cervical margins using curved crown and collar scissors to follow curvature of free gingival margin.</li>
        <li><strong>Step 3: Seating & Occlusal Adjustment:</strong> Seat on prepared tooth, check contact points and occlusal clearance with articulation paper.</li>
        <li><strong>Step 4: Edge Smoothing:</strong> Smooth cut metal edges with green stone bur and rubber wheel to prevent soft tissue laceration.</li>
        <li><strong>Step 5: Luting:</strong> Cement with Zinc Oxide Eugenol (ZOE) temporary cement. Remove all interproximal excess cement.</li>
      </ul>

      <div class="clinical-callout">
        <strong>SAFETY NOTE:</strong> Unsmoothed cut aluminum margins cause severe traumatic gingival laceration and necrosis! Always polish trimmed margins thoroughly.
      </div>

      <div class="page-footer">
        <span>Dr. Hala Alhawij | Fixed Prosthodontics II</span>
        <span>Page 6 of 17</span>
      </div>
    </div>

    <!-- PAGE 7 -->
    <div class="doc-page" id="page-7" data-page="7">
      <canvas class="canvas-overlay" id="canvas-7"></canvas>
      <div class="page-header">
        <h4>Module 6: Polycarbonate Crowns</h4>
        <span>Provisional Restoration & Temporization</span>
      </div>

      <h3 class="section-title">SECTION 6: CLINICAL PROCEDURE - POLYCARBONATE PREFORMED CROWNS</h3>

      <p><strong>Relining Protocol with Acrylic Resin:</strong></p>
      <ul class="bullet-list">
        <li><strong>Step 1:</strong> Select translucent polycarbonate crown matching tooth shade and anatomical width.</li>
        <li><strong>Step 2:</strong> Apply petroleum jelly (separating medium) over prepared tooth stump and adjacent gingiva.</li>
        <li><strong>Step 3:</strong> Adapt cervical margin of shell using acrylic bur.</li>
        <li><strong>Step 4:</strong> Mix self-curing PMMA or PEMA resin to doughy stage and fill inside shell.</li>
        <li><strong>Step 5:</strong> Seat shell over tooth prep, align incisal edge with adjacent teeth.</li>
        <li><strong>Step 6:</strong> Remove from mouth before full polymerization heat peak to prevent thermal pulp injury!</li>
        <li><strong>Step 7:</strong> Trim flash excess, polish with pumice, and cement with non-eugenol or ZOE cement.</li>
      </ul>

      <div class="page-footer">
        <span>Dr. Hala Alhawij | Fixed Prosthodontics II</span>
        <span>Page 7 of 17</span>
      </div>
    </div>

    <!-- PAGE 8 -->
    <div class="doc-page" id="page-8" data-page="8">
      <canvas class="canvas-overlay" id="canvas-8"></canvas>
      <div class="page-header">
        <h4>Module 7: Custom Restorations</h4>
        <span>Provisional Restoration & Temporization</span>
      </div>

      <h3 class="section-title">SECTION 7: CUSTOM PROVISIONAL RESTORATIONS OVERVIEW</h3>

      <p>Custom provisionals provide superior anatomical accuracy, precise fit, and optimal emergence profile compared to preformed stock crowns.</p>

      <table class="table-spec">
        <thead>
          <tr>
            <th>Technique Type</th>
            <th>Key Advantages</th>
            <th>Primary Disadvantages</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Direct Technique</strong></td>
            <td>No lab turnaround time, cost-effective, immediate delivery</td>
            <td>Monomer toxicity risk, exothermic heat on pulp, higher shrinkage</td>
          </tr>
          <tr>
            <td><strong>Indirect Technique</strong></td>
            <td>Pulp protection, optimal marginal fit, saves chairside time</td>
            <td>Requires stone cast pouring, longer clinical turnover</td>
          </tr>
        </tbody>
      </table>

      <div class="page-footer">
        <span>Dr. Hala Alhawij | Fixed Prosthodontics II</span>
        <span>Page 8 of 17</span>
      </div>
    </div>

    <!-- PAGE 9 -->
    <div class="doc-page" id="page-9" data-page="9">
      <canvas class="canvas-overlay" id="canvas-9"></canvas>
      <div class="page-header">
        <h4>Module 8: Direct Technique</h4>
        <span>Provisional Restoration & Temporization</span>
      </div>

      <h3 class="section-title">SECTION 8: DIRECT TECHNIQUE DETAILED PROTOCOL</h3>

      <p><strong>Step-by-Step Clinical Procedure:</strong></p>
      <ul class="bullet-list">
        <li><strong>Step 1: Pre-operative Impression:</strong> Take an elastomeric rubber base (putty) or alginate impression prior to tooth preparation.</li>
        <li><strong>Step 2: Tooth Preparation:</strong> Complete crown preparation following standard reduction guidelines.</li>
        <li><strong>Step 3: Separating Medium:</strong> Liberally coat prep and surrounding tissues with mineral oil or vaseline.</li>
        <li><strong>Step 4: Resin Loading:</strong> Mix auto-polymerizing resin and inject into matrix corresponding to prep site.</li>
        <li><strong>Step 5: Intraoral Seating:</strong> Seat matrix in mouth. Monitor resin polymerization state.</li>
        <li><strong>Step 6: Timed Removal:</strong> Remove matrix when resin reaches rubbery elastomeric phase (approx. 2-3 mins). DO NOT leave until fully set!</li>
        <li><strong>Step 7: Trim & Polish:</strong> Trim cervical flash under magnification, adjust occlusion, and polish to high gloss.</li>
      </ul>

      <div class="page-footer">
        <span>Dr. Hala Alhawij | Fixed Prosthodontics II</span>
        <span>Page 9 of 17</span>
      </div>
    </div>

    <!-- PAGE 10 -->
    <div class="doc-page" id="page-10" data-page="10">
      <canvas class="canvas-overlay" id="canvas-10"></canvas>
      <div class="page-header">
        <h4>Module 9: Indirect Technique</h4>
        <span>Provisional Restoration & Temporization</span>
      </div>

      <h3 class="section-title">SECTION 9: INDIRECT LABORATORY TECHNIQUE PROTOCOL</h3>

      <p><strong>Why Choose Indirect Technique?</strong></p>
      <p style="margin-bottom: 14px;">The indirect method completely eliminates pulp exposure to free monomer chemical irritation and exothermic polymerization heat (up to 70°C in direct PMMA setting!).</p>

      <p><strong>Protocol Steps:</strong></p>
      <ul class="bullet-list">
        <li><strong>Step 1:</strong> Take quick-setting alginate impression of prepared tooth.</li>
        <li><strong>Step 2:</strong> Pour impression with fast-setting stone (Snap-stone or plaster).</li>
        <li><strong>Step 3:</strong> Apply separator to stone cast prep site.</li>
        <li><strong>Step 4:</strong> Seat pre-op matrix loaded with resin onto stone cast and clamp tightly.</li>
        <li><strong>Step 5:</strong> Place in pressure pot (20 psi warm water) for 5 minutes for dense, bubble-free polymerization.</li>
        <li><strong>Step 6:</strong> Retrieve provisional, polish, and try in patient's mouth.</li>
      </ul>

      <div class="page-footer">
        <span>Dr. Hala Alhawij | Fixed Prosthodontics II</span>
        <span>Page 10 of 17</span>
      </div>
    </div>

    <!-- PAGE 11 -->
    <div class="doc-page" id="page-11" data-page="11">
      <canvas class="canvas-overlay" id="canvas-11"></canvas>
      <div class="page-header">
        <h4>Module 10: Vacuum Matrix</h4>
        <span>Provisional Restoration & Temporization</span>
      </div>

      <h3 class="section-title">SECTION 10: VACUUM-FORMED CLEAR PLASTIC SHELL TECHNIQUE</h3>

      <p><strong>Procedure:</strong></p>
      <ul class="bullet-list">
        <li>Fabricate diagnostic wax-up of ideal tooth contours on preliminary study model.</li>
        <li>Form a 0.020-inch clear thermoplastic sheet over wax-up model using vacuum former machine.</li>
        <li>Trim plastic shell 2mm beyond gingival margins.</li>
        <li>Load clear matrix with Bis-acryl composite resin and position over prep.</li>
        <li>Translucent shell allows direct light-curing and visual inspection of complete seating!</li>
      </ul>

      <div class="page-footer">
        <span>Dr. Hala Alhawij | Fixed Prosthodontics II</span>
        <span>Page 11 of 17</span>
      </div>
    </div>

    <!-- PAGE 12 -->
    <div class="doc-page" id="page-12" data-page="12">
      <canvas class="canvas-overlay" id="canvas-12"></canvas>
      <div class="page-header">
        <h4>Module 11: Materials Comparison</h4>
        <span>Provisional Restoration & Temporization</span>
      </div>

      <h3 class="section-title">SECTION 11: PROVISIONAL MATERIALS COMPARATIVE MATRIX</h3>

      <table class="table-spec">
        <thead>
          <tr>
            <th>Property</th>
            <th>PMMA (Polymethyl Met.)</th>
            <th>PEMA (Polyethyl Met.)</th>
            <th>Bis-Acryl Composite</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Exothermic Heat</strong></td>
            <td>High (Pulp hazard)</td>
            <td>Low / Moderate</td>
            <td>Very Low (Safe)</td>
          </tr>
          <tr>
            <td><strong>Shrinkage</strong></td>
            <td>High (6-8% volume)</td>
            <td>Low (1-2%)</td>
            <td>Minimal (< 1.5%)</td>
          </tr>
          <tr>
            <td><strong>Flexural Strength</strong></td>
            <td>High (Excellent)</td>
            <td>Moderate</td>
            <td>High (Brittle in thin areas)</td>
          </tr>
          <tr>
            <td><strong>Shade Stability</strong></td>
            <td>Good</td>
            <td>Fair (Porous)</td>
            <td>Excellent</td>
          </tr>
        </tbody>
      </table>

      <div class="page-footer">
        <span>Dr. Hala Alhawij | Fixed Prosthodontics II</span>
        <span>Page 12 of 17</span>
      </div>
    </div>

    <!-- PAGE 13 -->
    <div class="doc-page" id="page-13" data-page="13">
      <canvas class="canvas-overlay" id="canvas-13"></canvas>
      <div class="page-header">
        <h4>Module 12: Provisional Cements</h4>
        <span>Provisional Restoration & Temporization</span>
      </div>

      <h3 class="section-title">SECTION 12: PROVISIONAL LUTING CEMENTS & EUGENOL IMPACT</h3>

      <p><strong>1. Zinc Oxide Eugenol (ZOE):</strong></p>
      <p style="margin-bottom: 12px;">Excellent sedative effect on pulp. Provides good seal.</p>

      <div class="clinical-callout">
        <strong>IMPORTANT WARNING:</strong> Free Eugenol inhibits free-radical polymerization of permanent resin cements and composite core buildups! Use Non-Eugenol Zinc Oxide (NEZO) if final restoration is to be bonded with resin cement!
      </div>

      <p><strong>2. Non-Eugenol Cements (NEZO):</strong></p>
      <p style="margin-bottom: 12px;">Formulated with carboxylic acids. Compatible with all definitive resin luting agents.</p>

      <div class="page-footer">
        <span>Dr. Hala Alhawij | Fixed Prosthodontics II</span>
        <span>Page 13 of 17</span>
      </div>
    </div>

    <!-- PAGE 14 -->
    <div class="doc-page" id="page-14" data-page="14">
      <canvas class="canvas-overlay" id="canvas-14"></canvas>
      <div class="page-header">
        <h4>Module 13: Multi-Unit Bridges</h4>
        <span>Provisional Restoration & Temporization</span>
      </div>

      <h3 class="section-title">SECTION 13: MULTI-UNIT PROVISIONAL BRIDGES & PONTICS</h3>

      <ul class="bullet-list">
        <li><strong>Connector Thickness:</strong> Connectors between abutment and pontic must be reinforced (minimum 3mm x 3mm cross-section).</li>
        <li><strong>Modified Ridge Lap Pontic:</strong> Recommended pontic design for anterior provisionals (contact only on facial ridge aspect).</li>
        <li><strong>Hygiene Embrasure:</strong> Interdental embrasures must remain open to allow passage of superfloss and interdental brushes.</li>
      </ul>

      <div class="page-footer">
        <span>Dr. Hala Alhawij | Fixed Prosthodontics II</span>
        <span>Page 14 of 17</span>
      </div>
    </div>

    <!-- PAGE 15 -->
    <div class="doc-page" id="page-15" data-page="15">
      <canvas class="canvas-overlay" id="canvas-15"></canvas>
      <div class="page-header">
        <h4>Module 14: Complications</h4>
        <span>Provisional Restoration & Temporization</span>
      </div>

      <h3 class="section-title">SECTION 14: CLINICAL COMPLICATIONS & TROUBLESHOOTING</h3>

      <p><strong>1. Debonding / Loss of Retention:</strong></p>
      <p style="margin-bottom: 12px;">Causes: Over-tapered prep, weak cement, occlusal interference. Fix: Reline provisional internally with resin or use stronger provisional cement.</p>

      <p><strong>2. Fracture of Provisional:</strong></p>
      <p style="margin-bottom: 12px;">Causes: Inadequate occlusal clearance, thin connector. Fix: Repair with light-cure flowable composite chairside.</p>

      <p><strong>3. Gingival Inflammation & Bleeding:</strong></p>
      <p style="margin-bottom: 12px;">Causes: Over-extended rough margins, unremoved excess cement. Fix: Re-contour margin and polish smooth.</p>

      <div class="page-footer">
        <span>Dr. Hala Alhawij | Fixed Prosthodontics II</span>
        <span>Page 15 of 17</span>
      </div>
    </div>

    <!-- PAGE 16 -->
    <div class="doc-page" id="page-16" data-page="16">
      <canvas class="canvas-overlay" id="canvas-16"></canvas>
      <div class="page-header">
        <h4>Module 15: Finishing & Maintenance</h4>
        <span>Provisional Restoration & Temporization</span>
      </div>

      <h3 class="section-title">SECTION 15: FINISHING, POLISHING & PATIENT MAINTENANCE</h3>

      <p><strong>Finishing Sequence:</strong></p>
      <ol style="margin-left: 20px; margin-bottom: 16px; font-size: 0.9rem;">
        <li>Trim gross excess with cross-cut carbide bur.</li>
        <li>Refine embrasures with fine diamond burs.</li>
        <li>Smooth surfaces with silicone rubber polishers.</li>
        <li>High-gloss glaze polish with flour of pumice and Robinson rag wheel.</li>
      </ol>

      <p><strong>Home Care Instructions for Patient:</strong></p>
      <ul class="bullet-list">
        <li>Avoid chewing hard, sticky foods (caramel, chewing gum).</li>
        <li>Pull dental floss sideways through interproximal spaces rather than popping upward!</li>
      </ul>

      <div class="page-footer">
        <span>Dr. Hala Alhawij | Fixed Prosthodontics II</span>
        <span>Page 16 of 17</span>
      </div>
    </div>

    <!-- PAGE 17 -->
    <div class="doc-page" id="page-17" data-page="17">
      <canvas class="canvas-overlay" id="canvas-17"></canvas>
      <div class="page-header">
        <h4>Module 16: Exam Review</h4>
        <span>Provisional Restoration & Temporization</span>
      </div>

      <h3 class="section-title">SECTION 16: SUMMARY & EXAM PRACTICE MCQs</h3>

      <p style="margin-bottom: 16px;"><strong>Question 1: Which provisional material generates the highest exothermic heat during setting?</strong></p>
      <p style="color: #0369A1; margin-bottom: 16px;">✓ <strong>Answer:</strong> Polymethyl Methacrylate (PMMA). Must be removed before full set.</p>

      <p style="margin-bottom: 16px;"><strong>Question 2: Why is Eugenol cement contraindicated prior to bonding resin crowns?</strong></p>
      <p style="color: #0369A1; margin-bottom: 16px;">✓ <strong>Answer:</strong> Eugenol inhibits free-radical resin polymerization.</p>

      <p style="margin-bottom: 16px;"><strong>Question 3: What is the primary biological requirement of a provisional crown?</strong></p>
      <p style="color: #0369A1;">✓ <strong>Answer:</strong> Pulp protection and sealing exposed dentinal tubules.</p>

      <div class="page-footer">
        <span>Dr. Hala Alhawij | Fixed Prosthodontics II</span>
        <span>Page 17 of 17</span>
      </div>
    </div>

  </div>

  <!-- JNotes Interactive Studio Logic Script -->
  <script>
    const docId = "${docId}";
    let currentTool = 'pan'; // pan, pen, highlighter, eraser, note
    let currentColor = '#FEF08A';
    let currentStroke = 4;

    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    let strokes = {}; // canvasId -> array of stroke objects
    let notes = [];

    // Scroll to page thumbnail
    window.scrollToPage = function(pageNum) {
      const pageEl = document.getElementById('page-' + pageNum);
      if (pageEl) {
        pageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        document.querySelectorAll('.thumb-card').forEach((c, idx) => {
          c.classList.toggle('active', idx + 1 === pageNum);
        });
        updatePagePill(pageNum);
      }
    };

    // Toggle Sidebar
    window.toggleSidebar = function() {
      const sidebar = document.getElementById('jnotes-sidebar');
      if (sidebar) {
        sidebar.classList.toggle('collapsed');
      }
    };

    // Set Tool from Parent Header
    window.setStudioTool = function(tool, color, stroke) {
      currentTool = tool || 'pan';
      if (color) currentColor = color;
      if (stroke) currentStroke = stroke;

      document.querySelectorAll('.doc-page').forEach(p => {
        p.classList.remove('mode-pan', 'mode-pen', 'mode-highlighter', 'mode-eraser', 'mode-note');
        p.classList.add('mode-' + currentTool);
      });

      document.querySelectorAll('.canvas-overlay').forEach(c => {
        c.classList.toggle('pen-active', currentTool === 'pen' || currentTool === 'highlighter' || currentTool === 'eraser');
      });
    };

    window.setStudioColor = function(color) {
      currentColor = color;
      document.documentElement.style.setProperty('--highlight-color', color);
    };

    window.setStudioStroke = function(stroke) {
      currentStroke = stroke;
    };

    // Canvas Drawing Initialization
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

        // Mouse & Touch Handlers
        canvas.onmousedown = (e) => startDraw(e, canvas, pageNum);
        canvas.onmousemove = (e) => draw(e, canvas, pageNum);
        canvas.onmouseup = () => stopDraw(pageNum);
        canvas.onmouseleave = () => stopDraw(pageNum);

        canvas.ontouchstart = (e) => {
          if (e.touches.length === 1) {
            startDraw(e.touches[0], canvas, pageNum);
            e.preventDefault();
          }
        };
        canvas.ontouchmove = (e) => {
          if (e.touches.length === 1) {
            draw(e.touches[0], canvas, pageNum);
            e.preventDefault();
          }
        };
        canvas.ontouchend = () => stopDraw(pageNum);
      });
    }

    function startDraw(e, canvas, pageNum) {
      if (currentTool !== 'pen' && currentTool !== 'highlighter' && currentTool !== 'eraser') return;
      isDrawing = true;
      const rect = canvas.getBoundingClientRect();
      lastX = e.clientX - rect.left;
      lastY = e.clientY - rect.top;

      if (!strokes[pageNum]) strokes[pageNum] = [];

      if (currentTool === 'eraser') {
        eraseAt(pageNum, lastX, lastY);
      } else {
        strokes[pageNum].push({
          tool: currentTool,
          color: currentColor,
          strokeWidth: currentStroke,
          points: [{ x: lastX, y: lastY }]
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
          const currentPath = currStrokes[currStrokes.length - 1];
          currentPath.points.push({ x, y });
          redrawCanvas(pageNum);
        }
      }

      lastX = x;
      lastY = y;
    }

    function stopDraw(pageNum) {
      isDrawing = false;
    }

    function eraseAt(pageNum, x, y) {
      if (!strokes[pageNum]) return;
      const radius = currentStroke * 4;
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
          ctx.globalAlpha = 0.45;
          ctx.strokeStyle = st.color;
          ctx.lineWidth = st.strokeWidth * 3.5;
        } else {
          ctx.globalAlpha = 1.0;
          ctx.strokeStyle = st.color;
          ctx.lineWidth = st.strokeWidth;
        }

        ctx.stroke();
        ctx.restore();
      });
    }

    // Text Element Highlighting
    document.querySelectorAll('.doc-page p, .doc-page li, .doc-page h3').forEach((el, idx) => {
      el.setAttribute('data-idx', idx);
      el.addEventListener('click', (e) => {
        if (currentTool === 'highlighter') {
          el.classList.toggle('highlighted');
          el.style.setProperty('--highlight-color', currentColor);
        } else if (currentTool === 'eraser') {
          el.classList.remove('highlighted');
        }
      });
    });

    // Sticky Notes Creation
    document.querySelectorAll('.doc-page').forEach(page => {
      page.addEventListener('click', (e) => {
        if (currentTool !== 'note') return;
        if (e.target.closest('.sticky-note-box')) return;
        const rect = page.getBoundingClientRect();
        const x = e.clientX - rect.left - 20;
        const y = e.clientY - rect.top - 20;
        createStickyNote(page, x, y, '');
      });
    });

    function createStickyNote(pageEl, x, y, textContent, existingId) {
      const noteId = existingId || 'note_' + Date.now();
      const note = document.createElement('div');
      note.className = 'sticky-note-box';
      note.style.left = x + 'px';
      note.style.top = y + 'px';
      note.setAttribute('data-id', noteId);

      note.innerHTML = \`
        <div class="sticky-note-header">
          <span>📌 ملاحظة طالب</span>
          <button class="sticky-note-close" onclick="this.parentNode.parentNode.remove()">✕</button>
        </div>
        <textarea placeholder="اكتب ملاحظاتك هنا...">${textContent || ''}</textarea>
      \`;

      pageEl.appendChild(note);
    }

    // Update Top Header Page Pill on Scroll
    const viewport = document.getElementById('jnotes-viewport');
    if (viewport) {
      viewport.addEventListener('scroll', () => {
        const pages = document.querySelectorAll('.doc-page');
        pages.forEach((p, idx) => {
          const rect = p.getBoundingClientRect();
          if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
            updatePagePill(idx + 1);
          }
        });
      });
    }

    function updatePagePill(pageNum) {
      if (window.parent && window.parent.document.getElementById('doc-viewer-pages-text')) {
        window.parent.document.getElementById('doc-viewer-pages-text').textContent = pageNum + ' / 17';
      }
    }

    // Save Annotations
    window.saveAnnotations = function() {
      const highlights = [];
      document.querySelectorAll('.highlighted').forEach(el => {
        highlights.push({
          idx: parseInt(el.getAttribute('data-idx'), 10),
          color: el.style.getPropertyValue('--highlight-color') || '#FEF08A'
        });
      });

      const noteData = [];
      document.querySelectorAll('.sticky-note-box').forEach(n => {
        const pageId = n.parentNode.id;
        const ta = n.querySelector('textarea');
        noteData.push({
          id: n.getAttribute('data-id'),
          pageId: pageId,
          left: parseInt(n.style.left, 10),
          top: parseInt(n.style.top, 10),
          text: ta ? ta.value : ''
        });
      });

      const data = {
        docId: docId,
        highlights: highlights,
        strokes: strokes,
        notes: noteData,
        updatedAt: new Date().toISOString()
      };

      try {
        localStorage.setItem('kf_doc_annotations_' + docId, JSON.stringify(data));
      } catch (e) {}

      return data;
    };

    // Load Annotations
    window.loadSavedAnnotations = function() {
      try {
        const saved = localStorage.getItem('kf_doc_annotations_' + docId);
        if (!saved) return;
        const data = JSON.parse(saved);

        if (Array.isArray(data.highlights)) {
          const allTextEls = document.querySelectorAll('.doc-page p, .doc-page li, .doc-page h3');
          data.highlights.forEach(h => {
            const el = allTextEls[typeof h === 'object' ? h.idx : h];
            if (el) {
              el.classList.add('highlighted');
              if (typeof h === 'object' && h.color) {
                el.style.setProperty('--highlight-color', h.color);
              }
            }
          });
        }

        if (data.strokes) {
          strokes = data.strokes;
          Object.keys(strokes).forEach(pNum => redrawCanvas(pNum));
        }

        if (Array.isArray(data.notes)) {
          data.notes.forEach(n => {
            const pageEl = document.getElementById(n.pageId);
            if (pageEl) createStickyNote(pageEl, n.left, n.top, n.text, n.id);
          });
        }
      } catch (e) {}
    };

    window.addEventListener('DOMContentLoaded', () => {
      initCanvases();
      loadSavedAnnotations();
    });
    window.addEventListener('resize', initCanvases);
    setTimeout(() => {
      initCanvases();
      loadSavedAnnotations();
    }, 250);
  </script>
</body>
</html>`;
  }
};

window.DocumentViewer = DocumentViewer;
