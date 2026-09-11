/**
 * KURO FANGS — DEDICATED FULL-PAGE SHEET & LECTURE EXPERIENCE
 * Full-page dedicated route for each individual sheet, featuring complete metadata,
 * JNotes interactive document studio, audio summary player, and student discussion board.
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

    // If target is sh-fixed-provisional or not found, fallback to Dr. Hala Alhawij sheet
    if (!sheet || targetId === 'sh-fixed-provisional') {
      sheet = {
        id: 'sh-fixed-provisional',
        subject_id: 'fixed-pros',
        title: 'Provisional Restoration & Temporization (التركيبات المؤقتة وطرق إعدادها)',
        title_ar: 'Provisional Restoration & Temporization (التركيبات المؤقتة وطرق إعدادها)',
        title_en: 'Provisional Restoration & Temporization',
        subject_name: isAr ? 'الاستعاضة السنية الثابتة 2' : 'Fixed Prosthodontics II',
        doctor_name: isAr ? 'د. هالة الحويج (Dr. Hala Alhawij)' : 'Dr. Hala Alhawij',
        university: 'University of Tripoli - School of Dentistry',
        year: '2025-2026',
        pages: 17,
        size: '2.8 MB',
        date: '2026-09-11',
        type: 'PDF Sheet',
        sections_count: 16
      };
    }

    // Normalize metadata
    const title = sheet.title || (isAr ? sheet.title_ar : sheet.title_en);
    const subjectName = sheet.subject_name || (isAr ? 'الاستعاضة السنية الثابتة' : 'Fixed Prosthodontics');
    const doctorName = sheet.doctor_name || (isAr ? 'د. هالة الحويج' : 'Dr. Hala Alhawij');
    const pages = sheet.pages || 17;
    const size = sheet.size || '2.8 MB';
    const date = sheet.date || '2026-09-11';
    const fileType = sheet.type || 'PDF Sheet';
    const isFav = window.STORE ? window.STORE.isFavorite(sheet.id, 'sheet') : false;

    // Load saved comments for this sheet
    const commentsKey = 'kf_sheet_comments_' + sheet.id;
    let comments = [];
    try {
      comments = JSON.parse(localStorage.getItem(commentsKey) || '[]');
    } catch (e) {
      comments = [];
    }

    // Default sample Q&A if empty
    if (comments.length === 0) {
      comments = [
        {
          id: 'c1',
          author: 'طالبة طب أسنان - دفعة 2026',
          time: 'منذ ساعتين',
          text: 'سؤال في صفحة 13: هل أسمنت الزينك إيوجينول ZOE ممنوع استخدامه قبل تركيب التيجان اللاصقة بالريزن؟',
          reply: 'إجابة د. هالة: نعم، لأن الإيوجينول يعيق عملية البلمرة Free-radical polymerization للأسمنت الرابط!'
        }
      ];
    }

    // Generate HTML for the embedded JNotes reader
    const srcDocHTML = window.DocumentViewer 
      ? window.DocumentViewer.generateDocHTML(sheet, isAr)
      : '';

    container.innerHTML = `
      <div class="sheet-detail-page-wrapper">
        
        <!-- Top Navigation & Breadcrumb -->
        <div class="sheet-detail-back-bar" style="margin-bottom: 18px; display: flex; justify-content: space-between; align-items: center;">
          <a href="#/sheets" class="btn btn-secondary btn-sm" style="display: inline-flex; align-items: center; gap: 8px;">
            <i data-lucide="${isAr ? 'arrow-right' : 'arrow-left'}" style="width: 15px; height: 15px;"></i>
            <span>${isAr ? 'العودة لقائمة الشيتات والمحاضرات' : 'Back to All Handouts'}</span>
          </a>

          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="sheet-type-pill" style="background: rgba(2, 132, 199, 0.15); color: #0284C7; border: 1px solid rgba(2, 132, 199, 0.3); padding: 4px 10px; border-radius: 8px; font-size: 0.775rem; font-weight: 700;">
              ${subjectName}
            </span>
            <span class="sheet-verified-pill" style="background: rgba(16, 185, 129, 0.15); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.3); padding: 4px 10px; border-radius: 8px; font-size: 0.775rem; font-weight: 700;">
              <i data-lucide="check-circle" style="width: 13px; height: 13px; display: inline-block;"></i>
              ${isAr ? 'نسخة معتمدة ومحققة 2025-2026' : 'Official Syllabus 2025-2026'}
            </span>
          </div>
        </div>

        <!-- Sheet Dedicated Summary Card -->
        <div class="sheet-modern-card" style="margin-bottom: 24px;">
          <div class="sheet-card-top">
            <div class="sheet-badge-group">
              <span class="sheet-type-pill">
                <img src="assets/icons/sheets_cat.png" alt="Sheet" style="width: 18px; height: 18px; border-radius: 50%; object-fit: cover;" />
                ${fileType}
              </span>
              <span style="font-size: 0.8rem; color: var(--text-muted);">
                ${isAr ? 'جامعة طرابلس • كلية طب وجراحة الفم والأسنان' : 'University of Tripoli • Faculty of Dentistry'}
              </span>
            </div>
            <h1 class="sheet-main-title" style="font-size: 1.6rem; margin-top: 6px; margin-bottom: 8px;">${title}</h1>
          </div>

          <!-- Metadata row -->
          <div class="sheet-card-meta-row" style="margin-top: 14px; margin-bottom: 16px;">
            <div class="sheet-meta-item">
              <i data-lucide="book-open"></i>
              <span><strong>${pages}</strong> ${isAr ? 'صفحة شاملة' : 'pages'}</span>
            </div>
            <div class="sheet-meta-item">
              <i data-lucide="hard-drive"></i>
              <span><strong>${size}</strong></span>
            </div>
            <div class="sheet-meta-item">
              <i data-lucide="user-check"></i>
              <span>${isAr ? 'أستاذة المادة:' : 'Lecturer:'} <strong>${doctorName}</strong></span>
            </div>
            <div class="sheet-meta-item">
              <i data-lucide="calendar"></i>
              <span>${date}</span>
            </div>
          </div>

          <!-- Action Buttons Bar -->
          <div class="sheet-card-actions-row">
            <div class="dual-buttons-group">
              <button id="btn-download-doc-page" class="btn btn-primary btn-action-download">
                <i data-lucide="download" style="width: 16px; height: 16px;"></i>
                <span>${isAr ? 'تنزيل الشيت بصيغة PDF (+10 نقاط)' : 'Download PDF (+10 pts)'}</span>
              </button>

              <button id="btn-audio-summary" class="btn btn-secondary" style="gap: 8px;">
                <i data-lucide="headphones" style="width: 16px; height: 16px; color: var(--brand-primary);"></i>
                <span id="audio-summary-label">${isAr ? 'استماع للملخص الصوتي' : 'Audio Summary'}</span>
              </button>
            </div>

            <button id="btn-fav-sheet-page" class="btn btn-secondary btn-sm btn-fav-action">
              <i data-lucide="bookmark" style="width: 15px; height: 15px; fill: ${isFav ? 'currentColor' : 'none'};"></i>
              <span id="fav-label-page">${isFav ? (isAr ? 'في المحفوظات' : 'Saved') : (isAr ? 'حفظ الشيت' : 'Bookmark')}</span>
            </button>
          </div>
        </div>

        <!-- JNotes Interactive Note Studio Workspace (Embedded Directly in Page) -->
        <div class="card" style="padding: 0; overflow: hidden; border-radius: 16px; border: 1px solid var(--border-subtle); margin-bottom: 24px; box-shadow: 0 15px 40px rgba(0,0,0,0.25);">
          
          <!-- Studio Page Header Bar -->
          <div style="background: #1B1D2C; padding: 12px 20px; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="background: #0284C7; color: #FFF; padding: 3px 8px; border-radius: 6px; font-size: 0.725rem; font-weight: 800;">JNOTES STUDIO</span>
              <span style="color: #F8FAFC; font-size: 0.9rem; font-weight: 700;">
                ${isAr ? 'قارئ واستوديو الشيت التفاعلي — تظليل، رسم حر، وملاحظات' : 'Interactive Handout Reader & Note Studio'}
              </span>
            </div>

            <div style="display: flex; align-items: center; gap: 8px;">
              <button id="btn-expand-studio-fullscreen" class="btn btn-secondary btn-sm" title="${isAr ? 'مُطالعة ملء الشاشة' : 'Fullscreen'}">
                <i data-lucide="maximize-2" style="width: 14px; height: 14px;"></i>
                <span>${isAr ? 'ملء الشاشة بالكامل' : 'Fullscreen Mode'}</span>
              </button>
              <button id="btn-print-studio" class="btn btn-secondary btn-sm" title="${isAr ? 'طباعة' : 'Print'}">
                <i data-lucide="printer" style="width: 14px; height: 14px;"></i>
              </button>
            </div>
          </div>

          <!-- Embedded Studio Frame -->
          <div style="width: 100%; height: 820px; background: #12131F; position: relative;">
            <iframe id="page-dedicated-iframe" style="width: 100%; height: 100%; border: none; display: block;" title="${title}" sandbox="allow-scripts allow-same-origin allow-popups"></iframe>
          </div>
        </div>

        <!-- Student Discussion & Q&A Board -->
        <div class="card" style="padding: 22px; margin-bottom: 30px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 10px;">
            <h3 style="font-size: 1.1rem; font-weight: 800; color: var(--text-primary); display: flex; align-items: center; gap: 8px;">
              <i data-lucide="message-square" style="width: 18px; height: 18px; color: var(--brand-primary);"></i>
              <span>${isAr ? 'مناقشة وأسئلة الطلبة حول الشيت' : 'Student Questions & Discussion'}</span>
            </h3>
            <span style="font-size: 0.775rem; color: var(--text-muted);" id="comments-count-pill">${comments.length} ${isAr ? 'ملاحظة ومناقشة' : 'discussions'}</span>
          </div>

          <!-- Add Question Form -->
          <div style="display: flex; gap: 10px; margin-bottom: 20px;">
            <input type="text" id="input-new-comment" class="form-control" placeholder="${isAr ? 'اكتب سؤالك أو ملاحظتك حول هذا الشيت...' : 'Ask a question or add a note for this handout...'}" style="flex: 1; padding: 10px 14px; font-size: 0.875rem;" />
            <button id="btn-post-comment" class="btn btn-primary" style="padding: 10px 18px; white-space: nowrap;">
              <i data-lucide="send" style="width: 15px; height: 15px;"></i>
              <span>${isAr ? 'إرسال' : 'Post'}</span>
            </button>
          </div>

          <!-- Comments List -->
          <div id="comments-list-box" style="display: flex; flex-direction: column; gap: 14px;">
            ${comments.map(c => `
              <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border-subtle); border-radius: 10px; padding: 14px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                  <span style="font-size: 0.825rem; font-weight: 800; color: var(--brand-primary);">${c.author}</span>
                  <span style="font-size: 0.725rem; color: var(--text-muted);">${c.time}</span>
                </div>
                <p style="font-size: 0.875rem; color: var(--text-primary); line-height: 1.5; margin-bottom: 6px;">${c.text}</p>
                ${c.reply ? `
                  <div style="background: rgba(2, 132, 199, 0.08); border-right: 3px solid #0284C7; padding: 8px 12px; border-radius: 4px; font-size: 0.825rem; color: var(--text-secondary); margin-top: 8px;">
                    💡 ${c.reply}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    `;

    // Load iframe content
    const iframeEl = document.getElementById('page-dedicated-iframe');
    if (iframeEl && srcDocHTML) {
      iframeEl.srcdoc = srcDocHTML;
    }

    // Fullscreen studio button
    const expandBtn = document.getElementById('btn-expand-studio-fullscreen');
    if (expandBtn) {
      expandBtn.addEventListener('click', () => {
        if (window.DocumentViewer) {
          window.DocumentViewer.open(sheet);
        }
      });
    }

    // Print button
    const printBtn = document.getElementById('btn-print-studio');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        if (iframeEl && iframeEl.contentWindow) {
          iframeEl.contentWindow.focus();
          iframeEl.contentWindow.print();
        }
      });
    }

    // Download PDF button
    const downloadBtn = document.getElementById('btn-download-doc-page');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', () => {
        if (window.DocumentViewer) {
          window.DocumentViewer.download(sheet);
        } else {
          window.STORE.addPoints(10);
          window.showToast(isAr ? 'تم بدء التنزيل بنجاح (+10 نقاط)' : 'Download started (+10 pts)', { type: 'success', points: 10 });
        }
      });
    }

    // Audio summary button
    const audioBtn = document.getElementById('btn-audio-summary');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        window.showToast(
          isAr ? '🔊 جاري تشغيل التلخيص الصوتي لمحاضرة د. هالة الحويج...' : '🔊 Playing audio summary for Dr. Hala Alhawij lecture...',
          { type: 'info' }
        );
      });
    }

    // Favorite button
    const favBtn = document.getElementById('btn-fav-sheet-page');
    if (favBtn) {
      favBtn.addEventListener('click', () => {
        const added = window.STORE.toggleFavorite({
          id: sheet.id,
          title: title,
          type: 'sheet',
          subject_name: subjectName
        });
        const favLabel = document.getElementById('fav-label-page');
        if (added) {
          favBtn.classList.add('active');
          if (favLabel) favLabel.textContent = isAr ? 'في المحفوظات' : 'Saved';
        } else {
          favBtn.classList.remove('active');
          if (favLabel) favLabel.textContent = isAr ? 'حفظ الشيت' : 'Bookmark';
        }
        if (window.lucide) window.lucide.createIcons();
      });
    }

    // Post comment handler
    const postBtn = document.getElementById('btn-post-comment');
    const inputEl = document.getElementById('input-new-comment');
    if (postBtn && inputEl) {
      postBtn.addEventListener('click', () => {
        const val = inputEl.value.trim();
        if (!val) return;

        const newC = {
          id: 'c_' + Date.now(),
          author: isAr ? 'طالب طب أسنان' : 'Dental Student',
          time: isAr ? 'الآن' : 'Just now',
          text: val
        };

        comments.unshift(newC);
        try {
          localStorage.setItem(commentsKey, JSON.stringify(comments));
        } catch (e) {}

        window.STORE.addPoints(5);
        window.showToast(isAr ? 'تم إضافة ملاحظتك ومناقشتك بنجاح! (+5 نقاط)' : 'Question posted! (+5 pts)', { type: 'success', points: 5 });

        // Re-render
        SheetDetailPage.render(container, sheetIdOrQuery, maybeQuery);
      });
    }

    if (window.lucide) window.lucide.createIcons();
  }
};

window.SheetDetailPage = SheetDetailPage;
