/**
 * KURO FANGS — STUDENT NOTES PAGE
 * Direct Destination with Pre-filtering Support, Auto-Subject Selection & Bilingual Display
 */

const NotesPage = {
  render(container, queryParams) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
    const subjects = window.DATA ? window.DATA.getSubjects() : [];
    const notes = window.STORE ? window.STORE.getNotes() : [];
    const targetSubject = queryParams?.get('subject') || 'all';
    let currentFilter = targetSubject;

    const filteredNotes = currentFilter === 'all'
      ? notes
      : notes.filter(n => n.subjectId === currentFilter);

    container.innerHTML = `
      <div class="page-title-bar">
        <div class="page-title-group">
          <h1>
            <i data-lucide="edit-3" style="color: var(--brand-primary); width: 26px; height: 26px;"></i>
            ${isAr ? 'ملاحظاتي الدراسية والسريرية' : 'Clinical & Academic Notes'}
          </h1>
          <p>${isAr ? 'دون ملاحظاتك الخاصة وتفاصيل الحالات السريرية وتنبيهات الدكاترة' : 'Record faculty pearls, clinical case notes, and high-yield study remarks'}</p>
        </div>
        <button id="btn-add-note" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 8px;">
          <i data-lucide="plus" style="width: 16px; height: 16px;"></i>
          ${isAr ? 'إضافة ملاحظة جديدة' : 'Add New Note'}
        </button>
      </div>

      <!-- New Note Form (Auto-opened if targetSubject specified) -->
      <div id="new-note-box" class="card" style="display: ${targetSubject !== 'all' ? 'block' : 'none'}; padding: 22px; margin-bottom: 24px; border-left: 4px solid var(--brand-primary);">
        <h3 style="font-size: 1.05rem; margin-bottom: 14px; display: flex; align-items: center; gap: 8px;">
          <i data-lucide="pen-tool" style="width: 18px; height: 18px; color: var(--brand-burgundy);"></i>
          ${isAr ? 'ملاحظة دراسية جديدة' : 'Create New Study Note'}
        </h3>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <input type="text" id="note-title-input" placeholder="${isAr ? 'عنوان الملاحظة (مثلاً: نصائح د. خالد في علاج العصب)...' : 'Note title (e.g., Clinical pearls in Endodontics)...'}" style="padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); background: var(--bg-surface); color: var(--text-primary);" />
          <select id="note-subject-select" style="padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); background: var(--bg-surface); color: var(--text-primary);">
            ${subjects.map(s => `
              <option value="${s.id}" ${targetSubject === s.id ? 'selected' : ''}>
                ${isAr ? s.name_ar : s.name_en}
              </option>
            `).join('')}
          </select>
          <textarea id="note-content-input" rows="4" placeholder="${isAr ? 'اكتب الملاحظات والتفاصيل السريرية هنا...' : 'Write clinical observations, exam hints, or procedure steps here...'}" style="padding: 10px; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); background: var(--bg-surface); color: var(--text-primary);"></textarea>
          <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button id="btn-cancel-note" class="btn btn-secondary">${isAr ? 'إلغاء' : 'Cancel'}</button>
            <button id="btn-save-note" class="btn btn-primary" style="display: inline-flex; align-items: center; gap: 6px;">
              <i data-lucide="save" style="width: 15px; height: 15px;"></i>
              ${isAr ? 'حفظ الملاحظة (+5 نقاط)' : 'Save Note (+5 pts)'}
            </button>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px; margin-bottom: 16px; scrollbar-width: thin;">
        <button class="btn ${currentFilter === 'all' ? 'btn-primary' : 'btn-secondary'} note-filter-btn" data-subject="all" style="font-size: 0.8rem; padding: 6px 14px; white-space: nowrap;">
          ${isAr ? 'جميع الملاحظات' : 'All Notes'}
        </button>
        ${subjects.map(s => `
          <button class="btn ${currentFilter === s.id ? 'btn-primary' : 'btn-secondary'} note-filter-btn" data-subject="${s.id}" style="font-size: 0.8rem; padding: 6px 14px; white-space: nowrap;">
            ${isAr ? s.name_ar : s.name_en}
          </button>
        `).join('')}
      </div>

      <!-- Notes Grid -->
      <div id="notes-grid-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 18px;">
        ${filteredNotes.length === 0 ? `
          <div class="card" style="grid-column: 1 / -1; padding: 40px; text-align: center; color: var(--text-muted);">
            <i data-lucide="edit-3" style="width: 36px; height: 36px; margin-bottom: 10px; opacity: 0.5;"></i>
            <p>${isAr ? 'لا توجد ملاحظات مدونة لهذا الفلتر حالياً.' : 'No notes found for this category. Click "Add New Note" to write one.'}</p>
          </div>
        ` : filteredNotes.map(n => {
          const sObj = subjects.find(s => s.id === n.subjectId);
          const subjName = sObj ? (isAr ? sObj.name_ar : sObj.name_en) : (isAr ? 'طب الأسنان' : 'Dentistry');
          return `
            <div class="card" style="padding: 20px; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                  <span class="badge badge-primary">${subjName}</span>
                  <button class="btn-delete-note" data-id="${n.id}" style="background: none; border: none; color: var(--text-muted); cursor: pointer; padding: 4px;" title="${isAr ? 'حذف' : 'Delete'}">
                    <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
                  </button>
                </div>
                <h3 style="font-size: 1rem; color: var(--text-primary); margin-bottom: 8px;">${n.title}</h3>
                <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; white-space: pre-line;">${n.content}</p>
              </div>
              <div style="margin-top: 16px; pt-12; border-top: 1px solid var(--border-subtle); font-size: 0.75rem; color: var(--text-muted); display: flex; justify-content: space-between;">
                <span>${n.date || '2026-09-11'}</span>
                <span style="color: var(--brand-primary); font-weight: 500;">✓ ${isAr ? 'محفوظة' : 'Saved'}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();

    // Listeners
    const addBtn = document.getElementById('btn-add-note');
    const noteBox = document.getElementById('new-note-box');
    const cancelBtn = document.getElementById('btn-cancel-note');
    const saveBtn = document.getElementById('btn-save-note');

    if (addBtn && noteBox) {
      addBtn.addEventListener('click', () => {
        noteBox.style.display = 'block';
        document.getElementById('note-title-input')?.focus();
      });
    }

    if (cancelBtn && noteBox) {
      cancelBtn.addEventListener('click', () => {
        noteBox.style.display = 'none';
      });
    }

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        const title = document.getElementById('note-title-input')?.value.trim();
        const content = document.getElementById('note-content-input')?.value.trim();
        const subjectId = document.getElementById('note-subject-select')?.value;

        if (!title || !content) {
          window.showToast(isAr ? 'يرجى كتابة عنوان ونص الملاحظة.' : 'Please enter title and content for the note.', { type: 'warning' });
          return;
        }

        window.STORE.saveNote({ title, content, subjectId });
        window.STORE.addPoints(5);
        window.showToast(isAr ? 'تم حفظ الملاحظة بنجاح!' : 'Note saved successfully!', { type: 'success', points: 5 });
        NotesPage.render(container, queryParams);
      });
    }

    container.querySelectorAll('.btn-delete-note').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        window.STORE.deleteNote(id);
        window.showToast(isAr ? 'تم حذف الملاحظة.' : 'Note deleted.', { type: 'info' });
        NotesPage.render(container, queryParams);
      });
    });

    container.querySelectorAll('.note-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const sel = btn.getAttribute('data-subject');
        const q = new URLSearchParams();
        if (sel !== 'all') q.set('subject', sel);
        NotesPage.render(container, q);
      });
    });
  }
};

window.NotesPage = NotesPage;
