/**
 * notes.js — Student Notes Page
 * Kuro Fangs Academic Platform
 * Shows all saved personal notes with sheet context.
 */

export default async function notesPage(container, params) {
  const { default: KF_DATA }  = await import('../data.js');
  const { default: KF_STORE } = await import('../store.js');
  const { default: KURONI }   = await import('../kuroni.js');

  if (!KF_DATA.subjects) await KF_DATA.init();

  // ── State ────────────────────────────────────────────────────────────────
  let editingNoteId = null; // currently inline-edited note ID

  // ── Fetch Notes ───────────────────────────────────────────────────────────
  function getAllNotes() {
    return KF_STORE.getAllNotes ? KF_STORE.getAllNotes() : [];
  }

  // ── Helpers ──────────────────────────────────────────────────────────────
  function sheetTitleFor(sheetId) {
    const sheet = KF_DATA.getSheetById ? KF_DATA.getSheetById(sheetId) : null;
    if (!sheet) return `ملزمة #${sheetId}`;
    return sheet.title_ar || sheet.title || `ملزمة #${sheetId}`;
  }

  function sheetSubjectFor(sheetId) {
    const sheet = KF_DATA.getSheetById ? KF_DATA.getSheetById(sheetId) : null;
    if (!sheet || !sheet.subject_id) return null;
    return KF_DATA.getSubjectById ? KF_DATA.getSubjectById(sheet.subject_id) : null;
  }

  function formatDate(isoString) {
    if (!isoString) return '';
    try {
      return new Intl.DateTimeFormat('ar-SA', {
        year: 'numeric', month: 'short', day: 'numeric',
      }).format(new Date(isoString));
    } catch {
      return isoString;
    }
  }

  function noteCardHTML(note, index) {
    const stagger  = `stagger-${Math.min(index + 1, 8)}`;
    const sheetId  = note.sheetId || note.sheet_id || note.id;
    const title    = sheetTitleFor(sheetId);
    const subject  = sheetSubjectFor(sheetId);
    const isEditing = editingNoteId === sheetId;

    return `
      <article
        class="note-card hover-lift animate-card-reveal ${stagger}"
        data-note-sheet-id="${sheetId}"
        aria-label="ملاحظة: ${title}"
      >
        <div class="note-card__header">
          <div class="note-card__sheet-info">
            ${subject
              ? `<span class="subject-chip text-xs">${subject.icon || '📚'} ${subject.name_ar || subject.name}</span>`
              : ''}
            <button
              class="note-card__sheet-title btn-ghost"
              data-sheet-id="${sheetId}"
              aria-label="الانتقال إلى ${title}"
            >${title}</button>
          </div>
          <div class="note-card__actions">
            <button
              class="btn btn-ghost btn-icon edit-note-btn"
              data-note-id="${sheetId}"
              aria-label="تعديل الملاحظة"
              title="تعديل"
            >${isEditing ? '✅' : '✏️'}</button>
            <button
              class="btn btn-ghost btn-icon delete-note-btn"
              data-note-id="${sheetId}"
              aria-label="حذف الملاحظة"
              title="حذف"
            >🗑️</button>
          </div>
        </div>

        ${isEditing
          ? `<div class="note-card__edit-area">
              <textarea
                class="notes-input notes-input--inline"
                id="edit-textarea-${sheetId}"
                dir="rtl"
                rows="4"
                aria-label="تعديل الملاحظة"
              >${note.text || note.content || ''}</textarea>
              <div class="note-card__edit-actions">
                <button class="btn btn-primary btn-sm save-edit-btn" data-note-id="${sheetId}">💾 حفظ</button>
                <button class="btn btn-ghost  btn-sm cancel-edit-btn" data-note-id="${sheetId}">إلغاء</button>
              </div>
            </div>`
          : `<p class="note-card__text">${(note.text || note.content || '').replace(/\n/g, '<br>')}</p>`
        }

        ${note.updatedAt || note.updated_at
          ? `<time class="note-card__date text-muted text-xs" datetime="${note.updatedAt || note.updated_at}">
              🕐 ${formatDate(note.updatedAt || note.updated_at)}
             </time>`
          : ''}
      </article>
    `;
  }

  // ── Full Render ──────────────────────────────────────────────────────────
  function renderPage() {
    const notes = getAllNotes();

    container.innerHTML = `
      <div class="page-wrapper" dir="rtl">

        <header class="page-header">
          <div class="page-header__text">
            <h1 class="page-title">📒 ملاحظاتي الشخصية</h1>
            <p class="page-subtitle text-muted">${notes.length} ملاحظة</p>
          </div>
          ${notes.length > 0 && KURONI.html
            ? `<div class="page-header__mascot" aria-hidden="true">${KURONI.html('happy')}</div>`
            : ''}
        </header>

        ${notes.length === 0
          ? (KURONI.emptyHTML
              ? KURONI.emptyHTML('sleepy', 'لا توجد ملاحظات', 'أضف ملاحظاتك أثناء الدراسة!')
              : `<div class="empty-state text-center">
                  <p class="text-muted">لا توجد ملاحظات</p>
                  <p class="text-muted text-sm">أضف ملاحظاتك أثناء الدراسة!</p>
                 </div>`)
          : `<div class="notes-grid">
              ${notes.map((note, i) => noteCardHTML(note, i)).join('')}
             </div>`
        }
      </div>
    `;

    // ── Event Listeners ────────────────────────────────────────────────────

    // Navigate to sheet
    container.querySelectorAll('.note-card__sheet-title[data-sheet-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.sheetId;
        window.ROUTER ? window.ROUTER.go(`/sheets/${id}`) : (window.location.hash = `#/sheets/${id}`);
      });
    });

    // Edit note button — toggle editing state
    container.querySelectorAll('.edit-note-btn[data-note-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.noteId;
        if (editingNoteId === id) {
          // Save inline
          const ta = container.querySelector(`#edit-textarea-${id}`);
          const text = ta ? ta.value : '';
          if (KF_STORE.setNote) KF_STORE.setNote(id, text);
          editingNoteId = null;
        } else {
          editingNoteId = id;
        }
        renderPage();
      });
    });

    // Save inline edit
    container.querySelectorAll('.save-edit-btn[data-note-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.noteId;
        const ta = container.querySelector(`#edit-textarea-${id}`);
        const text = ta ? ta.value : '';
        if (KF_STORE.setNote) KF_STORE.setNote(id, text);
        editingNoteId = null;
        renderPage();
      });
    });

    // Cancel inline edit
    container.querySelectorAll('.cancel-edit-btn[data-note-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        editingNoteId = null;
        renderPage();
      });
    });

    // Delete note
    container.querySelectorAll('.delete-note-btn[data-note-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.noteId;
        if (KF_STORE.deleteNote) {
          KF_STORE.deleteNote(id);
        } else if (KF_STORE.setNote) {
          KF_STORE.setNote(id, null); // null = delete
        }
        if (editingNoteId === id) editingNoteId = null;
        renderPage();
      });
    });
  }

  renderPage();
}
