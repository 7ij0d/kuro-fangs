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

    // Also check custom admin sheets
    if (!sheet) {
      try {
        const customSheets = JSON.parse(localStorage.getItem('kf_admin_custom_sheets') || '[]');
        sheet = customSheets.find(s => s.id === targetId);
      } catch (e) {}
    }

    // If still not found, check if any sheet exists
    if (!sheet && sheets.length > 0) {
      sheet = sheets[0];
    }

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
    const isFav = window.STORE ? window.STORE.isFavorite(sheet.id, 'sheet') : false;

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
        <div id="sheet-studio-container" style="width: 100%; height: 100%; display: flex; flex-direction: column; overflow: hidden; position: relative;"></div>
      </div>

      <!-- Floating Discussion Trigger Button -->
      <button id="btn-toggle-discussion" style="position: fixed; bottom: 20px; ${isAr ? 'left: 20px;' : 'right: 20px;'} z-index: 100000; background: linear-gradient(135deg, #0284C7, #0369A1); color: #FFF; border: 1px solid rgba(255,255,255,0.25); border-radius: 50px; padding: 9px 16px; font-weight: 700; font-size: 0.825rem; box-shadow: 0 8px 24px rgba(2,132,199,0.55); cursor: pointer; display: inline-flex; align-items: center; gap: 8px; font-family: inherit;">
        <span style="font-size: 1.1rem;">💬</span>
        <span>${isAr ? 'مناقشة وأسئلة الشيت' : 'Sheet Discussion'}</span>
        <span id="discussion-count-badge" style="background: rgba(255,255,255,0.25); padding: 2px 8px; border-radius: 12px; font-size: 0.725rem; font-weight: 800;">${comments.length}</span>
      </button>

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

    // Direct DOM Rendering: Render Note Studio directly into primary DOM (eliminates sandboxed iframe!)
    const studioContainer = document.getElementById('sheet-studio-container');
    if (studioContainer && window.DocumentViewer) {
      window.DocumentViewer.renderStudio(studioContainer, sheet, isAr);
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
