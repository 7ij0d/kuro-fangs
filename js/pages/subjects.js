/**
 * KURO FANGS — SUBJECTS PAGE
 * Lists all 12 Dental Curriculum Subjects
 */

const SubjectsPage = {
  render(container) {
    const subjects = window.DATA.getSubjects();

    container.innerHTML = `
      <div class="page-title-bar">
        <div class="page-title-group">
          <h1>
            <i data-lucide="book-open" style="color: var(--brand-primary); width: 26px; height: 26px;"></i>
            المواد الدراسية (السنة الثالثة)
          </h1>
          <p>جميع المقررات الأكاديمية والسريرية المعتمدة لكلية طب وجراحة الفم والأسنان</p>
        </div>
        <div>
          <span class="badge badge-primary" style="font-size: 0.85rem; padding: 6px 14px;">
            12 مادة مسجلة
          </span>
        </div>
      </div>

      <!-- Subjects Grid (3 Columns) -->
      <div class="subjects-grid">
        ${subjects.map(subj => `
          <a href="#/subject/${subj.id}" class="subject-card">
            <div>
              <div class="subject-card-top">
                <div class="subject-badge-icon" style="background: ${subj.color}15; color: ${subj.color};">
                  ${subj.icon || '🦷'}
                </div>
                <span class="subject-code-tag">${subj.code || 'DENT-300'}</span>
              </div>
              <h3 class="subject-title-ar">${subj.name_ar}</h3>
              <div class="subject-title-en">${subj.name_en}</div>
              <p class="subject-desc">${subj.description_ar}</p>
            </div>
            
            <div class="subject-card-footer">
              <div class="subject-sheets-count">
                <i data-lucide="file-text" style="width: 15px; height: 15px; color: var(--brand-primary);"></i>
                <span>${subj.sheet_count || 18} محاضرة وشيت</span>
              </div>
              <div style="color: var(--brand-primary); display: flex; align-items: center; gap: 4px; font-weight: 600;">
                <span>فتح المادة</span>
                <i data-lucide="arrow-left" style="width: 14px; height: 14px;"></i>
              </div>
            </div>
          </a>
        `).join('')}
      </div>
    `;
  }
};

window.SubjectsPage = SubjectsPage;
