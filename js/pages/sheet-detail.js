/**
 * KURO FANGS — SHEET DETAIL PAGE
 * Clean sheet detail view: metadata, download, and discussion board.
 * No studio, no iframe, no canvas.
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

    let sheet = sheets.find(s => s.id === targetId);

    // Also check custom admin sheets
    if (!sheet) {
      try {
        const customSheets = JSON.parse(localStorage.getItem('kf_admin_custom_sheets') || '[]');
        sheet = customSheets.find(s => s.id === targetId);
      } catch (e) {}
    }

    if (!sheet) {
      container.innerHTML = `
        <div style="padding: 60px 24px; text-align: center; color: var(--text-primary, #F8FAFC);">
          <div style="font-size: 3.5rem; margin-bottom: 16px;">📁</div>
          <h2 style="font-size: 1.3rem; font-weight: 800; margin-bottom: 8px;">
            ${isAr ? 'لم يتم العثور على الشيت' : 'Sheet Not Found'}
          </h2>
          <p style="color: var(--text-muted, #94A3B8); font-size: 0.875rem; margin-bottom: 24px;">
            ${isAr ? 'قد يكون تم حذف الشيت أو أن الرابط غير صحيح.' : 'This sheet may have been removed or the link is invalid.'}
          </p>
          <a href="#/sheets" class="btn btn-primary" style="display: inline-flex; gap: 6px; align-items: center;">
            <span>←</span>
            <span>${isAr ? 'العودة لقائمة الشيتات' : 'Back to Sheets'}</span>
          </a>
        </div>
      `;
      return;
    }

    // Normalize metadata
    const title    = isAr ? (sheet.title_ar || sheet.title) : (sheet.title_en || sheet.title_ar || sheet.title);
    const subject  = sheet.subject_name || (isAr ? 'المادة الدراسية' : 'Academic Subject');
    const doctor   = sheet.doctor_name  || '';
    const pages    = sheet.pages  || '—';
    const size     = sheet.size   || '—';
    const date     = sheet.date   || '';
    const fileType = sheet.type   || 'PDF';
    const pdfUrl   = sheet.pdf_url || '';
    const isFav    = window.STORE ? window.STORE.isFavorite(sheet.id, 'sheet') : false;

    // Format date nicely
    let displayDate = date;
    if (date) {
      try {
        displayDate = new Date(date).toLocaleDateString(isAr ? 'ar-LY' : 'en-GB', {
          year: 'numeric', month: 'long', day: 'numeric'
        });
      } catch (_) {}
    }

    // Load saved comments
    const commentsKey = 'kf_sheet_comments_' + sheet.id;
    let comments = [];
    const rawComments = localStorage.getItem(commentsKey);
    if (rawComments === null) {
      comments = [];
      localStorage.setItem(commentsKey, JSON.stringify(comments));
    } else {
      try {
        comments = JSON.parse(rawComments);
        if (!Array.isArray(comments)) comments = [];
      } catch (e) {
        comments = [];
      }
    }

    // ─── Main HTML ────────────────────────────────────────────────────────────
    container.innerHTML = `
      <style>
        .sd-page {
          min-height: 100vh;
          background: var(--bg-primary, #0F1117);
          color: var(--text-primary, #F8FAFC);
          font-family: inherit;
          direction: ${isAr ? 'rtl' : 'ltr'};
        }
        /* Header bar */
        .sd-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(15,17,23,0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          padding: 0 20px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .sd-back-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          color: #CBD5E1;
          border-radius: 8px;
          padding: 6px 14px;
          font-size: 0.825rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.18s;
        }
        .sd-back-btn:hover { background: rgba(255,255,255,0.13); color: #F8FAFC; }
        .sd-fav-btn {
          background: none;
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 8px;
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          font-size: 1.15rem;
          cursor: pointer;
          transition: background 0.18s;
          color: #94A3B8;
        }
        .sd-fav-btn:hover { background: rgba(255,255,255,0.1); }
        .sd-fav-btn.active { color: #F59E0B; border-color: #F59E0B44; }

        /* Hero card */
        .sd-hero {
          padding: 32px 20px 24px;
          max-width: 720px;
          margin: 0 auto;
        }
        .sd-subject-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(139,92,246,0.15);
          border: 1px solid rgba(139,92,246,0.3);
          color: #A78BFA;
          border-radius: 20px;
          padding: 4px 12px;
          font-size: 0.75rem;
          font-weight: 700;
          margin-bottom: 14px;
        }
        .sd-title {
          font-size: clamp(1.25rem, 4vw, 1.75rem);
          font-weight: 900;
          line-height: 1.3;
          color: #F8FAFC;
          margin: 0 0 10px;
        }
        .sd-doctor {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.875rem;
          color: #94A3B8;
          margin-bottom: 24px;
        }
        .sd-doctor strong { color: #CBD5E1; font-weight: 700; }

        /* Meta chips row */
        .sd-meta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 28px;
        }
        .sd-meta-chip {
          display: flex;
          align-items: center;
          gap: 7px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 8px 14px;
          font-size: 0.8rem;
          color: #CBD5E1;
        }
        .sd-meta-chip .chip-icon { font-size: 1rem; }
        .sd-meta-chip .chip-label { color: #64748B; font-size: 0.7rem; display: block; }
        .sd-meta-chip .chip-value { font-weight: 700; color: #E2E8F0; }

        /* Action buttons */
        .sd-actions {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 32px;
        }
        .sd-btn-download {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: linear-gradient(135deg, #7C3AED, #5B21B6);
          color: #FFF;
          border: none;
          border-radius: 14px;
          padding: 16px 24px;
          font-size: 1rem;
          font-weight: 800;
          cursor: pointer;
          text-decoration: none;
          transition: opacity 0.18s, transform 0.18s;
          box-shadow: 0 8px 24px rgba(124,58,237,0.4);
          width: 100%;
        }
        .sd-btn-download:hover { opacity: 0.9; transform: translateY(-1px); }
        .sd-btn-download:active { transform: scale(0.98); }
        .sd-btn-download:disabled,
        .sd-btn-download.disabled {
          background: rgba(255,255,255,0.08);
          color: #64748B;
          box-shadow: none;
          cursor: not-allowed;
          transform: none;
        }
        .sd-btn-share {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          color: #CBD5E1;
          border-radius: 14px;
          padding: 13px 24px;
          font-size: 0.875rem;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.18s;
          width: 100%;
        }
        .sd-btn-share:hover { background: rgba(255,255,255,0.1); color: #F8FAFC; }

        /* Divider */
        .sd-divider {
          border: none;
          border-top: 1px solid rgba(255,255,255,0.08);
          margin: 0 20px 28px;
        }

        /* Discussion section */
        .sd-discussion {
          max-width: 720px;
          margin: 0 auto;
          padding: 0 20px 40px;
        }
        .sd-discussion-title {
          font-size: 1rem;
          font-weight: 800;
          color: #E2E8F0;
          margin: 0 0 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .sd-comment-form {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          padding: 16px;
          margin-bottom: 20px;
        }
        .sd-comment-textarea {
          width: 100%;
          background: rgba(0,0,0,0.25);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 10px;
          color: #F8FAFC;
          padding: 10px 14px;
          font-size: 0.85rem;
          font-family: inherit;
          resize: none;
          outline: none;
          box-sizing: border-box;
          margin-bottom: 10px;
          transition: border-color 0.18s;
        }
        .sd-comment-textarea:focus { border-color: rgba(124,58,237,0.5); }
        .sd-comment-form-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
        }
        .sd-points-hint {
          font-size: 0.75rem;
          color: #34D399;
          font-weight: 600;
        }
        .sd-btn-post {
          background: #7C3AED;
          color: #FFF;
          border: none;
          padding: 8px 18px;
          border-radius: 9px;
          font-size: 0.8rem;
          font-weight: 800;
          cursor: pointer;
          font-family: inherit;
          transition: opacity 0.18s;
        }
        .sd-btn-post:hover { opacity: 0.85; }
        .sd-comment-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 14px 16px;
          margin-bottom: 12px;
        }
        .sd-comment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .sd-comment-author { font-weight: 700; font-size: 0.8rem; color: #F1F5F9; }
        .sd-comment-time { font-size: 0.7rem; color: #94A3B8; }
        .sd-comment-text {
          font-size: 0.84rem;
          color: #CBD5E1;
          line-height: 1.55;
          white-space: pre-wrap;
          margin: 0 0 6px;
        }
        .sd-comment-reply {
          background: rgba(2,132,199,0.1);
          border-${isAr ? 'right' : 'left'}: 3px solid #0284C7;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 0.78rem;
          color: #BAE6FD;
          line-height: 1.45;
          margin-top: 8px;
        }
        .sd-comment-reply-label {
          font-weight: 700;
          color: #38BDF8;
          margin-bottom: 2px;
          font-size: 0.72rem;
        }
        .sd-btn-delete {
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.25);
          color: #EF4444;
          border-radius: 6px;
          padding: 2px 8px;
          font-size: 0.7rem;
          font-weight: 700;
          cursor: pointer;
          font-family: inherit;
          display: inline-flex;
          align-items: center;
          gap: 3px;
        }
        .sd-empty-comments {
          text-align: center;
          padding: 32px 16px;
          color: #64748B;
        }
        .sd-empty-comments .ec-icon { font-size: 2rem; margin-bottom: 8px; }
        .sd-empty-comments p { margin: 0; font-size: 0.85rem; line-height: 1.5; }

        @media (min-width: 600px) {
          .sd-actions { flex-direction: row; }
          .sd-btn-download, .sd-btn-share { width: auto; flex: 1; }
        }
      </style>

      <div class="sd-page" id="sheet-detail-page">
        <!-- ── Header ── -->
        <div class="sd-header">
          <a href="#/sheets" class="sd-back-btn">
            <span>${isAr ? '→' : '←'}</span>
            <span>${isAr ? 'الشيتات' : 'Sheets'}</span>
          </a>
          <span style="font-size:0.8rem;font-weight:700;color:#94A3B8;flex:1;text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding:0 8px;">${title}</span>
          <button class="sd-fav-btn ${isFav ? 'active' : ''}" id="sd-fav-btn" title="${isAr ? 'إضافة للمفضلة' : 'Add to favorites'}">
            ${isFav ? '⭐' : '☆'}
          </button>
        </div>

        <!-- ── Hero ── -->
        <div class="sd-hero">
          <div class="sd-subject-badge">
            <span>📚</span>
            <span>${subject}</span>
          </div>

          <h1 class="sd-title">${title}</h1>

          ${doctor ? `
          <div class="sd-doctor">
            <span>👨‍⚕️</span>
            <span>${isAr ? 'د.' : 'Dr.'} <strong>${doctor}</strong></span>
          </div>` : ''}

          <!-- Meta chips -->
          <div class="sd-meta-row">
            ${pages !== '—' ? `
            <div class="sd-meta-chip">
              <span class="chip-icon">📄</span>
              <div>
                <span class="chip-label">${isAr ? 'الصفحات' : 'Pages'}</span>
                <span class="chip-value">${pages}</span>
              </div>
            </div>` : ''}
            ${size !== '—' ? `
            <div class="sd-meta-chip">
              <span class="chip-icon">💾</span>
              <div>
                <span class="chip-label">${isAr ? 'الحجم' : 'Size'}</span>
                <span class="chip-value">${size}</span>
              </div>
            </div>` : ''}
            ${displayDate ? `
            <div class="sd-meta-chip">
              <span class="chip-icon">📅</span>
              <div>
                <span class="chip-label">${isAr ? 'التاريخ' : 'Date'}</span>
                <span class="chip-value">${displayDate}</span>
              </div>
            </div>` : ''}
            <div class="sd-meta-chip">
              <span class="chip-icon">🗂️</span>
              <div>
                <span class="chip-label">${isAr ? 'النوع' : 'Type'}</span>
                <span class="chip-value">${fileType}</span>
              </div>
            </div>
          </div>

          <!-- Action buttons -->
          <div class="sd-actions">
            ${pdfUrl
              ? `<a href="${pdfUrl}" download target="_blank" rel="noopener" class="sd-btn-download" id="sd-download-btn">
                   <span style="font-size:1.2rem">⬇️</span>
                   <span>${isAr ? 'تحميل الشيت PDF' : 'Download PDF'}</span>
                 </a>`
              : `<button class="sd-btn-download disabled" disabled>
                   <span style="font-size:1.2rem">⬇️</span>
                   <span>${isAr ? 'الشيت غير متاح للتحميل حالياً' : 'PDF not available yet'}</span>
                 </button>`
            }
            <button class="sd-btn-share" id="sd-share-btn">
              <span>🔗</span>
              <span>${isAr ? 'مشاركة الرابط' : 'Share Link'}</span>
            </button>
          </div>
        </div>

        <hr class="sd-divider">

        <!-- ── Discussion ── -->
        <div class="sd-discussion">
          <h2 class="sd-discussion-title">
            <span>💬</span>
            <span>${isAr ? 'المناقشات والأسئلة' : 'Discussions & Questions'}</span>
            <span id="sd-comment-count" style="background:rgba(124,58,237,0.2);color:#A78BFA;border-radius:12px;padding:2px 9px;font-size:0.72rem;">${comments.length}</span>
          </h2>

          <!-- Post form -->
          <div class="sd-comment-form">
            <form id="sd-comment-form">
              <textarea
                id="sd-comment-input"
                class="sd-comment-textarea"
                rows="3"
                placeholder="${isAr ? 'اطرح سؤالاً أو استفساراً حول هذا الشيت...' : 'Ask a question or share a note about this sheet...'}"
                required
              ></textarea>
              <div class="sd-comment-form-row">
                <span class="sd-points-hint">+5 ${isAr ? 'نقاط للمشاركة 🌟' : 'points for contributing 🌟'}</span>
                <button type="submit" class="sd-btn-post">
                  ${isAr ? 'نشر السؤال' : 'Post Question'}
                </button>
              </div>
            </form>
          </div>

          <!-- Comments list -->
          <div id="sd-comments-list"></div>
        </div>
      </div>
    `;

    // ─── Favourite button ─────────────────────────────────────────────────────
    const favBtn = document.getElementById('sd-fav-btn');
    if (favBtn) {
      favBtn.addEventListener('click', () => {
        if (!window.STORE) return;
        const nowFav = window.STORE.isFavorite(sheet.id, 'sheet');
        if (nowFav) {
          window.STORE.removeFavorite(sheet.id, 'sheet');
          favBtn.textContent = '☆';
          favBtn.classList.remove('active');
        } else {
          window.STORE.addFavorite(sheet.id, 'sheet');
          favBtn.textContent = '⭐';
          favBtn.classList.add('active');
        }
      });
    }

    // ─── Share button ─────────────────────────────────────────────────────────
    const shareBtn = document.getElementById('sd-share-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', async () => {
        const url = window.location.href;
        try {
          if (navigator.share) {
            await navigator.share({ title, url });
          } else {
            await navigator.clipboard.writeText(url);
            if (typeof window.showToast === 'function') {
              window.showToast(isAr ? 'تم نسخ الرابط! 🔗' : 'Link copied! 🔗', { type: 'success' });
            }
          }
        } catch (_) {}
      });
    }

    // ─── Discussion board ─────────────────────────────────────────────────────
    function renderComments() {
      const list = document.getElementById('sd-comments-list');
      const badge = document.getElementById('sd-comment-count');
      if (badge) badge.textContent = comments.length;
      if (!list) return;

      if (comments.length === 0) {
        list.innerHTML = `
          <div class="sd-empty-comments">
            <div class="ec-icon">💭</div>
            <p style="font-weight:700;color:#CBD5E1;margin-bottom:4px;">
              ${isAr ? 'لا توجد أسئلة حتى الآن' : 'No questions yet'}
            </p>
            <p style="color:#64748B;">
              ${isAr ? 'كن أول من يشارك!' : 'Be the first to contribute!'}
            </p>
          </div>
        `;
        return;
      }

      list.innerHTML = comments.map(c => `
        <div class="sd-comment-card">
          <div class="sd-comment-header">
            <span class="sd-comment-author">${c.author || (isAr ? 'طالب' : 'Student')}</span>
            <div style="display:flex;align-items:center;gap:8px;">
              <span class="sd-comment-time">${c.time || (isAr ? 'الآن' : 'Just now')}</span>
              <button class="sd-btn-delete" data-id="${c.id}">
                🗑️ ${isAr ? 'حذف' : 'Delete'}
              </button>
            </div>
          </div>
          <p class="sd-comment-text">${c.text}</p>
          ${c.reply ? `
            <div class="sd-comment-reply">
              <div class="sd-comment-reply-label">${isAr ? 'رد معتمد:' : 'Verified Answer:'}</div>
              ${c.reply}
            </div>
          ` : ''}
        </div>
      `).join('');

      list.querySelectorAll('.sd-btn-delete').forEach(btn => {
        btn.addEventListener('click', () => {
          const cid = btn.getAttribute('data-id');
          comments = comments.filter(c => c.id !== cid);
          localStorage.setItem(commentsKey, JSON.stringify(comments));
          renderComments();
          if (typeof window.showToast === 'function') {
            window.showToast(isAr ? 'تم حذف السؤال.' : 'Comment deleted.', { type: 'success' });
          }
        });
      });
    }

    const commentForm = document.getElementById('sd-comment-form');
    if (commentForm) {
      commentForm.addEventListener('submit', e => {
        e.preventDefault();
        const input = document.getElementById('sd-comment-input');
        const text = input ? input.value.trim() : '';
        if (!text) return;

        comments.unshift({
          id: 'c_' + Date.now(),
          author: isAr ? 'طالب طب أسنان (أنت)' : 'Dental Student (You)',
          time: isAr ? 'الآن' : 'Just now',
          text,
          reply: null
        });
        localStorage.setItem(commentsKey, JSON.stringify(comments));

        if (window.STORE && typeof window.STORE.addPoints === 'function') {
          window.STORE.addPoints(5);
        }
        if (typeof window.showToast === 'function') {
          window.showToast(
            isAr ? 'تم نشر سؤالك! (+5 نقاط) 🌟' : 'Question posted! (+5 pts) 🌟',
            { type: 'success' }
          );
        }

        input.value = '';
        renderComments();
      });
    }

    renderComments();
  }
};

window.SheetDetailPage = SheetDetailPage;
