/**
 * KURO FANGS — JNOTES INTERACTIVE TABLET NOTE STUDIO (GOODNOTES OVERHAUL)
 * Fullscreen (100vw x 100vh) Tablet Note Studio Interface with JNotes Top Bar,
 * Collapsible Left Thumbnail Sidebar (17 Slides), Live Color Palette,
 * Stroke Thickness Options, Eraser, Translucent Highlighter, and LocalStorage Sync.
 */

const DocumentViewer = {
  currentDoc: null,
  isOpen: false,
  activeTool: 'highlighter', // 'highlighter', 'pen', 'eraser', 'note'
  activeColor: '#FEF08A', // Yellow default
  activeStroke: 4,

  init() {
    if (document.getElementById('doc-viewer-modal')) return;

    const modalMarkup = `
      <div id="doc-viewer-modal" class="doc-viewer-backdrop" aria-hidden="true">
        <div class="doc-viewer-window" role="dialog" aria-modal="true">
          
          <!-- JNotes Top Bar (Tablet Note Studio Interface) -->
          <div class="doc-viewer-header">
            <div class="doc-viewer-title-group">
              <button id="doc-toggle-sidebar-btn" class="btn btn-secondary btn-sm" title="تبديل القائمة الجانبية للشرائح" style="padding: 5px 9px; display: inline-flex; align-items: center; gap: 5px;">
                <span>📑</span>
                <span style="font-size: 0.75rem; font-weight: 700;">الشرائح</span>
              </button>

              <span class="doc-badge-type" id="doc-viewer-badge">JNOTES • HD</span>
              <div class="doc-viewer-meta-text">
                <h3 id="doc-viewer-title">Provisional Restoration & Temporization</h3>
                <p id="doc-viewer-subtitle">Fixed Prosthodontics II • Dr. Hala Alhawij</p>
              </div>
            </div>

            <!-- JNotes Studio Center Palette -->
            <div class="doc-viewer-annotation-bar">
              <button id="doc-tool-highlighter" class="btn-annotation-tool active" data-tool="highlighter" title="قلم التظليل الفسفوري الشفاف">
                🖍️ <span>تظليل شفاف</span>
              </button>
              <button id="doc-tool-pen" class="btn-annotation-tool" data-tool="pen" title="قلم الرسم الحر">
                ✏️ <span>قلم رسم</span>
              </button>
              <button id="doc-tool-eraser" class="btn-annotation-tool" data-tool="eraser" title="ممحاة التعديلات">
                🧹 <span>ممحاة</span>
              </button>
              <button id="doc-tool-note" class="btn-annotation-tool" data-tool="note" title="إضافة ملاحظة لاصقة">
                📝 <span>ملاحظة</span>
              </button>

              <!-- Color Swatches Palette (Yellow, Mint, Pink, Cyan, Red, Dark Ink) -->
              <div class="jnotes-color-swatches" id="doc-color-swatches">
                <button class="swatch-dot active" data-color="#FEF08A" style="background: #FEF08A;" title="أصفر فسفوري"></button>
                <button class="swatch-dot" data-color="#A7F3D0" style="background: #A7F3D0;" title="نعناعي هادئ (Mint)"></button>
                <button class="swatch-dot" data-color="#FBCFE8" style="background: #FBCFE8;" title="وردي (Pink)"></button>
                <button class="swatch-dot" data-color="#BAE6FD" style="background: #BAE6FD;" title="سماوي (Cyan)"></button>
                <button class="swatch-dot" data-color="#FDA4AF" style="background: #FDA4AF;" title="أحمر لطيف (Red)"></button>
                <button class="swatch-dot" data-color="#1E293B" style="background: #1E293B;" title="حبر داكن (Dark Ink)"></button>
              </div>

              <!-- Stroke Thickness Options (2px, 4px, 8px) -->
              <div class="jnotes-stroke-selector" id="doc-stroke-selector">
                <button class="stroke-btn" data-width="2" title="رفيع (2px)">2px</button>
                <button class="stroke-btn active" data-width="4" title="متوسط (4px)">4px</button>
                <button class="stroke-btn" data-width="8" title="عريض (8px)">8px</button>
              </div>

              <button id="doc-save-annotations-btn" class="btn-annotation-tool save-tool" title="حفظ جميع التعديلات في حسابي (+5 نقاط)">
                💾 <span id="doc-save-btn-text">حفظ (+5)</span>
              </button>
              <button id="doc-clear-annotations-btn" class="btn-annotation-tool clear-tool" title="مسح التعديلات">
                🗑️ <span>مسح</span>
              </button>
            </div>

            <!-- Actions & Close -->
            <div class="doc-viewer-actions">
              <span class="doc-pages-indicator" id="doc-viewer-pages-pill">
                <i data-lucide="book-open" style="width: 14px; height: 14px;"></i>
                <span id="doc-viewer-pages-text">17 Slides</span>
              </span>
              <button id="doc-viewer-download-btn" class="btn btn-primary btn-sm" title="تنزيل PDF">
                <i data-lucide="download" style="width: 14px; height: 14px;"></i>
                <span>PDF</span>
              </button>
              <button id="doc-viewer-print-btn" class="btn btn-secondary btn-sm" title="طباعة">
                <i data-lucide="printer" style="width: 14px; height: 14px;"></i>
              </button>
              <button id="doc-viewer-close-btn" class="doc-viewer-close-btn" aria-label="Close Viewer">
                ✕
              </button>
            </div>
          </div>

          <!-- Viewer Body Viewport Frame -->
          <div class="doc-viewer-body">
            <iframe id="doc-viewer-iframe" class="doc-viewer-iframe" title="JNotes Interactive Tablet Studio" sandbox="allow-scripts allow-same-origin allow-popups"></iframe>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalMarkup);
    DocumentViewer.bindEvents();
  },

  bindEvents() {
    const modalEl = document.getElementById('doc-viewer-modal');
    const closeBtn = document.getElementById('doc-viewer-close-btn');
    const downloadBtn = document.getElementById('doc-viewer-download-btn');
    const printBtn = document.getElementById('doc-viewer-print-btn');
    const saveAnnBtn = document.getElementById('doc-save-annotations-btn');
    const clearAnnBtn = document.getElementById('doc-clear-annotations-btn');
    const toggleSbBtn = document.getElementById('doc-toggle-sidebar-btn');

    if (closeBtn) closeBtn.addEventListener('click', () => DocumentViewer.close());
    if (modalEl) {
      modalEl.addEventListener('click', (e) => {
        if (e.target === modalEl) DocumentViewer.close();
      });
    }

    if (toggleSbBtn) {
      toggleSbBtn.addEventListener('click', () => {
        const iframe = document.getElementById('doc-viewer-iframe');
        if (iframe && iframe.contentWindow && typeof iframe.contentWindow.toggleSidebar === 'function') {
          iframe.contentWindow.toggleSidebar();
        }
      });
    }

    // Tool switching
    const toolBtns = document.querySelectorAll('.doc-viewer-annotation-bar .btn-annotation-tool[data-tool]');
    toolBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tool = btn.getAttribute('data-tool');
        DocumentViewer.activeTool = tool;
        toolBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const iframe = document.getElementById('doc-viewer-iframe');
        if (iframe && iframe.contentWindow && typeof iframe.contentWindow.setStudioTool === 'function') {
          iframe.contentWindow.setStudioTool(tool);
        }
      });
    });

    // Swatches color selection
    const swatchBtns = document.querySelectorAll('.jnotes-color-swatches .swatch-dot');
    swatchBtns.forEach(dot => {
      dot.addEventListener('click', () => {
        const color = dot.getAttribute('data-color');
        DocumentViewer.activeColor = color;
        swatchBtns.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');

        const iframe = document.getElementById('doc-viewer-iframe');
        if (iframe && iframe.contentWindow && typeof iframe.contentWindow.setStudioColor === 'function') {
          iframe.contentWindow.setStudioColor(color);
        }
      });
    });

    // Stroke width options
    const strokeBtns = document.querySelectorAll('.jnotes-stroke-selector .stroke-btn');
    strokeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const width = parseInt(btn.getAttribute('data-width'), 10) || 4;
        DocumentViewer.activeStroke = width;
        strokeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const iframe = document.getElementById('doc-viewer-iframe');
        if (iframe && iframe.contentWindow && typeof iframe.contentWindow.setStudioWidth === 'function') {
          iframe.contentWindow.setStudioWidth(width);
        }
      });
    });

    // Save Annotations Button
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
              isAr ? 'تم حفظ تظليلاتك ورسوماتك وملاحظاتك بنجاح في حسابك! (+5 نقاط)' : 'Annotations & notes saved to your account! (+5 pts)',
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

    // Clear Annotations Button
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

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && DocumentViewer.isOpen) {
        DocumentViewer.close();
      }
    });

    if (window.lucide) window.lucide.createIcons();
  },

  open(doc) {
    DocumentViewer.init();

    DocumentViewer.currentDoc = doc || {
      id: 'sh-fixed-provisional',
      title: 'Provisional Restoration & Temporization (التركيبات المؤقتة وطرق إعدادها)',
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
    const iframe = document.getElementById('doc-viewer-iframe');

    const targetDoc = DocumentViewer.currentDoc;
    const docTitle = targetDoc.title || (isAr ? targetDoc.title_ar : targetDoc.title_en) || 'Provisional Restoration & Temporization';
    const docSubject = targetDoc.subject_name || (isAr ? 'الاستعاضة السنية الثابتة 2' : 'Fixed Prosthodontics II');
    const docDoctor = targetDoc.doctor_name || (isAr ? 'د. هالة الحويج' : 'Dr. Hala Alhawij');
    const docPages = targetDoc.pages || 17;

    if (titleEl) titleEl.textContent = docTitle;
    if (subEl) subEl.textContent = `${docSubject} • ${docDoctor}`;
    if (pagesTextEl) pagesTextEl.textContent = `${docPages} Slides`;

    const srcDocContent = DocumentViewer.generateDocHTML(targetDoc, isAr);
    if (iframe) {
      iframe.onload = () => {
        try {
          if (iframe.contentWindow && typeof iframe.contentWindow.setStudioTool === 'function') {
            iframe.contentWindow.setStudioTool(DocumentViewer.activeTool || 'highlighter');
            iframe.contentWindow.setStudioColor(DocumentViewer.activeColor || '#FEF08A');
            iframe.contentWindow.setStudioWidth(DocumentViewer.activeStroke || 4);
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
    const iframe = document.getElementById('doc-viewer-iframe');
    if (iframe) iframe.srcdoc = '';
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
    const doctor = doc?.doctor_name || 'Dr. Hala Alhawij';
    const university = doc?.university || 'University of Tripoli - School of Dentistry';
    const year = doc?.year || '2025-2026';

    const slideTitles = [
      { ar: 'الغلاف والأهداف الأكاديمية', en: 'Title & Academic Agenda' },
      { ar: 'تعريف الاستعاضة المؤقتة والفروقات', en: 'Definitions & Requirements' },
      { ar: 'المتطلبات البيولوجية (حماية اللب)', en: 'Biological: Pulp Protection' },
      { ar: 'المتطلبات البيولوجية (ثبات الموضع)', en: 'Positional Stability & Fracture' },
      { ar: 'المتطلبات الميكانيكية والوظيفية', en: 'Mechanical & Functional' },
      { ar: 'المتطلبات الجمالية والصوتية', en: 'Esthetic & Phonetic Guidance' },
      { ar: 'تصنيف الاستعاضات المؤقتة', en: 'Classification of Provisionals' },
      { ar: 'أنواع التيجان مسبقة الصنع', en: 'Preformed Crown Types' },
      { ar: 'البروتوكول السريري لتيجان الألمنيوم', en: 'Aluminum Crown Protocol' },
      { ar: 'البروتوكول السريري لتيجان البوليكاربونات', en: 'Polycarbonate Protocol' },
      { ar: 'التقنية المباشرة للتيجان المخصصة', en: 'Custom Direct Technique' },
      { ar: 'التقنية غير المباشرة ومزاياها', en: 'Custom Indirect Technique' },
      { ar: 'كيمياء مواد الريزن المؤقتة', en: 'Provisional Resins (PMMA/Bis-Acryl)' },
      { ar: 'جدول المقارنة الشامل للمواد', en: 'Materials Comparison Matrix' },
      { ar: 'الأسمنت المؤقت وتحذير الإيوجينول', en: 'Provisional Cements & Eugenol' },
      { ar: 'بروتوكول الصقل والملف الظاهر', en: 'Emergence Profile & Polishing' },
      { ar: 'المضاعفات السريرية وخلاصة الامتحانات', en: 'Complications & Exam Pearls' }
    ];

    return `<!DOCTYPE html>
<html lang="${isAr ? 'ar' : 'en'}" dir="${isAr ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=3.0, user-scalable=yes" />
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=IBM+Plex+Sans+Arabic:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --brand: #0284C7;
      --brand-dark: #0369A1;
      --paper-bg: #FFFFFF;
      --bg: #12131F;
      --text: #0F172A;
      --text-sub: #475569;
      --highlight-color: rgba(254, 240, 138, 0.45);
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

    /* Full Workspace Container with Sidebar + Viewport */
    .jnotes-app-container {
      display: flex;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      position: relative;
    }

    /* Left Collapsible Thumbnail Sidebar */
    .jnotes-sidebar {
      width: 240px;
      background: #181926;
      border-inline-end: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      flex-direction: column;
      height: 100%;
      transition: margin-inline-start 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      flex-shrink: 0;
      z-index: 100;
    }

    .jnotes-sidebar.collapsed {
      margin-inline-start: -240px;
    }

    .sidebar-header {
      padding: 14px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      color: #F8FAFC;
      font-size: 0.85rem;
      font-weight: 800;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #1B1D2C;
    }

    .btn-close-sidebar {
      background: transparent;
      border: none;
      color: #94A3B8;
      font-size: 1rem;
      cursor: pointer;
      padding: 2px 6px;
      border-radius: 4px;
    }
    .btn-close-sidebar:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #F8FAFC;
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
      border: 1.5px solid rgba(255, 255, 255, 0.06);
      border-radius: 8px;
      padding: 8px 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 10px;
      transition: all 0.15s ease;
    }

    .thumb-card:hover {
      background: rgba(2, 132, 199, 0.15);
      border-color: rgba(2, 132, 199, 0.4);
      transform: translateY(-1px);
    }

    .thumb-card.active {
      border-color: #0284C7;
      background: rgba(2, 132, 199, 0.25);
      box-shadow: 0 0 10px rgba(2, 132, 199, 0.3);
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
      font-size: 0.775rem;
      font-weight: 700;
      line-height: 1.3;
      margin-bottom: 2px;
    }
    .thumb-info p {
      color: #94A3B8;
      font-size: 0.675rem;
    }

    /* Main Scrollable Viewport Workspace */
    .jnotes-workspace {
      flex: 1;
      height: 100%;
      overflow: hidden;
      position: relative;
      background: #12131F;
    }

    .jnotes-viewport {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      padding: 30px 20px 100px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 32px;
      scroll-behavior: smooth;
      -webkit-overflow-scrolling: touch;
    }

    /* Floating Page Indicator Pill & Auto-Save Badge */
    .viewport-floating-status {
      position: fixed;
      top: 14px;
      left: 18px;
      z-index: 1000;
      display: flex;
      align-items: center;
      gap: 8px;
      pointer-events: none;
    }

    .jnotes-page-pill {
      background: rgba(15, 23, 42, 0.85);
      color: #F8FAFC;
      border: 1px solid rgba(255, 255, 255, 0.16);
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 800;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(8px);
    }

    .auto-save-pill {
      background: rgba(16, 185, 129, 0.2);
      color: #34D399;
      border: 1px solid rgba(16, 185, 129, 0.35);
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 0.725rem;
      font-weight: 700;
      backdrop-filter: blur(8px);
      transition: opacity 0.3s ease;
    }

    .doc-page {
      background: var(--paper-bg);
      width: 100%;
      max-width: 840px;
      min-height: 1100px;
      border-radius: 8px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.45);
      padding: 48px 56px;
      position: relative;
      user-select: text;
      direction: ltr;
      text-align: left;
    }

    /* Canvas Drawing Overlay */
    .canvas-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 15;
      touch-action: none;
    }

    .canvas-overlay.pen-active {
      pointer-events: auto !important;
      cursor: crosshair;
    }

    /* Translucent Highlight Styling */
    p.highlighted, li.highlighted, h3.highlighted, mark.studio-highlight {
      background-color: var(--highlight-color) !important;
      border-radius: 4px;
      padding: 2px 4px;
      color: inherit;
    }

    /* Sticky Text Notes */
    .sticky-note-box {
      position: absolute;
      background: #FEF9C3;
      border: 1.5px solid #F59E0B;
      border-radius: 10px;
      padding: 8px 12px;
      font-size: 0.825rem;
      color: #78350F;
      box-shadow: 0 8px 24px rgba(0,0,0,0.25);
      z-index: 30;
      min-width: 200px;
      direction: rtl;
      text-align: right;
      user-select: text;
      cursor: default;
    }

    .sticky-note-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
      border-bottom: 1px dashed rgba(245, 158, 11, 0.4);
      padding-bottom: 4px;
      cursor: grab;
      font-weight: 800;
      font-size: 0.725rem;
    }

    .sticky-note-close {
      background: none;
      border: none;
      color: #DC2626;
      font-size: 0.95rem;
      cursor: pointer;
      font-weight: bold;
    }

    .sticky-note-box textarea {
      width: 100%;
      height: 70px;
      background: transparent;
      border: none;
      resize: vertical;
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

    .warning-callout {
      background: #FFF1F2;
      border-left: 4px solid #E11D48;
      padding: 14px 18px;
      border-radius: 0 8px 8px 0;
      margin: 18px 0;
      font-size: 0.875rem;
      color: #881337;
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

  <!-- Full JNotes App Workspace -->
  <div class="jnotes-app-container">

    <!-- Floating Status (Page Counter & Auto-Save Badge) -->
    <div class="viewport-floating-status">
      <div class="jnotes-page-pill" id="page-counter-pill">
        <span>صفحة 1 / 17</span>
      </div>
      <span class="auto-save-pill" id="auto-save-badge">
        <span>✅ تم الحفظ</span>
      </span>
    </div>

    <!-- Collapsible Left Thumbnail Sidebar (17 Slides) -->
    <aside class="jnotes-sidebar" id="jnotes-sidebar">
      <div class="sidebar-header">
        <span>📑 شرائح المحاضرة (17)</span>
        <button type="button" class="btn-close-sidebar" onclick="window.toggleSidebar()" title="إخفاء القائمة">✕</button>
      </div>
      <div class="sidebar-thumbnails-list">
        ${slideTitles.map((st, i) => `
          <div class="thumb-card ${i === 0 ? 'active' : ''}" onclick="window.scrollToPage(${i + 1})" id="thumb-${i + 1}">
            <div class="thumb-num">${i + 1}</div>
            <div class="thumb-info">
              <h5>${st.ar}</h5>
              <p>${st.en}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </aside>

    <!-- Main Scrollable Paper Viewport -->
    <main class="jnotes-workspace">
      <div class="jnotes-viewport" id="jnotes-viewport">

        <!-- PAGE 1 -->
        <div class="doc-page" id="page-1" data-page="1">
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
              <li><strong>Module 9:</strong> Clinical Complications, Debonding Management, and Faculty Exam Pearls</li>
            </ul>
          </div>

          <div class="page-footer">
            <span>Dr. Hala Alhawij | Fixed Prosthodontics</span>
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
        <div class="doc-page" id="page-3" data-page="3">
          <canvas class="canvas-overlay" id="canvas-3"></canvas>
          <div class="page-header">
            <h4>Module 2: Biologic Requirements</h4>
            <span>Provisional Restoration & Temporization</span>
          </div>

          <h3 class="section-title">SECTION 2: BIOLOGIC REQUIREMENTS (PART 1)</h3>
          
          <p><strong>1. Pulp Protection:</strong></p>
          <p style="margin-bottom: 14px;">Vital dentin contains 30,000 to 45,000 tubules per mm² near the pulp. Crown preparation removes the protective enamel layer, exposing millions of open dentinal tubules. Without a hermetic seal, the pulp is subjected to thermal shocks, hypertonic chemical stimuli, and bacterial microleakage resulting in pulpitis. The provisional restoration must effectively seal these dentinal tubules.</p>

          <div class="clinical-callout">
            <strong>Clinical Pearl:</strong> Desensitizing agents or dentin bonding resin coats applied to prepared dentin prior to temporization significantly reduce post-operative sensitivity without hampering provisional retention.
          </div>

          <p><strong>2. Periodontal Health:</strong></p>
          <p style="margin-bottom: 14px;">The provisional restoration must harmonize with the marginal periodontium:</p>
          <ul class="bullet-list">
            <li><strong>Marginal Fit:</strong> Overextended margins violate the biologic width and induce chronic gingival inflammation, bleeding, and bone resorption.</li>
            <li><strong>Under-extended Margins:</strong> Leave exposed sensitive dentin and encourage rapid gingival proliferation over the finish line.</li>
            <li><strong>Surface Finish:</strong> Rough, unpolished provisional acrylic acts as a nidus for plaque biofilm retention and bacterial colonization.</li>
          </ul>

          <div class="page-footer">
            <span>Dr. Hala Alhawij | Fixed Prosthodontics</span>
            <span>Page 3 of 17</span>
          </div>
        </div>

        <!-- PAGE 4 -->
        <div class="doc-page" id="page-4" data-page="4">
          <canvas class="canvas-overlay" id="canvas-4"></canvas>
          <div class="page-header">
            <h4>Module 2: Biologic Requirements</h4>
            <span>Provisional Restoration & Temporization</span>
          </div>

          <h3 class="section-title">SECTION 3: BIOLOGIC REQUIREMENTS (PART 2)</h3>
          
          <p><strong>3. Positional Stability (Arch Integrity):</strong></p>
          <p style="margin-bottom: 14px;">Prepared teeth without stable proximal and occlusal contacts drift within days:</p>
          <ul class="bullet-list">
            <li><strong>Opposing Teeth:</strong> Supra-erupt into the preparation space, eliminating crucial interocclusal clearance for the definitive crown.</li>
            <li><strong>Adjacent Teeth:</strong> Tip or migrate mesially or distally, resulting in loss of space.</li>
            <li><strong>Occlusal Harmony:</strong> The provisional must provide accurate centric stops without premature contacts.</li>
          </ul>

          <p><strong>4. Prevention of Prepared Tooth Fracture:</strong></p>
          <p style="margin-bottom: 14px;">Prepared teeth—especially those with extensive MOD restorations or endodontically treated teeth—exhibit significantly weakened cuspal stiffness. The provisional crown shields these vulnerable cusps from fracture.</p>

          <div class="page-footer">
            <span>Dr. Hala Alhawij | Fixed Prosthodontics</span>
            <span>Page 4 of 17</span>
          </div>
        </div>

        <!-- PAGE 5 -->
        <div class="doc-page" id="page-5" data-page="5">
          <canvas class="canvas-overlay" id="canvas-5"></canvas>
          <div class="page-header">
            <h4>Module 2: Mechanical Requirements</h4>
            <span>Provisional Restoration & Temporization</span>
          </div>

          <h3 class="section-title">SECTION 4: MECHANICAL AND FUNCTIONAL REQUIREMENTS</h3>
          
          <p><strong>1. Resistance to Functional Loads (Strength):</strong></p>
          <p style="margin-bottom: 14px;">Provisional materials exhibit lower compressive and flexural strength than porcelain or zirconia. Nonetheless, the restoration must endure masticatory cycles without chipping or fracturing, particularly across multi-unit bridge connectors.</p>

          <p><strong>2. Retention and Resistance to Displacement:</strong></p>
          <p style="margin-bottom: 14px;">The restoration must remain firmly seated during functional eating and speaking. Good internal adaptation prevents dislodgement.</p>

          <p><strong>3. Retrievability and Reusability:</strong></p>
          <p style="margin-bottom: 14px;">The provisional must be easily removed by the clinician during subsequent appointments (e.g., framework trial, shade matching) and securely re-cemented without shattering.</p>

          <div class="page-footer">
            <span>Dr. Hala Alhawij | Fixed Prosthodontics</span>
            <span>Page 5 of 17</span>
          </div>
        </div>

        <!-- PAGE 6 -->
        <div class="doc-page" id="page-6" data-page="6">
          <canvas class="canvas-overlay" id="canvas-6"></canvas>
          <div class="page-header">
            <h4>Module 2: Esthetics & Phonetics</h4>
            <span>Provisional Restoration & Temporization</span>
          </div>

          <h3 class="section-title">SECTION 5: ESTHETIC AND PHONETIC REQUIREMENTS</h3>
          
          <p><strong>1. Shade Compatibility and Color Stability:</strong></p>
          <p style="margin-bottom: 14px;">In anterior teeth, the provisional must blend imperceptibly with neighboring dentition. It must resist dietary staining from coffee, tea, and chlorhexidine rinses.</p>

          <p><strong>2. Phonetic Guide:</strong></p>
          <p style="margin-bottom: 14px;">The provisional contours directly guide speech production:</p>
          <ul class="bullet-list">
            <li><strong>F and V Sounds:</strong> Verified by checking that maxillary incisal edge contacts the wet-dry line of the lower lip.</li>
            <li><strong>S and Z Sounds:</strong> Controlled by palatal contour, maintaining a 1.0 to 1.5 mm speaking space.</li>
          </ul>

          <div class="page-footer">
            <span>Dr. Hala Alhawij | Fixed Prosthodontics</span>
            <span>Page 6 of 17</span>
          </div>
        </div>

        <!-- PAGE 7 -->
        <div class="doc-page" id="page-7" data-page="7">
          <canvas class="canvas-overlay" id="canvas-7"></canvas>
          <div class="page-header">
            <h4>Module 3: Classification</h4>
            <span>Provisional Restoration & Temporization</span>
          </div>

          <h3 class="section-title">SECTION 6: CLASSIFICATION OF PROVISIONAL RESTORATIONS</h3>
          
          <p><strong>A) By Fabrication Method:</strong></p>
          <ul class="bullet-list">
            <li><strong>Preformed (Prefabricated) Crowns:</strong> Factory-manufactured shells selected to match tooth size.</li>
            <li><strong>Custom-Made Restorations:</strong> Individually fabricated using matrices or putty indices.</li>
          </ul>

          <p><strong>B) By Clinical Technique:</strong></p>
          <ul class="bullet-list">
            <li><strong>Direct Technique:</strong> Entirely fabricated chairside in the patient mouth.</li>
            <li><strong>Indirect Technique:</strong> Fabricated extraorally in the laboratory on a stone model cast.</li>
            <li><strong>Direct-Indirect Technique:</strong> Shell made on model, relined chairside.</li>
          </ul>

          <p><strong>C) By Duration:</strong> Short-Term (< 4 weeks), Medium-Term (1-3 months), Long-Term (3-12 months).</p>

          <div class="page-footer">
            <span>Dr. Hala Alhawij | Fixed Prosthodontics</span>
            <span>Page 7 of 17</span>
          </div>
        </div>

        <!-- PAGE 8 -->
        <div class="doc-page" id="page-8" data-page="8">
          <canvas class="canvas-overlay" id="canvas-8"></canvas>
          <div class="page-header">
            <h4>Module 4: Preformed Crowns</h4>
            <span>Provisional Restoration & Temporization</span>
          </div>

          <h3 class="section-title">SECTION 7: PREFORMED CROWN TYPES & CHARACTERISTICS</h3>
          
          <p><strong>Metallic Preformed Crowns (Posterior):</strong></p>
          <ul class="bullet-list">
            <li><strong>Aluminum Shell Crowns:</strong> Soft, easily trimmed with scissors, ideal for posterior emergency temporization.</li>
            <li><strong>Stainless Steel & Nickel-Chromium Crowns:</strong> High durability, excellent wear resistance.</li>
          </ul>

          <p><strong>Non-Metallic Preformed Crowns (Anterior & Premolars):</strong></p>
          <ul class="bullet-list">
            <li><strong>Polycarbonate Crowns:</strong> Rigid tooth-colored shells; chemical bonding with acrylic reline.</li>
            <li><strong>Cellulose Acetate (Celluloid) Forms:</strong> Thin transparent carrier matrix peeled off after resin sets.</li>
          </ul>

          <div class="page-footer">
            <span>Dr. Hala Alhawij | Fixed Prosthodontics</span>
            <span>Page 8 of 17</span>
          </div>
        </div>

        <!-- PAGE 9 -->
        <div class="doc-page" id="page-9" data-page="9">
          <canvas class="canvas-overlay" id="canvas-9"></canvas>
          <div class="page-header">
            <h4>Module 4: Aluminum Protocol</h4>
            <span>Provisional Restoration & Temporization</span>
          </div>

          <h3 class="section-title">SECTION 8: CLINICAL PROTOCOL - ALUMINUM PREFORMED CROWNS</h3>
          <ul class="bullet-list">
            <li><strong>Step 1:</strong> Measure mesiodistal space with a Boley gauge.</li>
            <li><strong>Step 2:</strong> Select closest shell size (sizes 2 to 19).</li>
            <li><strong>Step 3:</strong> Trim cervical margin with curved collar scissors to follow the gingival crest.</li>
            <li><strong>Step 4:</strong> Smooth sharp borders with a green carborundum bur.</li>
            <li><strong>Step 5:</strong> Check occlusion in centric and eccentric paths.</li>
            <li><strong>Step 6:</strong> Cement with Zinc Oxide Eugenol (ZOE) temporary cement and clear subgingival flash.</li>
          </ul>

          <div class="page-footer">
            <span>Dr. Hala Alhawij | Fixed Prosthodontics</span>
            <span>Page 9 of 17</span>
          </div>
        </div>

        <!-- PAGE 10 -->
        <div class="doc-page" id="page-10" data-page="10">
          <canvas class="canvas-overlay" id="canvas-10"></canvas>
          <div class="page-header">
            <h4>Module 4: Polycarbonate Protocol</h4>
            <span>Provisional Restoration & Temporization</span>
          </div>

          <h3 class="section-title">SECTION 9: CLINICAL PROTOCOL - POLYCARBONATE CROWNS</h3>
          <ul class="bullet-list">
            <li><strong>Step 1:</strong> Select polycarbonate mold matching tooth anatomy.</li>
            <li><strong>Step 2:</strong> Trim cervical margins until no gingival blanching occurs.</li>
            <li><strong>Step 3:</strong> Apply petroleum jelly / cocoa butter separating media to prepared tooth.</li>
            <li><strong>Step 4:</strong> Fill crown shell with cold-cure acrylic resin (PEMA or PMMA).</li>
            <li><strong>Step 5:</strong> Seat onto preparation; remove during RUBBERY stage (2-3 mins) to avoid undercut locking!</li>
            <li><strong>Step 6:</strong> Complete polymerization extraorally in warm water, trim flash, polish, and cement.</li>
          </ul>

          <div class="page-footer">
            <span>Dr. Hala Alhawij | Fixed Prosthodontics</span>
            <span>Page 10 of 17</span>
          </div>
        </div>

        <!-- PAGE 11 -->
        <div class="doc-page" id="page-11" data-page="11">
          <canvas class="canvas-overlay" id="canvas-11"></canvas>
          <div class="page-header">
            <h4>Module 5: Custom Direct Technique</h4>
            <span>Provisional Restoration & Temporization</span>
          </div>

          <h3 class="section-title">SECTION 10: CUSTOM PROVISIONAL RESTORATIONS - DIRECT TECHNIQUE</h3>
          <ul class="bullet-list">
            <li><strong>Pre-op Matrix:</strong> Alginate, Putty Silicone index, or vacuum-formed plastic matrix.</li>
            <li><strong>Preparation:</strong> Lubricate abutments with water-soluble lubricant.</li>
            <li><strong>Dispensing:</strong> Inject auto-mix Bis-acryl composite resin into matrix.</li>
            <li><strong>Intraoral Set:</strong> Seat matrix for 2.5 minutes until initial rubbery cure.</li>
            <li><strong>Finishing:</strong> Remove, trim flash with fine carbide finishing burs, and apply light-cure glaze.</li>
          </ul>

          <div class="page-footer">
            <span>Dr. Hala Alhawij | Fixed Prosthodontics</span>
            <span>Page 11 of 17</span>
          </div>
        </div>

        <!-- PAGE 12 -->
        <div class="doc-page" id="page-12" data-page="12">
          <canvas class="canvas-overlay" id="canvas-12"></canvas>
          <div class="page-header">
            <h4>Module 5: Custom Indirect Technique</h4>
            <span>Provisional Restoration & Temporization</span>
          </div>

          <h3 class="section-title">SECTION 11: CUSTOM PROVISIONAL RESTORATIONS - INDIRECT TECHNIQUE</h3>
          <p><strong>Clinical Advantages:</strong></p>
          <ul class="bullet-list">
            <li>Elimination of pulp thermal damage from exothermic reaction.</li>
            <li>Zero toxic free-monomer exposure to oral soft tissues.</li>
            <li>Superior marginal adaptation and contour on stone cast.</li>
            <li>Ideal for multi-unit long-span bridges and full-arch rehabilitation.</li>
          </ul>

          <div class="page-footer">
            <span>Dr. Hala Alhawij | Fixed Prosthodontics</span>
            <span>Page 12 of 17</span>
          </div>
        </div>

        <!-- PAGE 13 -->
        <div class="doc-page" id="page-13" data-page="13">
          <canvas class="canvas-overlay" id="canvas-13"></canvas>
          <div class="page-header">
            <h4>Module 6: Materials Science</h4>
            <span>Provisional Restoration & Temporization</span>
          </div>

          <h3 class="section-title">SECTION 12: PROVISIONAL RESTORATIVE MATERIALS SCIENCE</h3>
          <ul class="bullet-list">
            <li><strong>PMMA (Jet, Alike):</strong> High strength, easy to repair. Cons: High exothermic heat (up to 70°C) and shrinkage (~8%).</li>
            <li><strong>PEMA (Snap, Trim):</strong> Low exothermic heat, lower shrinkage. Ideal for chairside relining.</li>
            <li><strong>Bis-Acryl Composite (Protemp, Integrity):</strong> Auto-mix, minimal shrinkage (1-2%), low heat, superior gloss.</li>
            <li><strong>UDMA (Revotek50):</strong> Light-cured resin putty, unlimited working time.</li>
          </ul>

          <div class="page-footer">
            <span>Dr. Hala Alhawij | Fixed Prosthodontics</span>
            <span>Page 13 of 17</span>
          </div>
        </div>

        <!-- PAGE 14 -->
        <div class="doc-page" id="page-14" data-page="14">
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
                <th>UDMA</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Exotherm</strong></td>
                <td>High (70°C)</td>
                <td>Low (38°C)</td>
                <td>Minimal (40°C)</td>
                <td>Minimal</td>
              </tr>
              <tr>
                <td><strong>Shrinkage</strong></td>
                <td>High (~8%)</td>
                <td>Moderate (~5%)</td>
                <td>Very Low (1-2%)</td>
                <td>Low (<2%)</td>
              </tr>
              <tr>
                <td><strong>Flexural Strength</strong></td>
                <td>Very High</td>
                <td>Moderate</td>
                <td>High</td>
                <td>High</td>
              </tr>
              <tr>
                <td><strong>Polishability</strong></td>
                <td>Excellent</td>
                <td>Good</td>
                <td>Superior</td>
                <td>Superior</td>
              </tr>
            </tbody>
          </table>

          <div class="page-footer">
            <span>Dr. Hala Alhawij | Fixed Prosthodontics</span>
            <span>Page 14 of 17</span>
          </div>
        </div>

        <!-- PAGE 15 -->
        <div class="doc-page" id="page-15" data-page="15">
          <canvas class="canvas-overlay" id="canvas-15"></canvas>
          <div class="page-header">
            <h4>Module 7: Cements & Eugenol Warning</h4>
            <span>Provisional Restoration & Temporization</span>
          </div>

          <h3 class="section-title">SECTION 14: PROVISIONAL CEMENTS & THE CRITICAL EUGENOL WARNING</h3>
          <p><strong>Cements:</strong> Zinc Oxide Eugenol (ZOE), Non-Eugenol (NEZO), Polycarboxylate, Resin Temporary Cements.</p>

          <div class="warning-callout">
            <strong>⚠️ CRITICAL BOARD EXAMINATION PEARL (EUGENOL INHIBITION):</strong><br>
            Eugenol is a phenolic radical scavenger that chemically inhibits the free-radical polymerization of permanent resin cements and dental bonding agents. This drops bond strength by up to 50%!<br>
            <strong>RULE:</strong> If definitive restoration will be bonded with resin cement, ALWAYS use Non-Eugenol temporary cement!
          </div>

          <div class="page-footer">
            <span>Dr. Hala Alhawij | Fixed Prosthodontics</span>
            <span>Page 15 of 17</span>
          </div>
        </div>

        <!-- PAGE 16 -->
        <div class="doc-page" id="page-16" data-page="16">
          <canvas class="canvas-overlay" id="canvas-16"></canvas>
          <div class="page-header">
            <h4>Module 8: Emergence Profile & Polishing</h4>
            <span>Provisional Restoration & Temporization</span>
          </div>

          <h3 class="section-title">SECTION 15: EMERGENCE PROFILE AND POLISHING PROTOCOL</h3>
          <p><strong>Biologic Emergence Profile:</strong> Must be flat or slightly concave, precisely replicating the natural root-to-crown transition.</p>
          <ul class="bullet-list">
            <li><strong>Overcontoured:</strong> Gingival impingement, plaque stagnation, bleeding and chronic inflammation.</li>
            <li><strong>Undercontoured:</strong> Inadequate bolus deflection, mechanical food impaction onto gingiva.</li>
          </ul>

          <div class="page-footer">
            <span>Dr. Hala Alhawij | Fixed Prosthodontics</span>
            <span>Page 16 of 17</span>
          </div>
        </div>

        <!-- PAGE 17 -->
        <div class="doc-page" id="page-17" data-page="17">
          <canvas class="canvas-overlay" id="canvas-17"></canvas>
          <div class="page-header">
            <h4>Module 9: Complications & Exam Summary</h4>
            <span>Provisional Restoration & Temporization</span>
          </div>

          <h3 class="section-title">SECTION 16: CLINICAL COMPLICATIONS & MANAGEMENT</h3>
          <ul class="bullet-list">
            <li><strong>Debonding:</strong> Relieve occlusal interferences; switch to polycarboxylate temporary cement.</li>
            <li><strong>Connector Fracture:</strong> Increase connector height (> 3.0 mm) or reinforce with glass fibers (Ribbond).</li>
            <li><strong>Marginal Openness:</strong> Bead-brush reline with flowable composite or PEMA.</li>
          </ul>

          <h3 class="section-title">KEY FACULTY EXAM TAKEAWAYS</h3>
          <ul class="bullet-list">
            <li>Never allow PMMA to set completely in mouth; withdraw during rubbery phase.</li>
            <li>Always avoid Eugenol when definitive adhesive resin cementation is scheduled.</li>
            <li>High-gloss finish is mandatory to preserve periodontal health before final impression.</li>
          </ul>

          <div class="page-footer">
            <span>Dr. Hala Alhawij | Fixed Prosthodontics</span>
            <span>Page 17 of 17 • Complete Syllabus</span>
          </div>
        </div>

      </div>
    </main>
  </div>

  <!-- JNotes Engine & LocalStorage Sync Script -->
  <script>
    const docId = "${docId}";
    let currentTool = 'highlighter'; // 'highlighter', 'pen', 'eraser', 'note'
    let currentColor = '#FEF08A';
    let currentStroke = 4;
    let isDrawing = false;
    let strokes = {}; // pageNum -> array of strokes
    let notes = [];
    let noteIdCounter = 1;

    // 1. Sidebar Toggle & Smooth Scrolling
    window.toggleSidebar = function() {
      const sb = document.getElementById('jnotes-sidebar');
      if (sb) sb.classList.toggle('collapsed');
    };

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

    function updateCounterPill(pageNum) {
      const pill = document.getElementById('page-counter-pill');
      if (pill) pill.textContent = 'صفحة ' + pageNum + ' / 17';
    }

    // Scroll listener for active page
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

    // 2. Studio Bridge Tools (Called by Parent Toolbar)
    window.setStudioTool = function(tool) {
      currentTool = tool;
      document.querySelectorAll('.canvas-overlay').forEach(c => {
        c.classList.toggle('pen-active', tool === 'pen' || tool === 'highlighter' || tool === 'eraser');
      });
    };

    window.setStudioColor = function(color) {
      currentColor = color;
      document.documentElement.style.setProperty('--highlight-color', color);
    };

    window.setStudioWidth = function(width) {
      currentStroke = parseInt(width, 10) || 4;
    };

    // 3. Canvas Touch & Mouse Drawing Engine
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

        canvas.onmousedown = (e) => startDraw(e, canvas, pageNum);
        canvas.onmousemove = (e) => draw(e, canvas, pageNum);
        canvas.onmouseup = () => stopDraw(pageNum);
        canvas.onmouseleave = () => stopDraw(pageNum);

        canvas.addEventListener('touchstart', (e) => {
          if (currentTool === 'note') return;
          e.preventDefault();
          startDraw(e.touches[0], canvas, pageNum);
        }, { passive: false });

        canvas.addEventListener('touchmove', (e) => {
          if (currentTool === 'note') return;
          e.preventDefault();
          draw(e.touches[0], canvas, pageNum);
        }, { passive: false });

        canvas.addEventListener('touchend', () => {
          if (currentTool === 'note') return;
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
          strokeWidth: currentTool === 'highlighter' ? currentStroke * 3.5 : currentStroke,
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

    // 4. Text Highlighting on Click & Selection
    document.querySelectorAll('.doc-page p, .doc-page li, .doc-page h3').forEach((el, idx) => {
      el.setAttribute('data-idx', idx);
      el.addEventListener('click', () => {
        if (currentTool === 'highlighter') {
          el.classList.toggle('highlighted');
          triggerAutoSave();
        } else if (currentTool === 'eraser') {
          el.classList.remove('highlighted');
          triggerAutoSave();
        }
      });
    });

    // 5. Sticky Notes Logic
    function createStickyNote(pageEl, x, y, initialText, id) {
      const noteId = id || 'sn_' + Date.now() + '_' + (noteIdCounter++);
      const noteBox = document.createElement('div');
      noteBox.className = 'sticky-note-box';
      noteBox.id = noteId;
      noteBox.style.left = Math.max(10, Math.min(x, (pageEl.clientWidth || 800) - 220)) + 'px';
      noteBox.style.top = Math.max(10, Math.min(y, (pageEl.clientHeight || 1000) - 130)) + 'px';

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
          header.style.cursor = 'grab';
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

    // 6. Auto-Save & LocalStorage Sync
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

      const badge = document.getElementById('auto-save-badge');
      if (badge) {
        badge.style.opacity = '1';
        setTimeout(() => { badge.style.opacity = '0.7'; }, 1500);
      }
    }

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

    // 7. Load Saved Annotations
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
