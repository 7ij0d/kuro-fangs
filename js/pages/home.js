/**
 * KURO FANGS — HOME DASHBOARD (SUBJECTS-FIRST ARCHITECTURE)
 * The 12 Dental Curriculum Subjects front and center, opening the floating modal
 */

const HomePage = {
  currentFilter: 'all',
  searchQuery: '',

  render(container) {
    const subjects = window.DATA.getSubjects();

    container.innerHTML = `
      <!-- Hero Title Bar & Filter Tabs -->
      <div class="subjects-hero-bar">
        <div class="hero-text-wrap">
          <h1>المواد الدراسية — السنة الثالثة</h1>
          <p>اختر أي مادة لاستعراض الشيتات، التسجيلات، أسئلة السنوات السابقة، والـ AI مباشرة في نافذة تفاعلية</p>
        </div>

        <div class="hero-filter-tabs">
          <button class="filter-tab-btn ${HomePage.currentFilter === 'all' ? 'active' : ''}" data-filter="all">
            جميع المواد (12)
          </button>
          <button class="filter-tab-btn ${HomePage.currentFilter === 'sem1' ? 'active' : ''}" data-filter="sem1">
            الفصل الأول
          </button>
          <button class="filter-tab-btn ${HomePage.currentFilter === 'sem2' ? 'active' : ''}" data-filter="sem2">
            الفصل الثاني
          </button>
        </div>
      </div>

      <!-- The 12 Subjects Showcase Grid -->
      <div class="subjects-showcase-grid" id="subjects-container"></div>
    `;

    HomePage.renderSubjectsList(subjects);
    HomePage.setupFilterListeners();
  },

  renderSubjectsList(allSubjects) {
    const grid = document.getElementById('subjects-container');
    if (!grid) return;

    let filtered = allSubjects;
    if (HomePage.searchQuery) {
      const q = HomePage.searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.name_ar.toLowerCase().includes(q) || 
        s.name_en.toLowerCase().includes(q) || 
        s.code.toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; background: #FFFFFF; border: 1px solid var(--border-subtle); border-radius: var(--radius-card); padding: 50px; text-align: center;">
          <div style="font-size: 2.5rem; margin-bottom: 10px;">🔍</div>
          <h3 style="font-size: 1.1rem; color: var(--text-primary); margin-bottom: 6px;">لا توجد مواد مطابقة للبحث</h3>
          <p style="color: var(--text-secondary); font-size: 0.85rem;">جرّب كتابة اسم مادة آخر أو إعادة ضبط الفلتر.</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(subj => `
      <div class="subject-card" onclick="window.SubjectModal.open('${subj.id}');" role="button" tabindex="0" aria-label="فتح مادة ${subj.name_ar}">
        <div>
          <div class="subject-card-header">
            <div class="subject-icon-wrap">
              ${subj.icon || '🦷'}
            </div>
            <span class="subject-code-badge">${subj.code || 'DENT-300'}</span>
          </div>

          <h3 class="subject-title-ar">${subj.name_ar}</h3>
          <div class="subject-title-en">${subj.name_en}</div>
          <p class="subject-description">${subj.description_ar}</p>
        </div>

        <div class="subject-card-footer">
          <div class="subject-pill-tag">
            <i data-lucide="layers" style="width: 15px; height: 15px; color: var(--brand-burgundy);"></i>
            <span>8 أقسام محتوى</span>
          </div>
          <div class="subject-cta-btn">
            <span>استعراض المادة</span>
            <i data-lucide="arrow-left" style="width: 15px; height: 15px;"></i>
          </div>
        </div>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  },

  setupFilterListeners() {
    document.querySelectorAll('.filter-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        HomePage.currentFilter = btn.getAttribute('data-filter');
        HomePage.renderSubjectsList(window.DATA.getSubjects());
      });
    });

    // Wire search input in top header
    const searchInput = document.getElementById('header-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        HomePage.searchQuery = e.target.value.trim();
        HomePage.renderSubjectsList(window.DATA.getSubjects());
      });
    }
  }
};

window.HomePage = HomePage;
