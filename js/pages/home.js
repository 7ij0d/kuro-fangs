/**
 * KURO FANGS — HOME DASHBOARD (SUBJECTS-FIRST WITH 120px COVER BANNERS)
 * Modern cards with tailored dental photography covers & no old circular icons
 */

const HomePage = {
  currentFilter: 'all',
  searchQuery: '',

  render(container) {
    const t = (k) => window.I18N.t(k);
    const subjects = window.DATA.getSubjects();

    container.innerHTML = `
      <!-- Hero Title Bar & Filter Tabs -->
      <div class="subjects-hero-bar">
        <div class="hero-text-wrap">
          <h1 id="hero-title">${t('heroTitle')}</h1>
          <p id="hero-subtitle">${t('heroSubtitle')}</p>
        </div>

        <div class="hero-filter-tabs">
          <button class="filter-tab-btn ${HomePage.currentFilter === 'all' ? 'active' : ''}" data-filter="all">
            ${t('filterAll')}
          </button>
          <button class="filter-tab-btn ${HomePage.currentFilter === 'sem1' ? 'active' : ''}" data-filter="sem1">
            ${t('filterSem1')}
          </button>
          <button class="filter-tab-btn ${HomePage.currentFilter === 'sem2' ? 'active' : ''}" data-filter="sem2">
            ${t('filterSem2')}
          </button>
        </div>
      </div>

      <!-- The 12 Subjects Showcase Grid -->
      <div class="subjects-showcase-grid" id="subjects-container"></div>
    `;

    HomePage.renderSubjectsList(subjects);
    HomePage.setupListeners();
  },

  renderSubjectsList(allSubjects) {
    const grid = document.getElementById('subjects-container');
    if (!grid) return;

    const isAr = window.I18N.getLang() === 'ar';
    const t = (k) => window.I18N.t(k);
    const arrowIcon = isAr ? 'arrow-left' : 'arrow-right';

    let filtered = allSubjects;

    // Filter by semester
    if (HomePage.currentFilter === 'sem1') {
      filtered = allSubjects.slice(0, 6);
    } else if (HomePage.currentFilter === 'sem2') {
      filtered = allSubjects.slice(6, 12);
    }

    // Search filtering
    if (HomePage.searchQuery) {
      const q = HomePage.searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        (s.name_ar && s.name_ar.toLowerCase().includes(q)) || 
        (s.name_en && s.name_en.toLowerCase().includes(q)) || 
        (s.code && s.code.toLowerCase().includes(q))
      );
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; background: var(--bg-card); border: 1px solid var(--border-subtle); border-radius: var(--radius-card); padding: 50px; text-align: center;">
          <div style="font-size: 2.5rem; margin-bottom: 10px;">🔍</div>
          <h3 style="font-size: 1.1rem; color: var(--text-primary); margin-bottom: 6px;">${t('searchEmptyTitle')}</h3>
          <p style="color: var(--text-secondary); font-size: 0.85rem;">${t('searchEmptySub')}</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(subj => {
      const primaryTitle = isAr ? subj.name_ar : subj.name_en;
      const subTitle = isAr ? subj.name_en : subj.name_ar;
      const desc = isAr ? (subj.description_ar || '') : (subj.description_en || subj.description_ar || '');
      const coverImg = subj.cover_image || 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=600&auto=format&fit=crop&q=80';

      return `
        <div class="subject-card" onclick="window.SubjectModal.open('${subj.id}');" role="button" tabindex="0" aria-label="${primaryTitle}">
          <!-- 120px Subject Cover Banner with Smooth Gradient Overlay -->
          <div class="subject-cover-wrap">
            <img src="${coverImg}" alt="${primaryTitle}" class="subject-cover-img" loading="lazy" />
            <div class="subject-cover-gradient"></div>
            <span class="subject-code-badge">${subj.code || 'DENT-300'}</span>
          </div>

          <!-- Subject Content Details -->
          <div class="subject-card-body">
            <div>
              <h3 class="subject-title-primary">${primaryTitle}</h3>
              <div class="subject-title-sub">${subTitle}</div>
              <p class="subject-description">${desc}</p>
            </div>

            <div class="subject-card-footer">
              <div class="subject-pill-tag">
                <i data-lucide="layers" style="width: 15px; height: 15px; color: var(--brand-burgundy);"></i>
                <span>${t('contentHubsCount')}</span>
              </div>
              <div class="subject-cta-btn">
                <span>${t('subjectExplore')}</span>
                <i data-lucide="${arrowIcon}" style="width: 15px; height: 15px;"></i>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  },

  setupListeners() {
    document.querySelectorAll('.filter-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        HomePage.currentFilter = btn.getAttribute('data-filter');
        HomePage.renderSubjectsList(window.DATA.getSubjects());
      });
    });

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
