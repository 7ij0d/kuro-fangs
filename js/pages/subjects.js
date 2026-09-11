/**
 * KURO FANGS — SUBJECTS PAGE (LOCK-IN DARK LUXURY)
 * Lists all 12 Dental Curriculum Subjects
 */

const SubjectsPage = {
  render(container) {
    const subjects = window.DATA.getSubjects();

    container.innerHTML = `
      <div class="page-title-bar">
        <div class="page-title-group">
          <h1>
            <i data-lucide="book-open" style="color: var(--brand-gold); width: 26px; height: 26px;"></i>
            المواد الدراسية (12 مادة)
          </h1>
          <p>مقررات السنة الثالثة لكلية طب وجراحة الفم والأسنان مع الشيتات والملخصات وبنوك الأسئلة</p>
        </div>
        <div>
          <span class="badge badge-due" style="font-size: 0.8rem; padding: 5px 12px;">
            12 مادة معتمدة
          </span>
        </div>
      </div>

      <!-- Subjects Grid (3 Columns) -->
      <div class="subjects-grid">
        ${subjects.map(subj => `
          <a href="#/subject/${subj.id}" class="subject-card">
            <div>
              <div class="subject-card-top">
                <div class="subject-icon-box" style="color: var(--brand-gold);">
                  ${subj.icon || '🦷'}
                </div>
                <span class="subject-code-pill">${subj.code || 'DENT-300'}</span>
              </div>
              <h3 class="subject-name-ar">${subj.name_ar}</h3>
              <div class="subject-name-en">${subj.name_en}</div>
              <p class="subject-description">${subj.description_ar}</p>
            </div>
            
            <div class="subject-footer-meta">
              <div style="display: flex; align-items: center; gap: 6px; color: var(--text-secondary); font-size: 0.8rem;">
                <i data-lucide="file-text" style="width: 14px; height: 14px; color: var(--brand-gold);"></i>
                <span>${subj.sheet_count || 18} شيت ومحاضرة</span>
              </div>
              <div style="display: flex; align-items: center; gap: 4px;">
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
