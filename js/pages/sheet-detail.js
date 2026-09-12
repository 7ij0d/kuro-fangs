/**
 * KURO FANGS — DEDICATED FULL-PAGE SHEET & LECTURE EXPERIENCE
 * Full-page dedicated workspace route for each individual sheet, featuring complete metadata,
 * native JNotes interactive document studio, audio summary player, and student discussion board.
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
        pages: 16,
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
    const pages = sheet.pages || 16;
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

    if (comments.length === 0) {
      comments = [
        {
          id: 'c1',
          author: 'طالبة طب أسنان - دفعة 2026',
          time: 'منذ ساعتين',
          text: 'سؤال في صفحة 2: ماهو الفرق بين Positive Rake Angle و Negative Rake Angle في أجهزة القطع Rotatory burs؟',
          reply: 'إجابة د. هالة: الـ Positive يزيد كفاءة القطع في الأنسجة اللينة، والـ Negative يزيد قوة الشفرة في حفر المينا والمعادن!'
        }
      ];
    }

    // Generate HTML for the JNotes reader
    const srcDocHTML = window.DocumentViewer 
      ? window.DocumentViewer.generateDocHTML(sheet, isAr)
      : '';

    container.innerHTML = `
      <div class="sheet-detail-page-wrapper" style="margin-top: -10px;">
        
        <!-- Top Navigation Bar -->
        <div class="sheet-detail-back-bar" style="margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <a href="#/sheets" class="btn btn-secondary btn-sm" style="display: inline-flex; align-items: center; gap: 6px; font-weight: 700;">
              <i data-lucide="${isAr ? 'arrow-right' : 'arrow-left'}" style="width: 15px; height: 15px;"></i>
              <span>${isAr ? 'العودة لقائمة الشيتات' : 'Back to Handouts'}</span>
            </a>

            <span class="sheet-type-pill" style="background: rgba(2, 132, 199, 0.15); color: #0284C7; border: 1px solid rgba(2, 132, 199, 0.3); padding: 4px 10px; border-radius: 8px; font-size: 0.775rem; font-weight: 700;">
              ${subjectName}
            </span>
          </div>

          <!-- Quick Action Buttons -->
          <div style="display: flex; align-items: center; gap: 8px;">
            <button id="btn-download-doc-page" class="btn btn-primary btn-sm" style="gap: 6px;">
              <i data-lucide="download" style="width: 14px; height: 14px;"></i>
              <span>${isAr ? 'تنزيل PDF (+10 نقاط)' : 'Download PDF'}</span>
            </button>

            <button id="btn-audio-summary" class="btn btn-secondary btn-sm" style="gap: 6px;">
              <i data-lucide="headphones" style="width: 14px; height: 14px; color: var(--brand-primary);"></i>
              <span>${isAr ? 'ملخص صوتي' : 'Audio Summary'}</span>
            </button>

            <button id="btn-fav-sheet-page" class="btn btn-secondary btn-sm" style="padding: 5px 10px;">
              <i data-lucide="bookmark" style="width: 14px; height: 14px; fill: ${isFav ? 'currentColor' : 'none'};"></i>
              <span id="fav-label-page">${isFav ? (isAr ? 'محفوظ' : 'Saved') : (isAr ? 'حفظ' : 'Bookmark')}</span>
            </button>
          </div>
        </div>

        <!-- Dedicated Native JNotes Studio Reader Container -->
        <div style="width: 100%; height: calc(100vh - 140px); min-height: 780px; background: #12131F; border-radius: 16px; overflow: hidden; border: 1px solid var(--border-subtle); box-shadow: 0 18px 50px rgba(0,0,0,0.35); margin-bottom: 24px; position: relative;">
          <iframe id="page-dedicated-iframe" style="width: 100%; height: 100%; border: none; display: block;" title="${title}" sandbox="allow-scripts allow-same-origin allow-popups"></iframe>
        </div>

        <!-- Student Discussion & Q&A Board -->
        <div class="card" style="padding: 20px; margin-bottom: 30px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px; border-bottom: 1px solid var(--border-subtle); padding-bottom: 8px;">
            <h3 style="font-size: 1.05rem; font-weight: 800; color: var(--text-primary); display: flex; align-items: center; gap: 8px; margin: 0;">
              <i data-lucide="message-square" style="width: 18px; height: 18px; color: var(--brand-primary);"></i>
              <span>${isAr ? 'مناقشة وأسئلة الطلبة حول الشيت' : 'Student Questions & Discussion'}</span>
            </h3>
            <span style="font-size: 0.775rem; color: var(--text-muted);">${comments.length} ${isAr ? 'ملاحظة ومناقشة' : 'discussions'}</span>
          </div>

          <!-- Add Question Form -->
          <div style="display: flex; gap: 10px; margin-bottom: 16px;">
            <input type="text" id="input-new-comment" class="form-control" placeholder="${isAr ? 'اكتب سؤالك أو ملاحظتك حول هذا الشيت...' : 'Ask a question or add a note for this handout...'}" style="flex: 1; padding: 10px 14px; font-size: 0.85rem;" />
            <button id="btn-post-comment" class="btn btn-primary" style="padding: 10px 18px; white-space: nowrap;">
              <i data-lucide="send" style="width: 15px; height: 15px;"></i>
              <span>${isAr ? 'إرسال' : 'Post'}</span>
            </button>
          </div>

          <!-- Comments List -->
          <div id="comments-list-box" style="display: flex; flex-direction: column; gap: 12px;">
            ${comments.map(c => `
              <div style="background: var(--bg-surface-subtle); border: 1px solid var(--border-subtle); border-radius: 10px; padding: 12px 14px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                  <span style="font-size: 0.825rem; font-weight: 800; color: var(--brand-primary);">${c.author}</span>
                  <span style="font-size: 0.725rem; color: var(--text-muted);">${c.time}</span>
                </div>
                <p style="font-size: 0.85rem; color: var(--text-primary); line-height: 1.5; margin-bottom: 4px;">${c.text}</p>
                ${c.reply ? `
                  <div style="background: rgba(2, 132, 199, 0.08); border-right: 3px solid #0284C7; padding: 6px 10px; border-radius: 4px; font-size: 0.8rem; color: var(--text-secondary); margin-top: 6px;">
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

    // Download PDF button
    document.getElementById('btn-download-doc-page')?.addEventListener('click', () => {
      if (window.DocumentViewer) {
        window.DocumentViewer.download(sheet);
      } else {
        window.STORE.addPoints(10);
        window.showToast(isAr ? 'تم بدء التنزيل بنجاح (+10 نقاط)' : 'Download started (+10 pts)', { type: 'success', points: 10 });
      }
    });

    // Audio summary button
    document.getElementById('btn-audio-summary')?.addEventListener('click', () => {
      window.showToast(
        isAr ? '🔊 جاري تشغيل التلخيص الصوتي لمحاضرة د. هالة الحويج...' : '🔊 Playing audio summary for Dr. Hala Alhawij lecture...',
        { type: 'info' }
      );
    });

    // Favorite button
    document.getElementById('btn-fav-sheet-page')?.addEventListener('click', () => {
      const added = window.STORE.toggleFavorite({
        id: sheet.id,
        title: title,
        type: 'sheet',
        subject_name: subjectName
      });
      const favLabel = document.getElementById('fav-label-page');
      if (added) {
        if (favLabel) favLabel.textContent = isAr ? 'محفوظ' : 'Saved';
      } else {
        if (favLabel) favLabel.textContent = isAr ? 'حفظ' : 'Bookmark';
      }
      if (window.lucide) window.lucide.createIcons();
    });

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
