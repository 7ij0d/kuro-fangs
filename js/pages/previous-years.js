/**
 * KURO FANGS — PREVIOUS YEARS EXAMS ARCHIVE
 * Direct Destination with Pre-filtering Support & Bilingual Display
 */

const PreviousYearsPage = {
  render(container, queryParams) {
    const isAr = window.I18N ? window.I18N.getLang() === 'ar' : false;
    const subjects = window.DATA ? window.DATA.getSubjects() : [];
    const targetSubject = queryParams?.get('subject') || 'all';
    let currentFilter = targetSubject;

    const baseExams = window.DATA?.previousExams || [];

    const renderList = () => {
      const filtered = currentFilter === 'all'
        ? baseExams
        : baseExams.filter(e => e.subject_id === currentFilter);

      const listContainer = document.getElementById('exams-list-container');
      if (!listContainer) return;

      if (filtered.length === 0) {
        listContainer.innerHTML = window.renderEmptyState
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

      listContainer.innerHTML = filtered.map(e => {
        const typeLabel = e.type === 'final' 
          ? (isAr ? 'نهائي' : 'Final') 
          : (isAr ? 'نصفي' : 'Midterm');
        const badgeClass = e.type === 'final' ? 'badge-danger' : 'badge-warning';

        return `
          <div class="recent-list-row" style="grid-template-columns: 44px 90px 1fr 120px 110px 120px;">
            <div class="recent-col-icon" style="background: rgba(139, 21, 56, 0.08); color: var(--brand-burgundy);">
              <i data-lucide="file-check-2"></i>
            </div>
            <div class="recent-col-type">
              <span class="badge ${badgeClass}">${typeLabel}</span>
            </div>
            <div class="recent-col-title" title="${isAr ? e.title_ar : e.title_en}">
              <div style="font-weight: 600; color: var(--text-primary); font-size: 0.95rem;">${isAr ? e.title_ar : e.title_en}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: normal; margin-top: 2px;">
                ${isAr ? e.subject_ar : e.subject_en}
              </div>
            </div>
            <div class="recent-col-doctor">
              ${e.year}
            </div>
            <div class="recent-col-date">
              ${e.questions_count} ${isAr ? 'سؤال' : 'questions'}
            </div>
            <div>
              <button class="btn btn-soft download-exam-btn" data-title="${encodeURIComponent(isAr ? e.title_ar : e.title_en)}" style="font-size: 0.775rem; padding: 5px 12px; display: inline-flex; align-items: center; gap: 6px;">
                <i data-lucide="download" style="width: 14px; height: 14px;"></i>
                ${isAr ? 'تحميل PDF' : 'Download PDF'}
              </button>
            </div>
          </div>
        `;
      }).join('');

      if (window.lucide) window.lucide.createIcons();

      listContainer.querySelectorAll('.download-exam-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const title = decodeURIComponent(btn.getAttribute('data-title') || '');
          window.STORE.addPoints(10);
          const msg = isAr ? `تم بدء تحميل: ${title}` : `Download started: ${title}`;
          window.showToast(msg, { type: 'success', points: 10 });
        });
      });
    };

    container.innerHTML = `
      <div class="page-title-bar">
        <div class="page-title-group">
          <h1>
            <i data-lucide="archive" style="color: var(--brand-primary); width: 26px; height: 26px;"></i>
            ${isAr ? 'أرشيف امتحانات السنوات السابقة' : 'Past Exams & Answer Keys'}
          </h1>
          <p>${isAr ? 'نماذج الامتحانات النصفية والنهائية السابقة للسنوات الماضية مع الحلول المعتمدة' : 'Official midterm and final exam papers with verified model answer keys'}</p>
        </div>
      </div>

      <!-- Filters -->
      <div style="display: flex; gap: 8px; overflow-x: auto; padding-bottom: 12px; margin-bottom: 16px; scrollbar-width: thin;">
        <button class="btn ${currentFilter === 'all' ? 'btn-primary' : 'btn-secondary'} exam-filter-btn" data-subject="all" style="font-size: 0.8rem; padding: 6px 14px; white-space: nowrap;">
          ${isAr ? 'جميع المواد (12)' : 'All Subjects (12)'}
        </button>
        ${subjects.map(s => `
          <button class="btn ${currentFilter === s.id ? 'btn-primary' : 'btn-secondary'} exam-filter-btn" data-subject="${s.id}" style="font-size: 0.8rem; padding: 6px 14px; white-space: nowrap;">
            ${isAr ? s.name_ar : s.name_en}
          </button>
        `).join('')}
      </div>

      <div class="recent-list-view" id="exams-list-container"></div>
    `;

    renderList();

    container.querySelectorAll('.exam-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        currentFilter = btn.getAttribute('data-subject');
        container.querySelectorAll('.exam-filter-btn').forEach(b => {
          b.className = b.getAttribute('data-subject') === currentFilter ? 'btn btn-primary exam-filter-btn' : 'btn btn-secondary exam-filter-btn';
        });
        renderList();
      });
    });
  }
};

window.PreviousYearsPage = PreviousYearsPage;
