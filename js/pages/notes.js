/**
 * KURO FANGS — STUDENT NOTES PAGE
 */

const NotesPage = {
  render(container) {
    const subjects = window.DATA.getSubjects();
    const notes = window.STORE.getNotes();

    container.innerHTML = `
      <div class="page-title-bar">
        <div class="page-title-group">
          <h1>
            <i data-lucide="edit-3" style="color: var(--brand-primary); width: 26px; height: 26px;"></i>
            ملاحظاتي الدراسية والسريرية
          </h1>
          <p>دون ملاحظاتك الخاصة وتفاصيل الحالات السريرية وتنبيهات الدكاترة</p>
        </div>
        <button id="btn-add-note" class="btn btn-primary">
          <i data-lucide="plus" style="width: 16px; height: 16px;"></i>
          إضافة ملاحظة جديدة
        </button>
      </div>

      <!-- New Note Form (Hidden by default) -->
      <div id="new-note-box" class="card" style="display: none; padding: 20px; margin-bottom: 24px; border-right: 4px solid var(--brand-primary);">
        <h3 style="font-size: 1.05rem; margin-bottom: 14px;">ملاحظة دراسية جديدة</h3>
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <input type="text" id="note-title-input" placeholder="عنوان الملاحظة (مثلاً: نصائح د. خالد في علاج العصب)..." style="padding: 10px;" />
          <select id="note-subject-select" style="padding: 10px;">
            ${subjects.map(s => `<option value="${s.id}">${s.name_ar}</option>`).join('')}
          </select>
          <textarea id="note-content-input" rows="4" placeholder="اكتب الملاحظات والتفاصيل السريرية هنا..." style="padding: 10px;"></textarea>
          <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button id="btn-cancel-note" class="btn btn-secondary">إلغاء</button>
            <button id="btn-save-note" class="btn btn-primary">حفظ الملاحظة (+5 نقاط)</button>
          </div>
        </div>
      </div>

      <!-- Notes Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 18px;">
        ${notes.length === 0 ? `
          <div class="card" style="grid-column: 1 / -1; padding: 40px; text-align: center; color: var(--text-muted);">
            لا توجد لديك ملاحظات حالياً. انقر على "إضافة ملاحظة جديدة" لتدوين أول ملاحظة.
          </div>
        ` : notes.map(n => `
          <div class="card" style="padding: 20px; display: flex; flex-direction: column; justify-content: space-between;">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <span class="badge badge-primary">${subjects.find(s => s.id === n.subjectId)?.name_ar || 'طب الأسنان'}</span>
                <button class="btn-delete-note" data-id="${n.id}" style="color: var(--text-muted); cursor: pointer;" title="حذف">
                  <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
                </button>
              </div>
              <h3 style="font-size: 1rem; color: var(--text-primary); margin-bottom: 8px;">${n.title}</h3>
              <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; white-space: pre-line;">${n.content}</p>
            </div>
            <div style="margin-top: 16px; pt-12; border-top: 1px solid var(--border-subtle); font-size: 0.75rem; color: var(--text-muted);">
              ${n.date || '2026-09-08'}
            </div>
          </div>
        `).join('')}
      </div>
    `;

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
          window.showToast(window.I18N && window.I18N.getLang() === 'ar' ? 'يرجى كتابة عنوان ونص الملاحظة.' : 'Please enter title and content for the note.', { type: 'warning' });
          return;
        }

        window.STORE.saveNote({ title, content, subjectId });
        window.showToast(window.I18N && window.I18N.getLang() === 'ar' ? 'تم حفظ الملاحظة بنجاح!' : 'Note saved successfully!', { type: 'success' });
        NotesPage.render(container);
      });
    }

    container.querySelectorAll('.btn-delete-note').forEach(btn => {
      btn.addEventListener('click', () => {
        if (confirm('هل أنت متأكد من حذف هذه الملاحظة؟')) {
          const id = btn.getAttribute('data-id');
          window.STORE.deleteNote(id);
          NotesPage.render(container);
        }
      });
    });
  }
};

window.NotesPage = NotesPage;
