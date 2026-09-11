/**
 * KURO FANGS — PREVIOUS YEARS EXAMS ARCHIVE
 */

const PreviousYearsPage = {
  render(container) {
    const subjects = window.DATA.getSubjects();
    const exams = [
      { id: 'pe-1', title: 'امتحان جراحة الفم والفكين 1 — الدور الأول 2025', subject: 'جراحة الفم والفكين', type: 'نصفي', year: '2024-2025', questions_count: 50 },
      { id: 'pe-2', title: 'امتحان الاستعاضة السنية الثابتة 2 — الدور النهائي 2025', subject: 'التركيبات الثابتة', type: 'نهائي', year: '2024-2025', questions_count: 70 },
      { id: 'pe-3', title: 'امتحان علاج العصب 1 — الدور الأول 2024', subject: 'علاج العصب', type: 'نصفي', year: '2023-2024', questions_count: 45 },
      { id: 'pe-4', title: 'امتحان علم أمراض الفم — الدور النهائي 2024', subject: 'علم أمراض الفم', type: 'نهائي', year: '2023-2024', questions_count: 60 },
      { id: 'pe-5', title: 'امتحان الطب العام الباطني — الدور الأول 2024', subject: 'الطب العام', type: 'نصفي', year: '2023-2024', questions_count: 50 }
    ];

    container.innerHTML = `
      <div class="page-title-bar">
        <div class="page-title-group">
          <h1>
            <i data-lucide="archive" style="color: var(--brand-primary); width: 26px; height: 26px;"></i>
            أرشيف امتحانات السنوات السابقة
          </h1>
          <p>نماذج الامتحانات النصفية والنهائية السابقة للسنوات الماضية مع الحلول المعتمدة</p>
        </div>
      </div>

      <div class="recent-list-view">
        ${exams.map(e => `
          <div class="recent-list-row" style="grid-template-columns: 44px 100px 1fr 120px 100px 120px;">
            <div class="recent-col-icon" style="background: #FEF3C7; color: #D97706;">
              <i data-lucide="file-check-2"></i>
            </div>
            <div class="recent-col-type">
              <span class="badge ${e.type === 'نهائي' ? 'badge-danger' : 'badge-warning'}">${e.type}</span>
            </div>
            <div class="recent-col-title">
              ${e.title}
              <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: normal;">${e.subject}</div>
            </div>
            <div class="recent-col-doctor">
              ${e.year}
            </div>
            <div class="recent-col-date">
              ${e.questions_count} سؤال
            </div>
            <div>
              <button class="btn btn-soft" style="font-size: 0.775rem; padding: 4px 10px;" onclick="alert('تم فتح نموذج امتحان ${e.title} بنجاح!');">
                <i data-lucide="download" style="width: 14px; height: 14px;"></i>
                تحميل PDF
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
};

window.PreviousYearsPage = PreviousYearsPage;
