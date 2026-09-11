/**
 * KURO FANGS — HOME DASHBOARD (ACADEMIA DESIGN SYSTEM)
 * 12 Subjects with Cover Headers, Study Progress Bars, Doctor Badges & Micro-Interactions
 */

const HomePage = {
  currentFilter: 'all',
  searchQuery: '',
  loadingTimeout: null,

  render(container) {
    const t = (k) => window.I18N.t(k);
    const subjects = window.DATA.getSubjects();

    container.innerHTML = `
      <!-- Hero Title Bar & Quick Tabs Bar -->
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
          <button class="filter-tab-btn ${HomePage.currentFilter === 'popular' ? 'active' : ''}" data-filter="popular">
            🔥 ${t('filterPopular')}
          </button>
        </div>
      </div>

      <!-- The 12 Subjects Showcase Grid -->
      <div class="subjects-showcase-grid" id="subjects-container"></div>
    `;

    HomePage.renderSubjectsList(subjects, false);
    HomePage.setupListeners();
  },

  renderSkeletons() {
    const grid = document.getElementById('subjects-container');
    if (!grid) return;

    grid.innerHTML = Array(6).fill(0).map(() => `
      <div class="skeleton-card">
        <div class="skeleton-banner skeleton-shimmer"></div>
        <div class="skeleton-body">
          <div class="skeleton-line title skeleton-shimmer"></div>
          <div class="skeleton-line sub skeleton-shimmer"></div>
          <div class="skeleton-line badge skeleton-shimmer"></div>
          <div class="skeleton-line progress skeleton-shimmer"></div>
          <div class="skeleton-line stats skeleton-shimmer"></div>
          <div class="skeleton-line btn skeleton-shimmer"></div>
        </div>
      </div>
    `).join('');
  },

  renderSubjectsList(allSubjects, withSkeleton = false) {
    const grid = document.getElementById('subjects-container');
    if (!grid) return;

    if (withSkeleton) {
      HomePage.renderSkeletons();
      if (HomePage.loadingTimeout) clearTimeout(HomePage.loadingTimeout);
      HomePage.loadingTimeout = setTimeout(() => {
        HomePage.buildCardsHTML(allSubjects);
      }, 160);
    } else {
      HomePage.buildCardsHTML(allSubjects);
    }
  },

  buildCardsHTML(allSubjects) {
    const grid = document.getElementById('subjects-container');
    if (!grid) return;

    const isAr = window.I18N.getLang() === 'ar';
    const t = (k) => window.I18N.t(k);

    let filtered = [...allSubjects];

    // Filter logic
    if (HomePage.currentFilter === 'sem1') {
      filtered = allSubjects.slice(0, 6);
    } else if (HomePage.currentFilter === 'sem2') {
      filtered = allSubjects.slice(6, 12);
    } else if (HomePage.currentFilter === 'popular') {
      filtered = allSubjects.filter(s => s.is_popular);
      // If popular list is small, sort by highest progress
      if (filtered.length < 4) {
        filtered = [...allSubjects].sort((a, b) => (b.progress || 0) - (a.progress || 0)).slice(0, 6);
      }
    }

    // Search filtering
    if (HomePage.searchQuery) {
      const q = HomePage.searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        (s.name_ar && s.name_ar.toLowerCase().includes(q)) || 
        (s.name_en && s.name_en.toLowerCase().includes(q)) || 
        (s.code && s.code.toLowerCase().includes(q)) ||
        (s.doctor_name_ar && s.doctor_name_ar.toLowerCase().includes(q)) ||
        (s.doctor_name_en && s.doctor_name_en.toLowerCase().includes(q))
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
      const doctorName = isAr ? (subj.doctor_name_ar || 'هيئة التدريس') : (subj.doctor_name_en || 'Faculty Board');
      const coverImg = subj.cover_image || window.DATA?.subjectCovers?.[subj.id] || `assets/covers/${subj.id}.jpg`;
      const progressVal = subj.progress || 75;
      const lecturesCount = subj.lectures_count || subj.sheet_count || 14;
      const summariesCount = subj.summaries_count || 4;
      const examsCount = subj.exams_count || 2;

      return `
        <div class="subject-card" onclick="window.SubjectModal.open('${subj.id}');" role="button" tabindex="0" aria-label="${primaryTitle}">
          <!-- 135px Subject Cover Header -->
          <div class="subject-cover-wrap">
            <img src="${coverImg}" alt="${primaryTitle}" class="subject-cover-img" loading="eager" onerror="this.onerror=null; this.src='assets/covers/gen-med.jpg';" />
            <div class="subject-cover-gradient"></div>
            <span class="subject-code-badge">${subj.code || 'DENT-300'}</span>
            ${subj.is_popular ? `<span class="subject-popular-tag">🔥 ${isAr ? 'شائع' : 'Popular'}</span>` : ''}
          </div>

          <!-- Subject Content Details -->
          <div class="subject-card-body">
            <div>
              <h3 class="subject-title-primary">${primaryTitle}</h3>
              <div class="subject-title-sub">${subTitle}</div>

              <!-- Doctor Badge with Icon -->
              <div class="card-doctor-badge" title="${isAr ? 'أستاذ المادة' : 'Subject Faculty Head'}">
                <i data-lucide="user-check"></i>
                <span>${doctorName}</span>
              </div>

              <!-- Study Progress Bar -->
              <div class="card-progress-wrap">
                <div class="card-progress-meta">
                  <span>${t('studyProgress')}</span>
                  <span class="card-progress-percent">${progressVal}% ${t('completed')}</span>
                </div>
                <div class="card-progress-track">
                  <div class="card-progress-fill" style="width: ${progressVal}%;"></div>
                </div>
              </div>

              <!-- Content Breakdown Badges -->
              <div class="card-stats-badges">
                <span class="card-stat-pill">
                  <i data-lucide="file-text" style="width: 13px; height: 13px;"></i>
                  ${lecturesCount} ${t('lectures')}
                </span>
                <span class="card-stat-pill">
                  <i data-lucide="book-marked" style="width: 13px; height: 13px;"></i>
                  ${summariesCount} ${t('summaries')}
                </span>
                <span class="card-stat-pill">
                  <i data-lucide="archive" style="width: 13px; height: 13px;"></i>
                  ${examsCount} ${t('exams')}
                </span>
              </div>
            </div>

            <!-- Quick Action Button ("تصفح المحتوى ⬅️") -->
            <button class="btn-explore-subject" onclick="event.stopPropagation(); window.SubjectModal.open('${subj.id}');" aria-label="${t('browseContent')}">
              <span>${t('browseContent')}</span>
            </button>
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
        HomePage.renderSubjectsList(window.DATA.getSubjects(), true);
      });
    });

    const searchInput = document.getElementById('header-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        HomePage.searchQuery = e.target.value.trim();
        HomePage.renderSubjectsList(window.DATA.getSubjects(), false);
      });
    }
  }
};

window.HomePage = HomePage;
