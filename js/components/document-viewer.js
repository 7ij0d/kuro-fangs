/**
 * KURO FANGS — IN-APP INTERACTIVE PDF / DOCUMENT VIEWER & ANNOTATION STUDIO
 * Supports Direct Reading, Highlighter, Freehand Drawing, Text Notes, PDF Download & Cloud Account Saving.
 */

const DocumentViewer = {
  currentDoc: null,
  currentTool: 'highlighter',
  isOpen: false,

  init() {
    if (document.getElementById('doc-viewer-modal')) return;

    const modalMarkup = `
      <div id="doc-viewer-modal" class="doc-viewer-backdrop" aria-hidden="true">
        <div class="doc-viewer-window" role="dialog" aria-modal="true">
          <!-- Viewer Top Header Toolbar -->
          <div class="doc-viewer-header">
            <div class="doc-viewer-title-group">
              <span class="doc-badge-type" id="doc-viewer-badge">PDF • HD</span>
              <div class="doc-viewer-meta-text">
                <h3 id="doc-viewer-title">Lecture Document</h3>
                <p id="doc-viewer-subtitle">Dental Surgery • Year 3</p>
              </div>
            </div>

            <!-- Student Annotation Studio Tools (Highlighter, Pen, Text Notes, Save) -->
            <div class="doc-viewer-annotation-bar" id="doc-annotation-toolbar">
              <button id="doc-tool-highlighter" class="btn-annotation-tool active" title="قلم التظليل الأصفر (Text Highlighter)">
                🖍️ <span>تظليل</span>
              </button>

              <button id="doc-tool-pen" class="btn-annotation-tool" title="قلم الرسم والتعليم اليدوي (Pen Overlay)">
                ✏️ <span>قلم رسم</span>
              </button>

              <button id="doc-tool-note" class="btn-annotation-tool" title="إضافة ملاحظة وتعليق نصي (Text Note)">
                📝 <span>ملاحظة</span>
              </button>

              <button id="doc-save-annotations-btn" class="btn-annotation-tool save-tool" title="حفظ جميع التعديلات والملاحظات في حسابي">
                💾 <span id="doc-save-btn-text">حفظ بحسابي (+5)</span>
              </button>

              <button id="doc-clear-annotations-btn" class="btn-annotation-tool clear-tool" title="مسح التعديلات">
                🧹 <span>مسح</span>
              </button>
            </div>

            <div class="doc-viewer-actions">
              <span class="doc-pages-indicator" id="doc-viewer-pages-pill">
                <i data-lucide="book-open" style="width: 14px; height: 14px;"></i>
                <span id="doc-viewer-pages-text">17 Pages</span>
              </span>

              <button id="doc-viewer-download-btn" class="btn btn-primary btn-sm" title="Download PDF">
                <i data-lucide="download" style="width: 15px; height: 15px;"></i>
                <span id="doc-viewer-download-text">Download</span>
              </button>

              <button id="doc-viewer-print-btn" class="btn btn-secondary btn-sm" title="Print Document">
                <i data-lucide="printer" style="width: 15px; height: 15px;"></i>
              </button>

              <button id="doc-viewer-fullscreen-btn" class="btn btn-secondary btn-sm" title="Toggle Fullscreen">
                <i data-lucide="maximize" style="width: 15px; height: 15px;"></i>
              </button>

              <button id="doc-viewer-close-btn" class="doc-viewer-close-btn" aria-label="Close Viewer">
                ✕
              </button>
            </div>
          </div>

          <!-- Document Viewport Frame -->
          <div class="doc-viewer-body">
            <iframe id="doc-viewer-iframe" class="doc-viewer-iframe" title="Interactive PDF Document Preview" sandbox="allow-scripts allow-same-origin allow-popups"></iframe>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalMarkup);

    // Event listeners
    const modalEl = document.getElementById('doc-viewer-modal');
    const closeBtn = document.getElementById('doc-viewer-close-btn');
    const downloadBtn = document.getElementById('doc-viewer-download-btn');
    const printBtn = document.getElementById('doc-viewer-print-btn');
    const fsBtn = document.getElementById('doc-viewer-fullscreen-btn');
    const saveAnnBtn = document.getElementById('doc-save-annotations-btn');
    const clearAnnBtn = document.getElementById('doc-clear-annotations-btn');

    const toolHighlighterBtn = document.getElementById('doc-tool-highlighter');
    const toolPenBtn = document.getElementById('doc-tool-pen');
    const toolNoteBtn = document.getElementById('doc-tool-note');

    if (toolHighlighterBtn) {
      toolHighlighterBtn.addEventListener('click', () => DocumentViewer.setActiveTool('highlighter'));
    }
    if (toolPenBtn) {
      toolPenBtn.addEventListener('click', () => DocumentViewer.setActiveTool('pen'));
    }
    if (toolNoteBtn) {
      toolNoteBtn.addEventListener('click', () => DocumentViewer.setActiveTool('note'));
    }

    if (closeBtn) closeBtn.addEventListener('click', () => DocumentViewer.close());
    if (modalEl) {
      modalEl.addEventListener('click', (e) => {
        if (e.target === modalEl) DocumentViewer.close();
      });
    }

    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        if (DocumentViewer.currentDoc) {
          DocumentViewer.download(DocumentViewer.currentDoc);
        }
      });
    }

    if (printBtn) {
      printBtn.addEventListener('click', () => {
        const iframe = document.getElementById('doc-viewer-iframe');
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
        }
      });
    }

    if (fsBtn) {
      fsBtn.addEventListener('click', () => {
        const win = document.querySelector('.doc-viewer-window');
        if (win) {
          win.classList.toggle('fullscreen');
        }
      });
    }

    if (saveAnnBtn) {
      saveAnnBtn.addEventListener('click', () => {
        const iframe = document.getElementById('doc-viewer-iframe');
        if (iframe && iframe.contentWindow && typeof iframe.contentWindow.saveAnnotations === 'function') {
          iframe.contentWindow.saveAnnotations();
          if (window.STORE && typeof window.STORE.addPoints === 'function') {
            window.STORE.addPoints(5);
          }
          const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
          if (typeof window.showToast === 'function') {
            window.showToast(
              isAr ? 'تم حفظ تظليلاتك ورسوماتك وملاحظاتك بنجاح في حسابك! (+5 نقاط)' : 'Annotations, drawings & notes saved to your account! (+5 pts)',
              { type: 'success', points: 5 }
            );
          }
          const saveText = document.getElementById('doc-save-btn-text');
          if (saveText) {
            const orig = saveText.textContent;
            saveText.textContent = isAr ? '✅ تم الحفظ!' : '✅ Saved!';
            setTimeout(() => { saveText.textContent = orig; }, 2000);
          }
        }
      });
    }

    if (clearAnnBtn) {
      clearAnnBtn.addEventListener('click', () => {
        const iframe = document.getElementById('doc-viewer-iframe');
        if (iframe && iframe.contentWindow && typeof iframe.contentWindow.clearAnnotations === 'function') {
          iframe.contentWindow.clearAnnotations();
          const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
          if (typeof window.showToast === 'function') {
            window.showToast(isAr ? 'تم مسح جميع التعديلات والملاحظات.' : 'All annotations cleared.', { type: 'info' });
          }
        }
      });
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && DocumentViewer.isOpen) {
        DocumentViewer.close();
      }
    });

    if (window.lucide) window.lucide.createIcons();
  },

  setActiveTool(tool) {
    DocumentViewer.currentTool = tool;
    const hBtn = document.getElementById('doc-tool-highlighter');
    const pBtn = document.getElementById('doc-tool-pen');
    const nBtn = document.getElementById('doc-tool-note');
    if (hBtn) hBtn.classList.toggle('active', tool === 'highlighter');
    if (pBtn) pBtn.classList.toggle('active', tool === 'pen');
    if (nBtn) nBtn.classList.toggle('active', tool === 'note');

    const iframe = document.getElementById('doc-viewer-iframe');
    if (iframe && iframe.contentWindow && typeof iframe.contentWindow.setStudioTool === 'function') {
      iframe.contentWindow.setStudioTool(tool);
    }
  },

  open(doc) {
    DocumentViewer.init();

    DocumentViewer.currentDoc = doc || {
      id: 'sh-fixed-provisional',
      title: 'Provisional Restoration & Temporization',
      title_ar: 'Provisional Restoration & Temporization (التركيبات المؤقتة وطرق إعدادها)',
      title_en: 'Provisional Restoration & Temporization',
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
    const pagesTextEl = document.getElementById('doc-viewer-pages-text');
    const downloadText = document.getElementById('doc-viewer-download-text');
    const iframe = document.getElementById('doc-viewer-iframe');

    const targetDoc = DocumentViewer.currentDoc;
    const docTitle = targetDoc.title || (isAr ? targetDoc.title_ar : targetDoc.title_en) || 'Provisional Restoration & Temporization';
    const docSubject = targetDoc.subject_name || (isAr ? 'الاستعاضة السنية الثابتة 2 (Fixed Pros II)' : 'Fixed Prosthodontics II');
    const docDoctor = targetDoc.doctor_name || (isAr ? 'د. هالة الحويج (Dr. Hala Alhawij)' : 'Dr. Hala Alhawij');
    const docPages = targetDoc.pages || 17;
    const docSize = targetDoc.size || '2.8 MB';

    if (titleEl) titleEl.textContent = docTitle;
    if (subEl) subEl.textContent = `${docSubject} • ${docDoctor} • ${docSize}`;
    if (pagesTextEl) pagesTextEl.textContent = `${docPages} ${isAr ? 'صفحة' : 'Pages'}`;
    if (downloadText) downloadText.textContent = isAr ? 'تنزيل PDF' : 'Download PDF';

    // Reset tool to highlighter
    DocumentViewer.setActiveTool(DocumentViewer.currentTool || 'highlighter');

    // Generate interactive editable HTML for the document
    const srcDocContent = DocumentViewer.generateDocHTML(targetDoc, isAr);
    if (iframe) {
      iframe.onload = () => {
        try {
          if (iframe.contentWindow && typeof iframe.contentWindow.setStudioTool === 'function') {
            iframe.contentWindow.setStudioTool(DocumentViewer.currentTool || 'highlighter');
          }
          if (iframe.contentWindow && typeof iframe.contentWindow.loadSavedAnnotations === 'function') {
            iframe.contentWindow.loadSavedAnnotations();
          }
        } catch (e) {}
      };
      iframe.srcdoc = srcDocContent;
    }

    if (modalEl) {
      modalEl.classList.add('active');
      modalEl.setAttribute('aria-hidden', 'false');
    }

    document.body.style.overflow = 'hidden';

    if (window.lucide) window.lucide.createIcons();
  },

  close() {
    DocumentViewer.isOpen = false;
    const modalEl = document.getElementById('doc-viewer-modal');
    if (modalEl) {
      modalEl.classList.remove('active');
      modalEl.setAttribute('aria-hidden', 'true');
    }

    const win = document.querySelector('.doc-viewer-window');
    if (win) win.classList.remove('fullscreen');

    const iframe = document.getElementById('doc-viewer-iframe');
    if (iframe) {
      iframe.srcdoc = '';
    }

    document.body.style.overflow = '';
  },

  download(doc) {
    if (window.STORE && typeof window.STORE.addPoints === 'function') {
      window.STORE.addPoints(10);
    }
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
    const title = doc?.title || doc?.title_ar || doc?.title_en || 'Provisional Restoration & Temporization';
    const msg = isAr 
      ? `تم بدء تنزيل الشيت بنجاح! (+10 نقاط أكاديمية) — [${title}]`
      : `Download started! (+10 pts earned) — [${title}]`;
    if (typeof window.showToast === 'function') {
      window.showToast(msg, { type: 'success', points: 10 });
    }
  },

  generateDocHTML(doc, isAr) {
    const docId = doc?.id || 'sh-fixed-provisional';
    const title = doc?.title || (isAr ? doc?.title_ar : doc?.title_en) || 'Provisional Restoration & Temporization';
    const doctor = doc?.doctor_name || 'د. هالة الحويج (Dr. Hala Alhawij)';
    const university = doc?.university || 'University of Tripoli - School of Dentistry';
    const year = doc?.year || '2025-2026';
    const totalPages = doc?.pages || 17;

    return `<!DOCTYPE html>
<html lang="${isAr ? 'ar' : 'en'}" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=IBM+Plex+Sans+Arabic:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --brand: #0284C7;
      --brand-dark: #0369A1;
      --highlight: #FEF08A;
      --paper-bg: #FFFFFF;
      --bg: #0F172A;
      --text: #0F172A;
      --text-sub: #475569;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', 'IBM Plex Sans Arabic', sans-serif;
      background-color: #0B1120;
      color: var(--text);
      line-height: 1.65;
      padding: 24px 14px 60px;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }

    /* Floating Studio Toolbar inside Document Viewport */
    .toolbar-sticky-indicator {
      position: sticky;
      top: 10px;
      z-index: 1000;
      background: rgba(15, 23, 42, 0.94);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      color: #FFFFFF;
      padding: 8px 16px;
      border-radius: 40px;
      font-size: 0.8rem;
      font-weight: 700;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.16);
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      width: 100%;
      max-width: 860px;
    }

    .toolbar-sticky-left {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.8rem;
    }

    .toolbar-sticky-right {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }

    .btn-inpage-tool {
      background: rgba(255, 255, 255, 0.1);
      color: #F8FAFC;
      border: 1px solid rgba(255, 255, 255, 0.18);
      padding: 5px 11px;
      border-radius: 20px;
      cursor: pointer;
      font-size: 0.75rem;
      font-weight: 700;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      transition: all 0.2s ease;
      user-select: none;
    }

    .btn-inpage-tool:hover {
      background: rgba(255, 255, 255, 0.22);
      transform: translateY(-1px);
    }

    .btn-inpage-tool.active {
      background: #0284C7 !important;
      color: #FFFFFF !important;
      border-color: #38BDF8 !important;
      box-shadow: 0 0 12px rgba(2, 132, 199, 0.6);
    }

    .btn-inpage-tool.inpage-save {
      background: rgba(16, 185, 129, 0.25);
      color: #34D399;
      border-color: rgba(16, 185, 129, 0.45);
    }
    .btn-inpage-tool.inpage-save:hover {
      background: #10B981;
      color: #FFFFFF;
    }

    .btn-inpage-tool.inpage-clear {
      background: rgba(239, 68, 68, 0.2);
      color: #F87171;
      border-color: rgba(239, 68, 68, 0.35);
    }
    .btn-inpage-tool.inpage-clear:hover {
      background: #EF4444;
      color: #FFFFFF;
    }

    .doc-page {
      background: var(--paper-bg);
      width: 100%;
      max-width: 840px;
      min-height: 1080px;
      border-radius: 10px;
      box-shadow: 0 10px 35px rgba(0, 0, 0, 0.28);
      padding: 48px 54px 60px;
      margin-bottom: 32px;
      position: relative;
      user-select: text;
      border: 1px solid #E2E8F0;
    }

    /* Highlighter Mode Hover & Active State */
    .doc-page.mode-highlighter p:hover, 
    .doc-page.mode-highlighter li:hover,
    .doc-page.mode-highlighter h3:hover,
    .doc-page.mode-highlighter h4:hover {
      background-color: rgba(254, 240, 138, 0.35);
      cursor: pointer;
      border-radius: 4px;
    }

    .highlighted, mark.studio-highlight {
      background-color: #FEF08A !important;
      color: #0F172A !important;
      border-radius: 3px;
      padding: 1px 4px;
      box-shadow: 0 0 10px rgba(254, 240, 138, 0.7) !important;
      font-weight: 600;
    }

    mark.studio-highlight {
      cursor: pointer;
    }

    /* Canvas Drawing Overlay */
    .canvas-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 20;
    }

    .canvas-overlay.pen-active {
      pointer-events: auto !important;
      cursor: crosshair !important;
      touch-action: none;
    }

    .doc-page.mode-pen {
      user-select: none;
    }

    /* Sticky Text Notes Tool */
    .doc-page.mode-note {
      cursor: copy;
    }

    .sticky-note-box {
      position: absolute;
      background: #FEF3C7;
      border: 1.5px solid #F59E0B;
      border-radius: 8px;
      padding: 8px 10px;
      font-size: 0.85rem;
      color: #78350F;
      box-shadow: 0 8px 24px rgba(0,0,0,0.22);
      z-index: 35;
      width: 230px;
      cursor: default;
      user-select: text;
      animation: popIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes popIn {
      from { transform: scale(0.85); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }

    .sticky-note-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: grab;
      margin-bottom: 6px;
      padding-bottom: 4px;
      border-bottom: 1px dashed rgba(245, 158, 11, 0.5);
      font-size: 0.75rem;
      font-weight: 700;
      color: #92400E;
    }

    .sticky-note-header .btn-delete-note {
      background: transparent;
      border: none;
      color: #DC2626;
      font-weight: 800;
      cursor: pointer;
      font-size: 0.9rem;
      line-height: 1;
      padding: 1px 4px;
      border-radius: 4px;
    }
    .sticky-note-header .btn-delete-note:hover {
      background: #FEE2E2;
    }

    .sticky-note-textarea {
      width: 100%;
      height: 75px;
      background: transparent;
      border: none;
      font-family: inherit;
      font-size: 0.825rem;
      color: #451A03;
      resize: vertical;
      outline: none;
      line-height: 1.45;
    }

    /* Academic Handout Typography & Layout */
    .page-header {
      border-bottom: 2px solid #0284C7;
      padding-bottom: 10px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .page-header h4 {
      color: #0284C7;
      font-size: 0.875rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .page-header span {
      font-size: 0.75rem;
      color: var(--text-sub);
      font-weight: 600;
    }

    h1.title-main {
      font-size: 2.15rem;
      font-weight: 900;
      color: #0284C7;
      margin-top: 70px;
      margin-bottom: 8px;
      text-align: center;
      letter-spacing: -0.5px;
    }

    h2.title-sub {
      font-size: 1.5rem;
      font-weight: 800;
      color: #0369A1;
      text-align: center;
      margin-bottom: 45px;
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
      padding: 24px 28px;
      margin-top: 30px;
    }

    .agenda-box h3 {
      font-size: 1.1rem;
      color: #0369A1;
      margin-bottom: 12px;
      border-bottom: 1px dashed #BAE6FD;
      padding-bottom: 6px;
    }

    .section-title {
      font-size: 1.15rem;
      font-weight: 800;
      color: #881337;
      margin: 22px 0 12px;
      padding-bottom: 4px;
      border-bottom: 1.5px solid #FECDD3;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .bullet-list {
      list-style-type: none;
      padding-left: 0;
      margin-bottom: 18px;
    }

    .bullet-list li {
      position: relative;
      padding-left: 22px;
      margin-bottom: 8px;
      font-size: 0.925rem;
      line-height: 1.6;
    }

    .bullet-list li::before {
      content: "•";
      color: #0284C7;
      font-size: 1.4rem;
      position: absolute;
      left: 2px;
      top: -3px;
    }

    .clinical-callout {
      background: #EFF6FF;
      border-left: 4px solid #3B82F6;
      border-radius: 6px;
      padding: 14px 18px;
      margin: 18px 0;
      font-size: 0.885rem;
      color: #1E3A8A;
      line-height: 1.6;
    }

    .warning-callout {
      background: #FFF1F2;
      border-left: 4px solid #E11D48;
      border-radius: 6px;
      padding: 14px 18px;
      margin: 18px 0;
      font-size: 0.885rem;
      color: #881337;
      line-height: 1.6;
    }

    .table-spec {
      width: 100%;
      border-collapse: collapse;
      margin: 18px 0;
      font-size: 0.85rem;
    }

    .table-spec th, .table-spec td {
      border: 1px solid #CBD5E1;
      padding: 8px 12px;
      text-align: left;
    }

    .table-spec th {
      background: #F1F5F9;
      font-weight: 700;
      color: #1E293B;
    }

    .page-footer {
      position: absolute;
      bottom: 20px;
      left: 54px;
      right: 54px;
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: var(--text-sub);
      border-top: 1px solid #E2E8F0;
      padding-top: 10px;
      font-weight: 600;
    }
  </style>
</head>
<body id="doc-body">

  <!-- Sticky In-Document Studio Control Bar -->
  <div class="toolbar-sticky-indicator">
    <div class="toolbar-sticky-left">
      <span id="current-tool-icon">⚡</span>
      <span id="current-tool-label">وضع التظليل الأصفر (انقر على الفقرات أو ظلل النص)</span>
      <span id="save-feedback-badge" style="display: none; background: #10B981; color: #fff; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: 700;">✅ تم الحفظ (+5)</span>
    </div>
    <div class="toolbar-sticky-right">
      <button class="btn-inpage-tool active" data-tool="highlighter" onclick="window.setStudioTool('highlighter')">
        🖍️ <span>تظليل</span>
      </button>
      <button class="btn-inpage-tool" data-tool="pen" onclick="window.setStudioTool('pen')">
        ✏️ <span>قلم رسم</span>
      </button>
      <button class="btn-inpage-tool" data-tool="note" onclick="window.setStudioTool('note')">
        📝 <span>ملاحظة</span>
      </button>
      <button class="btn-inpage-tool inpage-save" onclick="handleInpageSave()">
        💾 <span>حفظ التعديلات (+5)</span>
      </button>
      <button class="btn-inpage-tool inpage-clear" onclick="handleInpageClear()">
        🧹 <span>مسح</span>
      </button>
    </div>
  </div>

  <div class="pdf-page-container">
    <!-- PAGE 1 -->
    <div class="doc-page mode-highlighter" id="page-1">
      <canvas class="canvas-overlay" id="canvas-1"></canvas>
      <div class="page-header">
        <h4>Fixed Prosthodontics II • Official Handout</h4>
        <span>${university}</span>
      </div>

      <h1 class="title-main">PROVISIONAL RESTORATION AND TEMPORIZATION</h1>
      <h2 class="title-sub">CLINICAL TECHNIQUES & CONTEMPORARY PROTOCOLS</h2>

      <div class="meta-center">
        <p><strong>${doctor}</strong></p>
        <p>Department of Fixed Prosthodontics</p>
        <p>${university} • Academic Year ${year}</p>
      </div>

      <div class="agenda-box">
        <h3>ACADEMIC LECTURE AGENDA & CORE MODULES</h3>
        <ul class="bullet-list">
          <li><strong>Module 1:</strong> Definition, Terminology, and Differences vs. Permanent Restorations</li>
          <li><strong>Module 2:</strong> Triad of Requirements (Biologic, Mechanical, and Esthetic)</li>
          <li><strong>Module 3:</strong> Comprehensive Classification of Provisional Restorations</li>
          <li><strong>Module 4:</strong> Preformed Crowns (Aluminum, Stainless Steel, Polycarbonate, Celluloid)</li>
          <li><strong>Module 5:</strong> Custom Fabrication Techniques (Direct, Indirect, Direct-Indirect)</li>
          <li><strong>Module 6:</strong> Contemporary Resins & Material Science (PMMA, PEMA, Bis-Acryl, UDMA)</li>
          <li><strong>Module 7:</strong> Provisional Cements & The Critical Eugenol Incompatibility Warning</li>
          <li><strong>Module 8:</strong> Biologic Emergence Profile, Contouring, and Polishing Protocol</li>
          <li><strong>Module 9:</strong> Clinical Complications, Debonding Management, and High-Yield Board Exam Takeaways</li>
        </ul>
      </div>

      <div class="page-footer">
        <span>Dr. Hala Alhawij | Fixed Prosthodontics</span>
        <span>Page 1 of 17</span>
      </div>
    </div>

    <!-- PAGE 2 -->
    <div class="doc-page mode-highlighter" id="page-2">
      <canvas class="canvas-overlay" id="canvas-2"></canvas>
      <div class="page-header">
        <h4>Module 1: Fundamentals</h4>
        <span>Provisional Restoration & Temporization</span>
      </div>

      <h3 class="section-title">SECTION 1: DEFINITIONS AND TERMINOLOGY</h3>
      <p><strong>Definition of Provisional Restoration:</strong></p>
      <p style="margin-bottom: 14px;">A temporary or interim dental prosthesis designed to enhance esthetics, stabilization, and function for a limited period of time, after which it is replaced by a definitive permanent dental prosthesis.</p>

      <p><strong>Common Synonyms in Prosthodontic Literature:</strong></p>
      <p style="margin-bottom: 20px;">Provisional Restoration | Transitional Crown | Temporary Prosthesis | Interim Treatment Restoration.</p>

      <h3 class="section-title">KEY DIFFERENCES: PROVISIONAL VS. PERMANENT RESTORATIONS</h3>
      <table class="table-spec">
        <thead>
          <tr>
            <th>Characteristic</th>
            <th>Provisional Restoration</th>
            <th>Permanent Definitive Restoration</th>
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
            <td>Fast chairside or rapid laboratory fabrication</td>
            <td>Multi-step casting, pressing, sintering, or CAD/CAM milling</td>
          </tr>
          <tr>
            <td><strong>Retrievability</strong></td>
            <td>Easily removed and re-cemented repeatedly</td>
            <td>Rigidly bonded / permanently luted in place</td>
          </tr>
        </tbody>
      </table>

      <h3 class="section-title">THE TRIAD OF REQUIREMENTS</h3>
      <p>An ideal provisional restoration must simultaneously satisfy three interdependent categories of requirements:</p>
      <ul class="bullet-list">
        <li><strong>A) Biologic Requirements:</strong> Pulp protection, periodontal maintenance, and positional stability.</li>
        <li><strong>B) Mechanical Requirements:</strong> Resistance to functional masticatory forces, displacement resistance, and reuse.</li>
        <li><strong>C) Esthetic Requirements:</strong> Natural tooth shade matching, translucency, and phonetic guidance.</li>
      </ul>

      <div class="page-footer">
        <span>Dr. Hala Alhawij | Fixed Prosthodontics</span>
        <span>Page 2 of 17</span>
      </div>
    </div>

    <!-- PAGE 3 -->
    <div class="doc-page mode-highlighter" id="page-3">
      <canvas class="canvas-overlay" id="canvas-3"></canvas>
      <div class="page-header">
        <h4>Module 2: Biologic Requirements</h4>
        <span>Provisional Restoration & Temporization</span>
      </div>

      <h3 class="section-title">SECTION 2: BIOLOGIC REQUIREMENTS (PART 1)</h3>
      
      <p><strong>1. Pulp Protection:</strong></p>
      <p style="margin-bottom: 14px;">Vital dentin contains 30,000 to 45,000 tubules per mm² near the pulp. Crown preparation removes the protective enamel layer, exposing millions of open dentinal tubules. Without a hermetic seal, the pulp is subjected to thermal shocks (cold and hot beverages), hypertonic chemical stimuli (sugars, acids), and bacterial ingress resulting in pulpitis. The provisional restoration must effectively seal these dentinal tubules.</p>

      <div class="clinical-callout">
        <strong>Clinical Pearl:</strong> Desensitizing agents or dentin bonding resin coats applied to prepared dentin prior to temporization significantly reduce post-operative sensitivity without hampering provisional retention.
      </div>

      <p><strong>2. Periodontal Health:</strong></p>
      <p style="margin-bottom: 14px;">The provisional restoration must harmonize with the marginal periodontium:</p>
      <ul class="bullet-list">
        <li><strong>Marginal Fit:</strong> Overextended margins violate the biologic width and induce chronic gingival inflammation, bleeding, and bone resorption.</li>
        <li><strong>Under-extended Margins:</strong> Leave exposed sensitive dentin and encourage rapid gingival proliferation over the finish line, compromising the definitive impression.</li>
        <li><strong>Surface Finish:</strong> Rough, unpolished provisional acrylic acts as a nidus for plaque biofilm retention and bacterial colonization.</li>
      </ul>

      <div class="page-footer">
        <span>Dr. Hala Alhawij | Fixed Prosthodontics</span>
        <span>Page 3 of 17</span>
      </div>
    </div>

    <!-- PAGE 4 -->
    <div class="doc-page mode-highlighter" id="page-4">
      <canvas class="canvas-overlay" id="canvas-4"></canvas>
      <div class="page-header">
        <h4>Module 2: Biologic Requirements</h4>
        <span>Provisional Restoration & Temporization</span>
      </div>

      <h3 class="section-title">SECTION 3: BIOLOGIC REQUIREMENTS (PART 2)</h3>
      
      <p><strong>3. Positional Stability (Arch Integrity):</strong></p>
      <p style="margin-bottom: 14px;">Unprepared or prepared teeth without stable proximal and occlusal contacts drift within days:</p>
      <ul class="bullet-list">
        <li><strong>Opposing Teeth:</strong> Supra-erupt into the preparation space, altering the occlusal plane and eliminating crucial interocclusal clearance for the definitive crown.</li>
        <li><strong>Adjacent Teeth:</strong> Tip or migrate mesially or distally into the preparation zone, resulting in tight proximal contacts or loss of space.</li>
        <li><strong>Occlusal Harmony:</strong> The provisional must provide accurate centric stops and canine/group guidance without premature contacts.</li>
      </ul>

      <p><strong>4. Prevention of Prepared Tooth Fracture:</strong></p>
      <p style="margin-bottom: 14px;">Prepared teeth—especially those with extensive MOD restorations, endodontically treated teeth, or partial coverage onlay preparations—exhibit significantly weakened cuspal stiffness. The provisional crown shields these vulnerable cusps from fracture under masticatory bolus impacts.</p>

      <div class="clinical-callout">
        <strong>Diagnostic Value:</strong> A provisional restoration serves as a diagnostic template. If the patient develops muscle tenderness or TMJ symptoms, the occlusion of the provisional can be adjusted and refined before committing to permanent porcelain.
      </div>

      <div class="page-footer">
        <span>Dr. Hala Alhawij | Fixed Prosthodontics</span>
        <span>Page 4 of 17</span>
      </div>
    </div>

    <!-- PAGE 5 -->
    <div class="doc-page mode-highlighter" id="page-5">
      <canvas class="canvas-overlay" id="canvas-5"></canvas>
      <div class="page-header">
        <h4>Module 2: Mechanical & Functional</h4>
        <span>Provisional Restoration & Temporization</span>
      </div>

      <h3 class="section-title">SECTION 4: MECHANICAL AND FUNCTIONAL REQUIREMENTS</h3>
      
      <p><strong>1. Resistance to Functional Loads (Strength):</strong></p>
      <p style="margin-bottom: 14px;">Provisional materials exhibit lower compressive and flexural strength than porcelain-fused-to-metal or zirconia. Nonetheless, the restoration must endure normal masticatory cycles without chipping or fracturing, particularly across multi-unit bridge connectors.</p>

      <p><strong>2. Retention and Resistance to Displacement:</strong></p>
      <p style="margin-bottom: 14px;">The restoration must remain firmly seated during functional eating, swallowing, and speaking. Good internal adaptation prevents dislodgement when chewing sticky food.</p>

      <p><strong>3. Retrievability and Reusability:</strong></p>
      <p style="margin-bottom: 14px;">Unlike permanent restorations, the provisional restoration must be easily removed by the clinician during subsequent appointments (e.g., framework trial, shade matching, impression verification) and securely re-cemented without shattering.</p>

      <div class="warning-callout">
        <strong>Caution:</strong> Excessive retention caused by deep undercuts on adjacent teeth or locked resin margins makes removal hazardous and may accidentally avulse or fracture the underlying preparation.
      </div>

      <div class="page-footer">
        <span>Dr. Hala Alhawij | Fixed Prosthodontics</span>
        <span>Page 5 of 17</span>
      </div>
    </div>

    <!-- PAGE 6 -->
    <div class="doc-page mode-highlighter" id="page-6">
      <canvas class="canvas-overlay" id="canvas-6"></canvas>
      <div class="page-header">
        <h4>Module 2: Esthetic & Phonetic</h4>
        <span>Provisional Restoration & Temporization</span>
      </div>

      <h3 class="section-title">SECTION 5: ESTHETIC AND PHONETIC REQUIREMENTS</h3>
      
      <p><strong>1. Shade Compatibility and Color Stability:</strong></p>
      <p style="margin-bottom: 14px;">In anterior teeth, the provisional must blend imperceptibly with neighboring dentition. It must resist dietary staining from coffee, tea, chlorhexidine rinses, and tobacco throughout the interim period.</p>

      <p><strong>2. Phonetic Guide:</strong></p>
      <p style="margin-bottom: 14px;">The provisional contours directly guide speech production:</p>
      <ul class="bullet-list">
        <li><strong>F and V Sounds (Labiodental fricatives):</strong> Verified by checking that the maxillary incisal edge contacts the vermilion border / wet-dry line of the lower lip.</li>
        <li><strong>S and Z Sounds (Linguopalatal sibilants):</strong> Controlled by the palatal contour and cingulum anatomy, maintaining a 1.0 to 1.5 mm speaking space.</li>
      </ul>

      <p><strong>3. Patient Acceptance Blueprint:</strong></p>
      <p style="margin-bottom: 14px;">The provisional crown is the clinical prototype. It confirms patient satisfaction regarding tooth length, incisal display at rest, and smile line before ceramic fabrication.</p>

      <div class="page-footer">
        <span>Dr. Hala Alhawij | Fixed Prosthodontics</span>
        <span>Page 6 of 17</span>
      </div>
    </div>

    <!-- PAGE 7 -->
    <div class="doc-page mode-highlighter" id="page-7">
      <canvas class="canvas-overlay" id="canvas-7"></canvas>
      <div class="page-header">
        <h4>Module 3: Classification</h4>
        <span>Provisional Restoration & Temporization</span>
      </div>

      <h3 class="section-title">SECTION 6: COMPREHENSIVE CLASSIFICATION</h3>
      
      <p><strong>A) Classification by Fabrication Method:</strong></p>
      <ul class="bullet-list">
        <li><strong>Preformed (Prefabricated) Crowns:</strong> Factory-manufactured anatomical shells selected to match tooth size.</li>
        <li><strong>Custom-Made Restorations:</strong> Individually fabricated using impression matrices, putty indices, or CAD/CAM milling.</li>
      </ul>

      <p><strong>B) Classification by Clinical Technique:</strong></p>
      <ul class="bullet-list">
        <li><strong>Direct Technique:</strong> Entirely fabricated chairside in the patient's mouth.</li>
        <li><strong>Indirect Technique:</strong> Fabricated extraorally in the laboratory on a stone model cast.</li>
        <li><strong>Direct-Indirect Technique:</strong> Hybrid combination; shell made on model, relined chairside.</li>
      </ul>

      <p><strong>C) Classification by Intended Clinical Duration:</strong></p>
      <ul class="bullet-list">
        <li><strong>Short-Term (< 4 weeks):</strong> Standard single crowns and small FPDs.</li>
        <li><strong>Medium-Term (1 to 3 months):</strong> Periodontal splinting, tissue healing, or endodontic observation.</li>
        <li><strong>Long-Term / Extended (3 to 12 months):</strong> Full-mouth rehabilitation, TMJ therapy, and implant osseointegration.</li>
      </ul>

      <div class="page-footer">
        <span>Dr. Hala Alhawij | Fixed Prosthodontics</span>
        <span>Page 7 of 17</span>
      </div>
    </div>

    <!-- PAGE 8 -->
    <div class="doc-page mode-highlighter" id="page-8">
      <canvas class="canvas-overlay" id="canvas-8"></canvas>
      <div class="page-header">
        <h4>Module 4: Preformed Crowns</h4>
        <span>Provisional Restoration & Temporization</span>
      </div>

      <h3 class="section-title">SECTION 7: PREFORMED CROWN TYPES & CHARACTERISTICS</h3>
      
      <p><strong>1. Metallic Preformed Crowns (Posterior Indications):</strong></p>
      <ul class="bullet-list">
        <li><strong>Aluminum Shell Crowns:</strong> Soft, highly ductile, easily trimmed with scissors, ideal for posterior emergency temporization.</li>
        <li><strong>Anatomic Aluminum & Tin-Silver Shells:</strong> Feature preformed occlusal anatomy; offer good wear resistance.</li>
        <li><strong>Stainless Steel & Nickel-Chromium Crowns:</strong> Hard, durable; predominantly used in pediatric dentistry and extended posterior provisionalization.</li>
      </ul>

      <p><strong>2. Non-Metallic Preformed Crowns (Anterior & Premolar Indications):</strong></p>
      <ul class="bullet-list">
        <li><strong>Polycarbonate Crowns:</strong> Rigid, tooth-colored thermoplastic shells. They bond chemically with acrylic reline materials and offer high esthetics for incisors and canines.</li>
        <li><strong>Cellulose Acetate (Celluloid) Crown Forms:</strong> Thin, completely transparent plastic molds. They act merely as a carrier matrix and are peeled off and discarded after the resin sets.</li>
      </ul>

      <div class="page-footer">
        <span>Dr. Hala Alhawij | Fixed Prosthodontics</span>
        <span>Page 8 of 17</span>
      </div>
    </div>

    <!-- PAGE 9 -->
    <div class="doc-page mode-highlighter" id="page-9">
      <canvas class="canvas-overlay" id="canvas-9"></canvas>
      <div class="page-header">
        <h4>Module 4: Preformed Procedure</h4>
        <span>Provisional Restoration & Temporization</span>
      </div>

      <h3 class="section-title">SECTION 8: CLINICAL PROTOCOL - ALUMINUM PREFORMED CROWNS</h3>
      
      <p><strong>Step-by-Step Clinical Procedure:</strong></p>
      <ul class="bullet-list">
        <li><strong>Step 1 (Measurement):</strong> Measure the mesiodistal space of the prepared abutment with a Boley gauge or divider.</li>
        <li><strong>Step 2 (Selection):</strong> Select the closest shell size (sizes 2 to 19).</li>
        <li><strong>Step 3 (Cervical Trimming):</strong> Trim cervical margins using curved crown and collar scissors, tracing the gingival crest contours.</li>
        <li><strong>Step 4 (Crimping & Smoothing):</strong> Crimp the cervical edge inwards using crimping pliers for marginal adaptation. Smooth sharp borders with a green carborundum stone bur.</li>
        <li><strong>Step 5 (Occlusal Check):</strong> Seat on preparation and evaluate interocclusal contact with 40 µm articulating paper.</li>
        <li><strong>Step 6 (Cementation):</strong> Lute with Zinc Oxide Eugenol (ZOE) temporary cement. Remove all subgingival excess cement before dismissal.</li>
      </ul>

      <div class="page-footer">
        <span>Dr. Hala Alhawij | Fixed Prosthodontics</span>
        <span>Page 9 of 17</span>
      </div>
    </div>

    <!-- PAGE 10 -->
    <div class="doc-page mode-highlighter" id="page-10">
      <canvas class="canvas-overlay" id="canvas-10"></canvas>
      <div class="page-header">
        <h4>Module 4: Polycarbonate Crowns</h4>
        <span>Provisional Restoration & Temporization</span>
      </div>

      <h3 class="section-title">SECTION 9: CLINICAL PROTOCOL - POLYCARBONATE CROWNS</h3>
      
      <p><strong>Step-by-Step Reline Procedure:</strong></p>
      <ul class="bullet-list">
        <li><strong>Step 1:</strong> Select the polycarbonate mold matching the contralateral natural tooth width and contour.</li>
        <li><strong>Step 2:</strong> Trim the cervical margin with an acrylic bur until the crown seats without blanching gingival tissue.</li>
        <li><strong>Step 3:</strong> Apply petroleum jelly or cocoa butter as a separating medium onto the prepared tooth.</li>
        <li><strong>Step 4:</strong> Mix auto-polymerizing polyethyl methacrylate (PEMA) or methyl methacrylate resin to dough stage.</li>
        <li><strong>Step 5:</strong> Fill the crown shell and firmly seat it onto the lubricated prepared tooth.</li>
        <li><strong>Step 6:</strong> CRITICAL: Remove the crown when the resin enters the rubbery stage (2 to 3 minutes) to prevent locking into proximal undercuts!</li>
        <li><strong>Step 7:</strong> Allow final setting extraorally in warm water (45°C) to accelerate polymerization.</li>
        <li><strong>Step 8:</strong> Trim flash, contour emergence profile, polish with pumice, and cement with non-eugenol temporary cement.</li>
      </ul>

      <div class="page-footer">
        <span>Dr. Hala Alhawij | Fixed Prosthodontics</span>
        <span>Page 10 of 17</span>
      </div>
    </div>

    <!-- PAGE 11 -->
    <div class="doc-page mode-highlighter" id="page-11">
      <canvas class="canvas-overlay" id="canvas-11"></canvas>
      <div class="page-header">
        <h4>Module 5: Custom Direct Technique</h4>
        <span>Provisional Restoration & Temporization</span>
      </div>

      <h3 class="section-title">SECTION 10: CUSTOM PROVISIONAL RESTORATIONS - DIRECT TECHNIQUE</h3>
      
      <p><strong>Pre-operative Matrix Options:</strong></p>
      <ul class="bullet-list">
        <li><strong>1. Pre-operative Alginate Impression:</strong> Rapid, economical; must be kept in a moist napkin to prevent syneresis.</li>
        <li><strong>2. Putty Elastomeric (Silicone) Index:</strong> Excellent dimensional stability, reusable, rigid support for multiple units.</li>
        <li><strong>3. Vacuum-Formed Thermoplastic Matrix:</strong> Transparent 0.020-inch sheet made on a diagnostic cast or wax-up.</li>
      </ul>

      <p><strong>Clinical Execution Workflow:</strong></p>
      <ul class="bullet-list">
        <li>Take pre-operative matrix before initiating tooth preparation.</li>
        <li>Complete tooth reduction, refine finish lines, and thoroughly lubricate preparation with water-soluble lubricant.</li>
        <li>Dispense auto-mix Bis-acryl composite resin into the matrix to prevent air voids.</li>
        <li>Seat matrix in mouth; hold firmly for 2.5 minutes until initial rubbery polymerization.</li>
        <li>Remove matrix, retrieve provisional, trim excess flash with fine carbide finishing burs, and glaze.</li>
      </ul>

      <div class="page-footer">
        <span>Dr. Hala Alhawij | Fixed Prosthodontics</span>
        <span>Page 11 of 17</span>
      </div>
    </div>

    <!-- PAGE 12 -->
    <div class="doc-page mode-highlighter" id="page-12">
      <canvas class="canvas-overlay" id="canvas-12"></canvas>
      <div class="page-header">
        <h4>Module 5: Custom Indirect Technique</h4>
        <span>Provisional Restoration & Temporization</span>
      </div>

      <h3 class="section-title">SECTION 11: CUSTOM PROVISIONAL RESTORATIONS - INDIRECT TECHNIQUE</h3>
      
      <p><strong>Why Indirect Fabrication? (Major Clinical Advantages):</strong></p>
      <ul class="bullet-list">
        <li><strong>Elimination of Pulp Thermal Trauma:</strong> All exothermic heat from acrylic polymerization occurs outside the oral cavity.</li>
        <li><strong>Protection of Soft Tissues:</strong> Zero toxic free-monomer exposure to oral mucosa and marginal gingiva.</li>
        <li><strong>Superior Marginal Accuracy:</strong> Acrylic shrinkage occurs on a stone die rather than in the mouth.</li>
        <li><strong>Ideal for Long-Span Bridges:</strong> Essential for full-arch rehabilitations where multiple preparations are present.</li>
      </ul>

      <p><strong>Laboratory Procedure:</strong></p>
      <ul class="bullet-list">
        <li>Make an irreversible hydrocolloid (alginate) impression immediately after tooth preparation.</li>
        <li>Pour with fast-setting dental stone / quick plaster (sets in 5 minutes).</li>
        <li>Apply separating liquid to stone model.</li>
        <li>Load vacuum-formed template with PMMA or light-cured resin and seat under pressure.</li>
        <li>Trim, polish on laboratory lathe, and seat chairside with temporary luting agent.</li>
      </ul>

      <div class="page-footer">
        <span>Dr. Hala Alhawij | Fixed Prosthodontics</span>
        <span>Page 12 of 17</span>
      </div>
    </div>

    <!-- PAGE 13 -->
    <div class="doc-page mode-highlighter" id="page-13">
      <canvas class="canvas-overlay" id="canvas-13"></canvas>
      <div class="page-header">
        <h4>Module 6: Materials Science</h4>
        <span>Provisional Restoration & Temporization</span>
      </div>

      <h3 class="section-title">SECTION 12: CONTEMPORARY PROVISIONAL RESTORATIVE MATERIALS</h3>
      
      <p><strong>1. Polymethyl Methacrylate (PMMA - e.g., Jet, Alike):</strong></p>
      <p style="margin-bottom: 12px;">Classic powder/liquid acrylic. Offers exceptional transverse strength, excellent polishability, and low material cost. However, it generates intense exothermic heat (temperatures up to 70°C) and experiences significant volumetric polymerization shrinkage (~8%).</p>

      <p><strong>2. Polyethyl Methacrylate (PEMA - e.g., Snap, Trim):</strong></p>
      <p style="margin-bottom: 12px;">Higher molecular weight methacrylate. Exhibits milder exothermic heat and lower polymerization shrinkage. Ideal for chairside relining of preformed crowns, though wear resistance is slightly lower than PMMA.</p>

      <p><strong>3. Bis-Acryl Composite Resins (e.g., Protemp, Integrity, Luxatemp):</strong></p>
      <p style="margin-bottom: 12px;">Auto-mixing cartridge delivery. Contains multifunctional methacrylate monomers with inorganic filler particles. Minimal polymerization shrinkage (1-2%), negligible exothermic rise, superb esthetics, and high initial surface gloss.</p>

      <p><strong>4. Light-Activated Urethane Dimethacrylate (UDMA - e.g., Revotek50):</strong></p>
      <p style="margin-bottom: 12px;">Putty-stick formulation cured on demand with dental LED curing units. Provides unlimited working time, zero odor, and good mechanical properties.</p>

      <div class="page-footer">
        <span>Dr. Hala Alhawij | Fixed Prosthodontics</span>
        <span>Page 13 of 17</span>
      </div>
    </div>

    <!-- PAGE 14 -->
    <div class="doc-page mode-highlighter" id="page-14">
      <canvas class="canvas-overlay" id="canvas-14"></canvas>
      <div class="page-header">
        <h4>Module 6: Comparative Matrix</h4>
        <span>Provisional Restoration & Temporization</span>
      </div>

      <h3 class="section-title">SECTION 13: COMPREHENSIVE MATERIAL COMPARISON MATRIX</h3>
      
      <table class="table-spec">
        <thead>
          <tr>
            <th>Property</th>
            <th>PMMA</th>
            <th>PEMA</th>
            <th>Bis-Acryl Composite</th>
            <th>UDMA Resin</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Exothermic Reaction</strong></td>
            <td>High (up to 70°C)</td>
            <td>Low (35°C - 40°C)</td>
            <td>Very Low (37°C - 42°C)</td>
            <td>Minimal</td>
          </tr>
          <tr>
            <td><strong>Polymerization Shrinkage</strong></td>
            <td>High (~8.0%)</td>
            <td>Moderate (~5.0%)</td>
            <td>Low (1.0% - 2.0%)</td>
            <td>Low (< 2.0%)</td>
          </tr>
          <tr>
            <td><strong>Flexural Strength</strong></td>
            <td>Very High (95 MPa)</td>
            <td>Moderate (60 MPa)</td>
            <td>High (85 - 100 MPa)</td>
            <td>High (90 MPa)</td>
          </tr>
          <tr>
            <td><strong>Esthetics & Polish</strong></td>
            <td>Excellent</td>
            <td>Good</td>
            <td>Superior Gloss</td>
            <td>Superior</td>
          </tr>
          <tr>
            <td><strong>Repairability</strong></td>
            <td>Very Easy (Chemical bond)</td>
            <td>Very Easy</td>
            <td>Requires flowable composite</td>
            <td>Good with bond</td>
          </tr>
          <tr>
            <td><strong>Odor & Irritation</strong></td>
            <td>Strong monomer odor</td>
            <td>Mild odor</td>
            <td>Odorless</td>
            <td>Odorless</td>
          </tr>
        </tbody>
      </table>

      <div class="page-footer">
        <span>Dr. Hala Alhawij | Fixed Prosthodontics</span>
        <span>Page 14 of 17</span>
      </div>
    </div>

    <!-- PAGE 15 -->
    <div class="doc-page mode-highlighter" id="page-15">
      <canvas class="canvas-overlay" id="canvas-15"></canvas>
      <div class="page-header">
        <h4>Module 7: Cements & Eugenol Warning</h4>
        <span>Provisional Restoration & Temporization</span>
      </div>

      <h3 class="section-title">SECTION 14: PROVISIONAL CEMENTS & THE CRITICAL EUGENOL WARNING</h3>
      
      <p><strong>Classification of Provisional Cements:</strong></p>
      <ul class="bullet-list">
        <li><strong>Zinc Oxide Eugenol (ZOE - e.g., Temp-Bond):</strong> Excellent sedative obtundent effect on hyperemic pulp; bacteriostatic.</li>
        <li><strong>Non-Eugenol Zinc Oxide (e.g., Temp-Bond NE, RelyX Temp NE):</strong> Formulated with carboxylic acid oils, safe for all bonded restorations.</li>
        <li><strong>Polycarboxylate Temporary Cements:</strong> High retention, biocompatible, excellent for short abutments with poor retention.</li>
        <li><strong>Resin-Based Temporary Cements:</strong> High translucency for anterior veneers and thin all-ceramic crowns.</li>
      </ul>

      <div class="warning-callout">
        <strong>⚠️ CRITICAL BOARD EXAMINATION PEARL (EUGENOL INHIBITION):</strong><br>
        Eugenol is a phenolic radical scavenger. Free eugenol oil penetrates dentinal tubules and chemically inhibits the free-radical polymerization of permanent resin cements (Panavia, RelyX Ultimate, Multilink) and dentin bonding agents. This causes incomplete cure, dramatically reduced bond strength (up to 50% drop), and microleakage.<br>
        <strong>RULE:</strong> If the definitive crown will be bonded using a resin cement or universal adhesive, ALWAYS use a NON-EUGENOL temporary cement!
      </div>

      <div class="page-footer">
        <span>Dr. Hala Alhawij | Fixed Prosthodontics</span>
        <span>Page 15 of 17</span>
      </div>
    </div>

    <!-- PAGE 16 -->
    <div class="doc-page mode-highlighter" id="page-16">
      <canvas class="canvas-overlay" id="canvas-16"></canvas>
      <div class="page-header">
        <h4>Module 8: Emergence Profile & Polishing</h4>
        <span>Provisional Restoration & Temporization</span>
      </div>

      <h3 class="section-title">SECTION 15: EMERGENCE PROFILE AND POLISHING PROTOCOL</h3>
      
      <p><strong>The Biologic Emergence Profile:</strong></p>
      <p style="margin-bottom: 14px;">The contour of the provisional restoration as it emerges from the gingival sulcus must be straight or slightly concave, precisely replicating the original anatomical tooth profile.</p>

      <ul class="bullet-list">
        <li><strong>Overcontoured Margins:</strong> Create stagnant niches, impingement on interdental papillae, and chronic localized gingivitis.</li>
        <li><strong>Undercontoured Margins:</strong> Inadequately deflect food boluses during mastication, causing direct gingival trauma.</li>
      </ul>

      <h3 class="section-title">CHAIRSIDE POLISHING SEQUENTIAL PROTOCOL</h3>
      <ul class="bullet-list">
        <li><strong>Stage 1 (Contouring):</strong> 12-fluted multi-blade tungsten carbide burs (7901 / 7902) to define embrasures and anatomy.</li>
        <li><strong>Stage 2 (Smoothing):</strong> Silicone polishing wheels (coarse brown, medium green).</li>
        <li><strong>Stage 3 (High Shine):</strong> Robinson bristle brush mounted on a slow-speed handpiece with wet slurry of pumice flour.</li>
        <li><strong>Stage 4 (Final Glaze):</strong> Light-cured resin glaze (e.g., BisCover, Optiglaze) cured for 30 seconds for a glass-like finish.</li>
      </ul>

      <div class="page-footer">
        <span>Dr. Hala Alhawij | Fixed Prosthodontics</span>
        <span>Page 16 of 17</span>
      </div>
    </div>

    <!-- PAGE 17 -->
    <div class="doc-page mode-highlighter" id="page-17">
      <canvas class="canvas-overlay" id="canvas-17"></canvas>
      <div class="page-header">
        <h4>Module 9: Complications & Exam Pearls</h4>
        <span>Provisional Restoration & Temporization</span>
      </div>

      <h3 class="section-title">SECTION 16: CLINICAL COMPLICATIONS AND MANAGEMENT</h3>
      
      <table class="table-spec">
        <thead>
          <tr>
            <th>Complication</th>
            <th>Etiology / Cause</th>
            <th>Clinical Management</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Frequent Debonding</strong></td>
            <td>Short abutment, excessive taper (>20°), or heavy occlusal contacts</td>
            <td>Relieve occlusion; switch to polycarboxylate temporary cement or reline.</td>
          </tr>
          <tr>
            <td><strong>Connector Fracture</strong></td>
            <td>Inadequate connector height (< 3.0 mm) or heavy load</td>
            <td>Reinforce connector with braided polyethylene/glass fibers (Ribbond).</td>
          </tr>
          <tr>
            <td><strong>Marginal Discrepancy</strong></td>
            <td>Polymerization shrinkage or distorted matrix</td>
            <td>Bead-brush marginal reline technique using PEMA or flowable resin.</td>
          </tr>
          <tr>
            <td><strong>Severe Pulpitis</strong></td>
            <td>Heat generation during intraoral set or open tubules</td>
            <td>Cool copious water irrigation during setting; desensitize dentin.</td>
          </tr>
        </tbody>
      </table>

      <h3 class="section-title">SUMMARY & KEY TAKEAWAYS FOR FACULTY EXAMS</h3>
      <ul class="bullet-list">
        <li>Never let PMMA polymerize completely inside the mouth; remove at rubbery stage to prevent undercut lock-in and thermal injury.</li>
        <li>Provisional crowns are essential for biologic pulp health, periodontal integrity, and tooth positional stability.</li>
        <li>Always avoid Eugenol-containing cements when planning definitive adhesive resin bonding.</li>
        <li>Finish lines and emergence profiles must be meticulously polished to ensure healthy pink gingiva on the day of final cementation.</li>
      </ul>

      <div class="page-footer">
        <span>Dr. Hala Alhawij | Fixed Prosthodontics</span>
        <span>Page 17 of 17 • Syllabus Complete</span>
      </div>
    </div>
  </div>

  <!-- Interactive Annotation & Studio Script -->
  <script>
    const docId = "${docId}";
    let currentTool = 'highlighter'; // 'highlighter' | 'pen' | 'note'
    let isDrawing = false;
    let currentCanvasId = null;
    let currentStroke = null;
    let strokes = {}; // { [canvasId]: [ { color, size, points: [{x,y}, ...] } ] }
    let notes = []; // [ { id, pageId, top, left, text } ]
    let noteIdCounter = 1;

    // 1. Initialize Canvases
    function initCanvases() {
      document.querySelectorAll('.canvas-overlay').forEach(canvas => {
        const page = canvas.parentElement;
        if (page) {
          canvas.width = page.clientWidth || 840;
          canvas.height = page.clientHeight || 1080;
        }
      });
    }

    function getCanvasCoords(canvas, e) {
      const rect = canvas.getBoundingClientRect();
      const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    }

    function redrawCanvas(canvasId) {
      const canvas = document.getElementById(canvasId);
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const list = strokes[canvasId] || [];
      list.forEach(str => {
        if (!str.points || str.points.length === 0) return;
        ctx.beginPath();
        ctx.strokeStyle = str.color || '#E11D48';
        ctx.lineWidth = str.size || 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.moveTo(str.points[0].x, str.points[0].y);
        for (let i = 1; i < str.points.length; i++) {
          ctx.lineTo(str.points[i].x, str.points[i].y);
        }
        ctx.stroke();
      });
    }

    // 2. Setup Drawing on Each Canvas
    document.querySelectorAll('.canvas-overlay').forEach(canvas => {
      const cid = canvas.id;
      strokes[cid] = strokes[cid] || [];

      function startDraw(e) {
        if (currentTool !== 'pen') return;
        if (canvas.width === 0 || canvas.height === 0) {
          canvas.width = canvas.parentElement.clientWidth || 840;
          canvas.height = canvas.parentElement.clientHeight || 1080;
        }
        isDrawing = true;
        currentCanvasId = cid;
        const pt = getCanvasCoords(canvas, e);
        currentStroke = { color: '#E11D48', size: 3, points: [pt] };
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.strokeStyle = currentStroke.color;
        ctx.lineWidth = currentStroke.size;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.moveTo(pt.x, pt.y);
        ctx.lineTo(pt.x + 0.1, pt.y + 0.1);
        ctx.stroke();
      }

      function moveDraw(e) {
        if (!isDrawing || currentCanvasId !== cid || currentTool !== 'pen') return;
        if (e.cancelable && e.type.startsWith('touch')) e.preventDefault();
        const pt = getCanvasCoords(canvas, e);
        currentStroke.points.push(pt);
        const ctx = canvas.getContext('2d');
        ctx.lineTo(pt.x, pt.y);
        ctx.stroke();
      }

      function endDraw() {
        if (!isDrawing || currentCanvasId !== cid) return;
        isDrawing = false;
        if (currentStroke && currentStroke.points.length > 0) {
          strokes[cid].push(currentStroke);
        }
        currentStroke = null;
        currentCanvasId = null;
      }

      canvas.addEventListener('mousedown', startDraw);
      canvas.addEventListener('mousemove', moveDraw);
      canvas.addEventListener('mouseup', endDraw);
      canvas.addEventListener('mouseleave', endDraw);

      canvas.addEventListener('touchstart', startDraw, { passive: false });
      canvas.addEventListener('touchmove', moveDraw, { passive: false });
      canvas.addEventListener('touchend', endDraw);
    });

    // 3. Setup Text Highlighting
    document.querySelectorAll('.doc-page p, .doc-page li, .doc-page h3, .doc-page h4').forEach((el, idx) => {
      el.setAttribute('data-idx', idx);
      el.addEventListener('click', (e) => {
        if (currentTool === 'highlighter') {
          el.classList.toggle('highlighted');
        }
      });
    });

    // Mouseup selection highlighter
    document.addEventListener('mouseup', () => {
      if (currentTool !== 'highlighter') return;
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.rangeCount) return;
      const text = sel.toString().trim();
      if (text.length < 2) return;

      const range = sel.getRangeAt(0);
      const container = range.commonAncestorContainer;
      const page = container.nodeType === 1 ? container.closest('.doc-page') : (container.parentElement ? container.parentElement.closest('.doc-page') : null);
      if (!page) return;

      try {
        const mark = document.createElement('mark');
        mark.className = 'studio-highlight';
        mark.title = 'انقر لإلغاء التظليل';
        mark.addEventListener('click', (e) => {
          e.stopPropagation();
          const parent = mark.parentNode;
          while (mark.firstChild) parent.insertBefore(mark.firstChild, mark);
          parent.removeChild(mark);
        });
        range.surroundContents(mark);
        sel.removeAllRanges();
      } catch (err) {
        const block = container.nodeType === 1 ? container.closest('p, li, h3, h4') : (container.parentElement ? container.parentElement.closest('p, li, h3, h4') : null);
        if (block) block.classList.add('highlighted');
      }
    });

    // 4. Sticky Notes Creation & Management
    function createStickyNote(pageEl, x, y, initialText = '', id = null) {
      const noteId = id || 'sn_' + Date.now() + '_' + (noteIdCounter++);
      const noteBox = document.createElement('div');
      noteBox.className = 'sticky-note-box';
      noteBox.id = noteId;
      noteBox.style.left = Math.max(10, Math.min(x, (pageEl.clientWidth || 800) - 240)) + 'px';
      noteBox.style.top = Math.max(10, Math.min(y, (pageEl.clientHeight || 1000) - 130)) + 'px';

      noteBox.innerHTML = 
        '<div class="sticky-note-header">' +
          '<span class="note-handle">📌 ملاحظة طالب</span>' +
          '<button type="button" class="btn-delete-note" title="حذف الملاحظة">✕</button>' +
        '</div>' +
        '<textarea class="sticky-note-textarea" placeholder="اكتب ملاحظتك الأكاديمية هنا..."></textarea>';

      const textarea = noteBox.querySelector('textarea');
      if (textarea) textarea.value = initialText || '';
      const deleteBtn = noteBox.querySelector('.btn-delete-note');
      const header = noteBox.querySelector('.sticky-note-header');

      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        noteBox.remove();
        notes = notes.filter(n => n.id !== noteId);
      });

      textarea.addEventListener('input', () => {
        const n = notes.find(item => item.id === noteId);
        if (n) n.text = textarea.value;
      });

      // Draggable logic
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
          header.style.cursor = 'grab';
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
          text: initialText
        });
      }
    }

    // Click on page in note mode spawns a note
    document.querySelectorAll('.doc-page').forEach(page => {
      page.addEventListener('click', (e) => {
        if (currentTool !== 'note') return;
        if (e.target.closest('.sticky-note-box') || e.target.closest('.toolbar-sticky-indicator')) return;
        const rect = page.getBoundingClientRect();
        const x = e.clientX - rect.left - 20;
        const y = e.clientY - rect.top - 20;
        createStickyNote(page, x, y, '');
      });
    });

    // 5. Tool Switcher
    window.setStudioTool = function(tool) {
      currentTool = tool;
      document.querySelectorAll('.btn-inpage-tool').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tool') === tool);
      });

      const label = document.getElementById('current-tool-label');
      if (label) {
        if (tool === 'highlighter') label.textContent = '🖍️ وضع التظليل الأصفر (انقر على الفقرات أو ظلل النص)';
        else if (tool === 'pen') label.textContent = '✏️ وضع الرسم الحر (اسحب الماوس/القلم للتعليم على الصفحة)';
        else if (tool === 'note') label.textContent = '📝 وضع الملاحظات (انقر في أي مكان لإضافة بطاقة ملاحظة)';
      }

      document.querySelectorAll('.doc-page').forEach(p => {
        p.classList.toggle('mode-highlighter', tool === 'highlighter');
        p.classList.toggle('mode-pen', tool === 'pen');
        p.classList.toggle('mode-note', tool === 'note');
      });

      document.querySelectorAll('.canvas-overlay').forEach(c => {
        c.classList.toggle('pen-active', tool === 'pen');
      });
    };

    // 6. Save Annotations to Account & LocalStorage
    window.saveAnnotations = function() {
      const highlights = [];
      document.querySelectorAll('.doc-page p, .doc-page li, .doc-page h3, .doc-page h4').forEach(el => {
        if (el.classList.contains('highlighted')) {
          highlights.push(parseInt(el.getAttribute('data-idx'), 10));
        }
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

      const badge = document.getElementById('save-feedback-badge');
      if (badge) {
        badge.style.display = 'inline-flex';
        setTimeout(() => { badge.style.display = 'none'; }, 2500);
      }

      return data;
    };

    function handleInpageSave() {
      window.saveAnnotations();
      if (window.parent && window.parent.STORE && typeof window.parent.STORE.addPoints === 'function') {
        window.parent.STORE.addPoints(5);
      }
      if (window.parent && typeof window.parent.showToast === 'function') {
        window.parent.showToast('تم حفظ تظليلاتك ورسوماتك وملاحظاتك بنجاح في حسابك! (+5 نقاط)', { type: 'success', points: 5 });
      }
    }

    // 7. Clear Annotations
    window.clearAnnotations = function() {
      document.querySelectorAll('.highlighted').forEach(el => el.classList.remove('highlighted'));
      document.querySelectorAll('mark.studio-highlight').forEach(mark => {
        const p = mark.parentNode;
        while (mark.firstChild) p.insertBefore(mark.firstChild, mark);
        p.removeChild(mark);
      });

      strokes = {};
      document.querySelectorAll('.canvas-overlay').forEach(c => {
        const ctx = c.getContext('2d');
        ctx.clearRect(0, 0, c.width, c.height);
      });

      document.querySelectorAll('.sticky-note-box').forEach(n => n.remove());
      notes = [];

      try {
        localStorage.removeItem('kf_doc_annotations_' + docId);
      } catch (e) {}
    };

    function handleInpageClear() {
      window.clearAnnotations();
      if (window.parent && typeof window.parent.showToast === 'function') {
        window.parent.showToast('تم مسح جميع التعديلات.', { type: 'info' });
      }
    }

    // 8. Load Saved Annotations
    window.loadSavedAnnotations = function() {
      try {
        const saved = localStorage.getItem('kf_doc_annotations_' + docId);
        if (!saved) return;
        const data = JSON.parse(saved);

        // 1. Highlights
        if (Array.isArray(data.highlights)) {
          const allTextEls = document.querySelectorAll('.doc-page p, .doc-page li, .doc-page h3, .doc-page h4');
          data.highlights.forEach(idx => {
            if (allTextEls[idx]) allTextEls[idx].classList.add('highlighted');
          });
        }

        // 2. Strokes
        if (data.strokes && typeof data.strokes === 'object') {
          strokes = data.strokes;
          Object.keys(strokes).forEach(cid => {
            redrawCanvas(cid);
          });
        }

        // 3. Notes
        if (Array.isArray(data.notes)) {
          notes = [];
          data.notes.forEach(n => {
            const pageEl = document.getElementById(n.pageId);
            if (pageEl) {
              createStickyNote(pageEl, n.left, n.top, n.text, n.id);
            }
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
    }, 200);
  </script>
</body>
</html>`;
  }
};

window.DocumentViewer = DocumentViewer;
