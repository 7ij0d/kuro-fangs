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

    const baseExams = [
      { id: 'pe-1', subject_id: 'omfs', title_ar: 'امتحان جراحة الفم والفكين 1 — الدور الأول 2025', title_en: 'Oral Surgery I — Midterm Exam 2025', subject_ar: 'جراحة الفم والفكين', subject_en: 'Oral Surgery', type: 'midterm', year: '2024-2025', questions_count: 50 },
      { id: 'pe-2', subject_id: 'fixed-pros', title_ar: 'امتحان الاستعاضة السنية الثابتة 2 — الدور النهائي 2025', title_en: 'Fixed Prosthodontics II — Final Exam 2025', subject_ar: 'التركيبات الثابتة', subject_en: 'Fixed Pros', type: 'final', year: '2024-2025', questions_count: 70 },
      { id: 'pe-3', subject_id: 'endo', title_ar: 'امتحان علاج العصب 1 — الدور الأول 2024', title_en: 'Endodontics I — First Round 2024', subject_ar: 'علاج العصب', subject_en: 'Endodontics', type: 'midterm', year: '2023-2024', questions_count: 45 },
      { id: 'pe-4', subject_id: 'oral-diseases', title_ar: 'امتحان علم أمراض الفم — الدور النهائي 2024', title_en: 'Oral Diseases / Pathology — Final Exam 2024', subject_ar: 'علم أمراض الفم', subject_en: 'Oral Pathology', type: 'final', year: '2023-2024', questions_count: 60 },
      { id: 'pe-5', subject_id: 'gen-med', title_ar: 'امتحان الطب العام الباطني — الدور الأول 2024', title_en: 'General Medicine — Midterm Exam 2024', subject_ar: 'الطب العام', subject_en: 'General Medicine', type: 'midterm', year: '2023-2024', questions_count: 50 },
      { id: 'pe-6', subject_id: 'gen-surgery', title_ar: 'امتحان الجراحة العامة — الدور النهائي 2024', title_en: 'General Surgery — Final Exam 2024', subject_ar: 'الجراحة العامة', subject_en: 'General Surgery', type: 'final', year: '2023-2024', questions_count: 55 },
      { id: 'pe-7', subject_id: 'omdr', title_ar: 'امتحان طب الفم والتشخيص والأشعة 1 — الدور الأول 2025', title_en: 'OMDR I — Midterm Exam 2025', subject_ar: 'تشخيص وأشعة الفم', subject_en: 'OMDR', type: 'midterm', year: '2024-2025', questions_count: 50 },
      { id: 'pe-8', subject_id: 'preventive', title_ar: 'امتحان طب الأسنان الوقائي — الدور النهائي 2024', title_en: 'Preventive Dentistry — Final Exam 2024', subject_ar: 'طب الأسنان الوقائي', subject_en: 'Preventive Dentistry', type: 'final', year: '2023-2024', questions_count: 40 },
      { id: 'pe-9', subject_id: 'cons-endo', title_ar: 'امتحان العلاج التحفظي 2 — الدور النهائي 2025', title_en: 'Cons & Endo II — Final Exam 2025', subject_ar: 'العلاج التحفظي', subject_en: 'Cons & Endo', type: 'final', year: '2024-2025', questions_count: 65 },
      { id: 'pe-10', subject_id: 'ortho', title_ar: 'امتحان تقويم الأسنان 1 — الدور الأول 2025', title_en: 'Orthodontics I — Midterm Exam 2025', subject_ar: 'تقويم الأسنان', subject_en: 'Orthodontics', type: 'midterm', year: '2024-2025', questions_count: 45 },
      { id: 'pe-11', subject_id: 'pediatric', title_ar: 'امتحان طب أسنان الأطفال 1 — الدور النهائي 2024', title_en: 'Pediatric Dentistry I — Final Exam 2024', subject_ar: 'طب أسنان الأطفال', subject_en: 'Pediatric Dentistry', type: 'final', year: '2023-2024', questions_count: 50 },
      { id: 'pe-12', subject_id: 'removable-pros', title_ar: 'امتحان الاستعاضة السنية المتحركة 2 — الدور النهائي 2025', title_en: 'Removable Prosthodontics II — Final Exam 2025', subject_ar: 'الاستعاضة المتحركة', subject_en: 'Removable Pros', type: 'final', year: '2024-2025', questions_count: 60 }
    ];

    const renderList = () => {
      const filtered = currentFilter === 'all'
        ? baseExams
        : baseExams.filter(e => e.subject_id === currentFilter);

      const listContainer = document.getElementById('exams-list-container');
      if (!listContainer) return;

      if (filtered.length === 0) {
        listContainer.innerHTML = `
          <div class="card" style="padding: 40px; text-align: center; color: var(--text-muted);">
            <i data-lucide="archive" style="width: 36px; height: 36px; margin-bottom: 10px; opacity: 0.5;"></i>
            <p>${isAr ? 'لا توجد نماذج امتحانات حالياً لهذه المادة.' : 'No exam archives found for this subject.'}</p>
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
