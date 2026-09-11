/**
 * KURO FANGS — QUESTION BANK PAGE
 * Direct Destination with Pre-filtering Support & Bilingual Display
 */

const QuestionsPage = {
  render(container, queryParams) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
    const subjects = window.DATA ? window.DATA.getSubjects() : [];
    const targetSubject = queryParams?.get('subject') || 'all';
    let filterSubject = targetSubject;

    const questions = window.DATA?.questions || [];

    const renderList = () => {
      const filtered = filterSubject === 'all'
        ? questions
        : questions.filter(q => q.subject_id === filterSubject);

      const listEl = document.getElementById('questions-list');
      if (!listEl) return;

      if (filtered.length === 0) {
        listEl.innerHTML = window.renderEmptyState
          ? window.renderEmptyState()
          : `
            <div class="empty-state-card">
              <div class="empty-state-icon-wrap">
                <i data-lucide="folder-open"></i>
              </div>
              <h3 class="empty-state-title">${isAr ? 'لا توجد محتويات مضافة حالياً' : 'No contents available yet'}</h3>
              <p class="empty-state-subtitle">${isAr ? 'جاري رفع واستكمال الملازم والمحتوى الأكاديمي قريباً' : 'Handouts and academic curriculum materials will be uploaded soon.'}</p>
            </div>
          `;
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      listEl.innerHTML = filtered.map(q => `
        <div class="card" style="padding: 20px; margin-bottom: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <span class="badge badge-primary">${isAr ? q.subject_name_ar : q.subject_name_en}</span>
            <div style="display: flex; gap: 4px;">
              ${q.tags.map(t => `<span class="badge badge-gray">#${t}</span>`).join('')}
            </div>
          </div>
          <h3 style="font-size: 1rem; color: var(--text-primary); margin-bottom: 12px; line-height: 1.5;">${isAr ? q.text_ar : q.text_en}</h3>
          
          <div style="border-top: 1px solid var(--border-subtle); padding-top: 12px; margin-top: 12px;">
            <button class="btn btn-soft toggle-answer-btn" data-id="${q.id}" style="font-size: 0.775rem; padding: 5px 12px; display: inline-flex; align-items: center; gap: 6px;">
              <i data-lucide="eye" style="width: 14px; height: 14px;"></i>
              ${isAr ? 'إظهار الإجابة النموذجية' : 'Show Model Answer'}
            </button>
            <div id="ans-${q.id}" style="display: none; margin-top: 12px; padding: 14px 16px; border-radius: var(--radius-sm); background: rgba(139, 21, 56, 0.04); border-left: 3px solid var(--brand-primary); font-size: 0.875rem; color: var(--text-primary); line-height: 1.6;">
              <strong style="color: var(--brand-primary);">${isAr ? 'الإجابة النموذجية: ' : 'Model Answer: '}</strong>
              ${isAr ? q.answer_ar : q.answer_en}
            </div>
          </div>
        </div>
      `).join('');

      if (window.lucide) window.lucide.createIcons();

      container.querySelectorAll('.toggle-answer-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-id');
          const ansEl = document.getElementById(`ans-${id}`);
          if (ansEl) {
            const isHidden = ansEl.style.display === 'none';
            ansEl.style.display = isHidden ? 'block' : 'none';
            btn.innerHTML = isHidden 
              ? `<i data-lucide="eye-off" style="width: 14px; height: 14px;"></i> ${isAr ? 'إخفاء الإجابة' : 'Hide Answer'}`
              : `<i data-lucide="eye" style="width: 14px; height: 14px;"></i> ${isAr ? 'إظهار الإجابة النموذجية' : 'Show Model Answer'}`;
            if (window.lucide) window.lucide.createIcons();
          }
        });
      });
    };

    container.innerHTML = `
      <div class="page-title-bar">
        <div class="page-title-group">
          <h1>
            <i data-lucide="help-circle" style="color: var(--brand-primary); width: 26px; height: 26px;"></i>
            ${isAr ? 'بنك الأسئلة التفاعلي' : 'Interactive Question Bank'}
          </h1>
          <p>${isAr ? 'أسئلة امتحانية مقالية واختيارية مع شروحاتها وحلولها النموذجية المعتمدة' : 'High-yield essay & MCQ question bank with verified faculty answers'}</p>
        </div>
      </div>

      <!-- Filters -->
      <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px; margin-bottom: 16px; scrollbar-width: thin;">
        <button class="btn ${filterSubject === 'all' ? 'btn-primary' : 'btn-secondary'} q-filter" data-id="all" style="font-size: 0.8rem; padding: 6px 14px; white-space: nowrap;">
          ${isAr ? 'جميع المواد (12)' : 'All Subjects (12)'}
        </button>
        ${subjects.map(s => `
          <button class="btn ${filterSubject === s.id ? 'btn-primary' : 'btn-secondary'} q-filter" data-id="${s.id}" style="font-size: 0.8rem; padding: 6px 14px; white-space: nowrap;">
            ${isAr ? s.name_ar : s.name_en}
          </button>
        `).join('')}
      </div>

      <div id="questions-list"></div>
    `;

    renderList();

    container.querySelectorAll('.q-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        filterSubject = btn.getAttribute('data-id');
        container.querySelectorAll('.q-filter').forEach(b => {
          b.className = b.getAttribute('data-id') === filterSubject ? 'btn btn-primary q-filter' : 'btn btn-secondary q-filter';
        });
        renderList();
      });
    });
  }
};

window.QuestionsPage = QuestionsPage;
