/**
 * KURO FANGS — DEDICATED FULL-PAGE SHEET & LECTURE EXPERIENCE
 * Full-page dedicated workspace route for each individual sheet, featuring complete metadata,
 * native JNotes interactive document studio, audio recording player, and student discussion board.
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

    // Also check custom admin sheets
    if (!sheet) {
      try {
        const customSheets = JSON.parse(localStorage.getItem('kf_admin_custom_sheets') || '[]');
        sheet = customSheets.find(s => s.id === targetId);
      } catch (e) {}
    }

    // If not found — show error, NO automatic fallback to first sheet
    if (!sheet) {
      container.innerHTML = `
        <div style="padding: 40px; text-align: center;">
          <div style="font-size: 3rem; margin-bottom: 12px;">📁</div>
          <h2 style="font-size: 1.25rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">
            ${isAr ? 'لم يتم العثور على الشيت' : 'Sheet Not Found'}
          </h2>
          <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 20px;">
            ${isAr ? 'قد يكون تم حذف الشيت أو أن الرابط غير صحيح.' : 'This sheet may have been removed or the link is invalid.'}
          </p>
          <a href="#/sheets" class="btn btn-primary" style="display: inline-flex; gap: 6px;">
            <span>${isAr ? 'العودة لقائمة الشيتات' : 'Back to Sheets'}</span>
          </a>
        </div>
      `;
      return;
    }

    // Normalize metadata
    const title = sheet.title || (isAr ? sheet.title_ar : sheet.title_en);
    const subjectName = sheet.subject_name || (isAr ? 'المادة الدراسية' : 'Academic Subject');
    const doctorName = sheet.doctor_name || '';
    const pages = sheet.pages || 16;
    const size = sheet.size || '2.8 MB';
    const date = sheet.date || '2026-09-11';
    const fileType = sheet.type || 'PDF Sheet';
        const isAdmin = Boolean(sessionStorage.getItem('kf_admin_auth') === 'true' || (window.AdminPage && window.AdminPage.checkAuth && window.AdminPage.checkAuth()));

    // Load saved comments for this sheet
    const commentsKey = 'kf_sheet_comments_' + sheet.id;
    let comments = [];
    const rawComments = localStorage.getItem(commentsKey);
    if (rawComments === null) {
      comments = [
        {
          id: 'c1',
          author: isAr ? 'طالبة طب أسنان - دفعة 2026' : 'Dental Student - Class of 2026',
          time: isAr ? 'منذ ساعتين' : '2 hours ago',
          text: isAr
            ? 'سؤال في صفحة 2: ماهو الفرق بين Positive Rake Angle و Negative Rake Angle في أجهزة القطع Rotatory burs؟'
            : 'Question on page 2: What is the difference between Positive Rake Angle and Negative Rake Angle in rotary burs?',
          reply: isAr
            ? 'إجابة د. هالة: الـ Positive يزيد كفاءة القطع في الأنسجة اللينة، والـ Negative يزيد قوة الشفرة في حفر المينا والمعادن!'
            : 'Dr. Hala: Positive rake angle increases cutting efficiency in soft tissues, while negative rake angle enhances blade strength for hard enamel and metals!'
        }
      ];
      localStorage.setItem(commentsKey, JSON.stringify(comments));
    } else {
      try {
        comments = JSON.parse(rawComments);
        if (!Array.isArray(comments)) comments = [];
      } catch (e) {
        comments = [];
      }
    }

    container.innerHTML = `
      <div id="sheet-studio-fullscreen-root" class="sheet-studio-fullscreen" style="width: 100vw; height: 100vh; height: 100dvh; min-height: 100vh; max-height: 100dvh; background: #12131F; position: fixed; top: 0; left: 0; z-index: 99990; margin: 0; padding: 0; overflow: hidden; display: flex; flex-direction: column;">
        <!-- Clean Dedicated Kuro Fangs Header (Docked, never covers PDF tools) -->
        <header id="sheet-studio-header" style="height: 48px; min-height: 48px; background: #0E101A; border-bottom: 1px solid rgba(255,255,255,0.08); display: flex; align-items: center; justify-content: space-between; padding: 0 14px; flex-shrink: 0; z-index: 100000; direction: ${isAr ? 'rtl' : 'ltr'}; font-family: inherit; user-select: none;">
          <!-- Back Button -->
          <button id="btn-back-from-studio" style="background: rgba(255,255,255,0.07); color: #38BDF8; border: 1px solid rgba(56, 189, 248, 0.35); border-radius: 8px; padding: 6px 14px; font-weight: 800; font-size: 0.85rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; font-family: inherit; transition: all 0.15s ease;">
            <span style="font-size: 1.1rem; line-height: 1;">${isAr ? '➔' : '←'}</span>
            <span>${isAr ? 'الرجوع للمادة' : 'Back'}</span>
          </button>

          <!-- Sheet Title -->
          <div style="flex: 1; min-width: 0; padding: 0 12px; text-align: center;">
            <div style="font-weight: 800; font-size: 0.88rem; color: #F8FAFC; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: inline-flex; align-items: center; gap: 6px; max-width: 100%;">
              <span>📄</span>
              <span>${title}</span>
            </div>
          </div>

          <!-- Actions Group: Copy Buttons + Edit Sheet (Admin Only) + Discussion -->
          <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
            <!-- Structured Copy Actions Group -->
            <div id="sheet-copy-group" class="sheet-copy-group">
              <!-- Desktop Buttons (Visible on screens >= 769px) -->
              <div class="sheet-copy-desktop-btns" style="display: inline-flex; align-items: center; gap: 6px;">
                <button id="btn-copy-current-page" class="kuro-copy-btn kuro-copy-btn-page" title="${isAr ? 'نسخ نصوص الصفحة الحالية مع الحفاظ على ترتيب الأسطر والعناوين' : 'Copy structured text of current page'}">
                  <span class="copy-icon" style="font-size: 0.95rem;">📄</span>
                  <span>${isAr ? 'نسخ صفحة' : 'Copy Pg'}</span>
                  <span id="copy-page-num-badge" class="kuro-copy-badge">1</span>
                </button>
                <button id="btn-copy-full-sheet" class="kuro-copy-btn kuro-copy-btn-full" title="${isAr ? 'نسخ كامل الشيت بجميع صفحاته مرتباً ومقسماً في الحافظة' : 'Copy entire sheet formatted'}">
                  <span class="copy-icon" style="font-size: 0.95rem;">📚</span>
                  <span>${isAr ? 'نسخ الشيت كامل' : 'Copy All'}</span>
                  <span id="copy-total-pages-badge" class="kuro-copy-badge">${pages} ص</span>
                </button>
              </div>

              <!-- Mobile / Compact Dropdown (Visible on screens <= 768px) -->
              <div class="sheet-copy-mobile-btn" style="position: relative;">
                <button id="btn-copy-dropdown-trigger" class="kuro-copy-btn" style="padding: 6px 10px;" title="${isAr ? 'خيارات نسخ محتوى الشيت' : 'Copy options'}">
                  <span style="font-size: 0.95rem;">📋</span>
                  <span>${isAr ? 'نسخ' : 'Copy'}</span>
                  <span style="font-size: 0.7rem; opacity: 0.7;">▾</span>
                </button>
                <div id="sheet-copy-dropdown-menu" class="kuro-copy-dropdown-menu" style="display: none;">
                  <button id="btn-mobile-copy-page" class="kuro-copy-dropdown-item">
                    <span style="display: flex; align-items: center; gap: 6px;">
                      <span>📄</span>
                      <span>${isAr ? 'نسخ الصفحة الحالية' : 'Copy Current Page'}</span>
                    </span>
                    <span id="mobile-copy-page-badge" class="kuro-copy-badge">1</span>
                  </button>
                  <button id="btn-mobile-copy-full" class="kuro-copy-dropdown-item">
                    <span style="display: flex; align-items: center; gap: 6px;">
                      <span>📚</span>
                      <span>${isAr ? 'نسخ الشيت كاملاً' : 'Copy Entire Sheet'}</span>
                    </span>
                    <span id="mobile-total-pages-badge" class="kuro-copy-badge">${pages} ص</span>
                  </button>
                </div>
              </div>
            </div>

            ${isAdmin ? `
              <!-- Edit Sheet Button (Admin Only) -->
              <button id="btn-edit-sheet-studio" style="background: rgba(255,255,255,0.08); color: #38BDF8; border: 1px solid rgba(56, 189, 248, 0.35); border-radius: 8px; padding: 6px 12px; font-weight: 700; font-size: 0.8rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; font-family: inherit; transition: all 0.15s ease;" title="${isAr ? 'تعديل بيانات وملف الشيت' : 'Edit Sheet & File'}">
                <span style="font-size: 0.95rem;">✏️</span>
                <span>${isAr ? 'تعديل الشيت' : 'Edit'}</span>
              </button>
            ` : ''}

            <!-- Discussion Trigger Button -->
            <button id="btn-toggle-discussion" style="background: linear-gradient(135deg, #0284C7, #0369A1); color: #FFF; border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; padding: 6px 14px; font-weight: 700; font-size: 0.825rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; font-family: inherit; flex-shrink: 0;">
              <span style="font-size: 0.95rem;">💬</span>
              <span>${isAr ? 'المناقشة' : 'Discussion'}</span>
              <span id="discussion-count-badge" style="background: rgba(255,255,255,0.25); padding: 1px 7px; border-radius: 10px; font-size: 0.725rem; font-weight: 800;">${comments.length}</span>
            </button>
          </div>
        </header>

        <!-- PDF Viewer Container fills remaining space -->
        <div id="sheet-studio-container" style="flex: 1; width: 100%; height: calc(100% - 48px); display: flex; flex-direction: column; overflow: hidden; position: relative;"></div>
      </div>

      <!-- Slide-Over Discussion Drawer -->
      <div id="sheet-discussion-drawer" style="position: fixed; top: 0; bottom: 0; ${isAr ? 'left: 0;' : 'right: 0;'} width: min(440px, 94vw); background: #181926; z-index: 100002; box-shadow: ${isAr ? '10px 0 45px rgba(0,0,0,0.6)' : '-10px 0 45px rgba(0,0,0,0.6)'}; display: flex; flex-direction: column; transform: ${isAr ? 'translateX(-100%)' : 'translateX(100%)'}; transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1); border-${isAr ? 'right' : 'left'}: 1px solid rgba(255,255,255,0.1); color: #F8FAFC; direction: ${isAr ? 'rtl' : 'ltr'}; font-family: inherit;">
        <!-- Drawer Header -->
        <div style="padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: space-between; background: #1F2133;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 1.3rem;">💬</span>
            <div>
              <h3 style="font-size: 0.95rem; font-weight: 800; margin: 0; color: #F8FAFC;">${isAr ? 'المناقشات والأسئلة الأكاديمية' : 'Academic Discussions'}</h3>
              <p style="font-size: 0.725rem; color: #94A3B8; margin: 2px 0 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px;">${title}</p>
            </div>
          </div>
          <button id="btn-close-discussion" style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); color: #F8FAFC; width: 32px; height: 32px; border-radius: 8px; cursor: pointer; font-size: 1.1rem; display: flex; align-items: center; justify-content: center;" title="${isAr ? 'إغلاق' : 'Close'}">✕</button>
        </div>

        <!-- Form to Post Question -->
        <div style="padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.08); background: rgba(0,0,0,0.2);">
          <form id="form-post-comment" style="display: flex; flex-direction: column; gap: 10px;">
            <textarea id="comment-text-input" rows="2" placeholder="${isAr ? 'اطرح سؤالاً أو استفساراً علمياً حول هذه المحاضرة...' : 'Ask an academic question or note about this lecture...'}" style="width: 100%; background: #232536; border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: #F8FAFC; padding: 10px 12px; font-size: 0.825rem; resize: none; font-family: inherit; outline: none; box-sizing: border-box;" required></textarea>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 0.725rem; color: #34D399; font-weight: 600;">+5 ${isAr ? 'نقاط للمشاركة 🌟' : 'Academic points 🌟'}</span>
              <button type="submit" style="background: #0284C7; color: #FFF; border: none; padding: 7px 16px; border-radius: 8px; font-size: 0.8rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                <span>${isAr ? 'نشر السؤال' : 'Post Question'}</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Comments List Container -->
        <div id="comments-list-container" style="flex: 1; overflow-y: auto; padding: 16px 18px; display: flex; flex-direction: column; gap: 12px;">
        </div>
      </div>

      <!-- Backdrop for drawer -->
      <div id="discussion-backdrop" style="position: fixed; inset: 0; background: rgba(0,0,0,0.55); backdrop-filter: blur(2px); z-index: 100001; display: none; opacity: 0; pointer-events: none !important; transition: opacity 0.25s ease;"></div>
    `;

    const studioContainer = document.getElementById('sheet-studio-container');
    let activeCurrentPage = 1;
    let activeTotalPages = pages || 1;

    function getPdfViewerApp() {
      const iframe = document.getElementById('sheet-pdf-iframe');
      try {
        return iframe?.contentWindow?.PDFViewerApplication || null;
      } catch (e) {
        return null;
      }
    }

    function updateCopyPageBadges(pageNum, total) {
      if (typeof pageNum === 'number' && pageNum > 0) activeCurrentPage = pageNum;
      if (typeof total === 'number' && total > 0) activeTotalPages = total;

      const pBadge = document.getElementById('copy-page-num-badge');
      const mBadge = document.getElementById('mobile-copy-page-badge');
      const tBadge = document.getElementById('copy-total-pages-badge');
      const mtBadge = document.getElementById('mobile-total-pages-badge');

      if (pBadge) pBadge.textContent = activeCurrentPage;
      if (mBadge) mBadge.textContent = activeCurrentPage;
      if (tBadge) tBadge.textContent = activeTotalPages + (isAr ? ' ص' : ' p');
      if (mtBadge) mtBadge.textContent = activeTotalPages + (isAr ? ' ص' : ' p');
    }

    // Handle messages from viewer iframe bridge
    const onPdfMessage = (e) => {
      if (!e.data) return;
      if (e.data.type === 'KURO_PAGE_CHANGE') {
        updateCopyPageBadges(e.data.pageNumber, e.data.pagesCount);
      } else if (e.data.type === 'KURO_TRIGGER_COPY_PAGE') {
        handleCopyCurrentPage();
      }
    };
    window.addEventListener('message', onPdfMessage);

    // Copy Current Page Handler
    async function handleCopyCurrentPage() {
      const app = getPdfViewerApp();
      if (!app || !app.pdfDocument) {
        if (typeof window.showToast === 'function') {
          window.showToast(isAr ? 'جاري تحميل ملف الشيت، يُرجى الانتظار ثوانٍ معدودة... ⏳' : 'Loading PDF, please wait a moment... ⏳', { type: 'warning' });
        }
        return;
      }

      const pageNum = app.page || activeCurrentPage || 1;
      let pageProxy = null;
      try {
        pageProxy = await app.pdfDocument.getPage(pageNum);
      } catch (err) {
        console.error('Failed to get page proxy:', err);
      }

      if (!pageProxy || !window.SheetCopyEngine) {
        if (typeof window.showToast === 'function') {
          window.showToast(isAr ? 'تعذر استخراج الصفحة المحددة.' : 'Failed to extract page text.', { type: 'error' });
        }
        return;
      }

      const btnDesk = document.getElementById('btn-copy-current-page');
      const btnMob = document.getElementById('btn-mobile-copy-page');

      try {
        const formattedText = await window.SheetCopyEngine.extractPageText(pageProxy, {
          pageNum: pageNum,
          totalPages: app.pagesCount || activeTotalPages,
          sheetTitle: title,
          isAr: isAr
        });

        if (!formattedText || !formattedText.trim()) {
          if (typeof window.showToast === 'function') {
            window.showToast(isAr ? `صفحة ${pageNum} لا تحتوي على نصوص قابلة للاستخراج (رسومات أو شيت ممسوح ضوئياً) 📄` : `Page ${pageNum} has no extractable text 📄`, { type: 'info' });
          }
          return;
        }

        const copied = await window.SheetCopyEngine.copyToClipboard(formattedText);
        if (copied) {
          [btnDesk, btnMob].forEach(btn => {
            if (!btn) return;
            btn.classList.add('copied');
            const icon = btn.querySelector('.copy-icon') || btn.querySelector('span:first-child');
            const oldIcon = icon ? icon.textContent : '📄';
            if (icon) icon.textContent = '✓';
            setTimeout(() => {
              btn.classList.remove('copied');
              if (icon) icon.textContent = oldIcon;
            }, 1800);
          });

          if (typeof window.showToast === 'function') {
            window.showToast(
              isAr ? `تم نسخ نصوص صفحة (${pageNum}) مرتبة ومنسقة بالحافظة بنجاح! 📋` : `Page (${pageNum}) text copied formatted to clipboard! 📋`,
              { type: 'success' }
            );
          }
        } else {
          if (typeof window.showToast === 'function') {
            window.showToast(isAr ? 'تعذر النسخ إلى الحافظة تلقائياً.' : 'Failed to copy to clipboard.', { type: 'error' });
          }
        }
      } catch (e) {
        console.error('Extraction error:', e);
        if (typeof window.showToast === 'function') {
          window.showToast(isAr ? 'حدث خطأ أثناء معالجة نصوص الصفحة.' : 'Error extracting page text.', { type: 'error' });
        }
      }
    }

    // Copy Entire Sheet Handler
    async function handleCopyFullSheet() {
      const app = getPdfViewerApp();
      if (!app || !app.pdfDocument) {
        if (typeof window.showToast === 'function') {
          window.showToast(isAr ? 'جاري تحميل ملف الشيت، يُرجى الانتظار ثوانٍ معدودة... ⏳' : 'Loading PDF, please wait a moment... ⏳', { type: 'warning' });
        }
        return;
      }

      const btnDesk = document.getElementById('btn-copy-full-sheet');
      const origDeskContent = btnDesk ? btnDesk.innerHTML : '';
      const totalP = app.pagesCount || activeTotalPages || 1;

      if (btnDesk) {
        btnDesk.disabled = true;
        btnDesk.style.opacity = '0.85';
      }

      try {
        const fullDocumentText = await window.SheetCopyEngine.extractDocumentText(app.pdfDocument, {
          sheetTitle: title,
          onProgress: (current, total) => {
            const pct = Math.round((current / total) * 100);
            if (btnDesk) {
              btnDesk.innerHTML = `<span>⏳</span><span>${isAr ? `جاري الترتيب... %${pct}` : `Extracting... ${pct}%`}</span>`;
            }
          }
        });

        const copied = await window.SheetCopyEngine.copyToClipboard(fullDocumentText);
        if (copied) {
          if (btnDesk) {
            btnDesk.classList.add('copied');
            btnDesk.innerHTML = `<span>✓</span><span>${isAr ? 'تم نسخ كامل الشيت!' : 'Full Sheet Copied!'}</span>`;
            setTimeout(() => {
              btnDesk.classList.remove('copied');
              btnDesk.innerHTML = origDeskContent;
              btnDesk.disabled = false;
              btnDesk.style.opacity = '1';
            }, 2200);
          }

          if (typeof window.showToast === 'function') {
            window.showToast(
              isAr ? `تم نسخ كامل الشيت (${totalP} صفحة) مرتباً ومنسقاً في الحافظة بنجاح 🌟` : `Full sheet (${totalP} pages) copied formatted successfully 🌟`,
              { type: 'success' }
            );
          }
        } else {
          if (btnDesk) {
            btnDesk.innerHTML = origDeskContent;
            btnDesk.disabled = false;
            btnDesk.style.opacity = '1';
          }
          if (typeof window.showToast === 'function') {
            window.showToast(isAr ? 'تعذر النسخ إلى الحافظة تلقائياً.' : 'Failed to copy to clipboard.', { type: 'error' });
          }
        }
      } catch (err) {
        console.error('Copy full sheet error:', err);
        if (btnDesk) {
          btnDesk.innerHTML = origDeskContent;
          btnDesk.disabled = false;
          btnDesk.style.opacity = '1';
        }
        if (typeof window.showToast === 'function') {
          window.showToast(isAr ? 'حدث خطأ أثناء نسخ كامل الشيت.' : 'Error copying full sheet.', { type: 'error' });
        }
      }
    }

    // Attach copy button listeners
    const btnDeskPage = document.getElementById('btn-copy-current-page');
    const btnMobPage = document.getElementById('btn-mobile-copy-page');
    if (btnDeskPage) btnDeskPage.addEventListener('click', handleCopyCurrentPage);
    if (btnMobPage) {
      btnMobPage.addEventListener('click', () => {
        const menu = document.getElementById('sheet-copy-dropdown-menu');
        if (menu) menu.style.display = 'none';
        handleCopyCurrentPage();
      });
    }

    const btnDeskFull = document.getElementById('btn-copy-full-sheet');
    const btnMobFull = document.getElementById('btn-mobile-copy-full');
    if (btnDeskFull) btnDeskFull.addEventListener('click', handleCopyFullSheet);
    if (btnMobFull) {
      btnMobFull.addEventListener('click', () => {
        const menu = document.getElementById('sheet-copy-dropdown-menu');
        if (menu) menu.style.display = 'none';
        handleCopyFullSheet();
      });
    }

    const dropdownTrigger = document.getElementById('btn-copy-dropdown-trigger');
    const dropdownMenu = document.getElementById('sheet-copy-dropdown-menu');
    if (dropdownTrigger && dropdownMenu) {
      dropdownTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdownMenu.style.display === 'flex';
        dropdownMenu.style.display = isOpen ? 'none' : 'flex';
      });
      document.addEventListener('click', (e) => {
        if (!e.target.closest('#sheet-copy-group')) {
          dropdownMenu.style.display = 'none';
        }
      });
    }

    if (studioContainer) {
      async function mountPdfViewer() {
        let pdfUrl = sheet.pdf_url;
        if (!pdfUrl && window.DATA && window.DATA.pdfStore) {
          pdfUrl = await window.DATA.pdfStore.getPdfUrl(sheet.id);
        }
        if (!pdfUrl) {
          pdfUrl = 'pdfjs/web/compressed.tracemonkey-pldi-09.pdf';
        }
        let finalFileParam = pdfUrl;
        if (pdfUrl && !pdfUrl.startsWith('http://') && !pdfUrl.startsWith('https://') && !pdfUrl.startsWith('/') && !pdfUrl.startsWith('../')) {
          finalFileParam = '../../' + pdfUrl;
        }
        const iframe = document.createElement('iframe');
        iframe.id = 'sheet-pdf-iframe';
        iframe.src = `pdfjs/web/viewer.html?v=2.3.0&file=${encodeURIComponent(finalFileParam)}`;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.setAttribute('allow', 'fullscreen');

        iframe.addEventListener('load', () => {
          try {
            const app = getPdfViewerApp();
            if (app && app.eventBus) {
              app.eventBus.on('pagechanging', (evt) => {
                updateCopyPageBadges(evt.pageNumber, app.pagesCount);
              });
              app.eventBus.on('pagesloaded', () => {
                updateCopyPageBadges(app.page, app.pagesCount);
              });
            }
          } catch (e) {}
        });

        studioContainer.innerHTML = '';
        studioContainer.appendChild(iframe);
      }
      mountPdfViewer();
    }

    const btnEditStudio = document.getElementById('btn-edit-sheet-studio');
    if (btnEditStudio) {
      btnEditStudio.addEventListener('click', () => {
        if (typeof window.showEditSheetModal === 'function') {
          window.showEditSheetModal(sheet.id, async (updatedSheet, updates) => {
            if (updatedSheet) sheet = updatedSheet;
            // Update title text in header
            const titleDisplay = document.querySelector('#sheet-studio-header div span:last-child');
            if (titleDisplay && updates.title) {
              titleDisplay.textContent = updates.title;
            }
            // If PDF file or URL changed, remount viewer
            if (updates.pdf_source || updates.pdf_url) {
              mountPdfViewer();
            }
          });
        }
      });
    }

    const btnBackStudio = document.getElementById('btn-back-from-studio');
    if (btnBackStudio) {
      btnBackStudio.addEventListener('click', () => {
        if (sheet && sheet.subject_id) {
          window.location.hash = '#/subject/' + sheet.subject_id;
        } else if (window.history.length > 1) {
          window.history.back();
        } else {
          window.location.hash = '#/home';
        }
      });
    }

    // Discussion Board Logic & Persistence
    const drawerEl = document.getElementById('sheet-discussion-drawer');
    const backdropEl = document.getElementById('discussion-backdrop');
    const btnToggle = document.getElementById('btn-toggle-discussion');
    const btnClose = document.getElementById('btn-close-discussion');
    const formPost = document.getElementById('form-post-comment');

    function openDrawer() {
      if (!drawerEl || !backdropEl) return;
      drawerEl.classList.add('open');
      drawerEl.style.transform = 'translateX(0)';
      backdropEl.style.display = 'block';
      backdropEl.style.pointerEvents = 'auto';
      setTimeout(() => { backdropEl.style.opacity = '1'; }, 10);
    }

    function closeDrawer() {
      if (!drawerEl || !backdropEl) return;
      drawerEl.classList.remove('open');
      drawerEl.style.transform = isAr ? 'translateX(-100%)' : 'translateX(100%)';
      backdropEl.style.opacity = '0';
      backdropEl.style.pointerEvents = 'none';
      setTimeout(() => {
        if (!drawerEl.classList.contains('open')) {
          backdropEl.style.display = 'none';
        }
      }, 260);
    }

    if (btnToggle) btnToggle.addEventListener('click', openDrawer);
    if (btnClose) btnClose.addEventListener('click', closeDrawer);
    if (backdropEl) backdropEl.addEventListener('click', closeDrawer);

    function deleteComment(commentId) {
      comments = comments.filter(c => c.id !== commentId);
      localStorage.setItem(commentsKey, JSON.stringify(comments));
      renderCommentsList();
      if (typeof window.showToast === 'function') {
        window.showToast(isAr ? 'تم حذف السؤال من المناقشة بنجاح.' : 'Comment deleted successfully.', { type: 'success' });
      }
    }

    function renderCommentsList() {
      const listEl = document.getElementById('comments-list-container');
      const countBadge = document.getElementById('discussion-count-badge');
      if (countBadge) countBadge.textContent = comments.length;
      const headerBadge = document.getElementById('header-comment-badge');
      if (headerBadge) headerBadge.textContent = comments.length;
      if (!listEl) return;

      if (comments.length === 0) {
        listEl.innerHTML = `
          <div class="empty-comments-notice" style="text-align: center; padding: 40px 16px; color: #94A3B8;">
            <div style="font-size: 2.2rem; margin-bottom: 10px;">💭</div>
            <p style="font-size: 0.9rem; font-weight: 700; color: #E2E8F0; margin-bottom: 4px;">
              ${isAr ? 'لا توجد أسئلة أو مناقشات حالياً' : 'No discussions or questions yet'}
            </p>
            <p style="font-size: 0.775rem; color: #94A3B8; line-height: 1.5;">
              ${isAr ? 'كن أول من يطرح استفساراً واكسب 5 نقاط أكاديمية فوراً!' : 'Be the first to post a question and earn 5 academic points!'}
            </p>
          </div>
        `;
        return;
      }

      listEl.innerHTML = comments.map(c => `
        <div class="comment-card" style="background: #232536; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 12px 14px; display: flex; flex-direction: column; gap: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 700; font-size: 0.8rem; color: #F1F5F9;">${c.author || (isAr ? 'طالب' : 'Student')}</span>
            <div style="display: flex; align-items: center; gap: 8px;">
              <span style="font-size: 0.7rem; color: #94A3B8;">${c.time || (isAr ? 'الآن' : 'Just now')}</span>
              <button class="btn-delete-comment" data-id="${c.id}" style="background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.25); color: #EF4444; border-radius: 6px; padding: 2px 7px; font-size: 0.7rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 3px;" title="${isAr ? 'حذف هذا السؤال نهائياً' : 'Delete this comment'}">
                <span>🗑️</span>
                <span>${isAr ? 'حذف' : 'Delete'}</span>
              </button>
            </div>
          </div>
          <p style="font-size: 0.825rem; color: #CBD5E1; margin: 0; line-height: 1.5; white-space: pre-wrap;">${c.text}</p>
          ${c.reply ? `
            <div style="background: rgba(2, 132, 199, 0.12); border-right: 3px solid #0284C7; padding: 8px 10px; border-radius: 6px 0 0 6px; margin-top: 4px; font-size: 0.775rem; color: #BAE6FD; line-height: 1.4;">
              <div style="font-weight: 700; margin-bottom: 2px; color: #38BDF8;">${isAr ? 'رد وتوضيح معتمد:' : 'Verified Answer:'}</div>
              ${c.reply}
            </div>
          ` : ''}
        </div>
      `).join('');

      listEl.querySelectorAll('.btn-delete-comment').forEach(btn => {
        btn.addEventListener('click', () => {
          const cId = btn.getAttribute('data-id');
          deleteComment(cId);
        });
      });
    }

    if (formPost) {
      formPost.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('comment-text-input');
        const text = input ? input.value.trim() : '';
        if (!text) return;

        const newComment = {
          id: 'c_' + Date.now(),
          author: isAr ? 'طالب طب أسنان (أنت)' : 'Dental Student (You)',
          time: isAr ? 'الآن' : 'Just now',
          text: text,
          reply: null
        };

        comments.unshift(newComment);
        localStorage.setItem(commentsKey, JSON.stringify(comments));

        if (window.STORE && typeof window.STORE.addPoints === 'function') {
          window.STORE.addPoints(5);
        }

        if (typeof window.showToast === 'function') {
          window.showToast(isAr ? 'تم نشر سؤالك بنجاح (+5 نقاط أكاديمية) 🌟' : 'Question posted (+5 pts earned) 🌟', { type: 'success', points: 5 });
        }

        input.value = '';
        renderCommentsList();
      });
    }

    // Listen for TOGGLE_DISCUSSION message from inside JNotes iframe
    window.addEventListener('message', (e) => {
      if (e.data && e.data.type === 'TOGGLE_DISCUSSION') {
        openDrawer();
      }
    });

    // Expose openDiscussion for direct DOM studio calls
    SheetDetailPage.openDiscussion = openDrawer;

    renderCommentsList();
  }
};

window.SheetDetailPage = SheetDetailPage;
