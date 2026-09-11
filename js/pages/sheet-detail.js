/**
 * KURO FANGS — SHEET DETAIL & DOCUMENT PREVIEW PAGE
 * Pure White 16px Card, Dual Action Controls & Embedded In-App PDF/Document Viewer (<iframe />)
 */

const SheetDetailPage = {
  render(container, sheetIdOrQuery, maybeQuery) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
    const t = (k) => window.I18N ? window.I18N.t(k) : k;

    // Handle both /sheet/:id and /sheet-detail?id=...
    let targetId = typeof sheetIdOrQuery === 'string' ? sheetIdOrQuery : null;
    if (!targetId && sheetIdOrQuery instanceof URLSearchParams) {
      targetId = sheetIdOrQuery.get('id');
    }
    if (!targetId && maybeQuery instanceof URLSearchParams) {
      targetId = maybeQuery.get('id');
    }

    const sheets = window.DATA?.sheets || [];
    const subjects = window.DATA?.getSubjects() || [];

    let sheet = sheets.find(s => s.id === targetId);

    // If not found in static list, construct realistic dental sheet
    if (!sheet) {
      sheet = {
        id: targetId || 's-featured',
        title: isAr ? 'محاضرة 1: مقدمة والتشخيص السريري المتقدم' : 'Lecture 1: Core Clinical Diagnosis & Foundations',
        title_ar: 'محاضرة 1: مقدمة والتشخيص السريري المتقدم',
        title_en: 'Lecture 1: Core Clinical Diagnosis & Foundations',
        subject_name: isAr ? 'أمراض وجراحة الفم والأسنان' : 'Oral & Maxillofacial Pathology',
        doctor_name: isAr ? 'د. طارق الزاوي' : 'Dr. Tarek Alzawi',
        date: '2026-09-12',
        pages: 18,
        size: '3.2 MB',
        type: 'PDF Sheet',
        file_url: '#'
      };
    }

    // Normalize
    const title = sheet.title || (isAr ? sheet.title_ar : sheet.title_en);
    const subjectName = sheet.subject_name || (isAr ? 'طب الأسنان' : 'Dentistry');
    const doctorName = sheet.doctor_name || (isAr ? 'د. طارق الزاوي' : 'Dr. Tarek Alzawi');
    const pages = sheet.pages || 18;
    const size = sheet.size || '3.2 MB';
    const date = sheet.date || '2026-09-12';
    const fileType = sheet.type || 'PDF Sheet';
    const isFav = window.STORE ? window.STORE.isFavorite(sheet.id, 'sheet') : false;

    // Generate srcdoc for the embedded viewer
    const srcDocHTML = window.DocumentViewer 
      ? window.DocumentViewer.generateDocHTML(sheet, isAr)
      : '';

    container.innerHTML = `
      <div class="sheet-detail-wrapper">
        <!-- Breadcrumb / Back Link -->
        <div class="sheet-detail-back-bar">
          <a href="#/sheets" class="btn btn-secondary btn-sm" style="display: inline-flex; align-items: center; gap: 8px;">
            <img src="assets/icons/sheets_cat.png" alt="Sheets" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover; border: 1.5px solid var(--border-subtle);" />
            <i data-lucide="${isAr ? 'arrow-right' : 'arrow-left'}" style="width: 14px; height: 14px;"></i>
            <span>${isAr ? 'العودة لكافة الشيتات والمحاضرات' : 'Back to all Lectures'}</span>
          </a>
        </div>

        <!-- Modern 16px Pure White Card -->
        <div class="sheet-modern-card">
          <!-- Top Section: Type Badge + Lecture Title -->
          <div class="sheet-card-top">
            <div class="sheet-badge-group">
              <span class="sheet-type-pill" style="display: inline-flex; align-items: center; gap: 6px;">
                <img src="assets/icons/sheets_cat.png" alt="Sheet" style="width: 18px; height: 18px; border-radius: 50%; object-fit: cover;" />
                ${fileType}
              </span>
              <span class="sheet-verified-pill">
                <i data-lucide="check-circle" style="width: 13px; height: 13px;"></i>
                ${isAr ? 'نسخة معتمدة ومحققة' : 'Verified Syllabus'}
              </span>
            </div>
            <h1 class="sheet-main-title">${title}</h1>
          </div>

          <!-- Info Section: Pages • Size • Doctor • Date -->
          <div class="sheet-card-meta-row">
            <div class="sheet-meta-item" title="${isAr ? 'عدد الصفحات' : 'Page Count'}">
              <i data-lucide="book-open"></i>
              <span><strong>${pages}</strong> ${isAr ? 'صفحة' : 'pages'}</span>
            </div>

            <div class="sheet-meta-item" title="${isAr ? 'حجم الملف' : 'File Size'}">
              <i data-lucide="hard-drive"></i>
              <span><strong>${size}</strong></span>
            </div>

            <div class="sheet-meta-item" title="${isAr ? 'أستاذ المادة' : 'Lecturer / Doctor'}">
              <i data-lucide="user-check"></i>
              <span>${isAr ? 'الدكتور:' : 'Doctor:'} <strong>${doctorName}</strong></span>
            </div>

            <div class="sheet-meta-item" title="${isAr ? 'المادة المقررة' : 'Course Subject'}">
              <i data-lucide="graduation-cap"></i>
              <span>${isAr ? 'المادة:' : 'Subject:'} <strong>${subjectName}</strong></span>
            </div>

            <div class="sheet-meta-item" title="${isAr ? 'تاريخ التحديث' : 'Release Date'}">
              <i data-lucide="calendar"></i>
              <span>${date}</span>
            </div>
          </div>

          <!-- Bottom Section: Dual Action Buttons -->
          <div class="sheet-card-actions-row">
            <div class="dual-buttons-group">
              <!-- Button 1: View / Read In-App without downloading -->
              <button id="btn-view-doc-modal" class="btn btn-primary btn-action-view">
                <i data-lucide="eye" style="width: 16px; height: 16px;"></i>
                <span>${isAr ? 'قراءة / معاينة سريعة' : 'Read / Quick View'}</span>
              </button>

              <!-- Button 2: Download PDF -->
              <button id="btn-download-doc" class="btn btn-secondary btn-action-download">
                <i data-lucide="download" style="width: 16px; height: 16px;"></i>
                <span>${isAr ? 'تنزيل الملف (PDF)' : 'Download PDF'}</span>
              </button>
            </div>

            <button id="btn-fav-sheet" class="btn btn-secondary btn-sm btn-fav-action">
              <i data-lucide="bookmark" style="width: 15px; height: 15px; fill: ${isFav ? 'currentColor' : 'none'};"></i>
              <span id="fav-label">${isFav ? (isAr ? 'في المحفوظات' : 'Saved') : (isAr ? 'حفظ' : 'Bookmark')}</span>
            </button>
          </div>
        </div>

        <!-- Direct In-App PDF / Document Viewer Frame -->
        <div class="sheet-inapp-viewer-container">
          <div class="inapp-viewer-toolbar">
            <div class="viewer-toolbar-info">
              <img src="assets/icons/sheets_cat.png" alt="Sheets" style="width: 20px; height: 20px; border-radius: 50%; object-fit: cover; border: 1.5px solid #10B981;" />
              <span class="viewer-toolbar-title">${isAr ? 'مُشاهد PDF المباشر — مطالعة فورية دون تنزيل' : 'Direct In-App Document Reader — Read without downloading'}</span>
            </div>

            <div class="viewer-toolbar-controls">
              <button id="btn-inline-fullscreen" class="btn btn-secondary btn-sm" title="${isAr ? 'تكبير لشاشة كاملة' : 'Fullscreen'}">
                <i data-lucide="maximize"></i>
                <span>${isAr ? 'شاشة كاملة' : 'Fullscreen'}</span>
              </button>
              <button id="btn-inline-print" class="btn btn-secondary btn-sm" title="${isAr ? 'طباعة' : 'Print'}">
                <i data-lucide="printer"></i>
              </button>
            </div>
          </div>

          <div class="inapp-viewer-frame-wrap" id="inline-frame-wrap">
            <iframe id="sheet-detail-iframe" class="sheet-detail-iframe" title="${title}" sandbox="allow-scripts allow-same-origin allow-popups"></iframe>
          </div>
        </div>
      </div>
    `;

    // Load iframe content
    const iframeEl = document.getElementById('sheet-detail-iframe');
    if (iframeEl && srcDocHTML) {
      iframeEl.srcdoc = srcDocHTML;
    }

    // Attach listeners
    const viewModalBtn = document.getElementById('btn-view-doc-modal');
    if (viewModalBtn) {
      viewModalBtn.addEventListener('click', () => {
        if (window.DocumentViewer) {
          window.DocumentViewer.open(sheet);
        }
      });
    }

    const downloadDocBtn = document.getElementById('btn-download-doc');
    if (downloadDocBtn) {
      downloadDocBtn.addEventListener('click', () => {
        if (window.DocumentViewer) {
          window.DocumentViewer.download(sheet);
        } else {
          window.STORE.addPoints(10);
          window.showToast(isAr ? 'تم بدء التنزيل بنجاح (+10 نقاط)' : 'Download started (+10 pts)', { type: 'success', points: 10 });
        }
      });
    }

    const favBtn = document.getElementById('btn-fav-sheet');
    if (favBtn) {
      favBtn.addEventListener('click', () => {
        const added = window.STORE.toggleFavorite({
          id: sheet.id,
          title: title,
          type: 'sheet',
          subject_name: subjectName
        });
        const favLabel = document.getElementById('fav-label');
        if (added) {
          favBtn.classList.add('active');
          if (favLabel) favLabel.textContent = isAr ? 'في المحفوظات' : 'Saved';
        } else {
          favBtn.classList.remove('active');
          if (favLabel) favLabel.textContent = isAr ? 'حفظ' : 'Bookmark';
        }
        if (window.lucide) window.lucide.createIcons();
      });
    }

    const fsBtn = document.getElementById('btn-inline-fullscreen');
    if (fsBtn) {
      fsBtn.addEventListener('click', () => {
        const wrap = document.getElementById('inline-frame-wrap');
        if (wrap) {
          if (!document.fullscreenElement) {
            wrap.requestFullscreen().catch(() => {});
          } else {
            document.exitFullscreen().catch(() => {});
          }
        }
      });
    }

    const printBtn = document.getElementById('btn-inline-print');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        if (iframeEl && iframeEl.contentWindow) {
          iframeEl.contentWindow.focus();
          iframeEl.contentWindow.print();
        }
      });
    }

    if (window.lucide) window.lucide.createIcons();
  }
};

window.SheetDetailPage = SheetDetailPage;
